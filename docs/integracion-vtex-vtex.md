# Integración tipo VTEX ↔ VTEX

> **Estado:** borrador en construcción. Se completa por fases (ver `docs/roadmap.md`).
> **Documento completo:** las 8 fases están cargadas (1-6, 7a, 7b, 8).
> Ver "Estado del documento" y la tabla consolidada de SLAs al final.
> Este documento es la **fuente de verdad** del proceso. Las páginas del portal
> (interna en `internal/estrategia/` y seller en `public/`) se generan **desde acá** —
> no se editan a mano en paralelo.

Es el playbook profundo de la etapa **"6. Integración"** del onboarding
(`internal/estrategia/proceso-onboarding.html`) para el modelo **VTEX ↔ VTEX**
(`internal/estrategia/modelo-integracion.html`).

---

## Cómo leer este documento

Cada fase mezcla hasta **cuatro tipos de contenido** que **no** hay que confundir. Esta
distinción es clave para tu objetivo de "crear y asignar tareas": solo el primer tipo va al
checklist de alta del seller.

- **Tareas (setup)** — accionables que se ejecutan **una vez por seller** durante el
  onboarding (crear política, mapear talles, crear tienda en PIM). Cada celda de rol no
  vacía es una tarea con dueño → **de acá salen las tareas a crear y asignar**. Dominan las
  Fases 1-5.
- **Responsabilidades operativas (runtime)** — acciones **recurrentes por pedido** (el
  seller cancela por stock, factura; el Marketplace gestiona la ventana de 24h). **No** son
  tareas de onboarding: definen un **RACI / runbook**, no van al checklist de alta. Dominan
  las Fases 6-8.
- **Reglas / Decisiones** — políticas fijas del negocio. **No se le asignan a nadie**;
  van a Términos y Condiciones o a la página informativa del seller.
- **Flujo automático** — lo que el sistema hace solo (VTEX↔PIM, mails, reembolsos). Sin
  dueño; se documenta para entender el flujo. Aparece desde la Fase 5.

### Roles canónicos

Usar **siempre** estos nombres (la redacción original mezclaba "Ecomm / Ecom / Marketplace / Markeplace"):

| Rol | Quién es |
|---|---|
| **Seller** | El vendedor externo, sobre su propio VTEX. |
| **Ecomm** | Equipo de e-commerce del Marketplace (configura VTEX, mapeos, VCC). |
| **Agente PIM** | Configura tienda, depósito, logística y devoluciones en PIM. |
| **Infracommerce** | Proveedor que ajusta lógica de front/checkout vía ticket. |
| **Diseño** | Equipo de diseño gráfico (grillas, banners, headers). |
| **CS** | Atención al cliente del Marketplace. |

> En Fase 1 y 2 solo intervienen **Seller** y **Ecomm**. El resto de los roles aparece
> en las fases de Front, Pedido y Logística.

### Convenciones de estado

- ✅ **completo** — información suficiente para ejecutar.
- ⚠️ **falta** — hay un hueco que resolver antes de dar por cerrado el ítem.
- 🧪 **QA** — pendiente de probar en ambiente de pruebas.

---

## Hoja de ruta de la integración

Orden real de ejecución de un seller nuevo, punta a punta. Es el mapa que falta antes de
entrar al detalle fase por fase — de acá sale también la versión que ve el seller
(`public/integracion/integracion-seller.html`, sección "Hoja de ruta").

| # | Paso | Fase(s) | Quién actúa | Nota |
|---|---|---|---|---|
| 0 | **Kickoff** | — | Ecomm (contacto de integración) | Mail inicial + reunión con contactos de ambos lados ya definidos. |
| 1 | **Conexión QA** | Fase 1 | Ecomm (bloqueante) + Seller (en paralelo) | Ecomm da de alta al seller con su cuenta VTEX (sobre **QA** si tiene una) y su propia política comercial. **En paralelo**, sin bloquear, el seller tramita la suya con su agencia — la necesita recién para la tarea 1.2, no para esta conexión. |
| 2 | **Catálogo** | Fase 2 | Seller + Ecomm | Mapeo de marcas, categorías, talles, especificaciones. |
| 3 | **Precio, Stock y Pagos** | Fase 3 | Seller + Ecomm | Fuente de precio/stock, condición comercial, medios de pago. |
| 4 | **Envíos** | Fase 4 (parte seller) | Seller | Costos, plazos, destinos excluidos. |
| 5 | **Devoluciones** | Fase 8 | Seller + Agente PIM | Logística inversa y condiciones de devolución. |
| 6 | **Configuración en PIM** | Fase 5 | Agente PIM | Tienda + depósito + asociación VTEX↔PIM. **Puede correr en paralelo a los pasos 2-5**, pero **bloquea** el paso 7 (sin esto el pedido no ingresa bien a PIM). |
| 7 | **Validación en QA** | — | Seller + Ecomm | Flujo completo end-to-end: catálogo → aprobación → pedido → despacho → devolución, sobre el ambiente de prueba. |
| 8 | **Conexión y réplica en Producción** | Fase 1 (repetida) | Seller + Ecomm | Se repite la configuración ya validada en QA, ahora sobre la cuenta de producción. |
| 9 | **Prueba piloto en Producción** | — | Seller + Ecomm | Validar con un set acotado de productos antes de abrir todo el catálogo. |
| 10 | **Go Live** | Fase 2 (2.11) | — | El seller queda **"Activo"**; el catálogo es visible en el sitio (regla: solo con precio y stock). |

