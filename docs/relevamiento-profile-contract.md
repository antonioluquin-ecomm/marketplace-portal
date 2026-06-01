# Contrato Relevamiento Perfil

## Diagnostico

El Formulario de Relevamiento actual funciona como un envio final append-only. Cada submit publica un payload con `tipo_formulario = "relevamiento"` hacia Apps Script y genera una nueva fila en la hoja `relevamientos`.

La logica historica se mantiene intacta:

- `tipo_formulario = "relevamiento"` no cambia en esta etapa.
- La hoja `relevamientos` queda como historico append-only.
- El submit real actual no se modifica.
- No se eliminan ni migran filas existentes sin una etapa futura explicita.

La nueva arquitectura propuesta implementa el relevamiento como perfil editable persistente por seller usando una hoja puente nueva:

- Hoja nueva: `relevamientos_perfil`.
- Clave logica: `seller_id`.
- Una fila principal por seller.
- Guardado parcial y precarga por `seller_id`.
- Sin efectos secundarios de relevamiento completo durante guardados draft.

Estado de implementacion:

- Etapa 1A documento el contrato.
- Etapa 1B implemento backend aislado local para `relevamiento_profile_get` y `relevamiento_profile_save`.
- Sigue pendiente deploy, smoke real controlado, frontend, migracion de historicos y transicion del submit final.

## Contrato backend

### Lectura: `relevamiento_profile_get`

Operacion propuesta:

```txt
GET /exec?action=relevamiento_profile_get&seller_id=SPT-001
```

Parametro futuro opcional:

```txt
token=<token-simple-o-hmac>
```

Respuesta OK con perfil existente:

```json
{
  "ok": true,
  "status": "ok",
  "tipo_formulario": "relevamiento_profile_get",
  "seller_id": "SPT-001",
  "exists": true,
  "profile": {
    "nombre": "Seller Demo",
    "categorias": "Calzado",
    "contacto_email": "contacto@seller.com"
  },
  "metadata": {
    "estado_relevamiento": "Parcial",
    "completitud": "54%",
    "fecha_ultima_actualizacion": "2026-05-22 10:30:00",
    "modo_guardado": "draft"
  }
}
```

Respuesta OK sin perfil:

```json
{
  "ok": true,
  "status": "ok",
  "tipo_formulario": "relevamiento_profile_get",
  "seller_id": "SPT-001",
  "exists": false
}
```

Respuesta error:

```json
{
  "ok": false,
  "status": "error",
  "message": "Falta seller_id"
}
```

### Guardado: `relevamiento_profile_save`

Operacion propuesta:

```txt
POST /exec
```

Payload esperado:

```json
{
  "tipo_formulario": "relevamiento_profile_save",
  "seller_id": "SPT-001",
  "modo_guardado": "draft",
  "payload_version": "relevamiento_profile_v1",
  "fields": {
    "nombre": "Seller Demo",
    "categorias": "Calzado",
    "contacto_email": "contacto@seller.com"
  },
  "clear_fields": [],
  "client_progress": {
    "completitud": 42,
    "secciones_completas": ["1"],
    "secciones_pendientes": ["2", "3", "4", "5", "6", "7", "8", "9"]
  }
}
```

Respuesta OK:

```json
{
  "ok": true,
  "status": "ok",
  "tipo_formulario": "relevamiento_profile_save",
  "seller_id": "SPT-001",
  "accion": "creado",
  "hoja": "relevamientos_perfil",
  "fila": 12,
  "estado_relevamiento": "Parcial",
  "completitud": "42%",
  "fecha_ultima_actualizacion": "2026-05-22 10:30:00"
}
```

Respuesta error:

```json
{
  "ok": false,
  "status": "error",
  "message": "fields debe ser un objeto"
}
```

## Validaciones minimas

