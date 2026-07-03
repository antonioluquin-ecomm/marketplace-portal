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
const HOJA_RELEVAMIENTO_PERFIL = "relevamientos_perfil";

function doPost(e) {
  try {
    const raw = e && e.postData ? e.postData.contents : "";
    const data = JSON.parse(raw || "{}");

    // ── Rutas de autenticación (Auth.gs) — nuevas, no pisan tipo_formulario ──
    if (data.action) {
      return jsonResponse(routeAuthAction(data));
    }

    const tipoFormulario = normalizarTipoFormulario(data.tipo_formulario);

    if (tipoFormulario === "relevamiento_profile_save") {
      validarSesionSellerParaFormulario(tipoFormulario, data, String(data.seller_id || "").trim());
      const resultadoPerfil = upsertPerfilRelevamiento(data);
      return jsonResponse({
        ok: true,
        status: "ok",
        tipo_formulario: tipoFormulario,
        seller_id: resultadoPerfil.seller_id,
        accion: resultadoPerfil.accion,
        hoja: resultadoPerfil.hoja,
        fila: resultadoPerfil.fila,
        estado_relevamiento: resultadoPerfil.estado_relevamiento,
        completitud: resultadoPerfil.completitud,
        fecha_ultima_actualizacion: resultadoPerfil.fecha_ultima_actualizacion,
      });
    }

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

    if (tipoFormulario === "tarifas_update") {
      validarWriteSecret(data);
      return jsonResponse(actualizarTarifas(data));
    }

    if (tipoFormulario === "override_update") {
      validarWriteSecret(data);
      return jsonResponse(actualizarOverridesSeller(data));
    }

    if (tipoFormulario === "logo_upload") {
      validarWriteSecret(data);
      return jsonResponse(subirLogoAGitHub(data));
    }

    const sellerId = String(data.seller_id || "").trim();

    if (!sellerId) {
      throw new Error("Falta seller_id en el formulario");
    }

    validarSesionSellerParaFormulario(tipoFormulario, data, sellerId);

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
      throw new Error("tipo_formulario invalido. Usar 'seller', 'gestion_seller', 'calificacion', 'relevamiento', 'relevamiento_profile_save', 'gantt_task_update', 'gantt_task_create' o 'gantt_task_disable'.");
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

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || "").trim().toLowerCase();

    if (action === "relevamiento_profile_get") {
      validarSesionSellerParaLectura(params, String(params.seller_id || "").trim());
      return jsonResponse(obtenerPerfilRelevamiento(params));
    }
  } catch (err) {
    console.error("Error en doGet:", err.toString());
    return errorResponse(err);
  }

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

// Valida la clave de escritura para operaciones sensibles.
// Si WRITE_SECRET no está configurado en Script Properties, se omite (retro-compat).
function validarWriteSecret(data) {
  const esperado = PropertiesService.getScriptProperties().getProperty("WRITE_SECRET");
  if (!esperado) return;
  const recibido = String(data.write_secret || "").trim();
  if (recibido !== esperado) throw new Error("Clave de escritura inválida");
}

// Etapa 3 — anti-impersonación: los formularios de seller (calificación y
// relevamiento) exigen sesión válida cuyo seller_id coincida con el del
// formulario. Los Administradores (id_rol=1, ej. desde gestion-sellers.html)
// quedan exceptuados. Depende de _validateSessionToken (Auth.gs, mismo proyecto).
var TIPOS_FORMULARIO_SELLER = ["calificacion", "relevamiento", "relevamiento_profile_save"];

function validarSesionSellerParaFormulario(tipoFormulario, data, sellerId) {
  if (TIPOS_FORMULARIO_SELLER.indexOf(tipoFormulario) === -1) return;

  const sesVal = _validateSessionToken(data.session_token);
  if (!sesVal.ok) {
    throw new Error("Sesión requerida para enviar este formulario. Iniciá sesión de nuevo.");
  }

  const esAdmin = sesVal.id_rol === 1;
  if (!esAdmin) {
    if (!sesVal.seller_id || sesVal.seller_id.toUpperCase() !== sellerId.toUpperCase()) {
      throw new Error("No autorizado a enviar este formulario para este seller.");
    }
  }
}

