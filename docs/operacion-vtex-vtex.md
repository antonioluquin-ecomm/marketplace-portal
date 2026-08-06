# Operación tipo VTEX ↔ VTEX

> **Estado:** borrador en construcción.
> **Este documento cubre la operación diaria** de un seller VTEX↔VTEX ya activo: qué pasa
> con cada pedido, quién hace qué y en qué plazo — cancelaciones, fulfillment, pedidos no
> entregados y devoluciones. Es un **runbook sin fin**: no tiene principio ni fin como un
> proyecto, se repite en cada pedido, todos los días.
> El **onboarding** (alta del seller, catálogo, precio/stock/pagos, front, setup previo al
> primer pedido — Fases 1-5) vive en
> [`docs/integracion-vtex-vtex.md`](./integracion-vtex-vtex.md), el documento complementario.
> Antes vivían juntos en un solo documento; se separaron el 2026-08-06 porque mezclaban dos
> cosas de naturaleza distinta bajo una sola numeración de "Fase". Ver "Estado del
> documento" al final.
> Este documento es la **fuente de verdad** del proceso. Las páginas del portal
> (interna en `internal/estrategia/` y seller en `public/`) se generan **desde acá** —
> no se editan a mano en paralelo. La numeración de fases (6, 7a, 7b, 8) se mantiene igual
> que en el documento original para no romper referencias existentes (Commerce Hub, entre
> otros, ya cita estas fases por número).

Es el runbook operativo del modelo **VTEX ↔ VTEX**
(`internal/estrategia/modelo-integracion.html`), complementario al playbook de onboarding.

---

## Cómo leer este documento

Cada fase mezcla hasta **tres tipos de contenido** que **no** hay que confundir:

- **Responsabilidades operativas (runtime)** — acciones **recurrentes por pedido** (el
  seller cancela por stock, factura; el Marketplace gestiona la ventana de 24h). Definen un
  **RACI / runbook** — a esto se recurre en el día a día, no es checklist de onboarding.
- **Reglas / Decisiones** — políticas fijas del negocio. **No se le asignan a nadie**;
  van a Términos y Condiciones o a la página informativa del seller.
- **Flujo automático** — lo que el sistema hace solo (VTEX↔PIM, mails, reembolsos). Sin
  dueño; se documenta para entender el flujo.

Fase 7a y Fase 8 además tienen **tareas de setup puntuales** (configurar un carrier nuevo,
el portal de devoluciones) — son la excepción: acciones que sí se hacen una sola vez,
descritas junto al runbook que habilitan porque son inseparables de él.

### Roles canónicos

Mismos roles que en el documento de Integración — no se repite la tabla acá. Los
protagonistas de este documento son **Seller**, **Marketplace (Ecomm/Operaciones)**,
**Agente PIM** y **CS**, con mucha menos intervención de Infracommerce y Diseño (propios
del front, ya configurado en el onboarding).

### Convenciones de estado

- ✅ **completo** — información suficiente para ejecutar.
- ⚠️ **falta** — hay un hueco que resolver antes de dar por cerrado el ítem.
- 🧪 **QA** — pendiente de probar en ambiente de pruebas.

---

## Fase 6 — Cancelaciones (iniciadas por el seller)

Cancelación de un pedido por parte del **seller**, siempre por **falta de stock**. Es un
flujo mayormente **automático** de VTEX (estados + reembolsos + mails); el único punto
humano real es la **decisión del Marketplace en la ventana de 24 h**.

> **Ojo — hay otra cancelación en otra fase:** la iniciada por el **cliente**
> (arrepentimiento de compra) **no** está acá; se maneja en "Pedidos no entregados"
> (Fase 7b), porque puede requerir rechazo de entrega o devolución. Esta Fase 6 es **solo**
> la cancelación iniciada por el **seller** por stock.

#### Flujo automático (estados VTEX)

1. El **seller cancela** el pedido desde su VTEX (por falta de stock).
2. El pedido pasa a estado **"Esperando Cambio de Seller"** en VTEX.
3. El **Marketplace** tiene **24 h** para actuar (ver responsabilidades abajo).
4. Al pasar a estado **"Cancelado"**: se envía **automáticamente** el correo de cancelación
   al cliente y se realiza el **reembolso automático**.

#### Responsabilidades operativas (runtime)

