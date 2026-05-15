# Decisiones Arquitectonicas

Esta carpeta se usara para registrar decisiones importantes del proyecto Marketplace Portal.

El objetivo es mantener trazabilidad: por que se eligio una solucion, que alternativas se evaluaron, que riesgos quedaron abiertos y como validar la decision en el futuro.

## Cuando crear una decision

Crear un documento de decision cuando se defina o cambie alguno de estos puntos:

- estructura de carpetas;
- rutas publicas o internas;
- estrategia de compatibilidad con GitHub Pages;
- migracion de paginas publicas;
- centralizacion de CSS o JavaScript;
- cambios en configuracion global;
- estrategia de legacy o redirects;
- integraciones con Apps Script o Google Sheets;
- criterios de release.

## Formato recomendado

Nombre de archivo sugerido:

```txt
YYYY-MM-DD-titulo-corto.md
```

Estructura recomendada:

```txt
# Titulo de la decision

Fecha:
Estado: propuesta | aceptada | reemplazada | descartada

## Contexto

## Decision

## Alternativas consideradas

## Consecuencias

## Riesgos

## Validacion requerida
```

## Principios

- Registrar decisiones antes de ejecutar cambios de alto impacto.
- Separar decisiones estructurales de cambios funcionales o visuales.
- Mantener lenguaje claro para perfiles tecnicos y operativos.
- Actualizar o reemplazar decisiones cuando el proyecto evolucione.

