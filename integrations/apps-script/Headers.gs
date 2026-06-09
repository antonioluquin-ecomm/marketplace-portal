/**
 * SPORTING MARKETPLACE - Apps Script HTTP responses
 *
 * Helpers de salida para mantener estable el contrato del Web App.
 */

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function errorResponse(err) {
  return jsonResponse({
    ok: false,
    status: "error",
    error: err && err.message ? err.message : err.toString(),
    message: err.toString(),
  });
}
