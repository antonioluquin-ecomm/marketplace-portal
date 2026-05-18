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

## Etapa 9A: smoke test Hub Operativo

Alcance:

- Validar `internal/hub-operativo.html` como hub operativo interno oficial.
- No ejecutar submits reales.
- No modificar paginas publicas, formularios, simuladores, Backlog, Gestion de Sellers, Apps Script, config ni aliases legacy.

| Ruta | Tipo | Objetivo de prueba | Validaciones visuales | Validaciones funcionales | Dependencias | Consola | Resultado esperado | Resultado real | Estado | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|
| `/internal/hub-operativo.html` | Interna operativa | Confirmar carga del hub operativo oficial | Sidebar, hero, flujo, cards, buscador, mapa de rutas, responsive | Links a rutas internas/publicas, buscador y grid dinamico | Rutas `internal/`, `public/`, `docs/`; sin datos externos obligatorios | Sin errores JS ni 404 locales | Hub operativo carga completo y navega a rutas nuevas | OK | Aprobado | Smoke test manual 9B OK |
| `/index.html` | Entrada institucional | Confirmar acceso al nuevo hub operativo | Boton principal y card interna visibles | Link "Abrir Hub Operativo" apunta a `/internal/hub-operativo.html` | Ruta local nueva | Sin 404 local | Portada institucional abre el hub operativo | OK | Aprobado | `index.html` conserva rol institucional |
| `/sporting-marketplace_hub_v29.html` | Alias legacy | Confirmar redireccion al hub operativo oficial | Mensaje de redireccion solo si el navegador no redirige de inmediato | Meta refresh y JS redirigen a `/internal/hub-operativo.html` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | Smoke test manual 9D OK |
| `/sporting-marketplace_hub_v29.html?test=1#mapa` | Alias legacy con query/hash | Confirmar preservacion de parametros | Mensaje fallback no debe romper layout minimo | `location.search` y `location.hash` se conservan en el destino | Ruta local nueva | Sin 404 ni errores JS | Destino final `/internal/hub-operativo.html?test=1#mapa` | OK | Aprobado | Query/hash preservados |

Checklist especifico 9A:

- Abrir `/internal/hub-operativo.html`.
- Confirmar que no intenta navegar a `sporting-marketplace` como base URL.
- Validar sidebar y anchors internos: `#inicio`, `#flujo`, `#diaria`, `#seller-center`, `#estrategia`, `#seller-recursos`, `#todos`, `#mapa`.
- Validar accesos internos a `./backlog/`, `./gantt/`, `./seller-center/`, `./simuladores/` y `./estrategia/`.
- Validar accesos publicos a `../public/presentaciones/`, `../public/formularios/` y `../public/simuladores/`.
- Usar el buscador y abrir al menos un recurso interno y uno publico desde el grid dinamico.
- Abrir `sporting-marketplace_hub_v29.html` y confirmar redireccion a `internal/hub-operativo.html`.
- Abrir `sporting-marketplace_hub_v29.html?test=1#mapa` y confirmar preservacion de query/hash.
- Resultado 9D: OK, sin 404 criticos y sin tocar formularios, simuladores, Backlog, Gestion, Apps Script, config, endpoints, payloads ni submit.

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

## Etapa 10B: smoke test mejoras Hub Operativo

Alcance:

- Validar mejoras acotadas en `internal/hub-operativo.html`.
- No ejecutar submits reales.
- No probar formularios con escritura real.
- No modificar ni validar cambios funcionales en paginas destino.

| Ruta | Tipo | Objetivo de prueba | Validaciones visuales | Validaciones funcionales | Dependencias | Consola | Resultado esperado | Resultado real | Estado | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|
| `/internal/hub-operativo.html` | Interna operativa | Validar mejoras 10B | Topbar, link Volver al Portal, aviso seller_id, mapa clickeable, estado sin resultados | Buscador con/sin coincidencias, links del mapa, links publicos base | Rutas locales `internal/`, `public/`, `../index.html` | Sin errores JS ni 404 locales | Mejoras operativas sin regresion visual ni funcional | OK | Aprobado | Smoke test manual 10C OK |
| `/internal/hub-operativo.html` en mobile | Interna operativa responsive | Validar topbar sin overflow | Botones visibles sin solaparse; topbar estable | Link Volver al Portal y CTA principal operativos | CSS inline local | Sin errores JS | Topbar usable en viewport mobile | OK | Aprobado | Topbar no rompe visualmente en mobile |

Checklist especifico:

- Abrir `internal/hub-operativo.html`.
- Click en "Volver al Portal" y confirmar que abre `../index.html`.
- Buscar un termino con coincidencias, por ejemplo `gantt`.
- Buscar un termino sin coincidencias y confirmar estado "Sin resultados".
- Abrir al menos un link del mapa `Internal`.
- Abrir al menos un link del mapa `Public`.
- Confirmar que los links publicos siguen sin `seller_id` hardcodeado.
- Validar visualmente la topbar en mobile.
- Confirmar sin 404 criticos.
- Resultado 10C: OK. Busqueda por titulo y descripcion validada; estado sin resultados visible; sin `seller_id` hardcodeado; mapa clickeable operativo; sin tocar formularios, simuladores, Backlog, Gestion, Apps Script, config, endpoints, payloads ni submit.

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

## Etapa 11A/11B: decision tokens paginas publicas

Alcance:

- Auditoria y decision documental.
- Sin cambios HTML, CSS ni JS.
- Sin aplicar `tokens.css`.
- Sin crear `public-tokens.css`.
- Sin tocar formularios, simuladores, endpoints, payloads, submit, `seller_id` ni Apps Script.