> **Por qué el paso 6 no estaba en la redacción original:** es fácil de omitir porque no
> tiene tarea del lado del **Seller** — pero es la única precondición **dura** documentada
> (Fase 5) para que un pedido funcione. Conviene arrancarlo en paralelo a 2-5, no dejarlo
> para el final.
>
> **Por qué hay dos "pruebas" (7 y 9) y no una sola:** son ambientes y objetivos distintos —
> la 7 valida que el flujo *funciona* (QA); la 9 valida que el flujo funciona *con datos
> reales de producción*, acotado, antes de exponer todo el catálogo.
>
> **Este roadmap no va en el mail de kickoff completo** (ver
> `plantilla-mail-kickoff-integracion.md`) — mandar los 11 pasos de entrada genera la misma
> sobrecarga que ya evitamos separando tareas de reglas. El mail linkea a la guía; la hoja de
> ruta completa vive ahí.

---

## Fase 1 — Conexión / Política comercial

### 1.0 · Conexión entre VTEX (alta del seller)

La conexión la **inicia Luquin** desde su VTEX. El alta del seller VTEX↔VTEX se hace en
**Marketplace › Sellers › Gestión › botón "+ Agregar seller"**.

> Existe además un módulo **"Invitación de sellers"** en el mismo menú — es **distinto** del
> alta directa. Falta confirmar cuándo se usa uno u otro (ver "A completar" abajo).

**Dos vistas de la misma UI** (confirmado con capturas reales de una cuenta de prueba
`sportingioqa`): la **creación** ("+ Agregar seller") es **un formulario largo, de una sola
página**, con las secciones en este orden: Tipo de integración → Integración → Información
básica → Acuerdos comerciales → Comisiones → Información adicional (opcional). La
**edición** de un seller ya creado reorganiza los mismos campos en **4 pestañas**: Datos del
seller, Acuerdos comerciales, Integración, Información operativa (esta última **no existe en
la creación** — se completa después, editando).

**Campos obligatorios para crear el seller** (los únicos con `*`): *Cuenta de seller VTEX*,
*Nombre del seller*, *ID de seller*, **Políticas comerciales del marketplace**, *Comisión de
productos*, *Comisión de envío*. Todo lo demás (ID de afiliado, MOI, grupo, email, registro,
descripción) es opcional al crear.

> ⚠️ **Corrección importante — hay DOS "política comercial" distintas, no una:**
> 1. **La de Ecomm** (campo **"Políticas comerciales del marketplace"**, obligatorio) — vive
>    en el **VTEX de Sporting**, la crea **Ecomm** y es **nueva por cada seller** (confirmado:
>    no se reutiliza una existente entre varios sellers). Se crea **antes** de llegar a este
>    formulario, porque el selector la necesita ya existente para poder elegirla.
> 2. **La del Seller** (Fase 1.1 más abajo) — vive en **su propio VTEX**, la pide él a su
>    agencia, y sirve para que **él mismo** marque qué productos manda al Marketplace.
>
> **Son objetos distintos y desacoplados.** La del Seller **no aparece en ningún campo de
> este formulario** y **no bloquea** la creación del seller ni la conexión VTEX↔VTEX — Ecomm
> puede completar el alta con solo la cuenta VTEX del seller y su propia política ya creada.
> La del Seller recién hace falta en el paso **1.2** (asignarla a productos), para que esos
> productos empiecen a viajar a la bandeja de aprobación. **Puede pedirse en paralelo, sin
> bloquear nada del lado de Ecomm.**

