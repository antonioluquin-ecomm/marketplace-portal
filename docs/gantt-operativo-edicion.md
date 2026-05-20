# Gantt Operativo - diseno tecnico para edicion via Apps Script

Fecha: 2026-05-19

Estado: 30E1 implementa endpoint QA en Apps Script. Front aun no implementado.

## Objetivo

Definir una arquitectura segura para permitir, en una etapa futura, editar tareas del Gantt Operativo desde el front mediante Apps Script, sin cambiar el modelo read-only actual hasta que exista una etapa critica de implementacion y pruebas con tarea dummy o entorno QA.

## Estado actual

`internal/gantt/gantt-operativo.html` carga datos de dos CSV publicados desde Google Sheets:

- `SELLERS_URL`: hoja `sellers`.
- `TIMELINE_URL`: hoja `timeline`.

La pagina sigue siendo read-only. Usa `fetch(..., { cache: "no-store" })`, parsea CSV localmente y normaliza:

- `SELLERS`: mapa por `seller_id`.
- `TASKS`: array de tareas visibles del timeline.

Campos normalizados por tarea:

- `task_id`
- `seller_id`
- `seller_nombre`
- `fase`
- `hito`
- `tarea`
- `responsable`
- `dependencia`
- `inicio_plan`
- `fin_plan`
- `inicio_real`
- `fin_real`
- `estado`
- `atraso_raw`
- `comentario`
- `visible`

Cada tarea se identifica en el front por `task_id`. El modal de detalle actual se abre con `openModal(taskId)` y busca la tarea con `TASKS.find(x => x.task_id === taskId)`.

Limitaciones actuales:

- No existe escritura desde el Gantt.
- El Apps Script actual no tiene una operacion para actualizar tareas del `timeline`.
- El CSV publicado es una fuente de lectura, no de escritura.
- No hay validacion actual de unicidad de `task_id` en el front.
- No hay control de concurrencia ni auditoria especifica para tareas de timeline.

## Requisito futuro

Permitir edicion controlada de tareas desde el front sin tocar manualmente la base, con validaciones fuertes y recarga posterior del Gantt.

El cambio debe ser incremental:

- primero endpoint Apps Script con tarea dummy;
- luego UI de edicion solo para campos de bajo riesgo;
- despues smoke controlado;
- finalmente habilitacion operativa limitada.

## Clasificacion de campos

### Editables de bajo riesgo

Estos campos pueden habilitarse primero:

- `estado`
- `responsable`
- `inicio_real`
- `fin_real`
- `comentario`

Validaciones minimas:

- `estado` debe pertenecer a un enum permitido.
- `inicio_real` y `fin_real` deben ser fechas validas o vacias.
- `fin_real` no deberia ser anterior a `inicio_real`.
- `responsable` debe ser texto corto controlado.
- `comentario` debe tener limite de longitud.

### Editables con validacion fuerte

Estos campos pueden afectar la planificacion y deben quedar para una segunda fase:

- `inicio_plan`
- `fin_plan`
- `fase`
- `hito`
- `dependencia`
- `visible_gantt`

Validaciones adicionales:

- `fin_plan` no debe ser anterior a `inicio_plan`.
- `fase` debe pertenecer a fases permitidas.
- `dependencia` debe referenciar un `task_id` existente o quedar vacia.
- `visible_gantt` solo debe aceptar valores normalizados, por ejemplo `si` / `no`.

### Restringidos / no editables

No deben editarse desde el front:

- `task_id`
- `id_tarea`
- `seller_id`
- `seller_nombre`
- nombre de seller derivado de hoja `sellers`

### Criticos / fuera de alcance del front

No tocar desde el front:

- columnas calculadas;
- formulas;
- estructura de hoja;
- nombres de columnas;
- URLs CSV;
- columnas internas de control;
- columnas de auditoria generadas por backend;
- cualquier campo que altere integridad de `seller_id` o `task_id`.

## Contrato Apps Script propuesto

Nueva operacion:

```json
{
  "tipo_formulario": "gantt_task_update",
  "task_id": "SPT-001-T01",
  "updated_by": "usuario@dominio.com",
  "fields": {
    "estado": "En curso",
    "responsable": "Operaciones",
    "inicio_real": "2026-05-19",
    "fin_real": "",
    "comentario": "Actualizado desde Gantt Operativo."
  }
}
```

Respuesta esperada:

```json
{
  "ok": true,
  "task_id": "SPT-001-T01",
  "updated_fields": ["estado", "responsable", "comentario"],
  "error": "",
  "row_number": 12
}
```

Para errores:

```json
{
  "ok": false,
  "task_id": "SPT-001-T01",
  "updated_fields": [],
  "error": "task_id duplicado",
  "row_number": null
}
```

`row_number` debe ser opcional y solo para debug interno. No debe usarse como identificador estable en el front.