| Ruta | Tipo | Riesgo | Beneficio `tokens.css` | Decision | Smoke test futuro si se reabre |
|---|---|---|---|---|---|
| `/public/formularios/formulario-calificacion.html` | Publica formulario | Alto | Bajo | No aplicar por ahora | Carga visual, bloqueo sin seller_id, carga con seller_id, submit no ejecutado |
| `/public/formularios/formulario-relevamiento.html` | Publica formulario critico | Critico | Bajo | Mantener independiente | Carga completa, condicionales, progreso, `pctSec`, submit no ejecutado |
| `/public/presentaciones/presentacion-seller.html` | Publica presentacion | Medio | Bajo/Nulo | Mantener independiente | Hero, logos, CTAs, seller_id, fetch CSV |
| `/public/simuladores/simulador-seller.html` | Publica simulador | Alto | Bajo | No aplicar por ahora | Calculos, tarifas, overrides, seller_id, CTAs, sin cambios de formulas |

Decision 11B:

- Mantener paginas publicas seller-facing independientes de `assets/css/tokens.css`.
- Evaluar un posible `public-tokens.css` solo con auditoria especifica futura.

## Etapa 12B: compatibility layer de aliases

Decision:

- Mantener aliases versionados en raiz.
- No mover aliases a `legacy/`.
- Reservar `legacy/root-html-v1/` para snapshots historicos futuros.

Smoke test futuro si se reabre limpieza legacy:

- Validar cada alias versionado desde raiz.
- Validar preservacion de query/hash.
- Validar `seller_id` en aliases publicos.
- Validar GitHub Pages despues de publicar.

## Etapa 13A/13B: smoke test post-push GitHub Pages

Resultado general: OK.

| URL | Objetivo | Resultado | Observaciones |
|---|---|---|---|
| `https://antonioluquin-ecomm.github.io/marketplace-portal/` | Carga portada institucional | OK | `index.html` carga correctamente |
| `https://antonioluquin-ecomm.github.io/marketplace-portal/internal/hub-operativo.html` | Carga Hub Operativo | OK | Hub operativo disponible |
| `https://antonioluquin-ecomm.github.io/marketplace-portal/sporting-marketplace_hub_v29.html` | Alias hub legacy | OK | Redirige a `internal/hub-operativo.html` |
| `https://antonioluquin-ecomm.github.io/marketplace-portal/sporting-marketplace_hub_v29.html?test=1#mapa` | Alias con query/hash | OK | Preserva query string y hash |
| `https://antonioluquin-ecomm.github.io/marketplace-portal/presentacion-seller_v3.html?seller_id=SPT-001` | Alias publico con seller | OK | Preserva `seller_id=SPT-001` |
| `https://antonioluquin-ecomm.github.io/marketplace-portal/simulador-seller_v12.html?seller_id=SPT-001` | Alias publico con seller | OK | Preserva `seller_id=SPT-001` |
| `https://antonioluquin-ecomm.github.io/marketplace-portal/formulario-calificacion_v2.html?seller_id=SPT-001` | Alias formulario con seller | OK | Sin submit real |
| `https://antonioluquin-ecomm.github.io/marketplace-portal/formulario-relevamiento_v2.html?seller_id=SPT-001` | Alias formulario con seller | OK | Sin submit real |

Confirmaciones:

- No hay 404 criticos.
- No se ejecuto submit real en formularios ni Gestion de Sellers.

## Etapa 14B: validaciones requeridas para piloto CSS interno

Piloto propuesto: `internal/estrategia/proceso-onboarding.html`.

Alcance futuro 14C:

- Crear CSS interno minimo.
- Aplicarlo solo a la pagina piloto.
- No extraer JS.
- No tocar publicas, formularios, simuladores, Backlog, Gestion, Apps Script, config, aliases ni legacy.

Checklist 14C:

- CSS nuevo carga sin 404.
- `tokens.css` sigue cargando.
- `:root` inline permanece como fallback.
- Topbar sin regresion visual.
- Sidebar sin regresion visual.
- Cards, KPIs, grillas y paneles sin regresion visual.
- Responsive mobile sin overflow.
- `git diff --name-only` limitado a CSS nuevo, pagina piloto y documentacion.

## Etapa 14D: smoke test piloto CSS interno

Pagina: `internal/estrategia/proceso-onboarding.html`.

| Validacion | Resultado esperado | Estado |
|---|---|---|
| `internal-components.css` carga sin 404 | HTTP 200 / sin error local | Pendiente |
| `tokens.css` sigue cargando | HTTP 200 / sin error local | Pendiente |
| CSS inline permanece | `:root` y `<style>` original presentes | Pendiente |
| Topbar | Sin regresion visual | Pendiente |
| Sidebar | Sin regresion visual | Pendiente |
| Paneles y callouts | Sin regresion visual | Pendiente |
| Section headers y tags | Sin regresion visual | Pendiente |
| Responsive mobile | Sin overflow critico | Pendiente |
| JS | Sin cambios / sin errores nuevos | Pendiente |

No ejecutar pruebas sobre formularios, simuladores, Backlog, Gestion, Apps Script ni publicas.

## Riesgos conocidos

