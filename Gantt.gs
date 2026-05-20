/**
 * SPORTING MARKETPLACE - Apps Script Gantt Operativo
 *
 * Logica exclusiva de endpoints Gantt Operativo.
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

const GANTT_TASK_ID_HEADER_ALIASES = [
  "task_id",
  "id_tarea",
  "ID Tarea",
  "Id Tarea",
  "id tarea",
];

const CAMPOS_GANTT_CREATE_ALIASES = {
  task_id: GANTT_TASK_ID_HEADER_ALIASES,
  seller_id: ["seller_id", "id_seller", "seller"],
  fase: ["fase"],
  hito: ["hito"],
  tarea: ["tarea", "actividad"],
  responsable: ["responsable"],
  dependencia: ["dependencia", "depende_de", "Depende de"],
  inicio_plan: ["inicio_plan", "fecha_inicio_plan", "Inicio plan"],
  fin_plan: ["fin_plan", "fecha_fin_plan", "Fin plan"],
  inicio_real: ["inicio_real", "fecha_inicio_real", "Inicio real"],
  fin_real: ["fin_real", "fecha_fin_real", "Fin real"],
  estado: ["estado_tarea", "estado"],
  visible_gantt: ["visible_gantt", "visible", "Visible Gantt"],
  comentario: ["comentario", "comentarios"],
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

  const timelineHeaders = obtenerHeadersTimelineGantt(ws);
  const headers = timelineHeaders.headers;
  const headerMap = timelineHeaders.headerMap;
  const taskCol = resolverIndiceHeaderGantt(
    headerMap,
    GANTT_TASK_ID_HEADER_ALIASES,
  );
  if (taskCol === -1) {
    throw new Error('La hoja "timeline" no tiene columna task_id / id_tarea / ID Tarea');
  }

  const values = ws.getDataRange().getValues();
  const coincidencias = [];
  const taskIdNorm = normalizarIdGantt(taskId);
  for (let i = timelineHeaders.dataStartRowNumber - 1; i < values.length; i++) {
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

function crearTareaGantt(d) {
  const task = d.task;
  if (!task || Array.isArray(task) || typeof task !== "object") {
    throw new Error("Falta task como objeto de tarea a crear");
  }

  const sellerId = normalizarIdGantt(task.seller_id);
  if (!sellerId) throw new Error("seller_id obligatorio");

  const fase = validarTextoObligatorioGantt(task.fase, "fase", 120);
  const hito = validarTextoObligatorioGantt(task.hito, "hito", 160);
  const tarea = validarTextoObligatorioGantt(task.tarea, "tarea", 220);
  const responsable = validarTextoObligatorioGantt(
    task.responsable,
    "responsable",
    120,
  );
  const inicioPlan = validarFechaObligatoriaGantt(task.inicio_plan, "inicio_plan");
  const finPlan = validarFechaObligatoriaGantt(task.fin_plan, "fin_plan");
  validarRangoPlanGantt(inicioPlan, finPlan);

  const estado = normalizarEstadoGantt(task.estado || "Pendiente");
  const visibleGantt = normalizarVisibleGantt(task.visible_gantt || "No");
  const comentario = validarTextoGantt(task.comentario || "", "comentario", 1000);
  const dependencia = validarTextoGantt(
    task.dependencia || "",
    "dependencia",
    120,
  );
  const inicioReal = validarFechaGantt(task.inicio_real || "", "inicio_real");
  const finReal = validarFechaGantt(task.fin_real || "", "fin_real");
  validarRangoFechasGantt({ inicio_real: inicioReal, fin_real: finReal });

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_TIMELINE);
  if (!ws) throw new Error('No existe la hoja "timeline"');

  const timelineHeaders = obtenerHeadersTimelineGantt(ws);
  const headers = timelineHeaders.headers;
  const headerMap = timelineHeaders.headerMap;
  const taskCol = resolverIndiceHeaderGantt(
    headerMap,
    GANTT_TASK_ID_HEADER_ALIASES,
  );
  if (taskCol === -1) {
    throw new Error('La hoja "timeline" no tiene columna task_id / id_tarea / ID Tarea');
  }

  validarColumnasCreateGantt(headerMap);

  const values = ws.getDataRange().getValues();
  const taskIdRecibido = limpiarValor(
    task.task_id || task.id_tarea || task["ID Tarea"] || d.task_id || d.id_tarea,
  );
  const taskId = taskIdRecibido
    ? normalizarIdGantt(taskIdRecibido)
    : generarTaskIdGantt(sellerId, values, taskCol, timelineHeaders.dataStartRowNumber);

  if (existeTaskIdGantt(values, taskCol, timelineHeaders.dataStartRowNumber, taskId)) {
    throw new Error("task_id duplicado en timeline: " + taskId);
  }

  const datos = {
    task_id: taskId,
    seller_id: sellerId,
    fase,
    hito,
    tarea,
    responsable,
    dependencia,
    inicio_plan: inicioPlan,
    fin_plan: finPlan,
    inicio_real: inicioReal,
    fin_real: finReal,
    estado,
    visible_gantt: visibleGantt,
    comentario,
  };

  const row = headers.map(() => "");
  const createdFields = [];
  Object.keys(datos).forEach((campo) => {
    const col = resolverIndiceHeader(headerMap, CAMPOS_GANTT_CREATE_ALIASES[campo]);
    if (col !== -1) {
      row[col] = datos[campo];
      createdFields.push(campo);
    }
  });

  const rowNumber = ws.getLastRow() + 1;
  ws.appendRow(row);

  registrarMetadatosAltaGanttSiExisten(ws, headerMap, rowNumber, d.created_by);
  registrarAuditoriaGanttSiExiste(
    ss,
    taskId,
    d.created_by,
    {},
    datos,
    "gantt_task_create",
  );

  return {
    task_id: taskId,
    created_fields: createdFields,
    row_number: rowNumber,
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

function obtenerHeadersTimelineGantt(ws) {
  const lastColumn = ws.getLastColumn();
  const lastRow = ws.getLastRow();
  if (!lastColumn || !lastRow) throw new Error('La hoja "timeline" no tiene headers');

  const scanRows = Math.min(10, lastRow);
  const rows = ws.getRange(1, 1, scanRows, lastColumn).getValues();
  for (let i = 0; i < rows.length; i++) {
    const headers = rows[i].map((h) => String(h || "").trim());
    const headerMap = construirMapaHeadersNormalizados(headers);
    if (resolverIndiceHeaderGantt(headerMap, GANTT_TASK_ID_HEADER_ALIASES) !== -1) {
      return {
        headers,
        headerMap,
        headerRowNumber: i + 1,
        dataStartRowNumber: i + 2,
      };
    }
  }

  throw new Error('La hoja "timeline" no tiene columna task_id / id_tarea / ID Tarea');
}

function normalizarHeaderGantt(valor) {
  const header = normalizarTexto(valor)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (["id_tarea", "id_de_tarea"].includes(header)) return "id_tarea";
  return header;
}

function resolverIndiceHeader(headerMap, alias) {
  for (const key of alias) {
    const normalized = normalizarHeaderGantt(key);
    if (headerMap[normalized] !== undefined) return headerMap[normalized];
  }
  return -1;
}

function resolverIndiceHeaderGantt(headerMap, alias) {
  const aliasesNormalizados = alias.map((key) => normalizarHeaderGantt(key));
  for (const [header, idx] of Object.entries(headerMap)) {
    if (aliasesNormalizados.includes(header)) return idx;
    if (header.includes("id") && header.includes("tarea")) return idx;
  }
  return -1;
}

function validarColumnasCreateGantt(headerMap) {
  const requeridas = [
    "task_id",
    "seller_id",
    "fase",
    "hito",
    "tarea",
    "responsable",
    "inicio_plan",
    "fin_plan",
    "estado",
  ];

  requeridas.forEach((campo) => {
    const col = resolverIndiceHeader(headerMap, CAMPOS_GANTT_CREATE_ALIASES[campo]);
    if (col === -1) {
      throw new Error("Columna inexistente para crear tarea Gantt: " + campo);
    }
  });
}

function generarTaskIdGantt(sellerId, values, taskCol, dataStartRowNumber) {
  const sellerNorm = normalizarIdGantt(sellerId);
  const prefix = sellerNorm + "-T-";
  const pattern = new RegExp("^" + escaparRegexGantt(prefix) + "(\\d+)$");
  let max = 0;
  let pad = 2;

  for (let i = dataStartRowNumber - 1; i < values.length; i++) {
    const taskId = normalizarIdGantt(values[i][taskCol]);
    const match = taskId.match(pattern);
    if (match) {
      const n = Number(match[1]);
      if (!Number.isNaN(n)) {
        max = Math.max(max, n);
        pad = Math.max(pad, match[1].length);
      }
    }
  }

  return prefix + String(max + 1).padStart(pad, "0");
}

function escaparRegexGantt(valor) {
  return String(valor).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function existeTaskIdGantt(values, taskCol, dataStartRowNumber, taskId) {
  const taskIdNorm = normalizarIdGantt(taskId);
  for (let i = dataStartRowNumber - 1; i < values.length; i++) {
    if (normalizarIdGantt(values[i][taskCol]) === taskIdNorm) return true;
  }
  return false;
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

function validarFechaObligatoriaGantt(valor, campo) {
  const fecha = validarFechaGantt(valor, campo);
  if (!fecha) throw new Error(campo + " obligatorio");
  return fecha;
}

function validarRangoPlanGantt(inicioPlan, finPlan) {
  const inicio = new Date(inicioPlan + "T00:00:00");
  const fin = new Date(finPlan + "T00:00:00");
  if (fin < inicio) {
    throw new Error("fin_plan no puede ser anterior a inicio_plan");
  }
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

function validarTextoObligatorioGantt(valor, campo, maxLength) {
  const raw = validarTextoGantt(valor, campo, maxLength);
  if (!raw) throw new Error(campo + " obligatorio");
  return raw;
}

function normalizarVisibleGantt(valor) {
  const raw = limpiarValor(valor);
  if (!raw) return "No";
  const key = normalizarHeaderGantt(raw);
  if (["si", "s"].includes(key)) return "Si";
  if (["no", "n"].includes(key)) return "No";
  throw new Error("visible_gantt invalido: " + raw);
}

function registrarMetadatosAltaGanttSiExisten(ws, headerMap, rowNumber, createdBy) {
  const createdAtCol = resolverIndiceHeader(headerMap, [
    "created_at",
    "fecha_creacion",
    "fecha_alta",
  ]);
  if (createdAtCol !== -1) {
    ws
      .getRange(rowNumber, createdAtCol + 1)
      .setValue(Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss"));
  }

  const createdByCol = resolverIndiceHeader(headerMap, [
    "created_by",
    "creado_por",
    "usuario_creacion",
  ]);
  if (createdByCol !== -1 && limpiarValor(createdBy)) {
    ws.getRange(rowNumber, createdByCol + 1).setValue(limpiarValor(createdBy));
  }
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

function registrarAuditoriaGanttSiExiste(
  ss,
  taskId,
  updatedBy,
  before,
  after,
  operacion,
) {
  const accion = operacion || "gantt_task_update";
  const nombres = ["timeline_log", "gantt_task_log", "gantt_updates_log", "auditoria_gantt"];
  const ws = nombres.map((n) => ss.getSheetByName(n)).find(Boolean);
  if (!ws) return;

  const headers = obtenerHeaders(ws);
  if (!headers.length) return;

  const headerMap = construirMapaHeadersNormalizados(headers);
  if (
    resolverIndiceHeaderGantt(headerMap, GANTT_TASK_ID_HEADER_ALIASES) === -1 ||
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
    if (["created_by", "creado_por", "usuario_creacion"].includes(key)) {
      return limpiarValor(updatedBy);
    }
    if (["tipo_formulario", "operacion", "accion"].includes(key)) {
      return accion;
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
