# Estrategia de Assets Compartidos

Etapa: 5A auditoria y estrategia documental.

Alcance:

- Solo auditoria y propuesta.
- Sin modificaciones en paginas HTML.
- Sin extraccion de CSS o JavaScript.
- Sin cambios de diseno, logica, endpoints, payloads, Apps Script, redirects o legacy.

## Diagnostico actual

El proyecto ya tiene estructura futura creada en `assets/`, pero la mayor parte de los recursos visuales, estilos y scripts siguen embebidos dentro de cada HTML. Esto es correcto para la fase actual porque preserva comportamiento y reduce riesgo, pero deja duplicacion tecnica que debe abordarse por etapas.

Hallazgos principales:

- Topbars repetidas en `index.html`, Backlog, Gantt Operativo, Gantt Seller Center, Gestion de Sellers, paginas de estrategia, Presentacion Seller y Simulador Seller.
- Sidebars repetidas en Backlog, Gantt Operativo, Gantt Seller Center, Seller Center, Maqueta Seller Center y varias paginas de estrategia.
- Tokens visuales duplicados: verdes Sporting, fondos oscuros, bordes, radios, tipografias Barlow/Barlow Condensed, sombras, estados `ok/warn/danger/info` y paddings.
- Botones repetidos con nombres distintos: `btn`, `tb-btn`, `btn-top`, `qbtn`, `share-btn`, `mode-btn`, `section-nav-btn`, `cta-secondary`.
- Cards repetidas para sellers, audience/modelo/economico, KPIs, condiciones, servicios, paneles, estados y formularios.
- Tablas, modales, filtros y KPIs aparecen especialmente en Backlog, Gantt y simuladores.
- Parsers CSV y helpers de normalizacion aparecen copiados en Backlog, Gantt, formularios, presentacion y simuladores.
- Manejo de `seller_id` via `URLSearchParams` se repite en Gestion de Sellers, formularios, presentacion y simuladores.
- Logica de logos aparece en tres variantes: candidatos por `seller_id`, `logo_url` desde CSV y fallback por iniciales.
- Navegacion y rutas estan parcialmente centralizadas en `assets/js/config.js`, pero muchas paginas todavia tienen rutas hardcodeadas.
- `config.js` en raiz y `assets/js/config.js` existen duplicados. La copia en `assets/js/` ya permite que paginas internas como Gestion de Sellers resuelvan `../../assets/js/config.js`.
- `Logos/` contiene logos locales `spt-001.png` a `spt-015.png`. `assets/logos/` existe pero aun no contiene copias funcionales.

## Propuesta de estructura futura

Estructura CSS propuesta:

```text
assets/css/
├─ tokens.css
├─ base.css
├─ layout.css
├─ components.css
├─ forms.css
└─ pages/
   ├─ backlog.css
   ├─ gantt.css
   ├─ seller-center.css
   ├─ simuladores.css
   └─ public-seller.css
```

Estructura JS propuesta:

```text
assets/js/
├─ config.js
├─ routes.js
├─ csv.js
├─ sellers.js
├─ logos.js
├─ navigation.js
├─ forms.js
├─ helpers.js
├─ components/
│  ├─ topbar.js
│  ├─ sidebar.js
│  ├─ modal.js
│  └─ toast.js
├─ data/
│  ├─ sheets.js
│  └─ cache.js
└─ pages/
   ├─ backlog.js
   ├─ gestion-sellers.js
   ├─ gantt-operativo.js
   ├─ gantt-seller-center.js
   ├─ simulador-economico.js
   ├─ simulador-seller.js
   ├─ formulario-calificacion.js
   └─ formulario-relevamiento.js
```

Estructura assets propuesta:

```text
assets/
├─ logos/
│  ├─ spt-001.png
│  ├─ spt-002.png
│  └─ ...
├─ images/
├─ css/
└─ js/
```

## CSS compartido

### `tokens.css`

Debe concentrar variables visuales de bajo riesgo:

- Colores de marca: verde Sporting, verde hover, verdes suaves.
- Escala neutral: fondos oscuros, superficies, texto primario/secundario/terciario.
- Estados: success, warning, danger, info.
- Bordes y radios.
- Sombras.
- Tipografias.
- Z-index base.
- Espaciados recurrentes.

Criterio: extraer primero solo tokens que ya aparecen de forma consistente y que no cambian valores visuales.

### `base.css`

Debe contener resets y base comun:

- `box-sizing`.
- `body`.
- Links.
- Botones e inputs con font heredada.
- Tipografia base.
- Helpers de accesibilidad.
- Utilidades minimas como `.hidden`.

Criterio: aplicar primero a una pagina piloto con comparacion visual manual.

### `layout.css`

Debe cubrir patrones estructurales:

- Topbar base.
- Sidebar base.
- Shell/grid de pagina.
- Contenedores principales.
- Responsive base para ocultar sidebar o compactar topbar.

Criterio: no intentar unificar todas las variantes al inicio. Crear clases nuevas y migrar pagina por pagina.

### `components.css`

Debe contener componentes comunes:

- Botones.
- Cards.
- KPIs.
- Chips/pills.
- Badges.
- Tablas.
- Modales.
- Toasts.
- Estados vacios/carga/error.
- Filtros.

Criterio: empezar por componentes pasivos y de bajo riesgo visual, como badges, chips, botones y estados.

### `forms.css`

Debe cubrir formularios publicos y Gestion de Sellers:

- Labels.
- Inputs/selects/textareas.
- Grids de campos.
- Estados de error/exito.
- Botones de submit.
- Secciones condicionales.
- Progress/navigation de formularios.

Criterio: no extraer en 5B. Formularios son de alto riesgo por escritura real y validaciones.

### CSS especifico por pagina

Las paginas con logica visual densa deben conservar CSS propio durante varias etapas:

- Backlog: cards, kanban, tabla, modal y filtros.
- Gantt Operativo: timeline, dependencias, modal y agrupaciones.
- Simuladores: formulas, KPIs y paneles de resultados.
- Formularios: secciones, progresos y condicionales.

## JS compartido

### `config.js`

Debe ser la fuente futura de:

- `BASE_URL`.
- Apps Script URL.
- CSV compartidos.
- Rutas internas y publicas.
- Base de assets/logos.
- Catalogo de recursos.

Estado actual:

- `assets/js/config.js` ya existe.
- `config.js` en raiz se mantiene como legacy temporal.
- Ambos contienen el mismo contenido.

Regla recomendada: no eliminar ni editar `config.js` raiz hasta etapa legacy/redirects.

### `routes.js`

Debe resolver rutas sin hardcodearlas en cada pagina:

- `toAbsoluteUrl(path)`.
- `withSellerId(path, sellerId)`.
- `getPublicRoute(key)`.
- `getInternalRoute(key)`.
- Compatibilidad con GitHub Pages.

Piloto sugerido: `index.html` o paginas informativas internas, no formularios.

### `csv.js`

Debe cubrir:

- `parseCSV(text)`.
- `csvToObjects(text, keyTests)`.
- Normalizacion de headers.
- Cache busting `_ts`.
- `fetchCSV(url, options)`.
- Manejo de errores.

Candidatas: Gantt Seller Center y Gantt Operativo comparten mayor parte del problema, pero tienen riesgo medio/alto. Conviene auditar primero y extraer despues de smoke test.

### `sellers.js`

Debe cubrir:

- Normalizacion de `seller_id`.
- Busqueda por `seller_id`.
- Pick de columnas alias: `seller_nombre`, `marca`, `logo_url`.
- Iniciales del seller.
- Helpers para seller actual desde query param.

Candidatas: Presentacion Seller y Simulador Seller, porque son publicas y comparten lectura de seller sin escribir datos.

### `logos.js`

Debe cubrir:

- `getSellerLogoFromRow(row)`.
- `normalizeLogoUrl(url)`.
- Candidatos por `seller_id`.
- Fallback por iniciales.
- Manejo de error de imagen.
- Soporte a Google Drive directo.
- Soporte futuro a `/assets/logos/spt-001.png`.

Piloto sugerido: Presentacion Seller, luego Simulador Seller. Backlog usa candidatos por extensiones y requiere mas cuidado.

### `navigation.js`

Debe cubrir:

- Topbar comun.
- Link activo.
- Sidebars internas.
- Links al hub.
- Navegacion entre paginas migradas.

Candidatas: paginas informativas de `internal/estrategia/`, porque tienen menor riesgo funcional.

### `forms.js`

Debe cubrir solo despues de smoke test:

- Validacion comun.
- Bloqueo sin `seller_id`.
- Mensajes de estado.
- Serializacion `formToObject`.
- Helpers de submit.

No conviene tocar todavia porque formularios escriben datos reales y tienen validaciones especificas.

### `helpers.js`

Debe cubrir utilidades transversales:

- `$`.
- `escapeHtml`.
- `normalizeKey`.
- `pick`.
- `formatCurrency`.
- `formatPercent`.
- `debounce` si aparece en futuras iteraciones.

Conviene crear helpers por necesidad, no como bolsa generica inicial.

## Estrategia para logos y assets

Estado actual:

- `Logos/` contiene archivos locales `spt-001.png` a `spt-015.png`.
- `assets/logos/` existe, pero esta vacia salvo `.gitkeep`.
- Varias paginas no consumen `Logos/` directamente; usan `logo_url` desde CSV o `LOGO_BASE_URL` configurado hacia GitHub Pages.

Estrategia recomendada:

1. No mover `Logos/` todavia.
2. Copiar logos a `assets/logos/` en una etapa controlada, manteniendo `Logos/` como legacy.
3. No cambiar referencias HTML en la misma etapa de copia.
4. Actualizar `assets/js/config.js` solo cuando se valide que GitHub Pages sirve correctamente `/assets/logos/`.
5. Cambiar referencias por pagina, empezando por paginas publicas sin escritura.
6. Mantener fallback a `logo_url` de CSV y a iniciales.
7. Recién en etapa legacy evaluar redirects o retiro de `Logos/`.

Orden recomendado para logos:

- 5B: copiar `Logos/spt-*.png` a `assets/logos/` sin tocar paginas.
- 5C: validar carga directa de `/assets/logos/spt-001.png` en GitHub Pages/local.
- 5D: ajustar `LOGO_BASE_URL` o helper de logos en pagina piloto.
- 5E: migrar referencias por pagina con smoke test visual.

## Estrategia incremental

### Etapa 5B: inventario fisico y copia segura de logos

Objetivo: copiar logos legacy a `assets/logos/` sin cambiar referencias.

Riesgo: bajo.

Validacion:

- Comparar cantidad y nombres.
- Confirmar que `Logos/` sigue existiendo.
- Confirmar que no se modifican HTML.

### Etapa 5C: tokens CSS piloto

Objetivo: crear `assets/css/tokens.css` y `assets/css/base.css` sin aplicarlos globalmente, o aplicarlos solo a `index.html` si se aprueba.

Riesgo: bajo si no se aplican; medio si se aplican a una pagina.

Piloto sugerido:

- `index.html`, porque es institucional y no tiene escritura.
- Alternativa: una pagina informativa de `internal/estrategia/`.

### Etapa 5D: rutas y helpers no invasivos

Objetivo: crear `assets/js/routes.js` y documentar consumo futuro sin reemplazar logica.

Riesgo: bajo si no se consume; medio si se conecta a paginas.

Piloto sugerido:

- `index.html`.
- `internal/estrategia/governance.html`.

### Etapa 5E: piloto de logos compartidos

Objetivo: crear `assets/js/logos.js` y probar en una pagina publica sin escritura.

Riesgo: medio.

Piloto sugerido:

- `public/presentaciones/presentacion-seller.html`.
- Luego `public/simuladores/simulador-seller.html`.

No usar como primer piloto:

- Backlog.
- Gestion de Sellers.
- Formularios.

### Etapa 5F: CSV helpers

Objetivo: crear `assets/js/csv.js` y migrar una pagina de datos de riesgo medio.

Riesgo: medio/alto.

Piloto sugerido:

- `internal/gantt/gantt-seller-center.html`.

Evitar al inicio:

- Backlog, porque combina CSV, filtros, cards, modal y links operativos.
- Formularios, porque escriben datos.

### Etapa 5G: componentes visuales

Objetivo: extraer componentes comunes de bajo impacto.

Orden sugerido:

1. Badges/chips.
2. Botones secundarios.
3. Estados vacios/carga/error.
4. Cards informativas.
5. Topbar.
6. Sidebar.
7. Modales.
8. Tablas y filtros.

Riesgo: crece segun componente. Topbar y sidebar parecen simples, pero afectan navegacion y responsive.

## Paginas candidatas para piloto

Bajo riesgo:

- `index.html`.
- `internal/estrategia/governance.html`.
- `internal/estrategia/modelo-integracion.html`.
- `internal/estrategia/modelo-economico.html`.

Riesgo medio:

- `public/presentaciones/presentacion-seller.html`.
- `public/simuladores/simulador-seller.html`.
- `internal/gantt/gantt-seller-center.html`.

Alto riesgo:

- `internal/backlog/backlog-sellers.html`.
- `internal/backlog/gestion-sellers.html`.
- `internal/gantt/gantt-operativo.html`.
- `internal/simuladores/simulador-economico.html`.
- `public/formularios/formulario-calificacion.html`.
- `public/formularios/formulario-relevamiento.html`.

## Que no tocar todavia

- Apps Script.
- Endpoints.
- Payloads.
- Submit de formularios.
- Generacion o reserva de `seller_id`.
- `localStorage`.
- Formulas de simuladores.
- CSV URLs.
- CSS/JS inline de formularios.
- Modales y filtros del Backlog.
- Timeline de Gantt Operativo.
- `Logos/` legacy.
- `config.js` raiz.
- Redirects desde archivos versionados.

## Rollback

Cada extraccion debe poder revertirse por pagina:

- Mantener una copia funcional previa en raiz o en ruta migrada.
- Aplicar CSS/JS compartido a una sola pagina por etapa.
- No mezclar extraccion CSS y extraccion JS en la misma pagina.
- Mantener inline original hasta validar equivalencia visual/funcional.
- Usar commits chicos por etapa.
- Completar smoke test antes de avanzar.

## Validaciones obligatorias por etapa

- `git diff --name-only` limitado al alcance.
- Smoke test visual desktop/mobile.
- Consola sin errores nuevos.
- Links locales sin 404.
- CSV siguen cargando.
- Logos tienen fallback.
- Formularios no ejecutan submit real salvo etapa autorizada.
- GitHub Pages conserva rutas existentes.

## Estado de ejecucion

### Etapa 5B: copia segura de logos

Estado: completada.

Resultado:

- Se copiaron 15 archivos `spt-*.png` desde `Logos/` hacia `assets/logos/`.
- Los nombres se mantuvieron exactamente iguales.
- La carpeta `Logos/` se mantiene intacta como legacy temporal.
- No se actualizaron referencias en paginas.
- No se modifico `LOGO_BASE_URL`.
- No se modificaron `config.js` ni `assets/js/config.js`.
- La copia fue validada por cantidad, tamaño y hash SHA256.

Archivos copiados:

- `spt-001.png`
- `spt-002.png`
- `spt-003.png`
- `spt-004.png`
- `spt-005.png`
- `spt-006.png`
- `spt-007.png`
- `spt-008.png`
- `spt-009.png`
- `spt-010.png`
- `spt-011.png`
- `spt-012.png`
- `spt-013.png`
- `spt-014.png`
- `spt-015.png`

Pendiente:

- Validar carga directa de `/assets/logos/spt-001.png` en local/GitHub Pages.
- Definir en etapa separada si `LOGO_BASE_URL` debe apuntar a `/assets/logos/`.
- Migrar referencias por pagina solo despues de smoke test visual.

### Etapa 5C: validacion de carga local de logos

Estado: completada.

Resultado:

- Se validaron los 15 archivos `assets/logos/spt-001.png` a `assets/logos/spt-015.png`.
- Todos los archivos existen.
- Todos los archivos tienen firma PNG valida.
- Todos los archivos abren correctamente como imagen local.
- Todas las imagenes reportan dimensiones `200x200`.
- La ruta relativa `assets/logos/spt-001.png` resuelve correctamente desde la raiz del repositorio.

Alcance preservado:

- No se modificaron paginas HTML.
- No se cambiaron referencias.
- No se modifico `LOGO_BASE_URL`.
- No se modificaron `config.js` ni `assets/js/config.js`.
- No se movio ni elimino `Logos/`.
- No se tocaron Apps Script ni redirects.

Pendiente:

- Validar disponibilidad desde GitHub Pages cuando la rama correspondiente este publicada.
- Definir una etapa separada para ajustar referencias o `LOGO_BASE_URL`, si corresponde.

### Etapa 5D: auditoria de consumo actual de logos

Estado: completada a nivel documental.

Alcance:

- Solo auditoria de consumo.
- Sin cambios en HTML, referencias, `LOGO_BASE_URL`, `config.js`, `assets/js/config.js`, `Logos/`, Apps Script o redirects.

Hallazgos principales:

- No se detecto consumo directo de `Logos/` en las paginas auditadas.
- `assets/logos/` ya existe con los archivos copiados, pero todavia no es consumido por referencias relativas dentro de paginas.
- `config.js` y `assets/js/config.js` exponen `ASSETS.LOGO_BASE_URL` apuntando a la URL absoluta de GitHub Pages `/assets/logos/`.
- Backlog y Gestion de Sellers generan candidatos de logo a partir de `seller_id` y `LOGO_BASE_URL`.
- Presentacion Seller, Simulador Seller y formularios publicos consumen principalmente `logo_url`, `logo`, `url_logo` o variantes desde CSV/query params.
- Todas las paginas con logo de seller tienen fallback visual por iniciales o bloque equivalente.
- Las paginas informativas internas no dependen de logos de seller; solo muestran marca textual `Sporting Marketplace`.

Tabla de consumo:

| Pagina | Fuente actual de logo | Fallback | Depende de `seller_id` | Ruta usada | Riesgo de cambio | Observaciones |
|---|---|---|---|---|---|---|
| `internal/backlog/backlog-sellers.html` | `LOGO_BASE_URL` + `seller_id` via `logoCandidates()` y `logoHTML()` | Iniciales en cards, tabla y modal | Si | Absoluta GitHub Pages desde config inline | Alto | Afecta cards, tabla, modal y experiencia operativa. No usar como piloto. |
| `backlog-sellers_v27.html` | Igual que copia migrada | Iniciales | Si | Absoluta GitHub Pages desde config inline | Alto | Legacy raiz; no tocar hasta etapa de compatibilidad. |
| `internal/backlog/gestion-sellers.html` | `MP_CONFIG.ASSETS.LOGO_BASE_URL` o fallback inline + `seller_id` | `logo-fallback` por iniciales | Si | Absoluta GitHub Pages desde `assets/js/config.js` o fallback | Alto | Pagina con escritura real y reserva de IDs. No usar como piloto. |
| `gestion-sellers_v7.html` | Igual que copia migrada | `logo-fallback` | Si | Depende de ruta `../../assets/js/config.js` en copia; legacy conserva referencia relativa no ideal | Alto | Legacy raiz no debe tocarse. |
| `public/presentaciones/presentacion-seller.html` | `logo_url`, `logo`, `url_logo`, `imagen_logo` desde CSV o `logo/logo_url` query param | Iniciales en seller card y ocultamiento de top logo | Si, para buscar seller | URL desde CSV/query; puede ser absoluta o relativa segun dato | Medio | Mejor candidata para piloto de helper de logos porque no escribe datos. |
| `presentacion-seller_v3.html` | Igual que copia migrada | Iniciales | Si | URL desde CSV/query | Medio | Legacy raiz no tocar. |
| `public/simuladores/simulador-seller.html` | `logo_url`, `logo`, `url_logo`, `Logo`, `logo_seller`, `imagen`, `image_url` desde CSV/query | Iniciales | Si, para personalizacion y overrides | URL desde CSV/query, con normalizacion Google Drive | Medio | Segunda candidata, pero combina calculos y CTA. |
| `simulador-seller_v12.html` | Igual que copia migrada | Iniciales | Si | URL desde CSV/query | Medio/Alto | Legacy raiz no tocar. |
| `public/formularios/formulario-calificacion.html` | `logo_url`, `logo`, `url_logo` desde CSV | Iniciales | Si, obligatorio | URL desde CSV | Alto | Formulario con submit real. No usar como piloto. |
| `formulario-calificacion_v2.html` | Igual que copia migrada | Iniciales | Si | URL desde CSV | Alto | Legacy raiz no tocar. |
| `public/formularios/formulario-relevamiento.html` | `logo_url`, `logo`, `url_logo` desde CSV | Iniciales | Si, obligatorio | URL desde CSV | Critico | Formulario mas sensible y riesgo `pctSec`. No usar como piloto. |
| `formulario-relevamiento_v2.html` | Igual que copia migrada | Iniciales | Si | URL desde CSV | Critico | Legacy raiz no tocar. |
| `internal/seller-center/index.html` | Marca textual, sin logo seller operativo detectado | No aplica | No | No aplica | Bajo | Puede quedar fuera de migracion de logos seller. |
| `internal/seller-center/maqueta-seller-center.html` | Logo estatico `AL` textual en maqueta | No aplica | No | No aplica | Bajo | No representa consumo real de logos seller. |
| `internal/estrategia/*.html` | Marca textual `Sporting Marketplace` | No aplica | No | No aplica | Bajo | Sin consumo de logos seller. |
| `internal/gantt/*.html` | Marca textual `Sporting Marketplace` | No aplica | No | No aplica | Bajo/Medio | No consume logos seller segun auditoria actual. |
| `internal/simuladores/simulador-economico.html` | Sin consumo de logo seller detectado | No aplica | No | No aplica | Medio | Tiene datos y formulas; no tocar por logos. |

Riesgos:

- Cambiar `LOGO_BASE_URL` globalmente puede afectar Backlog y Gestion de Sellers de forma inmediata.
- Cambiar `config.js` raiz puede impactar legacy si alguna pagina lo consume en el futuro.
- Cambiar `assets/js/config.js` puede afectar Gestion de Sellers migrada.
- Cambiar formularios puede comprometer flujos publicos con escritura real.
- Usar rutas relativas desde paginas profundas requiere cuidado: desde `public/presentaciones/`, `../..` llega a raiz; desde `internal/backlog/`, tambien requiere `../../`.
- Las URL de logos desde CSV pueden ser Google Drive, absolutas o vacias; deben convivir con fallback local.

Estrategia segura recomendada:

1. No cambiar `LOGO_BASE_URL` todavia.
2. No cambiar `config.js` ni `assets/js/config.js` como primer paso.
3. Crear primero una funcion piloto local o helper futuro que pruebe `logo_url` de CSV y luego fallback a `/assets/logos/{seller_id}.png`.
4. Aplicar el primer piloto solo en `public/presentaciones/presentacion-seller.html`.
5. Mantener fallback por iniciales intacto.
6. Validar con `seller_id=SPT-001`, `seller_id=SPT-015`, seller sin logo y sin `seller_id`.
7. Si el piloto funciona, repetir en `public/simuladores/simulador-seller.html`.
8. Recién despues evaluar Backlog y Gestion de Sellers.

Propuesta de piloto:

- Pagina: `public/presentaciones/presentacion-seller.html`.
- Riesgo: medio.
- Motivo: es publica, usa personalizacion por seller, tiene logo principal y `topSellerLogo`, no ejecuta submit ni escribe datos.
- Enfoque futuro: mantener `logo_url` del CSV como primera prioridad y agregar fallback local a `../../assets/logos/{seller_id}.png`.
- No cambiar todavia: formularios, Backlog, Gestion de Sellers, `LOGO_BASE_URL`, `config.js`, `assets/js/config.js`.

Validaciones necesarias para el piloto futuro:

- Carga con `?seller_id=SPT-001`.
- Carga con `?seller_id=SPT-015`.
- Carga con seller sin `logo_url` en CSV.
- Carga sin `seller_id`.
- Logo visible en card principal.
- `topSellerLogo` visible si corresponde.
- Fallback por iniciales si falla el logo.
- Consola sin 404 inesperados ni errores JS.
- Comparacion visual antes/despues.

Rollback:

- Revertir solo la pagina piloto.
- Mantener `assets/logos/` sin cambios.
- No tocar config global.
- Conservar fallback por iniciales como salida segura.

### Etapa 5E: piloto controlado de fallback local en Presentacion Seller

Estado: completada.

Resultado:

- Se aplico el piloto solo en `public/presentaciones/presentacion-seller.html`.
- `logo_url` del CSV conserva prioridad principal.
- Query params `logo` y `logo_url` conservan prioridad antes del fallback local.
- Si no existe logo desde CSV/query, la pagina intenta cargar `../../assets/logos/{seller_id}.png`.
- El `seller_id` se conserva sin cambios para busqueda, CTAs y personalizacion.
- El nombre de archivo local se normaliza a minusculas para coincidir con `spt-001.png` a `spt-015.png`.
- Si el logo local falla, se mantiene el fallback visual por iniciales.
- No se modifico `presentacion-seller_v3.html`.
- No se modificaron Backlog, Gestion de Sellers, formularios, simuladores, configuracion global, Apps Script ni redirects.

Validaciones realizadas:

- Prioridad confirmada: `logoUrl || logoParam || localLogoFallback()`.
- Ruta local confirmada: `../../assets/logos/${sellerId.toLowerCase()}.png`.
- Fallback final por iniciales preservado mediante `logo.onerror=hideLogo`.
- CTAs preservados mediante `setCtaLinks()` sin cambios.
- Archivo legacy en raiz verificado sin modificaciones.

Validaciones manuales pendientes:

- Abrir `public/presentaciones/presentacion-seller.html?seller_id=SPT-001`.
- Confirmar que carga el logo local si el CSV no provee `logo_url`.
- Probar con un seller con `logo_url` en CSV y confirmar que mantiene prioridad.
- Probar con seller sin logo local y confirmar fallback por iniciales.
- Revisar consola por 404 esperados/no esperados.

### Etapa 5F: fallback local en Simulador Seller

Estado: completada.

Resultado:

- Se aplico el criterio validado en Presentacion Seller solo en `public/simuladores/simulador-seller.html`.
- `logo_url` del CSV conserva prioridad principal mediante `getSellerLogoFromRow(SELLER)`.
- Query params `logo` y `logo_url` conservan prioridad antes del fallback local.
- Si no existe logo desde CSV/query, la pagina intenta cargar `../../assets/logos/{seller_id}.png`.
- El `seller_id` se conserva sin cambios para seleccion, CTAs, overrides y personalizacion.
- El nombre de archivo local se normaliza a minusculas para coincidir con `spt-001.png` a `spt-015.png`.
- Si el logo local falla, se mantiene el fallback visual por iniciales.
- No se modifico `simulador-seller_v12.html`.
- No se modificaron Backlog, Gestion de Sellers, formularios, Presentacion Seller, configuracion global, Apps Script ni redirects.
- No se modificaron formulas, calculos, tarifas, overrides ni escenarios.

Validaciones realizadas:

- Prioridad confirmada: `getSellerLogoFromRow(SELLER) || params.get("logo") || params.get("logo_url") || localLogoFallback()`.
- Ruta local confirmada: `../../assets/logos/${CURRENT_SELLER_ID.toLowerCase()}.png`.
- Fallback final por iniciales preservado mediante `logoEl.onerror`.
- CTAs preservados mediante `topbarCta.href` sin cambios.
- Funciones economicas `calculate()`, `render()`, `renderSvcImpact()` y `parseOverrides()` sin cambios funcionales.
- Archivo legacy en raiz verificado sin modificaciones.

Validaciones manuales pendientes:

- Abrir `public/simuladores/simulador-seller.html?seller_id=SPT-001`.
- Confirmar que carga el logo local si el CSV no provee `logo_url`.
- Probar con un seller con `logo_url` en CSV/query y confirmar que mantiene prioridad.
- Probar con seller sin logo local y confirmar fallback por iniciales.
- Revisar que calculos, tarifas, overrides, escenarios y CTAs sigan funcionando.

### Etapa 5G: auditoria previa de logos en formularios publicos

Estado: completada a nivel documental.

Alcance:

- Solo auditoria de `public/formularios/formulario-calificacion.html` y `public/formularios/formulario-relevamiento.html`.
- Sin cambios en HTML, referencias, validaciones, submit, payloads, endpoints, Apps Script, config, Backlog, Gestion de Sellers, simuladores, Presentacion Seller o redirects.

Hallazgos comunes:

- Ambos formularios cargan identidad del seller desde `SELLERS_CSV_URL` usando `seller_id` obligatorio por query param.
- Ambos tienen `sellerLogo`, `sellerInitials`, `safeUrl()`, `initials()` y `renderSellerIdentity(seller)`.
- Ambos priorizan actualmente `seller.logo_url || seller.logo || seller.url_logo`.
- Ambos validan la URL con `safeUrl()`, que acepta solo protocolos `http:` y `https:`.
- Ambos mantienen fallback visual por iniciales cuando no hay logo o cuando falla la carga de la imagen.
- Ambos tienen submit real hacia Apps Script y no deben usarse como primer terreno de prueba sin smoke test.

Tabla de auditoria:

| Formulario | Carga actual de logo | Query params logo | Fallback actual | Punto natural para fallback local | Riesgo | Observaciones |
|---|---|---|---|---|---|---|
| `public/formularios/formulario-calificacion.html` | `safeUrl(seller.logo_url || seller.logo || seller.url_logo)` dentro de `renderSellerIdentity()` | No usa `logo`/`logo_url` de query para identidad | `sellerInitials` via `sellerLogo.onerror` o ausencia de `logoUrl` | Despues de `safeUrl(...)`, antes del bloque `if (logoUrl)` | Alto | Es el candidato mas razonable para 5H porque el flujo es mas corto que Relevamiento. No tocar submit ni payload. |
| `public/formularios/formulario-relevamiento.html` | `safeUrl(seller.logo_url || seller.logo || seller.url_logo)` dentro de `renderSellerIdentity()` | No usa `logo`/`logo_url` de query para identidad | `sellerInitials` via `sellerLogo.onerror` o ausencia de `logoUrl` | Despues de `safeUrl(...)`, antes del bloque `if (logoUrl)` | Critico | Formulario mas extenso, con condicionales y riesgo pendiente `pctSec` en `updateProgress`. Conviene esperar a validar Calificacion. |

Diferencias relevantes:

- Calificacion tiene menos secciones, menor superficie de interaccion y menor dependencia de condicionales.
- Relevamiento tiene mas campos, secciones condicionales, progreso por seccion y riesgo conocido `pctSec`.
- Ambos comparten el mismo patron de logo, por lo que el cambio tecnico seria similar, pero el riesgo operativo no lo es.

Estrategia segura recomendada:

1. No modificar ambos formularios en la misma etapa.
2. Aplicar primero en `public/formularios/formulario-calificacion.html`.
3. Mantener prioridad de `logo_url`, `logo` y `url_logo` desde CSV.
4. Agregar fallback local solo si `safeUrl(...)` queda vacio.
5. Usar `../../assets/logos/${sellerId.toLowerCase()}.png`.
6. Mantener `sellerLogo.onerror` como fallback final por iniciales.
7. No tocar `seller_id`, `SELLERS_CSV_URL`, `ENDPOINT_URL`/`APPS_SCRIPT_URL`, payload, validaciones ni submit.
8. Recién despues de smoke test de Calificacion evaluar Relevamiento.

Orden recomendado:

- 5H: aplicar fallback local solo en `public/formularios/formulario-calificacion.html`.
- 5I: smoke test manual de Calificacion, sin submit real.
- 5J: aplicar fallback local en `public/formularios/formulario-relevamiento.html` solo si 5I cierra sin incidentes.
- 5K: smoke test manual de Relevamiento, con foco adicional en `pctSec`.

Archivos permitidos para la siguiente etapa:

- `public/formularios/formulario-calificacion.html`
- `docs/assets-strategy.md`
- `docs/roadmap.md`
- `CHANGELOG.md`

Que no tocar:

- `formulario-calificacion_v2.html`
- `public/formularios/formulario-relevamiento.html` durante 5H
- `formulario-relevamiento_v2.html`
- Apps Script
- endpoints
- payloads
- validaciones
- submit
- Backlog
- Gestion de Sellers
- Presentacion Seller
- Simulador Seller
- `config.js`
- `assets/js/config.js`
- `LOGO_BASE_URL`

Rollback:

- Revertir solo el cambio en el formulario piloto.
- Mantener `assets/logos/` sin cambios.
- Conservar `sellerInitials` como fallback final.
- No tocar configuracion global.

Smoke test posterior recomendado:

- Abrir sin `seller_id` y confirmar bloqueo esperado.
- Abrir con `?seller_id=SPT-001`.
- Confirmar prioridad de `logo_url` si existe en CSV.
- Confirmar fallback local si no existe `logo_url`.
- Confirmar iniciales si no existe logo local.
- Confirmar que campos obligatorios y validaciones siguen funcionando.
- No ejecutar submit real.
- Revisar consola por errores JS, 404 inesperados, CORS y fetch fallidos.

### Etapa 5H: fallback local en Formulario de Calificacion

Estado: completada.

Resultado:

- Se aplico fallback local solo en `public/formularios/formulario-calificacion.html`.
- `logo_url`, `logo` y `url_logo` desde CSV conservan prioridad mediante `safeUrl(...)`.
- Si no existe logo valido desde CSV, la pagina intenta cargar `../../assets/logos/{seller_id}.png`.
- El `seller_id` se conserva sin cambios para identidad, validaciones y payload.
- Si el logo local falla, se mantiene el fallback visual por iniciales mediante `sellerLogo.onerror`.
- No se modifico `formulario-calificacion_v2.html`.
- No se modifico Formulario de Relevamiento.
- No se modificaron submit, endpoint, payload, validaciones, Apps Script, config global, Backlog, Gestion de Sellers, simuladores ni Presentacion Seller.

Validaciones realizadas:

- Prioridad confirmada: `safeUrl(seller.logo_url || seller.logo || seller.url_logo) || localLogoFallback()`.
- Ruta local confirmada: `../../assets/logos/${sellerId.toLowerCase()}.png`.
- Fallback final por iniciales preservado mediante `sellerLogo.onerror`.
- Submit preservado: `fetch(ENDPOINT_URL, ...)` sin cambios.
- Payload preservado: `seller_id: sellerId` y `tipo_formulario: "calificacion"` sin cambios.
- Validaciones preservadas: `form.checkValidity()`, `hasCarrier()` y `evaluateSeller()` sin cambios.
- Archivo legacy en raiz verificado sin modificaciones.

Validaciones manuales pendientes:

- Abrir `public/formularios/formulario-calificacion.html` sin `seller_id` y confirmar bloqueo esperado.
- Abrir `public/formularios/formulario-calificacion.html?seller_id=SPT-001`.
- Confirmar prioridad de `logo_url` si existe en CSV.
- Confirmar fallback local si no existe `logo_url`.
- Confirmar iniciales si no existe logo local.
- Confirmar campos obligatorios y validaciones sin ejecutar submit real.

### Etapa 5J: fallback local en Formulario de Relevamiento

Estado: completada.

Resultado:

- Se aplico fallback local solo en `public/formularios/formulario-relevamiento.html`.
- `logo_url`, `logo` y `url_logo` desde CSV conservan prioridad mediante `safeUrl(...)`.
- Si no existe logo valido desde CSV, la pagina intenta cargar `../../assets/logos/{seller_id}.png`.
- El `seller_id` se conserva sin cambios para identidad y payload.
- Si el logo local falla, se mantiene el fallback visual por iniciales mediante `sellerLogo.onerror`.
- No se modifico `formulario-relevamiento_v2.html`.
- No se modificaron submit, endpoint, payload, validaciones, condicionales, `pctSec`, Apps Script, config global, Backlog, Gestion de Sellers, simuladores ni Presentacion Seller.

Validaciones realizadas:

- Prioridad confirmada: `safeUrl(seller.logo_url || seller.logo || seller.url_logo) || localLogoFallback()`.
- Ruta local confirmada: `../../assets/logos/${sellerId.toLowerCase()}.png`.
- Fallback final por iniciales preservado mediante `sellerLogo.onerror`.
- Submit preservado: `fetch(APPS_SCRIPT_URL, ...)` sin cambios.
- Payload preservado: `tipo_formulario: "relevamiento"` y `seller_id` sin cambios.
- Condicionales preservados: `applyConditionals()` y atributos `data-show-if` sin cambios.
- Riesgo `pctSec` preservado sin correccion, por alcance.
- Archivo legacy en raiz verificado sin modificaciones.

Validaciones manuales pendientes:

- Abrir `public/formularios/formulario-relevamiento.html` sin `seller_id` y confirmar bloqueo esperado.
- Abrir `public/formularios/formulario-relevamiento.html?seller_id=SPT-001`.
- Confirmar prioridad de `logo_url` si existe en CSV.
- Confirmar fallback local si no existe `logo_url`.
- Confirmar iniciales si no existe logo local.
- Confirmar condicionales y progreso sin corregir `pctSec`.
- No ejecutar submit real.

### Etapa 5K: auditoria de consumo de logos en Backlog y Gestion

Estado: completada a nivel documental.

Reasignacion de numeracion:

- La unica mencion previa a `5K` aparecia en la seccion 5G como recomendacion historica para un smoke test manual de Relevamiento. Ese smoke test queda cubierto por la matriz de Etapa 4.5 (`docs/test-matrix.md`) y por las validaciones pendientes registradas en 5J.
- A partir de esta entrada, la Etapa 5K queda formalmente asignada a la auditoria documental del consumo de logos en `internal/backlog/backlog-sellers.html` e `internal/backlog/gestion-sellers.html`.

Alcance:

- Solo auditoria.
- Sin cambios en HTML.
- Sin cambios en `config.js` ni `assets/js/config.js`.
- Sin cambios en `LOGO_BASE_URL`.
- Sin cambios en Apps Script, endpoints, payloads, validaciones ni `seller_id`.
- Sin movimientos en `Logos/` ni en `assets/logos/`.
- Sin redirects.
- Sin cambios en formularios, simuladores ni Presentacion Seller.
- Sin implementacion de fallback local en estas paginas todavia.

Paginas auditadas:

- `internal/backlog/backlog-sellers.html` (998 lineas).
- `internal/backlog/gestion-sellers.html` (232 lineas).

Hallazgos en Backlog:

- No carga `assets/js/config.js`. Tiene un bloque `CONFIG` inline declarado al inicio del script (alrededor de la linea 369) con `LOGO_BASE_URL` hardcodeado a `https://antonioluquin-ecomm.github.io/sporting-marketplace/assets/logos/`.
- Declara `LOGO_EXTENSIONS = ["png","webp","jpg","jpeg","svg"]` y construye candidatos por extension dentro de `logoCandidates(sellerId)`.
- Helper `safeAssetId(id)` normaliza a minusculas y reemplaza caracteres no `[a-z0-9_-]` por `-` antes de armar la URL.
- `logoHTML(s, cls, fallbackCls, sizeStyle)` retorna un `<img>` con `data-logo-candidates`, `data-logo-index`, `loading="lazy"` y `onerror="handleLogoError(...)"`.
- `handleLogoError(img, initials, fallbackCls, sizeStyle)` cicla por la lista de candidatos y, agotada la lista, reemplaza el `<img>` por un `<div>` con iniciales.
- El modal de detalle usa `m-logo` y `handleModalLogoError(logo, ini)` con el mismo patron de ciclo de candidatos + iniciales.
- Mapea `logo_url` en `ALIASES` (`["logo_url","logo","url_logo"]`) pero `logoHTML()` no consume `s.logo_url`: la resolucion de logo se hace solo a partir de `seller_id` y `LOGO_BASE_URL`. La columna del CSV se ignora en el render actual.
- Los logos se renderizan en multiples superficies: cards del kanban, tabla y modal.
- Fallback final por iniciales se calcula con `sellerInitials(nombre)`.

Hallazgos en Gestion de Sellers:

- Carga `assets/js/config.js` via `<script src="../../assets/js/config.js">` en linea 10.
- Define `FALLBACK_CONFIG` inline con `ASSETS.LOGO_BASE_URL` hardcodeado al mismo dominio absoluto que Backlog.
- Resuelve `LOGO_BASE_URL` con prioridad `CFG.ASSETS.LOGO_BASE_URL || FALLBACK_CONFIG.ASSETS.LOGO_BASE_URL`, normalizando barra final.
- `logoCandidates(id)` construye candidatos con las mismas 5 extensiones y `encodeURIComponent(sid.toLowerCase())`.
- `updateLogo(box, sellerId, name)` inserta un `<img>` en `#logoPreview`; en `img.onerror` cicla por candidatos y, agotada la lista, reemplaza con `<span class="logo-fallback">` por iniciales.
- Renderiza un unico logo en la preview del seller en edicion. No hay tabla, kanban ni modal con logo.
- No consume `logo_url` del CSV: la pagina es de gestion/escritura y solo genera la URL desde `seller_id`.
- Tiene escritura real via Apps Script (`fetch(APPS_SCRIPT_URL, {method:"POST", mode:"no-cors", ...})`), reserva de IDs en `localStorage` (`mp_reserved_seller_ids`) y next-id calculado con `nextSellerId()`.

Resumen comparativo:

| Aspecto | Backlog | Gestion de Sellers |
|---|---|---|
| Carga `assets/js/config.js` | No | Si |
| `LOGO_BASE_URL` | Inline en `CONFIG` | `CFG.ASSETS.LOGO_BASE_URL` o `FALLBACK_CONFIG` |
| Apunta a | URL absoluta GitHub Pages externa (`sporting-marketplace`) | URL absoluta GitHub Pages externa (`sporting-marketplace`) |
| Extensiones probadas | png, webp, jpg, jpeg, svg | png, webp, jpg, jpeg, svg |
| Normalizacion de id | `safeAssetId`: trim + lower + `[^a-z0-9_-] -> -` | `clean().toLowerCase()` + `encodeURIComponent` |
| Consume `logo_url` del CSV | No (mapeado en ALIASES pero no usado) | No |
| Superficies con logo | Kanban cards, tabla, modal | Preview unica |
| Manejo de error | `handleLogoError` global y `handleModalLogoError` | Closure local en `img.onerror` |
| Fallback final | `<div class="seller-initials">` o `<div class="${fallbackCls}">` | `<span class="logo-fallback">` |
| Dependencia de `seller_id` | Si | Si |
| Escritura real | No | Si (Apps Script + `localStorage`) |

Riesgos clasificados:

- Bajo:
  - Documentacion adicional sobre el patron de logos.
  - Cualquier auditoria de codigo sin tocar archivos.
- Medio:
  - Insertar fallback local solo en Backlog sin tocar `LOGO_BASE_URL`. Backlog tiene su propio bloque `CONFIG` y se puede ampliar el helper sin afectar `assets/js/config.js`.
  - Insertar fallback local solo en Gestion preservando submit. La preview es independiente del payload.
- Alto:
  - Modificar `LOGO_BASE_URL` global en `assets/js/config.js`. Cualquier cambio afecta inmediatamente a Gestion y a cualquier futura pagina que consuma config, y desincroniza con el bloque inline del Backlog.
  - Modificar el bloque `CONFIG` inline del Backlog (afecta tambien `SELLERS_URL`, `RELEVAMIENTOS_URL`, `PUBLIC_BASE_URL` y rutas operativas).
  - Apuntar a la URL externa (`antonioluquin-ecomm.github.io/sporting-marketplace/assets/logos/`) sin confirmar que ese GitHub Pages externo sirve los mismos logos que `assets/logos/` de este repositorio.
- Critico:
  - Tocar submit, payload, endpoint, validaciones, `seller_id`, `nextSellerId`, `reserveSellerId` o `localStorage` en Gestion. Ningun cambio de logo justifica acercarse a ese codigo.
  - Romper el fallback por iniciales en Backlog. Es la salida segura cuando no hay logo y se invoca en cards, tabla y modal.
  - Cambios masivos simultaneos en Backlog y Gestion en la misma etapa.

Diferencias relevantes entre las dos paginas:

- Backlog renderiza muchos logos por carga (cards + tabla + modal). El costo de equivocarse es visual transversal.
- Gestion renderiza un solo logo en la preview, pero es la pagina con mayor riesgo funcional (escritura real, IDs, payload).
- Backlog es operacionalmente de solo lectura sobre CSV. Gestion escribe via Apps Script.
- Backlog no depende de `assets/js/config.js`. Gestion si.
- Backlog usa helper global `handleLogoError`. Gestion usa closure local en `img.onerror`.

Impacto de cambiar referencias:

- Solo en Backlog: aislado al archivo migrado; legacy `backlog-sellers_v27.html` queda intacto. Riesgo concentrado en render visual.
- Solo en Gestion: aislado al archivo migrado; legacy `gestion-sellers_v7.html` queda intacto. Riesgo concentrado en preview, sin tocar submit.
- En `assets/js/config.js` global: impacta inmediatamente a Gestion migrada y a cualquier futura pagina que consuma `CFG.ASSETS.LOGO_BASE_URL`. No impacta Backlog (que no lo consume).
- En `config.js` raiz: no impacta ninguna pagina hoy, pero compromete la estrategia de legacy/redirects.

Riesgos operativos identificados:

- La URL absoluta actual de `LOGO_BASE_URL` apunta a un GitHub Pages externo (`sporting-marketplace`), no a este repositorio (`marketplace-portal`). Si ese sitio externo deja de servir los logos, ambas paginas caen al fallback por iniciales. La copia local en `assets/logos/` no se consume hoy.
- Cualquier modificacion en el bloque `CONFIG` inline del Backlog implica revisar tambien `SELLERS_URL`, `RELEVAMIENTOS_URL`, `PUBLIC_BASE_URL`, `PRESENTACION_PATH`, `CALIFICACION_PATH`, `RELEVAMIENTO_PATH` y `SIMULADOR_SELLER_PATH`. No es seguro tocar solo un campo.
- Cualquier modificacion en `assets/js/config.js` requiere validar que Gestion siga resolviendo CFG, APPS_SCRIPT_URL, SELLERS_CSV_URL y ROUTES antes de tocar el campo de logo.

Propuesta de estrategia segura para futura migracion:

1. No tocar `LOGO_BASE_URL` global todavia.
2. No tocar `config.js` raiz ni `assets/js/config.js` como primer paso.
3. Aplicar la migracion como fallback local (no como cambio global de referencia). Mantener la URL absoluta como prioridad para no romper el comportamiento actual y agregar un fallback a `../../assets/logos/{seller_id}.png` solo si la URL absoluta no resuelve.
4. Aplicar primero en Backlog en una etapa propia (`5L` sugerida), no junto con Gestion.
5. Aplicar en Gestion en una etapa separada (`5M` sugerida), nunca compartiendo commit con Backlog.
6. Mantener intactas todas las rutas no-logo del bloque `CONFIG` inline de Backlog y del `FALLBACK_CONFIG` de Gestion.
7. Mantener el fallback final por iniciales como salida segura.
8. Mantener `Logos/` y los archivos legacy en raiz sin cambios.

Conviene fallback local en lugar de cambio global porque:

- Preserva el comportamiento actual de los usuarios que ya consumen la URL absoluta cacheada.
- Aisla el cambio al archivo migrado y permite rollback por commit unico.
- No introduce dependencia nueva en `assets/js/config.js` para Backlog.
- No obliga a sincronizar dos copias de config (raiz y `assets/js/`).
- Es consistente con el patron aplicado en Etapas 5E, 5F, 5H y 5J.

Que NO tocar todavia:

- `assets/js/config.js`.
- `config.js` raiz.
- `LOGO_BASE_URL` en ningun archivo.
- `LOGO_EXTENSIONS` en Backlog.
- Bloque `CONFIG` inline del Backlog (todos los campos, no solo logos).
- `FALLBACK_CONFIG` de Gestion (todos los campos).
- Submit, endpoint, payload, validaciones, `seller_id`, `nextSellerId()`, `reserveSellerId()`, `localStorage`.
- Apps Script.
- Backlog legacy (`backlog-sellers_v27.html`) y Gestion legacy (`gestion-sellers_v7.html`).
- `Logos/` y `assets/logos/`.
- Formularios publicos y sus legacy.
- Simuladores y sus legacy.
- Presentacion Seller y su legacy.
- Redirects desde archivos versionados.

Validaciones necesarias para el piloto futuro (no se ejecutan en 5K):

- Smoke test visual de cards del kanban con `SPT-001` a `SPT-015`.
- Smoke test visual de tabla del Backlog.
- Smoke test visual del modal del Backlog (apertura, cierre, contenido).
- Smoke test de preview de Gestion con seller existente y con seller nuevo.
- Confirmar prioridad: URL absoluta primero, fallback local solo si la primera falla, iniciales si todo falla.
- Confirmar que filtros, busqueda, ordenes, tab kanban/tabla y modal siguen funcionando.
- Confirmar que `nextSellerId`, `reserveSellerId`, `loadSellerById`, `formToObject`, `validatePayload` y submit no fueron alterados.
- Consola sin errores JS nuevos.
- Sin 404 inesperados (404 de logo local cuando no existe `spt-XXX.png` es esperado y debe caer a iniciales).
- Comparacion visual antes/despues por captura.

Rollback:

- Revertir un solo commit por archivo (Backlog y Gestion en commits separados).
- `assets/logos/` no se toca, por lo que el rollback solo afecta HTML migrado.
- `LOGO_BASE_URL` no se toca, por lo que el comportamiento legacy se preserva como cinturon de seguridad.
- Fallback por iniciales sigue presente y no requiere rollback.

Candidato ideal para piloto futuro:

- Pagina: `internal/backlog/backlog-sellers.html`.
- Motivo: no depende de `assets/js/config.js`, no escribe datos, no toca Apps Script, tiene fallback por iniciales robusto y multiples superficies de render permiten detectar regresiones visuales rapido.
- Etapa sugerida: `5L`.
- Despues, en etapa separada `5M`: `internal/backlog/gestion-sellers.html`.
- Razon de orden: Backlog primero porque es de solo lectura. Gestion despues porque escribe; conviene validar el patron en una pagina sin riesgo de payload antes de acercarse a la pagina con submit real.

Archivos permitidos en futuras etapas 5L y 5M:

- 5L: `internal/backlog/backlog-sellers.html`, `docs/assets-strategy.md`, `docs/roadmap.md`, `CHANGELOG.md`.
- 5M: `internal/backlog/gestion-sellers.html`, `docs/assets-strategy.md`, `docs/roadmap.md`, `CHANGELOG.md`.

### Etapa 5L: fallback local en Backlog de Sellers

Estado: completada.

Resultado:

- Se aplico fallback local solo en `internal/backlog/backlog-sellers.html`.
- La URL absoluta de `CONFIG.LOGO_BASE_URL` conserva prioridad como primera opcion.
- Se mantienen las 5 extensiones remotas (`png`, `webp`, `jpg`, `jpeg`, `svg`) como candidatos primarios.
- Se agrego `../../assets/logos/{seller_id}.png` como ultimo candidato dentro de `logoCandidates()`.
- El fallback final por iniciales se preserva en `handleLogoError()` y `handleModalLogoError()`.
- Cards del kanban, tabla y modal heredan el nuevo candidato sin cambios estructurales porque consumen el array `data-logo-candidates` provisto por `logoCandidates()`.
- No se modifico `CONFIG.LOGO_BASE_URL` ni `CONFIG.LOGO_EXTENSIONS`.
- No se modifico el bloque `CONFIG` inline ni ninguna otra constante de Backlog (`SELLERS_URL`, `RELEVAMIENTOS_URL`, `PUBLIC_BASE_URL`, `PRESENTACION_PATH`, `CALIFICACION_PATH`, `RELEVAMIENTO_PATH`, `SIMULADOR_SELLER_PATH`).
- No se modificaron filtros, busqueda, tabs, render del kanban, render de tabla, modal, CSV, parsers, helpers de pipeline, links publicos ni iconografia.
- No se modifico `internal/backlog/gestion-sellers.html`.
- No se modificaron `config.js` ni `assets/js/config.js`.
- No se modificaron Apps Script, endpoints, payloads, simuladores, formularios ni Presentacion Seller.
- No se modificaron archivos legacy en raiz (`backlog-sellers_v27.html` intacto).

Cambio aplicado:

```js
function logoCandidates(sellerId){
  const base=String(CONFIG.LOGO_BASE_URL||"").replace(/\/$/,"");
  const id=safeAssetId(sellerId);
  if(!base||!id)return[];
  const list=(CONFIG.LOGO_EXTENSIONS||["png"]).map(ext=>`${base}/${id}.${ext}`);
  // Fallback local secundario (Etapa 5L): se intenta solo si todos los candidatos remotos fallan.
  // No reemplaza la URL absoluta ni el fallback final por iniciales (handleLogoError / handleModalLogoError).
  list.push(`../../assets/logos/${id}.png`);
  return list;
}
```

Prioridad efectiva por seller (ejemplo `SPT-001`):

1. `https://antonioluquin-ecomm.github.io/sporting-marketplace/assets/logos/spt-001.png`
2. `https://antonioluquin-ecomm.github.io/sporting-marketplace/assets/logos/spt-001.webp`
3. `https://antonioluquin-ecomm.github.io/sporting-marketplace/assets/logos/spt-001.jpg`
4. `https://antonioluquin-ecomm.github.io/sporting-marketplace/assets/logos/spt-001.jpeg`
5. `https://antonioluquin-ecomm.github.io/sporting-marketplace/assets/logos/spt-001.svg`
6. `../../assets/logos/spt-001.png` (nuevo, local)
7. Iniciales (`<div class="seller-initials">`) cuando se agota la lista.

Validaciones realizadas:

- Verificado que la guarda `if(!base||!id)return[];` se preserva sin cambios.
- Verificado que el orden de extensiones remotas se preserva.
- Verificado que `safeAssetId()` se reutiliza para normalizar el id en la ruta local (minusculas, `[^a-z0-9_-]` sustituido por `-`).
- Verificado que `logoHTML()` consume el primer elemento del array y serializa el resto en `data-logo-candidates`, por lo que el nuevo candidato queda al final automaticamente.
- Verificado que `handleLogoError()` (cards y tabla) y `handleModalLogoError()` (modal) reciclan el array por indice y no requieren cambios.
- Verificado que el modal en `openModal()` invoca `logoCandidates(s.seller_id)` exactamente igual y hereda el nuevo candidato sin modificaciones a su estructura.
- Verificado que `internal/backlog/gestion-sellers.html` no fue alterado.
- Verificado que `config.js`, `assets/js/config.js`, Apps Script, formularios, simuladores y Presentacion Seller no fueron alterados.
- Verificado que el archivo legacy `backlog-sellers_v27.html` permanece intacto.

Validaciones manuales pendientes:

- Abrir `internal/backlog/backlog-sellers.html` y confirmar que cards del kanban renderizan logo para sellers con asset en URL absoluta.
- Confirmar que la tabla renderiza logo en `td.td-seller` con tamano reducido.
- Abrir el modal de un seller y confirmar que `m-logo` carga la imagen remota; si falla, debe intentar la ruta local; si tambien falla, debe mostrar `m-initials`.
- Probar con `seller_id` cuya URL absoluta este desactualizada o devuelva 404 y confirmar que el fallback local carga `../../assets/logos/{seller_id}.png`.
- Probar con `seller_id` sin asset local y confirmar fallback por iniciales.
- Revisar consola por errores JS nuevos (404 en candidatos intermedios es esperado segun la cadena de fallback).
- Confirmar que filtros, busqueda, tabs `kanban/tabla`, modal, links publicos y boton "Editar seller" siguen funcionando sin diferencias visuales.

Rollback:

- Revertir el unico commit de 5L sobre `internal/backlog/backlog-sellers.html`.
- `assets/logos/` no se toca, por lo que el rollback no requiere mover archivos.
- `CONFIG.LOGO_BASE_URL` no se toca, por lo que el comportamiento previo (5 extensiones remotas + iniciales) se restaura por completo al revertir.

Pendiente:

- Etapa 5M: aplicar el mismo patron solo en `internal/backlog/gestion-sellers.html`, despues de validar 5L en navegador.
- Actualizar `docs/test-matrix.md` para registrar el smoke test especifico de cards, tabla y modal en Backlog con la cadena de fallback completa.

### Etapa 5M: fallback local en Gestion de Sellers

Estado: completada.

Resultado:

- Se aplico fallback local solo en `internal/backlog/gestion-sellers.html`.
- La URL principal `LOGO_BASE_URL` (resuelta como `CFG.ASSETS.LOGO_BASE_URL || FALLBACK_CONFIG.ASSETS.LOGO_BASE_URL`) conserva prioridad como primera opcion.
- Se mantienen las 5 extensiones remotas (`png`, `webp`, `jpg`, `jpeg`, `svg`) como candidatos primarios.
- Se agrego `../../assets/logos/{seller_id}.png` como ultimo candidato dentro de `logoCandidates(id)`.
- El fallback final por iniciales se preserva intacto dentro de `updateLogo(box, sellerId, name)`: si todos los candidatos fallan, el `box` recibe `<span class="logo-fallback">${initials(name)}</span>`.
- La preview de logo en `#logoPreview` hereda el nuevo candidato sin cambios estructurales porque `updateLogo()` ya cicla por todos los elementos del array via `img.onerror`.
- No se modifico `CFG.ASSETS.LOGO_BASE_URL` ni `FALLBACK_CONFIG.ASSETS.LOGO_BASE_URL`.
- No se modificaron `nextSellerId()`, `normalizeSellerId()`, `reserveSellerId()`, `getReservedIds()`, `validatePayload()`, `formToObject()`, `updatePreview()` ni `buildFirstContactMessage()`.
- No se modifico el listener `$("sellerForm").addEventListener("submit", ...)` ni la llamada a `fetch(APPS_SCRIPT_URL, ...)`.
- No se modifico el `payload` ni `tipo_formulario:"seller"`.
- No se modificaron `getSavedResponsable()`, `saveResponsable()` ni la clave `localStorage` `mp_responsable_seller` ni `mp_reserved_seller_ids`.
- No se modificaron carga de CSV (`getCSV`, `parseCSV`, `loadSellers`), select de sellers (`buildExistingSelect`, `loadSelectedSeller`, `loadSellerById`) ni flujo de alta/edicion.
- No se modifico `internal/backlog/backlog-sellers.html`.
- No se modificaron `config.js` ni `assets/js/config.js`.
- No se modificaron Apps Script, endpoints, simuladores, formularios ni Presentacion Seller.
- No se modificaron archivos legacy en raiz (`gestion-sellers_v7.html` intacto).

