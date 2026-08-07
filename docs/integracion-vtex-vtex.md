# Integración tipo VTEX ↔ VTEX

> **Estado:** borrador en construcción. Se completa por fases (ver `docs/roadmap.md`).
> **Este documento cubre solo el onboarding** (Fases 1-5, una vez por seller, termina en
> Go Live). El día a día una vez que el seller ya está operando — cancelaciones,
> fulfillment, pedidos no entregados, devoluciones — vive en
> [`docs/operacion-vtex-vtex.md`](./operacion-vtex-vtex.md), el runbook complementario.
> Antes vivían juntos en un solo documento; se separaron porque son dos cosas de
> naturaleza distinta: acá hay un proyecto con inicio y fin, ahí hay un proceso que se
> repite para siempre. Ver "Estado del documento" al final.
> Este documento es la **fuente de verdad** del proceso. Las páginas del portal
> (interna en `internal/estrategia/` y seller en `public/`) se generan **desde acá** —
> no se editan a mano en paralelo.

Es el playbook profundo de la etapa **"6. Integración"** del onboarding
(`internal/estrategia/proceso-onboarding.html`) para el modelo **VTEX ↔ VTEX**
(`internal/estrategia/modelo-integracion.html`).

---

## Cómo leer este documento

Este documento es, casi en su totalidad, un **checklist de setup**: acciones que se
ejecutan **una vez por seller** durante el onboarding, con un dueño y un estado. Mezcla
tres tipos de contenido:

- **Tareas (setup)** — accionables que se ejecutan una vez por seller (crear política,
  mapear talles, crear tienda en PIM). Cada celda de rol no vacía es una tarea con dueño →
  **de acá salen las tareas a crear y asignar** en el checklist de alta.
- **Reglas / Decisiones** — políticas fijas del negocio que hace falta conocer para tomar
  las decisiones de setup (costos, umbrales, qué se acepta y qué no). **No se le asignan a
  nadie**; van a Términos y Condiciones o a la página informativa del seller.
- **Flujo automático** — lo que el sistema hace solo (VTEX↔PIM). Sin dueño; se documenta
  para entender el flujo. Aparece en la Fase 5, como base de lo que después es el runbook
  operativo completo.

Este documento **no** incluye responsabilidades operativas recurrentes (RACI de
cancelación, fulfillment, pedidos no entregados, devoluciones) — eso vive en
[`docs/operacion-vtex-vtex.md`](./operacion-vtex-vtex.md).

### Roles canónicos

Usar **siempre** estos nombres (evitar variantes como "Ecomm / Ecom / Marketplace / Markeplace"):

| Rol | Quién es |
|---|---|
| **Seller** | El vendedor externo, sobre su propio VTEX. |
| **Ecomm** | Equipo de e-commerce del Marketplace (configura VTEX, mapeos, VCC). |
| **Agente PIM** | Configura tienda, depósito, logística y devoluciones en PIM. |
| **Infracommerce** | Proveedor que ajusta lógica de front/checkout vía ticket. |
| **Diseño** | Equipo de diseño gráfico (grillas, banners, headers). |
| **CS** | Atención al cliente del Marketplace — protagonista del runbook operativo, casi sin intervención en el onboarding. |

> En Fase 1 y 2 solo intervienen **Seller** y **Ecomm**. El resto de los roles aparece
> en las fases de Front y Pedido.

### Convenciones de estado

- ✅ **completo** — información suficiente para ejecutar.
- ⚠️ **falta** — hay un hueco que resolver antes de dar por cerrado el ítem.
- 🧪 **QA** — pendiente de probar en ambiente de pruebas.

---

## Hoja de ruta de la integración

Orden real de ejecución de un seller nuevo, punta a punta — desde el kickoff hasta el
Go Live. Es el mapa que falta antes de entrar al detalle fase por fase — de acá sale
también la versión que ve el seller (`public/integracion/integracion-seller.html`,
sección "Hoja de ruta").

> **Duración estimada: 6 a 10 semanas**, desde el kickoff (paso 0) hasta el Go Live
> (paso 10). Es un rango, no una fecha fija — depende sobre todo de la velocidad de
> respuesta del seller y de su agencia técnica (política comercial, mapeos, envío de
> Excels) en los pasos 1-5, que son los que más varían de un seller a otro. Los pasos
> con dependencias externas nuestras (Diseño para las grillas, Infracommerce vía
> ticket) también pueden estirar el rango — ver Fase 4. No comunicar como promesa
> cerrada; comunicar como estimación.

