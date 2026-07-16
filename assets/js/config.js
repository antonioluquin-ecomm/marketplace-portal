/**
 * SPORTING MARKETPLACE — Configuración central
 * Versión final
 * ------------------------------------------------------------
 * Este archivo centraliza URLs, rutas y fuentes compartidas por el HUB,
 * páginas internas, formularios públicos, simuladores y herramientas.
 *
 * Ubicación recomendada:
 * /assets/js/config.js
 */

/* ─── VERSIÓN ──────────────────────────────────────────────────────────
   Badge de versión con historial en el topbar interno — mismo patrón que
   Project Control Center y VTEX Control Center (ver config.js de esos
   repos). Solo aplica al shell azul (index.html + internal/); public/
   mantiene su identidad verde y se auto-excluye por path en
   initVersionBadge() más abajo.
   Al hacer un cambio funcional visible: sumar una entrada NUEVA al inicio
   de CHANGELOG (más reciente primero) y actualizar VERSION.number/date. */
const VERSION = {
  number: '1.4.24',
  date:   '2026-07-16',
  notes:  'Corrige la vista Lista de Seguimiento Operativo',
};

const CHANGELOG = [
  { v: '1.4.24', date: '2026-07-16', desc: 'Seguimiento Operativo unifica contadores, corrige el scroll y la legibilidad de Lista, reduce acciones riesgosas y mejora contraste y accesibilidad.' },
  { v: '1.4.23', date: '2026-07-16', desc: 'El nav de las 6 paginas publicas de seller (presentacion, simulador, calificacion, relevamiento, gantt, integracion) pasa a generarse desde una unica fuente en auth-seller.js en vez de estar hardcodeado y duplicado por pagina — corrige que integracion-seller.html no tuviera nav en el topbar.' },
  { v: '1.4.22', date: '2026-07-16', desc: 'Corrige que los campos Rol y Seller del modal de "Nuevo usuario" (Configuración) se mostraran a la vez: .field{display:grid} le ganaba en cascada a [hidden]{display:none}.' },
  { v: '1.4.21', date: '2026-07-16', desc: 'Las paginas publicas simples del portal seller adoptan un marco visual liviano: margenes consistentes, radios de 8px y codigos de recursos mas estables.' },
  { v: '1.4.20', date: '2026-07-16', desc: 'El Hub Central se alinea al shell interno: margenes, radios de cards/paneles y jerarquia visual quedan consistentes con las pantallas operativas migradas.' },
  { v: '1.4.19', date: '2026-07-16', desc: 'El Simulador Economico adopta un marco visual propio de herramienta: encabezado interno con jerarquia clara, margenes operativos consistentes y columnas de resultados/tarifas alineadas sin tocar calculos.' },
  { v: '1.4.18', date: '2026-07-16', desc: 'Gantt Seller Center adopta el mismo marco portal-ops-* que las pantallas operativas densas: header, KPIs, filtros y avance por modulo quedan alineados al ancho comun.' },
  { v: '1.4.17', date: '2026-07-16', desc: 'Se agrega una capa opt-in portal-ops-* para normalizar el marco visual de pantallas operativas densas: Backlog, Gestion de Sellers y Seguimiento Operativo alinean ancho, encabezados y filtros sin tocar su logica.' },
  { v: '1.4.16', date: '2026-07-16', desc: 'Se mejora el modal de alta/edición de usuario en Configuración: selector segmentado Interno/Seller, errores por campo, validación de email, generador de contraseña, cierre con Escape/click afuera y Enter para guardar, y aviso de cuántas cuentas activas tiene ya un seller.' },
  { v: '1.4.15', date: '2026-07-16', desc: 'Se permite crear varias cuentas Seller para el mismo seller_id (antes era una cuenta compartida). Configuración suma buscador y filtro por seller, el alta de usuario Seller pasa de texto libre a un selector con los sellers reales, y se agrega un resguardo para no dejar a un seller sin ninguna cuenta activa.' },
  { v: '1.4.14', date: '2026-07-16', desc: 'Se introducen primitivas opt-in portal-* para KPIs, panels, campos y cards, aplicadas inicialmente en Config. Tarifas y Seller Center.' },
  { v: '1.4.13', date: '2026-07-16', desc: 'Se normaliza el espaciado y la jerarquia de encabezados internos en paginas de administracion, estrategia, Seller Center y Config. Tarifas mediante el patron opt-in portal-main.' },
  { v: '1.4.12', date: '2026-07-16', desc: 'El Simulador Economico interno nunca usaba tarifas en vivo (bug de orden de scripts, mismo patron que el Gantt Seller Center) y el toggle de Logistica directa no recalculaba el total. Ambos corregidos.' },
  { v: '1.4.11', date: '2026-07-16', desc: 'Se normaliza la primera etapa del shell interno: el boton de colapso del sidebar queda desacoplado del topbar y se reduce el espacio superior del menu lateral para alinear mejor las paginas.' },
  { v: '1.4.10', date: '2026-07-15', desc: 'Se saca el panel "Clave de escritura" de Config. Tarifas: era codigo muerto (nunca se enviaba al backend) que sugeria una proteccion de escritura que no existe. La escritura ya esta 100% gateada por sesion/RBAC.' },
  { v: '1.4.9', date: '2026-07-15', desc: 'Se refina el topbar interno: la marca deja de usar la placa verde completa, queda como simbolo + texto, el badge de version baja protagonismo y el control de sidebar pasa al borde del panel lateral.' },
  { v: '1.4.8', date: '2026-07-15', desc: 'Se saca una linea no-op en qfClick() y la clase CSS .dep-line sin uso del Gantt Seller Center: ninguna reproducia un bug, era codigo muerto.' },
  { v: '1.4.7', date: '2026-07-15', desc: 'Se migra el Gantt Seller Center de un CSV publicado a la web (sin login) a la accion gateada getScRoadmap: cerraba una exposicion real de datos del roadmap interno.' },
  { v: '1.4.6', date: '2026-07-15', desc: 'Se mejora la presentacion visual del login interno y del login de sellers: logo mas integrado, jerarquia de acceso mas clara, tarjeta mas sobria, inputs blancos y estados de foco/hover mas pulidos.' },
  { v: '1.4.5', date: '2026-07-15', desc: 'Se corrige el sidebar interno: todos los links mantienen el mismo peso tipografico regular entre paginas; el activo solo se diferencia por color, fondo y borde activo.' },
  { v: '1.4.4', date: '2026-07-15', desc: 'Se agrega la columna "Cancelado" al Kanban de Seguimiento Operativo: faltaba para el 5º estado real de una tarea y las canceladas desaparecían de esa vista sin dejar rastro.' },
  { v: '1.4.3', date: '2026-07-15', desc: 'Se agrega el módulo RBAC ext_integracion (faltaba junto a ext_presentacion/ext_calificacion/ext_relevamiento/ext_simulador/ext_gantt) y su link "Guía de integración" al sidebar de "Vista de sellers" en las 14 páginas internas que lo tienen.' },
  { v: '1.4.2', date: '2026-07-15', desc: 'Se saca "Descartado" de las opciones de Estado del modal de edición rápida del Backlog de Sellers: no era una de las 8 etapas canónicas y desaparecía silenciosamente (se reinterpretaba como "Pausado") en el siguiente refresh.' },
  { v: '1.4.1', date: '2026-07-15', desc: 'Se integra la nueva identidad visual del Marketplace: logo principal como SVG versionado y favicon institucional.' },
  { v: '1.4.0', date: '2026-07-15', desc: 'Se corrige el selector de Estado de Gestión de Sellers: "Aprobado para integrar" no matcheaba ninguna etapa canónica del Backlog y quedaba invisible en el Kanban. Ahora usa las 8 etapas exactas, con compatibilidad para sellers ya guardados con el valor viejo.' },
  { v: '1.3.1', date: '2026-07-14', desc: 'Se elimina "Configuración" del dropdown de usuario en auth.js: duplicaba el link ya fijo en el footer del sidebar y, además, estaba hardcodeado a una ruta rota fuera de index.html. Ahora aparece una sola vez, igual que en VTEX Control Center y Project Control Center.' },
  { v: '1.3.0', date: '2026-07-14', desc: 'Se agregan Gantt del seller y Guía de integración a la grilla del Hub (index.html) y a los modales de links de Gestión/Backlog de Sellers — mismo hueco que se venía de cerrar en config.js.' },
  { v: '1.2.0', date: '2026-07-14', desc: 'Se completan ROUTES.PUBLIC (faltaban GANTT_SELLER e INTEGRACION_SELLER) y RESOURCES (faltaban 7 páginas internas, entre ellas la guía de Integración VTEX ↔ VTEX) — mismo patrón de lista desactualizada que el changelog.' },
  { v: '1.1.0', date: '2026-07-14', desc: 'Se reconstruye este historial: no se venía actualizando desde la v1.0.0 pese a 9 cambios visibles posteriores, ya documentados en CHANGELOG.md pero nunca reflejados acá.' },
  { v: '1.0.9', date: '2026-07-14', desc: 'Se termina de alinear governance.html y proyecto-marketplace.html a los 3 modelos de integración vigentes (quedaba vocabulario viejo sin migrar).' },
  { v: '1.0.8', date: '2026-07-14', desc: 'Se unifica el campo "Método de integración preferido" del Relevamiento a los 3 modelos vigentes (tenía 5 opciones con otra redacción).' },
  { v: '1.0.7', date: '2026-07-14', desc: 'Se renombra el modelo "Seller Center" a "Gestión asistida" para no confundirlo con el producto/herramienta del mismo nombre.' },
  { v: '1.0.6', date: '2026-07-14', desc: 'Se sacan accesos de navegación duplicados de los topbars internos (← Hub, ← Backlog, + Seller, Ver Gantt) que ya existían en el sidebar.' },
  { v: '1.0.5', date: '2026-07-14', desc: 'Se saca el filtro "Ordenar" del Backlog de Sellers (redundante con el sort por columna) y se agrega "Pausado" al filtro de Estado.' },
  { v: '1.0.4', date: '2026-07-14', desc: 'Limpieza visual del Backlog de Sellers: se sacan los accesos rápidos y la categoría de la grilla de Lista/Kanban.' },
  { v: '1.0.3', date: '2026-07-14', desc: 'El formulario de Relevamiento oculta las secciones de Catálogo y Stock/Precios para sellers VTEX ↔ VTEX, que sincronizan eso automáticamente.' },
  { v: '1.0.2', date: '2026-07-14', desc: 'Se unifica "Modelo de integración estimado" a 3 valores en toda la app (antes había 4 vocabularios distintos y desalineados).' },
  { v: '1.0.1', date: '2026-07-14', desc: 'Gestión y Backlog de Sellers ya no arman links públicos con seller_id en la URL; se resuelve por sesión o por el selector de "ver como seller".' },
  { v: '1.0.0', date: '2026-07-14', desc: 'Se agrega el badge de versión con historial en el topbar interno (index.html + internal/), replicando el patrón de Project Control Center / VTEX Control Center.' },
];


