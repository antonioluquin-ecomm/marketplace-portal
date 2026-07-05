/**
 * SPORTING MARKETPLACE — Calificaciones.gs
 * Dominio: formulario de calificación + notificación.
 */


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
