# Plan de saneamiento de datos - timeline

## 1. Objetivo del plan

Definir un camino seguro para sanear datos reales de la hoja `timeline` sin cambios destructivos inmediatos. El objetivo es alinear progresivamente la hoja con el diccionario de datos, sostener compatibilidad con frontend, CSV publicado y Apps Script, y reducir inconsistencias antes de agregar validaciones mas estrictas.

Este plan no autoriza todavia cambios en Google Sheets. Primero debe existir un reporte automatico o checklist concreto de inconsistencias, luego una ventana de saneamiento manual controlado con backup/export previo.

## Actualizacion 33B - contrato nuevo

El saneamiento manual debe alinearse con el nuevo contrato canonico de `timeline` antes de tocar datos reales:

- Reemplazar criterio canonico `inicio_plan` / `fin_plan` por `inicio` / `fin`.
- Tratar `Inicio plan`, `Fin plan`, `inicio_plan`, `fin_plan`, `fecha_inicio_plan` y `fecha_fin_plan` como aliases legacy durante transicion.
- Tratar `Inicio real`, `Fin real`, `inicio_real` y `fin_real` como legacy/deprecados de solo lectura si aparecen; no usarlos como objetivo de saneamiento operativo futuro.
- Incorporar `entorno` como campo obligatorio con valores `QA` o `Productivo`.
- Renombrar mentalmente `dependencia` a `depende_de`, manteniendo alias `Depende de` y `dependencia`.
- Renombrar mentalmente `visible_gantt` a `ver_en_gantt`, manteniendo alias `Ver en Gantt`, `visible_gantt`, `visible` y `Visible Gantt`.
- No ejecutar limpieza fisica ni renombre de headers hasta que frontend, Apps Script y auditor automatico soporten nuevo modelo + legacy.

Implicancia: las etapas de saneamiento 32F-32G quedan como base historica, pero la ejecucion real debe esperar el ajuste documental/tecnico del bloque 33.

## 2. Estado actual detectado

Hallazgos consolidados de 32C y lectura del CSV publicado:

- 16 columnas reales publicadas.
- Headers visuales en fila 3.
- 77 filas CSV de datos.
- 57 tareas con ID `SPT-*`.
- 44 tareas renderizables por frontend.
- 12 tareas `SPT-*` sin plan.
- 1 tarea con `Ver en Gantt = No`.
- 20 filas ignoradas por no tener ID `SPT-*`.
- 34 tareas `SPT-*` con estado vacio.
- 3 tareas con fase vacia.
- 3 tareas con hito vacio.
- 1 tarea sin responsable.
- 2 fechas reales con formato `DD-MM-YYYY`.
- 1 dependencia rota: `SPT-002-T-23 -> SPT-002-T-22`.

La hoja ya funciona como base liviana del Gantt Operativo, pero todavia mezcla datos productivos, filas no renderizables, posibles instrucciones/dummies y valores incompletos.

## 3. Clasificacion de problemas

### Criticos

- Tareas `SPT-*` sin `Estado`: distorsionan KPIs, filtros y baja logica.
- Tareas renderizables o potencialmente renderizables sin `Inicio plan` / `Fin plan`.
- Dependencia rota `SPT-002-T-23 -> SPT-002-T-22`.
- Fechas reales con formato no canonico `DD-MM-YYYY`.

### Medios

- Fase, hito o responsable vacios en tareas `SPT-*`.
- Filas con ID no `SPT-*` mezcladas con datos operativos.
- Dummies o instrucciones historicas no clasificadas.
- Uso de `Ver en Gantt` sin decision funcional completa sobre `visible_gantt`.

### Bajos

- Columnas derivadas como `Atraso (dias)` expuestas como dato persistido.
- Posible persistencia de `Semana` si reaparece en la hoja.
- Variantes textuales de responsables, fases o hitos que todavia no rompen render pero complican reporting.

### Decisiones pendientes

- Si `visible_gantt` seguira como campo funcional o se retirara.
- Si las filas no `SPT-*` deben archivarse, mantenerse como instrucciones o moverse a otra hoja.
- Catalogo oficial de fases, estados, responsables e hitos.
- Tratamiento formal de dummies QA existentes.

## 4. Plan de saneamiento por etapas

### 32F - Saneamiento manual controlado de campos minimos

- Completar estados vacios con un valor valido del catalogo preliminar.
- Completar fechas plan faltantes cuando la tarea deba verse en Gantt.
- Marcar como fuera de Gantt las tareas que no deban renderizar, sin borrar filas.
- Corregir fechas reales `DD-MM-YYYY` a formato canonico `YYYY-MM-DD`.
- Corregir o vaciar la dependencia rota `SPT-002-T-23 -> SPT-002-T-22` segun decision funcional.
- Separar instrucciones/dummies de datos productivos mediante comentario, estado, visibilidad o archivo futuro documentado.

### 32G - Validacion post-saneamiento

- Validar CSV publicado despues de la edicion manual.
- Confirmar conteos: filas, tareas `SPT-*`, renderizables, ocultas y no `SPT-*`.
- Confirmar 0 tareas `SPT-*` sin estado.
- Confirmar 0 tareas renderizables sin fechas plan.
- Renderizar Gantt Operativo.
- Validar filtros, vista Mes, vista Semana y boton `Hoy`.
- Confirmar que no hubo perdida inesperada de tareas visibles.

### 32H - Catalogos basicos

- Definir catalogo de fases.
- Definir catalogo de estados.
- Definir catalogo de responsables.
- Definir catalogo inicial de hitos por fase.
- Documentar sinonimos o valores historicos permitidos durante transicion.

