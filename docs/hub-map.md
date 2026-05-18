# Mapa Inicial del Hub

Este inventario documenta los archivos actuales y una ruta futura sugerida. No implica que esas rutas existan actualmente ni que deban migrarse sin validacion previa.

| Archivo actual | Ruta futura sugerida | Tipo | Criticidad | Observaciones |
|---|---|---|---|---|
| `index.html` | `/index.html` | documentacion | Alta | Entrada institucional oficial creada en Etapa 2. Enlaza a paginas actuales en raiz sin migrarlas. |
| `sporting-marketplace_hub_v29.html` | `/legacy/root-html-v1/sporting-marketplace_hub_v29.html` | legacy | Alta | Hub central actual versionado. Se mantiene intacto como referencia temporal; no mover hasta definir compatibilidad. |
| `backlog-sellers_v27.html` | `/internal/backlog/backlog-sellers.html` | interno | Alta | Copiado a estructura futura. Mantiene CSV, logos, cards, tabla, filtros y modal. Original en raiz se mantiene como legacy temporal. |
| `gestion-sellers_v7.html` | `/internal/backlog/gestion-sellers.html` | interno | Alta | Copiado a estructura futura. Usa `assets/js/config.js`, Apps Script, CSV sellers, localStorage y submit no-cors. Original en raiz se mantiene como legacy temporal. |
| `gantt-operativo_v18.html` | `/internal/gantt/gantt-operativo.html` | interno | Alta | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`; la logica y CSV permanecen en la pagina nueva. |
| `gantt-seller-center_v2.html` | `/internal/gantt/gantt-seller-center.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`; la dependencia CSV permanece en la pagina nueva. |
| `seller-center_v2.html` | `/internal/seller-center/index.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `maqueta-seller-center_v2.html` | `/internal/seller-center/maqueta-seller-center.html` | interno | Media | Copiado a estructura futura. Navegacion minima ajustada en copia. Original en raiz se mantiene como legacy temporal. |
| `proyecto-marketplace_v3.html` | `/internal/estrategia/proyecto-marketplace.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `proceso-onboarding_v4.html` | `/internal/estrategia/proceso-onboarding.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `modelo-integracion_v5.html` | `/internal/estrategia/modelo-integracion.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `modelo-economico_v2.html` | `/internal/estrategia/modelo-economico.html` | interno | Media | Alias implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `governance_v3.html` | `/internal/estrategia/governance.html` | interno | Media | Alias piloto implementado en raiz hacia la ruta nueva. Usa meta refresh y JavaScript preservando query/hash. No se movio a `legacy/`. |
| `formulario-calificacion_v2.html` | `/public/formularios/formulario-calificacion.html` | publico | Alta | Copiado a estructura futura sin submit real. Mantiene endpoint, CSV sellers, seller_id, logo, validaciones y payload. Original en raiz se mantiene como legacy temporal. |
| `formulario-relevamiento_v2.html` | `/public/formularios/formulario-relevamiento.html` | publico | Alta | Copiado a estructura futura sin submit real. Mantiene endpoint, CSV sellers, seller_id, logo, condicionales, validaciones y payload. Riesgo pendiente: validar `pctSec` en `updateProgress`. Original en raiz se mantiene como legacy temporal. |
| `presentacion-seller_v3.html` | `/public/presentaciones/presentacion-seller.html` | publico | Media | Copiado a estructura futura. Mantiene seller_id, logo, CTA y personalizacion. Original en raiz se mantiene como legacy temporal. |
| `simulador-seller_v12.html` | `/public/simuladores/simulador-seller.html` | publico | Alta | Copiado a estructura futura. Mantiene seller_id, logos, CTA, tarifas, overrides, escenarios y calculos. Original en raiz se mantiene como legacy temporal. |
| `simulador-economico_v4.html` | `/internal/simuladores/simulador-economico.html` | interno | Alta | Copiado a estructura futura. Mantiene Sheets/config, formulas, tarifas, overrides y escenarios. Original en raiz se mantiene como legacy temporal. |
| `config.js` | `/assets/js/config.js` | integracion | Alta | Copiado a ubicacion futura como configuracion central. Original en raiz se mantiene como referencia temporal. |
| `Apps_script_v5.js` | `/integrations/apps-script/Apps_script_v5.js` | integracion | Alta | Backend Apps Script. No modificar en etapa documental ni estructural inicial. |
| `Logos/` | `/assets/logos/` | data | Media | Logos `spt-001.png` a `spt-015.png` copiados a `assets/logos/` en Etapa 5B. Carpeta original se mantiene intacta como legacy temporal; referencias aun no fueron modificadas. |
| `MarketPlace Sporting - Sellers (BD).xlsx` | `/data/MarketPlace Sporting - Sellers (BD).xlsx` | data | Media | Archivo de datos operativo. Evaluar si debe publicarse en GitHub Pages. |
| `Mapa del Hub.docx` | `/docs/source/Mapa del Hub.docx` | documentacion | Baja | Documento fuente. Puede mantenerse como referencia historica. |
| `PROJECT_WORKFLOW.md` | `/PROJECT_WORKFLOW.md` | documentacion | Alta | Metodologia institucional base. Debe permanecer visible en raiz. |
| archivos versionados antiguos futuros | `/legacy/` | legacy | Media | Usar solo despues de validar nuevas rutas y estrategia de compatibilidad. |
