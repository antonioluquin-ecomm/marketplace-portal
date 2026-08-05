# Plantilla — Mail de kickoff de integración (Gestión Asistida)

> Uso: primer contacto con un seller nuevo bajo el modelo **Gestión Asistida** (sin
> VTEX propio — el mismo modelo que Taika e Hirostar), una vez que ya existe su
> cuenta en el portal (`Configuración › Usuarios`, tipo **Seller**, con su
> `seller_id`). Lo envía Gabriel Luna. Reemplazar los `{{...}}` y borrar esta nota
> antes de enviar.
>
> Si el acceso al portal ya se lo pasó otra persona del equipo en una conversación
> previa (comercial, por ejemplo), borrar el bloque de credenciales y arrancar
> directo desde "Les paso lo que necesitamos de su lado...".
>
> Referencia del proceso completo:
> [`internal/estrategia/integracion-gestion-asistida.html`](../internal/estrategia/integracion-gestion-asistida.html)
> (playbook operativo, fuente de verdad de este modelo). A diferencia de VTEX↔VTEX,
> acá el seller **no tiene cuenta VTEX ni integra por API** — el Marketplace carga y
> mantiene su catálogo a mano. El lenguaje de esta plantilla evita jerga técnica:
> muchos sellers de este modelo no están al tanto de tecnología, así que cada pedido
> lleva un ejemplo concreto y el "para qué", en vez de dar por sabido el término.

---

**Para:** {{CONTACTO_SELLER}} — {{EMAIL_SELLER}}
**De:** Gabriel Luna — gabriel.luna@luquin.com.ar
**Asunto:** Bienvenida a Sporting Marketplace — acceso a tu portal e inicio de integración

Hola {{NOMBRE_CONTACTO}}, equipo,

Me presento: soy Gabriel, voy a estar a cargo de la integración de **{{NOMBRE_SELLER}}** a Sporting Marketplace.

Ya te dejamos un acceso al portal de sellers, donde vas a encontrar la guía completa del proceso — qué necesitamos de tu lado y cómo se opera cada pedido una vez en marcha:

- **Portal:** https://antonioluquin-ecomm.github.io/marketplace-portal/public/login.html
- **Usuario:** {{USUARIO}}
- **Contraseña provisoria:** {{CONTRASEÑA}}
- **Guía de integración:** https://antonioluquin-ecomm.github.io/marketplace-portal/public/integracion/integracion-seller.html

Por favor, **ingresá y cambiá la contraseña** por una de tu preferencia apenas entres (el portal te lo pide desde el menú de tu usuario, arriba a la derecha).

Según lo definido, de nuestro lado nos encargamos de cargar y mantener el catálogo, y también de la logística de despacho. Para seguir, necesitamos 5 cosas:

**1. Marcas y categorías que venden**
Por ejemplo: "{{NOMBRE_SELLER}} — Paletas, Pelotas, Indumentaria". Con eso las damos de alta en el sitio.

**2. Datos para facturar**
CUIT, razón social, dirección y (si quieren) su logo. Además vamos a necesitar sus **certificados de AFIP** — es lo que nos permite emitir las facturas de sus ventas a nombre de ustedes. Si no saben cómo generarlos, no hay problema: nos dan acceso y lo hacemos nosotros.

**3. Un Excel con sus productos**
Puede ser el que ya usen internamente, no hace falta un formato especial. Si venden en varios colores o talles, que se vea cada variante por separado. Si prefieren, también nos pueden decir dónde ya está esa información — su propio catálogo online, un catálogo de fotos, etc. — y la tomamos de ahí.

**4. Dirección del depósito**
Desde donde va a salir la mercadería, para que el transporte sepa dónde retirar los pedidos.

**5. Insumos para la instalación**
Tengan lista una computadora, impresora, internet y **AnyDesk** instalado, así podemos hacer la instalación de las herramientas de forma remota.

Con esto arrancamos a cargar sus productos y hacer las configuraciones necesarias. En paralelo, coordinamos una reunión corta para mostrarles cómo van a actualizar precio y stock desde el portal y usar las herramientas, y para saber quién queda como contacto para estos temas de su lado.

Cualquier duda, quedo a disposición.

Saludos,
Gabriel Luna
Sporting Marketplace — Ecomm
