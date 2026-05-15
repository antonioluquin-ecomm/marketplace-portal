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

## Etapa 3.8B: config central y Gestion de Sellers

Objetivo: preparar la ubicacion esperada de configuracion central y copiar Gestion de Sellers a su ruta futura sin ejecutar submit real.

Estado: completada.

Resultado:

- `config.js` copiado a `assets/js/config.js`;
- `gestion-sellers_v7.html` copiado a `internal/backlog/gestion-sellers.html`;
- `index.html` enlaza a la nueva ruta;
- Backlog ya genera la ruta futura para editar sellers;
- se preservan endpoint, payload, `tipo_formulario`, generacion de IDs, `localStorage`, validaciones y `no-cors`.

## Etapa 3.9: migracion Simulador Economico interno

Objetivo: copiar el simulador economico interno a su ubicacion futura sin tocar logica de calculo ni fuentes de datos.

Estado: completada.

Resultado:

- `simulador-economico_v4.html` copiado a `internal/simuladores/simulador-economico.html`;
- `index.html` enlaza a la nueva ruta;
- `modelo-economico.html` enlaza a la nueva ruta;
- se preservan CONFIG/DIRECT_CSV_URLS, formulas, tarifas, overrides, escenarios e inputs;
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

## Etapa 4.1: migracion Presentacion Seller

Objetivo: copiar la presentacion publica para sellers a su ubicacion futura sin alterar personalizacion por seller.

Estado: completada.

Resultado:

- `presentacion-seller_v3.html` copiado a `public/presentaciones/presentacion-seller.html`;
- `index.html` enlaza a la nueva ruta publica;
- se preservan `seller_id`, logos, CTA y lectura de CSV sellers;
- el archivo original en raiz se mantiene intacto como legacy temporal.

## Etapa 4.2: migracion Simulador Seller publico

Objetivo: copiar el simulador publico para sellers a su ubicacion futura sin alterar calculos ni personalizacion por seller.

Estado: completada.

Resultado:

- `simulador-seller_v12.html` copiado a `public/simuladores/simulador-seller.html`;
- `index.html` enlaza a la nueva ruta publica;
- Backlog ya genera la ruta publica futura para el simulador seller;
- se preservan `seller_id`, logos, CTA, tarifas, overrides, escenarios y calculos;
- el archivo original en raiz se mantiene intacto como legacy temporal.

## Etapa 4.3B: migracion Formulario de Calificacion

Objetivo: copiar el formulario publico de calificacion a su ubicacion futura sin alterar envio ni validaciones.

Estado: completada sin submit real.

Resultado:

- `formulario-calificacion_v2.html` copiado a `public/formularios/formulario-calificacion.html`;
- `index.html` enlaza a la nueva ruta publica;
- Presentacion Seller, Simulador Seller y Backlog ya usan la ruta publica futura;
- se preservan endpoint, CSV sellers, `tipo_formulario`, payload, validaciones, `seller_id`, logo, personalizacion y submit;
- el archivo original en raiz se mantiene intacto como legacy temporal.

## Etapa 4.4B: migracion Formulario de Relevamiento

Objetivo: copiar el formulario publico de relevamiento a su ubicacion futura sin alterar envio, validaciones ni condicionales.

Estado: completada sin submit real.

Resultado:

- `formulario-relevamiento_v2.html` copiado a `public/formularios/formulario-relevamiento.html`;
- `index.html` enlaza a la nueva ruta publica;
- Backlog ya usa la ruta publica futura para el relevamiento;
- se preservan endpoint, CSV sellers, `tipo_formulario`, payload, validaciones, condicionales, `seller_id`, logo, personalizacion y submit;
- el archivo original en raiz se mantiene intacto como legacy temporal.

Riesgo pendiente:

- validar y corregir en etapa separada la referencia a `pctSec` antes de declaracion dentro de `updateProgress`, si se reproduce en navegador.

## Etapa 4.5: preparacion de smoke test manual

