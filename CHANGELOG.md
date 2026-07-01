# Changelog

Todos los cambios relevantes del proyecto Marketplace Portal deben documentarse en este archivo.

El formato recomendado es mantener entradas por fecha o version, indicando alcance, tipo de cambio, archivos afectados, validaciones realizadas y riesgos conocidos.

## 2026-07-01 - Etapa 1 de alineacion al design system estandar: tokens y tema base

Tipo de cambio: CSS / fundacion de design system.

Estado: implementado.

Resultado:
- `assets/css/tokens.css` reescrito con el naming canonico del ecosistema (`--bg`, `--card`, `--text`, `--muted`, `--line`, `--primary/-hover/-soft/-mid`, `--success/-bg`, `--warning/-bg`, `--danger/-bg/-hover`, radios `--radius-xs/-sm/(base)/-lg/-pill`, sombras `--shadow-sm/(base)/-lg`, tipografia `--font` (DM Sans) y `--mono` (DM Mono), y tokens de sidebar `--sidebar-bg`/`--sidebar-line`). Reemplaza la paleta verde/oscura propia (`--g`, `--k`, `--t1`...).
- `assets/js/theme.js` simplificado: el modo oscuro queda fuera de alcance (ver decision), se fuerza siempre `data-theme="light"` y se retira el boton de toggle inyectado. Se conserva `window.MP_THEME` como no-op por compatibilidad.
- `assets/css/theme.css`: el bloque `html[data-theme="light"]` se retonaliza de verde a azul institucional (`#1a3f6b`) sobre fondo claro estandar (`#f0f2f7`); se elimina el bloque `html[data-theme="dark"]` y el CSS del boton de toggle (ya no se inyecta).
- Documentada la decision en `docs/decisions/2026-07-01-alineacion-design-system.md`.

Alcance:
- `assets/css/tokens.css` no se propaga todavia a las paginas (cada pagina sigue con su `:root` inline, que gana por cascada) — el cambio de tokens.css en si mismo no tiene efecto visual.
- `theme.css`/`theme.js` si cambian el comportamiento observable: el sitio pasa de oscuro-por-defecto (con toggle) a claro-forzado (sin toggle). Quedan acentos verdes remanentes en paginas que redefinen sus propios tokens inline — se resuelven en las etapas siguientes del plan de estandarizacion (piloto index.html, luego modulos por lotes).
- No se toco logica de parsers de CSV, Apps Script, ni `MP_CONFIG`.

Validacion:
- Preview server: `index.html` y `internal/backlog/gestion-sellers.html` cargan en claro sin errores de consola.
- Mobile (375px): sin overflow horizontal en el hub.

## 2026-07-01 - Etapa 3 (Lote C) de alineacion al design system estandar: Simuladores

Tipo de cambio: CSS / topbar de modulo. Freeze zone parcial.

Estado: implementado.

Resultado:
- `internal/simuladores/config-tarifas.html` y `internal/simuladores/simulador-economico.html` migrados a DM Sans + DM Mono y paleta canonica via alias de `:root`. `assets/css/pages/simuladores.css` reescrito: elimina el par de bloques oscuro+override-claro, topbar a 50px fijo (se agrego `min-height:50px` explicito para neutralizar el `min-height:56px` que impone `internal-components.css` via `:where(.topbar)`).
- Colores hardcodeados especificos (toasts de config-tarifas, badges de simulador-economico) migrados a los tokens canonicos correspondientes en vez de quedar con verdes/rojos de la paleta anterior.

Alcance:
- Solo los 2 HTML del lote y `assets/css/pages/simuladores.css`.
- **`config-tarifas.html` es freeze zone parcial** (alimenta la pestana `overrides` del Sheet): no se toco el parser de overrides, la logica de guardado, ni el manejo de la clave de escritura — confirmado revisando que el diff del archivo solo afecta al bloque `<style>` y comentarios.

Validacion:
- Preview server: ambas paginas cargan en claro sin errores de consola, topbar a 50px confirmado por inspeccion de estilos computados (tras corregir el min-height heredado).
- Mobile (375px): ambas paginas sin overflow, formularios legibles.

## 2026-07-01 - Etapa 3 (Lote B) de alineacion al design system estandar: Gantt

Tipo de cambio: CSS / topbar de modulo.

Estado: implementado.

Resultado:
- `internal/gantt/gantt-operativo.html` y `internal/gantt/gantt-seller-center.html` migrados a DM Sans + DM Mono y paleta canonica, mismo patron de alias de `:root` de las etapas anteriores. `assets/css/pages/gantt.css` reescrito: elimina el par de bloques oscuro+override-claro, topbar a 50px fijo, sidebar con `--sidebar-bg`.
- `gantt-operativo.html` es el archivo mas grande del proyecto (~2900 lineas, con logica de render de timeline/kanban/lista inline). Barrido sistematico via sustitucion de patrones: overlays `rgba(255,255,255,.0X)` -> `rgba(17,24,39,.0X)` (tinte oscuro sutil sobre claro, equivalente semantico del tinte claro sobre oscuro), hexes de superficie casi-negros (`#111611`, `#151a15`, `#171d17`, etc., ~11 variantes) -> `var(--card)`/`var(--bg)` segun profundidad de capa, ancho de sidebar 234px -> 224px, alto de topbar 56/58px -> 50px, tipografia Barlow/Barlow Condensed -> DM Sans.
- `gantt-seller-center.html` recibio el mismo tratamiento; ademas se corrigieron dos casos puntuales donde el barrido automatico no alcanzaba: `.mod-row`/`.mod-row-left` (barra divisoria de modulo, quedaba con fondo casi negro solido) y el rotulo "Hoy" de la linea de fecha actual (fondo oscuro con texto verde ilegible sobre claro) — ambos detectados en la verificacion visual mobile, no por el barrido de patrones.
- Colores de fase del Gantt (`--f-com`, `--f-tec`, `--f-op`, `--f-cie`, `--f-qa`, `--f-gl`) y acentos decorativos (`--teal`, `--violet`, `--info`) se mantienen como categorizacion visual propia de esta pagina — no forman parte de la paleta semantica compartida, igual que en el Hub (Etapa 2).

Alcance:
- Solo los 2 HTML del lote y `assets/css/pages/gantt.css`. No se toco la logica de render de timeline, kanban, lista, filtros, ni el modal de edicion de tareas.

Validacion:
- Preview server: ambas paginas cargan en claro sin errores de consola, sidebar 224px / topbar 50px confirmados por inspeccion de estilos computados.
- gantt-operativo.html: vistas Lista, Kanban y Gantt probadas; modal de detalle de tarea abre/cierra con contenido legible.
- gantt-seller-center.html: drawer de detalle probado; mobile (375px) revisado — ahi se detectaron y corrigieron los dos casos puntuales mencionados arriba.

## 2026-07-01 - Etapa 3 (Lote A) de alineacion al design system estandar: Backlog

Tipo de cambio: CSS / topbar de modulo.

Estado: implementado.

Resultado:
- `internal/backlog/gestion-sellers.html` y `internal/backlog/backlog-sellers.html` migrados a DM Sans + DM Mono y paleta canonica, siguiendo el mismo patron de alias de `:root` usado en `index.html` (Etapa 2).
- `assets/css/pages/gestion-sellers.css` y `assets/css/pages/backlog.css` reescritos: se eliminan los bloques duplicados "Etapa 27A" (base oscura) + `html[data-theme="light"]` (override), dejando un unico set de reglas nativamente claras. Topbar de ambas paginas a 50px de alto fijo (antes 56/60px con min-height inconsistente).
- Titulos y labels que usaban "Barlow Condensed" en mayusculas (h1, modal-name, k-col-title, scard-id, td-id, kpi-val, etc.) pasan a DM Sans/DM Mono; se sacó el tratamiento uppercase del nombre del seller en el modal de detalle (antes 24px/900/uppercase, ahora 20px/700).
- Barrido de overlays `rgba(255,255,255,.0X)` pensados para fondo oscuro (kanban, cards, chips, modal, badges, inputs de edicion inline) reemplazados por tokens claros (`var(--bg)`, `var(--card)`).

Alcance:
- Solo los 2 HTML del lote y sus 2 CSS de pagina. No se toco `MP_CONFIG`, el parser de sellers, ni la logica de kanban/tabla/modal/edicion inline.
- El link "← Backlog" / "← Hub" del topbar de modulo se mantiene tal cual (patron Tipo A) — no se fuerza el texto generico "Volver al inicio" porque el destino especifico es mas util para el flujo real.

