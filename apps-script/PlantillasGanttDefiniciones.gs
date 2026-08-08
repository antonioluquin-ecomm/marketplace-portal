/**
 * SPORTING MARKETPLACE — PlantillasGanttDefiniciones.gs
 * Plantilla de tareas de Gantt por modelo de integración + generación y
 * desbloqueo automático a partir de las definiciones operativas respondidas
 * (DefinicionesOperativas.gs).
 *
 * Una entrada de plantilla = un campo de "definiciones_operativas" = una
 * tarea de Gantt determinística (task_id = {SELLER_ID}-T-DEF-{campo}).
 * - Si el campo todavía no tiene respuesta: se crea "Bloqueado", con un
 *   comentario que explica qué falta definir.
 * - Si ya tiene respuesta (o se responde después): se crea/pasa a
 *   "Pendiente", con el texto de tarea que corresponde a esa respuesta
 *   ("rama"). Si la respuesta no tiene una tarea asociada (ej. "stock
 *   existente" no requiere crear un almacén nuevo), no se genera tarea.
 *
 * Nunca pisa una tarea que un agente ya movió de "Bloqueado" a otro estado
 * (ver evaluarYDesbloquearTareasGantt) — evita destruir trabajo manual en
 * curso por una corrección tardía de una definición.
 */

const PREFIJO_COMENTARIO_BLOQUEO_DEFINICION = "Bloqueada por definición pendiente: ";

// v1 — solo VTEX ↔ VTEX (alcance acordado). Gestión Asistida se suma después
// con su propia plantilla, sin rediseño del mecanismo.
const PLANTILLA_TAREAS_VTEX_VTEX = [
  {
    campo: "carga_invoice_url",
    pregunta: "¿Cargás la factura en el pedido de tu VTEX (invoiceUrl)?",
    fase: "Pedido",
    hito: "Facturación",
    ramas: {
      si: { tarea: "Validar carga de invoiceUrl en QA", area_responsable: "Seller", entorno: "QA" },
      no: { tarea: "Definir camino alternativo de factura (Fase 7a.3)", area_responsable: "Operaciones", entorno: "Productivo" },
    },
  },
  {
    campo: "logistica_directa",
    pregunta: "¿Quién hace el despacho: vos o el Marketplace?",
    fase: "Envíos",
    hito: "Logística directa",
    ramas: {
      seller: { tarea: "Cargar Courier/trackingNumber/trackingUrl en tu VTEX", area_responsable: "Seller", entorno: "Productivo" },
      marketplace: { tarea: "Configurar solicitud de retiro con nuestros carriers", area_responsable: "Operaciones", entorno: "Productivo" },
    },
  },
  {
    campo: "logistica_inversa",
    pregunta: "¿Quién gestiona la devolución: vos o el Marketplace?",
    fase: "Devoluciones",
    hito: "Logística inversa",
    ramas: {
      seller: { tarea: "Compartir Carrier y credenciales de inversa", area_responsable: "Seller", entorno: "Productivo" },
      marketplace: { tarea: "Solicitar contrato de retiro al carrier", area_responsable: "Operaciones", entorno: "Productivo" },
    },
  },
  {
    campo: "fuente_precio",
    pregunta: "¿Usás tu lista de precios actual o creás una nueva para el Marketplace?",
    fase: "Precio y stock",
    hito: "Precio",
    // Sin ramas: cualquier respuesta dispara la misma tarea única.
    tareaUnica: { tarea: "Configurar fuente de precio en VCC", area_responsable: "eCommerce", entorno: "Productivo" },
  },
  {
    campo: "stock_diferenciado",
    pregunta: "¿Vas a usar un almacén nuevo (stock diferenciado) o el que ya usás?",
    fase: "Precio y stock",
    hito: "Stock",
    ramas: {
      nuevo: { tarea: "Crear almacén dedicado en VTEX", area_responsable: "Seller", entorno: "Productivo" },
      // "existente" no genera tarea — informativo, no requiere configuración nueva.
    },
  },
];

const PLANTILLAS_TAREAS_POR_MODELO = {
  "VTEX ↔ VTEX": PLANTILLA_TAREAS_VTEX_VTEX,
};

function _plantillaParaModelo(modelo) {
  return PLANTILLAS_TAREAS_POR_MODELO[String(modelo || "").trim()] || null;
}

function _taskIdPlantillaDefinicion(sellerId, campo) {
  return normalizarIdGantt(sellerId) + "-T-DEF-" + campo.toUpperCase();
}

function _ramaPlantilla(entry, respuestaCruda) {
  if (!respuestaCruda) return null;
  const ramaKey = normalizarTexto(respuestaCruda);
  return entry.ramas ? entry.ramas[ramaKey] || null : entry.tareaUnica || null;
}

function _leerFilaDefinicionesOperativas(sellerId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const ws = ss.getSheetByName(HOJA_DEFINICIONES_OPERATIVAS);
  if (!ws) return {};
  const rowIndex = buscarFilaPorSellerId(ws, sellerId);
  if (!rowIndex) return {};
  const rowValues = ws
    .getRange(rowIndex, 1, 1, HEADERS_DEFINICIONES_OPERATIVAS.length)
    .getValues()[0];
  return rowToObj(HEADERS_DEFINICIONES_OPERATIVAS, rowValues);
}

// Lectura liviana de una tarea de Gantt por task_id (solo estado/hito) — no
// reemplaza a _buscarTareaGanttPorId (Gantt.gs), que solo devuelve seller_id
// (para ownership); acá hace falta más que eso.
function _leerTareaGanttCompletaPorId(taskId) {
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
  const row = coincidencias[0].row;
  const estadoCol = resolverIndiceHeader(headerMap, CAMPOS_GANTT_CREATE_ALIASES.estado);
  const hitoCol = resolverIndiceHeader(headerMap, ["hito"]);
  return {
    estado: estadoCol === -1 ? "" : limpiarValor(row[estadoCol]),
    hito: hitoCol === -1 ? "" : limpiarValor(row[hitoCol]),
  };
}

