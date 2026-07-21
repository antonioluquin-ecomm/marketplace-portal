/**
 * SPORTING MARKETPLACE - Apps Script Gantt Operativo
 *
 * Logica exclusiva de endpoints Gantt Operativo.
 */

// Etapa 12 — "responsable" (header físico sin cambios en la hoja timeline) pasa
// a interpretarse como ÁREA responsable (equipo/rol). La persona individual
// asignada vive en la columna nueva "responsable_persona" (id de USUARIOS).
const CAMPOS_GANTT_EDITABLES_QA = {
  estado: ["estado_tarea", "estado"],
  hito: ["hito", "Hito"],
  area_responsable: ["area_responsable", "responsable"],
  responsable_persona: ["responsable_persona", "id_responsable"],
  entorno: ["Entorno", "entorno"],
  inicio: ["Inicio", "inicio", "Inicio plan", "inicio_plan", "fecha_inicio_plan"],
  fin: ["Fin", "fin", "Fin plan", "fin_plan", "fecha_fin_plan"],
  comentario: ["comentario"],
  depende_de: ["Depende de", "depende_de", "dependencia"],
};

// "Configurado en QA" — Etapa 2026-07-21: estado intermedio entre "En curso"
// y "Completado" para tareas que ya se armaron en QA pero todavia requieren
// el mismo trabajo en Productivo antes de poder cerrarse. Sin este estado,
// un agente que termina la parte de QA no tenia forma de reflejar "hice esto,
// pero falta Productivo" sin marcar la tarea como Completado prematuramente.
const ESTADOS_GANTT_PERMITIDOS = {
  pendiente: "Pendiente",
  en_curso: "En curso",
  configurado_en_qa: "Configurado en QA",
  bloqueado: "Bloqueado",
  completado: "Completado",
  cancelado: "Cancelado",
};

const ENTORNOS_GANTT_PERMITIDOS = {
  qa: "QA",
  productivo: "Productivo",
};

const AREAS_GANTT_PERMITIDAS = {
  ecommerce: "eCommerce",
  infracommerce: "InfraCommerce",
  agente_pim: "Agente PIM",
  administracion: "Administración",
  seller: "Seller",
  comercial: "Comercial",
  operaciones: "Operaciones",
  qa: "QA",
  it: "IT",
};

const GANTT_TASK_ID_HEADER_ALIASES = [
  "task_id",
  "id_tarea",
  "ID Tarea",
  "Id Tarea",
  "id tarea",
];

const GANTT_LOCK_TIMEOUT_MS = 10000;
const GANTT_ACTOR_FALLBACK = "gantt_backend_no_declarado";

const CAMPOS_GANTT_CREATE_ALIASES = {
  task_id: GANTT_TASK_ID_HEADER_ALIASES,
  seller_id: ["seller_id", "id_seller", "seller"],
  seller_nombre: ["seller_nombre", "seller_marca", "Seller / Marca", "seller"],
  fase: ["fase"],
  hito: ["hito"],
  tarea: ["tarea", "actividad"],
  area_responsable: ["area_responsable", "responsable"],
  responsable_persona: ["responsable_persona", "id_responsable"],
  depende_de: ["Depende de", "depende_de", "dependencia"],
  entorno: ["Entorno", "entorno"],
  inicio: ["Inicio", "inicio", "Inicio plan", "inicio_plan", "fecha_inicio_plan"],
  fin: ["Fin", "fin", "Fin plan", "fin_plan", "fecha_fin_plan"],
  estado: ["estado_tarea", "estado"],
  ver_en_gantt: ["Ver en Gantt", "ver_en_gantt", "visible_gantt", "visible", "Visible Gantt"],
  comentario: ["comentario", "comentarios"],
};

function actualizarTareaGantt(d) {
  return ejecutarOperacionGanttConLock("gantt_task_update", () =>
    actualizarTareaGanttSinLock(d),
  );
}

