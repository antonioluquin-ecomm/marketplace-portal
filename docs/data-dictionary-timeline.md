# Diccionario de datos - timeline / Gantt Operativo

## Objetivo

La hoja `timeline` funciona como base de datos liviana para el Gantt Operativo. Este documento define el contrato recomendado de columnas, aliases aceptados, criterios de persistencia, validaciones y estrategia de migracion.

El objetivo no es cambiar la hoja de inmediato, sino fijar una referencia estable para futuras etapas de compatibilidad, normalizacion y limpieza.

## Estado final 35E - Timeline v33/v34/v35

Estado real al cierre documental 35E:

- El contrato operativo vigente usa 14 columnas canonicas.
- Frontend lee/renderiza modelo v33 y mantiene aliases legacy.
- Frontend create/update envia `inicio`, `fin`, `entorno`, `depende_de` e `hito`.
- Apps Script soporta create/update/disable v33 + legacy.
- Auditor automatico soporta modelo v33 + legacy.
- UX vigente incluye filtro por entorno, badges QA/Productivo, selector `depende_de`, hitos dinamicos por fase, boton `Hoy`, vista Semana centrada, columnas sticky y refinamiento visual compacto.
- Smoke real manual del Gantt v33/v34/v35 fue reportado como OK antes del cierre documental 35E.
- No se modifico Google Sheets durante la consolidacion documental 35E.

### Columnas oficiales actuales

| Orden | Campo canonico | Semantica | Obligatorio | Editable actual | Validacion actual |
|---|---|---|---|---|---|
| 1 | `task_id` | ID unico de tarea | Si | No | Unico; alias visual `ID Tarea` aceptado |
| 2 | `seller_id` | FK logica hacia seller | Si | Solo alta | Requerido; no se modifica en update |
| 3 | `seller_nombre` | Snapshot visual `Seller / Marca` | No | No | Opcional; se persiste en create si viene |
| 4 | `fase` | Agrupador funcional | Si | Alta; bloqueada en update UI | Catalogo frontend cerrado |
| 5 | `hito` | Subcategoria operativa dependiente de fase | Si | Alta y update UI | Frontend valida fase->hito; backend valida no vacio |
| 6 | `tarea` | Descripcion principal | Si | Alta | Requerido |
| 7 | `responsable` | Equipo/persona responsable | Si | Alta y update | Catalogo frontend cerrado |
| 8 | `depende_de` | Dependencia simple a otra tarea | No | Alta y update | Frontend y backend validan task_id existente o vacio |
| 9 | `entorno` | Ambito de ejecucion | Si | Alta y update | `QA` / `Productivo` |
| 10 | `inicio` | Fecha de inicio planificada oficial | Si | Alta y update | Fecha `YYYY-MM-DD` |
| 11 | `fin` | Fecha de fin planificada oficial | Si | Alta y update | Fecha `YYYY-MM-DD`; `fin >= inicio` |
| 12 | `estado` | Estado operativo | Si | Alta y update | `Pendiente`, `En curso`, `Bloqueado`, `Completado`, `Cancelado` |
| 13 | `comentario` | Nota operativa | No | Alta y update | Texto libre con largo maximo |
| 14 | `ver_en_gantt` | Visibilidad logica opcional | No | Oculto en UI | Alias soportado; decision funcional pendiente |

### Aliases legacy consolidados

| Campo canonico | Aliases aceptados |
|---|---|
| `task_id` | `ID Tarea`, `Id Tarea`, `id tarea`, `id_tarea`, `task_id` |
| `seller_nombre` | `Seller / Marca`, `seller_nombre`, `seller_marca`, `seller` |
| `hito` | `Hito`, `hito` |
| `depende_de` | `Depende de`, `depende_de`, `dependencia` |
| `inicio` | `Inicio`, `inicio`, `Inicio plan`, `inicio_plan`, `fecha_inicio_plan` |
| `fin` | `Fin`, `fin`, `Fin plan`, `fin_plan`, `fecha_fin_plan` |
| `ver_en_gantt` | `Ver en Gantt`, `ver_en_gantt`, `visible_gantt`, `visible`, `Visible Gantt` |
| `inicio_real` | `Inicio real`, `inicio_real`, `fecha_inicio_real` |
| `fin_real` | `Fin real`, `fin_real`, `fecha_fin_real` |

