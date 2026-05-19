# Changelog

Todos los cambios relevantes del proyecto Marketplace Portal deben documentarse en este archivo.

El formato recomendado es mantener entradas por fecha o version, indicando alcance, tipo de cambio, archivos afectados, validaciones realizadas y riesgos conocidos.

## 2026-05-19 - Etapa 26D cierre bloque visual PRO global

Tipo de cambio: documentacion.

Estado: completado.

Resultado:
- Cerrado el bloque visual PRO global 26A-26C.
- 26A: auditoria visual global PRO del Marketplace Portal.
- 26B: aplicacion de pulido visual global para mejorar consistencia, legibilidad y jerarquia.
- 26C: smoke visual post-push OK.
- Resultado general: portal mas consistente, legible y profesional.
- Decision vigente: no tocar JS critico, submit, payloads, Apps Script, config, formulas, timeline, `seller_id` ni rutas criticas.
- Proximo paso recomendado: avanzar solo con mejoras funcionales concretas o cierre release/post-V1 final.

## 2026-05-19 - Etapa 26B bloque visual PRO global

Tipo de cambio: visual agrupado.

Estado: completado.

Resultado:
- Agregada escala visual global en `tokens.css` para tipografia, espaciados, radios y sombras.
- Ajustados componentes internos y CSS por familia para mejorar legibilidad, jerarquia, aire visual, radios, botones, badges, cards y estados.
- Aplicado pulido visual controlado en portada, Hub Operativo, paginas estrategicas y paginas publicas de presentacion/simulador.
- Conservado inline el CSS sensible ligado a JS, render dinamico, submit, timeline, formulas, payloads, validaciones y `seller_id`.
- Sin cambios en bloques `<script>`, submit, fetch, endpoints, payloads, Apps Script, config, rutas criticas ni logica funcional.

## 2026-05-19 - Etapa 24F cierre CSS publico seller-facing

Tipo de cambio: documentacion.

Estado: completado.

Resultado:
- Cerrado el bloque 24B-24E de CSS publico seller-facing.
- 24B: creado `assets/css/pages/public-seller.css` y aplicado como piloto en `formulario-calificacion`.
- 24C: extendido a `formulario-relevamiento`.
- 24D: extension minima a `presentacion-seller`.
- 24E: extension minima a `simulador-seller`.
- Decision vigente: mantener inline todo CSS sensible asociado a submit, payloads, `seller_id`, validaciones, render dinamico, CTAs, calculos, formulas, resultados, tarifas y overrides.
- Resultado: sistema visual publico seller-facing unificado sin tocar logica funcional.
- Proximo paso recomendado: push y smoke test visual publico; luego entrar solo en mejoras funcionales reales o UI refinements especificos.

## 2026-05-19 - Etapa 24E extension CSS publico a Simulador Seller

Tipo de cambio: visual critico acotado.

Estado: completado.

Resultado:
- Enlazado `assets/css/pages/public-seller.css` en `public/simuladores/simulador-seller.html`, antes del CSS inline.
- Reutilizadas solo reglas publicas compartidas de base global segura (`box-sizing`, reset de margen/padding y scroll suave).
- Conservadas inline las reglas especificas del simulador: topbar, CTAs, hero, seller box, paneles, inputs funcionales, resultados, KPIs, escenarios, tarifas, overrides, estados dinamicos, toasts, disclaimers y responsive propio.
- Sin cambios en bloques `<script>`, JS funcional, calculos, formulas, resultados, tarifas, overrides, `seller_id`, CTAs, rutas, href/src existentes, render dinamico ni `name/id/value`.

## 2026-05-19 - Etapa 24D extension CSS publico a Presentacion Seller

Tipo de cambio: visual controlado.

Estado: completado.

Resultado:
- Enlazado `assets/css/pages/public-seller.css` en `public/presentaciones/presentacion-seller.html`, antes del CSS inline.
- Reutilizadas solo reglas publicas compartidas de base global segura (`box-sizing`, reset de margen/padding y scroll suave).
- Conservadas inline las reglas especificas de presentacion comercial: topbar, CTAs, hero editorial, seller card, logos personalizados, secciones claras/oscuras, cards comerciales, disclaimers, responsive y estados dependientes de personalizacion por seller.
- Sin cambios en bloques `<script>`, `seller_id`, CTAs, rutas, href/src existentes, personalizacion dinamica, render dinamico, `name/id/value` ni JS funcional.

## 2026-05-19 - Etapa 24C extension CSS publico a Relevamiento

Tipo de cambio: visual critico acotado.

Estado: completado.

Resultado:
- Enlazado `assets/css/pages/public-seller.css` solo en `public/formularios/formulario-relevamiento.html`, antes del CSS inline.
- Reutilizadas reglas publicas compartidas existentes para base visual, body/wrap, hero, brand, intro note, badges, seller identity/logo/chip, secciones, field containers, labels visuales, botones y responsive visual basico.
- Conservadas inline las reglas sensibles o acopladas a progreso por secciones, navegacion entre secciones, tooltips, condicionales, `hidden/visible`, estados dinamicos, validaciones, errores, inputs/selects/textarea, radio/checkbox, alertas, status, submit, payload y campos.
- Sin cambios en bloques `<script>`, submit, fetch, `APPS_SCRIPT_URL`, payload, `tipo_formulario`, `seller_id`, validaciones, `name/id/value`, action/method, rutas, href/src existentes ni JS funcional.

## 2026-05-19 - Etapa 24B piloto CSS publico seller-facing

Tipo de cambio: visual critico acotado.

Estado: completado.

Resultado:
- Creado `assets/css/pages/public-seller.css` como hoja publica compartida para paginas seller-facing.
- Enlazado solo en `public/formularios/formulario-calificacion.html`, antes del CSS inline.
- Movidas reglas visuales estaticas de base publica, body/wrap, hero, brand, intro note, badges, seller identity/logo/chip, secciones, field containers, labels visuales, botones, toast y responsive visual basico.
- Conservadas inline las reglas sensibles o acopladas a progreso, result panel, pills calculadas, `hidden/visible`, estados dinamicos, validaciones, errores, status, inputs/selects/textarea, radio/checkbox, submit, payload y campos.
- Sin cambios en bloques `<script>`, submit, fetch, `ENDPOINT_URL`, payload, `tipo_formulario`, `seller_id`, validaciones, `name/id/value`, action/method, rutas, href/src existentes ni JS funcional.

## 2026-05-18 - Etapa 23G cierre CSS por familias internas

Tipo de cambio: documentacion.

Estado: completado.

Resultado:
- Cerrado el bloque 23B-23F de CSS por familias internas.
- 23B: `backlog.css` creado para Backlog Sellers.
- 23C: `gantt.css` creado para Gantt Operativo y Gantt Seller Center.
- 23D: `simuladores.css` creado para Simulador Economico interno.
- 23E: `gestion-sellers.css` creado para Gestion Sellers.
- 23F: `seller-center.css` creado para Seller Center index.
- Decision vigente: mantener inline todo CSS sensible asociado a JS, render dinamico, submit, filtros, timeline, formulas, payloads o estados dinamicos.
- Decision vigente: no tocar `public/` todavia; evaluar CSS publico seller-facing en etapa separada.
- Proximo paso recomendado: push y smoke test visual liviano.

## 2026-05-18 - Etapa 23F CSS familia Seller Center

Tipo de cambio: visual controlado.

Estado: completado.

Resultado:
- Creado `assets/css/pages/seller-center.css` como hoja especifica para la familia Seller Center.
- Enlazado en `internal/seller-center/index.html` despues de `internal-components.css` y antes del CSS inline.
- Movidas reglas visuales estaticas de topbar, shell, sidebar, hero/intro, secciones, herramientas, flujo, alertas visuales, footer y responsive general.
- Conservadas inline las reglas sensibles o acopladas a carga viva, spinner, KPIs, progreso global, modulos renderizados, roadmap dinamico, hitos y estados derivados de CSV/JS.
- Sin cambios en fetch, CSV, render dinamico, roadmap dinamico, JS funcional, rutas, href/src, ids/classes ni maqueta Seller Center.

## 2026-05-18 - Etapa 23E CSS familia Gestion Sellers

Tipo de cambio: visual critico acotado.

Estado: completado.

Resultado:
- Creado `assets/css/pages/gestion-sellers.css` como hoja especifica para gestion/backoffice de sellers.
- Enlazado en `internal/backlog/gestion-sellers.html` despues de `internal-components.css` y antes del CSS inline.
- Movidas reglas visuales estaticas de topbar, hero/intro, paneles estaticos, botones visuales, layout general, acciones y badges.
- Conservadas inline las reglas sensibles o acopladas a formularios, inputs/selects/textarea, preview dinamica, links publicos generados, mensajes, alertas, estados de guardado, toast y submit.
- Sin cambios en JS, submit, fetch, `APPS_SCRIPT_URL`, payload, `tipo_formulario`, `seller_id`, generacion/reserva de IDs, localStorage, `name/id/value/data-*`, rutas, href/src ni config.

## 2026-05-18 - Etapa 23D CSS familia Simuladores internos

Tipo de cambio: visual controlado.

Estado: completado.

Resultado:
- Creado `assets/css/pages/simuladores.css` como hoja especifica para simuladores internos.
- Enlazado en `internal/simuladores/simulador-economico.html` despues de `internal-components.css` y antes del CSS inline.
- Movidas reglas visuales estaticas de topbar, layout de columnas, headers/secciones, contenedor de resultados, estados de tarifas, boton de actualizacion, tabs visuales y disclaimer.
- Conservadas inline las reglas sensibles o acopladas a inputs, toggles de servicios, KPIs/resultados, composicion, breakdown, escenarios, financiacion, tarifas dinamicas y render JS.
- Sin cambios en formulas, calculos, JS, fetch, CSV, CONFIG, DIRECT_CSV_URLS, tarifas, overrides, inputs, render dinamico, rutas, href/src, ids/classes ni config.

## 2026-05-18 - Etapa 23C CSS familia Gantt

Tipo de cambio: visual controlado.

Estado: completado.

Resultado:
- Creado `assets/css/pages/gantt.css` como hoja especifica para paginas Gantt internas.
- Enlazado en `internal/gantt/gantt-operativo.html` y `internal/gantt/gantt-seller-center.html` despues de `internal-components.css` y antes del CSS inline.
- Movidas reglas visuales estaticas de topbar, sidebar, botones de cabecera, estados de carga/vacio/error y leyenda estatica.
- Conservadas inline las reglas acopladas a timeline, barras, fechas, dependencias, filtros funcionales, render dinamico, modal/drawer y datos.
- Sin cambios en JS, fetch, CSV, timeline, filtros, render dinamico, fechas/datos, rutas, href/src, ids/classes ni config.

## 2026-05-18 - Etapa 23B piloto CSS familia Backlog

