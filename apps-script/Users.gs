/**
 * SPORTING MARKETPLACE — Auth.gs
 * Autenticación, sesiones y gestión de usuarios/roles/permisos (RBAC).
 *
 * Se pega como archivo aparte del router de negocio (Apps_script_v5.js) en el
 * MISMO proyecto de Apps Script — comparten namespace global, un solo deploy.
 *
 * Depende de globals ya definidos en Apps_script_v5.js / el proyecto GAS:
 *   SPREADSHEET_ID, jsonResp(obj), errorResp(err)
 *
 * Punto de entrada: routeAuthAction(data) — llamado desde doPost() en
 * Apps_script_v5.js cuando el body trae "action" (en vez de "tipo_formulario").
 *
 * Hojas del sistema (ver project-standards/apps_script_standards.md §7.1):
 *   USUARIOS          id, nombre, email, password_hash, salt, id_rol, activo,
 *                      fecha_creacion, ultimo_acceso, creado_por, seller_id
 *   ROLES             id, nombre, descripcion, activo, es_sistema
 *   PERMISOS_MODULOS  id_rol, modulo, puede_ver, puede_editar
 *   SESIONES          session_token, id_usuario, email, id_rol, expira_en,
 *                      fecha_creacion, activa
 *
 * Etapa 1: rol de sistema Administrador (id=1), solo staff interno.
 * Etapa 3: rol de sistema Seller (id=2) — cuenta compartida por seller_id,
 * usada para loguearse en public/ (ver public/login.html + auth-seller.js).
 * La columna `seller_id` en USUARIOS queda vacía para cuentas de staff.
 * Los roles de Sistema (Admin y Seller) no usan PERMISOS_MODULOS.
 */

// ── ROUTER ────────────────────────────────────────────────────

var AUTH_PUBLIC_ACTIONS = ["login", "checkSetup"];

var AUTH_SESSION_ACTIONS = [
  "validateSession",
  "logout",
  "getPermisos",
  "changePassword",
  "getSellers",
  "getGantt",
  "getGanttDetalle",
  "getUsuariosGantt",
  "getTarifas",
  "getOverrides",
  "getRelevamientos",
  "getRelevamientoProfile",
];

var AUTH_ADMIN_ACTIONS = [
  "getUsuarios",
  "createUsuario",
  "updateUsuario",
  "getRoles",
  "createRol",
  "updateRol",
  "updatePermisos",
];

/**
 * Router de autenticación de 3 niveles (públicas / sesión propia / admin).
 * Llamado desde doPost() en Apps_script_v5.js cuando data.action está presente.
 */
function routeAuthAction(data) {
  var action = String(data.action || "");

  if (AUTH_PUBLIC_ACTIONS.indexOf(action) !== -1) {
    if (action === "login") return login(data);
    if (action === "checkSetup") return checkSetup();
  }

  var sesVal = _validateSessionToken(data.session_token);
  if (!sesVal.ok) {
    return { ok: false, error: sesVal.error, code: 401 };
  }
  data._sesId       = sesVal.id_usuario;
  data._sesEmail    = sesVal.email;
  data._sesRol      = sesVal.id_rol;
  data._sesSellerId = sesVal.seller_id || "";

  if (AUTH_ADMIN_ACTIONS.indexOf(action) !== -1 && sesVal.id_rol !== 1) {
    return { ok: false, error: "Requiere Administrador", code: 403 };
  }

  if (AUTH_SESSION_ACTIONS.indexOf(action) === -1 && AUTH_ADMIN_ACTIONS.indexOf(action) === -1) {
    return { ok: false, error: "Acción no reconocida: " + action, code: 400 };
  }

  switch (action) {
    case "validateSession": return validateSession(data);
    case "logout":           return logoutSesion(data);
    case "getPermisos":      return getPermisos();
    case "changePassword":   return changePassword(data);
    case "getUsuarios":      return getUsuarios();
    case "createUsuario":    return createUsuario(data);
    case "updateUsuario":    return updateUsuario(data);
    case "getRoles":         return getRoles();
    case "createRol":        return createRol(data);
    case "updateRol":        return updateRol(data);
    case "updatePermisos":   return updatePermisos(data);
    case "getSellers":       return getSellersAction(data);
    case "getGantt":         return getGanttAction(data);
    case "getGanttDetalle":  return getGanttDetalleAction(data);
    case "getUsuariosGantt": return getUsuariosGanttAction(data);
    case "getTarifas":       return getTarifasAction();
    case "getOverrides":     return getOverridesAction(data);
    case "getRelevamientos": return getRelevamientosAction(data);
    case "getRelevamientoProfile": return getRelevamientoProfileAction(data);
  }

  return { ok: false, error: "Acción no implementada: " + action, code: 400 };
}

