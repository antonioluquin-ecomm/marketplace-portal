/**
 * SPORTING MARKETPLACE — Setup.gs
 * Bootstrap idempotente y funciones one-time (ejecutar desde el editor GAS).
 */


// ───────────────────────────────────────────────
// ETAPA 1C — MIGRADOR DRY-RUN relevamientos → relevamientos_perfil
// Ejecutar manualmente desde el editor de Apps Script.
// No escribe nada. Solo loguea en Registro de ejecución.
// ───────────────────────────────────────────────
function migrarPerfilesDryRun() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const wsOrigen = ss.getSheetByName(HOJA_RELEVAMIENTO);

  if (!wsOrigen) {
    console.log("ERROR: hoja 'relevamientos' no encontrada.");
    return;
  }

  const data = wsOrigen.getDataRange().getValues();
  if (data.length < 2) {
    console.log("Sin filas de datos en relevamientos.");
    return;
  }

  const headersOrigen = data[0].map((h) => limpiarValor(h));
  const sellerCol = headersOrigen.indexOf("seller_id");
  if (sellerCol === -1) {
    console.log("ERROR: columna seller_id no encontrada en relevamientos.");
    return;
  }

  // Ultima fila por seller_id (la mas reciente wins)
  const mapaUltimaFila = {};
  for (let i = 1; i < data.length; i++) {
    const sellerId = normalizarSellerIdPerfil(data[i][sellerCol]);
    if (sellerId) mapaUltimaFila[sellerId] = { filaNum: i + 1, row: data[i] };
  }

  const sellers = Object.keys(mapaUltimaFila);
  console.log("Sellers distintos en relevamientos: " + sellers.length);

  const camposPermitidos = obtenerCamposPermitidosPerfil();
  const resultados = [];

  sellers.forEach(function (sellerId) {
    const entrada = mapaUltimaFila[sellerId];
    const perfilObj = {};

    headersOrigen.forEach(function (header, idx) {
      if (camposPermitidos.includes(header)) {
        perfilObj[header] = limpiarValor(entrada.row[idx]);
      }
    });

    const completitud = calcularCompletitudPerfil(perfilObj);
    const estado = obtenerEstadoPerfil(completitud, "migration");
    const completos = camposPermitidos.filter(function (c) { return perfilObj[c] !== ""; }).length;

    console.log(
      "[DRY-RUN] " + sellerId +
      " | fila origen: " + entrada.filaNum +
      " | completitud: " + completitud + "%" +
      " | estado: " + estado +
      " | campos completos: " + completos + "/" + camposPermitidos.length
    );

    resultados.push({ seller_id: sellerId, completitud: completitud, estado: estado });
  });

  const promedio = resultados.length
    ? Math.round(resultados.reduce(function (acc, r) { return acc + r.completitud; }, 0) / resultados.length)
    : 0;

  console.log("=== RESUMEN DRY-RUN ===");
  console.log("Total sellers: " + resultados.length);
  console.log("Completitud promedio: " + promedio + "%");
  console.log("Con 100%: " + resultados.filter(function (r) { return r.completitud === 100; }).length);
  console.log("Con < 50%: " + resultados.filter(function (r) { return r.completitud < 50; }).length);
  console.log("No se escribio nada en relevamientos_perfil.");
}

// ── SETUP / BOOTSTRAP ─────────────────────────────────────────

/**
 * Orquestador idempotente. Ejecutar UNA VEZ desde el editor de Apps Script al
 * montar el proyecto (y tras cambios de schema). Crea/actualiza las hojas del
 * sistema de auth; las hojas de datos se crean lazy en su primer uso.
 */
function setupAll() {
  setupAuthSheets();
  setupGanttSheets();
  Logger.log("setupAll: OK");
}

/**
 * Idempotente — crea las hojas hijas de Gantt (checklist y comentarios por
 * tarea) si no existen. La hoja `timeline` misma no se toca acá: la columna
 * nueva `responsable_persona` se agrega vía _ensureColumn cuando exista.
 */
