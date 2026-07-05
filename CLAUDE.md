# Marketplace Portal — Instrucciones para Claude Code y Codex

> Las reglas generales y los docs maestros están en `../project-standards/` (`ai_rules.md`, `style_guide.md`, `apps_script_standards.md`).
> Este archivo contiene solo lo específico de este proyecto.

---

## Reglas activas — específicas de este proyecto

- **Un solo centro de navegación**: `index.html` es el Hub Central. No crear HTML en la raíz; las páginas nuevas van en `internal/` (uso interno) o `public/` (compartido con sellers).
- **Auth por sesión (desde 2026-07-02)**: `internal/` requiere login de staff (`login.html`, `assets/js/auth.js`, RBAC por módulo) y `public/` requiere login de Seller (`public/login.html`, `assets/js/auth-seller.js`, una cuenta compartida por `seller_id`). Backend en `apps-script/Users.gs`. Ver `CHANGELOG.md` para el detalle de cada etapa.
- **Apps Script requiere redeploy manual**: el código en `apps-script/` es la fuente de verdad del repo, pero debe **pegarse en el editor de GAS y redeployarse** (nueva versión). Sin redeploy, los POST del frontend fallan en silencio (usan `no-cors`).
- **Backend GAS alineado al estándar (desde Etapa 10)**: `apps-script/` sigue la estructura de `commerce-hub` (`../project-standards/apps_script_standards.md`): `Code.gs` (solo router `doPost`/`doGet` + `jsonResp`/`errorResp`), `Users.gs` (auth/RBAC), `Helpers.gs`, `Schema.gs`, `Setup.gs` (`setupAll`), `AuditLog.gs`, y un archivo por dominio (`Sellers`/`Calificaciones`/`Relevamientos`/`DefinicionTecnica`/`Tarifas`/`Gantt`/`Integraciones`).
- **No renombrar columnas ni pestañas del Sheet** sin revisar todos los parsers. Las URLs CSV publicadas usan `gid` numérico — si se cambia el nombre de una pestaña, el gid no cambia, pero el texto puede romper parsers que buscan por nombre.
- **Pestaña `overrides`**: tiene una fila de banner y una fila de instrucciones ANTES del header real. Todo parser debe buscar la fila que contiene `seller_id`, nunca asumir que la fila 0 es el header.
- **Logos solo en `assets/logos/`** — los fallbacks dinámicos construyen `assets/logos/{seller_id en minúsculas}.png`. La vieja carpeta `Logos/` de raíz fue eliminada.
- **`seller_id` ya no se comparte por URL (desde Etapa 3)**: las 4 páginas de `public/` (formularios, presentación, simulador) leen el `seller_id` de la sesión autenticada (`SellerSESSION.sellerId`), no de `?seller_id=` en el link. El acceso se distribuye como credenciales (usuario/contraseña por seller), no como URL. `public/login.html` es el punto de entrada; `public/index.html` es el hub post-login del seller.
- **No hacer push** sin confirmación explícita del usuario.
- **Identidad visual dual (desde 2026-07-01)**: `index.html` y todo `internal/` usan el design system estándar del ecosistema (tema claro, DM Sans/DM Mono, azul institucional `#1a3f6b`). **`public/` mantiene el verde de Sporting a propósito** — son las páginas que ve el seller externo y deben conservar la marca con la que ya lo reconoce. No alinear `public/` al azul interno. Ver `docs/decisions/2026-07-01-alineacion-design-system.md`.
- **Portal con contexto de seller (desde Etapa 9)**: las páginas de `public/` son **dual-mode**. Cargadas con sesión de seller (`mp_seller_session`) van fijas a su propio `seller_id`. Cargadas con sesión interna de staff (`mp_session`) entran en **modo "ver como seller"**: `auth-seller.js` monta una barra inferior con un selector de sellers y el staff ve el módulo verde con los datos del seller elegido (`target_seller_id`). El backend deriva el alcance del token (`_aplicarSellerScope` en `Apps_script_v5.js`): un seller **nunca** puede pasar `target_seller_id` para ver otro; el tier `externo`/`interno` de `MP_RBAC_MODULOS` es una **regla dura** (un seller nunca alcanza un módulo interno). Los links a los módulos externos viven en la sección "Vista de sellers" del sidebar interno, gateados por RBAC (`data-page="ext_*"`).
- **`internal/seller-center/maqueta-seller-center.html` está excluida** del design system del proyecto: simula intencionalmente la UI de una herramienta PIM genérica (paleta gris/azul propia, no la marca Sporting). No migrarla a los tokens del proyecto.

---

## Stack específico

