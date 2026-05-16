# Matriz de Smoke Test Manual

Esta matriz documenta las pruebas manuales requeridas para validar las rutas migradas del Marketplace Portal antes de avanzar con redirects, limpieza legacy, extraccion de CSS/JS o cambios funcionales.

Alcance de esta etapa:

- Validacion manual y documental.
- Sin cambios de logica funcional.
- Sin submit real en formularios.
- Sin modificaciones en Apps Script, endpoints, payloads, CSS o JavaScript.
- Sin redirects ni limpieza de archivos legacy.

## Matriz de rutas migradas

| Ruta | Tipo | Objetivo de prueba | Validaciones visuales | Validaciones funcionales | Dependencias | Consola | Resultado esperado | Resultado real | Estado | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|
| `/index.html` | Entrada institucional | Confirmar acceso principal y enlaces a rutas nuevas | Hero, bloques interno/publico/documental, aviso de transicion | Links a paginas internas, publicas y docs | Rutas locales | Sin errores JS ni 404 locales | Carga completa y navegacion principal operativa | Pendiente | Pendiente | No reemplaza hub legacy versionado |
| `/internal/backlog/backlog-sellers.html` | Interna operativa | Validar backlog migrado sin alterar datos ni acciones | Cards, tabla, filtros, modal, logos | Carga de sellers, filtros, modal, links a gestion/publicos | CSV sellers, logos, rutas publicas | Revisar fetch, 404, CORS | Backlog carga y links resuelven sin submit | Pendiente | Pendiente | No modificar render, CSV ni rutas dinamicas |
| `/internal/backlog/gestion-sellers.html` | Interna operativa con escritura | Validar carga sin ejecutar submit | Formulario, estados alta/edicion, mensajes | Carga con/sin `seller_id`, config central, validaciones visibles | `../../assets/js/config.js`, Apps Script, CSV sellers | Revisar errores JS, config, fetch | Abre correctamente; submit no ejecutado | Pendiente | Pendiente | Escritura real: probar solo con seller test en etapa futura |
| `/internal/gantt/gantt-operativo.html` | Interna operativa | Validar Gantt operativo migrado | Timeline, tablas, colores, responsive | Carga de datos, filtros o navegacion si aplica | CSV sellers, CSV timeline | Revisar fetch, CORS, 404 | Timeline operativo visible y datos cargados | Pendiente | Pendiente | Preservar dependencias CSV actuales |
| `/internal/gantt/gantt-seller-center.html` | Interna operativa | Validar Gantt Seller Center migrado | Timeline, columnas, responsive | Carga de datos y navegacion local | CSV publicado Seller Center | Revisar fetch, CORS, 404 | Gantt visible y datos cargados | Pendiente | Pendiente | Preservar CSV actual |
| `/internal/seller-center/index.html` | Interna informativa | Validar Seller Center migrado | Layout, cards/secciones, navegacion | Links a maqueta y Gantt Seller Center | Rutas internas, posible doc externo | Revisar 404 | Pagina carga y links principales resuelven | Pendiente | Pendiente | Riesgo conocido: `articulos-seller.docx` faltante |
| `/internal/seller-center/maqueta-seller-center.html` | Interna maqueta | Validar maqueta migrada | Maqueta, layout, responsive | Links locales minimos | Rutas internas | Sin errores JS ni 404 locales | Maqueta carga completa | Pendiente | Pendiente | Sin cambios visuales permitidos |
| `/internal/simuladores/simulador-economico.html` | Interna simulador | Validar simulador economico interno | Inputs, tablas, escenarios, responsive | Recalculo local, carga de tarifas/overrides/sellers | Config, CSV sellers, tarifas, overrides | Revisar fetch, errores JS | Simulador carga y recalcula sin alterar formulas | Pendiente | Pendiente | No modificar formulas ni valores |
| `/internal/estrategia/governance.html` | Interna informativa | Validar pagina de governance | Layout, navegacion, responsive | Links a paginas migradas/no migradas | Rutas internas | Sin errores JS ni 404 locales | Carga y navegacion operativa | Pendiente | Pendiente | Pagina informativa de bajo riesgo |
| `/internal/estrategia/proceso-onboarding.html` | Interna informativa | Validar onboarding | Layout, pasos, links, responsive | Links a formularios/publicos y paginas internas | Rutas internas/publicas | Revisar 404 | Carga y enlaces correctos | Pendiente | Pendiente | Formularios ya migrados a `/public/formularios/` |
| `/internal/estrategia/modelo-integracion.html` | Interna informativa | Validar modelo de integracion | Layout, diagramas/secciones, responsive | Links internos | Rutas internas | Sin errores JS ni 404 locales | Carga completa | Pendiente | Pendiente | No cambiar contenido |
| `/internal/estrategia/modelo-economico.html` | Interna informativa | Validar modelo economico | Layout, tablas/secciones, responsive | Link al simulador economico interno | Rutas internas, simulador interno | Sin errores JS ni 404 locales | Carga y enlaza al simulador migrado | Pendiente | Pendiente | No tocar modelo ni formulas |
| `/internal/estrategia/proyecto-marketplace.html` | Interna informativa | Validar proyecto Marketplace | Layout, roadmap/secciones, responsive | Links a Gantt, backlog y paginas migradas | Rutas internas | Sin errores JS ni 404 locales | Carga y navega a rutas nuevas | Pendiente | Pendiente | Mantener compatibilidad legacy |
| `/public/presentaciones/presentacion-seller.html` | Publica | Validar estado sin `seller_id` | Landing/presentacion, CTAs, logo fallback | Manejo sin seller, links publicos | CSV sellers si aplica | Revisar errores JS/fetch | Carga sin bloquear o muestra estado esperado | Pendiente | Pendiente | No modificar personalizacion |
| `/public/presentaciones/presentacion-seller.html?seller_id=SPT-001` | Publica con seller | Validar personalizacion por seller | Logo, nombre seller, CTAs, responsive | Carga seller, CTA a formulario/simulador | CSV sellers, logos | Revisar fetch, 404 logo | Presentacion personalizada para `SPT-001` | Pendiente | Pendiente | Validar que query param se conserve en CTAs |
| `/public/simuladores/simulador-seller.html` | Publica simulador | Validar simulador sin `seller_id` | UI, inputs, escenarios, CTA | Recalculo basico, manejo sin seller | Config/CSV, tarifas, overrides | Revisar fetch y errores JS | Carga y permite uso base o estado esperado | Pendiente | Pendiente | No modificar formulas |
| `/public/simuladores/simulador-seller.html?seller_id=SPT-001` | Publica simulador con seller | Validar simulador personalizado | Logo, nombre seller, inputs, resultados | Carga seller, tarifas, overrides, CTA | CSV sellers, tarifas, overrides, logos | Revisar fetch, CORS, 404 | Simulador personalizado y calculos operativos | Pendiente | Pendiente | No ejecutar cambios de datos reales |
| `/public/formularios/formulario-calificacion.html` | Publica formulario | Validar bloqueo sin seller | Mensaje/estado sin seller, campos | Bloqueo o validacion por falta de `seller_id` | Apps Script, CSV sellers | Revisar errores JS | No permite submit valido sin seller | Pendiente | Pendiente | No ejecutar submit real |
| `/public/formularios/formulario-calificacion.html?seller_id=SPT-001` | Publica formulario con escritura | Validar carga con seller sin enviar | Logo, datos seller, campos obligatorios | Validaciones visibles, no submit real | Apps Script, CSV sellers, logos | Revisar fetch, CORS, errores JS | Formulario listo; submit no ejecutado | Pendiente | Pendiente | Prueba real solo con seller test aprobado |
| `/public/formularios/formulario-relevamiento.html` | Publica formulario critico | Validar bloqueo sin seller | Mensaje/estado sin seller, secciones | Bloqueo o validacion por falta de `seller_id` | Apps Script, CSV sellers | Revisar `pctSec`, errores JS | No permite submit valido sin seller | Pendiente | Pendiente | Riesgo `pctSec` puede aparecer al interactuar |
| `/public/formularios/formulario-relevamiento.html?seller_id=SPT-001` | Publica formulario critico con escritura | Validar carga completa sin enviar | Logo, secciones, condicionales, progreso | Campos obligatorios, condicionales, validaciones; no submit real | Apps Script, CSV sellers, logos | Revisar `pctSec`, fetch, CORS | Formulario carga y valida sin enviar datos | Pendiente | Pendiente | No corregir `pctSec` dentro de esta etapa |