// ── HASHING ───────────────────────────────────────────────────

function computeSha256Hex(str) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, str, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ("0" + (b & 0xFF).toString(16)).slice(-2); }).join("");
}

// Almacenamiento: SHA256(salt + password_hash), password_hash = SHA256(plainPassword) del frontend.
function hashPassword(salt, passwordHash) {
  return computeSha256Hex(salt + passwordHash);
}

// ── SETUP CHECK ───────────────────────────────────────────────

function checkSetup() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("USUARIOS");
  if (!sheet) return { ok: true, usuarios_configured: false };
  var data = sheet.getDataRange().getValues();
  return { ok: true, usuarios_configured: data.length > 1 && data[1][0] !== "" };
}

// ── HELPERS DE HOJA (propios de Auth.gs, sin depender de helpers externos) ──

function _authRowToObj(headers, row) {
  var obj = {};
  headers.forEach(function (h, i) { obj[h] = row[i]; });
  return obj;
}

function _authNextId(sheet) {
  var data = sheet.getDataRange().getValues();
  var max = 0;
  for (var i = 1; i < data.length; i++) {
    var n = Number(data[i][0]);
    if (!isNaN(n) && n > max) max = n;
  }
  return max + 1;
}

function _authFindRow(sheet, id) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (Number(data[i][0]) === Number(id)) return i + 1;
  }
  return null;
}

// ── PERMISOS HELPER ───────────────────────────────────────────

function getPermisosForRol(id_rol) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("PERMISOS_MODULOS");
  if (!sheet) return {};
  var data    = sheet.getDataRange().getValues();
  var headers = data[0];
  var idxRol  = headers.indexOf("id_rol");
  var idxMod  = headers.indexOf("modulo");
  var idxVer  = headers.indexOf("puede_ver");
  var idxEdt  = headers.indexOf("puede_editar");
  var permisos = {};
  for (var i = 1; i < data.length; i++) {
    if (Number(data[i][idxRol]) === Number(id_rol)) {
      permisos[String(data[i][idxMod])] = {
        ver:    data[i][idxVer] === "SI",
        editar: data[i][idxEdt] === "SI",
      };
    }
  }
  return permisos;
}

function getNombreRol(id_rol) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("ROLES");
  if (!sheet) return "Sin rol";
  var data = sheet.getDataRange().getValues();
  var h = data[0];
  var idIdx  = h.indexOf("id");
  var nomIdx = h.indexOf("nombre");
  for (var i = 1; i < data.length; i++) {
    if (Number(data[i][idIdx]) === Number(id_rol)) return String(data[i][nomIdx]);
  }
  return "Sin rol";
}

/** true si el id_rol corresponde al rol de sistema (es_sistema=SI). */
function _esRolSistema(id_rol) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("ROLES");
  if (!sheet) return Number(id_rol) === 1;
  var data = sheet.getDataRange().getValues();
  var h = data[0];
  var idIdx  = h.indexOf("id");
  var sisIdx = h.indexOf("es_sistema");
  for (var i = 1; i < data.length; i++) {
    if (Number(data[i][idIdx]) === Number(id_rol)) {
      return sisIdx !== -1 ? String(data[i][sisIdx]) === "SI" : Number(id_rol) === 1;
    }
  }
  return false;
}

/** true si el rol está activo (el rol de sistema siempre se considera activo). */
function _rolActivo(id_rol) {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("ROLES");
  if (!sheet) return true;
  var data = sheet.getDataRange().getValues();
  var h = data[0];
  var idIdx  = h.indexOf("id");
  var actIdx = h.indexOf("activo");
  var sisIdx = h.indexOf("es_sistema");
  for (var i = 1; i < data.length; i++) {
    if (Number(data[i][idIdx]) === Number(id_rol)) {
      if (sisIdx !== -1 && String(data[i][sisIdx]) === "SI") return true;
      return actIdx === -1 ? true : String(data[i][actIdx]) !== "NO";
    }
  }
  return false;
}