- `seller_id` es obligatorio.
- `seller_id` se normaliza con trim y uppercase.
- `seller_id` debe existir en `sellers`, salvo modo interno de migracion aprobado.
- `fields` debe ser un objeto plano.
- `clear_fields`, si existe, debe ser un array.
- `modo_guardado` acepta `draft`, `final` o `migration`; por defecto es `draft`.
- `payload_version` recomendado: `relevamiento_profile_v1`.
- No se aceptan escrituras fuera del allowlist de campos del formulario.
- No se aceptan como campos editables: `fecha_envio`, `fecha_creacion`, `fecha_ultima_actualizacion`, `estado_relevamiento`, `completitud`, `historial_count`, `origen_ultima_fila_historica` ni otros metadatos.

## Campos permitidos

Los campos permitidos son los campos reales del formulario actual que ya son compatibles con `HEADERS_RELEVAMIENTO`, excluyendo metadata historica:

```txt
nombre
razon_social
cuit
web
pais_provincia
tipo_empresa
canal_principal
opera_marketplaces
marketplaces_detalle
categorias
contacto_nombre
contacto_email
contacto_tel
contacto_cargo
contacto_comercial_nombre
contacto_comercial_email
contacto_tec_nombre
contacto_tec_email
contacto_ops_nombre
contacto_ops_email
contacto_admin_nombre
contacto_admin_email
plataforma
erp
erp_cual
api
api_alcance
metodo_integracion
equipo_tec
recibe_pedidos_ext
informa_estados
informa_tracking
frec_actualizacion
obs_tecnologia
skus_estimados
variantes
gestion_catalogo
catalogo_excel
info_prod_completa
atributos_tecnicos
imagenes
imagenes_variante
tabla_talles
productos_variantes
codigos_sku_ean
productos_en_sporting
restricciones_cat
restricciones_cat_det
obs_catalogo
stock_tipo
stock_exclusivo_mkt
stock_seguridad
stock_minimo_seguridad
frec_stock
gestion_stock
stock_separado
gestion_precios
frec_precios
precios_iva
precios_canal
promos
promos_det
entrega_pais
zonas
localidad_despacho
despacho_origen
operador_logistico
multi_operador_logistico
dias_despacho
tiempo_despacho
cumple_sla_despacho
tracking
impresora
etiquetado_requerido
retiro_tienda
puntos_retiro
stock_retiro_tienda
retiro_ops
obs_logistica
acepta_devol
log_devol
resp_log_inv
deposito_devol
resp_validacion_devol
tiempo_devol
restr_devol
restr_devol_det
nota_credito
condiciones_postventa
emite_factura
factura_auto
tipo_factura
factura_formato
nc_devol
ticket_promedio
gmv_estimado
cuotas
comision_mkt
costo_financiero
restricciones_com
restricciones_com_det
limitaciones_actuales
particularidades
comentarios
```

## Modelo de datos

Hoja propuesta: `relevamientos_perfil`.

Headers recomendados:

```txt
seller_id
fecha_creacion
fecha_ultima_actualizacion
estado_relevamiento
completitud
modo_guardado
payload_version
ultima_accion
actualizado_por
secciones_completas
secciones_pendientes
origen_ultima_fila_historica
historial_count
nombre
razon_social
cuit
web
pais_provincia
tipo_empresa
canal_principal
opera_marketplaces
marketplaces_detalle
categorias
contacto_nombre
contacto_email
contacto_tel
contacto_cargo
contacto_comercial_nombre
contacto_comercial_email
contacto_tec_nombre
contacto_tec_email
contacto_ops_nombre
contacto_ops_email
contacto_admin_nombre
contacto_admin_email
plataforma
erp
erp_cual
api
api_alcance
metodo_integracion
equipo_tec
recibe_pedidos_ext
informa_estados
informa_tracking
frec_actualizacion
obs_tecnologia
skus_estimados
variantes
gestion_catalogo
catalogo_excel
info_prod_completa
atributos_tecnicos
imagenes
imagenes_variante
tabla_talles
productos_variantes
codigos_sku_ean
productos_en_sporting
restricciones_cat
restricciones_cat_det
obs_catalogo
stock_tipo
stock_exclusivo_mkt
stock_seguridad
stock_minimo_seguridad
frec_stock
gestion_stock
stock_separado
gestion_precios
frec_precios
precios_iva
precios_canal
promos
promos_det
entrega_pais
zonas
localidad_despacho
despacho_origen
operador_logistico
multi_operador_logistico
dias_despacho
tiempo_despacho
cumple_sla_despacho
tracking
impresora
etiquetado_requerido
retiro_tienda
puntos_retiro
stock_retiro_tienda
retiro_ops
obs_logistica
acepta_devol
log_devol
resp_log_inv
deposito_devol
resp_validacion_devol
tiempo_devol
restr_devol
restr_devol_det
nota_credito
condiciones_postventa
emite_factura
factura_auto
tipo_factura
factura_formato
nc_devol
ticket_promedio
gmv_estimado
cuotas
comision_mkt
costo_financiero
restricciones_com
restricciones_com_det
limitaciones_actuales
particularidades
comentarios
```

