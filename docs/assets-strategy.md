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