function actualizarTareaGanttSinLock(d) {
  const taskId = limpiarValor(d.task_id || d.id_tarea);
  if (!taskId) throw new Error("Falta task_id");
  const actor = normalizarActorDeclaradoGantt(d.updated_by, "gantt_update_sin_updated_by");

  const fields = d.fields;
  if (!fields || Array.isArray(fields) || typeof fields !== "object") {
    throw new Error("Falta fields como objeto de campos a actualizar");
  }

  const fieldsCanonicos = normalizarFieldsUpdateGantt(fields);
  const nombresCampos = Object.keys(fieldsCanonicos);
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

  // Etapa 9a — guard de ownership para sesiones de seller. Si la sesión trae
  // seller_id (id_rol=2), solo puede editar SUS tareas y solo estado/comentario.
  // Las sesiones internas (staff, sin seller_id — incluye el modo "ver como
  // seller" del admin) mantienen acceso total, como el Gantt operativo interno.
  const sesSellerId = String(d._sesSellerId || "").trim();
  if (sesSellerId) {
    const sellerCol = resolverIndiceHeaderGantt(headerMap, CAMPOS_GANTT_CREATE_ALIASES.seller_id);
    const rowSeller = sellerCol === -1 ? "" : String(row[sellerCol] || "").trim();
    if (rowSeller.toUpperCase() !== sesSellerId.toUpperCase()) {
      throw new Error("No autorizado a editar esta tarea (pertenece a otro seller).");
    }
    const CAMPOS_SELLER = ["estado", "comentario"];
    const noPermitidosSeller = nombresCampos.filter((c) => CAMPOS_SELLER.indexOf(c) === -1);
    if (noPermitidosSeller.length) {
      throw new Error("Los sellers solo pueden actualizar estado y comentario.");
    }
  }

  const updates = [];
  const before = {};
  const after = {};

  nombresCampos.forEach((campo) => {
    const col = resolverIndiceHeader(headerMap, CAMPOS_GANTT_EDITABLES_QA[campo]);
    if (col === -1) {
      throw new Error("Columna inexistente para campo permitido: " + campo);
    }

    const valor = normalizarValorGantt(campo, fieldsCanonicos[campo]);
    before[campo] = limpiarValor(row[col]);
    after[campo] = valor;
    updates.push({ campo, col, valor });
  });

  validarRangoInicioFinUpdateGantt(row, headerMap, after);
  if (after.depende_de !== undefined) {
    validarDependenciaGantt(
      after.depende_de,
      values,
      taskCol,
      timelineHeaders.dataStartRowNumber,
      taskId,
    );
  }

  updates.forEach((update) => {
    ws.getRange(rowNumber, update.col + 1).setValue(update.valor);
  });

  registrarMetadatosGanttSiExisten(ws, headerMap, rowNumber, actor);
  registrarAuditoriaGanttSiExiste(ss, taskId, actor, before, after);

  return {
    task_id: taskId,
    updated_fields: updates.map((u) => u.campo),
  };
}

function crearTareaGantt(d) {
  return ejecutarOperacionGanttConLock("gantt_task_create", () =>
    crearTareaGanttSinLock(d),
  );
}

