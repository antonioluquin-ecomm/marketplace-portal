/**
 * SPORTING MARKETPLACE — Apps Script
 * Versión v5 — Sellers + Calificación + Relevamiento + Definición Técnica
 *
 * Soporta:
 * - Gestión de Sellers       -> hoja "sellers"
 * - Formulario 1: Calificación inicial  -> hoja "calificaciones"
 * - Formulario 2: Relevamiento completo -> hoja "relevamientos"
 * - Output interno: Definición técnica   -> hoja "definicion_tecnica"
 *
 * Importante:
 * - No cambiar SPREADSHEET_ID si se usa la misma base actual.
 * - Gestión Sellers debe enviar: tipo_formulario = "seller" o "gestion_seller"
 * - Formulario 1 debe enviar: tipo_formulario = "calificacion"
 * - Formulario 2 debe enviar: tipo_formulario = "relevamiento"
 */

// ── CONFIG ──────────────────────────────────────
// ───────────────────────────────────────────────
// ENTRY POINT
// ───────────────────────────────────────────────
function doPost(e) {
  try {
    const raw = e && e.postData ? e.postData.contents : "";
    const data = JSON.parse(raw || "{}");

    const tipoFormulario = normalizarTipoFormulario(data.tipo_formulario);

    if (tipoFormulario === "gantt_task_update") {
      const resultadoGantt = actualizarTareaGantt(data);
      return jsonResponse({
        ok: true,
        task_id: resultadoGantt.task_id,
        updated_fields: resultadoGantt.updated_fields,
      });
    }

    if (tipoFormulario === "gantt_task_create") {
      const resultadoGantt = crearTareaGantt(data);
      return jsonResponse({
        ok: true,
        task_id: resultadoGantt.task_id,
        created_fields: resultadoGantt.created_fields,
        row_number: resultadoGantt.row_number,
        message: "Tarea Gantt creada",
      });
    }

    if (tipoFormulario === "gantt_task_disable") {
      const resultadoGantt = darDeBajaTareaGantt(data);
      return jsonResponse({
        ok: true,
        task_id: resultadoGantt.task_id,
        disabled_fields: resultadoGantt.disabled_fields,
        row_number: resultadoGantt.row_number,
        message: "Tarea Gantt dada de baja logicamente",
      });
    }

    const sellerId = String(data.seller_id || "").trim();

    if (!sellerId) {
      throw new Error("Falta seller_id en el formulario");
    }

    let resultado;

    if (tipoFormulario === "seller") {
      resultado = upsertSeller(sellerId, data, { modo: "gestion" });
    } else if (tipoFormulario === "calificacion") {
      resultado = escribirEnCalificaciones(sellerId, data);

      // Sincroniza datos básicos con la hoja sellers sin pisar datos manuales existentes.
      resultado.seller_sync = sincronizarSellerDesdeFuente(sellerId, data, "calificacion");

      enviarNotificacionCalificacion(sellerId, data, resultado);
    } else if (tipoFormulario === "relevamiento") {
      resultado = escribirEnRelevamientos(sellerId, data);

      // Sincroniza datos básicos con la hoja sellers sin pisar datos manuales existentes.
      resultado.seller_sync = sincronizarSellerDesdeFuente(sellerId, data, "relevamiento");

      // Al recibir el relevamiento completo, se genera o actualiza la definición técnica inicial.
      const definicion = upsertDefinicionTecnica(sellerId, data, resultado);
      resultado.definicion_tecnica = definicion;

      enviarNotificacionRelevamiento(sellerId, data, resultado);
    } else {
      throw new Error("tipo_formulario invalido. Usar 'seller', 'gestion_seller', 'calificacion', 'relevamiento', 'gantt_task_update', 'gantt_task_create' o 'gantt_task_disable'.");
    }

    return jsonResponse({
      ok: true,
      status: "ok",
      seller_id: sellerId,
      tipo_formulario: tipoFormulario,
      fecha_envio: resultado.fecha_envio,
      estado: resultado.estado,
      completitud: resultado.completitud,
      hoja: resultado.hoja,
      accion: resultado.accion || null,
      fila: resultado.fila || null,
      seller_sync: resultado.seller_sync || null,
      definicion_tecnica: resultado.definicion_tecnica || null,
    });
  } catch (err) {
    console.error("Error en doPost:", err.toString());

    return errorResponse(err);
  }
}

function doGet() {
  return jsonResponse({
    status: "ok",
    message: "Apps Script activo - Marketplace Sporting",
    hojas: [
      HOJA_SELLERS,
      HOJA_CALIFICACIONES,
      HOJA_RELEVAMIENTO,
      HOJA_DEFINICION_TECNICA,
    ],
  });
}

