/**
 * SPORTING MARKETPLACE — Sellers.gs
 * Dominio: alta/edición de sellers, sync y lectura (getSellersAction).
 */



// ───────────────────────────────────────────────
// GESTIÓN DE SELLERS — ALTA / EDICIÓN
// ───────────────────────────────────────────────
function upsertSeller(sellerId, d, options) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = obtenerHojaSellersConHeaders(ss);

  const now = fechaActualSimple();
  const existingRow = buscarFilaPorSellerId(ws, sellerId);
  const incoming = construirSellerDesdePayload(sellerId, d);

  validarSeller(incoming, existingRow);

  const headersActuales = obtenerHeaders(ws);

  if (existingRow) {
    const currentValues = ws
      .getRange(existingRow, 1, 1, headersActuales.length)
      .getValues()[0];
    const currentObj = rowToObj(headersActuales, currentValues);

    const finalObj = Object.assign({}, currentObj);

    CAMPOS_SELLERS_EDITABLES.forEach((header) => {
      const nuevo = limpiarValor(incoming[header]);
      if (nuevo !== "") finalObj[header] = nuevo;
    });

    finalObj.seller_id = sellerId;
    finalObj.fecha_alta = currentObj.fecha_alta || now;
    finalObj.fecha_ultima_actualizacion = now;
    finalObj.activo = limpiarValor(finalObj.activo) || "SI";

    escribirObjetoEnFila(ws, existingRow, finalObj);

    return {
      hoja: HOJA_SELLERS,
      accion: "actualizado",
      fila: existingRow,
      fecha_ultima_actualizacion: now,
    };
  }

  const newObj = {};
  HEADERS_SELLERS.forEach((header) => {
    newObj[header] = limpiarValor(incoming[header]);
  });

  newObj.seller_id = sellerId;
  newObj.fecha_alta = now;
  newObj.fecha_ultima_actualizacion = now;
  newObj.estado_pipeline = newObj.estado_pipeline || "identificados";
  newObj.prioridad = newObj.prioridad || "Media";
  newObj.sitio_objetivo = newObj.sitio_objetivo || "Sporting";
  newObj.activo = newObj.activo || "SI";

  agregarObjetoComoFila(ws, newObj);

  return {
    hoja: HOJA_SELLERS,
    accion: "creado",
    fila: ws.getLastRow(),
    fecha_alta: now,
  };
}

function sincronizarSellerDesdeFuente(sellerId, d, fuente) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = obtenerHojaSellersConHeaders(ss);
  const now = fechaActualSimple();
  const existingRow = buscarFilaPorSellerId(ws, sellerId);

  const incoming = construirSellerDesdePayload(sellerId, d);

  if (fuente === "calificacion") {
    incoming.estado_pipeline = "evaluación";
  }

  if (fuente === "relevamiento") {
    incoming.estado_pipeline = "en relevamiento";
  }

  if (!existingRow) {
    // Crea una ficha mínima si llegó una calificación/relevamiento para un seller aún no registrado.
    if (!incoming.seller_nombre) incoming.seller_nombre = d.nombre || "Seller sin nombre";
    incoming.fecha_alta = now;
    incoming.fecha_ultima_actualizacion = now;
    incoming.prioridad = incoming.prioridad || "Media";
    incoming.sitio_objetivo = incoming.sitio_objetivo || "Sporting";
    incoming.activo = "SI";

    agregarObjetoComoFila(ws, incoming);

    return {
      hoja: HOJA_SELLERS,
      accion: "creado_desde_" + fuente,
      fila: ws.getLastRow(),
    };
  }

  const headersActuales = obtenerHeaders(ws);
  const currentValues = ws
    .getRange(existingRow, 1, 1, headersActuales.length)
    .getValues()[0];
  const currentObj = rowToObj(headersActuales, currentValues);
  const finalObj = Object.assign({}, currentObj);

  // En sincronización automática solo completa vacíos. No pisa gestión manual.
  CAMPOS_SELLERS_AUTOCOMPLETAR.forEach((header) => {
    const actual = limpiarValor(finalObj[header]);
    const nuevo = limpiarValor(incoming[header]);
    if (!actual && nuevo) finalObj[header] = nuevo;
  });

  finalObj.seller_id = sellerId;
  finalObj.fecha_alta = currentObj.fecha_alta || now;
  finalObj.fecha_ultima_actualizacion = now;
  finalObj.activo = limpiarValor(finalObj.activo) || "SI";

  escribirObjetoEnFila(ws, existingRow, finalObj);

  return {
    hoja: HOJA_SELLERS,
    accion: "sincronizado_desde_" + fuente,
    fila: existingRow,
  };
}

