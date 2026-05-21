# Checklist manual de saneamiento - timeline

## 1. Objetivo del checklist

Convertir el reporte automatico 32F en una guia operativa para sanear manualmente la hoja real `timeline` de forma controlada. El saneamiento debe corregir inconsistencias reales sin cambios destructivos, con backup previo y sin romper compatibilidad historica con CSV publicado, frontend ni Apps Script.

Este checklist no autoriza cambios masivos ni limpieza fisica. Cada tanda debe ser pequena, revisable y validada antes de avanzar.

## 2. Reglas previas obligatorias

- Exportar o duplicar la hoja antes de editar.
- No borrar filas.
- No borrar columnas.
- No renombrar headers.
- No modificar `task_id`.
- No modificar `seller_id` sin validar contra la hoja `sellers`.
- Trabajar por tandas pequenas.
- Documentar cada cambio relevante con fecha, responsable y motivo.
- Validar frontend despues de cada tanda.
- Regenerar `docs/timeline-data-audit-report.md` con `node tools/audit-timeline-data.js` despues de cada tanda.
- No limpiar dummies sin decidir antes si quedan como QA, se cancelan, se ocultan o se archivan.
- No cambiar `Ver en Gantt` masivamente mientras `visible_gantt` siga pendiente de decision formal.

## 3. Resumen ejecutivo

Base: `docs/timeline-data-audit-report.md`, `docs/timeline-data-cleanup-plan.md` y `docs/data-dictionary-timeline.md`.

| Metrica | Conteo |
|---|---:|
| Tareas `SPT-*` | 57 |
| Tareas renderizables | 44 |
| Tareas `SPT-*` sin estado | 34 |
| Tareas `SPT-*` sin fechas plan | 12 |
| Tareas `SPT-*` sin fase | 3 |
| Tareas `SPT-*` sin hito | 3 |
| Tareas `SPT-*` sin responsable | 1 |
| Fechas reales no canonicas | 2 |
| Dependencias rotas | 1 |
| Filas no productivas / no `SPT-*` | 20 |
| Tareas con `Ver en Gantt = No` | 1 |
| Columnas derivables presentes | `Atraso (dias)` |

## 4. Checklist por severidad

### A. Criticos

#### Tareas sin fechas plan

Accion general: completar `Inicio plan` y `Fin plan` si la tarea debe renderizar en Gantt; si no debe renderizar, decidir tratamiento operativo sin borrar fila.

| task_id | Problema | Accion sugerida | Riesgo | Validacion posterior |
|---|---|---|---|---|
| `SPT-002-T-04` | Sin `Inicio plan` / `Fin plan` | Completar fechas o marcar fuera de Gantt | Cambia conteo/render | Reejecutar reporte y confirmar Gantt |
| `SPT-002-T-10` | Sin `Inicio plan` / `Fin plan` | Completar fechas o marcar fuera de Gantt | Cambia conteo/render | Reejecutar reporte y confirmar Gantt |
| `SPT-002-T-11` | Sin `Inicio plan` / `Fin plan` | Completar fechas o marcar fuera de Gantt | Cambia conteo/render | Reejecutar reporte y confirmar Gantt |
| `SPT-002-T-13` | Sin `Inicio plan` / `Fin plan` | Completar fechas o marcar fuera de Gantt | Cambia conteo/render | Reejecutar reporte y confirmar Gantt |
| `SPT-002-T-16` | Sin `Inicio plan` / `Fin plan` | Completar fechas o marcar fuera de Gantt | Cambia conteo/render | Reejecutar reporte y confirmar Gantt |
| `SPT-002-T-17` | Sin `Inicio plan` / `Fin plan` | Completar fechas o marcar fuera de Gantt | Cambia conteo/render | Reejecutar reporte y confirmar Gantt |
| `SPT-002-T-21` | Sin `Inicio plan` / `Fin plan` | Completar fechas o marcar fuera de Gantt | Cambia conteo/render | Reejecutar reporte y confirmar Gantt |
| `SPT-002-T-25` | Sin `Inicio plan` / `Fin plan` | Completar fechas o marcar fuera de Gantt | Cambia conteo/render | Reejecutar reporte y confirmar Gantt |
| `SPT-002-T-26` | Sin `Inicio plan` / `Fin plan` | Completar fechas o marcar fuera de Gantt | Cambia conteo/render | Reejecutar reporte y confirmar Gantt |
| `SPT-002-T-27` | Sin `Inicio plan` / `Fin plan` | Completar fechas o marcar fuera de Gantt | Cambia conteo/render | Reejecutar reporte y confirmar Gantt |
| `SPT-002-T-28` | Sin `Inicio plan` / `Fin plan` | Completar fechas o marcar fuera de Gantt | Cambia conteo/render | Reejecutar reporte y confirmar Gantt |
| `SPT-002-T-29` | Sin `Inicio plan` / `Fin plan` | Completar fechas o marcar fuera de Gantt | Cambia conteo/render | Reejecutar reporte y confirmar Gantt |

