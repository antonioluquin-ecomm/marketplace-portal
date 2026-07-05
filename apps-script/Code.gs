/**
 * SPORTING MARKETPLACE — Code.gs
 * Entry points (doGet/doPost), router y guards de nivel router.
 * Convenciones: apps_script_standards.md.
 */



// Etapa 10B — contrato único por `action` (como commerce-hub). Ya no existe
// `tipo_formulario`. doPost delega todo a routeAction(); doGet queda para health.
function doPost(e) {
  try {
    const raw = e && e.postData ? e.postData.contents : "";
    const data = JSON.parse(raw || "{}");
    const action = String(data.action || "").trim();
    if (!action) return errorResp(new Error("Falta 'action' en el request"));
    return jsonResp(routeAction(data, action));
  } catch (err) {
    console.error("Error en doPost:", err.toString());
    return errorResp(err);
  }
}

// Escrituras de dominio (no auth). Las internas se gatean por módulo RBAC; las
// seller-scoped, por ownership dentro del handler.
var WRITE_ACTIONS = [
  "saveSeller", "saveCalificacion", "saveRelevamiento", "saveRelevamientoProfile",
  "updateGanttTask", "createGanttTask", "disableGanttTask",
  "updateTarifas", "updateOverrides", "uploadLogo",
];

// Escrituras internas (staff) → el rol debe poder editar alguno de estos módulos.
var ACTION_MODULE_MAP = {
  saveSeller:       ["backlog"],
  createGanttTask:  ["gantt"],
  disableGanttTask: ["gantt"],
  updateTarifas:    ["simuladores"],
  updateOverrides:  ["simuladores"],
  uploadLogo:       ["backlog"],
};

function routeAction(data, action) {
  // Auth / lecturas / admin: router de Users.gs (valida sesión y gatea por tier).
  if (WRITE_ACTIONS.indexOf(action) === -1) {
    return routeAuthAction(data);
  }

  // Escrituras: exigen sesión válida.
  var ses = _validateSessionToken(data.session_token);
  if (!ses.ok) return { ok: false, error: ses.error, code: 401 };
  data._sesRol      = ses.id_rol;
  data._sesEmail    = ses.email;
  data._sesId       = ses.id_usuario;
  data._sesSellerId = ses.seller_id || "";

  // Gating de escrituras internas por módulo (un seller nunca las alcanza).
  var mods = ACTION_MODULE_MAP[action];
  if (mods && ses.id_rol !== 1) {
    if (ses.seller_id) return { ok: false, error: "Forbidden", code: 403 };
    var perm = getPermisosForRol(ses.id_rol);
    var puede = mods.some(function (m) { return perm[m] && perm[m].editar === true; });
    if (!puede) return { ok: false, error: "Forbidden", code: 403 };
  }

  switch (action) {
    case "saveSeller":              return _handleSaveSeller(data);
    case "saveCalificacion":        return _handleSaveCalificacion(data);
    case "saveRelevamiento":        return _handleSaveRelevamiento(data);
    case "saveRelevamientoProfile": return _handleSaveRelevamientoProfile(data);
    case "updateGanttTask":         return _handleUpdateGanttTask(data);
    case "createGanttTask":         return _handleCreateGanttTask(data);
    case "disableGanttTask":        return _handleDisableGanttTask(data);
    case "updateTarifas":           return _handleUpdateTarifas(data);
    case "updateOverrides":         return _handleUpdateOverrides(data);
    case "uploadLogo":              return _handleUploadLogo(data);
  }
  return { ok: false, error: "Acción no implementada: " + action, code: 400 };
}

// Ownership de escrituras seller-scoped: un seller solo escribe lo suyo; el
// Administrador (id_rol=1) puede cargar en nombre de cualquiera. Staff no-admin
// no envía formularios de seller.
function _guardSellerOwnership(data, sellerId) {
  if (data._sesRol === 1) return;
  if (!data._sesSellerId) throw new Error("No autorizado a enviar este formulario.");
  if (data._sesSellerId.toUpperCase() !== String(sellerId).toUpperCase())
    throw new Error("No autorizado a enviar este formulario para este seller.");
}

function _handleSaveSeller(data) {
  var sellerId = String(data.seller_id || "").trim();
  if (!sellerId) throw new Error("Falta seller_id");
  var resultado = upsertSeller(sellerId, data, { modo: "gestion" });
  writeAuditLog("saveSeller", "sellers", sellerId, resultado.accion || "", data._sesEmail);
  return {
    ok: true, seller_id: sellerId,
    fecha_envio: resultado.fecha_envio, estado: resultado.estado,
    completitud: resultado.completitud, hoja: resultado.hoja,
    accion: resultado.accion || null, fila: resultado.fila || null,
  };
}