Validacion:
- Preview server: ambas paginas cargan en claro sin errores de consola, sidebar de backlog a 224px, topbar de ambas a 50px (confirmado por inspeccion de estilos computados).
- Modal de detalle de seller en backlog-sellers.html probado (abre/cierra, contenido legible).
- Mobile (375px): backlog-sellers.html sin errores de consola, sidebar oculto como estaba previsto.

## 2026-07-01 - Etapa 2 de alineacion al design system estandar: index.html (Hub Central)

Tipo de cambio: CSS / estructura de shell.

Estado: implementado.

Resultado:
- `index.html` migrado a DM Sans + DM Mono, referencia a `assets/css/tokens.css`, y paleta canonica (azul institucional en vez de verde). El `:root` inline ahora solo declara alias locales (`--g`, `--t1`, `--s1`...) apuntando a los tokens canonicos, para no reescribir cada regla de la hoja de estilos existente.
- Titulos (`h1`, `.sec-title`, `.card-title`, `.access-head`) dejan de usar Barlow Condensed en mayusculas y pasan a DM Sans en peso normal, alineados a la escala tipografica del style guide.
- Sidebar y topbar alineados a las medidas canonicas: sidebar 224px (antes 252px) con fondo slate `--sidebar-bg`, topbar 50px de alto fijo (antes 58px, con un `min-height:56px` heredado de `internal-components.css` que se neutralizo explicitamente).
- Overlays y sombras pensados para fondo oscuro (`rgba(255,255,255,.0X)`, `rgba(0,0,0,.28)`, verdes/teal hardcodeados) reemplazados por tokens o variantes claras equivalentes.
- Nav del sidebar reestructurado: "Inicio" como item de Overview sin etiqueta (primero, separado), resto de las secciones agrupadas bajo la etiqueta "Secciones", siguiendo `navigation_standard.md §2.1`.
- Se eliminaron los tres bloques de parches en cascada ("Etapa 26B/27A/27B") que quedaban dentro del `<style>`, consolidando sus reglas vigentes directamente en las reglas base.

Alcance:
- Solo `index.html`. No se tocaron rutas, `MP_CONFIG`, ni el JS de `RESOURCES`/buscador/scroll-spy (sus referencias a variables de color siguen funcionando via el alias del `:root`).
- Checkpoint de la Etapa 2 del plan de estandarizacion — sirve de referencia visual para migrar los modulos internos y publicos en las etapas siguientes.

Validacion:
- Preview server en desktop (1280px) y mobile (375px): sidebar 224px / topbar 50px confirmados por inspeccion de estilos computados, sin errores de consola, sin overflow horizontal.
- Buscador de "Todos los recursos" probado (filtro por texto funcionando).
- Scroll-spy de la navegacion del sidebar sin cambios de comportamiento.

## 2026-06-09 - Consolidacion estructural: Hub Central unico y limpieza de raiz

Tipo de cambio: estructural / navegacion / documentacion.

Estado: implementado.

Resultado:
- `index.html` ahora ES el Hub Central: se unificaron la portada institucional y el hub operativo en un solo centro de navegacion en la URL raiz. El contenido proviene del hub operativo (buscador, flujo, secciones, mapa) con rutas ajustadas a raiz.
- `internal/hub-operativo.html` convertido en alias que redirige a `../index.html` preservando query y hash.
- `sporting-marketplace_hub_v29.html` retargeteado para redirigir directo a `index.html` (evita doble salto).
- Links "← Hub" de `gantt-operativo.html` y `config-tarifas.html` actualizados a `../../index.html`. El resto de las paginas internas ya apuntaba a `../../index.html`, por lo que caen en el centro unificado sin cambios.
- Agregada `config-tarifas` al catalogo RESOURCES del buscador del hub (faltaba).
- Limpieza de raiz: `Apps_script_v5.js`, `Config.gs`, `Gantt.gs`, `Headers.gs`, `Utils.gs` movidos a `integrations/apps-script/`; `Mapa del Hub.docx` a `docs/source/`; `MarketPlace Sporting - Sellers (BD).xlsx` a `data/`.
- Eliminados duplicados sin referencias: `config.js` de raiz (superado por `assets/js/config.js`) y carpeta `Logos/` (canonico: `assets/logos/`; cero referencias verificadas por grep).
- Creado `CLAUDE.md` en raiz: mapa del repo y reglas criticas para agentes.
- `README.md` reescrito reflejando la estructura consolidada.

Alcance:
- Los aliases versionados de raiz se mantienen intactos como compatibility layer.
- No se modifico logica funcional de paginas operativas, formularios ni simuladores.
- No se modifico el Apps Script (solo cambio de ubicacion del fuente en el repo).

Validacion:
- grep sin rutas relativas rotas en el nuevo `index.html`.
- referencias a `Logos/` y `config.js` de raiz verificadas como inexistentes antes de eliminar.

## 2026-06-01 - Etapa 1E guardado parcial Relevamiento Perfil

Tipo de cambio: frontend / UX.

Estado: implementado.

Resultado:
- Agregado botón "Guardar borrador" en el area de acciones del formulario de relevamiento.
- Implementadas funciones `buildDraftPayload()`, `getClientProgress()` y `saveDraft()`.
- Al hacer click, postea `tipo_formulario=relevamiento_profile_save` y `modo_guardado=draft` con los campos actuales del form anidados en `fields`.
- Incluye `client_progress` con secciones_completas y secciones_pendientes derivado del progreso visual.
- Feedback en area de status: "Borrador guardado ✓ — X% completitud · estado · fecha".
- Boton deshabilitado si no hay seller_id en la URL.
- Submit historico intacto: sigue usando `tipo_formulario=relevamiento`.

Alcance:
- Solo `public/formularios/formulario-relevamiento.html`.
- No se tocaron Apps Script, CSS externo, otras paginas ni endpoints.

## 2026-06-01 - Etapa 1D frontend precarga Relevamiento Perfil

Tipo de cambio: frontend / UX.

Estado: implementado.

Resultado:
- Agregada funcion `loadPerfilRelevamiento()` en `formulario-relevamiento.html`.
- Al cargar el formulario con `seller_id`, llama `doGet?action=relevamiento_profile_get` y si el perfil existe rellena todos los campos con los datos guardados.
- Encadenada despues de `loadSellerIdentity()` para evitar conflictos de estado.
- Muestra mensaje "Datos precargados desde tu perfil guardado (N campos)" en el area de status.
- Si el perfil no existe o la llamada falla, el formulario abre en blanco normalmente.
- El submit sigue usando `tipo_formulario = "relevamiento"` sin cambios.

Alcance:
- Solo `public/formularios/formulario-relevamiento.html`.
- No se tocaron Apps Script, CSS, otras paginas, submit historico ni endpoints.

## 2026-06-01 - Etapa 1B cierre smoke real Relevamiento Perfil

Tipo de cambio: validacion en produccion / cierre documental.

Estado: cerrado. Deploy real ejecutado y smoke OK.

Resultado:
- Deploy de `Apps_script_v5.js` a `Codigo.gs` en Apps Script real ejecutado sin errores.
- Smoke real OK: `doGet`, `doPost` draft nuevo y update, aislamiento de email/sync/historico y submit historico intacto.
- Etapa 1B queda cerrada. Proxima etapa: 1C migrador dry-run.

## 2026-05-23 - Etapa 1B backend aislado Relevamiento Perfil

Tipo de cambio: backend Apps Script aislado / documentacion.

Estado: implementado localmente; smoke real pendiente.

Resultado:
- Agregado routing aislado para `relevamiento_profile_save` en `doPost`.
- Agregado `action=relevamiento_profile_get` en `doGet`.
- Agregada hoja puente `relevamientos_perfil` con creacion segura y headers no destructivos.
- Implementado upsert por `seller_id`, preservacion de campos omitidos, limpieza solo con `clear_fields` o modo `final`, modos `draft`, `final` y `migration`, validacion de `seller_id` contra `sellers` salvo migracion y rechazo de campos fuera de allowlist.
- `draft` queda aislado: no llama a `escribirEnRelevamientos`, no hace append historico, no envia email, no sincroniza sellers y no actualiza definicion tecnica.

Alcance:
- Se modificaron `Apps_script_v5.js`, `CHANGELOG.md`, `docs/roadmap.md`, `docs/test-matrix.md` y `docs/handoff-post-v1.md`.
- No se tocaron frontend HTML, `Config.gs`, `Gantt.gs`, Google Sheets reales, endpoints publicados, `HEADERS_RELEVAMIENTO`, `escribirEnRelevamientos()`, submit historico, aliases, CSV ni assets.
- No se ejecuto POST real ni submit real.