`inicio_real` y `fin_real` estan deprecados. Si aparecen en datos historicos, se tratan como legacy/read-only; no son editables y no deben enviarse en payloads nuevos.

### Payloads reales vigentes

Create:

```json
{
  "tipo_formulario": "gantt_task_create",
  "created_by": "front@gantt-operativo",
  "task": {
    "seller_id": "SPT-001",
    "seller_nombre": "Seller Demo",
    "fase": "Comercial",
    "hito": "Contrato y firma",
    "tarea": "Enviar contrato al seller",
    "responsable": "Comercial",
    "depende_de": "",
    "entorno": "QA",
    "inicio": "2026-06-01",
    "fin": "2026-06-03",
    "estado": "Pendiente",
    "comentario": ""
  }
}
```

Update:

```json
{
  "tipo_formulario": "gantt_task_update",
  "task_id": "SPT-001-T-01",
  "updated_by": "front@gantt-operativo",
  "fields": {
    "hito": "Configuracion comercial VTEX",
    "estado": "En curso",
    "responsable": "eCommerce",
    "entorno": "QA",
    "inicio": "2026-06-01",
    "fin": "2026-06-04",
    "comentario": "",
    "depende_de": ""
  }
}
```

Disable:

```json
{
  "tipo_formulario": "gantt_task_disable",
  "task_id": "SPT-001-T-01",
  "updated_by": "front@gantt-operativo",
  "mode": "cancel",
  "reason": "Motivo de baja"
}
```

La baja logica estandar usa `Estado = Cancelado`. `ver_en_gantt` no esta expuesto en UI.

### Hitos validos por fase

| Fase | Hitos validos |
|---|---|
| `Comercial` | Definicion comercial inicial; Configuracion comercial VTEX; Condiciones comerciales; Medios de pago; Documentacion comercial; Contrato y firma; Carga comercial inicial |
| `Tecnica` | Configuracion logistica VTEX; Configuracion base PIM; Integracion seller; Configuracion storefront; Configuracion checkout; Configuracion OMS; Configuracion depositos; Configuracion APIs; Configuracion mails |
| `Operativa` | Configuracion administrativa; Configuracion postventa; Operacion logistica; Operacion financiera; Capacitacion; Comunicacion operativa |
| `QA / Validacion` | QA tecnica; QA operativa; QA storefront; QA checkout; QA logistica; Validacion integral |
| `Go Live` | Aprobacion final; Go Live seller; Monitoreo inicial; Estabilizacion inicial; Cierre onboarding |

Notas:

- El catalogo fase->hito esta hardcodeado en el frontend.
- El frontend bloquea hitos fuera del catalogo de la fase seleccionada.
- Si una tarea historica trae un hito fuera de catalogo, el frontend lo muestra temporalmente como legacy para no romper la edicion.
- Apps Script permite update de `hito` y valida que no venga vacio, pero aun no valida pertenencia fase->hito.

### UX operativa documentada

- Filtros activos: seller, entorno, fase, estado, responsable, busqueda y solo activos.
- `Entorno` filtra localmente entre `Todos`, `QA` y `Productivo`.
- Badges QA/Productivo aparecen en lista, detalle y barras si el ancho lo permite.
- `depende_de` se elige desde tareas existentes del mismo seller; en edicion excluye la tarea actual.
- Fase, responsable, entorno e hito se operan con dropdowns controlados.
- Vista Mes mantiene rango amplio.
- Vista Semana enfoca la semana actual: una semana anterior y proximas semanas.
- Boton `Hoy` mueve el scroll horizontal al foco temporal.
- Columnas operativas sticky mantienen visible seller/tarea y estado durante el scroll horizontal del timeline.
- Hero, recursos/accesos, KPIs y toolbar fueron compactados para priorizar el timeline.
- El timeline queda como superficie protagonista con contraste reforzado en headers temporales, grid, linea de hoy, badges y pills activas.

