# Mapa Inicial del Hub

Este inventario documenta los archivos actuales y una ruta futura sugerida. No implica que esas rutas existan actualmente ni que deban migrarse sin validacion previa.

| Archivo actual | Ruta futura sugerida | Tipo | Criticidad | Observaciones |
|---|---|---|---|---|
| `index.html` | `/index.html` | documentacion | Alta | Entrada institucional oficial creada en Etapa 2. Enlaza a paginas actuales en raiz sin migrarlas. |
| `sporting-marketplace_hub_v29.html` | `/legacy/root-html-v1/sporting-marketplace_hub_v29.html` | legacy | Alta | Hub central actual versionado. Se mantiene intacto como referencia temporal; no mover hasta definir compatibilidad. |
| `backlog-sellers_v27.html` | `/internal/backlog/backlog-sellers.html` | interno | Alta | Copiado a estructura futura. Mantiene CSV, logos, cards, tabla, filtros y modal. Original en raiz se mantiene como legacy temporal. |
| `gestion-sellers_v7.html` | `/internal/backlog/gestion-sellers.html` | interno | Alta | Copiado a estructura futura. Usa `assets/js/config.js`, Apps Script, CSV sellers, localStorage y submit no-cors. Original en raiz se mantiene como legacy temporal. |
| `gantt-operativo_v18.html` | `/internal/gantt/gantt-operativo.html` | interno | Alta | Copiado a estructura futura. Mantiene dependencias CSV de sellers y timeline. Original en raiz se mantiene como legacy temporal. |
| `gantt-seller-center_v2.html` | `/internal/gantt/gantt-seller-center.html` | interno | Media | Copiado a estructura futura. Mantiene dependencia CSV publicada de sc_roadmap. Original en raiz se mantiene como legacy temporal. |
| `seller-center_v2.html` | `/internal/seller-center/index.html` | interno | Media | Copiado a estructura futura. Navegacion minima ajustada en copia. Original en raiz se mantiene como legacy temporal. |
| `maqueta-seller-center_v2.html` | `/internal/seller-center/maqueta-seller-center.html` | interno | Media | Copiado a estructura futura. Navegacion minima ajustada en copia. Original en raiz se mantiene como legacy temporal. |
| `proyecto-marketplace_v3.html` | `/internal/estrategia/proyecto-marketplace.html` | interno | Media | Copiado a estructura futura. Navegacion minima ajustada en copia. Original en raiz se mantiene como legacy temporal. |
| `proceso-onboarding_v4.html` | `/internal/estrategia/proceso-onboarding.html` | interno | Media | Copiado a estructura futura. Navegacion minima ajustada en copia. Original en raiz se mantiene como legacy temporal. |
| `modelo-integracion_v5.html` | `/internal/estrategia/modelo-integracion.html` | interno | Media | Copiado a estructura futura. Navegacion minima ajustada en copia. Original en raiz se mantiene como legacy temporal. |
| `modelo-economico_v2.html` | `/internal/estrategia/modelo-economico.html` | interno | Media | Copiado a estructura futura. Navegacion minima ajustada en copia. Original en raiz se mantiene como legacy temporal. |
| `governance_v3.html` | `/internal/estrategia/governance.html` | interno | Media | Copiado a estructura futura. Navegacion minima ajustada en copia. Original en raiz se mantiene como legacy temporal. |
| `formulario-calificacion_v2.html` | `/public/formularios/formulario-calificacion.html` | publico | Alta | Formulario publico. No mover sin compatibilidad y validacion de envio. |
| `formulario-relevamiento_v2.html` | `/public/formularios/formulario-relevamiento.html` | publico | Alta | Formulario publico critico. No tocar inicialmente. |
| `presentacion-seller_v3.html` | `/public/presentaciones/presentacion-seller.html` | publico | Media | Presentacion compartible con sellers. |
| `simulador-seller_v12.html` | `/public/simuladores/simulador-seller.html` | publico | Alta | Simulador publico. Evitar cambios sin smoke test detallado. |
| `simulador-economico_v4.html` | `/internal/simuladores/simulador-economico.html` | interno | Alta | Copiado a estructura futura. Mantiene Sheets/config, formulas, tarifas, overrides y escenarios. Original en raiz se mantiene como legacy temporal. |
| `config.js` | `/assets/js/config.js` | integracion | Alta | Copiado a ubicacion futura como configuracion central. Original en raiz se mantiene como referencia temporal. |
| `Apps_script_v5.js` | `/integrations/apps-script/Apps_script_v5.js` | integracion | Alta | Backend Apps Script. No modificar en etapa documental ni estructural inicial. |
| `Logos/` | `/assets/logos/` | data | Media | Assets visuales. Migrar con cuidado por sensibilidad de rutas y mayusculas. |
| `MarketPlace Sporting - Sellers (BD).xlsx` | `/data/MarketPlace Sporting - Sellers (BD).xlsx` | data | Media | Archivo de datos operativo. Evaluar si debe publicarse en GitHub Pages. |
| `Mapa del Hub.docx` | `/docs/source/Mapa del Hub.docx` | documentacion | Baja | Documento fuente. Puede mantenerse como referencia historica. |
| `PROJECT_WORKFLOW.md` | `/PROJECT_WORKFLOW.md` | documentacion | Alta | Metodologia institucional base. Debe permanecer visible en raiz. |
| archivos versionados antiguos futuros | `/legacy/` | legacy | Media | Usar solo despues de validar nuevas rutas y estrategia de compatibilidad. |
