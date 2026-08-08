/**
 * SPORTING MARKETPLACE — DefinicionesOperativas.gs
 * Dominio: definiciones operativas por seller — respuestas puntuales
 * ("¿cargás la URL de la factura en tu VTEX?", "¿quién hace el despacho?")
 * que el seller o un agente interno completan de a un campo por vez y que
 * disparan la generación/desbloqueo automático de tareas de Gantt
 * (ver PlantillasGanttDefiniciones.gs).
 *
 * Distinto de DefinicionTecnica.gs / hoja "definicion_tecnica" — ese es un
 * dossier auto-generado desde Relevamiento, sin UI y sin conexión a Gantt.
 */

// Lectura — gateada por sesión, seller-scoped vía _aplicarSellerScope (mismo
// patrón que getOverridesAction/getGanttAction).
function getDefinicionesOperativasAction(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_DEFINICIONES_OPERATIVAS);
  if (!ws) return { ok: true, data: [] };

  const values = ws.getDataRange().getValues();
  if (values.length < 2) return { ok: true, data: [] };

  const headers = values[0].map((h) => String(h || "").trim());
  const todos = values
    .slice(1)
    .map((r) => rowToObj(headers, r))
    .filter((o) => o.seller_id);

  return { ok: true, data: _aplicarSellerScope(data, todos) };
}

// Ownership: Admin (id_rol=1) siempre puede; sesión de seller solo lo suyo;
// staff no-admin necesita permiso de editar en el módulo "definiciones"
// (PERMISOS_MODULOS) — mismo criterio combinado que usa updateGanttTask
// (ownership en el handler, no en ACTION_MODULE_MAP, porque la acción es
// compartida entre seller y staff).
function _guardDefinicionOperativaAccess(data, sellerId) {
  if (data._sesRol === 1) return;
  if (data._sesSellerId) {
    if (String(data._sesSellerId).toUpperCase() !== String(sellerId).toUpperCase()) {
      throw new Error("No autorizado a enviar esta definición para este seller.");
    }
    return;
  }
  const perm = getPermisosForRol(data._sesRol);
  if (!(perm.definiciones && perm.definiciones.editar === true)) {
    throw new Error("No autorizado (falta permiso de módulo 'definiciones').");
  }
}

// Escritura parcial — solo toca las claves presentes en data.campos, mismo
// patrón que actualizarOverridesSeller (Tarifas.gs): localizar/crear fila por
// seller_id, escribir solo lo que llega, no tocar el resto. En el mismo
// request dispara evaluarYDesbloquearTareasGantt para los campos que
// cambiaron (ver PlantillasGanttDefiniciones.gs).
function guardarDefinicionOperativa(data) {
  const sellerId = String(data.seller_id || "").trim();
  if (!sellerId) throw new Error("Falta seller_id");
  _guardDefinicionOperativaAccess(data, sellerId);

  const camposPayload = data.campos || {};
  const camposValidos = {};
  Object.keys(camposPayload).forEach((campo) => {
    if (CAMPOS_DEFINICIONES_OPERATIVAS.indexOf(campo) !== -1) {
      camposValidos[campo] = camposPayload[campo];
    }
  });
  if (!Object.keys(camposValidos).length) {
    throw new Error("No se recibió ningún campo válido de definición operativa.");
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = obtenerHojaConHeaders(
    ss,
    HOJA_DEFINICIONES_OPERATIVAS,
    HEADERS_DEFINICIONES_OPERATIVAS,
  );

  let rowIndex = buscarFilaPorSellerId(ws, sellerId);
  let accion;
  if (!rowIndex) {
    const newRow = HEADERS_DEFINICIONES_OPERATIVAS.map(() => "");
    newRow[HEADERS_DEFINICIONES_OPERATIVAS.indexOf("seller_id")] = sellerId;
    ws.appendRow(newRow);
    rowIndex = ws.getLastRow();
    accion = "creado";
  } else {
    accion = "actualizado";
  }

  // modelo_integracion: write-once — si ya está seteado (por ejemplo por
  // generarTareasBaseGantt), no lo pisa; si viene vacío en la hoja, lo completa
  // con lo que mande el front (necesario para que evaluarYDesbloquearTareasGantt
  // sepa qué plantilla usar incluso si el seller respondió antes de que un
  // agente confirmara el modelo).
  if (data.modelo_integracion) {
    const colModelo = HEADERS_DEFINICIONES_OPERATIVAS.indexOf("modelo_integracion") + 1;
    const celdaModelo = ws.getRange(rowIndex, colModelo);
    if (!String(celdaModelo.getValue() || "").trim()) {
      celdaModelo.setValue(String(data.modelo_integracion).trim());
    }
  }

  const actor = limpiarValor(data._sesEmail) || "sistema";
  const ahora = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");
  const updated = [];

  Object.keys(camposValidos).forEach((campo) => {
    const col = HEADERS_DEFINICIONES_OPERATIVAS.indexOf(campo) + 1;
    const valor = limpiarValor(camposValidos[campo]);
    ws.getRange(rowIndex, col).setValue(valor);
    updated.push({ campo, valor });
  });

  const colActualizadoPor = HEADERS_DEFINICIONES_OPERATIVAS.indexOf("actualizado_por") + 1;
  const colActualizadoEn = HEADERS_DEFINICIONES_OPERATIVAS.indexOf("actualizado_en") + 1;
  ws.getRange(rowIndex, colActualizadoPor).setValue(actor);
  ws.getRange(rowIndex, colActualizadoEn).setValue(ahora);

  SpreadsheetApp.flush();

  const gantt = evaluarYDesbloquearTareasGantt(sellerId, camposValidos, actor);

  return {
    ok: true,
    seller_id: sellerId,
    accion,
    fila: rowIndex,
    hoja: HOJA_DEFINICIONES_OPERATIVAS,
    updated,
    total: updated.length,
    fecha: ahora,
    gantt,
  };
}
