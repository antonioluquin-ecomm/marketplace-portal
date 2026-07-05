/**
 * SPORTING MARKETPLACE - Apps Script utils
 *
 * Helpers genericos sin side effects de negocio.
 */

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function fechaActualSimple() {
  return Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd");
}

function rowToObj(headers, row) {
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] =
      row[i] !== undefined && row[i] !== null ? String(row[i]).trim() : "";
  });
  return obj;
}

function pickPrimero(valores) {
  for (const valor of valores) {
    const limpio = limpiarValor(valor);
    if (limpio) return limpio;
  }
  return "";
}

function limpiarValor(valor) {
  if (valor === null || valor === undefined) return "";

  if (Array.isArray(valor)) {
    return valor
      .map((v) => String(v || "").trim())
      .filter(Boolean)
      .join(", ");
  }

  return String(valor).trim();
}

function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


// ───────────────────────────────────────────────
// BÚSQUEDAS EN SHEETS
// ───────────────────────────────────────────────
function buscarUltimoRegistroPorSeller(ss, nombreHoja, sellerId) {
  const ws = ss.getSheetByName(nombreHoja);
  if (!ws) return {};

  const values = ws.getDataRange().getValues();
  if (values.length < 2) return {};

  const headers = values[0].map((h) => String(h || "").trim());
  const sellerCol = headers.indexOf("seller_id");
  if (sellerCol === -1) return {};

  for (let i = values.length - 1; i >= 1; i--) {
    if (normalizarSellerId(values[i][sellerCol]) === normalizarSellerId(sellerId)) {
      return rowToObj(headers, values[i]);
    }
  }

  return {};
}

function buscarFilaPorSellerId(ws, sellerId) {
  const values = ws.getDataRange().getValues();
  if (values.length < 2) return null;

  const headers = values[0].map((h) => String(h || "").trim());
  const sellerCol = headers.indexOf("seller_id");
  if (sellerCol === -1) return null;

  for (let i = values.length - 1; i >= 1; i--) {
    if (normalizarSellerId(values[i][sellerCol]) === normalizarSellerId(sellerId)) {
      return i + 1;
    }
  }

  return null;
}

// ───────────────────────────────────────────────
// HOJAS / HEADERS
// ───────────────────────────────────────────────

// Etapa 9a — resuelve el alcance de seller de una request de lectura/escritura.
// - Sesión de seller (data._sesSellerId truthy, inyectado por routeAuthAction):
//   queda "locked" a su propio seller_id e IGNORA cualquier target_seller_id
//   del body (anti-spoofing: un seller no puede pedir datos de otro).
// - Sesión de staff (sin seller_id): puede pasar target_seller_id opcional para
//   ver un seller puntual (selector de "ver como seller"); sin target ve todo.
function _resolverSellerScope(data) {
  if (data._sesSellerId) {
    return { locked: true, sellerId: String(data._sesSellerId).trim() };
  }
  return { locked: false, target: String(data.target_seller_id || "").trim() };
}

// Aplica el alcance resuelto a una lista de objetos con .seller_id.
function _aplicarSellerScope(data, lista) {
  const scope = _resolverSellerScope(data);
  const filtro = scope.locked ? scope.sellerId : scope.target;
  if (!filtro) return lista; // staff sin target: todo
  const filtroUp = filtro.toUpperCase();
  return lista.filter(o => String(o.seller_id || "").trim().toUpperCase() === filtroUp);
}

function asegurarHeadersNoDestructivo(ws, headersEsperados) {
  const lastColumn = ws.getLastColumn();

  if (lastColumn === 0) {
    ws.appendRow(headersEsperados);
    ws.setFrozenRows(1);
    formatearHoja(ws, headersEsperados.length);
    return;
  }

  const headersActuales = obtenerHeaders(ws);
  const faltantes = headersEsperados.filter((h) => !headersActuales.includes(h));

  if (faltantes.length) {
    ws.getRange(1, lastColumn + 1, 1, faltantes.length).setValues([faltantes]);
    formatearHoja(ws, lastColumn + faltantes.length);
  }
}

function obtenerHeaders(ws) {
  const lastColumn = ws.getLastColumn();
  if (lastColumn === 0) return [];
  return ws
    .getRange(1, 1, 1, lastColumn)
    .getValues()[0]
    .map((h) => String(h || "").trim());
}

function agregarObjetoComoFila(ws, obj) {
  asegurarHeadersNoDestructivo(ws, HEADERS_SELLERS);
  const headers = obtenerHeaders(ws);
  ws.appendRow(headers.map((h) => limpiarValor(obj[h])));
}

function escribirObjetoEnFila(ws, rowNumber, obj) {
  const headers = obtenerHeaders(ws);
  const fila = headers.map((h) => limpiarValor(obj[h]));
  ws.getRange(rowNumber, 1, 1, headers.length).setValues([fila]);
}

function obtenerHojaConHeaders(ss, nombreHoja, headersEsperados) {
  let ws = ss.getSheetByName(nombreHoja);

  if (!ws) {
    ws = ss.insertSheet(nombreHoja);
    ws.appendRow(headersEsperados);
    ws.setFrozenRows(1);
    formatearHoja(ws, headersEsperados.length);
    return ws;
  }

  asegurarHeaders(ws, nombreHoja, headersEsperados);
  return ws;
}

function asegurarHeaders(ws, nombreHoja, headersEsperados) {
  const lastColumn = ws.getLastColumn();

  if (lastColumn === 0) {
    ws.appendRow(headersEsperados);
    ws.setFrozenRows(1);
    formatearHoja(ws, headersEsperados.length);
    return;
  }

  const headersActuales = ws.getRange(1, 1, 1, lastColumn).getValues()[0];

  const iguales =
    headersActuales.length === headersEsperados.length &&
    headersActuales.every((h, i) => h === headersEsperados[i]);

  if (!iguales) {
    const backupName =
      nombreHoja +
      "_backup_" +
      Utilities.formatDate(new Date(), TIMEZONE, "yyyyMMdd_HHmmss");

    ws.copyTo(ws.getParent()).setName(backupName);

    ws.clear();
    ws.appendRow(headersEsperados);
    ws.setFrozenRows(1);
    formatearHoja(ws, headersEsperados.length);
  }
}

function formatearHoja(ws, totalColumnas) {
  const headerRange = ws.getRange(1, 1, 1, totalColumnas);

  headerRange
    .setFontWeight("bold")
    .setBackground("#5ea832")
    .setFontColor("#ffffff");

  ws.setFrozenRows(1);
  ws.autoResizeColumns(1, totalColumnas);
}

// ───────────────────────────────────────────────
// LIMPIEZA / COMPLETITUD / ESTADOS
// ───────────────────────────────────────────────
function calcularCompletitudPorHeaders(d, headers, ignorar) {
  const campos = headers.filter((h) => !ignorar.includes(h));
  const total = campos.length;

  if (total === 0) return 0;

  const completos = campos.filter(
    (campo) => limpiarValor(d[campo]) !== "",
  ).length;

  return Math.round((completos / total) * 100);
}

function obtenerEstado(completitud) {
  if (completitud >= 80) return "Completo";
  if (completitud >= 50) return "Parcial";
  return "Incompleto";
}