## Checklist de navegacion

- Validar links desde `/index.html` hacia todas las rutas migradas.
- Validar links internos entre paginas de `internal/estrategia/`.
- Validar links desde Seller Center hacia maqueta y Gantt Seller Center.
- Validar links desde Gantt Operativo hacia Backlog si existen.
- Validar links desde Backlog hacia Gestion de Sellers.
- Validar CTAs desde Backlog hacia Presentacion Seller, Simulador Seller, Formulario de Calificacion y Formulario de Relevamiento.
- Validar rutas publicas con `seller_id=SPT-001`.
- Validar rutas publicas sin `seller_id` y confirmar comportamiento esperado.
- Confirmar que los links hacia legacy siguen funcionando mientras no existan redirects.

## Checklist de datos

- Confirmar carga de CSV de sellers.
- Confirmar carga de seller `SPT-001` en paginas publicas con query param.
- Confirmar resolucion de logos asociados al seller.
- Confirmar carga de tarifas en simuladores.
- Confirmar carga de overrides en simuladores.
- Confirmar carga de timelines en Gantt Operativo.
- Confirmar carga de datos de Gantt Seller Center.
- Confirmar que fallos de datos externos no dejan la pagina inutilizable sin mensaje.

## Checklist de formularios

- Validar bloqueo o estado esperado sin `seller_id`.
- Validar carga con `seller_id=SPT-001`.
- Validar presencia de campos obligatorios.
- Validar mensajes de validacion sin enviar datos.
- No ejecutar submit real durante esta etapa.
- Documentar una prueba futura con seller de test antes de habilitar uso operativo de la ruta migrada.
- Confirmar que Apps Script, endpoints, payloads y `tipo_formulario` no fueron modificados.

