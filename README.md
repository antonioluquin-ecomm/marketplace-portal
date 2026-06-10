# Marketplace Portal

Marketplace Portal es el repositorio operativo del ecosistema Marketplace Sporting: hub central, herramientas internas de gestión, formularios públicos, simuladores, modelos de estrategia y el backend de Google Apps Script.

Es un sitio estático compatible con GitHub Pages, sin build step: cada página HTML es autocontenida.

**URL pública:** https://antonioluquin-ecomm.github.io/marketplace-portal/

## Centro único de navegación

`index.html` es el **Hub Central**: la única entrada del portal. Unifica lo que antes eran dos páginas separadas (portada institucional + hub operativo interno). Incluye buscador de recursos, flujo de incorporación de sellers, accesos a gestión diaria, Seller Center, estrategia y recursos públicos.

`internal/hub-operativo.html` se mantiene como alias que redirige al Hub Central preservando query y hash. Los demás HTML versionados de raíz fueron eliminados el 2026-06-09.

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
└─ legacy/                     Reservado para snapshots históricos
```

## Datos y backend

- **Base de datos:** Google Sheets, publicado como CSV por pestaña. Pestañas clave: `tarifas`, `overrides`, `sellers`, `timeline`.
- **Lectura:** las páginas cargan los CSV publicados en runtime.
- **Escritura:** POST a Google Apps Script (`doPost` con router por `tipo_formulario`).
- **Importante:** tras modificar `integrations/apps-script/*`, pegar el código en el editor de Google Apps Script y **redeployar**. El repo es la fuente de verdad del código, pero el script corre en Google.

## Compatibilidad de URLs

Los HTML versionados de la raíz fueron eliminados el 2026-06-09 (eran redirects puros). Las URLs canónicas son las de `internal/` y `public/`; los links a sellers siempre se generan con esas rutas más `?seller_id=SPT-XXX`.

## Metodología

El proyecto se gestiona según `PROJECT_WORKFLOW.md`: etapas pequeñas y verificables, separación entre auditoría/implementación/validación, documentación viva (`CHANGELOG.md`, `docs/`) y protección de URLs existentes.

Para retomar trabajo sobre el Gantt/timeline, leer `docs/handoff-post-v1.md` y `docs/data-dictionary-timeline.md`. Para contexto general de agentes, leer `CLAUDE.md`.