Cambio aplicado:

```js
function logoCandidates(id){
  const sid=clean(id).toLowerCase();
  if(!sid) return [];
  const list=["png","webp","jpg","jpeg","svg"].map(ext=>`${LOGO_BASE_URL}${encodeURIComponent(sid)}.${ext}`);
  /* Etapa 5M: fallback local secundario; no reemplaza la URL principal ni el fallback final por iniciales en updateLogo(). */
  list.push(`../../assets/logos/${encodeURIComponent(sid)}.png`);
  return list;
}
```

En el archivo, este cambio se preserva como una unica linea para mantener el estilo minificado del resto del bloque `<script>`.

Prioridad efectiva por seller (ejemplo `SPT-001`):

1. `${LOGO_BASE_URL}spt-001.png`
2. `${LOGO_BASE_URL}spt-001.webp`
3. `${LOGO_BASE_URL}spt-001.jpg`
4. `${LOGO_BASE_URL}spt-001.jpeg`
5. `${LOGO_BASE_URL}spt-001.svg`
6. `../../assets/logos/spt-001.png` (nuevo, local)
7. `<span class="logo-fallback">${initials(name)}</span>` cuando se agota la lista.

Validaciones realizadas:

- Verificado que la guarda `if(!sid) return [];` se preserva sin cambios.
- Verificado que el orden de extensiones remotas se preserva (`png`, `webp`, `jpg`, `jpeg`, `svg`).
- Verificado que `encodeURIComponent(sid)` se reutiliza tambien para la ruta local, consistente con los candidatos remotos.
- Verificado que `updateLogo()` no fue modificado: continua creando el `<img>`, asignando `img.onerror` y cayendo a `<span class="logo-fallback">` cuando `i` agota `candidates.length`.
- Verificado que `updatePreview()` invoca `updateLogo($("logoPreview"), o.seller_id, name)` sin cambios.
- Verificado que el listener `submit` del formulario no fue tocado: `fetch(APPS_SCRIPT_URL, {method:"POST", mode:"no-cors", headers, body})`, `reserveSellerId(payload.seller_id)`, `saveResponsable(...)` siguen en su forma original.
- Verificado que `validatePayload()` sigue retornando los mismos mensajes y se ejecuta antes de cualquier envio.
- Verificado que `formToObject()`, `nextSellerId()`, `normalizeSellerId()`, `getQuerySellerId()` y `isEditModeFromUrl()` quedan intactos.
- Verificado que `loadSellers()`, `buildExistingSelect()`, `loadSelectedSeller()`, `loadSellerById()` e `initFromUrl()` quedan intactos.
- Verificado que `internal/backlog/backlog-sellers.html`, `config.js`, `assets/js/config.js`, Apps Script, formularios, simuladores y Presentacion Seller no fueron alterados.
- Verificado que el archivo legacy `gestion-sellers_v7.html` permanece intacto.

Validaciones manuales pendientes:

- Abrir `internal/backlog/gestion-sellers.html` sin `seller_id` y confirmar que la preview muestra el logo o las iniciales del seller nuevo segun corresponda.
- Abrir `internal/backlog/gestion-sellers.html?seller_id=SPT-001` y confirmar que la preview carga el logo remoto.
- Simular caida de la URL remota (DevTools: bloquear el dominio) y confirmar que la preview muestra el logo local de `assets/logos/spt-001.png`.
- Probar con un `seller_id` sin asset local (por ejemplo `SPT-099`) y confirmar fallback por iniciales.
- Confirmar que la edicion de un seller existente sigue funcionando: select carga datos, `Editar seller` cambia el titulo y el boton.
- Confirmar que los links publicos generados por `buildPublicLink()` siguen apuntando a las rutas correctas (`presentacion`, `calificacion`, `relevamiento`, `simulador`).
- Confirmar que el mensaje de primer contacto se renderiza sin cambios.
- Revisar consola por errores JS nuevos (404 de candidatos intermedios es esperado).
- Confirmar que NO se ejecuta submit real durante el smoke test.

Rollback:

- Revertir el unico commit de 5M sobre `internal/backlog/gestion-sellers.html`.
- `assets/logos/` no se toca, por lo que el rollback no requiere mover archivos.
- `LOGO_BASE_URL` no se toca, por lo que el comportamiento previo se restaura por completo al revertir.
- El flujo de alta/edicion, submit, payload y reserva de IDs no se ven afectados por el cambio ni por su rollback.

Pendiente:

- Smoke test manual en navegador conforme a la lista anterior, sin ejecutar submit real.
- Actualizar `docs/test-matrix.md` para registrar el smoke test especifico de preview de Gestion con la cadena de fallback completa.
- Evaluar en etapas posteriores si conviene mover el helper `logoCandidates`/`updateLogo` a un modulo compartido (`assets/js/logos.js`) sin alterar las paginas piloto.

## Roadmap recomendado Etapa 5

| Etapa | Objetivo | Riesgo | Piloto |
|---|---|---|---|
| 5A | Auditoria y estrategia documental | Bajo | Documentacion |
| 5B | Copia segura de logos a `assets/logos/` | Bajo | Assets solamente |
| 5C | Crear tokens/base CSS sin aplicacion masiva | Bajo/Medio | `index.html` |
| 5D | Crear rutas/helpers no invasivos | Bajo/Medio | `index.html` |
| 5E | Helper de logos compartido | Medio | Presentacion Seller |
| 5F | Helper CSV compartido | Medio/Alto | Gantt Seller Center |
| 5G | Componentes visuales compartidos | Medio/Alto | Paginas informativas |
| 5H | Formularios y paginas criticas | Alto/Critico | Solo despues de smoke test |

## Decision recomendada

La Etapa 5 no debe empezar por extraccion masiva. La ruta segura es documentar, copiar assets sin cambiar referencias, crear archivos compartidos sin consumo inicial y luego aplicar un piloto pequeño. La primera pagina candidata para cambios reales deberia ser `index.html` o una pagina informativa interna; la primera pagina publica candidata deberia ser `public/presentaciones/presentacion-seller.html`.

---

### Etapa 6C

**Fecha:** 2026-05-16
**Estado:** completado — piloto activo en una pagina

#### Objetivo

Crear `assets/css/tokens.css` con exclusivamente el bloque `:root {}` canonico definido en Etapa 6B, y enlazarlo como piloto en `internal/estrategia/proceso-onboarding.html`.

#### Archivo creado

**`assets/css/tokens.css`**

```css
:root {
  /* Verde primario */
  --g: #5ea832;
  --g2: #4a8a26;
  --g-dim: rgba(94, 168, 50, .10);
  --g-brd: rgba(94, 168, 50, .24);

  /* Fondos */
  --bg: #0b0f0b;
  --bg2: #0f150f;
  --panel: #141c13;
  --panel2: #192118;

  /* Separadores */
  --line: rgba(255, 255, 255, .08);
  --line-soft: rgba(255, 255, 255, .05);

  /* Texto */
  --text: #edf3e9;
  --text-muted: #a6b79d;
  --text-soft: #71816b;
  --text-dim: #4f5d49;

  /* Semanticos */
  --warn: #f59e0b;
  --info: #60a5fa;
  --teal: #2dd4bf;
  --danger: #f87171;

  /* Layout */
  --topbar-height: 58px;
}
```

El archivo contiene solo variables CSS. No incluye resets, layout, componentes ni estilos de pagina.

#### Modificacion en pagina piloto

**`internal/estrategia/proceso-onboarding.html`** — se agrego dentro de `<head>`, antes del bloque `<style>`:

```html
<!-- 6C: tokens CSS externos — piloto. El :root inline permanece como fallback. -->
<link rel="stylesheet" href="../../assets/css/tokens.css">
```

La ruta `../../assets/css/tokens.css` resuelve correctamente desde `internal/estrategia/`.

#### Estado del :root inline

El bloque `:root` original del HTML **no fue eliminado**. Permanece en la linea 13 del `<style>` interno. La cascada CSS funciona de la siguiente manera:

1. `tokens.css` se carga primero (define los tokens canonicos con nombres semanticos: `--bg`, `--panel`, `--text`, etc.)
2. El `<style>` inline se procesa despues — define los mismos colores con nombres legacy (`--k`, `--k2`, `--k3`, `--t1`, `--t2`, etc.)
3. Ambos conjuntos de variables coexisten sin conflicto porque tienen nombres distintos
4. Si se elimina el `:root` inline en etapas futuras, las referencias a tokens legacy (`var(--k)`, `var(--t1)`, etc.) deberan migrarse a nombres canonicos (`var(--bg)`, `var(--text)`, etc.)

#### Alcance del piloto

| Item | Estado |
|---|---|
| `assets/css/tokens.css` creado | ✅ |
| Link en `<head>` de proceso-onboarding.html | ✅ |
| `:root` inline conservado | ✅ |
| Otros HTML modificados | ❌ ninguno |
| JS modificado | ❌ ninguno |
| Formularios tocados | ❌ ninguno |

#### Etapa 6D: resultado del smoke test

**Fecha:** 2026-05-16 | **Entorno:** local (`http://localhost:8080/`) | **Resultado:** ✅ OK

Validaciones confirmadas: carga sin 404, HTTP 200 en `tokens.css`, sin errores de consola, sin regresion visual en topbar / sidebar / cards / KPIs / botones. El `:root` inline sigue activo como fallback.

Piloto **aprobado**. Habilitado para extender `tokens.css` al resto del grupo `internal/estrategia/` en Etapa 6E.

---

### Etapa 6E

**Fecha:** 2026-05-16
**Estado:** implementado — pendiente smoke test manual

#### Objetivo

Extender el link a `assets/css/tokens.css` a las 4 paginas reales del grupo `internal/estrategia/`, siguiendo el patron del piloto 6C.

#### Paginas actualizadas

| Pagina | Link | :root inline |
|---|---|---|
| `internal/estrategia/governance.html` | ✅ agregado | ✅ intacto |
| `internal/estrategia/modelo-integracion.html` | ✅ agregado | ✅ intacto |
| `internal/estrategia/modelo-economico.html` | ✅ agregado | ✅ intacto |
| `internal/estrategia/proyecto-marketplace.html` | ✅ agregado | ✅ intacto |

Ruta usada en todas: `../../assets/css/tokens.css`

#### Nota sobre proyecto-marketplace.html

Esta pagina usa nombres de variables propios en su `:root` (`--gd`, `--gb`, `--gb2`, `--b`, `--b2`) en lugar de los nombres canonicos (`--g-dim`, `--g-brd`, `--line`, `--line-soft`). No existe conflicto — coexisten en el mismo `:root` sin solapamiento. A considerar en etapas futuras de unificacion.

#### Restricciones cumplidas

- Ningun otro HTML, JS, formulario, simulador ni pagina critica fue modificado.
- No se extrajo CSS inline.
- No se eliminaron variables inline.
- No se crearon redirects ni se movieron archivos.

#### Etapa 6F: resultado del smoke test

**Fecha:** 2026-05-16 | **Entorno:** local (`http://localhost:8080/`) | **Resultado:** ✅ OK en las 4 paginas

