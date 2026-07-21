# Labels de filtro: siempre visibles, no autodescriptos por el valor del select

Fecha: 2026-07-21
Estado: aceptada

## Contexto

Al revisar la barra de filtros de Seguimiento Operativo (`internal/gantt/gantt-operativo.html`) contra la de "Tareas" en Project Control Center (PCC), se probó adoptar el patrón de PCC: sacar el label en mayúscula que vive arriba de cada `<select>` y dejar que la opción por defecto lo reemplace ("Todos los estados", "Todas las prioridades"). El cambio se implementó, se subió a producción (v1.4.41) y se revirtió en el mismo día tras revisión crítica.

## Decisión

**Cada filtro mantiene su label visible arriba del control** (`<label class="fi-label">`, patrón ya usado en Backlog y Gestión de Sellers). No se oculta ni se elimina, ni siquiera cuando el control ya tiene una opción por defecto autodescriptiva.

Se mantienen, en cambio, las mejoras que no dependían de sacar el label:
- Opciones por defecto autodescriptivas ("Todos los estados" en vez de "Todos", "Todas las áreas" en vez de "Todas") — ayudan en el estado inicial del filtro y no tienen contraindicación.
- Ícono de lupa en el buscador.
- Orden de "Mis tareas" junto a Responsable.

## Por qué se descarta el patrón de PCC

1. **El label deja de importar en el peor momento posible.** Sin label, "Todos los estados" es perfectamente legible — el problema aparece cuando el usuario **activa** un filtro: el select pasa a mostrar solo el valor elegido ("Bloqueado", "Técnica", "eCommerce", "Gabriel Luna"), sin ninguna pista de a qué categoría pertenece. Con 6-7 selects en fila mostrando valores sueltos, la barra deja de ser escaneable de un vistazo — hay que leer cada control para reconstruir qué está filtrado. Es exactamente el momento en que un filtro activo debería ser *más* legible, no menos.
2. **PCC no resuelve esto ni con accesibilidad.** Al relevar el código fuente de PCC (`modules/tareas/tareas.html`) se confirmó que esos `<select>` no tienen `label` ni `aria-label` — cero nombre accesible para lectores de pantalla. No es una decisión de diseño documentada en ese repo; es simplemente el estado en que quedó. Adoptarlo como "estándar" sin auditar esta falla fue el error real de la primera vuelta de este cambio.
3. **El ahorro de espacio es marginal frente a la pérdida de contexto.** Sacar la fila de labels ahorra ~30-40px de alto. A cambio, se pierde legibilidad estructural en un panel con 7 filtros heterogéneos (a diferencia de PCC, que tiene menos filtros y de vocabulario más autoexplicativo por dominio de tareas).

## Alternativas consideradas

| Alternativa | Motivo del rechazo |
|-------------|---------------------|
| Ocultar el label visualmente pero mantenerlo en el DOM vía `.sr-only` (lo implementado en v1.4.41) | Resuelve la falla de accesibilidad de PCC, pero no resuelve el problema real (pérdida de contexto visual cuando el filtro está activo) — que es la razón principal por la que un label sirve, más allá de accesibilidad. |
| Mostrar el label solo cuando el filtro tiene un valor no-default (label condicional) | Añade complejidad de estado (mostrar/ocultar por filtro) para resolver un problema que un label siempre visible resuelve de forma trivial y sin JS extra. No hay beneficio que justifique la complejidad. |

## Consecuencias

- Este es ahora el estándar del proyecto para cualquier barra de filtros nueva o migrada: label visible arriba de cada control + opción por defecto autodescriptiva cuando aplica.
- Si en el futuro se evalúa un patrón de otro proyecto del ecosistema (PCC, VTEX Control Center, etc.) como referencia de estilo, se audita primero si resuelve accesibilidad y legibilidad en estado "filtro activo" antes de portarlo — no alcanza con que se vea bien en la captura de pantalla del estado default.
