# Reporte automatico de inconsistencias - timeline

Generado: 2026-05-21T00:14:10.091Z

Fuente CSV: https://docs.google.com/spreadsheets/d/e/2PACX-1vTwd-qIMhoH1poJpaTZqN-7O5IGAfPDTxslBAX8LCPogTkwheW2vWsq59JkvvYakM8ndCKgUQualQyi/pub?gid=1623881837&single=true&output=csv

## Resumen ejecutivo

Auditoria read-only del CSV publicado de `timeline`. El reporte no modifica Google Sheets, no ejecuta POST y no usa credenciales.

- Inconsistencias criticas: 49.
- Inconsistencias medias: 27.
- Hallazgos bajos: 1.
- Decisiones pendientes detectadas: 1.
- Proximo paso recomendado: revisar este checklist, aprobar criterios de correccion y ejecutar saneamiento manual controlado con backup/export previo.

## Conteos principales

| Metrica | Valor |
|---|---:|
| Columnas publicadas | 16 |
| Fila de headers | 3 |
| Filas CSV de datos | 77 |
| Tareas con ID SPT-* | 57 |
| Tareas renderizables por frontend | 44 |
| Filas no productivas / no SPT-* | 20 |
| Tareas con Ver en Gantt = No | 1 |
| Columnas derivables presentes | Atraso (dias) |

## Catalogos sugeridos

- Fase: Comercial, Técnica, Operativa, Cierre.
- Estado: Pendiente, En curso, Bloqueado, Completado, Cancelado.

## Tabla de inconsistencias por severidad

| Severidad | Cantidad |
|---|---:|
| Critica | 49 |
| Media | 27 |
| Baja | 1 |
| Decision | 1 |

### Inconsistencias criticas

| Severidad | Problema | Fila CSV | task_id | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|---|
| critica | tarea SPT-* sin estado | 10 | SPT-001-T-07 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 11 | SPT-001-T-08 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 12 | SPT-001-T-09 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 13 | SPT-001-T-10 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 14 | SPT-001-T-11 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 15 | SPT-001-T-12 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 16 | SPT-001-T-13 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 17 | SPT-001-T-14 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 18 | SPT-001-T-15 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 19 | SPT-001-T-16 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 20 | SPT-001-T-17 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 21 | SPT-001-T-18 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 22 | SPT-001-T-19 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 23 | SPT-001-T-20 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 24 | SPT-001-T-21 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 25 | SPT-001-T-22 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 26 | SPT-001-T-23 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 27 | SPT-001-T-24 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 28 | SPT-001-T-25 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 29 | SPT-001-T-26 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 30 | SPT-001-T-27 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 31 | SPT-001-T-28 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin estado | 32 | SPT-001-T-29 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 37 | SPT-002-T-04 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| critica | tarea SPT-* sin estado | 38 | SPT-002-T-05 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 42 | SPT-002-T-10 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| critica | tarea SPT-* sin estado | 43 | SPT-002-T-11 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 43 | SPT-002-T-11 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| critica | tarea SPT-* sin estado | 45 | SPT-002-T-13 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 45 | SPT-002-T-13 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| critica | tarea SPT-* sin estado | 48 | SPT-002-T-16 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 48 | SPT-002-T-16 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 49 | SPT-002-T-17 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| critica | tarea SPT-* sin estado | 50 | SPT-002-T-18 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | fecha real en formato no canonico | 52 | SPT-002-T-20 | Inicio real | 10-05-2026 | Convertir a YYYY-MM-DD. |
| critica | fecha real en formato no canonico | 52 | SPT-002-T-20 | Fin real | 12-05-2026 | Convertir a YYYY-MM-DD. |
| critica | tarea SPT-* sin estado | 53 | SPT-002-T-21 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 53 | SPT-002-T-21 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| critica | dependencia apunta a task_id inexistente | 54 | SPT-002-T-23 | Depende de | SPT-002-T-22 | Corregir destino existente o vaciar dependencia con motivo documentado. |
| critica | tarea SPT-* sin estado | 56 | SPT-002-T-25 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 56 | SPT-002-T-25 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| critica | tarea SPT-* sin estado | 57 | SPT-002-T-26 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 57 | SPT-002-T-26 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| critica | tarea SPT-* sin estado | 58 | SPT-002-T-27 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 58 | SPT-002-T-27 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| critica | tarea SPT-* sin estado | 59 | SPT-002-T-28 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 59 | SPT-002-T-28 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| critica | tarea SPT-* sin estado | 60 | SPT-002-T-29 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 60 | SPT-002-T-29 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |

### Inconsistencias medias

| Severidad | Problema | Fila CSV | task_id | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|---|
| media | fila no productiva / no SPT-* | 36 | ID: 4, | ID Tarea | ID: 4, | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | tarea SPT-* sin fase | 37 | SPT-002-T-04 | Fase |  | Completar con fase valida. |
| media | tarea SPT-* sin hito | 37 | SPT-002-T-04 | Hito |  | Completar hito o valor transitorio aprobado. |
| media | tarea SPT-* sin fase | 49 | SPT-002-T-17 | Fase |  | Completar con fase valida. |
| media | tarea SPT-* sin hito | 49 | SPT-002-T-17 | Hito |  | Completar hito o valor transitorio aprobado. |
| media | tarea SPT-* sin fase | 53 | SPT-002-T-21 | Fase |  | Completar con fase valida. |
| media | tarea SPT-* sin hito | 53 | SPT-002-T-21 | Hito |  | Completar hito o valor transitorio aprobado. |
| media | tarea SPT-* sin responsable | 53 | SPT-002-T-21 | Responsable |  | Completar responsable valido. |
| media | fila no productiva / no SPT-* | 61 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 62 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 63 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 64 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 65 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 66 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 67 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 68 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 69 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 70 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 71 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 72 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 73 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 74 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 75 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 76 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 77 |  | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 78 | ℹ  Instrucciones: Agregá una fila por tarea. Usá seller_id exacto de la hoja sellers. Las columnas "Inicio real" y "Fin real" se completan cuando la tarea arranca/termina. La columna "Atraso" es automática. Para agregar un seller nuevo, copiá el bloque de ejemplo y reemplazá el seller_id. | ID Tarea | ℹ  Instrucciones: Agregá una fila por tarea. Usá seller_id exacto de la hoja sellers. Las columnas "Inicio real" y "Fin real" se completan cuando la tarea arranca/termina. La columna "Atraso" es automática. Para agregar un seller nuevo, copiá el bloque de ejemplo y reemplazá el seller_id. | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 79 | TASK-DUMMY-QA-CREATE | ID Tarea | TASK-DUMMY-QA-CREATE | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |

### Hallazgos bajos

| Severidad | Problema | Fila CSV | task_id | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|---|
| baja | columna derivable presente | 3 |  | Atraso (dias) | presente | Tratar como dato derivado; no usar como autoridad. |

### Decisiones pendientes

| Severidad | Problema | Fila CSV | task_id | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|---|
| decision | tarea con Ver en Gantt = No | 7 | SPT-001-T-04 | Ver en Gantt | No | Confirmar si la ocultacion es intencional. |

## Detalle por tarea

### SPT-001-T-07

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 10 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-08

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 11 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-09

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 12 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-10

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 13 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-11

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 14 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-12

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 15 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-13

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 16 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-14

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 17 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-15

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 18 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-16

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 19 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-17

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 20 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-18

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 21 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-19

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 22 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-20

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 23 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-21

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 24 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-22

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 25 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-23

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 26 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-24

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 27 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-25

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 28 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-26

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 29 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-27

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 30 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-28

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 31 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-001-T-29

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 32 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-002-T-04

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin inicio_plan o fin_plan | 37 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| media | tarea SPT-* sin fase | 37 | Fase |  | Completar con fase valida. |
| media | tarea SPT-* sin hito | 37 | Hito |  | Completar hito o valor transitorio aprobado. |

### SPT-002-T-05

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 38 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-002-T-10

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin inicio_plan o fin_plan | 42 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |

### SPT-002-T-11

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 43 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 43 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |

### SPT-002-T-13

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 45 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 45 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |

### SPT-002-T-16

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 48 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 48 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |

### SPT-002-T-17

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin inicio_plan o fin_plan | 49 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| media | tarea SPT-* sin fase | 49 | Fase |  | Completar con fase valida. |
| media | tarea SPT-* sin hito | 49 | Hito |  | Completar hito o valor transitorio aprobado. |

### SPT-002-T-18

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 50 | Estado |  | Completar con estado valido del catalogo sugerido. |

