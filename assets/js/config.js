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

window.MP_CONFIG = {
  PROJECT_NAME: "Sporting Marketplace",

  BASE_URL: "https://antonioluquin-ecomm.github.io/sporting-marketplace",

  // Apps Script central Marketplace
  APPS_SCRIPT_URL:
    "https://script.google.com/macros/s/AKfycbxryK0ucSoM_SMrAuwolP-KfxXwpMNUiAapVxC4UVV1G2wFtRohSExivRwQjh60ZHjd/exec",

  // Google Sheets publicados como CSV
  CSV: {
    CONFIG:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwd-qIMhoH1poJpaTZqN-7O5IGAfPDTxslBAX8LCPogTkwheW2vWsq59JkvvYakM8ndCKgUQualQyi/pub?gid=1925619599&single=true&output=csv",

    SELLERS:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwd-qIMhoH1poJpaTZqN-7O5IGAfPDTxslBAX8LCPogTkwheW2vWsq59JkvvYakM8ndCKgUQualQyi/pub?gid=899415596&single=true&output=csv"
  },

  ASSETS: {
    LOGO_BASE_URL:
      "https://antonioluquin-ecomm.github.io/sporting-marketplace/assets/logos/",
    IMAGES_BASE_URL:
      "https://antonioluquin-ecomm.github.io/sporting-marketplace/assets/imagenes/",
    CSS_BASE_URL:
      "https://antonioluquin-ecomm.github.io/sporting-marketplace/assets/css/",
    JS_BASE_URL:
      "https://antonioluquin-ecomm.github.io/sporting-marketplace/assets/js/"
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
        "/public/simuladores/simulador-seller.html"
    }
  },

  // GitHub repo para upload de logos vía API (el token se guarda en localStorage por el usuario)
  GITHUB_REPO: "antonioluquin-ecomm/sporting-marketplace",
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
   * Devuelve la URL pública con seller_id.
   * Ejemplo:
   * MP_CONFIG.withSellerId(MP_CONFIG.ROUTES.PUBLIC.FORMULARIO_CALIFICACION, "puma")
   */
  withSellerId(path, sellerId) {
    const url = new URL(this.toAbsoluteUrl(path));
    if (sellerId) url.searchParams.set("seller_id", sellerId);
    return url.toString();
  }
};
