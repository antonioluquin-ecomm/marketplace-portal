# Alineación al design system estándar del ecosistema

Fecha: 2026-07-01
Estado: aceptada

## Contexto

Marketplace Portal se desarrolló de forma visualmente independiente del resto de los proyectos internos (Commerce Hub, VTEX Control Center, Project Control Center, Customer Service Control Center). El resultado es un sistema propio: tema oscuro con verde `#6aa84f` como color primario, tipografía Barlow/Barlow Condensed, fondo casi negro (`#101311`), naming de tokens CSS propio (`--g`, `--k`, `--t1`, `--s1`...), y componentes de botón/tabla/form con clases ad hoc (`.tbtn`, `.maction`, `.share-btn`) en vez de las clases canónicas definidas en `../../../project-standards/style_guide.md`.

El estándar compartido (`style_guide.md`, `application_shell.md`, `navigation_standard.md`) define un sistema de tema claro por defecto (DM Sans/DM Mono, azul institucional `#1a3f6b`), con un shell de sidebar (224px) + topbar (50px) y componentes canónicos de botón, tabla y formulario. Ningún otro proyecto del ecosistema comparte hoy el sistema visual de Marketplace Portal, lo que dificulta el mantenimiento cruzado y la incorporación de patrones nuevos (ej. componentes de tabla con sorting/paginación ya resueltos en otros proyectos).

## Decisión

Alinear Marketplace Portal al design system estándar del ecosistema, en etapas incrementales (ver plan de estandarización), con el siguiente alcance:

1. **Dirección visual:** adoptar el tema claro estándar completo — fondo `#f0f2f7`, tipografía DM Sans/DM Mono, azul institucional `#1a3f6b` como color primario. Se abandona la identidad verde/oscura actual.
2. **Auth/RBAC:** el proyecto mantiene la regla explícita de `CLAUDE.md` — **sin auth de usuario**. No se implementa login, sesiones ni roles como parte de esta alineación. El shell (sidebar/topbar) se estructura de forma compatible con el patrón usado en proyectos con auth, para que agregar login en el futuro sea un cambio incremental y no un rediseño. La implementación de auth queda fuera de este esfuerzo y se evaluará en una conversación separada.
3. **Modo oscuro:** queda fuera de alcance de esta alineación. `style_guide.md §3.6` lo trata como opcional — se puede agregar después como mejora incremental sobre los tokens ya migrados a claro.
4. **Versionado:** se mantiene `CHANGELOG.md` en la raíz del proyecto (alternativa explícitamente válida en `style_guide.md §9.1` para proyectos sin `config.js` de versión). No se agrega badge de versión en sidebar como parte de esta alineación.
5. **Alcance de módulos internos:** `index.html` es el único archivo con sidebar completo. Los 14 módulos de `internal/` siguen el patrón Tipo A de `application_shell.md §11` (multi-página sin sidebar, topbar de módulo con eyebrow + H1 + subtítulo + "← Volver al inicio"). No se agrega sidebar a los módulos.
6. **Excepción — `internal/seller-center/maqueta-seller-center.html`:** este archivo queda **excluido** de la migración. A diferencia del resto del portal, ya usa un tema claro con una paleta propia (gris `#3b3b3b` / azul `#0b7fe8`) que simula intencionalmente la interfaz de una herramienta tipo PIM genérica, ajena a la marca Sporting Marketplace — es un prototipo de producto, no una pantalla del portal. Migrarlo a DM Sans/azul institucional destruiría su propósito como demo. Decisión tomada durante la Etapa 3 (Lote D) al detectar la divergencia intencional.
7. **Excepción — `public/` (páginas compartidas con sellers):** las 4 páginas de `public/formularios/`, `public/presentaciones/` y `public/simuladores/` quedan **excluidas** de la migración y **fuera de alcance permanente** de este esfuerzo (no solo pospuestas). Son las páginas que se comparten directamente con sellers externos vía `?seller_id=SPT-XXX` y deben mantener la identidad visual verde de Sporting — es la marca con la que el seller ya reconoce al Marketplace. Alinearlas al azul institucional interno rompería esa continuidad de marca cara al cliente externo. Decisión explícita del usuario, tomada antes de iniciar la Etapa 4 del plan original. La Etapa 4 del plan de estandarización queda cancelada.

## Alternativas consideradas

| Alternativa | Motivo del rechazo |
|-------------|---------------------|
| Mantener la identidad verde/oscura actual y solo alinear estructura (spacing, radios, sombras, tipografía) manteniendo `--primary` propio | Descartada por decisión explícita del usuario: se prioriza la consistencia visual completa con el resto del ecosistema sobre preservar la identidad de marca actual del proyecto. |
| Implementar auth/RBAC completo como parte de esta misma iniciativa | Contradice la regla activa de `CLAUDE.md` ("Sin auth de usuario") y aumenta significativamente el alcance, el riesgo (toca la freeze zone de Apps Script) y la duración del esfuerzo. Se deja como fase futura separada. |
| Adoptar modo oscuro simultáneamente con el modo claro | Duplica el esfuerzo de CSS en un proyecto ya grande (18 HTML, 9 CSS). Se prioriza terminar la migración a claro antes de sumar una segunda variante de tema. |

## Consecuencias

- Todas las páginas (18 HTML) requieren migración de tokens, tipografía y, en la mayoría de los casos, de clases de componentes (botones, forms, tablas).
- El sitio cambia de identidad visual de forma perceptible para cualquier usuario que ya lo conozca (sellers incluidos, en las páginas públicas).
- Se gana consistencia con el resto del ecosistema: componentes reutilizables (tablas con sorting/paginación, botones canónicos, forms con `.field-error`) documentados y ya resueltos en otros proyectos.
- El shell queda preparado estructuralmente para admitir auth/RBAC en el futuro sin rediseño, aunque esa implementación no es parte de este esfuerzo.

## Riesgos

- Alto volumen de archivos (18 HTML + 9 CSS + 3 JS) implica alto riesgo de regresiones visuales o de comportamiento si se migra todo de una vez — mitigado ejecutando en etapas/lotes pequeños con verificación y checkpoint de usuario entre cada uno (ver plan de estandarización).
- Páginas públicas (`public/`) son usadas directamente por sellers vía `?seller_id=SPT-XXX` — cualquier cambio de CSS que afecte JS de precarga/guardado de borrador podría romper un flujo en producción. Mitigado tratando la Etapa 4 del plan como riesgo alto, sin tocar lógica JS, solo clases/estilos.
- El componente de tablas con sorting/paginación (Etapa 5 del plan) toca JS de render existente — mayor riesgo técnico que el resto de las etapas puramente visuales.

## Validación requerida

- Cada etapa del plan de estandarización se valida en preview server antes de commitear: sin errores de consola, links del hub funcionando, parsers de CSV intactos, `?seller_id` preservado en páginas públicas.
- Checklist de smoke visual de `docs/project_workflow.md §8` al cierre de la migración completa.