// Etapa 5 — mismo criterio para lecturas de datos de seller (ej.
// relevamiento_profile_get): exige sesión válida cuyo seller_id coincida con
// el pedido. Admin (id_rol=1) exceptuado. Sirve tanto para doGet (params) como
// para doPost (data) porque ambos traen session_token en el mismo campo.
function validarSesionSellerParaLectura(data, sellerId) {
  const sesVal = _validateSessionToken(data.session_token);
  if (!sesVal.ok) {
    throw new Error("Sesión requerida para consultar estos datos. Iniciá sesión de nuevo.");
  }
  const esAdmin = sesVal.id_rol === 1;
  if (!esAdmin) {
    if (!sesVal.seller_id || sesVal.seller_id.toUpperCase() !== sellerId.toUpperCase()) {
      throw new Error("No autorizado a consultar los datos de este seller.");
    }
  }
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
    ["relevamiento_profile_save", "relevamiento_perfil_save", "profile_save"].includes(tipo)
  )
    return "relevamiento_profile_save";
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

  if (["tarifas_update", "tarifas"].includes(tipo)) return "tarifas_update";

  if (["override_update", "override", "overrides", "override_seller"].includes(tipo))
    return "override_update";

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

// Etapa 6 — lectura de sellers gateada por sesión (reemplaza el CSV publicado
// de la hoja sellers, que quedará despublicado). Sellers ven solo su propia
// fila (data._sesSellerId, inyectado por routeAuthAction en Auth.gs); staff
// (sin seller_id en la sesión) ve todas las filas.
function getSellersAction(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = obtenerHojaSellersConHeaders(ss);
  const headers = obtenerHeaders(ws);
  const lastRow = ws.getLastRow();
  const rows = lastRow > 1 ? ws.getRange(2, 1, lastRow - 1, headers.length).getValues() : [];
  const todos = rows.map(r => rowToObject(headers, r)).filter(o => o.seller_id);

  if (data._sesSellerId) {
    const propio = todos.find(r => String(r.seller_id || "").trim().toUpperCase() === data._sesSellerId.toUpperCase());
    return { ok: true, data: propio ? [propio] : [] };
  }
  return { ok: true, data: todos };
}

// Misma normalización de encabezados que usa el frontend (gantt-operativo.html,
// función norm()) — la hoja timeline tiene headers con mayúsculas/espacios
// ("ID Tarea", "Seller / Marca", "Depende de"...), a diferencia de sellers
// que ya son snake_case. Sin esto, rowToObject devolvería claves como
// "ID Tarea" en vez de "id_tarea".
function _normHeaderKeyGantt(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// Etapa 6 — lectura de timeline (Gantt) gateada por sesión (reemplaza el CSV
// publicado de la hoja timeline). Sellers ven solo sus propias tareas; staff
// (sin seller_id en la sesión) ve todas.
function getGanttAction(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_TIMELINE);
  if (!ws) return { ok: true, data: [] };

  const lastCol = ws.getLastColumn();
  const lastRow = ws.getLastRow();
  if (lastCol === 0 || lastRow < 2) return { ok: true, data: [] };

  const headers = ws.getRange(1, 1, 1, lastCol).getValues()[0].map(_normHeaderKeyGantt);
  const rows = ws.getRange(2, 1, lastRow - 1, lastCol).getValues();
  let todos = rows
    .map(r => rowToObject(headers, r))
    .filter(o => o.seller_id || o.task_id || o.id_tarea);

  if (data._sesSellerId) {
    todos = todos.filter(o => String(o.seller_id || "").trim().toUpperCase() === data._sesSellerId.toUpperCase());
  }
  return { ok: true, data: todos };
}

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

  if (data._sesSellerId) {
    const propio = todos.find(r => String(r.seller_id || "").trim().toUpperCase() === data._sesSellerId.toUpperCase());
    return { ok: true, data: propio ? [propio] : [] };
  }
  return { ok: true, data: todos };
}

