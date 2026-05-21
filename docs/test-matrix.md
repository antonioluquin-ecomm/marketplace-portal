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
| `/internal/seller-center/index.html` | Interna informativa | Validar Seller Center migrado | Layout, cards/secciones, navegacion | Links a maqueta y Gantt Seller Center | Rutas internas, documento `articulos-seller.docx` existente | Revisar 404 | Pagina carga y links principales resuelven | Pendiente | Pendiente | `internal/seller-center/articulos-seller.docx` existe; no tratar como faltante |
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
- Referencia a `articulos-seller.docx` presente en `internal/seller-center/index.html`; el archivo existe en `internal/seller-center/`.
- Formularios publicos y Gestion de Sellers escriben datos reales via Apps Script.
- Archivos legacy en raiz siguen duplicados respecto de rutas nuevas.
- CSS y JavaScript siguen inline o embebidos.
- Redirects desde archivos versionados de raiz todavia no fueron implementados, salvo el piloto `governance_v3.html`.
- Dependencias externas de Google Sheets, Apps Script y logos pueden fallar por permisos, CORS o disponibilidad.

## Etapa 18B: cierre minimo auditoria estructural

- Etapa 18A cerrada como auditoria sin cambios.
- Sin links locales rotos detectados en `href`, `src` o stylesheets dentro del alcance activo.
- HTML versionados de raiz se mantienen como aliases activos; no mover a `legacy/`.
- `sporting-marketplace_hub_v29.html` se mantiene como alias hacia `internal/hub-operativo.html`.
- No se realizara limpieza fisica por ahora.

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

---

## Etapa 15E: smoke test pendiente para limpieza CSS estrategia

**Origen:** Etapa 15D.
**Estado:** pendiente.
**Alcance:** paginas informativas restantes de `internal/estrategia/`.

Paginas:

- `internal/estrategia/governance.html`
- `internal/estrategia/modelo-integracion.html`
- `internal/estrategia/modelo-economico.html`
- `internal/estrategia/proyecto-marketplace.html`

Checklist:

| # | Verificacion | Metodo | Resultado esperado | Resultado real | Estado |
|---|---|---|---|---|---|
| 1 | Cada pagina carga correctamente | Browser / GitHub Pages local o remoto | Sin pantalla rota | Pendiente | Pendiente |
| 2 | `tokens.css` carga sin 404 | DevTools Network | HTTP 200 | Pendiente | Pendiente |
| 3 | `internal-components.css` carga sin 404 | DevTools Network | HTTP 200 | Pendiente | Pendiente |
| 4 | Paneles mantienen estilo esperado | Visual | Sin regresion | Pendiente | Pendiente |
| 5 | Section heads y section titles mantienen layout | Visual | Sin regresion | Pendiente | Pendiente |
| 6 | Callouts conservan diferencias visuales especificas | Visual | Sin regresion | Pendiente | Pendiente |
| 7 | Tags de `modelo-integracion.html` conservan variantes | Visual / selector | Sin regresion | Pendiente | Pendiente |
| 8 | Selector de `modelo-integracion.html` funciona | Interaccion manual | Cambia resultado sin errores | Pendiente | Pendiente |
| 9 | Responsive basico se mantiene | Visual mobile/desktop | Sin overflow nuevo | Pendiente | Pendiente |
| 10 | No se tocaron scripts ni paginas fuera de alcance | `git diff --name-only` | Solo archivos permitidos | Pendiente | Pendiente |

Notas:

- No ejecutar refactor adicional durante 15E.
- No extender limpieza a paginas operativas hasta nueva auditoria especifica.

---

## Etapa 15G: cierre documental limpieza CSS interna

**Estado:** documentado.

Decision:

- Cerrar limpieza CSS interna por ahora.
- No ejecutar smoke tests adicionales de limpieza CSS operativa porque no se implementaron cambios en paginas operativas.
- Mantener smoke tests 15C y 15E como validaciones pendientes/esperadas de los cambios aplicados en paginas informativas.

Paginas excluidas por riesgo/beneficio:

| Pagina | Motivo |
|---|---|
| `internal/seller-center/index.html` | Fetch CSV y render dinamico; baja duplicacion real |
| `internal/gantt/gantt-seller-center.html` | Timeline, filtros, CSV y render complejo |
| `internal/gantt/gantt-operativo.html` | Timeline operativo y clases propias |
| `internal/simuladores/simulador-economico.html` | Formulas y layout propio |
| `internal/backlog/backlog-sellers.html` | Cards, tabla, filtros, modal y datos externos |
| `internal/backlog/gestion-sellers.html` | Submit, Apps Script, config, localStorage y generacion de IDs |
| `internal/hub-operativo.html` | Buscador, grid dinamico y mapa de rutas propio |

Proximo bloque sugerido:

- Etapa 16A: auditoria JS interna compartible, sin implementacion.

---

## Etapa 16C: smoke test pendiente para piloto JS navegacion activa

**Origen:** Etapa 16B.
**Estado:** pendiente.
**Alcance:** `internal/estrategia/governance.html`.

Checklist:

| # | Verificacion | Metodo | Resultado esperado | Resultado real | Estado |
|---|---|---|---|---|---|
| 1 | Pagina carga correctamente | Browser / GitHub Pages local o remoto | Sin pantalla rota | Pendiente | Pendiente |
| 2 | `internal-navigation.js` carga sin 404 | DevTools Network | HTTP 200 | Pendiente | Pendiente |
| 3 | Sidebar marca seccion activa inicial | Visual / DOM | Link activo correcto | Pendiente | Pendiente |
| 4 | Sidebar actualiza seccion activa al hacer scroll | Scroll manual | Clase `active` cambia segun seccion | Pendiente | Pendiente |
| 5 | Links internos siguen navegando a anclas | Click manual | Scroll a seccion correcta | Pendiente | Pendiente |
| 6 | Sin errores de consola | DevTools Console | Sin errores nuevos | Pendiente | Pendiente |
| 7 | No se tocaron otras paginas ni JS critico | `git diff --name-only` | Solo archivos permitidos | Pendiente | Pendiente |

Notas:

- No extender `internal-navigation.js` a otras paginas hasta validar 16C.
- No mezclar este piloto con fetch, CSV, formularios, buscadores ni render dinamico.

---

## Etapa 16E: smoke test pendiente para extension JS navegacion estrategia

**Origen:** Etapa 16D.
**Estado:** pendiente.
**Alcance:** `modelo-economico.html` y `proyecto-marketplace.html`.

Paginas:

- `internal/estrategia/modelo-economico.html`
- `internal/estrategia/proyecto-marketplace.html`

Checklist:

| # | Verificacion | Metodo | Resultado esperado | Resultado real | Estado |
|---|---|---|---|---|---|
| 1 | Cada pagina carga correctamente | Browser / GitHub Pages local o remoto | Sin pantalla rota | Pendiente | Pendiente |
| 2 | `internal-navigation.js` carga sin 404 | DevTools Network | HTTP 200 | Pendiente | Pendiente |
| 3 | Navegacion activa inicial funciona | Visual / DOM | Link activo correcto | Pendiente | Pendiente |
| 4 | Navegacion activa cambia con scroll | Scroll manual | Clase `active` cambia por seccion | Pendiente | Pendiente |
| 5 | Links internos a anclas funcionan | Click manual | Scroll a seccion correcta | Pendiente | Pendiente |
| 6 | `animationDelay` se conserva en `proyecto-marketplace.html` | Visual / DOM | Animaciones sin regresion | Pendiente | Pendiente |
| 7 | Sin errores de consola | DevTools Console | Sin errores nuevos | Pendiente | Pendiente |
| 8 | No se tocaron paginas fuera de alcance | `git diff --name-only` | Solo archivos permitidos | Pendiente | Pendiente |