El paso 5 (Devoluciones) configura algo que **después** se usa
en el runbook operativo — su detalle de tareas vive en Fase 8 de
[`docs/operacion-vtex-vtex.md`](./operacion-vtex-vtex.md), no en este documento.

| # | Paso | Fase(s) | Quién actúa | Nota |
|---|---|---|---|---|
| 0 | **Kickoff** | — | Ecomm (contacto de integración) | Mail inicial + reunión con contactos de ambos lados ya definidos. |
| 1 | **Conexión QA** | Fase 1 | Ecomm (bloqueante) + Seller (en paralelo) | Ecomm da de alta al seller con su cuenta VTEX (sobre **QA** si tiene una) y su propia política comercial. **En paralelo**, sin bloquear, el seller tramita la suya con su agencia — la necesita recién para la tarea 1.2, no para esta conexión. |
| 2 | **Catálogo** | Fase 2 | Seller + Ecomm | Mapeo de marcas, categorías, talles, especificaciones. |
| 3 | **Precio, Stock y Pagos** | Fase 3 | Seller + Ecomm | Fuente de precio/stock, condición comercial, medios de pago. |
| 4 | **Envíos** | Fase 4 (parte seller) | Seller | Costos, plazos, destinos excluidos. |
| 5 | **Devoluciones** | Fase 8 (ver Operación) | Seller + Agente PIM | Logística inversa y condiciones de devolución — tareas de setup detalladas en `docs/operacion-vtex-vtex.md`. |
| 6 | **Configuración en PIM** | Fase 5 | Agente PIM | Tienda + depósito + asociación VTEX↔PIM. **Puede correr en paralelo a los pasos 2-5**, pero **bloquea** el paso 7 (sin esto el pedido no ingresa bien a PIM). |
| 7 | **Validación en QA** | — | Seller + Ecomm | Flujo completo end-to-end: catálogo → aprobación → pedido → despacho → devolución, sobre el ambiente de prueba. |
| 8 | **Conexión y réplica en Producción** | Fase 1 (repetida) | Seller + Ecomm | Se repite la configuración ya validada en QA, ahora sobre la cuenta de producción. |
| 9 | **Prueba piloto en Producción** | — | Seller + Ecomm | Validar con un set acotado de productos antes de abrir todo el catálogo. |
| 10 | **Go Live** | Fase 2 | — | El seller queda **"Activo"**; el catálogo es visible en el sitio (regla: solo con precio y stock). A partir de acá, la operación diaria pasa a regirse por `docs/operacion-vtex-vtex.md`. |

> **Paso 6 en paralelo, no al final:** no tiene tarea del lado del **Seller**, por eso es
> fácil de omitir — pero es la única precondición **dura** documentada (Fase 5) para que un
> pedido funcione. Conviene arrancarlo junto con los pasos 2-5.
>
> **Por qué hay dos "pruebas" (7 y 9):** son ambientes y objetivos distintos — la 7 valida
> que el flujo *funciona* (QA); la 9 valida que el flujo funciona *con datos reales de
> producción*, acotado, antes de exponer todo el catálogo.
>
> **Este roadmap no va en el mail de kickoff** (ver `plantilla-mail-kickoff-integracion.md`)
> — el mail linkea a la guía; la hoja de ruta completa vive acá.

---

## Fase 1 — Conexión / Política comercial

### 1.0 · Ambiente de conexión (QA o Producción)

Antes de arrancar el alta, hay que preguntarle al seller si tiene una cuenta **VTEX de QA**
propia. De la respuesta depende cómo se hace la tarea 1.1:

- **Tiene cuenta QA** → se conecta **QA↔QA** y se prueba el flujo completo sin tocar
  producción. Es el camino recomendado.
- **No tiene cuenta QA** → la integración de prueba se hace directamente sobre su cuenta de
  **producción**. Es menos ideal (hay que evaluar el riesgo caso por caso), pero es una
  opción válida si el seller no tiene ambiente de pruebas.

Una vez validado en QA, el paso 8 del roadmap repite la misma configuración sobre la cuenta
de producción del seller.

### 1.1 · Conexión entre VTEX (alta del seller)

La conexión la **inicia Luquin** desde su VTEX, en **Marketplace › Sellers › Gestión ›
botón "+ Agregar seller"**. Existe además un módulo **"Invitación de sellers"** en el mismo
menú, pero **no se usa en este proceso** — el alta siempre es por "Agregar seller".