function normalizarTipoFormulario(valor) {
  const tipo = String(valor || "")
    .trim()
    .toLowerCase();

  if (!tipo) return "relevamiento";
  if (
    ["seller", "gestion_seller", "gestión_seller", "gestion", "alta_seller", "edicion_seller", "edición_seller"].includes(tipo)
  )
    return "seller";
  if (
    ["calificacion", "calificación", "formulario_1", "form1", "f1"].includes(
      tipo,
    )
  )
    return "calificacion";
  if (["relevamiento", "formulario_2", "form2", "f2"].includes(tipo))
    return "relevamiento";
  if (
    ["gantt_task_update", "gantt_update", "timeline_update"].includes(tipo)
  )
    return "gantt_task_update";
  if (
    ["gantt_task_create", "gantt_create", "timeline_create"].includes(tipo)
  )
    return "gantt_task_create";
  if (
    ["gantt_task_disable", "gantt_disable", "timeline_disable"].includes(tipo)
  )
    return "gantt_task_disable";

  return tipo;
}


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
    const currentObj = rowToObject(headersActuales, currentValues);

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
  const currentObj = rowToObject(headersActuales, currentValues);
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

// ───────────────────────────────────────────────
// FORMULARIO 1 — CALIFICACIONES
// ───────────────────────────────────────────────
function escribirEnCalificaciones(sellerId, d) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = obtenerHojaConHeaders(
    ss,
    HOJA_CALIFICACIONES,
    HEADERS_CALIFICACIONES,
  );

  const fechaEnvio = Utilities.formatDate(
    new Date(),
    TIMEZONE,
    "yyyy-MM-dd HH:mm:ss",
  );

  const completitud = calcularCompletitudPorHeaders(d, HEADERS_CALIFICACIONES, [
    "seller_id",
    "fecha_envio",
    "estado_calificacion",
    "completitud",
    "resultado_sugerido",
    "modelo_sugerido",
    "riesgo_logistico",
  ]);

  const estadoCalificacion = obtenerEstado(completitud);
  const resultadoSugerido = calcularResultadoSugerido(d);
  const modeloSugerido = calcularModeloSugerido(d);
  const riesgoLogistico = calcularRiesgoLogistico(d);

  const fila = HEADERS_CALIFICACIONES.map((header) => {
    if (header === "seller_id") return sellerId;
    if (header === "fecha_envio") return fechaEnvio;
    if (header === "estado_calificacion") return estadoCalificacion;
    if (header === "completitud") return completitud + "%";
    if (header === "resultado_sugerido") return resultadoSugerido;
    if (header === "modelo_sugerido") return modeloSugerido;
    if (header === "riesgo_logistico") return riesgoLogistico;
    return limpiarValor(d[header]);
  });

  ws.appendRow(fila);

  return {
    hoja: HOJA_CALIFICACIONES,
    fecha_envio: fechaEnvio,
    estado: estadoCalificacion,
    completitud: completitud + "%",
    resultado_sugerido: resultadoSugerido,
    modelo_sugerido: modeloSugerido,
    riesgo_logistico: riesgoLogistico,
  };
}

// ───────────────────────────────────────────────
// FORMULARIO 2 — RELEVAMIENTOS
// ───────────────────────────────────────────────
function escribirEnRelevamientos(sellerId, d) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = obtenerHojaConHeaders(ss, HOJA_RELEVAMIENTO, HEADERS_RELEVAMIENTO);

  const fechaEnvio = Utilities.formatDate(
    new Date(),
    TIMEZONE,
    "yyyy-MM-dd HH:mm:ss",
  );

  const completitud = calcularCompletitudPorHeaders(d, HEADERS_RELEVAMIENTO, [
    "seller_id",
    "fecha_envio",
    "estado_relevamiento",
    "completitud",
  ]);

  const estadoRelevamiento = obtenerEstado(completitud);

  const fila = HEADERS_RELEVAMIENTO.map((header) => {
    if (header === "seller_id") return sellerId;
    if (header === "fecha_envio") return fechaEnvio;
    if (header === "estado_relevamiento") return estadoRelevamiento;
    if (header === "completitud") return completitud + "%";
    return limpiarValor(d[header]);
  });

  ws.appendRow(fila);

  return {
    hoja: HOJA_RELEVAMIENTO,
    fecha_envio: fechaEnvio,
    estado: estadoRelevamiento,
    completitud: completitud + "%",
  };
}

