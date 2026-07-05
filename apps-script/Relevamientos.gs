/**
 * SPORTING MARKETPLACE — Relevamientos.gs
 * Dominio: relevamiento, perfil progresivo y lectura (getRelevamientosAction).
 */


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
  let todos = rows.map(r => rowToObj(headers, r)).filter(o => o.seller_id);

  if (data._sesSellerId) {
    todos = todos.filter(o => String(o.seller_id || "").trim().toUpperCase() === data._sesSellerId.toUpperCase());
  }
  return { ok: true, data: todos };
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
  const rowObj = rowToObj(headers, values);

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
    currentObj = rowToObj(headers, currentValues);
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
