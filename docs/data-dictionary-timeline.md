# Diccionario de datos - timeline / Gantt Operativo

## Objetivo

La hoja `timeline` funciona como base de datos liviana para el Gantt Operativo. Este documento define el contrato recomendado de columnas, aliases aceptados, criterios de persistencia, validaciones y estrategia de migracion.

El objetivo no es cambiar la hoja de inmediato, sino fijar una referencia estable para futuras etapas de compatibilidad, normalizacion y limpieza.

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
| `visible_gantt` | `Ver en Gantt`, `visible_gantt`, `visible` | enum `Si/No` | Decision pendiente | No por ahora | No | Si existe: `Si` / `No` | Revisar | No usar para baja estandar sin decision formal. |
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
- `Comentario` se mantiene, pero conviene separar `disabled_reason` a futuro.

## Estrategia de migracion

- 32C: compatibilidad y aliases. Confirmar headers reales, aliases aceptados y lectura CSV sin romper front.
- 32D: catalogos y normalizacion. Definir `fases`, `responsables`, `hitos` y reglas de validacion en hoja.
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
