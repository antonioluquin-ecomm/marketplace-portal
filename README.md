# Marketplace Portal

Marketplace Portal es el repositorio operativo del ecosistema Marketplace Sporting. Reune el hub central, paginas internas, formularios publicos, simuladores, modelos de integracion, governance, seller center, roadmaps y herramientas de gestion necesarias para operar y evolucionar el marketplace.

## Objetivo del proyecto

El objetivo es convertir el conjunto actual de paginas y herramientas en una plataforma estatica estructurada, mantenible y escalable, compatible con GitHub Pages y preparada para migraciones incrementales sin romper funcionalidades existentes.

## Estado actual

El proyecto funciona y ya cuenta con estructura institucional migrada. Las paginas nuevas viven en `internal/` y `public/`, mientras que los HTML versionados de raiz que ya tienen ruta nueva funcionan como aliases de compatibilidad.

`sporting-marketplace_hub_v29.html` se mantiene intacto como referencia temporal y decision pendiente para una etapa posterior. No se movieron archivos a `legacy/` durante el cierre de Etapa 7.

Estructura actual resumida:

```txt
/
├─ Logos/
├─ Apps_script_v5.js
├─ config.js
├─ PROJECT_WORKFLOW.md
├─ Mapa del Hub.docx
├─ MarketPlace Sporting - Sellers (BD).xlsx
├─ sporting-marketplace_hub_v29.html
├─ backlog-sellers_v27.html
├─ gestion-sellers_v7.html
├─ gantt-operativo_v18.html
├─ gantt-seller-center_v2.html
├─ seller-center_v2.html
├─ maqueta-seller-center_v2.html
├─ formularios, simuladores y modelos HTML
└─ docs/
```

## Estado V1

La reestructuracion inicial queda cercana a cierre V1:

- estructura base creada;
- `index.html` institucional creado;
- paginas internas y publicas migradas por copia segura;
- assets/logos copiados y fallbacks locales aplicados por etapas;
- `tokens.css` validado en paginas internas seleccionadas;
- aliases legacy implementados para todos los HTML versionados migrados;
- `sporting-marketplace_hub_v29.html` intacto y pendiente de decision futura.

Validacion previa a release V1:

- smoke test manual completo de aliases ejecutado con resultado OK;
- paginas publicas validadas con `?seller_id=SPT-001`;
- query string y hash preservados en aliases;
- no se ejecuto submit real en Gestion ni formularios;
- preparar release notes V1.

## Metodologia de trabajo

El proyecto se gestiona segun `PROJECT_WORKFLOW.md`, respetando estos principios:

- separar auditoria, implementacion, validacion y release;
- trabajar en etapas pequenas, controladas y verificables;
- no mezclar cambios funcionales, visuales, estructurales y documentales;
- mantener documentacion viva;
- registrar decisiones importantes;
- validar antes de publicar;
- proteger URLs existentes y compatibilidad con GitHub Pages.

## Alcance de la Etapa 0

Esta etapa crea la base documental e institucional del proyecto. No incluye cambios funcionales, visuales, estructurales sobre paginas existentes, migraciones de HTML, cambios de rutas, cambios de Apps Script ni modificaciones sobre formularios o simuladores.

Archivos documentales principales:

- `CHANGELOG.md`
- `docs/architecture.md`
- `docs/hub-map.md`
- `docs/roadmap.md`
- `docs/test-matrix.md`
- `docs/decisions/README.md`