### Metadata

- `seller_id`: clave logica del perfil.
- `fecha_creacion`: fecha de creacion de la fila perfil.
- `fecha_ultima_actualizacion`: fecha del ultimo guardado.
- `estado_relevamiento`: estado calculado o marcado.
- `completitud`: porcentaje oficial persistido.
- `modo_guardado`: `draft`, `final` o `migration`.
- `payload_version`: version de contrato.
- `ultima_accion`: `created`, `updated`, `finalized` o `migrated`.
- `actualizado_por`: `public_form`, `internal`, `migration` u otro origen aprobado.
- `secciones_completas`: lista serializada.
- `secciones_pendientes`: lista serializada.
- `origen_ultima_fila_historica`: fila historica usada como fuente inicial.
- `historial_count`: cantidad de filas historicas detectadas para el seller.

## Reglas funcionales

### Crear perfil

Se crea una fila nueva si no existe `seller_id` en `relevamientos_perfil`.

Reglas:

- Setear `fecha_creacion`.
- Setear `fecha_ultima_actualizacion`.
- Setear `ultima_accion = created`.
- Setear `actualizado_por = public_form` salvo migracion.
- Escribir solo campos permitidos.

### Actualizar perfil

Se actualiza la fila existente si ya existe `seller_id`.

Reglas:

- Preservar `fecha_creacion`.
- Actualizar `fecha_ultima_actualizacion`.
- Setear `ultima_accion = updated`.
- Preservar campos omitidos.
- No tocar columnas fuera del contrato.

### Preservacion de campos omitidos

Un campo omitido en `fields` no significa borrado. El valor existente se conserva.

Esto es obligatorio para:

- guardado parcial;
- precarga progresiva;
- formularios largos;
- cambios de seccion;
- campos condicionales que pueden no estar visibles.

### Tratamiento de campos vacios

Un campo enviado vacio no debe limpiar datos en `draft` salvo que el nombre aparezca explicitamente en `clear_fields`.

Reglas:

- `draft` + campo omitido: preservar.
- `draft` + campo vacio sin `clear_fields`: preservar.
- `draft` + campo incluido en `clear_fields`: limpiar.
- `final` + campo vacio enviado: puede limpiar, siempre que el campo sea permitido.
- `migration`: copiar exactamente el valor historico seleccionado.

### Campos condicionales ocultos

Los campos condicionales no deben limpiarse automaticamente por estar ocultos en el frontend durante un draft.

El frontend podra proponer limpieza explicita mediante `clear_fields` cuando el usuario cambie una respuesta padre y se confirme que los dependientes ya no aplican.

Ejemplos:

- `opera_marketplaces` puede afectar `marketplaces_detalle`.
- `erp` puede afectar `erp_cual`.
- `api` puede afectar `api_alcance`.
- `retiro_tienda` puede afectar `puntos_retiro`, `stock_retiro_tienda` y `retiro_ops`.
- `acepta_devol` puede afectar campos de devolucion.