function crearTareaGanttSinLock(d) {
  const task = d.task;
  if (!task || Array.isArray(task) || typeof task !== "object") {
    throw new Error("Falta task como objeto de tarea a crear");
  }
  const actor = normalizarActorDeclaradoGantt(d.created_by, "gantt_create_sin_created_by");

  const sellerId = normalizarIdGantt(task.seller_id);
  if (!sellerId) throw new Error("seller_id obligatorio");
  const sellerNombre = validarTextoGantt(
    obtenerValorPayloadGantt(task, CAMPOS_GANTT_CREATE_ALIASES.seller_nombre),
    "seller_nombre",
    180,
  );

  const fase = validarTextoObligatorioGantt(task.fase, "fase", 120);
  const hito = validarTextoObligatorioGantt(task.hito, "hito", 160);
  const tarea = validarTextoObligatorioGantt(task.tarea, "tarea", 220);
  const areaResponsable = normalizarAreaResponsableGantt(
    obtenerValorPayloadGantt(task, CAMPOS_GANTT_CREATE_ALIASES.area_responsable),
  );
  const responsablePersona = validarResponsablePersonaGantt(
    obtenerValorPayloadGantt(task, CAMPOS_GANTT_CREATE_ALIASES.responsable_persona),
  );
  const entorno = normalizarEntornoGantt(
    obtenerValorPayloadGantt(task, CAMPOS_GANTT_CREATE_ALIASES.entorno),
  );
  const inicio = validarFechaObligatoriaGantt(
    obtenerValorPayloadGantt(task, CAMPOS_GANTT_CREATE_ALIASES.inicio),
    "inicio",
  );
  const fin = validarFechaObligatoriaGantt(
    obtenerValorPayloadGantt(task, CAMPOS_GANTT_CREATE_ALIASES.fin),
    "fin",
  );
  validarRangoInicioFinGantt(inicio, fin, "inicio", "fin");

  const estado = normalizarEstadoGantt(
    obtenerValorPayloadGantt(task, CAMPOS_GANTT_CREATE_ALIASES.estado),
  );
  const visibleGantt = normalizarVisibleGantt(
    obtenerValorPayloadGantt(task, CAMPOS_GANTT_CREATE_ALIASES.ver_en_gantt) || "Si",
  );
  const comentario = validarTextoGantt(task.comentario || "", "comentario", 1000);
  const dependeDe = validarTextoGantt(
    obtenerValorPayloadGantt(task, CAMPOS_GANTT_CREATE_ALIASES.depende_de),
    "depende_de",
    120,
  );

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
  validarDependenciaGantt(
    dependeDe,
    values,
    taskCol,
    timelineHeaders.dataStartRowNumber,
    taskId,
  );

  const datos = {
    task_id: taskId,
    seller_id: sellerId,
    ...(sellerNombre ? { seller_nombre: sellerNombre } : {}),
    fase,
    hito,
    tarea,
    area_responsable: areaResponsable,
    ...(responsablePersona ? { responsable_persona: responsablePersona } : {}),
    depende_de: dependeDe,
    entorno,
    inicio,
    fin,
    estado,
    ver_en_gantt: visibleGantt,
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

  registrarMetadatosAltaGanttSiExisten(ws, headerMap, rowNumber, actor);
  registrarAuditoriaGanttSiExiste(
    ss,
    taskId,
    actor,
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

function darDeBajaTareaGantt(d) {
  return ejecutarOperacionGanttConLock("gantt_task_disable", () =>
    darDeBajaTareaGanttSinLock(d),
  );
}

function darDeBajaTareaGanttSinLock(d) {
  const taskId = limpiarValor(d.task_id || d.id_tarea || d["ID Tarea"]);
  if (!taskId) throw new Error("Falta task_id");
  const actor = normalizarActorDeclaradoGantt(d.updated_by, "gantt_disable_sin_updated_by");

  const mode = normalizarModoBajaGantt(d.mode || "hide_and_cancel");
  const reason = validarTextoGantt(d.reason || "", "reason", 1000);

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_TIMELINE);
  if (!ws) throw new Error('No existe la hoja "timeline"');

  const timelineHeaders = obtenerHeadersTimelineGantt(ws);
  const headerMap = timelineHeaders.headerMap;
  const taskCol = resolverIndiceHeaderGantt(
    headerMap,
    GANTT_TASK_ID_HEADER_ALIASES,
  );
  if (taskCol === -1) {
    throw new Error('La hoja "timeline" no tiene columna task_id / id_tarea / ID Tarea');
  }

  const values = ws.getDataRange().getValues();
  const coincidencias = buscarCoincidenciasTaskGantt(
    values,
    taskCol,
    timelineHeaders.dataStartRowNumber,
    taskId,
  );

  if (!coincidencias.length) throw new Error("task_id no existe: " + taskId);
  if (coincidencias.length > 1) {
    throw new Error("task_id duplicado en timeline: " + taskId);
  }

  const rowNumber = coincidencias[0].rowNumber;
  const row = coincidencias[0].row;
  const updates = [];
  const before = {};
  const after = {};

  if (mode === "hide" || mode === "hide_and_cancel") {
    const col = resolverIndiceHeader(
      headerMap,
      CAMPOS_GANTT_CREATE_ALIASES.ver_en_gantt,
    );
    if (col === -1) {
      throw new Error("La hoja timeline no tiene columna ver_en_gantt / visible_gantt");
    }
    before.ver_en_gantt = limpiarValor(row[col]);
    after.ver_en_gantt = "No";
    updates.push({ campo: "ver_en_gantt", col, valor: "No" });
  }

  if (mode === "cancel" || mode === "hide_and_cancel") {
    const col = resolverIndiceHeader(headerMap, CAMPOS_GANTT_CREATE_ALIASES.estado);
    if (col === -1) {
      throw new Error("La hoja timeline no tiene columna estado");
    }
    before.estado = limpiarValor(row[col]);
    after.estado = "Cancelado";
    updates.push({ campo: "estado", col, valor: "Cancelado" });
  }

  const comentarioCol = resolverIndiceHeader(
    headerMap,
    CAMPOS_GANTT_CREATE_ALIASES.comentario,
  );
  if (comentarioCol !== -1 && reason) {
    before.comentario = limpiarValor(row[comentarioCol]);
    after.comentario = reason;
    updates.push({ campo: "comentario", col: comentarioCol, valor: reason });
  }

  updates.forEach((update) => {
    ws.getRange(rowNumber, update.col + 1).setValue(update.valor);
  });

  registrarMetadatosGanttSiExisten(ws, headerMap, rowNumber, actor);
  registrarAuditoriaGanttSiExiste(
    ss,
    taskId,
    actor,
    before,
    after,
    "gantt_task_disable",
  );

  return {
    task_id: taskId,
    disabled_fields: updates.map((u) => u.campo),
    row_number: rowNumber,
  };
}

function ejecutarOperacionGanttConLock(operacion, callback) {
  let lock = null;
  let lockTomado = false;

  try {
    if (typeof LockService !== "undefined" && LockService.getScriptLock) {
      lock = LockService.getScriptLock();
      lockTomado = lock.tryLock(GANTT_LOCK_TIMEOUT_MS);
      if (!lockTomado) {
        throw new Error(
          "No se pudo obtener lock Gantt para " +
            operacion +
            ". Reintentar en unos segundos.",
        );
      }
    }

    return callback();
  } finally {
    if (lock && lockTomado) {
      lock.releaseLock();
    }
  }
}

function normalizarActorDeclaradoGantt(valor, fallback) {
  const actor = limpiarValor(valor);
  const resolved = actor || fallback || GANTT_ACTOR_FALLBACK;
  return validarTextoGantt(resolved, "actor_gantt", 180);
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

function obtenerValorPayloadGantt(obj, alias) {
  if (!obj || !alias) return "";
  const aliasesNormalizados = alias.map((key) => normalizarHeaderGantt(key));
  for (const key of alias) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
  }
  for (const key of Object.keys(obj)) {
    if (aliasesNormalizados.includes(normalizarHeaderGantt(key))) return obj[key];
  }
  return "";
}

function normalizarFieldsUpdateGantt(fields) {
  const canonicos = {};
  const aliasPorCampo = Object.keys(CAMPOS_GANTT_EDITABLES_QA).map((campo) => ({
    campo,
    aliases: CAMPOS_GANTT_EDITABLES_QA[campo].map((key) => normalizarHeaderGantt(key)),
  }));
  const noPermitidos = [];

  Object.keys(fields).forEach((key) => {
    const keyNormalizado = normalizarHeaderGantt(key);
    const match = aliasPorCampo.find((item) => item.aliases.includes(keyNormalizado));
    if (!match) {
      noPermitidos.push(key);
      return;
    }
    if (canonicos[match.campo] !== undefined) {
      throw new Error("Campo duplicado para gantt_task_update: " + match.campo);
    }
    canonicos[match.campo] = fields[key];
  });

  if (noPermitidos.length) {
    throw new Error(
      "Campos no permitidos para gantt_task_update: " + noPermitidos.join(", "),
    );
  }

  return canonicos;
}

function validarColumnasCreateGantt(headerMap) {
  const requeridas = [
    "task_id",
    "seller_id",
    "fase",
    "hito",
    "tarea",
    "area_responsable",
    "entorno",
    "inicio",
    "fin",
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
  return buscarCoincidenciasTaskGantt(values, taskCol, dataStartRowNumber, taskId)
    .length > 0;
}

function buscarCoincidenciasTaskGantt(values, taskCol, dataStartRowNumber, taskId) {
  const taskIdNorm = normalizarIdGantt(taskId);
  const coincidencias = [];
  for (let i = dataStartRowNumber - 1; i < values.length; i++) {
    if (normalizarIdGantt(values[i][taskCol]) === taskIdNorm) {
      coincidencias.push({ rowNumber: i + 1, row: values[i] });
    }
  }
  return coincidencias;
}

function normalizarIdGantt(valor) {
  return limpiarValor(valor).toUpperCase();
}

function normalizarValorGantt(campo, valor) {
  if (campo === "estado") return normalizarEstadoGantt(valor);
  if (campo === "entorno") return normalizarEntornoGantt(valor);
  if (campo === "inicio" || campo === "fin") {
    return validarFechaGantt(valor, campo);
  }
  if (campo === "hito") return validarTextoObligatorioGantt(valor, campo, 160);
  if (campo === "area_responsable") return normalizarAreaResponsableGantt(valor);
  if (campo === "responsable_persona") return validarResponsablePersonaGantt(valor);
  if (campo === "comentario") return validarTextoGantt(valor, campo, 1000);
  if (campo === "depende_de") return validarTextoGantt(valor, campo, 120);
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

function normalizarEntornoGantt(valor) {
  const raw = limpiarValor(valor);
  if (!raw) throw new Error("entorno no puede estar vacio");
  const key = normalizarHeaderGantt(raw);
  if (!ENTORNOS_GANTT_PERMITIDOS[key]) {
    throw new Error("entorno invalido: " + raw);
  }
  return ENTORNOS_GANTT_PERMITIDOS[key];
}

function normalizarAreaResponsableGantt(valor) {
  const raw = limpiarValor(valor);
  if (!raw) throw new Error("area_responsable no puede estar vacio");
  const key = normalizarHeaderGantt(raw);
  if (!AREAS_GANTT_PERMITIDAS[key]) {
    throw new Error("area_responsable invalida: " + raw);
  }
  return AREAS_GANTT_PERMITIDAS[key];
}

// responsable_persona es opcional (tareas históricas quedan "Sin asignar") pero
// si se manda un id, debe existir y estar activo en USUARIOS (evita ids huérfanos).
function validarResponsablePersonaGantt(valor) {
  const raw = limpiarValor(valor);
  if (!raw) return "";
  if (!_usuarioGanttActivoExiste(raw)) {
    throw new Error("responsable_persona invalido: usuario no encontrado o inactivo: " + raw);
  }
  return raw;
}

function _usuarioGanttActivoExiste(id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("USUARIOS");
  if (!sheet) return false;
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIdx = headers.indexOf("id");
  const activoIdx = headers.indexOf("activo");
  const idNorm = String(id).trim();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIdx]).trim() === idNorm) {
      return String(values[i][activoIdx]) === "SI";
    }
  }
  return false;
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

function validarRangoInicioFinGantt(inicioValor, finValor, campoInicio, campoFin) {
  if (!limpiarValor(inicioValor) || !limpiarValor(finValor)) return;
  const inicio = new Date(limpiarValor(inicioValor) + "T00:00:00");
  const fin = new Date(limpiarValor(finValor) + "T00:00:00");
  if (fin < inicio) {
    throw new Error(campoFin + " no puede ser anterior a " + campoInicio);
  }
}

function obtenerValorFilaGantt(row, headerMap, aliases) {
  const col = resolverIndiceHeader(headerMap, aliases);
  if (col === -1) return "";
  return limpiarValor(row[col]);
}

function validarRangoInicioFinUpdateGantt(row, headerMap, after) {
  if (after.inicio === undefined && after.fin === undefined) return;
  const inicio =
    after.inicio !== undefined
      ? after.inicio
      : obtenerValorFilaGantt(row, headerMap, CAMPOS_GANTT_CREATE_ALIASES.inicio);
  const fin =
    after.fin !== undefined
      ? after.fin
      : obtenerValorFilaGantt(row, headerMap, CAMPOS_GANTT_CREATE_ALIASES.fin);
  validarRangoInicioFinGantt(inicio, fin, "inicio", "fin");
}

function validarDependenciaGantt(
  dependencia,
  values,
  taskCol,
  dataStartRowNumber,
  taskIdActual,
) {
  const dependeDe = normalizarIdGantt(dependencia);
  if (!dependeDe) return;
  const actual = normalizarIdGantt(taskIdActual);
  if (actual && dependeDe === actual) {
    throw new Error("depende_de no puede apuntar a la misma tarea");
  }

  const existe = existeTaskIdGantt(values, taskCol, dataStartRowNumber, dependeDe);
  if (!existe) {
    throw new Error("depende_de apunta a task_id inexistente: " + limpiarValor(dependencia));
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
  throw new Error("ver_en_gantt invalido: " + raw);
}

function normalizarModoBajaGantt(valor) {
  const mode = normalizarHeaderGantt(valor);
  if (["hide", "cancel", "hide_and_cancel"].includes(mode)) return mode;
  throw new Error("mode invalido para gantt_task_disable: " + limpiarValor(valor));
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
    resolverIndiceHeader(headerMap, [
      "updated_at",
      "created_at",
      "timestamp",
      "fecha",
      "fecha_actualizacion",
    ]) === -1
  ) {
    return;
  }

  const now = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");
  const row = headers.map((header) => {
    const key = normalizarHeaderGantt(header);
    if (
      ["updated_at", "created_at", "timestamp", "fecha", "fecha_actualizacion"].includes(
        key,
      )
    ) {
      return now;
    }
    if (["task_id", "id_tarea"].includes(key)) return taskId;
    if (
      [
        "updated_by",
        "created_by",
        "usuario",
        "actualizado_por",
        "creado_por",
        "actor",
        "usuario_declarado",
        "client_actor",
      ].includes(key)
    ) {
      return limpiarValor(updatedBy);
    }
    if (["tipo_formulario", "operacion", "operation", "accion"].includes(key)) {
      return accion;
    }
    if (
      [
        "updated_fields",
        "created_fields",
        "disabled_fields",
        "fields_changed",
        "campos_actualizados",
        "campos_afectados",
      ].includes(key)
    ) {
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


// Misma normalización de encabezados que usa el frontend (gantt-operativo.html,
// función norm()) — la hoja timeline tiene headers con mayúsculas/espacios
// ("ID Tarea", "Seller / Marca", "Depende de"...), a diferencia de sellers
// que ya son snake_case. Sin esto, rowToObj devolvería claves como
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
  const todos = rows
    .map(r => rowToObj(headers, r))
    .filter(o => o.seller_id || o.task_id || o.id_tarea);

  const conteos = _contarChecklistYComentariosGantt(ss);
  todos.forEach((t) => {
    const taskId = normalizarIdGantt(t.task_id || t.id_tarea);
    const c = conteos[taskId] || { total: 0, hechos: 0, comentarios: 0 };
    t.checklist_count = c.total;
    t.checklist_done_count = c.hechos;
    t.comentarios_count = c.comentarios;
  });

  return { ok: true, data: _aplicarSellerScope(data, todos) };
}

// Conteos agregados por task_id, para pintar badges "3/5" y "N comentarios" en
// la lista sin pagar el costo de un round-trip por tarea (ver plan Sección B.3).
function _contarChecklistYComentariosGantt(ss) {
  const conteos = {};
  const wsCl = ss.getSheetByName(HOJA_TIMELINE_CHECKLIST);
  if (wsCl) {
    const values = wsCl.getDataRange().getValues();
    if (values.length > 1) {
      const headers = values[0].map(_normHeaderKeyGantt);
      const taskIdx = headers.indexOf("task_id");
      const hechoIdx = headers.indexOf("hecho");
      for (let i = 1; i < values.length; i++) {
        const taskId = normalizarIdGantt(values[i][taskIdx]);
        if (!taskId) continue;
        if (!conteos[taskId]) conteos[taskId] = { total: 0, hechos: 0, comentarios: 0 };
        conteos[taskId].total++;
        if (String(values[i][hechoIdx]) === "Si") conteos[taskId].hechos++;
      }
    }
  }
  const wsCm = ss.getSheetByName(HOJA_TIMELINE_COMENTARIOS);
  if (wsCm) {
    const values = wsCm.getDataRange().getValues();
    if (values.length > 1) {
      const headers = values[0].map(_normHeaderKeyGantt);
      const taskIdx = headers.indexOf("task_id");
      for (let i = 1; i < values.length; i++) {
        const taskId = normalizarIdGantt(values[i][taskIdx]);
        if (!taskId) continue;
        if (!conteos[taskId]) conteos[taskId] = { total: 0, hechos: 0, comentarios: 0 };
        conteos[taskId].comentarios++;
      }
    }
  }
  return conteos;
}

// Lectura del roadmap de desarrollo del Seller Center (hoja sc_roadmap),
// gateada por sesión — reemplaza el CSV publicado a la web que usaba
// gantt-seller-center.html (cualquiera con esa URL podía leer el roadmap
// sin login). No tiene seller_id (no es data de sellers), así que no pasa
// por _aplicarSellerScope: cualquier staff autenticado ve todo.
function getScRoadmapAction(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_SC_ROADMAP);
  if (!ws) return { ok: true, data: [] };

  const lastCol = ws.getLastColumn();
  const lastRow = ws.getLastRow();
  if (lastCol === 0 || lastRow < 1) return { ok: true, data: [] };

  const allValues = ws.getRange(1, 1, lastRow, lastCol).getValues();
  // Busca la fila de encabezados reales (por si hay filas de banner antes,
  // mismo patrón que la pestaña "overrides" — ver CLAUDE.md).
  const headerRowIdx = allValues.findIndex((r) => r.some((v) => _normHeaderKeyGantt(v) === "id"));
  if (headerRowIdx === -1) return { ok: true, data: [] };

  const headers = allValues[headerRowIdx].map(_normHeaderKeyGantt);
  const rows = allValues.slice(headerRowIdx + 1);
  const todos = rows.map((r) => rowToObj(headers, r)).filter((o) => o.id);

  return { ok: true, data: todos };
}

// ── DETALLE DE TAREA: checklist + comentarios ──────────────────

function _buscarTareaGanttPorId(taskId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_TIMELINE);
  if (!ws) return null;
  const timelineHeaders = obtenerHeadersTimelineGantt(ws);
  const headerMap = timelineHeaders.headerMap;
  const taskCol = resolverIndiceHeaderGantt(headerMap, GANTT_TASK_ID_HEADER_ALIASES);
  if (taskCol === -1) return null;
  const values = ws.getDataRange().getValues();
  const coincidencias = buscarCoincidenciasTaskGantt(
    values,
    taskCol,
    timelineHeaders.dataStartRowNumber,
    taskId,
  );
  if (!coincidencias.length) return null;
  const sellerCol = resolverIndiceHeaderGantt(headerMap, CAMPOS_GANTT_CREATE_ALIASES.seller_id);
  const sellerId = sellerCol === -1 ? "" : String(coincidencias[0].row[sellerCol] || "").trim();
  return { sellerId };
}

// Sesiones de seller solo pueden operar checklist/comentarios de sus propias
// tareas (mismo criterio que actualizarTareaGanttSinLock). Staff sin restricción.
function _verificarOwnershipTareaGantt(d, taskId) {
  const sesSellerId = String(d._sesSellerId || "").trim();
  if (!sesSellerId) return;
  const tarea = _buscarTareaGanttPorId(taskId);
  if (!tarea) throw new Error("task_id no existe: " + taskId);
  if (tarea.sellerId.toUpperCase() !== sesSellerId.toUpperCase()) {
    throw new Error("No autorizado (la tarea pertenece a otro seller).");
  }
}

function normalizarBooleanoSiNoGantt(valor) {
  if (valor === true || valor === "true") return "Si";
  if (valor === false || valor === "false") return "No";
  const raw = limpiarValor(valor);
  const key = normalizarHeaderGantt(raw);
  if (["si", "s", "1"].indexOf(key) !== -1) return "Si";
  if (["no", "n", "0"].indexOf(key) !== -1) return "No";
  throw new Error("valor booleano invalido: " + raw);
}

function _resolverNombreUsuarioGantt(id) {
  if (!id) return "";
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("USUARIOS");
  if (!sheet) return "";
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idIdx = headers.indexOf("id");
  const nombreIdx = headers.indexOf("nombre");
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idIdx]).trim() === String(id).trim()) {
      return String(values[i][nombreIdx] || "");
    }
  }
  return "";
}