### Decisiones pendientes

- `ver_en_gantt` sigue oculto en UI y pendiente de decision funcional.
- No hay quick actions.
- No hay templates de onboarding.
- No hay drag and drop.
- No hay persistencia de filtros.
- No hay edicion masiva.
- No hay editor de catalogos.
- `depende_de` sigue siendo dependencia simple, no grafo avanzado ni lista multiple.
- El catalogo fase->hito sigue local en frontend.

## Contrato canonico 33B - nuevo modelo Timeline

Estado: contrato documental aprobado. Desde 33E, `Gantt.gs` soporta aliases y validaciones v33 en create/update/disable de forma local, sin modificar Google Sheets ni payloads reales del frontend.

### Columnas canonicas

1. `task_id`
2. `seller_id`
3. `seller_nombre`
4. `fase`
5. `hito`
6. `tarea`
7. `responsable`
8. `depende_de`
9. `entorno`
10. `inicio`
11. `fin`
12. `estado`
13. `comentario`
14. `ver_en_gantt`

Decisiones 33B:

- `inicio_real` y `fin_real` salen del contrato operativo. Si aparecen en datos historicos, deben tratarse como legacy/deprecados y solo lectura durante la transicion.
- `inicio_plan` y `fin_plan` dejan de ser nombres canonicos. El modelo usa solo `inicio` y `fin`.
- `entorno` es obligatorio y acepta `QA` o `Productivo`.
- `estado` sigue separado de `entorno`.
- `depende_de` queda opcional.
- `ver_en_gantt` queda opcional y pendiente de decision funcional final.

### Matriz canonica 33B

| Campo canonico | Aliases legacy aceptados | Tipo | Obligatorio | Editable frontend | Validacion | Observaciones |
|---|---|---|---|---|---|---|
| `task_id` | `ID Tarea`, `id_tarea`, `task_id` | string | Si | No | Unico; formato `SPT-###-T-##` o dummy QA autorizado | Clave primaria logica. |
| `seller_id` | `seller_id`, `id_seller`, `seller` | string | Si | Solo alta | Debe existir en `sellers` | FK logica. |
| `seller_nombre` | `Seller / Marca`, `seller_nombre`, `seller_marca`, `seller` | string | No | No | Fallback visual; no autoridad | Snapshot opcional; desde 33F-BACKEND-FIX Apps Script lo persiste en create si viene en payload y existe columna compatible. |
| `fase` | `Fase`, `fase` | enum/texto catalogado | Si | Alta; edit futuro controlado | Catalogo sugerido | Impacta filtros y color. |
| `hito` | `Hito`, `hito` | enum/texto catalogado | Si | Alta; edit futuro controlado | Requerido; ideal por fase | Contexto visual y operativo. |
| `tarea` | `Tarea`, `tarea`, `actividad` | string | Si | Alta | Requerido; largo maximo | Nombre principal mostrado. |
| `responsable` | `Responsable`, `responsable` | enum/texto catalogado | Si | Si | Catalogo futuro o lista cerrada | Evita variantes para reporting. |
| `depende_de` | `Depende de`, `depende_de`, `dependencia` | string/lista | No | Futuro controlado | `task_id` existente o vacio | Puede aceptar multiples dependencias en etapa futura. |
| `entorno` | `Entorno`, `entorno` | enum | Si | Alta; edit si se aprueba | `QA` / `Productivo` | Separado de `estado`. |
| `inicio` | `Inicio`, `inicio`, `Inicio plan`, `inicio_plan`, `fecha_inicio_plan` | date | Si | Alta; edit si se aprueba | Fecha valida `YYYY-MM-DD` | Reemplaza `inicio_plan`. |
| `fin` | `Fin`, `fin`, `Fin plan`, `fin_plan`, `fecha_fin_plan` | date | Si | Alta; edit si se aprueba | Fecha valida `YYYY-MM-DD`; >= `inicio` | Reemplaza `fin_plan`. |
| `estado` | `Estado`, `estado`, `estado_tarea` | enum | Si | Si | `Pendiente`, `En curso`, `Bloqueado`, `Completado`, `Cancelado` | Comunica avance y baja logica con `Cancelado`. |
| `comentario` | `Comentario`, `comentario`, `comentarios` | string | No | Si | Largo maximo; texto libre | No usar como unico campo de auditoria futura. |
| `ver_en_gantt` | `Ver en Gantt`, `ver_en_gantt`, `visible_gantt`, `visible`, `Visible Gantt` | enum `Si/No` | No | No por ahora | Si existe: `Si` / `No` | Pendiente decision final. |
| `inicio_real` | `Inicio real`, `inicio_real`, `fecha_inicio_real` | date legacy | No | No | Solo lectura si aparece | Deprecado; no enviar en payload futuro. |
| `fin_real` | `Fin real`, `fin_real`, `fecha_fin_real` | date legacy | No | No | Solo lectura si aparece | Deprecado; no enviar en payload futuro. |

