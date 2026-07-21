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
 * target_seller_id. Se valida además que ese seller_id esté habilitado para
 * este módulo (hoy solo Taika) — lista fácil de extender sin rediseñar nada.
 */

// TODO: reemplazar por el seller_id real de Taika Sport en la hoja USUARIOS.
var CATALOGO_SELLER_HABILITADOS = ["TAIKA"];

function _catalogoSellerResolverTarget_(data) {
  var scope = _resolverSellerScope(data);
  var sellerId = scope.locked ? scope.sellerId : scope.target;
  if (!sellerId) {
    throw new Error("Elegí un seller para ver su catálogo.");
  }
  if (CATALOGO_SELLER_HABILITADOS.indexOf(sellerId.toUpperCase()) === -1) {
    throw new Error("Este módulo todavía no está habilitado para este seller.");
  }
  return sellerId.toUpperCase();
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