Tipo de cambio: visual controlado.

Estado: completado.

Resultado:
- Creado `assets/css/pages/backlog.css` como hoja especifica para la familia Backlog.
- Enlazado en `internal/backlog/backlog-sellers.html` despues de `internal-components.css` y antes del CSS inline.
- Movidas reglas visuales estaticas de topbar, sidebar, KPIs, content frame y estados de carga/vacio; se conservaron inline las reglas acopladas a render dinamico, tabla, cards, modal, chips, progress y toast.
- Sin cambios en JS, fetch, CSV, render dinamico, filtros funcionales, modal funcional, datos, localStorage, rutas, href/src, ids/classes ni config.

## 2026-05-18 - Etapa 22E cierre liviano UX/copy operativo

Tipo de cambio: documentacion.

Estado: completado.

Resultado:
- Cerrado el bloque 22A-22D de mejoras UX/copy operativo: Backlog Sellers, Gestion Sellers, Simulador Economico interno, Gantt Operativo y Gantt Seller Center.
- Confirmada la decision de no tocar logica funcional, JS, CSV, submit, payloads, formulas, rutas ni config durante este bloque.
- Proximo paso recomendado: push y smoke test liviano de paginas operativas; luego avanzar solo con bugs reales o mejoras funcionales concretas.

## 2026-05-18 - Etapa 22D revision UX/copy Gantt interno

Tipo de cambio: contenido estatico en paginas criticas.

Estado: completado.

Resultado:
- Ajustados textos visibles estaticos en `internal/gantt/gantt-operativo.html` y `internal/gantt/gantt-seller-center.html`.
- Mejorada claridad de contexto operativo, titulos, subtitulos, ayudas y estados iniciales de carga.
- Sin cambios en JS funcional, scripts, fetch, CSV, timeline, filtros funcionales, render dinamico, fechas/datos, ids/classes, name/value, rutas, href/src ni config.

## 2026-05-18 - Etapa 22C revision UX/copy Simulador Economico interno

Tipo de cambio: contenido estatico en simulador critico.

Estado: completado.

Resultado:
- Ajustados textos visibles estaticos en `internal/simuladores/simulador-economico.html`.
- Mejorada claridad de uso interno, parametros, supuestos comerciales, servicios, resultados, escenarios, financiacion y tarifas de referencia.
- Sin cambios en formulas, calculos, JS, scripts, fetch, CSV, CONFIG, DIRECT_CSV_URLS, tarifas, overrides, escenarios, inputs funcionales, valores, ids/classes, rutas ni config.

## 2026-05-18 - Etapa 22B revision UX/copy Gestion Sellers

Tipo de cambio: contenido estatico en pantalla critica.

Estado: completado.

Resultado:
- Ajustados textos visibles estaticos en `internal/backlog/gestion-sellers.html`.
- Mejorada claridad de hero, instrucciones, preview, labels, ayudas y placeholders seguros.
- Sin cambios en submit, fetch, `APPS_SCRIPT_URL`, payload, `tipo_formulario`, `seller_id`, generacion/reserva de IDs, localStorage, validaciones de negocio, `name/id`, valores de campos, CSV, config, rutas ni links publicos.

## 2026-05-18 - Etapa 22A revision UX/contenido Backlog Sellers

Tipo de cambio: contenido/UX visual menor.

Estado: completado.

Resultado:
- Ajustados textos visibles estaticos en `internal/backlog/backlog-sellers.html`.
- Mejorada claridad de topbar, buscador, filtros, orden, KPIs y estado inicial de carga.
- Sin cambios en JS funcional, scripts, fetch, CSV, filtros funcionales, render dinamico, localStorage, datos, rutas, assets ni config.

## 2026-05-18 - Etapa 21B correccion pctSec en Relevamiento

Tipo de cambio: correccion critica acotada.

Estado: completado, smoke test 21C pendiente.

Resultado:
- Corregido `ReferenceError: pctSec is not defined` en `public/formularios/formulario-relevamiento.html`.
- El calculo de progreso por seccion queda declarado antes de actualizar el estado visual del indicador.
- Sin cambios en submit, endpoint, payload, `seller_id`, Apps Script, validaciones de negocio, nombres/ids de campos, rutas ni config.

## 2026-05-18 - Etapa 20G cierre liviano revision de contenido

Tipo de cambio: documentacion.

Estado: completado.

Resultado:
- Cerrado el bloque 20A-20F de revision de contenido: portada institucional, paginas estrategicas, Seller Center, paginas publicas seller-facing, maqueta Seller Center y normalizacion final de textos visibles.
- Confirmada la decision de no tocar rutas, JS, CSS, formularios, submit, endpoints ni logica durante este bloque.
- Proximo paso recomendado: push y smoke test liviano en GitHub Pages.

## 2026-05-18 - Etapa 20F consistencia final textos visibles post-copy

Tipo de cambio: contenido/documentacion.

Estado: completado.

Resultado:
- Corregidas referencias visibles de `Governance` a `Gobernanza` en portada y paginas estrategicas.
- Ajustado `Etapa 2` a `Fase 2` en la pagina estrategica para evitar confusion con etapas internas del proyecto.
- Retirada marca visible `v3` del footer de `proyecto-marketplace.html`.
- Sin cambios de CSS, JS, scripts, styles, ids, classes, href, src, rutas, estructura funcional, formularios, submit, endpoints, payloads, Apps Script, config, simuladores, assets ni aliases.

## 2026-05-18 - Etapa 20E revision contenido Maqueta Seller Center

Tipo de cambio: contenido.

Estado: completado.

Resultado:
- Ajustados textos visibles estaticos en `internal/seller-center/maqueta-seller-center.html`.
- Aclarado que la maqueta es una referencia funcional/visual del Seller Center dentro del Marketplace Portal.
- Alineado el lenguaje con Marketplace Sporting, onboarding, catalogo, stock, precios y operacion seller.
- Sin cambios de CSS, JS, scripts, ids, classes, rutas, estructura funcional, formularios, submit, endpoints, payloads, Apps Script, config, assets ni aliases.

## 2026-05-18 - Etapa 20D revision contenido publico seller-facing

Tipo de cambio: contenido.

Estado: completado.

Resultado:
- Ajustados textos visibles estaticos en paginas publicas seller-facing.
- Unificado lenguaje hacia Marketplace Sporting, seller, integracion, propuesta comercial, modelo operativo y onboarding.
- Retiradas marcas visibles de version en titulos publicos donde correspondia.
- Sin cambios de rutas, CSS, JS, formularios, atributos, submit, endpoints, payloads, Apps Script ni config.

## 2026-05-18 - Etapa 20C revision contenido Seller Center index

Tipo de cambio: contenido.

Estado: completado.

Resultado:
- Ajustados textos visibles en `internal/seller-center/index.html`.
- Aclarado el rol del Seller Center como modulo operativo dentro del Marketplace Portal.
- Alineada la relacion con PIM, Articulos Seller, seguimiento y documentacion funcional.
- Aclarado que la maqueta es referencia funcional/visual y no sistema productivo final.
- Sin cambios de rutas, CSS, JS, fetch, render dinamico, CSV, assets, Apps Script ni config.

## 2026-05-18 - Etapa 20B revision de contenido estrategico

Tipo de cambio: contenido.

Estado: completado.

Resultado:
- Ajustados textos visibles en paginas estrategicas para alinear lenguaje institucional.
- Normalizados labels de retorno hacia `index.html` como Portal/Portal institucional.
- Retiradas marcas visibles de version en crumbs, titulos y footers de paginas ya oficiales.
- Ajustado lenguaje de governance/gobernanza en `governance.html`.
- Sin cambios de rutas, CSS, JS, ids, clases, scripts, assets ni estructura funcional.

## 2026-05-18 - Etapa 20A revision rapida Hub Operativo y navegacion

Tipo de cambio: contenido/documentacion.

Estado: completado.

Resultado:
- Ajustados textos de `index.html` que seguian describiendo la migracion como etapa inicial.
- Actualizado estado visible a portal estable post-V1.
- Aclarado que las rutas oficiales viven en `internal/` y `public/`, y que los HTML versionados de raiz son aliases de compatibilidad.
- Sin cambios de rutas, logica, Hub Operativo, formularios, simuladores, Backlog, Gestion, Apps Script, config, assets ni legacy.

## 2026-05-18 - Etapa 19A handoff corto estado actual

Tipo de cambio: documentacion.

Estado: completado.

Resultado:
- Actualizado `docs/handoff-post-v1.md` como handoff corto post-etapas 14 a 18.
- Resumido estado actual, cambios recientes, decisiones vigentes, metodologia operativa y proximos pasos.
- Sin cambios funcionales, HTML, CSS, JS, Apps Script, config, assets, aliases ni legacy.

## 2026-05-18 - Etapa 18B cierre minimo de auditoria estructural

Tipo de cambio: documentacion.

Estado: completado.

Resultado:
- Registrado el cierre de Etapa 18A como auditoria sin cambios.
- No se detectaron links locales rotos en `href`, `src` o stylesheets dentro del alcance activo.
- Se confirma que los HTML versionados de raiz siguen como aliases activos y no deben moverse a `legacy/`.
- `sporting-marketplace_hub_v29.html` se mantiene como alias hacia `internal/hub-operativo.html`.
- `legacy/root-html-v1/` queda reservado para snapshots historicos futuros.
- No se realizara limpieza fisica por ahora.
- Se corrige la referencia documental obsoleta sobre `internal/seller-center/articulos-seller.docx`: el archivo existe.

Decisiones:
- Mantener `Logos/` y `assets/logos/` por compatibilidad y posible carga dinamica.
- Mantener `config.js`, `assets/js/config.js` y `Apps_script_v5.js` sin tocar.
- Revisar manualmente en una etapa futura `MarketPlace Sporting - Sellers (BD).xlsx`, `Mapa del Hub.docx` y una posible consolidacion de `Logos/`.

## 2026-05-18 - Etapa 16F cierre documental JS interno compartido

Tipo de cambio: documentacion.

Estado: completado.

Resultado:
- Cerrado el bloque de JS interno compartido.
- Registrado el recorrido:
  - 16A: auditoria JS interna compartible.
  - 16B/16C: piloto de `assets/js/internal-navigation.js` en `governance.html`.
  - 16D/16E: extension a `modelo-economico.html` y `proyecto-marketplace.html`.
- Resultado final: `assets/js/internal-navigation.js` creado y aplicado solo a paginas informativas seleccionadas.
- Decision: no extraer JS operativo.

Exclusiones:
- `modelo-integracion.html`, paginas operativas, `public/`, formularios, simuladores, Backlog, Gestion, Seller Center, Gantt, Hub Operativo, Apps Script, config, aliases y legacy.

Proximo bloque recomendado:
- Revisar documentacion/handoff o ejecutar smoke test post-push.

