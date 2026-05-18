# Marketplace Portal - Release Notes Post-V1

Fecha de cierre documental: 2026-05-18

Estado: Etapa 9 cerrada.

## Resumen

Despues del cierre V1, Marketplace Portal incorporo el hub operativo interno oficial y completo el reemplazo seguro del hub legacy versionado mediante alias.

## Alcance incluido

- Creacion de `internal/hub-operativo.html` como hub operativo oficial.
- Conservacion funcional del hub legacy: sidebar, flujo de incorporacion, accesos rapidos, recursos por proceso, buscador, mapa de rutas, grid dinamico y separacion entre recursos internos y publicos.
- Acceso a "Abrir Hub Operativo" desde `index.html`.
- Conversion de `sporting-marketplace_hub_v29.html` en alias hacia `internal/hub-operativo.html`.
- Smoke test OK del hub operativo.
- Smoke test OK del alias legacy, incluyendo preservacion de query string y hash.

## Estado final

- Entrada institucional: `index.html`.
- Hub operativo oficial: `internal/hub-operativo.html`.
- URL legacy/alias: `sporting-marketplace_hub_v29.html`.

## Validaciones

- `internal/hub-operativo.html` carga correctamente.
- Sidebar, accesos rapidos, buscador y grid dinamico funcionan.
- Links internos abren rutas `internal/`.
- Links publicos abren rutas `public/`.
- `sporting-marketplace_hub_v29.html` redirige correctamente a `internal/hub-operativo.html`.
- `sporting-marketplace_hub_v29.html?test=1#mapa` redirige a `internal/hub-operativo.html?test=1#mapa`.
- No hay 404 criticos.

## Exclusiones

- No se tocaron formularios.
- No se tocaron simuladores.
- No se tocaron Backlog ni Gestion de Sellers.
- No se tocaron Apps Script, config, endpoints, payloads ni submit.
- No se movieron ni eliminaron archivos.
- No se extrajo CSS ni JavaScript.

## Recomendaciones siguientes

1. Publicar o confirmar el estado post-V1 con diff revisado.
2. Abrir una Etapa 10A solo como auditoria de mejoras del hub operativo.
3. Mantener congelados formularios, simuladores, Backlog, Gestion, Apps Script y config hasta etapa especifica.

## Etapa 10B/10C - mejoras seguras del Hub Operativo

Estado: implementada y validada.

Mejoras incluidas:

- Link "Volver al Portal" desde `internal/hub-operativo.html` hacia `../index.html`.
- Buscador con descripcion de recursos incluida en el indice.
- Estado visual "Sin resultados" para busquedas sin coincidencias.
- Aclaracion de que los links publicos son base y pueden requerir `seller_id` para experiencias personalizadas.
- Mapa de rutas convertido en links clickeables.
- Ajuste mobile minimo para reducir overflow visual en topbar.
- Nota visual para contadores referenciales del sidebar.

Smoke test 10C:

- Resultado general: OK.
- `internal/hub-operativo.html` carga correctamente.
- "Volver al Portal" abre `../index.html`.
- Buscador encuentra resultados por titulo/label y descripcion.
- Buscador muestra "Sin resultados" cuando no hay coincidencias.
- Links publicos base abren `public/`.
- No hay `seller_id` hardcodeado.
- Mapa de rutas clickeable funciona.
- Topbar no rompe visualmente en mobile.
- No hay 404 criticos.

Exclusiones confirmadas:

- Sin cambios en `index.html`.
- Sin cambios en `sporting-marketplace_hub_v29.html`.
- Sin cambios en formularios, simuladores, Backlog, Gestion de Sellers, Apps Script, config, endpoints, payloads, submit ni storage.
- Sin refactor masivo ni extraccion CSS/JS.