function getGanttDetalleAction(data) {
  const taskId = limpiarValor(data.task_id);
  if (!taskId) return { ok: false, error: "Falta task_id", code: 400 };
  const tarea = _buscarTareaGanttPorId(taskId);
  if (!tarea) return { ok: false, error: "task_id no existe: " + taskId, code: 404 };

  try {
    _verificarOwnershipTareaGantt(data, taskId);
  } catch (e) {
    return { ok: false, error: String((e && e.message) || e), code: 403 };
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return {
    ok: true,
    data: {
      checklist: _leerChecklistGantt(ss, taskId),
      comentarios: _leerComentariosGantt(ss, taskId),
    },
  };
}

function _leerChecklistGantt(ss, taskId) {
  const ws = ss.getSheetByName(HOJA_TIMELINE_CHECKLIST);
  if (!ws) return [];
  const values = ws.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(_normHeaderKeyGantt);
  return values
    .slice(1)
    .map((r) => rowToObj(headers, r))
    .filter((o) => o.item_id && normalizarIdGantt(o.task_id) === normalizarIdGantt(taskId))
    .sort((a, b) => (Number(a.orden) || 0) - (Number(b.orden) || 0));
}

function _leerComentariosGantt(ss, taskId) {
  const ws = ss.getSheetByName(HOJA_TIMELINE_COMENTARIOS);
  if (!ws) return [];
  const values = ws.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(_normHeaderKeyGantt);
  return values
    .slice(1)
    .map((r) => rowToObj(headers, r))
    .filter((o) => o.comentario_id && normalizarIdGantt(o.task_id) === normalizarIdGantt(taskId))
    .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
}

// ── CHECKLIST — escrituras ──────────────────────────────────────

function agregarItemChecklistGantt(d) {
  return ejecutarOperacionGanttConLock("gantt_checklist_add", () =>
    agregarItemChecklistGanttSinLock(d),
  );
}

function agregarItemChecklistGanttSinLock(d) {
  const taskId = limpiarValor(d.task_id);
  if (!taskId) throw new Error("Falta task_id");
  if (!_buscarTareaGanttPorId(taskId)) throw new Error("task_id no existe: " + taskId);
  _verificarOwnershipTareaGantt(d, taskId);
  const texto = validarTextoObligatorioGantt(d.texto, "texto", 300);
  const actor = normalizarActorDeclaradoGantt(
    d.created_by || d._sesEmail,
    "gantt_checklist_sin_actor",
  );

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_TIMELINE_CHECKLIST);
  if (!ws) throw new Error('No existe la hoja "timeline_checklist"');

  const values = ws.getDataRange().getValues();
  const headers = values[0] || [];
  const headerMap = construirMapaHeadersNormalizados(headers);
  const itemIdCol = headerMap["item_id"];
  const taskCol = headerMap["task_id"];
  const ordenCol = headerMap["orden"];

  let maxOrden = 0;
  let maxN = 0;
  const prefix = normalizarIdGantt(taskId) + "-CL-";
  for (let i = 1; i < values.length; i++) {
    if (normalizarIdGantt(values[i][taskCol]) === normalizarIdGantt(taskId)) {
      const orden = Number(values[i][ordenCol]) || 0;
      if (orden > maxOrden) maxOrden = orden;
      const m = String(values[i][itemIdCol]).match(/-CL-(\d+)$/);
      if (m) maxN = Math.max(maxN, Number(m[1]));
    }
  }
  const itemId = prefix + String(maxN + 1).padStart(2, "0");
  const now = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");

  const row = headers.map((h) => {
    const key = normalizarHeaderGantt(h);
    if (key === "item_id") return itemId;
    if (key === "task_id") return taskId;
    if (key === "texto") return texto;
    if (key === "hecho") return "No";
    if (key === "orden") return maxOrden + 1;
    if (key === "created_at" || key === "updated_at") return now;
    if (key === "created_by" || key === "updated_by") return actor;
    return "";
  });
  ws.appendRow(row);

  return { item_id: itemId, task_id: taskId, texto, hecho: "No", orden: maxOrden + 1 };
}