### Payload futuro esperado

Create:

```json
{
  "tipo_formulario": "gantt_task_create",
  "task": {
    "seller_id": "SPT-001",
    "fase": "Operativa",
    "hito": "QA",
    "tarea": "Nueva tarea",
    "responsable": "eCommerce",
    "depende_de": "",
    "entorno": "QA",
    "inicio": "2026-06-20",
    "fin": "2026-06-21",
    "estado": "Pendiente",
    "comentario": "",
    "ver_en_gantt": "Si"
  }
}
```

Update:

```json
{
  "tipo_formulario": "gantt_task_update",
  "task_id": "SPT-001-T-01",
  "fields": {
    "estado": "En curso",
    "responsable": "eCommerce",
    "entorno": "QA",
    "inicio": "2026-06-20",
    "fin": "2026-06-21",
    "comentario": "",
    "depende_de": ""
  }
}
```

Campos retirados del update futuro:

- `inicio_real`
- `fin_real`

Disable:

```json
{
  "tipo_formulario": "gantt_task_disable",
  "task_id": "SPT-001-T-01",
  "mode": "cancel",
  "reason": "Motivo de baja"
}
```

La baja logica estandar mantiene `estado = Cancelado`. `ver_en_gantt` solo debe usarse para ocultamiento si se formaliza esa decision funcional.

### Reglas de compatibilidad 33B

- No romper headers legacy.
- No eliminar aliases.
- No renombrar columnas sin etapa especifica.
- Frontend debe leer modelo nuevo y legacy durante la transicion.
- Apps Script escribe al modelo nuevo cuando existan headers v33 y tolera headers/payloads legacy durante la transicion.
- Auditor automatico debe soportar ambos modelos.
- `inicio_real` y `fin_real` pueden leerse como legado, pero no deben enviarse ni editarse en payloads futuros.

### Impacto por componente

| Componente | Impacto futuro |
|---|---|
| Frontend | `normalizeTasks()` debe producir `inicio`, `fin`, `entorno`, `depende_de`, `ver_en_gantt`; `renderGantt()` debe usar `inicio` / `fin`; modal/lista deben retirar fechas reales. |
| `Gantt.gs` | 33E agrega aliases canonicos nuevos, valida `entorno`, exige `inicio` / `fin`, retira update de `inicio_real` / `fin_real` y mantiene compatibilidad legacy. |
| `tools/audit-timeline-data.js` | Debe auditar `inicio`, `fin`, `entorno` y seguir reconociendo `inicio_plan` / `fin_plan` legacy. |
| Documentacion | Planes, checklist, matriz y roadmap deben migrar lenguaje desde `inicio_plan` / `fin_plan` hacia `inicio` / `fin`. |
| Smoke tests | Deben cubrir CSV nuevo, CSV legacy, create/update/disable mockeados y render Mes/Semana/Hoy. |

