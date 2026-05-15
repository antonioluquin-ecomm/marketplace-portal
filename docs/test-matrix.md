# Matriz de Validacion

Esta matriz define controles minimos por pagina antes de migrar, publicar o retirar una version anterior.

| Pagina / archivo | Carga | Links | Responsive | Datos externos | Formularios | Simuladores | Dependencias | Riesgo |
|---|---|---|---|---|---|---|---|---|
| `sporting-marketplace_hub_v29.html` | Requerido | Requerido | Requerido | No critico | No aplica | No aplica | Rutas internas | Medio |
| `backlog-sellers_v27.html` | Requerido | Requerido | Requerido | Requerido | No aplica | No aplica | Google Sheets, logos | Alto |
| `gestion-sellers_v7.html` | Requerido | Requerido | Requerido | Requerido | Requerido | No aplica | Apps Script, Google Sheets, config | Alto |
| `gantt-operativo_v18.html` | Requerido | Requerido | Requerido | Requerido | No aplica | No aplica | Google Sheets | Alto |
| `gantt-seller-center_v2.html` | Requerido | Requerido | Requerido | Requerido | No aplica | No aplica | Google Sheets | Medio |
| `seller-center_v2.html` | Requerido | Requerido | Requerido | Requerido | No aplica | No aplica | Google Sheets | Medio |
| `maqueta-seller-center_v2.html` | Requerido | Requerido | Requerido | No critico | No aplica | No aplica | UI estatica | Medio |
| `proyecto-marketplace_v3.html` | Requerido | Requerido | Requerido | No critico | No aplica | No aplica | Rutas internas | Bajo |
| `proceso-onboarding_v4.html` | Requerido | Requerido | Requerido | No critico | No aplica | No aplica | Rutas internas/publicas | Medio |
| `modelo-integracion_v5.html` | Requerido | Requerido | Requerido | No critico | No aplica | No aplica | Rutas internas | Bajo |
| `modelo-economico_v2.html` | Requerido | Requerido | Requerido | No critico | No aplica | No aplica | Rutas internas | Bajo |
| `governance_v3.html` | Requerido | Requerido | Requerido | No critico | No aplica | No aplica | Rutas internas | Bajo |
| `formulario-calificacion_v2.html` | Requerido | Requerido | Requerido | Requerido | Requerido | No aplica | Apps Script, Google Sheets | Alto |
| `formulario-relevamiento_v2.html` | Requerido | Requerido | Requerido | Requerido | Requerido | No aplica | Apps Script, Google Sheets | Alto |
| `presentacion-seller_v3.html` | Requerido | Requerido | Requerido | Requerido | No aplica | No aplica | Google Sheets, query params | Medio |
| `simulador-seller_v12.html` | Requerido | Requerido | Requerido | Requerido | No aplica | Requerido | Google Sheets, reglas economicas | Alto |
| `simulador-economico_v4.html` | Requerido | Requerido | Requerido | Requerido | No aplica | Requerido | Google Sheets, reglas economicas | Alto |

## Checklist minimo por validacion

Carga:

- La pagina abre localmente.
- No hay errores visibles de render.
- No hay errores criticos en consola.

Links:

- Links principales resuelven.
- Links de retorno al hub funcionan.
- Links publicos no cambian sin estrategia de compatibilidad.

Responsive:

- La pagina es usable en desktop.
- La pagina es usable en mobile.
- No hay solapamientos criticos de texto o controles.

Datos externos:

- CSV carga correctamente.
- Estados de error son visibles.
- La pagina no queda bloqueada ante fallo externo.

Formularios:

- Validaciones requeridas funcionan.
- Query params esperados se conservan.
- Envio a Apps Script responde segun el comportamiento esperado.

Simuladores:

- Inputs principales recalculan.
- Escenarios base coinciden con valores esperados.
- Errores de datos externos no rompen la experiencia completa.

Dependencias:

- Fuentes externas cargan o degradan de forma aceptable.
- Logos y assets resuelven.
- Endpoints siguen vigentes.

