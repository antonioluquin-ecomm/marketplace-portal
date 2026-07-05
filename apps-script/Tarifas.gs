/**
 * SPORTING MARKETPLACE — Tarifas.gs
 * Dominio: tarifas + overrides por seller (lectura y escritura).
 */


// Etapa 6 — lectura de tarifas gateada por sesión (reemplaza el CSV
// publicado). Tabla global campo/valor, no es por-seller: cualquier sesión
// autenticada (staff o seller) recibe los mismos datos.
function getTarifasAction() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(HOJA_TARIFAS);
  if (!sheet) return { ok: true, data: [] };

  const allValues = sheet.getDataRange().getValues();
  const hi = allValues.findIndex(r => r.some(v => String(v).trim().toLowerCase() === "campo"));
  if (hi < 0) return { ok: true, data: [] };

  const headers = allValues[hi].map(v => String(v).trim().toLowerCase());
  const iCampo = headers.indexOf("campo");
  const iValor = headers.findIndex(h => h.includes("valor"));
  if (iCampo < 0 || iValor < 0) return { ok: true, data: [] };

  const todos = [];
  allValues.slice(hi + 1).forEach(row => {
    const campo = String(row[iCampo] || "").trim();
    if (!campo) return;
    todos.push({ campo: campo.toLowerCase(), valor: row[iValor] });
  });
  return { ok: true, data: todos };
}

// Etapa 6 — lectura de overrides por seller gateada por sesión (reemplaza el
// CSV publicado). Reutiliza normalizarHeaderOverride/campoOverrideDesdeHeader
// (ya usados por actualizarOverridesSeller) para ubicar la fila de
// encabezados real, que viene después de un banner + instrucciones.
function getOverridesAction(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(HOJA_OVERRIDES);
  if (!sheet) return { ok: true, data: [] };

  const allValues = sheet.getDataRange().getValues();
  const hi = allValues.findIndex(r => r.some(v => normalizarHeaderOverride(v) === "seller_id"));
  if (hi < 0) return { ok: true, data: [] };

  const headers = allValues[hi];
  const colDe = {};
  headers.forEach((h, i) => {
    const campo = campoOverrideDesdeHeader(h);
    if (campo && !(campo in colDe)) colDe[campo] = i;
  });
  if (!("_sid" in colDe)) return { ok: true, data: [] };

  const NOMBRE_CAMPO = { _sid: "seller_id", _snombre: "seller_nombre" };
  let todos = [];
  for (let i = hi + 1; i < allValues.length; i++) {
    const row = allValues[i];
    const sid = String(row[colDe._sid] || "").trim();
    if (!sid) continue;
    const obj = {};
    Object.keys(colDe).forEach(campo => {
      const key = NOMBRE_CAMPO[campo] || campo;
      obj[key] = String(row[colDe[campo]] || "").trim();
    });
    todos.push(obj);
  }

  return { ok: true, data: _aplicarSellerScope(data, todos) };
}

// ───────────────────────────────────────────────
// TARIFAS — ACTUALIZACIÓN DESDE FRONT
// ───────────────────────────────────────────────
function actualizarTarifas(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(HOJA_TARIFAS);
  if (!sheet) throw new Error("Hoja 'tarifas' no encontrada");

  const allValues = sheet.getDataRange().getValues();
  const hi = allValues.findIndex(r =>
    r.some(v => String(v).trim().toLowerCase() === "campo")
  );
  if (hi < 0) throw new Error("No se encontró fila de encabezados en hoja tarifas");

  const headers = allValues[hi].map(v => String(v).trim().toLowerCase());
  const iCampo = headers.indexOf("campo");
  const iValor = headers.findIndex(h => h.includes("valor"));
  if (iCampo < 0 || iValor < 0) throw new Error("Columnas 'campo' o 'valor vigente' no encontradas");

  const campos = data.campos || {};
  const updated = [];

  allValues.slice(hi + 1).forEach((row, i) => {
    const campo = String(row[iCampo] || "").trim().toLowerCase();
    if (campo in campos) {
      const sheetRow = hi + 2 + i; // 1-based
      const sheetCol = iValor + 1;  // 1-based
      sheet.getRange(sheetRow, sheetCol).setValue(Number(campos[campo]));
      updated.push({ campo, valor: Number(campos[campo]) });
    }
  });

  SpreadsheetApp.flush();
  return { ok: true, updated, total: updated.length, fecha: new Date().toISOString() };
}

