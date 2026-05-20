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

## Estado 31C - Modularizacion controlada Gantt

Fecha: 2026-05-20

Implementado sin deploy ni escritura real.

Archivo creado:

- `Gantt.gs`

Funciones y constantes movidas desde `Apps_script_v5.js` hacia `Gantt.gs`:

- `CAMPOS_GANTT_EDITABLES_QA`
- `ESTADOS_GANTT_PERMITIDOS`
- `actualizarTareaGantt`
- `construirMapaHeadersNormalizados`
- `normalizarHeaderGantt`
- `resolverIndiceHeader`
- `normalizarIdGantt`
- `normalizarValorGantt`
- `normalizarEstadoGantt`
- `validarFechaGantt`
- `validarRangoFechasGantt`
- `validarTextoGantt`
- `registrarMetadatosGanttSiExisten`
- `registrarAuditoriaGanttSiExiste`

Se mantuvo:

- `doPost` en `Apps_script_v5.js` como fachada estable.
- Routing `tipo_formulario = "gantt_task_update"` sin cambios.
- Payload de entrada sin cambios.
- Response OK sin cambios:

```json
{
  "ok": true,
  "task_id": "TASK-DUMMY-QA",
  "updated_fields": ["estado"]
}
```

- Response error sin cambios:

```json
{
  "ok": false,
  "status": "error",
  "error": "Falta task_id",
  "message": "Error: Falta task_id"
}
```

Validacion local 31C:

- `node --check Apps_script_v5.js` OK.
- Carga conjunta via `vm` de `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs` y `Apps_script_v5.js` OK.
- Revision de simbolos en 5 archivos: 84 simbolos, 0 duplicados.
- Smoke mockeado `gantt_task_update` OK con `TASK-DUMMY-QA`.
- Smoke mockeado error por `task_id` faltante OK.
- No se ejecutaron POST reales ni escrituras en Google Sheets.

No se movio ni modifico:

- Sellers / Gestion Sellers.
- Calificacion.
- Relevamiento.
- Definicion tecnica.
- Formularios, simuladores, `internal/`, `public/`, `legacy/`, `config.js`, `assets/js/config.js`.

Riesgo residual:

- Falta incorporar y validar `Gantt.gs` en el proyecto real de Apps Script antes de deploy activo.
- POST real con `TASK-DUMMY-QA` sigue pendiente hasta aprobacion de escritura controlada.

## Validacion post 31C - proyecto real

Fecha: 2026-05-20

Objetivo: validar que `Gantt.gs` quedo integrado al proyecto real antes de avanzar a 31D.

Resultado general: integracion Apps Script OK, escritura dummy bloqueada por header real de la hoja `timeline`.

Resultados reales:

| Validacion | Resultado | Estado |
|---|---|---|
| `doGet` real Web App | `{"status":"ok","message":"Apps Script activo - Marketplace Sporting","hojas":["sellers","calificaciones","relevamientos","definicion_tecnica"]}` | OK |
| POST real no destructivo `gantt_task_update` sin `task_id` | `{"ok":false,"status":"error","error":"Falta task_id","message":"Error: Falta task_id"}` | OK |
| Confirmacion de `Gantt.gs` remoto | El endpoint reconoce `gantt_task_update` y ejecuta validacion Gantt especifica | OK |
| POST real con `TASK-DUMMY-QA` | `{"ok":false,"status":"error","error":"La hoja \"timeline\" no tiene columna task_id / id_tarea","message":"Error: La hoja \"timeline\" no tiene columna task_id / id_tarea"}` | Bloqueado por header |

Interpretacion tecnica:

- `Config.gs`, `Headers.gs`, `Utils.gs` y `Gantt.gs` ya estan disponibles para el Web App real.
- `doPost` y `doGet` siguen funcionando como fachada estable.
- El error de `TASK-DUMMY-QA` ocurre dentro de la logica Gantt, antes de cualquier escritura de celda, por no detectar columna `task_id` / `id_tarea` en la hoja real `timeline`.
- No hubo escritura real exitosa sobre Google Sheets durante esta validacion.