// ── SESSION VALIDATION ─────────────────────────────────────────

function _validateSessionToken(session_token) {
  if (!session_token) return { ok: false, error: "Token requerido" };
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("SESIONES");
  if (!sheet) return { ok: false, error: "Sesión no válida" };
  var data   = sheet.getDataRange().getValues();
  var h      = data[0];
  var tokIdx = h.indexOf("session_token");
  var uidIdx = h.indexOf("id_usuario");
  var emlIdx = h.indexOf("email");
  var rolIdx = h.indexOf("id_rol");
  var expIdx = h.indexOf("expira_en");
  var actIdx = h.indexOf("activa");

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][tokIdx]) === session_token) {
      if (data[i][actIdx] !== "SI") return { ok: false, error: "Sesión inactiva" };
      if (new Date(data[i][expIdx]) < new Date()) return { ok: false, error: "Sesión expirada" };

      var idUsuario = data[i][uidIdx];
      var rolActual = Number(data[i][rolIdx]);
      var sellerId  = "";

      var usSheet = ss.getSheetByName("USUARIOS");
      if (usSheet) {
        var usData  = usSheet.getDataRange().getValues();
        var usH     = usData[0];
        var uIdIdx  = usH.indexOf("id");
        var uRolIdx = usH.indexOf("id_rol");
        var uActIdx = usH.indexOf("activo");
        var uSelIdx = usH.indexOf("seller_id");
        for (var j = 1; j < usData.length; j++) {
          if (String(usData[j][uIdIdx]) === String(idUsuario)) {
            if (usData[j][uActIdx] !== "SI") return { ok: false, error: "Usuario inactivo" };
            rolActual = Number(usData[j][uRolIdx]);
            sellerId  = uSelIdx !== -1 ? String(usData[j][uSelIdx] || "").trim() : "";
            break;
          }
        }
      }

      if (!_rolActivo(rolActual)) return { ok: false, error: "Rol desactivado" };

      return { ok: true, id_usuario: idUsuario, email: String(data[i][emlIdx]), id_rol: rolActual, seller_id: sellerId };
    }
  }
  return { ok: false, error: "Sesión no encontrada" };
}

/**
 * Etapa 7 — purga de la hoja SESIONES para acotar su crecimiento. Cada login
 * agrega una fila y el logout solo marca activa=NO; sin esto la hoja crece sin
 * límite y _validateSessionToken la escanea completa en cada request.
 * Conserva solo las sesiones activas y no vencidas. Se llama al inicio de
 * login() (solo reescribe si hay algo para eliminar) y también sirve como
 * función standalone para un trigger time-driven opcional.
 * Devuelve la cantidad de filas eliminadas.
 */
function limpiarSesionesVencidas() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return 0; // oportunista: si otro proceso escribe, se salta
  try {
    var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName("SESIONES");
    if (!sheet) return 0;

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return 0;

    var h      = data[0];
    var expIdx = h.indexOf("expira_en");
    var actIdx = h.indexOf("activa");
    var ahora  = new Date();

    var conservar = [h];
    for (var i = 1; i < data.length; i++) {
      var activa  = data[i][actIdx] === "SI";
      var vigente = expIdx !== -1 && data[i][expIdx] && new Date(data[i][expIdx]) >= ahora;
      if (activa && vigente) conservar.push(data[i]);
    }

    var eliminadas = data.length - conservar.length;
    if (eliminadas <= 0) return 0;

    // Reescribe en el lugar las filas a conservar y limpia la cola sobrante,
    // evitando una ventana con la hoja totalmente vacía.
    var lastRowOld = sheet.getLastRow();
    sheet.getRange(1, 1, conservar.length, h.length).setValues(conservar);
    if (lastRowOld > conservar.length) {
      sheet.getRange(conservar.length + 1, 1, lastRowOld - conservar.length, h.length).clearContent();
    }
    return eliminadas;
  } finally {
    lock.releaseLock();
  }
}

// ── LOGIN ─────────────────────────────────────────────────────