**Dos vistas de la misma UI**: la **creación** es un formulario largo de una sola página; la
**edición** de un seller ya creado reorganiza los **mismos campos** en 4 pestañas. Solo
cambia el agrupamiento visual, no el contenido.

**Secciones del formulario de creación, en su orden real** (`*` = obligatorio):

| Sección (creación) | Pestaña equivalente (edición) | Campos |
|---|---|---|
| Tipo de integración | — | Elegir **"Seller VTEX"** (no "Seller externo", que es otro modelo). |
| Integración | Integración | *Cuenta de seller VTEX\** — account name del VTEX del seller · *ID de afiliado* (ver detalle abajo) · *Política comercial* (ID numérico, ver recuadro abajo) · toggle **MOI** (sin documentar, ver pendientes). |
| Información básica | Datos del seller | *Nombre del seller\** (se muestra en el storefront) · *ID de seller\** (fijo al crear, referencia de arriba del formulario) · *Grupo de sellers* (opcional). |
| Acuerdos comerciales | Acuerdos comerciales | **Políticas comerciales del marketplace\*** (ver recuadro abajo) · *Comisión de productos\*/envío\** (%), con opción por categoría · toggle **GiftCards** — desactivado por defecto, confirma la regla de Fase 3; lo tildea **Ecomm** al crear cada seller, el seller no toca esta pantalla. |
| Información adicional *(opcional, colapsada)* | Datos del seller | *Email* · *Nro. de registro de persona jurídica* · *Descripción*. |
| — *(no existe en la creación)* | Información operativa | *Política de envío* · *Cambios y devoluciones* · *Política de privacidad y seguridad* — ubicación nativa para las reglas de Fase 4.6-4.8 y del runbook de devoluciones (Fase 8 de `docs/operacion-vtex-vtex.md`). |

Al pie del formulario: checkbox **"Pausar el seller después de registrarlo"** (activado por
defecto) — el seller queda **"En pausa"** hasta terminar de configurarlo; pasa a **"Activo"**
cuando está listo.

**ID de afiliado** — código corto que identifica al seller, **derivado de su propio nombre**
(ej. Topper → `TOP`). Prefija el Customer PO del seller (Fase 5). Junto con la cuenta VTEX y la política comercial,
arma automáticamente la **URL de fulfillment**:
`.../api/fulfillment?an={cuenta}&affiliateId={ID de afiliado}&sc={política comercial}`.

> ⚠️ **Hay DOS "política comercial" distintas, no una:**
> 1. **La de Ecomm** (campo "Políticas comerciales del marketplace", obligatorio) — vive en
>    el **VTEX de Sporting**, la crea **Ecomm**, **nueva por cada seller** (no se reutiliza
>    entre sellers), y se crea **antes** de llegar a este formulario. En la pestaña
>    Integración es el mismo campo, mostrado como **ID numérico** (ej. `4`) en vez de selector.
> 2. **La del Seller** (tarea 1.2 más abajo) — vive en **su propio VTEX**, la pide él a su
>    agencia, y sirve para que él marque qué productos manda al Marketplace.
>
> Son objetos **desacoplados**: la del Seller no aparece en ningún campo de este formulario
> y **no bloquea** el alta — Ecomm completa la conexión con solo la cuenta VTEX del seller y
> su propia política. La del Seller hace falta recién en la tarea **2.9** (Fase 2, asignarla
> a productos), y puede tramitarse en paralelo sin frenar nada de este lado.

> **Contacto de integración:** Gabriel Luna — `gabriel.luna@luquin.com.ar`. Es un contacto
> **distinto** del operativo del runbook (`sellers-soporte@sporting.com.ar`), que es para
> incidencias de pedidos ya en marcha, no para arrancar una integración.

> **Equipo de integración del seller:** al kickoff, preguntarle con qué integrador/agencia
> técnica trabaja su VTEX (ej. **Infracommerce**, **Suma**, u otro). Puede coincidir con
> nuestro propio proveedor (**Infracommerce**, ver tabla de roles) o ser uno distinto — sirve
> como contacto técnico de referencia para resolver dudas de configuración de su lado.

