# Handoff corto post-V1 - Marketplace Portal

Fecha: 2026-05-20

## Estado actual

- V1 y post-V1 estan cerrados.
- `index.html` es la portada institucional.
- `internal/hub-operativo.html` es el Hub Operativo oficial.
- `sporting-marketplace_hub_v29.html` funciona como alias hacia `internal/hub-operativo.html`.
- Los HTML versionados en raiz funcionan como aliases activos de compatibilidad.
- `legacy/root-html-v1/` queda reservado para snapshots historicos futuros.
- La auditoria estructural 18A cerro sin links locales rotos detectados y sin limpieza fisica.
- Bloque Apps Script 31B-31C2E queda funcionalmente estabilizado.
- V1 sigue estable; no hubo refactor masivo ni ruptura detectada de endpoints existentes.

## Cambios recientes

- `assets/css/internal-components.css` fue creado y aplicado a paginas internas autorizadas.
- La limpieza CSS se aplico solo en paginas informativas de estrategia.
- Las paginas internas operativas quedaron excluidas de limpieza CSS por relacion riesgo/beneficio.
- `assets/js/internal-navigation.js` fue creado y aplicado solo a paginas informativas seleccionadas.
- No se extrajo JS operativo.
- Las paginas publicas seller-facing siguen independientes del CSS interno compartido.
- Bloque 20A-20G cerrado: revision de contenido de portada institucional, paginas estrategicas, Seller Center, paginas publicas seller-facing, maqueta Seller Center y normalizacion final de textos visibles.
- Bloque 22A-22E cerrado: mejoras UX/copy operativo en Backlog Sellers, Gestion Sellers, Simulador Economico interno, Gantt Operativo y Gantt Seller Center, sin tocar logica funcional.
- Bloque 23B-23G cerrado: CSS por familias internas para Backlog Sellers, Gantt, Simulador Economico interno, Gestion Sellers y Seller Center index.
- Bloque 24B-24F cerrado: CSS publico seller-facing con `public-seller.css` aplicado a formularios, presentacion seller y simulador seller.
- Bloque 26A-26D cerrado: auditoria visual global PRO, pulido visual global, smoke visual post-push OK y cierre documental.
- Bloque 27A-27F cerrado: base visual enterprise/SaaS, headers/topbars internos normalizados y navegacion interna consistente.
- Bloque 28B cerrado: navegacion publica seller-facing entre Presentacion, Simulador, Calificacion y Relevamiento preservando `seller_id`.
- Bloque 29B-29C cerrado: logos internos clickeables hacia `index.html`, validados con smoke HTTP local y capturas desktop/mobile.
- Bloque 30D cerrado: diseno tecnico documentado para futura edicion del Gantt Operativo via Apps Script, sin implementacion de escritura.
- Bloque 31A cerrado: auditoria critica de modularizacion Apps Script documentada en `docs/apps-script-modularizacion.md`, sin cambios funcionales.
- Bloque 31B-31C2E cerrado: modularizacion minima Apps Script, Gantt modularizado, endpoints QA de update/create/disable validados y UI de alta Gantt validada con tarea dummy.

## Consolidacion 31B-31C2E

Arquitectura Apps Script actual:

- `Apps_script_v5.js`: fachada estable con `doPost`, `doGet` y routing principal.
- `Config.gs`: constantes globales estaticas.
- `Headers.gs`: helpers de respuesta HTTP `jsonResponse` / `errorResponse`.
- `Utils.gs`: utilidades generales sin side effects de negocio.
- `Gantt.gs`: logica exclusiva Gantt Operativo.

Funcionalidades Gantt aprobadas:

- `gantt_task_update`: edicion controlada de campos de bajo riesgo.
- `gantt_task_create`: alta QA/controlada de tareas Gantt.
- `gantt_task_disable`: baja logica QA/controlada sin borrado fisico.

Compatibilidad Gantt:

- La hoja `timeline` puede tener cabeceras visuales superiores.
- Headers reales pueden estar en fila 3.
- Se detecta automaticamente la fila real de headers.
- `ID Tarea`, `Id Tarea`, `id tarea`, `task_id` e `id_tarea` son aliases validos.
- Payload externo mantiene `task_id`.

Estado UI Gantt:

- Edicion de tareas desde modal: implementada y validada previamente.
- Alta de tareas desde `+ Nueva tarea`: implementada y validada con dummy.
- Baja logica desde front: pendiente.
- No usar `visible_gantt` en UI por ahora: no aparecio en la lectura CSV real.

Smokes reales aprobados:

- Backend real: `doGet`, `gantt_task_update`, `gantt_task_create`, `gantt_task_disable`.
- CSV real: altas/bajas dummy verificadas desde `timeline` publicado.
- UI alta: carga Chrome headless, DOM mock de interaccion, POST real dummy y render posterior con `SPT-001-T-30`.

Evidencias QA relevantes:

- `TASK-DUMMY-QA-CREATE`: creada y luego cancelada por smoke backend 31C2C.
- `SPT-001-T-30`: creada desde flujo UI 31C2E; queda como dummy QA en estado `Pendiente`.

Riesgos residuales:

- Permisos/autorizacion aun no estan endurecidos por rol.
- Concurrencia extrema podria generar carreras; backend revalida duplicados, pero falta hardening transaccional.
- Auditoria/logs son opcionales segun hojas/columnas existentes.
- `visible_gantt` no debe usarse en UI hasta confirmar columna real o aprobar cambio de estructura.
- Falta UI de baja logica.
- Falta smoke humano interactivo si se exige evidencia de clicks reales; DevTools remoto no estuvo disponible en Codex.

## Decisiones vigentes

- No mover aliases activos de raiz a `legacy/`.
- No limpiar `assets/logos/` ni `Logos/` todavia.
- No tocar `config.js` ni `assets/js/config.js`.
- No tocar `Apps_script_v5.js`, `Gantt.gs`, `Config.gs`, `Headers.gs` ni `Utils.gs` salvo etapa Apps Script explicita.
- No tocar formularios, submit, endpoints, payloads, simuladores, Apps Script ni datos reales sin etapa critica.
- Para contenido post-20G, no tocar rutas, JS, CSS, formularios, submit, endpoints ni logica salvo etapa explicita.
- Para bloque 22 cerrado, se mantuvo la decision de no tocar logica funcional, JS, CSV, submit, payloads, formulas, rutas ni config.
- Para bloque 23 cerrado, se mantuvo inline todo CSS sensible asociado a JS, render dinamico, submit, filtros, timeline, formulas, payloads o estados dinamicos.
- Para bloque 24 cerrado, se mantuvo inline todo CSS sensible asociado a submit, payloads, `seller_id`, validaciones, render dinamico, CTAs, calculos, formulas, resultados, tarifas y overrides.
- Para bloque 26 cerrado, no se tocaron JS critico, submit, payloads, Apps Script, config, formulas, timeline, `seller_id` ni rutas criticas.
- Para bloque 29 cerrado, el logo interno debe volver siempre a la portada institucional: `../index.html` desde el Hub y `../../index.html` desde paginas bajo `internal/*/*`.
- Para bloque 30D, la edicion futura del Gantt debe partir de `docs/gantt-operativo-edicion.md` y usar tarea dummy/QA antes de tocar datos reales.
- Para bloque 31A, una futura modularizacion debe mantener `doPost` como fachada estable y avanzar por etapas: 31B Config/Utils/Headers, 31C Gantt, 31D Sellers/Formularios, 31E Definicion Tecnica/Notificaciones.
- Para bloque 31C cerrado, no cambiar contratos `gantt_task_update`, `gantt_task_create` ni `gantt_task_disable` sin etapa critica y smoke con tarea dummy.
- No ejecutar pruebas sobre tareas productivas. Usar solo dummy autorizada.
- Revisar manualmente en el futuro `MarketPlace Sporting - Sellers (BD).xlsx`, `Mapa del Hub.docx` y posible consolidacion de `Logos/`.

## Metodologia vigente

- Modo rapido por defecto: implementacion controlada, validacion minima y commit manual.
- Auditoria previa solo para cambios criticos, operativos, legacy o arquitectura.
- Documentar solo cierres grandes, decisiones relevantes, errores, releases o cambios criticos.
- Comandos preferidos compatibles con PowerShell.
- Validacion minima: `git status --short` y `git diff --name-only`.
- El usuario ejecuta commits manualmente.

## Proximos pasos posibles

- Entrar solo con bugs reales, mejoras funcionales concretas o contenido pendiente especifico.
- Alternativa: preparar cierre release/post-V1 final si no quedan mejoras prioritarias.
- Revisar manualmente `.xlsx` y `Mapa del Hub.docx` solo si se decide ordenar documentacion fuente.
- Evitar nuevas refactorizaciones CSS/JS salvo necesidad real.
- Si se retoma Apps Script, leer primero `docs/apps-script-modularizacion.md` y no ejecutar refactor masivo unico.
- Proximo bloque recomendado si se continua Gantt:
  - 31C2F: hardening de permisos/concurrencia/logs.
  - UI baja logica desde front.
  - Auditoria avanzada.
  - Permisos por rol.
  - Evitar duplicados concurrentes.

## Recomendacion para continuar

- Abrir nuevo chat: el contexto acumulado es alto.
- Configuracion recomendada:
  - Codex
  - Fast OFF
  - Inteligencia Alta
- Primer mensaje sugerido: indicar que 31C-HANDOFF esta cerrado y pedir continuar desde `docs/handoff-post-v1.md`.

## Contexto minimo para nueva sesion

Leer solo:

- `README.md`
- `docs/handoff-post-v1.md`
- `docs/roadmap.md`
- `docs/apps-script-modularizacion.md`
- `docs/gantt-operativo-edicion.md`
- `CHANGELOG.md`
- `PROJECT_WORKFLOW.md`