function login(body) {
  var email         = String(body.email         || "").toLowerCase().trim();
  var password_hash = String(body.password_hash || "");
  if (!email || !password_hash) {
    return { ok: false, error: "Email y contraseña requeridos", code: 400 };
  }

  var cache     = CacheService.getScriptCache();
  var cacheKey  = "mp_lf_" + email.replace(/[^a-z0-9]/g, "_");
  var failCount = parseInt(cache.get(cacheKey) || "0", 10);
  if (failCount >= 5) {
    return { ok: false, error: "Demasiados intentos fallidos. Esperá 15 minutos e intentá de nuevo.", code: 429 };
  }

  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("USUARIOS");
  if (!sheet) return { ok: false, error: "Sistema de usuarios no configurado. Ejecutá setupAuthSheets() en Apps Script.", code: 500 };

  var data    = sheet.getDataRange().getValues();
  var headers = data[0];
  var idxId     = headers.indexOf("id");
  var idxNombre = headers.indexOf("nombre");
  var idxEmail  = headers.indexOf("email");
  var idxHash   = headers.indexOf("password_hash");
  var idxSalt   = headers.indexOf("salt");
  var idxRol    = headers.indexOf("id_rol");
  var idxActivo = headers.indexOf("activo");
  var idxUltimo = headers.indexOf("ultimo_acceso");
  var idxSeller = headers.indexOf("seller_id");

  var userRow = null, userRowNum = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idxEmail]).toLowerCase() === email) {
      userRow = data[i];
      userRowNum = i + 1;
      break;
    }
  }
  if (!userRow) {
    cache.put(cacheKey, String(failCount + 1), 900);
    return { ok: false, error: "Email o contraseña incorrectos", code: 401 };
  }
  if (userRow[idxActivo] !== "SI") {
    return { ok: false, error: "Usuario inactivo. Contactá al administrador.", code: 403 };
  }

  var hash = hashPassword(String(userRow[idxSalt]), password_hash);
  if (hash !== String(userRow[idxHash])) {
    cache.put(cacheKey, String(failCount + 1), 900);
    return { ok: false, error: "Email o contraseña incorrectos", code: 401 };
  }

  var userId   = userRow[idxId];
  var idRol    = Number(userRow[idxRol]);
  var nombre   = String(userRow[idxNombre]);
  var sellerId = idxSeller !== -1 ? String(userRow[idxSeller] || "").trim() : "";

  if (!_rolActivo(idRol)) {
    return { ok: false, error: "Tu rol está desactivado. Contactá al administrador.", code: 403 };
  }

  sheet.getRange(userRowNum, idxUltimo + 1).setValue(new Date().toISOString());

  var sessionToken = Utilities.getUuid();
  var expiraEn     = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
  var ahoraIso     = new Date().toISOString();

  // Purga sesiones vencidas/inactivas antes de crear la nueva (acota SESIONES).
  limpiarSesionesVencidas();

  var sesSheet = ss.getSheetByName("SESIONES");
  if (sesSheet) {
    sesSheet.appendRow([sessionToken, userId, email, idRol, expiraEn, ahoraIso, "SI"]);
  }

  cache.remove(cacheKey);
  return {
    ok:            true,
    session_token: sessionToken,
    usuario: { id: userId, nombre: nombre, email: email, id_rol: idRol, nombre_rol: getNombreRol(idRol), seller_id: sellerId },
    permisos:      getPermisosForRol(idRol),
    expira_en:     expiraEn,
  };
}

// ── LOGOUT ────────────────────────────────────────────────────

function logoutSesion(body) {
  var token = String(body.session_token || "");
  if (!token) return { ok: true };
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("SESIONES");
  if (!sheet) return { ok: true };
  var data    = sheet.getDataRange().getValues();
  var headers = data[0];
  var idxTok = headers.indexOf("session_token");
  var idxAct = headers.indexOf("activa");
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idxTok]) === token) {
      sheet.getRange(i + 1, idxAct + 1).setValue("NO");
      break;
    }
  }
  return { ok: true };
}

// ── VALIDATE SESSION (para el frontend) ───────────────────────

function validateSession(body) {
  var res = _validateSessionToken(body.session_token);
  if (!res.ok) return { ok: false, error: res.error, code: 401 };
  return {
    ok:       true,
    usuario:  { id: res.id_usuario, email: res.email, id_rol: res.id_rol, nombre_rol: getNombreRol(res.id_rol), seller_id: res.seller_id },
    permisos: getPermisosForRol(res.id_rol),
  };
}

// ── CAMBIAR CONTRASEÑA (self-service) ─────────────────────────