Notas:

- No extender a `modelo-integracion.html` ni paginas operativas durante 16E.
- No mezclar con fetch, CSV, formularios, buscadores ni render dinamico.

---

## Etapa 16F: cierre documental JS interno compartido

**Estado:** documentado.

Decision:

- Cerrar JS interno compartido por ahora.
- Mantener `assets/js/internal-navigation.js` como unico helper JS compartido post-V1.
- No extraer JS operativo.

Validaciones pendientes asociadas:

- 16C: validar piloto en `governance.html`.
- 16E: validar extension en `modelo-economico.html` y `proyecto-marketplace.html`.

Exclusiones:

| Pagina/grupo | Motivo |
|---|---|
| `modelo-integracion.html` | Selector especifico de escenarios |
| `seller-center/index.html` | Fetch y render CSV |
| `gantt-operativo.html` | Timeline, filtros y CSV |
| `gantt-seller-center.html` | Timeline, filtros y CSV |
| `simulador-economico.html` | Formulas y calculos |
| `backlog-sellers.html` | Filtros, modal y render |
| `gestion-sellers.html` | Submit, Apps Script, config y localStorage |
| `hub-operativo.html` | Buscador, grid y mapa |
| `public/` | Fuera del sistema JS interno |

Proximo bloque sugerido:

- Revisar documentacion/handoff o ejecutar smoke test post-push.

---

## Etapa 29C: smoke logo interno clickeable

**Estado:** validado.

**Objetivo:** confirmar que la normalizacion de 29B dejo todos los logos internos clickeables hacia `index.html` sin romper carga ni topbar.

Validaciones:

| Grupo | Paginas | Verificacion | Resultado | Estado |
|---|---|---|---|---|
| Portada | `index.html` | Carga local HTTP | `200`; marca institucional visible | OK |
| Hub | `internal/hub-operativo.html` | Logo a `../index.html`; desktop/mobile 390px | Link correcto; captura generada | OK |
| Estrategia | `internal/estrategia/*.html` | Logo a `../../index.html`; carga local | Links correctos; HTTP `200`; capturas desktop/mobile | OK |
| Backlog | `internal/backlog/*.html` | Logo a `../../index.html`; no alterar filtros/render | Links correctos; HTTP `200`; capturas desktop/mobile | OK |
| Gantt | `internal/gantt/*.html` | Logo a `../../index.html`; no alterar timeline | Links correctos; HTTP `200`; capturas desktop/mobile | OK |
| Seller Center | `internal/seller-center/index.html` y maqueta | Logo a `../../index.html`; conservar estetica maqueta | Links correctos; HTTP `200`; capturas desktop/mobile | OK |
| Simulador interno | `internal/simuladores/simulador-economico.html` | Confirmar que seguia OK | Link ya correcto; HTTP `200`; captura generada | OK |

Checklist tecnico:

| Verificacion | Resultado | Estado |
|---|---|---|
| `git diff --name-only` durante 29C | Solo documentacion | OK |
| Apps Script / config / JS compartido | Sin cambios | OK |
| `public/`, `legacy/`, formularios, payloads, endpoints | Sin cambios | OK |
| Simuladores funcionales, formulas, timeline Gantt | Sin cambios | OK |

Evidencia local:

- Capturas generadas en `C:\tmp\marketplace-portal-29c-smoke-all`.
- Se validaron vistas desktop `1365x768` y mobile `390x844`.

---

## Etapa 30D: matriz futura edicion Gantt Operativo

**Estado:** 30E1 endpoint QA implementado; pruebas reales pendientes.

**Documento tecnico:** `docs/gantt-operativo-edicion.md`.

Validaciones futuras obligatorias para 30E:

| Caso | Entrada | Resultado esperado | Estado |
|---|---|---|---|
| `task_id` valido | `tipo_formulario=gantt_task_update`, campos permitidos | Actualiza fila unica y responde `ok:true` | Pendiente con tarea dummy |
| `task_id` inexistente | ID no presente en `timeline` | Rechaza con `ok:false` y error claro | Pendiente |
| `task_id` duplicado | ID repetido en `timeline` | Rechaza sin escribir | Pendiente |
| Campo no permitido | `fields` incluye columna restringida | Rechaza o ignora segun contrato final; preferencia rechazar | Pendiente |
| Fecha invalida | `inicio_real`, `fin_real`, `inicio_plan` o `fin_plan` invalida | Rechaza sin escribir | Pendiente |
| Estado invalido | Estado fuera de enum permitido | Rechaza sin escribir | Pendiente |
| Payload vacio | `fields={}` | Rechaza sin escribir | Pendiente |
| Sin `updated_by` | Payload sin usuario | Rechaza o registra usuario anonimo segun decision 30E | Pendiente |
| Recarga posterior | Guardado OK | `loadData(true)` refleja cambios desde CSV | Pendiente |
| Smoke no productivo | Tarea dummy/QA | No altera tareas reales | Pendiente |

Restricciones para 30E:

- No editar `task_id`, `id_tarea`, `seller_id` ni `seller_nombre`.
- No modificar formulas, columnas calculadas, URLs, estructura de hoja ni endpoints existentes.
- No habilitar edicion productiva sin prueba con tarea dummy.

### Etapa 30E1: endpoint QA Apps Script

**Estado:** implementado sin ejecutar escritura real.

Validaciones realizadas:

| Verificacion | Resultado | Estado |
|---|---|---|
| Sintaxis local de `Apps_script_v5.js` | `node --check Apps_script_v5.js` sin errores | OK |
| Smoke local mockeado | Update valido en memoria, rechazo de campo no permitido, fecha invalida y guardia `seller_id` existente | OK |
| Front Gantt | No modificado | OK |
| Apps Script existente `seller`, `gestion_seller`, `calificacion`, `relevamiento` | Ruteo conservado; `seller_id` sigue requerido para esos tipos | OK |
| Escritura real | No ejecutada | OK |

Payload dummy recomendado:

```json
{
  "tipo_formulario": "gantt_task_update",
  "task_id": "TASK-DUMMY-QA",
  "updated_by": "qa@marketplace.local",
  "fields": {
    "estado": "En curso",
    "responsable": "QA",
    "inicio_real": "2026-05-19",
    "fin_real": "",
    "comentario": "Prueba controlada endpoint 30E1."
  }
}
```

### Etapa 30E3: UI controlada de edicion Gantt Operativo

**Estado:** implementado sin ejecutar escritura real desde el front.

Validaciones realizadas:

| Verificacion | Resultado | Estado |
|---|---|---|
| Alcance de archivos | Solo `internal/gantt/gantt-operativo.html` y documentacion permitida | OK |
| Apps Script | No modificado en 30E3 | OK |
| Campos enviados | Solo `estado`, `responsable`, `inicio_real`, `fin_real`, `comentario` | OK |
| Campos restringidos | `task_id`, `seller_id`, seller, fase, hito, dependencia, visible_gantt y fechas planificadas no son editables | OK |
| Confirmacion antes de guardar | `window.confirm` requerido antes del POST | OK |
| Advertencia QA | Si la tarea no es `TASK-DUMMY-QA`, el confirm recuerda validar primero con dummy | OK |
| Validacion local de campos | Smoke local OK para fecha invalida, rango invalido y estado invalido | OK |
| Payload | Usa `tipo_formulario = "gantt_task_update"` y `task_id` de la tarea seleccionada | OK |
| Actualizacion visual | Tras OK actualiza la tarea localmente y reabre el detalle con feedback | OK |
| Escritura real | No ejecutada durante la implementacion | OK |

Casos pendientes de QA real/controlado:

| Caso | Metodo | Estado |
|---|---|---|
| Update con `TASK-DUMMY-QA` | Ejecutar manualmente contra tarea dummy aprobada | Pendiente |
| `task_id` inexistente | Enviar payload controlado y validar respuesta error | Pendiente |
| Fecha invalida | Forzar payload/fixture con fecha invalida y validar rechazo | Pendiente |
| Sin errores JS | Smoke en navegador real desktop/mobile | Pendiente |
| Filtros/vistas | Validar seller filter, busqueda, fase, estado, solo activos, semana/mes, Gantt/lista y modal detalle | Pendiente |

## Etapa 31A: auditoria modularizacion Apps Script

**Estado:** documentado, sin cambios funcionales.

**Documento tecnico:** `docs/apps-script-modularizacion.md`.

Validaciones realizadas:

| Verificacion | Resultado | Estado |
|---|---|---|
| Archivo funcional | `Apps_script_v5.js` auditado solo lectura | OK |
| Mapa funcional | Routing, sellers, gestion_seller, calificacion, relevamiento, definicion tecnica, Gantt, auditoria, helpers y config documentados | OK |
| Riesgos | Dependencias implicitas, globals, side effects, headers, deploy parcial y payloads existentes documentados | OK |
| Propuesta futura | Etapas 31B-31E definidas | OK |
| Comportamiento funcional | No modificado | OK |

Validaciones futuras para 31B+:

| Caso | Metodo | Estado |
|---|---|---|
| `doGet` | Confirmar `status: ok` tras cada split | Pendiente |
| Routing | POST dummy por `seller`, `calificacion`, `relevamiento`, `gantt_task_update` | Pendiente |
| Compatibilidad payloads | Confirmar mismos campos y respuestas | Pendiente |
| Headers | Confirmar que no hay backups/clear inesperados | Pendiente |
| Deploy incremental | Versionar Apps Script y conservar rollback | Pendiente |

## Etapa 31B: modularizacion minima Apps Script

**Estado:** implementado localmente, sin deploy activo.

Validaciones realizadas:

| Verificacion | Resultado | Estado |
|---|---|---|
| Archivos creados | `Config.gs`, `Headers.gs`, `Utils.gs` | OK |
| `Apps_script_v5.js` | Mantiene `doPost`, `doGet`, routing y dominios funcionales | OK |
| Sintaxis `Apps_script_v5.js` | `node --check Apps_script_v5.js` sin errores | OK |
| Sintaxis `.gs` | Carga local con `vm` sin errores; `node --check` no acepta extension `.gs` en este Node | OK |
| Routing mockeado | `seller`, `gestion_seller`, `calificacion`, `relevamiento`, `gantt_task_update` | OK |
| Formato de error | Falta `seller_id` conserva `ok:false`, `status:error`, `error`, `message` | OK |
| Escritura real | No ejecutada | OK |

Funciones movidas:

| Archivo | Funciones / constantes |
|---|---|
| `Config.gs` | `SPREADSHEET_ID`, `EMAIL_NOTIFICACION`, `TIMEZONE`, `HOJA_*` |
| `Headers.gs` | `jsonResponse`, `errorResponse` |
| `Utils.gs` | `emailValido`, `fechaActualSimple`, `rowToObject`, `pickPrimero`, `limpiarValor`, `normalizarTexto` |

Funciones no movidas:

| Dominio | Estado |
|---|---|
| Gantt Operativo | No modularizado en 31B |
| Sellers / Gestion Sellers | No modularizado en 31B |
| Calificacion | No modularizado en 31B |
| Relevamiento | No modularizado en 31B |
| Definicion tecnica | No modularizado en 31B |
| Helpers Sheets con side effects | No modularizados en 31B |
| Headers de hojas `HEADERS_*` | No movidos en 31B |

### Etapa 31B: validacion real post modularizacion minima

**Estado:** validado sin escrituras reales.

| Smoke | Metodo | Resultado | Estado |
|---|---|---|---|
| Incorporacion local `.gs` | `rg --files` y carga conjunta con `vm` | `Config.gs`, `Headers.gs`, `Utils.gs` y `Apps_script_v5.js` cargan juntos | OK |
| Proyecto remoto Apps Script | Busqueda `.clasp.json` / `appsscript.json` | No hay metadata local para inspeccionar archivos remotos | Limitacion |
| `doGet` real | GET no destructivo al Web App real | `status:"ok"` y hojas esperadas | OK |
| Duplicados | Revision de simbolos en 4 archivos | 84 simbolos, 0 duplicados | OK |
| `seller` | Smoke mockeado `doPost` | `ok:true`, `tipo_formulario:"seller"` | OK |
| `gestion_seller` | Smoke mockeado `doPost` | Alias normaliza a `seller` | OK |
| `calificacion` | Smoke mockeado `doPost` | `ok:true`, `tipo_formulario:"calificacion"` | OK |
| `relevamiento` | Smoke mockeado `doPost` | `ok:true`, `tipo_formulario:"relevamiento"` | OK |
| `gantt_task_update` | Smoke mockeado `doPost` con `TASK-DUMMY-QA` | `ok:true`, `updated_fields` preservado | OK |
| Falta `seller_id` | Smoke mockeado error | `ok:false`, `status:"error"`, `error`, `message` | OK |
| Escritura real | No ejecutada | Sin cambios en Google Sheets | OK |

Pendiente antes de 31C:

- Confirmar en el editor Apps Script real o mediante `clasp` que `Config.gs`, `Headers.gs` y `Utils.gs` fueron subidos al proyecto remoto.
- Ejecutar POST real solo con dummy aprobado si se decide validar escritura controlada.

## Etapa 31C: modularizacion controlada Gantt Apps Script

**Estado:** implementado localmente, sin deploy activo ni escritura real.

| Validacion | Metodo | Resultado | Estado |
|---|---|---|---|
| Archivo creado | `Gantt.gs` | Logica exclusiva Gantt movida | OK |
| Fachada principal | Revision `Apps_script_v5.js` | `doPost` y `doGet` permanecen en fachada | OK |
| Routing Gantt | Revision estatica | `doPost` sigue llamando `actualizarTareaGantt(data)` | OK |
| Duplicados | Revision de simbolos en 5 archivos | 84 simbolos, 0 duplicados | OK |
| Sintaxis fachada | `node --check Apps_script_v5.js` | Sin errores | OK |
| Sintaxis conjunta | Carga via `vm` de `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs`, `Apps_script_v5.js` | Sin errores | OK |
| Smoke `gantt_task_update` | Hoja `timeline` mockeada con `TASK-DUMMY-QA` | `ok:true`, `task_id` y `updated_fields` estables | OK |
| Error `task_id` faltante | Smoke mockeado | `ok:false`, `status:"error"`, `error:"Falta task_id"`, `message:"Error: Falta task_id"` | OK |
| Escritura real | No ejecutada | Sin cambios en Google Sheets | OK |