> **Kickoff:** el primer contacto con el seller lo hace Gabriel por mail, con el **link de
> acceso al portal + usuario y contraseña** ya creados (cuenta tipo Seller, ver
> `Users.gs`/`configuracion.html`). El mail le indica **ingresar y cambiar la contraseña**
> por una propia. El seller entra con esas credenciales y desde ahí puede consultar la guía
> (`public/integracion/integracion-seller.html`). Template reutilizable:
> [`docs/plantilla-mail-kickoff-integracion.md`](./plantilla-mail-kickoff-integracion.md).

> ⚠️ **A completar más adelante** *(no bloqueante):*
> - Qué **credenciales/permisos** se intercambian para que la integración por API quede activa.
> - **Toggle "Inventario omnicanal (MOI) de varios niveles"**: qué hace y cuándo conviene
>   activarlo. Para Topper: dejarlo **desactivado** (default) hasta documentarlo.

### Política comercial

La política comercial permite **diferenciar los productos** dentro del sitio (ver el
recuadro de arriba para la distinción Ecomm/Seller — no se repite acá).

**Ventajas de una política comercial diferenciada:**
1. **Catálogo** — optimiza la disponibilidad de productos estableciendo restricciones.
2. **Promociones** — define con claridad qué productos participan, vinculándolas a políticas específicas.
3. **Pagos** — ajusta condiciones de pago según la política comercial.

Cuando el seller asigna **su propia** política a un producto, ese producto **viaja al VTEX
del Marketplace** y cae en la bandeja de aprobación. **Esa asignación es la tarea 2.9**
(Fase 2 — Catálogo), no una tarea de esta fase: acá se documenta el objeto (quién la crea,
para qué sirve), no su uso recurrente sobre el catálogo completo.

> **Prueba de conexión (smoke test):** para confirmar que el alta funcionó, alcanza con que
> el seller asigne su política a **un solo producto** de prueba y se verifique que llega a la
> bandeja de aprobación (roadmap paso 7, Validación en QA). No hace falta asignarla a todo el
> catálogo todavía — eso ya es trabajo de la Fase 2.

#### Tareas — Fase 1

| # | Ítem | Descripción | Tarea Seller | Tarea Ecomm | Estado |
|---|---|---|---|---|---|
| 1.0 | Confirmar ambiente (QA o producción) | Define si la conexión de prueba se hace QA↔QA o directo en producción (ver detalle arriba). | Informar si tiene una cuenta VTEX de QA propia. | Registrar la respuesta y definir el ambiente para la tarea 1.1. | ✅ |
| 1.1 | Alta del seller | Ecomm crea el seller en **Gestión › Agregar seller** (tipo *Seller VTEX*), sobre el ambiente definido en 1.0. | Compartir su **cuenta de seller VTEX** (y de QA, si aplica). | Crear su propia política comercial (prerrequisito); completar el alta; activar cuando esté listo. | ✅ |
| 1.2 | Solicitar política comercial (seller) | Necesaria para la tarea **2.9** (Fase 2) — no bloquea el alta (ver recuadro arriba). | Solicitar una nueva política comercial a su agencia. | — | ✅ |
| 1.3 | Equipo de integración del seller | Contacto técnico de referencia para el resto del proceso. | Informar con qué integrador/agencia técnica trabaja (ej. Infracommerce, Suma, etc.). | Registrar el contacto. | ✅ |
| 1.4 | Mail de contacto operativo | Canal para consultas puntuales durante la operación (ver `docs/operacion-vtex-vtex.md`, Fase 7b) — distinto del contacto técnico de 1.3. | Indicar un mail de contacto — preferentemente uno dedicado, no una casilla personal. | Registrar el mail para usarlo desde `sellers-soporte@sporting.com.ar`. | ✅ |

#### Reglas / Decisiones — Fase 1

- **Costo:** la política comercial cuesta **USD 40**. Cada parte se hace cargo de la suya.
- **No bloqueante:** la política del seller no es requisito del alta (ver recuadro arriba) —
  hace falta recién para la tarea 2.9.
- **Todo se configura sobre la política de Ecomm:** los productos aprobados se crean con
  ella; las configuraciones de comisión, promoción y pago (Fase 3) se aplican sobre esa base.

---

## Fase 2 — Catálogo

Todos los atributos del producto **llegan directamente desde el VTEX del seller**. El
trabajo de Ecomm es **mapear** para que queden alineados al estándar del Marketplace, y
usar **VCC** (módulo de aprobación de productos) para automatizar lo que se pueda.

#### Tareas — Fase 2