function changePassword(body) {
  var id_usuario            = body._sesId;
  var password_actual_hash  = String(body.password_actual_hash || "");
  var password_nueva_hash   = String(body.password_nueva_hash  || "");

  if (!id_usuario) return { ok: false, error: "Sesión no válida", code: 401 };
  if (!password_actual_hash || !password_nueva_hash) {
    return { ok: false, error: "Todos los campos son requeridos", code: 400 };
  }

  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("USUARIOS");
  if (!sheet) return { ok: false, error: "Tabla de usuarios no disponible", code: 500 };

  var rowNum = _authFindRow(sheet, id_usuario);
  if (!rowNum) return { ok: false, error: "Usuario no encontrado", code: 404 };

  var allData = sheet.getDataRange().getValues();
  var headers = allData[0];
  var row     = allData[rowNum - 1];
  var idxHash = headers.indexOf("password_hash");
  var idxSalt = headers.indexOf("salt");

  var currentHash = hashPassword(String(row[idxSalt]), password_actual_hash);
  if (currentHash !== String(row[idxHash])) {
    return { ok: false, error: "La contraseña actual es incorrecta", code: 401 };
  }

  var newSalt = Utilities.getUuid();
  var newHash = hashPassword(newSalt, password_nueva_hash);
  sheet.getRange(rowNum, idxHash + 1).setValue(newHash);
  sheet.getRange(rowNum, idxSalt + 1).setValue(newSalt);

  return { ok: true };
}

// ── USUARIOS CRUD (solo admin) ─────────────────────────────────

function getUsuarios() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("USUARIOS");
  if (!sheet) return { ok: true, data: [] };
  var data    = sheet.getDataRange().getValues();
  var headers = data[0];
  var usuarios = data.slice(1)
    .filter(function (r) { return r[0] !== ""; })
    .map(function (r) {
      var obj = _authRowToObj(headers, r);
      delete obj.password_hash;
      delete obj.salt;
      return obj;
    });
  return { ok: true, data: usuarios };
}

// Lightweight, no admin-only: cualquier sesión de staff interna (no seller)
// necesita poblar el dropdown "Responsable" del Gantt con personas reales,
// sin exponer los campos sensibles que sí devuelve getUsuarios() (admin-only).
function getUsuariosGanttAction(data) {
  if (data && data._sesSellerId) {
    return { ok: false, error: "Forbidden", code: 403 };
  }
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("USUARIOS");
  if (!sheet) return { ok: true, data: [] };
  var values  = sheet.getDataRange().getValues();
  var headers = values[0];
  var idIdx     = headers.indexOf("id");
  var nombreIdx = headers.indexOf("nombre");
  var activoIdx = headers.indexOf("activo");
  var sellerIdx = headers.indexOf("seller_id");

  var usuarios = values.slice(1)
    .filter(function (r) {
      return r[idIdx] !== "" &&
        String(r[activoIdx]) === "SI" &&
        String(r[sellerIdx] || "").trim() === "";
    })
    .map(function (r) { return { id: r[idIdx], nombre: String(r[nombreIdx] || "") }; })
    .sort(function (a, b) { return a.nombre.localeCompare(b.nombre); });

  return { ok: true, data: usuarios };
}


var SELLER_INITIAL_PASSWORD = "Admin123";

