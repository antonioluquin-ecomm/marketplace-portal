# Definiciones operativas → generación automática de tareas de Gantt

> **Estado:** v1.1, solo modelo VTEX ↔ VTEX. Implementado 2026-08-08, ampliado
> el mismo día con 3 campos más y con el recorte de Relevamiento (ver abajo).
> Este documento es la fuente de verdad del universo de campos. Si se agrega,
> cambia o saca un campo, actualizar en simultáneo los 3 lugares que lo
> replican: `apps-script/PlantillasGanttDefiniciones.gs` (plantilla real),
> `public/integracion/definiciones-operativas.html` (UI seller) e
> `internal/backlog/gestion-sellers.html` (UI interna).

## Qué problema resuelve

El Gantt operativo se cargaba 100% a mano — sin ningún template de onboarding
(hueco ya señalado en `docs/handoff-post-v1.md` y
`docs/data-dictionary-timeline.md`). Al mismo tiempo, hay preguntas puntuales
que el seller responde a su propio ritmo ("cuando tenga el dato") y que
determinan qué tareas de Gantt corresponden — sin conexión entre una cosa y
la otra hasta este cambio.

## Distinto de `definicion_tecnica`

`apps-script/DefinicionTecnica.gs` / hoja `definicion_tecnica` es un dossier
**auto-generado** desde Relevamiento, sin UI propia, que resume scoping y
riesgo del seller. `definiciones_operativas` es otra cosa: preguntas
puntuales, respondibles de a una, con conexión directa a Gantt. No compartir
sheet ni semántica entre ambos.

## Universo de campos v1 (VTEX ↔ VTEX)

| Campo | Pregunta | Opciones | Tarea que genera |
|---|---|---|---|
| `tiene_cuenta_qa` | ¿Tenés una cuenta VTEX de QA propia? | Sí / No | Sí → conectar sobre tu QA. No → conectar directo en producción (Fase 1.0, `docs/integracion-vtex-vtex.md`) |
| `carga_invoice_url` | ¿Cargás la factura en el pedido de tu VTEX (`invoiceUrl`)? | Sí / No | Sí → validar carga en QA. No → definir camino alternativo (Fase 7a.3, `docs/operacion-vtex-vtex.md`) |
| `logistica_directa` | ¿Quién hace el despacho: vos o el Marketplace? | Seller / Marketplace | Cargar datos logísticos en tu VTEX, o configurar retiro con nuestros carriers |
| `logistica_inversa` | ¿Quién gestiona la devolución: vos o el Marketplace? | Seller / Marketplace | Compartir Carrier y credenciales, o solicitar contrato de retiro |
| `fuente_precio` | ¿Lista de precios actual o nueva para el Marketplace? | Actual / Nueva | Configurar fuente de precio en VCC (tarea única, la respuesta no cambia cuál tarea se crea) |
| `stock_diferenciado` | ¿Almacén nuevo (stock diferenciado) o el que ya usás? | Nuevo / Existente | Nuevo → crear almacén dedicado. Existente → sin tarea (informativo) |
| `condiciones_devolucion` | ¿Ya nos mandaste tus condiciones de devolución? | Confirmación (no es Sí/No) | Redactar T&C con las condiciones del seller (Fase 8.1) |
| `destinos_excluidos` | ¿Ya nos mandaste tus destinos excluidos? | Confirmación (no es Sí/No) | Sumar destinos excluidos a los T&C (Fase 4.6) |

Los dos últimos son distintos de los demás: no son una bifurcación de dos
caminos, son una **confirmación de que el dato llegó** (por eso no tienen
`ramas` en la plantilla, tienen `tareaUnica`, igual que `fuente_precio`). Un
valor "No" ahí significaría lo mismo que "sin responder" — por eso la UI solo
ofrece una opción para marcar ("Sí, ya las mandé"), no un selector Sí/No.

## Cómo se dispara la generación de tareas

