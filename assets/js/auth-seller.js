/* ============================================================
   MARKETPLACE PORTAL — auth-seller.js
   Autenticación de Sellers para public/ (Etapa 3).

   Sesión separada de la interna (localStorage['mp_seller_session'],
   distinta clave de 'mp_session') — un login por seller_id, no por
   contacto individual. Carga: después de config.js, en cada página
   de public/ (excepto login.html, que tiene su propio script inline).
   ============================================================ */

const SellerSESSION = {
  get data()  { return JSON.parse(localStorage.getItem('mp_seller_session') || 'null'); },
  set data(v) { localStorage.setItem('mp_seller_session', JSON.stringify(v)); },
  clear()     { localStorage.removeItem('mp_seller_session'); },

  isLoggedIn() {
    const d = this.data;
    return !!d && !!d.expira_en && new Date(d.expira_en) > new Date();
  },

  get sellerId() { return (this.isLoggedIn() && this.data.usuario.seller_id) || ''; },
  get token()    { return (this.data && this.data.session_token) || ''; },
  get nombre()   { return (this.isLoggedIn() && this.data.usuario.nombre) || ''; },
  get email()    { return (this.isLoggedIn() && this.data.usuario.email) || ''; },
};

/* ─── RUTAS (relativas a public/) ─────────────────────────── */

function _sellerPublicDepth() {
  const tag = document.querySelector('script[src*="config.js"]');
  if (!tag) return 0;
  const src = tag.getAttribute('src'); // ej: '../../assets/js/config.js'
  const niveles = (src.match(/\.\.\//g) || []).length;
  return Math.max(0, niveles - 1); // niveles desde el archivo actual hasta public/
}

function _sellerLoginPath() {
  return '../'.repeat(_sellerPublicDepth()) + 'login.html';
}

function _sellerHubPath() {
  return '../'.repeat(_sellerPublicDepth()) + 'index.html';
}

/* ─── INIT ────────────────────────────────────────────────── */

async function initSellerAuth() {
  if (!SellerSESSION.isLoggedIn()) {
    window.location.href = _sellerLoginPath();
    return;
  }

  try {
    const fresh = await _apiSellerPost({ action: 'validateSession' });
    if (fresh && fresh.usuario) {
      const cur = SellerSESSION.data;
      if (cur) SellerSESSION.data = Object.assign({}, cur, { usuario: fresh.usuario });
    }
  } catch (e) {
    // Sesión inválida/expirada: logoutSeller() ya se disparó desde _apiSellerPost
  }

  if (!SellerSESSION.isLoggedIn() || !SellerSESSION.sellerId) {
    window.location.href = _sellerLoginPath();
  }
}

/* ─── LOGOUT ──────────────────────────────────────────────── */

function logoutSeller() {
  const token = SellerSESSION.token;
  SellerSESSION.clear();

  const apiUrl = window.MP_CONFIG && window.MP_CONFIG.APPS_SCRIPT_URL;
  if (token && apiUrl) {
    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({ action: 'logout', session_token: token }),
    }).catch(function () {});
  }

  window.location.href = _sellerLoginPath();
}

/* ─── CAMBIAR CONTRASEÑA ─────────────────────────────────────── */

