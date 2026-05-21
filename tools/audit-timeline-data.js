#!/usr/bin/env node
/*
 * Read-only audit for the published timeline CSV.
 *
 * Safety rules:
 * - Uses only HTTPS GET.
 * - Does not POST.
 * - Does not use credentials.
 * - Writes only docs/timeline-data-audit-report.md.
 */

const fs = require("fs");
const https = require("https");
const path = require("path");

const TIMELINE_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwd-qIMhoH1poJpaTZqN-7O5IGAfPDTxslBAX8LCPogTkwheW2vWsq59JkvvYakM8ndCKgUQualQyi/pub?gid=1623881837&single=true&output=csv";

const REPORT_PATH = path.join(
  __dirname,
  "..",
  "docs",
  "timeline-data-audit-report.md",
);

const SUGGESTED_PHASES = ["Comercial", "Tecnica", "Operativa", "Cierre"];
const SUGGESTED_STATES = [
  "Pendiente",
  "En curso",
  "Bloqueado",
  "Completado",
  "Cancelado",
];
const SUGGESTED_ENVIRONMENTS = ["QA", "Productivo"];

const FIELD_ALIASES = {
  taskId: ["ID Tarea", "task_id", "id_tarea"],
  sellerId: ["seller_id"],
  sellerNombre: ["Seller / Marca", "seller_nombre", "seller_marca"],
  fase: ["Fase", "fase"],
  hito: ["Hito", "hito"],
  tarea: ["Tarea", "tarea"],
  responsable: ["Responsable", "responsable"],
  dependeDe: ["Depende de", "depende_de", "dependencia"],
  entorno: ["Entorno", "entorno"],
  inicio: ["Inicio", "inicio", "Inicio plan", "inicio_plan", "fecha_inicio_plan"],
  fin: ["Fin", "fin", "Fin plan", "fin_plan", "fecha_fin_plan"],
  estado: ["Estado", "estado"],
  comentario: ["Comentario", "comentario"],
  verEnGantt: [
    "Ver en Gantt",
    "ver_en_gantt",
    "visible_gantt",
    "visible",
    "Visible Gantt",
  ],
  inicioReal: ["Inicio real", "inicio_real", "fecha_inicio_real"],
  finReal: ["Fin real", "fin_real", "fecha_fin_real"],
  atrasoDias: ["Atraso (dias)", "Atraso (días)", "atraso_dias"],
};

const NEW_MODEL_START_HEADERS = new Set(["inicio"]);
const NEW_MODEL_END_HEADERS = new Set(["fin"]);
const LEGACY_START_HEADERS = new Set(["inicio_plan", "fecha_inicio_plan"]);
const LEGACY_END_HEADERS = new Set(["fin_plan", "fecha_fin_plan"]);

function fetchText(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          [301, 302, 303, 307, 308].includes(res.statusCode) &&
          res.headers.location
        ) {
          if (redirectsLeft <= 0) {
            reject(new Error("CSV download failed: too many redirects"));
            res.resume();
            return;
          }
          const redirectedUrl = new URL(res.headers.location, url).toString();
          res.resume();
          fetchText(redirectedUrl, redirectsLeft - 1).then(resolve, reject);
          return;
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`CSV download failed with HTTP ${res.statusCode}`));
          res.resume();
          return;
        }

        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      })
      .on("error", (err) => {
        reject(new Error(`CSV download failed: ${err.message}`));
      });
  });
}

function parseCsv(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map(parseCsvLine);
}

function parseCsvLine(line) {
  const row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];

    if (quoted) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else {
      cell += ch;
    }
  }

  row.push(cell);
  return row;
}

function clean(value) {
  return String(value === undefined || value === null ? "" : value).trim();
}