function setupGanttSheets() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  _ensureSheetWithHeaders(ss, HOJA_TIMELINE_CHECKLIST, [
    "item_id", "task_id", "texto", "hecho", "orden",
    "created_at", "created_by", "updated_at", "updated_by",
  ]);

  _ensureSheetWithHeaders(ss, HOJA_TIMELINE_COMENTARIOS, [
    "comentario_id", "task_id", "autor_email", "autor_nombre", "texto", "created_at",
  ]);

  var timelineSheet = ss.getSheetByName(HOJA_TIMELINE);
  if (timelineSheet) {
    _ensureColumn(timelineSheet, "responsable_persona");
  }

  Logger.log("setupGanttSheets: OK — hojas timeline_checklist/timeline_comentarios listas.");
}
// ── SETUP (ejecutar una vez desde el editor de Apps Script) ───

/**
 * Idempotente — crea las 4 hojas del sistema de auth si no existen y siembra
 * el rol de sistema Administrador (id=1). No crea usuarios: el primer
 * Administrador se crea manualmente con crearPrimerAdmin() (ver abajo).
 */
function setupAuthSheets() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  var usuariosSheet = _ensureSheetWithHeaders(ss, "USUARIOS", [
    "id", "nombre", "email", "password_hash", "salt", "id_rol", "activo",
    "fecha_creacion", "ultimo_acceso", "creado_por", "seller_id",
  ]);
  _ensureColumn(usuariosSheet, "seller_id"); // migración no destructiva para hojas ya existentes

  var rolesSheet = _ensureSheetWithHeaders(ss, "ROLES", [
    "id", "nombre", "descripcion", "activo", "es_sistema",
  ]);
  var rolesData = rolesSheet.getDataRange().getValues();
  var idsExistentes = {};
  for (var i = 1; i < rolesData.length; i++) idsExistentes[Number(rolesData[i][0])] = true;
  if (!idsExistentes[1]) {
    rolesSheet.appendRow([1, "Administrador", "Acceso total al sistema", "SI", "SI"]);
  }
  if (!idsExistentes[2]) {
    rolesSheet.appendRow([2, "Seller", "Cuenta compartida de acceso a public/ para un seller", "SI", "SI"]);
  }

  _ensureSheetWithHeaders(ss, "PERMISOS_MODULOS", [
    "id_rol", "modulo", "puede_ver", "puede_editar",
  ]);

  _ensureSheetWithHeaders(ss, "SESIONES", [
    "session_token", "id_usuario", "email", "id_rol", "expira_en",
    "fecha_creacion", "activa",
  ]);

  Logger.log("setupAuthSheets: OK — hojas USUARIOS/ROLES/PERMISOS_MODULOS/SESIONES listas.");
}