### Plan de implementacion futuro

- 33C: actualizar auditor automatico para nuevo modelo + legacy.
- 33D: actualizar frontend solo lectura / normalizacion.
- 33E: actualizar Apps Script aliases y validaciones. Completada localmente sin POST real.
- 33F: migrar create/update frontend.
- 33G: smoke mockeado completo.
- 33H: smoke real con tarea dummy autorizada.

### Riesgos 33B

- Render vacio si no se reconocen `Inicio` / `Fin`.
- Create fallando si backend exige `inicio_plan` / `fin_plan`.
- Update enviando campos eliminados.
- Perdida de compatibilidad historica si se quitan aliases.
- `entorno` sin default o sin validacion puede bloquear altas o contaminar reporting.
- Cambios de KPIs por diferencias temporales entre modelo viejo y nuevo.

## Referencia historica 32B / pre-v33

Las secciones siguientes conservan decisiones y analisis previos a la consolidacion v33-v35. Cuando haya conflicto, prevalece el bloque **Estado final 35E - Timeline v33/v34/v35**.

## Principios del modelo

- Persistir solo datos maestros u operativos necesarios.
- Calcular en frontend lo derivable, como atraso, semana, progreso, alertas y rango visible.
- Mantener compatibilidad por aliases durante cualquier transicion.
- No eliminar ni renombrar columnas sin una etapa explicita de migracion y smoke.
- Apps Script debe validar lo critico: IDs, enums, fechas, duplicados, dependencias y permisos.
- El frontend mejora UX y previene errores, pero no debe ser la unica fuente de validacion.
- La hoja debe conservar trazabilidad historica: no borrar filas fisicamente como mecanismo normal.

## Estructura actual resumida

| Columna actual | Uso actual | Diagnostico | Decision preliminar |
|---|---|---|---|
| `ID Tarea` / `task_id` / `id_tarea` | Identificador de tarea para frontend y Apps Script | Es la clave primaria logica | Mantener |
| `seller_id` | Relaciona la tarea con la hoja `sellers` | Campo base para agrupacion y alta | Mantener |
| `Seller / Marca` | Texto de apoyo o fallback visual | Redundante si `seller_id` resuelve en `sellers` | Dejar de editar |
| `Fase` | Filtro, color, modal, alta de tarea | Valor operativo central, hoy puede ser texto libre | Normalizar |
| `Hito` | Contexto visual, modal, etiqueta corta de barra | Aporta valor, pero se solapa parcialmente con `Fase` | Mantener y normalizar |
| `Tarea` | Nombre principal de la actividad | Campo operativo principal | Mantener |
| `Responsable` | Filtro, modal, alta/edicion | Requiere consistencia para reporting | Normalizar |
| `Depende de` | Se lee y muestra; prepara dependencias | Util aun si hoy no ordena el render | Mantener opcional |
| `Inicio plan` | Fecha planificada inicial | Necesaria para render | Mantener |
| `Fin plan` | Fecha planificada final | Necesaria para render | Mantener |
| `Inicio real` | Seguimiento real editable | Campo operativo de avance | Mantener opcional |
| `Fin real` | Seguimiento real editable | Campo operativo de cierre | Mantener opcional |
| `Estado` | Filtros, KPIs, baja logica | Campo critico de operacion | Mantener y normalizar |
| `Atraso (dias)` | Hoja puede traer formula; frontend recalcula | Dato derivable, no maestro | Calcular |
| `Comentario` | Nota operativa, update y baja logica actual | Util, pero mezcla comentario y motivo de baja | Mantener; separar motivo futuro |
| `Ver en Gantt` / `visible_gantt` | Soportado por codigo, no usado por UI actual | Pendiente de decision formal | Revisar |