### 32I - Validaciones frontend/backend

- Frontend usa dropdowns para campos catalogados.
- Apps Script valida enums criticos.
- No permitir texto libre donde el catalogo ya este aprobado.
- Mantener aliases para headers visuales durante la transicion.
- Rechazar payloads invalidos sin crear columnas nuevas ni modificar filas parcialmente.

### 32J - Limpieza de columnas derivadas

- Dejar de usar `Atraso (dias)` como dato maestro.
- Confirmar que `Semana` no se persiste como dato operativo.
- Decidir formalmente si `visible_gantt` sigue, se retira o queda solo como compatibilidad.
- Planificar cualquier renombre o eliminacion de columnas solo con etapa propia, aliases y smoke.

## 5. Matriz de correcciones propuestas

| Problema | Filas/casos afectados | Accion recomendada | Responsable sugerido | Riesgo | Requiere cambio manual en Sheet | Requiere cambio tecnico | Etapa sugerida |
|---|---:|---|---|---|---|---|---|
| Estado vacio | 34 tareas `SPT-*` | Completar con estado valido o marcar como `Cancelado` si corresponde | Operaciones / PM | Alto: cambia KPIs | Si | No | 32F |
| Fechas plan faltantes | 12 tareas `SPT-*` | Completar plan o marcar fuera de Gantt | Operaciones / PM | Alto: cambia timeline visible | Si | No | 32F |
| Dependencia rota | 1 caso | Corregir destino existente o vaciar dependencia | PM / Implementacion | Medio: afecta lectura de secuencia | Si | No | 32F |
| Fechas reales `DD-MM-YYYY` | 2 casos | Convertir a `YYYY-MM-DD` | Operaciones | Medio: puede cambiar seguimiento real | Si | No | 32F |
| Fase vacia | 3 tareas | Completar fase desde catalogo preliminar | Operaciones | Medio: afecta filtros/color | Si | No | 32F |
| Hito vacio | 3 tareas | Completar hito o usar valor transitorio aprobado | Operaciones | Medio: afecta contexto visual | Si | No | 32F |
| Responsable vacio | 1 tarea | Completar responsable valido | Operaciones | Medio: afecta ownership | Si | No | 32F |
| Filas no `SPT-*` | 20 filas | Clasificar como instrucciones, dummies o datos a archivar; no borrar todavia | PM / Data owner | Medio: puede ocultar informacion util | Si, si se clasifica | No | 32F |
| `Ver en Gantt = No` | 1 tarea | Confirmar si la ocultacion es intencional | PM | Bajo/medio: afecta visibilidad | Si, si se corrige | No | 32F |
| Catalogos no formalizados | Varios valores | Definir catalogos base | PM / Operaciones | Medio: bloquea validaciones | No | Si, futuro | 32H |
| `Atraso (dias)` persistido | Columna completa | Tratar como derivado y no como autoridad | Frontend / Data owner | Bajo: reporting ambiguo | No inmediato | Si, futuro | 32J |
| Decision `visible_gantt` | Columna completa | Decidir mantener, retirar o dejar compatibilidad | PM / Tech lead | Medio: impacta baja/visibilidad | No inmediato | Posible | 32J |

## 6. Reglas para saneamiento manual

- Trabajar siempre con backup/export previo del CSV o copia de la hoja.
- No borrar filas.
- No eliminar columnas.
- No renombrar headers.
- No modificar `task_id`.
- No cambiar `seller_id` sin validar contra la hoja `sellers`.
- No limpiar dummies sin decidir antes si se archivan, cancelan u ocultan.
- No cambiar `Ver en Gantt` masivamente sin decision funcional.
- Documentar cada cambio relevante con fecha, responsable y motivo.
- Hacer cambios por tandas pequenas y validar CSV entre tandas.
- Evitar formulas nuevas o columnas auxiliares permanentes sin etapa aprobada.

## 7. Criterios de aprobacion

- 0 tareas `SPT-*` sin estado.
- 0 tareas renderizables sin fechas plan.
- 0 dependencias rotas.
- 0 fechas invalidas o con formato no canonico.
- 0 valores fuera de catalogo critico una vez aprobado el catalogo.
- Gantt Operativo renderiza sin perdida inesperada de tareas.
- Filtros principales siguen funcionando.
- Vista Mes, vista Semana y boton `Hoy` siguen operativos.
- CSV publicado conserva headers visuales esperados.
- Apps Script sigue resolviendo aliases actuales.

## 8. Riesgos

- Cambios manuales pueden romper el CSV publicado.
- Headers visuales no deben tocarse sin aliases equivalentes.
- Normalizar estados puede cambiar KPIs.
- Completar fechas puede cambiar el visual del timeline.
- Mover o reclasificar dummies puede afectar pruebas futuras.
- Ocultar tareas con `Ver en Gantt = No` puede parecer perdida de datos si no se documenta.
- Corregir dependencias sin criterio funcional puede romper la narrativa operativa.
- Validaciones tecnicas prematuras pueden bloquear datos historicos todavia no saneados.

## 9. Recomendacion final

El proximo paso recomendado no es editar Google Sheets directamente. Primero conviene generar un reporte automatico de inconsistencias o checklist concreto con IDs, filas, campos afectados y accion sugerida. Con ese reporte aprobado, ejecutar 32F como saneamiento manual controlado por tandas pequenas.

Despues del saneamiento manual, ejecutar 32G para validar CSV, render, conteos y filtros antes de avanzar a catalogos y validaciones tecnicas.