function prevalidarUsuarioSellerDesdeAlta(data) {
  var sellerId = String(data.seller_id || "").trim();
  var email = String(data.contacto_email || "").toLowerCase().trim();
  var nombre = String(data.contacto_nombre || data.seller_nombre || data.marca_seller_operativo || sellerId).trim();

  if (!sellerId) return { ok: false, error: "Falta seller_id para crear la cuenta Seller", code: 400 };
  if (!email) return { ok: false, error: "Para crear un seller nuevo, cargá el email del contacto principal. Ese email se usa como usuario inicial.", code: 400 };
  if (!emailValido(email)) return { ok: false, error: "El email del contacto principal no tiene un formato válido", code: 400 };
  if (!nombre) nombre = sellerId;

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("USUARIOS");
  if (!sheet) return { ok: false, error: "Tabla de usuarios no disponible", code: 500 };

  var existing = sheet.getDataRange().getValues();
  if (!existing.length) return { ok: false, error: "Tabla de usuarios sin encabezados", code: 500 };

  var headers = existing[0];
  var eEmailIdx = headers.indexOf("email");
  var eSelIdx = headers.indexOf("seller_id");
  var eIdIdx = headers.indexOf("id");
  if (eEmailIdx === -1 || eSelIdx === -1) {
    return { ok: false, error: "La tabla USUARIOS no tiene columnas email/seller_id", code: 500 };
  }

  var sellerUpper = sellerId.toUpperCase();
  for (var i = 1; i < existing.length; i++) {
    var rowSellerId = String(existing[i][eSelIdx] || "").trim().toUpperCase();
    var rowEmail = String(existing[i][eEmailIdx] || "").toLowerCase().trim();
    if (rowSellerId && rowSellerId === sellerUpper) {
      return { ok: true, exists: true, id: eIdIdx !== -1 ? existing[i][eIdIdx] : "", seller_id: sellerId, email: rowEmail };
    }
    if (rowEmail && rowEmail === email) {
      return { ok: false, error: "El email " + email + " ya está en uso en USUARIOS", code: 409 };
    }
  }

  return { ok: true, exists: false, seller_id: sellerId, email: email, nombre: nombre };
}

function crearUsuarioSellerDesdeAlta(data) {
  var pre = prevalidarUsuarioSellerDesdeAlta(data);
  if (!pre.ok || pre.exists) return pre;

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("USUARIOS");
  if (!sheet) return { ok: false, error: "Tabla de usuarios no disponible", code: 500 };

  var nextId = _authNextId(sheet);
  var salt = Utilities.getUuid();
  var hash = hashPassword(salt, computeSha256Hex(SELLER_INITIAL_PASSWORD));
  var now = new Date().toISOString();
  var creadoPor = String(data._sesEmail || "saveSeller");

  sheet.appendRow([nextId, pre.nombre, pre.email, hash, salt, 2, "SI", now, "", creadoPor, pre.seller_id]);

  return {
    ok: true,
    created: true,
    id: nextId,
    seller_id: pre.seller_id,
    email: pre.email,
  };
}

function createUsuario(body) {
  var data          = body.data || {};
  var nombre        = String(data.nombre        || "").trim();
  var email         = String(data.email         || "").toLowerCase().trim();
  var password_hash = String(data.password_hash || "");
  var id_rol        = Number(data.id_rol        || 1);

  if (!nombre || !email || !password_hash) {
    return { ok: false, error: "Nombre, email y contraseña son requeridos", code: 400 };
  }

  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("USUARIOS");
  if (!sheet) return { ok: false, error: "Tabla de usuarios no disponible", code: 500 };

  var sellerId  = String(data.seller_id || "").trim();

  var existing  = sheet.getDataRange().getValues();
  var eEmailIdx = existing[0].indexOf("email");
  var eSelIdx   = existing[0].indexOf("seller_id");
  for (var i = 1; i < existing.length; i++) {
    if (String(existing[i][eEmailIdx]).toLowerCase() === email) {
      return { ok: false, error: "El email ya está en uso", code: 409 };
    }
    if (id_rol === 2 && sellerId && eSelIdx !== -1 &&
        String(existing[i][eSelIdx] || "").trim().toUpperCase() === sellerId.toUpperCase()) {
      return { ok: false, error: "Ya existe una cuenta para el seller " + sellerId, code: 409 };
    }
  }

  var nextId = _authNextId(sheet);
  var salt   = Utilities.getUuid();
  var hash   = hashPassword(salt, password_hash);
  var now    = new Date().toISOString();
  var creadoPor = String(body._sesEmail || "");

  sheet.appendRow([nextId, nombre, email, hash, salt, id_rol, "SI", now, "", creadoPor, sellerId]);
  return { ok: true, id: nextId };
}

