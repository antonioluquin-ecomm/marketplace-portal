/* ============================================================================
   theme.js — Tema claro/oscuro compartido para todas las páginas del portal.
   ----------------------------------------------------------------------------
   - Aplica el tema ANTES del paint (lee localStorage; default "dark") para
     evitar el flash al cargar.
   - Auto-inyecta el botón de toggle en la topbar de la página (cualquiera sea
     su estructura), así no hay que editar 18 topbars a mano.
   - Persiste la preferencia por navegador en localStorage["mp-theme"].
   - Expone window.MP_THEME = { get, set, toggle }.

   Cargar en <head> (no defer) para que el set pre-paint funcione.
   ========================================================================== */
(function () {
  "use strict";

  var LS_KEY = "mp-theme";
  var VALID = { light: 1, dark: 1 };

  function readStored() {
    try {
      var v = localStorage.getItem(LS_KEY);
      return VALID[v] ? v : null;
    } catch (e) {
      return null;
    }
  }

  function store(theme) {
    try { localStorage.setItem(LS_KEY, theme); } catch (e) { /* navegación privada */ }
  }

  function current() {
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  }

  // Aplica el tema de inmediato (default: dark). Se ejecuta apenas se parsea el
  // script en <head>, antes de pintar el body.
  function apply(theme) {
    var t = VALID[theme] ? theme : "dark";
    document.documentElement.setAttribute("data-theme", t);
    return t;
  }

  // Set pre-paint
  apply(readStored() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  // ---- Botón de toggle ----
  var ICON = { dark: "☀", light: "🌙" }; // muestra el ícono del tema AL QUE se cambiaría
  var LABEL = { dark: "Claro", light: "Oscuro" };

  function refreshButton(btn, theme) {
    if (!btn) return;
    var ico = btn.querySelector(".mp-theme-ico");
    var txt = btn.querySelector(".mp-theme-txt");
    if (ico) ico.textContent = ICON[theme];
    if (txt) txt.textContent = LABEL[theme];
    btn.setAttribute(
      "aria-label",
      theme === "dark" ? "Cambiar a vista clara" : "Cambiar a vista oscura"
    );
    btn.setAttribute("title", btn.getAttribute("aria-label"));
  }

  function buildButton() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mp-theme-toggle";
    btn.innerHTML =
      '<span class="mp-theme-ico" aria-hidden="true"></span>' +
      '<span class="mp-theme-txt"></span>';
    btn.addEventListener("click", function () {
      MP_THEME.toggle();
    });
    return btn;
  }

  // Busca el mejor contenedor de la topbar para insertar el botón.
  function findTarget() {
    var sels = [
      ".tb-right",
      ".topbar-right",
      ".top-actions",
      ".topnav",
      ".top-cta",          // públicas: insertamos antes/junto al CTA
      ".topbar",
      "header.topbar",
      "header"
    ];
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el) return el;
    }
    return null;
  }

  function injectButton() {
    if (document.querySelector(".mp-theme-toggle")) return; // idempotente
    var target = findTarget();
    var btn = buildButton();
    if (target) {
      target.appendChild(btn);
    } else {
      // Sin topbar reconocible: botón flotante discreto arriba a la derecha.
      btn.style.position = "fixed";
      btn.style.top = "12px";
      btn.style.right = "12px";
      btn.style.zIndex = "9999";
      document.body.appendChild(btn);
    }
    refreshButton(btn, current());
  }

  // ---- API pública ----
  window.MP_THEME = {
    get: current,
    set: function (theme) {
      var t = apply(theme);
      store(t);
      refreshButton(document.querySelector(".mp-theme-toggle"), t);
      return t;
    },
    toggle: function () {
      return this.set(current() === "dark" ? "light" : "dark");
    }
  };

  function onReady() {
    // Habilita la transición suave recién después de la carga inicial.
    document.documentElement.classList.add("mp-theme-ready");
    injectButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }
})();