## Checklist de consola

- Revisar errores JavaScript.
- Revisar recursos 404.
- Revisar errores CORS.
- Revisar fetch fallidos.
- Revisar errores de CSV o Google Sheets.
- Revisar errores de logos faltantes.
- En Formulario de Relevamiento, observar especificamente el posible error `pctSec` dentro de `updateProgress`.

## Riesgos conocidos

- Posible referencia a `pctSec` antes de declaracion en `public/formularios/formulario-relevamiento.html`.
- Referencia heredada a `articulos-seller.docx` no presente en `internal/seller-center/index.html`.
- Formularios publicos y Gestion de Sellers escriben datos reales via Apps Script.
- Archivos legacy en raiz siguen duplicados respecto de rutas nuevas.
- CSS y JavaScript siguen inline o embebidos.
- Redirects desde archivos versionados de raiz todavia no fueron implementados.
- Dependencias externas de Google Sheets, Apps Script y logos pueden fallar por permisos, CORS o disponibilidad.

## Registro de ejecucion

Usar esta seccion para anotar resultados reales despues de ejecutar el smoke test manual.

| Fecha | Responsable | Rutas probadas | Resultado general | Incidencias | Proxima accion |
|---|---|---|---|---|---|
| Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |

---

## Etapa 6C: checklist de validacion del piloto tokens.css

**Pagina piloto:** `internal/estrategia/proceso-onboarding.html`
**URL produccion:** `https://antonioluquin-ecomm.github.io/marketplace-portal/internal/estrategia/proceso-onboarding.html`
**Estado:** ✅ APROBADO — smoke test ejecutado el 2026-05-16

### Etapa 6D: resultado del smoke test

