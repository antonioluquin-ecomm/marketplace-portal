# Marketplace Portal

Marketplace Portal es el repositorio operativo del ecosistema Marketplace Sporting. Reune el hub central, paginas internas, formularios publicos, simuladores, modelos de integracion, governance, seller center, roadmaps y herramientas de gestion necesarias para operar y evolucionar el marketplace.

## Objetivo del proyecto

El objetivo es convertir el conjunto actual de paginas y herramientas en una plataforma estatica estructurada, mantenible y escalable, compatible con GitHub Pages y preparada para migraciones incrementales sin romper funcionalidades existentes.

## Estado actual

El proyecto funciona y ya cuenta con estructura institucional migrada. Las paginas nuevas viven en `internal/` y `public/`, mientras que los HTML versionados de raiz que ya tienen ruta nueva funcionan como aliases de compatibilidad.

`internal/hub-operativo.html` es el hub operativo interno oficial post-V1, creado a partir de la funcionalidad util de `sporting-marketplace_hub_v29.html`. `index.html` mantiene el rol de portada institucional liviana.

`sporting-marketplace_hub_v29.html` se conserva en raiz como URL legacy, pero desde Etapa 9C funciona como alias hacia `internal/hub-operativo.html`. El smoke test de Etapa 9D fue OK, preservando query string y hash. No se movio ni elimino el archivo legacy.

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
├─ internal/
│  └─ hub-operativo.html
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

Marketplace Portal V1 queda estable y listo para release:

- estructura base creada;
- `index.html` institucional creado;
- paginas internas y publicas migradas por copia segura;
- assets/logos copiados y fallbacks locales aplicados por etapas;
- `tokens.css` validado en paginas internas seleccionadas;
- aliases legacy implementados para todos los HTML versionados migrados;
- `sporting-marketplace_hub_v29.html` quedo intacto durante V1 y desde Etapa 9C funciona como alias al hub operativo oficial.
- `internal/hub-operativo.html` recibio mejoras post-V1 acotadas en Etapa 10B: regreso al portal, buscador mejorado, aviso de `seller_id`, mapa clickeable y ajuste mobile minimo.
- `assets/css/internal-components.css` quedo aplicado a paginas internas autorizadas en Etapa 14, manteniendo CSS inline como fallback y sin extraer JavaScript.

Validacion previa a release V1:

- smoke test manual completo de aliases ejecutado con resultado OK;
- paginas publicas validadas con `?seller_id=SPT-001`;
- query string y hash preservados en aliases;
- no se ejecuto submit real en Gestion ni formularios;
- release notes V1 creadas en `docs/release-notes-v1.md`.

Pendientes post-V1:

- definir siguientes mejoras post-9D sobre el hub operativo sin tocar formularios, simuladores, Backlog, Gestion, Apps Script ni config sin etapa especifica;
- mantener la raiz como compatibility layer de aliases; no mover aliases a `legacy/` sin etapa explicita;
- evaluar extraccion CSS/JS solo con auditoria y smoke test por grupo;
- mantener paginas publicas seller-facing independientes del CSS interno compartido;
- no extraer JavaScript ni eliminar CSS inline sin nueva auditoria especifica;
- mantener Apps Script, endpoints, payloads y submit sin cambios salvo etapa autorizada.
- usar `docs/handoff-post-v1.md` como contexto inicial para nuevas sesiones.

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
