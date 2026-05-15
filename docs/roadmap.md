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

## Etapa 3.1: navegacion interna en copias

Objetivo: ajustar solo los links internos de las paginas copiadas para que naveguen correctamente dentro de la estructura nueva.

Estado: completada.

Resultado:

- las paginas copiadas se enlazan entre si usando rutas nuevas cuando existen;
- los links hacia backlog, Gantt, formularios, simuladores y maquetas aun no migradas apuntan a archivos versionados de raiz;
- no se modificaron archivos originales de raiz;
- no se extrajo CSS ni JavaScript.

## Etapa 3.2: migracion Maqueta Seller Center

Objetivo: copiar la maqueta de Seller Center a su ubicacion futura y ajustar navegacion minima.

Estado: completada.

Resultado:

- `maqueta-seller-center_v2.html` copiado a `internal/seller-center/maqueta-seller-center.html`;
- `internal/seller-center/index.html` enlaza a la nueva maqueta;
- `index.html` incluye acceso a la maqueta migrada;
- el archivo original en raiz se mantiene intacto como legacy temporal.

## Etapa 3.4: migracion Gantt Seller Center

Objetivo: copiar Gantt Seller Center a su ubicacion futura y ajustar navegacion minima.

Estado: completada.

Resultado:

- `gantt-seller-center_v2.html` copiado a `internal/gantt/gantt-seller-center.html`;
- `index.html` enlaza a la nueva ruta;
- Seller Center y Proyecto Marketplace migrados enlazan a la nueva ruta;
- el archivo original en raiz se mantiene intacto como legacy temporal.

## Etapa 3.5: migracion Gantt Operativo

Objetivo: copiar Gantt Operativo a su ubicacion futura y ajustar navegacion minima desde paginas ya migradas.

Estado: completada.

Resultado:

- `gantt-operativo_v18.html` copiado a `internal/gantt/gantt-operativo.html`;
- `index.html` enlaza a la nueva ruta;
- paginas internas ya migradas enlazan al Gantt Operativo nuevo;
- links hacia backlog siguen apuntando a raiz hasta su migracion;
- el archivo original en raiz se mantiene intacto como legacy temporal.

## Etapa 3.6: migracion Backlog de Sellers

Objetivo: copiar Backlog de Sellers a su ubicacion futura y ajustar navegacion minima desde paginas ya migradas.

Estado: completada.

Resultado:

- `backlog-sellers_v27.html` copiado a `internal/backlog/backlog-sellers.html`;
- `index.html` enlaza a la nueva ruta;
- paginas internas ya migradas enlazan al Backlog nuevo;
- se preservan CSV, logica de logos, cards, tabla, filtros y modal;
- el archivo original en raiz se mantiene intacto como legacy temporal.

Pendiente:

- migrar paginas internas de mayor riesgo como backlog, gestion de sellers, Gantt y simuladores internos;
- resolver dependencias heredadas no presentes en el repositorio cuando se aborde Seller Center en detalle;
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