Funciones movidas a `Gantt.gs`:

- `actualizarTareaGantt`
- helpers exclusivos Gantt de headers, ids, valores, estados, fechas, textos, metadatos y auditoria.
- constantes `CAMPOS_GANTT_EDITABLES_QA` y `ESTADOS_GANTT_PERMITIDOS`.

Funciones no movidas:

- Sellers / Gestion Sellers.
- Calificacion.
- Relevamiento.
- Definicion tecnica.
- Helpers Sheets compartidos.
- `HEADERS_*` y `CAMPOS_*` no Gantt.

### Etapa 31C-post: validacion real post modularizacion Gantt

**Estado:** Apps Script integrado; escritura dummy bloqueada por header real en `timeline`.

| Prueba | Metodo | Resultado | Estado |
|---|---|---|---|
| `doGet` real | GET no destructivo al Web App | `status:"ok"` y hojas esperadas | OK |
| POST real no destructivo sin `task_id` | `tipo_formulario=gantt_task_update` sin `task_id` | `ok:false`, `error:"Falta task_id"` | OK |
| Integracion `Gantt.gs` | Validacion real del endpoint | Reconoce `gantt_task_update` y devuelve errores propios Gantt | OK |
| `TASK-DUMMY-QA` real | POST controlado con campos permitidos | `ok:false`, error `La hoja "timeline" no tiene columna task_id / id_tarea` | Bloqueado |
| Escritura real | Resultado del POST dummy | No hubo escritura exitosa | OK |
| Sintaxis local fachada | `node --check Apps_script_v5.js` | Sin errores | OK |
| Carga conjunta local | `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs`, `Apps_script_v5.js` via `vm` | Sin errores | OK |
| Duplicados locales | Revision de simbolos | 84 simbolos, 0 duplicados | OK |
| `git diff --check` | Validacion git | Sin errores | OK |

Pendiente:

- Confirmar/corregir header real de `timeline` para que el endpoint detecte `task_id` / `id_tarea`.
- No avanzar a 31D hasta resolver esa compatibilidad o definir una etapa QA especifica.

### Etapa 31C-fix: alias `ID Tarea` en endpoint Gantt

**Estado:** implementado localmente; pendiente deploy/revalidacion real con `TASK-DUMMY-QA`.

| Prueba | Metodo | Resultado | Estado |
|---|---|---|---|
| Alias header `ID Tarea` | Smoke mockeado con hoja `timeline` | `gantt_task_update` OK | OK |
| Error `task_id` faltante | Smoke mockeado | `ok:false`, `error:"Falta task_id"` | OK |
| `task_id` inexistente | Smoke mockeado | Error controlado `task_id no existe` | OK |
| Payload externo | Revision estatica | Sigue usando `task_id` | OK |
| Response | Smoke mockeado | Formato estable | OK |
| `doGet` real | GET no destructivo | `status:"ok"` | OK |
| POST real sin `task_id` | POST no destructivo | `ok:false`, `error:"Falta task_id"` | OK |
| POST real `TASK-DUMMY-QA` | No ejecutado tras fix local | Pendiente hasta subir `Gantt.gs` actualizado al Apps Script real | Pendiente |
| `node --check` | `Apps_script_v5.js` | Sin errores | OK |
| Carga conjunta | `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs`, `Apps_script_v5.js` | Sin errores | OK |
| Duplicados | Revision de simbolos | 85 simbolos, 0 duplicados | OK |

31C2 sugerida:

- Disenar alta/baja logica de tareas Gantt desde front en etapa separada.
- No eliminar filas fisicamente.
- Usar `visible_gantt = No` o `estado = Cancelado`.

### Revalidacion real 31C-fix

**Estado:** no aprobado en Apps Script real.

| Prueba | Metodo | Resultado | Estado |
|---|---|---|---|
| `doGet` real | GET Web App | `status:"ok"` | OK |
| POST sin `task_id` | POST no destructivo | `ok:false`, `error:"Falta task_id"` | OK |
| POST `TASK-DUMMY-QA` | POST real autorizado | `ok:false`, error `La hoja "timeline" no tiene columna task_id / id_tarea` | Fallo |
| Header visual `ID Tarea` | Inferido por POST dummy | No reconocido por el Apps Script real activo | Fallo |
| Escritura real | Resultado del POST dummy | Sin escritura exitosa evidenciada | OK |

Pendiente:

- Subir/deployar `Gantt.gs` actualizado con alias `ID Tarea`.
- Repetir smoke real con `TASK-DUMMY-QA`.

### Etapa 31C2: diseno alta/baja controlada tareas Gantt

**Estado:** documentado, sin implementacion funcional.

**Documento tecnico:** `docs/gantt-operativo-edicion.md`.

Alcance:

- Solo auditoria y diseno tecnico.
- Sin cambios en Apps Script funcional.
- Sin cambios en Google Sheets.
- Sin cambios en front, endpoints actuales, payloads actuales ni `gantt_task_update`.

#### Matriz futura `gantt_task_create`

| Caso | Entrada | Resultado esperado | Estado |
|---|---|---|---|
| Alta dummy valida | `tipo_formulario=gantt_task_create`, seller QA, campos minimos completos | Crea una fila unica y responde `ok:true` con `task_id` generado | Futuro |
| Falta `seller_id` | Payload sin seller | Rechaza sin escribir | Futuro |
| Seller inexistente | `seller_id` no presente en hoja sellers | Rechaza sin escribir | Futuro |
| Falta campo minimo | Sin `fase`, `hito`, `tarea`, `responsable`, `inicio_plan`, `fin_plan`, `estado` o `visible_gantt` | Rechaza sin escribir | Futuro |
| Fecha invalida | `inicio_plan` o `fin_plan` fuera de `YYYY-MM-DD` | Rechaza sin escribir | Futuro |
| Rango invalido | `fin_plan` anterior a `inicio_plan` | Rechaza sin escribir | Futuro |
| Estado invalido | Estado fuera de enum permitido | Rechaza sin escribir | Futuro |
| Dependencia inexistente | `dependencia` apunta a task no existente | Rechaza sin escribir | Futuro |
| Dependencia circular | Nueva tarea generaria ciclo | Rechaza o bloquea segun validacion definida | Futuro |
| ID duplicado | Collision al generar o recibir `task_id` QA | Rechaza sin escribir | Futuro |
| Columna faltante | Falta columna requerida en `timeline` | Error claro, sin crear columnas nuevas | Futuro |
| Auditoria | Existen columnas/hoja de log compatible | Registra `created_at` / `created_by` o log si existe | Futuro |

#### Matriz futura `gantt_task_disable`

