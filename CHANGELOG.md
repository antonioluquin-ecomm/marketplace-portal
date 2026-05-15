# Changelog

Todos los cambios relevantes del proyecto Marketplace Portal deben documentarse en este archivo.

El formato recomendado es mantener entradas por fecha o version, indicando alcance, tipo de cambio, archivos afectados, validaciones realizadas y riesgos conocidos.

## 2026-05-15 - Etapa 5A auditoria y estrategia de assets compartidos

Tipo de cambio: documental.

Estado: estrategia preparada sin refactor.

Cambios incluidos:

- Creacion de `docs/assets-strategy.md`.
- Auditoria documental de repeticion de topbars, sidebars, tokens visuales, botones, cards, KPIs, tablas, modales, filtros, helpers CSV, helpers de `seller_id`, logica de logos, navegacion y rutas.
- Documentacion del estado actual de `Logos/`, `assets/logos/`, `config.js` y `assets/js/config.js`.
- Propuesta de estructura futura para CSS compartido, JS modular y assets.
- Roadmap incremental recomendado para Etapas 5B, 5C, 5D, 5E, 5F, 5G y 5H.
- Identificacion de paginas candidatas para piloto y paginas que no conviene tocar todavia.
- Actualizacion de `docs/roadmap.md`.

Alcance explicitamente excluido:

- Sin modificaciones en paginas HTML.
- Sin extraccion de CSS.
- Sin extraccion de JavaScript.
- Sin cambios de diseno.
- Sin cambios de logica.
- Sin movimiento de archivos legacy.
- Sin redirects.
- Sin modificaciones en Apps Script.
- Sin cambios de endpoints o payloads.

Validacion:

- Se relevaron patrones repetidos en HTML/JS y estado de carpetas `assets/` y `Logos/`.
- La etapa queda lista para una 5B de copia segura de logos, si se aprueba.

## 2026-05-15 - Etapa 4.5 preparacion de smoke test manual

Tipo de cambio: documental.

Estado: checklist y matriz de smoke test preparados.

Cambios incluidos:

- Actualizacion de `docs/test-matrix.md` como matriz operativa para validar rutas migradas en `/internal/` y `/public/`.
- Incorporacion de rutas internas, rutas publicas, rutas con `seller_id=SPT-001` y rutas sin `seller_id`.
- Definicion de columnas para objetivo de prueba, validaciones visuales, validaciones funcionales, dependencias, consola, resultado esperado, resultado real, estado y observaciones.
- Incorporacion de checklists especificos para navegacion, datos, formularios y consola.
- Documentacion de riesgos conocidos: `pctSec`, `articulos-seller.docx`, escritura real de formularios, legacy duplicado, CSS/JS inline y redirects pendientes.
- Actualizacion de roadmap para reflejar la preparacion documental del smoke test manual.

Alcance explicitamente excluido:

- Sin cambios en paginas HTML.
- Sin cambios de logica funcional.
- Sin movimiento ni eliminacion de archivos.
- Sin modificaciones en Apps Script.
- Sin cambios de endpoints, payloads o submits.
- Sin ejecucion de submit real.
- Sin redirects.
- Sin limpieza legacy.
- Sin extraccion de CSS o JavaScript.

Validacion:

- La etapa queda preparada para ejecucion manual posterior.
- Los resultados reales quedan pendientes hasta ejecutar el smoke test en navegador.

## 2026-05-15 - Etapa 4.4B migracion Formulario de Relevamiento

Tipo de cambio: estructural.

Estado: migracion controlada completada sin submit real.

Cambios incluidos:

- Copia de `formulario-relevamiento_v2.html` hacia `public/formularios/formulario-relevamiento.html`.
- Actualizacion de `index.html` para enlazar preferentemente a la nueva ruta publica.
- Validacion estatica de preservacion de endpoint, CSV, `tipo_formulario`, submit, `seller_id`, logo, personalizacion y secciones condicionales.
- Documentacion del riesgo pendiente `pctSec` en `updateProgress`.
- Actualizacion de roadmap y mapa del hub.