| Actor | Acción |
|---|---|
| **Seller** | Cancelar el pedido desde su VTEX cuando no tiene stock (sin notificación previa). |
| **Marketplace — Ecomm / Operaciones** | Dentro de las 24 h, **cancela directo** (no espera a la cancelación automática por inacción). |
| *Sistema (VTEX)* | Reembolso automático y correo de cancelación al cliente al pasar a "Cancelado". |

> **No hay reasignación de pedido a otro seller** en este flujo hoy — el Marketplace cancela
> directo dentro de las 24 h. Si en el futuro se habilita esa opción, actualizar acá y en
> Commerce Hub (`documentacion.json`, página "Procesos Sellers").

#### Reglas / Decisiones — Fase 6

- **Sin cancelaciones parciales:** si falta un producto, se cancela el **pedido completo**.
- **Sin notificación previa:** el seller cancela directamente desde su VTEX.
- **Motivo único:** las cancelaciones del seller son **siempre por stock**.
- **SLA seller:** plazo máximo para cancelar un pedido: **5 días**.
- **SLA Marketplace:** **24 h** para cancelar el pedido tras el aviso de "Esperando Cambio de
  Seller" (no hay reasignación a otro seller, ver corrección arriba).
- **Reembolso y aviso:** siempre **automáticos** al pasar a "Cancelado".

---

## Fase 7a — Fulfillment (camino feliz)

Desde que el seller recibe el pedido hasta que se entrega sin incidentes. Predominan
**responsabilidades operativas** del seller y **automatismos** VTEX↔PIM; las pocas tareas
de setup dependen de una **decisión bifurcante** que se toma durante el onboarding
(`docs/integracion-vtex-vtex.md`), pero cuyo detalle vive acá porque es inseparable del
runbook que habilita.

> **Decisión bifurcante — ¿quién hace la logística?** (se define en el acuerdo con el seller,
> input externo a este proceso):
> - **A · Logística directa (seller):** el seller gestiona el despacho y **carga la info
>   logística en su VTEX**. Aplica la tarea 7a.1.
> - **B · Logística por Marketplace:** se configura para que el despacho dispare la
>   **solicitud de retiro** a nuestros carriers. Aplica la tarea 7a.2. En este modo **no**
>   hace falta crear ni mapear logística.

#### Flujo automático (VTEX ↔ PIM)

- **Factura →** cuando el VTEX del Marketplace detecta el estado **facturado**, dispara el
  mail de "pedido facturado" con la URL de la factura. Automático.
- **Despacho →** la info logística cargada en el VTEX del seller llega al VTEX del
  Marketplace y dispara el mail de "pedido despachado" al cliente. **Se envía desde PIM, no
  desde VTEX.**
- **Entrega →** `Delivered: True` en el VTEX del seller → impacta en el VTEX del Marketplace
  → luego impacta en **PIM a estado facturado**.

#### Campos VTEX de referencia (`packageAttachment > packages > …`)

| Campo | Para qué |
|---|---|
| `invoiceUrl` | URL de la factura → dispara el mail de facturado. |
| `Courier` | Carrier / logística que envía. |
| `trackingNumber` | Número de seguimiento. |
| `trackingUrl` | URL de seguimiento. |
| `courierStatus` | Estado logístico del carrier → PIM lo consume. |

#### Responsabilidades operativas (runtime)

| Actor | Acción |
|---|---|
| **Seller** | Recibir el pedido en su VTEX, buscar y preparar el producto, **facturar** y entregar a la logística. |
| **Seller** (modo A) | Registrar la info logística en su VTEX (`Courier`, `trackingNumber`, `trackingUrl`) y el estado logístico (`courierStatus`). |
| **Marketplace** | Responsable de que **la factura llegue al cliente** (la emite el seller; el envío al cliente es del MP, vía mail automático). |

#### Tareas de setup — Fase 7a

| # | Ítem | Aplica a | Tarea Seller | Tarea Ecomm | Tarea PIM | Estado |
|---|---|---|---|---|---|---|
| 7a.1 | Estados logísticos — logística nueva | Modo A, si el carrier **no** está configurado | Informar qué logística usa y, si es nueva, pasar los estados que le llegan. | Mapear los estados del carrier a los **estados logísticos estándar** y pasarlos a PIM. | Crear la logística en PIM; consumir el estado desde `courierStatus` y el carrier desde `Courier`; dejar el mapeo cargado. | ✅ |
| 7a.2 | Config. de retiro por Marketplace | Modo B | — | Configurar que, al despachar, se envíe la **solicitud de retiro** a nuestros carriers. | — | ✅ |
| 7a.3 | Integración de factura (fallback) | Si el seller **no** carga la factura en su VTEX | — | Gestionar una **integración** para recibir la `invoiceUrl`. | — | ⚠️ falta |

