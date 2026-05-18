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

## Etapa 5K: auditoria de consumo de logos en Backlog y Gestion

Objetivo: auditar el consumo de logos en `internal/backlog/backlog-sellers.html` e `internal/backlog/gestion-sellers.html` antes de extender el patron de fallback local validado en Etapas 5E, 5F, 5H y 5J.

Estado: completada a nivel documental.

Reasignacion de numeracion:

- La unica mencion previa a `5K` aparecia en la seccion 5G de `docs/assets-strategy.md` como recomendacion historica de smoke test de Relevamiento. Ese smoke test queda cubierto por la matriz de Etapa 4.5 (`docs/test-matrix.md`). La Etapa 5K efectiva queda formalmente asignada a esta auditoria.

Resultado:

- auditado `internal/backlog/backlog-sellers.html`;
- auditado `internal/backlog/gestion-sellers.html`;
- documentado que Backlog tiene `CONFIG` inline con `LOGO_BASE_URL` hardcodeado y no carga `assets/js/config.js`;
- documentado que Gestion carga `assets/js/config.js` y resuelve `LOGO_BASE_URL` con fallback inline `FALLBACK_CONFIG`;
- documentado que ambas paginas dependen solo de `seller_id` y no consumen `logo_url` del CSV en el render actual;
- documentado que ambas usan 5 extensiones (`png, webp, jpg, jpeg, svg`) y fallback final por iniciales;
- documentado que la URL absoluta actual apunta a un GitHub Pages externo (`sporting-marketplace`) y no consume los logos locales de `assets/logos/`;
- clasificado riesgo por accion (bajo / medio / alto / critico);
- documentadas diferencias relevantes entre Backlog (multi-superficie, solo lectura) y Gestion (preview unica, escritura real);
- propuesto patron de fallback local como estrategia segura, manteniendo URL absoluta como prioridad;
- propuesto orden futuro: Etapa 5L para Backlog primero, Etapa 5M para Gestion despues;
- mantenidos sin cambios `config.js`, `assets/js/config.js`, `LOGO_BASE_URL`, Apps Script, endpoints, payloads, validaciones, `seller_id`, formularios, simuladores y Presentacion Seller.

Alcance excluido:

- Sin modificaciones en HTML.
- Sin cambios de referencias.
- Sin extraccion de CSS o JavaScript.
- Sin movimientos en `Logos/` ni en `assets/logos/`.
- Sin cambios en `config.js`, `assets/js/config.js`, `LOGO_BASE_URL`.
- Sin tocar Apps Script, endpoints, payloads, validaciones o `seller_id`.
- Sin implementacion de fallback local en Backlog ni en Gestion todavia.
- Sin redirects.

Pendiente:

- Etapa 5L: aplicar fallback local solo en `internal/backlog/backlog-sellers.html`, manteniendo `LOGO_BASE_URL` actual como prioridad.
- Etapa 5M: aplicar fallback local en `internal/backlog/gestion-sellers.html` solo despues de validar 5L.
- Mantener sin cambios `config.js`, `assets/js/config.js`, `LOGO_BASE_URL`, Apps Script, submit, payload, `seller_id` y archivos legacy.
- Ejecutar smoke test manual de Backlog y Gestion como parte de la matriz de Etapa 4.5 antes y despues de 5L y 5M.

## Etapa 5L: fallback local de logos en Backlog de Sellers

Objetivo: agregar fallback local de logo en `internal/backlog/backlog-sellers.html` sin tocar `LOGO_BASE_URL`, sin tocar `assets/js/config.js`, sin tocar Apps Script y sin alterar filtros, busqueda, tabs, render del kanban, tabla, modal, CSV ni links publicos.

Estado: completada.

Resultado:

- fallback local aplicado solo en `internal/backlog/backlog-sellers.html`;
- prioridad preservada para `CONFIG.LOGO_BASE_URL` y las 5 extensiones remotas (`png`, `webp`, `jpg`, `jpeg`, `svg`);
- agregado `../../assets/logos/{seller_id}.png` como ultimo candidato dentro de `logoCandidates()`;
- el `seller_id` se normaliza con `safeAssetId()` igual que para los candidatos remotos;
- `logoHTML()` no requiere cambios: serializa el array completo en `data-logo-candidates`;
- `handleLogoError()` (cards y tabla) y `handleModalLogoError()` (modal) reciclan el array por indice y heredan el nuevo candidato sin modificaciones;
- fallback final por iniciales preservado en cards, tabla y modal;
- sin cambios en `CONFIG` inline (URLs, paths, extensiones, constantes operativas);
- sin cambios en filtros, busqueda, tabs `kanban/tabla`, render estructural, modal, parsers CSV, helpers de pipeline ni links publicos;
- sin cambios en `internal/backlog/gestion-sellers.html`;
- sin cambios en `config.js`, `assets/js/config.js`, Apps Script, formularios, simuladores, Presentacion Seller, payloads ni redirects;
- sin cambios en archivos legacy en raiz.

Alcance excluido:

- Sin cambios en `LOGO_BASE_URL`.
- Sin cambios en `LOGO_EXTENSIONS`.
- Sin cambios en `config.js` ni `assets/js/config.js`.
- Sin cambios en Apps Script, endpoints, payloads, validaciones o `seller_id`.
- Sin cambios en Gestion de Sellers, formularios publicos, simuladores ni Presentacion Seller.
- Sin movimientos en `Logos/` ni en `assets/logos/`.
- Sin cambios en archivos legacy en raiz (`backlog-sellers_v27.html`).
- Sin redirects.
- Sin cambios visuales, de filtros, de busqueda, de tabs, de modal ni de tabla.

Pendiente:

- Smoke test manual en navegador sobre cards del kanban, tabla y modal.
- Validar caso con URL absoluta disponible y caso con URL absoluta caida.
- Validar caso con asset local presente y caso sin asset local (debe caer a iniciales).
- Etapa 5M: aplicar el mismo patron en `internal/backlog/gestion-sellers.html` solo despues de validar 5L.
- Actualizar `docs/test-matrix.md` con el smoke test especifico de la cadena de fallback en Backlog.

## Etapa 5M: fallback local de logos en Gestion de Sellers

Objetivo: agregar fallback local de logo en `internal/backlog/gestion-sellers.html` sin tocar submit, payload, endpoint, `seller_id`, `nextSellerId`, `reserveSellerId`, `localStorage`, validaciones, carga de CSV, lógica de alta/edicion ni configuracion global.

Estado: completada.

Resultado:

- fallback local aplicado solo en `internal/backlog/gestion-sellers.html`;
- prioridad preservada para `LOGO_BASE_URL` (resuelto como `CFG.ASSETS.LOGO_BASE_URL || FALLBACK_CONFIG.ASSETS.LOGO_BASE_URL`) y las 5 extensiones remotas (`png`, `webp`, `jpg`, `jpeg`, `svg`);
- agregado `../../assets/logos/{seller_id}.png` como ultimo candidato dentro de `logoCandidates(id)`;
- el `seller_id` se normaliza con `clean(id).toLowerCase()` + `encodeURIComponent(sid)` igual que para los candidatos remotos;
- `updateLogo(box, sellerId, name)` no requiere cambios: continua ciclando el array por indice via `img.onerror` y cae a `<span class="logo-fallback">` cuando se agotan los candidatos;
- la preview `#logoPreview` hereda el nuevo candidato sin cambios estructurales;
- fallback final por iniciales preservado en `updateLogo()`;
- sin cambios en `CFG.ASSETS.LOGO_BASE_URL` ni `FALLBACK_CONFIG.ASSETS.LOGO_BASE_URL`;
- sin cambios en `nextSellerId`, `normalizeSellerId`, `reserveSellerId`, `getReservedIds`, `validatePayload`, `formToObject`, `updatePreview`, `buildPublicLink`, `buildFirstContactMessage`, `copyLink`, `copyPayload`;
- sin cambios en el listener `submit`, ni en `fetch(APPS_SCRIPT_URL, ...)`, ni en `tipo_formulario:"seller"`, ni en `mp_responsable_seller`/`mp_reserved_seller_ids`;
- sin cambios en `loadSellers`, `parseCSV`, `getCSV`, `buildExistingSelect`, `loadSelectedSeller`, `loadSellerById`, `initFromUrl`;
- sin cambios en `internal/backlog/backlog-sellers.html`;
- sin cambios en `config.js`, `assets/js/config.js`, Apps Script, formularios publicos, simuladores ni Presentacion Seller;
- sin cambios en archivos legacy en raiz (`gestion-sellers_v7.html`).