function _ensureSheetWithHeaders(ss, nombre, headers) {
  var sheet = ss.getSheetByName(nombre);
  if (!sheet) {
    sheet = ss.insertSheet(nombre);
    sheet.appendRow(headers);
    return sheet;
  }
  var firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var faltaHeader = headers.some(function (h, idx) { return firstRow[idx] !== h; });
  if (faltaHeader && sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

/**
 * Agrega `headerName` como última columna de `sheet` si todavía no existe.
 * Idempotente y no destructivo — no reordena ni pisa columnas existentes.
 */
function _ensureColumn(sheet, headerName) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  if (headers.indexOf(headerName) !== -1) return;
  sheet.getRange(1, lastCol + 1).setValue(headerName);
}

/**
 * Crear el primer usuario Administrador. Ejecutar UNA VEZ desde el editor de
 * Apps Script (después de setupAuthSheets()), usando una función wrapper:
 *
 *   function _crearAdmin() { crearPrimerAdmin('nombre@empresa.com', 'Nombre Apellido', 'contraseñaTemporal'); }
 *
 * Luego ejecutar _crearAdmin desde el dropdown de funciones del editor.
 */
function crearPrimerAdmin(email, nombre, plainPassword) {
  if (!email || !nombre || !plainPassword) {
    Logger.log("ERROR: faltan argumentos. Usá una función wrapper, no el botón Ejecutar directo.");
    return;
  }
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName("USUARIOS");
  if (!sheet) { Logger.log("ERROR: corré setupAuthSheets() primero."); return; }

  var salt = Utilities.getUuid();
  var hash = hashPassword(salt, computeSha256Hex(plainPassword));
  var now  = new Date().toISOString();

  sheet.appendRow([1, nombre, String(email).toLowerCase().trim(), hash, salt, 1, "SI", now, "", "setup", ""]);
  Logger.log("✓ Administrador creado: " + email);
}

/**
 * Migración masiva: crea una cuenta Seller (id_rol=2) para cada seller_id de
 * la hoja `sellers` que todavía no tenga cuenta en USUARIOS. Idempotente — no
 * pisa cuentas ya creadas. Ejecutar UNA VEZ desde el editor de Apps Script
 * (después de setupAuthSheets()), directamente desde el dropdown de funciones
 * (no requiere argumentos).
 *
 * Las contraseñas temporales generadas quedan en el log de ejecución
 * (Ver → Registros) — copiarlas y distribuirlas a cada seller antes de que
 * pierdan acceso por link (el login pasa a ser obligatorio en public/).
 */
function crearCuentasSellerDesdeHoja() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sellersSheet = ss.getSheetByName("sellers");
  if (!sellersSheet) { Logger.log("ERROR: no se encontró la hoja 'sellers'."); return; }
  var usuariosSheet = ss.getSheetByName("USUARIOS");
  if (!usuariosSheet) { Logger.log("ERROR: corré setupAuthSheets() primero."); return; }

  var sellersData    = sellersSheet.getDataRange().getValues();
  var sellersHeaders = sellersData[0];
  var idxSellerId = sellersHeaders.indexOf("seller_id");
  var idxEmail    = sellersHeaders.indexOf("contacto_email");
  var idxNombre   = sellersHeaders.indexOf("seller_nombre");
  if (idxSellerId === -1) { Logger.log("ERROR: la hoja 'sellers' no tiene columna seller_id."); return; }

  var usuariosHeaders = usuariosSheet.getRange(1, 1, 1, usuariosSheet.getLastColumn()).getValues()[0];
  var uSelIdx = usuariosHeaders.indexOf("seller_id");
  if (uSelIdx === -1) { Logger.log("ERROR: corré setupAuthSheets() primero (falta columna seller_id en USUARIOS)."); return; }

  var usuariosData = usuariosSheet.getDataRange().getValues();
  var existentes = {};
  for (var i = 1; i < usuariosData.length; i++) {
    var sidExistente = String(usuariosData[i][uSelIdx] || "").trim().toUpperCase();
    if (sidExistente) existentes[sidExistente] = true;
  }

  var creados = [];
  var omitidosSinEmail = [];
  var emailsUsados = {};
  for (var e = 1; e < usuariosData.length; e++) {
    var em = String(usuariosData[e][usuariosHeaders.indexOf("email")] || "").trim().toLowerCase();
    if (em) emailsUsados[em] = true;
  }

  for (var r = 1; r < sellersData.length; r++) {
    var sellerId = String(sellersData[r][idxSellerId] || "").trim();
    if (!sellerId || existentes[sellerId.toUpperCase()]) continue;

    var nombre = idxNombre !== -1 ? String(sellersData[r][idxNombre] || "").trim() : "";
    if (!nombre) nombre = sellerId;

    var email = idxEmail !== -1 ? String(sellersData[r][idxEmail] || "").trim().toLowerCase() : "";
    // Sin email no se puede distribuir la credencial: se omite y se reporta
    // para que el admin cargue el contacto_email antes de reintentar.
    if (!email) { omitidosSinEmail.push(sellerId); continue; }
    if (emailsUsados[email]) { omitidosSinEmail.push(sellerId + " (email " + email + " ya en uso)"); continue; }

    var plainPassword = Utilities.getUuid().split("-")[0];
    var salt = Utilities.getUuid();
    var hash = hashPassword(salt, computeSha256Hex(plainPassword));
    var now  = new Date().toISOString();
    var nextId = _authNextId(usuariosSheet);

    usuariosSheet.appendRow([nextId, nombre, email, hash, salt, 2, "SI", now, "", "migracion_seller", sellerId]);
    existentes[sellerId.toUpperCase()] = true;
    emailsUsados[email] = true;
    creados.push(sellerId + " | " + email + " | " + plainPassword);
  }

  if (creados.length) {
    Logger.log(
      creados.length + " cuenta(s) Seller creada(s) — seller_id | email | contraseña temporal:\n" +
      creados.join("\n")
    );
  } else {
    Logger.log("crearCuentasSellerDesdeHoja: no se creó ninguna cuenta nueva.");
  }
  if (omitidosSinEmail.length) {
    Logger.log(
      "\n" + omitidosSinEmail.length + " seller(s) OMITIDO(s) por falta de contacto_email válido — " +
      "cargá el email en la hoja 'sellers' y reejecutá:\n" + omitidosSinEmail.join("\n")
    );
  }
}