#### Reglas / Decisiones — Fase 7a

- **Facturación previa al despacho:** el seller factura como parte de la preparación del
  pedido, **antes de entregarlo a la logística** — es el flujo estándar y el que aplica a
  todo seller nuevo. El **envío de la factura al cliente es responsabilidad del
  Marketplace** (automático por mail al detectar estado facturado).
- **Excepción — adidas:** hoy adidas usa un workaround propio (factura ficticia para avanzar
  el estado en el despacho + factura real recién al llegar a "Entregado"). Es un caso
  puntual de ese seller, **no el patrón a replicar**: todo seller nuevo debe poder facturar
  antes del despacho.
- **Factura por VTEX:** debe llegar por `invoiceUrl`. Si el seller no la carga en su VTEX,
  se requiere una **integración** para recibir la URL (tarea 7a.3).
- **Factura A:** **no** se aceptan facturas Tipo A para productos seller. Si el cliente la
  solicita, no se puede gestionar.
- **Mail de despacho:** se envía **desde PIM**, no desde VTEX.
- **Estados logísticos:** los estados del carrier **no llegan solos a VTEX** — el seller
  debe cargarlos en `courierStatus`. Sirven para monitorear tiempos de entrega. En modo B
  (logística del Marketplace) no hace falta crear ni mapear logística.

---

## Fase 7b — Pedidos no entregados

Casos en que la entrega **no se concreta** y hay que **reembolsar al cliente**. Es un flujo
**100 % operativo**, liderado por **CS del Marketplace (Luquin)**; **no hay tareas de
setup**. Tres tipos de incidente, cada uno con su flujo.

> Acá se resuelve la **cancelación por arrepentimiento del cliente** que quedó referida
> desde la Fase 6 (aquella era solo la cancelación iniciada por el seller por stock).

### 7b.1 · Arrepentimiento de compra (cancelación pedida por el cliente)

**Definición:** el cliente se arrepiente o compró mal y quiere cancelar.

**Entrada:** el cliente **contacta al Marketplace** (`sellers-soporte@sporting.com.ar`).
**CS Marketplace** verifica el estado logístico en **PIM** y contacta a **CS del Seller**
para intentar la cancelación.

**Árbol de decisión:**

- **A · Cancelación posible**
  - **A1 · Pedido no despachado** (VTEX: *Pago aprobado*) → el **Seller cancela desde su
    VTEX** → impacta en el VTEX del Marketplace → **reembolso automático** (flujo Fase 6).
  - **A2 · Pedido despachado, el seller lo retiene** → el seller retiene/cancela → reembolso.
- **B · Cancelación imposible** (el seller informa que no es factible) → **CS Marketplace**
  comunica al cliente y le ofrece **dos opciones**:
  - **B1 · Rechazar el paquete** en el momento de la entrega.
  - **B2 · Recibir y gestionar la devolución** por el **portal de cambios** (→ Fase 8).

**Regla:** no se aceptan cancelaciones parciales. **SLA:** el cliente tiene **30 días** para
solicitar la cancelación.

### 7b.2 · Falta de información / dirección incorrecta

**Definición:** el transportista no puede entregar por dirección incorrecta o falta de datos.

**Flujo:**
1. El **carrier** no puede entregar → el **Seller** solicita info adicional al Marketplace.
2. **CS Marketplace** contacta al **cliente** para recabar los datos.
3. El **Seller** responde al carrier con la info.
4. **SLA: 4-5 días** para que el seller responda; si no, el producto **vuelve al CD**.
5. Si vuelve al CD sin respuesta: el **Seller** envía un **informe** de paquetes extraviados /
   direcciones incorrectas → **CS Luquin** lo recibe y **procede al reembolso**.

### 7b.3 · Paquete perdido (Lost in Transit)

**Definición:** el carrier pierde el paquete durante el envío y no puede entregarlo.

**Flujo:**
1. Se detecta la pérdida (el carrier informa, o vence el plazo de tránsito sin entrega) → el
   **seller / carrier lo reporta** al Marketplace.
