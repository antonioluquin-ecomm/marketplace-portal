# Metodología de Trabajo Asistido por IA
## Documento Institucional Base

| Campo | Detalle |
|---|---|
| Nombre del documento | Metodología de Trabajo Asistido por IA |
| Version | v1.3 |
| Estado | Activo |
| Objetivo | Guia institucional reutilizable para proyectos asistidos por IA |

## Índice

- 1. Objetivo del documento.
- 2. Principios generales de trabajo.
- 3. Metodologia de trabajo con IA.
- 4. Flujo recomendado de trabajo con IA.
- 5. Manejo de contexto y documentacion institucional.
- 6. Optimizacion de consumo de tokens.
- 7. Rol del equipo humano.
- 8. Estructura recomendada de proyectos.
- 9. Estado del proyecto y nivel de madurez.
- 10. Principio de simplicidad.
- 11. Flujo recomendado de trabajo.
- 12. Tipos de cambios.
- 13. Riesgo segun tipo de cambio.
- 14. Anti patrones comunes.
- 15. Validaciones recomendadas.
- 16. Flujo recomendado de release.
- 17. Documentacion tecnica vs operativa.
- 18. Documentacion viva.
- 19. Documentacion minima recomendada.
- 20. Uso de bases de datos ligeras.
- 21. Criterios para cerrar tareas.
- 22. Criterios para hacer deploy.
- 23. Manejo de errores y casos nuevos.
- 24. Cuando no usar IA o cuando limitar su uso.
- 25. Buenas practicas de prompts.
- 26. Checklist base del proyecto.
- 27. Convenciones recomendadas.
- 28. Regla operativa para comandos Git.
- 29. Nota final.

# 1. Objetivo del documento

Este documento establece una metodologia oficial y reutilizable para organizar, desarrollar, validar, documentar y mantener proyectos asistidos por IA.

La guia esta pensada para equipos que necesitan trabajar con claridad, trazabilidad y control, evitando retrabajo y reduciendo el consumo innecesario de tokens.

Sirve como base para:

- organizar proyectos desde el inicio;
- trabajar con IA de forma coordinada;
- separar auditoria, implementacion, validacion y release;
- reducir cambios fuera de alcance;
- mantener documentacion institucional compartida;
- validar antes de publicar;
- cerrar tareas con criterios claros;
- sostener mejora continua.

# 2. Principios generales de trabajo

- Claridad antes que velocidad.
- Cambios pequenos, controlados y verificables.
- Separar analisis, implementacion, validacion y release.
- Validar antes de publicar.
- Mantener trazabilidad de decisiones, cambios y riesgos.
- Documentar decisiones importantes.
- Evitar cambios fuera de alcance.
- Priorizar estabilidad y comprension.
- No mezclar cambios funcionales, visuales, estructurales y documentales si pueden tratarse por separado.
- Alinear la documentacion al publico objetivo.
- Reutilizar contexto institucional antes de volver a explicar el proyecto.
- La IA acelera el trabajo, pero no reemplaza el criterio del equipo.

# 3. Metodologia de trabajo con IA

## ChatGPT

ChatGPT se utiliza principalmente como capa de organizacion, estrategia, UX, documentacion y coordinacion funcional.

Responsabilidades principales:

- redaccion de requerimientos;
- definicion de alcance;
- organizacion funcional;
- documentacion operativa;
- validacion de UX y enfoque de usuario;
- coordinacion general;
- generacion de prompts claros y optimizados;
- transformacion de ideas ambiguas en planes accionables;
- preparacion de criterios de aceptacion;
- redaccion de guias, informes y releases.

ChatGPT debe ayudar a generar requerimientos claros y especificos para reducir consumo excesivo de tokens en Codex y Claude Code.

ChatGPT tambien puede actuar como capa de validacion funcional y coherencia documental entre distintas IA.

Tambien actua como capa de coordinacion entre:

- implementacion;
- auditoria;
- documentacion;
- validacion final.

Buenas practicas con ChatGPT:

- definir alcance antes de implementar;
- dividir tareas grandes en tareas pequenas;
- separar cambios funcionales, visuales, estructurales y documentales;
- pedir auditoria antes de cambios grandes;
- pedir criterios de aceptacion;
- redactar prompts especificos para otras IA;
- adaptar el lenguaje segun audiencia tecnica u operativa;
- pedir una propuesta antes de ejecutar cuando el problema no esta claro.

Evitar:

```txt
Mejoralo.
```

Preferir:

```txt
Auditar esta funcionalidad sin modificar archivos. Identificar problemas, riesgos, mejoras priorizadas y proponer el siguiente cambio de menor riesgo.
```

## Codex

Codex se utiliza principalmente trabajando sobre proyectos y carpetas locales.

Responsabilidades principales:

- implementacion;
- modificacion de archivos;
- creacion de estructura;
- builds;
- validaciones;
- generacion de documentacion tecnica;
- cambios controlados sobre el repositorio local;
- ajustes verificables con comandos o pruebas.

Codex debe trabajar respetando:

- alcance definido;
- archivos permitidos;
- archivos que no deben modificarse;
- validaciones esperadas;
- estructura institucional del proyecto;
- convenciones existentes;
- separacion entre cambios de logica, UI, estructura y documentacion.

Buenas practicas con Codex:

- indicar exactamente que archivos puede modificar;
- indicar que archivos no debe tocar;
- pedir siempre:
  - archivos modificados;
  - resumen del cambio;
  - validaciones realizadas;
  - riesgos detectados;
  - confirmacion de alcance;
- pedir que no cambie logica cuando la tarea sea visual o documental;
- pedir validaciones concretas;
- evitar prompts ambiguos como "mejoralo" o "hacelo mas lindo";
- pedir implementaciones pequenas antes que refactors grandes.

Ejemplo recomendado:

```txt
Modificar solo src/form.js y docs/release.md.
No cambiar logica de validacion.
Agregar mensajes visibles.
Ejecutar npm test.
Devolver archivos modificados, validaciones y riesgos.
```

## Claude Code

Claude Code se utiliza principalmente trabajando sobre proyectos locales para auditorias profundas y analisis arquitectonico.

Responsabilidades principales:

- auditorias profundas;
- analisis arquitectonico;
- revision critica;
- evaluacion de escalabilidad;
- identificacion de deuda tecnica;
- analisis complejos de consistencia;
- propuestas de refactor;
- deteccion de riesgos antes de cambios grandes.

Claude Code debe utilizarse especialmente antes de:

- refactors grandes;
- cambios estructurales;
- decisiones de arquitectura;
- reorganizacion de modulos;
- cambios con alto impacto transversal.

Buenas practicas con Claude Code:

- pedir auditorias antes de implementar;
- pedir hallazgos priorizados;
- separar auditoria de implementacion;
- pedir riesgos, deuda tecnica y opciones;
- evitar cambios masivos sin validacion previa;
- usarlo para entender sistemas complejos antes de modificarlos.

# 4. Flujo recomendado de trabajo con IA

Flujo sugerido:

```txt
ChatGPT
-> estrategia, alcance y requerimientos

Codex
-> implementacion controlada sobre archivos locales

Claude Code
-> auditoria profunda y revision tecnica

ChatGPT
-> validacion final, UX, documentacion y comunicacion
```

No todas las tareas requieren todas las IA.

Ejemplos:

- Una correccion pequena puede ir directo a Codex.
- Una decision de producto puede trabajarse solo con ChatGPT.
- Un refactor grande conviene auditarlo primero con Claude Code.
- Una release importante puede requerir Codex para validar y ChatGPT para documentar.
- Una auditoria tecnica amplia puede hacerse con Claude Code antes de definir implementacion.

# 5. Manejo de contexto y documentacion institucional

Las IA funcionan mejor cuando mantienen contexto compartido y documentacion institucional consistente.

El equipo debe evitar que cada conversacion empiece desde cero. Para eso, conviene mantener documentos base actualizados y reutilizarlos como fuente de contexto.

Documentacion recomendada:

- `README.md`;
- documentos de contexto del proyecto;
- requerimientos;
- releases;
- roadmap;
- matriz de validacion;
- ejemplos reales;
- decisiones importantes;
- guias operativas.

Ejemplo de fuentes compartidas:

```txt
README.md
AI_CONTEXT.md
docs/releases/
docs/roadmap.md
docs/requerimientos/
docs/test-matrix.md
docs/decisions/
examples/
```

Buenas practicas:

- mantener README actualizado;
- mantener documentos de contexto;
- mantener releases;
- mantener roadmap;
- mantener ejemplos reales;
- evitar reexplicar arquitectura en cada conversacion;
- reutilizar documentacion existente;
- subir documentacion base a las fuentes de cada proyecto cuando aplique;
- registrar decisiones importantes;
- separar documentacion tecnica y operativa.

Las tres IA deben trabajar alineadas mediante documentacion compartida.

Sin contexto compartido:

- aumenta el consumo de tokens;
- aumenta el riesgo de respuestas inconsistentes;
- se repiten explicaciones;
- se incrementa el retrabajo;
- se pierden decisiones previas.

# 6. Optimizacion de consumo de tokens

Los requerimientos claros reducen:

- consumo de tokens;
- retrabajo;
- cambios incorrectos;
- loops innecesarios;
- explicaciones repetidas;
- perdida de foco;
- riesgo de cambios fuera de alcance.

Prompt ambiguo = mayor consumo de tokens y mayor riesgo de cambios fuera de alcance.

Buenas practicas:

- escribir prompts especificos;
- definir alcance acotado;
- indicar que archivos se pueden tocar;
- indicar que archivos no se deben tocar;
- reutilizar documentacion existente;
- mantener README y contexto institucional;
- evitar repetir contexto innecesariamente;
- dividir proyectos grandes en etapas;
- pedir primero auditoria cuando el problema no este claro;
- pedir salida esperada: archivos, validaciones, riesgos, decisiones;
- separar auditoria, implementacion y validacion.

Prompt malo:

```txt
Mejoralo.
```

Prompt bueno:

```txt
Auditar la pantalla principal sin modificar archivos.
Evaluar claridad para usuarios no tecnicos, redundancias, riesgos y mejoras priorizadas.
Devolver quick wins, cambios de mediano impacto y recomendaciones a postergar.
```

# 7. Rol del equipo humano

La IA no reemplaza el criterio del equipo.

El equipo humano es responsable de:

- definir prioridades;
- validar negocio;
- aprobar alcance;
- revisar UX;
- aprobar releases;
- validar resultados;
- tomar decisiones finales;
- decidir riesgos aceptables;
- priorizar roadmap;
- confirmar que la solucion responde a una necesidad real.

La IA debe actuar como acelerador y soporte, no como reemplazo de validacion humana.

Responsabilidades que no deben delegarse completamente:

- aprobacion final de alcance;
- decisiones de negocio;
- criterios sensibles de usuario;
- validacion de impacto real;
- aprobacion de publicacion;
- definicion de prioridades.

# 8. Estructura recomendada de proyectos

Estructura generica sugerida:

```txt
/src
/dist o /build
/docs
/tests
/examples
/assets
README.md
CHANGELOG.md
```

La estructura puede adaptarse segun el proyecto.

Criterios generales:

- `src`: codigo fuente.
- `dist` o `build`: artefactos generados o publicables.
- `docs`: documentacion funcional, tecnica y operativa.
- `tests`: pruebas automatizadas.
- `examples`: casos de ejemplo o fixtures.
- `assets`: recursos visuales o estaticos.
- `README.md`: entrada principal del proyecto.
- `CHANGELOG.md`: historial de cambios relevantes.

# 9. Estado del proyecto y nivel de madurez

No todos los proyectos requieren el mismo nivel de documentacion, validacion o arquitectura.

El nivel de proceso debe adaptarse al estado real del proyecto. Un prototipo no necesita la misma estructura que un sistema operativo usado por usuarios reales. Del mismo modo, un proyecto heredado requiere auditoria antes de recibir cambios grandes.

| Estado | Descripcion | Enfoque recomendado |
|---|---|---|
| Concepto | Idea inicial sin desarrollo | Definir problema, usuarios y alcance |
| Prototipo | Primera prueba funcional | Validar utilidad antes de escalar |
| MVP | Version minima usable | Priorizar estabilidad y feedback real |
| Operativo | Uso real por usuarios | Validar, documentar y controlar releases |
| Escalando | Crecimiento en alcance o usuarios | Reforzar arquitectura, tests y soporte |
| Legacy | Proyecto existente o heredado | Auditar antes de modificar |