function updateUsuario(body) {
  var id   = Number(body.id);
  var data = body.data || {};

  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("USUARIOS");
  if (!sheet) return { ok: false, error: "Tabla de usuarios no disponible", code: 500 };

  var rowNum = _authFindRow(sheet, id);
  if (!rowNum) return { ok: false, error: "Usuario no encontrado", code: 404 };

  var allData = sheet.getDataRange().getValues();
  var headers = allData[0];

  // Invariante: el sistema nunca puede quedarse sin un Administrador activo.
  var rolColIdx = headers.indexOf("id_rol");
  var actColIdx = headers.indexOf("activo");
  var rowActual = allData[rowNum - 1];
  var eraAdmin  = Number(rowActual[rolColIdx]) === 1 && String(rowActual[actColIdx]) === "SI";
  if (eraAdmin) {
    var quitaAdmin = data.id_rol !== undefined && Number(data.id_rol) !== 1;
    var desactiva  = data.activo !== undefined && data.activo !== "SI";
    if (quitaAdmin || desactiva) {
      var otrosAdmins = 0;
      for (var a = 1; a < allData.length; a++) {
        if (a === rowNum - 1) continue;
        if (Number(allData[a][rolColIdx]) === 1 && String(allData[a][actColIdx]) === "SI") otrosAdmins++;
      }
      if (otrosAdmins === 0) {
        return { ok: false, error: "Debe quedar al menos un Administrador activo en el sistema", code: 409 };
      }
    }
  }

  if (data.email !== undefined) {
    var newEmail = String(data.email).toLowerCase().trim();
    var colId = headers.indexOf("id");
    var colEm = headers.indexOf("email");
    for (var j = 1; j < allData.length; j++) {
      if (Number(allData[j][colId]) !== id && String(allData[j][colEm]).toLowerCase() === newEmail) {
        return { ok: false, error: "El email ya está en uso", code: 409 };
      }
    }
    sheet.getRange(rowNum, colEm + 1).setValue(newEmail);
  }

  // Guard: no permitir dos cuentas Seller con el mismo seller_id.
  var selColIdx  = headers.indexOf("seller_id");
  var rolFinal   = data.id_rol !== undefined ? Number(data.id_rol) : Number(rowActual[rolColIdx]);
  var sellerFinal = data.seller_id !== undefined
    ? String(data.seller_id).trim()
    : (selColIdx !== -1 ? String(rowActual[selColIdx] || "").trim() : "");
  if (rolFinal === 2 && sellerFinal && selColIdx !== -1) {
    var idColIdx = headers.indexOf("id");
    for (var s = 1; s < allData.length; s++) {
      if (Number(allData[s][idColIdx]) === id) continue;
      if (String(allData[s][selColIdx] || "").trim().toUpperCase() === sellerFinal.toUpperCase()) {
        return { ok: false, error: "Ya existe una cuenta para el seller " + sellerFinal, code: 409 };
      }
    }
  }

  if (data.nombre !== undefined) sheet.getRange(rowNum, headers.indexOf("nombre") + 1).setValue(String(data.nombre).trim());
  if (data.id_rol !== undefined) sheet.getRange(rowNum, headers.indexOf("id_rol") + 1).setValue(Number(data.id_rol));
  if (data.activo !== undefined) sheet.getRange(rowNum, headers.indexOf("activo") + 1).setValue(data.activo === "SI" ? "SI" : "NO");
  if (data.seller_id !== undefined && selColIdx !== -1) {
    sheet.getRange(rowNum, selColIdx + 1).setValue(String(data.seller_id).trim());
  }
  if (data.password_hash && String(data.password_hash).trim()) {
    var newSalt = Utilities.getUuid();
    var newHash = hashPassword(newSalt, String(data.password_hash));
    sheet.getRange(rowNum, headers.indexOf("password_hash") + 1).setValue(newHash);
    sheet.getRange(rowNum, headers.indexOf("salt")          + 1).setValue(newSalt);
  }

  return { ok: true };
}

// ── ROLES CRUD (solo admin) ────────────────────────────────────

function getRoles() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("ROLES");
  if (!sheet) return { ok: true, data: [] };
  var data    = sheet.getDataRange().getValues();
  var headers = data[0];
  var roles = data.slice(1)
    .filter(function (r) { return r[0] !== ""; })
    .map(function (r) { return _authRowToObj(headers, r); });
  return { ok: true, data: roles };
}

