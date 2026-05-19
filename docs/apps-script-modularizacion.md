# Auditoria 31A - Modularizacion segura Apps Script

Fecha: 2026-05-19

Estado: auditoria tecnica. No se implemento modularizacion ni se modifico comportamiento funcional.

Archivo auditado: `Apps_script_v5.js`

## Diagnostico general

`Apps_script_v5.js` tiene 1626 lineas y concentra responsabilidades que ya son claramente separables, pero hoy dependen de un contrato global estable. La modularizacion conviene, aunque no como refactor masivo: el archivo mezcla routing, escritura de hojas, reglas de negocio, normalizaciones, cabeceras, emails, Gantt y utilidades compartidas. El riesgo principal no es tecnico de sintaxis, sino romper contratos implicitos que formularios y front ya consumen.

El punto mas critico es `doPost(e)`: actualmente normaliza `tipo_formulario`, resuelve el flujo, mantiene compatibilidad con `seller_id`, dispara sincronizaciones secundarias y responde con el formato esperado. Cualquier modularizacion debe preservar sus nombres, alias, respuestas y efectos colaterales.

## Estado actual

| Area | Estado | Observacion critica |
|---|---|---|
| Tamano | Alto | 1626 lineas en un unico archivo. |
| Routing | Centralizado | `doPost` conoce todos los tipos y orquesta efectos secundarios. |
| Configuracion | Global | `SPREADSHEET_ID`, `EMAIL_NOTIFICACION`, `TIMEZONE` y nombres de hojas estan arriba. |
| Sellers | Mezclado | Alta/edicion y sincronizacion automatica comparten helpers y headers. |
| Formularios | Mezclado | Calificacion y relevamiento escriben hojas y calculan estados/completitud. |
| Definicion tecnica | Acoplada | Depende de sellers, calificaciones, relevamiento y reglas de sugerencia. |
| Gantt Operativo | Nuevo dominio | Tiene validaciones, auditoria opcional y escritura controlada en `timeline`. |
| Utilidades Sheets | Compartidas | Varias funciones son transversales y algunas crean/alteran headers. |
| Reglas de negocio | Mezcladas | Calculos de modelo, riesgo y sugerencias conviven con persistencia. |
| Headers | Globales al final | Constantes usadas por funciones definidas antes; funciona por evaluacion completa del proyecto. |
| Emails | Integrado | `MailApp.sendEmail` se dispara desde flujos de calificacion/relevamiento. |

## Mapa funcional actual

| Dominio | Funciones principales | Dependencias clave |
|---|---|---|
| Routing | `doPost`, `doGet`, `jsonResponse`, `normalizarTipoFormulario` | Config global, todos los dominios, formato de respuesta. |
| Sellers | `upsertSeller`, `sincronizarSellerDesdeFuente`, `construirSellerDesdePayload`, `validarSeller` | `HEADERS_SELLERS`, campos editables/autocompletar, helpers Sheets, normalizaciones. |
| Gestion seller | Entra por `tipo_formulario = seller` / `gestion_seller` | Mismo modulo Sellers; requiere `seller_id`. |
| Calificacion | `escribirEnCalificaciones`, `calcularResultadoSugerido`, `calcularModeloSugerido`, `calcularRiesgoLogistico` | `HEADERS_CALIFICACIONES`, helpers de completitud, email, sincronizacion seller. |
| Relevamiento | `escribirEnRelevamientos` | `HEADERS_RELEVAMIENTO`, completitud, email, definicion tecnica. |
| Definicion tecnica | `upsertDefinicionTecnica`, sugerencias de alcance, requerimientos, riesgos | Sellers, ultima calificacion, relevamiento, `HEADERS_DEFINICION_TECNICA`, `CAMPOS_MANUALES_DEFINICION`. |
| Gantt Operativo | `actualizarTareaGantt`, validaciones Gantt, auditoria Gantt | `HOJA_TIMELINE`, `CAMPOS_GANTT_EDITABLES_QA`, `ESTADOS_GANTT_PERMITIDOS`, helpers Sheets/texto. |
| Auditoria/logs | `registrarAuditoriaGanttSiExiste`, `registrarMetadatosGanttSiExisten` | Hoja compatible existente, headers normalizados, `Utilities`. |
| Sheets | `obtenerHojaSellersConHeaders`, `asegurarHeadersNoDestructivo`, `obtenerHojaConHeaders`, `asegurarHeaders`, `obtenerHeaders`, `agregarObjetoComoFila`, `escribirObjetoEnFila`, `formatearHoja` | `SpreadsheetApp`, headers globales, riesgo de modificar estructura. |
| Busquedas | `buscarUltimoRegistroPorSeller`, `buscarFilaPorSellerId`, `rowToObject` | Headers exactos, `seller_id`, normalizacion. |
| Utils | `limpiarValor`, `normalizarTexto`, `pickPrimero`, `fechaActualSimple`, `emailValido` | Usadas transversalmente. |
| Notificaciones | `enviarNotificacionCalificacion`, `enviarNotificacionRelevamiento` | `MailApp`, textos, constantes de hoja/email. |
| Config/headers | `SPREADSHEET_ID`, `TIMEZONE`, `HOJA_*`, `HEADERS_*`, `CAMPOS_*` | Usados por casi todos los modulos. |