# 10. Principio de simplicidad

No se debe agregar complejidad antes de necesitarla.

Buenas practicas:

- evitar sobreingenieria;
- preferir soluciones simples, validadas y mantenibles;
- usar herramientas livianas cuando resuelvan el problema;
- escalar arquitectura solo cuando haya evidencia real;
- no introducir dependencias, procesos o capas sin necesidad clara;
- mantener el sistema comprensible para quienes lo usan y mantienen.

La mejor solucion no siempre es la mas completa, sino la mas clara, mantenible y suficiente para el problema actual.

# 11. Flujo recomendado de trabajo

## 1. Contexto inicial

- Definir objetivo del proyecto.
- Identificar usuarios.
- Identificar problema principal.
- Definir alcance inicial.
- Registrar restricciones.
- Revisar documentacion existente.

## 2. Auditoria

- Revisar estado actual.
- Identificar riesgos.
- Detectar deuda tecnica o funcional.
- Separar problemas reales de mejoras deseables.
- Priorizar hallazgos.

## 3. Plan tecnico

- Definir enfoque.
- Separar etapas.
- Identificar archivos o modulos afectados.
- Definir validaciones.
- Confirmar que no se mezclen cambios incompatibles.

## 4. Implementacion

- Hacer cambios pequenos.
- Mantener consistencia con el proyecto.
- Evitar refactors no solicitados.
- Documentar decisiones si afectan arquitectura o comportamiento.

## 5. Validacion

- Ejecutar pruebas.
- Hacer smoke test.
- Revisar consola/logs cuando aplique.
- Validar archivos generados.
- Comparar con casos reales o ejemplos.

## 6. Documentacion

- Actualizar README si cambia uso general.
- Crear o actualizar release notes.
- Documentar decisiones relevantes.
- Documentar limitaciones conocidas.

## 7. Release

- Confirmar build.
- Confirmar tests.
- Confirmar version.
- Confirmar artefactos publicados.
- Registrar cambios y riesgos.

## 8. Post deploy

- Verificar entorno real.
- Confirmar que no haya errores criticos.
- Registrar incidentes o ajustes.
- Actualizar documentacion si se detectan diferencias.

## 9. Mejora continua

- Recolectar casos nuevos.
- Convertir errores en ejemplos o tests.
- Priorizar mejoras.
- Evitar crecer complejidad sin necesidad.

# 12. Tipos de cambios

Siempre que sea posible, los cambios deben tratarse por separado.

Tipos habituales:

- Funcional: cambia comportamiento o agrega capacidades.
- Visual/UI: cambia apariencia, jerarquia o experiencia.
- Estructural: mueve carpetas, archivos o responsabilidades.
- Documentacion: crea o ajusta guias, releases o contexto.
- Refactor: cambia organizacion interna sin cambiar comportamiento esperado.
- Performance: mejora tiempos, consumo o eficiencia.
- Release: prepara version, build, changelog y publicacion.

Separarlos ayuda a:

- revisar mejor;
- validar mejor;
- revertir mejor;
- explicar mejor;
- reducir riesgos.

# 13. Riesgo segun tipo de cambio

| Tipo de cambio | Riesgo |
|---|---|
| Documentacion | Bajo |
| Texto/UI simple | Bajo |
| UI compleja | Medio |
| Cambio funcional | Medio |
| Refactor estructural | Alto |
| Build/release | Alto |
| Dependencias nuevas | Alto |

Los cambios de mayor riesgo requieren:

- auditoria previa;
- validaciones adicionales;
- releases mas controlados;
- plan de rollback;
- revision humana mas cuidadosa;
- documentacion de riesgos.

# 14. Anti patrones comunes

Anti patrones que deben evitarse:

- prompts ambiguos;
- implementar sin auditoria cuando el alcance no esta claro;
- mezclar cambios funcionales, visuales y estructurales;
- publicar sin smoke test;
- refactors grandes sin validacion;
- modificar multiples modulos sin alcance claro;
- no documentar releases;
- no mantener contexto institucional actualizado;
- regenerar builds sin validar;
- agregar dependencias sin justificar;
- cambiar comportamiento cuando solo se pidio documentacion;
- hacer cambios visuales sin revisar responsive o accesibilidad;
- publicar sin saber que se modifico.

Estos escenarios suelen aumentar:

- consumo de tokens;
- retrabajo;
- errores;
- deuda tecnica;
- riesgo de regresiones;
- dificultad para revisar o revertir.

# 15. Validaciones recomendadas

Validaciones posibles segun el tipo de proyecto:

- validacion local;
- smoke test;
- tests automatizados;
- revision manual;
- validacion responsive;
- revision de consola/logs;
- validacion de archivos generados;
- comparacion con ejemplos reales;
- validacion de accesibilidad;
- validacion de performance;
- revision de permisos o seguridad;
- revision de compatibilidad entre navegadores o entornos.

Ejemplo de checklist de validacion:

```txt
- Build OK.
- Tests OK.
- Smoke test OK.
- Consola sin errores.
- Documentacion actualizada.
- Casos reales revisados.
- Riesgos documentados.
```

# 16. Flujo recomendado de release

Flujo sugerido:

1. Auditoria.
2. Definicion de alcance.
3. Implementacion controlada.
4. Validaciones.
5. Release notes.
6. Build.
7. Smoke test.
8. Deploy.
9. Auditoria post deploy.
10. Documentacion final.

Criterios:

- no publicar sin validacion minima;
- no publicar sin saber que cambio se esta entregando;
- no publicar si no hay forma de identificar o revertir el cambio;
- documentar riesgos conocidos;
- confirmar que el flujo principal funciona.

# 17. Documentacion tecnica vs operativa

La documentacion tecnica y la documentacion operativa no deben redactarse igual.

## Documentacion tecnica

Orientada a equipos de desarrollo, arquitectura o soporte tecnico.

Puede incluir:

- arquitectura;
- builds;
- APIs;
- estructura;
- desarrollo;
- decisiones tecnicas;
- validaciones;
- dependencias;
- flujo de release.

## Documentacion operativa

Orientada a usuarios, agentes, negocio, soporte o equipos no tecnicos.

Debe incluir:

- para que sirve;
- cuando usarlo;
- como usarlo paso a paso;
- que resultado esperar;
- que hacer ante errores;
- limites claros;
- lenguaje simple;
- ejemplos reales.

Regla general:

```txt
La documentacion tecnica explica como esta construido.
La documentacion operativa explica como se usa y para que sirve.
```

# 18. Documentacion viva

La documentacion debe evolucionar con el proyecto.

Un documento util no es el que se escribe una vez, sino el que se mantiene alineado con el estado real del producto.

Buenas practicas:

- actualizar README cuando cambie el uso general;
- actualizar roadmap cuando cambien prioridades;
- actualizar releases cuando se publique una version;
- actualizar contexto institucional cuando cambie arquitectura, alcance o convenciones;
- revisar si cada cambio relevante requiere actualizacion documental;
- eliminar o corregir documentacion obsoleta.

La documentacion debe revisarse especialmente despues de:

- releases;
- refactors;
- cambios de arquitectura;
- cambios operativos relevantes.

Una documentacion desactualizada genera:

- errores;
- retrabajo;
- perdida de contexto;
- decisiones inconsistentes;
- mayor consumo de tokens;
- onboarding mas lento.

# 19. Documentacion minima recomendada

Documentos utiles para proyectos mantenibles:

```txt
README.md
docs/requerimiento.md
docs/release.md
docs/roadmap.md
docs/test-matrix.md
docs/decisions/
```

Uso recomendado:

- `README.md`: que es el proyecto, como se usa, como se valida.
- `docs/requerimiento.md`: necesidad original y alcance.
- `docs/release.md`: cambios por version.
- `docs/roadmap.md`: proximos pasos.
- `docs/test-matrix.md`: casos de prueba y criterios esperados.
- `docs/decisions/`: decisiones importantes de arquitectura o producto.

# 20. Uso de bases de datos ligeras