Alcance explicitamente excluido:

- Sin movimiento ni eliminacion del archivo original.
- Sin modificaciones en formulario de calificacion.
- Sin modificaciones en simuladores.
- Sin modificaciones en Presentacion Seller.
- Sin modificaciones en gestion de sellers.
- Sin modificaciones en Apps Script.
- Sin cambios en `APPS_SCRIPT_URL`, `SELLERS_CSV_URL`, payload, `tipo_formulario`, validaciones, logica condicional, `seller_id`, logo, personalizacion ni submit.
- Sin correccion del posible error `pctSec`.
- Sin extraccion de CSS o JavaScript.
- Sin redirects desde archivos versionados en raiz.
- Sin ejecucion de submit real.

Riesgo pendiente:

- `updateProgress` contiene una referencia a `pctSec` antes de su declaracion. Debe validarse en smoke test manual y corregirse en una etapa separada si se reproduce el error.

Validacion:

- Se confirmo que la copia existe y carga como HTML.
- Se confirmo que el original sigue existiendo en raiz.
- Se confirmo que `APPS_SCRIPT_URL`, `SELLERS_CSV_URL`, `tipo_formulario: "relevamiento"`, fetch POST, `res.json()` y validacion de `json.status` siguen presentes.

## 2026-05-15 - Etapa 4.3B migracion Formulario de Calificacion

Tipo de cambio: estructural.

Estado: migracion controlada completada sin submit real.

Cambios incluidos:

- Copia de `formulario-calificacion_v2.html` hacia `public/formularios/formulario-calificacion.html`.
- Actualizacion de `index.html` para enlazar preferentemente a la nueva ruta publica.
- Validacion estatica de preservacion de endpoint, CSV, `tipo_formulario`, submit, `seller_id`, logo y personalizacion.
- Actualizacion de roadmap y mapa del hub.

Alcance explicitamente excluido:

- Sin movimiento ni eliminacion del archivo original.
- Sin modificaciones en formulario de relevamiento.
- Sin modificaciones en simuladores.
- Sin modificaciones en Presentacion Seller.
- Sin modificaciones en gestion de sellers.
- Sin modificaciones en Apps Script.
- Sin cambios en `ENDPOINT_URL`, `SELLERS_CSV_URL`, payload, `tipo_formulario`, validaciones, `seller_id`, logo, personalizacion ni submit.
- Sin extraccion de CSS o JavaScript.
- Sin redirects desde archivos versionados en raiz.
- Sin ejecucion de submit real.

Validacion:

- Se confirmo que la copia existe y carga como HTML.
- Se confirmo que el original sigue existiendo en raiz.
- Se confirmo que `ENDPOINT_URL`, `SELLERS_CSV_URL`, `tipo_formulario: "calificacion"`, fetch POST, `res.json()` y `json.status === "ok"` siguen presentes.

## 2026-05-15 - Etapa 4.2 migracion Simulador Seller publico

Tipo de cambio: estructural.

Estado: migracion controlada completada.

Cambios incluidos:

- Copia de `simulador-seller_v12.html` hacia `public/simuladores/simulador-seller.html`.
- Actualizacion de `index.html` para enlazar preferentemente a la nueva ruta publica.
- Validacion de preservacion de `seller_id`, logos, CTA, calculos, tarifas y overrides.
- Actualizacion de roadmap y mapa del hub.

Alcance explicitamente excluido:

- Sin movimiento ni eliminacion del archivo original.
- Sin modificaciones en formularios.
- Sin modificaciones en Presentacion Seller.
- Sin modificaciones en simulador economico interno.
- Sin modificaciones en gestion de sellers.
- Sin modificaciones en Apps Script.
- Sin cambios en logica economica, formulas, query params, seller_id, CTA, tarifas, overrides ni personalizacion.
- Sin extraccion de CSS o JavaScript.
- Sin redirects desde archivos versionados en raiz.