## Estructura canonica recomendada

### A. Columnas persistidas obligatorias

- `task_id`
- `seller_id`
- `fase`
- `hito`
- `tarea`
- `responsable`
- `inicio_plan`
- `fin_plan`
- `estado`

### B. Columnas persistidas opcionales

- `dependencia`
- `inicio_real`
- `fin_real`
- `comentario`
- `created_at`
- `created_by`
- `updated_at`
- `updated_by`
- `disabled_at`
- `disabled_by`
- `disabled_reason`

### C. Columnas calculadas en frontend

- `atraso_dias`
- `semana`
- progreso por seller
- alertas
- rango visible
- estado visual de barras

### D. Columnas calculadas o controladas por Apps Script

- `task_id` si no viene en el payload de alta.
- timestamps `created_at`, `updated_at`, `disabled_at`.
- validacion de duplicados.
- validacion de enums.
- validacion de fechas.
- validacion de dependencia contra `task_id` existente.

### E. Columnas candidatas a dejar de usar

- `Atraso (dias)` como dato persistido.
- `Semana` como dato persistido.
- `Seller / Marca` como dato editable.
- `visible_gantt` para baja logica estandar, salvo decision explicita de mantener visibilidad separada de estado.

### F. Columnas futuras posibles

- `task_type`
- `priority`
- `blocked_reason`
- `dependency_type`
- `sort_order`
- `source`
- `archived_at`
- `timeline_version`

## Matriz de columnas