Validacion local de control:

| Validacion | Resultado | Estado |
|---|---|---|
| `node --check Apps_script_v5.js` | Sin errores | OK |
| Carga conjunta local | `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs`, `Apps_script_v5.js` cargan con `vm` | OK |
| Duplicados | 84 simbolos en 5 archivos, 0 duplicados | OK |
| `git diff --check` | Sin errores | OK |

Decision:

- No avanzar a 31D hasta revisar/confirmar el header real de `timeline`.
- Mantener sin cambios la logica funcional; si se corrige algo, debe ser una etapa explicita sobre compatibilidad de headers Gantt o sobre la hoja QA.

## Estado 31C-fix - Alias `ID Tarea` en Gantt

Fecha: 2026-05-20

Objetivo: permitir que el endpoint `gantt_task_update` identifique tareas cuando la hoja `timeline` usa el header visual `ID Tarea`, sin renombrar columnas en Google Sheets y sin cambiar payloads ni responses.

Cambio aplicado en `Gantt.gs`:

- Agregado `GANTT_TASK_ID_HEADER_ALIASES`.
- Alias aceptados para resolver la columna identificadora:
  - `task_id`
  - `id_tarea`
  - `ID Tarea`
  - `Id Tarea`
  - `id tarea`
- `normalizarHeaderGantt` mantiene la canonicalizacion hacia `id_tarea`.
- `actualizarTareaGantt` y `registrarAuditoriaGanttSiExiste` usan la lista comun de alias.

No cambio:

- Payload externo: sigue usando `task_id`.
- Response OK.
- Response error.
- `doPost` / `doGet`.
- Logica de sellers, gestion, calificacion, relevamiento o definicion tecnica.
- Google Sheets.

Validacion local:

| Validacion | Resultado | Estado |
|---|---|---|
| `node --check Apps_script_v5.js` | Sin errores | OK |
| Carga conjunta local | `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs`, `Apps_script_v5.js` | OK |
| Duplicados | 85 simbolos en 5 archivos, 0 duplicados | OK |
| Smoke header `ID Tarea` | `gantt_task_update` OK con `TASK-DUMMY-QA` mockeado | OK |
| Error `task_id` faltante | `ok:false`, `error:"Falta task_id"` | OK |
| `task_id` inexistente | Error controlado `task_id no existe` | OK |

Validacion real segura:

| Validacion | Resultado | Estado |
|---|---|---|
| `doGet` real | `status:"ok"` | OK |
| POST real sin `task_id` | `ok:false`, `error:"Falta task_id"` | OK |
| POST real con `TASK-DUMMY-QA` | Pendiente hasta subir este fix al proyecto Apps Script real | Pendiente |

31C2 futura sugerida:

- Disenar creacion/desactivacion de tareas Gantt desde el front en una etapa separada.
- No eliminar fisicamente tareas.
- Usar baja logica mediante `visible_gantt = No` o `estado = Cancelado`.
- Preservar historial, dependencias, auditoria y trazabilidad de timeline.

## Revalidacion real 31C-fix

Fecha: 2026-05-20

Objetivo: confirmar en Apps Script real que el alias visual `ID Tarea` ya es reconocido por `gantt_task_update`.

Resultado general: no aprobado. El Web App real esta operativo, pero el POST con `TASK-DUMMY-QA` sigue fallando con el mismo error de columna. Esto indica que el fix local de alias aun no esta incorporado/deployado en el proyecto Apps Script real, o que el despliegue activo sigue apuntando a una version anterior.

| Validacion real | Resultado | Estado |
|---|---|---|
| `doGet` real | `{"status":"ok","message":"Apps Script activo - Marketplace Sporting","hojas":["sellers","calificaciones","relevamientos","definicion_tecnica"]}` | OK |
| POST `gantt_task_update` sin `task_id` | `{"ok":false,"status":"error","error":"Falta task_id","message":"Error: Falta task_id"}` | OK |
| POST `TASK-DUMMY-QA` | `{"ok":false,"status":"error","error":"La hoja \"timeline\" no tiene columna task_id / id_tarea","message":"Error: La hoja \"timeline\" no tiene columna task_id / id_tarea"}` | Fallo |