## Validaciones Apps Script

El endpoint futuro debe:

- validar `tipo_formulario`;
- aceptar `gantt_task_update`;
- validar `task_id` obligatorio;
- buscar la fila en hoja `timeline` por `task_id` / `id_tarea`;
- rechazar si el `task_id` no existe;
- rechazar si el `task_id` aparece duplicado;
- validar que `fields` sea objeto;
- rechazar o ignorar campos no permitidos, preferentemente rechazar para seguridad;
- validar fechas;
- validar `estado` contra enum permitido;
- no modificar columnas calculadas ni formulas;
- escribir `updated_at` desde Apps Script;
- escribir `updated_by` si se envia;
- devolver JSON consistente OK/Error;
- registrar auditoria en hoja log si existe o crear una hoja futura `timeline_log`.

Enum inicial de estado:

- `Pendiente`
- `En curso`
- `Bloqueado`
- `Completado`
- `Cancelado`

## Flujo front futuro

1. Usuario abre modal de detalle actual.
2. Click en boton `Editar`.
3. Se abre drawer o modal de edicion con campos controlados.
4. El front muestra `task_id`, seller y tarea como solo lectura.
5. Usuario edita campos permitidos.
6. Validacion previa en front.
7. Confirmacion antes de guardar.
8. POST a Apps Script con `tipo_formulario: "gantt_task_update"`.
9. Feedback visual:
   - guardando;
   - OK;
   - error con mensaje.
10. Tras OK:
   - recargar CSV con `loadData(true)`, o
   - actualizar localmente solo si la respuesta devuelve valores normalizados.

Recomendacion: usar recarga CSV tras OK para evitar divergencias entre front y Google Sheets.

## Seguridad y riesgos

Riesgos principales:

- escritura concurrente y pisado de cambios;
- usuarios no autorizados;
- duplicidad de `task_id`;
- cambios de fechas que rompan timeline;
- cambios de `fase` o `dependencia` sin criterio operativo;
- perdida de trazabilidad;
- falta de rollback;
- dependencia de disponibilidad de Apps Script;
- errores CORS/no-cors si el endpoint no responde JSON legible;
- exposicion de endpoint si no hay control de origen o token.

Mitigaciones recomendadas:

- exigir tarea dummy en 30E1;
- bloquear edicion de campos criticos;
- registrar auditoria;
- validar `updated_by`;
- devolver errores explicitos;
- no usar `row_number` desde el front;
- no habilitar edicion masiva;
- no guardar si los datos cargados estan desactualizados, si se implementa `updated_at`;
- mantener el Gantt read-only por defecto hasta habilitacion controlada.

## Etapas futuras recomendadas

### 30E1 - Endpoint Apps Script QA

Archivos posibles:

- `Apps_script_v5.js`
- `docs/test-matrix.md`
- `CHANGELOG.md`

Alcance:

- agregar `gantt_task_update`;
- buscar por `task_id`;
- validar duplicados;
- permitir solo campos de bajo riesgo;
- probar con tarea dummy o entorno QA.

### 30E2 - UI de edicion acotada

Archivos posibles:

- `internal/gantt/gantt-operativo.html`
- `docs/test-matrix.md`

Alcance:

- boton `Editar` en modal de detalle;
- drawer/modal de edicion;
- campos de bajo riesgo;
- validacion front;
- POST controlado;
- feedback OK/Error;
- recarga con `loadData(true)`.

### 30E3 - Smoke con tarea test

Archivos posibles:

- `docs/test-matrix.md`
- `CHANGELOG.md`

Alcance:

- probar `task_id` valido;
- probar `task_id` inexistente;
- probar duplicado;
- probar campo no permitido;
- probar fecha invalida;
- probar estado invalido;
- probar recarga de Gantt.

### 30E4 - Habilitacion controlada

Archivos posibles:

- `internal/gantt/gantt-operativo.html`
- `Apps_script_v5.js`
- documentacion

Alcance:

- habilitar edicion solo a usuarios/flujo autorizado;
- documentar rollback operativo;
- confirmar auditoria;
- mantener campos criticos restringidos.

## Validaciones futuras obligatorias

- POST con `task_id` valido.
- POST con `task_id` inexistente.
- POST con `task_id` duplicado.
- POST con campo no permitido.
- POST con fecha invalida.
- POST con `estado` invalido.
- POST sin `updated_by`.
- POST con `fields` vacio.
- Verificar que formulas no cambian.
- Verificar que columnas no permitidas no se modifican.
- Verificar recarga de Gantt despues de guardar.
- Verificar modal/lista/timeline tras recarga.
- Verificar que no se alteran tareas productivas durante smoke.

## Decision 30D