- Posible referencia a `pctSec` antes de declaracion en `public/formularios/formulario-relevamiento.html`.
- Referencia heredada a `articulos-seller.docx` no presente en `internal/seller-center/index.html`.
- Formularios publicos y Gestion de Sellers escriben datos reales via Apps Script.
- Archivos legacy en raiz siguen duplicados respecto de rutas nuevas.
- CSS y JavaScript siguen inline o embebidos.
- Redirects desde archivos versionados de raiz todavia no fueron implementados, salvo el piloto `governance_v3.html`.
- Dependencias externas de Google Sheets, Apps Script y logos pueden fallar por permisos, CORS o disponibilidad.

## Etapa 7B/7C: smoke test alias legacy Governance

Alcance:

- Validar solo el alias piloto `governance_v3.html`.
- No tocar otros HTML legacy.
- No mover archivos a `legacy/`.
- No probar formularios, simuladores, Backlog, Gestion de Sellers ni Apps Script.

| Ruta | Tipo | Objetivo de prueba | Validaciones visuales | Validaciones funcionales | Dependencias | Consola | Resultado esperado | Resultado real | Estado | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|
| `/governance_v3.html` | Alias legacy | Confirmar redireccion al Governance migrado | Mensaje de redireccion solo si el navegador no redirige de inmediato | Meta refresh y JS redirigen a `/internal/estrategia/governance.html` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | Piloto de bajo riesgo |
| `/governance_v3.html?test=1#riesgo` | Alias legacy con query/hash | Confirmar preservacion de parametros | Mensaje fallback no debe romper layout minimo | `location.search` y `location.hash` se conservan en el destino | Ruta local nueva | Sin 404 ni errores JS | Destino final `/internal/estrategia/governance.html?test=1#riesgo` | OK | Aprobado | Query/hash preservados |

Checklist especifico:

- Abrir `governance_v3.html` desde raiz.
- Confirmar que el destino final es `internal/estrategia/governance.html`.
- Abrir `governance_v3.html?test=1#riesgo`.
- Confirmar que query string y hash se preservan.
- Revisar Network/Console para confirmar ausencia de 404 locales.
- Confirmar que el enlace manual apunta al mismo destino con query/hash cuando JavaScript alcanza a actualizarlo.
- Confirmar que no se modificaron otros aliases legacy.

## Etapa 7D: smoke test aliases legacy estrategia

Alcance:

- Validar solo aliases legacy informativos del grupo `internal/estrategia/`.
- No tocar `governance_v3.html`.
- No mover archivos a `legacy/`.
- No probar formularios, simuladores, Backlog, Gestion de Sellers, Seller Center ni Apps Script.

| Ruta | Tipo | Objetivo de prueba | Validaciones visuales | Validaciones funcionales | Dependencias | Consola | Resultado esperado | Resultado real | Estado | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|
| `/proceso-onboarding_v4.html` | Alias legacy | Confirmar redireccion al Onboarding migrado | Mensaje de redireccion solo si el navegador no redirige de inmediato | Meta refresh y JS redirigen a `/internal/estrategia/proceso-onboarding.html` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | Alias informativo de bajo riesgo |
| `/modelo-integracion_v5.html` | Alias legacy | Confirmar redireccion al Modelo de Integracion migrado | Mensaje de redireccion solo si el navegador no redirige de inmediato | Meta refresh y JS redirigen a `/internal/estrategia/modelo-integracion.html` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | Alias informativo de bajo riesgo |
| `/modelo-economico_v2.html` | Alias legacy | Confirmar redireccion al Modelo Economico migrado | Mensaje de redireccion solo si el navegador no redirige de inmediato | Meta refresh y JS redirigen a `/internal/estrategia/modelo-economico.html` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | Alias validado |
| `/proyecto-marketplace_v3.html` | Alias legacy | Confirmar redireccion al Proyecto Marketplace migrado | Mensaje de redireccion solo si el navegador no redirige de inmediato | Meta refresh y JS redirigen a `/internal/estrategia/proyecto-marketplace.html` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | Alias validado |
| `/proceso-onboarding_v4.html?test=1#riesgo` | Alias legacy con query/hash | Confirmar preservacion de parametros | Mensaje fallback no debe romper layout minimo | `location.search` y `location.hash` se conservan en el destino | Ruta local nueva | Sin 404 ni errores JS | Destino final conserva `?test=1#riesgo` | OK | Aprobado | Query/hash preservados |
| `/modelo-integracion_v5.html?test=1#riesgo` | Alias legacy con query/hash | Confirmar preservacion de parametros | Mensaje fallback no debe romper layout minimo | `location.search` y `location.hash` se conservan en el destino | Ruta local nueva | Sin 404 ni errores JS | Destino final conserva `?test=1#riesgo` | OK | Aprobado | Query/hash preservados |
| `/modelo-economico_v2.html?test=1#riesgo` | Alias legacy con query/hash | Confirmar preservacion de parametros | Mensaje fallback no debe romper layout minimo | `location.search` y `location.hash` se conservan en el destino | Ruta local nueva | Sin 404 ni errores JS | Destino final conserva `?test=1#riesgo` | OK | Aprobado | Query/hash preservados |
| `/proyecto-marketplace_v3.html?test=1#riesgo` | Alias legacy con query/hash | Confirmar preservacion de parametros | Mensaje fallback no debe romper layout minimo | `location.search` y `location.hash` se conservan en el destino | Ruta local nueva | Sin 404 ni errores JS | Destino final conserva `?test=1#riesgo` | OK | Aprobado | Query/hash preservados |

Checklist especifico:

- Abrir cada archivo legacy desde raiz.
- Confirmar que el destino final es la ruta correspondiente en `internal/estrategia/`.
- Abrir cada archivo legacy con `?test=1#riesgo`.
- Confirmar que query string y hash se preservan.
- Revisar Network/Console para confirmar ausencia de 404 locales.
- Confirmar que el enlace manual apunta al mismo destino con query/hash cuando JavaScript alcanza a actualizarlo.
- Confirmar que no se modificaron aliases de paginas criticas.

## Etapa 7E: smoke test aliases legacy internos de riesgo medio

Alcance:

- Validar solo aliases legacy de Seller Center y Gantt.
- No mover archivos a `legacy/`.
- No probar Backlog, Gestion de Sellers, formularios, simuladores, paginas publicas ni Apps Script.
- No tocar paginas nuevas en `internal/`.

| Ruta | Tipo | Objetivo de prueba | Validaciones visuales | Validaciones funcionales | Dependencias | Consola | Resultado esperado | Resultado real | Estado | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|
| `/seller-center_v2.html` | Alias legacy | Confirmar redireccion al Seller Center migrado | Mensaje de redireccion solo si el navegador no redirige de inmediato | Meta refresh y JS redirigen a `/internal/seller-center/index.html` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | La pagina destino mantiene sus dependencias read-only |
| `/gantt-seller-center_v2.html` | Alias legacy | Confirmar redireccion al Gantt Seller Center migrado | Mensaje de redireccion solo si el navegador no redirige de inmediato | Meta refresh y JS redirigen a `/internal/gantt/gantt-seller-center.html` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | La pagina destino mantiene CSV externo |
| `/gantt-operativo_v18.html` | Alias legacy | Confirmar redireccion al Gantt Operativo migrado | Mensaje de redireccion solo si el navegador no redirige de inmediato | Meta refresh y JS redirigen a `/internal/gantt/gantt-operativo.html` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | Riesgo alto por dependencias de datos; alias no toca logica |
| `/seller-center_v2.html?test=1#riesgo` | Alias legacy con query/hash | Confirmar preservacion de parametros | Mensaje fallback no debe romper layout minimo | `location.search` y `location.hash` se conservan en el destino | Ruta local nueva | Sin 404 ni errores JS | Destino final conserva `?test=1#riesgo` | OK | Aprobado | Query/hash preservados |
| `/gantt-seller-center_v2.html?test=1#riesgo` | Alias legacy con query/hash | Confirmar preservacion de parametros | Mensaje fallback no debe romper layout minimo | `location.search` y `location.hash` se conservan en el destino | Ruta local nueva | Sin 404 ni errores JS | Destino final conserva `?test=1#riesgo` | OK | Aprobado | Query/hash preservados |
| `/gantt-operativo_v18.html?test=1#riesgo` | Alias legacy con query/hash | Confirmar preservacion de parametros | Mensaje fallback no debe romper layout minimo | `location.search` y `location.hash` se conservan en el destino | Ruta local nueva | Sin 404 ni errores JS | Destino final conserva `?test=1#riesgo` | OK | Aprobado | Query/hash preservados |

Checklist especifico:

- Abrir cada archivo legacy desde raiz.
- Confirmar que el destino final es la ruta correspondiente en `internal/`.
- Abrir cada archivo legacy con `?test=1#riesgo`.
- Confirmar que query string y hash se preservan.
- Revisar Network/Console para confirmar ausencia de 404 locales.
- Confirmar que el enlace manual apunta al mismo destino con query/hash cuando JavaScript alcanza a actualizarlo.
- Confirmar que Backlog, Gestion de Sellers, formularios, simuladores y hub legacy no fueron modificados.

## Etapa 7F: smoke test aliases legacy restantes

Alcance:

- Validar aliases legacy restantes con ruta nueva migrada.
- No mover archivos a `legacy/`.
- No tocar `sporting-marketplace_hub_v29.html`.
- No modificar ni probar logica funcional de paginas destino.
- No ejecutar submit real en Gestion de Sellers ni formularios.

| Ruta | Tipo | Objetivo de prueba | Validaciones visuales | Validaciones funcionales | Dependencias | Consola | Resultado esperado | Resultado real | Estado | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|
| `/backlog-sellers_v27.html` | Alias legacy | Confirmar redireccion al Backlog migrado | Mensaje de redireccion solo si el navegador no redirige de inmediato | Redirige a `/internal/backlog/backlog-sellers.html` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | No se validaron datos en esta prueba de alias |
| `/gestion-sellers_v7.html` | Alias legacy critico | Confirmar redireccion a Gestion migrada | Mensaje de redireccion solo si el navegador no redirige de inmediato | Redirige a `/internal/backlog/gestion-sellers.html`; no ejecutar submit | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | Submit real no ejecutado |
| `/simulador-economico_v4.html` | Alias legacy | Confirmar redireccion al Simulador Economico migrado | Mensaje de redireccion solo si el navegador no redirige de inmediato | Redirige a `/internal/simuladores/simulador-economico.html` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | No se validaron formulas en esta prueba de alias |
| `/maqueta-seller-center_v2.html` | Alias legacy | Confirmar redireccion a Maqueta Seller Center migrada | Mensaje de redireccion solo si el navegador no redirige de inmediato | Redirige a `/internal/seller-center/maqueta-seller-center.html` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta al destino nuevo | OK | Aprobado | Maqueta excluida de tokens.css, alias solamente |
| `/presentacion-seller_v3.html?seller_id=SPT-001` | Alias legacy publico | Confirmar redireccion preservando seller_id | Mensaje de redireccion solo si el navegador no redirige de inmediato | Redirige a `/public/presentaciones/presentacion-seller.html?seller_id=SPT-001` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta y `seller_id` preservado | OK | Aprobado | `seller_id` preservado |
| `/simulador-seller_v12.html?seller_id=SPT-001` | Alias legacy publico | Confirmar redireccion preservando seller_id | Mensaje de redireccion solo si el navegador no redirige de inmediato | Redirige a `/public/simuladores/simulador-seller.html?seller_id=SPT-001` | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta y `seller_id` preservado | OK | Aprobado | `seller_id` preservado |
| `/formulario-calificacion_v2.html?seller_id=SPT-001` | Alias legacy publico critico | Confirmar redireccion preservando seller_id | Mensaje de redireccion solo si el navegador no redirige de inmediato | Redirige a `/public/formularios/formulario-calificacion.html?seller_id=SPT-001`; no ejecutar submit | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta y `seller_id` preservado | OK | Aprobado | Submit real no ejecutado |
| `/formulario-relevamiento_v2.html?seller_id=SPT-001` | Alias legacy publico critico | Confirmar redireccion preservando seller_id | Mensaje de redireccion solo si el navegador no redirige de inmediato | Redirige a `/public/formularios/formulario-relevamiento.html?seller_id=SPT-001`; no ejecutar submit | Ruta local nueva | Sin 404 ni errores JS | Redireccion correcta y `seller_id` preservado | OK | Aprobado | Submit real no ejecutado; riesgo `pctSec` sigue separado |