// Etapa 6d — lectura de relevamientos gateada por sesión (reemplaza el CSV
// publicado, que contiene datos de contacto/negocio detallados por seller:
// CUIT, contactos comercial/técnico/ops/admin, stack tecnológico, prácticas
// de catálogo/stock/precios/logística). Sellers ven solo sus propios envíos
// (puede haber más de uno histórico); staff ve todos. Headers ya son
// snake_case (HEADERS_RELEVAMIENTO), sin necesidad de normalizar.
function getRelevamientosAction(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_RELEVAMIENTO);
  if (!ws) return { ok: true, data: [] };

  const lastCol = ws.getLastColumn();
  const lastRow = ws.getLastRow();
  if (lastCol === 0 || lastRow < 2) return { ok: true, data: [] };

  const headers = ws.getRange(1, 1, 1, lastCol).getValues()[0];
  const rows = ws.getRange(2, 1, lastRow - 1, lastCol).getValues();
  let todos = rows.map(r => rowToObject(headers, r)).filter(o => o.seller_id);

  if (data._sesSellerId) {
    todos = todos.filter(o => String(o.seller_id || "").trim().toUpperCase() === data._sesSellerId.toUpperCase());
  }
  return { ok: true, data: todos };
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
// Backend aislado para Relevamiento Perfil. No participa del submit historico
// `tipo_formulario = "relevamiento"` ni dispara sus efectos secundarios.
function obtenerPerfilRelevamiento(params) {
  const sellerId = normalizarSellerIdPerfil(params && params.seller_id);
  if (!sellerId) throw new Error("Falta seller_id");

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  validarSellerExisteParaPerfil(ss, sellerId, "draft");

  const ws = obtenerHojaPerfilRelevamiento(ss);
  const rowNumber = buscarFilaPerfilSeller(ws, sellerId);

  if (!rowNumber) {
    return {
      ok: true,
      status: "ok",
      tipo_formulario: "relevamiento_profile_get",
      seller_id: sellerId,
      exists: false,
    };
  }

  const headers = obtenerHeadersPerfil(ws);
  const values = ws.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
  const rowObj = rowToObject(headers, values);

  return {
    ok: true,
    status: "ok",
    tipo_formulario: "relevamiento_profile_get",
    seller_id: sellerId,
    exists: true,
    profile: construirProfileResponse(rowObj),
    metadata: {
      estado_relevamiento: rowObj.estado_relevamiento || "",
      completitud: rowObj.completitud || "",
      fecha_ultima_actualizacion: rowObj.fecha_ultima_actualizacion || "",
      modo_guardado: rowObj.modo_guardado || "",
      payload_version: rowObj.payload_version || "",
    },
  };
}

function upsertPerfilRelevamiento(data) {
  const sellerId = normalizarSellerIdPerfil(data && data.seller_id);
  if (!sellerId) throw new Error("Falta seller_id");

  const modoGuardado = normalizarModoGuardadoPerfil(data && data.modo_guardado);
  const fields = validarFieldsPerfil(data && data.fields);
  const clearFields = validarClearFieldsPerfil(data && data.clear_fields);

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  validarSellerExisteParaPerfil(ss, sellerId, modoGuardado);

  const ws = obtenerHojaPerfilRelevamiento(ss);
  const headers = obtenerHeadersPerfil(ws);
  const now = fechaHoraPerfil();
  const rowNumber = buscarFilaPerfilSeller(ws, sellerId);
  const allowlist = obtenerCamposPermitidosPerfil();

  let currentObj = {};
  let accion = "creado";

  if (rowNumber) {
    const currentValues = ws.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
    currentObj = rowToObject(headers, currentValues);
    accion = "actualizado";
  }

  const finalObj = {};
  headers.forEach((header) => {
    finalObj[header] = currentObj[header] || "";
  });

  finalObj.seller_id = sellerId;
  finalObj.fecha_creacion = currentObj.fecha_creacion || now;
  finalObj.fecha_ultima_actualizacion = now;
  finalObj.modo_guardado = modoGuardado;
  finalObj.payload_version = limpiarValor(data && data.payload_version) || "relevamiento_profile_v1";
  finalObj.ultima_accion = rowNumber ? "updated" : "created";
  finalObj.actualizado_por = limpiarValor(data && data.actualizado_por) || (modoGuardado === "migration" ? "migration" : "public_form");

  allowlist.forEach((fieldName) => {
    if (!Object.prototype.hasOwnProperty.call(fields, fieldName)) return;

    const incoming = limpiarValor(fields[fieldName]);
    const shouldClear =
      clearFields.includes(fieldName) || (modoGuardado === "final" && incoming === "");

    if (incoming !== "") {
      finalObj[fieldName] = incoming;
    } else if (shouldClear) {
      finalObj[fieldName] = "";
    }
  });

  aplicarProgresoClientePerfil(finalObj, data && data.client_progress);

  const completitud = calcularCompletitudPerfil(finalObj);
  finalObj.completitud = completitud + "%";
  finalObj.estado_relevamiento = obtenerEstadoPerfil(completitud, modoGuardado);

  if (modoGuardado === "migration") {
    finalObj.origen_ultima_fila_historica = limpiarValor(data && data.origen_ultima_fila_historica);
    finalObj.historial_count = limpiarValor(data && data.historial_count);
    finalObj.ultima_accion = rowNumber ? "updated_from_migration" : "migrated";
  }

  if (rowNumber) {
    ws.getRange(rowNumber, 1, 1, headers.length).setValues([
      headers.map((header) => limpiarValor(finalObj[header])),
    ]);
  } else {
    ws.appendRow(headers.map((header) => limpiarValor(finalObj[header])));
  }

  return {
    seller_id: sellerId,
    hoja: HOJA_RELEVAMIENTO_PERFIL,
    accion: accion,
    fila: rowNumber || ws.getLastRow(),
    estado_relevamiento: finalObj.estado_relevamiento,
    completitud: finalObj.completitud,
    fecha_ultima_actualizacion: finalObj.fecha_ultima_actualizacion,
  };
}