## 2026-05-18 - Etapa 16D extension JS navegacion estrategia

Tipo de cambio: implementacion controlada.

Estado: implementado, pendiente de smoke test 16E.

Cambios:
- Extendido `assets/js/internal-navigation.js` a:
  - `internal/estrategia/modelo-economico.html`
  - `internal/estrategia/proyecto-marketplace.html`
- Reemplazado solo el JS inline de navegacion activa por scroll.
- Conservado el `animationDelay` de `proyecto-marketplace.html`.
- No fue necesario modificar `assets/js/internal-navigation.js`.

Alcance:
- Sin cambios de textos, estructura HTML, CSS ni navegacion.
- Sin cambios en `governance.html`, `modelo-integracion.html` ni `proceso-onboarding.html`.
- Sin cambios en paginas operativas, publicas, Apps Script, config, aliases ni legacy.

## 2026-05-18 - Etapa 16B piloto JS navegacion activa

Tipo de cambio: implementacion minima y reversible.

Estado: implementado, pendiente de smoke test 16C.

Cambios:
- Creado `assets/js/internal-navigation.js` con `window.InternalNavigation.initActiveSectionNav(options)`.
- Aplicado solo en `internal/estrategia/governance.html`.
- Reemplazado el script inline de navegacion activa por una llamada al helper compartido.

Alcance:
- Sin cambios de estructura HTML, textos, navegacion ni estilos.
- Sin cambios en otras paginas.
- Sin cambios en publicas, formularios, simuladores, Backlog, Gestion, Seller Center, Gantt, Hub Operativo, Apps Script, config, aliases ni legacy.

## 2026-05-18 - Etapa 15G cierre documental limpieza CSS interna

Tipo de cambio: documentacion.

Estado: completado.

Resultado:
- Cerrado el bloque de limpieza CSS interna.
- Registrado el recorrido:
  - 15A: auditoria general de duplicados CSS.
  - 15B/15C: limpieza piloto en `internal/estrategia/proceso-onboarding.html`.
  - 15D/15E: limpieza controlada en paginas de estrategia.
  - 15F: auditoria de paginas internas operativas.
- Decision final: cerrar limpieza CSS interna por ahora.

Motivo:
- La limpieza segura se aplico en paginas informativas de estrategia.
- Las paginas operativas tienen bajo beneficio y mayor riesgo por fetch, CSV, filtros, formulas, submit, localStorage o render dinamico.

Proximo bloque recomendado:
- Etapa 16A: auditoria JS interna compartible, sin implementacion.

## 2026-05-18 - Etapa 15D limpieza CSS estrategia

Tipo de cambio: implementacion controlada.

Estado: implementado, pendiente de smoke test 15E.

Cambios:
- Limpiado CSS inline duplicado en paginas informativas de `internal/estrategia/`.
- Se uso `assets/css/internal-components.css` como base compartida.
- No fue necesario modificar `assets/css/internal-components.css`.

Paginas afectadas:
- `internal/estrategia/governance.html`
- `internal/estrategia/modelo-integracion.html`
- `internal/estrategia/modelo-economico.html`
- `internal/estrategia/proyecto-marketplace.html`

Alcance:
- Sin cambios de textos, estructura HTML, navegacion ni JavaScript.
- Sin cambios en selector de `modelo-integracion.html`.
- Sin cambios en publicas, formularios, simuladores, Backlog, Gestion, Seller Center, Gantt, Hub Operativo, Apps Script, config, aliases ni legacy.

## 2026-05-18 - Etapa 15B limpieza piloto CSS inline duplicado

Tipo de cambio: implementacion minima y reversible.

Estado: implementado, pendiente de smoke test 15C.

Cambios:
- Limpiadas reglas CSS inline duplicadas en `internal/estrategia/proceso-onboarding.html`.
- Las reglas eliminadas ya estan cubiertas por `assets/css/internal-components.css`.
- Se conservaron los links a `tokens.css` e `internal-components.css`.
- Se conservo `.callout{margin-top:14px}` como ajuste local porque ese margen no existe en el CSS compartido.

Alcance:
- Sin cambios de textos.
- Sin cambios de estructura HTML.
- Sin cambios en JavaScript.
- Sin cambios en `assets/css/internal-components.css`, `tokens.css`, otras paginas, publicas, Backlog, Gestion, formularios, simuladores, Apps Script, config, aliases ni legacy.

## 2026-05-18 - Etapa 14I cierre documental CSS interno compartido

Tipo de cambio: documentacion.

Estado: completado.

Resultado:
- Cerrada documentalmente la Etapa 14 de CSS interno compartido.
- Registrado el recorrido:
  - 14A: auditoria CSS/JS sin cambios.
  - 14B: plan documental.
  - 14C/14D: piloto en `internal/estrategia/proceso-onboarding.html`.
  - 14E/14F: extension a paginas de estrategia.
  - 14G/14H: extension a paginas internas restantes.
- Resultado final: `assets/css/internal-components.css` aplicado a paginas internas autorizadas, manteniendo CSS inline como fallback.
- Decision: no extraer JavaScript todavia.

Exclusiones:
- Paginas publicas, formularios, simuladores publicos, presentaciones publicas, Apps Script, config, JS, aliases de raiz y `legacy/`.

Proximo bloque recomendado:
- Evaluar limpieza gradual de CSS duplicado o iniciar auditoria JS interna, siempre sin implementar cambios hasta nueva etapa especifica.

## 2026-05-18 - Etapa 14G extension CSS compartido interno a paginas internas restantes

Tipo de cambio: implementacion acotada y reversible.

Estado: implementado, pendiente de smoke test 14H.

Cambios:
- Enlazado `assets/css/internal-components.css` en paginas internas restantes:
  - `internal/seller-center/index.html`
  - `internal/gantt/gantt-seller-center.html`
  - `internal/gantt/gantt-operativo.html`
  - `internal/simuladores/simulador-economico.html`
  - `internal/backlog/backlog-sellers.html`
  - `internal/backlog/gestion-sellers.html`
  - `internal/hub-operativo.html`
- El link se agrego despues de `tokens.css` cuando existe y siempre antes del `<style>` inline.
- CSS inline original conservado como fallback.

Alcance:
- Sin cambios de textos.
- Sin cambios de estructura HTML salvo link CSS.
- Sin cambios en JavaScript, fetch, CSV, formulas, filtros, submit, localStorage ni render dinamico.
- Sin cambios en `internal/seller-center/maqueta-seller-center.html`, `assets/css/internal-components.css`, paginas publicas, Apps Script, config, aliases ni legacy.

## 2026-05-18 - Etapa 14E extension CSS compartido interno a estrategia

Tipo de cambio: implementacion acotada y reversible.

Estado: implementado, pendiente de smoke test 14F.

Cambios:
- Enlazado `assets/css/internal-components.css` en:
  - `internal/estrategia/governance.html`
  - `internal/estrategia/modelo-integracion.html`
  - `internal/estrategia/modelo-economico.html`
  - `internal/estrategia/proyecto-marketplace.html`
- El link se agrego despues de `tokens.css` y antes del `<style>` inline.
- CSS inline original conservado como fallback.

Alcance:
- Sin cambios de textos.
- Sin cambios de estructura HTML salvo link CSS.
- Sin cambios en JavaScript.
- Sin cambios en `proceso-onboarding.html`, `assets/css/internal-components.css`, paginas publicas, Backlog, Gestion, formularios, simuladores, Apps Script, config, aliases ni legacy.

## 2026-05-18 - Etapa 14C piloto CSS compartido interno

Tipo de cambio: implementacion minima reversible.

Estado: implementado, pendiente de smoke test 14D.

Cambios:
- Creado `assets/css/internal-components.css` con componentes pasivos.
- Enlazado solo en `internal/estrategia/proceso-onboarding.html`.
- CSS inline original conservado como fallback.

Alcance:
- Sin cambios de estructura HTML salvo link CSS.
- Sin cambios de textos.
- Sin cambios en JavaScript.
- Sin cambios en paginas criticas, publicas, Backlog, Gestion, formularios, simuladores, Apps Script, config, aliases ni legacy.

## 2026-05-18 - Etapa 14B plan extraccion CSS interna

Tipo de cambio: documentacion tecnica.

Estado: completado.

Resultado:
- Etapa 14A cerrada como auditoria sin cambios.
- Documentado plan futuro para `assets/css/internal-layout.css` y/o `assets/css/internal-components.css`.
- Piloto recomendado para 14C: `internal/estrategia/proceso-onboarding.html`.
- Decision: no extraer JavaScript por ahora.

Alcance:
- Solo documentacion.
- Sin cambios en HTML, CSS, JS, `public/`, formularios, simuladores, Backlog, Gestion de Sellers, Apps Script, config, aliases ni `legacy/`.

## 2026-05-18 - Etapa 13B smoke test post-push GitHub Pages

Tipo de cambio: documentacion de validacion productiva.

Estado: completado.

Resultado general: OK.

Validaciones registradas:
- `index.html` carga correctamente en GitHub Pages.
- `internal/hub-operativo.html` carga correctamente.
- Acceso al Hub Operativo funciona.
- `sporting-marketplace_hub_v29.html` redirige a `internal/hub-operativo.html`.
- `sporting-marketplace_hub_v29.html?test=1#mapa` preserva query string y hash.
- Aliases publicos con `seller_id=SPT-001` preservan el parametro.
- No hay 404 criticos.
- No se ejecuto submit real en formularios ni Gestion de Sellers.

Alcance:
- Solo documentacion.
- Sin cambios en HTML, CSS, JS, Apps Script, config, endpoints, payloads, submit, aliases ni archivos.

## 2026-05-18 - Etapa 12B cierre post-V1 y handoff

Tipo de cambio: cierre documental.

Estado: completado.

Decision:
- La raiz queda como compatibility layer de aliases.
- No se mueven aliases a `legacy/`.
- `legacy/root-html-v1/` queda reservado para snapshots historicos futuros.

Cambios:
- Creado `docs/handoff-post-v1.md`.
- Documentado cierre del bloque post-V1.

Alcance:
- Solo documentacion.
- Sin cambios en HTML, CSS, JS, `internal/`, `public/`, `legacy/`, Apps Script, config ni aliases.

## 2026-05-18 - Etapa 11B decision tokens paginas publicas

Tipo de cambio: documentacion de decision tecnica.

Estado: completado.

Decision:
- Mantener las paginas publicas seller-facing independientes de `assets/css/tokens.css`.
- No crear `public-tokens.css` todavia.

Motivos:
- Las 4 paginas publicas tienen `:root` inline, estilos embebidos y variables locales.
- `tokens.css` fue disenado para paginas internas y no aporta componentes ni layout.
- Beneficio esperado bajo o nulo frente al riesgo.
- Formularios tienen submit real, endpoints, payloads y `seller_id`.
- Simulador Seller tiene calculos, tarifas, overrides y personalizacion por seller.
- Presentacion Seller es mas liviana, pero conserva identidad visual seller-facing, logos, CTAs y fetch CSV.

