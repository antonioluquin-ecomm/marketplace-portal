/**
 * SPORTING MARKETPLACE - Apps Script config
 *
 * Constantes globales compartidas por los modulos del proyecto.
 * No ejecutar side effects en este archivo.
 */

const SPREADSHEET_ID = "1S_pl358H8nbJC3xgd7UpRpOxTYkC_hopYcBX6WzMlzU";
const EMAIL_NOTIFICACION = "gabriel.luna@luquin.com.ar";
const TIMEZONE = "America/Argentina/Buenos_Aires";

const HOJA_SELLERS = "sellers";
const HOJA_CALIFICACIONES = "calificaciones";
const HOJA_RELEVAMIENTO = "relevamientos";
const HOJA_DEFINICION_TECNICA = "definicion_tecnica";
const HOJA_TIMELINE = "timeline";
const HOJA_TIMELINE_CHECKLIST = "timeline_checklist";
const HOJA_TIMELINE_COMENTARIOS = "timeline_comentarios";
const HOJA_TARIFAS = "tarifas";
const HOJA_OVERRIDES = "overrides";
const HOJA_SC_ROADMAP = "sc_roadmap";

// PAT de GitHub para subir logos via Apps Script (logo_upload).
// Fine-grained token con permisos contents:write sobre antonioluquin-ecomm/marketplace-portal.
// Clave: GITHUB_PAT  |  Valor: <token generado en github.com/settings/tokens>

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

// ── Políticas de campos por dominio (movidas desde el monolito) ──
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