Objetivo: preparar una matriz/checklist documentada para validar manualmente todas las rutas migradas en `/internal/` y `/public/` antes de avanzar con redirects, limpieza legacy o extraccion de CSS/JS.

Estado: completada a nivel documental.

Resultado:

- `docs/test-matrix.md` actualizado con rutas internas y publicas migradas;
- incluidas rutas publicas con y sin `seller_id=SPT-001`;
- definidas validaciones visuales, funcionales, dependencias, consola, resultado esperado, resultado real, estado y observaciones;
- agregados checklists de navegacion, datos, formularios y consola;
- documentados riesgos conocidos como `pctSec`, `articulos-seller.docx`, formularios con escritura real, duplicidad legacy, CSS/JS inline y redirects pendientes.

Pendiente:

- ejecutar smoke test manual en navegador;
- completar resultado real, estado y observaciones en la matriz;
- validar formularios sin submit real y planificar prueba controlada con seller de test.

## Etapa 5: assets compartidos

Objetivo: ordenar recursos visuales y estaticos.

Incluye:

- mover o copiar logos a `assets/logos/`;
- definir convencion de nombres;
- documentar rutas de assets;
- actualizar referencias solo despues de validar.

## Etapa 5A: auditoria y estrategia de assets compartidos

Objetivo: auditar duplicaciones visuales/tecnicas y definir una estrategia segura antes de extraer CSS, JS o mover assets.

Estado: completada a nivel documental.

Resultado:

- creado `docs/assets-strategy.md`;
- documentada la repeticion de topbars, sidebars, tokens, botones, cards, KPIs, tablas, modales, filtros, helpers CSV, helpers de `seller_id`, logos, navegacion y rutas;
- definida estructura futura para `assets/css/`, `assets/js/`, `assets/js/components/`, `assets/js/data/`, `assets/js/pages/` y `assets/logos/`;
- definido roadmap incremental 5B a 5H;
- identificadas paginas candidatas para piloto y paginas que no conviene tocar todavia.

Alcance excluido:

- sin modificaciones en paginas HTML;
- sin extraccion de CSS o JavaScript;
- sin cambios de diseno, logica, endpoints, payloads o Apps Script;
- sin movimiento de `Logos/` legacy;
- sin redirects.

Pendiente:

- ejecutar Etapa 5B solo si se aprueba copia segura de logos hacia `assets/logos/`;
- mantener `Logos/` y `config.js` raiz como legacy temporal.

## Etapa 5B: copia segura de logos

Objetivo: copiar los logos actuales desde `Logos/` hacia `assets/logos/` sin modificar referencias ni configuracion.

Estado: completada.

Resultado:

- 15 archivos `spt-*.png` copiados desde `Logos/` hacia `assets/logos/`;
- nombres, mayusculas/minusculas y extensiones preservados;
- tamanos y hashes SHA256 coinciden entre origen y destino;
- `Logos/` sigue existiendo como legacy temporal;
- no se modificaron paginas HTML, CSS, JS, `config.js`, `assets/js/config.js`, Apps Script, endpoints, payloads ni redirects.

Pendiente:

- validar carga directa de los logos desde `/assets/logos/`;
- decidir en una etapa futura si se actualiza `LOGO_BASE_URL`;
- actualizar referencias solo pagina por pagina y con smoke test visual.

## Etapa 5C: validacion de carga de logos

Objetivo: confirmar que los logos copiados en `assets/logos/` estan disponibles como imagenes locales antes de migrar referencias.

Estado: completada.

Resultado:

- validados `assets/logos/spt-001.png` a `assets/logos/spt-015.png`;
- existencia confirmada para los 15 archivos;
- firma PNG valida para los 15 archivos;
- apertura como imagen local confirmada para los 15 archivos;
- dimensiones confirmadas: `200x200`;
- ruta relativa `assets/logos/spt-001.png` resuelve desde la raiz del repositorio;
- sin cambios en HTML, referencias, `LOGO_BASE_URL`, `config.js`, `assets/js/config.js`, `Logos/`, Apps Script o redirects.