1. Un agente confirma el modelo de integración del seller (VTEX ↔ VTEX) en
   `internal/backlog/gestion-sellers.html` y dispara **"Generar plantilla de
   tareas de Gantt"** (`generarTareasBaseGantt`, una vez por seller,
   idempotente). Por cada campo de la tabla de arriba:
   - Si ya hay respuesta → crea la tarea en estado **Pendiente**.
   - Si no hay respuesta → crea la tarea en estado **Bloqueado**, con un
     comentario que explica qué falta definir. Reutiliza el estado
     "Bloqueado" que ya existía en `gantt-operativo.html` (badge, KPI, fila
     roja) — no hizo falta ningún cambio de UI del Gantt para esto.
   - `task_id` determinístico: `{SELLER_ID}-T-DEF-{CAMPO}`.
2. Cuando el seller (o un agente) responde un campo —
   `public/integracion/definiciones-operativas.html` o la sección
   "Definiciones operativas" de `gestion-sellers.html`, acción
   `saveDefinicionOperativa` — en el **mismo request** se evalúa si esa
   respuesta desbloquea la tarea correspondiente
   (`evaluarYDesbloquearTareasGantt`). Si la tarea sigue en "Bloqueado", pasa
   a "Pendiente" con el `área_responsable`/`entorno` que corresponde a la
   respuesta. **Nunca** toca una tarea que ya está en otro estado (un agente
   la movió a mano) — solo deja constancia en `AUDIT_LOG` para revisión
   manual.

## Recorte de Relevamiento para VTEX ↔ VTEX

`public/formularios/formulario-relevamiento.html` ya tenía un mecanismo de
recorte dinámico por modelo (`HIDDEN_SECTIONS_BY_MODELO`/`HIDDEN_FIELDS_BY_MODELO`,
no destructivo — oculta con CSS, no borra columnas del Sheet). Se amplió para
VTEX ↔ VTEX: de ocultar solo 2 secciones (Catálogo, Stock y precios) pasó a
ocultar 5 (Tecnología, Stock y precios, Logística, Devoluciones, Facturación),
dejando visibles solo **Datos generales, Contactos, Catálogo y Observaciones**.

- **Se corrigió un error de la config anterior**: ocultaba la sección
  Catálogo, que sí hace falta (marcas, árbol de categorías, talles,
  especificaciones — Fase 2 de `docs/integracion-vtex-vtex.md`, nadie más la
  cubre). Ahora queda visible.
- Las 5 secciones que se ocultan quedan cubiertas por Definiciones Operativas
  (facturación, logística directa/inversa, condiciones de devolución,
  destinos excluidos) o son redundantes porque Sporting ya sabe que el seller
  usa VTEX antes de contactarlo.
- **Efecto colateral corregido en el backend**: el cálculo de `completitud`
  (`escribirEnRelevamientos` y `calcularCompletitudPerfil`, ambos en
  `Relevamientos.gs`) contaba contra el total de 90 campos del formulario
  completo — sin corregirlo, ningún seller VTEX ↔ VTEX podía pasar de ~29%
  aunque completara todo lo que ve. Ahora resuelve el modelo del seller desde
  `sellers` (no desde `metodo_integracion`, que vive justo en la sección
  oculta) y excluye `CAMPOS_RELEVAMIENTO_OCULTOS_VTEX_VTEX` (Schema.gs) del
  cálculo.
- **Consecuencia aceptada, no resuelta acá**: `upsertDefinicionTecnica`
  (`DefinicionTecnica.gs`) sigue derivando sus sugerencias
  (`alcance_stock`, `alcance_logistica`, `alcance_facturacion`, etc.) de los
  campos de Relevamiento — para sellers VTEX ↔ VTEX esos campos ahora llegan
  vacíos, así que ese dossier queda con sugerencias más genéricas/vacías para
  este modelo. No se tocó `DefinicionTecnica.gs` en este cambio.

## Pendiente / fuera de alcance de esta v1

- Plantilla para **Gestión Asistida** (mismo mecanismo, otra tabla en
  `PLANTILLAS_TAREAS_POR_MODELO`).
- Notificación activa cuando cambia el estado de una definición — hoy no hay
  mails automáticos en el sitio, alguien tiene que mirar la página o el
  Gantt.
- El campo `tarea` de una fila de Gantt no es editable vía API una vez creada
  (limitación preexistente de `Gantt.gs`, no introducida por este cambio) —
  por eso el texto de la tarea mientras está "Bloqueado" queda genérico
  ("Definir: {pregunta}") y el detalle de qué tarea real corresponde se
  comunica por el campo `comentario` al desbloquear, no reescribiendo
  `tarea`.