2. **CS Luquin** ejecuta el **reembolso al cliente** (manual), igual que en dirección
   incorrecta.
3. **Costo:** se reclama al **Carrier** (transportista responsable de la pérdida). El reclamo
   lo presenta **quien contrató al carrier**: el **seller** (modo A) o el **Marketplace**
   (modo B).

### Reglas / SLA — Fase 7b

- **Sin cancelaciones parciales** (arrepentimiento).
- **SLA arrepentimiento:** el cliente tiene **30 días** para solicitar la cancelación.
- **SLA dirección incorrecta:** **4-5 días** para que el seller responda al carrier antes de
  que el producto vuelva al CD.
- **Reembolsos — dos vías distintas:**
  - **Automático** (VTEX) cuando la cancelación se hace en el VTEX del seller (caso A1).
  - **Manual, por CS Luquin**, tras recibir el informe del seller (dirección incorrecta y
    lost-in-transit).
- **Costo lost-in-transit:** se reclama al **Carrier** (transportista responsable); el
  reclamo lo presenta quien contrató al carrier (seller en modo A, Marketplace en modo B).
- **Contacto CS:** `sellers-soporte@sporting.com.ar`.

---

## Fase 8 — Logística inversa / devoluciones

Cómo el cliente devuelve un producto de un seller. Todo pasa por el **Portal de Cambios y
Devoluciones** (self-service). Trae de vuelta **tareas de setup** (configurar el portal,
redactar T&C, carrier de inversa) más un **automatismo clave**: un botón que dispara tres
acciones a la vez. Las tareas de setup son las que se ejecutan durante el onboarding (paso
5 del roadmap en `docs/integracion-vtex-vtex.md`); el resto de esta fase es el runbook que
queda operando después.

> **Decisión bifurcante — ¿quién hace la logística inversa?** (igual que la logística directa
> en 7a, se define en el acuerdo con el seller):
> - **A · Inversa gestionada por el seller** → el seller indica su Carrier (tareas 8.2/8.3/8.4).
> - **B · Inversa gestionada por el Marketplace** → Ecomm consigue un contrato de retiro
>   (tarea 8.5).

#### Flujo del portal (self-service del cliente — runtime)

1. El cliente accede al **Portal de Cambios y Devoluciones** (válido hasta **180 días** desde
   el pedido).
2. Ingresa **DNI + N.º de pedido/orden**.
3. El **número de orden determina si el pedido es del Seller o del Marketplace**.
4. Si es de un seller → se aplican las **políticas de devolución específicas del seller**
   (detalladas en T&C).
5. Selección de gestión:
   - **Devolución** (si el pedido está dentro de **60 días**): elegir producto → **motivo** →
     verificar datos del cliente → finalizar.
   - **Devolución por Garantía** (hasta **180 días**): elegir producto → verificar datos →
     finalizar. *(No pide motivo.)*

#### El botón "crear devolución" (automático — 3 acciones atómicas)

Al confirmar, el botón dispara **de una sola vez**:
1. Crea la devolución en **PIM**.
2. Crea la devolución en el **VTEX del seller**.
3. Genera la **orden de retiro** para el Carrier.

#### Tareas de setup — Fase 8

| # | Ítem | Aplica a | Tarea Seller | Tarea Ecomm | Tarea PIM | Estado |
|---|---|---|---|---|---|---|
| 8.1 | Condiciones de devolución del seller | Siempre | Indicar condiciones específicas: plazos, **categorías no habilitadas** para devolución, etc. | Redactar esas condiciones/restricciones en la **página informativa / T&C** del sitio. | Configurar el portal para contemplar esas condiciones y restricciones. | ✅ |
| 8.2 | Carrier de inversa — ya configurado | Modo A, carrier conocido | Compartir **usuario y credenciales** de su Carrier. | — | Configurar el portal para crear órdenes de retiro con ese carrier. | ✅ |
| 8.3 | Carrier de inversa — nuevo | Modo A, carrier nuevo | Indicar el Carrier nuevo. | — | Crear la configuración para generar órdenes de retiro con esa logística nueva. | ✅ |
| 8.4 | Estados logísticos de inversa | Modo A | Enviar los estados logísticos de inversa. | Mapear esos estados a los **estándar de inversa** y pasarlos a PIM. | Dejar el mapeo cargado. | ✅ |
| 8.5 | Contrato de retiro (inversa por MP) | Modo B | — | Solicitar un **nuevo contrato de retiro** al carrier para el seller. | Configurar el portal con ese contrato. | ✅ |