Pendiente:

- validar disponibilidad publicada en GitHub Pages;
- definir si corresponde actualizar referencias en una etapa posterior.

## Etapa 5D: auditoria de consumo actual de logos

Objetivo: auditar como consumen logos las paginas migradas y legacy antes de cambiar referencias hacia `assets/logos/`.

Estado: completada a nivel documental.

Resultado:

- auditadas referencias a `Logos/`, `assets/logos/`, `LOGO_BASE_URL`, `logoCandidates`, `logoHTML`, `sellerLogo`, `topSellerLogo`, `renderSellerIdentity`, `applySellerIdentity` y fallbacks por iniciales;
- documentado que no hay consumo directo actual de `Logos/` en paginas;
- documentado que `assets/logos/` todavia no se consume por referencias relativas;
- identificado que Backlog y Gestion de Sellers usan `LOGO_BASE_URL` + `seller_id`;
- identificado que Presentacion Seller, Simulador Seller y formularios usan `logo_url`/`logo`/`url_logo` desde CSV o query params;
- clasificado riesgo por pagina;
- propuesta como piloto futuro `public/presentaciones/presentacion-seller.html`, sin tocar config global.

Pendiente:

- definir una Etapa 5E para piloto controlado de consumo local de logos;
- mantener sin cambios `LOGO_BASE_URL`, `config.js`, `assets/js/config.js`, formularios, Backlog y Gestion de Sellers.

## Etapa 5E: piloto controlado de fallback local de logos

Objetivo: aplicar un piloto acotado en `public/presentaciones/presentacion-seller.html` para usar `../../assets/logos/{seller_id}.png` solo cuando no exista logo desde CSV o query params.

Estado: completada.

Resultado:

- piloto aplicado solo en `public/presentaciones/presentacion-seller.html`;
- prioridad preservada para `logo_url` del CSV y query params `logo`/`logo_url`;
- agregado fallback local `../../assets/logos/{seller_id}.png`;
- fallback final por iniciales preservado si no carga el logo;
- `seller_id`, CTAs, CSV y logica de personalizacion preservados;
- sin cambios en legacy `presentacion-seller_v3.html`;
- sin cambios en Backlog, Gestion de Sellers, formularios, simuladores, `config.js`, `assets/js/config.js`, `LOGO_BASE_URL`, Apps Script o redirects.

Pendiente:

- smoke test manual con `seller_id=SPT-001`;
- validar caso con `logo_url` desde CSV/query;
- validar caso sin logo local para confirmar iniciales;
- revisar consola por errores o 404 inesperados.

## Etapa 5F: fallback local de logos en Simulador Seller

Objetivo: extender el criterio validado a `public/simuladores/simulador-seller.html` sin tocar calculos, tarifas, overrides, escenarios ni configuracion global.

Estado: completada.

Resultado:

- fallback local aplicado solo en `public/simuladores/simulador-seller.html`;
- prioridad preservada para `logo_url` del CSV y query params `logo`/`logo_url`;
- agregado fallback local `../../assets/logos/{seller_id}.png`;
- fallback final por iniciales preservado si no carga el logo;
- `seller_id`, CTAs, CSV, calculos, tarifas, overrides y escenarios preservados;
- sin cambios en legacy `simulador-seller_v12.html`;
- sin cambios en Backlog, Gestion de Sellers, formularios, Presentacion Seller, `config.js`, `assets/js/config.js`, `LOGO_BASE_URL`, Apps Script o redirects.

Pendiente:

- smoke test manual con `seller_id=SPT-001`;
- validar caso con `logo_url` desde CSV/query;
- validar caso sin logo local para confirmar iniciales;
- revisar calculos, escenarios y CTAs despues del cambio.

## Etapa 5G: auditoria previa de logos en formularios publicos

