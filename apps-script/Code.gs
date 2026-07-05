/**
 * SPORTING MARKETPLACE — Code.gs
 * Entry points (doGet/doPost), router y guards de nivel router.
 * Convenciones: apps_script_standards.md.
 */



function doPost(e) {
  try {
    const raw = e && e.postData ? e.postData.contents : "";
    const data = JSON.parse(raw || "{}");

    // ── Rutas de autenticación (Auth.gs) — nuevas, no pisan tipo_formulario ──
    if (data.action) {
      return jsonResp(routeAuthAction(data));
    }

    const tipoFormulario = normalizarTipoFormulario(data.tipo_formulario);

    if (tipoFormulario === "relevamiento_profile_save") {
      validarSesionSellerParaFormulario(tipoFormulario, data, String(data.seller_id || "").trim());
      const resultadoPerfil = upsertPerfilRelevamiento(data);
      return jsonResp({
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
      // Etapa 9a — cierra el hueco: antes esta escritura no validaba sesión ni
      // pertenencia (cualquier POST podía editar cualquier tarea). Ahora exige
      // sesión válida e inyecta rol/seller para el guard de ownership en Gantt.gs.
      const sesGantt = _validateSessionToken(data.session_token);
      if (!sesGantt.ok) throw new Error("Sesión requerida para editar tareas del Gantt. Iniciá sesión de nuevo.");
      data._sesRol = sesGantt.id_rol;
      data._sesSellerId = sesGantt.seller_id || "";
      const resultadoGantt = actualizarTareaGantt(data);
      return jsonResp({
        ok: true,
        task_id: resultadoGantt.task_id,
        updated_fields: resultadoGantt.updated_fields,
      });
    }

    if (tipoFormulario === "gantt_task_create") {
      const resultadoGantt = crearTareaGantt(data);
      return jsonResp({
        ok: true,
        task_id: resultadoGantt.task_id,
        created_fields: resultadoGantt.created_fields,
        row_number: resultadoGantt.row_number,
        message: "Tarea Gantt creada",
      });
    }

    if (tipoFormulario === "gantt_task_disable") {
      const resultadoGantt = darDeBajaTareaGantt(data);
      return jsonResp({
        ok: true,
        task_id: resultadoGantt.task_id,
        disabled_fields: resultadoGantt.disabled_fields,
        row_number: resultadoGantt.row_number,
        message: "Tarea Gantt dada de baja logicamente",
      });
    }

    if (tipoFormulario === "tarifas_update") {
      validarWriteSecret(data);
      return jsonResp(actualizarTarifas(data));
    }

    if (tipoFormulario === "override_update") {
      validarWriteSecret(data);
      return jsonResp(actualizarOverridesSeller(data));
    }

    if (tipoFormulario === "logo_upload") {
      validarWriteSecret(data);
      return jsonResp(subirLogoAGitHub(data));
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

    return jsonResp({
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

    return errorResp(err);
  }
}

function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = String(params.action || "").trim().toLowerCase();

    if (action === "relevamiento_profile_get") {
      validarSesionSellerParaLectura(params, String(params.seller_id || "").trim());
      return jsonResp(obtenerPerfilRelevamiento(params));
    }
  } catch (err) {
    console.error("Error en doGet:", err.toString());
    return errorResp(err);
  }

  return jsonResp({
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
  // Etapa 9a — el exceptuado pasa de "solo admin" a "cualquier sesión interna"
  // (sin seller_id): coherente con _aplicarSellerScope, permite al staff ver un
  // seller puntual desde el selector. Un seller (con seller_id) sigue acotado
  // a lo suyo.
  const esInterno = !sesVal.seller_id;
  if (!esInterno) {
    if (sesVal.seller_id.toUpperCase() !== String(sellerId).toUpperCase()) {
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


// ── Serialización de respuesta (contrato del Web App) ──
function jsonResp(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
function errorResp(err) {
  return jsonResp({
    ok: false,
    error: err && err.message ? err.message : String(err),
    code: 500,
  });
}