Dentro de **Acuerdos comerciales** además: **Comisión de productos\*** y **Comisión de
envío\*** (%), con opción de comisiones por categoría; y **Participación en carritos con
GiftCards** — checkbox, **desactivado por defecto**. Confirma la regla de la Fase 3 (no
GiftCards para productos seller) — pero es un **toggle configurable por seller**, no un
límite duro del sistema.

Dentro de **Integración** — datos técnicos que arman la URL de fulfillment:
- **Cuenta de seller VTEX\*** — account name del VTEX del seller.
- **ID de afiliado** — código corto (ejemplo real visto: `SPG`, en una cuenta de prueba de
  la propia Sporting). ⚠️ Sigue sin confirmar si sigue una convención fija o varía por seller
  (ver "A completar" — el ejemplo anterior de Customer PO usaba `LQN`, distinto de `SPG`;
  falta verificar cuál es la convención real en producción).
- **Política comercial** — acá es un **ID numérico** (ejemplo real: `4`) que identifica cuál
  política de Ecomm (la del punto 1 de arriba) usar en la URL de fulfillment. **Mismo campo
  conceptual** que "Políticas comerciales del marketplace" de Acuerdos comerciales, mostrado
  distinto (selector vs. ID) según la pantalla.
- Toggle **"Inventario omnicanal (MOI) de varios niveles"** — visto en la UI, **sin
  documentar todavía** qué implica activarlo (ver "A completar").
- Estos 3 datos arman automáticamente la **URL de fulfillment**:
  `.../api/fulfillment?an={cuenta}&affiliateId={ID de afiliado}&sc={política comercial}`.

**Información operativa** (solo en edición, no en la creación) — 3 campos de texto libre
asociados al seller **dentro de VTEX**: *Política de envío*, *Cambios y devoluciones*,
*Política de privacidad y seguridad*. Es la ubicación nativa para cargar lo que ya
documentamos como reglas en la Fase 4 (4.6-4.8) y la Fase 8 (condiciones de devolución) — en
vez de redactarlo solo aparte, en los T&C del sitio.

**Pausar el seller después de registrarlo** — checkbox (por defecto **activado**): el seller
queda en status **"En pausa"** hasta terminar de configurarlo; se pasa a **"Activo"** cuando
está listo.

> **Ambiente de prueba (QA) antes de ir a producción:** preguntarle al seller si tiene una
> cuenta **VTEX de QA** propia, para conectar **QA↔QA** y probar el flujo completo sin tocar
> producción. Si no tiene, se hace la integración de prueba directamente sobre su cuenta de
> **producción** (menos ideal — evaluar el riesgo caso por caso). **Se recomienda priorizar
> siempre QA↔QA cuando sea posible.**

> **Contacto de integración:** Gabriel Luna — `gabriel.luna@luquin.com.ar`. Es un contacto
> **distinto** del operativo de la Fase 7b (`sellers-soporte@sporting.com.ar`), que es para
> incidencias de pedidos ya en marcha, no para arrancar una integración.

> **Kickoff:** el primer contacto con el seller lo hace Gabriel por mail, con el **link de
> acceso al portal + usuario y contraseña** ya creados (cuenta tipo Seller, ver
> `Users.gs`/`configuracion.html`). El mail le indica **ingresar y cambiar la contraseña**
> por una propia. El seller entra con esas credenciales y desde ahí puede consultar la guía
> (`public/integracion/integracion-seller.html`). Template reutilizable:
> [`docs/plantilla-mail-kickoff-integracion.md`](./plantilla-mail-kickoff-integracion.md).

> ⚠️ **A completar más adelante** *(no bloqueante — el alta ya está documentada):*
> - El proceso completo de la **"invitación"**: si además del alta hay un paso de
>   invitación/aceptación del lado del seller, y cómo se relaciona el módulo **"Invitación de
>   sellers"** con **"Agregar seller"**.
> - Qué **credenciales/permisos** se intercambian para que la integración por API quede activa.
> - **Semántica del ID de afiliado**: ¿sigue una convención fija (ej. siempre identifica a
>   Luquin/Sporting) o se define libremente por seller? El ejemplo de prueba (`SPG`) no
>   coincide con el ejemplo de Customer PO documentado en Fase 5 (`LQN`) — confirmar cuál es
>   la convención real en un seller de producción.
> - **Toggle "Inventario omnicanal (MOI) de varios niveles"**: qué hace y cuándo conviene
>   activarlo.

