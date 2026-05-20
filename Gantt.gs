/**
 * SPORTING MARKETPLACE - Apps Script Gantt Operativo
 *
 * Logica exclusiva del endpoint tipo_formulario = "gantt_task_update".
 */

const CAMPOS_GANTT_EDITABLES_QA = {
  estado: ["estado_tarea", "estado"],
  responsable: ["responsable"],
  inicio_real: ["fecha_inicio_real", "inicio_real"],
  fin_real: ["fecha_fin_real", "fin_real"],
  comentario: ["comentario"],
};

const ESTADOS_GANTT_PERMITIDOS = {
  pendiente: "Pendiente",
  en_curso: "En curso",
  bloqueado: "Bloqueado",
  completado: "Completado",
  cancelado: "Cancelado",
};

function actualizarTareaGantt(d) {
  const taskId = limpiarValor(d.task_id || d.id_tarea);
  if (!taskId) throw new Error("Falta task_id");

  const fields = d.fields;
  if (!fields || Array.isArray(fields) || typeof fields !== "object") {
    throw new Error("Falta fields como objeto de campos a actualizar");
  }

  const nombresCampos = Object.keys(fields);
  if (!nombresCampos.length) throw new Error("fields no puede estar vacio");

  const camposNoPermitidos = nombresCampos.filter(
    (campo) => !CAMPOS_GANTT_EDITABLES_QA[campo],
  );
  if (camposNoPermitidos.length) {
    throw new Error(
      "Campos no permitidos para gantt_task_update: " +
        camposNoPermitidos.join(", "),
    );
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_TIMELINE);
  if (!ws) throw new Error('No existe la hoja "timeline"');

  const headers = obtenerHeaders(ws);
  if (!headers.length) throw new Error('La hoja "timeline" no tiene headers');

  const headerMap = construirMapaHeadersNormalizados(headers);
  const taskCol = resolverIndiceHeader(headerMap, ["task_id", "id_tarea"]);
  if (taskCol === -1) {
    throw new Error('La hoja "timeline" no tiene columna task_id / id_tarea');
  }

  const values = ws.getDataRange().getValues();
  const coincidencias = [];
  const taskIdNorm = normalizarIdGantt(taskId);
  for (let i = 1; i < values.length; i++) {
    if (normalizarIdGantt(values[i][taskCol]) === taskIdNorm) {
      coincidencias.push({ rowNumber: i + 1, row: values[i] });
    }
  }

  if (!coincidencias.length) throw new Error("task_id no existe: " + taskId);
  if (coincidencias.length > 1) {
    throw new Error("task_id duplicado en timeline: " + taskId);
  }

  const rowNumber = coincidencias[0].rowNumber;
  const row = coincidencias[0].row;
  const updates = [];
  const before = {};
  const after = {};

  nombresCampos.forEach((campo) => {
    const col = resolverIndiceHeader(headerMap, CAMPOS_GANTT_EDITABLES_QA[campo]);
    if (col === -1) {
      throw new Error("Columna inexistente para campo permitido: " + campo);
    }

    const valor = normalizarValorGantt(campo, fields[campo]);
    before[campo] = limpiarValor(row[col]);
    after[campo] = valor;
    updates.push({ campo, col, valor });
  });

  validarRangoFechasGantt(fields);

  updates.forEach((update) => {
    ws.getRange(rowNumber, update.col + 1).setValue(update.valor);
  });

  registrarMetadatosGanttSiExisten(ws, headerMap, rowNumber, d.updated_by);
  registrarAuditoriaGanttSiExiste(ss, taskId, d.updated_by, before, after);

  return {
    task_id: taskId,
    updated_fields: updates.map((u) => u.campo),
  };
}

function construirMapaHeadersNormalizados(headers) {
  const map = {};
  headers.forEach((header, idx) => {
    const key = normalizarHeaderGantt(header);
    if (key && map[key] === undefined) map[key] = idx;
  });
  return map;
}