Cuando un proyecto requiere persistencia simple o una base de datos liviana, se recomienda evaluar herramientas de bajo costo operativo antes de disenar una arquitectura backend compleja.

Opciones recomendadas para casos simples:

- Google Sheets.
- Google Apps Script.

Estas herramientas pueden ser utiles cuando el proyecto necesita:

- formularios;
- reportes;
- configuraciones;
- logs;
- dashboards;
- datos operativos;
- automatizaciones simples;
- seguimiento de casos;
- administracion manual por equipos no tecnicos.

Ventajas:

- implementacion rapida;
- bajo costo;
- facilidad de mantenimiento;
- integracion sencilla;
- baja barrera de adopcion;
- edicion comprensible para usuarios de negocio;
- buena opcion para prototipos o primeras versiones operativas.

Ejemplos de uso adecuado:

| Necesidad | Opcion liviana |
|---|---|
| Registrar respuestas de un formulario | Google Sheets |
| Generar un panel operativo simple | Google Sheets |
| Automatizar envio o transformacion simple | Google Apps Script |
| Mantener configuraciones editables por negocio | Google Sheets |
| Registrar eventos o logs operativos simples | Google Sheets |

Limite importante:

Google Sheets y Google Apps Script no reemplazan arquitecturas backend complejas cuando el proyecto escala.

Conviene evaluar una solucion backend mas robusta cuando aparecen necesidades como:

- alto volumen de datos;
- concurrencia elevada;
- permisos avanzados;
- auditoria estricta;
- integraciones criticas;
- baja latencia;
- reglas de negocio complejas;
- trazabilidad transaccional;
- disponibilidad garantizada.

# 21. Criterios para cerrar tareas

Una tarea puede considerarse cerrada cuando:

- el alcance fue cumplido;
- los archivos esperados fueron creados o modificados;
- las validaciones definidas pasaron;
- la documentacion relevante fue actualizada;
- no hay errores criticos conocidos;
- los riesgos estan documentados;
- el resultado esta listo para revision o deploy.

# 22. Criterios para hacer deploy

Antes de publicar:

- build OK;
- tests OK;
- smoke test OK;
- documentacion actualizada;
- release documentado;
- rollback identificable;
- version o artefacto identificable;
- responsable o canal de soporte definido;
- riesgos conocidos comunicados.

No conviene publicar si:

- hay errores criticos sin resolver;
- no se pudo validar el flujo principal;
- no se sabe como revertir;
- no hay claridad sobre que cambio se esta publicando.

# 23. Manejo de errores y casos nuevos

Cuando aparece un error o caso nuevo:

1. Guardar evidencia.
2. Registrar pasos para reproducir.
3. Clasificar severidad.
4. Identificar impacto.
5. Agregar el caso a tests, examples o matriz de validacion.
6. Corregir con alcance controlado.
7. Validar regresiones.
8. Documentar la solucion si cambia comportamiento.

Clasificacion sugerida:

- Critico: bloquea uso principal o genera informacion incorrecta grave.
- Alto: afecta flujo importante, pero tiene workaround.
- Medio: afecta casos secundarios.
- Bajo: mejora menor, texto, estilo o ajuste no bloqueante.

# 24. Cuando no usar IA o cuando limitar su uso

La IA debe usarse con criterio y supervision humana.

Hay contextos donde puede ayudar a ordenar informacion o preparar borradores, pero no debe tomar la decision final.

Se debe limitar su uso o exigir revision humana estricta en:

- decisiones legales o contractuales;
- cambios productivos irreversibles;
- manejo de credenciales o secretos;
- datos sensibles sin controles adecuados;
- seguridad critica;
- decisiones financieras relevantes;
- acciones que requieran aprobacion formal;
- publicaciones sin validacion humana;
- decisiones que afecten cumplimiento normativo;
- operaciones que puedan impactar clientes, dinero, privacidad o disponibilidad.

En estos casos, la IA puede ayudar a:

- resumir informacion;
- preparar alternativas;
- redactar borradores;
- listar riesgos;
- organizar evidencia;
- generar checklists.

Pero la decision, aprobacion y ejecucion final deben quedar bajo responsabilidad humana.

# 25. Buenas practicas de prompts

## A. Auditoria

