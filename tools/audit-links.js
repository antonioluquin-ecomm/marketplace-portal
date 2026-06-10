#!/usr/bin/env node
/**
 * Auditoría de links locales: recorre todos los .html del repo y verifica
 * que cada href/src relativo apunte a un archivo existente.
 * Uso: node tools/audit-links.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SKIP_DIRS = new Set([".git", ".claude", "node_modules", "legacy"]);

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) yield* walk(path.join(dir, e.name));
    } else if (e.name.endsWith(".html")) {
      yield path.join(dir, e.name);
    }
  }
}

const ATTR_RE = /(?:href|src)=["']([^"']+)["']/g;
const problems = [];

for (const file of walk(ROOT)) {
  const html = fs.readFileSync(file, "utf8");
  const dir = path.dirname(file);
  let m;
  while ((m = ATTR_RE.exec(html))) {
    const raw = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|#|\$\{)/.test(raw)) continue;
    const clean = raw.split("#")[0].split("?")[0];
    if (!clean) continue;
    const target = path.resolve(dir, clean);
    if (!fs.existsSync(target)) {
      const line = html.slice(0, m.index).split("\n").length;
      problems.push(`${path.relative(ROOT, file)}:${line} → ${raw}`);
    }
  }
}

if (problems.length) {
  console.log("LINKS ROTOS:");
  for (const p of problems) console.log("  " + p);
  process.exitCode = 1;
} else {
  console.log("OK: todos los links locales resuelven.");
}