| Caso | Entrada | Resultado esperado | Estado |
|---|---|---|---|
| Baja dummy valida | `tipo_formulario=gantt_task_disable`, `task_id` dummy, `reason` | No borra fila; actualiza `visible_gantt = No` y/o `estado = Cancelado` | Futuro |
| Falta `task_id` | Payload sin ID | Rechaza sin escribir | Futuro |
| `task_id` inexistente | ID no presente en `timeline` | Rechaza sin escribir | Futuro |
| `task_id` duplicado | ID repetido | Rechaza sin escribir | Futuro |
| Falta motivo | Sin `reason` | Rechaza o advierte segun contrato final | Futuro |
| Tarea con dependientes activos | Otras tareas activas dependen de ella | Rechaza o advierte antes de baja | Futuro |
| Baja repetida | Tarea ya oculta/cancelada | Respuesta idempotente o error claro segun contrato final | Futuro |
| Auditoria | Existen `disabled_at`, `disabled_by` o log compatible | Registra usuario, fecha y motivo si existe soporte | Futuro |
| Integridad visual | Recarga CSV despues de baja | Gantt no muestra tarea si `visible_gantt = No`; historial permanece en hoja | Futuro |

#### Smoke futuro recomendado

| Paso | Verificacion | Resultado esperado | Estado |
|---|---|---|---|
| 1 | Crear tarea dummy con seller QA | `ok:true`, `task_id` generado o validado | Futuro |
| 2 | Confirmar fila en `timeline` | Fila nueva existe, sin formulas alteradas | Futuro |
| 3 | Confirmar CSV publicado | La tarea aparece tras latencia normal | Futuro |
| 4 | Confirmar Gantt | La tarea aparece si `visible_gantt = Si` | Futuro |
| 5 | Dar de baja dummy | `ok:true`, sin delete fisico | Futuro |
| 6 | Confirmar baja logica | `visible_gantt = No` y/o `estado = Cancelado` | Futuro |
| 7 | Confirmar historial | La fila sigue existiendo | Futuro |
| 8 | Confirmar dependencias | No quedan referencias rotas sin advertencia | Futuro |
| 9 | Confirmar auditoria | Log/metadata si existen columnas compatibles | Futuro |

Decision de diseno:

- No eliminar fisicamente tareas.
- Preferir `visible_gantt = No` para ocultar y `estado = Cancelado` para comunicar anulacion.
- Usar `disabled_at` / `disabled_by` solo si existen o si una etapa futura aprueba agregar columnas.

### Etapa 31C2A: endpoint QA `gantt_task_create`

**Estado:** implementado localmente; escritura real pendiente de autorizacion.

| Validacion | Metodo | Resultado | Estado |
|---|---|---|---|
| Routing | `tipo_formulario=gantt_task_create` | `doPost` deriva a `crearTareaGantt` antes de exigir `seller_id` raiz | OK |
| Headers fila 1 | Smoke mockeado | Crea fila, genera `SPT-001-T-02`, aplica defaults | OK |
| Headers fila 3 | Smoke mockeado con cabecera visual y `ID Tarea` | Detecta headers reales e inserta en fila fisica correcta | OK |
| `seller_id` faltante | Smoke mockeado | `ok:false`, `error:"seller_id obligatorio"` | OK |
| Fecha invalida | Smoke mockeado | `ok:false`, error claro | OK |
| `fin_plan` anterior a `inicio_plan` | Smoke mockeado | `ok:false`, `error:"fin_plan no puede ser anterior a inicio_plan"` | OK |
| `task_id` duplicado | Smoke mockeado | `ok:false`, `error:"task_id duplicado en timeline: ..."` | OK |
| Default estado | Smoke mockeado sin `estado` | Escribe `Pendiente` | OK |
| Default visible | Smoke mockeado sin `visible_gantt` | Escribe `No` si la columna existe | OK |
| Sintaxis fachada | `node --check Apps_script_v5.js` | Sin errores | OK |
| Carga conjunta | `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs`, `Apps_script_v5.js` | Sin errores | OK |
| Escritura real | No ejecutada | Sin cambios en Google Sheets | OK |

Payload QA recomendado para validacion real autorizada:

```json
{
  "tipo_formulario": "gantt_task_create",
  "created_by": "qa@marketplace.local",
  "task": {
    "task_id": "TASK-DUMMY-QA-CREATE",
    "seller_id": "SPT-001",
    "fase": "Operativa",
    "hito": "Carga comercial inicial",
    "tarea": "Tarea dummy QA desde Apps Script",
    "responsable": "eCommerce",
    "inicio_plan": "2026-06-20",
    "fin_plan": "2026-06-21",
    "estado": "Pendiente",
    "visible_gantt": "No",
    "comentario": "Alta QA controlada"
  }
}
```

Pendientes:

- Subir `Apps_script_v5.js` y `Gantt.gs` al proyecto Apps Script real.
- Ejecutar POST real solo si se autoriza escritura dummy.
- Confirmar que la fila creada queda con `visible_gantt = No`.
- Confirmar que no afecta el Gantt visible ni tareas productivas.

### Etapa 31C2B: endpoint QA `gantt_task_disable`

**Estado:** implementado localmente; escritura real pendiente de autorizacion.

| Validacion | Metodo | Resultado | Estado |
|---|---|---|---|
| Routing | `tipo_formulario=gantt_task_disable` | `doPost` deriva a `darDeBajaTareaGantt` antes de exigir `seller_id` raiz | OK |
| Disable `hide` | Smoke mockeado | Escribe `visible_gantt = No` y comentario si existe | OK |
| Disable `cancel` | Smoke mockeado | Escribe `estado = Cancelado` y comentario si existe | OK |
| Disable `hide_and_cancel` | Smoke mockeado con headers reales en fila 3 | Escribe `visible_gantt = No`, `estado = Cancelado` y comentario | OK |
| `task_id` faltante | Smoke mockeado | `ok:false`, `error:"Falta task_id"` | OK |
| `task_id` inexistente | Smoke mockeado | `ok:false`, error `task_id no existe` | OK |
| `task_id` duplicado | Smoke mockeado | `ok:false`, error `task_id duplicado en timeline` | OK |
| Falta `visible_gantt` | Smoke mockeado modo `hide` | `ok:false`, error claro | OK |
| Falta `estado` | Smoke mockeado modo `cancel` | `ok:false`, error claro | OK |
| Compatibilidad update | Smoke mockeado `gantt_task_update` | Sigue OK | OK |
| Compatibilidad create | Smoke mockeado `gantt_task_create` | Sigue OK | OK |
| Sintaxis fachada | `node --check Apps_script_v5.js` | Sin errores | OK |
| Carga conjunta | `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs`, `Apps_script_v5.js` | Sin errores | OK |
| Escritura real | No ejecutada | Sin cambios en Google Sheets | OK |

Payload QA recomendado para validacion real autorizada:

```json
{
  "tipo_formulario": "gantt_task_disable",
  "task_id": "TASK-DUMMY-QA-CREATE",
  "updated_by": "qa@marketplace.local",
  "mode": "hide_and_cancel",
  "reason": "Baja logica QA controlada"
}
```

Pendientes:

- Subir `Apps_script_v5.js` y `Gantt.gs` al proyecto Apps Script real.
- Ejecutar POST real solo sobre `TASK-DUMMY-QA-CREATE`.
- Confirmar que no se borra la fila.
- Confirmar que la tarea queda oculta/cancelada segun modo.
- Confirmar que no afecta tareas productivas.