Checklist especifico:

- Abrir cada archivo legacy desde raiz.
- Confirmar que el destino final es la ruta correspondiente en `internal/` o `public/`.
- Abrir cada archivo publico con `?seller_id=SPT-001`.
- Confirmar que `seller_id` se preserva en el destino.
- Abrir cada archivo legacy con `?test=1#riesgo`.
- Confirmar que query string y hash se preservan.
- Revisar Network/Console para confirmar ausencia de 404 locales.
- Confirmar que `sporting-marketplace_hub_v29.html` queda intacto.
- No ejecutar submit real en Gestion ni formularios.

## Etapa 7G: cierre documental y smoke test V1

Estado: Etapa 7 cerrada en modo aliases. Smoke test manual completo ejecutado con resultado OK.

Resumen de validacion requerida:

| Grupo | Rutas legacy | Validacion clave | Resultado real | Estado | Observaciones |
|---|---:|---|---|---|---|
| Estrategia | 5 | Redireccion a `internal/estrategia/`, query/hash preservados | OK | Aprobado | Incluye piloto Governance y aliases 7D |
| Seller Center / Gantt | 3 | Redireccion a rutas `internal/`, sin 404 locales | OK | Aprobado | Gantt conserva dependencias de datos en pagina destino |
| Operativas internas | 4 | Redireccion a Backlog, Gestion, Simulador Economico y Maqueta | OK | Aprobado | Submit no ejecutado en Gestion |
| Publicas seller-facing | 4 | Redireccion a `public/` preservando `seller_id` | OK | Aprobado | `seller_id=SPT-001` preservado; formularios sin submit real |
| Hub legacy | 1 | Confirmar que sigue intacto | OK | Aprobado | `sporting-marketplace_hub_v29.html` no fue convertido en alias |

Checklist final V1:

- Abrir todos los aliases legacy implementados.
- Confirmar destino final correcto en `internal/` o `public/`.
- Confirmar preservacion de `?test=1#riesgo`.
- Confirmar preservacion de `?seller_id=SPT-001` en paginas publicas.
- Confirmar ausencia de 404 locales en aliases.
- Confirmar que `sporting-marketplace_hub_v29.html` sigue disponible e intacto.
- No ejecutar submit real en Gestion de Sellers ni formularios.
- Documentar resultado real antes de publicar o etiquetar V1.

## Etapa 8A: estado final V1

Estado: V1 estable y lista para release.

| Area | Resultado | Estado | Observaciones |
|---|---|---|---|
| Aliases legacy | Smoke test manual OK | Aprobado | Query/hash y `seller_id=SPT-001` preservados |
| Paginas internas | Migradas y documentadas | Aprobado | `tokens.css` aplicado solo a grupo interno validado |
| Paginas publicas | Migradas y documentadas | Aprobado | Sin `tokens.css`; sin submit real en smoke test |
| Assets/logos | Centralizados y documentados | Aprobado | `Logos/` legacy se conserva |
| Hub legacy | Intacto | Pendiente post-V1 | `sporting-marketplace_hub_v29.html` requiere decision futura |
| Release notes | `docs/release-notes-v1.md` creada | Aprobado | Base para cierre V1 |

## Registro de ejecucion

Usar esta seccion para anotar resultados reales despues de ejecutar el smoke test manual.

| Fecha | Responsable | Rutas probadas | Resultado general | Incidencias | Proxima accion |
|---|---|---|---|---|---|
| 2026-05-18 | Gabriel Luna | Aliases legacy 7C-7F | OK | Sin 404 criticos; query/hash y `seller_id=SPT-001` preservados; sin submit real | Preparar release notes V1 |

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

---

## Etapa 6G: auditoria grupo internal/seller-center

**Fecha:** 2026-05-16
**Tipo:** auditoria — sin modificaciones

| Pagina | Lineas | Veredicto | Motivo |
|---|---|---|---|
| `internal/seller-center/index.html` | 705 | ✅ APTA | Paleta Sporting, fetch read-only, mismo patron que estrategia/ |
| `internal/seller-center/maqueta-seller-center.html` | 1288 | ❌ EXCLUIDA | Otra plataforma, paleta clara, 6 colisiones criticas de variables |

