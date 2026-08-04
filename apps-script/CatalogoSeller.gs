/**
 * SPORTING MARKETPLACE — CatalogoSeller.gs
 *
 * Módulo provisorio "Catálogo (Taika Sport)" — mientras se termina el Seller
 * Center definitivo (internal/seller-center/). Taika es el primer seller del
 * modelo "gestión asistida": sus productos se cargan directo en el catálogo
 * propio de Sporting en VTEX (no hay VTEX↔VTEX, no hay seller_id en VTEX) —
 * se identifican por un valor de especificación de producto ya asignado a
 * sus SKUs (ver docs/integracion-vtex-vtex.md Fase 4.1, mismo mecanismo que
 * el spec "Seller" del filtro "Vendido por").
 *
 * Este proyecto (marketplace-portal) NUNCA habla directo con la API de VTEX
 * ni guarda sus credenciales — proxea contra acciones service-to-service ya
 * expuestas por el repo hermano vtex-control-center (apps-script/CatalogoTaika.gs),
 * gateadas por TAIKA_SERVICE_TOKEN (mismo patrón que getPedidosClienteCache).
 *
 * Script Properties requeridas en ESTE proyecto:
 *   VTEXCC_APPS_SCRIPT_URL      — URL del Web App deployado de vtex-control-center
 *   VTEXCC_TAIKA_SERVICE_TOKEN  — debe matchear TAIKA_SERVICE_TOKEN allá
 *
 * Ownership: usa _resolverSellerScope (Helpers.gs) — el mismo mecanismo que
 * getSellersAction/getTarifasAction/getRelevamientosAction: sesión de seller
 * queda "locked" a su propio seller_id; staff en modo "ver como seller" pasa
 * target_seller_id. Se valida además que ese seller esté marcado con modelo
 * de integración "Gestión asistida" en la hoja SELLERS (mismo campo y misma
 * normalización que usa integracion-seller.html) — así cualquier seller que
 * se sume con ese modelo queda habilitado sin tocar código ni redeployar.
 *
 * IMPORTANTE: esta validación solo gatea el acceso en este proyecto. La
 * identificación de SKUs del lado de vtex-control-center (getTaikaCatalogProducts
 * y demás acciones "Taika*") sigue siendo específica de Taika hoy — sumar un
 * segundo seller de gestión asistida requiere trabajo en ese repo hermano
 * también (generalizar el mecanismo de spec value por seller).
 */

function _catalogoSellerModeloHabilitado_(sellerId) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var ws = obtenerHojaSellersConHeaders(ss);
  var headers = obtenerHeaders(ws);
  var lastRow = ws.getLastRow();
  var rows = lastRow > 1 ? ws.getRange(2, 1, lastRow - 1, headers.length).getValues() : [];
  var row = rows.map(function (r) { return rowToObj(headers, r); })
    .filter(function (o) { return String(o.seller_id || "").toUpperCase() === sellerId; })[0];
  if (!row) return false;

  var modelo = row.modelo_integracion_definido || row.modelo_integracion_estimado || row.modelo_integracion || "";
  var normalized = String(modelo).toLowerCase().normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]", "g"), "");
  return normalized.indexOf("gestion asistida") !== -1
    || normalized.indexOf("seller center") !== -1
    || normalized.indexOf("seller_center") !== -1;
}

function _catalogoSellerResolverTarget_(data) {
  var scope = _resolverSellerScope(data);
  var sellerId = scope.locked ? scope.sellerId : scope.target;
  if (!sellerId) {
    throw new Error("Elegí un seller para ver su catálogo.");
  }
  sellerId = sellerId.toUpperCase();
  if (!_catalogoSellerModeloHabilitado_(sellerId)) {
    throw new Error("Este módulo todavía no está habilitado para este seller.");
  }
  return sellerId;
}

function _callVtexControlCenter_(action, payload) {
  var props = PropertiesService.getScriptProperties();
  var url = props.getProperty("VTEXCC_APPS_SCRIPT_URL");
  var token = props.getProperty("VTEXCC_TAIKA_SERVICE_TOKEN");
  if (!url) throw new Error("Falta VTEXCC_APPS_SCRIPT_URL en Script Properties.");
  if (!token) throw new Error("Falta VTEXCC_TAIKA_SERVICE_TOKEN en Script Properties.");

  var body = Object.assign({ action: action, serviceToken: token }, payload || {});
  var resp = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,
    payload: JSON.stringify(body),
  });

  var status = resp.getResponseCode();
  var data;
  try { data = JSON.parse(resp.getContentText()); } catch (e) { data = null; }
  if (status < 200 || status >= 300 || !data) {
    throw new Error("Error al contactar vtex-control-center (HTTP " + status + ").");
  }
  if (!data.ok) throw new Error(data.error || "Error desconocido en vtex-control-center.");
  return data.data;
}

// ── Lectura (sesión seller, va por routeAuthAction como el resto de los get*) ──
function getCatalogoSellerProductsAction(data) {
  _catalogoSellerResolverTarget_(data); // valida acceso, no hace falta el valor acá
  var result = _callVtexControlCenter_("getTaikaCatalogProducts", {});
  return { ok: true, data: result };
}

// ── Escrituras (sesión seller + ownership, gateadas en WRITE_ACTIONS/Code.gs) ──
function _handleUpdateCatalogoSellerPrice(data) {
  var sellerId = _catalogoSellerResolverTarget_(data);
  var sku = String(data.sku || "").trim();
  if (!sku) throw new Error("Falta sku");
  var price = Number(data.price);
  if (!isFinite(price) || price < 0) throw new Error("Precio inválido");

  _callVtexControlCenter_("updateTaikaCatalogPrice", { sku: sku, price: price });
  writeAuditLog("updateCatalogoSellerPrice", "catalogo_seller", sku, sellerId + ":" + price, data._sesEmail);
  return { ok: true, sku: sku, price: price };
}

function _handleUpdateCatalogoSellerStock(data) {
  var sellerId = _catalogoSellerResolverTarget_(data);
  var sku = String(data.sku || "").trim();
  if (!sku) throw new Error("Falta sku");
  var stock = Number(data.stock);
  if (!isFinite(stock) || stock < 0) throw new Error("Stock inválido");

  _callVtexControlCenter_("updateTaikaCatalogStock", { sku: sku, quantity: stock });
  writeAuditLog("updateCatalogoSellerStock", "catalogo_seller", sku, sellerId + ":" + stock, data._sesEmail);
  return { ok: true, sku: sku, stock: stock };
}

function _handleImportCatalogoSellerBulk(data) {
  var sellerId = _catalogoSellerResolverTarget_(data);
  var rows = Array.isArray(data.rows) ? data.rows : [];
  if (!rows.length) throw new Error("El archivo importado no tiene filas válidas.");

  var cleanRows = rows.map(function (r) {
    var row = { sku: String(r.sku || "").trim() };
    if (r.price !== undefined && r.price !== "" && r.price !== null) row.price = Number(r.price);
    if (r.stock !== undefined && r.stock !== "" && r.stock !== null) row.stock = Number(r.stock);
    return row;
  }).filter(function (r) { return r.sku; });

  var result = _callVtexControlCenter_("bulkUpdateTaikaCatalog", { rows: cleanRows });
  writeAuditLog("importCatalogoSellerBulk", "catalogo_seller", sellerId, cleanRows.length + " filas, " + result.errors + " errores", data._sesEmail);
  return { ok: true, data: result };
}