### Etapa 31C2C: smoke real alta/baja Gantt

**Estado:** aprobado.

| Validacion | Metodo | Resultado real | Estado |
|---|---|---|---|
| `doGet` real | GET Web App | `status:"ok"` y hojas esperadas | OK |
| Alta dummy | POST `gantt_task_create` con `TASK-DUMMY-QA-CREATE` | `ok:true`, `row_number:78` | OK |
| Fila existe | CSV publicado `timeline` | `TASK-DUMMY-QA-CREATE` encontrado | OK |
| Estado post alta | CSV publicado | `Pendiente` | OK |
| Comentario post alta | CSV publicado | `Alta QA controlada` | OK |
| Baja dummy | POST `gantt_task_disable`, `mode:"cancel"` | `ok:true`, `row_number:78`, `disabled_fields:["estado","comentario"]` | OK |
| Estado post baja | CSV publicado | `Cancelado` | OK |
| Comentario post baja | CSV publicado | `Baja logica QA controlada` | OK |
| No borrado fisico | CSV publicado | La fila sigue presente | OK |
| `gantt_task_update` | POST sin `task_id` | Error controlado `Falta task_id` | OK |
| Endpoint existente `seller` | POST sin `seller_id` | Error controlado `Falta seller_id en el formulario` | OK |
| Formato JSON | Revision de responses | OK/error estables | OK |
| Tareas productivas | Alcance de payloads | No se probaron tareas productivas | OK |

Observaciones:

- La validacion de baja se hizo con `mode = "cancel"`.
- La lectura CSV no expuso `visible_gantt`, por lo que no se ejecuto `hide` real.
- `TASK-DUMMY-QA-CREATE` queda como evidencia QA en estado `Cancelado`.

Decision:

- 31C2C queda aprobada.
- Se puede planificar una etapa futura de front controlado, manteniendo uso exclusivo de dummy hasta nueva autorizacion.

### Etapa 31C2D: UI controlada crear tarea Gantt

**Estado:** implementado localmente; POST real no ejecutado.

| Validacion | Metodo | Resultado | Estado |
|---|---|---|---|
| Abrir Gantt Operativo | Pendiente smoke navegador | Sin errores JS nuevos | Pendiente |
| Boton `+ Nueva tarea` | Revision estatica | Presente en toolbar | OK |
| Modal abre/cierra | Revision estatica | `openCreateTask` / `closeCreateModal` | OK |
| Campos minimos | Revision estatica | `seller_id`, `fase`, `hito`, `tarea`, `responsable`, `inicio_plan`, `fin_plan`, `estado`, `comentario` | OK |
| `visible_gantt` | Revision estatica | No se muestra ni se envia | OK |
| `task_id` | Revision estatica | No se genera ni se envia desde front | OK |
| Validaciones front | Revision estatica | Campos obligatorios, fechas, rango, estado | OK |
| Confirmacion | Revision estatica | `window.confirm` antes del POST | OK |
| Payload | Revision estatica | `tipo_formulario:"gantt_task_create"`, `created_by:"front@gantt-operativo"`, `task:{...}` | OK |
| Error endpoint | Pendiente smoke manual/mock | Mostrar mensaje claro en modal | Pendiente |
| OK endpoint | Pendiente smoke manual/mock | Feedback y `loadData(true)` | Pendiente |
| Edicion existente | Pendiente smoke navegador | Modal editar sigue funcionando | Pendiente |
| Filtros/timeline/detalle | Pendiente smoke navegador | Sin regresiones | Pendiente |
| Escritura real | No ejecutada | Sin POST real desde Codex | OK |

Payload esperado desde UI:

```json
{
  "tipo_formulario": "gantt_task_create",
  "created_by": "front@gantt-operativo",
  "task": {
    "seller_id": "SPT-001",
    "fase": "Operativa",
    "hito": "QA",
    "tarea": "Nueva tarea desde UI",
    "responsable": "eCommerce",
    "inicio_plan": "2026-06-20",
    "fin_plan": "2026-06-21",
    "estado": "Pendiente",
    "comentario": "Comentario opcional"
  }
}
```

Smoke manual recomendado:

- Abrir Gantt Operativo.
- Confirmar boton `+ Nueva tarea`.
- Abrir/cerrar modal.
- Intentar guardar vacio y validar errores.
- Completar payload dummy autorizado.
- Confirmar que no aparece `task_id` editable.
- Interceptar/revisar payload antes de autorizar POST real.
- Ejecutar POST real solo con autorizacion.
- Confirmar feedback OK/error.
- Confirmar recarga CSV.
- Confirmar que editar tarea sigue funcionando.

### Etapa 31C2E: smoke UI alta Gantt

**Estado:** aprobado con observacion.

| Validacion | Metodo | Resultado real | Estado |
|---|---|---|---|
| Abrir Gantt Operativo | Chrome headless local | DOM renderizado, `exitCode:0` | OK |
| Boton `+ Nueva tarea` | Chrome headless / DOM | Presente | OK |
| Modal abre | DOM mock ejecutando `openCreateTask()` | Clase `open` aplicada | OK |
| Modal cierra | DOM mock ejecutando `closeCreateModal()` | Clase `open` removida | OK |
| Validacion `seller_id` | DOM mock | Rechaza campo vacio | OK |
| Validacion `fase` | DOM mock | Rechaza campo vacio | OK |
| Validacion rango fechas | DOM mock | Rechaza `fin_plan` anterior | OK |
| Estado default | DOM mock | `Pendiente` | OK |
| `visible_gantt` | Revision DOM/payload | No se envia; no hay campo editable | OK |
| `task_id` | Payload capturado | No se envia desde front | OK |
| Alta dummy autorizada | POST real con payload UI | `ok:true`, `task_id:"SPT-001-T-30"`, `row_number:79` | OK |
| Feedback OK | DOM mock | Mensaje `Tarea creada` | OK |
| Recarga CSV | DOM mock | `loadData(true)` invocado tras OK | OK |
| Verificacion CSV | CSV publicado `timeline` | Fila `SPT-001-T-30` encontrada | OK |
| Timeline render posterior | Chrome headless | DOM contiene tarea nueva y task id | OK |
| Error endpoint | DOM mock con respuesta `ok:false` | Muestra error claro | OK |
| Edicion existente | Revision de alcance | No se modifico contrato; pendiente click real humano si se requiere | Pendiente menor |
| Tareas productivas | Alcance de payload | Solo tarea dummy QA | OK |

Tarea dummy creada:

| Campo | Valor |
|---|---|
| `task_id` | `SPT-001-T-30` |
| `seller_id` | `SPT-001` |
| `fase` | `Operativa` |
| `hito` | `QA Front` |
| `tarea` | `Tarea dummy QA desde UI` |
| `responsable` | `eCommerce` |
| `inicio_plan` | `2026-06-22` |
| `fin_plan` | `2026-06-23` |
| `estado` | `Pendiente` |
| `comentario` | `Alta QA desde UI 31C2E` |

Observacion:

- DevTools remoto no estuvo disponible para clicks reales.
- La interaccion se valido con DOM mockeado y la carga/render con Chrome headless.
- El alta real fue ejecutada con el payload generado por el flujo UI.

### Etapa 31C2F: auditoria hardening Gantt Apps Script