function obtenerHojaPerfilRelevamiento(ss) {
  let ws = ss.getSheetByName(HOJA_RELEVAMIENTO_PERFIL);
  const headers = obtenerHeadersEsperadosPerfilRelevamiento();

  if (!ws) {
    ws = ss.insertSheet(HOJA_RELEVAMIENTO_PERFIL);
    ws.appendRow(headers);
    ws.setFrozenRows(1);
    formatearHoja(ws, headers.length);
    return ws;
  }

  asegurarHeadersPerfilNoDestructivo(ws, headers);
  return ws;
}

function asegurarHeadersPerfilNoDestructivo(ws, headersEsperados) {
  const lastColumn = ws.getLastColumn();

  if (lastColumn === 0) {
    ws.appendRow(headersEsperados);
    ws.setFrozenRows(1);
    formatearHoja(ws, headersEsperados.length);
    return;
  }

  const headersActuales = obtenerHeadersPerfil(ws);
  const faltantes = headersEsperados.filter((h) => !headersActuales.includes(h));

  if (faltantes.length) {
    ws.getRange(1, lastColumn + 1, 1, faltantes.length).setValues([faltantes]);
    formatearHoja(ws, lastColumn + faltantes.length);
  }
}

function obtenerHeadersPerfil(ws) {
  const lastColumn = ws.getLastColumn();
  if (lastColumn === 0) return [];
  return ws.getRange(1, 1, 1, lastColumn).getValues()[0].map((h) => limpiarValor(h));
}

function obtenerHeadersEsperadosPerfilRelevamiento() {
  return [
    "seller_id",
    "fecha_creacion",
    "fecha_ultima_actualizacion",
    "estado_relevamiento",
    "completitud",
    "modo_guardado",
    "payload_version",
    "ultima_accion",
    "actualizado_por",
    "secciones_completas",
    "secciones_pendientes",
    "origen_ultima_fila_historica",
    "historial_count",
  ].concat(obtenerCamposPermitidosPerfil());
}

function obtenerCamposPermitidosPerfil() {
  return HEADERS_RELEVAMIENTO.filter(
    (header) =>
      ![
        "seller_id",
        "fecha_envio",
        "estado_relevamiento",
        "completitud",
      ].includes(header),
  );
}

function buscarFilaPerfilSeller(ws, sellerId) {
  const values = ws.getDataRange().getValues();
  if (values.length < 2) return null;

  const headers = values[0].map((h) => limpiarValor(h));
  const sellerCol = headers.indexOf("seller_id");
  if (sellerCol === -1) return null;

  const target = normalizarSellerIdPerfil(sellerId);
  for (let i = values.length - 1; i >= 1; i--) {
    if (normalizarSellerIdPerfil(values[i][sellerCol]) === target) return i + 1;
  }

  return null;
}

function calcularCompletitudPerfil(profileObj) {
  const campos = obtenerCamposPermitidosPerfil();
  const total = campos.length;
  if (!total) return 0;

  const completos = campos.filter((campo) => limpiarValor(profileObj[campo]) !== "").length;
  return Math.round((completos / total) * 100);
}

function normalizarSellerIdPerfil(valor) {
  return String(valor || "").trim().toUpperCase();
}

function normalizarModoGuardadoPerfil(valor) {
  const modo = String(valor || "draft").trim().toLowerCase();
  if (["draft", "final", "migration"].includes(modo)) return modo;
  throw new Error("modo_guardado invalido");
}