Alcance:
- Solo documentacion.
- Sin cambios en HTML, CSS, JS, `tokens.css`, formularios, simuladores, presentacion seller, endpoints, payloads, submit, `seller_id` ni Apps Script.

## 2026-05-18 - Etapa 10C smoke test Hub Operativo mejorado

Tipo de cambio: documentacion de validacion.

Estado: completado.

Resultado general: OK.

Validaciones registradas:
- `internal/hub-operativo.html` carga correctamente.
- "Volver al Portal" abre `../index.html`.
- Buscador encuentra resultados por titulo/label y descripcion.
- Buscador muestra "Sin resultados" cuando no hay coincidencias.
- Links publicos base abren `public/`.
- No hay `seller_id` hardcodeado.
- Mapa de rutas clickeable funciona.
- Topbar no rompe visualmente en mobile.
- No hay 404 criticos.
- No se tocaron formularios, simuladores, Backlog, Gestion de Sellers, Apps Script, config, endpoints, payloads ni submit.

Estado final:
- Hub Operativo post-V1 mejorado y validado.
- Etapa 10B cerrada sin refactor masivo ni extraccion CSS/JS.

## 2026-05-18 - Etapa 10B mejoras seguras Hub Operativo

Tipo de cambio: mejora incremental acotada.

Estado: implementado, pendiente de smoke test manual.

Cambios:
- Agregado acceso "Volver al Portal" desde `internal/hub-operativo.html` hacia `../index.html`.
- Buscador actualizado para indexar tambien la descripcion de cada recurso.
- Agregado estado visual "Sin resultados" cuando la busqueda no tiene coincidencias.
- Agregada aclaracion de que los links publicos son base y pueden requerir `seller_id` para experiencias personalizadas.
- Mapa de rutas convertido en links clickeables hacia rutas existentes.
- Agregado ajuste mobile minimo para reducir overflow visual en topbar.
- Agregada nota visual de que los contadores del sidebar son referenciales.

Alcance:
- Sin refactor masivo.
- Sin extraccion CSS/JS.
- Sin cambios de rutas existentes.
- Sin cambios en `index.html`, `sporting-marketplace_hub_v29.html`, formularios, simuladores, Backlog, Gestion de Sellers, Apps Script, config, endpoints, payloads, submit ni storage.

## 2026-05-18 - Etapa 9D smoke test alias hub legacy

Tipo de cambio: documentacion de validacion.

Estado: completado.

Resultado general: OK.

Validaciones registradas:
- `sporting-marketplace_hub_v29.html` redirige correctamente a `internal/hub-operativo.html`.
- `sporting-marketplace_hub_v29.html?test=1#mapa` redirige a `internal/hub-operativo.html?test=1#mapa`.
- Query string y hash se preservan.
- No hay 404 criticos.
- `internal/hub-operativo.html` carga correctamente.
- No se tocaron formularios, simuladores, Backlog, Gestion de Sellers, Apps Script, config, endpoints, payloads ni submit.

Estado final:
- `internal/hub-operativo.html` queda como hub operativo oficial.
- `sporting-marketplace_hub_v29.html` queda como URL legacy/alias.

## 2026-05-18 - Etapa 9B/9C smoke test y alias hub legacy

Tipo de cambio: validacion documental y alias legacy.

Estado: implementado.

Smoke test 9B:
- `internal/hub-operativo.html` carga correctamente.
- Sidebar, accesos rapidos, buscador y grid dinamico visibles.
- Links internos abren rutas `internal/`.
- Links publicos abren rutas `public/`.
- `index.html` muestra acceso "Abrir Hub Operativo".

Alias 9C:
- `sporting-marketplace_hub_v29.html` ahora funciona como alias hacia `internal/hub-operativo.html`.
- El alias usa `meta refresh` como fallback y JavaScript con `window.location.replace()`.
- Preserva `location.search` y `location.hash`.
- Incluye enlace manual actualizado por JavaScript cuando corresponde.

Alcance:
- No se movio ni elimino el archivo legacy.
- No se modifico `internal/hub-operativo.html`.
- No se modificaron `index.html`, paginas nuevas, formularios, simuladores, Backlog, Gestion de Sellers, Apps Script, config, endpoints, payloads ni submit.

Validacion pendiente:
- Abrir `sporting-marketplace_hub_v29.html`.
- Confirmar redireccion a `internal/hub-operativo.html`.
- Confirmar preservacion de query/hash.
- Confirmar ausencia de 404.

## 2026-05-18 - Etapa 9A hub operativo oficial

Tipo de cambio: creacion de pagina interna operativa post-V1.

Estado: implementado, pendiente de smoke test manual.

Cambios:
- Creado `internal/hub-operativo.html` tomando como base funcional `sporting-marketplace_hub_v29.html`.
- Agregado acceso claro desde `index.html` como "Abrir Hub Operativo".
- Ajustadas rutas en la nueva pagina para apuntar a `internal/`, `public/`, `docs/` e `index.html` desde su ubicacion en `/internal/`.
- Eliminada en la nueva pagina la dependencia del `BASE_URL` viejo `sporting-marketplace` para el grid dinamico.
- Documentada la nueva pagina como hub operativo interno oficial.

Alcance:
- `sporting-marketplace_hub_v29.html` permanece intacto como historico temporal.
- No se modificaron paginas publicas, formularios, simuladores, Backlog, Gestion de Sellers, Apps Script, config, endpoints, payloads, submit, aliases legacy ni assets.
- No se extrajo CSS/JS ni se hizo refactor masivo.

Validacion pendiente:
- Smoke test manual de carga, sidebar, buscador, grid dinamico y links internos/publicos desde `/internal/hub-operativo.html`.

## 2026-05-18 - Etapa 8C decision hub legacy

Tipo de cambio: documentacion de decision.

Estado: documentado.

Decision:
- `sporting-marketplace_hub_v29.html` queda intacto como hub operativo historico temporal.
- No se convierte en alias a `index.html` en V1.

Motivo:
- No esta completamente reemplazado por `index.html`.
- `index.html` cumple rol institucional, liviano y documental.
- El hub legacy conserva funcionalidades operativas no replicadas: sidebar, flujo de incorporacion, accesos rapidos, recursos por proceso, buscador, mapa de rutas y grid dinamico.
- `index.html` todavia lo referencia como "Hub central actual" / "Referencia temporal".
- Convertirlo ahora podria eliminar una herramienta operativa util o generar links redundantes/circulares.

Recomendacion post-V1:
- Evaluar si su funcionalidad se integra en `index.html`.
- O crear `internal/hub-operativo.html`.
- Recien despues decidir alias, pagina de transicion o movimiento a `legacy/`.

Alcance:
- Solo documentacion.
- Sin cambios en HTML, CSS, JS, Apps Script, config, `internal/`, `public/`, aliases ni archivos legacy.

## 2026-05-18 - Etapa 8A Release Notes V1

Tipo de cambio: cierre documental de version.

Estado: V1 estable y lista para release.

Cambios incluidos:
- Creacion de `docs/release-notes-v1.md`.
- README actualizado para declarar Marketplace Portal V1 como version estable.
- Roadmap actualizado con Etapa 8A y pendientes post-V1.
- Test matrix actualizada con estado final V1.

Alcance V1 cerrado:
- Estructura `internal/` y `public/` consolidada.
- `index.html` institucional creado.
- Paginas internas y publicas migradas.
- Assets/logos centralizados.
- Fallback local de logos aplicado por etapas.
- `tokens.css` aplicado solo a paginas internas de bajo riesgo.
- Aliases legacy implementados para HTML versionados migrados.
- Smoke test manual de aliases documentado con resultado OK.

Exclusiones y pendientes post-V1:
- `sporting-marketplace_hub_v29.html` queda intacto.
- No se movio ni elimino legacy.
- Paginas publicas quedan sin `tokens.css` por ahora.
- Sin extraccion masiva de CSS/JS.
- Sin refactor funcional.
- Sin cambios en Apps Script, endpoints, payloads, submit ni `localStorage`.

Validacion:
- Solo se modifico documentacion.
- No se tocaron HTML, CSS, JS, Apps Script, config, endpoints, payloads, formularios, simuladores, Backlog, Gestion, assets ni legacy.

## 2026-05-18 - Etapa 7H smoke test aliases legacy

Tipo de cambio: documentacion de validacion.

Estado: completado.

Resultado general: OK.

Validaciones registradas:
- Aliases 7C a 7F redirigen a rutas nuevas correctas.
- Query string y hash se preservan.
- En paginas publicas se conserva `seller_id=SPT-001`.
- No hay 404 criticos.
- No se ejecuto submit real en Gestion de Sellers ni formularios.
- `sporting-marketplace_hub_v29.html` no fue modificado.

Aliases validados:
- `governance_v3.html`
- `proceso-onboarding_v4.html`
- `modelo-integracion_v5.html`
- `modelo-economico_v2.html`
- `proyecto-marketplace_v3.html`
- `seller-center_v2.html`
- `gantt-seller-center_v2.html`
- `gantt-operativo_v18.html`
- `backlog-sellers_v27.html`
- `gestion-sellers_v7.html`
- `simulador-economico_v4.html`
- `maqueta-seller-center_v2.html`
- `presentacion-seller_v3.html?seller_id=SPT-001`
- `simulador-seller_v12.html?seller_id=SPT-001`
- `formulario-calificacion_v2.html?seller_id=SPT-001`
- `formulario-relevamiento_v2.html?seller_id=SPT-001`

Documentacion actualizada:
- `docs/test-matrix.md`: resultados OK por alias y registro de ejecucion.
- `docs/roadmap.md`: Etapa 7G marcada con smoke test OK y V1 lista para release notes.
- `README.md`: estado V1 actualizado.

Proxima accion:
- Preparar release notes V1.

## 2026-05-18 - Etapa 7G cierre documental de Etapa 7

Tipo de cambio: documentacion de cierre.

Estado: Etapa 7 cerrada en modo aliases; smoke test manual completo pendiente antes de declarar V1 cerrada.

Decision documentada:
- Todos los HTML versionados que ya tenian ruta nueva migrada quedan cubiertos por aliases en raiz.
- `sporting-marketplace_hub_v29.html` queda intacto como referencia temporal y unica decision legacy pendiente.
- No se movieron archivos a `legacy/`.
- No se eliminaron archivos.
- No se modificaron paginas nuevas ni logica funcional.

Alcance explicitamente excluido:
- Sin modificaciones en HTML durante esta etapa.
- Sin cambios de CSS, JS, Apps Script, endpoints, payloads, submit, `localStorage`, `config.js`, `assets/js/config.js`, assets o logos.
- Sin nuevos aliases.
- Sin limpieza legacy.