**Estado:** documentada; sin cambios funcionales.

Objetivo: definir validaciones futuras para permisos, concurrencia y auditoria antes de ampliar UI de escritura.

| Area | Validacion futura | Resultado esperado | Estado |
|---|---|---|---|
| Permisos | POST sin token/usuario autorizado a `gantt_task_create` | `ok:false`, error de autorizacion, sin escritura | Futuro |
| Permisos | POST autorizado a `gantt_task_create` | `ok:true`, tarea dummy creada | Futuro |
| Permisos | POST no autorizado a `gantt_task_update` | `ok:false`, sin modificar tarea | Futuro |
| Permisos | POST no autorizado a `gantt_task_disable` | `ok:false`, sin cancelar tarea | Futuro |
| Identidad | Payload con `updated_by` manipulado | Apps Script registra actor server-side o rechaza | Futuro |
| Identidad | Payload sin `created_by` pero con autorizacion valida | Apps Script registra actor resuelto en backend | Futuro |
| Concurrencia create | Dos altas simultaneas para mismo seller | IDs unicos; sin duplicados | Futuro |
| Concurrencia create | Colision de `task_id` manual | Rechazo controlado dentro del lock | Futuro |
| Concurrencia update | Dos updates simultaneos misma tarea | Sin corrupcion; log deja trazabilidad | Futuro |
| Concurrencia disable | Dos bajas simultaneas misma tarea | Operacion idempotente o error controlado | Futuro |
| LockService | Timeout de lock | `ok:false`, error claro, sin escritura parcial | Futuro |
| Auditoria | Update autorizado | Registra operation, actor, task_id, before/after, status | Futuro |
| Auditoria | Create autorizado | Registra task_id creado, actor, request_id si existe | Futuro |
| Auditoria | Disable autorizado | Registra motivo, actor, estado anterior y posterior | Futuro |
| Auditoria | Error de autorizacion | Registra intento solo si existe log seguro | Futuro |
| Baja logica | UI futura usa `mode = "cancel"` | No depende de `visible_gantt` | Futuro |
| Integridad | `visible_gantt` ausente en CSV real | UI no muestra opcion `hide` | Futuro |
| Alcance | No borrar filas fisicamente | Fila permanece en `timeline` | Futuro |

Orden recomendado de smoke futuro:

1. Permisos server-side.
2. `LockService` en create/update/disable.
3. Auditoria/log.
4. UI baja logica con `mode = "cancel"`.

No ejecutar pruebas sobre tareas productivas. Usar solo tareas dummy autorizadas.

### Etapa 31C2G: hardening minimo backend Gantt

**Estado:** implementado localmente; pendiente validacion real post deploy.

| Validacion | Metodo | Resultado | Estado |
|---|---|---|---|
| Sintaxis fachada | `node --check Apps_script_v5.js` | Sin errores | OK |
| Carga conjunta | `Config.gs`, `Headers.gs`, `Utils.gs`, `Gantt.gs`, `Apps_script_v5.js` via `vm` | Sin errores | OK |
| Duplicados | `rg` de funciones publicas Gantt | Sin duplicados conflictivos | OK |
| Lock update | Smoke mock `gantt_task_update` | Toma lock, actualiza y libera | OK |
| Lock create | Smoke mock `gantt_task_create` | Toma lock, crea tarea y libera | OK |
| Lock disable | Smoke mock `gantt_task_disable` | Toma lock, cancela tarea y libera | OK |
| Timeout lock | Mock con `tryLock=false` | Error controlado `No se pudo obtener lock Gantt...` | OK |
| Identidad update | Payload con `updated_by` | Actor normalizado usado en metadata/auditoria | OK |
| Identidad create | Payload con `created_by` | Actor normalizado usado en metadata/auditoria | OK |
| Fallback identidad | Payload sin actor en timeout mock | No rompe contrato; fallback definido | OK |
| Auditoria opcional | Hoja mock `timeline_log` compatible | Registra operacion, task_id, actor y campos | OK |
| Payloads | Revision estatica | Sin cambios de nombres ni estructura | OK |
| Front | Revision de archivos modificados | No se toco | OK |
| `git diff --check` | Validacion Git | Sin errores; solo avisos CRLF | OK |

Smoke mock ejecutado:

- `gantt_task_update` sobre `SPT-001-T-01`: `updated_fields = ["estado","comentario"]`.
- `gantt_task_create` sin `task_id`: genero `SPT-001-T-02`.
- `gantt_task_disable` con `mode:"cancel"`: `disabled_fields = ["estado","comentario"]`.
- Timeout de lock simulado: error controlado.

Validacion real pendiente:

- Copiar `Gantt.gs` actualizado al Apps Script real.
- Crear nuevo deploy.
- Revalidar solo con tarea dummy:
  - update OK;
  - create OK;
  - disable OK con `mode:"cancel"`;
  - timeout no se fuerza en real salvo prueba controlada.

### Etapa 31C2I: UI baja logica Gantt

**Estado:** implementado localmente; POST real no ejecutado.

| # | Validacion | Metodo | Resultado | Estado |
|---|---|---|---|---|
| 1 | Gantt carga sin errores | Pendiente smoke navegador | No ejecutado en browser interactivo | Pendiente |
| 2 | Modal de detalle abre | Revision estatica / flujo existente | `openModal(taskId)` conserva contrato | OK |
| 3 | Boton `Dar de baja` visible | Revision estatica | Presente en tareas no canceladas | OK |
| 4 | Boton no disponible en canceladas | Revision estatica | Renderiza `Tarea cancelada` disabled | OK |
| 5 | Confirmacion previa | Revision estatica | `window.confirm` antes del POST | OK |
| 6 | Motivo como `reason` | Smoke aislado DOM/fetch mock | `reason:"Motivo QA"` | OK |
| 7 | Payload `mode = "cancel"` | Smoke aislado | OK | OK |
| 8 | Sin `visible_gantt` en payload | Revision estatica / smoke aislado | No se envia | OK |
| 9 | Respuesta `ok:true` | Smoke aislado | Feedback y estado local `Cancelado` | OK |
| 10 | Respuesta `ok:false` | Revision de rama catch | Mensaje en modal via `lastDisableFeedback` | OK |
| 11 | Recarga CSV | Smoke aislado | `loadData(true)` invocado | OK |
| 12 | Alta y edicion existentes | Revision de diff | Sin cambios de contrato | OK |
| 13 | Filtros/timeline/detalle | Revision de alcance | Render central no modificado | OK |
| 14 | Tareas productivas | Alcance de smoke | No se ejecuto POST real | OK |
| 15 | `git diff --check` | Pendiente cierre | Validar al final | Pendiente |

Payload validado en smoke aislado:

```json
{
  "tipo_formulario": "gantt_task_disable",
  "task_id": "TASK-DUMMY-QA",
  "updated_by": "front@gantt-operativo",
  "mode": "cancel",
  "reason": "Motivo QA"
}
```

Limitacion:

- La validacion sintactica del script completo con Node local sigue bloqueada por optional chaining preexistente en el archivo.
- La funcion nueva se valido aislada con mocks de DOM, `fetch`, `window.prompt`, `window.confirm`, `render` y `loadData`.

Validacion real pendiente:

