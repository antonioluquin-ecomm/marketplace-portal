# Roadmap de Migracion

Este roadmap organiza la reestructuracion del Marketplace Portal en etapas incrementales. Cada etapa debe cerrarse con validacion y documentacion antes de avanzar.

## Etapa 0: documentacion

Objetivo: crear la base institucional y tecnica para migrar con control.

Incluye:

- README inicial;
- changelog;
- arquitectura objetivo;
- mapa del hub;
- roadmap;
- matriz de validacion;
- guia de decisiones arquitectonicas.

No incluye cambios funcionales, visuales, de rutas ni de logica.

## Etapa 1: estructura base

Objetivo: crear la estructura de carpetas objetivo sin mover paginas criticas todavia.

Estado: completada la creacion fisica de carpetas base con `.gitkeep`.

Incluye:

- `assets/`;
- `internal/`;
- `public/`;
- `integrations/`;
- `data/`;
- `legacy/`.

Validacion esperada:

- Git limpio antes de iniciar;
- estructura creada;
- sin cambios en comportamiento de paginas existentes.

Resultado:

- carpetas base disponibles para migraciones futuras;
- sin movimiento de HTML existentes;
- sin cambios de rutas;
- sin cambios funcionales ni visuales.

## Etapa 2: index oficial

Objetivo: definir la entrada principal del portal.

Estado: completada la creacion de `index.html` oficial en raiz.

Incluye:

- crear `index.html`;
- mantener temporalmente el hub versionado actual;
- validar links principales;
- documentar compatibilidad con GitHub Pages.

Resultado:

- `index.html` funciona como entrada institucional;
- el hub versionado actual permanece intacto como referencia temporal;
- los links apuntan a paginas actuales en raiz;
- no se migraron paginas a `internal/` ni `public/`.

## Etapa 3: migracion de paginas internas

Objetivo: mover/copiar progresivamente paginas internas a `internal/`.

Estado: completada parcialmente para paginas internas informativas y Seller Center base, mediante copia segura.

Prioridad sugerida:

- paginas informativas de estrategia;
- governance;
- seller center;
- gantt;
- backlog y gestion solo con validacion adicional.

Resultado parcial:

- `governance_v3.html` copiado a `internal/estrategia/governance.html`;
- `proceso-onboarding_v4.html` copiado a `internal/estrategia/proceso-onboarding.html`;
- `modelo-integracion_v5.html` copiado a `internal/estrategia/modelo-integracion.html`;
- `modelo-economico_v2.html` copiado a `internal/estrategia/modelo-economico.html`;
- `proyecto-marketplace_v3.html` copiado a `internal/estrategia/proyecto-marketplace.html`;
- `seller-center_v2.html` copiado a `internal/seller-center/index.html`.

Pendiente:

- migrar paginas internas de mayor riesgo como backlog, gestion de sellers, Gantt y simuladores internos;
- revisar rutas internas dentro de las paginas copiadas en una etapa posterior;
- definir estrategia de compatibilidad antes de retirar o redireccionar archivos de raiz.

## Etapa 4: migracion de paginas publicas

Objetivo: migrar paginas compartibles con sellers sin romper URLs.

Incluye:

- presentacion seller;
- formulario de calificacion;
- formulario de relevamiento;
- simulador seller.

Requiere:

- plan de compatibilidad;
- smoke test de envio;
- validacion de query params;
- confirmacion de endpoints.

## Etapa 5: assets compartidos

Objetivo: ordenar recursos visuales y estaticos.

Incluye:

- mover o copiar logos a `assets/logos/`;
- definir convencion de nombres;
- documentar rutas de assets;
- actualizar referencias solo despues de validar.

## Etapa 6: CSS/JS compartido

Objetivo: reducir duplicacion tecnica sin cambiar comportamiento ni diseno.

Incluye:

- CSS base;
- tokens visuales;
- layout compartido;
- componentes reutilizables;
- helpers JS compartidos;
- configuracion central.

Debe hacerse por pagina y con comparacion visual/manual.

## Etapa 7: legacy y redirects

Objetivo: cerrar la migracion sin romper referencias existentes.

Incluye:

- convertir archivos versionados en aliases o redirects;
- mover versiones historicas a `legacy/`;
- documentar URLs finales;
- actualizar changelog y release notes.