#### Dependencias rotas

| task_id | Problema | Accion sugerida | Riesgo | Validacion posterior |
|---|---|---|---|---|
| `SPT-002-T-23` | `Depende de = SPT-002-T-22`, pero `SPT-002-T-22` no existe | Corregir a un `task_id` existente o vaciar dependencia con motivo documentado | Puede alterar lectura de secuencia | Reejecutar reporte y confirmar 0 dependencias rotas |

#### Fechas reales no canonicas

| task_id | Problema | Accion sugerida | Riesgo | Validacion posterior |
|---|---|---|---|---|
| `SPT-002-T-20` | `Inicio real = 10-05-2026` | Convertir a `2026-05-10` | Puede cambiar seguimiento real si se interpreta mal | Reejecutar reporte y revisar modal |
| `SPT-002-T-20` | `Fin real = 12-05-2026` | Convertir a `2026-05-12` | Puede cambiar seguimiento real si se interpreta mal | Reejecutar reporte y revisar modal |

### B. Medios

#### Estados vacios

Accion general: completar `Estado` con uno de los valores sugeridos: `Pendiente`, `En curso`, `Bloqueado`, `Completado`, `Cancelado`.

| Grupo | task_id | Accion sugerida | Riesgo | Validacion posterior |
|---|---|---|---|---|
| Bloque SPT-001 | `SPT-001-T-07` a `SPT-001-T-29` | Completar estado segun avance real | Cambia KPIs y filtros | Reejecutar reporte; revisar KPIs |
| Casos SPT-002 | `SPT-002-T-05`, `SPT-002-T-11`, `SPT-002-T-13`, `SPT-002-T-16`, `SPT-002-T-18`, `SPT-002-T-21`, `SPT-002-T-25`, `SPT-002-T-26`, `SPT-002-T-27`, `SPT-002-T-28`, `SPT-002-T-29` | Completar estado segun avance real | Cambia KPIs y filtros | Reejecutar reporte; revisar KPIs |

#### Fase vacia

| task_id | Problema | Accion sugerida | Riesgo | Validacion posterior |
|---|---|---|---|---|
| `SPT-002-T-04` | Sin `Fase` | Completar con fase valida | Cambia filtros/color | Reejecutar reporte y revisar filtros |
| `SPT-002-T-17` | Sin `Fase` | Completar con fase valida | Cambia filtros/color | Reejecutar reporte y revisar filtros |
| `SPT-002-T-21` | Sin `Fase` | Completar con fase valida | Cambia filtros/color | Reejecutar reporte y revisar filtros |

#### Hito vacio

| task_id | Problema | Accion sugerida | Riesgo | Validacion posterior |
|---|---|---|---|---|
| `SPT-002-T-04` | Sin `Hito` | Completar hito o valor transitorio aprobado | Cambia contexto visual | Reejecutar reporte y revisar modal |
| `SPT-002-T-17` | Sin `Hito` | Completar hito o valor transitorio aprobado | Cambia contexto visual | Reejecutar reporte y revisar modal |
| `SPT-002-T-21` | Sin `Hito` | Completar hito o valor transitorio aprobado | Cambia contexto visual | Reejecutar reporte y revisar modal |

#### Responsable vacio

| task_id | Problema | Accion sugerida | Riesgo | Validacion posterior |
|---|---|---|---|---|
| `SPT-002-T-21` | Sin `Responsable` | Completar responsable valido | Cambia ownership y filtros | Reejecutar reporte y revisar filtros |

### C. Bajos

#### Filas dummy / no productivas

| Caso | Problema | Accion sugerida | Riesgo | Validacion posterior |
|---|---|---|---|---|
| Fila con `ID: 4,` | Fila no `SPT-*` mezclada con datos | Clasificar como instruccion/error/dato a archivar; no borrar todavia | Puede ocultar informacion util | Reejecutar reporte |
| Filas 61 a 77 | Filas vacias publicadas | Mantener o limpiar solo con etapa aprobada; no borrar ahora | Puede cambiar estructura publicada | Confirmar CSV y headers |
| Fila de instrucciones | Texto operativo dentro del CSV | Decidir si queda en hoja o se mueve a documentacion | Puede afectar conteos | Confirmar CSV |
| `TASK-DUMMY-QA-CREATE` | Dummy QA no `SPT-*` | Decidir si queda como evidencia QA, se cancela, se oculta o se archiva | Puede afectar pruebas futuras | Confirmar test matrix |
| `SPT-001-T-30` | Dummy QA con ID `SPT-*` | Revisar si debe permanecer como QA o pasar a archivo futuro | Puede afectar conteos productivos | Confirmar reporte y Gantt |

