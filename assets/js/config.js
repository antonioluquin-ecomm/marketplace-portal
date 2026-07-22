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
  number: '1.4.56',
  date:   '2026-07-22',
  notes:  'Gantt: el badge de estado ya no se derrama sobre el timeline',
};

/* Máximo 10 entradas (project-standards/application_shell.md §8.5) — descripción breve,
 * de una línea. Al agregar una versión nueva, quitar la más antigua del final. */
const CHANGELOG = [
  { v: '1.4.56', date: '2026-07-22', desc: 'Gantt: el badge de estado se derramaba 37px sobre el timeline con "Configurado en QA"; la columna fija ahora deriva su ancho de las partes (corrige además un desajuste en escala Semana), abrevia ese estado a "En QA" y recorta cualquier excedente.' },
  { v: '1.4.55', date: '2026-07-22', desc: 'Seguimiento Operativo: se agrega el KPI "En QA" (faltaba pese a ser el 2º estado más frecuente), los headers de tabla se alinean a la izquierda con sus celdas, y el ancho sobrante de las columnas pasa a Tarea en vez de repartirse en huecos.' },
  { v: '1.4.54', date: '2026-07-22', desc: 'Seguimiento Operativo: se saca el conteo redundante de la toolbar, Estado pasa de select siempre editable a badge de lectura, y Hito se pliega dentro de Tarea (10→9 columnas).' },
  { v: '1.4.53', date: '2026-07-22', desc: 'Seguimiento Operativo: el select de Seller quedaba 7px más arriba que el resto de los filtros por el hint vacío debajo — corregido.' },
  { v: '1.4.52', date: '2026-07-22', desc: 'Portal de Sellers: layout m\u00e1s compacto y menor desplazamiento vertical.' },
  { v: '1.4.51', date: '2026-07-22', desc: 'Seguimiento Operativo: título/KPIs pasan a scrollear con la lista; filtros y barra de vista quedan fijos arriba.' },
  { v: '1.4.50', date: '2026-07-22', desc: 'Portal de Sellers: accesos compactos, recursos agrupados y pr\u00f3ximo paso din\u00e1mico.' },
  { v: '1.4.49', date: '2026-07-21', desc: 'Módulo provisorio "Catálogo (Taika Sport)": ver/editar precio y stock, exportar/importar CSV.' },
  { v: '1.4.47', date: '2026-07-21', desc: 'Selector CSS de inputs de Configuración pasa de inclusión a exclusión por tipo.' },
  { v: '1.4.46', date: '2026-07-21', desc: 'Fix visual del modal "Nuevo usuario": segmentado parejo y campo Nombre estilado.' },
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

  const VERSION_BADGE_HISTORY_LIMIT = 10;
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
        "/public/integracion/integracion-seller.html",

      CATALOGO_SELLER:
        "/public/catalogo/catalogo-seller.html"
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
    },
    {
      key: "catalogo_seller",
      label: "Catálogo (Taika Sport)",
      access: "Seller",
      route: "/public/catalogo/catalogo-seller.html"
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
  { key: "ext_integracion",  label: "Guía de integración",             tier: "externo" },
  { key: "ext_catalogo",     label: "Catálogo (Taika Sport)",          tier: "externo" }
];