Validacion:
- `node --check Apps_script_v5.js` OK.
- Smoke mock local OK: save draft nuevo, save draft update, get existente, get inexistente, `clear_fields`, preservacion de campos omitidos y rechazo de campo invalido.
- `git diff --check` OK.

## 2026-05-21 - Etapa 1A contrato Relevamiento Perfil

Tipo de cambio: documentacion / diseno tecnico.

Estado: completado sin cambios funcionales.

Resultado:
- Creado `docs/relevamiento-profile-contract.md` con el contrato propuesto para convertir el Formulario de Relevamiento en perfil editable persistente por `seller_id`.
- Documentados `relevamiento_profile_get` y `relevamiento_profile_save`, payloads, respuestas OK/Error, validaciones minimas, allowlist de campos, modelo de `relevamientos_perfil`, reglas de preservacion, campos vacios y condicionales.
- Documentada la decision de mantener `tipo_formulario = "relevamiento"` intacto y la hoja `relevamientos` como historico append-only.
- Documentados riesgos de lectura publica por `seller_id`, recomendacion futura de token/HMAC y estrategia de migracion desde historicos.

Alcance:
- Solo documentacion: `docs/relevamiento-profile-contract.md`, `CHANGELOG.md`, `docs/roadmap.md`, `docs/test-matrix.md`, `docs/handoff-post-v1.md`.
- No se tocaron frontend, Apps Script, `Config.gs`, Google Sheets, endpoints, payloads reales, CSV, assets, `public/`, `internal/` ni archivos funcionales.
- No se ejecuto POST real ni submit real.

## 2026-05-21 - Etapa 35E cierre documental bloque 33-35

Tipo de cambio: documentacion / cierre operativo.

Estado: completado sin cambios funcionales.

Resultado:
- Cerrado documentalmente el bloque 33-35 del Gantt Operativo Marketplace.
- Consolidado el estado final Timeline v33: columnas oficiales, aliases legacy, campos deprecados, payloads create/update/disable, `QA` / `Productivo`, `seller_nombre`, `depende_de`, hitos por fase y validaciones frontend/backend.
- Documentada la UX operativa vigente: vista Mes, vista Semana centrada, boton `Hoy`, columnas sticky, badges, filtros, recursos compactos, hero compacto, timeline protagonista, selector `depende_de` y dropdowns controlados.
- Registradas decisiones vigentes: backend no valida todavia fase->hito, catalogo fase->hito vive en frontend, `depende_de` es simple, `ver_en_gantt` sigue oculto, sin quick actions/templates/persistencia de filtros/drag and drop/edicion masiva.
- Actualizado handoff para dejar el sistema como estable: smoke real manual OK, create/update/disable OK, sticky columns OK y UX refinada.

Alcance:
- Solo documentacion: `CHANGELOG.md`, `docs/roadmap.md`, `docs/test-matrix.md`, `docs/handoff-post-v1.md`, `docs/data-dictionary-timeline.md`.
- No se tocaron frontend, backend, Apps Script, Google Sheets, Excel, CSV, assets, config, `public/` ni `legacy/`.
- No se ejecuto POST real ni submit real.

## 2026-05-21 - Etapa 35B consolidacion documental Timeline v33/v34/v35

Tipo de cambio: documentacion / handoff operativo.

Estado: completado sin cambios funcionales.

Resultado:
- Consolidado el contrato real de `timeline` v33: `task_id`, `seller_id`, `seller_nombre`, `fase`, `hito`, `tarea`, `responsable`, `depende_de`, `entorno`, `inicio`, `fin`, `estado`, `comentario`, `ver_en_gantt`.
- Documentada la UX operativa vigente: filtros, badges, create/update v33, selector `depende_de`, catalogo de hitos por fase, Mes/Semana, boton `Hoy`, compactacion visual y foco temporal.
- Documentado que `inicio_real` y `fin_real` quedan deprecados; `inicio` y `fin` son oficiales.
- Documentado que `entorno` es obligatorio y acepta `QA` / `Productivo`.
- Documentado que el catalogo fase->hito vive hardcodeado en frontend; backend solo valida `hito` no vacio y no valida aun pertenencia fase->hito.
- Actualizados roadmap, matriz de pruebas, handoff y diccionario para continuidad de futuros chats/equipos.

Alcance:
- Solo documentacion: `CHANGELOG.md`, `docs/roadmap.md`, `docs/test-matrix.md`, `docs/handoff-post-v1.md`, `docs/data-dictionary-timeline.md`.
- No se tocaron frontend, backend, Apps Script, Google Sheets, Excel, CSV, assets, config, `public/` ni `legacy/`.
- No se ejecuto POST real ni submit real.

## 2026-05-21 - Etapa 33F-BACKEND-FIX persistencia seller_nombre

Tipo de cambio: backend Apps Script / compatibilidad create v33.

Estado: implementado localmente; sin POST real.

Resultado:
- Actualizado `Gantt.gs` para aceptar `seller_nombre` como campo opcional en `gantt_task_create`.
- Aliases soportados: `seller_nombre`, `seller_marca`, `Seller / Marca`, `seller`.
- Si la hoja tiene columna `Seller / Marca` o alias compatible, create escribe el snapshot visual del seller.
- Create sin `seller_nombre` sigue funcionando; el campo no es obligatorio.

Alcance:
- Se modificaron `Gantt.gs`, `CHANGELOG.md`, `docs/roadmap.md`, `docs/test-matrix.md` y `docs/data-dictionary-timeline.md`.
- No se tocaron frontend, `Apps_script_v5.js`, Google Sheets, Excel, CSV manual, auditor automatico, endpoints, payloads reales, config, assets, `public/` ni `legacy/`.
- No se ejecuto POST real ni submit real.

## 2026-05-21 - Etapa 33F frontend create/update Timeline v33

Tipo de cambio: frontend operativo / migracion de payloads.

Estado: implementado localmente; sin POST real.

Resultado:
- Actualizado `internal/gantt/gantt-operativo.html` para que alta y edicion usen `inicio`, `fin`, `entorno` y `depende_de`.
- El modal de alta ya no envia `inicio_plan`, `fin_plan`, `inicio_real` ni `fin_real`.
- El modal de edicion ya no envia `inicio_real` ni `fin_real`.
- `gantt_task_disable` queda sin cambios.

Alcance:
- Se modificaron `internal/gantt/gantt-operativo.html`, `CHANGELOG.md`, `docs/roadmap.md` y `docs/test-matrix.md`.
- No se tocaron `Gantt.gs`, `Apps_script_v5.js`, Google Sheets, Excel, CSV manual, auditor automatico, endpoints, config, assets, `public/` ni `legacy/`.
- No se ejecuto POST real ni submit real.

## 2026-05-21 - Etapa 33E Apps Script compatible Timeline v33

Tipo de cambio: backend Apps Script / compatibilidad de modelo.

Estado: implementado localmente; sin tocar datos reales.

Resultado:
- Actualizado `Gantt.gs` para resolver aliases v33 de `inicio`, `fin`, `entorno`, `depende_de` y `ver_en_gantt`.
- `gantt_task_create` acepta payload v33 y compatibilidad temporal con `inicio_plan`, `fin_plan`, `dependencia` y `visible_gantt`.
- `gantt_task_update` permite `estado`, `responsable`, `entorno`, `inicio`, `fin`, `comentario` y `depende_de`; rechaza `inicio_real` y `fin_real`.
- `gantt_task_disable` mantiene `mode:"cancel"` como `Estado = Cancelado` y conserva compatibilidad de ocultamiento con `Ver en Gantt` / `visible_gantt`.

Alcance:
- Se modificaron `Gantt.gs`, `CHANGELOG.md`, `docs/roadmap.md`, `docs/test-matrix.md` y `docs/data-dictionary-timeline.md`.
- No se tocaron HTML, `Apps_script_v5.js`, Google Sheets, Excel, CSV manual, endpoints, payloads reales desde frontend, config, assets, `public/` ni `legacy/`.
- No se ejecuto POST real ni submit real.

## 2026-05-21 - Etapa 33C auditor automatico Timeline v33 + legacy

Tipo de cambio: herramienta read-only / auditoria de datos.

Estado: implementado localmente; sin modificar datos reales.