| Columna canonica | Aliases aceptados | Tipo | Origen | Editable frontend | Obligatoria | Validacion | Decision | Observaciones |
|---|---|---|---|---|---|---|---|---|
| `task_id` | `ID Tarea`, `id_tarea`, `task_id` | string | Apps Script o carga historica | No | Si | Unico; formato `SPT-###-T-##` o alias QA autorizado | Mantener | Clave primaria logica. |
| `seller_id` | `seller_id`, `id_seller`, `seller` | string | `sellers` / alta UI | Solo alta | Si | Existe en hoja `sellers` | Mantener | FK logica. |
| `seller_nombre` | `Seller / Marca`, `seller_marca`, `seller_nombre` | string | Hoja `sellers` o snapshot | No | No | No debe ser autoridad | Dejar de editar | Mantener solo como fallback historico. |
| `fase` | `Fase`, `fase` | enum | Catalogo | Alta; edit futuro controlado | Si | Catalogo cerrado | Normalizar | Impacta filtros y color. |
| `hito` | `Hito`, `hito` | enum/texto catalogado | Catalogo por fase | Alta; edit futuro controlado | Si | Requerido; idealmente por fase | Normalizar | Mantener por valor visual y operativo. |
| `tarea` | `Tarea`, `actividad`, `tarea` | string | Usuario / plantilla | Alta | Si | Requerido; largo maximo | Mantener | Nombre principal mostrado. |
| `responsable` | `Responsable`, `responsable` | enum/id | Catalogo responsables | Si | Si | Catalogo o lista cerrada | Normalizar | Evita variantes de texto. |
| `dependencia` | `Depende de`, `depende_de`, `dependencia` | string/lista | Usuario / sistema | Futuro controlado | No | `task_id` existente o vacio | Mantener opcional | Puede aceptar multiples dependencias en etapa futura. |
| `inicio_plan` | `Inicio plan`, `fecha_inicio_plan`, `inicio_plan` | date | Usuario / plantilla | Alta; edit futuro controlado | Si | Fecha valida | Mantener | Base del render. |
| `fin_plan` | `Fin plan`, `fecha_fin_plan`, `fin_plan` | date | Usuario / plantilla | Alta; edit futuro controlado | Si | Fecha valida; >= `inicio_plan` | Mantener | Base del render. |
| `inicio_real` | `Inicio real`, `fecha_inicio_real`, `inicio_real` | date | Usuario | Si | No | Fecha valida o vacio | Mantener opcional | Campo de seguimiento. |
| `fin_real` | `Fin real`, `fecha_fin_real`, `fin_real` | date | Usuario | Si | No | Fecha valida o vacio; >= `inicio_real` si ambos existen | Mantener opcional | Campo de cierre. |
| `estado` | `Estado`, `estado_tarea`, `estado` | enum | Usuario / Apps Script | Si | Si | Enum cerrado | Mantener y normalizar | Tambien comunica baja logica con `Cancelado`. |
| `atraso_dias` | `Atraso (dias)`, `atraso_dias`, `atraso` | number | Frontend | No | No | Derivado de fechas y estado | Calcular | No deberia ser dato maestro. |
| `semana` | `Semana`, `semana` | number/string | Frontend | No | No | Derivado de `inicio_plan` | Calcular | No persistir salvo uso humano temporal. |
| `comentario` | `Comentario`, `comentarios`, `comentario` | string | Usuario | Si | No | Largo maximo; texto libre | Mantener | No usar como unico campo de baja a futuro. |
| `visible_gantt` | `Ver en Gantt`, `visible_gantt`, `visible`, `Visible Gantt` | enum `Si/No` | Decision pendiente | No por ahora | No | Si existe: `Si` / `No` | Revisar | `Ver en Gantt` es alias visual aceptado por Apps Script desde 32D; no usar para baja estandar sin decision formal. |
| `created_at` | `created_at`, `fecha_creacion`, `fecha_alta` | timestamp | Apps Script | No | No | Timestamp server-side | Mantener opcional | Metadato. |
| `created_by` | `created_by`, `creado_por`, `usuario_creacion` | string | Apps Script | No | No | Actor validado server-side futuro | Mantener opcional | No confiar solo en valor enviado por front. |
| `updated_at` | `updated_at`, `fecha_actualizacion`, `ultima_actualizacion` | timestamp | Apps Script | No | No | Timestamp server-side | Mantener opcional | Metadato. |
| `updated_by` | `updated_by`, `actualizado_por`, `usuario_actualizacion` | string | Apps Script | No | No | Actor validado server-side futuro | Mantener opcional | Auditoria liviana. |
| `disabled_at` | `disabled_at`, `fecha_baja` | timestamp | Apps Script | No | No | Timestamp server-side | Futuro | Separar baja de comentario general. |
| `disabled_by` | `disabled_by`, `baja_por` | string | Apps Script | No | No | Actor validado server-side futuro | Futuro | Requiere autorizacion real. |
| `disabled_reason` | `disabled_reason`, `motivo_baja` | string | Usuario / Apps Script | Desde accion de baja | No | Largo maximo; requerido al cancelar | Futuro | Evita pisar `comentario`. |

## Catalogos recomendados

### Fase

- `Comercial`
- `Técnica`
- `Operativa`
- `Cierre`

### Estado

- `Pendiente`
- `En curso`
- `Bloqueado`
- `Completado`
- `Cancelado`

### Responsable

Conviene crear un catalogo propio, por ejemplo hoja `responsables` o seccion dentro de `config`, con identificador estable, nombre visible, equipo y estado activo/inactivo.

No se fija una lista definitiva en este documento porque depende de la operacion vigente.

### Hito

`Hito` no debe eliminarse todavia. Es util para contexto visual y operativo, y el Gantt lo usa en modal y etiquetas. La recomendacion es normalizarlo con un catalogo por fase.

Ejemplos orientativos:

- Comercial: `Definicion comercial inicial`, `Alta de catalogo`.
- Técnica: `Configuracion base PIM`, `Ajustes storefront`.
- Operativa: `Configuracion administrativa`, `Reglas operativas`.
- Cierre: `Validacion final`, `Go Live`.