Validacion:

- Se confirmo que la copia existe y carga como HTML.
- Se confirmo que el original sigue existiendo en raiz.
- Se confirmo que `seller_id`, `URLSearchParams`, logica de logo, CTA, calculos, tarifas y overrides siguen presentes.

## 2026-05-15 - Etapa 4.1 migracion Presentacion Seller

Tipo de cambio: estructural.

Estado: migracion controlada completada.

Cambios incluidos:

- Copia de `presentacion-seller_v3.html` hacia `public/presentaciones/presentacion-seller.html`.
- Actualizacion de `index.html` para enlazar preferentemente a la nueva ruta publica.
- Validacion de preservacion de `seller_id`, logos, CTA y personalizacion.
- Actualizacion de roadmap y mapa del hub.

Alcance explicitamente excluido:

- Sin movimiento ni eliminacion del archivo original.
- Sin modificaciones en formularios.
- Sin modificaciones en simulador seller.
- Sin modificaciones en simulador economico interno.
- Sin modificaciones en gestion de sellers.
- Sin modificaciones en Apps Script.
- Sin cambios en query params, CTA, logos ni personalizacion por seller.
- Sin extraccion de CSS o JavaScript.
- Sin redirects desde archivos versionados en raiz.

Validacion:

- Se confirmo que la copia existe y carga como HTML.
- Se confirmo que el original sigue existiendo en raiz.
- Se confirmo que `seller_id`, `URLSearchParams`, logica de logo y CTA siguen presentes.

## 2026-05-15 - Etapa 3.9 migracion Simulador Economico interno

Tipo de cambio: estructural.

Estado: migracion controlada completada.

Cambios incluidos:

- Copia de `simulador-economico_v4.html` hacia `internal/simuladores/simulador-economico.html`.
- Actualizacion de `index.html` para enlazar preferentemente a la nueva ruta.
- Actualizacion de `modelo-economico.html` para enlazar a la nueva ruta.
- Actualizacion de roadmap y mapa del hub.

Alcance explicitamente excluido:

- Sin movimiento ni eliminacion del archivo original.
- Sin modificaciones en formularios.
- Sin modificaciones en simulador seller publico.
- Sin modificaciones en gestion de sellers.
- Sin modificaciones en Apps Script.
- Sin cambios en logica economica, formulas, tarifas, comisiones, overrides, escenarios ni inputs.
- Sin cambios de endpoints o CSV.
- Sin extraccion de CSS o JavaScript.
- Sin redirects desde archivos versionados en raiz.

Validacion:

- Se confirmo que la copia existe y carga como HTML.
- Se confirmo que el original sigue existiendo en raiz.
- Se confirmo que las dependencias de Sheets/config se preservan.
- Se confirmo que funciones de calculo y render de escenarios siguen presentes.

## 2026-05-15 - Etapa 3.8B config central y Gestion de Sellers

Tipo de cambio: estructural.

Estado: migracion controlada completada sin submit real.

Cambios incluidos:

- Copia de `config.js` hacia `assets/js/config.js`.
- Copia de `gestion-sellers_v7.html` hacia `internal/backlog/gestion-sellers.html`.
- Actualizacion de `index.html` para enlazar preferentemente a la nueva ruta.
- Validacion estatica de dependencias criticas sin ejecutar submit.
- Actualizacion de roadmap y mapa del hub.

Alcance explicitamente excluido:

- Sin movimiento ni eliminacion de archivos originales.
- Sin modificaciones en Apps Script.
- Sin cambios de endpoint.
- Sin cambios de payload.
- Sin cambios en generacion o reserva de `seller_id`.
- Sin cambios en `localStorage`.
- Sin cambios de validaciones.
- Sin cambios de diseno.
- Sin extraccion de CSS o JavaScript.
- Sin redirects desde archivos versionados en raiz.
- Sin prueba de submit real.