// ───────────────────────────────────────────────
// DEFINICIÓN TÉCNICA — UPSERT POST RELEVAMIENTO
// ───────────────────────────────────────────────
function upsertDefinicionTecnica(
  sellerId,
  relevamientoData,
  resultadoRelevamiento,
) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = obtenerHojaConHeaders(
    ss,
    HOJA_DEFINICION_TECNICA,
    HEADERS_DEFINICION_TECNICA,
  );

  const fechaGeneracion = Utilities.formatDate(
    new Date(),
    TIMEZONE,
    "yyyy-MM-dd HH:mm:ss",
  );

  const seller = buscarUltimoRegistroPorSeller(ss, HOJA_SELLERS, sellerId);
  const calificacion = buscarUltimoRegistroPorSeller(
    ss,
    HOJA_CALIFICACIONES,
    sellerId,
  );

  const nombreSeller =
    pickPrimero([
      relevamientoData.nombre,
      calificacion.nombre,
      seller.nombre,
      seller.marca,
      seller.seller_nombre,
    ]) || "";

  const resultadoCalificacion = pickPrimero([
    calificacion.resultado_sugerido,
    calificacion.resultado_calificacion,
  ]);

  const modeloSugerido = pickPrimero([
    calificacion.modelo_sugerido,
    calcularModeloSugerido(relevamientoData),
  ]);

  const riesgoLogistico = pickPrimero([
    calificacion.riesgo_logistico,
    calcularRiesgoLogisticoDesdeRelevamiento(relevamientoData),
  ]);

  const complejidadGeneral = calcularComplejidadGeneral(
    relevamientoData,
    calificacion,
  );

  const modeloDefinidoInicial = modeloSugerido || "A definir";

  const filaObj = {
    seller_id: sellerId,
    fecha_generacion: fechaGeneracion,
    fecha_ultima_actualizacion: fechaGeneracion,
    estado_definicion: "Pendiente de análisis",
    nombre_seller: nombreSeller,

    resultado_calificacion: resultadoCalificacion || "",
    modelo_sugerido: modeloSugerido || "",
    riesgo_logistico: riesgoLogistico || "",
    complejidad_general: complejidadGeneral,

    modelo_integracion_definido: modeloDefinidoInicial,

    plataforma: relevamientoData.plataforma || "",
    erp: relevamientoData.erp || "",
    api: relevamientoData.api || "",
    metodo_integracion_relevado: relevamientoData.metodo_integracion || "",
    operador_logistico: relevamientoData.operador_logistico || "",
    entrega_pais: relevamientoData.entrega_pais || "",
    skus_estimados: relevamientoData.skus_estimados || "",
    frec_actualizacion: relevamientoData.frec_actualizacion || "",
    frec_stock: relevamientoData.frec_stock || "",
    frec_precios: relevamientoData.frec_precios || "",

    alcance_catalogo: sugerirAlcanceCatalogo(relevamientoData),
    alcance_stock: sugerirAlcanceStock(relevamientoData),
    alcance_precio: sugerirAlcancePrecio(relevamientoData),
    alcance_pedidos: sugerirAlcancePedidos(relevamientoData),
    alcance_logistica: sugerirAlcanceLogistica(relevamientoData),
    alcance_devoluciones: sugerirAlcanceDevoluciones(relevamientoData),
    alcance_facturacion: sugerirAlcanceFacturacion(relevamientoData),
    alcance_conciliacion: "A definir",

    responsable_marketplace: pickPrimero([
      seller.responsable,
      seller.responsable_marketplace,
      seller.owner,
    ]),
    responsable_seller: pickPrimero([
      relevamientoData.contacto_nombre,
      relevamientoData.contacto_comercial_nombre,
      calificacion.contacto_nombre,
    ]),
    responsable_tecnico: pickPrimero([
      relevamientoData.contacto_tec_nombre,
      "",
    ]),

    requerimientos_seller: sugerirRequerimientosSeller(relevamientoData),
    requerimientos_sporting: sugerirRequerimientosSporting(relevamientoData),
    desarrollos_necesarios: sugerirDesarrollosNecesarios(
      relevamientoData,
      modeloSugerido,
    ),
    integraciones_necesarias: sugerirIntegracionesNecesarias(
      relevamientoData,
      modeloSugerido,
    ),

    bloqueantes: sugerirBloqueantes(relevamientoData),
    riesgos: sugerirRiesgos(relevamientoData, riesgoLogistico),
    pendientes: "Revisar definición técnica y confirmar alcance con el equipo.",
    proximo_paso:
      "Analizar relevamiento completo y confirmar modelo de integración.",
    fecha_estimada_inicio: "",
    fecha_estimada_go_live: "",

    observaciones:
      "Fila generada automáticamente desde el relevamiento completo. Completar decisión final de forma interna.",
  };

  const existingRow = buscarFilaPorSellerId(ws, sellerId);

  if (existingRow) {
    // Actualiza solo campos base y preserva decisiones manuales si ya existen.
    const rowValues = ws
      .getRange(existingRow, 1, 1, HEADERS_DEFINICION_TECNICA.length)
      .getValues()[0];
    const currentObj = rowToObject(HEADERS_DEFINICION_TECNICA, rowValues);

    const finalObj = {};
    HEADERS_DEFINICION_TECNICA.forEach((header) => {
      const nuevo = filaObj[header] || "";
      const actual = currentObj[header] || "";

      // Preservar campos manuales si ya tienen valor.
      if (CAMPOS_MANUALES_DEFINICION.includes(header) && actual) {
        finalObj[header] = actual;
      } else {
        finalObj[header] = nuevo || actual;
      }
    });

    finalObj.fecha_ultima_actualizacion = fechaGeneracion;

    ws.getRange(existingRow, 1, 1, HEADERS_DEFINICION_TECNICA.length).setValues(
      [HEADERS_DEFINICION_TECNICA.map((h) => limpiarValor(finalObj[h]))],
    );

    return {
      hoja: HOJA_DEFINICION_TECNICA,
      accion: "actualizada",
      fila: existingRow,
    };
  }

  ws.appendRow(HEADERS_DEFINICION_TECNICA.map((h) => limpiarValor(filaObj[h])));

  return {
    hoja: HOJA_DEFINICION_TECNICA,
    accion: "creada",
    fila: ws.getLastRow(),
  };
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
      return rowToObject(headers, values[i]);
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