function toggleItemChecklistGantt(d) {
  return ejecutarOperacionGanttConLock("gantt_checklist_toggle", () =>
    toggleItemChecklistGanttSinLock(d),
  );
}

function toggleItemChecklistGanttSinLock(d) {
  const itemId = limpiarValor(d.item_id);
  if (!itemId) throw new Error("Falta item_id");
  const hecho = normalizarBooleanoSiNoGantt(d.hecho);
  const actor = normalizarActorDeclaradoGantt(
    d.updated_by || d._sesEmail,
    "gantt_checklist_sin_actor",
  );

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_TIMELINE_CHECKLIST);
  if (!ws) throw new Error('No existe la hoja "timeline_checklist"');

  const values = ws.getDataRange().getValues();
  const headers = values[0] || [];
  const headerMap = construirMapaHeadersNormalizados(headers);
  const itemIdCol = headerMap["item_id"];
  const taskCol = headerMap["task_id"];
  const hechoCol = headerMap["hecho"];
  const updatedAtCol = headerMap["updated_at"];
  const updatedByCol = headerMap["updated_by"];

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][itemIdCol]).trim() === itemId) {
      const taskId = String(values[i][taskCol]).trim();
      _verificarOwnershipTareaGantt(d, taskId);
      const rowNumber = i + 1;
      ws.getRange(rowNumber, hechoCol + 1).setValue(hecho);
      if (updatedAtCol !== undefined) {
        ws
          .getRange(rowNumber, updatedAtCol + 1)
          .setValue(Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss"));
      }
      if (updatedByCol !== undefined) {
        ws.getRange(rowNumber, updatedByCol + 1).setValue(actor);
      }
      return { item_id: itemId, task_id: taskId, hecho: hecho };
    }
  }
  throw new Error("item_id no existe: " + itemId);
}

