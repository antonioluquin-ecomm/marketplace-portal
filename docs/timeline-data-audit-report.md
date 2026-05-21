# Reporte automatico de inconsistencias - timeline

Generado: 2026-05-21T16:50:02.856Z

Fuente CSV: https://docs.google.com/spreadsheets/d/e/2PACX-1vTwd-qIMhoH1poJpaTZqN-7O5IGAfPDTxslBAX8LCPogTkwheW2vWsq59JkvvYakM8ndCKgUQualQyi/pub?gid=1623881837&single=true&output=csv

## Resumen ejecutivo v33

Auditoria read-only del CSV publicado de `timeline`, actualizada para el modelo v33 y aliases legacy. El reporte no modifica Google Sheets, no ejecuta POST y no usa credenciales.

- Inconsistencias criticas: 4.
- Inconsistencias medias: 3.
- Hallazgos bajos: 0.
- Decisiones pendientes detectadas: 0.
- Tareas sin `entorno`: 0.
- Tareas sin `inicio` o `fin`: 4.
- Tareas con fechas legacy `inicio_plan` / `fin_plan`: 0.
- Tareas con valores legacy `inicio_real` / `fin_real`: 0.
- Proximo paso recomendado: resolver compatibilidad de frontend y Apps Script antes de editar datos reales.

## Conteos principales

| Metrica | Valor |
|---|---:|
| Columnas publicadas | 14 |
| Fila de headers | 1 |
| Filas CSV de datos | 32 |
| Tareas con ID SPT-* | 29 |
| Tareas renderizables por modelo v33 | 25 |
| Tareas modelo nuevo Inicio/Fin | 29 |
| Tareas modelo legacy Inicio plan/Fin plan | 0 |
| Tareas con mezcla nuevo/legacy | 0 |
| Filas no productivas / no SPT-* | 3 |
| Tareas con ver_en_gantt = No | 0 |

## Columnas detectadas

| Tipo | Columnas |
|---|---|
| Canonicas v33 presentes | Depende de, Entorno, Inicio, Fin, Ver en Gantt |
| Legacy de fechas plan presentes | Ninguna |
| Legacy reales presentes | Ninguna |
| Derivables presentes | Ninguna |

## Catalogos sugeridos

- Fase: Comercial, Tecnica, Operativa, Cierre.
- Estado: Pendiente, En curso, Bloqueado, Completado, Cancelado.
- Entorno: QA, Productivo.

## Tabla de inconsistencias por severidad

| Severidad | Cantidad |
|---|---:|
| Critica | 4 |
| Media | 3 |
| Baja | 0 |
| Decision | 0 |

### Inconsistencias criticas

| Severidad | Problema | Fila CSV | task_id | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|---|
| critica | tarea SPT-* sin inicio o fin | 2 | SPT-002-T-01 | Inicio / Fin | (vacio) / (vacio) | Completar inicio/fin o revisar aliases legacy. |
| critica | tarea SPT-* sin inicio o fin | 10 | SPT-002-T-08 | Inicio / Fin | (vacio) / (vacio) | Completar inicio/fin o revisar aliases legacy. |
| critica | tarea SPT-* sin inicio o fin | 27 | SPT-002-T-25 | Inicio / Fin | (vacio) / (vacio) | Completar inicio/fin o revisar aliases legacy. |
| critica | tarea SPT-* sin inicio o fin | 31 | SPT-002-T-29 | Inicio / Fin | (vacio) / (vacio) | Completar inicio/fin o revisar aliases legacy. |

### Inconsistencias medias

| Severidad | Problema | Fila CSV | task_id | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|---|
| media | fila no productiva / no SPT-* | 5 | ID: 4, | ID Tarea | ID: 4, | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 32 | SPT002-T-30 | ID Tarea | SPT002-T-30 | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |
| media | fila no productiva / no SPT-* | 33 | SPT002-T-31 | ID Tarea | SPT002-T-31 | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |

### Hallazgos bajos

Sin hallazgos.

### Decisiones pendientes

Sin hallazgos.

## Detalle por tarea

### SPT-002-T-01

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin inicio o fin | 2 | Inicio / Fin | (vacio) / (vacio) | Completar inicio/fin o revisar aliases legacy. |

### SPT-002-T-08

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin inicio o fin | 10 | Inicio / Fin | (vacio) / (vacio) | Completar inicio/fin o revisar aliases legacy. |

### SPT-002-T-25

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin inicio o fin | 27 | Inicio / Fin | (vacio) / (vacio) | Completar inicio/fin o revisar aliases legacy. |

### SPT-002-T-29

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| critica | tarea SPT-* sin inicio o fin | 31 | Inicio / Fin | (vacio) / (vacio) | Completar inicio/fin o revisar aliases legacy. |

### ID: 4,

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| media | fila no productiva / no SPT-* | 5 | ID Tarea | ID: 4, | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |

### SPT002-T-30

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| media | fila no productiva / no SPT-* | 32 | ID Tarea | SPT002-T-30 | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |

### SPT002-T-31

| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |
|---|---:|---:|---|---|---|
| media | fila no productiva / no SPT-* | 33 | ID Tarea | SPT002-T-31 | Clasificar como instruccion, dummy o dato a archivar; no borrar todavia. |

## Checklist de saneamiento manual v33

- [ ] Confirmar que frontend y Apps Script ya leen/escriben modelo v33 + legacy antes de tocar Google Sheets.
- [ ] Completar `entorno` en tareas `SPT-*` con `QA` o `Productivo`.
- [ ] Completar `inicio` y `fin` o resolver aliases legacy para tareas que deban renderizar.
- [ ] Convertir dependencias legacy a `depende_de` sin romper referencias.
- [ ] Revisar campos legacy `inicio_real` / `fin_real`; no migrarlos como contrato operativo.
- [ ] Completar estados vacios en tareas `SPT-*`.
- [ ] Completar fase, hito y responsable faltantes.
- [ ] Clasificar filas no `SPT-*` como instrucciones, dummies o datos a archivar.
- [ ] Confirmar si cada `ver_en_gantt = No` es intencional.
- [ ] Reejecutar `node tools/audit-timeline-data.js` despues de cada tanda.

## Recomendaciones de siguiente paso

1. Usar este reporte como base para 33D/33E, no para editar Google Sheets todavia.
2. Actualizar frontend de solo lectura para consumir `inicio`, `fin`, `entorno`, `depende_de` y `ver_en_gantt` con fallback legacy.
3. Actualizar Apps Script para escribir modelo v33 y tolerar aliases legacy.
4. Reejecutar este auditor despues de cada cambio tecnico y antes de cualquier saneamiento manual.
