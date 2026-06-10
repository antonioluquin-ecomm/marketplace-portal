/**
 * SPORTING MARKETPLACE - Apps Script config
 *
 * Constantes globales compartidas por los modulos del proyecto.
 * No ejecutar side effects en este archivo.
 */

const SPREADSHEET_ID = "1S_pl358H8nbJC3xgd7UpRpOxTYkC_hopYcBX6WzMlzU";
const EMAIL_NOTIFICACION = "gabriel.luna@luquin.com.ar";
const TIMEZONE = "America/Argentina/Buenos_Aires";

const HOJA_SELLERS = "sellers";
const HOJA_CALIFICACIONES = "calificaciones";
const HOJA_RELEVAMIENTO = "relevamientos";
const HOJA_DEFINICION_TECNICA = "definicion_tecnica";
const HOJA_TIMELINE = "timeline";
const HOJA_TARIFAS = "tarifas";
const HOJA_OVERRIDES = "overrides";

// Clave de escritura para operaciones sensibles (tarifas_update, override_update, logo_upload).
// Configurar en: Proyecto → Configuración del proyecto → Propiedades de secuencia de comandos
// Clave: WRITE_SECRET  |  Valor: <clave que usará el equipo>
// Si la propiedad no está configurada, la validación se omite (retro-compatibilidad).

// PAT de GitHub para subir logos via Apps Script (logo_upload).
// Fine-grained token con permisos contents:write sobre antonioluquin-ecomm/marketplace-portal.
// Clave: GITHUB_PAT  |  Valor: <token generado en github.com/settings/tokens>