Documentacion actualizada:
- `docs/roadmap.md`: cierre 7G, estado final de aliases y V1 cercana/cerrable.
- `docs/test-matrix.md`: checklist final de smoke test V1.
- `docs/hub-map.md`: estado consolidado de cierre Etapa 7.
- `README.md`: estado actual actualizado para reflejar estructura migrada y aliases legacy.

Pendientes:
- Ejecutar smoke test manual completo de aliases 7C a 7F.
- Validar publicas con `?seller_id=SPT-001`.
- No ejecutar submit real en Gestion de Sellers ni formularios.
- Decidir en etapa separada el tratamiento futuro de `sporting-marketplace_hub_v29.html`.
- Preparar release notes V1.

## 2026-05-18 - Etapa 7F aliases legacy restantes

Tipo de cambio: compatibilidad legacy.

Estado: implementado, pendiente smoke test manual completo.

Cambios incluidos:
- `backlog-sellers_v27.html` convertido en alias hacia `internal/backlog/backlog-sellers.html`.
- `gestion-sellers_v7.html` convertido en alias hacia `internal/backlog/gestion-sellers.html`.
- `simulador-economico_v4.html` convertido en alias hacia `internal/simuladores/simulador-economico.html`.
- `maqueta-seller-center_v2.html` convertido en alias hacia `internal/seller-center/maqueta-seller-center.html`.
- `presentacion-seller_v3.html` convertido en alias hacia `public/presentaciones/presentacion-seller.html`.
- `simulador-seller_v12.html` convertido en alias hacia `public/simuladores/simulador-seller.html`.
- `formulario-calificacion_v2.html` convertido en alias hacia `public/formularios/formulario-calificacion.html`.
- `formulario-relevamiento_v2.html` convertido en alias hacia `public/formularios/formulario-relevamiento.html`.
- Cada alias usa `meta refresh` como fallback y JavaScript con `window.location.replace()` preservando `location.search` y `location.hash`.
- En paginas publicas, el alias preserva query string completo, incluido `seller_id`.
- Actualizacion de `docs/roadmap.md`, `docs/test-matrix.md` y `docs/hub-map.md`.

Alcance explicitamente excluido:
- Sin modificaciones en `sporting-marketplace_hub_v29.html`.
- Sin modificaciones en `index.html`.
- Sin modificaciones en paginas nuevas de `internal/` o `public/`.
- Sin modificaciones en Apps Script, `config.js`, `assets/js/config.js`, `assets/css/tokens.css`, endpoints, payloads, submit, `localStorage`, `assets/logos`, `Logos/` ni `legacy/`.
- Sin movimiento de archivos a `legacy/`.

Validacion pendiente:
- Abrir cada legacy convertido y confirmar redireccion a su ruta nueva.
- Abrir paginas publicas legacy con `?seller_id=SPT-001` y confirmar preservacion del parametro.
- Abrir cada legacy convertido con `?test=1#riesgo` y confirmar preservacion de query/hash.
- Confirmar que no hay 404 ni errores de consola.
- No ejecutar submit real en Gestion de Sellers ni formularios.

Riesgo conocido:
- Los aliases apuntan a paginas destino que conservan su riesgo funcional original: Gestion y formularios tienen escritura real, simuladores tienen formulas, Backlog y Gantt dependen de datos externos. Esta etapa no modifica esa logica.
- `sporting-marketplace_hub_v29.html` queda pendiente e intacto para una decision separada.

## 2026-05-18 - Etapa 7E aliases legacy internos de riesgo medio

Tipo de cambio: compatibilidad legacy.

Estado: implementado, pendiente smoke test manual.

Cambios incluidos:
- `seller-center_v2.html` convertido en alias hacia `internal/seller-center/index.html`.
- `gantt-seller-center_v2.html` convertido en alias hacia `internal/gantt/gantt-seller-center.html`.
- `gantt-operativo_v18.html` convertido en alias hacia `internal/gantt/gantt-operativo.html`.
- Cada alias usa `meta refresh` como fallback y JavaScript con `window.location.replace()` preservando `location.search` y `location.hash`.
- Cada enlace manual se actualiza por JavaScript para apuntar al destino con query/hash cuando corresponda.
- Actualizacion de `docs/roadmap.md`, `docs/test-matrix.md` y `docs/hub-map.md`.

Alcance explicitamente excluido:
- Sin modificaciones en Backlog.
- Sin modificaciones en Gestion de Sellers.
- Sin modificaciones en formularios, simuladores, paginas publicas ni Apps Script.
- Sin modificaciones en paginas nuevas de `internal/`.
- Sin movimiento de archivos a `legacy/`.
- Sin cambios en `config.js`, `assets/js/config.js`, CSS compartido ni `sporting-marketplace_hub_v29.html`.

Validacion pendiente:
- Abrir cada legacy convertido y confirmar redireccion a su ruta nueva.
- Abrir cada legacy convertido con `?test=1#riesgo` y confirmar preservacion de query/hash.
- Confirmar que no hay 404 ni errores de consola.

Riesgo conocido:
- Gantt Operativo conserva riesgo alto por dependencias de datos en la pagina destino. El alias no modifica su logica, CSV ni render.
- Quedan pendientes aliases de Backlog, Gestion de Sellers, simuladores, formularios, maqueta y hub legacy.

## 2026-05-18 - Etapa 7D aliases legacy estrategia

Tipo de cambio: compatibilidad legacy.

Estado: implementado, pendiente smoke test manual.

Cambios incluidos:
- `proceso-onboarding_v4.html` convertido en alias hacia `internal/estrategia/proceso-onboarding.html`.
- `modelo-integracion_v5.html` convertido en alias hacia `internal/estrategia/modelo-integracion.html`.
- `modelo-economico_v2.html` convertido en alias hacia `internal/estrategia/modelo-economico.html`.
- `proyecto-marketplace_v3.html` convertido en alias hacia `internal/estrategia/proyecto-marketplace.html`.
- Cada alias usa `meta refresh` como fallback y JavaScript con `window.location.replace()` preservando `location.search` y `location.hash`.
- Cada enlace manual se actualiza por JavaScript para apuntar al destino con query/hash cuando corresponda.
- Actualizacion de `docs/roadmap.md`, `docs/test-matrix.md` y `docs/hub-map.md`.

Alcance explicitamente excluido:
- Sin modificaciones en `governance_v3.html`.
- Sin modificaciones en paginas nuevas de `internal/`.
- Sin movimiento de archivos a `legacy/`.
- Sin cambios en formularios, simuladores, Backlog, Gestion de Sellers, Seller Center, Apps Script, `config.js`, `assets/js/config.js`, CSS compartido ni `sporting-marketplace_hub_v29.html`.

Validacion pendiente:
- Abrir cada legacy convertido y confirmar redireccion a su ruta nueva.
- Abrir cada legacy convertido con `?test=1#riesgo` y confirmar preservacion de query/hash.
- Confirmar que no hay 404 ni errores de consola.

Riesgo conocido:
- Los aliases de paginas operativas o criticas siguen pendientes. Deben avanzar en etapas separadas, empezando por grupos de riesgo medio y dejando formularios, Gestion, simuladores, Backlog y hub legacy para mas adelante.

## 2026-05-18 - Etapa 7B/7C matriz de aliases y piloto Governance

Tipo de cambio: compatibilidad legacy + documentacion.

Estado: implementado parcialmente, pendiente smoke test manual.

Cambios incluidos:
- Matriz inicial de aliases legacy documentada.
- `governance_v3.html` convertido en alias estatico hacia `internal/estrategia/governance.html`.
- El alias usa `meta refresh` como fallback y JavaScript con `window.location.replace()` preservando `location.search` y `location.hash`.
- El enlace manual se actualiza por JavaScript para apuntar al destino con query/hash cuando corresponda.
- Actualizacion de `docs/roadmap.md`, `docs/test-matrix.md` y `docs/hub-map.md`.

Alcance explicitamente excluido:
- Sin movimiento de archivos a `legacy/`.
- Sin modificaciones en otros HTML legacy.
- Sin modificaciones en `internal/estrategia/governance.html`.
- Sin cambios en formularios, simuladores, Backlog, Gestion de Sellers, Apps Script, `config.js`, `assets/js/config.js`, CSS compartido ni hub legacy `sporting-marketplace_hub_v29.html`.

Validacion pendiente:
- Abrir `governance_v3.html` y confirmar redireccion a `internal/estrategia/governance.html`.
- Abrir `governance_v3.html?test=1#riesgo` y confirmar preservacion de query/hash.
- Confirmar que no hay 404 ni errores de consola.

Riesgo conocido:
- El resto de aliases legacy sigue pendiente y debe avanzar por grupos de riesgo, dejando formularios, Gestion, simuladores, Backlog y hub legacy para etapas posteriores.

## 2026-05-16 - Etapa 6M cierre de Etapa 6

Tipo de cambio: documentacion — cierre de bloque.

Estado: cerrado.

La Etapa 6 queda cerrada para paginas internas. Se extendio `assets/css/tokens.css` a 8 paginas en 3 grupos con smoke test OK en todos.

Alcance completado:
- internal/estrategia/: 5 paginas (6C piloto + 6E extension) — smoke test 6D y 6F OK.
- internal/seller-center/: index.html (6H) — smoke test 6I OK. Maqueta excluida por diseño.
- internal/backlog/: backlog-sellers + gestion-sellers (6K) — smoke test 6L OK.

Exclusiones:
- maqueta-seller-center.html: excluida definitivamente (otra plataforma, paleta clara).
- Paginas publicas (formularios, presentaciones, simuladores): diferidas — requieren auditoria propia.

Invariante: en ninguna sub-etapa (6C–6L) se modificaron JS, Apps Script, endpoints, submit, localStorage, formularios, simuladores, legacy ni redirects.

Archivos modificados: docs/assets-strategy.md, docs/roadmap.md, docs/test-matrix.md, CHANGELOG.md.

## 2026-05-16 - Etapa 6L smoke test grupo internal/backlog

Tipo de cambio: documentacion — resultado de validacion.

Estado: completado.

Resultado del smoke test manual en entorno local de las 2 paginas de Etapa 6K:
- `backlog-sellers.html`: tokens.css HTTP 200, sin errores criticos, cards / tabla / filtros / modal OK.
- `gestion-sellers.html`: tokens.css HTTP 200, sin errores criticos, formulario / preview / punto de estado / asteriscos OK. Submit real no ejecutado. Punto de estado ambar correcto (inline prevalece sobre canonico).

Estado final del grupo `internal/backlog/`: 2 paginas validadas con tokens.css. JS, Apps Script, localStorage y submit sin tocar en ninguna etapa.

Archivos modificados: `docs/test-matrix.md`, `docs/roadmap.md`, `docs/assets-strategy.md`, `CHANGELOG.md`.