function initBrandFavicon() {
  const script = document.currentScript;
  const src = script ? script.getAttribute('src') || '' : '';
  const base = src.indexOf('assets/js/config.js') !== -1
    ? src.replace(/assets\/js\/config\.js(?:\?.*)?$/, '')
    : '';
  const href = base + 'assets/brand/favicon.svg';
  let icon = document.querySelector('link[rel="icon"]');
  if (!icon) {
    icon = document.createElement('link');
    icon.rel = 'icon';
    document.head.appendChild(icon);
  }
  icon.type = 'image/svg+xml';
  icon.href = href;
}

initBrandFavicon();
function initVersionBadge() {
  if (location.pathname.indexOf('/public/') !== -1) return;
  const brand = document.querySelector('.brand');
  if (!brand || document.getElementById('tbVersionBtn') || !CHANGELOG.length) return;

  const VERSION_BADGE_HISTORY_LIMIT = 15;
  const recentChangelog = CHANGELOG.slice(0, VERSION_BADGE_HISTORY_LIMIT);
  const esc = typeof escapeHtml === 'function' ? escapeHtml : String;

  const btn = document.createElement('div');
  btn.className = 'tb-version';
  btn.id = 'tbVersionBtn';
  btn.title = 'Ver historial de cambios';
  btn.textContent = 'v' + VERSION.number;
  brand.appendChild(btn);

  const popover = document.createElement('div');
  popover.className = 'tb-version-popover';
  popover.id = 'tbVersionPopover';
  popover.style.display = 'none';
  popover.innerHTML =
    '<div class="tb-version-popover-title">Historial de cambios</div>'
    + recentChangelog.map(function (c) {
        return '<div class="tb-version-entry">'
          + '<span class="tb-version-entry-v">v' + esc(c.v) + '</span>'
          + '<span class="tb-version-entry-date">' + esc(c.date) + '</span>'
          + '<div class="tb-version-entry-desc">' + esc(c.desc) + '</div>'
          + '</div>';
      }).join('');
  document.body.appendChild(popover);

  function positionPopover() {
    const rect = btn.getBoundingClientRect();
    popover.style.top  = (rect.bottom + 6) + 'px';
    popover.style.left = rect.left + 'px';
  }

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    const show = popover.style.display === 'none';
    if (show) positionPopover();
    popover.style.display = show ? 'block' : 'none';
  });
  document.addEventListener('click', function () { popover.style.display = 'none'; });
}