### Política comercial

La política comercial es lo que permite **diferenciar los productos** dentro del sitio.
**Cada parte crea la suya, en su propio VTEX** — son dos objetos independientes (ver el
recuadro de arriba): la de **Ecomm** habilita el alta del seller en el VTEX de Sporting; la
del **Seller** es lo que él usa, en su propio VTEX, para marcar qué productos manda al
Marketplace. **No hace falta esperar una para tramitar la otra.**

**Ventajas de una política comercial diferenciada:**
1. **Catálogo** — optimiza la disponibilidad de productos estableciendo restricciones.
2. **Promociones** — define con claridad qué productos participan, vinculándolas a políticas específicas.
3. **Pagos** — ajusta condiciones de pago según la política comercial.

Cuando el seller asigna **su propia** política comercial a un producto (en su VTEX), ese
producto **viaja al VTEX del Marketplace** y cae en una **bandeja de aprobación**. Esto es
independiente de que Ecomm ya haya completado el alta del seller.

#### Tareas — Fase 1

| # | Ítem | Descripción | Tarea Seller | Tarea Ecomm | Estado |
|---|---|---|---|---|---|
| 1.0 | Alta del seller | Ecomm crea el seller en **Gestión › Agregar seller** (tipo *Seller VTEX*). **No depende** de que el seller ya tenga su política comercial (ver 1.1) — solo de su cuenta VTEX y de la política de Ecomm (ya creada). | Compartir su **cuenta de seller VTEX** y, si tiene, su **cuenta de QA** (para probar QA↔QA antes de ir a producción). | Crear **su propia** política comercial para este seller (prerrequisito); completar el formulario de alta; decidir QA vs. producción; activar cuando esté listo. | ⚠️ parcial |
| 1.1 | Solicitar política comercial | **Cada parte crea la suya, en su propio VTEX** — son independientes entre sí y de la tarea 1.0 (ver recuadro arriba). No bloquea ni es bloqueada por el alta. | Solicitar una nueva política comercial a su agencia (para poder hacer la tarea 1.2 más adelante). | Crear su propia política comercial (nueva, específica de este seller) — es un prerrequisito de la tarea 1.0, no de la 1.1 del seller. | ✅ |
| 1.2 | Asignar política a productos | Marca qué productos se envían al Marketplace. | Asignar la política comercial a cada producto (uno a uno o masivo). | — | ✅ |
| 1.3 | Configurar sobre la política | Todo se configura sobre esa política. | — | Los productos aprobados se crean con esa política; todas las configuraciones se hacen sobre ella. | ✅ |

#### Reglas / Decisiones — Fase 1

- **Costo:** la política comercial cuesta **USD 40**. Cada parte se hace cargo de la suya.
- **No bloqueante:** la política comercial del seller **no es un requisito para el alta** ni
  para la conexión VTEX↔VTEX (Ecomm puede completarla con solo la cuenta VTEX del seller y
  su propia política, ya creada). Es necesaria recién para la tarea 1.2 (que el seller
  empiece a mandar productos) — pedirla puede correr en paralelo, sin frenar nada.
- La asignación de la política comercial **del seller** a un producto es el mecanismo de
  **envío de productos** al Marketplace: al asignarla, el producto llega a la bandeja de
  aprobación del VTEX del Marketplace.

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
| 2.9 | Aprobación de productos | Al asignar la política, el producto viaja al Marketplace y un agente lo revisa. | Asignar política comercial a los productos a vender. | Revisar y aprobar los productos en la bandeja. | ✅ |
| 2.10 | Rechazo de productos | El agente puede rechazar y dejar motivo; el seller corrige y reenvía. | Revisar bandeja de rechazados y corregir según el motivo. | Rechazar dejando un motivo claro. | 🧪 QA |
| 2.11 | Productos aprobados | Aprobado + con precio y stock → visible en el sitio del Marketplace. | ⚠️ definir | ⚠️ definir | ⚠️ falta |

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

> **Reagrupación respecto de la redacción original:** "Políticas de precios", "Cupones de
> descuento" y "GiftCards" venían sueltas cerca de la zona de Front, pero son reglas de
> **precio/pago** → las traje a la Fase 3. En Front (Fase 4) queda solo el renderizado
> (filtrado, cucarda, grilla, carrito compartido, PDP).

---

## Fase 4 — Front

Todo lo que **ve el cliente** en el sitio. La mayoría son tareas de **Ecomm**, con dos
dependencias externas: **Diseño** (grillas) e **Infracommerce** (ajustes de checkout vía
ticket). El seller casi no interviene, salvo en la configuración de envíos.