// ───────────────────────────────────────────────
// LÓGICA DE DECISIÓN — FORMULARIO 1
// ───────────────────────────────────────────────
function calcularResultadoSugerido(d) {
  const plataforma = normalizarTexto(d.plataforma);
  const enviaPais = normalizarTexto(d.envia_pais);
  const operador = normalizarTexto(d.operador_logistico);
  const skus = normalizarTexto(d.skus_estimados);

  const usaVtex = plataforma.includes("vtex");
  const carrierIntegrado =
    operador.includes("andreani") ||
    operador.includes("oca") ||
    operador.includes("ocasa");

  const carrierNoDefinido =
    operador.includes("no definido") ||
    operador.includes("a definir") ||
    operador === "";

  const noEnviaPais = enviaPais.includes("no") || enviaPais.includes("parcial");

  const volumenAlto =
    skus.includes("mas de 2000") ||
    skus.includes("más de 2000") ||
    skus.includes(">2000");

  if (usaVtex && carrierIntegrado && !noEnviaPais) {
    return "Apto rápido";
  }

  if (usaVtex || carrierIntegrado) {
    return "Apto con relevamiento técnico";
  }

  if (volumenAlto || carrierNoDefinido || noEnviaPais) {
    return "Complejo / estratégico";
  }

  return "Apto con relevamiento técnico";
}

function calcularModeloSugerido(d) {
  const plataforma = normalizarTexto(d.plataforma);
  const erp = normalizarTexto(d.erp);
  const api = normalizarTexto(d.api);
  const metodo = normalizarTexto(d.metodo_integracion);

  if (plataforma.includes("vtex")) {
    return "VTEX → VTEX";
  }

  if (
    api.includes("si") ||
    api.includes("sí") ||
    metodo.includes("api") ||
    plataforma.includes("shopify") ||
    plataforma.includes("woocommerce") ||
    plataforma.includes("tiendanube") ||
    plataforma.includes("magento") ||
    plataforma.includes("salesforce") ||
    plataforma.includes("ecommerce") ||
    erp.includes("si") ||
    erp.includes("sí")
  ) {
    return "API / Integración a evaluar";
  }

  if (
    plataforma.includes("no tengo") ||
    plataforma.includes("no tiene") ||
    plataforma.includes("ninguna")
  ) {
    return "Manual / Carga asistida";
  }

  return "A definir en relevamiento";
}

function calcularRiesgoLogistico(d) {
  const operador = normalizarTexto(d.operador_logistico);
  const enviaPais = normalizarTexto(d.envia_pais);
  const origen = normalizarTexto(d.origen_despacho);

  const carrierIntegrado =
    operador.includes("andreani") ||
    operador.includes("oca") ||
    operador.includes("ocasa");

  const otroCarrier =
    operador.includes("otro") ||
    operador.includes("otros") ||
    operador.includes("carrier externo");

  const noDefinido =
    operador.includes("no definido") ||
    operador.includes("a definir") ||
    operador === "";

  const multiDeposito =
    origen.includes("mas de un") ||
    origen.includes("más de un") ||
    origen.includes("multiple") ||
    origen.includes("múltiple");

  const noPais = enviaPais.includes("no") || enviaPais.includes("parcial");

  if (carrierIntegrado && !multiDeposito && !noPais) {
    return "Bajo";
  }

  if (carrierIntegrado || multiDeposito) {
    return "Medio";
  }

  if (otroCarrier || noDefinido || noPais) {
    return "Alto";
  }

  return "Medio";
}

function calcularRiesgoLogisticoDesdeRelevamiento(d) {
  return calcularRiesgoLogistico({
    operador_logistico: d.operador_logistico,
    envia_pais: d.entrega_pais,
    origen_despacho: d.despacho_origen,
  });
}