// ───────────────────────────────────────────────
// OVERRIDES POR SELLER — UPSERT DESDE CONFIG-TARIFAS
// ───────────────────────────────────────────────
// La hoja "overrides" tiene formato ancho: una fila por seller, una columna
// por condición (Comisión override %, Bon. logíst. dir. %, etc.).
// Contrato del front (config-tarifas.html):
//   { tipo_formulario: "override_update", seller_id, seller_nombre, campos }
// En campos, "" significa "limpiar la celda" (vuelve a tarifa base).
function actualizarOverridesSeller(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(HOJA_OVERRIDES);
  if (!sheet) throw new Error("Hoja 'overrides' no encontrada");

  const sellerId = String(data.seller_id || "").trim();
  if (!sellerId) throw new Error("Falta seller_id en el override");

  const allValues = sheet.getDataRange().getValues();

  // La hoja tiene banner + fila de instrucciones antes de los encabezados reales
  const hi = allValues.findIndex(r =>
    r.some(v => normalizarHeaderOverride(v) === "seller_id")
  );
  if (hi < 0) throw new Error("No se encontró fila de encabezados (seller_id) en hoja overrides");

  const headers = allValues[hi];
  const colDe = {}; // campo interno → índice 0-based
  headers.forEach(function (h, i) {
    const campo = campoOverrideDesdeHeader(h);
    if (campo && !(campo in colDe)) colDe[campo] = i;
  });
  if (!("_sid" in colDe)) throw new Error("Columna seller_id no encontrada en hoja overrides");

  const campos = data.campos || {};
  const idNorm = sellerId.toLowerCase();
  let rowIndex = -1; // 1-based
  for (let i = hi + 1; i < allValues.length; i++) {
    if (String(allValues[i][colDe._sid] || "").trim().toLowerCase() === idNorm) {
      rowIndex = i + 1;
      break;
    }
  }

  let accion;
  if (rowIndex < 0) {
    const newRow = new Array(headers.length).fill("");
    newRow[colDe._sid] = sellerId;
    if ("_snombre" in colDe) newRow[colDe._snombre] = String(data.seller_nombre || "").trim();
    sheet.appendRow(newRow);
    rowIndex = sheet.getLastRow();
    accion = "creado";
  } else {
    accion = "actualizado";
    // Completa el nombre solo si la celda está vacía (no pisa datos manuales)
    if ("_snombre" in colDe && data.seller_nombre) {
      const celdaNombre = sheet.getRange(rowIndex, colDe._snombre + 1);
      if (!String(celdaNombre.getValue() || "").trim()) {
        celdaNombre.setValue(String(data.seller_nombre).trim());
      }
    }
  }

  const updated = [];
  Object.keys(campos).forEach(function (campo) {
    if (campo.indexOf("_") === 0 || !(campo in colDe)) return;
    const raw = campos[campo];
    let value;
    if (raw === "" || raw === null || raw === undefined) value = "";
    else if (campo === "notas") value = String(raw);
    else {
      value = Number(raw);
      if (!isFinite(value)) return;
    }
    sheet.getRange(rowIndex, colDe[campo] + 1).setValue(value);
    updated.push({ campo: campo, valor: value });
  });

  SpreadsheetApp.flush();
  return {
    ok: true,
    seller_id: sellerId,
    accion: accion,
    fila: rowIndex,
    hoja: HOJA_OVERRIDES,
    updated: updated,
    total: updated.length,
    fecha: new Date().toISOString(),
  };
}

function normalizarHeaderOverride(v) {
  return String(v || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[%$]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// Mismo criterio de detección por contenido que usa config-tarifas.html
function campoOverrideDesdeHeader(h) {
  const nk = normalizarHeaderOverride(h);
  if (!nk) return null;
  if (nk.indexOf("seller_id") >= 0) return "_sid";
  if (nk === "seller" || nk === "seller_nombre" || nk === "nombre") return "_snombre";
  if (nk.indexOf("comision") >= 0 && nk.indexOf("override") >= 0) return "comision_override";
  if (nk.indexOf("cuotas") >= 0 && nk.indexOf("max") >= 0) return "cuotas_max";
  if (nk.indexOf("notas") >= 0) return "notas";
  if (nk.indexOf("bon") >= 0) {
    if (nk.indexOf("dir") >= 0) return "bon_logistica_dir";
    if (nk.indexOf("inv") >= 0) return "bon_logistica_inv";
    if (nk.indexOf("catalog") >= 0) return "bon_catalogacion";
    if (nk.indexOf("fulfil") >= 0) return "bon_fulfillment";
    if (nk.indexOf("devol") >= 0) return "bon_gest_devol";
    if (nk.indexOf("soporte") >= 0) return "bon_soporte";
  }
  return null;
}