## 2026-05-16 - Etapa 6K tokens.css en grupo internal/backlog

Tipo de cambio: extension controlada de link CSS a 2 paginas del grupo backlog.

Estado: implementado — pendiente smoke test manual.

Paginas modificadas (solo link en <head>, :root inline y JS conservados):
- `internal/backlog/backlog-sellers.html` — linea 10-11, antes del `<style>` (sin indent)
- `internal/backlog/gestion-sellers.html` — linea 11-12, despues de `config.js`, antes del `<style>`

Patron aplicado:
```html
<!-- 6K: tokens CSS externos. El :root inline permanece como fallback. -->
<link rel="stylesheet" href="../../assets/css/tokens.css">
```

Restricciones cumplidas:
- No se modifico JS, config.js, Apps Script, localStorage, submit, endpoints ni fetch.
- No se extrajeron variables CSS ni se elimino el :root inline.
- No se tocaron formularios, simuladores, gantt ni legacy.

Etapa 6J (auditoria previa):
- `backlog-sellers.html`: 0 colisiones efectivas con tokens.css (usa alias --wa/--in/--da).
- `gestion-sellers.html`: 5 colisiones de nombre con valor distinto — el inline siempre prevalece, sin impacto visual.

Proxima accion: smoke test manual en ambas paginas (Etapa 6L).

## 2026-05-16 - Etapa 6I smoke test seller-center index

Tipo de cambio: documentacion — resultado de validacion.

Estado: completado.

Resultado del smoke test manual en entorno local (`http://localhost:8080/internal/seller-center/index.html`):
- `tokens.css` HTTP 200 sin 404.
- Sin errores criticos de consola.
- Sin regresion visual: topbar, sidebar, modulos SC OK.
- Links "Ver maqueta" y "Ver Gantt" navegan correctamente.
- Error CORS del fetch a Google Sheets: confirmado esperado, no regresion de CSS.
- `:root` inline activo como fallback.

Estado final del grupo `internal/seller-center/`:
- `index.html`: enlazada y validada con tokens.css.
- `maqueta-seller-center.html`: excluida definitivamente por ser otra plataforma con otro sistema visual.

Archivos modificados: `docs/test-matrix.md`, `docs/roadmap.md`, `docs/assets-strategy.md`, `CHANGELOG.md`.

## 2026-05-16 - Etapa 6H tokens.css en seller-center index

Tipo de cambio: extension controlada de link CSS + exclusion documentada.

Estado: implementado — pendiente smoke test manual.

Archivos HTML modificados:
- `internal/seller-center/index.html` — agregado `<link rel="stylesheet" href="../../assets/css/tokens.css">` en `<head>` antes del `<style>`. El `:root` inline conservado.

Archivos no modificados por decision:
- `internal/seller-center/maqueta-seller-center.html` — excluida definitivamente. Representa otra plataforma en creacion con sistema visual propio (paleta clara). No adopta los tokens oscuros del Marketplace Portal.

Etapa 6G (auditoria previa):
- `index.html` auditada: paleta Sporting, fetch read-only a Google Sheets, 8 colisiones con tokens.css (6 mismo valor o sin impacto visual).
- `maqueta-seller-center.html` auditada: 6 colisiones criticas de variables (panel, text, line, topbar-height) — opuestos semanticos absolutos entre paleta clara y oscura.

Restricciones cumplidas: no se modifico JS, Apps Script, endpoints, submit, formularios, simuladores, backlog, gantt ni legacy.

Proxima accion: smoke test manual de `index.html` antes del proximo push (Etapa 6I).

## 2026-05-16 - Etapa 6F smoke test grupo internal/estrategia

Tipo de cambio: documentacion — resultado de validacion.

Estado: completado.

Resultado del smoke test manual en entorno local de las 4 paginas de Etapa 6E:
- `governance.html`: tokens.css HTTP 200, sin errores, sin regresion visual.
- `modelo-integracion.html`: tokens.css HTTP 200, sin errores, sin regresion visual.
- `modelo-economico.html`: tokens.css HTTP 200, sin errores, sin regresion visual.
- `proyecto-marketplace.html`: tokens.css HTTP 200, sin errores, sin regresion visual.

Estado final del grupo `internal/estrategia/`: 5 paginas validadas con tokens.css (proceso-onboarding 6C/6D + 4 paginas 6E/6F).

Archivos modificados: `docs/test-matrix.md`, `docs/roadmap.md`, `docs/assets-strategy.md`, `CHANGELOG.md`.

## 2026-05-16 - Etapa 6E extension tokens.css al grupo internal/estrategia

Tipo de cambio: extension controlada del link CSS a 4 paginas informativas.

Estado: implementado — pendiente smoke test manual.

Paginas modificadas (solo agregado link en <head>, :root inline conservado):
- `internal/estrategia/governance.html`
- `internal/estrategia/modelo-integracion.html`
- `internal/estrategia/modelo-economico.html`
- `internal/estrategia/proyecto-marketplace.html`

Patron aplicado:
```html
<!-- 6E: tokens CSS externos. El :root inline permanece como fallback. -->
<link rel="stylesheet" href="../../assets/css/tokens.css">
```

Restricciones cumplidas:
- No se modifico JS, Apps Script, endpoints, submit ni paginas criticas.
- No se extrajo CSS inline.
- No se eliminaron variables :root legacy.
- `proceso-onboarding.html` (piloto 6C) no fue tocado.

Correcciones documentales:
- La lista de paginas en docs/test-matrix.md mencionaba paginas inexistentes (bandeja-seller, calificacion-seller, contacto-seller, presentacion-interna). Corregida con las paginas reales.

Proxima accion: smoke test manual en las 4 paginas antes del proximo push (Etapa 6F).

## 2026-05-16 - Etapa 6D smoke test piloto tokens.css

Tipo de cambio: documentacion — resultado de validacion.

Estado: completado.

Resultado del smoke test manual en entorno local (`http://localhost:8080/internal/estrategia/proceso-onboarding.html`):
- `tokens.css` carga sin error 404, HTTP 200.
- Sin errores de consola.
- Sin regresion visual: topbar, sidebar, KPIs, cards, botones OK.
- `:root` inline coexiste correctamente como fallback.

Piloto aprobado. Habilitado para extender `tokens.css` a las otras 4 paginas del grupo `internal/estrategia/` en Etapa 6E.

Archivos modificados: `docs/test-matrix.md`, `docs/roadmap.md`, `docs/assets-strategy.md`, `CHANGELOG.md`.

## 2026-05-16 - Etapa 6C piloto tokens.css

Tipo de cambio: creacion de archivo compartido + enlace piloto en pagina informativa.

Estado: completado.

Archivos creados:
- `assets/css/tokens.css` — bloque `:root {}` con 19 tokens canonicos en 5 grupos (verde primario, fondos, separadores, texto, semanticos + layout).

Archivos modificados:
- `internal/estrategia/proceso-onboarding.html` — agregado `<link rel="stylesheet" href="../../assets/css/tokens.css">` dentro de `<head>` antes del bloque `<style>`.

Restricciones cumplidas:
- El `:root` inline del HTML fue conservado sin modificacion — coexiste como fallback.
- Ningun otro HTML, JS, formulario, simulador, backlog ni gantt fue modificado.
- No se extrajo CSS inline.
- No se eliminaron archivos legacy.
- No se crearon redirects.
- No se tocaron endpoints ni Apps Script.

Proxima accion: smoke test visual en navegador para confirmar carga sin errores y sin regresion visual (Etapa 6D).

## 2026-05-15 - Etapa 5M fallback local Gestion de Sellers

Tipo de cambio: piloto controlado.

Estado: completado sin cambios funcionales.

Cambios incluidos:

- Actualizacion acotada de `internal/backlog/gestion-sellers.html`.
- Ampliacion de `logoCandidates(id)` para incluir `../../assets/logos/{seller_id}.png` como ultimo candidato.
- Preservacion de `LOGO_BASE_URL` (resuelto como `CFG.ASSETS.LOGO_BASE_URL || FALLBACK_CONFIG.ASSETS.LOGO_BASE_URL`) como prioridad principal.
- Preservacion de las 5 extensiones remotas (`png`, `webp`, `jpg`, `jpeg`, `svg`).
- Preservacion del fallback final por iniciales en la preview mediante `updateLogo()` (que continua reemplazando el `<img>` por `<span class="logo-fallback">` cuando se agotan los candidatos).
- Propagacion automatica del nuevo candidato a `#logoPreview` a traves del ciclo `img.onerror` existente en `updateLogo()`.
- Actualizacion de `docs/assets-strategy.md`.
- Actualizacion de `docs/roadmap.md`.

Alcance explicitamente excluido:

- Sin cambios en `CFG.ASSETS.LOGO_BASE_URL` ni en `FALLBACK_CONFIG.ASSETS.LOGO_BASE_URL`.
- Sin cambios en `config.js` ni en `assets/js/config.js`.
- Sin cambios en el listener `submit` del formulario.
- Sin cambios en `fetch(APPS_SCRIPT_URL, ...)`, `mode:"no-cors"`, headers, ni body.
- Sin cambios en `tipo_formulario:"seller"` ni en el payload.
- Sin cambios en validaciones (`validatePayload`).
- Sin cambios en `nextSellerId`, `normalizeSellerId`, `reserveSellerId`, `getReservedIds`.
- Sin cambios en `localStorage` (`mp_responsable_seller`, `mp_reserved_seller_ids`).
- Sin cambios en carga de CSV (`getCSV`, `parseCSV`, `loadSellers`).
- Sin cambios en el flujo de alta/edicion (`buildExistingSelect`, `loadSelectedSeller`, `loadSellerById`, `initFromUrl`, `resetForm`).
- Sin cambios en links publicos (`buildPublicLink`, `copyLink`, `copyFirstContactMessage`, `copyPayload`).
- Sin cambios en `updatePreview()` ni en el render estructural.
- Sin cambios visuales ni de estructura.
- Sin modificaciones en `internal/backlog/backlog-sellers.html`.
- Sin modificaciones en Apps Script.
- Sin modificaciones en formularios publicos, simuladores ni Presentacion Seller.
- Sin movimientos en `Logos/` ni en `assets/logos/`.
- Sin cambios en archivos legacy en raiz (`gestion-sellers_v7.html`).
- Sin redirects.
- Sin extraccion de CSS o JavaScript.

Validacion:

- Se confirmo que la guarda `if(!sid) return [];` se preserva sin cambios.
- Se confirmo que los 5 candidatos remotos se mantienen primero y en el mismo orden de extensiones.
- Se confirmo que el nuevo candidato local queda al final del array devuelto por `logoCandidates(id)`.
- Se confirmo que `encodeURIComponent(sid)` se reutiliza tambien para la ruta local, consistente con los candidatos remotos.
- Se confirmo que `updateLogo()` no fue modificado y continua ciclando el array por indice via `img.onerror`, cayendo a `<span class="logo-fallback">` cuando se agotan los candidatos.
- Se confirmo que `updatePreview()` sigue invocando `updateLogo($("logoPreview"), o.seller_id, name)` sin cambios.
- Se confirmo que el listener `submit`, `fetch(APPS_SCRIPT_URL, ...)`, `reserveSellerId`, `saveResponsable` y la cadena de validaciones quedan intactos.
- Se confirmo que `nextSellerId`, `normalizeSellerId`, `formToObject`, `validatePayload`, `getQuerySellerId`, `isEditModeFromUrl`, `loadSellers`, `parseCSV`, `getCSV`, `buildExistingSelect`, `loadSelectedSeller`, `loadSellerById` e `initFromUrl` quedan intactos.
- Se confirmo que ni `internal/backlog/backlog-sellers.html`, ni `config.js`, ni `assets/js/config.js`, ni Apps Script, ni formularios, ni simuladores, ni Presentacion Seller fueron alterados.
- Se confirmo que `gestion-sellers_v7.html` legacy permanece intacto.

Pendiente:

- Smoke test manual de la preview en `internal/backlog/gestion-sellers.html`.
- Validar caso con URL principal disponible (no debe haber regresion en la preview).
- Validar caso con URL principal caida y asset local presente (debe cargar el local en la preview).
- Validar caso sin asset local (debe caer a iniciales en la preview).
- No ejecutar submit real durante el smoke test.
- Actualizar `docs/test-matrix.md` con el smoke test especifico de la cadena de fallback en Gestion de Sellers.

## 2026-05-15 - Etapa 5L fallback local Backlog de Sellers

Tipo de cambio: piloto controlado.

Estado: completado sin cambios funcionales.

Cambios incluidos:

- Actualizacion acotada de `internal/backlog/backlog-sellers.html`.
- Ampliacion de `logoCandidates(sellerId)` para incluir `../../assets/logos/{seller_id}.png` como ultimo candidato.
- Preservacion de la URL absoluta `CONFIG.LOGO_BASE_URL` como prioridad principal y de las 5 extensiones remotas (`png`, `webp`, `jpg`, `jpeg`, `svg`).
- Preservacion del fallback final por iniciales en cards, tabla y modal mediante `handleLogoError()` y `handleModalLogoError()`.
- Propagacion automatica del nuevo candidato a cards del kanban, tabla y modal a traves de `data-logo-candidates`.
- Actualizacion de `docs/assets-strategy.md`.
- Actualizacion de `docs/roadmap.md`.

Alcance explicitamente excluido:

- Sin cambios en `CONFIG.LOGO_BASE_URL` ni `CONFIG.LOGO_EXTENSIONS`.
- Sin cambios en el bloque `CONFIG` inline ni en sus constantes operativas (`SELLERS_URL`, `RELEVAMIENTOS_URL`, `PUBLIC_BASE_URL`, `PRESENTACION_PATH`, `CALIFICACION_PATH`, `RELEVAMIENTO_PATH`, `SIMULADOR_SELLER_PATH`).
- Sin modificaciones en `internal/backlog/gestion-sellers.html`.
- Sin modificaciones en `config.js` ni `assets/js/config.js`.
- Sin cambios en Apps Script, endpoints, payloads, validaciones o `seller_id`.
- Sin cambios en filtros, busqueda, tabs `kanban/tabla`, render estructural, modal, parsers CSV, helpers de pipeline ni links publicos.
- Sin cambios visuales ni de estructura.
- Sin movimientos en `Logos/` ni en `assets/logos/`.
- Sin cambios en archivos legacy en raiz (`backlog-sellers_v27.html`).
- Sin redirects.
- Sin extraccion de CSS o JavaScript.
- Sin modificaciones en formularios publicos, simuladores ni Presentacion Seller.

Validacion:

- Se confirmo que la guarda `if(!base||!id)return[];` se preserva sin cambios.
- Se confirmo que los 5 candidatos remotos se mantienen primero y en el mismo orden de extensiones.
- Se confirmo que el nuevo candidato local queda al final del array devuelto por `logoCandidates()`.
- Se confirmo que `safeAssetId()` se reutiliza para normalizar el id en la ruta local.
- Se confirmo que `logoHTML()` serializa el array completo en `data-logo-candidates` y no requiere cambios.
- Se confirmo que `handleLogoError()` (cards y tabla) y `handleModalLogoError()` (modal) reciclan el array por indice sin cambios.
- Se confirmo que `openModal()` invoca `logoCandidates(s.seller_id)` y hereda el nuevo candidato.
- Se confirmo que ni `internal/backlog/gestion-sellers.html`, ni `config.js`, ni `assets/js/config.js`, ni Apps Script, ni formularios, ni simuladores, ni Presentacion Seller fueron alterados.
- Se confirmo que `backlog-sellers_v27.html` legacy permanece intacto.

Pendiente:

- Smoke test manual sobre cards del kanban, tabla y modal.
- Validar caso con URL absoluta disponible (no debe haber regresion).
- Validar caso con URL absoluta caida y asset local presente (debe cargar el local).
- Validar caso sin asset local (debe caer a iniciales).
- Etapa 5M: aplicar el mismo patron en `internal/backlog/gestion-sellers.html` solo despues de validar 5L.
- Actualizar `docs/test-matrix.md` con el smoke test especifico de la cadena de fallback en Backlog.

## 2026-05-15 - Etapa 5K auditoria de logos en Backlog y Gestion

Tipo de cambio: auditoria/documental.

Estado: auditoria completada sin cambios funcionales.

Cambios incluidos:

- Auditoria de `internal/backlog/backlog-sellers.html`.
- Auditoria de `internal/backlog/gestion-sellers.html`.
- Documentacion del patron actual de consumo de logos: `LOGO_BASE_URL`, `LOGO_EXTENSIONS`, `logoCandidates`, `logoHTML`, `handleLogoError`, `handleModalLogoError`, `updateLogo`, fallback por iniciales.
- Documentacion de diferencias entre Backlog (inline `CONFIG`, multi-superficie, solo lectura) y Gestion (`CFG` via `assets/js/config.js`, preview unica, escritura real).
- Documentacion de riesgo operativo de la URL absoluta a GitHub Pages externo (`sporting-marketplace`) que hoy no usa `assets/logos/` local.
- Clasificacion de riesgos: bajo / medio / alto / critico.
- Propuesta de estrategia segura: fallback local sin tocar `LOGO_BASE_URL` ni `config.js`.
- Reasignacion formal de la Etapa 5K a esta auditoria (la mencion previa en 5G queda cubierta por la matriz de Etapa 4.5).
- Actualizacion de `docs/assets-strategy.md`.
- Actualizacion de `docs/roadmap.md`.

Alcance explicitamente excluido:

- Sin modificaciones en HTML.
- Sin cambios de referencias.
- Sin modificaciones en `config.js`.
- Sin modificaciones en `assets/js/config.js`.
- Sin cambios en `LOGO_BASE_URL`.
- Sin movimientos en `Logos/` ni en `assets/logos/`.
- Sin cambios en Apps Script.
- Sin cambios de endpoints, payloads, validaciones, `seller_id`, generacion o reserva de IDs.
- Sin cambios en submit ni `localStorage`.
- Sin modificaciones en formularios publicos, simuladores ni Presentacion Seller.
- Sin redirects.
- Sin extraccion de CSS o JavaScript.

Validacion:

- Se confirmo que Backlog declara `CONFIG.LOGO_BASE_URL` inline y no carga `assets/js/config.js`.
- Se confirmo que Gestion carga `assets/js/config.js` y usa `FALLBACK_CONFIG` como respaldo.
- Se confirmo que ambas paginas resuelven logos por `seller_id` y no consumen `logo_url` del CSV en el render actual.
- Se confirmo que ambas tienen fallback por iniciales.
- Se confirmo que la URL absoluta apunta a `antonioluquin-ecomm.github.io/sporting-marketplace/assets/logos/`, externa a este repositorio.
- Se confirmo que no se modifico ningun archivo HTML ni de configuracion.

Pendiente:

- Etapa 5L: aplicar fallback local solo en Backlog.
- Etapa 5M: aplicar fallback local solo en Gestion despues de validar 5L.
- Smoke test manual de Backlog y Gestion en el contexto de Etapa 4.5.

## 2026-05-15 - Etapa 5J fallback local Formulario de Relevamiento

Tipo de cambio: piloto controlado.

Estado: completado sin cambios funcionales.

Cambios incluidos:

- Actualizacion acotada de `public/formularios/formulario-relevamiento.html`.
- Agregado de fallback local `../../assets/logos/{seller_id}.png` solo cuando no exista logo valido desde CSV.
- Preservacion de prioridad para `logo_url`, `logo` y `url_logo` desde CSV.
- Preservacion del fallback final por iniciales si el logo local no carga.
- Actualizacion de `docs/assets-strategy.md`.
- Actualizacion de `docs/roadmap.md`.

Alcance explicitamente excluido:

- Sin cambios en submit.
- Sin modificaciones en Apps Script.
- Sin cambios de endpoints.
- Sin cambios de payload.
- Sin cambios de validaciones.
- Sin correccion de `pctSec`.
- Sin cambios en logica condicional.
- Sin cambios en `seller_id`.
- Sin modificaciones en `config.js` ni `assets/js/config.js`.
- Sin modificaciones en Backlog, Gestion de Sellers, simuladores o Presentacion Seller.
- Sin cambios de diseno visual.
- Sin modificaciones en `formulario-relevamiento_v2.html`.

Validacion:

- Se confirmo que la prioridad queda `safeUrl(seller.logo_url || seller.logo || seller.url_logo) || localLogoFallback()`.
- Se confirmo que el fallback local apunta a `../../assets/logos/{seller_id}.png`.
- Se confirmo que el fallback por iniciales sigue asociado a `sellerLogo.onerror`.
- Se confirmo que submit, endpoint, payload, validaciones, condicionales y `pctSec` no fueron modificados.

Pendiente:

- Smoke test manual con `seller_id=SPT-001`.
- Validar caso con logo existente desde CSV.
- Validar caso sin logo CSV para confirmar fallback local.
- Validar caso sin logo local para confirmar iniciales.
- Revisar condicionales, progreso y consola sin ejecutar submit real.

## 2026-05-15 - Etapa 5H fallback local Formulario de Calificacion

Tipo de cambio: piloto controlado.

Estado: completado sin cambios funcionales.

Cambios incluidos:

- Actualizacion acotada de `public/formularios/formulario-calificacion.html`.
- Agregado de fallback local `../../assets/logos/{seller_id}.png` solo cuando no exista logo valido desde CSV.
- Preservacion de prioridad para `logo_url`, `logo` y `url_logo` desde CSV.
- Preservacion del fallback final por iniciales si el logo local no carga.
- Actualizacion de `docs/assets-strategy.md`.
- Actualizacion de `docs/roadmap.md`.