Validacion:

- Se confirmo que `assets/js/config.js` existe.
- Se confirmo que `config.js` original sigue existiendo en raiz.
- Se confirmo que `internal/backlog/gestion-sellers.html` existe y carga como HTML.
- Se confirmo que la ruta `../../assets/js/config.js` resuelve desde la nueva pagina.
- Se confirmo que Apps Script URL, CSV sellers, `tipo_formulario: "seller"`, `localStorage` y generacion de `seller_id` siguen presentes.

## 2026-05-15 - Etapa 3.6 migracion Backlog de Sellers

Tipo de cambio: estructural.

Estado: migracion segura completada.

Cambios incluidos:

- Copia de `backlog-sellers_v27.html` hacia `internal/backlog/backlog-sellers.html`.
- Actualizacion de `index.html` para enlazar preferentemente a la nueva ruta.
- Actualizacion de enlaces desde paginas internas ya migradas hacia la nueva ruta.
- Conservacion de links hacia formularios, simuladores y gestion de sellers en raiz cuando aun no fueron migrados.
- Actualizacion de roadmap y mapa del hub.

Alcance explicitamente excluido:

- Sin movimiento ni eliminacion del archivo original.
- Sin modificaciones en formularios.
- Sin modificaciones en simuladores.
- Sin modificaciones en gestion de sellers.
- Sin modificaciones en Apps Script.
- Sin cambios en endpoints, CSV, renderizado, cards, tabla, filtros ni modal.
- Sin cambios de logica funcional.
- Sin extraccion de CSS o JavaScript.
- Sin redirects desde archivos versionados en raiz.

Validacion:

- Se confirmo que la copia existe y carga como HTML.
- Se confirmo que el original sigue existiendo en raiz.
- Se confirmo que las URLs CSV se mantienen iguales.
- Se confirmo que la logica de logos se mantiene presente.
- Se confirmo que cards, tabla y modal siguen presentes en el HTML/JS.

## 2026-05-15 - Etapa 3.5 migracion Gantt Operativo

Tipo de cambio: estructural.

Estado: migracion segura completada.

Cambios incluidos:

- Copia de `gantt-operativo_v18.html` hacia `internal/gantt/gantt-operativo.html`.
- Actualizacion de `index.html` para enlazar preferentemente a la nueva ruta.
- Actualizacion de enlaces desde paginas internas ya migradas hacia la nueva ruta.
- Conservacion de links hacia backlog en raiz porque aun no fue migrado.
- Actualizacion de roadmap y mapa del hub.

Alcance explicitamente excluido:

- Sin movimiento ni eliminacion del archivo original.
- Sin modificaciones en backlog.
- Sin modificaciones en formularios.
- Sin modificaciones en simuladores.
- Sin modificaciones en gestion de sellers.
- Sin modificaciones en Apps Script.
- Sin cambios de logica funcional.
- Sin extraccion de CSS o JavaScript.
- Sin redirects desde archivos versionados en raiz.

Validacion:

- Se confirmo que la copia existe y carga como HTML.
- Se confirmo que el original sigue existiendo en raiz.
- Se confirmo que las dependencias CSV publicadas se mantienen iguales.
- Se confirmo que los links locales ajustados resuelven.

## 2026-05-15 - Etapa 3.4 migracion Gantt Seller Center

Tipo de cambio: estructural.

Estado: migracion segura completada.

Cambios incluidos:

- Copia de `gantt-seller-center_v2.html` hacia `internal/gantt/gantt-seller-center.html`.
- Actualizacion de `index.html` para enlazar preferentemente a la nueva ruta.
- Actualizacion de enlaces desde Seller Center y Proyecto Marketplace migrados hacia la nueva ruta.
- Actualizacion de roadmap y mapa del hub.

Alcance explicitamente excluido:

