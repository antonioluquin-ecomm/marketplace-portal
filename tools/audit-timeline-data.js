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

const SUGGESTED_PHASES = ["Comercial", "Técnica", "Operativa", "Cierre"];
const SUGGESTED_STATES = [
  "Pendiente",
  "En curso",
  "Bloqueado",
  "Completado",
  "Cancelado",
];

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

function valueOf(record, names) {
  for (const name of names) {
    const direct = record[name];
    if (direct !== undefined) return clean(direct);
  }
  return "";
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

function buildReport({ rows, headerIndex, records, issues, generatedAt }) {
  const sptRecords = records.filter((record) => /^SPT-/.test(record.taskId));
  const nonSptRecords = records.filter((record) => !/^SPT-/.test(record.taskId));
  const renderableRecords = sptRecords.filter(
    (record) =>
      record.inicioPlan &&
      record.finPlan &&
      normalize(record.verEnGantt) !== "no",
  );
  const visibleNoRecords = sptRecords.filter(
    (record) => normalize(record.verEnGantt) === "no",
  );
  const derivedColumns = records[0]
    ? records[0].headers.filter((header) =>
        ["atraso_dias", "atraso_dias"].includes(normalizeHeader(header)),
      )
    : [];
  const derivedColumnSummary = derivedColumns.length ? "Atraso (dias)" : "Ninguna";

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
    "## Resumen ejecutivo",
    "",
    "Auditoria read-only del CSV publicado de `timeline`. El reporte no modifica Google Sheets, no ejecuta POST y no usa credenciales.",
    "",
    `- Inconsistencias criticas: ${bySeverity.critica || 0}.`,
    `- Inconsistencias medias: ${bySeverity.media || 0}.`,
    `- Hallazgos bajos: ${bySeverity.baja || 0}.`,
    `- Decisiones pendientes detectadas: ${bySeverity.decision || 0}.`,
    "- Proximo paso recomendado: revisar este checklist, aprobar criterios de correccion y ejecutar saneamiento manual controlado con backup/export previo.",
    "",
    "## Conteos principales",
    "",
    "| Metrica | Valor |",
    "|---|---:|",
    `| Columnas publicadas | ${rows[headerIndex].length} |`,
    `| Fila de headers | ${headerIndex + 1} |`,
    `| Filas CSV de datos | ${records.length} |`,
    `| Tareas con ID SPT-* | ${sptRecords.length} |`,
    `| Tareas renderizables por frontend | ${renderableRecords.length} |`,
    `| Filas no productivas / no SPT-* | ${nonSptRecords.length} |`,
    `| Tareas con Ver en Gantt = No | ${visibleNoRecords.length} |`,
    `| Columnas derivables presentes | ${derivedColumnSummary} |`,
    "",
    "## Catalogos sugeridos",
    "",
    `- Fase: ${SUGGESTED_PHASES.join(", ")}.`,
    `- Estado: ${SUGGESTED_STATES.join(", ")}.`,
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
    "## Checklist de saneamiento manual",
    "",
    "- [ ] Exportar backup del CSV o duplicar la hoja antes de tocar datos.",
    "- [ ] Completar estados vacios en tareas `SPT-*`.",
    "- [ ] Completar `Inicio plan` y `Fin plan` o marcar fuera de Gantt las tareas que no deban renderizar.",
    "- [ ] Corregir fechas no canonicas a `YYYY-MM-DD`.",
    "- [ ] Corregir dependencias rotas o vaciarlas con motivo documentado.",
    "- [ ] Completar fase, hito y responsable faltantes.",
    "- [ ] Clasificar filas no `SPT-*` como instrucciones, dummies o datos a archivar.",
    "- [ ] Confirmar si cada `Ver en Gantt = No` es intencional.",
    "- [ ] Validar CSV publicado despues de cada tanda de cambios.",
    "- [ ] Renderizar Gantt y revisar filtros, Mes, Semana y boton Hoy.",
    "",
    "## Recomendaciones de siguiente paso",
    "",
    "1. Revisar los casos criticos antes de cualquier saneamiento manual.",
    "2. Aprobar responsables y valores destino para estado, fase, hito y responsable.",
    "3. Ejecutar 32G como saneamiento manual controlado por tandas pequenas.",
    "4. Reejecutar este script despues de cada tanda hasta llegar a 0 criticos.",
    "5. Recien despues avanzar a catalogos y validaciones frontend/backend.",
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

  const records = dataRows.map((row, index) => {
    const raw = {};
    headers.forEach((header, colIndex) => {
      raw[header] = clean(row[colIndex]);
    });

    return {
      rowNumber: headerIndex + 2 + index,
      headers,
      raw,
      taskId: valueOf(raw, ["ID Tarea", "task_id", "id_tarea"]),
      sellerId: valueOf(raw, ["seller_id", "id_seller", "seller"]),
      fase: valueOf(raw, ["Fase", "fase"]),
      hito: valueOf(raw, ["Hito", "hito"]),
      tarea: valueOf(raw, ["Tarea", "tarea", "actividad"]),
      responsable: valueOf(raw, ["Responsable", "responsable"]),
      dependencia: valueOf(raw, ["Depende de", "dependencia", "depende_de"]),
      inicioPlan: valueOf(raw, ["Inicio plan", "inicio_plan", "fecha_inicio_plan"]),
      finPlan: valueOf(raw, ["Fin plan", "fin_plan", "fecha_fin_plan"]),
      inicioReal: valueOf(raw, ["Inicio real", "inicio_real", "fecha_inicio_real"]),
      finReal: valueOf(raw, ["Fin real", "fin_real", "fecha_fin_real"]),
      estado: valueOf(raw, ["Estado", "estado", "estado_tarea"]),
      verEnGantt: valueOf(raw, ["Ver en Gantt", "visible_gantt", "visible"]),
      atrasoDias: valueOf(raw, ["Atraso (dias)", "Atraso (días)", "atraso_dias"]),
    };
  });

  const taskIds = new Set(
    records.filter((record) => /^SPT-/.test(record.taskId)).map((record) => record.taskId),
  );
  const suggestedPhaseSet = new Set(SUGGESTED_PHASES.map(normalizeCatalogValue));
  const suggestedStateSet = new Set(SUGGESTED_STATES.map(normalizeCatalogValue));
  const issues = [];

  if (headers.some((header) => normalizeHeader(header) === "atraso_dias")) {
    addIssue(
      issues,
      "baja",
      "columna derivable presente",
      headerIndex + 1,
      "",
      "Atraso (dias)",
      "presente",
      "Tratar como dato derivado; no usar como autoridad.",
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
        "Normalizar a Comercial, Técnica, Operativa o Cierre.",
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

    if (!record.inicioPlan || !record.finPlan) {
      addIssue(
        issues,
        "critica",
        "tarea SPT-* sin inicio_plan o fin_plan",
        record.rowNumber,
        record.taskId,
        "Inicio plan / Fin plan",
        `${record.inicioPlan || "(vacio)"} / ${record.finPlan || "(vacio)"}`,
        "Completar plan o marcar fuera de Gantt.",
      );
    }

    [
      ["Inicio plan", record.inicioPlan, false],
      ["Fin plan", record.finPlan, false],
      ["Inicio real", record.inicioReal, true],
      ["Fin real", record.finReal, true],
    ].forEach(([field, value, isRealDate]) => {
      const dateStatus = classifyDate(value);
      if (dateStatus === "invalid") {
        addIssue(
          issues,
          "critica",
          "fecha invalida",
          record.rowNumber,
          record.taskId,
          field,
          value,
          "Corregir a formato canonico YYYY-MM-DD o vaciar si es opcional.",
        );
      } else if (dateStatus === "dmy" && isRealDate) {
        addIssue(
          issues,
          "critica",
          "fecha real en formato no canonico",
          record.rowNumber,
          record.taskId,
          field,
          value,
          "Convertir a YYYY-MM-DD.",
        );
      } else if (dateStatus === "dmy") {
        addIssue(
          issues,
          "media",
          "fecha plan en formato no canonico",
          record.rowNumber,
          record.taskId,
          field,
          value,
          "Convertir a YYYY-MM-DD.",
        );
      }
    });

    const dependencyIds = Array.from(record.dependencia.matchAll(/SPT-\d+-T-\d+/g)).map(
      (match) => match[0],
    );
    dependencyIds.forEach((dependencyId) => {
      if (!taskIds.has(dependencyId)) {
        addIssue(
          issues,
          "critica",
          "dependencia apunta a task_id inexistente",
          record.rowNumber,
          record.taskId,
          "Depende de",
          dependencyId,
          "Corregir destino existente o vaciar dependencia con motivo documentado.",
        );
      }
    });

    if (normalize(record.verEnGantt) === "no") {
      addIssue(
        issues,
        "decision",
        "tarea con Ver en Gantt = No",
        record.rowNumber,
        record.taskId,
        "Ver en Gantt",
        record.verEnGantt,
        "Confirmar si la ocultacion es intencional.",
      );
    }
  });

  const report = buildReport({
    rows,
    headerIndex,
    records,
    issues,
    generatedAt: new Date().toISOString(),
  });

  fs.writeFileSync(REPORT_PATH, report, "utf8");
  const counts = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {});

  console.log(`Reporte generado: ${REPORT_PATH}`);
  console.log(`Filas CSV de datos: ${records.length}`);
  console.log(`Tareas SPT-*: ${records.filter((record) => /^SPT-/.test(record.taskId)).length}`);
  console.log(`Criticas: ${counts.critica || 0}`);
  console.log(`Medias: ${counts.media || 0}`);
  console.log(`Bajas: ${counts.baja || 0}`);
  console.log(`Decisiones: ${counts.decision || 0}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
