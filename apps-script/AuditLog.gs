/**
 * SPORTING MARKETPLACE — AuditLog.gs
 * Auditoría de escrituras. Se llama al final de cada handler de escritura del
 * router. Best-effort: si la hoja AUDIT_LOG no existe o falla, no interrumpe la
 * operación (patrón commerce-hub AuditLog.gs). La hoja se crea lazy en el
 * primer log.
 *
 * Hoja AUDIT_LOG: id, fecha, accion, entidad, entidad_id, usuario, detalle
 */

var HOJA_AUDIT_LOG = "AUDIT_LOG";
var HEADERS_AUDIT_LOG = ["id", "fecha", "accion", "entidad", "entidad_id", "usuario", "detalle"];

function _auditSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(HOJA_AUDIT_LOG);
  if (!sheet) {
    sheet = ss.insertSheet(HOJA_AUDIT_LOG);
    sheet.appendRow(HEADERS_AUDIT_LOG);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function _auditNextId(sheet) {
  var last = sheet.getLastRow();
  if (last <= 1) return 1;
  var ids = sheet.getRange(2, 1, last - 1, 1).getValues().map(function (r) {
    return parseInt(r[0], 10);
  }).filter(function (n) { return !isNaN(n); });
  return ids.length ? Math.max.apply(null, ids) + 1 : 1;
}

/**
 * Registra una operación de escritura.
 * @param {string} accion      verbo de la acción (ej. "saveSeller", "updateGanttTask")
 * @param {string} entidad     hoja/entidad afectada (ej. "sellers", "timeline")
 * @param {string|number} entidadId  id del registro (ej. seller_id, task_id)
 * @param {string} [detalle]   texto libre opcional
 * @param {string} [usuario]   email del actor (data._sesEmail); si falta, "sistema"
 */
function writeAuditLog(accion, entidad, entidadId, detalle, usuario) {
  try {
    var sheet = _auditSheet();
    sheet.appendRow([
      _auditNextId(sheet),
      new Date().toISOString(),
      String(accion || ""),
      String(entidad || ""),
      String(entidadId || ""),
      String(usuario || "sistema"),
      String(detalle || ""),
    ]);
  } catch (e) {
    Logger.log("writeAuditLog fallo (ignorado): " + e);
  }
}

/**
 * Variante con detalle campo-a-campo (antes/después). Reutiliza writeAuditLog.
 */
function writeAuditLogDetail(accion, entidad, entidadId, campo, valorAnterior, valorNuevo, usuario) {
  var detalle = String(campo || "") + ": " + String(valorAnterior || "") + " → " + String(valorNuevo || "");
  writeAuditLog(accion, entidad, entidadId, detalle, usuario);
}