> **Dependencia clave (una config alimenta tres features):** el **valor de especificación
> "Seller"** que se crea en el filtrado (4.1) es el mismo dato que habilita la **cucarda**
> (4.2) y la **leyenda de PDP/checkout** (4.5). Se configura una vez.

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

## Fase 5 — Pedido

Cuando el cliente compra, el pedido se genera y viaja solo entre VTEX y PIM. Por eso esta
fase tiene **poco de tarea y mucho de comportamiento automático**. Las **únicas tareas**
son 3, todas del **Agente PIM**, y son **setup previo al go-live**.

> **Nuevo bloque: "Flujo automático".** A diferencia de las fases anteriores, acá separo lo
> que el sistema hace solo (no se le asigna a nadie) de las tareas reales. Este patrón se
> repite en las Fases 6-8.

#### Flujo automático (comportamiento del sistema — sin dueño)

- **Customer PO** — el número que le llega al seller es el **ID de afiliado (3 consonantes)
  + el número del Marketplace**. Ej.: `1385074194464-01` (Marketplace) → `LQN-1385074194464-01`
  (Seller). El ID de afiliado se define en el **alta del seller** (Fase 1.0).
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

#### Reglas / Decisiones — Fase 5

- **Mail del cliente:** solo visible en el VTEX del **Marketplace**; **enmascarado** para el
  Seller. El correo enmascarado **sigue siendo funcional** (si el seller le escribe, le llega
  al cliente) y tiene **vigencia de 60 días**.
- **Valores del pedido:** el **Marketplace** puede ajustar el valor final; el **Seller no**.
  *(Función que no se usaría.)*
- **Baja de pedidos:** los pedidos de seller en estado **Activo no pueden darse de baja
  desde PIM** — la función está deshabilitada a propósito para prevenir errores humanos. Las
  **cancelaciones solo las hace el Seller desde su VTEX** (ver Fase 6).

---

## Fase 6 — Cancelaciones (iniciadas por el seller)

Cancelación de un pedido por parte del **seller**, siempre por **falta de stock**. Es un
flujo mayormente **automático** de VTEX (estados + reembolsos + mails); el único punto
humano real es la **decisión del Marketplace en la ventana de 24 h**.

> **Ojo — hay otra cancelación en otra fase:** la iniciada por el **cliente**
> (arrepentimiento de compra) **no** está acá; se maneja en "Pedidos no entregados"
> (Fase 7), porque puede requerir rechazo de entrega o devolución. Esta Fase 6 es **solo**
> la cancelación iniciada por el **seller** por stock.

#### Flujo automático (estados VTEX)

1. El **seller cancela** el pedido desde su VTEX (por falta de stock).
2. El pedido pasa a estado **"Esperando Cambio de Seller"** en VTEX.
3. El **Marketplace** tiene **24 h** para actuar (ver responsabilidades abajo).
4. Al pasar a estado **"Cancelado"**: se envía **automáticamente** el correo de cancelación
   al cliente y se realiza el **reembolso automático**.

#### Responsabilidades operativas (runtime — no es setup de onboarding)

| Actor | Acción |
|---|---|
| **Seller** | Cancelar el pedido desde su VTEX cuando no tiene stock (sin notificación previa). |
| **Marketplace — Ecomm / Operaciones** | Dentro de las 24 h, elegir una de **tres** opciones: (a) seleccionar un **nuevo seller**; (b) **no hacer nada** → se cancela automáticamente a las 24 h; (c) **cancelar de inmediato**. |
| *Sistema (VTEX)* | Reembolso automático y correo de cancelación al cliente al pasar a "Cancelado". |

#### Reglas / Decisiones — Fase 6

- **Sin cancelaciones parciales:** si falta un producto, se cancela el **pedido completo**.
- **Sin notificación previa:** el seller cancela directamente desde su VTEX.
- **Motivo único:** las cancelaciones del seller son **siempre por stock**.
- **SLA seller:** plazo máximo para cancelar un pedido: **5 días**.
- **SLA Marketplace:** **24 h** para seleccionar un nuevo seller antes de la cancelación
  automática.
- **Reembolso y aviso:** siempre **automáticos** al pasar a "Cancelado".

---

## Fase 7a — Fulfillment (camino feliz)

Desde que el seller recibe el pedido hasta que se entrega sin incidentes. Predominan
**responsabilidades operativas** del seller y **automatismos** VTEX↔PIM; las pocas tareas
de setup dependen de una **decisión bifurcante**.

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