## Reglas de edicion

Puede editar el usuario desde frontend:

- `estado`
- `responsable`
- `inicio_real`
- `fin_real`
- `comentario`

Puede crear el usuario desde frontend:

- `seller_id`
- `fase`
- `hito`
- `tarea`
- `responsable`
- `inicio_plan`
- `fin_plan`
- `estado`
- `comentario`

No deberia editar nunca desde frontend:

- `task_id`
- `seller_nombre` / `Seller / Marca`
- columnas calculadas
- timestamps
- columnas de auditoria
- formulas
- nombres de columnas
- `visible_gantt`, mientras no exista decision formal

Apps Script debe validar:

- existencia y unicidad de `task_id`;
- existencia de `seller_id`;
- enums de `fase` y `estado`;
- catalogos de `responsable` e `hito` cuando existan;
- fechas y rangos;
- dependencia valida o vacia;
- permisos y actor real;
- largos maximos de texto.

La hoja deberia proteger:

- headers;
- columnas de ID;
- columnas calculadas si permanecen visibles;
- timestamps y auditoria;
- formulas historicas;
- columnas que no formen parte de la UI aprobada.

## Decisiones importantes

- `Atraso (dias)` no deberia ser dato maestro. Debe calcularse desde fechas, estado y fecha actual.
- `Semana` deberia calcularse desde `inicio_plan`.
- `Hito` se mantiene por ahora, pero debe normalizarse.
- `visible_gantt` queda pendiente de decision formal. La baja logica estandar actual debe sostenerse con `Estado = Cancelado` mientras no se apruebe otra semantica.
- 32C detecto que la hoja real usa `Ver en Gantt` como header visual y 32D agrego compatibilidad minima para resolverlo como alias de `visible_gantt`, sin limpiar ni modificar Google Sheets.
- `Comentario` se mantiene, pero conviene separar `disabled_reason` a futuro.

## Estrategia de migracion

- 32C: auditoria de compatibilidad y aliases. Confirmar headers reales, aliases aceptados y lectura CSV sin romper front.
- 32D: compatibilidad minima de alias `Ver en Gantt` -> `visible_gantt`, sin tocar datos ni decidir todavia si `visible_gantt` sigue o se retira.
- 32D-bis: catalogos y normalizacion. Definir `fases`, `responsables`, `hitos` y reglas de validacion en hoja.
- 32E: backend valida contra catalogos. Apps Script pasa a ser autoridad para enums y dependencias.
- 32F: limpieza controlada de columnas derivadas. Dejar de usar `Atraso (dias)` y `Semana` como datos maestros.
- 32G: smoke real con dummy. Ejecutar create, update y disable con tarea dummy autorizada.

No proponer cambios destructivos inmediatos. Cada etapa debe dejar compatibilidad hacia atras hasta completar smoke.

## Riesgos

- Romper CSV publicado por renombrar headers.
- Romper frontend por quitar aliases actuales.
- Romper Apps Script por cambiar columnas obligatorias sin actualizar aliases.
- Perder compatibilidad con headers visuales como `ID Tarea`.
- Afectar tareas historicas o dummies QA.
- Confundir navegacion visual con filtrado real.
- Usar `visible_gantt` con una semantica distinta a `estado`.
- Confiar en validaciones frontend para controles criticos.

## Validaciones futuras

- Lectura CSV de `timeline`.
- Render Gantt en vista Mes.
- Render Gantt en vista Semana.
- Cambio Mes/Semana.
- Boton `Hoy`.
- Create dummy.
- Update dummy.
- Disable dummy.
- Campos obligatorios.
- Enums validos e invalidos.
- Dependencia valida.
- Dependencia invalida.
- Duplicado de `task_id`.
- Tarea historica con aliases visuales.
- Compatibilidad con `ID Tarea`.
- Confirmacion de que no se crean columnas implicitamente.