document.addEventListener('DOMContentLoaded', initVersionBadge);

window.MP_CONFIG = {
  PROJECT_NAME: "Sporting Marketplace",

  BASE_URL: "https://antonioluquin-ecomm.github.io/marketplace-portal",

  // Apps Script central Marketplace
  APPS_SCRIPT_URL:
    "https://script.google.com/macros/s/AKfycbxryK0ucSoM_SMrAuwolP-KfxXwpMNUiAapVxC4UVV1G2wFtRohSExivRwQjh60ZHjd/exec",

  // Google Sheets publicados como CSV
  CSV: {
    CONFIG:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwd-qIMhoH1poJpaTZqN-7O5IGAfPDTxslBAX8LCPogTkwheW2vWsq59JkvvYakM8ndCKgUQualQyi/pub?gid=1925619599&single=true&output=csv",

    // SELLERS, TIMELINE, TARIFAS y OVERRIDES: eliminados en la Etapa 6
    // (auditoría de seguridad) — la lectura ahora pasa por los endpoints
    // gateados por sesión `getSellers`/`getGantt`/`getTarifas`/`getOverrides`
    // (apps-script/). Todas las pestañas
    // sensibles ya están despublicadas en Google Sheets.
  },

  ASSETS: {
    LOGO_BASE_URL:
      "https://antonioluquin-ecomm.github.io/marketplace-portal/assets/logos/",
    IMAGES_BASE_URL:
      "https://antonioluquin-ecomm.github.io/marketplace-portal/assets/imagenes/",
    CSS_BASE_URL:
      "https://antonioluquin-ecomm.github.io/marketplace-portal/assets/css/",
    JS_BASE_URL:
      "https://antonioluquin-ecomm.github.io/marketplace-portal/assets/js/"
  },

  ROUTES: {
    HOME: "/",

    INTERNAL: {
      BACKLOG_SELLERS:
        "/internal/backlog/backlog-sellers.html",

      GESTION_SELLERS:
        "/internal/backlog/gestion-sellers.html",

      GANTT_OPERATIVO:
        "/internal/gantt/gantt-operativo.html",

      GANTT_SELLER_CENTER:
        "/internal/gantt/gantt-seller-center.html",

      DASHBOARD_SELLER_CENTER:
        "/internal/seller-center/index.html",

      MAQUETA_SELLER_CENTER:
        "/internal/seller-center/maqueta-seller-center.html",

      SIMULADOR_ECONOMICO:
        "/internal/simuladores/simulador-economico.html"
    },

    PUBLIC: {
      FORMULARIO_CALIFICACION:
        "/public/formularios/formulario-calificacion.html",

      FORMULARIO_RELEVAMIENTO:
        "/public/formularios/formulario-relevamiento.html",

      PRESENTACION_SELLER:
        "/public/presentaciones/presentacion-seller.html",

      SIMULADOR_SELLER:
        "/public/simuladores/simulador-seller.html",

      GANTT_SELLER:
        "/public/gantt/gantt-seller.html",

      INTEGRACION_SELLER:
        "/public/integracion/integracion-seller.html"
    }
  },

  // GitHub repo para upload de logos vía API (el token se guarda en localStorage por el usuario)
  GITHUB_REPO: "antonioluquin-ecomm/marketplace-portal",
  GITHUB_BRANCH: "main",

  ACCESS: {
    INTERNAL: "Interno",
    SELLER: "Seller"
  },

  // Catálogo central de recursos para HUB, menús y validaciones
  RESOURCES: [
    {
      key: "backlog_sellers",
      label: "Backlog de Sellers",
      access: "Interno",
      route: "/internal/backlog/backlog-sellers.html"
    },
    {
      key: "gestion_sellers",
      label: "Gestión de Sellers",
      access: "Interno",
      route: "/internal/backlog/gestion-sellers.html"
    },
    {
      key: "gantt_operativo",
      label: "Gantt Operativo",
      access: "Interno",
      route: "/internal/gantt/gantt-operativo.html"
    },
    {
      key: "gantt_seller_center",
      label: "Gantt Seller Center",
      access: "Interno",
      route: "/internal/gantt/gantt-seller-center.html"
    },
    {
      key: "dashboard_seller_center",
      label: "Dashboard Seller Center",
      access: "Interno",
      route: "/internal/seller-center/index.html"
    },
    {
      key: "maqueta_seller_center",
      label: "Maqueta Seller Center",
      access: "Interno",
      route: "/internal/seller-center/maqueta-seller-center.html"
    },
    {
      key: "simulador_economico",
      label: "Simulador Económico",
      access: "Interno",
      route: "/internal/simuladores/simulador-economico.html"
    },
    {
      key: "config_tarifas",
      label: "Config. Tarifas y Overrides",
      access: "Interno",
      route: "/internal/simuladores/config-tarifas.html"
    },
    {
      key: "proyecto_marketplace",
      label: "Proyecto Marketplace",
      access: "Interno",
      route: "/internal/estrategia/proyecto-marketplace.html"
    },
    {
      key: "modelo_integracion",
      label: "Modelo de Integración",
      access: "Interno",
      route: "/internal/estrategia/modelo-integracion.html"
    },
    {
      key: "integracion_vtex_vtex",
      label: "Integración VTEX ↔ VTEX",
      access: "Interno",
      route: "/internal/estrategia/integracion-vtex-vtex.html"
    },
    {
      key: "modelo_economico",
      label: "Modelo Económico",
      access: "Interno",
      route: "/internal/estrategia/modelo-economico.html"
    },
    {
      key: "governance",
      label: "Governance",
      access: "Interno",
      route: "/internal/estrategia/governance.html"
    },
    {
      key: "onboarding",
      label: "Proceso de Onboarding",
      access: "Interno",
      route: "/internal/estrategia/proceso-onboarding.html"
    },
    {
      key: "formulario_calificacion",
      label: "Formulario Calificación",
      access: "Seller",
      route: "/public/formularios/formulario-calificacion.html"
    },
    {
      key: "formulario_relevamiento",
      label: "Formulario Relevamiento",
      access: "Seller",
      route: "/public/formularios/formulario-relevamiento.html"
    },
    {
      key: "presentacion_seller",
      label: "Presentación Seller",
      access: "Seller",
      route: "/public/presentaciones/presentacion-seller.html"
    },
    {
      key: "simulador_seller",
      label: "Simulador Seller",
      access: "Seller",
      route: "/public/simuladores/simulador-seller.html"
    },
    {
      key: "gantt_seller",
      label: "Gantt de tu proyecto",
      access: "Seller",
      route: "/public/gantt/gantt-seller.html"
    },
    {
      key: "integracion_seller",
      label: "Guía de integración",
      access: "Seller",
      route: "/public/integracion/integracion-seller.html"
    }
  ],

  /**
   * Devuelve una URL absoluta desde una ruta relativa del proyecto.
   * Ejemplo:
   * MP_CONFIG.toAbsoluteUrl(MP_CONFIG.ROUTES.PUBLIC.PRESENTACION_SELLER)
   */
  toAbsoluteUrl(path) {
    if (!path) return this.BASE_URL;
    if (/^https?:\/\//i.test(path)) return path;
    const cleanBase = this.BASE_URL.replace(/\/$/, "");
    const cleanPath = String(path).startsWith("/") ? path : "/" + path;
    return cleanBase + cleanPath;
  },

  /**
   * Devuelve un recurso por key.
   * Ejemplo:
   * MP_CONFIG.getResource("gestion_sellers")
   */
  getResource(key) {
    return this.RESOURCES.find((resource) => resource.key === key) || null;
  },

  /**
   * Compatibilidad: las páginas públicas resuelven el seller por sesión.
   * No agrega seller_id a la URL.
   */
  withSellerId(path, sellerId) {
    return this.toAbsoluteUrl(path);
  }
};

/**
 * Módulos RBAC del equipo interno — usados por assets/js/auth.js para
 * ocultar links del sidebar (applyPermissionsToSidebar) y bloquear el acceso
 * directo por URL (initAuth(moduleKey)), y por la matriz de permisos en
 * internal/administracion/usuarios.html.
 *
 * Cada key coincide con el data-page de los <a class="nav" data-page="...">
 * del sidebar y con el módulo que se le pasa a initAuth() en cada página.
 * El Administrador (id_rol=1) siempre tiene acceso a todos los módulos.
 */
// Etapa 9d — registro unificado de módulos con `tier`:
//  · 'interno'  → páginas de internal/ (shell azul).
//  · 'externo'  → páginas de public/ (shell verde) que el staff puede abrir en
//    modo "ver como seller". El tier es una regla dura: un seller (id_rol=2)
//    NUNCA alcanza un módulo interno (gateado en auth-seller.js/backend), aunque
//    RBAC le habilitara algo por error. RBAC solo decide qué módulos dentro de
//    un tier ve cada rol interno.
window.MP_RBAC_MODULOS = [
  { key: "backlog",          label: "Backlog de Sellers",              tier: "interno" },
  { key: "gantt",            label: "Gantt (Operativo + Seller Center)", tier: "interno" },
  { key: "seller_center",    label: "Seller Center",                   tier: "interno" },
  { key: "simuladores",      label: "Simuladores y Tarifas",           tier: "interno" },
  { key: "estrategia",       label: "Modelo y Estrategia",             tier: "interno" },
  { key: "ext_presentacion", label: "Presentación seller",             tier: "externo" },
  { key: "ext_calificacion", label: "Formulario calificación",         tier: "externo" },
  { key: "ext_relevamiento", label: "Formulario relevamiento",         tier: "externo" },
  { key: "ext_simulador",    label: "Simulador seller",                tier: "externo" },
  { key: "ext_gantt",        label: "Gantt del seller",                tier: "externo" },
  { key: "ext_integracion",  label: "Guía de integración",             tier: "externo" }
];