### SPT-002-T-20

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | fecha real en formato no canonico | 52 | Inicio real | 10-05-2026 | Convertir a YYYY-MM-DD. |
| critica | fecha real en formato no canonico | 52 | Fin real | 12-05-2026 | Convertir a YYYY-MM-DD. |

### SPT-002-T-21

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 53 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 53 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |
| media | tarea SPT-* sin fase | 53 | Fase |  | Completar con fase valida. |
| media | tarea SPT-* sin hito | 53 | Hito |  | Completar hito o valor transitorio aprobado. |
| media | tarea SPT-* sin responsable | 53 | Responsable |  | Completar responsable valido. |

### SPT-002-T-23

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | dependencia apunta a task_id inexistente | 54 | Depende de | SPT-002-T-22 | Corregir destino existente o vaciar dependencia con motivo documentado. |

### SPT-002-T-25

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 56 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 56 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |

### SPT-002-T-26

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 57 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 57 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |

### SPT-002-T-27

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 58 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 58 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |

### SPT-002-T-28

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 59 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 59 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |

### SPT-002-T-29

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin estado | 60 | Estado |  | Completar con estado valido del catalogo sugerido. |
| critica | tarea SPT-* sin inicio_plan o fin_plan | 60 | Inicio plan / Fin plan | (vacio) / (vacio) | Completar plan o marcar fuera de Gantt. |

### ID: 4,

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| media | fila no productiva / no SPT-* | 36 | ID Tarea | ID: 4, | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |

### ℹ  Instrucciones: Agregá una fila por tarea. Usá seller_id exacto de la hoja sellers. Las columnas "Inicio real" y "Fin real" se completan cuando la tarea arranca/termina. La columna "Atraso" es automática. Para agregar un seller nuevo, copiá el bloque de ejemplo y reemplazá el seller_id.

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| media | fila no productiva / no SPT-* | 78 | ID Tarea | ℹ  Instrucciones: Agregá una fila por tarea. Usá seller_id exacto de la hoja sellers. Las columnas "Inicio real" y "Fin real" se completan cuando la tarea arranca/termina. La columna "Atraso" es automática. Para agregar un seller nuevo, copiá el bloque de ejemplo y reemplazá el seller_id. | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |

### TASK-DUMMY-QA-CREATE

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| media | fila no productiva / no SPT-* | 79 | ID Tarea | TASK-DUMMY-QA-CREATE | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |

### SPT-001-T-04

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| decision | tarea con Ver en Gantt = No | 7 | Ver en Gantt | No | Confirmar si la ocultacion es intencional. |

### Filas sin task_id productivo

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| media | fila no productiva / no SPT-* | 61 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 62 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 63 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 64 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 65 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 66 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 67 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 68 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 69 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 70 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 71 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 72 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 73 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 74 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 75 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 76 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 77 | ID Tarea |  | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| baja | columna derivable presente | 3 | Atraso (dias) | presente | Tratar como dato derivado; no usar como autoridad. |

## Checklist de saneamiento manual

- [ ] Exportar backup del CSV o duplicar la hoja antes de tocar datos.
- [ ] Completar estados vacios en tareas `SPT-*`.
- [ ] Completar `Inicio plan` y `Fin plan` o marcar fuera de Gantt las tareas que no deban renderizar.
- [ ] Corregir fechas no canonicas a `YYYY-MM-DD`.
- [ ] Corregir dependencias rotas o vaciarlas con motivo documentado.
- [ ] Completar fase, hito y responsable faltantes.
- [ ] Clasificar filas no `SPT-*` como instrucciones, dummies o datos a archivar.
- [ ] Confirmar si cada `Ver en Gantt = No` es intencional.
- [ ] Validar CSV publicado despues de cada tanda de cambios.
- [ ] Renderizar Gantt y revisar filtros, Mes, Semana y boton Hoy.

## Recomendaciones de siguiente paso

1. Revisar los casos criticos antes de cualquier saneamiento manual.
2. Aprobar responsables y valores destino para estado, fase, hito y responsable.
3. Ejecutar 32G como saneamiento manual controlado por tandas pequenas.
4. Reejecutar este script despues de cada tanda hasta llegar a 0 criticos.
5. Recien despues avanzar a catalogos y validaciones frontend/backend.
