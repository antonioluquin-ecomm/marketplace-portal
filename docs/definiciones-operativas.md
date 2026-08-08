# Definiciones operativas → generación automática de tareas de Gantt

> **Estado:** v1, solo modelo VTEX ↔ VTEX. Implementado 2026-08-08.
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
| `carga_invoice_url` | ¿Cargás la factura en el pedido de tu VTEX (`invoiceUrl`)? | Sí / No | Sí → validar carga en QA. No → definir camino alternativo (Fase 7a.3, `docs/operacion-vtex-vtex.md`) |
| `logistica_directa` | ¿Quién hace el despacho: vos o el Marketplace? | Seller / Marketplace | Cargar datos logísticos en tu VTEX, o configurar retiro con nuestros carriers |
| `logistica_inversa` | ¿Quién gestiona la devolución: vos o el Marketplace? | Seller / Marketplace | Compartir Carrier y credenciales, o solicitar contrato de retiro |
| `fuente_precio` | ¿Lista de precios actual o nueva para el Marketplace? | Actual / Nueva | Configurar fuente de precio en VCC (tarea única, la respuesta no cambia cuál tarea se crea) |
| `stock_diferenciado` | ¿Almacén nuevo (stock diferenciado) o el que ya usás? | Nuevo / Existente | Nuevo → crear almacén dedicado. Existente → sin tarea (informativo) |

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