Resultado:
- Actualizado `tools/audit-timeline-data.js` para reconocer el modelo v33 y aliases legacy.
- El auditor ahora valida `entorno`, `inicio`, `fin`, `depende_de`, `ver_en_gantt`, fechas legacy reales y columnas derivables.
- Regenerado `docs/timeline-data-audit-report.md` con resumen v33, conteo nuevo vs legacy, inconsistencias por severidad y checklist actualizado.
- Resultado del CSV publicado al ejecutar 33C: 14 columnas, 29 tareas `SPT-*`, 25 renderizables, 4 criticas por falta de `inicio`/`fin`, 3 filas no productivas/no `SPT-*`, 0 legacy de fechas plan y 0 legacy de fechas reales.

Alcance:
- Solo lectura del CSV publicado y escritura local del reporte Markdown.
- No se tocaron HTML, frontend, Apps Script, Google Sheets, Excel, endpoints, payloads reales, config, assets, `public/` ni `legacy/`.
- No se ejecuto POST real ni submit real.

## 2026-05-21 - Etapa 33B contrato documental nuevo modelo Timeline

Tipo de cambio: documentacion / contrato de datos.

Estado: completado sin implementacion funcional.

Resultado:
- Formalizado en `docs/data-dictionary-timeline.md` el nuevo contrato canonico de `timeline`: `inicio`, `fin`, `entorno`, `depende_de` y `ver_en_gantt`.
- Documentados aliases legacy obligatorios para `Inicio plan`, `Fin plan`, fechas reales deprecadas, `Ver en Gantt`, `Depende de` y `Seller / Marca`.
- Documentados payloads futuros esperados para `gantt_task_create`, `gantt_task_update` y `gantt_task_disable`.
- Actualizados plan y checklist de saneamiento para indicar que la ejecucion manual debe esperar compatibilidad del bloque 33.
- Registrado plan futuro 33C-33H antes de tocar frontend, Apps Script o Google Sheets.

Alcance:
- Solo documentacion.
- No se tocaron HTML, JS, Apps Script, auditor automatico, Google Sheets, Excel, CSV, endpoints, payloads reales, config, assets, `public/` ni `legacy/`.
- No se ejecuto POST real ni submit real.

## 2026-05-20 - Etapa 32G checklist manual de saneamiento Timeline

Tipo de cambio: documentacion / checklist operativo.

Estado: completado sin modificar datos reales.

Resultado:
- Creado `docs/timeline-cleanup-checklist.md` como checklist manual accionable para sanear `timeline`.
- El checklist transforma el reporte 32F en tandas operativas seguras: correcciones mecanicas, estados, campos operativos, tareas no renderizables y dummies/instrucciones.
- Se documentaron reglas previas obligatorias, validacion despues de cada tanda y decisiones pendientes.
- El saneamiento manual sigue pendiente de ejecucion controlada.

Alcance:
- Solo documentacion.
- No se tocaron Google Sheets, Excel, frontend, Apps Script, endpoints, payloads, config, assets, `public/` ni `legacy/`.
- No se ejecuto POST real ni submit real.

## 2026-05-20 - Etapa 32F reporte automatico de inconsistencias Timeline

Tipo de cambio: herramienta read-only / documentacion de datos.

Estado: implementado localmente; sin modificar datos reales.

Resultado:
- Creado `tools/audit-timeline-data.js` para auditar el CSV publicado de `timeline` con una operacion HTTPS GET, sin credenciales y sin POST.
- Generado `docs/timeline-data-audit-report.md` como checklist automatico de inconsistencias reales.
- El reporte lista tareas `SPT-*` sin campos minimos, fechas no canonicas, dependencia rota, filas no `SPT-*`, `Ver en Gantt = No`, valores fuera de catalogo sugerido y columnas derivables presentes.
- El reporte sirve como insumo previo al saneamiento manual controlado.

Alcance:
- Solo lectura del CSV publicado y escritura local del reporte Markdown.
- No se tocaron Google Sheets, Excel, frontend, Apps Script, endpoints, payloads, config, assets, `public/` ni `legacy/`.
- No se ejecuto POST real ni submit real.

## 2026-05-20 - Etapa 32E plan de saneamiento real Timeline

Tipo de cambio: documentacion / plan operativo de datos.

Estado: completado sin modificar datos.

Resultado:
- Creado `docs/timeline-data-cleanup-plan.md` con plan seguro para sanear la hoja real `timeline`.
- Consolidado el estado detectado en 32C: conteos CSV, tareas `SPT-*`, renderizables, campos vacios, fechas no canonicas y dependencia rota.
- Priorizadas etapas 32F-32J: saneamiento manual controlado, validacion post-saneamiento, catalogos, validaciones frontend/backend y limpieza de columnas derivadas.
- Recomendacion: generar primero un reporte automatico de inconsistencias o checklist concreto, y recien despues ejecutar saneamiento manual controlado.

Alcance:
- Solo documentacion.
- No se tocaron Google Sheets, Excel, frontend, Apps Script, endpoints, payloads, config, assets, `public/` ni `legacy/`.
- No se ejecuto POST real ni submit real.

## 2026-05-20 - Etapa 32D compatibilidad minima Timeline / Ver en Gantt

Tipo de cambio: backend Apps Script / documentacion.

Estado: implementado localmente; sin cambios de datos.

Resultado:
- 32C detecto un gap de alias: la hoja real usa `Ver en Gantt`, el frontend soporta `ver_en_gantt`, pero `Gantt.gs` no reconocia explicitamente `Ver en Gantt` como alias de `visible_gantt`.
- Agregado `Ver en Gantt` a los aliases de `visible_gantt` en `Gantt.gs`.
- Se mantienen los aliases existentes: `visible_gantt`, `visible` y `Visible Gantt`.
- La compatibilidad aplica si en el futuro se usa `gantt_task_disable` con `mode = "hide"` o `mode = "hide_and_cancel"`.
- La baja logica estandar con `mode = "cancel"` no cambia y sigue asociada a `Estado = Cancelado`.
- No se cambian contratos, payloads, responses, endpoints ni frontend.
- La decision funcional sobre si `visible_gantt` sigue o se retira queda pendiente.

Alcance:
- Se modificaron `Gantt.gs`, `docs/data-dictionary-timeline.md`, `CHANGELOG.md`, `docs/roadmap.md` y `docs/test-matrix.md`.
- No se limpiaron ni modificaron Google Sheets, Excel ni CSV.
- No se tocaron `internal/gantt/gantt-operativo.html`, `Apps_script_v5.js`, endpoints, payloads, frontend, `public/`, `legacy/`, config ni assets.

## 2026-05-20 - Etapa 32B diccionario de datos Timeline / Gantt Operativo

Tipo de cambio: documentacion / arquitectura de datos.

Estado: completado sin implementacion funcional.

Resultado:
- Creado `docs/data-dictionary-timeline.md` como contrato documental de la hoja `timeline`.
- Documentadas columnas actuales, aliases, decisiones preliminares, estructura canonica recomendada, catalogos sugeridos, reglas de edicion, riesgos y estrategia de migracion 32C-32G.
- Registrada la auditoria 32A como base del diccionario: `timeline` ya opera como base de datos liviana del Gantt Operativo.

Alcance:
- Solo documentacion.
- No se tocaron HTML, JS, Apps Script, endpoints, payloads, backend, config, assets, CSV ni Google Sheets.

## 2026-05-20 - Etapa 31UX-F cierre documental UX Gantt Operativo

Tipo de cambio: documentacion.

Estado: completado.

Resultado:
- Registrado el cierre del bloque UX operativo del Gantt.
- 31UX-C: auditoria de continuidad detecto nesting HTML inconsistente en el hero operativo.
- 31UX-C-FIX: eliminado un `</div>` sobrante; HTML balanceado, sin cambios funcionales.
- 31UX-D: smoke visual/manual OK informado para hero y toolbar operativos.
- 31UX-E: compactacion final de hero, toolbar, spacing y densidad operativa para mejorar uso vertical del viewport.

Alcance:
- Solo documentacion en `CHANGELOG.md`, `docs/roadmap.md` y `docs/test-matrix.md`.
- No se tocaron HTML, JS, Apps Script, endpoints, payloads, backend, config, assets ni Google Sheets durante esta etapa.

## 2026-05-20 - Etapa 31UX-B compactar cabecera operativa Gantt

Tipo de cambio: UX/UI visual acotado.

Estado: implementado localmente.