- **Facturación:** el **seller factura**; el **envío de la factura al cliente es
  responsabilidad del Marketplace** (automático por mail al detectar estado facturado).
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
acciones a la vez.

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

## Registro de agujeros (TODO) — Fases 1 a 8

| Ítem | Qué falta | Bloqueante |
|---|---|---|
| 1.0-a | Completar el flujo de **"invitación"**: relación entre el módulo "Invitación de sellers" y "Agregar seller", y si hay aceptación del lado del seller. | No (el alta ya está documentada) |
| 1.0-b | Confirmar la **convención real del "ID de afiliado"** en un seller de producción (el ejemplo de prueba usó `SPG`, distinto del `LQN` documentado en Fase 5) y qué credenciales/permisos activan la integración por API. | No |
| 1.0-c | Documentar qué hace el toggle **"Inventario omnicanal (MOI) de varios niveles"** y cuándo conviene activarlo. | No |
| 2.8 | Confirmar alcance de la automatización de orden de imágenes en VCC. | No |
| 2.10 | **Lista de motivos de rechazo** (referida en la redacción como "[Hacer lista]"). | No |
| 2.10 | Probar flujo de rechazo/reenvío en QA. | No |
| 2.11 | Definir tareas de "productos aprobados" (hoy vacías para ambos roles). | No |
| Imágenes | Decidir con el seller qué se hace con fondos grises. | No |
| 4.2 | Confirmar el texto exacto de la cucarda ("Tienda xxx" es placeholder). | No |
| 4.4 / 4.5 | Evaluar unificar los dos tickets a Infracommerce en uno solo. | No |
| 7a.3 | Definir la **integración** para recibir la `invoiceUrl` cuando el seller no carga la factura en su VTEX. | No (solo si el seller no factura por VTEX) |
| 7b.1 | Confirmar el **árbol de arrepentimiento** definitivo: la redacción lo describe distinto en dos partes ("Pedido retenido / Rechazo" vs "Posibilidad / Imposibilidad"). | No |
| 7b.2 | La redacción tiene **"Adidas" hardcodeado** como ejemplo de seller — generalizar a "el seller". | No |
| 7b | Definir **quién en CS Luquin** ejecuta el reembolso manual y con qué herramienta. | No |
| 8.4 | Confirmar si los **estados logísticos de inversa** comparten catálogo con los de forward (7a) o son un set separado. | No |
| 8 | Confirmar la diferencia operativa entre **Devolución (60 d)** y **Devolución por Garantía (180 d)** más allá del plazo (garantía no pide motivo). | No |

---

## Estado del documento

✅ **Las 8 fases están cargadas** (1 a 6, 7a, 7b, 8). El esqueleto está completo; lo que
resta es cerrar los ítems del **Registro de agujeros** y, después, generar las vistas
(interna azul + seller verde) desde esta fuente.

**Reclasificaciones respecto de la redacción original** (por si buscás algo donde no está):
- **Cupones, giftcards y políticas de precios** → Fase 3 (son reglas de precio/pago, no de front).
- **Cancelación por arrepentimiento del cliente** → Fase 7b (la Fase 6 es solo la cancelación iniciada por el seller por stock).

**Decisiones bifurcantes** que cambian qué tareas aplican por seller:
- Logística **directa** — seller vs. Marketplace (Fase 7a).
- Logística **inversa** — seller vs. Marketplace (Fase 8).
- Config. de **pagos** — depende del acuerdo comercial (precondición, Fase 3).

---

## Plazos y SLAs (consolidado)

Estaban dispersos por todo el proceso; acá juntos porque los sellers los piden así.

| Plazo | Aplica a | Quién debe cumplirlo | Fase |
|---|---|---|---|
| **24 h** | Elegir un nuevo seller ante cancelación por stock, antes de la cancelación automática | Marketplace | 6 |
| **5 días** | Cancelar un pedido por falta de stock | Seller | 6 |
| **4-5 días** | Responder al carrier ante dirección incorrecta, antes de que el producto vuelva al CD | Seller | 7b |
| **30 días** | Solicitar la cancelación por arrepentimiento | Cliente | 7b |
| **60 días** | Vigencia del mail enmascarado del cliente | *(sistema)* | 5 |
| **60 días** | Iniciar una **Devolución** en el portal | Cliente | 8 |
| **180 días** | Vigencia del portal / **Devolución por Garantía** | Cliente | 8 |