function validarFieldsPerfil(fields) {
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    throw new Error("fields debe ser un objeto");
  }

  const permitidos = obtenerCamposPermitidosPerfil();
  Object.keys(fields).forEach((fieldName) => {
    if (!permitidos.includes(fieldName)) {
      throw new Error("Campo no permitido en relevamiento_profile_save: " + fieldName);
    }
  });

  return fields;
}

function validarClearFieldsPerfil(clearFields) {
  if (clearFields === undefined || clearFields === null || clearFields === "") return [];
  if (!Array.isArray(clearFields)) throw new Error("clear_fields debe ser un array");

  const permitidos = obtenerCamposPermitidosPerfil();
  return clearFields.map((fieldName) => limpiarValor(fieldName)).filter(Boolean).map((fieldName) => {
    if (!permitidos.includes(fieldName)) {
      throw new Error("Campo no permitido en clear_fields: " + fieldName);
    }
    return fieldName;
  });
}

function validarSellerExisteParaPerfil(ss, sellerId, modoGuardado) {
  if (modoGuardado === "migration") return true;

  const ws = ss.getSheetByName(HOJA_SELLERS);
  if (!ws) throw new Error("seller_id no encontrado en sellers");

  const values = ws.getDataRange().getValues();
  if (values.length < 2) throw new Error("seller_id no encontrado en sellers");

  const headers = values[0].map((h) => limpiarValor(h));
  const sellerCol = headers.indexOf("seller_id");
  if (sellerCol === -1) throw new Error("seller_id no encontrado en sellers");

  const target = normalizarSellerIdPerfil(sellerId);
  const exists = values.slice(1).some((row) => normalizarSellerIdPerfil(row[sellerCol]) === target);
  if (!exists) throw new Error("seller_id no encontrado en sellers");

  return true;
}

function aplicarProgresoClientePerfil(finalObj, clientProgress) {
  if (!clientProgress || typeof clientProgress !== "object" || Array.isArray(clientProgress)) return;

  if (Array.isArray(clientProgress.secciones_completas)) {
    finalObj.secciones_completas = clientProgress.secciones_completas.map((v) => limpiarValor(v)).filter(Boolean).join(", ");
  }

  if (Array.isArray(clientProgress.secciones_pendientes)) {
    finalObj.secciones_pendientes = clientProgress.secciones_pendientes.map((v) => limpiarValor(v)).filter(Boolean).join(", ");
  }
}

function obtenerEstadoPerfil(completitud, modoGuardado) {
  if (modoGuardado === "final" && completitud >= 80) return "En revision";
  return obtenerEstado(completitud);
}

function construirProfileResponse(rowObj) {
  const profile = {};
  obtenerCamposPermitidosPerfil().forEach((fieldName) => {
    profile[fieldName] = rowObj[fieldName] || "";
  });
  return profile;
}

function fechaHoraPerfil() {
  return Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");
}

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

function subirLogoAGitHub(data) {
  const pat = PropertiesService.getScriptProperties().getProperty("GITHUB_PAT");
  if (!pat) throw new Error("GITHUB_PAT no configurado en Script Properties");

  const sellerId = String(data.seller_id || "").trim();
  const fileName = String(data.file_name || "").trim();
  const base64   = String(data.file_base64 || "").trim();

  if (!sellerId || !fileName || !base64) {
    throw new Error("Faltan campos: seller_id, file_name o file_base64");
  }

  const repo   = "antonioluquin-ecomm/marketplace-portal";
  const branch = "main";
  const path   = "assets/logos/" + fileName;
  const apiUrl = "https://api.github.com/repos/" + repo + "/contents/" + path;

  const headers = {
    Authorization: "token " + pat,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  let sha;
  try {
    const check = UrlFetchApp.fetch(apiUrl, { headers: headers, muteHttpExceptions: true });
    if (check.getResponseCode() === 200) {
      sha = JSON.parse(check.getContentText()).sha;
    }
  } catch (_) {}

  const body = { message: "logo: agrega logo para " + sellerId, content: base64, branch: branch };
  if (sha) body.sha = sha;

  const res = UrlFetchApp.fetch(apiUrl, {
    method: "put",
    headers: headers,
    payload: JSON.stringify(body),
    muteHttpExceptions: true,
  });

  const status = res.getResponseCode();
  if (status !== 200 && status !== 201) {
    const err = JSON.parse(res.getContentText() || "{}");
    throw new Error(err.message || "GitHub API error " + status);
  }

  return { ok: true, seller_id: sellerId, file: fileName };
}