#### `Ver en Gantt = No`

| task_id | Problema | Accion sugerida | Riesgo | Validacion posterior |
|---|---|---|---|---|
| `SPT-001-T-04` | `Ver en Gantt = No` | Confirmar si la ocultacion es intencional | Puede parecer perdida de tarea visible | Revisar Gantt y conteos renderizables |

#### Columnas derivables

| Columna | Problema | Accion sugerida | Riesgo | Validacion posterior |
|---|---|---|---|---|
| `Atraso (dias)` | Dato derivable presente en hoja | No tocar en esta etapa; tratar como pendiente 32K | Bajo ahora; medio si se usa como autoridad | Confirmar que frontend recalcula |

## 5. Checklist operativo por tanda

### Tanda 1 - Correcciones mecanicas criticas

- [ ] Convertir `SPT-002-T-20` `Inicio real` de `10-05-2026` a `2026-05-10`.
- [ ] Convertir `SPT-002-T-20` `Fin real` de `12-05-2026` a `2026-05-12`.
- [ ] Resolver dependencia rota de `SPT-002-T-23`.
- [ ] Regenerar reporte 32F.
- [ ] Validar frontend.

### Tanda 2 - Estados vacios

- [ ] Completar estados de `SPT-001-T-07` a `SPT-001-T-29`.
- [ ] Completar estados de `SPT-002-T-05`, `SPT-002-T-11`, `SPT-002-T-13`, `SPT-002-T-16`, `SPT-002-T-18`, `SPT-002-T-21`, `SPT-002-T-25`, `SPT-002-T-26`, `SPT-002-T-27`, `SPT-002-T-28`, `SPT-002-T-29`.
- [ ] Regenerar reporte 32F.
- [ ] Validar KPIs y filtros.

### Tanda 3 - Fase, hito y responsable

- [ ] Completar fase e hito de `SPT-002-T-04`.
- [ ] Completar fase e hito de `SPT-002-T-17`.
- [ ] Completar fase, hito y responsable de `SPT-002-T-21`.
- [ ] Regenerar reporte 32F.
- [ ] Validar filtros, modal y agrupaciones.

### Tanda 4 - Tareas no renderizables

- [ ] Decidir tratamiento de las 12 tareas sin fechas plan.
- [ ] Completar fechas plan solo cuando haya decision operativa.
- [ ] Para tareas que no deban renderizar, documentar criterio antes de tocar `Ver en Gantt`.
- [ ] Regenerar reporte 32F.
- [ ] Validar que no desaparezcan tareas inesperadamente.

### Tanda 5 - Dummies e instrucciones

- [ ] Clasificar fila `ID: 4,`.
- [ ] Clasificar filas vacias 61 a 77.
- [ ] Clasificar fila de instrucciones.
- [ ] Clasificar `TASK-DUMMY-QA-CREATE`.
- [ ] Revisar `SPT-001-T-30` como dummy QA.
- [ ] Confirmar si `SPT-001-T-04` debe seguir con `Ver en Gantt = No`.
- [ ] Regenerar reporte 32F.
- [ ] Validar CSV, Gantt y matriz QA.

## 6. Validacion despues de cada tanda

- [ ] CSV publicado carga.
- [ ] Gantt Operativo renderiza.
- [ ] KPIs visibles.
- [ ] Filtros funcionan.
- [ ] Vista Mes funciona.
- [ ] Vista Semana funciona.
- [ ] Boton `Hoy` funciona.
- [ ] `gantt_task_create` sigue OK en smoke autorizado/mockeado.
- [ ] `gantt_task_update` sigue OK en smoke autorizado/mockeado.
- [ ] `gantt_task_disable` sigue OK en smoke autorizado/mockeado.
- [ ] No desaparecen tareas inesperadamente.
- [ ] `node tools/audit-timeline-data.js` reduce o mantiene controladas las inconsistencias.

## 7. Decisiones pendientes

- `visible_gantt` sigue pendiente de decision formal.
- `Atraso (dias)` queda pendiente de retiro como dato maestro.
- Normalizacion de responsables queda pendiente.
- Catalogo de hitos por fase queda pendiente.
- Tratamiento definitivo de dummies QA queda pendiente.
- Tratamiento de filas vacias o instrucciones dentro del CSV queda pendiente.

## 8. Recomendacion final

No hacer saneamiento masivo. Ejecutar cambios pequenos, con backup previo, una tanda por vez. Despues de cada tanda, regenerar el reporte 32F y validar frontend continuamente.

El primer movimiento recomendado es Tanda 1 porque corrige errores mecanicos claros: fechas reales no canonicas y dependencia rota. Los estados y fechas plan requieren decision operativa, asi que deben tratarse con mas cuidado.