- **Sin auth de sesión** — sitio estático puro, sin login
- **Sin framework, sin build step** — HTML/CSS/JS inline por página; todo funciona como archivo estático en GitHub Pages
- **Backend**: Google Apps Script (`apps-script/`, router en `Code.gs`) vía `fetch` con `no-cors` para escritura; Google Sheets publicados como CSV para lectura. No hay capa JS compartida de `fetch` — cada página hace sus propias llamadas (evaluado y descartado centralizar, ver ADR).
- **Configuración central**: `window.MP_CONFIG` en `assets/js/config.js` — URLs de Sheets, Apps Script, rutas, logos
- **CSS**: `assets/css/tokens.css` (variables globales, paleta canónica del ecosistema) + `assets/css/internal-components.css` (componentes compartidos: `.button`/`.secondary`/`.danger`/`.ghost`, `.field-error`) + `assets/css/pages/` (estilos por página)
- **Tipografía**: DM Sans (`--font`) + DM Mono (`--mono`) en `index.html`/`internal/` (excepto la maqueta). `public/` sigue con su tipografía/paleta propia — no tocar.
- **Sin multi-store** — contexto único (Sporting Marketplace)
- **Sin modo oscuro** — quedó fuera de alcance de la alineación al design system; se puede agregar a futuro como mejora incremental sobre los tokens ya migrados.

---

## Arquitectura del repositorio

```
/
├─ index.html                  Hub Central — único HTML en la raíz
├─ internal/                   Uso interno del equipo
│  ├─ backlog/                 gestion-sellers, backlog-sellers
│  ├─ gantt/                   gantt-operativo, gantt-seller-center
│  ├─ seller-center/           dashboard, maqueta PIM
│  ├─ simuladores/             simulador-economico, config-tarifas
│  └─ estrategia/              páginas informativas
├─ public/                     Páginas compartibles con sellers (?seller_id=SPT-XXX)
│  ├─ formularios/             formulario-calificacion, formulario-relevamiento
│  ├─ presentaciones/          presentacion-seller
│  └─ simuladores/             simulador-seller
├─ assets/js/config.js         MP_CONFIG: URLs, rutas, config central
├─ apps-script/                Fuente del backend GAS (Code/Users/Helpers/Schema/dominios)
└─ docs/                       Documentación viva
```

---

## Google Sheet clave

ID: `1S_pl358H8nbJC3xgd7UpRpOxTYkC_hopYcBX6WzMlzU`

Pestañas publicadas como CSV:
- `tarifas` (gid `42870561`)
- `overrides` (gid `649807159`) — ver regla de parser arriba
- `sellers` (gid `899415596`)

---

## Dónde mirar según la tarea

| Tarea | Empezar por |
|-------|-------------|
| Tarifas / overrides / simuladores | `internal/simuladores/config-tarifas.html` y los parsers en ambos simuladores |
| Gantt / timeline | `docs/handoff-post-v1.md`, `docs/data-dictionary-timeline.md` |
| Backend (formularios, guardado) | `apps-script/Code.gs` (router `doPost` por `action`) + el dominio correspondiente (`Sellers.gs`, `Calificaciones.gs`, etc.) |
| Configuración de URLs y rutas | `assets/js/config.js` (`MP_CONFIG`) |
| Historia del proyecto | `CHANGELOG.md`, `docs/roadmap.md` |
| Tokens, colores, tipografía, componentes | `assets/css/tokens.css`, `assets/css/internal-components.css`, `docs/decisions/2026-07-01-alineacion-design-system.md` |

---

## Versionado

Este proyecto usa `CHANGELOG.md` en la raíz. No hay versionado embebido en `config.js`. Actualizar el changelog al hacer cambios funcionales visibles.

---

## Documentación estándar compartida

La documentación estándar compartida se encuentra en `../project-standards/`:

- [`../project-standards/ai_rules.md`](../project-standards/ai_rules.md) — reglas de colaboración con IA
- [`../project-standards/style_guide.md`](../project-standards/style_guide.md) — colores, tipografía, componentes CSS, Git
- [`../project-standards/apps_script_standards.md`](../project-standards/apps_script_standards.md) — convenciones GAS
- [`../project-standards/google_sheets_standards.md`](../project-standards/google_sheets_standards.md) — estructura de Sheets
- [`../project-standards/login_standard.md`](../project-standards/login_standard.md) — patrón de autenticación
- [`../project-standards/application_shell.md`](../project-standards/application_shell.md) — shell de aplicación

### Entorno de trabajo

- El desarrollo se realiza desde `C:\Users\gluna\Documents\Repos`
- No usar OneDrive/SharePoint como carpeta de desarrollo
- GitHub es la fuente principal para versionado y colaboración
- OneDrive/SharePoint queda reservado para documentación funcional: archivos compartidos, PDFs, presentaciones, actas e imágenes