## Dependencias cruzadas relevantes

- `doPost` depende de casi todo y debe quedar como fachada estable.
- `calificacion` no solo escribe `calificaciones`: tambien sincroniza `sellers` y envia email.
- `relevamiento` no solo escribe `relevamientos`: sincroniza `sellers`, genera/actualiza `definicion_tecnica` y envia email.
- `definicion_tecnica` lee de `sellers` y `calificaciones`; depende de funciones de calculo compartidas con calificacion.
- `GanttOperativo` parece aislable, pero usa `limpiarValor`, `normalizarTexto`, `obtenerHeaders`, `SPREADSHEET_ID` y `TIMEZONE`.
- Los helpers de headers tienen dos comportamientos diferentes: `asegurarHeadersNoDestructivo` agrega faltantes; `asegurarHeaders` puede copiar backup y limpiar hoja si headers no coinciden. Esto debe quedar muy visible en una modularizacion.
- Las constantes `HEADERS_*` estan al final pero son requeridas por funciones ubicadas antes. En Apps Script esto funciona mientras no se ejecuten funciones antes de que el proyecto cargue completo; al separar archivos, no hay que introducir inicializacion temprana que las lea durante carga.

## Funciones duplicadas o solapadas

No hay duplicacion literal grave, pero si solapamiento conceptual:

- `normalizarSellerId` y `normalizarIdGantt` hacen normalizacion de IDs con reglas parecidas.
- `normalizarTexto` y `normalizarHeaderGantt` se encadenan para normalizar texto/header.
- `calcularRiesgoLogistico` y `calcularRiesgoLogisticoDesdeRelevamiento` comparten logica mediante wrapper.
- `obtenerHojaSellersConHeaders` y `obtenerHojaConHeaders` son similares, pero con estrategia distinta de headers.
- `agregarObjetoComoFila` esta acoplada a `HEADERS_SELLERS`, por nombre parece generica pero no lo es.

## Riesgos de modularizacion