function eliminarItemChecklistGantt(d) {
  return ejecutarOperacionGanttConLock("gantt_checklist_delete", () =>
    eliminarItemChecklistGanttSinLock(d),
  );
}

function eliminarItemChecklistGanttSinLock(d) {
  const itemId = limpiarValor(d.item_id);
  if (!itemId) throw new Error("Falta item_id");

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_TIMELINE_CHECKLIST);
  if (!ws) throw new Error('No existe la hoja "timeline_checklist"');

  const values = ws.getDataRange().getValues();
  const headers = values[0] || [];
  const headerMap = construirMapaHeadersNormalizados(headers);
  const itemIdCol = headerMap["item_id"];
  const taskCol = headerMap["task_id"];

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][itemIdCol]).trim() === itemId) {
      const taskId = String(values[i][taskCol]).trim();
      _verificarOwnershipTareaGantt(d, taskId);
      ws.deleteRow(i + 1);
      return { item_id: itemId, task_id: taskId };
    }
  }
  throw new Error("item_id no existe: " + itemId);
}

// ── COMENTARIOS — append-only ────────────────────────────────────

function agregarComentarioGantt(d) {
  return ejecutarOperacionGanttConLock("gantt_comentario_add", () =>
    agregarComentarioGanttSinLock(d),
  );
}