Alcance excluido:

- Sin cambios en `LOGO_BASE_URL`.
- Sin cambios en `config.js` ni `assets/js/config.js`.
- Sin cambios en Apps Script, endpoints, payloads, validaciones, submit ni `seller_id`.
- Sin cambios en `nextSellerId`, `reserveSellerId` ni `localStorage`.
- Sin cambios en carga de CSV ni en el flujo de alta/edicion.
- Sin cambios en Backlog, formularios publicos, simuladores ni Presentacion Seller.
- Sin movimientos en `Logos/` ni en `assets/logos/`.
- Sin cambios en archivos legacy en raiz.
- Sin redirects.
- Sin cambios visuales ni de estructura.

Pendiente:

- Smoke test manual de la preview de Gestion con seller existente, seller nuevo y caso de URL principal caida.
- Validar caso con asset local presente y caso sin asset local (debe caer a iniciales).
- No ejecutar submit real durante el smoke test.
- Actualizar `docs/test-matrix.md` con el smoke test especifico de la cadena de fallback en Gestion de Sellers.
- Evaluar si las paginas piloto (5E, 5F, 5H, 5J, 5L, 5M) ya consolidadas habilitan crear un helper compartido `assets/js/logos.js` en una etapa futura, sin alterar las paginas que ya quedaron migradas.

## Etapa 6C: piloto tokens.css en proceso-onboarding

**Fecha:** 2026-05-16
**Estado:** completado

Objetivo: crear `assets/css/tokens.css` con el bloque `:root {}` canonico y enlazarlo como piloto en la pagina informativa de menor riesgo del proyecto.

Acciones realizadas:
- Creado `assets/css/tokens.css` con 19 variables canónicas en 5 grupos: verde primario, fondos, separadores, texto, semanticos + layout.
- Agregado `<link rel="stylesheet" href="../../assets/css/tokens.css">` en `<head>` de `internal/estrategia/proceso-onboarding.html`, antes del bloque `<style>`.
- El `:root` inline del HTML fue conservado sin modificacion — coexiste con el externo como fallback durante la transicion.
- Ningun otro HTML, JS, formulario, simulador ni pagina critica fue modificado.

Etapa 6D: smoke test ejecutado el 2026-05-16 en entorno local. Resultado: OK. Ver `docs/test-matrix.md — Etapa 6C/6D` para detalle completo.

Pendiente:
- Validacion en produccion (GitHub Pages) despues del proximo deploy.

## Etapa 6E: extension tokens.css al grupo internal/estrategia

**Fecha:** 2026-05-16
**Estado:** implementado — pendiente smoke test manual

Objetivo: extender `assets/css/tokens.css` a las 4 paginas reales del grupo `internal/estrategia/`, siguiendo el patron establecido en el piloto 6C/6D.

Acciones realizadas:
- Agregado `<link rel="stylesheet" href="../../assets/css/tokens.css">` en `<head>` de:
  - `internal/estrategia/governance.html`
  - `internal/estrategia/modelo-integracion.html`
  - `internal/estrategia/modelo-economico.html`
  - `internal/estrategia/proyecto-marketplace.html`
- El `:root` inline de cada pagina fue conservado sin modificacion.
- Ningun otro HTML, JS, formulario, simulador ni pagina critica fue modificado.

Etapa 6F: smoke test ejecutado el 2026-05-16 en entorno local. Resultado: OK en las 4 paginas. Ver `docs/test-matrix.md — Etapa 6E/6F` para detalle completo.

Estado final del grupo `internal/estrategia/`: **validado con `tokens.css`** — 5 paginas con link externo activo y `:root` inline como fallback.

Pendiente:
- Validacion en produccion (GitHub Pages) despues del proximo push.

## Etapa 6G: auditoria grupo internal/seller-center

**Fecha:** 2026-05-16
**Estado:** completado — solo auditoría, sin modificaciones

