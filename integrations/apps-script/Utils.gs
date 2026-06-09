/**
 * SPORTING MARKETPLACE - Apps Script utils
 *
 * Helpers genericos sin side effects de negocio.
 */

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function fechaActualSimple() {
  return Utilities.formatDate(new Date(), TIMEZONE, "yyyy-MM-dd");
}

function rowToObject(headers, row) {
  const obj = {};
  headers.forEach((h, i) => {
    obj[h] =
      row[i] !== undefined && row[i] !== null ? String(row[i]).trim() : "";
  });
  return obj;
}

function pickPrimero(valores) {
  for (const valor of valores) {
    const limpio = limpiarValor(valor);
    if (limpio) return limpio;
  }
  return "";
}

function limpiarValor(valor) {
  if (valor === null || valor === undefined) return "";

  if (Array.isArray(valor)) {
    return valor
      .map((v) => String(v || "").trim())
      .filter(Boolean)
      .join(", ");
  }

  return String(valor).trim();
}

function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