### Completitud y estados

La completitud oficial debe calcularse del lado backend con una regla estable. El frontend puede enviar `client_progress` para UX y diagnostico, pero no debe ser la unica fuente oficial.

Estados propuestos:

- `Incompleto`: completitud menor a 50%.
- `Parcial`: completitud entre 50% y 79%.
- `Completo`: completitud igual o mayor a 80%.
- `En revision`: modo final recibido y listo para analisis interno, o marca interna posterior.

### Efectos secundarios

En `modo_guardado = "draft"` no se debe ejecutar:

- envio de emails;
- sincronizacion automatica de `sellers`;
- generacion o actualizacion de `definicion_tecnica`;
- cambio de estado pipeline;
- append en `relevamientos`.

El submit historico actual se mantiene intacto hasta una etapa futura de transicion.

## Seguridad

La lectura publica por `seller_id` tiene riesgo: cualquier persona con el ID podria consultar datos de relevamiento si el endpoint queda abierto.

Recomendaciones minimas:

- No permitir lectura sin `seller_id`.
- Validar que `seller_id` exista en `sellers`.
- No exponer listados.
- No devolver metadata interna sensible.
- No permitir lectura por filtros amplios.
- Considerar token simple o HMAC en etapa posterior para links nuevos.

Recomendacion futura:

- Generar `token = HMAC(secret, seller_id)`.
- Incluir token en links publicos nuevos.
- Mantener compatibilidad temporal sin token solo para perfiles no sensibles o durante piloto controlado.

## Transicion desde historicos

La hoja `relevamientos` queda como historico append-only.

Inicializacion propuesta para `relevamientos_perfil`:

1. Leer filas historicas de `relevamientos`.
2. Agrupar por `seller_id` normalizado.
3. Elegir ultimo registro valido por seller.
4. Crear una fila perfil por seller.
5. Guardar `origen_ultima_fila_historica`.
6. Guardar `historial_count`.
7. No borrar ni modificar filas historicas.

Criterio para elegir ultimo registro:

- Primero: mayor `fecha_envio` valida.
- Si no hay fecha confiable: ultima fila fisica en la hoja.
- Si hay empate: ultima fila fisica entre las empatadas.

## Plan de implementacion futuro

### 1B Backend aislado

- Agregar `relevamiento_profile_get`.
- Agregar `relevamiento_profile_save`.
- Crear helpers no destructivos para `relevamientos_perfil`.
- Mantener `tipo_formulario = "relevamiento"` intacto.
- No tocar submit real.

### 1C Migrador dry-run

- Auditar duplicados historicos por `seller_id`.
- Simular perfiles iniciales sin escribir.
- Reportar ultimo registro elegido y cantidad historica.
- Requerir aprobacion antes de escribir en Google Sheets.

### 1D Frontend precarga

- Consultar perfil por `seller_id`.
- Poblar campos existentes por `name`.
- Mantener carga de seller/logos desde CSV.
- Recalcular condicionales y progreso.

### 1E Guardado parcial

- Agregar boton separado del submit.
- Enviar `relevamiento_profile_save` con `modo_guardado = "draft"`.
- No resetear formulario.
- No disparar efectos secundarios.

### 1F Transicion submit final

- Evaluar si el submit final sigue usando append historico, upsert de perfil, o ambos.
- Mantener historial append-only hasta cierre de compatibilidad.
- Probar con seller de test antes de habilitar uso productivo.

## Validaciones futuras

- Confirmar headers reales en Google Sheets.
- Confirmar duplicados historicos por `seller_id`.
- Confirmar consumidores actuales de `relevamientos`.
- Validar que draft no envia email.
- Validar que draft no sincroniza `sellers`.
- Validar que draft no actualiza `definicion_tecnica`.
- Validar que submit historico sigue funcionando sin cambios.
- Validar consola del formulario, condicionales y progreso.
- Validar caso `pctSec` en interaccion real.