Auditadas `index.html` (705 lineas, fetch read-only, paleta Sporting) y `maqueta-seller-center.html` (1288 lineas, UI puro, paleta clara distinta). Conclusiones: `index.html` apta para 6H; `maqueta-seller-center.html` excluida definitivamente por ser otra plataforma con otro sistema visual.

## Etapa 6H: tokens.css en internal/seller-center/index.html

**Fecha:** 2026-05-16
**Estado:** implementado — pendiente smoke test manual

Objetivo: extender `tokens.css` a `internal/seller-center/index.html`. Documentar exclusion definitiva de `maqueta-seller-center.html`.

Acciones realizadas:
- Agregado `<link rel="stylesheet" href="../../assets/css/tokens.css">` en `<head>` de `internal/seller-center/index.html` (linea 10-11), antes del `<style>`.
- El `:root` inline (linea 13) fue conservado sin modificacion.
- `maqueta-seller-center.html` no fue modificada — excluida por diseño.
- Ningun otro HTML, JS, formulario, simulador ni pagina critica fue modificado.

Etapa 6I: smoke test ejecutado el 2026-05-16 en entorno local. Resultado: OK. Ver `docs/test-matrix.md — Etapa 6H/6I` para detalle completo.

Estado final del grupo `internal/seller-center/`: `index.html` validada con `tokens.css`. `maqueta-seller-center.html` excluida definitivamente por ser otra plataforma con otro sistema visual.

Pendiente:
- Validacion en produccion (GitHub Pages) despues del proximo push.

## Etapa 6J: auditoria grupo internal/backlog

**Fecha:** 2026-05-16
**Estado:** completado — solo auditoria, sin modificaciones

Auditadas `backlog-sellers.html` (1002 lineas, fetch read-only, colisiones efectivas = 0) y `gestion-sellers.html` (232 lineas, Apps Script POST + localStorage, 5 colisiones con valores distintos pero inline siempre prevalece). Ambas aptas para 6K. CSS y JS son capas independientes — agregar `<link>` no afecta ninguna operacion funcional.

## Etapa 6K: tokens.css en grupo internal/backlog

**Fecha:** 2026-05-16
**Estado:** implementado — pendiente smoke test manual

Objetivo: extender `tokens.css` a las 2 paginas del grupo `internal/backlog/`, completando la cobertura de grupos internos del proyecto.

Acciones realizadas:
- Agregado `<link rel="stylesheet" href="../../assets/css/tokens.css">` en `<head>` de:
  - `internal/backlog/backlog-sellers.html` (linea 10-11, antes del `<style>`, sin indent)
  - `internal/backlog/gestion-sellers.html` (linea 11-12, despues de `config.js` y antes del `<style>`, 2 espacios)
- El `:root` inline de cada pagina fue conservado sin modificacion.
- Ningun bloque `<script>`, `config.js`, Apps Script, localStorage ni submit fue modificado.

Etapa 6L: smoke test ejecutado el 2026-05-16 en entorno local. Resultado: OK en ambas paginas. Ver `docs/test-matrix.md — Etapa 6K/6L` para detalle completo.

Estado final del grupo `internal/backlog/`: **ambas paginas validadas con `tokens.css`**. JS, Apps Script, localStorage y submit sin tocar.

Pendiente:
- Validacion en produccion (GitHub Pages) despues del proximo push.

## Etapa 6M: cierre documental de Etapa 6

**Fecha:** 2026-05-16
**Estado:** cerrado

La Etapa 6 queda cerrada para paginas internas. Se extendio `assets/css/tokens.css` a 8 paginas internas en 3 grupos, con smoke test OK en todos. La maqueta Seller Center fue excluida definitivamente por ser otra plataforma. Las paginas publicas fueron diferidas.

### Resumen de alcance cerrado

| Grupo | Paginas | Etapas | Estado |
|---|---|---|---|
| `internal/estrategia/` | 5 | 6C–6F | ✅ validado |
| `internal/seller-center/` | 1 (+ 1 excluida) | 6G–6I | ✅ validado |
| `internal/backlog/` | 2 | 6J–6L | ✅ validado |