function normalizarHeaderGantt(valor) {
  return normalizarTexto(valor)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function resolverIndiceHeader(headerMap, alias) {
  for (const key of alias) {
    const normalized = normalizarHeaderGantt(key);
    if (headerMap[normalized] !== undefined) return headerMap[normalized];
  }
  return -1;
}

function normalizarIdGantt(valor) {
  return limpiarValor(valor).toUpperCase();
}

function normalizarValorGantt(campo, valor) {
  if (campo === "estado") return normalizarEstadoGantt(valor);
  if (campo === "inicio_real" || campo === "fin_real") {
    return validarFechaGantt(valor, campo);
  }
  if (campo === "responsable") return validarTextoGantt(valor, campo, 120);
  if (campo === "comentario") return validarTextoGantt(valor, campo, 1000);
  return limpiarValor(valor);
}

function normalizarEstadoGantt(valor) {
  const raw = limpiarValor(valor);
  if (!raw) throw new Error("estado no puede estar vacio");
  const key = normalizarHeaderGantt(raw);
  if (!ESTADOS_GANTT_PERMITIDOS[key]) {
    throw new Error("estado invalido: " + raw);
  }
  return ESTADOS_GANTT_PERMITIDOS[key];
}

function validarFechaGantt(valor, campo) {
  const raw = limpiarValor(valor);
  if (!raw) return "";
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error(campo + " debe usar formato YYYY-MM-DD o vacio");

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(campo + " no es una fecha valida");
  }
  return raw;
}

function validarRangoFechasGantt(fields) {
  if (
    fields.inicio_real === undefined ||
    fields.fin_real === undefined ||
    !limpiarValor(fields.inicio_real) ||
    !limpiarValor(fields.fin_real)
  ) {
    return;
  }

  const inicio = new Date(limpiarValor(fields.inicio_real) + "T00:00:00");
  const fin = new Date(limpiarValor(fields.fin_real) + "T00:00:00");
  if (fin < inicio) {
    throw new Error("fin_real no puede ser anterior a inicio_real");
  }
}

function validarTextoGantt(valor, campo, maxLength) {
  const raw = limpiarValor(valor);
  if (raw.length > maxLength) {
    throw new Error(campo + " excede el maximo de " + maxLength + " caracteres");
  }
  return raw;
}

function registrarMetadatosGanttSiExisten(ws, headerMap, rowNumber, updatedBy) {
  const updatedAtCol = resolverIndiceHeader(headerMap, [
    "updated_at",
    "fecha_actualizacion",
    "fecha_ultima_actualizacion",
    "ultima_actualizacion",
  ]);
  if (updatedAtCol !== -1) {
    ws
      .getRange(rowNumber, updatedAtCol + 1)
      .setValue(Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss"));
  }

  const updatedByCol = resolverIndiceHeader(headerMap, [
    "updated_by",
    "actualizado_por",
    "usuario_actualizacion",
  ]);
  if (updatedByCol !== -1 && limpiarValor(updatedBy)) {
    ws.getRange(rowNumber, updatedByCol + 1).setValue(limpiarValor(updatedBy));
  }
}

function registrarAuditoriaGanttSiExiste(ss, taskId, updatedBy, before, after) {
  const nombres = ["timeline_log", "gantt_task_log", "gantt_updates_log", "auditoria_gantt"];
  const ws = nombres.map((n) => ss.getSheetByName(n)).find(Boolean);
  if (!ws) return;

  const headers = obtenerHeaders(ws);
  if (!headers.length) return;

  const headerMap = construirMapaHeadersNormalizados(headers);
  if (
    resolverIndiceHeader(headerMap, ["task_id", "id_tarea"]) === -1 ||
    resolverIndiceHeader(headerMap, ["updated_at", "fecha", "fecha_actualizacion"]) === -1
  ) {
    return;
  }

  const now = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");
  const row = headers.map((header) => {
    const key = normalizarHeaderGantt(header);
    if (["updated_at", "fecha", "fecha_actualizacion"].includes(key)) return now;
    if (["task_id", "id_tarea"].includes(key)) return taskId;
    if (["updated_by", "usuario", "actualizado_por"].includes(key)) {
      return limpiarValor(updatedBy);
    }
    if (["tipo_formulario", "operacion", "accion"].includes(key)) {
      return "gantt_task_update";
    }
    if (["updated_fields", "campos_actualizados"].includes(key)) {
      return Object.keys(after).join(", ");
    }
    if (["before", "valor_anterior"].includes(key)) return JSON.stringify(before);
    if (["after", "valor_nuevo"].includes(key)) return JSON.stringify(after);
    if (["payload", "detalle"].includes(key)) {
      return JSON.stringify({ before, after });
    }
    return "";
  });

  ws.appendRow(row);
}