| Riesgo | Severidad | Detalle | Mitigacion |
|---|---:|---|---|
| Romper `doPost` | Alta | Cambios en routing, aliases o respuesta afectan formularios y front. | Mantener `doPost` como fachada; tests POST por tipo. |
| Scope global Apps Script | Alta | Todos los archivos `.gs` comparten namespace global; nombres duplicados chocan. | Prefijos claros o nombres actuales sin duplicar. |
| Orden de carga / inicializacion | Media | No introducir codigo top-level que ejecute lectura de constantes/hojas al cargar. | Solo declarar constantes y funciones; nada de side effects top-level. |
| Headers destructivos | Alta | `asegurarHeaders` puede limpiar/recrear headers si detecta diferencia. | No tocar logica de headers en primeras etapas; documentar y testear. |
| Efectos secundarios ocultos | Alta | Relevamiento dispara sellers + definicion + email. | Tests por flujo completo, no solo escritura principal. |
| Payloads existentes | Alta | Campos actuales de formularios dependen de nombres exactos. | No renombrar headers ni keys de payload. |
| Emails | Media | En modularizacion se puede perder notificacion o cambiar texto. | Smoke con envio controlado o mock conceptual antes de deploy. |
| Gantt QA | Media | Endpoint nuevo escribe timeline y auditoria opcional. | Mantener modulo aislado y probar con `TASK-DUMMY-QA`. |
| Deploy parcial | Alta | Apps Script deploy puede quedar con archivos incompletos o version vieja. | Migrar por etapas, deploy versionado y rollback listo. |
| Tests insuficientes | Alta | No hay suite automatica real contra Apps Script/Sheets. | Crear checklist de POST y usar tareas/sellers dummy. |

## Arquitectura futura recomendada

La division conviene, pero manteniendo nombres de funciones publicas y contratos actuales. Propuesta:

| Archivo futuro | Contenido | Comentario |
|---|---|---|
| `Codigo.gs` | `doGet`, `doPost`, `jsonResponse`, `normalizarTipoFormulario` | Fachada estable. No incluir logica de dominio. |
| `Config.gs` | `SPREADSHEET_ID`, `EMAIL_NOTIFICACION`, `TIMEZONE`, `HOJA_*` | Sin side effects. |
| `Headers.gs` | `HEADERS_*`, `CAMPOS_*`, enums Gantt | Puede separarse de Config para evitar archivo gigante. |
| `Utils.gs` | `limpiarValor`, `normalizarTexto`, `pickPrimero`, `fechaActualSimple`, `emailValido` | Primera extraccion segura. |
| `Sheets.gs` | Busquedas y helpers de hojas/headers | Mantener muy testeado por riesgo de estructura. |
| `Sellers.gs` | Alta/edicion/sync sellers y normalizaciones seller | Incluye `upsertSeller`, `sincronizarSellerDesdeFuente`. |
| `Calificaciones.gs` | Escritura y calculos de calificacion | Separar calculos solo si no complica. |
| `Relevamientos.gs` | Escritura relevamiento | Mantener llamada a definicion desde router o desde orquestador claro. |
| `DefinicionTecnica.gs` | `upsertDefinicionTecnica` y sugerencias tecnicas | Dominio mas grande; migrar despues de tests. |
| `GanttOperativo.gs` | Endpoint `actualizarTareaGantt`, validaciones, auditoria Gantt | Buen candidato para 31C porque es dominio nuevo y relativamente encapsulado. |
| `Notificaciones.gs` | Emails de calificacion/relevamiento | Puede moverse tarde para reducir riesgo inicial. |

No recomiendo crear clases ni namespaces en esta primera modularizacion. En Apps Script, mantener funciones globales actuales reduce el riesgo de romper llamadas desde `doPost` y pruebas manuales.

## Estrategia de migracion segura

### 31B - Extraer Config + Utils + Headers, sin cambiar logica

Objetivo: dividir constantes y helpers pasivos. No tocar `doPost`.

Archivos futuros:

- `Config.gs`
- `Headers.gs`
- `Utils.gs`
- `Apps_script_v5.js` o `Codigo.gs` aun con dominios principales

Validar:

- `doGet` responde igual.
- `normalizarTipoFormulario` conserva aliases.
- POST dummy por `seller`, `calificacion`, `relevamiento`, `gantt_task_update` en entorno controlado o mock.

### 31C - Mover Gantt Operativo

Objetivo: extraer `actualizarTareaGantt` y helpers Gantt a `GanttOperativo.gs`.

