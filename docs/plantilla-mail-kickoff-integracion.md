# Plantilla — Mail de kickoff de integración (VTEX ↔ VTEX)

> Uso: primer contacto con un seller nuevo, una vez que ya existe su cuenta en el
> portal (`Configuración › Usuarios`, tipo **Seller**, con su `seller_id`). Lo envía
> Gabriel Luna. Reemplazar los `{{...}}` y borrar esta nota antes de enviar.
>
> Referencia del proceso completo: [`docs/integracion-vtex-vtex.md`](./integracion-vtex-vtex.md)
> (Fase 1 + Hoja de ruta). El mail **no** enumera los 11 pasos — linkea a la sección
> "Hoja de ruta" de la guía, para no repetir el problema de sobrecargar el primer contacto.

---

**Para:** {{CONTACTO_SELLER}} — {{EMAIL_SELLER}}
**De:** Gabriel Luna — gabriel.luna@luquin.com.ar
**Asunto:** Bienvenida a Sporting Marketplace — acceso a tu portal de integración

Hola {{NOMBRE_CONTACTO}},

Me presento: soy Gabriel, voy a estar a cargo de la integración de **{{NOMBRE_SELLER}}**
a Sporting Marketplace.

Ya te dejamos un acceso al portal de sellers, donde vas a encontrar la guía completa
del proceso (qué necesitamos de tu lado, cómo se opera cada pedido y las reglas del
canal), incluyendo la **hoja de ruta completa** con los pasos de punta a punta:

- **Portal:** https://antonioluquin-ecomm.github.io/marketplace-portal/public/login.html
- **Usuario:** {{USUARIO}}
- **Contraseña provisoria:** {{CONTRASEÑA}}
- **Hoja de ruta:** https://antonioluquin-ecomm.github.io/marketplace-portal/public/integracion/integracion-seller.html#roadmap

Por favor, **ingresá y cambiá la contraseña** por una de tu preferencia apenas
entres (el portal te lo va a pedir desde el menú de tu usuario, arriba a la derecha).

El primer paso de nuestro lado es la **conexión entre ambos VTEX**: necesitamos que
nos compartas la **cuenta de tu seller VTEX** y, si tenés, una **cuenta de QA** —
preferimos siempre probar la integración ahí antes de tocar producción.

En paralelo, sin que eso frene la conexión, te pedimos que solicites a tu agencia la
creación de tu **política comercial** — la vas a necesitar en el siguiente paso, para
indicarnos qué productos querés vender en el Marketplace.

Por último, pasanos quién estaría a cargo de la integración de tu lado, así
coordinamos una **reunión inicial** y arrancamos.

Cualquier duda durante el proceso, quedo a disposición en este mismo mail.

Saludos,
Gabriel Luna
Sporting Marketplace — Ecomm
