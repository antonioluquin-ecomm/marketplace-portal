/**
 * SPORTING MARKETPLACE — DefinicionTecnica.gs
 * Dominio: generación de la definición técnica y sus sugeridores.
 */


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
    const currentObj = rowToObj(HEADERS_DEFINICION_TECNICA, rowValues);

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
    return "VTEX ↔ VTEX";
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
    return "Sistemas propios";
  }

  if (
    plataforma.includes("no tengo") ||
    plataforma.includes("no tiene") ||
    plataforma.includes("ninguna")
  ) {
    return "Seller Center";
  }

  return "A definir";
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
    desarrollos.push("Configuración y validación de integración VTEX ↔ VTEX.");
  } else if (m.includes("sistemas propios") || m.includes("sistemas_propios")) {
    desarrollos.push(
      "Evaluar desarrollo de integración API para catálogo, stock/precio y operación.",
    );
  } else if (m.includes("seller center") || m.includes("seller_center")) {
    desarrollos.push(
      "Preparar carga asistida/manual en Seller Center y validaciones operativas.",
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
  if (m.includes("sistemas propios") || m.includes("sistemas_propios")) {
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
