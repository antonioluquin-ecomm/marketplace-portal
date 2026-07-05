/**
 * SPORTING MARKETPLACE — Integraciones.gs
 * Integraciones externas (subida de logos a GitHub).
 */


function subirLogoAGitHub(data) {
  const pat = PropertiesService.getScriptProperties().getProperty("GITHUB_PAT");
  if (!pat) throw new Error("GITHUB_PAT no configurado en Script Properties");

  const sellerId = String(data.seller_id || "").trim();
  const fileName = String(data.file_name || "").trim();
  const base64   = String(data.file_base64 || "").trim();

  if (!sellerId || !fileName || !base64) {
    throw new Error("Faltan campos: seller_id, file_name o file_base64");
  }

  const repo   = "antonioluquin-ecomm/marketplace-portal";
  const branch = "main";
  const path   = "assets/logos/" + fileName;
  const apiUrl = "https://api.github.com/repos/" + repo + "/contents/" + path;

  const headers = {
    Authorization: "token " + pat,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };

  let sha;
  try {
    const check = UrlFetchApp.fetch(apiUrl, { headers: headers, muteHttpExceptions: true });
    if (check.getResponseCode() === 200) {
      sha = JSON.parse(check.getContentText()).sha;
    }
  } catch (_) {}

  const body = { message: "logo: agrega logo para " + sellerId, content: base64, branch: branch };
  if (sha) body.sha = sha;

  const res = UrlFetchApp.fetch(apiUrl, {
    method: "put",
    headers: headers,
    payload: JSON.stringify(body),
    muteHttpExceptions: true,
  });

  const status = res.getResponseCode();
  if (status !== 200 && status !== 201) {
    const err = JSON.parse(res.getContentText() || "{}");
    throw new Error(err.message || "GitHub API error " + status);
  }

  return { ok: true, seller_id: sellerId, file: fileName };
}