function _sumarDiasFecha(fechaStr, dias) {
  const d = new Date(fechaStr + "T00:00:00");
  d.setDate(d.getDate() + dias);
  return Utilities.formatDate(d, TIMEZONE, "yyyy-MM-dd");
}

// Se dispara una vez por seller (botón "Generar plantilla de tareas de
// Gantt" en gestion-sellers.html), cuando ya está confirmado el modelo de
// integración. Idempotente: si una tarea ya existe (task_id determinístico
// por campo), no la vuelve a crear ni la toca.
function generarTareasBaseGantt(sellerId, modelo, sellerNombre, actor) {
  const plantilla = _plantillaParaModelo(modelo);
  if (!plantilla) {
    throw new Error("No hay plantilla de tareas de Gantt para el modelo: " + modelo);
  }

  const definiciones = _leerFilaDefinicionesOperativas(sellerId);

  return ejecutarOperacionGanttConLock("gantt_def_generar_base", () => {
    const creadas = [];
    const yaExistentes = [];
    const hoy = Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd");
    const fin = _sumarDiasFecha(hoy, 14); // placeholder, se ajusta a mano en el Gantt

    plantilla.forEach((entry) => {
      const taskId = _taskIdPlantillaDefinicion(sellerId, entry.campo);
      if (_leerTareaGanttCompletaPorId(taskId)) {
        yaExistentes.push(taskId);
        return;
      }

      const respuestaCruda = definiciones[entry.campo] || "";
      const rama = _ramaPlantilla(entry, respuestaCruda);

      if (respuestaCruda && !rama) {
        // Respondida pero sin tarea asociada a esa rama (ej. stock "existente") — informativo, no crea tarea.
        return;
      }

      let tarea, areaResponsable, entorno, estado, comentario;
      if (rama) {
        tarea = rama.tarea;
        areaResponsable = rama.area_responsable;
        entorno = rama.entorno;
        estado = "Pendiente";
        comentario = "";
      } else {
        tarea = "Definir: " + entry.pregunta;
        areaResponsable = "Seller";
        entorno = "Productivo";
        estado = "Bloqueado";
        comentario = PREFIJO_COMENTARIO_BLOQUEO_DEFINICION + entry.pregunta;
      }

      crearTareaGanttSinLock({
        created_by: actor,
        task: {
          task_id: taskId,
          seller_id: sellerId,
          seller_nombre: sellerNombre || "",
          fase: entry.fase,
          hito: entry.hito,
          tarea,
          area_responsable: areaResponsable,
          entorno,
          inicio: hoy,
          fin,
          estado,
          comentario,
        },
      });
      creadas.push({ task_id: taskId, estado });
    });

    return { creadas, ya_existentes: yaExistentes };
  });
}

// Se llama desde guardarDefinicionOperativa (DefinicionesOperativas.gs) en el
// mismo request que guarda la respuesta. Por cada campo actualizado, busca su
// tarea determinística y, si sigue "Bloqueado", la desbloquea. Si la tarea ya
// se movió a otro estado (un agente la tocó a mano), NO la pisa — solo deja
// constancia en AUDIT_LOG para revisión manual.
function evaluarYDesbloquearTareasGantt(sellerId, camposActualizados, actor) {
  const fila = _leerFilaDefinicionesOperativas(sellerId);
  const plantilla = _plantillaParaModelo(fila.modelo_integracion);
  if (!plantilla) {
    return { skipped: true, motivo: "Sin modelo de integración definido para " + sellerId };
  }

  return ejecutarOperacionGanttConLock("gantt_def_desbloqueo", () => {
    const resultados = [];

    Object.keys(camposActualizados).forEach((campo) => {
      const entry = plantilla.filter((e) => e.campo === campo)[0];
      if (!entry) return;

      const taskId = _taskIdPlantillaDefinicion(sellerId, campo);
      const tarea = _leerTareaGanttCompletaPorId(taskId);

      if (!tarea) {
        // Todavía no se generó la plantilla base para este seller — no crea
        // nada suelto acá; se resolverá bien cuando corra generarTareasBaseGantt.
        resultados.push({ campo, accion: "sin_tarea_base" });
        return;
      }

      if (tarea.estado !== "Bloqueado") {
        writeAuditLog(
          "evaluarDefinicionOperativa",
          "definiciones_operativas",
          sellerId,
          "definición '" + campo + "' modificada — " + taskId + " ya no está Bloqueado (" +
            tarea.estado + "), revisar a mano",
          actor,
        );
        resultados.push({ campo, accion: "sin_cambios_tarea_no_bloqueada" });
        return;
      }

      const respuestaCruda = fila[campo] || "";
      const rama = _ramaPlantilla(entry, respuestaCruda);

      if (!rama) {
        resultados.push({ campo, accion: "sin_rama_aplicable" });
        return;
      }

      actualizarTareaGanttSinLock({
        task_id: taskId,
        updated_by: actor,
        fields: {
          estado: "Pendiente",
          comentario:
            "Definición resuelta (" + respuestaCruda + "): " + rama.tarea +
            (rama.area_responsable ? " — responsable: " + rama.area_responsable : ""),
          area_responsable: rama.area_responsable,
          entorno: rama.entorno,
        },
      });
      resultados.push({ campo, accion: "desbloqueada", task_id: taskId });
    });

    return resultados;
  });
}