function _handleSaveCalificacion(data) {
  var sellerId = String(data.seller_id || "").trim();
  if (!sellerId) throw new Error("Falta seller_id");
  _guardSellerOwnership(data, sellerId);
  var resultado = escribirEnCalificaciones(sellerId, data);
  resultado.seller_sync = sincronizarSellerDesdeFuente(sellerId, data, "calificacion");
  enviarNotificacionCalificacion(sellerId, data, resultado);
  writeAuditLog("saveCalificacion", "calificaciones", sellerId, "", data._sesEmail);
  return {
    ok: true, seller_id: sellerId,
    fecha_envio: resultado.fecha_envio, estado: resultado.estado,
    completitud: resultado.completitud, hoja: resultado.hoja,
    accion: resultado.accion || null, fila: resultado.fila || null,
    seller_sync: resultado.seller_sync || null,
  };
}

function _handleSaveRelevamiento(data) {
  var sellerId = String(data.seller_id || "").trim();
  if (!sellerId) throw new Error("Falta seller_id");
  _guardSellerOwnership(data, sellerId);
  var resultado = escribirEnRelevamientos(sellerId, data);
  resultado.seller_sync = sincronizarSellerDesdeFuente(sellerId, data, "relevamiento");
  resultado.definicion_tecnica = upsertDefinicionTecnica(sellerId, data, resultado);
  enviarNotificacionRelevamiento(sellerId, data, resultado);
  writeAuditLog("saveRelevamiento", "relevamientos", sellerId, "", data._sesEmail);
  return {
    ok: true, seller_id: sellerId,
    fecha_envio: resultado.fecha_envio, estado: resultado.estado,
    completitud: resultado.completitud, hoja: resultado.hoja,
    accion: resultado.accion || null, fila: resultado.fila || null,
    seller_sync: resultado.seller_sync || null,
    definicion_tecnica: resultado.definicion_tecnica || null,
  };
}

function _handleSaveRelevamientoProfile(data) {
  var sellerId = String(data.seller_id || "").trim();
  _guardSellerOwnership(data, sellerId);
  var r = upsertPerfilRelevamiento(data);
  writeAuditLog("saveRelevamientoProfile", "relevamientos_perfil", r.seller_id, r.accion || "", data._sesEmail);
  return {
    ok: true, seller_id: r.seller_id, accion: r.accion, hoja: r.hoja, fila: r.fila,
    estado_relevamiento: r.estado_relevamiento, completitud: r.completitud,
    fecha_ultima_actualizacion: r.fecha_ultima_actualizacion,
  };
}

function _handleUpdateGanttTask(data) {
  // El guard de ownership (seller solo sus tareas + estado/comentario) vive en
  // actualizarTareaGanttSinLock (Gantt.gs), usando _sesRol/_sesSellerId ya inyectados.
  var r = actualizarTareaGantt(data);
  writeAuditLog("updateGanttTask", "timeline", r.task_id, (r.updated_fields || []).join(","), data._sesEmail);
  return { ok: true, task_id: r.task_id, updated_fields: r.updated_fields };
}

function _handleCreateGanttTask(data) {
  var r = crearTareaGantt(data);
  writeAuditLog("createGanttTask", "timeline", r.task_id, "", data._sesEmail);
  return { ok: true, task_id: r.task_id, created_fields: r.created_fields, row_number: r.row_number, message: "Tarea Gantt creada" };
}

function _handleDisableGanttTask(data) {
  var r = darDeBajaTareaGantt(data);
  writeAuditLog("disableGanttTask", "timeline", r.task_id, "", data._sesEmail);
  return { ok: true, task_id: r.task_id, disabled_fields: r.disabled_fields, row_number: r.row_number, message: "Tarea Gantt dada de baja logicamente" };
}

function _handleUpdateTarifas(data) {
  var r = actualizarTarifas(data);
  writeAuditLog("updateTarifas", "tarifas", "", "", data._sesEmail);
  return r;
}

function _handleUpdateOverrides(data) {
  var r = actualizarOverridesSeller(data);
  writeAuditLog("updateOverrides", "overrides", String(data.seller_id || ""), "", data._sesEmail);
  return r;
}

function _handleUploadLogo(data) {
  var r = subirLogoAGitHub(data);
  writeAuditLog("uploadLogo", "logos", String(data.seller_id || ""), "", data._sesEmail);
  return r;
}

// Etapa 10B — doGet solo para health check (estándar §3.2). Las lecturas
// privadas (incluido el perfil de relevamiento) van por doPost con `action`.
function doGet(e) {
  const params = (e && e.parameter) || {};
  const action = String(params.action || "").trim().toLowerCase();

  if (action === "health") {
    return jsonResp({ ok: true, status: "running", timestamp: new Date().toISOString() });
  }

  return jsonResp({
    ok: true,
    status: "running",
    message: "Apps Script activo - Marketplace Sporting",
  });
}

// ── Serialización de respuesta (contrato del Web App) ──
function jsonResp(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
function errorResp(err) {
  return jsonResp({
    ok: false,
    error: err && err.message ? err.message : String(err),
    code: 500,
  });
}