Resultado:
- Compactado el hero operativo de `internal/gantt/gantt-operativo.html`.
- El flujo 01-05 queda visualmente reducido como chips operativos.
- `Reglas de lectura` pasa a bloque colapsable con `details/summary`.
- `Accesos operativos` mantiene links, pero con menor altura y menor protagonismo visual.
- KPIs y toolbar quedan visualmente mas cerca del Gantt/Lista.
- Se mantiene topbar con `+ Nueva tarea`, `Actualizar` y `Hub`.
- Se mantienen alertas superiores.

Alcance:
- Solo CSS/HTML visual en Gantt Operativo.
- No se tocaron filtros JS, render dinamico, calculos, KPIs, payloads, backend, Apps Script ni Google Sheets.

Validaciones:
- Revision estatica de estructura: OK.
- Links de accesos operativos conservan `href`: OK.
- `+ Nueva tarea`, `Actualizar` y `Hub` siguen presentes en topbar: OK.
- `git diff --check`: OK.

## 2026-05-20 - Fix visibilidad boton `+ Nueva tarea` Gantt

Tipo de cambio: UI bugfix acotado.

Estado: implementado localmente.

Resultado:
- Movido el boton `+ Nueva tarea` desde la toolbar interna del contenido hacia la topbar superior derecha.
- El boton queda junto a `Actualizar` y `Hub`.
- Se mantiene llamada existente a `openCreateTask()`.
- Se elimina el boton anterior de la toolbar para evitar duplicados.
- No se cambia logica de alta, payload, backend ni Apps Script.

Validaciones:
- El boton existe una sola vez en el HTML.
- El boton llama a `openCreateTask()`.
- La ubicacion no depende de vista Gantt/Lista, filtros, seller seleccionado ni render del contenido.
- `git diff --check`: OK.

## 2026-05-20 - Etapa 31W actualizacion PROJECT_WORKFLOW y auditoria documental

Tipo de cambio: metodologia / documentacion.

Estado: completado.

Resultado:
- Actualizado `PROJECT_WORKFLOW.md` para reflejar la metodologia real actual de Marketplace Portal.
- Formalizada la regla de validacion manual humana vs validacion asistida por IA.
- Agregada regla: Codex no debe gastar tokens en smoke visual/manual cuando el usuario indique que lo validara personalmente.
- Agregada regla: si el usuario valida manualmente una implementacion local, Codex solo documenta el cierre si se lo piden.
- Reforzada la politica de commits manuales por PowerShell.
- Reforzada la regla de usar Codex con Fast OFF e inteligencia alta para cambios criticos.
- Documentada la capa de compatibilidad de raiz: aliases, `legacy/root-html-v1/`, `legacy/`, `Logos/` y `assets/logos/` no se limpian fisicamente sin etapa explicita y smoke de URLs historicas.
- Agregada auditoria de limpieza documental con candidatos, riesgos y recomendacion.

Recomendacion:
- No limpiar archivos ahora.
- Postergar cualquier limpieza fisica a una etapa dedicada con auditoria de referencias y smoke de aliases/URLs historicas.

Alcance:
- Solo documentacion.
- No se tocaron codigo funcional, Apps Script, `internal/`, `public/`, `legacy/`, config, endpoints, payloads ni Google Sheets.

## 2026-05-20 - Etapa 31C2I UI baja logica Gantt

Tipo de cambio: UI operativa controlada.

Estado: implementado localmente; POST real no ejecutado.

Resultado:
- Agregada accion `Dar de baja` en el modal de detalle de `internal/gantt/gantt-operativo.html`.
- En tareas `Cancelado`, la accion queda deshabilitada como `Tarea cancelada`.
- La accion solicita motivo breve y confirmacion antes de enviar.
- Payload generado:
  - `tipo_formulario = "gantt_task_disable"`
  - `updated_by = "front@gantt-operativo"`
  - `mode = "cancel"`
  - `reason`
- No se usa ni envia `visible_gantt`.
- No se borra ninguna fila.
- Tras OK se muestra feedback y se ejecuta `loadData(true)`.
- Alta y edicion existentes quedan sin cambios de contrato.

Validaciones:
- Smoke aislado con DOM/fetch mockeado sobre `TASK-DUMMY-QA`: OK.
- Payload capturado con `mode:"cancel"` y sin `visible_gantt`: OK.
- Feedback OK y recarga `loadData(true)` mockeada: OK.
- Rama de error mantiene feedback en modal: revisada.
- Sintaxis total con Node local no aplica por optional chaining preexistente en el archivo.

Alcance:
- Se modifico `internal/gantt/gantt-operativo.html` y documentacion.
- No se tocaron Apps Script, `Gantt.gs`, `Apps_script_v5.js`, Google Sheets, backend, config, `public/`, `legacy/`, formularios ni simuladores.

Riesgos residuales:
- Falta smoke manual visual en navegador.
- Falta POST real controlado solo con tarea dummy autorizada.
- CSV publicado puede demorar en reflejar el estado `Cancelado`.

## 2026-05-20 - Etapa 31C2G hardening minimo backend Gantt

Tipo de cambio: backend Apps Script / hardening acotado.

Estado: implementado localmente; pendiente deploy y smoke real con tarea dummy.

Resultado:
- Agregado hardening minimo en `Gantt.gs` para:
  - `gantt_task_update`
  - `gantt_task_create`
  - `gantt_task_disable`
- Las funciones publicas mantienen nombres y contratos usados por `Apps_script_v5.js`.
- Agregado wrapper con `LockService.getScriptLock()` y timeout controlado de 10000 ms.
- El lock se libera en `finally`.
- Agregada normalizacion de identidad declarativa:
  - `created_by`
  - `updated_by`
  - fallbacks controlados por operacion si no vienen.
- La identidad declarativa no se usa todavia como permiso real.
- Reutilizada auditoria opcional existente sin crear hojas ni columnas nuevas.
- Ampliados alias de columnas de auditoria para registrar timestamp, operacion, actor y campos afectados si la hoja compatible existe.

Validaciones:
- `node --check Apps_script_v5.js`: OK.
- Carga conjunta local con `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs` y `Apps_script_v5.js`: OK.
- Smoke mock `gantt_task_update`: OK.
- Smoke mock `gantt_task_create`: OK.
- Smoke mock `gantt_task_disable`: OK.
- Timeout de lock simulado: error controlado OK.
- Revision de duplicados: OK.
- `git diff --check`: OK, solo avisos CRLF.

Alcance:
- Se modifico `Gantt.gs` y documentacion.
- No se toco `Apps_script_v5.js`.
- No se tocaron front, Google Sheets, endpoints, payloads, `internal/`, `public/`, `legacy/`, `config.js` ni `assets/js/config.js`.

Riesgos residuales:
- Falta deploy y smoke real con tarea dummy.
- Falta autorizacion server-side por token/allowlist.
- Falta idempotencia por `request_id`.
- La auditoria sigue dependiendo de que exista una hoja compatible.

## 2026-05-20 - Etapa 31C2F auditoria hardening Gantt Apps Script

Tipo de cambio: auditoria tecnica / documentacion.

Estado: documentado.

Resultado:
- Auditado el hardening necesario antes de seguir agregando UI o permisos avanzados sobre Gantt Operativo.
- Priorizados riesgos de autorizacion, identidad declarativa, concurrencia, auditoria y baja logica.
- Documentada recomendacion de no confiar en `created_by` / `updated_by` enviados desde el front como identidad real.
- Documentado uso recomendado de autorizacion server-side mediante allowlist, token simple o modelo mixto.
- Documentado uso recomendado de `LockService` para `gantt_task_create`, `gantt_task_update` y `gantt_task_disable`.
- Documentado modelo de auditoria sugerido para `timeline_log` o log equivalente.
- Confirmado criterio operativo: no usar `visible_gantt` en UI mientras no exista en CSV real.
- Recomendado implementar primero permisos, luego lock, luego logs, y recien despues UI de baja logica con `mode = "cancel"`.

Riesgos priorizados:
- P0: endpoint Apps Script expuesto sin autorizacion fuerte.
- P0: `created_by` / `updated_by` manipulables desde cliente.
- P0: duplicados concurrentes durante generacion de `task_id`.
- P1: updates simultaneos sin control de version.
- P1: auditoria insuficiente para rollback o trazabilidad.

Alcance:
- Solo documentacion.
- No se tocaron Apps Script, front, Google Sheets, endpoints, payloads, `internal/`, `public/`, `legacy/`, `config.js` ni `assets/js/config.js`.

## 2026-05-20 - Etapa 31C-HANDOFF consolidacion post 31C2E