Alcance explicitamente excluido:

- Sin modificaciones en Formulario de Relevamiento.
- Sin cambios en submit.
- Sin modificaciones en Apps Script.
- Sin cambios de endpoints.
- Sin cambios de payload.
- Sin cambios de validaciones.
- Sin cambios en `seller_id`.
- Sin modificaciones en `config.js` ni `assets/js/config.js`.
- Sin modificaciones en Backlog, Gestion de Sellers, simuladores o Presentacion Seller.
- Sin cambios de diseno visual.
- Sin modificaciones en `formulario-calificacion_v2.html`.

Validacion:

- Se confirmo que la prioridad queda `safeUrl(seller.logo_url || seller.logo || seller.url_logo) || localLogoFallback()`.
- Se confirmo que el fallback local apunta a `../../assets/logos/{seller_id}.png`.
- Se confirmo que el fallback por iniciales sigue asociado a `sellerLogo.onerror`.
- Se confirmo que submit, endpoint, payload y validaciones no fueron modificados.

Pendiente:

- Smoke test manual con `seller_id=SPT-001`.
- Validar caso con logo existente desde CSV.
- Validar caso sin logo CSV para confirmar fallback local.
- Validar caso sin logo local para confirmar iniciales.
- No ejecutar submit real durante smoke test.

## 2026-05-15 - Etapa 5G auditoria formularios publicos logos

Tipo de cambio: auditoria/documental.

Estado: auditoria completada sin cambios funcionales.

Cambios incluidos:

- Auditoria de `public/formularios/formulario-calificacion.html`.
- Auditoria de `public/formularios/formulario-relevamiento.html`.
- Documentacion de carga actual de logos, prioridad de `logo_url`, fallback por iniciales y puntos posibles de insercion para fallback local.
- Clasificacion de riesgo: Calificacion alto, Relevamiento critico.
- Recomendacion de aplicar primero en Calificacion y evaluar Relevamiento despues de smoke test.
- Actualizacion de `docs/assets-strategy.md`.
- Actualizacion de `docs/roadmap.md`.

Alcance explicitamente excluido:

- Sin modificaciones en HTML.
- Sin cambios de referencias.
- Sin cambios en logica de formularios.
- Sin cambios en submit.
- Sin modificaciones en Apps Script.
- Sin cambios de endpoints ni payloads.
- Sin cambios de validaciones.
- Sin modificaciones en `config.js` ni `assets/js/config.js`.
- Sin modificaciones en Backlog, Gestion de Sellers, simuladores o Presentacion Seller.
- Sin redirects.

Riesgos documentados:

- Los formularios escriben datos reales via Apps Script.
- `formulario-relevamiento.html` tiene mayor sensibilidad por condicionales, progreso por seccion y riesgo pendiente `pctSec`.
- `safeUrl()` acepta actualmente solo `http:` y `https:`, por lo que el fallback local requiere implementacion cuidadosa en una etapa separada.

## 2026-05-15 - Etapa 5F fallback local Simulador Seller

Tipo de cambio: piloto controlado.

Estado: completado sin impacto global.

Cambios incluidos:

- Actualizacion acotada de `public/simuladores/simulador-seller.html`.
- Agregado de fallback local `../../assets/logos/{seller_id}.png` solo cuando no exista logo desde CSV o query params.
- Preservacion de prioridad para `logo_url` del CSV y `logo`/`logo_url` por query params.
- Preservacion del fallback final por iniciales si el logo local no carga.
- Actualizacion de `docs/assets-strategy.md`.
- Actualizacion de `docs/roadmap.md`.

Alcance explicitamente excluido:

- Sin modificaciones en `config.js`.
- Sin modificaciones en `assets/js/config.js`.
- Sin cambios en `LOGO_BASE_URL`.
- Sin modificaciones en Backlog.
- Sin modificaciones en Gestion de Sellers.
- Sin modificaciones en formularios.
- Sin modificaciones en Presentacion Seller.
- Sin modificaciones en Apps Script.
- Sin redirects.
- Sin movimiento ni eliminacion de `Logos/`.
- Sin cambios de diseno visual.
- Sin cambios en formulas, calculos, tarifas, overrides ni escenarios.
- Sin modificaciones en `simulador-seller_v12.html`.

Validacion:

- Se confirmo que la prioridad queda `getSellerLogoFromRow(SELLER) || params.get("logo") || params.get("logo_url") || localLogoFallback()`.
- Se confirmo que el fallback local apunta a `../../assets/logos/{seller_id}.png`.
- Se confirmo que el fallback por iniciales sigue asociado a `logoEl.onerror`.
- Se confirmo que CTAs, `seller_id`, `parseOverrides()`, `calculate()` y `render()` no fueron modificados.

Pendiente:

- Smoke test manual con `seller_id=SPT-001`.
- Validar caso con `logo_url` existente desde CSV/query.
- Validar caso sin logo local para confirmar fallback por iniciales.
- Revisar calculos, escenarios y CTAs en navegador.

## 2026-05-15 - Etapa 5E piloto fallback local Presentacion Seller

Tipo de cambio: piloto controlado.

Estado: completado sin impacto global.

Cambios incluidos:

- Actualizacion acotada de `public/presentaciones/presentacion-seller.html`.
- Agregado de fallback local `../../assets/logos/{seller_id}.png` solo cuando no exista logo desde CSV o query params.
- Preservacion de prioridad para `logo_url` del CSV y `logo`/`logo_url` por query params.
- Preservacion del fallback final por iniciales si el logo local no carga.
- Actualizacion de `docs/assets-strategy.md`.
- Actualizacion de `docs/roadmap.md`.

Alcance explicitamente excluido:

- Sin modificaciones en `config.js`.
- Sin modificaciones en `assets/js/config.js`.
- Sin cambios en `LOGO_BASE_URL`.
- Sin modificaciones en Backlog.
- Sin modificaciones en Gestion de Sellers.
- Sin modificaciones en formularios.
- Sin modificaciones en simuladores.
- Sin modificaciones en Apps Script.
- Sin redirects.
- Sin movimiento ni eliminacion de `Logos/`.
- Sin cambios de diseno visual.
- Sin modificaciones en `presentacion-seller_v3.html`.

Validacion:

- Se confirmo que la prioridad queda `logoUrl || logoParam || localLogoFallback()`.
- Se confirmo que el fallback local apunta a `../../assets/logos/{seller_id}.png`.
- Se confirmo que el fallback por iniciales sigue asociado a `logo.onerror=hideLogo`.
- Se confirmo que CTAs y logica de `seller_id` no fueron modificados.

Pendiente:

- Smoke test manual con `seller_id=SPT-001`.
- Validar caso con `logo_url` existente desde CSV/query.
- Validar caso sin logo local para confirmar fallback por iniciales.

## 2026-05-15 - Etapa 5D auditoria de consumo actual de logos

Tipo de cambio: auditoria/documental.

Estado: auditoria completada sin cambios funcionales.

Cambios incluidos:

- Auditoria de referencias a `Logos/`, `assets/logos/`, `LOGO_BASE_URL`, `logoCandidates`, `logoHTML`, `sellerLogo`, `topSellerLogo`, `renderSellerIdentity`, `applySellerIdentity` y fallbacks por iniciales.
- Tabla por pagina en `docs/assets-strategy.md` con fuente actual de logos, fallback, dependencia de `seller_id`, tipo de ruta y riesgo.
- Identificacion de `public/presentaciones/presentacion-seller.html` como pagina candidata para piloto futuro.
- Recomendacion de no cambiar todavia `LOGO_BASE_URL`, `config.js` ni `assets/js/config.js`.
- Actualizacion de `docs/roadmap.md`.

Alcance explicitamente excluido:

- Sin modificaciones en paginas HTML.
- Sin cambios de referencias.
- Sin cambios en `LOGO_BASE_URL`.
- Sin modificaciones en `config.js` ni `assets/js/config.js`.
- Sin movimiento ni eliminacion de `Logos/`.
- Sin modificaciones en Apps Script.
- Sin redirects.

Riesgos documentados:

- Backlog y Gestion de Sellers tienen riesgo alto porque consumen logos por `LOGO_BASE_URL` y `seller_id`.
- Formularios tienen riesgo alto/critico por escritura real y validaciones.
- Presentacion Seller es la mejor candidata para un piloto porque no escribe datos y ya usa fallback por iniciales.

## 2026-05-15 - Etapa 5C validacion de carga de logos

Tipo de cambio: validacion/documental.

Estado: validacion local completada.

Cambios incluidos:

- Validacion de existencia de `assets/logos/spt-001.png` a `assets/logos/spt-015.png`.
- Validacion de firma PNG para los 15 archivos.
- Validacion de apertura como imagen local para los 15 archivos.
- Confirmacion de dimensiones `200x200`.
- Confirmacion de que `assets/logos/spt-001.png` resuelve como ruta relativa desde la raiz del repositorio.
- Actualizacion de `docs/assets-strategy.md`.
- Actualizacion de `docs/roadmap.md`.

Alcance explicitamente excluido:

- Sin modificaciones en paginas HTML.
- Sin cambios de referencias.
- Sin cambios en `LOGO_BASE_URL`.
- Sin modificaciones en `config.js` ni `assets/js/config.js`.
- Sin movimiento ni eliminacion de `Logos/`.
- Sin modificaciones en Apps Script.
- Sin redirects.

Pendiente:

- Validar disponibilidad desde GitHub Pages cuando corresponda.
- Definir en una etapa posterior si se actualizan referencias o configuracion de logos.

## 2026-05-15 - Etapa 5B copia segura de logos

Tipo de cambio: assets/documental.

Estado: copia segura completada.

Cambios incluidos:

- Copia de 15 archivos `spt-*.png` desde `Logos/` hacia `assets/logos/`.
- Preservacion exacta de nombres, extensiones, mayusculas/minusculas y contenido binario.
- Validacion por cantidad, tamaño y hash SHA256.
- Actualizacion de `docs/assets-strategy.md`.
- Actualizacion de `docs/hub-map.md`.
- Actualizacion de `docs/roadmap.md`.

Alcance explicitamente excluido:

- Sin movimiento ni eliminacion de `Logos/`.
- Sin modificaciones en paginas HTML.
- Sin cambios de referencias.
- Sin cambios en CSS.
- Sin cambios en JavaScript.
- Sin modificaciones en `config.js` ni `assets/js/config.js`.
- Sin modificaciones en Apps Script.
- Sin redirects.
- Sin limpieza legacy.

Validacion:

- `Logos/` sigue existiendo.
- `assets/logos/` contiene 15 archivos `spt-*.png`.
- Todos los archivos copiados coinciden en tamaño y hash SHA256 con su origen.

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