function calcularComplejidadGeneral(relevamientoData, calificacion) {
  const modelo = normalizarTexto(
    calificacion.modelo_sugerido || calcularModeloSugerido(relevamientoData),
  );
  const riesgo = normalizarTexto(
    calificacion.riesgo_logistico ||
      calcularRiesgoLogisticoDesdeRelevamiento(relevamientoData),
  );
  const skus = normalizarTexto(relevamientoData.skus_estimados);

  if (
    riesgo.includes("alto") ||
    modelo.includes("api") ||
    skus.includes("mas de 2000") ||
    skus.includes("más de 2000")
  ) {
    return "Alta";
  }

  if (
    riesgo.includes("medio") ||
    modelo.includes("a evaluar") ||
    modelo.includes("manual")
  ) {
    return "Media";
  }

  return "Baja";
}

// ───────────────────────────────────────────────
// SUGERENCIAS DEFINICIÓN TÉCNICA
// ───────────────────────────────────────────────
function sugerirAlcanceCatalogo(d) {
  const gestion = normalizarTexto(d.gestion_catalogo);
  const excel = normalizarTexto(d.catalogo_excel);
  const imagenes = normalizarTexto(d.imagenes);

  const puntos = [];
  puntos.push("Relevar estructura de producto/SKU y atributos obligatorios.");
  if (excel.includes("si") || excel.includes("sí"))
    puntos.push("Carga inicial por archivo.");
  if (gestion.includes("api"))
    puntos.push("Evaluar integración de catálogo vía API.");
  if (!imagenes.includes("si") && !imagenes.includes("sí"))
    puntos.push("Validar disponibilidad de imágenes.");
  return puntos.join(" ");
}

function sugerirAlcanceStock(d) {
  const stockTipo = normalizarTexto(d.stock_tipo);
  const frecStock = limpiarValor(d.frec_stock);

  if (stockTipo.includes("no"))
    return "Definir esquema de stock disponible para Marketplace.";
  if (frecStock)
    return (
      "Integrar o actualizar stock según frecuencia relevada: " +
      frecStock +
      "."
    );
  return "Definir origen y frecuencia de actualización de stock.";
}

function sugerirAlcancePrecio(d) {
  const gestionPrecios = normalizarTexto(d.gestion_precios);
  const frecPrecios = limpiarValor(d.frec_precios);

  if (gestionPrecios.includes("manual"))
    return "Gestionar precios mediante carga manual o archivo controlado.";
  if (gestionPrecios.includes("api"))
    return "Evaluar integración de precios vía API.";
  if (frecPrecios)
    return "Actualizar precios según frecuencia relevada: " + frecPrecios + ".";
  return "Definir mecanismo de actualización de precios.";
}

function sugerirAlcancePedidos(d) {
  const recibe = normalizarTexto(d.recibe_pedidos_ext);
  const estados = normalizarTexto(d.informa_estados);
  const tracking = normalizarTexto(d.informa_tracking);

  const puntos = [];
  puntos.push("Definir flujo de recepción y gestión de pedidos.");
  if (recibe.includes("si") || recibe.includes("sí"))
    puntos.push(
      "Validar si el seller puede recibir pedidos por sistema externo.",
    );
  if (estados.includes("si") || estados.includes("sí"))
    puntos.push("Relevar estados disponibles para integración.");
  if (tracking.includes("si") || tracking.includes("sí"))
    puntos.push("Relevar disponibilidad de tracking.");
  return puntos.join(" ");
}

function sugerirAlcanceLogistica(d) {
  const operador = limpiarValor(d.operador_logistico);
  const entregaPais = limpiarValor(d.entrega_pais);
  const despacho = limpiarValor(d.despacho_origen);

  return (
    "Validar operador logístico (" +
    (operador || "sin dato") +
    "), cobertura (" +
    (entregaPais || "sin dato") +
    ") y origen de despacho (" +
    (despacho || "sin dato") +
    ")."
  );
}

function sugerirAlcanceDevoluciones(d) {
  const acepta = normalizarTexto(d.acepta_devol);
  const resp = limpiarValor(d.resp_log_inv);

  if (acepta.includes("no"))
    return "Definir política mínima de devolución para operar en Marketplace.";
  return (
    "Definir flujo de devoluciones y responsable de logística inversa" +
    (resp ? ": " + resp + "." : ".")
  );
}

function sugerirAlcanceFacturacion(d) {
  const emite = normalizarTexto(d.emite_factura);
  const auto = normalizarTexto(d.factura_auto);

  if (emite.includes("no")) return "Revisar facturación antes de avanzar.";
  if (auto.includes("si") || auto.includes("sí"))
    return "Validar emisión automática de factura y disponibilidad de comprobante.";
  return "Definir mecanismo de emisión y envío de comprobantes.";
}

function sugerirRequerimientosSeller(d) {
  const req = [];
  req.push("Confirmar responsables comercial, técnico y operativo.");
  req.push("Entregar catálogo base con atributos mínimos.");
  req.push("Confirmar esquema de stock, precios, logística y devoluciones.");
  if (
    normalizarTexto(d.api).includes("si") ||
    normalizarTexto(d.api).includes("sí")
  ) {
    req.push("Compartir documentación técnica/API disponible.");
  }
  return req.join(" ");
}