function normalize(value) {
  return clean(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function normalizeHeader(value) {
  return normalize(value)
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeCatalogValue(value) {
  return normalize(value).replace(/\u00ad/g, "");
}

function buildHeaderMap(raw) {
  const byNormalized = {};
  Object.keys(raw).forEach((header) => {
    const normalized = normalizeHeader(header);
    if (!byNormalized[normalized]) byNormalized[normalized] = header;
  });
  return byNormalized;
}

function valueWithSource(raw, names) {
  const byNormalized = raw.__byNormalized || buildHeaderMap(raw);

  for (const name of names) {
    if (raw[name] !== undefined) {
      return { value: clean(raw[name]), source: name };
    }
  }

  for (const name of names) {
    const normalized = normalizeHeader(name);
    const source = byNormalized[normalized];
    if (source !== undefined) {
      return { value: clean(raw[source]), source };
    }
  }

  return { value: "", source: "" };
}

function hasAnyColumn(headers, aliases) {
  const normalizedHeaders = new Set(headers.map(normalizeHeader));
  return aliases.some((alias) => normalizedHeaders.has(normalizeHeader(alias)));
}

function matchedColumns(headers, aliases) {
  const aliasSet = new Set(aliases.map(normalizeHeader));
  return headers.filter((header) => aliasSet.has(normalizeHeader(header)));
}

function isValidIsoDate(value) {
  const match = clean(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isValidDmyDate(value) {
  const match = clean(value).match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return false;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function classifyDate(value) {
  const raw = clean(value);
  if (!raw) return "empty";
  if (isValidIsoDate(raw)) return "iso";
  if (isValidDmyDate(raw)) return "dmy";
  return "invalid";
}

function severityRank(severity) {
  const ranks = { critica: 0, media: 1, baja: 2, decision: 3 };
  return Object.prototype.hasOwnProperty.call(ranks, severity) ? ranks[severity] : 9;
}

function addIssue(issues, severity, type, rowNumber, taskId, field, value, action) {
  issues.push({
    severity,
    type,
    rowNumber,
    taskId: taskId || "",
    field,
    value: clean(value),
    action,
  });
}

function md(value) {
  return clean(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function issueLine(issue) {
  return `| ${md(issue.severity)} | ${md(issue.type)} | ${md(
    issue.rowNumber,
  )} | ${md(issue.taskId)} | ${md(issue.field)} | ${md(issue.value)} | ${md(
    issue.action,
  )} |`;
}

function listIssues(title, issues) {
  if (!issues.length) return `### ${title}\n\nSin hallazgos.\n`;

  return [
    `### ${title}`,
    "",
    "| Severidad | Problema | Fila CSV | task_id | Campo | Valor | Accion sugerida |",
    "|---|---:|---:|---|---|---|---|",
    ...issues.map(issueLine),
    "",
  ].join("\n");
}

function countRecords(records, predicate) {
  return records.filter(predicate).length;
}

function buildReport({
  rows,
  headerIndex,
  headers,
  records,
  issues,
  generatedAt,
  headerFacts,
}) {
  const sptRecords = records.filter((record) => /^SPT-/.test(record.taskId));
  const nonSptRecords = records.filter((record) => !/^SPT-/.test(record.taskId));
  const renderableRecords = sptRecords.filter(
    (record) => record.inicio && record.fin && normalize(record.verEnGantt) !== "no",
  );
  const visibleNoRecords = sptRecords.filter(
    (record) => normalize(record.verEnGantt) === "no",
  );
  const newModelRecords = sptRecords.filter(
    (record) => record.usesNewInicio && record.usesNewFin,
  );
  const legacyDateRecords = sptRecords.filter(
    (record) => record.usesLegacyInicio || record.usesLegacyFin,
  );
  const mixedDateRecords = sptRecords.filter(
    (record) =>
      (record.usesNewInicio || record.usesNewFin) &&
      (record.usesLegacyInicio || record.usesLegacyFin),
  );
  const missingEntornoRecords = sptRecords.filter((record) => !record.entorno);
  const missingInicioFinRecords = sptRecords.filter(
    (record) => !record.inicio || !record.fin,
  );
  const legacyRealValueRecords = sptRecords.filter(
    (record) => record.inicioReal || record.finReal,
  );

  const bySeverity = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});

  const sortedIssues = issues
    .slice()
    .sort(
      (a, b) =>
        severityRank(a.severity) - severityRank(b.severity) ||
        Number(a.rowNumber || 0) - Number(b.rowNumber || 0) ||
        a.type.localeCompare(b.type),
    );

  const issuesByTask = sortedIssues.filter((issue) => issue.taskId);
  const nonTaskIssues = sortedIssues.filter((issue) => !issue.taskId);

  const detailByTask = [];
  const taskIds = Array.from(new Set(issuesByTask.map((issue) => issue.taskId)));
  taskIds.forEach((taskId) => {
    const taskIssues = issuesByTask.filter((issue) => issue.taskId === taskId);
    detailByTask.push(`### ${taskId}`);
    detailByTask.push("");
    detailByTask.push(
      "| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |",
    );
    detailByTask.push("|---|---:|---:|---|---|---|");
    taskIssues.forEach((issue) => {
      detailByTask.push(
        `| ${md(issue.severity)} | ${md(issue.type)} | ${md(
          issue.rowNumber,
        )} | ${md(issue.field)} | ${md(issue.value)} | ${md(issue.action)} |`,
      );
    });
    detailByTask.push("");
  });

  if (nonTaskIssues.length) {
    detailByTask.push("### Filas sin task_id productivo");
    detailByTask.push("");
    detailByTask.push(
      "| Severidad | Problema | Fila CSV | Campo | Valor | Accion sugerida |",
    );
    detailByTask.push("|---|---:|---:|---|---|---|");
    nonTaskIssues.forEach((issue) => {
      detailByTask.push(
        `| ${md(issue.severity)} | ${md(issue.type)} | ${md(
          issue.rowNumber,
        )} | ${md(issue.field)} | ${md(issue.value)} | ${md(issue.action)} |`,
      );
    });
    detailByTask.push("");
  }

  return [
    "# Reporte automatico de inconsistencias - timeline",
    "",
    `Generado: ${generatedAt}`,
    "",
    `Fuente CSV: ${TIMELINE_CSV_URL}`,
    "",
    "## Resumen ejecutivo v33",
    "",
    "Auditoria read-only del CSV publicado de `timeline`, actualizada para el modelo v33 y aliases legacy. El reporte no modifica Google Sheets, no ejecuta POST y no usa credenciales.",
    "",
    `- Inconsistencias criticas: ${bySeverity.critica || 0}.`,
    `- Inconsistencias medias: ${bySeverity.media || 0}.`,
    `- Hallazgos bajos: ${bySeverity.baja || 0}.`,
    `- Decisiones pendientes detectadas: ${bySeverity.decision || 0}.`,
    `- Tareas sin \`entorno\`: ${missingEntornoRecords.length}.`,
    `- Tareas sin \`inicio\` o \`fin\`: ${missingInicioFinRecords.length}.`,
    `- Tareas con fechas legacy \`inicio_plan\` / \`fin_plan\`: ${legacyDateRecords.length}.`,
    `- Tareas con valores legacy \`inicio_real\` / \`fin_real\`: ${legacyRealValueRecords.length}.`,
    "- Proximo paso recomendado: resolver compatibilidad de frontend y Apps Script antes de editar datos reales.",
    "",
    "## Conteos principales",
    "",
    "| Metrica | Valor |",
    "|---|---:|",
    `| Columnas publicadas | ${rows[headerIndex].length} |`,
    `| Fila de headers | ${headerIndex + 1} |`,
    `| Filas CSV de datos | ${records.length} |`,
    `| Tareas con ID SPT-* | ${sptRecords.length} |`,
    `| Tareas renderizables por modelo v33 | ${renderableRecords.length} |`,
    `| Tareas modelo nuevo Inicio/Fin | ${newModelRecords.length} |`,
    `| Tareas modelo legacy Inicio plan/Fin plan | ${legacyDateRecords.length} |`,
    `| Tareas con mezcla nuevo/legacy | ${mixedDateRecords.length} |`,
    `| Filas no productivas / no SPT-* | ${nonSptRecords.length} |`,
    `| Tareas con ver_en_gantt = No | ${visibleNoRecords.length} |`,
    "",
    "## Columnas detectadas",
    "",
    "| Tipo | Columnas |",
    "|---|---|",
    `| Canonicas v33 presentes | ${headerFacts.newColumns.length ? headerFacts.newColumns.join(", ") : "Ninguna"} |`,
    `| Legacy de fechas plan presentes | ${headerFacts.legacyPlanColumns.length ? headerFacts.legacyPlanColumns.join(", ") : "Ninguna"} |`,
    `| Legacy reales presentes | ${headerFacts.legacyRealColumns.length ? headerFacts.legacyRealColumns.join(", ") : "Ninguna"} |`,
    `| Derivables presentes | ${headerFacts.derivedColumns.length ? headerFacts.derivedColumns.join(", ") : "Ninguna"} |`,
    "",
    "## Catalogos sugeridos",
    "",
    `- Fase: ${SUGGESTED_PHASES.join(", ")}.`,
    `- Estado: ${SUGGESTED_STATES.join(", ")}.`,
    `- Entorno: ${SUGGESTED_ENVIRONMENTS.join(", ")}.`,
    "",
    "## Tabla de inconsistencias por severidad",
    "",
    "| Severidad | Cantidad |",
    "|---|---:|",
    `| Critica | ${bySeverity.critica || 0} |`,
    `| Media | ${bySeverity.media || 0} |`,
    `| Baja | ${bySeverity.baja || 0} |`,
    `| Decision | ${bySeverity.decision || 0} |`,
    "",
    listIssues(
      "Inconsistencias criticas",
      sortedIssues.filter((issue) => issue.severity === "critica"),
    ),
    listIssues(
      "Inconsistencias medias",
      sortedIssues.filter((issue) => issue.severity === "media"),
    ),
    listIssues(
      "Hallazgos bajos",
      sortedIssues.filter((issue) => issue.severity === "baja"),
    ),
    listIssues(
      "Decisiones pendientes",
      sortedIssues.filter((issue) => issue.severity === "decision"),
    ),
    "## Detalle por tarea",
    "",
    detailByTask.length ? detailByTask.join("\n") : "Sin inconsistencias por tarea.\n",
    "## Checklist de saneamiento manual v33",
    "",
    "- [ ] Confirmar que frontend y Apps Script ya leen/escriben modelo v33 + legacy antes de tocar Google Sheets.",
    "- [ ] Completar `entorno` en tareas `SPT-*` con `QA` o `Productivo`.",
    "- [ ] Completar `inicio` y `fin` o resolver aliases legacy para tareas que deban renderizar.",
    "- [ ] Convertir dependencias legacy a `depende_de` sin romper referencias.",
    "- [ ] Revisar campos legacy `inicio_real` / `fin_real`; no migrarlos como contrato operativo.",
    "- [ ] Completar estados vacios en tareas `SPT-*`.",
    "- [ ] Completar fase, hito y responsable faltantes.",
    "- [ ] Clasificar filas no `SPT-*` como instrucciones, dummies o datos a archivar.",
    "- [ ] Confirmar si cada `ver_en_gantt = No` es intencional.",
    "- [ ] Reejecutar `node tools/audit-timeline-data.js` despues de cada tanda.",
    "",
    "## Recomendaciones de siguiente paso",
    "",
    "1. Usar este reporte como base para 33D/33E, no para editar Google Sheets todavia.",
    "2. Actualizar frontend de solo lectura para consumir `inicio`, `fin`, `entorno`, `depende_de` y `ver_en_gantt` con fallback legacy.",
    "3. Actualizar Apps Script para escribir modelo v33 y tolerar aliases legacy.",
    "4. Reejecutar este auditor despues de cada cambio tecnico y antes de cualquier saneamiento manual.",
    "",
  ].join("\n");
}

async function main() {
  const csv = await fetchText(TIMELINE_CSV_URL);
  const rows = parseCsv(csv);
  const headerIndex = rows.findIndex((row) => {
    const normalized = row.map(normalizeHeader);
    return normalized.includes("id_tarea") && normalized.includes("seller_id");
  });

  if (headerIndex === -1) {
    throw new Error("No se encontro fila de headers con ID Tarea y seller_id");
  }

  const headers = rows[headerIndex].map(clean);
  const dataRows = rows
    .slice(headerIndex + 1)
    .filter((row) => row.length > 1 || row.some((value) => clean(value)));

  const headerFacts = {
    newColumns: matchedColumns(headers, [
      "Inicio",
      "inicio",
      "Fin",
      "fin",
      "Entorno",
      "entorno",
      "depende_de",
      "ver_en_gantt",
    ]),
    legacyPlanColumns: matchedColumns(headers, [
      "Inicio plan",
      "inicio_plan",
      "fecha_inicio_plan",
      "Fin plan",
      "fin_plan",
      "fecha_fin_plan",
    ]),
    legacyRealColumns: matchedColumns(headers, [
      "Inicio real",
      "inicio_real",
      "fecha_inicio_real",
      "Fin real",
      "fin_real",
      "fecha_fin_real",
    ]),
    derivedColumns: matchedColumns(headers, FIELD_ALIASES.atrasoDias),
  };

  const records = dataRows.map((row, index) => {
    const raw = {};
    headers.forEach((header, colIndex) => {
      raw[header] = clean(row[colIndex]);
    });
    raw.__byNormalized = buildHeaderMap(raw);

    const taskId = valueWithSource(raw, FIELD_ALIASES.taskId);
    const sellerId = valueWithSource(raw, FIELD_ALIASES.sellerId);
    const sellerNombre = valueWithSource(raw, FIELD_ALIASES.sellerNombre);
    const fase = valueWithSource(raw, FIELD_ALIASES.fase);
    const hito = valueWithSource(raw, FIELD_ALIASES.hito);
    const tarea = valueWithSource(raw, FIELD_ALIASES.tarea);
    const responsable = valueWithSource(raw, FIELD_ALIASES.responsable);
    const dependeDe = valueWithSource(raw, FIELD_ALIASES.dependeDe);
    const entorno = valueWithSource(raw, FIELD_ALIASES.entorno);
    const inicio = valueWithSource(raw, FIELD_ALIASES.inicio);
    const fin = valueWithSource(raw, FIELD_ALIASES.fin);
    const estado = valueWithSource(raw, FIELD_ALIASES.estado);
    const comentario = valueWithSource(raw, FIELD_ALIASES.comentario);
    const verEnGantt = valueWithSource(raw, FIELD_ALIASES.verEnGantt);
    const inicioReal = valueWithSource(raw, FIELD_ALIASES.inicioReal);
    const finReal = valueWithSource(raw, FIELD_ALIASES.finReal);
    const atrasoDias = valueWithSource(raw, FIELD_ALIASES.atrasoDias);

    const inicioSourceKey = normalizeHeader(inicio.source);
    const finSourceKey = normalizeHeader(fin.source);

    return {
      rowNumber: headerIndex + 2 + index,
      headers,
      raw,
      taskId: taskId.value,
      sellerId: sellerId.value,
      sellerNombre: sellerNombre.value,
      fase: fase.value,
      hito: hito.value,
      tarea: tarea.value,
      responsable: responsable.value,
      dependeDe: dependeDe.value,
      entorno: entorno.value,
      inicio: inicio.value,
      inicioSource: inicio.source,
      fin: fin.value,
      finSource: fin.source,
      estado: estado.value,
      comentario: comentario.value,
      verEnGantt: verEnGantt.value,
      inicioReal: inicioReal.value,
      inicioRealSource: inicioReal.source,
      finReal: finReal.value,
      finRealSource: finReal.source,
      atrasoDias: atrasoDias.value,
      usesNewInicio: NEW_MODEL_START_HEADERS.has(inicioSourceKey),
      usesNewFin: NEW_MODEL_END_HEADERS.has(finSourceKey),
      usesLegacyInicio: LEGACY_START_HEADERS.has(inicioSourceKey),
      usesLegacyFin: LEGACY_END_HEADERS.has(finSourceKey),
    };
  });

  const taskIds = new Set(
    records.filter((record) => /^SPT-/.test(record.taskId)).map((record) => record.taskId),
  );
  const suggestedPhaseSet = new Set(SUGGESTED_PHASES.map(normalizeCatalogValue));
  const suggestedStateSet = new Set(SUGGESTED_STATES.map(normalizeCatalogValue));
  const suggestedEnvironmentSet = new Set(
    SUGGESTED_ENVIRONMENTS.map(normalizeCatalogValue),
  );
  const issues = [];

  if (headerFacts.derivedColumns.length) {
    addIssue(
      issues,
      "baja",
      "columna derivable presente",
      headerIndex + 1,
      "",
      "Atraso (dias)",
      headerFacts.derivedColumns.join(", "),
      "Tratar como dato derivado; no usar como autoridad.",
    );
  }

  if (headerFacts.legacyRealColumns.length) {
    addIssue(
      issues,
      "baja",
      "columnas legacy reales presentes",
      headerIndex + 1,
      "",
      "Inicio real / Fin real",
      headerFacts.legacyRealColumns.join(", "),
      "Mantener solo lectura durante transicion; no usar en contrato operativo v33.",
    );
  }

  records.forEach((record) => {
    const isSpt = /^SPT-/.test(record.taskId);

    if (!isSpt) {
      addIssue(
        issues,
        "media",
        "fila no productiva / no SPT-*",
        record.rowNumber,
        record.taskId,
        "ID Tarea",
        record.taskId,
        "Clasificar como instruccion, dummy o dato a archivar; no borrar todavia.",
      );
      return;
    }

    if (!record.entorno) {
      addIssue(
        issues,
        "critica",
        "tarea SPT-* sin entorno",
        record.rowNumber,
        record.taskId,
        "Entorno",
        record.entorno,
        "Completar con QA o Productivo.",
      );
    } else if (!suggestedEnvironmentSet.has(normalizeCatalogValue(record.entorno))) {
      addIssue(
        issues,
        "critica",
        "entorno fuera de catalogo",
        record.rowNumber,
        record.taskId,
        "Entorno",
        record.entorno,
        "Normalizar a QA o Productivo.",
      );
    }

    if (!record.inicio || !record.fin) {
      addIssue(
        issues,
        "critica",
        "tarea SPT-* sin inicio o fin",
        record.rowNumber,
        record.taskId,
        "Inicio / Fin",
        `${record.inicio || "(vacio)"} / ${record.fin || "(vacio)"}`,
        "Completar inicio/fin o revisar aliases legacy.",
      );
    }

    if (record.inicio && (record.usesLegacyInicio || !record.usesNewInicio)) {
      addIssue(
        issues,
        "media",
        "tarea usa inicio legacy",
        record.rowNumber,
        record.taskId,
        record.inicioSource || "inicio",
        record.inicio,
        "Migrar header/campo hacia inicio cuando el stack v33 este listo.",
      );
    }

    if (record.fin && (record.usesLegacyFin || !record.usesNewFin)) {
      addIssue(
        issues,
        "media",
        "tarea usa fin legacy",
        record.rowNumber,
        record.taskId,
        record.finSource || "fin",
        record.fin,
        "Migrar header/campo hacia fin cuando el stack v33 este listo.",
      );
    }

    [
      ["Inicio", record.inicio],
      ["Fin", record.fin],
    ].forEach(([field, value]) => {
      const dateStatus = classifyDate(value);
      if (dateStatus === "invalid") {
        addIssue(
          issues,
          "critica",
          "fecha inicio/fin invalida",
          record.rowNumber,
          record.taskId,
          field,
          value,
          "Corregir a formato canonico YYYY-MM-DD.",
        );
      } else if (dateStatus === "dmy") {
        addIssue(
          issues,
          "media",
          "fecha inicio/fin en formato no canonico",
          record.rowNumber,
          record.taskId,
          field,
          value,
          "Convertir a YYYY-MM-DD.",
        );
      }
    });

    [
      ["Inicio real", record.inicioReal, record.inicioRealSource],
      ["Fin real", record.finReal, record.finRealSource],
    ].forEach(([field, value, source]) => {
      if (!value) return;
      addIssue(
        issues,
        "baja",
        "fecha legacy real presente",
        record.rowNumber,
        record.taskId,
        source || field,
        value,
        "Mantener solo lectura; no enviar en payload v33.",
      );

      const dateStatus = classifyDate(value);
      if (dateStatus === "invalid") {
        addIssue(
          issues,
          "media",
          "fecha legacy real invalida",
          record.rowNumber,
          record.taskId,
          source || field,
          value,
          "Corregir solo si se conserva como dato historico.",
        );
      } else if (dateStatus === "dmy") {
        addIssue(
          issues,
          "media",
          "fecha legacy real en formato no canonico",
          record.rowNumber,
          record.taskId,
          source || field,
          value,
          "Convertir a YYYY-MM-DD si se conserva como historico.",
        );
      }
    });

    if (!record.estado) {
      addIssue(
        issues,
        "critica",
        "tarea SPT-* sin estado",
        record.rowNumber,
        record.taskId,
        "Estado",
        record.estado,
        "Completar con estado valido del catalogo sugerido.",
      );
    } else if (!suggestedStateSet.has(normalizeCatalogValue(record.estado))) {
      addIssue(
        issues,
        "media",
        "estado fuera de catalogo sugerido",
        record.rowNumber,
        record.taskId,
        "Estado",
        record.estado,
        "Normalizar a Pendiente, En curso, Bloqueado, Completado o Cancelado.",
      );
    }

    if (!record.fase) {
      addIssue(
        issues,
        "media",
        "tarea SPT-* sin fase",
        record.rowNumber,
        record.taskId,
        "Fase",
        record.fase,
        "Completar con fase valida.",
      );
    } else if (!suggestedPhaseSet.has(normalizeCatalogValue(record.fase))) {
      addIssue(
        issues,
        "media",
        "fase fuera de catalogo sugerido",
        record.rowNumber,
        record.taskId,
        "Fase",
        record.fase,
        "Normalizar a Comercial, Tecnica, Operativa o Cierre.",
      );
    }

    if (!record.hito) {
      addIssue(
        issues,
        "media",
        "tarea SPT-* sin hito",
        record.rowNumber,
        record.taskId,
        "Hito",
        record.hito,
        "Completar hito o valor transitorio aprobado.",
      );
    }

    if (!record.responsable) {
      addIssue(
        issues,
        "media",
        "tarea SPT-* sin responsable",
        record.rowNumber,
        record.taskId,
        "Responsable",
        record.responsable,
        "Completar responsable valido.",
      );
    }

    const dependencyIds = Array.from(record.dependeDe.matchAll(/SPT-\d+-T-\d+/g)).map(
      (match) => match[0],
    );
    dependencyIds.forEach((dependencyId) => {
      if (!taskIds.has(dependencyId)) {
        addIssue(
          issues,
          "critica",
          "depende_de apunta a task_id inexistente",
          record.rowNumber,
          record.taskId,
          "depende_de",
          dependencyId,
          "Corregir destino existente o vaciar dependencia con motivo documentado.",
        );
      }
    });

    if (normalize(record.verEnGantt) === "no") {
      addIssue(
        issues,
        "decision",
        "tarea con ver_en_gantt = No",
        record.rowNumber,
        record.taskId,
        "ver_en_gantt",
        record.verEnGantt,
        "Confirmar si la ocultacion es intencional.",
      );
    }
  });

  const report = buildReport({
    rows,
    headerIndex,
    headers,
    records,
    issues,
    generatedAt: new Date().toISOString(),
    headerFacts,
  });

  fs.writeFileSync(REPORT_PATH, report, "utf8");
  const counts = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});

  console.log(`Reporte generado: ${REPORT_PATH}`);
  console.log(`Filas CSV de datos: ${records.length}`);
  console.log(`Tareas SPT-*: ${countRecords(records, (record) => /^SPT-/.test(record.taskId))}`);
  console.log(`Criticas: ${counts.critica || 0}`);
  console.log(`Medias: ${counts.media || 0}`);
  console.log(`Bajas: ${counts.baja || 0}`);
  console.log(`Decisiones: ${counts.decision || 0}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