### Exclusiones

- `maqueta-seller-center.html` — excluida por diseño (otra plataforma, paleta clara).
- Paginas publicas (`formularios/`, `presentaciones/`, `simuladores/`) — diferidas. Requieren auditoria propia antes de cualquier cambio.

### Invariantes respetados en toda la Etapa 6

JS, Apps Script, endpoints, submit, localStorage, formularios, simuladores, legacy y redirects no fueron modificados en ninguna sub-etapa.

## Etapa 7: legacy y redirects

Objetivo: cerrar la migracion sin romper referencias existentes.

Incluye:

- convertir archivos versionados en aliases o redirects;
- mover versiones historicas a `legacy/`;
- documentar URLs finales;
- actualizar changelog y release notes.

## Etapa 7A: auditoria legacy

Estado: completada en modo solo lectura.

Resultado:

- se inventariaron HTML en raiz, `internal/` y `public/`;
- se identificaron equivalencias entre archivos versionados de raiz y rutas nuevas;
- se confirmo que `legacy/root-html-v1/` sigue vacio salvo `.gitkeep`;
- se recomendo conservar todos los HTML versionados en raiz hasta validar aliases;
- se recomendo iniciar con un piloto de bajo riesgo en una pagina informativa.

## Etapa 7B/7C: matriz inicial de aliases y piloto Governance

Estado: implementado parcialmente.

Objetivo: documentar la matriz inicial de aliases legacy y validar un primer alias seguro antes de avanzar sobre archivos de mayor riesgo.

Alias piloto implementado:

| Origen legacy | Destino nuevo | Estado | Riesgo | Observaciones |
|---|---|---|---|---|
| `governance_v3.html` | `internal/estrategia/governance.html` | Piloto implementado | Bajo | Alias estatico con meta refresh, JavaScript y preservacion de query/hash. |

Matriz inicial pendiente:

| Origen legacy | Destino nuevo | Estado recomendado | Riesgo |
|---|---|---|---|
| `proceso-onboarding_v4.html` | `internal/estrategia/proceso-onboarding.html` | Alias implementado en 7D | Bajo |
| `modelo-integracion_v5.html` | `internal/estrategia/modelo-integracion.html` | Alias implementado en 7D | Bajo |
| `modelo-economico_v2.html` | `internal/estrategia/modelo-economico.html` | Alias implementado en 7D | Bajo/Medio |
| `proyecto-marketplace_v3.html` | `internal/estrategia/proyecto-marketplace.html` | Alias implementado en 7D | Bajo/Medio |
| `seller-center_v2.html` | `internal/seller-center/index.html` | Alias implementado en 7E | Medio |
| `maqueta-seller-center_v2.html` | `internal/seller-center/maqueta-seller-center.html` | Alias implementado en 7F | Medio |
| `gantt-seller-center_v2.html` | `internal/gantt/gantt-seller-center.html` | Alias implementado en 7E | Medio |
| `gantt-operativo_v18.html` | `internal/gantt/gantt-operativo.html` | Alias implementado en 7E | Alto |
| `backlog-sellers_v27.html` | `internal/backlog/backlog-sellers.html` | Alias implementado en 7F | Alto |
| `gestion-sellers_v7.html` | `internal/backlog/gestion-sellers.html` | Alias implementado en 7F | Critico |
| `simulador-economico_v4.html` | `internal/simuladores/simulador-economico.html` | Alias implementado en 7F | Alto |
| `presentacion-seller_v3.html` | `public/presentaciones/presentacion-seller.html` | Alias implementado en 7F | Medio/Alto |
| `simulador-seller_v12.html` | `public/simuladores/simulador-seller.html` | Alias implementado en 7F | Alto |
| `formulario-calificacion_v2.html` | `public/formularios/formulario-calificacion.html` | Alias implementado en 7F | Critico |
| `formulario-relevamiento_v2.html` | `public/formularios/formulario-relevamiento.html` | Alias implementado en 7F | Critico |
| `sporting-marketplace_hub_v29.html` | `index.html` o legacy historico | Pendiente / decision requerida | Alto |

Exclusiones de esta etapa:

- no se movieron archivos a `legacy/`;
- no se tocaron formularios, simuladores, Backlog, Gestion de Sellers, Apps Script, `config.js`, `assets/js/config.js` ni `sporting-marketplace_hub_v29.html`;
- no se convirtio ningun otro HTML legacy en alias.

Smoke test requerido:

- abrir `governance_v3.html`;
- confirmar redireccion a `internal/estrategia/governance.html`;
- abrir `governance_v3.html?test=1#riesgo` y confirmar preservacion de query/hash;
- confirmar que no hay 404 ni errores de consola;
- confirmar que el enlace manual resuelve al mismo destino.

## Etapa 7D: aliases legacy para paginas informativas de estrategia

Estado: implementado, pendiente smoke test manual.

Objetivo: extender el patron validado en el piloto Governance al resto de paginas informativas de `internal/estrategia/`, sin tocar paginas criticas ni mover archivos a `legacy/`.

Aliases implementados:

| Origen legacy | Destino nuevo | Estado | Riesgo |
|---|---|---|---|
| `proceso-onboarding_v4.html` | `internal/estrategia/proceso-onboarding.html` | Implementado | Bajo |
| `modelo-integracion_v5.html` | `internal/estrategia/modelo-integracion.html` | Implementado | Bajo |
| `modelo-economico_v2.html` | `internal/estrategia/modelo-economico.html` | Implementado | Bajo/Medio |
| `proyecto-marketplace_v3.html` | `internal/estrategia/proyecto-marketplace.html` | Implementado | Bajo/Medio |

Alcance excluido:

- `governance_v3.html` no fue modificado en esta etapa;
- no se movieron archivos a `legacy/`;
- no se tocaron paginas nuevas en `internal/`;
- no se tocaron formularios, simuladores, Backlog, Gestion de Sellers, Seller Center, Apps Script, `config.js`, `assets/js/config.js`, CSS compartido ni `sporting-marketplace_hub_v29.html`.

Smoke test requerido:

- abrir cada archivo legacy convertido en alias;
- confirmar redireccion a su ruta nueva;
- abrir cada alias con `?test=1#riesgo` y confirmar preservacion de query/hash;
- confirmar que no hay 404 ni errores de consola;
- confirmar que el enlace manual apunta al destino correcto.

## Etapa 7F: aliases legacy restantes con ruta nueva validada

Estado: implementado, pendiente smoke test manual completo.

Objetivo: convertir en aliases seguros todos los HTML versionados restantes que ya tienen destino migrado en `internal/` o `public/`, preservando query string y hash. Esta etapa no mueve archivos a `legacy/` ni toca la logica funcional de las paginas destino.

Aliases implementados:

| Origen legacy | Destino nuevo | Estado | Riesgo |
|---|---|---|---|
| `backlog-sellers_v27.html` | `internal/backlog/backlog-sellers.html` | Implementado | Alto |
| `gestion-sellers_v7.html` | `internal/backlog/gestion-sellers.html` | Implementado | Critico |
| `simulador-economico_v4.html` | `internal/simuladores/simulador-economico.html` | Implementado | Alto |
| `maqueta-seller-center_v2.html` | `internal/seller-center/maqueta-seller-center.html` | Implementado | Medio |
| `presentacion-seller_v3.html` | `public/presentaciones/presentacion-seller.html` | Implementado | Medio/Alto |
| `simulador-seller_v12.html` | `public/simuladores/simulador-seller.html` | Implementado | Alto |
| `formulario-calificacion_v2.html` | `public/formularios/formulario-calificacion.html` | Implementado | Critico |
| `formulario-relevamiento_v2.html` | `public/formularios/formulario-relevamiento.html` | Implementado | Critico |

Pendiente:

- `sporting-marketplace_hub_v29.html` queda intacto y pendiente de decision especifica.

Alcance excluido:

- no se movieron archivos a `legacy/`;
- no se tocaron `index.html`, paginas nuevas en `internal/`, paginas nuevas en `public/`, Apps Script, `config.js`, `assets/js/config.js`, `assets/css/tokens.css`, endpoints, payloads, submit, `localStorage`, assets de logos, `Logos/` ni `legacy/`;
- no se modifico `sporting-marketplace_hub_v29.html`.