---

## Etapa 6H: tokens.css en internal/seller-center/index.html

**Fecha:** 2026-05-16
**Estado:** ✅ APROBADO — smoke test ejecutado el 2026-05-16

### Etapa 6I: resultado del smoke test

**Fecha de ejecucion:** 2026-05-16
**Entorno:** local — `http://localhost:8080/internal/seller-center/index.html`
**Ejecutado por:** Gabriel Luna
**Resultado general:** OK

### Cambio aplicado

**`internal/seller-center/index.html`** — agregado en `<head>` linea 10-11, antes del `<style>`:

```html
<!-- 6H: tokens CSS externos. El :root inline permanece como fallback. -->
<link rel="stylesheet" href="../../assets/css/tokens.css">
```

`:root` inline (linea 13) conservado sin modificacion. `maqueta-seller-center.html` no fue tocada.

### Checklist de smoke test 6H (ejecutado en Etapa 6I)

| # | Verificacion | Metodo | Resultado |
|---|---|---|---|
| 1 | `index.html` carga sin error 404 en `tokens.css` | DevTools → Network | ✅ OK |
| 2 | `tokens.css` devuelve HTTP 200 | DevTools → Network | ✅ OK |
| 3 | Sin errores criticos de consola | DevTools → Console | ✅ OK |
| 4 | Sin regresion visual en topbar | Visual | ✅ OK |
| 5 | Sin regresion visual en sidebar | Visual | ✅ OK |
| 6 | Sin regresion visual en modulos SC | Visual | ✅ OK |
| 7 | Error CORS del `fetch` a Google Sheets — esperado, no regresion | Console | ✅ Confirmado esperado |
| 8 | Click en "Ver maqueta" navega correctamente | Interaccion | ✅ OK |
| 9 | Click en "Ver Gantt" navega correctamente | Interaccion | ✅ OK |
| 10 | Link "Articulos Seller" (docx) resuelve correctamente | Inspeccion href | ✅ OK |

### Estado final del grupo internal/seller-center/

| Pagina | tokens.css | Smoke test | Observacion |
|---|---|---|---|
| `index.html` | ✅ enlazado (6H) | ✅ 6I — OK | `:root` inline activo como fallback |
| `maqueta-seller-center.html` | ❌ excluida | No aplica | Otra plataforma, otro sistema visual — exclusion definitiva |

### Exclusion definitiva de maqueta-seller-center.html

`maqueta-seller-center.html` representa otra plataforma en creacion con sistema visual propio (paleta clara: fondo `#eef1f4`, panel `#ffffff`, texto `#222222`). No adopta los tokens oscuros del Marketplace Portal. Exclusion por diseño — no es un pendiente a resolver en etapas futuras.

### Riesgos pendientes tras 6I

- `--info` de `index.html` (`#38bdf8`) difiere del canonico (`#60a5fa`) — el inline prevalece, sin impacto visual hoy. A unificar en etapas futuras.
- Smoke test ejecutado en entorno local. Pendiente validacion en produccion (GitHub Pages) despues del proximo push.

---

## Etapa 6J: auditoria grupo internal/backlog

**Fecha:** 2026-05-16
**Tipo:** auditoria — sin modificaciones

| Pagina | Lineas | Colisiones efectivas | JS | Veredicto |
|---|---|---|---|---|
| `backlog-sellers.html` | 1002 | 0 (usa alias --wa/--in/--da) | fetch read-only | ✅ APTA |
| `gestion-sellers.html` | 232 | 0 visualmente (5 nombres iguales, inline siempre gana) | Apps Script POST + localStorage | ✅ APTA con nota |

---

## Etapa 6K: tokens.css en grupo internal/backlog

**Fecha:** 2026-05-16
**Estado:** ✅ APROBADO — smoke test ejecutado el 2026-05-16

### Etapa 6L: resultado del smoke test

**Fecha de ejecucion:** 2026-05-16
**Entorno:** local — `http://localhost:8080/`
**Ejecutado por:** Gabriel Luna
**Resultado general:** OK en ambas paginas

### Cambios aplicados

| Pagina | Link | Ubicacion | :root inline |
|---|---|---|---|
| `backlog-sellers.html` | ✅ agregado | linea 10-11, antes de `<style>` (sin indent) | ✅ intacto (linea 13) |
| `gestion-sellers.html` | ✅ agregado | linea 11-12, despues de `config.js`, antes de `<style>` | ✅ intacto (linea 14) |

### Checklist de smoke test 6K (ejecutado en Etapa 6L)

#### backlog-sellers.html

| # | Verificacion | Metodo | Resultado |
|---|---|---|---|
| 1 | Pagina carga sin error 404 en `tokens.css` | DevTools → Network | ✅ OK |
| 2 | `tokens.css` HTTP 200 | DevTools → Network | ✅ OK |
| 3 | Sin errores criticos de consola | DevTools → Console | ✅ OK |
| 4 | Cards, tabla, filtros y modal visibles sin regresion visual | Visual | ✅ OK |
| 5 | CORS del fetch a Google Sheets — esperado, no regresion | Console | ✅ Confirmado esperado |

#### gestion-sellers.html