Validaciones confirmadas en todas: `tokens.css` HTTP 200 sin 404, sin errores criticos de consola, sin regresion visual en topbar / sidebar / contenido principal. El `:root` inline sigue activo como fallback en cada pagina.

#### Estado final del grupo internal/estrategia/

Las 5 paginas del grupo quedan **validadas con `tokens.css`**:

| Pagina | Etapa | Smoke test |
|---|---|---|
| `proceso-onboarding.html` | 6C | ✅ 6D OK |
| `governance.html` | 6E | ✅ 6F OK |
| `modelo-integracion.html` | 6E | ✅ 6F OK |
| `modelo-economico.html` | 6E | ✅ 6F OK |
| `proyecto-marketplace.html` | 6E | ✅ 6F OK |

---

### Etapa 6G: auditoria del grupo internal/seller-center

**Fecha:** 2026-05-16
**Estado:** completado — solo lectura, sin modificaciones

Auditadas 2 paginas del grupo `internal/seller-center/`:

| Pagina | Lineas | JS | Colisiones con tokens.css | Veredicto |
|---|---|---|---|---|
| `index.html` | 705 | fetch read-only a Google Sheets | 8 variables (6 mismo valor, 2 distintos) | ✅ APTA |
| `maqueta-seller-center.html` | 1288 | UI interactivo puro | 6 variables (TODAS distintas) | ❌ EXCLUIDA |

#### Analisis index.html

Paleta oscura Sporting, nomenclatura legacy (`--k`, `--t1`, `--bdr`, `--tb`) identica al grupo `estrategia/`. El bloque `<script>` realiza un `fetch` de solo lectura a Google Sheets para mostrar el roadmap de modulos SC — sin escritura, sin Apps Script, sin submit. Las 8 colisiones de nombres con `tokens.css` son identicas en valor o el inline prevalece de todos modos.

#### Analisis y exclusion definitiva maqueta-seller-center.html

La maqueta Seller Center representa **otra plataforma en creacion** con un sistema visual completamente distinto al Marketplace Portal. Paleta clara (fondo `#eef1f4`, panel `#ffffff`, texto `#222222`) frente a la paleta oscura de `tokens.css`. Las 6 colisiones de nombre son opuestos semánticos absolutos:

| Variable | tokens.css | maqueta | Magnitud |
|---|---|---|---|
| `--panel` | `#141c13` (verde muy oscuro) | `#ffffff` (blanco) | 🔴 critico |
| `--text` | `#edf3e9` (casi blanco) | `#222222` (negro) | 🔴 critico |
| `--line` | `rgba(255,255,255,.08)` | `#dcdcdc` (gris) | 🔴 critico |
| `--line-soft` | `rgba(255,255,255,.05)` | `#eeeeee` (gris claro) | 🔴 critico |
| `--topbar-height` | `58px` | `42px` | 🟠 layout distinto |
| `--teal` | `#2dd4bf` | `#1aa69a` | 🟡 color distinto |

Agregar `tokens.css` a la maqueta no romperia nada hoy (el inline siempre gana), pero crearia una trampa: cualquier etapa futura que elimine el `:root` inline como "progresion" destruiria completamente el sistema visual de la maqueta. La exclusion es definitiva y por diseño — no es un pendiente a resolver.

---

### Etapa 6H

**Fecha:** 2026-05-16
**Estado:** implementado — pendiente smoke test manual

#### Objetivo

Extender `assets/css/tokens.css` a `internal/seller-center/index.html`. Documentar exclusion definitiva de `maqueta-seller-center.html`.

#### Modificacion realizada

**`internal/seller-center/index.html`** — agregado dentro de `<head>`, lineas 10-11, antes del `<style>`:

```html
<!-- 6H: tokens CSS externos. El :root inline permanece como fallback. -->
<link rel="stylesheet" href="../../assets/css/tokens.css">
```

El `:root` inline (linea 13) fue conservado sin modificacion.

#### Paginas del grupo internal/seller-center/

| Pagina | Estado |
|---|---|
| `index.html` | ✅ `tokens.css` enlazado (6H) — ✅ smoke test OK (6I) |
| `maqueta-seller-center.html` | ❌ excluida definitivamente — otra plataforma, otro sistema visual |

#### Etapa 6I: resultado del smoke test

**Fecha:** 2026-05-16 | **Entorno:** local (`http://localhost:8080/`) | **Resultado:** ✅ OK

Validaciones confirmadas: `tokens.css` HTTP 200 sin 404, sin errores criticos de consola, sin regresion visual en topbar / sidebar / modulos SC. Links "Ver maqueta" y "Ver Gantt" navegan correctamente. Error CORS del `fetch` a Google Sheets: confirmado como esperado y no relacionado con CSS.

#### Estado final del grupo internal/seller-center/

- `index.html`: `tokens.css` enlazado y validado. `:root` inline activo como fallback.
- `maqueta-seller-center.html`: excluida por diseño — otra plataforma, otro sistema visual. No es un pendiente.

#### Riesgos pendientes

- `--info` de `index.html` (`#38bdf8`) difiere del canonico (`#60a5fa`) — el inline prevalece, sin impacto visual hoy. A unificar en etapas futuras.
- Smoke test ejecutado en entorno local. Pendiente validacion en produccion (GitHub Pages) despues del proximo push.

---

### Etapa 6J: auditoria del grupo internal/backlog

**Fecha:** 2026-05-16
**Estado:** completado — solo lectura, sin modificaciones

Auditadas 2 paginas del grupo `internal/backlog/`:

| Pagina | Lineas | Colisiones con tokens.css | JS sensible | Veredicto |
|---|---|---|---|---|
| `backlog-sellers.html` | 1002 | 2 (ambas mismo valor) | fetch read-only × 3 | ✅ APTA |
| `gestion-sellers.html` | 232 | 8 (5 distinto — inline siempre gana) | fetch + Apps Script POST + localStorage | ✅ APTA con nota |

`backlog-sellers.html` usa alias cortos (`--wa`, `--in`, `--da`, `--te`) sin colision efectiva con tokens.css. `gestion-sellers.html` usa `--warn`, `--info`, `--danger` con valores distintos al canonico — el `:root` inline siempre prevalece, sin cambio visual posible. CSS y JS son capas independientes: agregar un `<link>` no afecta submit, Apps Script, localStorage ni config.js.

---

### Etapa 6K

**Fecha:** 2026-05-16
**Estado:** implementado — pendiente smoke test manual

#### Objetivo

Extender `assets/css/tokens.css` a las 2 paginas del grupo `internal/backlog/`, completando la cobertura de grupos internos.

#### Modificaciones realizadas

**`internal/backlog/backlog-sellers.html`** — agregado en `<head>` linea 10-11, antes del `<style>` (sin indent):
```html
<!-- 6K: tokens CSS externos. El :root inline permanece como fallback. -->
<link rel="stylesheet" href="../../assets/css/tokens.css">
```

**`internal/backlog/gestion-sellers.html`** — agregado en `<head>` linea 11-12, despues de `config.js` y antes del `<style>` (2 espacios):
```html
<!-- 6K: tokens CSS externos. El :root inline permanece como fallback. -->
<link rel="stylesheet" href="../../assets/css/tokens.css">
```

En ambas: el `:root` inline fue conservado sin modificacion. Ningun bloque `<script>` fue tocado.

#### Estado del grupo internal/backlog/

| Pagina | tokens.css | :root inline | JS |
|---|---|---|---|
| `backlog-sellers.html` | ✅ enlazado (6K) | ✅ intacto | fetch read-only — sin tocar |
| `gestion-sellers.html` | ✅ enlazado (6K) | ✅ intacto | Apps Script, localStorage, config.js — sin tocar |

#### Etapa 6L: resultado del smoke test

**Fecha:** 2026-05-16 | **Entorno:** local (`http://localhost:8080/`) | **Resultado:** ✅ OK en ambas paginas

`backlog-sellers.html`: `tokens.css` HTTP 200, sin errores criticos, cards / tabla / filtros / modal sin regresion visual.
`gestion-sellers.html`: `tokens.css` HTTP 200, sin errores criticos, formulario / preview / punto de estado / asteriscos sin regresion visual. Submit real no ejecutado. El inline prevalece en `--warn` y `--danger` — confirmado visualmente.

#### Estado final del grupo internal/backlog/

| Pagina | tokens.css | Smoke test | JS |
|---|---|---|---|
| `backlog-sellers.html` | ✅ (6K) | ✅ 6L OK | fetch read-only — intacto |
| `gestion-sellers.html` | ✅ (6K) | ✅ 6L OK | Apps Script, localStorage, config.js — intactos |

#### Riesgos pendientes

- `gestion-sellers.html`: `--warn` (`#ffb74d`) y `--danger` (`#d94040`) con valores inline distintos del canonico — inline siempre prevalece, sin impacto visual. A unificar en etapas futuras si se elimina el inline.
- Smoke test ejecutado en entorno local. Pendiente validacion en produccion (GitHub Pages) despues del proximo push.

---

## Etapa 6M: cierre documental de Etapa 6

**Fecha:** 2026-05-16
**Estado:** cerrado

### Alcance completado

La Etapa 6 cubrió la extension horizontal de `assets/css/tokens.css` a las paginas internas de bajo riesgo del proyecto. El patron aplicado en todos los grupos fue identico: agregar un `<link rel="stylesheet">` en `<head>` antes del `<style>`, conservar el `:root` inline como fallback, no extraer CSS ni modificar JS.

### Estado final por grupo

| Grupo | Paginas enlazadas | Paginas excluidas | Smoke test |
|---|---|---|---|
| `internal/estrategia/` | 5 (`proceso-onboarding`, `governance`, `modelo-integracion`, `modelo-economico`, `proyecto-marketplace`) | ninguna | ✅ 6D + 6F OK |
| `internal/seller-center/` | 1 (`index.html`) | 1 (`maqueta-seller-center.html`) | ✅ 6I OK |
| `internal/backlog/` | 2 (`backlog-sellers`, `gestion-sellers`) | ninguna | ✅ 6L OK |
| **Total** | **8 paginas** | **1 excluida por diseño** | ✅ todos aprobados |

### Exclusiones documentadas

| Pagina | Motivo de exclusion | Tipo |
|---|---|---|
| `internal/seller-center/maqueta-seller-center.html` | Otra plataforma en creacion, paleta clara opuesta al design system Sporting | Por diseño — definitiva |
| `public/formularios/formulario-calificacion.html` | Pagina seller-facing con formulario y submit real | Diferida — requiere auditoria propia |
| `public/formularios/formulario-relevamiento.html` | Pagina seller-facing con formulario y submit real | Diferida — requiere auditoria propia |
| `public/presentaciones/presentacion-seller.html` | Pagina seller-facing con estilos comerciales propios | Diferida — requiere auditoria propia |
| `public/simuladores/simulador-seller.html` | Simulador con calculos y logica propia | Diferida — requiere auditoria propia |

### Invariantes de la Etapa 6

En ninguna etapa de la Etapa 6 se modificaron:
- Bloques `<script>` embebidos
- Archivos `assets/js/config.js`
- Apps Script ni endpoints
- `localStorage`, `nextSellerId`, `reserveSellerId`
- Formularios publicos
- Simuladores
- Backlog operativo (solo se agrego un link CSS)
- Archivos legacy
- Redirects

### Proxima etapa: auditorias pendientes

Cualquier extension futura de `tokens.css` a paginas publicas requiere:
1. Auditoria de `:root` y colisiones (como Etapa 6G/6J).
2. Analisis de sensibilidad funcional del JS embebido.
3. Confirmacion explicita de que el cambio es solo un `<link>` sin extraccion de CSS.
4. Smoke test especifico que incluya verificacion visual del formulario o simulador completo.