Objetivo: auditar si es seguro extender el fallback local de logos a formularios publicos migrados antes de modificar archivos.

Estado: completada a nivel documental.

Resultado:

- auditados `public/formularios/formulario-calificacion.html` y `public/formularios/formulario-relevamiento.html`;
- ambos cargan identidad por `seller_id` desde `SELLERS_CSV_URL`;
- ambos priorizan `seller.logo_url || seller.logo || seller.url_logo`;
- ambos tienen fallback por iniciales mediante `sellerLogo.onerror` o ausencia de logo;
- ambos usan `safeUrl()`, que actualmente solo acepta `http:` y `https:`;
- se identifico como punto natural de insercion el interior de `renderSellerIdentity()`, despues de resolver logo desde CSV;
- Calificacion clasificada como riesgo alto;
- Relevamiento clasificado como riesgo critico por sensibilidad, condicionales y riesgo pendiente `pctSec`;
- recomendacion: aplicar primero en Calificacion, validar sin submit real y luego evaluar Relevamiento.

Pendiente:

- Etapa 5H: piloto controlado solo en `public/formularios/formulario-calificacion.html`;
- mantener sin cambios Relevamiento, formularios legacy, Apps Script, endpoints, payloads, validaciones, submit, config global, Backlog, Gestion, simuladores y Presentacion Seller.

## Etapa 5H: fallback local de logos en Formulario de Calificacion

Objetivo: aplicar fallback local de logo en `public/formularios/formulario-calificacion.html` sin tocar submit, endpoint, payload, validaciones ni configuracion global.

Estado: completada.

Resultado:

- fallback local aplicado solo en `public/formularios/formulario-calificacion.html`;
- prioridad preservada para `logo_url`, `logo` y `url_logo` desde CSV;
- agregado fallback local `../../assets/logos/{seller_id}.png`;
- fallback final por iniciales preservado si no carga el logo;
- `seller_id`, submit, endpoint, payload, validaciones y CSV preservados;
- sin cambios en legacy `formulario-calificacion_v2.html`;
- sin cambios en Formulario de Relevamiento, Backlog, Gestion de Sellers, simuladores, Presentacion Seller, `config.js`, `assets/js/config.js`, `LOGO_BASE_URL`, Apps Script o redirects.

Pendiente:

- smoke test manual con `seller_id=SPT-001`;
- validar caso con logo desde CSV;
- validar caso sin logo CSV para confirmar fallback local;
- validar caso sin logo local para confirmar iniciales;
- confirmar validaciones sin ejecutar submit real.

## Etapa 5J: fallback local de logos en Formulario de Relevamiento

Objetivo: aplicar fallback local de logo en `public/formularios/formulario-relevamiento.html` sin tocar submit, endpoint, payload, validaciones, condicionales ni el riesgo pendiente `pctSec`.

Estado: completada.

Resultado:

- fallback local aplicado solo en `public/formularios/formulario-relevamiento.html`;
- prioridad preservada para `logo_url`, `logo` y `url_logo` desde CSV;
- agregado fallback local `../../assets/logos/{seller_id}.png`;
- fallback final por iniciales preservado si no carga el logo;
- `seller_id`, submit, endpoint, payload, validaciones, condicionales y CSV preservados;
- `pctSec` no fue modificado ni corregido;
- sin cambios en legacy `formulario-relevamiento_v2.html`;
- sin cambios en Backlog, Gestion de Sellers, simuladores, Presentacion Seller, `config.js`, `assets/js/config.js`, `LOGO_BASE_URL`, Apps Script o redirects.

Pendiente:

- smoke test manual con `seller_id=SPT-001`;
- validar caso con logo desde CSV;
- validar caso sin logo CSV para confirmar fallback local;
- validar caso sin logo local para confirmar iniciales;
- revisar condicionales y consola, manteniendo `pctSec` como riesgo conocido;
- no ejecutar submit real.

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