```txt
Auditar [modulo/proceso]. No modificar archivos.
Entregar:
- diagnostico;
- riesgos;
- problemas priorizados;
- mejoras recomendadas;
- quick wins;
- proximo paso sugerido.
```

## B. Implementacion

```txt
Implementar [cambio].
Modificar solo:
- [archivo/carpeta]

No modificar:
- [restricciones]

Validar:
- [comandos o criterios]

Devolver:
- archivos modificados;
- resumen;
- validaciones;
- riesgos.
```

## C. Validacion

```txt
Validar [funcionalidad/version].
No modificar archivos.
Revisar:
- carga;
- flujo principal;
- errores de consola;
- casos reales;
- responsive;
- artefactos generados.

Devolver resultado por seccion, errores, warnings y recomendacion final.
```

## D. Release

```txt
Preparar documentacion de release para [version].
Incluir:
- version;
- cambios;
- funcionalidades;
- validaciones;
- limitaciones;
- riesgos;
- proximos pasos.

No modificar logica.
```

## E. Documentacion

```txt
Crear documentacion para [audiencia].
Objetivo:
- [objetivo]

Estilo:
- claro;
- profesional;
- reutilizable;
- sin tecnicismos innecesarios.

No modificar codigo.
```

# 26. Checklist base del proyecto

Checklist reutilizable:

```txt
[ ] Objetivo definido.
[ ] Alcance definido.
[ ] Usuarios identificados.
[ ] Restricciones documentadas.
[ ] Estructura inicial creada.
[ ] README actualizado.
[ ] Contexto institucional actualizado.
[ ] Requerimiento documentado.
[ ] Roadmap inicial definido.
[ ] Auditoria realizada si aplica.
[ ] Implementacion separada por tipo de cambio.
[ ] Validaciones ejecutadas.
[ ] Casos reales o ejemplos agregados si aplica.
[ ] Release documentado.
[ ] Riesgos documentados.
[ ] Post deploy revisado.
[ ] Proximos pasos definidos.
```

# 27. Convenciones recomendadas

- Usar commits descriptivos.
- Usar nombres claros para archivos, carpetas y funciones.
- Separar documentacion tecnica y operativa.
- Evitar tecnicismos innecesarios en documentacion para usuarios.
- Mantener consistencia visual y documental.
- Registrar decisiones importantes.
- No mezclar refactors con cambios funcionales cuando se pueda evitar.
- Mantener ejemplos reales o fixtures cuando aporten validacion.
- Escribir releases entendibles para quienes usan y mantienen el proyecto.
- Priorizar legibilidad sobre complejidad.
- Mantener el contexto institucional actualizado.

# 28. Regla operativa para comandos Git

El usuario trabaja normalmente desde VS Code y PowerShell en Windows. Por eso, los bloques de comandos deben entregarse preferentemente compatibles con PowerShell.

Buenas practicas operativas:

- Evitar comandos multilinea con `\` cuando sean para copiar directamente.
- Para `git add` con varios archivos, usar una sola linea.
- Mantener siempre validacion antes y despues:
  - `git status --short`
  - `git diff --name-only`
- Los commits los ejecuta manualmente el usuario.

Ejemplo recomendado:

```powershell
git status --short
git diff --name-only
git add README.md CHANGELOG.md docs/roadmap.md
git status --short
```

# 29. Nota final

Esta metodologia debe adaptarse a cada proyecto, equipo y contexto.

Sin embargo, siempre conviene mantener:

- trabajo incremental;
- validacion;
- documentacion;
- trazabilidad;
- claridad de alcance;
- contexto compartido;
- optimizacion de tokens;
- separacion entre auditoria, implementacion y release;
- uso responsable de IA;
- criterio humano en decisiones finales.

La calidad del resultado depende tanto de la IA como de la claridad metodologica del equipo.

Un proyecto asistido por IA funciona mejor cuando:

- el alcance esta claro;
- la documentacion se mantiene actualizada;
- las decisiones quedan trazadas;
- las validaciones son parte del flujo;
- el contexto institucional se reutiliza;
- el equipo humano conserva la decision final.

La IA no reemplaza al equipo: ayuda a ordenar, acelerar, validar y documentar mejor el trabajo.
