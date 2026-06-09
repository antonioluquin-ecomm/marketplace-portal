# Marketplace Portal — Guía para agentes

Sitio estático (GitHub Pages) que opera el ecosistema Marketplace Sporting.
No hay build step ni framework: cada página HTML es autocontenida (CSS/JS inline).
Idioma del proyecto: español.

**URL pública:** https://antonioluquin-ecomm.github.io/marketplace-portal/

## Arquitectura en una línea

Google Sheets (base de datos) → CSV publicado → páginas HTML (lectura) · Google Apps Script `doPost` (escritura).

## Mapa del repositorio

```
/
├─ index.html                  ← HUB CENTRAL: único centro de navegación (portal + hub operativo unificados)
├─ internal/                   Páginas de uso interno del equipo
│  ├─ backlog/                 gestion-sellers (alta/edición), backlog-sellers (pipeline)
│  ├─ gantt/                   gantt-operativo (timeline v33), gantt-seller-center
│  ├─ seller-center/           dashboard, maqueta PIM
│  ├─ simuladores/             simulador-economico, config-tarifas (editor de tarifas + overrides)
│  ├─ estrategia/              páginas informativas (proyecto, modelos, governance, onboarding)
│  └─ hub-operativo.html       ALIAS → redirige a /index.html (no editar)
├─ public/                     Páginas compartibles con sellers (llevan ?seller_id=SPT-XXX en la URL)
│  ├─ formularios/             formulario-calificacion, formulario-relevamiento
│  ├─ presentaciones/          presentacion-seller
│  └─ simuladores/             simulador-seller
├─ assets/
│  ├─ css/                     tokens.css, internal-components.css, pages/
│  ├─ js/config.js             MP_CONFIG: URLs de Sheets/Apps Script, rutas, config central
│  └─ logos/                   spt-XXX.png (minúsculas) — ÚNICA carpeta de logos
├─ integrations/apps-script/   Código fuente del backend (Apps_script_v5.js, Config.gs, Gantt.gs, …)
├─ data/                       Archivos de datos fuente (xlsx)
├─ docs/                       Documentación viva (architecture, roadmap, data-dictionary, handoff)
│  └─ source/                  Documentos fuente (docx)
├─ tools/                      Scripts de auditoría (node)
├─ legacy/                     Reservado para snapshots históricos
└─ *_v[0-9]*.html              ALIASES de compatibilidad en raíz (redirigen a rutas nuevas — NO borrar)
```

## Reglas críticas

1. **Aliases de raíz** (`backlog-sellers_v27.html`, `sporting-marketplace_hub_v29.html`, etc.): son redirects de ~1 KB que protegen URLs ya compartidas con el equipo y con sellers. No moverlos, no borrarlos, no editarlos salvo para retargetear.
2. **Apps Script**: el código en `integrations/apps-script/` es la fuente de verdad del repo, pero corre en Google Apps Script. Tras modificarlo hay que **pegarlo en el editor de Apps Script y redeployar** (Deploy → Manage deployments → nueva versión). Sin redeploy, los POST del frontend fallan en silencio (se envían con `no-cors`).
3. **URLs públicas con `seller_id`**: las páginas de `public/` se comparten con sellers como links con `?seller_id=SPT-XXX`. Cualquier alias/redirect debe preservar query string y hash.
4. **Google Sheet** (id `1S_pl358H8nbJC3xgd7UpRpOxTYkC_hopYcBX6WzMlzU`): pestañas clave publicadas como CSV — `tarifas` (gid 42870561), `overrides` (gid 649807159), `sellers` (gid 899415596). No renombrar columnas ni pestañas sin revisar los parsers.
5. **Pestaña `overrides`** (condiciones especiales por seller, formato ancho: una fila por seller): tiene un banner y una fila de instrucciones ANTES de los headers reales. Todo parser debe buscar la fila que contenga `seller_id`, nunca asumir que la fila 0 es el header. Semántica: `comisión override %` reemplaza la comisión base; las columnas `Bon. * %` son % de descuento sobre la tarifa base (50 = mitad, 100 = gratis); celda vacía = hereda la base.
6. **Logos**: solo `assets/logos/` (la vieja `Logos/` de raíz fue eliminada). Los fallbacks dinámicos construyen `assets/logos/{seller_id en minúsculas}.png`.
7. **No introducir build steps, frameworks ni dependencias**: todo debe seguir funcionando como archivos estáticos en GitHub Pages.

## Dónde mirar según la tarea

| Tarea | Empezar por |
|---|---|
| Tarifas / overrides / simuladores | `internal/simuladores/config-tarifas.html` (editor) y los parsers en ambos simuladores |
| Gantt / timeline | `docs/handoff-post-v1.md`, `docs/data-dictionary-timeline.md` |
| Backend (formularios, guardado) | `integrations/apps-script/Apps_script_v5.js` (router `doPost` por `tipo_formulario`) |
| Historia del proyecto | `CHANGELOG.md`, `docs/roadmap.md` |
| Metodología de trabajo | `PROJECT_WORKFLOW.md` |
