# Marketplace Portal

Marketplace Portal es el repositorio operativo del ecosistema Marketplace Sporting. Reune el hub central, paginas internas, formularios publicos, simuladores, modelos de integracion, governance, seller center, roadmaps y herramientas de gestion necesarias para operar y evolucionar el marketplace.

## Objetivo del proyecto

El objetivo es convertir el conjunto actual de paginas y herramientas en una plataforma estatica estructurada, mantenible y escalable, compatible con GitHub Pages y preparada para migraciones incrementales sin romper funcionalidades existentes.

## Estado actual

El proyecto funciona, pero crecio de forma organica. Actualmente la mayor parte de las paginas HTML se encuentran en la raiz del repositorio con nombres versionados, CSS inline y JavaScript embebido. Tambien conviven en la raiz archivos de configuracion, integracion, documentacion, datos y assets.

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