Tipo de cambio: documentacion / handoff.

Estado: completado.

Resultado:
- Actualizado el handoff y roadmap para continuar el proyecto en un nuevo chat sin perdida de contexto.
- Consolidado el estado del bloque 31B-31C2E.
- Arquitectura Apps Script vigente documentada:
  - `Apps_script_v5.js` como fachada estable.
  - `Config.gs`, `Headers.gs`, `Utils.gs` y `Gantt.gs`.
- Funcionalidades Gantt aprobadas documentadas:
  - `gantt_task_update`
  - `gantt_task_create`
  - `gantt_task_disable`
- Compatibilidad documentada para headers reales de `timeline` en fila 3 y alias `ID Tarea`.
- Estado UI documentado:
  - edicion OK.
  - alta OK.
  - baja logica desde UI pendiente.
- Smokes reales aprobados documentados:
  - backend Apps Script.
  - CSV publicado.
  - UI create con dummy `SPT-001-T-30`.
- Riesgos residuales y proximas etapas sugeridas documentadas.
- Recomendacion explicita: abrir nuevo chat por contexto alto con Codex, Fast OFF e Inteligencia Alta.

Alcance:
- Solo documentacion.
- No se tocaron Apps Script, backend, front, `internal/`, `public/`, `legacy/`, `config.js`, `assets/js/config.js`, Google Sheets ni endpoints.
- V1 sigue estable; no hubo refactor masivo ni ruptura detectada de endpoints existentes.

## 2026-05-20 - Etapa 31C2E smoke UI alta Gantt

Tipo de cambio: validacion UI/backend controlada y documentacion.

Estado: aprobado con observacion.

Resultado:
- Carga local de `internal/gantt/gantt-operativo.html` en Chrome headless: OK.
- Boton `+ Nueva tarea` presente: OK.
- Modal de creacion presente: OK.
- Smoke logico de UI con DOM mockeado: apertura/cierre, validaciones, payload, feedback OK/error y recarga `loadData(true)` OK.
- Payload generado por la UI no incluye `task_id`.
- Payload generado por la UI no incluye `visible_gantt`.
- Alta real dummy ejecutada con el payload de UI autorizado.
- Apps Script respondio `ok:true`, `task_id:"SPT-001-T-30"`, `row_number:79`.
- CSV publicado confirmo la tarea `SPT-001-T-30` con:
  - `Tarea = Tarea dummy QA desde UI`
  - `Hito = QA Front`
  - `Estado = Pendiente`
  - `Comentario = Alta QA desde UI 31C2E`
- Carga posterior en Chrome headless confirmo que el DOM renderizado contiene la tarea y el `task_id`.

Observacion:
- No se pudo usar DevTools remoto para clicks reales por limitacion del entorno; la interaccion se valido con DOM mockeado ejecutando las funciones reales del front.
- No se tocaron tareas productivas.

## 2026-05-20 - Etapa 31C2D UI crear tarea Gantt

Tipo de cambio: UI operativa controlada.

Estado: implementado localmente; POST real no ejecutado.

Resultado:
- Agregado boton `+ Nueva tarea` en la toolbar de `internal/gantt/gantt-operativo.html`.
- Agregado modal de creacion con campos minimos:
  - `seller_id`
  - `fase`
  - `hito`
  - `tarea`
  - `responsable`
  - `inicio_plan`
  - `fin_plan`
  - `estado`
  - `comentario`
- El front no muestra ni envia `visible_gantt`.
- El front no genera ni envia `task_id`.
- El payload usa `tipo_formulario = "gantt_task_create"` y `created_by = "front@gantt-operativo"`.
- Se agregaron validaciones front para campos obligatorios, estado permitido, fechas validas y rango planificado.
- Se requiere confirmacion antes de enviar.
- Tras respuesta OK se muestra feedback y se recarga el CSV con `loadData(true)`.
- La edicion existente queda separada y sin cambios de contrato.

Validaciones:
- `git diff --check` sobre el archivo Gantt: OK.
- Revision estatica del diff: OK.
- POST real no ejecutado.
- Syntax check completo con Node local no aplico porque el archivo ya contiene optional chaining no soportado por el Node disponible.

Alcance:
- Solo se modifico `internal/gantt/gantt-operativo.html` y documentacion.
- No se tocaron Apps Script, `Gantt.gs`, `Apps_script_v5.js`, Google Sheets, config, front publico, formularios, simuladores ni endpoints existentes.

## 2026-05-20 - Etapa 31C2C smoke real alta/baja Gantt

Tipo de cambio: validacion real controlada y documentacion.

Estado: aprobado.

Resultado:
- `doGet` real respondio `status:"ok"`.
- `gantt_task_create` real creo la tarea dummy `TASK-DUMMY-QA-CREATE`.
- La tarea fue creada en `timeline` con `row_number: 78`.
- El CSV publicado confirmo la fila con `Estado = Pendiente` y `Comentario = Alta QA controlada`.
- `gantt_task_disable` real con `mode = "cancel"` actualizo la misma tarea dummy.
- El CSV publicado confirmo `Estado = Cancelado` y `Comentario = Baja logica QA controlada`.
- La fila no fue borrada; la tarea sigue visible en la lectura CSV con el mismo `task_id`.
- `gantt_task_update` sin `task_id` mantuvo error controlado `Falta task_id`.
- Endpoint existente `seller` sin `seller_id` mantuvo error controlado `Falta seller_id en el formulario`.
- Responses JSON mantuvieron formato estable.

Observaciones:
- La hoja real no expuso `visible_gantt` en el CSV consultado; por eso el smoke uso `mode = "cancel"` y no intento ocultar.
- No se ejecutaron pruebas sobre tareas productivas.
- No se modifico front ni se implementaron funciones nuevas durante 31C2C.

## 2026-05-20 - Etapa 31C2B endpoint QA baja logica tareas Gantt

Tipo de cambio: Apps Script QA controlado y documentacion.

Estado: implementado localmente; escritura real no ejecutada.

Resultado:
- Agregado routing minimo `tipo_formulario = "gantt_task_disable"` en `Apps_script_v5.js`.
- Agregada funcion `darDeBajaTareaGantt` en `Gantt.gs`.
- El endpoint busca tareas por `task_id` / `ID Tarea` usando los helpers Gantt existentes.
- No borra filas fisicamente.
- Modos soportados:
  - `hide`: escribe `visible_gantt = No`.
  - `cancel`: escribe `estado = Cancelado`.
  - `hide_and_cancel`: escribe ambos campos.
- Registra `reason` en `comentario` si existe la columna.
- Registra `updated_at` / `updated_by` solo si esas columnas existen.
- Registra auditoria solo si existe hoja compatible.
- No crea columnas nuevas ni modifica estructura de hoja.

Validaciones:
- `node --check Apps_script_v5.js` OK.
- Carga conjunta local de `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs` y `Apps_script_v5.js` OK.
- Smoke mockeado `hide` OK.
- Smoke mockeado `cancel` OK.
- Smoke mockeado `hide_and_cancel` OK con headers reales en fila 3.
- Error por `task_id` faltante OK.
- Error por `task_id` inexistente OK.
- Error por `task_id` duplicado OK.
- Error por falta de `visible_gantt` en modo `hide` OK.
- Error por falta de `estado` en modo `cancel` OK.
- Smoke extra `gantt_task_update` OK.
- Smoke extra `gantt_task_create` OK.
- Escritura real no ejecutada.

Payload QA sugerido:

```json
{
  "tipo_formulario": "gantt_task_disable",
  "task_id": "TASK-DUMMY-QA-CREATE",
  "updated_by": "qa@marketplace.local",
  "mode": "hide_and_cancel",
  "reason": "Baja logica QA controlada"
}
```

Alcance:
- No se tocaron `internal/`, `public/`, `legacy/`, `config.js`, `assets/js/config.js`, Google Sheets, front, sellers, gestion_seller, calificacion, relevamiento, definicion_tecnica ni endpoints existentes.
- `gantt_task_update` y `gantt_task_create` se mantienen compatibles.

## 2026-05-20 - Etapa 31C2A endpoint QA crear tareas Gantt

Tipo de cambio: Apps Script QA controlado y documentacion.

Estado: implementado localmente; escritura real no ejecutada.