| # | Ítem | Descripción | Tarea Seller | Tarea Ecomm | Estado |
|---|---|---|---|---|---|
| 2.1 | Título | Llega desde el VTEX del seller. | — | Usar **VCC** para automatizar el armado del título (ej.: si el título no trae la marca, agregarla automáticamente para alinearlo al estándar). | ✅ |
| 2.2 | Marca | Llega desde el VTEX del seller. | Si tiene múltiples marcas, enviar el listado para mapear (o crear+mapear). | Crear la marca si no existe y mapear. Si corresponde, sumarla al menú. | ✅ |
| 2.3 | Categorías | Llegan desde el VTEX del seller. El mapeo conecta las categorías del seller con las del Marketplace; al aprobar, autocompleta la categoría correcta. | Compartir en Excel su **árbol de categorías**. | Mapear en VTEX. Crear categoría nueva solo si no existe en nuestro catálogo (crear+mapear). Si corresponde, sumarla al menú. | ✅ |
| 2.4 | Descripción | Llega desde el VTEX del seller. Se usa tal cual. | — | — | ✅ |
| 2.5 | Especificaciones | Atributos/detalles del producto (color, sabor, género, material, etc.). Nombre de campo + valores. Ambos VTEX ya tienen los suyos; pueden coincidir o no. | Enviar todas las especificaciones y valores creados en su VTEX. | Mapear campos y valores en VTEX (ej.: `Género = Gender`). Crear valores nuevos solo si es necesario. | ✅ |
| 2.6 | Talles | Llega desde el VTEX del seller. El mapeo unifica al estándar del Marketplace (ej.: `2XL = XXL`). | Compartir Excel con todos los talles creados en su VTEX. | Con el archivo, hacer el mapeo correspondiente. | ✅ |
| 2.7 | Score | Posicionamiento del producto en el catálogo. Ya automatizado: siempre arranca en **80**. | — | — | ✅ |
| 2.8 | Imágenes | Llegan desde el VTEX del seller. | — | Usar **VCC** para automatizar el orden de las imágenes y alinearlas al estándar del sitio. | ⚠️ falta |
| 2.9 | Aprobación de productos | Al asignar **su** política (Fase 1.2), el producto viaja al Marketplace y un agente lo revisa. | Asignar su política comercial a los productos a vender. | Revisar y aprobar los productos en la bandeja. | ✅ |
| 2.10 | Rechazo de productos | El agente puede rechazar y dejar motivo; el seller corrige y reenvía. | Revisar bandeja de rechazados y corregir según el motivo. | Rechazar dejando un motivo claro. | 🧪 QA |

#### Reglas / Decisiones — Fase 2

- **Descripción:** se publica tal cual llega del seller, sin edición.
- **Score:** automatizado en 80 para todos; no se toca por seller.
- **Imágenes con fondo gris:** todavía **no** hay automatización para cambiar el fondo.
  Por ahora se aprueban con fondo gris. ⚠️ **Tema a acordar con el seller.**
- **Objetivo del mapeo (especificaciones/talles/categorías):** conservar toda la
  información del VTEX del seller en la publicación del Marketplace → publicaciones más
  completas y menos carga manual posterior de los agentes.
- **Visibilidad:** un producto aprobado solo se muestra si tiene **precio y stock**.

---

## Fase 3 — Precio / Stock / Pagos

Precio y stock **llegan automáticamente vía API** entre ambos VTEX; el Marketplace no
los toca. El trabajo de Ecomm en esta fase es **configurar las condiciones de pago y las
promociones** específicas del seller.

> **Precondición:** los **medios de pago y cuotas** salen del **acuerdo comercial** con el
> seller. Es un input **externo** a este proceso — sin él, la tarea 3.4 no puede arrancar.

> **Esta fase no incluye la estrategia de envío del seller.** Costos, plazos y destinos
> excluidos son configuración que el seller carga en **su propio VTEX** y afectan el front
> (lo que ve el cliente) — están documentados en **Fase 4 (4.6-4.8)**. Acá en Fase 3 solo
> vive la promoción de **envío gratis** (3.5), que es una regla del Marketplace.

#### Tareas — Fase 3