function sugerirRequerimientosSporting(d) {
  return "Validar modelo de integración, alcance funcional, reglas operativas, pruebas end-to-end y criterios de go live.";
}

function sugerirDesarrollosNecesarios(d, modelo) {
  const m = normalizarTexto(modelo);
  const desarrollos = [];

  if (m.includes("vtex")) {
    desarrollos.push("Configuración y validación de integración VTEX → VTEX.");
  } else if (m.includes("api")) {
    desarrollos.push(
      "Evaluar desarrollo de integración API para catálogo, stock/precio y operación.",
    );
  } else if (m.includes("manual")) {
    desarrollos.push(
      "Preparar carga asistida/manual y validaciones operativas.",
    );
  } else {
    desarrollos.push("Definir desarrollos luego del análisis técnico.");
  }

  return desarrollos.join(" ");
}

function sugerirIntegracionesNecesarias(d, modelo) {
  const m = normalizarTexto(modelo);
  const integraciones = [];

  if (m.includes("vtex")) {
    integraciones.push("VTEX seller ↔ VTEX Marketplace.");
  }
  if (m.includes("api")) {
    integraciones.push("APIs / middleware a definir.");
  }
  if (
    normalizarTexto(d.informa_tracking).includes("si") ||
    normalizarTexto(d.informa_tracking).includes("sí")
  ) {
    integraciones.push("Tracking / estados logísticos.");
  }
  if (
    normalizarTexto(d.factura_auto).includes("si") ||
    normalizarTexto(d.factura_auto).includes("sí")
  ) {
    integraciones.push("Comprobantes / facturación.");
  }

  return integraciones.length ? integraciones.join(" ") : "A definir.";
}

function sugerirBloqueantes(d) {
  const bloqueantes = [];

  if (normalizarTexto(d.info_prod_completa).includes("no")) {
    bloqueantes.push("Información de producto incompleta.");
  }
  if (normalizarTexto(d.imagenes).includes("no")) {
    bloqueantes.push("Imágenes no disponibles.");
  }
  if (normalizarTexto(d.emite_factura).includes("no")) {
    bloqueantes.push("Facturación no resuelta.");
  }
  if (normalizarTexto(d.entrega_pais).includes("no")) {
    bloqueantes.push("Cobertura logística limitada.");
  }

  return bloqueantes.length
    ? bloqueantes.join(" ")
    : "Sin bloqueantes críticos detectados automáticamente.";
}

function sugerirRiesgos(d, riesgoLogistico) {
  const riesgos = [];

  if (riesgoLogistico)
    riesgos.push("Riesgo logístico: " + riesgoLogistico + ".");
  if (normalizarTexto(d.api).includes("no"))
    riesgos.push("No se identifica API disponible.");
  if (normalizarTexto(d.stock_tipo).includes("compartido"))
    riesgos.push("Stock compartido puede generar quiebres.");
  if (normalizarTexto(d.stock_seguridad).includes("no"))
    riesgos.push("No informa stock de seguridad.");

  return riesgos.length
    ? riesgos.join(" ")
    : "Sin riesgos críticos detectados automáticamente.";
}

// ───────────────────────────────────────────────
// EMAILS
// ───────────────────────────────────────────────
function enviarNotificacionCalificacion(sellerId, d, resultado) {
  const asunto = `[Marketplace] Nueva calificación inicial — ${d.nombre || "Seller"} (${sellerId})`;

  const cuerpo = `
Nueva calificación inicial recibida

ID interno: ${sellerId}
Fecha de envío: ${resultado.fecha_envio}
Estado: ${resultado.estado}
Completitud: ${resultado.completitud}

Resultado sugerido: ${resultado.resultado_sugerido}
Modelo sugerido: ${resultado.modelo_sugerido}
Riesgo logístico: ${resultado.riesgo_logistico}

Datos principales:
Empresa / Marca: ${d.nombre || ""}
Contacto: ${d.contacto_nombre || ""}
Email: ${d.contacto_email || ""}
Categorías: ${d.categorias || ""}
SKUs estimados: ${d.skus_estimados || ""}

Operación:
Vende online: ${d.vende_online || ""}
Canales de venta: ${d.canales_venta || ""}
Plataforma: ${d.plataforma || ""}
ERP / Sistema de gestión: ${d.erp || ""}

Logística:
Envía a todo el país: ${d.envia_pais || ""}
Origen de despacho: ${d.origen_despacho || ""}
Operador logístico: ${d.operador_logistico || ""}
Otro operador: ${d.otro_operador_logistico || ""}

Comentarios:
${d.comentarios || ""}

Ver hoja "${HOJA_CALIFICACIONES}" para consultar el detalle completo.
`;

  MailApp.sendEmail({
    to: EMAIL_NOTIFICACION,
    subject: asunto,
    body: cuerpo,
  });
}

