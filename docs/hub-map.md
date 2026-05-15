# Mapa Inicial del Hub

Este inventario documenta los archivos actuales y una ruta futura sugerida. No implica que esas rutas existan actualmente ni que deban migrarse sin validacion previa.

| Archivo actual | Ruta futura sugerida | Tipo | Criticidad | Observaciones |
|---|---|---|---|---|
| `sporting-marketplace_hub_v29.html` | `/index.html` | documentacion | Alta | Hub central actual. Debe convertirse en entrada oficial sin romper referencias previas. |
| `backlog-sellers_v27.html` | `/internal/backlog/backlog-sellers.html` | interno | Alta | Pagina operativa critica. Consume datos externos y contiene logica de backlog. |
| `gestion-sellers_v7.html` | `/internal/backlog/gestion-sellers.html` | interno | Alta | Gestion/alta de sellers. Depende de Apps Script y CSV. |
| `gantt-operativo_v18.html` | `/internal/gantt/gantt-operativo.html` | interno | Alta | Gantt operativo. Depende de Google Sheets. |
| `gantt-seller-center_v2.html` | `/internal/gantt/gantt-seller-center.html` | interno | Media | Roadmap Seller Center. Depende de Google Sheets. |
| `seller-center_v2.html` | `/internal/seller-center/index.html` | interno | Media | Dashboard interno Seller Center. |
| `maqueta-seller-center_v2.html` | `/internal/seller-center/maqueta-seller-center.html` | interno | Media | Maqueta visual/funcional. Evitar cambios visuales durante migracion estructural. |
| `proyecto-marketplace_v3.html` | `/internal/estrategia/proyecto-marketplace.html` | interno | Media | Pagina ejecutiva/estrategica del proyecto. |
| `proceso-onboarding_v4.html` | `/internal/estrategia/proceso-onboarding.html` | interno | Media | Documenta flujo de onboarding. Tiene links hacia formularios y herramientas. |
| `modelo-integracion_v5.html` | `/internal/estrategia/modelo-integracion.html` | interno | Media | Modelo de decision tecnica. |
| `modelo-economico_v2.html` | `/internal/estrategia/modelo-economico.html` | interno | Media | Modelo economico. Relacionado con simuladores. |
| `governance_v3.html` | `/internal/estrategia/governance.html` | interno | Media | Governance institucional del marketplace. |
| `formulario-calificacion_v2.html` | `/public/formularios/formulario-calificacion.html` | publico | Alta | Formulario publico. No mover sin compatibilidad y validacion de envio. |
| `formulario-relevamiento_v2.html` | `/public/formularios/formulario-relevamiento.html` | publico | Alta | Formulario publico critico. No tocar inicialmente. |
| `presentacion-seller_v3.html` | `/public/presentaciones/presentacion-seller.html` | publico | Media | Presentacion compartible con sellers. |
| `simulador-seller_v12.html` | `/public/simuladores/simulador-seller.html` | publico | Alta | Simulador publico. Evitar cambios sin smoke test detallado. |
| `simulador-economico_v4.html` | `/internal/simuladores/simulador-economico.html` | interno | Alta | Simulador interno. Depende de datos externos y reglas economicas. |
| `config.js` | `/assets/js/config.js` | integracion | Alta | Configuracion central propuesta. Debe alinearse con rutas reales antes de activarse globalmente. |
| `Apps_script_v5.js` | `/integrations/apps-script/Apps_script_v5.js` | integracion | Alta | Backend Apps Script. No modificar en etapa documental ni estructural inicial. |
| `Logos/` | `/assets/logos/` | data | Media | Assets visuales. Migrar con cuidado por sensibilidad de rutas y mayusculas. |
| `MarketPlace Sporting - Sellers (BD).xlsx` | `/data/MarketPlace Sporting - Sellers (BD).xlsx` | data | Media | Archivo de datos operativo. Evaluar si debe publicarse en GitHub Pages. |
| `Mapa del Hub.docx` | `/docs/source/Mapa del Hub.docx` | documentacion | Baja | Documento fuente. Puede mantenerse como referencia historica. |
| `PROJECT_WORKFLOW.md` | `/PROJECT_WORKFLOW.md` | documentacion | Alta | Metodologia institucional base. Debe permanecer visible en raiz. |
| archivos versionados antiguos futuros | `/legacy/` | legacy | Media | Usar solo despues de validar nuevas rutas y estrategia de compatibilidad. |

