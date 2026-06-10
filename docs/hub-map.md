# Mapa Inicial del Hub

> **Actualizacion 2026-06-09 — Consolidacion Hub Central:** `index.html` ahora ES el hub (portada institucional y hub operativo unificados). `internal/hub-operativo.html` quedo como alias hacia `../index.html`. Ademas: fuentes de Apps Script movidas a `integrations/apps-script/`, `Mapa del Hub.docx` a `docs/source/`, xlsx a `data/`, y eliminados `config.js` de raiz y `Logos/` (duplicados sin referencias). En una segunda etapa del mismo dia se ELIMINARON todos los aliases versionados de raiz (`*_vNN.html`, incluido `sporting-marketplace_hub_v29.html`): la raiz quedo con `index.html` como unico HTML. Las filas de la tabla siguiente reflejan el estado historico previo.

Este inventario documenta los archivos actuales y una ruta futura sugerida. No implica que esas rutas existan actualmente ni que deban migrarse sin validacion previa.

| Archivo actual | Ruta futura sugerida | Tipo | Criticidad | Observaciones |
|---|---|---|---|---|
| `index.html` | `/index.html` | documentacion | Alta | Entrada institucional oficial creada en Etapa 2. Enlaza a paginas actuales en raiz sin migrarlas. |
| `internal/hub-operativo.html` | `/internal/hub-operativo.html` | interno | Alta | Hub operativo interno oficial. Etapa 10B agrego regreso a `index.html`, buscador con descripcion y estado sin resultados, aviso sobre `seller_id`, mapa clickeable y ajuste mobile minimo. Smoke test 10C OK. |
| `sporting-marketplace_hub_v29.html` | `/internal/hub-operativo.html` | legacy | Alta | Etapa 9C/9D: alias implementado y smoke test OK hacia `internal/hub-operativo.html`. Preserva query/hash con JavaScript y usa meta refresh como fallback. No se movio ni elimino el archivo legacy. |
| `backlog-sellers_v27.html` | `/internal/backlog/backlog-sellers.html` | interno | Alta | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`; CSV, logos, cards, tabla, filtros y modal permanecen en la pagina nueva. |
| `gestion-sellers_v7.html` | `/internal/backlog/gestion-sellers.html` | interno | Alta | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`; Apps Script, CSV sellers, localStorage y submit permanecen en la pagina nueva. |
| `gantt-operativo_v18.html` | `/internal/gantt/gantt-operativo.html` | interno | Alta | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`; la pagina nueva queda estabilizada con Timeline v33, frontend/backend compatibles, auditor read-only, UX operativa con filtros, badges, hitos por fase, selector `depende_de`, vista Semana centrada, boton `Hoy` y columnas sticky. |
| `gantt-seller-center_v2.html` | `/internal/gantt/gantt-seller-center.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`; la dependencia CSV permanece en la pagina nueva. |
| `seller-center_v2.html` | `/internal/seller-center/index.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `maqueta-seller-center_v2.html` | `/internal/seller-center/maqueta-seller-center.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `proyecto-marketplace_v3.html` | `/internal/estrategia/proyecto-marketplace.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `proceso-onboarding_v4.html` | `/internal/estrategia/proceso-onboarding.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `modelo-integracion_v5.html` | `/internal/estrategia/modelo-integracion.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `modelo-economico_v2.html` | `/internal/estrategia/modelo-economico.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `governance_v3.html` | `/internal/estrategia/governance.html` | interno | Media | Alias piloto implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `formulario-calificacion_v2.html` | `/public/formularios/formulario-calificacion.html` | publico | Alta | Alias implementado en raiz hacia la ruta nueva. Preserva query/hash, incluido `seller_id`. No se movio a `legacy/`; endpoint, CSV sellers, validaciones, payload y submit permanecen en la pagina nueva. |
| `formulario-relevamiento_v2.html` | `/public/formularios/formulario-relevamiento.html` | publico | Alta | Alias implementado en raiz hacia la ruta nueva. Preserva query/hash, incluido `seller_id`. No se movio a `legacy/`; endpoint, CSV sellers, condicionales, validaciones, payload y submit permanecen en la pagina nueva. Riesgo pendiente: validar `pctSec` en `updateProgress`. |
| `presentacion-seller_v3.html` | `/public/presentaciones/presentacion-seller.html` | publico | Media | Alias implementado en raiz hacia la ruta nueva. Preserva query/hash, incluido `seller_id`. No se movio a `legacy/`; logo, CTA y personalizacion permanecen en la pagina nueva. |
| `simulador-seller_v12.html` | `/public/simuladores/simulador-seller.html` | publico | Alta | Alias implementado en raiz hacia la ruta nueva. Preserva query/hash, incluido `seller_id`. No se movio a `legacy/`; CTA, tarifas, overrides, escenarios y calculos permanecen en la pagina nueva. |
| `simulador-economico_v4.html` | `/internal/simuladores/simulador-economico.html` | interno | Alta | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`; Sheets/config, formulas, tarifas, overrides y escenarios permanecen en la pagina nueva. |
| `config.js` | `/assets/js/config.js` | integracion | Alta | Copiado a ubicacion futura como configuracion central. Original en raiz se mantiene como referencia temporal. |
| `Apps_script_v5.js` | `/integrations/apps-script/Apps_script_v5.js` | integracion | Alta | Backend Apps Script. No modificar en etapa documental ni estructural inicial. |
| `Logos/` | `/assets/logos/` | data | Media | Logos `spt-001.png` a `spt-015.png` copiados a `assets/logos/` en Etapa 5B. Carpeta original se mantiene intacta como legacy temporal; referencias aun no fueron modificadas. |
| `MarketPlace Sporting - Sellers (BD).xlsx` | `/data/MarketPlace Sporting - Sellers (BD).xlsx` | data | Media | Archivo de datos operativo. Evaluar si debe publicarse en GitHub Pages. |
| `Mapa del Hub.docx` | `/docs/source/Mapa del Hub.docx` | documentacion | Baja | Documento fuente. Puede mantenerse como referencia historica. |
| `PROJECT_WORKFLOW.md` | `/PROJECT_WORKFLOW.md` | documentacion | Alta | Metodologia institucional base. Debe permanecer visible en raiz. |
| archivos versionados antiguos futuros | `/legacy/` | legacy | Media | Etapa 7 cerro sin mover archivos a `legacy/`. Usar solo en una etapa futura posterior a smoke test, release V1 y decision explicita. |