Conclusion:

- `doPost` / `doGet` siguen activos.
- `gantt_task_update` responde con formato estable.
- La hoja `timeline` con header visual `ID Tarea` no fue reconocida por el Apps Script real durante esta revalidacion.
- No hay evidencia de escritura exitosa sobre Google Sheets en esta prueba.

Pendiente:

- Subir/incorporar el `Gantt.gs` actualizado con `GANTT_TASK_ID_HEADER_ALIASES` al proyecto Apps Script real.
- Redeployar o actualizar la version activa del Web App si corresponde.
- Repetir POST con `TASK-DUMMY-QA`.

## Etapa 31C2 - Diseno alta/baja controlada Gantt

Fecha: 2026-05-20

Estado: documentado sin implementacion funcional.

Objetivo: definir operaciones futuras para crear y dar de baja tareas del Gantt Operativo manteniendo `Apps_script_v5.js` como fachada estable y sin cambiar `gantt_task_update`.

### Propuesta de arquitectura Apps Script

Mantener el mismo patron modular:

- `Apps_script_v5.js`: solo routing futuro de `tipo_formulario`.
- `Gantt.gs`: funciones especificas `crearTareaGantt` y `darDeBajaTareaGantt` en una etapa futura.
- `Config.gs`, `Headers.gs`, `Utils.gs`: sin cambios salvo necesidad futura muy justificada.

No agregar clases ni namespaces en esta fase. Apps Script mantiene namespace global compartido, por lo que los nombres futuros deben ser especificos:

- `crearTareaGantt`
- `darDeBajaTareaGantt`
- `generarTaskIdGantt`
- `validarDependenciaGantt`
- `validarPayloadAltaGantt`
- `validarPayloadBajaGantt`

### Payload `gantt_task_create`

```json
{
  "tipo_formulario": "gantt_task_create",
  "created_by": "usuario@dominio.com",
  "task": {
    "seller_id": "SPT-001",
    "fase": "Onboarding",
    "hito": "Configuracion inicial",
    "tarea": "Validar datos fiscales",
    "responsable": "Operaciones",
    "inicio_plan": "2026-05-20",
    "fin_plan": "2026-05-27",
    "dependencia": "",
    "estado": "Pendiente",
    "visible_gantt": "Si",
    "comentario": "Alta controlada QA."
  }
}
```

Campos requeridos:

- `seller_id`
- `fase`
- `hito`
- `tarea`
- `responsable`
- `inicio_plan`
- `fin_plan`
- `estado`
- `visible_gantt`

Respuesta propuesta:

```json
{
  "ok": true,
  "task_id": "SPT-001-T-058",
  "created_fields": ["seller_id", "fase", "hito", "tarea", "responsable", "inicio_plan", "fin_plan", "estado", "visible_gantt"]
}
```

### Payload `gantt_task_disable`

```json
{
  "tipo_formulario": "gantt_task_disable",
  "task_id": "SPT-001-T-058",
  "updated_by": "usuario@dominio.com",
  "reason": "Tarea duplicada durante QA.",
  "mode": "hide_and_cancel"
}
```

Respuesta propuesta:

```json
{
  "ok": true,
  "task_id": "SPT-001-T-058",
  "updated_fields": ["visible_gantt", "estado", "comentario"]
}
```

### Reglas tecnicas

Alta:

- Apps Script debe generar el `task_id` final en produccion.
- El front no debe generar IDs definitivos.
- El ID debe ser unico globalmente.
- La hoja puede mostrar `ID Tarea`; el endpoint debe seguir resolviendo alias.
- No se deben escribir columnas calculadas ni formulas.
- Si existen `created_at` / `created_by`, completarlas desde Apps Script.
- Si existe hoja de auditoria compatible, registrar alta.

Baja:

- No eliminar filas fisicamente.
- Preferir `visible_gantt = No` para ocultar de la vista.
- Usar `estado = Cancelado` cuando la tarea queda anulada operativamente.
- Si existen `disabled_at` / `disabled_by`, usarlas como auditoria adicional.
- Mantener motivo en `comentario` o campo compatible.

Dependencias:

- La dependencia puede ser vacia.
- Si se informa, debe apuntar a un `task_id` existente.
- Rechazar autodependencia.
- Rechazar o advertir si la dependencia apunta a tarea deshabilitada.
- Evitar ciclos antes de escribir, al menos para dependencia directa en la primera version.

### Riesgos

| Riesgo | Severidad | Mitigacion |
|---|---:|---|
| Duplicar `task_id` | Alta | Generacion backend y chequeo de unicidad antes de append. |
| Romper dependencias | Alta | Validar existencia, autodependencia y baja con tareas dependientes activas. |
| Borrado fisico | Alta | Prohibir delete; usar baja logica. |
| Crear filas incompletas | Media | Campos minimos obligatorios y validacion de fechas/estado. |
| Concurrencia | Media | Releer IDs antes de escribir y rechazar collision. |
| Columnas faltantes | Media | No crear columnas sin etapa explicita; rechazar con error claro. |
| Auditoria insuficiente | Media | Registrar `created_at`, `updated_at`, usuario y log si existe. |

### Etapas futuras recomendadas

| Etapa | Alcance | Archivos posibles |
|---|---|---|
| 31C2A | Endpoint `gantt_task_create` QA sin front | `Gantt.gs`, docs |
| 31C2B | Endpoint `gantt_task_disable` QA sin front | `Gantt.gs`, docs |
| 31C2C | Smoke real con tarea dummy y baja logica | docs |
| 31C2D | UI crear tarea en Gantt Operativo | `internal/gantt/gantt-operativo.html`, docs |
| 31C2E | UI dar de baja tarea, sin delete fisico | `internal/gantt/gantt-operativo.html`, docs |
| 31C2F | Auditoria/permisos/concurrencia | `Gantt.gs`, docs |

Confirmacion:

- 31C2 no implemento codigo funcional.
- No se modificaron endpoints actuales.
- `gantt_task_update` queda intacto.
- No se tocaron Google Sheets, front, `internal/`, `public/`, `legacy/`, `config.js` ni `assets/js/config.js`.

## Estado 31C2A - Endpoint QA `gantt_task_create`

Fecha: 2026-05-20

Estado: implementado localmente sin escritura real.

### Cambios funcionales acotados

`Apps_script_v5.js`:

- Agrega routing minimo para `tipo_formulario = "gantt_task_create"`.
- Mantiene `doPost` como fachada estable.
- No cambia los flujos `seller`, `gestion_seller`, `calificacion`, `relevamiento`, `definicion_tecnica` ni `gantt_task_update`.

`Gantt.gs`:

- Agrega `crearTareaGantt`.
- Agrega aliases de columnas para alta de tarea.
- Reutiliza `obtenerHeadersTimelineGantt` para detectar headers reales aunque esten en fila 3.
- Reutiliza normalizaciones/validaciones Gantt.
- Agrega helpers especificos:
  - `validarColumnasCreateGantt`
  - `generarTaskIdGantt`
  - `existeTaskIdGantt`
  - `validarFechaObligatoriaGantt`
  - `validarRangoPlanGantt`
  - `validarTextoObligatorioGantt`
  - `normalizarVisibleGantt`
  - `registrarMetadatosAltaGanttSiExisten`

### Contrato

Payload:

```json
{
  "tipo_formulario": "gantt_task_create",
  "created_by": "qa@marketplace.local",
  "task": {
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

Response OK:

```json
{
  "ok": true,
  "task_id": "SPT-001-T-02",
  "created_fields": ["task_id", "seller_id", "fase", "hito", "tarea", "responsable", "inicio_plan", "fin_plan", "estado", "visible_gantt", "comentario"],
  "row_number": 123,
  "message": "Tarea Gantt creada"
}
```

Errores:

- Conservan formato `errorResponse`.
- No cambian responses existentes de otros endpoints.

### Validacion local

| Validacion | Resultado | Estado |
|---|---|---|
| `node --check Apps_script_v5.js` | Sin errores | OK |
| Carga conjunta | `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs`, `Apps_script_v5.js` | OK |
| Create headers fila 1 | Genera ID, inserta fila mock y aplica defaults | OK |
| Create headers fila 3 | Detecta `ID Tarea` e inserta en fila fisica correcta | OK |
| Error `seller_id` faltante | `ok:false`, error claro | OK |
| Error fecha invalida | `ok:false`, error claro | OK |
| Error rango plan invalido | `ok:false`, error claro | OK |
| Error `task_id` duplicado | `ok:false`, error claro | OK |
| Escritura real | No ejecutada | OK |

### Riesgo residual

- Falta deploy/incorporacion real de `Apps_script_v5.js` y `Gantt.gs`.
- La prueba real debe usar tarea dummy con `visible_gantt = No`.
- Si la hoja `timeline` no tiene columna opcional `visible_gantt`, el endpoint no la crea; solo escribe columnas existentes.
- La generacion de ID reduce duplicados, pero en concurrencia extrema debe revalidarse contra la hoja real antes de habilitar uso productivo.

## Estado 31C2B - Endpoint QA `gantt_task_disable`

Fecha: 2026-05-20

Estado: implementado localmente sin escritura real.

### Cambios funcionales acotados

`Apps_script_v5.js`:

- Agrega routing minimo para `tipo_formulario = "gantt_task_disable"`.
- Mantiene `doPost` como fachada estable.
- No cambia los flujos `seller`, `gestion_seller`, `calificacion`, `relevamiento`, `definicion_tecnica`, `gantt_task_update` ni `gantt_task_create`.

`Gantt.gs`:

- Agrega `darDeBajaTareaGantt`.
- Reutiliza `obtenerHeadersTimelineGantt`, alias `ID Tarea`, normalizacion de IDs, metadatos y auditoria Gantt.
- Agrega helper `normalizarModoBajaGantt`.
- Reutiliza busqueda por task en `buscarCoincidenciasTaskGantt`.

### Contrato

Payload:

```json
{
  "tipo_formulario": "gantt_task_disable",
  "task_id": "TASK-DUMMY-QA-CREATE",
  "updated_by": "qa@marketplace.local",
  "mode": "hide_and_cancel",
  "reason": "Baja logica QA controlada"
}
```

Response OK:

```json
{
  "ok": true,
  "task_id": "TASK-DUMMY-QA-CREATE",
  "disabled_fields": ["visible_gantt", "estado", "comentario"],
  "row_number": 123,
  "message": "Tarea Gantt dada de baja logicamente"
}
```

Errores:

- Conservan formato `errorResponse`.
- No cambian responses existentes de otros endpoints.

### Reglas

- No eliminar filas fisicamente.
- Resolver la fila real por `task_id` / `ID Tarea`.
- `hide`: requiere columna `visible_gantt` y escribe `No`.
- `cancel`: requiere columna `estado` y escribe `Cancelado`.
- `hide_and_cancel`: requiere ambas columnas.
- Si existe `comentario` y se envia `reason`, se registra el motivo.
- Si existen `updated_at` / `updated_by`, se registran.
- Si existe hoja de auditoria compatible, se registra operacion `gantt_task_disable`.
- No crear columnas nuevas.

### Validacion local

| Validacion | Resultado | Estado |
|---|---|---|
| `node --check Apps_script_v5.js` | Sin errores | OK |
| Carga conjunta | `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs`, `Apps_script_v5.js` | OK |
| Disable `hide` | Actualiza `visible_gantt` y comentario | OK |
| Disable `cancel` | Actualiza `estado` y comentario | OK |
| Disable `hide_and_cancel` | Detecta headers fila 3 y actualiza ambos campos | OK |
| Error `task_id` faltante | `ok:false`, error claro | OK |
| Error `task_id` inexistente | `ok:false`, error claro | OK |
| Error `task_id` duplicado | `ok:false`, error claro | OK |
| Error falta `visible_gantt` | `ok:false`, error claro en modo `hide` | OK |
| Error falta `estado` | `ok:false`, error claro en modo `cancel` | OK |
| Compatibilidad `gantt_task_update` | Sigue OK | OK |
| Compatibilidad `gantt_task_create` | Sigue OK | OK |
| Escritura real | No ejecutada | OK |

### Riesgo residual

- Falta deploy/incorporacion real de `Apps_script_v5.js` y `Gantt.gs`.
- La prueba real debe limitarse a `TASK-DUMMY-QA-CREATE`.
- Si `visible_gantt` no existe en la hoja real, `hide` y `hide_and_cancel` fallaran con error controlado.
- Si `estado` no existe, `cancel` y `hide_and_cancel` fallaran con error controlado.
- No hay rollback automatico; la reversa seria otro update controlado sobre la tarea dummy.

## Validacion real 31C2C - Alta/baja Gantt

Fecha: 2026-05-20

Estado: aprobado.

Objetivo: confirmar en Apps Script real que los endpoints QA `gantt_task_create` y `gantt_task_disable` quedaron incorporados y operan sobre tarea dummy.

### Resultados reales

| Validacion | Resultado | Estado |
|---|---|---|
| `doGet` real | `status:"ok"`, hojas esperadas | OK |
| `gantt_task_create` | `ok:true`, `task_id:"TASK-DUMMY-QA-CREATE"`, `row_number:78` | OK |
| Verificacion CSV post create | Fila encontrada; `Estado = Pendiente`; `Comentario = Alta QA controlada` | OK |
| `gantt_task_disable` | `ok:true`, `row_number:78`, `disabled_fields:["estado","comentario"]` | OK |
| Verificacion CSV post disable | Fila encontrada; `Estado = Cancelado`; `Comentario = Baja logica QA controlada` | OK |
| No borrado fisico | La tarea dummy sigue presente en CSV | OK |
| `gantt_task_update` | Error controlado sin `task_id`: `Falta task_id` | OK |
| Endpoint `seller` | Error controlado sin `seller_id`: `Falta seller_id en el formulario` | OK |
| Formato JSON | Responses OK/error estables | OK |

### Interpretacion

- El proyecto Apps Script real ya tiene incorporados `Apps_script_v5.js` y `Gantt.gs` actualizados.
- `doPost` sigue funcionando como fachada estable.
- El flujo QA create/disable opera sobre `timeline` con header visual `ID Tarea`.
- La baja real se valido con `mode = "cancel"` porque la lectura CSV no expuso columna `visible_gantt`.
- No se evidencio impacto sobre endpoints existentes en las pruebas no destructivas.

### Riesgo residual

- `hide` / `hide_and_cancel` requieren confirmar si existe columna `visible_gantt` en la hoja real; si no existe, fallaran con error controlado.
- La tarea dummy quedo en estado `Cancelado`, como evidencia de smoke.
- Antes de habilitar UI, falta definir permisos/UX y confirmar comportamiento esperado del CSV publicado tras escrituras.

## Etapa 31C2F - Auditoria hardening Gantt Apps Script

Estado: documentada, sin cambios funcionales.

Objetivo: definir el hardening minimo antes de ampliar UI de escritura o permisos avanzados sobre Gantt Operativo.

### Diagnostico Apps Script

La modularizacion actual mantiene `Apps_script_v5.js` como fachada estable y concentra la logica Gantt en `Gantt.gs`. El routing y los contratos ya funcionan, pero los endpoints de escritura necesitan una capa explicita de seguridad operacional:

- autorizacion server-side;
- identidad confiable para `created_by` / `updated_by`;
- bloqueo de concurrencia;
- auditoria consistente;
- reglas claras para baja logica mientras `visible_gantt` no existe en CSV real.

### Permisos

`created_by` y `updated_by` enviados por payload no deben considerarse prueba de identidad. Son datos declarativos del cliente. La identidad operativa debe resolverse dentro de Apps Script mediante:

- allowlist server-side de usuarios cuando el deploy permita obtener email;
- token simple por entorno QA/operativo;
- o combinacion de token + allowlist.

Recomendacion minima:

- exigir autorizacion para `gantt_task_update`, `gantt_task_create` y `gantt_task_disable`;
- rechazar operaciones sin actor autorizado;
- registrar actor resuelto por backend;
- conservar actor enviado por cliente solo como metadata auxiliar si hace falta.

### Riesgos de endpoint expuesto

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| URL del Web App reutilizada fuera del portal | Escrituras no autorizadas | Token/allowlist en Apps Script. |
| Payload manipulado manualmente | Edicion de campos no previstos | Mantener allowlist de campos y validar en servidor. |
| Suplantacion de `updated_by` | Auditoria falsa | Resolver actor en backend. |
| Reintentos automaticos | Doble escritura o comentarios duplicados | Idempotencia por `request_id` futura o lock + log. |
| Error humano sobre tarea real | Cancelacion o update equivocado | Confirmacion UI, log y permisos por rol. |

### Concurrencia

`LockService` debe proteger las secciones criticas de escritura:

- `gantt_task_create`: lock obligatorio antes de calcular/generar `task_id`, validar duplicado e insertar.
- `gantt_task_update`: lock recomendado para evitar update simultaneo silencioso.
- `gantt_task_disable`: lock recomendado y comportamiento idempotente si la tarea ya esta `Cancelado`.

Sin lock, dos creates simultaneos podrian calcular el mismo correlativo por seller antes de escribir. La validacion de duplicado debe repetirse dentro del lock, no solo antes.

### Auditoria

El log ideal debe permitir reconstruir quien cambio que, cuando, desde donde, con que resultado y sobre que valores.

Campos recomendados:

- `timestamp`
- `operation`
- `task_id`
- `seller_id`
- `actor`
- `client_actor`
- `status`
- `fields_changed`
- `before_json`
- `after_json`
- `reason`
- `request_id`
- `source`

Si `timeline_log` ya existe y puede aceptar esta estructura, alcanza como base. Si no existe o no es compatible, no crearla implicitamente: documentar pendiente y crearla solo en una etapa aprobada.

### Riesgos actuales por operacion

`gantt_task_create`:

- generacion de ID sensible a concurrencia;
- posible actor no confiable;
- riesgo de fila incompleta si se agregan columnas nuevas no contempladas;
- dependencia de CSV publicado para confirmacion visual posterior.

`gantt_task_disable`:

- accion operativamente sensible, aunque no borre filas;
- `visible_gantt` no confirmado en CSV real;
- modo recomendado actual para UI futura: `cancel`;
- requiere motivo obligatorio si se habilita desde front.

`gantt_task_update`:

- puede modificar estados que impactan metricas/alertas;
- riesgo de last-write-wins;
- requiere log antes/despues para rollback manual.

### Recomendacion de implementacion

Orden recomendado:

1. Permisos server-side minimos.
2. `LockService` para `create`, `update` y `disable`.
3. Auditoria/log estandarizado.
4. UI baja logica con `mode = "cancel"`.
5. Permisos por rol y controles avanzados.

No se recomienda implementar primero la UI de baja logica. Aunque la baja sea logica, cambia el estado operativo de una tarea y debe quedar protegida por permisos, lock y log.

### No implementar todavia

- No usar `visible_gantt` en UI hasta confirmar columna real o aprobar cambio de estructura.
- No borrar filas.
- No agregar columnas ni hojas sin etapa especifica.
- No confiar en permisos definidos por front.
- No habilitar edicion avanzada de fase, hito, dependencias, fechas planificadas ni formulas.

### Etapas futuras sugeridas

| Etapa | Objetivo | Resultado esperado |
|---|---|---|
| 31C2F1 | Permisos minimos Gantt | Escrituras rechazadas si no hay actor autorizado. |
| 31C2F2 | LockService | Create/update/disable protegidos contra carreras. |
| 31C2F3 | Auditoria estandarizada | Log consistente o pendiente formal si falta hoja compatible. |
| 31C2G | UI baja logica | Baja desde front solo con `mode = "cancel"` y motivo obligatorio. |
| 31C2H | Roles avanzados | Separacion por permisos operativos. |

Confirmacion:

- 31C2F no modifica comportamiento funcional.
- No se cambiaron endpoints, payloads, Apps Script ni Google Sheets.

## Estado 31C2G - Hardening minimo backend Gantt

Estado: implementado localmente; pendiente deploy real.

Objetivo: aplicar el hardening minimo definido en 31C2F sin cambiar contratos externos.

### Cambios en arquitectura

`Apps_script_v5.js`:

- Sin cambios.
- Sigue llamando a:
  - `actualizarTareaGantt(data)`
  - `crearTareaGantt(data)`
  - `darDeBajaTareaGantt(data)`

`Gantt.gs`:

- Las funciones publicas anteriores se mantienen como fachada compatible.
- Cada funcion publica toma lock antes de ejecutar la operacion interna.
- La logica original queda delegada a funciones internas:
  - `actualizarTareaGanttSinLock`
  - `crearTareaGanttSinLock`
  - `darDeBajaTareaGanttSinLock`
- Se agregan helpers de hardening:
  - `ejecutarOperacionGanttConLock`
  - `normalizarActorDeclaradoGantt`

### LockService

- Se usa `LockService.getScriptLock()`.
- Timeout: `10000` ms.
- Si no se obtiene lock, se lanza error controlado.
- El lock se libera en `finally`.
- No cambia formato de response: `doPost` sigue devolviendo `errorResponse(err)` en errores.

### Identidad declarativa

- `created_by` / `updated_by` se normalizan antes de escribir metadata o auditoria.
- Si no vienen, se usa fallback controlado por operacion:
  - `gantt_create_sin_created_by`
  - `gantt_update_sin_updated_by`
  - `gantt_disable_sin_updated_by`
- Esta identidad no es autorizacion real.
- No se agrego allowlist ni token en esta etapa.

### Auditoria minima

- Se reutiliza `registrarAuditoriaGanttSiExiste`.
- No crea hojas ni columnas.
- Si existe una hoja compatible, puede registrar:
  - timestamp;
  - operacion;
  - task_id;
  - actor/usuario declarado;
  - campos afectados;
  - before/after.
- Se ampliaron alias de columnas de auditoria para aceptar `timestamp`, `operation`, `actor`, `usuario_declarado`, `client_actor`, `fields_changed` y `campos_afectados`.

### Compatibilidad

- Sin cambios en endpoints.
- Sin cambios en payloads.
- Sin cambios en responses OK.
- Sin cambios en `Apps_script_v5.js`.
- Sin cambios en Google Sheets.
- Sin cambios en front.

### Validaciones locales

| Validacion | Resultado | Estado |
|---|---|---|
| `node --check Apps_script_v5.js` | Sin errores | OK |
| Carga conjunta local | `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs`, `Apps_script_v5.js` | OK |
| Update mock | `gantt_task_update` OK con lock | OK |
| Create mock | `gantt_task_create` OK con lock | OK |
| Disable mock | `gantt_task_disable` OK con lock | OK |
| Timeout lock mock | Error controlado | OK |
| Revision duplicados | Sin funciones publicas duplicadas conflictivas | OK |
| `git diff --check` | Sin errores; solo avisos CRLF | OK |

### Riesgos residuales

- Falta deploy y smoke real contra tarea dummy.
- Falta autorizacion real server-side.
- Falta idempotencia por `request_id`.
- Falta versionado o control de update simultaneo mas alla del lock.
- La auditoria sigue siendo opcional segun existencia de hoja compatible.

### Siguiente etapa recomendada

- 31C2G-post: validacion real con tarea dummy.
- Luego 31C2H: permisos server-side minimos por token/allowlist.
- Despues, UI baja logica con `mode = "cancel"`.