30D no implemento escritura ni cambio archivos funcionales. 30E1 agrega solo el endpoint QA en Apps Script; el front sigue sin escritura.

## Estado 30E1

Implementado en `Apps_script_v5.js`:

- `tipo_formulario = "gantt_task_update"`.
- Busca la tarea por `task_id` o `id_tarea`.
- Rechaza `task_id` inexistente.
- Rechaza `task_id` duplicado.
- Permite actualizar solo campos de bajo riesgo:
  - `estado`
  - `responsable`
  - `inicio_real`
  - `fin_real`
  - `comentario`
- Rechaza cualquier otro campo recibido en `fields`.
- Valida fechas `YYYY-MM-DD` o vacio.
- Valida `estado` contra enum permitido.
- No crea columnas nuevas.
- No crea hoja de auditoria nueva.
- Registra `updated_at` / `updated_by` solo si esas columnas ya existen en `timeline`.
- Registra auditoria solo si ya existe una hoja compatible: `timeline_log`, `gantt_task_log`, `gantt_updates_log` o `auditoria_gantt`.
- Validacion local mockeada OK: update valido en memoria, rechazo de campo no permitido, rechazo de fecha invalida y guardia `seller_id` existente para formularios actuales.

Respuesta final 30E1:

```json
{
  "ok": true,
  "task_id": "SPT-001-T01",
  "updated_fields": ["estado", "comentario"]
}
```

Respuesta de error:

```json
{
  "ok": false,
  "status": "error",
  "error": "mensaje claro",
  "message": "Error: mensaje claro"
}
```

Payload dummy recomendado para QA, no ejecutar contra tareas productivas:

```json
{
  "tipo_formulario": "gantt_task_update",
  "task_id": "TASK-DUMMY-QA",
  "updated_by": "qa@marketplace.local",
  "fields": {
    "estado": "En curso",
    "responsable": "QA",
    "inicio_real": "2026-05-19",
    "fin_real": "",
    "comentario": "Prueba controlada endpoint 30E1."
  }
}
```

Pendiente antes de ejecutar pruebas reales:

- confirmar `task_id` dummy existente en hoja `timeline`;
- confirmar si existen columnas `updated_at` / `updated_by`;
- confirmar si existe hoja compatible de auditoria;
- aprobar ejecucion manual contra entorno QA o tarea dummy.

## Estado 30E3

Implementado en `internal/gantt/gantt-operativo.html`:

- Boton `Editar tarea` dentro del modal de detalle.
- Modal de edicion separado para campos operativos de bajo riesgo.
- Campos editables desde UI:
  - `estado`
  - `responsable`
  - `inicio_real`
  - `fin_real`
  - `comentario`
- Payload enviado al endpoint:

```json
{
  "tipo_formulario": "gantt_task_update",
  "task_id": "SPT-001-T01",
  "updated_by": "gantt-operativo-ui",
  "fields": {
    "estado": "En curso",
    "responsable": "QA",
    "inicio_real": "2026-05-19",
    "fin_real": "",
    "comentario": "Comentario operativo."
  }
}
```

Controles aplicados:

- Confirmacion obligatoria antes de guardar.
- Advertencia QA adicional si la tarea editada no es `TASK-DUMMY-QA`.
- Validacion local de estado permitido.
- Validacion local de fechas `YYYY-MM-DD` o vacio.
- Validacion de rango: `fin_real` no puede ser anterior a `inicio_real`.
- No se exponen campos `task_id`, `seller_id`, `seller_nombre`, `fase`, `hito`, `dependencia`, `visible_gantt`, fechas planificadas ni columnas calculadas como editables.
- Tras respuesta OK, la vista se actualiza localmente de forma segura y muestra feedback en el modal de detalle.

Pendiente de QA manual:

- Probar primero contra `TASK-DUMMY-QA`.
- Validar error con `task_id` inexistente usando endpoint o fixture controlado.
- Validar error con fecha invalida.
- Confirmar que el CSV publicado refleja el cambio despues de la latencia normal de Google Sheets.
- Confirmar sin errores JS en navegador real.

## Estado 31C-fix

El endpoint Gantt mantiene el payload externo con `task_id`, pero ahora resuelve la columna identificadora de la hoja `timeline` con alias de header:

- `task_id`
- `id_tarea`
- `ID Tarea`
- `Id Tarea`
- `id tarea`

No se renombra la columna visible en Google Sheets y no cambian responses ni campos del front.

Validacion local:

- Smoke mockeado con header `ID Tarea`: OK.
- Error por `task_id` faltante: OK.
- Error por `task_id` inexistente: OK.

Etapa futura sugerida 31C2:

- Evaluar creacion/desactivacion de tareas Gantt desde el front.
- No borrar tareas fisicamente.
- Preferir baja logica con `visible_gantt = No` o `estado = Cancelado` para preservar historial y dependencias.
