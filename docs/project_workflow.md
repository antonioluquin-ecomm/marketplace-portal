# Project Workflow — Marketplace Portal

| Campo | Detalle |
|-------|---------|
| Versión | v1.0 |
| Actualizado | 2026-06-25 |
| Estado | Activo |
| Documentos relacionados | `../project-standards/ai_rules.md` · `../project-standards/style_guide.md` · `CLAUDE.md` |

---

## 1. Propósito

Workflow operativo del Marketplace Portal: hub central de gestión del marketplace de sellers (Sporting). Las reglas genéricas de proceso viven en `../project-standards/project_workflow_template.md`.

---

## 2. Documentos maestros

| Necesito saber... | Ir a... |
|---|---|
| Reglas de colaboración con IA | `../project-standards/ai_rules.md` |
| Colores, CSS, Git | `../project-standards/style_guide.md` |
| Convenciones GAS | `../project-standards/apps_script_standards.md` |
| Estructura del Sheet | `CLAUDE.md` (sección Google Sheet clave) |
| Instrucciones específicas para Claude Code | `CLAUDE.md` |

---

## 3. Tipos de cambios y riesgo

| Tipo | Riesgo | Requiere |
|------|--------|----------|
| Documentación, labels, copy | Bajo | Commit claro |
| CSS visual, páginas informativas | Bajo–Medio | Smoke visual |
| JS de página, filtros, render dinámico | Medio | Smoke + consola |
| Parsers de CSV, `config.js` (MP_CONFIG), GAS | Alto | Auditoría previa |
| Formularios con submit, endpoints GAS | Crítico | Ver §7 |

---

## 4. Flujo de trabajo estándar

```
1. Descubrimiento  → entender problema, alcance, restricciones
2. Auditoría       → sin modificar archivos (cuando el alcance no está claro)
3. Implementación  → cambios pequeños, archivos explícitos
4. Validación      → smoke, consola, lectura de CSV si aplica
5. Documentación   → CHANGELOG si es cambio visible
6. Release         → push a main, verificar GitHub Pages
```

---

## 5. Flujo de release

1. Smoke del Hub Central (`index.html`) y las páginas afectadas
2. Verificar que parsers de CSV leen correctamente (sin errores de consola)
3. Para cambios en GAS: redeploy manual como nueva versión en el editor de GAS
4. Commit con prefijo convencional
5. Push a `main`
6. Verificar GitHub Pages y esperar propagación de caché

---

## 6. Checklist pre-push

```
[ ] Hub Central carga y todos los links funcionan
[ ] Páginas afectadas cargan sin errores de consola
[ ] Parsers de CSV obtienen datos (revisar red si aplica)
[ ] URLs públicas con ?seller_id funcionan si se tocaron
[ ] GAS redeployado como nueva versión (si se modificó el GAS)
[ ] Logos en assets/logos/ y no en la raíz
```

---

## 7. Freeze zones

### 7.1 Zonas congeladas

| Zona | Razón |
|------|-------|
| `integrations/apps-script/Apps_script_v5.js` | Router `doPost` — cambio aquí rompe todos los formularios |
| `assets/js/config.js` — `MP_CONFIG` | Configuración central de URLs, rutas y logos; cambio estructural afecta todas las páginas |
| Parser de pestaña `overrides` | Tiene 2 filas de encabezado antes del header real; el parser busca la fila con `seller_id`, no asume fila 0 |
| URLs publicadas como CSV (`tarifas`, `overrides`, `sellers`) | Cambiar nombre de pestaña no cambia el `gid` pero puede romper parsers por nombre |
| Parámetros `?seller_id=SPT-XXX` en páginas públicas | Sellers usan esos links directos; un redirect que no preserve el query string los rompe |
| `assets/logos/` | Los fallbacks dinámicos construyen la ruta en base al `seller_id`; mover la carpeta rompe todos los logos |

### 7.2 Protocolo para freeze zones

1. Auditoría del módulo (sin modificar)
2. Identificar qué páginas leen la config o el parser que se va a tocar
3. Implementar con archivos explícitos
4. Para cambios en GAS: redeploy manual obligatorio antes de validar
5. Documentar el cambio en `CLAUDE.md` o `docs/decisions/`

### 7.3 Declaración de freeze en prompts

```
Modificar solo:
- internal/backlog/gestion-sellers.html
- assets/css/pages/gestion-sellers.css

No modificar:
- integrations/apps-script/Apps_script_v5.js
- assets/js/config.js
- assets/logos/
```

---

## 8. Smoke visual y QA

```
[ ] Hub Central (index.html) carga y todos los cards tienen links funcionales
[ ] Páginas internas afectadas cargan sin errores de consola
[ ] Parsers de CSV: tarifas, overrides y sellers cargan correctamente
[ ] Simuladores: cálculos producen resultados coherentes
[ ] Páginas públicas: ?seller_id en URL → datos correctos del seller
[ ] Logos: aparecen desde assets/logos/ o fallback visible
[ ] Mobile: hub y páginas principales sin overflow
```

---

## 9. Convenciones del proyecto

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Config central | `window.MP_CONFIG` en `assets/js/config.js` | acceso como `MP_CONFIG.urls.tarifas` |
| Logos de sellers | `assets/logos/{seller_id en minúsculas}.png` | `assets/logos/spt-001.png` |
| Páginas internas | `internal/<área>/<nombre>.html` | `internal/simuladores/config-tarifas.html` |
| Páginas públicas con seller | `public/<tipo>/<nombre>.html?seller_id=SPT-XXX` | |
| Parser de overrides | siempre buscar fila con `seller_id`, no asumir índice fijo | |
| Escritura al GAS | `fetch` con `no-cors` (sin acceso a la respuesta) | |

---

## 10. Aprendizajes — Marketplace Portal

> Documentar aprendizajes aquí a medida que aparezcan.

### 10.1 GAS con `no-cors`: el POST no tiene respuesta accesible

Los formularios escriben al GAS usando `fetch` con `mode: 'no-cors'`. Esto significa que la respuesta del GAS es opaca — no se puede leer si fue exitosa. Verificar el Sheet directamente o agregar un log en el GAS para depurar.

### 10.2 Redeploy del GAS es obligatorio para que los cambios tomen efecto

El código en `integrations/apps-script/` es la fuente de verdad del repo, pero el GAS productivo es el que está en el editor de Google. Sin redeploy manual (nueva versión), los POST del frontend siguen hitting la versión anterior.

### 10.3 El parser de overrides tiene 2 filas antes del header

La pestaña `overrides` tiene una fila de banner y una fila de instrucciones ANTES del header real. Todo parser debe buscar dinámicamente la fila que contiene `seller_id`, nunca asumir que la fila 0 o 1 es el header.
