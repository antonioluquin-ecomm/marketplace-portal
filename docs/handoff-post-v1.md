# Handoff corto post-V1 - Marketplace Portal

Fecha: 2026-05-18

## Estado actual

- V1 y post-V1 estan cerrados.
- `index.html` es la portada institucional.
- `internal/hub-operativo.html` es el Hub Operativo oficial.
- `sporting-marketplace_hub_v29.html` funciona como alias hacia `internal/hub-operativo.html`.
- Los HTML versionados en raiz funcionan como aliases activos de compatibilidad.
- `legacy/root-html-v1/` queda reservado para snapshots historicos futuros.
- La auditoria estructural 18A cerro sin links locales rotos detectados y sin limpieza fisica.

## Cambios recientes

- `assets/css/internal-components.css` fue creado y aplicado a paginas internas autorizadas.
- La limpieza CSS se aplico solo en paginas informativas de estrategia.
- Las paginas internas operativas quedaron excluidas de limpieza CSS por relacion riesgo/beneficio.
- `assets/js/internal-navigation.js` fue creado y aplicado solo a paginas informativas seleccionadas.
- No se extrajo JS operativo.
- Las paginas publicas seller-facing siguen independientes del CSS interno compartido.
- Bloque 20A-20G cerrado: revision de contenido de portada institucional, paginas estrategicas, Seller Center, paginas publicas seller-facing, maqueta Seller Center y normalizacion final de textos visibles.

## Decisiones vigentes

- No mover aliases activos de raiz a `legacy/`.
- No limpiar `assets/logos/` ni `Logos/` todavia.
- No tocar `config.js` ni `assets/js/config.js`.
- No tocar `Apps_script_v5.js`.
- No tocar formularios, submit, endpoints, payloads, simuladores, Apps Script ni datos reales sin etapa critica.
- Para contenido post-20G, no tocar rutas, JS, CSS, formularios, submit, endpoints ni logica salvo etapa explicita.
- Revisar manualmente en el futuro `MarketPlace Sporting - Sellers (BD).xlsx`, `Mapa del Hub.docx` y posible consolidacion de `Logos/`.

## Metodologia vigente

- Modo rapido por defecto: implementacion controlada, validacion minima y commit manual.
- Auditoria previa solo para cambios criticos, operativos, legacy o arquitectura.
- Documentar solo cierres grandes, decisiones relevantes, errores, releases o cambios criticos.
- Comandos preferidos compatibles con PowerShell.
- Validacion minima: `git status --short` y `git diff --name-only`.
- El usuario ejecuta commits manualmente.

## Proximos pasos posibles

- Push y smoke test liviano en GitHub Pages.
- Luego avanzar solo con mejoras funcionales o contenido pendiente concreto.
- Revisar manualmente `.xlsx` y `Mapa del Hub.docx` solo si se decide ordenar documentacion fuente.
- Evitar nuevas refactorizaciones CSS/JS salvo necesidad real.

## Contexto minimo para nueva sesion

Leer solo:

- `README.md`
- `docs/handoff-post-v1.md`
- `docs/roadmap.md`
- `CHANGELOG.md`
- `PROJECT_WORKFLOW.md`