function agregarComentarioGanttSinLock(d) {
  const taskId = limpiarValor(d.task_id);
  if (!taskId) throw new Error("Falta task_id");
  if (!_buscarTareaGanttPorId(taskId)) throw new Error("task_id no existe: " + taskId);
  _verificarOwnershipTareaGantt(d, taskId);
  const texto = validarTextoObligatorioGantt(d.texto, "texto", 1000);

  const autorEmail = limpiarValor(d._sesEmail);
  const autorNombre = _resolverNombreUsuarioGantt(d._sesId) || autorEmail || "Usuario";

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_TIMELINE_COMENTARIOS);
  if (!ws) throw new Error('No existe la hoja "timeline_comentarios"');

  const values = ws.getDataRange().getValues();
  const headers = values[0] || [];
  const headerMap = construirMapaHeadersNormalizados(headers);
  const idCol = headerMap["comentario_id"];
  const taskCol = headerMap["task_id"];

  let maxN = 0;
  const prefix = normalizarIdGantt(taskId) + "-CM-";
  for (let i = 1; i < values.length; i++) {
    if (normalizarIdGantt(values[i][taskCol]) === normalizarIdGantt(taskId)) {
      const m = String(values[i][idCol]).match(/-CM-(\d+)$/);
      if (m) maxN = Math.max(maxN, Number(m[1]));
    }
  }
  const comentarioId = prefix + String(maxN + 1).padStart(2, "0");
  const now = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd HH:mm:ss");

  const row = headers.map((h) => {
    const key = normalizarHeaderGantt(h);
    if (key === "comentario_id") return comentarioId;
    if (key === "task_id") return taskId;
    if (key === "autor_email") return autorEmail;
    if (key === "autor_nombre") return autorNombre;
    if (key === "texto") return texto;
    if (key === "created_at") return now;
    return "";
  });
  ws.appendRow(row);

  return {
    comentario_id: comentarioId,
    task_id: taskId,
    autor_nombre: autorNombre,
    texto,
    created_at: now,
  };
}