#### Reglas / Decisiones — Fase 8

- **Canal único:** las devoluciones se hacen **sí o sí por el Portal de Cambios y
  Devoluciones**. No hay otra vía.
- **Identificación por N.º de orden:** el sistema detecta si el pedido es del seller o del
  Marketplace por el número de orden, y aplica las políticas correspondientes.
- **Plazos:** portal válido hasta **180 días**; **Devolución** dentro de **60 días**;
  **Devolución por Garantía** hasta **180 días**.
- **Políticas por seller en T&C:** cada seller puede tener condiciones propias (plazos,
  categorías no habilitadas) → deben estar redactadas en Términos y Condiciones (tarea 8.1).

---

## Registro de agujeros (TODO) — Fases 6 a 8

| Ítem | Qué falta | Bloqueante |
|---|---|---|
| 7a.3 | Definir la **integración** para recibir la `invoiceUrl` cuando el seller no carga la factura en su VTEX. | No (solo si el seller no factura por VTEX) |
| 7b.1 | Confirmar el **árbol de arrepentimiento** definitivo (hoy hay dos versiones no del todo alineadas: "Pedido retenido / Rechazo" vs. "Posibilidad / Imposibilidad"). | No |
| 7b | Definir **quién en CS Luquin** ejecuta el reembolso manual y con qué herramienta. | No |
| 8.4 | Confirmar si los **estados logísticos de inversa** comparten catálogo con los de forward (7a) o son un set separado. | No |
| 8 | Confirmar la diferencia operativa entre **Devolución (60 d)** y **Devolución por Garantía (180 d)** más allá del plazo (garantía no pide motivo). | No |

> El registro de agujeros de Fases 1-5 (onboarding) vive en `docs/integracion-vtex-vtex.md`.

---

## Estado del documento

✅ **Las 4 fases del runbook están cargadas** (6, 7a, 7b, 8). El esqueleto está completo;
lo que resta es cerrar los ítems del **Registro de agujeros** y, después, generar las
vistas (interna azul + seller verde) desde esta fuente.

**Este documento es la mitad "Operación" de un par.** La otra mitad —
[`docs/integracion-vtex-vtex.md`](./integracion-vtex-vtex.md)— cubre el onboarding: alta
del seller, catálogo, precio/stock/pagos, front y el setup previo al primer pedido. Se
separaron el 2026-08-06 porque mezclaban dos cosas de naturaleza distinta bajo una sola
numeración de "Fase": un proyecto de setup con principio y fin (Integración), y un runbook
operativo sin fin (este documento). Antes de la separación, Commerce Hub ya extraía solo
esta capa runtime para su propia página de "Procesos Sellers" — la separación acá
formaliza una distinción que el ecosistema ya usaba.

**Dónde buscar cada tema** (por si no aparece donde se esperaría):
- **Cancelación por arrepentimiento del cliente** → Fase 7b (la Fase 6 es solo la cancelación iniciada por el seller por stock).
- **Alta del seller, catálogo, precio/stock/pagos, front** → `docs/integracion-vtex-vtex.md`.

**Decisiones bifurcantes** que cambian qué corresponde por seller (se definen en el
onboarding, pero su detalle operativo vive acá):
- Logística **directa** — seller vs. Marketplace (Fase 7a).
- Logística **inversa** — seller vs. Marketplace (Fase 8).

---

## Plazos y SLAs (consolidado)

Estaban dispersos por todo el proceso; acá juntos porque los sellers los piden así.

| Plazo | Aplica a | Quién debe cumplirlo | Fase |
|---|---|---|---|
| **24 h** | Cancelar el pedido ante aviso de stock del seller ("Esperando Cambio de Seller") | Marketplace | 6 |
| **5 días** | Cancelar un pedido por falta de stock | Seller | 6 |
| **4-5 días** | Responder al carrier ante dirección incorrecta, antes de que el producto vuelva al CD | Seller | 7b |
| **30 días** | Solicitar la cancelación por arrepentimiento | Cliente | 7b |
| **60 días** | Vigencia del mail enmascarado del cliente (definida en la Fase 5 de onboarding) | *(sistema)* | 5 |
| **60 días** | Iniciar una **Devolución** en el portal | Cliente | 8 |
| **180 días** | Vigencia del portal / **Devolución por Garantía** | Cliente | 8 |