## Estado de cierre Etapa 7

- Todos los HTML versionados con ruta nueva migrada funcionan como aliases en raiz.
- Los aliases preservan query string y hash; esto protege `seller_id` en paginas publicas.
- `sporting-marketplace_hub_v29.html` quedo intacto hasta Etapa 9C; desde entonces funciona como alias hacia `internal/hub-operativo.html`.
- No se movieron archivos a `legacy/`.
- No se eliminaron archivos.
- No se modificaron paginas nuevas ni logica funcional.

## Decision Etapa 12B

- La raiz se mantiene como compatibility layer de aliases.
- No se mueven aliases a `legacy/`.
- `legacy/root-html-v1/` queda reservado para snapshots historicos futuros.
- Cualquier movimiento o eliminacion requiere etapa explicita y smoke test de URLs historicas.

## Decision Etapa 18B

- Auditoria estructural 18A cerrada sin cambios de archivos.
- No se detectaron links locales rotos en `href`, `src` o stylesheets dentro del alcance activo.
- No se realizara limpieza fisica por ahora.
- Los aliases de raiz, incluido `sporting-marketplace_hub_v29.html`, se mantienen activos.
- `Logos/` y `assets/logos/` se mantienen por compatibilidad y posible carga dinamica.
- `config.js`, `assets/js/config.js` y `Apps_script_v5.js` permanecen sin tocar.
- `legacy/root-html-v1/` queda reservado para snapshots historicos futuros.
- Queda para decision manual futura revisar `MarketPlace Sporting - Sellers (BD).xlsx`, `Mapa del Hub.docx` y posible consolidacion de `Logos/`.
