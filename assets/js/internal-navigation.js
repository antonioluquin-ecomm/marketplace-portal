/*
 * internal-navigation.js - navegacion interna compartida
 *
 * Alcance inicial:
 * - Navegacion activa por scroll para paginas internas.
 * - JS vanilla, sin modulos ni dependencias.
 */
(function () {
  function initActiveSectionNav(options) {
    var opts = options || {};
    var linkSelector = opts.linkSelector || '.nav[href^="#"]';
    var activeClass = opts.activeClass || 'active';
    var offset = typeof opts.offset === 'number' ? opts.offset : 120;
    var links = Array.prototype.slice.call(document.querySelectorAll(linkSelector));

    if (!links.length) return;

    var sections = links
      .map(function (link) {
        var href = link.getAttribute('href');
        return href ? document.querySelector(href) : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    function updateActiveNav() {
      var current = sections[0] ? sections[0].id : '';

      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        if (rect.top <= offset) current = section.id;
      });

      links.forEach(function (link) {
        link.classList.toggle(activeClass, link.getAttribute('href') === '#' + current);
      });
    }

    document.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  window.InternalNavigation = window.InternalNavigation || {};
  window.InternalNavigation.initActiveSectionNav = initActiveSectionNav;
})();