function _showSellerChangePasswordModal() {
  if (document.getElementById('sellerchpw-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'sellerchpw-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9998;font-family:Barlow,system-ui,sans-serif';
  overlay.innerHTML = `
    <div style="width:340px;background:#131b12;border:1px solid rgba(255,255,255,.08);border-radius:16px;box-shadow:0 24px 70px rgba(0,0,0,.4);padding:20px;color:#edf3e9">
      <div style="font-size:15px;font-weight:900;margin-bottom:14px">Cambiar contraseña</div>
      <div id="sellerchpw-error" style="color:#e5484d;font-size:12px;margin-bottom:10px" hidden></div>
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:12px;font-weight:700;color:#c4d8bb;margin-bottom:5px">Contraseña actual</label>
        <input id="sellerchpw-actual" type="password" autocomplete="current-password"
               style="width:100%;padding:9px 10px;font-size:13px;background:rgba(255,255,255,.03);color:#edf3e9;border:1px solid rgba(255,255,255,.08);border-radius:8px;box-sizing:border-box">
      </div>
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:12px;font-weight:700;color:#c4d8bb;margin-bottom:5px">Nueva contraseña</label>
        <input id="sellerchpw-nueva" type="password" autocomplete="new-password" placeholder="Mínimo 6 caracteres"
               style="width:100%;padding:9px 10px;font-size:13px;background:rgba(255,255,255,.03);color:#edf3e9;border:1px solid rgba(255,255,255,.08);border-radius:8px;box-sizing:border-box">
      </div>
      <div style="margin-bottom:14px">
        <label style="display:block;font-size:12px;font-weight:700;color:#c4d8bb;margin-bottom:5px">Confirmar nueva contraseña</label>
        <input id="sellerchpw-confirmar" type="password" autocomplete="new-password"
               style="width:100%;padding:9px 10px;font-size:13px;background:rgba(255,255,255,.03);color:#edf3e9;border:1px solid rgba(255,255,255,.08);border-radius:8px;box-sizing:border-box">
      </div>
      <div style="display:flex;gap:8px">
        <button id="sellerchpw-submit" onclick="_submitSellerChangePassword()"
                style="flex:1;padding:9px;font-size:12px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;border:none;border-radius:8px;background:#5ea832;color:#fff;cursor:pointer">Guardar</button>
        <button onclick="_closeSellerChangePasswordModal()"
                style="padding:9px 14px;font-size:12px;border:1px solid rgba(255,255,255,.08);border-radius:8px;background:transparent;color:#c4d8bb;cursor:pointer">Cancelar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(function () {
    const el = document.getElementById('sellerchpw-actual');
    if (el) el.focus();
  }, 80);

  overlay.addEventListener('keydown', function (e) {
    if (e.key === 'Enter')  _submitSellerChangePassword();
    if (e.key === 'Escape') _closeSellerChangePasswordModal();
  });
}

function _closeSellerChangePasswordModal() {
  const overlay = document.getElementById('sellerchpw-overlay');
  if (overlay) overlay.remove();
}

async function _submitSellerChangePassword() {
  const actualEl    = document.getElementById('sellerchpw-actual');
  const nuevaEl     = document.getElementById('sellerchpw-nueva');
  const confirmarEl = document.getElementById('sellerchpw-confirmar');
  const errorEl     = document.getElementById('sellerchpw-error');
  const submitEl    = document.getElementById('sellerchpw-submit');

  const actual    = actualEl    ? actualEl.value    : '';
  const nueva     = nuevaEl     ? nuevaEl.value     : '';
  const confirmar = confirmarEl ? confirmarEl.value : '';

  if (errorEl) errorEl.hidden = true;

  if (!actual) {
    if (errorEl) { errorEl.textContent = 'Ingresá la contraseña actual.'; errorEl.hidden = false; }
    return;
  }
  if (!nueva || nueva.length < 6) {
    if (errorEl) { errorEl.textContent = 'La nueva contraseña debe tener al menos 6 caracteres.'; errorEl.hidden = false; }
    return;
  }
  if (nueva !== confirmar) {
    if (errorEl) { errorEl.textContent = 'Las contraseñas no coinciden.'; errorEl.hidden = false; }
    return;
  }

  if (submitEl) { submitEl.disabled = true; submitEl.textContent = 'Guardando…'; }

  try {
    const actualHash = await sha256(actual);
    const nuevaHash  = await sha256(nueva);
    await _apiSellerPost({ action: 'changePassword', password_actual_hash: actualHash, password_nueva_hash: nuevaHash });
    _closeSellerChangePasswordModal();
  } catch (err) {
    if (submitEl) { submitEl.disabled = false; submitEl.textContent = 'Guardar'; }
    if (errorEl)  { errorEl.textContent = err.message || 'Error al cambiar la contraseña.'; errorEl.hidden = false; }
  }
}

/* ─── SHA-256 ─────────────────────────────────────────────── */

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ─── API HELPER ──────────────────────────────────────────── */

async function _apiSellerPost(body) {
  const url = window.MP_CONFIG && window.MP_CONFIG.APPS_SCRIPT_URL;
  if (!url) throw new Error('No hay URL de API configurada');

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(Object.assign({ session_token: SellerSESSION.token }, body)),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  if (!json.ok) {
    if (json.code === 401) {
      logoutSeller();
      throw new Error('Sesión expirada. Ingresá de nuevo.');
    }
    throw new Error(json.error || 'Error desconocido');
  }
  return json;
}