function enviarNotificacionRelevamiento(sellerId, d, resultado) {
  const asunto = `[Marketplace] Nuevo relevamiento completo — ${d.nombre || "Seller"} (${sellerId})`;

  const definicion = resultado.definicion_tecnica
    ? `${resultado.definicion_tecnica.accion} en hoja "${resultado.definicion_tecnica.hoja}", fila ${resultado.definicion_tecnica.fila}`
    : "No generada";

  const cuerpo = `
Nuevo relevamiento completo recibido

ID interno: ${sellerId}
Fecha de envío: ${resultado.fecha_envio}
Estado: ${resultado.estado}
Completitud: ${resultado.completitud}

Definición técnica: ${definicion}

Datos principales:
Empresa: ${d.nombre || ""}
Razón social: ${d.razon_social || ""}
CUIT: ${d.cuit || ""}
Categorías: ${d.categorias || ""}
Tipo de empresa: ${d.tipo_empresa || ""}
Canal principal: ${d.canal_principal || ""}

Contacto principal:
Nombre: ${d.contacto_nombre || ""}
Email: ${d.contacto_email || ""}
Teléfono: ${d.contacto_tel || ""}

Tecnología:
Plataforma: ${d.plataforma || ""}
ERP / OMS: ${d.erp || ""}
API disponible: ${d.api || ""}
Método de integración preferido: ${d.metodo_integracion || ""}

Logística:
Entrega país: ${d.entrega_pais || ""}
Despacho desde: ${d.despacho_origen || ""}
Operador logístico: ${d.operador_logistico || ""}
Tiempo de despacho: ${d.tiempo_despacho || ""}

Ver hojas "${HOJA_RELEVAMIENTO}" y "${HOJA_DEFINICION_TECNICA}" para consultar el detalle.
`;

  MailApp.sendEmail({
    to: EMAIL_NOTIFICACION,
    subject: asunto,
    body: cuerpo,
  });
}


// ───────────────────────────────────────────────
// HEADERS — SELLERS / BACKLOG
// ───────────────────────────────────────────────
const HEADERS_SELLERS = [
  "seller_id",
  "seller_nombre",
  "empresa_grupo",
  "marca_seller_operativo",
  "url_seller",
  "categoria_estimada",
  "plataforma_estimada",
  "modelo_integracion_estimado",
  "estado_pipeline",
  "prioridad",
  "sitio_objetivo",
  "responsable",
  "contacto_nombre",
  "contacto_email",
  "contacto_tel",
  "fecha_alta",
  "fecha_ultima_actualizacion",
  "proximo_paso",
  "observaciones",
  "activo",
];

const CAMPOS_SELLERS_EDITABLES = [
  "seller_nombre",
  "empresa_grupo",
  "marca_seller_operativo",
  "url_seller",
  "categoria_estimada",
  "plataforma_estimada",
  "modelo_integracion_estimado",
  "estado_pipeline",
  "prioridad",
  "sitio_objetivo",
  "responsable",
  "contacto_nombre",
  "contacto_email",
  "contacto_tel",
  "proximo_paso",
  "observaciones",
  "activo",
];

const CAMPOS_SELLERS_AUTOCOMPLETAR = [
  "seller_nombre",
  "url_seller",
  "categoria_estimada",
  "plataforma_estimada",
  "modelo_integracion_estimado",
  "contacto_nombre",
  "contacto_email",
  "contacto_tel",
];

// ───────────────────────────────────────────────
// HEADERS — FORMULARIO 1
// ───────────────────────────────────────────────
const HEADERS_CALIFICACIONES = [
  "seller_id",
  "fecha_envio",
  "estado_calificacion",
  "completitud",

  "nombre",
  "contacto_nombre",
  "contacto_email",
  "categorias",
  "skus_estimados",

  "vende_online",
  "canales_venta",
  "plataforma",
  "erp",

  "envia_pais",
  "origen_despacho",
  "operador_logistico",
  "otro_operador_logistico",

  "comentarios",

  "resultado_sugerido",
  "modelo_sugerido",
  "riesgo_logistico",
];