Resultado:
- Agregado routing minimo `tipo_formulario = "gantt_task_create"` en `Apps_script_v5.js`.
- Agregada funcion `crearTareaGantt` en `Gantt.gs`.
- El endpoint crea una fila nueva en `timeline` usando la fila real de headers detectada por `obtenerHeadersTimelineGantt()`.
- Soporta header visual `ID Tarea`.
- Si no viene `task_id`, Apps Script genera uno seguro a partir de `seller_id` y el siguiente correlativo.
- Si viene `task_id`, valida duplicado antes de insertar.
- Defaults aplicados: `estado = Pendiente`, `visible_gantt = No`, `comentario = ""`.
- No crea columnas nuevas, no borra filas, no modifica estructura de hoja y no altera formulas.

Validaciones:
- `node --check Apps_script_v5.js` OK.
- Carga conjunta local de `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs` y `Apps_script_v5.js` OK.
- Smoke mockeado create OK con headers en fila 1.
- Smoke mockeado create OK con headers reales en fila 3.
- Error por `seller_id` faltante OK.
- Error por fecha invalida OK.
- Error por `fin_plan` anterior a `inicio_plan` OK.
- Error por `task_id` duplicado OK.
- Defaults `estado` y `visible_gantt` OK.
- Escritura real no ejecutada.

Payload QA sugerido:

```json
{
  "tipo_formulario": "gantt_task_create",
  "created_by": "qa@marketplace.local",
  "task": {
    "task_id": "TASK-DUMMY-QA-CREATE",
    "seller_id": "SPT-001",
    "fase": "Operativa",
    "hito": "Carga comercial inicial",
    "tarea": "Tarea dummy QA desde Apps Script",
    "responsable": "eCommerce",
    "inicio_plan": "2026-06-20",
    "fin_plan": "2026-06-21",
    "estado": "Pendiente",
    "visible_gantt": "No",
    "comentario": "Alta QA controlada"
  }
}
```

Alcance:
- No se tocaron `internal/`, `public/`, `legacy/`, `config.js`, `assets/js/config.js`, Google Sheets, front, sellers, gestion_seller, calificacion, relevamiento, definicion_tecnica ni endpoints existentes.
- `gantt_task_update` se mantiene compatible.

## 2026-05-20 - Etapa 31C2 diseno alta/baja controlada tareas Gantt

Tipo de cambio: documentacion tecnica.

Estado: completado sin implementacion funcional.

Resultado:
- Documentado el diseno para futuras operaciones `gantt_task_create` y `gantt_task_disable`.
- Se definieron campos minimos, validaciones, estrategia de `task_id` / `ID Tarea`, manejo de dependencias y baja logica.
- Recomendacion principal: no borrar filas fisicamente; preferir `visible_gantt = No` para ocultar del Gantt y `estado = Cancelado` para comunicar cancelacion operativa. Si en el futuro existe `disabled_at`, usarlo como auditoria adicional, no como unico indicador.
- Smoke futuro recomendado con tarea dummy `TASK-DUMMY-QA-CREATE` o prefijo QA equivalente.

Alcance:
- Solo se modifico documentacion.
- No se implementaron endpoints nuevos.
- No se modifico `gantt_task_update`.
- No se tocaron `Gantt.gs`, `Apps_script_v5.js`, Google Sheets, front, endpoints, payloads actuales, `internal/`, `public/`, `legacy/`, `config.js` ni `assets/js/config.js`.

## 2026-05-20 - Etapa 31C-fix alias ID Tarea Gantt

Tipo de cambio: fix tecnico acotado.

Estado: implementado localmente; pendiente deploy/revalidacion real con `TASK-DUMMY-QA`.

Resultado:
- `Gantt.gs` ahora reconoce `ID Tarea`, `Id Tarea` e `id tarea` como alias validos de `task_id` / `id_tarea`.
- El payload externo sigue usando `task_id`.
- Responses OK/error se mantienen identicas.
- No se renombra la columna en Google Sheets.
- No se tocaron `Apps_script_v5.js`, `doPost`, `doGet`, sellers, gestion_seller, calificacion, relevamiento, definicion tecnica, front, endpoints ni payloads.

Validaciones:
- `node --check Apps_script_v5.js` OK.
- Carga conjunta local de `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs` y `Apps_script_v5.js` OK.
- Revision de simbolos: 85 simbolos, sin duplicados.
- Smoke mockeado con header `ID Tarea`: OK.
- Error por `task_id` faltante: OK.
- Error por `task_id` inexistente: OK.
- `doGet` real OK.
- POST real no destructivo sin `task_id` OK.
- POST real con `TASK-DUMMY-QA` queda pendiente hasta subir el fix al Apps Script real.

Revalidacion real:
- `doGet` real OK.
- POST real sin `task_id` OK con `error:"Falta task_id"`.
- POST real autorizado con `TASK-DUMMY-QA` fallo con `La hoja "timeline" no tiene columna task_id / id_tarea`.
- Conclusion: el fix local de alias `ID Tarea` aun no esta activo en el proyecto Apps Script real, o el Web App sigue usando una version anterior.
- No hubo escritura exitosa evidenciada.

Nota futura:
- 31C2 podria abordar alta/desactivacion de tareas Gantt desde front.
- No se recomienda borrar tareas fisicamente; preferir baja logica con `visible_gantt = No` o `estado = Cancelado`.

## 2026-05-20 - Etapa 31C modularizacion controlada Gantt Apps Script

Tipo de cambio: refactor tecnico acotado.

Estado: implementado localmente sin deploy activo.

Resultado:
- Creado `Gantt.gs`.
- Movida desde `Apps_script_v5.js` solo la logica exclusiva de `gantt_task_update`, incluyendo validaciones, helpers Gantt, metadatos y auditoria Gantt.
- `Apps_script_v5.js` conserva `doPost`, `doGet` y routing principal como fachada estable.
- Payloads y responses de `gantt_task_update` se mantienen identicos.
- No se tocaron sellers, gestion_seller, calificacion, relevamiento, definicion tecnica, formularios, simuladores, `internal/`, `public/`, `legacy/`, config, endpoints ni Google Sheets.

Validaciones:
- `node --check Apps_script_v5.js` OK.
- Carga conjunta mockeada de `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs` y `Apps_script_v5.js` OK.
- Revision de simbolos: 84 simbolos, sin duplicados.
- Smoke mockeado `gantt_task_update` OK.
- Smoke mockeado error por `task_id` faltante OK.
- No se ejecuto escritura real.

Validacion real post 31C:
- `doGet` real del Web App respondio `status:"ok"` con hojas esperadas.
- POST real no destructivo `gantt_task_update` sin `task_id` respondio `ok:false` con `error:"Falta task_id"`.
- Esto confirma que `Gantt.gs` y helpers modularizados estan integrados en el proyecto real.
- POST controlado con `TASK-DUMMY-QA` no escribio: fallo antes por `La hoja "timeline" no tiene columna task_id / id_tarea`.
- 31D queda pendiente hasta revisar/confirmar el header real de `timeline`.

## 2026-05-19 - Etapa 31B modularizacion minima Apps Script

Tipo de cambio: refactor tecnico acotado.

Estado: implementado localmente sin deploy activo.

Resultado:
- Creados `Config.gs`, `Headers.gs` y `Utils.gs`.
- Movidas solo constantes globales estaticas, helpers de respuesta HTTP y utilidades generales sin side effects de negocio.
- `Apps_script_v5.js` conserva `doPost`, `doGet`, routing y toda la logica de Gantt, sellers, calificacion, relevamiento, definicion tecnica, Sheets y emails.
- Agregado `errorResponse(err)` con el mismo formato de error existente.
- Validado smoke mockeado de rutas `seller`, `gestion_seller`, `calificacion`, `relevamiento`, `gantt_task_update` y error por falta de `seller_id`.
- No se tocaron front, config central JS, endpoints, payloads, formularios, simuladores, Google Sheets, deploy activo, `internal/`, `public/` ni `legacy/`.

Validacion post implementacion:
- GET no destructivo al Web App real respondio `status:"ok"` con hojas esperadas.
- Revision local de simbolos en `Config.gs`, `Headers.gs`, `Utils.gs` y `Apps_script_v5.js`: 84 simbolos, sin duplicados conflictivos.
- Smoke mockeado de `doPost/doGet` cargando los 4 archivos juntos: OK.
- No se ejecutaron POST reales ni escrituras en Google Sheets.
- Limitacion: el repo no contiene `.clasp.json` ni `appsscript.json`; no se pudo listar archivos remotos del proyecto Apps Script desde Codex.

## 2026-05-19 - Etapa 31A auditoria modularizacion Apps Script

Tipo de cambio: auditoria tecnica y documentacion.