**Fecha de ejecucion:** 2026-05-16
**Entorno:** local — `http://localhost:8080/internal/estrategia/proceso-onboarding.html`
**Ejecutado por:** Gabriel Luna
**Resultado general:** OK

### Checklist de carga

| # | Verificacion | Metodo | Resultado |
|---|---|---|---|
| 1 | Pagina carga sin error 404 en `tokens.css` | DevTools → Network | ✅ OK |
| 2 | `tokens.css` devuelve HTTP 200 | DevTools → Network | ✅ OK |
| 3 | Apariencia visual identica a la version anterior | Comparacion visual | ✅ OK |
| 4 | Topbar verde visible con altura correcta | Visual | ✅ OK |
| 5 | Sidebar izquierdo renderiza correctamente | Visual | ✅ OK |
| 6 | Tipografia Barlow carga desde Google Fonts | DevTools → Network | ✅ OK |
| 7 | KPIs (numeros verde/info/warn/teal) muestran colores correctos | Visual | ✅ OK |
| 8 | Cards y paneles muestran fondo oscuro correcto | Visual | ✅ OK |
| 9 | No hay errores en consola del navegador | DevTools → Console | ✅ OK |
| 10 | Responsive: layout colapsado en 768px funciona | DevTools → Responsive | No ejecutado — no critico para aprobacion |

### Verificacion de coexistencia de tokens

Desde DevTools → Elements → Computed Styles en cualquier elemento que use `var(--g)`:

| Token externo (tokens.css) | Token legacy inline | Conflicto esperado |
|---|---|---|
| `--g: #5ea832` | `--g: #5ea832` | Ninguno (mismo valor) |
| `--bg: #0b0f0b` | `--k: #0b0f0b` | Ninguno (nombres distintos) |
| `--text: #edf3e9` | `--t1: #edf3e9` | Ninguno (nombres distintos) |
| `--warn: #f59e0b` | `--warn: #ffb74d` | ⚠️ Mismo nombre, valor distinto — tokens.css define #f59e0b (canonico), inline define #ffb74d (legacy) |
| `--info: #60a5fa` | `--info: #64b5f6` | ⚠️ Mismo nombre, valor distinto — tokens.css define #60a5fa (canonico), inline define #64b5f6 (legacy) |
| `--teal: #2dd4bf` | `--teal: #4db6ac` | ⚠️ Mismo nombre, valor distinto — tokens.css define #2dd4bf (canonico), inline define #4db6ac (legacy) |
| `--danger: #f87171` | `--danger: #d94040` | ⚠️ Mismo nombre, valor distinto — tokens.css define #f87171 (canonico), inline define #d94040 (legacy) |

> Nota: para `--warn`, `--info`, `--teal` y `--danger`, el `:root` inline sobreescribe al externo porque el `<style>` se procesa despues que el `<link>`. El resultado visual sera el color LEGACY hasta que el inline sea eliminado en una etapa futura. Esto es esperado y no es un error.

### Criterio de aprobacion del piloto

- Sin error 404 en `tokens.css`
- Sin errores de consola
- Sin regresion visual respecto del estado anterior
- Confirmacion de que la pagina sigue siendo 100% informativa (sin formularios, sin submit)

### Conclusion del piloto 6C/6D

El piloto de `tokens.css` queda **aprobado**. La carga del archivo CSS externo no introduce errores ni regresion visual. El `:root` inline sigue funcionando correctamente como fuente de variables legacy durante la transicion.

Riesgos conocidos y pendientes:

- Las 4 variables con nombre compartido entre `tokens.css` e inline (`--warn`, `--info`, `--teal`, `--danger`) mantienen el valor LEGACY hasta que el inline sea eliminado en una etapa futura — comportamiento esperado, no es error.
- El checklist responsive (item 10) no fue ejecutado — se puede validar en etapas posteriores junto con el resto del grupo `estrategia/`.
- El smoke test fue ejecutado en entorno local. Pendiente validacion en produccion despues del proximo push/deploy.

### Proxima accion: Etapa 6E