- Sin movimiento ni eliminacion del archivo original.
- Sin modificaciones en backlog.
- Sin modificaciones en Gantt Operativo.
- Sin modificaciones en formularios.
- Sin modificaciones en simuladores.
- Sin modificaciones en gestion de sellers.
- Sin modificaciones en Apps Script.
- Sin cambios de logica funcional.
- Sin extraccion de CSS o JavaScript.
- Sin redirects desde archivos versionados en raiz.

Validacion:

- Se confirmo que la copia existe y carga como HTML.
- Se confirmo que el original sigue existiendo en raiz.
- Se confirmo que la dependencia CSV publicada se mantiene igual.
- Se confirmo que los links locales ajustados resuelven.

## 2026-05-15 - Etapa 3.2 migracion Maqueta Seller Center

Tipo de cambio: estructural.

Estado: migracion segura completada.

Cambios incluidos:

- Copia de `maqueta-seller-center_v2.html` hacia `internal/seller-center/maqueta-seller-center.html`.
- Ajuste minimo de navegacion en la copia nueva.
- Actualizacion de `internal/seller-center/index.html` para enlazar a la maqueta migrada.
- Actualizacion de `index.html`, roadmap y mapa del hub.

Alcance explicitamente excluido:

- Sin movimiento ni eliminacion del archivo original.
- Sin modificaciones en backlog.
- Sin modificaciones en Gantt.
- Sin modificaciones en formularios.
- Sin modificaciones en simuladores.
- Sin modificaciones en Apps Script.
- Sin cambios de logica funcional.
- Sin extraccion de CSS o JavaScript.
- Sin redirects desde archivos versionados en raiz.

Validacion:

- Se confirmo que la copia existe y carga como HTML.
- Se confirmo que el original sigue existiendo en raiz.
- Se confirmo que los links locales ajustados resuelven.

## 2026-05-15 - Etapa 3.1 navegacion interna en copias

Tipo de cambio: estructural.

Estado: ajuste minimo completado sobre copias internas.

Cambios incluidos:

- Ajuste de links entre paginas ya copiadas a `internal/estrategia/` y `internal/seller-center/`.
- Correccion de links en copias internas que apuntaban a rutas futuras aun vacias.
- Conservacion de links hacia paginas no migradas apuntando a archivos versionados de raiz.
- Actualizacion de `index.html`, roadmap y mapa del hub.

Alcance explicitamente excluido:

- Sin cambios en archivos originales de raiz.
- Sin movimiento ni eliminacion de archivos.
- Sin modificaciones en formularios.
- Sin modificaciones en simuladores.
- Sin modificaciones en backlog.
- Sin modificaciones en Gantt.
- Sin modificaciones en Apps Script.
- Sin cambios de diseno ni logica funcional.
- Sin extraccion de CSS o JavaScript.

Validacion:

- Se confirmo que los links locales de las copias internas resuelven a archivos existentes, salvo dependencias heredadas no presentes en el repositorio.
- Se confirmo que las paginas no migradas siguen enlazadas hacia sus archivos versionados de raiz.

## 2026-05-15 - Etapa 3 migracion interna informativa

Tipo de cambio: estructural/documental.

Estado: migracion parcial segura completada para paginas internas informativas.

Cambios incluidos:

- Copia de paginas internas informativas desde la raiz hacia `internal/estrategia/`.
- Copia de `seller-center_v2.html` hacia `internal/seller-center/index.html`.
- Actualizacion de `index.html` para priorizar las nuevas rutas internas copiadas.
- Actualizacion de mapa del hub y roadmap.

Paginas copiadas:

- `governance_v3.html` -> `internal/estrategia/governance.html`
- `proceso-onboarding_v4.html` -> `internal/estrategia/proceso-onboarding.html`
- `modelo-integracion_v5.html` -> `internal/estrategia/modelo-integracion.html`
- `modelo-economico_v2.html` -> `internal/estrategia/modelo-economico.html`
- `proyecto-marketplace_v3.html` -> `internal/estrategia/proyecto-marketplace.html`
- `seller-center_v2.html` -> `internal/seller-center/index.html`