Motivo: es el endpoint mas nuevo, con contrato acotado y campos limitados.

Validar:

- `gantt_task_update` con `TASK-DUMMY-QA`.
- `task_id` inexistente.
- campo no permitido.
- fecha invalida.
- auditoria solo si hoja compatible existe.

### 31D - Mover Sellers + Formularios

Objetivo: separar `Sellers.gs`, `Calificaciones.gs`, `Relevamientos.gs`.

Orden sugerido:

1. Sellers.
2. Calificaciones.
3. Relevamientos.

Validar despues de cada paso:

- `gestion_seller` no cambia.
- Calificacion escribe y sincroniza seller.
- Relevamiento escribe, sincroniza seller y genera definicion tecnica.
- Emails siguen disparandose donde corresponde.

### 31E - Mover Definicion Tecnica + Notificaciones + cleanup

Objetivo: cerrar separacion de dominios y limpiar nombres ambiguos.

No hacer en esta etapa:

- renombrar payloads;
- cambiar headers;
- cambiar estructura de Google Sheets;
- convertir a clases;
- compactar respuestas;
- alterar textos de email salvo etapa especifica.

## Validaciones futuras obligatorias

| Grupo | Validacion |
|---|---|
| Sintaxis | Validar proyecto Apps Script despues de cada split. |
| Deploy | Crear version incremental y conservar rollback. |
| `doGet` | Confirmar respuesta `status: ok`. |
| Routing | Probar aliases de `tipo_formulario`. |
| Gestion seller | POST con seller dummy y edicion dummy. |
| Calificacion | POST dummy sin romper payload actual; confirmar hoja y respuesta. |
| Relevamiento | POST dummy; confirmar hoja, sync seller y definicion tecnica. |
| Gantt | `TASK-DUMMY-QA`, errores controlados y no campos no permitidos. |
| Emails | Confirmar envio o mock/control manual antes de produccion. |
| Sheets | Verificar que no se crean backups inesperados ni se limpian headers. |
| Fronts | Smoke formularios publicos y Gantt Operativo. |
| Logs | Revisar `console.error`/ejecuciones Apps Script. |

## Recomendacion

Avanzar con modularizacion incremental solo despues de una etapa 31B dedicada. La prioridad debe ser preservar contratos externos, no embellecer internamente. El primer objetivo realista es dejar `doPost` como router fino y mover utilidades/configuracion sin tocar dominio. Despues, extraer Gantt como modulo piloto y usarlo para validar el patron de split.

La modularizacion completa es conveniente, pero debe tratarse como cambio critico sobre endpoint productivo.

## Estado 31B - Modularizacion minima inicial

Implementado sin deploy ni escritura real.

Archivos creados:

- `Config.gs`
- `Headers.gs`
- `Utils.gs`

Cambios aplicados:

- `Config.gs` concentra constantes globales estaticas:
  - `SPREADSHEET_ID`
  - `EMAIL_NOTIFICACION`
  - `TIMEZONE`
  - `HOJA_SELLERS`
  - `HOJA_CALIFICACIONES`
  - `HOJA_RELEVAMIENTO`
  - `HOJA_DEFINICION_TECNICA`
  - `HOJA_TIMELINE`
- `Headers.gs` concentra helpers de salida HTTP:
  - `jsonResponse`
  - `errorResponse`
- `Utils.gs` concentra helpers genericos sin side effects de negocio:
  - `emailValido`
  - `fechaActualSimple`
  - `rowToObject`
  - `pickPrimero`
  - `limpiarValor`
  - `normalizarTexto`
- `Apps_script_v5.js` conserva `doPost`, `doGet`, routing y toda la logica de dominios.
- En `doPost`, el bloque de error usa `errorResponse(err)` manteniendo el mismo formato previo.

Funciones no movidas en 31B:

- Gantt Operativo: `actualizarTareaGantt` y validaciones Gantt.
- Sellers / Gestion Sellers.
- Calificacion.
- Relevamiento.
- Definicion tecnica.
- Helpers de Sheets con side effects o riesgo estructural.
- Headers de hojas (`HEADERS_*`) y campos especificos (`CAMPOS_*`).
- Emails.

Validacion local 31B:

- `node --check Apps_script_v5.js` OK.
- `.gs` validados por carga local con `vm` debido a que el Node local no acepta extension `.gs` en `node --check`.
- Smoke mockeado de routing OK para `seller`, `gestion_seller`, `calificacion`, `relevamiento`, `gantt_task_update` y error por falta de `seller_id`.

Riesgo residual:

- Apps Script usa namespace global compartido; al subir estos archivos al proyecto real debe verificarse que no existan archivos/funciones con los mismos nombres.
- Falta validacion en Apps Script real antes de deploy activo.

## Validacion post 31B - proyecto real / local controlado

Fecha: 2026-05-19

Objetivo: confirmar que la modularizacion minima no cambio contratos ni comportamiento esperado antes de avanzar a 31C.

Resultado general: validacion aprobada con una salvedad. El Web App real respondio `doGet` correctamente mediante GET no destructivo. Los POST reales no se ejecutaron para evitar escrituras en Google Sheets; se validaron con smoke mockeado cargando `Config.gs`, `Headers.gs`, `Utils.gs` y `Apps_script_v5.js` juntos.

Validaciones realizadas:

| Validacion | Resultado | Estado |
|---|---|---|
| Archivos `.gs` presentes en repo | `Config.gs`, `Headers.gs`, `Utils.gs` existen junto a `Apps_script_v5.js` | OK |
| Proyecto Apps Script real | Sin `.clasp.json` / `appsscript.json`; no se puede inspeccionar remotamente el listado de archivos desde el repo | Limitacion |
| `doGet` real Web App | GET no destructivo respondio `{"status":"ok","message":"Apps Script activo - Marketplace Sporting","hojas":["sellers","calificaciones","relevamientos","definicion_tecnica"]}` | OK |
| Duplicados conflictivos | 84 simbolos revisados en 4 archivos; sin duplicados | OK |
| Sintaxis `Apps_script_v5.js` | `node --check Apps_script_v5.js` sin errores | OK |
| Carga conjunta | `Config.gs`, `Headers.gs`, `Utils.gs`, `Apps_script_v5.js` cargan juntos via `vm` | OK |
| `doPost` mock `seller` | Ruta OK, respuesta `ok:true`, `tipo_formulario:"seller"` | OK |
| `doPost` mock `gestion_seller` | Alias conserva salida normalizada como `seller` | OK |
| `doPost` mock `calificacion` | Ruta OK, respuesta `ok:true`, `tipo_formulario:"calificacion"` | OK |
| `doPost` mock `relevamiento` | Ruta OK, incluye `definicion_tecnica` mockeada | OK |
| `doPost` mock `gantt_task_update` | Ruta OK con `TASK-DUMMY-QA` mockeado | OK |
| Error falta `seller_id` | Conserva `ok:false`, `status:"error"`, `error`, `message` | OK |
| Escritura real Google Sheets | No ejecutada | OK |

Confirmaciones:

- No se agregaron nuevas funciones funcionales.
- No se modularizo Gantt, sellers, calificacion, relevamiento ni definicion tecnica.
- No se cambiaron endpoints, payloads ni nombres de campos.
- No se tocaron `internal/`, `public/`, `legacy/`, `config.js` ni `assets/js/config.js`.

Riesgo residual:

- Para confirmar incorporacion remota de `Config.gs`, `Headers.gs` y `Utils.gs` en el editor Apps Script hace falta acceso al proyecto real o `clasp`. El repo no tiene metadata de vinculacion. La validacion actual confirma compatibilidad local fuerte y `doGet` real operativo, pero no lista archivos remotos.
- Los POST reales siguen pendientes hasta que exista tarea/seller dummy aprobado para escritura controlada.