Piloto aprobado. Etapa 6E: extender `tokens.css` a las otras 4 paginas reales del grupo `internal/estrategia/`:
- `governance.html`
- `modelo-integracion.html`
- `modelo-economico.html`
- `proyecto-marketplace.html`

Nota: la lista anterior mencionaba paginas inexistentes (bandeja-seller, calificacion-seller, contacto-seller, presentacion-interna). Corregida en esta entrada.

---

## Etapa 6E: extension de tokens.css al grupo interno/estrategia

**Fecha:** 2026-05-16
**Estado:** ✅ APROBADO — smoke test ejecutado el 2026-05-16

### Etapa 6F: resultado del smoke test

**Fecha de ejecucion:** 2026-05-16
**Entorno:** local — `http://localhost:8080/`
**Ejecutado por:** Gabriel Luna
**Resultado general:** OK

### Paginas actualizadas

| Pagina | Link agregado | :root inline | Ruta usada |
|---|---|---|---|
| `internal/estrategia/governance.html` | ✅ linea 10-11 | ✅ intacto (linea 14) | `../../assets/css/tokens.css` |
| `internal/estrategia/modelo-integracion.html` | ✅ linea 10-11 | ✅ intacto (linea 13) | `../../assets/css/tokens.css` |
| `internal/estrategia/modelo-economico.html` | ✅ linea 10-11 | ✅ intacto (linea 14) | `../../assets/css/tokens.css` |
| `internal/estrategia/proyecto-marketplace.html` | ✅ linea 10-11 | ✅ intacto (linea 13) | `../../assets/css/tokens.css` |

Patron aplicado en todas:
```html
<!-- 6E: tokens CSS externos. El :root inline permanece como fallback. -->
<link rel="stylesheet" href="../../assets/css/tokens.css">
```

### Checklist de smoke test 6E

| # | Verificacion | Metodo | Resultado |
|---|---|---|---|
| 1 | `governance.html` carga sin error 404 en `tokens.css` | DevTools → Network | ✅ OK |
| 2 | `modelo-integracion.html` carga sin error 404 en `tokens.css` | DevTools → Network | ✅ OK |
| 3 | `modelo-economico.html` carga sin error 404 en `tokens.css` | DevTools → Network | ✅ OK |
| 4 | `proyecto-marketplace.html` carga sin error 404 en `tokens.css` | DevTools → Network | ✅ OK |
| 5 | Sin errores criticos de consola en las 4 paginas | DevTools → Console | ✅ OK |
| 6 | Sin regresion visual en topbar en las 4 paginas | Visual | ✅ OK |
| 7 | Sin regresion visual en sidebar en las 4 paginas | Visual | ✅ OK |
| 8 | Sin regresion visual en contenido principal | Visual | ✅ OK |

### Conclusion del smoke test 6E/6F

El grupo completo `internal/estrategia/` queda **validado con `tokens.css`**:

| Pagina | Etapa | Smoke test |
|---|---|---|
| `proceso-onboarding.html` | 6C (piloto) | ✅ 6D — OK |
| `governance.html` | 6E | ✅ 6F — OK |
| `modelo-integracion.html` | 6E | ✅ 6F — OK |
| `modelo-economico.html` | 6E | ✅ 6F — OK |
| `proyecto-marketplace.html` | 6E | ✅ 6F — OK |

### Riesgos pendientes tras 6F

- Las variables `--warn`, `--info`, `--teal`, `--danger` tienen el mismo nombre en `tokens.css` y en el `:root` inline pero valores distintos. El inline sobreescribe al externo en las 5 paginas — comportamiento esperado hasta que el inline sea eliminado en etapas futuras.
- `proyecto-marketplace.html` usa nombres de variables propios (`--gd`, `--gb`, `--gb2`, `--b`, `--b2`) en lugar de los canonicos (`--g-dim`, `--g-brd`, `--line`, `--line-soft`). Sin conflicto ahora; a unificar en etapas futuras.
- Smoke test ejecutado en entorno local. Pendiente validacion en produccion (GitHub Pages) despues del proximo push.