Alcance explicitamente excluido:

- Sin movimiento ni eliminacion de archivos originales.
- Sin modificaciones en formularios.
- Sin modificaciones en simuladores.
- Sin modificaciones en backlog.
- Sin modificaciones en Gantt.
- Sin modificaciones en Apps Script.
- Sin cambios de logica funcional.
- Sin extraccion de CSS o JavaScript.
- Sin redirects desde archivos versionados en raiz.

Validacion:

- Se confirmo que cada archivo nuevo existe.
- Se confirmo que cada archivo original sigue existiendo en raiz.
- Se confirmo que los links actualizados en `index.html` apuntan a archivos existentes.

## 2026-05-15 - Etapa 2 index oficial

Tipo de cambio: estructural/documental.

Estado: entrada institucional creada.

Cambios incluidos:

- Creacion de `index.html` oficial en la raiz del proyecto.
- Enlaces desde `index.html` hacia paginas actuales existentes en la raiz.
- Separacion visual entre acceso interno, acceso publico/sellers y documentacion.
- Aviso visible de transicion estructural.
- Actualizacion de roadmap y mapa del hub.

Alcance explicitamente excluido:

- Sin modificaciones en `sporting-marketplace_hub_v29.html`.
- Sin movimiento de archivos HTML existentes.
- Sin eliminacion de archivos.
- Sin cambios funcionales.
- Sin cambios visuales en paginas existentes.
- Sin cambios de rutas actuales.
- Sin modificaciones en formularios, simuladores ni Apps Script.
- Sin extraccion de CSS o JavaScript compartido.
- Sin redirects ni reemplazo de paginas actuales.

Validacion:

- `index.html` fue creado como pagina estatica autocontenida.
- Los links apuntan a archivos actuales en raiz y documentacion existente.
- La migracion hacia `/internal` y `/public` queda pendiente para etapas futuras.

## 2026-05-15 - Etapa 1 estructura base

Tipo de cambio: estructural/documental.

Estado: estructura fisica base creada.

Cambios incluidos:

- Creacion de carpetas base `assets/`, `internal/`, `public/`, `integrations/`, `data/` y `legacy/`.
- Creacion de subcarpetas previstas para CSS, JS, componentes, datos, paginas, logos, imagenes, paginas internas, paginas publicas, integraciones y legacy.
- Agregado de archivos `.gitkeep` para registrar carpetas vacias en Git.
- Actualizacion documental para indicar que la estructura existe fisicamente.

Alcance explicitamente excluido:

- Sin movimiento de archivos HTML existentes.
- Sin eliminacion de archivos.
- Sin cambios funcionales.
- Sin cambios visuales.
- Sin cambios de rutas actuales.
- Sin modificaciones en formularios, simuladores ni Apps Script.
- Sin redirects ni aliases para archivos versionados.

Validacion:

- Se verifico que el repositorio estaba limpio antes de iniciar.
- Se confirmo que los cambios corresponden a carpetas, `.gitkeep` y documentacion.

## 2026-05-15 - Etapa 0 documental

Tipo de cambio: documentacion.

Estado: base inicial creada.

Cambios incluidos:

- Creacion del README principal del proyecto.
- Creacion de documentacion de arquitectura futura.
- Creacion del inventario inicial del hub y rutas sugeridas.
- Creacion del roadmap incremental de migracion.
- Creacion de matriz inicial de validacion.
- Creacion de guia para documentar decisiones arquitectonicas futuras.

Alcance explicitamente excluido:

- Sin cambios funcionales.
- Sin cambios visuales.
- Sin cambios de rutas existentes.
- Sin movimiento o eliminacion de archivos HTML.
- Sin modificaciones en formularios, simuladores ni Apps Script.

Validacion:

- Se verifico que el repositorio no tenia cambios previos antes de iniciar.
- Se crearon unicamente archivos documentales nuevos y la carpeta `docs/`.