| # | Verificacion | Metodo | Resultado |
|---|---|---|---|
| 6 | Pagina carga sin error 404 en `tokens.css` | DevTools → Network | ✅ OK |
| 7 | `tokens.css` HTTP 200 | DevTools → Network | ✅ OK |
| 8 | Sin errores criticos de consola | DevTools → Console | ✅ OK |
| 9 | Formulario, preview, links visibles sin regresion | Visual | ✅ OK |
| 10 | Punto de estado (.dot) muestra ambar correcto (inline prevalece) | Visual | ✅ OK |
| 11 | Asterisco de campo obligatorio muestra ambar correcto | Visual | ✅ OK |
| 12 | `config.js` carga sin errores | DevTools → Network | ✅ OK |
| 13 | Submit real no ejecutado | — | ✅ Confirmado |

### Estado final del grupo internal/backlog/

| Pagina | tokens.css | Smoke test | Observacion |
|---|---|---|---|
| `backlog-sellers.html` | ✅ enlazado (6K) | ✅ 6L — OK | `:root` inline activo, fetch read-only sin tocar |
| `gestion-sellers.html` | ✅ enlazado (6K) | ✅ 6L — OK | `:root` inline activo, Apps Script / localStorage / submit sin tocar |

### Riesgos pendientes tras 6L

- `gestion-sellers.html`: `--warn` y `--danger` con valor inline (`#ffb74d`, `#d94040`) distintos del canonico — el inline siempre prevalece, sin cambio visual. A unificar en etapas futuras si se elimina el inline.
- Smoke test ejecutado en entorno local. Pendiente validacion en produccion (GitHub Pages) despues del proximo push.

---

## Etapa 6M: cierre de Etapa 6 — estado consolidado

**Fecha:** 2026-05-16
**Estado:** cerrado

### Resumen de cobertura de tokens.css por grupo

| Grupo | Pagina | Etapa link | Smoke test | Estado |
|---|---|---|---|---|
| `internal/estrategia/` | `proceso-onboarding.html` | 6C | ✅ 6D | Validado |
| `internal/estrategia/` | `governance.html` | 6E | ✅ 6F | Validado |
| `internal/estrategia/` | `modelo-integracion.html` | 6E | ✅ 6F | Validado |
| `internal/estrategia/` | `modelo-economico.html` | 6E | ✅ 6F | Validado |
| `internal/estrategia/` | `proyecto-marketplace.html` | 6E | ✅ 6F | Validado |
| `internal/seller-center/` | `index.html` | 6H | ✅ 6I | Validado |
| `internal/backlog/` | `backlog-sellers.html` | 6K | ✅ 6L | Validado |
| `internal/backlog/` | `gestion-sellers.html` | 6K | ✅ 6L | Validado |

**Total: 8 paginas enlazadas y validadas.**

### Exclusiones definitivas

| Pagina | Motivo |
|---|---|
| `internal/seller-center/maqueta-seller-center.html` | Otra plataforma, paleta clara — exclusion por diseño |

### Paginas diferidas (fuera del alcance de Etapa 6)

| Pagina | Motivo |
|---|---|
| `public/formularios/formulario-calificacion.html` | Seller-facing, formulario con submit real |
| `public/formularios/formulario-relevamiento.html` | Seller-facing, formulario con submit real |
| `public/presentaciones/presentacion-seller.html` | Seller-facing, estilos comerciales propios |
| `public/simuladores/simulador-seller.html` | Simulador con calculos y logica propia |

Cualquier extension futura a estas paginas requiere auditoria especifica antes de cualquier cambio.

### Invariantes cumplidos en toda la Etapa 6

En ninguna sub-etapa (6C a 6L) se modificaron: bloques `<script>`, `config.js`, Apps Script, endpoints, `localStorage`, `nextSellerId`, `reserveSellerId`, formularios publicos, simuladores, archivos legacy ni redirects.

---

## Etapa 14F: smoke test pendiente para extension de internal-components.css

**Origen:** Etapa 14E.
**Estado:** pendiente.
**Alcance:** grupo `internal/estrategia/` restante.

Paginas a validar:

- `internal/estrategia/governance.html`
- `internal/estrategia/modelo-integracion.html`
- `internal/estrategia/modelo-economico.html`
- `internal/estrategia/proyecto-marketplace.html`

Checklist:

| # | Verificacion | Metodo | Resultado esperado | Resultado real | Estado |
|---|---|---|---|---|---|
| 1 | Pagina carga correctamente | Browser / GitHub Pages local o remoto | Sin pantalla rota | Pendiente | Pendiente |
| 2 | `tokens.css` carga sin 404 | DevTools Network | HTTP 200 | Pendiente | Pendiente |
| 3 | `internal-components.css` carga sin 404 | DevTools Network | HTTP 200 | Pendiente | Pendiente |
| 4 | CSS inline permanece activo como fallback | Inspeccion DOM / visual | Sin regresion visual | Pendiente | Pendiente |
| 5 | Topbar y sidebar se mantienen estables | Visual desktop/mobile | Sin overflow critico | Pendiente | Pendiente |
| 6 | Cards, paneles, tags y secciones se ven consistentes | Visual | Sin cambios disruptivos | Pendiente | Pendiente |
| 7 | No hay errores JS nuevos | DevTools Console | Sin errores criticos nuevos | Pendiente | Pendiente |
| 8 | No se tocaron scripts ni paginas criticas | `git diff --name-only` | Solo archivos permitidos | Pendiente | Pendiente |

Notas:

- `proceso-onboarding.html` no forma parte de 14E; ya fue piloto 14C.
- `assets/css/internal-components.css` no se modifica en 14E.
- Publicas, Backlog, Gestion, formularios, simuladores, Apps Script, config, aliases y `legacy/` quedan fuera del alcance.

---