| # | Ítem | Descripción | Tarea Seller | Tarea Ecomm | Estado |
|---|---|---|---|---|---|
| 3.1 | Precio | Llega automático vía API entre ambos VTEX. | Elegir cómo envía el precio: usar su **lista actual** o crear una **lista nueva** para el Marketplace. | — (no interviene). | ✅ |
| 3.2 | Stock | Llega automático vía API entre ambos VTEX. | Crear un **almacén nuevo** para asignar el stock del Marketplace, o usar uno existente. Depende de si quiere stock diferenciado (decisión del seller). | — (no interviene). | ✅ |
| 3.3 | Condición comercial | Permite asignar condiciones de pago diferenciadas por seller. | — | Crear la **condición comercial específica** del seller; con ella configura las condiciones de pago y automatiza la carga en **VCC**. | ✅ |
| 3.4 | Configuración de pagos | Medios de pago y cuotas según el acuerdo comercial. | Definir con el **comercial del Marketplace** qué medios de pago y cuotas usará (viene del acuerdo comercial). | Con la info clara, configurar los medios/cuotas en VTEX aplicando la **condición comercial** del seller. | ✅ |
| 3.5 | Promoción de envío gratis | Aplicar la promo de envío gratis del sitio también a los productos del seller. | — | Configurar en VTEX la promo de **envío gratis** para que afecte a los productos del seller. | ✅ |

#### Reglas / Decisiones — Fase 3

- **Responsabilidad de precios:** el **seller** es el único responsable de fijar los
  precios de sus productos. El Marketplace **no interviene** en esa determinación.
- **Stock diferenciado:** es **decisión del seller** — almacén nuevo (stock separado) vs.
  almacén único (stock compartido).
- **Umbral de envío gratis:** sujeto al del sitio, **actualmente $149.990**. Es un
  parámetro global (mismo valor que aparece en la regla de carrito compartido, Fase 4).
- **Cupones de descuento:** **no** se aceptan cupones para productos seller. La única
  promoción que permanece para todos los sellers es la de **envío gratis**. Ecomm ya tiene
  configurado que los cupones funcionen solo para productos del Marketplace.
- **GiftCards:** **no** se aceptan giftcards para productos seller. Caso: si un cliente
  devuelve un producto del Marketplace y recibe una giftcard, **no** podrá usarla en
  productos seller.

---

## Fase 4 — Front

Todo lo que **ve el cliente** en el sitio. La mayoría son tareas de **Ecomm**, con dos
dependencias externas: **Diseño** (grillas) e **Infracommerce** (ajustes de checkout vía
ticket). El seller casi no interviene, salvo en la configuración de envíos.

> **Dependencia clave (una config alimenta tres features):** el **valor de especificación
> "Seller"** que se crea en el filtrado (4.1) es el mismo dato que habilita la **cucarda**
> (4.2) y la **leyenda de PDP/checkout** (4.5). Se configura una vez.

> **"Envíos" aparece en varios lugares del proceso — no es el mismo tema repetido:**
> - **Acá (4.6-4.8):** el seller carga costos, plazos y destinos excluidos en **su propio
>   VTEX**. Es configuración de front — determina lo que ve el cliente en la PDP y el
>   checkout, y define si el pedido incluso puede tomarse (destino excluido).
> - **Fulfillment (ver `docs/operacion-vtex-vtex.md`, Fase 7a):** una vez que hay un pedido
>   real, quién ejecuta el despacho — el seller con su propio carrier, o el Marketplace con
>   los suyos.
> - **Logística inversa (ver `docs/operacion-vtex-vtex.md`, Fase 8):** lo mismo pero para
>   devoluciones — quién retira el producto que el cliente devuelve.
>
> Las tres son decisiones/configuraciones separadas del mismo tema "envío", en momentos
> distintos del proceso (antes de vender / al despachar / al devolver) — las dos últimas ya
> son parte del runbook operativo, no del onboarding.

#### Tareas — Fase 4