function createRol(body) {
  var nombre = String(body.nombre || "").trim();
  if (!nombre) return { ok: false, error: "El nombre del rol es requerido", code: 400 };

  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("ROLES");
  if (!sheet) return { ok: false, error: "Tabla de roles no disponible", code: 500 };

  var data    = sheet.getDataRange().getValues();
  var headers = data[0];
  var nomIdx  = headers.indexOf("nombre");
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][nomIdx]).toLowerCase() === nombre.toLowerCase()) {
      return { ok: false, error: "Ya existe un rol con ese nombre", code: 409 };
    }
  }

  var nextId = _authNextId(sheet);
  sheet.appendRow([nextId, nombre, String(body.descripcion || ""), "SI", "NO"]);

  // Rol nuevo arranca sin acceso: si hay módulos definidos, sembrar en Oculto.
  var permSheet = ss.getSheetByName("PERMISOS_MODULOS");
  if (permSheet && typeof MODULOS_RBAC !== "undefined") {
    MODULOS_RBAC.forEach(function (mod) {
      permSheet.appendRow([nextId, mod, "NO", "NO"]);
    });
  }

  return { ok: true, id: nextId };
}

function updateRol(body) {
  var id = Number(body.id);
  if (!id) return { ok: false, error: "ID de rol requerido", code: 400 };

  if (_esRolSistema(id)) {
    return { ok: false, error: "El rol Administrador no se puede modificar", code: 403 };
  }

  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("ROLES");
  if (!sheet) return { ok: false, error: "Tabla de roles no disponible", code: 500 };

  var rowNum = _authFindRow(sheet, id);
  if (!rowNum) return { ok: false, error: "Rol no encontrado", code: 404 };

  var headers = sheet.getDataRange().getValues()[0];

  if (body.nombre !== undefined) {
    var nuevoNombre = String(body.nombre).trim();
    if (!nuevoNombre) return { ok: false, error: "El nombre no puede quedar vacío", code: 400 };
    var allData = sheet.getDataRange().getValues();
    var idIdx   = headers.indexOf("id");
    var nomIdx  = headers.indexOf("nombre");
    for (var j = 1; j < allData.length; j++) {
      if (Number(allData[j][idIdx]) !== id && String(allData[j][nomIdx]).toLowerCase() === nuevoNombre.toLowerCase()) {
        return { ok: false, error: "Ya existe un rol con ese nombre", code: 409 };
      }
    }
    sheet.getRange(rowNum, nomIdx + 1).setValue(nuevoNombre);
  }

  if (body.descripcion !== undefined) {
    sheet.getRange(rowNum, headers.indexOf("descripcion") + 1).setValue(String(body.descripcion));
  }
  if (body.activo !== undefined) {
    sheet.getRange(rowNum, headers.indexOf("activo") + 1).setValue(body.activo === "SI" ? "SI" : "NO");
  }

  return { ok: true };
}

// ── PERMISOS CRUD ───────────────────────────────────────────────

function getPermisos() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("PERMISOS_MODULOS");
  if (!sheet) return { ok: true, data: [] };
  var data    = sheet.getDataRange().getValues();
  var headers = data[0];
  var permisos = data.slice(1)
    .filter(function (r) { return r[0] !== ""; })
    .map(function (r) { return _authRowToObj(headers, r); });
  return { ok: true, data: permisos };
}

function updatePermisos(body) {
  var id_rol       = Number(body.id_rol);
  var modulo       = String(body.modulo || "");
  var puede_ver    = (body.puede_ver    === "SI" || body.puede_ver    === true) ? "SI" : "NO";
  var puede_editar = (body.puede_editar === "SI" || body.puede_editar === true) ? "SI" : "NO";
  if (puede_ver === "NO") puede_editar = "NO";

  if (_esRolSistema(id_rol)) {
    return { ok: false, error: "El rol Administrador no se puede modificar", code: 403 };
  }

  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("PERMISOS_MODULOS");
  if (!sheet) return { ok: false, error: "Tabla de permisos no disponible", code: 500 };

  var data    = sheet.getDataRange().getValues();
  var headers = data[0];
  var idxRol  = headers.indexOf("id_rol");
  var idxMod  = headers.indexOf("modulo");
  var idxVer  = headers.indexOf("puede_ver");
  var idxEdt  = headers.indexOf("puede_editar");

  for (var i = 1; i < data.length; i++) {
    if (Number(data[i][idxRol]) === id_rol && String(data[i][idxMod]) === modulo) {
      sheet.getRange(i + 1, idxVer + 1).setValue(puede_ver);
      sheet.getRange(i + 1, idxEdt + 1).setValue(puede_editar);
      return { ok: true };
    }
  }
  sheet.appendRow([id_rol, modulo, puede_ver, puede_editar]);
  return { ok: true };
}