## Etapa 14H: smoke test pendiente para paginas internas restantes con internal-components.css

**Origen:** Etapa 14G.
**Estado:** pendiente.
**Alcance:** paginas internas restantes.

Paginas a validar por grupo:

- Seller Center: `internal/seller-center/index.html`
- Gantt: `internal/gantt/gantt-seller-center.html`, `internal/gantt/gantt-operativo.html`
- Simulador interno: `internal/simuladores/simulador-economico.html`
- Backlog/Gestion: `internal/backlog/backlog-sellers.html`, `internal/backlog/gestion-sellers.html`
- Hub Operativo: `internal/hub-operativo.html`

Checklist:

| # | Verificacion | Metodo | Resultado esperado | Resultado real | Estado |
|---|---|---|---|---|---|
| 1 | Pagina carga correctamente | Browser / GitHub Pages local o remoto | Sin pantalla rota | Pendiente | Pendiente |
| 2 | `tokens.css` carga sin 404 cuando aplica | DevTools Network | HTTP 200 o no aplica | Pendiente | Pendiente |
| 3 | `internal-components.css` carga sin 404 | DevTools Network | HTTP 200 | Pendiente | Pendiente |
| 4 | CSS inline permanece activo como fallback | Inspeccion DOM / visual | Sin regresion visual | Pendiente | Pendiente |
| 5 | Topbar, sidebar, cards, tablas y modulos se mantienen estables | Visual desktop/mobile | Sin overflow critico | Pendiente | Pendiente |
| 6 | Links internos principales funcionan | Click / inspeccion href | Rutas correctas | Pendiente | Pendiente |
| 7 | Fetch, CSV, filtros y render dinamico no cambiaron | DevTools Console / visual | Sin errores nuevos | Pendiente | Pendiente |
| 8 | Formulas y simulador economico no cambiaron | Smoke test sin modificar datos | Sin regresion evidente | Pendiente | Pendiente |
| 9 | Submit y localStorage no cambiaron en Gestion | Inspeccion / no ejecutar submit real | Sin cambios de comportamiento | Pendiente | Pendiente |
| 10 | No se tocaron scripts, publicas ni maqueta Seller Center | `git diff --name-only` | Solo archivos permitidos | Pendiente | Pendiente |

Notas:

- `internal/seller-center/maqueta-seller-center.html` no forma parte de 14G.
- `assets/css/internal-components.css` no se modifica en 14G.
- Paginas publicas, formularios, simuladores publicos, presentaciones publicas, Apps Script, config, aliases y `legacy/` quedan fuera del alcance.
- No ejecutar submit real durante 14H.

---

## Etapa 14I: cierre documental de CSS interno compartido

**Estado:** documentado.

Resumen de cobertura:

| Bloque | Etapa | Estado documental | Observacion |
|---|---|---|---|
| Auditoria CSS/JS | 14A | Cerrada | Sin cambios de archivos |
| Plan CSS interno | 14B | Cerrado | Decision: no extraer JS |
| Piloto `proceso-onboarding` | 14C/14D | Documentado | CSS inline conservado |
| Estrategia informativa | 14E/14F | Documentado | CSS inline conservado |
| Internas restantes | 14G/14H | Documentado | CSS inline conservado |

Validaciones requeridas para cualquier cierre operativo posterior:

- Confirmar carga sin 404 de `internal-components.css`.
- Confirmar carga sin 404 de `tokens.css` donde aplique.
- Confirmar sin regresion visual en desktop/mobile.
- Confirmar que no se modificaron bloques `<script>`.
- Confirmar que fetch, CSV, formulas, filtros, submit, localStorage y render dinamico no cambiaron.
- No ejecutar submit real en Gestion ni formularios.

Exclusiones permanentes de Etapa 14:

- Paginas publicas.
- Formularios.
- Simuladores publicos.
- Presentaciones publicas.
- Apps Script.
- Config.
- Aliases de raiz.
- `legacy/`.

---

## Etapa 15C: smoke test pendiente para limpieza piloto CSS inline

**Origen:** Etapa 15B.
**Estado:** pendiente.
**Alcance:** `internal/estrategia/proceso-onboarding.html`.

Checklist:

| # | Verificacion | Metodo | Resultado esperado | Resultado real | Estado |
|---|---|---|---|---|---|
| 1 | Pagina carga correctamente | Browser / GitHub Pages local o remoto | Sin pantalla rota | Pendiente | Pendiente |
| 2 | `tokens.css` carga sin 404 | DevTools Network | HTTP 200 | Pendiente | Pendiente |
| 3 | `internal-components.css` carga sin 404 | DevTools Network | HTTP 200 | Pendiente | Pendiente |
| 4 | Paneles se mantienen visualmente iguales | Visual | Sin regresion | Pendiente | Pendiente |
| 5 | Callouts conservan estilo y margen superior | Visual | Sin regresion | Pendiente | Pendiente |
| 6 | Cabeceras de seccion y descripciones se mantienen | Visual | Sin regresion | Pendiente | Pendiente |
| 7 | Tags y tags verdes se mantienen | Visual | Sin regresion | Pendiente | Pendiente |
| 8 | Responsive desktop/mobile se mantiene | Visual responsive | Sin overflow nuevo | Pendiente | Pendiente |
| 9 | No se tocaron scripts ni paginas criticas | `git diff --name-only` | Solo archivos permitidos | Pendiente | Pendiente |

Notas:

- No ejecutar cambios funcionales durante 15C.
- No extender limpieza a otras paginas hasta validar el piloto.