| # | Ítem | Descripción | Tarea Seller | Tarea Ecomm | Tarea Infra | Tarea Diseño | Estado |
|---|---|---|---|---|---|---|---|
| 4.1 | Filtrado | En la PLP se muestra el filtro **"Vendido por"** con la opción de elegir el seller. | — | Crear el **valor de especificación "Seller"** en VTEX y automatizar su carga en **VCC** (módulo de aprobación). | — | — | ✅ |
| 4.2 | Cucarda | Identifica al seller en la card de producto y en la PDP ("Tienda xxx"). | — | Configurar las cucardas en VTEX usando la especificación de producto. | — | — | ✅ |
| 4.3 | Grilla personalizada | Cada seller tiene su grilla propia (header propio + banner grilla x8), visible al filtrar por el seller o entrar a su landing. | — | Solicitar las gráficas a Diseño; crear la **URL personalizada**; cargar gráficas y contenido. | — | Hacer las gráficas y entregarlas. | ✅ |
| 4.4 | Restricción de carrito compartido | No se permiten carritos mixtos con productos de distintos sellers. | — | Crear **ticket a Infra** para incluir al seller en la lógica. | Configurar la restricción. | — | ✅ |
| 4.5 | Info diferencial en PDP / mini-cart / checkout | Leyenda **"vendido y distribuido por…"** en PDP, mini-cart y checkout. | — | Crear **ticket a Infra** para los ajustes. | Realizar los ajustes. | — | ✅ |
| 4.6 | Exclusión de destinos | El seller no despacha a ciertos destinos (ej.: Tierra del Fuego). | Configurar en su VTEX los destinos a los que despacha e informarlos. | Sumar la restricción a **Términos y Condiciones** (evitar dudas/reclamos). | — | — | ✅ |
| 4.7 | Costo de envío | Lo determina el seller; puede diferir del Marketplace. | Cargar su **planilla de envío** en su VTEX (costos y plazos por CP o polígono). | — | — | — | ✅ |
| 4.8 | Promesa de entrega | Tiempo estimado de llegada informado al cliente. | Cargar su política de envío en **VTEX > estrategias de envío** (tiempos por CP o polígono). | — | — | — | ✅ |

#### Reglas / Decisiones — Fase 4

- **No se permiten carritos mixtos** (productos de distintos sellers en un mismo carrito). Motivos:
  1. **Conciliación:** mantener los productos separados facilita el registro y seguimiento de transacciones.
  2. **Liquidación:** cada seller tiene un **número de comercio distinto** → identificación clara en la liquidación de tarjetas/medios de pago.
  3. **Logística inversa:** cada seller puede tener políticas de cambio/devolución distintas (unos aceptan cambios, otros solo devoluciones).
  4. **Envío gratis:** si se sumaran productos de varios sellers para llegar al umbral, el cliente no pagaría el envío pero cada seller sí → no conviene.
  5. **Medios de pago:** si un seller no acepta un medio y otro sí, combinados se mostrarían todos → incorrecto.
  - **Limitación técnica:** VTEX aún no permite dos carritos en simultáneo para estos casos.
- **Identificación del seller:** cucarda ("Tienda xxx") y leyenda ("vendido y distribuido por…") se alimentan del **valor de especificación Seller**, el mismo del filtrado.
- **Costo de envío:** lo define cada seller y puede variar respecto del Marketplace. Como **no hay carrito compartido**, no hay acumulación de costos de envío. Si a futuro se implementa carrito compartido, **revisar este punto**.

> **Dependencias externas — planificar con lead time:** 4.3 depende de **Diseño**; 4.4 y
> 4.5 dependen de **Infracommerce** (vía ticket). No están bajo control directo de Ecomm.
> Evaluar **unificar los dos tickets a Infra** (4.4 + 4.5) en uno solo.

---

## Fase 5 — Pedido (setup)

Antes del primer pedido real, hace falta que la conexión VTEX↔PIM esté lista. Por eso esta
fase tiene **poco de tarea y mucho de comportamiento automático de referencia** — sirve para
entender el circuito antes de que empiece a correr en producción. El día a día de cada
pedido (qué hace cada actor, SLAs) ya es runbook operativo y vive en
[`docs/operacion-vtex-vtex.md`](./operacion-vtex-vtex.md).

#### Cómo se arma el circuito (referencia, no acción)

- **Customer PO** — el número que le llega al seller es el **ID de afiliado + el número del
  Marketplace**. El ID de afiliado se deriva del nombre del propio seller (ej.
  Topper → `TOP`) y se define en el **alta del seller** (Fase 1.1). Ej.: `1385074194464-01`
  (Marketplace) → `TOP-1385074194464-01` (Topper).
- **Creación en VTEX** — al finalizar la compra, el pedido se genera en VTEX y es visible
  **tanto en el VTEX del Seller como en el del Marketplace**.
- **Creación en PIM** — una vez configurados tienda + depósito + asociación (tareas 5.1-5.3),
  el pedido ingresa **automáticamente** en PIM, en la tienda/depósito correspondiente y en
  estado **Activo**.

#### Tareas — Fase 5