---

## Etapa 11A/11B: decision sobre tokens en paginas publicas seller-facing

**Fecha:** 2026-05-18
**Estado:** cerrado como decision documental

### Paginas auditadas

| Pagina | Riesgo | Beneficio esperado de `tokens.css` | Decision |
|---|---|---|---|
| `public/formularios/formulario-calificacion.html` | Alto | Bajo | No aplicar |
| `public/formularios/formulario-relevamiento.html` | Critico | Bajo | Mantener independiente |
| `public/presentaciones/presentacion-seller.html` | Medio | Bajo/Nulo | Mantener independiente |
| `public/simuladores/simulador-seller.html` | Alto | Bajo | No aplicar |

### Decision

Las paginas publicas seller-facing se mantienen independientes de `assets/css/tokens.css`.

### Motivos

- Las 4 paginas tienen `:root` inline, estilos embebidos y variables locales.
- `tokens.css` fue disenado para paginas internas.
- `tokens.css` no incluye componentes ni layout, por lo que el beneficio para paginas publicas es bajo.
- Formularios publicos escriben datos reales via Apps Script.
- Formularios dependen de endpoints, payloads, validaciones y `seller_id`.
- Simulador Seller depende de calculos, tarifas, overrides, CSV y personalizacion por seller.
- Presentacion Seller es menos riesgosa, pero mantiene identidad visual comercial, logos, CTAs y fetch CSV.

### Criterio futuro

Si se busca consistencia visual en paginas publicas, la etapa correcta no es extender `tokens.css` interno. Debe abrirse una auditoria especifica para un posible `public-tokens.css`, separado del sistema interno, con smoke test por pagina y sin tocar endpoints, payloads, submit, `seller_id`, Apps Script ni calculos.

---

## Etapa 14A/14B: plan de extraccion CSS interna

**Fecha:** 2026-05-18
**Estado:** documentado, sin implementacion

### Etapa 14A

Auditoria de paginas internas informativas completada sin cambios.

Paginas auditadas:

- `internal/estrategia/governance.html`
- `internal/estrategia/proceso-onboarding.html`
- `internal/estrategia/modelo-integracion.html`
- `internal/estrategia/modelo-economico.html`
- `internal/estrategia/proyecto-marketplace.html`
- `internal/seller-center/index.html`
- `internal/hub-operativo.html`

### Patrones CSS repetidos

- Topbar: `topbar`, `brand`, `logo`, estado, botones superiores.
- Sidebar: `sidebar`, `nav`, estado `active`, scrollbars.
- Layout: `main`, `hero`, `section`, `section-head`, `section-title`, `section-desc`.
- Grids: `grid`, `grid.two`, `grid.four`, `cards`.
- Componentes: `panel`, `card`, `kpi`, `pill`, `tag`, `callout`.
- Responsive: ocultar sidebar y convertir grillas a 1 o 2 columnas.

### Decision JS

No extraer JavaScript por ahora.

Motivos:

- El JS compartible es bajo y se limita principalmente a navegacion activa por scroll.
- `seller-center/index.html` tiene fetch, parse CSV y render dinamico.
- `hub-operativo.html` tiene grid dinamico y buscador propio.
- `modelo-integracion.html` tiene selector de escenarios.

### Propuesta futura

Crear, en etapa posterior y con smoke test:

- `assets/css/internal-layout.css`: layout, topbar, sidebar, main, secciones y responsive base.
- `assets/css/internal-components.css`: cards, KPIs, pills, tags, panels, callouts y grillas.

No reemplazar `tokens.css`; estos archivos serian capas superiores sobre tokens.

### Piloto recomendado 14C

Primera pagina piloto:

- `internal/estrategia/proceso-onboarding.html`

Motivo: pagina informativa, menor cantidad de lineas, sin `<script>`, ya validada con `tokens.css`.

Orden posterior sugerido:

1. `internal/estrategia/governance.html`
2. `internal/estrategia/modelo-integracion.html`
3. `internal/estrategia/modelo-economico.html`
4. `internal/estrategia/proyecto-marketplace.html`

### Excluidas del piloto

- `internal/hub-operativo.html`: rol operativo central y buscador/grid propio.
- `internal/seller-center/index.html`: fetch CSV y render dinamico.
- Paginas publicas seller-facing.
- Backlog y Gestion de Sellers.
- Simuladores y formularios.

### Validaciones requeridas para 14C

- Crear solo una capa CSS minima.
- Aplicarla solo a `proceso-onboarding.html`.
- Mantener `:root` inline como fallback.
- No tocar scripts.
- Comparar visualmente topbar, sidebar, cards, grillas, KPIs y responsive.
- Confirmar sin 404 para el CSS nuevo.
- Confirmar `git diff --name-only` limitado a CSS nuevo, pagina piloto y documentacion.

### Etapa 14C

**Estado:** implementado, pendiente smoke test 14D.

Cambios:

- Creado `assets/css/internal-components.css`.
- Enlazado en `internal/estrategia/proceso-onboarding.html` despues de `tokens.css` y antes del `<style>` inline.
- El CSS inline original permanece como fallback.

Contenido inicial:

- `.panel`
- `.panel.soft`
- `.callout`
- `.callout.warn`
- `.section-head`
- `.section-title`
- `.section-desc`
- `.tag`
- `.tag.green`

Invariantes:

- No se tocaron scripts.
- No se eliminaron estilos inline.
- No se cambiaron textos ni estructura, salvo el link CSS.
- No se tocaron paginas publicas, Backlog, Gestion, formularios, simuladores, Apps Script, config, aliases ni `legacy/`.

### Etapa 14E

**Estado:** implementado, pendiente smoke test 14F.

Extension controlada de `assets/css/internal-components.css` al resto del grupo informativo `internal/estrategia/`.

Paginas enlazadas:

- `internal/estrategia/governance.html`
- `internal/estrategia/modelo-integracion.html`
- `internal/estrategia/modelo-economico.html`
- `internal/estrategia/proyecto-marketplace.html`

Criterio aplicado:

- Solo se agrego el link a `../../assets/css/internal-components.css`.
- El link queda despues de `tokens.css` y antes del `<style>` inline.
- El CSS inline original queda como fallback y mantiene precedencia.
- No se modifica `assets/css/internal-components.css` en esta etapa.
- No se extrae ni modifica JavaScript.

Exclusiones mantenidas:

- `internal/estrategia/proceso-onboarding.html` ya fue piloto 14C y no se toca en 14E.
- `internal/hub-operativo.html` y `internal/seller-center/index.html` quedan excluidas.
- Publicas, Backlog, Gestion, simuladores y formularios siguen fuera del alcance.

### Etapa 14G

**Estado:** implementado, pendiente smoke test 14H.

Extension controlada de `assets/css/internal-components.css` a paginas internas restantes.

Paginas enlazadas:

- `internal/seller-center/index.html`
- `internal/gantt/gantt-seller-center.html`
- `internal/gantt/gantt-operativo.html`
- `internal/simuladores/simulador-economico.html`
- `internal/backlog/backlog-sellers.html`
- `internal/backlog/gestion-sellers.html`
- `internal/hub-operativo.html`

Criterio aplicado:

- Solo se agrego el link a `internal-components.css`.
- El link queda despues de `tokens.css` cuando existe.
- El link queda siempre antes del `<style>` inline.
- El CSS inline original queda como fallback y mantiene precedencia.
- No se modifica `assets/css/internal-components.css` en esta etapa.
- No se extrae ni modifica JavaScript.
- No se toca fetch, CSV, formulas, filtros, submit, localStorage ni render dinamico.

Exclusiones mantenidas:

- `internal/seller-center/maqueta-seller-center.html` sigue excluida por representar otra plataforma visual.
- Publicas, formularios, simuladores publicos y presentaciones publicas siguen fuera del alcance.

### Etapa 14I: cierre documental

**Estado:** cerrado documentalmente.

Resumen de la Etapa 14:

- 14A: auditoria CSS/JS de paginas internas informativas, sin cambios.
- 14B: plan documental de extraccion CSS interna.
- 14C/14D: piloto de `assets/css/internal-components.css` en `internal/estrategia/proceso-onboarding.html`.
- 14E/14F: extension al resto de paginas informativas de `internal/estrategia/`.
- 14G/14H: extension a paginas internas restantes.

Resultado final:

- `assets/css/internal-components.css` queda aplicado a paginas internas autorizadas.
- El CSS inline original permanece como prioridad/fallback.
- No se extrae CSS inline todavia.
- No se extrae JavaScript todavia.

Exclusiones vigentes:

- Paginas publicas seller-facing.
- Formularios.
- Simuladores publicos.
- Presentaciones publicas.
- Apps Script.
- `config.js` y `assets/js/config.js`.
- Aliases de raiz.
- `legacy/`.

Siguiente bloque recomendado:

1. Auditoria de limpieza gradual de CSS duplicado interno.
2. O auditoria JS interna, sin implementar extraccion todavia.

No iniciar limpieza de CSS ni extraccion JS sin una etapa especifica, smoke test por grupo y plan de rollback.

### Etapa 15B: limpieza piloto CSS inline duplicado

**Estado:** implementado, pendiente smoke test 15C.

Pagina piloto:

- `internal/estrategia/proceso-onboarding.html`

Reglas limpiadas del CSS inline porque ya estan cubiertas por `assets/css/internal-components.css`:

- `.panel`
- `.panel.soft`
- `.callout` parcialmente
- `.callout.warn`
- `.section-head`
- `.section-title`
- `.section-title span`
- `.section-desc`
- `.tag`
- `.tag.green`

Reglas conservadas:

- `.callout{margin-top:14px}` se mantiene como ajuste local porque `internal-components.css` no define ese margen.

Invariantes:

- No se modifico `assets/css/internal-components.css`.
- No se modifico `assets/css/tokens.css`.
- No se tocaron textos, estructura HTML ni JavaScript.
- No se tocaron paginas publicas, Backlog, Gestion, formularios, simuladores, Apps Script, config, aliases ni `legacy/`.

### Etapa 15D: limpieza CSS en paginas de estrategia

**Estado:** implementado, pendiente smoke test 15E.

Paginas intervenidas:

- `internal/estrategia/governance.html`
- `internal/estrategia/modelo-integracion.html`
- `internal/estrategia/modelo-economico.html`
- `internal/estrategia/proyecto-marketplace.html`

Criterio:

- Eliminar solo reglas inline cubiertas por `assets/css/internal-components.css`.
- Conservar reglas inline cuando tienen diferencias visuales o son especificas de pagina.
- No modificar HTML, textos, navegacion ni JavaScript.

Eliminado por pagina:

- `governance.html`: base de `.panel`, `.panel.soft`, `.section-head`, `.section-title`, `.section-title span`; `section-desc` queda reducido a ancho local.
- `modelo-integracion.html`: base de `.panel`, `.panel.soft`, `.callout`, `.callout.warn`, `.section-head`, `.section-title`, `.section-title span`; `callout` conserva margen local y `callout.danger`; `section-desc` conserva ancho local.
- `modelo-economico.html`: base de `.panel`, `.panel.soft`, `.section-head`, `.section-title`, `.section-title span`; `section-desc` queda reducido a ancho local.
- `proyecto-marketplace.html`: `.panel.soft`.

Conservado por riesgo visual:

- `governance.html` y `modelo-economico.html`: `.callout` y variantes por usar gradientes, borde completo, padding y radio distintos.
- `modelo-integracion.html`: `.tag` y variantes por usar `inline-block`, borde, margen y colores especificos del selector.
- `proyecto-marketplace.html`: `.panel` y `.callout` por tener sistema visual propio de esa pagina.

No se agregaron variantes nuevas a `internal-components.css` porque no eran suficientemente genericas sin riesgo de regresion.
