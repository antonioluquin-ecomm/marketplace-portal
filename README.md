# Marketplace Portal

Marketplace Portal es el repositorio operativo del ecosistema Marketplace Sporting: hub central, herramientas internas de gestión, formularios públicos, simuladores, modelos de estrategia y el backend de Google Apps Script.

Es un sitio estático compatible con GitHub Pages, sin build step: cada página HTML es autocontenida.

**URL pública:** https://antonioluquin-ecomm.github.io/marketplace-portal/

## Centro único de navegación

`index.html` es el **Hub Central**: la única entrada del portal. Unifica lo que antes eran dos páginas separadas (portada institucional + hub operativo interno). Incluye buscador de recursos, flujo de incorporación de sellers, accesos a gestión diaria, Seller Center, estrategia y recursos públicos.

`internal/hub-operativo.html` y `sporting-marketplace_hub_v29.html` se mantienen como aliases que redirigen al Hub Central preservando query y hash.

## Estructura

```txt
/
├─ index.html                  Hub Central (único centro de navegación)
├─ CLAUDE.md                   Guía para agentes: mapa del repo y reglas críticas
├─ internal/                   Páginas de uso interno
│  ├─ backlog/                 Gestión de Sellers · Backlog de Sellers
│  ├─ gantt/                   Gantt Operativo · Gantt Seller Center
│  ├─ seller-center/           Dashboard · Maqueta
│  ├─ simuladores/             Simulador Económico · Config Tarifas y Overrides
│  └─ estrategia/              Proyecto · Modelos · Governance · Onboarding
├─ public/                     Páginas compartibles con sellers (?seller_id=SPT-XXX)
│  ├─ formularios/             Calificación · Relevamiento
│  ├─ presentaciones/          Presentación Seller
│  └─ simuladores/             Simulador Seller
├─ assets/                     css/ · js/config.js (config central) · logos/
├─ integrations/apps-script/   Fuente del backend (Apps_script_v5.js, Config.gs, …)
├─ data/                       Datos fuente (xlsx)
├─ docs/                       Documentación viva · docs/source/ (documentos fuente)
├─ tools/                      Scripts de auditoría
├─ legacy/                     Reservado para snapshots históricos
└─ *_v[0-9]*.html              Aliases de compatibilidad (redirects, no borrar)
```

## Datos y backend

- **Base de datos:** Google Sheets, publicado como CSV por pestaña. Pestañas clave: `tarifas`, `overrides`, `sellers`, `timeline`.
- **Lectura:** las páginas cargan los CSV publicados en runtime.
- **Escritura:** POST a Google Apps Script (`doPost` con router por `tipo_formulario`).
- **Importante:** tras modificar `integrations/apps-script/*`, pegar el código en el editor de Google Apps Script y **redeployar**. El repo es la fuente de verdad del código, pero el script corre en Google.

## Compatibilidad de URLs

Los HTML versionados de la raíz (`backlog-sellers_v27.html`, `simulador-seller_v12.html`, etc.) son aliases de ~1 KB que redirigen a las rutas nuevas preservando query string y hash. Protegen URLs ya compartidas con el equipo y con sellers — no se mueven ni se eliminan.

## Metodología

El proyecto se gestiona según `PROJECT_WORKFLOW.md`: etapas pequeñas y verificables, separación entre auditoría/implementación/validación, documentación viva (`CHANGELOG.md`, `docs/`) y protección de URLs existentes.

Para retomar trabajo sobre el Gantt/timeline, leer `docs/handoff-post-v1.md` y `docs/data-dictionary-timeline.md`. Para contexto general de agentes, leer `CLAUDE.md`.
