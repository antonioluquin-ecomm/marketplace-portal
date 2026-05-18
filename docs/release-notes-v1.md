# Marketplace Portal V1 - Release Notes

Fecha de cierre documental: 2026-05-18

Estado: estable, listo para release.

## Resumen

Marketplace Portal V1 cierra la primera reestructuracion institucional del proyecto. La version consolida la arquitectura estatica del portal, separa rutas internas y publicas, conserva compatibilidad con URLs legacy mediante aliases y deja una base documental operable para evolucionar sin romper GitHub Pages ni flujos existentes.

## Alcance incluido

- `index.html` institucional como entrada principal del portal.
- Estructura base creada: `assets/`, `internal/`, `public/`, `integrations/`, `data/`, `legacy/` y `docs/`.
- Paginas internas migradas por copia segura hacia `internal/`.
- Paginas publicas seller-facing migradas por copia segura hacia `public/`.
- `assets/logos/` centralizado con copia validada de logos `spt-001.png` a `spt-015.png`.
- Fallback local de logos aplicado por etapas en paginas migradas seleccionadas.
- `assets/css/tokens.css` aplicado y validado solo en paginas internas de bajo riesgo.
- Aliases legacy implementados para todos los HTML versionados que ya tienen ruta nueva.
- Smoke test manual de aliases 7C-7F documentado con resultado OK.
- Documentacion viva actualizada: README, changelog, roadmap, hub-map, test matrix y estrategia de assets.

## Compatibilidad legacy

Los HTML versionados de raiz que ya tienen ruta nueva se mantienen como aliases estaticos. Cada alias:

- usa `meta refresh` como fallback;
- usa `window.location.replace()`;
- preserva `location.search` y `location.hash`;
- preserva `seller_id` en paginas publicas;
- muestra enlace manual si la redireccion falla.

`sporting-marketplace_hub_v29.html` queda intacto como hub operativo historico temporal. No se convierte en alias a `index.html` en V1 porque conserva funcionalidades operativas no replicadas en la entrada institucional.

## Validaciones

Smoke test manual de aliases:

- Resultado general: OK.
- Aliases redirigen a rutas nuevas correctas.
- Query string y hash se preservan.
- En paginas publicas se conserva `seller_id=SPT-001`.
- No hay 404 criticos.
- No se ejecuto submit real en Gestion de Sellers ni formularios.
- `sporting-marketplace_hub_v29.html` no fue modificado.

## Exclusiones V1

- No se movieron archivos a `legacy/`.
- No se eliminaron archivos legacy.
- No se convirtio `sporting-marketplace_hub_v29.html` en alias.
- No se aplico `tokens.css` a paginas publicas seller-facing.
- No se extrajo CSS ni JavaScript inline de forma masiva.
- No se refactorizo logica funcional.
- No se modificaron Apps Script, endpoints, payloads, submit ni `localStorage`.
- No se modificaron formulas de simuladores.
- No se cambiaron flujos de formularios.

## Riesgos residuales

- Gestion de Sellers y formularios mantienen escritura real via Apps Script en las paginas destino.
- Formularios no deben probarse con submit real salvo etapa autorizada con seller de test.
- Formulario de Relevamiento conserva el riesgo documentado `pctSec`.
- Backlog, Gantt y simuladores dependen de datos externos y CSV publicados.
- `sporting-marketplace_hub_v29.html` queda como hub operativo historico temporal. En post-V1 debe evaluarse si su funcionalidad se integra en `index.html`, si se crea `internal/hub-operativo.html`, o si luego corresponde alias/pagina de transicion.

## Recomendaciones post-V1

1. Publicar V1 despues de revisar el diff documental y aliases.
2. Mantener congelados cambios funcionales hasta cerrar release.
3. Planificar V2 con decisiones separadas para hub operativo legacy, limpieza `legacy/`, extraccion CSS/JS y pruebas controladas de formularios.
4. No iniciar refactors masivos sin nueva auditoria y smoke test por grupo.

## Decision sobre hub legacy

Decision V1: mantener `sporting-marketplace_hub_v29.html` intacto como hub operativo historico temporal.

Motivo:

- `index.html` cumple rol institucional, liviano y documental.
- `sporting-marketplace_hub_v29.html` conserva sidebar, flujo de incorporacion, accesos rapidos, recursos por proceso, buscador, mapa de rutas y grid dinamico.
- Convertirlo ahora en alias a `index.html` eliminaria una herramienta operativa util.
- `index.html` todavia lo referencia como "Hub central actual" / "Referencia temporal", por lo que convertirlo ahora podria generar links redundantes o circulares.

Recomendacion post-V1:

- evaluar si la funcionalidad operativa se integra en `index.html`;
- o crear una ruta nueva `internal/hub-operativo.html`;
- recien despues decidir si `sporting-marketplace_hub_v29.html` pasa a alias, pagina de transicion o archivo en `legacy/`.
