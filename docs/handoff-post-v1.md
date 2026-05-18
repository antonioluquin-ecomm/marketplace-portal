# Handoff Post-V1 - Marketplace Portal

Fecha: 2026-05-18

## Estado actual

- `index.html` es la portada institucional.
- `internal/hub-operativo.html` es el Hub Operativo oficial.
- Los HTML versionados en raiz funcionan como aliases de compatibilidad.
- `sporting-marketplace_hub_v29.html` redirige a `internal/hub-operativo.html`.
- `legacy/root-html-v1/` existe, pero queda reservado para snapshots historicos futuros.
- Las paginas publicas seller-facing se mantienen independientes de `assets/css/tokens.css`.

## Rutas principales

- Portal institucional: `/index.html`
- Hub operativo: `/internal/hub-operativo.html`
- Backlog: `/internal/backlog/backlog-sellers.html`
- Gestion Sellers: `/internal/backlog/gestion-sellers.html`
- Gantt Operativo: `/internal/gantt/gantt-operativo.html`
- Seller Center: `/internal/seller-center/index.html`
- Estrategia: `/internal/estrategia/`
- Formularios publicos: `/public/formularios/`
- Presentacion seller: `/public/presentaciones/presentacion-seller.html`
- Simulador seller: `/public/simuladores/simulador-seller.html`

## Decisiones tomadas

- Mantener aliases en raiz como compatibility layer.
- No mover aliases a `legacy/`.
- Reservar `legacy/root-html-v1/` para snapshots historicos, no para aliases actuales.
- No aplicar `tokens.css` a paginas publicas seller-facing.
- Cualquier `public-tokens.css` futuro requiere auditoria propia.
- No extraer CSS/JS sin auditoria y smoke test por grupo.

## Que no tocar

- Formularios publicos, submit, payloads, endpoints y Apps Script.
- Gestion de Sellers y su escritura real.
- Simuladores y formulas/calculos/tarifas/overrides.
- `config.js` y `assets/js/config.js`.
- Aliases de raiz, salvo etapa explicita.
- `legacy/`, salvo decision explicita.

## Riesgos residuales

- Formularios y Gestion escriben datos reales via Apps Script.
- `formulario-relevamiento.html` mantiene riesgo pendiente `pctSec`.
- Paginas operativas dependen de CSV/Google Sheets.
- Raiz contiene aliases necesarios para URLs historicas.
- CSS/JS inline sigue como deuda controlada.

## Proximos pasos posibles

1. Revisar diff completo y preparar commit post-V1.
2. Hacer smoke test final en GitHub Pages.
3. Auditar extraccion CSS/JS por grupo, empezando por paginas internas informativas.
4. Auditar `public-tokens.css` solo si se busca consistencia publica.
5. Crear snapshots historicos en `legacy/root-html-v1/` solo si hay decision explicita.

## Recomendaciones para IA y tokens

- Empezar cada sesion leyendo solo: `README.md`, `docs/roadmap.md`, `docs/handoff-post-v1.md`, `CHANGELOG.md`.
- Pedir una sola etapa por turno.
- Indicar siempre modo: auditoria, documental, implementacion o validacion.
- Repetir invariantes criticos: no submit, no Apps Script, no endpoints, no mover aliases.
- Evitar releer todas las paginas publicas salvo que la etapa las afecte.
- Usar `git status --short` y `git diff --name-only` como validacion minima.
