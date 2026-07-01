/* ============================================================================
   theme.js — Tema claro compartido para todas las páginas del portal.
   ----------------------------------------------------------------------------
   2026-07-01 — el modo oscuro queda fuera de alcance de la alineación al
   design system estándar (ver docs/decisions/2026-07-01-alineacion-design-system.md).
   El toggle claro/oscuro se deshabilita: el portal fuerza siempre data-theme="light".
   Se conserva la API window.MP_THEME (get/set/toggle) como no-op para no romper
   código existente que pudiera invocarla; ambos devuelven siempre "light".

   Cargar en <head> (no defer) para que el set pre-paint funcione.
   ========================================================================== */
(function () {
  "use strict";

  // Set pre-paint. Único tema soportado por ahora.
  document.documentElement.setAttribute("data-theme", "light");

  // ---- API pública (compatibilidad) ----
  window.MP_THEME = {
    get: function () { return "light"; },
    set: function () { return "light"; },
    toggle: function () { return "light"; }
  };

  function onReady() {
    document.documentElement.classList.add("mp-theme-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();
