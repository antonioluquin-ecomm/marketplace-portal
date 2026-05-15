# Arquitectura del Proyecto

## Diagnostico actual

Marketplace Portal se encuentra en una etapa funcional pero estructuralmente organica. La raiz del repositorio concentra paginas HTML, configuracion, integraciones, documentacion, datos y assets.

Principales caracteristicas actuales:

- multiples HTML independientes en la raiz;
- nombres de archivo con version acumulada;
- CSS inline repetido por pagina;
- JavaScript embebido en cada HTML;
- URLs de Google Sheets y Apps Script declaradas en varias paginas;
- assets concentrados en `Logos/`;
- documentos operativos y archivos de datos en la raiz;
- rutas futuras mencionadas en links y configuracion;
- estructura fisica futura creada como base, aun sin migracion funcional;
- ausencia de `index.html` oficial.

## Problemas arquitectonicos

Los problemas principales no son de funcionalidad inmediata, sino de mantenibilidad:

- mezcla de responsabilidades entre contenido, estilos, logica, datos e integraciones;
- duplicacion de layout, navegacion, tokens visuales y helpers;
- dificultad para actualizar rutas o fuentes de datos de forma centralizada;
- riesgo de romper URLs compartidas con usuarios internos o sellers;
- crecimiento dificil de gobernar si se siguen agregando paginas en la raiz;
- falta de separacion clara entre paginas internas, publicas y legacy.

## Arquitectura objetivo

La arquitectura objetivo debe seguir siendo compatible con GitHub Pages y evitar complejidad innecesaria. En una primera fase se recomienda mantener el proyecto como sitio estatico, sin introducir build obligatorio.

Estructura objetivo sugerida:

```txt
/
├─ index.html
├─ assets/
│  ├─ css/
│  ├─ js/
│  ├─ logos/
│  └─ images/
├─ internal/
│  ├─ backlog/
│  ├─ gantt/
│  ├─ seller-center/
│  ├─ simuladores/
│  └─ estrategia/
├─ public/
│  ├─ formularios/
│  ├─ simuladores/
│  └─ presentaciones/
├─ integrations/
│  └─ apps-script/
├─ data/
├─ docs/
├─ legacy/
└─ PROJECT_WORKFLOW.md
```

Estado de implementacion de estructura:

- La estructura base de carpetas ya existe fisicamente.
- Las carpetas nuevas contienen `.gitkeep` para ser registradas por Git.
- No se migraron paginas HTML existentes.
- No se cambiaron rutas actuales.
- No se copiaron assets, scripts ni integraciones a sus destinos futuros.

## Separacion propuesta

`internal/`: paginas de operacion interna, backlog, seller center, gantt, governance, modelos y herramientas de gestion.

`public/`: paginas compartibles con sellers, como formularios, presentaciones y simuladores publicos.

`assets/`: recursos reutilizables de frontend, incluyendo CSS, JS, logos e imagenes.

`docs/`: documentacion viva, arquitectura, roadmap, mapa del hub, matriz de validacion y decisiones.

`integrations/`: codigo y documentacion de integraciones externas, especialmente Google Apps Script.

`data/`: archivos de datos fuente o respaldos operativos no embebidos en paginas.

`legacy/`: versiones historicas o aliases temporales cuando la migracion este validada.

## Criterios de migracion

- Migrar por etapas pequenas.
- Crear estructura fisica antes de mover paginas.
- Mantener las paginas actuales hasta validar sus equivalentes nuevos.
- No cambiar funcionalidad durante cambios puramente estructurales.
- No cambiar diseno durante cambios documentales o de rutas.
- Registrar cada decision relevante.
- Validar carga, links, datos externos y consola antes de publicar.
- Proteger paginas publicas y URLs ya compartidas.
- Mantener compatibilidad con GitHub Pages.

## Riesgos principales

Riesgo bajo:

- crear documentacion;
- inventariar paginas;
- definir convenciones;
- crear roadmap y matriz de pruebas.

Riesgo medio:

- crear `index.html`;
- copiar paginas a carpetas futuras;
- ajustar navegacion;
- centralizar assets;
- introducir CSS o JS compartido sin retirar inline existente.

Riesgo alto:

- eliminar archivos versionados de raiz;
- mover formularios publicos sin redirects;
- modificar Apps Script o endpoints;
- cambiar nombres de columnas o fuentes CSV;
- extraer logica compleja de simuladores;
- realizar refactors masivos sin validacion.