Smoke test requerido:

- abrir cada archivo legacy convertido en alias;
- confirmar redireccion a su ruta nueva;
- abrir paginas publicas con `?seller_id=SPT-001` y confirmar preservacion del parametro;
- abrir cada alias con `?test=1#riesgo` y confirmar preservacion de query/hash;
- confirmar que no hay 404 ni errores de consola;
- no ejecutar submit real en Gestion ni formularios durante la validacion.

## Etapa 7E: aliases legacy para paginas internas de riesgo medio

Estado: implementado, pendiente smoke test manual.

Objetivo: extender el patron de alias seguro a paginas internas ya migradas de riesgo medio, sin tocar paginas operativas criticas ni archivos nuevos.

Aliases implementados:

| Origen legacy | Destino nuevo | Estado | Riesgo |
|---|---|---|---|
| `seller-center_v2.html` | `internal/seller-center/index.html` | Implementado | Medio |
| `gantt-seller-center_v2.html` | `internal/gantt/gantt-seller-center.html` | Implementado | Medio |
| `gantt-operativo_v18.html` | `internal/gantt/gantt-operativo.html` | Implementado | Alto |

Alcance excluido:

- no se movieron archivos a `legacy/`;
- no se tocaron paginas nuevas en `internal/`;
- no se tocaron Backlog, Gestion de Sellers, formularios, simuladores, paginas publicas, Apps Script, `config.js`, `assets/js/config.js`, CSS compartido ni `sporting-marketplace_hub_v29.html`;
- `maqueta-seller-center_v2.html` queda pendiente por su exclusion visual/documental previa.

Smoke test requerido:

- abrir cada archivo legacy convertido en alias;
- confirmar redireccion a su ruta nueva;
- abrir cada alias con `?test=1#riesgo` y confirmar preservacion de query/hash;
- confirmar que no hay 404 ni errores de consola;
- confirmar que el enlace manual apunta al destino correcto.

## Etapa 7G: cierre documental de Etapa 7

Estado: cerrada en modo aliases, con smoke test manual completo OK.

Objetivo: cerrar la migracion legacy sin mover ni eliminar archivos, manteniendo compatibilidad de URLs versionadas mediante aliases estaticos hacia las rutas nuevas.

Resultado consolidado:

- todos los HTML versionados migrados tienen alias hacia su ruta nueva;
- cada alias usa `meta refresh` como fallback y JavaScript con `window.location.replace()`;
- los aliases preservan `location.search` y `location.hash`;
- los aliases publicos preservan `seller_id` y cualquier parametro futuro;
- `sporting-marketplace_hub_v29.html` queda intacto como referencia temporal y unica decision pendiente;
- no se movio ningun archivo a `legacy/`;
- no se elimino ningun archivo;
- no se modificaron paginas nuevas, CSS compartido, JS funcional, Apps Script, endpoints, payloads, submit, `localStorage`, `config.js`, `assets/js/config.js`, assets ni logos.

Estado final de aliases:

| Grupo | Archivos | Estado |
|---|---:|---|
| Estrategia | 5 | Aliases implementados |
| Seller Center / Gantt | 3 | Aliases implementados |
| Operativas internas y publicas | 8 | Aliases implementados |
| Hub legacy versionado | 1 | Intacto / pendiente |

Validacion 7H:

- smoke test manual completo de aliases 7C a 7F ejecutado con resultado OK;
- aliases redirigen a rutas nuevas correctas;
- query string y hash se preservan;
- paginas publicas conservan `seller_id=SPT-001`;
- no hay 404 criticos;
- no se ejecuto submit real en Gestion de Sellers ni formularios;
- `sporting-marketplace_hub_v29.html` sigue intacto.

Pendientes para release V1:

- decidir en etapa separada si `sporting-marketplace_hub_v29.html` se conserva como referencia permanente, se convierte en alias o se mueve a `legacy/` en una V2;
- preparar release notes V1 con alcance cerrado y riesgos residuales.

Estado V1:

- V1 queda lista para preparar release notes.
- No se recomienda iniciar limpieza de `legacy/`, extraccion de JS/CSS adicional ni cambios funcionales antes del cierre V1.