// ───────────────────────────────────────────────
// HEADERS — DEFINICIÓN TÉCNICA
// ───────────────────────────────────────────────
const HEADERS_DEFINICION_TECNICA = [
  "seller_id",
  "fecha_generacion",
  "fecha_ultima_actualizacion",
  "estado_definicion",
  "nombre_seller",

  "resultado_calificacion",
  "modelo_sugerido",
  "riesgo_logistico",
  "complejidad_general",

  "modelo_integracion_definido",

  "plataforma",
  "erp",
  "api",
  "metodo_integracion_relevado",
  "operador_logistico",
  "entrega_pais",
  "skus_estimados",
  "frec_actualizacion",
  "frec_stock",
  "frec_precios",

  "alcance_catalogo",
  "alcance_stock",
  "alcance_precio",
  "alcance_pedidos",
  "alcance_logistica",
  "alcance_devoluciones",
  "alcance_facturacion",
  "alcance_conciliacion",

  "responsable_marketplace",
  "responsable_seller",
  "responsable_tecnico",

  "requerimientos_seller",
  "requerimientos_sporting",
  "desarrollos_necesarios",
  "integraciones_necesarias",

  "bloqueantes",
  "riesgos",
  "pendientes",
  "proximo_paso",
  "fecha_estimada_inicio",
  "fecha_estimada_go_live",

  "observaciones",
];

const CAMPOS_MANUALES_DEFINICION = [
  "estado_definicion",
  "modelo_integracion_definido",
  "alcance_catalogo",
  "alcance_stock",
  "alcance_precio",
  "alcance_pedidos",
  "alcance_logistica",
  "alcance_devoluciones",
  "alcance_facturacion",
  "alcance_conciliacion",
  "responsable_marketplace",
  "responsable_tecnico",
  "requerimientos_seller",
  "requerimientos_sporting",
  "desarrollos_necesarios",
  "integraciones_necesarias",
  "bloqueantes",
  "riesgos",
  "pendientes",
  "proximo_paso",
  "fecha_estimada_inicio",
  "fecha_estimada_go_live",
  "observaciones",
];

// ───────────────────────────────────────────────
// HEADERS — FORMULARIO 2 / V8
// ───────────────────────────────────────────────
const HEADERS_RELEVAMIENTO = [
  "seller_id",
  "fecha_envio",
  "estado_relevamiento",
  "completitud",

  // 1. DATOS GENERALES
  "nombre",
  "razon_social",
  "cuit",
  "web",
  "pais_provincia",
  "tipo_empresa",
  "canal_principal",
  "opera_marketplaces",
  "marketplaces_detalle",
  "categorias",

  // 2. CONTACTOS
  "contacto_nombre",
  "contacto_email",
  "contacto_tel",
  "contacto_cargo",
  "contacto_comercial_nombre",
  "contacto_comercial_email",
  "contacto_tec_nombre",
  "contacto_tec_email",
  "contacto_ops_nombre",
  "contacto_ops_email",
  "contacto_admin_nombre",
  "contacto_admin_email",

  // 3. TECNOLOGÍA E INTEGRACIÓN
  "plataforma",
  "erp",
  "erp_cual",
  "api",
  "api_alcance",
  "metodo_integracion",
  "equipo_tec",
  "recibe_pedidos_ext",
  "informa_estados",
  "informa_tracking",
  "frec_actualizacion",
  "obs_tecnologia",

  // 4. CATÁLOGO
  "skus_estimados",
  "variantes",
  "gestion_catalogo",
  "catalogo_excel",
  "info_prod_completa",
  "atributos_tecnicos",
  "imagenes",
  "imagenes_variante",
  "tabla_talles",
  "productos_variantes",
  "codigos_sku_ean",
  "productos_en_sporting",
  "restricciones_cat",
  "restricciones_cat_det",
  "obs_catalogo",

  // 5. STOCK Y PRECIOS
  "stock_tipo",
  "stock_exclusivo_mkt",
  "stock_seguridad",
  "stock_minimo_seguridad",
  "frec_stock",
  "gestion_stock",
  "stock_separado",
  "gestion_precios",
  "frec_precios",
  "precios_iva",
  "precios_canal",
  "promos",
  "promos_det",

  // 6. LOGÍSTICA
  "entrega_pais",
  "zonas",
  "localidad_despacho",
  "despacho_origen",
  "operador_logistico",
  "multi_operador_logistico",
  "dias_despacho",
  "tiempo_despacho",
  "cumple_sla_despacho",
  "tracking",
  "impresora",
  "etiquetado_requerido",
  "retiro_tienda",
  "puntos_retiro",
  "stock_retiro_tienda",
  "retiro_ops",
  "obs_logistica",

  // 7. DEVOLUCIONES Y POSTVENTA
  "acepta_devol",
  "log_devol",
  "resp_log_inv",
  "deposito_devol",
  "resp_validacion_devol",
  "tiempo_devol",
  "restr_devol",
  "restr_devol_det",
  "nota_credito",
  "condiciones_postventa",

  // 8. FACTURACIÓN Y CONDICIONES COMERCIALES
  "emite_factura",
  "factura_auto",
  "tipo_factura",
  "factura_formato",
  "nc_devol",
  "ticket_promedio",
  "gmv_estimado",
  "cuotas",
  "comision_mkt",
  "costo_financiero",
  "restricciones_com",
  "restricciones_com_det",

  // 9. OBSERVACIONES FINALES
  "limitaciones_actuales",
  "particularidades",
  "comentarios",
];