| # | Ítem | Descripción | Tarea Seller | Tarea Ecomm | Tarea PIM | Estado |
|---|---|---|---|---|---|---|
| 5.1 | Crear tienda en PIM | Una tienda nueva en PIM por cada seller. | — | — | Crear la tienda en PIM. | ✅ |
| 5.2 | Crear depósito en PIM | Un depósito específico en PIM por cada seller. | — | — | Crear el depósito en PIM. | ✅ |
| 5.3 | Asociación pedidos VTEX–PIM | Que todo pedido del seller se asigne a su tienda/depósito, usando el **ID del seller** creado en VTEX. | — | — | Configurar la asociación. | ✅ |

> **Orden de ejecución:** 5.1 → 5.2 → 5.3 son **secuenciales y precondición** de que los
> pedidos entren correctamente a PIM. Sin las tres, el pedido se crea en VTEX pero **no**
> ingresa bien a PIM. Deben quedar listas **antes del go-live** del seller.

#### Reglas de referencia — Fase 5

Datos de contexto sobre cómo se comporta un pedido, para entender el circuito que se está
configurando (el detalle operativo de cada uno vive en el runbook):

- **Mail del cliente:** solo visible en el VTEX del **Marketplace**; **enmascarado** para el
  Seller. El correo enmascarado **sigue siendo funcional** (si el seller le escribe, le llega
  al cliente) y tiene **vigencia de 60 días**.
- **Valores del pedido:** el **Marketplace** puede ajustar el valor final; el **Seller no**.
  *(Función que no se usaría.)*
- **Baja de pedidos:** los pedidos de seller en estado **Activo no pueden darse de baja
  desde PIM** — la función está deshabilitada a propósito para prevenir errores humanos. Las
  **cancelaciones solo las hace el Seller desde su VTEX** — ver el runbook de cancelaciones
  en `docs/operacion-vtex-vtex.md`.

---

## Registro de agujeros (TODO) — Fases 1 a 5

| Ítem | Qué falta | Bloqueante |
|---|---|---|
| 1.1-c | Documentar qué hace el toggle **"Inventario omnicanal (MOI) de varios niveles"** y cuándo conviene activarlo. Para Topper: dejarlo desactivado (default). | No |
| 1.1-d | Confirmar qué **credenciales/permisos** se intercambian para que la integración por API quede activa. | No |
| 2.8 | Confirmar alcance de la automatización de orden de imágenes en VCC. | No |
| 2.10 | **Lista de motivos de rechazo** — falta definirla. | No |
| 2.10 | Probar flujo de rechazo/reenvío en QA. | No |
| Imágenes | Decidir con el seller qué se hace con fondos grises. | No |
| 4.2 | Confirmar el texto exacto de la cucarda ("Tienda xxx" es placeholder). | No |
| 4.4 / 4.5 | Evaluar unificar los dos tickets a Infracommerce en uno solo. | No |

> El registro de agujeros de Fases 6-8 (fulfillment, pedidos no entregados, devoluciones)
> vive en `docs/operacion-vtex-vtex.md`.

---

## Estado del documento

✅ **Las 5 fases de onboarding están cargadas.** El esqueleto está completo; lo que resta
es cerrar los ítems del **Registro de agujeros** y, después, generar las vistas (interna
azul + seller verde) desde esta fuente.

**Este documento es la mitad "Integración" de un par.** La otra mitad —
[`docs/operacion-vtex-vtex.md`](./operacion-vtex-vtex.md)— cubre lo que pasa con cada
pedido una vez que el seller ya está activo: cancelaciones, fulfillment, pedidos no
entregados y devoluciones. Se separaron el 2026-08-06 porque mezclaban dos cosas de
naturaleza distinta bajo una sola numeración de "Fase": un proyecto de setup con
principio y fin, y un runbook operativo sin fin. Antes de la separación, Commerce Hub ya
extraía solo la capa runtime de este documento para su propia página de "Procesos
Sellers" — la separación acá formaliza una distinción que el ecosistema ya usaba.

**Dónde buscar cada tema** (por si no aparece donde se esperaría):
- **Cupones, giftcards y políticas de precios** → Fase 3 (son reglas de precio/pago, no de front).
- **Cancelación, fulfillment, pedidos no entregados, devoluciones** → `docs/operacion-vtex-vtex.md`.

**Decisiones bifurcantes** que se definen acá pero cuyo detalle operativo vive en el runbook:
- Logística **directa** — seller vs. Marketplace (detalle en Operación, Fase 7a).
- Logística **inversa** — seller vs. Marketplace (detalle en Operación, Fase 8).
- Config. de **pagos** — depende del acuerdo comercial (precondición, Fase 3).