- Ejecutar solo con tarea dummy autorizada.
- No ejecutar bajas sobre tareas productivas.

### Etapa 31UX-F: cierre UX operativo Gantt

**Estado:** documentado; cambios funcionales no realizados en esta etapa.

| Validacion | Metodo | Resultado | Estado |
|---|---|---|---|
| 31UX-C continuidad | Auditoria previa | Detectado `</div>` sobrante en hero operativo | OK |
| 31UX-C-FIX nesting | Validacion estatica previa | HTML balanceado; sin cambios funcionales | OK |
| 31UX-D smoke visual | Validacion manual informada | Hero y toolbar operativos OK | OK |
| 31UX-E compactacion | Revision de alcance | Hero, toolbar, spacing y densidad operativa compactados | OK |
| Contratos funcionales | Revision de alcance | Sin cambios en Apps Script, endpoints, payloads, fetch ni Google Sheets | OK |

Nota:

- Este cierre solo documenta el bloque UX ya validado.
- No se ejecutaron POST reales ni submits reales en esta etapa documental.

### Etapa 32B: diccionario de datos Timeline / Gantt Operativo

**Estado:** documentado; sin cambios funcionales.

Documento principal: `docs/data-dictionary-timeline.md`.

| Validacion futura | Metodo | Resultado esperado | Estado |
|---|---|---|---|
| Lectura CSV `timeline` | Abrir Gantt / fetch CSV | Headers actuales siguen resolviendo por aliases | Futuro |
| Render Gantt Mes | Smoke visual/manual | Timeline visible sin errores | Futuro |
| Render Gantt Semana | Smoke visual/manual | Semanas visibles y orientacion temporal conservada | Futuro |
| Boton `Hoy` | Smoke UI | Scroll horizontal manual al periodo actual | Futuro |
| Create dummy | POST controlado con tarea QA | Crea fila unica sin columnas nuevas implicitas | Futuro |
| Update dummy | POST controlado con tarea QA | Actualiza solo campos permitidos | Futuro |
| Disable dummy | POST controlado con tarea QA | Cancela logicamente sin borrar fila | Futuro |
| Campos obligatorios | Payload incompleto | Apps Script rechaza sin escribir | Futuro |
| Enums validos | `fase` / `estado` permitidos | Operacion aceptada | Futuro |
| Enums invalidos | `fase` / `estado` fuera de catalogo | Operacion rechazada | Futuro |
| Dependencia valida | `dependencia` apunta a `task_id` existente | Operacion aceptada | Futuro |
| Dependencia invalida | `dependencia` inexistente | Operacion rechazada | Futuro |
| Compatibilidad headers | `ID Tarea`, `Inicio plan`, `Fin plan` | Front y Apps Script siguen resolviendo aliases | Futuro |

Notas:

- 32B no ejecuta smoke real, POST ni submit.
- La matriz queda preparada para etapas 32C-32G.

### Etapa 32D: compatibilidad minima Timeline / Ver en Gantt

**Estado:** implementado localmente; sin POST real ni cambios en Google Sheets.

| Validacion | Metodo | Resultado | Estado |
|---|---|---|---|
| Alias visual | Revision `Gantt.gs` | `Ver en Gantt` resuelve como alias de `visible_gantt` | OK |
| Aliases existentes | Revision `Gantt.gs` | Se conservan `visible_gantt`, `visible` y `Visible Gantt` | OK |
| Disable `hide` | Smoke mockeado con header `Ver en Gantt` | Escribe `No` en la columna visual | OK |
| Disable `hide_and_cancel` | Smoke mockeado con header `Ver en Gantt` | Escribe `No` y `Estado = Cancelado` | OK |
| Disable `cancel` | Smoke mockeado con header `Ver en Gantt` | No depende de `visible_gantt`; cancela por estado/comentario | OK |
| Compatibilidad update | Smoke mockeado `gantt_task_update` | Sigue OK | OK |
| Compatibilidad create | Smoke mockeado `gantt_task_create` | Sigue OK | OK |
| Contratos | Revision de alcance | Sin cambios en endpoints, payloads, responses ni frontend | OK |

Notas:

- 32C detecto el gap de alias y 32D agrega compatibilidad sin tocar datos.
- `Ver en Gantt` queda como alias visual aceptado para `visible_gantt`.
- La decision funcional sobre si `visible_gantt` seguira o se retirara queda pendiente.
- No se limpio ni modifico Google Sheets.

### Etapa 32E: plan de saneamiento real Timeline

**Estado:** documentado; sin cambios en Google Sheets.

Documento principal: `docs/timeline-data-cleanup-plan.md`.

| Validacion | Metodo | Resultado | Estado |
|---|---|---|---|
| CSV publicado | Lectura solo consulta | Accesible; headers visuales en fila 3 confirmados | OK |
| Conteos 32C | Lectura CSV / consolidacion documental | 77 filas, 57 tareas `SPT-*`, 44 renderizables, 12 sin plan | OK |
| Problemas priorizados | Revision documental | Criticos, medios, bajos y decisiones pendientes separados | OK |
| Plan por etapas | Revision documental | 32F-32J definidos sin cambios destructivos inmediatos | OK |
| Matriz de correcciones | Revision documental | Accion, responsable, riesgo y etapa sugerida documentados | OK |
| Reglas manuales | Revision documental | Backup, no borrar filas, no renombrar headers, no cambiar IDs | OK |
| Recomendacion final | Revision documental | Primero reporte automatico/checklist; luego saneamiento manual controlado | OK |
| Alcance | Revision de diff | Solo documentacion modificada | OK |

Notas:

- No se ejecuto POST real ni submit real.
- No se modificaron Google Sheets, Excel, HTML, JS, Apps Script, endpoints, payloads, config, assets, `public/` ni `legacy/`.

### Etapa 32F: reporte automatico de inconsistencias Timeline

**Estado:** implementado localmente; auditoria read-only.

Artefactos:

- `tools/audit-timeline-data.js`
- `docs/timeline-data-audit-report.md`

| Validacion | Metodo | Resultado | Estado |
|---|---|---|---|
| Ejecucion script | `node tools/audit-timeline-data.js` | Genera reporte Markdown | OK |
| Fuente CSV | HTTPS GET publicado | Sin credenciales, sin POST | OK |
| Reporte generado | Revision de archivo | `docs/timeline-data-audit-report.md` existe | OK |
| Conteos principales | Reporte | 77 filas CSV, 57 tareas `SPT-*`, 44 renderizables | OK |
| Campos minimos | Reporte | Detecta estado, fase, hito, responsable y fechas plan faltantes | OK |
| Fechas | Reporte | Detecta fechas invalidas/no canonicas | OK |
| Dependencias | Reporte | Detecta `SPT-002-T-23 -> SPT-002-T-22` | OK |
| Filas no productivas | Reporte | Lista filas no `SPT-*` | OK |
| Catalogos sugeridos | Reporte | Valida fase y estado contra catalogos sugeridos | OK |
| Columnas derivables | Reporte | Detecta `Atraso (dias)` presente | OK |
| Alcance | Revision de diff | Sin cambios funcionales | OK |

Notas:

- No se modifico Google Sheets, Excel, HTML, JS, Apps Script, endpoints, payloads, config, assets, `public/` ni `legacy/`.
- No se ejecuto POST real ni submit real.