function construirSellerDesdePayload(sellerId, d) {
  const obj = {
    seller_id: normalizarSellerId(sellerId),
    seller_nombre: pickPrimero([d.seller_nombre, d.nombre, d.marca, d.nombre_seller]),
    empresa_grupo: pickPrimero([d.empresa_grupo, d.grupo, d.empresa, d.razon_social]),
    marca_seller_operativo: pickPrimero([
      d.marca_seller_operativo,
      d.marca_operativa,
      d.marca,
      d.nombre,
      d.seller_nombre,
    ]),
    url_seller: pickPrimero([d.url_seller, d.web, d.seller_url, d.website]),
    categoria_estimada: pickPrimero([
      d.categoria_estimada,
      d.categorias,
      d.categoria,
      d.rubro,
    ]),
    plataforma_estimada: pickPrimero([d.plataforma_estimada, d.plataforma]),
    modelo_integracion_estimado: pickPrimero([
      d.modelo_integracion_estimado,
      d.modelo_integracion,
      d.modelo_sugerido,
      d.metodo_integracion,
    ]),
    estado_pipeline: normalizarEstadoPipeline(d.estado_pipeline),
    prioridad: normalizarPrioridad(d.prioridad),
    sitio_objetivo: normalizarSitioObjetivo(d.sitio_objetivo),
    responsable: limpiarValor(d.responsable),
    contacto_nombre: limpiarValor(d.contacto_nombre),
    contacto_email: limpiarValor(d.contacto_email),
    contacto_tel: limpiarValor(d.contacto_tel || d.contacto_whatsapp || d.telefono),
    fecha_alta: limpiarValor(d.fecha_alta),
    fecha_ultima_actualizacion: limpiarValor(d.fecha_ultima_actualizacion),
    proximo_paso: limpiarValor(d.proximo_paso || d["próximo_paso"]),
    observaciones: limpiarValor(d.observaciones || d.comentarios),
    activo: normalizarActivo(d.activo),
  };

  return obj;
}

function validarSeller(obj, existingRow) {
  if (!obj.seller_id) throw new Error("Falta seller_id");

  if (!existingRow && !obj.seller_nombre) {
    throw new Error("Para crear un seller nuevo debe informarse seller_nombre");
  }

  if (obj.contacto_email && !emailValido(obj.contacto_email)) {
    throw new Error("contacto_email no tiene un formato válido");
  }
}

function normalizarSellerId(valor) {
  return String(valor || "").trim().toUpperCase();
}

function normalizarEstadoPipeline(valor) {
  const raw = limpiarValor(valor);
  const n = normalizarTexto(raw);
  if (!n) return "";

  const mapa = {
    identificado: "identificados",
    identificados: "identificados",
    contacto: "contactos",
    contactado: "contactos",
    contactos: "contactos",
    evaluacion: "evaluación",
    "en evaluacion": "evaluación",
    evaluación: "evaluación",
    relevamiento: "en relevamiento",
    "en relevamiento": "en relevamiento",
    aprobado: "aprobado para integrar",
    "aprobado para integrar": "aprobado para integrar",
    integracion: "en integración",
    "en integracion": "en integración",
    "en integración": "en integración",
    live: "live",
    pausado: "pausado",
    descartado: "descartado",
  };

  return mapa[n] || raw;
}

function normalizarPrioridad(valor) {
  const raw = limpiarValor(valor);
  const n = normalizarTexto(raw);
  if (!n) return "";
  if (n === "alta" || n === "alto") return "Alta";
  if (n === "media" || n === "medio") return "Media";
  if (n === "baja" || n === "bajo") return "Baja";
  return raw;
}

function normalizarSitioObjetivo(valor) {
  const raw = limpiarValor(valor);
  const n = normalizarTexto(raw);
  if (!n) return "";
  if (n.includes("amb")) return "Ambos";
  if (n.includes("woker")) return "Woker";
  if (n.includes("sporting")) return "Sporting";
  return raw;
}

function normalizarActivo(valor) {
  const raw = limpiarValor(valor);
  const n = normalizarTexto(raw);
  if (!n) return "";
  if (["si", "sí", "s", "true", "1", "activo"].includes(n)) return "SI";
  if (["no", "n", "false", "0", "inactivo"].includes(n)) return "NO";
  return raw;
}

// Etapa 6 — lectura de sellers gateada por sesión (reemplaza el CSV publicado
// de la hoja sellers, que quedará despublicado). Sellers ven solo su propia
// fila (data._sesSellerId, inyectado por routeAuthAction en Auth.gs); staff
// (sin seller_id en la sesión) ve todas las filas, o una si pasa
// target_seller_id (Etapa 9a — selector de "ver como seller").
function getSellersAction(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = obtenerHojaSellersConHeaders(ss);
  const headers = obtenerHeaders(ws);
  const lastRow = ws.getLastRow();
  const rows = lastRow > 1 ? ws.getRange(2, 1, lastRow - 1, headers.length).getValues() : [];
  const todos = rows.map(r => rowToObj(headers, r)).filter(o => o.seller_id);
  return { ok: true, data: _aplicarSellerScope(data, todos) };
}

function obtenerHojaSellersConHeaders(ss) {
  let ws = ss.getSheetByName(HOJA_SELLERS);

  if (!ws) {
    ws = ss.insertSheet(HOJA_SELLERS);
    ws.appendRow(HEADERS_SELLERS);
    ws.setFrozenRows(1);
    formatearHoja(ws, HEADERS_SELLERS.length);
    return ws;
  }

  asegurarHeadersNoDestructivo(ws, HEADERS_SELLERS);
  return ws;
}