Estado: completado sin cambios funcionales.

Resultado:
- Auditado `Apps_script_v5.js` para futura modularizacion segura.
- Creado `docs/apps-script-modularizacion.md` con diagnostico, mapa funcional, dependencias cruzadas, riesgos, arquitectura propuesta y estrategia 31B-31E.
- Recomendacion principal: no hacer refactor masivo; mantener `doPost` como fachada estable y migrar por etapas.
- Riesgos criticos identificados: routing `doPost`, headers con comportamiento destructivo/no destructivo, side effects de calificacion/relevamiento, namespace global Apps Script y deploy parcial.
- No se modifico `Apps_script_v5.js`, config, front, endpoints, payloads, formularios, simuladores, Google Sheets, `public/` ni `legacy/`.

## 2026-05-19 - Etapa 30E3 UI controlada edicion Gantt Operativo

Tipo de cambio: interfaz operativa controlada y documentacion.

Estado: implementado sin ejecutar escritura real.

Resultado:
- Agregado boton `Editar tarea` dentro del modal de detalle de `internal/gantt/gantt-operativo.html`.
- Agregado modal de edicion para `estado`, `responsable`, `inicio_real`, `fin_real` y `comentario`.
- El front construye payload `tipo_formulario = "gantt_task_update"` con `task_id` de la tarea seleccionada.
- Se requiere confirmacion antes de guardar.
- Se muestra feedback OK/error.
- Tras OK, la vista se actualiza localmente y el modal de detalle se reabre con mensaje de confirmacion.
- No se exponen como editables `task_id`, `seller_id`, seller, fase, hito, dependencia, `visible_gantt`, fechas planificadas, formulas ni columnas calculadas.
- No se modifico Apps Script, config, CSV URLs, formularios, simuladores, `public/` ni `legacy/`.

## 2026-05-19 - Etapa 30E1 endpoint QA Apps Script Gantt

Tipo de cambio: Apps Script controlado y documentacion.

Estado: implementado sin prueba de escritura real.

Resultado:
- Agregado soporte para `tipo_formulario = "gantt_task_update"` en `Apps_script_v5.js`.
- El endpoint busca tareas por `task_id` / `id_tarea` en la hoja `timeline`.
- Permite actualizar solo campos de bajo riesgo: `estado`, `responsable`, `inicio_real`, `fin_real`, `comentario`.
- Rechaza campos no permitidos, `task_id` faltante/inexistente/duplicado, fechas invalidas y estados fuera de enum.
- No crea columnas nuevas ni cambia estructura de Google Sheets.
- Registra `updated_at` / `updated_by` solo si las columnas ya existen.
- Registra auditoria solo si ya existe una hoja compatible.
- Documentado payload dummy recomendado en `docs/gantt-operativo-edicion.md` y `docs/test-matrix.md`.
- No se modifico el front del Gantt y no se ejecuto escritura real.

## 2026-05-19 - Etapa 30D diseno tecnico edicion Gantt Operativo

Tipo de cambio: documentacion tecnica.

Estado: completado.

Resultado:
- Documentada arquitectura futura para editar tareas del Gantt Operativo via Apps Script.
- Creado `docs/gantt-operativo-edicion.md` con estado actual, contrato propuesto, campos editables/no editables, validaciones, riesgos y etapas 30E1-30E4.
- Se definio operacion futura `tipo_formulario: "gantt_task_update"`.
- Se recomienda iniciar solo con campos de bajo riesgo y tarea dummy/QA.
- No se implemento escritura ni se modificaron archivos funcionales.
- Sin cambios en `internal/gantt/gantt-operativo.html`, Apps Script, config, CSV URLs, Google Sheets, formularios, simuladores, `public/` ni `legacy/`.

## 2026-05-19 - Etapas 29B/29C logo interno clickeable

Tipo de cambio: normalizacion visual/navegacional interna y cierre documental.

Estado: completado y validado.

Resultado:
- Etapa 29B implementada: logos internos normalizados como links hacia la portada institucional `index.html`.
- Se mantuvo el texto exacto `SPORTING <span>MARKETPLACE</span>`.
- Rutas confirmadas: `../index.html` desde `internal/hub-operativo.html` y `../../index.html` desde paginas bajo `internal/*/*`.
- `index.html` queda como excepcion institucional y puede no linkear a si mismo.
- La maqueta Seller Center conserva su estetica visual, pero la marca principal ahora vuelve a portada.
- Etapa 29C validada con smoke HTTP local, validacion estatica de hrefs y capturas Chrome headless desktop/mobile del alcance interno.
- Sin cambios en HTML, CSS ni JS funcional durante 29C; solo documentacion.
- Sin cambios en Apps Script, config, `assets/js/config.js`, `public/`, `legacy/`, formularios, payloads, endpoints, simuladores funcionales, formulas ni timeline Gantt.

## 2026-05-19 - Etapa 28B navegacion publica seller-facing con seller_id

Tipo de cambio: navegacion publica critica acotada.

Estado: completado.

Resultado:
- Agregada navegacion publica entre Presentacion, Simulador, Calificacion y Relevamiento.
- Los links cruzados se construyen localmente desde `URLSearchParams` y preservan `seller_id` cuando existe en la URL actual.
- Presentacion mantiene CTA principal a Calificacion, ahora con ruta relativa publica segura en vez de depender del `BASE_URL` absoluto para esa navegacion.
- Simulador mantiene CTA principal a Calificacion y suma accesos a Presentacion y Relevamiento.
- Calificacion suma navegacion publica y CTA no invasivo `Ir a relevamiento`.
- Relevamiento suma navegacion publica secundaria sin alterar el formulario.
- Sin cambios en submit, payloads, endpoints, Apps Script, calculos, validaciones, campos `name/id/value/data-*`, `action/method`, hidden `seller_id`, config, aliases, legacy ni paginas internas.

## 2026-05-19 - Etapa 27F normalizacion interna de headers/topbars

Tipo de cambio: visual estructural acotado.

Estado: completado.

Resultado:
- Normalizados headers/topbars internos con marca `SPORTING MARKETPLACE`, label de seccion corto, status breve y acciones a la derecha.
- Estandarizados labels de navegacion interna: `← Portal`, `← Hub` y `← Backlog`.
- Corregido Gantt Operativo para volver al Hub Operativo real mediante `../hub-operativo.html`.
- Agregada accion `+ Seller` en Backlog Sellers hacia `gestion-sellers.html`.
- Agregada accion explicita `← Portal` en Simulador Economico.
- Reforzado comportamiento mobile de topbars internas para priorizar marca, wrappear acciones y ocultar labels secundarios cuando corresponde.
- Conservadas variantes: `index.html` institucional, `public/` seller-facing y maqueta de Seller Center.
- Sin cambios en scripts, JS funcional, submit, endpoints, payloads, Apps Script, config, formulas, calculos, render dinamico, `seller_id`, aliases, legacy ni campos.

## 2026-05-19 - Etapa 27B unificacion global de headers/topbars

Tipo de cambio: visual estructural.

Estado: completado.

Resultado:
- Normalizado el patron de header/topbar con marca `SPORTING MARKETPLACE`, seccion en uppercase, separador sutil y acciones alineadas a la derecha.
- Ajustados headers internos, publicos seller-facing, paginas estrategicas, Backlog, Gestion, Gantt, Seller Center y Simuladores.
- Incorporada capa CSS compartida para altura, espaciado, marca, section label, botones y estados visuales del header.
- Conservadas variantes minimas en formularios seller-facing, donde el header es hero informativo y no topbar fija.
- Sin cambios en scripts, JS funcional, submit, endpoints, payloads, Apps Script, config, formulas, calculos, render dinamico, `seller_id`, rutas criticas ni campos.

## 2026-05-19 - Etapa 27A UI Foundation Refactor

Tipo de cambio: visual fuerte.

Estado: completado.

Resultado:
- Ajustada la base visual del Marketplace Portal hacia una estetica mas enterprise/SaaS, menos densa y menos dependiente del verde.
- Revisados tokens, componentes internos, CSS por familia y overrides visuales inline seguros.
- Reducidos glow, sombras fuertes, bordes dobles, tracking excesivo, uppercase en controles y fondos demasiado verdes.
- Mejorada legibilidad general con body cercano a 15px, line-height mas comodo, metadata mas clara y superficies mas sobrias.
- Conservados intactos scripts, JS funcional, submit, endpoints, payloads, Apps Script, config, formulas, calculos, render dinamico, `seller_id`, rutas criticas y campos.

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
