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
