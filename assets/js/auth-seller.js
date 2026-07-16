/* ============================================================
   MARKETPLACE PORTAL — auth-seller.js
   Autenticación de Sellers para public/ (Etapa 3).

   Sesión separada de la interna (localStorage['mp_seller_session'],
   distinta clave de 'mp_session') — un login por seller_id, no por
   contacto individual. Carga: después de config.js, en cada página
   de public/ (excepto login.html, que tiene su propio script inline).
   ============================================================ */

/*
  Etapa 9b — sesión de portal dual-mode. Las 6 páginas de public/ pueden
  cargarse con:
    · una sesión de seller (mp_seller_session) → modo 'seller', fijo a su
      propio seller_id (comportamiento histórico), o
    · una sesión interna de staff (mp_session, la de auth.js) → modo 'staff':
      el admin/staff "ve como seller" eligiendo uno con el selector. El
      seller_id pasa a ser un target seleccionable (SellerSESSION.sellerId),
      que _apiSellerPost inyecta como target_seller_id.
  Se conserva la superficie de API (SellerSESSION, _apiSellerPost,
  initSellerAuth) para no reescribir las páginas.
*/
const SellerSESSION = {
  // seller elegido en modo staff — persistido en sessionStorage (por pestaña)
  // para que sobreviva el reload que dispara el selector y las páginas que
  // capturan el seller_id al cargar lo tomen ya resuelto.
  get _staffTarget()  { return sessionStorage.getItem('mp_staff_seller') || ''; },
  set _staffTarget(v) {
    if (v) sessionStorage.setItem('mp_staff_seller', String(v).trim());
    else   sessionStorage.removeItem('mp_staff_seller');
  },

  get _sellerData() { return JSON.parse(localStorage.getItem('mp_seller_session') || 'null'); },
  get _staffData()  { return JSON.parse(localStorage.getItem('mp_session')        || 'null'); },
  _valid(d)         { return !!d && !!d.expira_en && new Date(d.expira_en) > new Date(); },

  get mode() {
    if (this._valid(this._sellerData)) return 'seller';
    if (this._valid(this._staffData))  return 'staff';
    return null;
  },
  get isStaff() { return this.mode === 'staff'; },
  isLoggedIn()  { return this.mode !== null; },

  // Sesión activa según el modo (seller o staff).
  get data() {
    const m = this.mode;
    if (m === 'seller') return this._sellerData;
    if (m === 'staff')  return this._staffData;
    return null;
  },
  set data(v) { localStorage.setItem('mp_seller_session', JSON.stringify(v)); }, // solo modo seller
  clear()     { localStorage.removeItem('mp_seller_session'); },

  // En modo seller: su propio seller_id (fijo). En modo staff: el target elegido.
  get sellerId() {
    if (this.mode === 'seller') return (this._sellerData.usuario && this._sellerData.usuario.seller_id) || '';
    if (this.mode === 'staff')  return this._staffTarget || '';
    return '';
  },
  set sellerId(v) { if (this.mode === 'staff') this._staffTarget = String(v || '').trim(); },

  get token()  { const d = this.data; return (d && d.session_token) || ''; },
  get nombre() { const d = this.data; return (d && d.usuario && d.usuario.nombre) || ''; },
  get email()  { const d = this.data; return (d && d.usuario && d.usuario.email) || ''; },
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

// Rutas al lado interno (repo root, un nivel por encima de public/) — usadas en
// modo staff para volver al Hub o al login interno.
function _internalLoginPath() {
  return '../'.repeat(_sellerPublicDepth() + 1) + 'login.html';
}

function _internalHubPath() {
  return '../'.repeat(_sellerPublicDepth() + 1) + 'index.html';
}

/* ─── NAV DEL FLUJO PÚBLICO (header compartido) ──────────────
   Fuente única de las 6 páginas del flujo seller. Antes cada página
   tenía su propia lista de <a> hardcodeada (topbar + hero, x2), lo que
   generaba drift entre headers (orden distinto, links faltantes —
   integracion-seller.html llegó a no tener nav en el topbar). Cada
   página deja un <nav class="public-flow-nav" data-public-nav> vacío
   y renderPublicFlowNav() lo completa con el mismo contenido en todas.
   ────────────────────────────────────────────────────────────── */
const PUBLIC_FLOW_ITEMS = [
  { id: 'presentacion', label: 'Presentación', path: 'presentaciones/presentacion-seller.html' },
  { id: 'simulador',    label: 'Simulador',    path: 'simuladores/simulador-seller.html' },
  { id: 'calificacion', label: 'Calificación', path: 'formularios/formulario-calificacion.html' },
  { id: 'relevamiento', label: 'Relevamiento', path: 'formularios/formulario-relevamiento.html' },
  { id: 'gantt',        label: 'Gantt',        path: 'gantt/gantt-seller.html' },
  { id: 'integracion',  label: 'Integración',  path: 'integracion/integracion-seller.html' },
];

function renderPublicFlowNav() {
  const navs = document.querySelectorAll('.public-flow-nav[data-public-nav]');
  if (!navs.length) return;
  const activeId = document.body.getAttribute('data-public-page') || '';
  const prefix = '../'.repeat(_sellerPublicDepth());
  const html = PUBLIC_FLOW_ITEMS.map(function (item) {
    const cls = item.id === activeId ? ' class="active"' : '';
    return '<a' + cls + ' data-public-link="' + item.id + '" href="' + prefix + item.path + '">' + item.label + '</a>';
  }).join('');
  navs.forEach(function (nav) { nav.innerHTML = html; });
}

/* ─── INIT ────────────────────────────────────────────────── */

async function initSellerAuth() {
  const modo = SellerSESSION.mode;
  if (!modo) {
    window.location.href = _sellerLoginPath();
    return;
  }

  try {
    const fresh = await _apiSellerPost({ action: 'validateSession' });
    if (fresh && fresh.usuario && SellerSESSION.mode === 'seller') {
      // Solo refrescamos la sesión de seller; la interna la gestiona auth.js.
      const cur = SellerSESSION._sellerData;
      if (cur) localStorage.setItem('mp_seller_session', JSON.stringify(Object.assign({}, cur, { usuario: fresh.usuario })));
    }
  } catch (e) {
    // Sesión inválida/expirada: _apiSellerPost ya redirigió según el modo
  }

  if (!SellerSESSION.isLoggedIn()) {
    window.location.href = _sellerLoginPath();
    return;
  }

  // Modo seller: exige tener seller_id propio. Modo staff: no exige target
  // (el admin lo elige con el selector; la página arranca sin seller cargado).
  if (SellerSESSION.mode === 'seller' && !SellerSESSION.sellerId) {
    window.location.href = _sellerLoginPath();
    return;
  }

  renderPublicFlowNav();
}

/* ─── BARRA "VER COMO SELLER" (modo staff) ────────────────────── */

// Etapa 9c — en modo staff monta una barra inferior verde con un <select> de
// todos los sellers + link al Hub interno. Al elegir un seller, persiste el
// target y recarga la página, de modo que TODA página (incluidas las que
// capturan el seller_id al cargar) re-arranca con el seller elegido. En modo
// seller es no-op y devuelve false. Devuelve true en modo staff.
async function renderStaffSellerBar() {
  if (!SellerSESSION.isStaff) return false;
  if (document.getElementById('staff-seller-bar')) return true;

  // Oculta el chrome de sesión de seller (chip/cambiar contraseña/logout) que
  // no aplica en modo staff — se sale con "← Hub interno".
  document.querySelectorAll('.user-chip').forEach(function (el) { el.style.display = 'none'; });

  const bar = document.createElement('div');
  bar.id = 'staff-seller-bar';
  bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9999;display:flex;align-items:center;gap:12px;padding:9px 18px;background:var(--primary-hover, #1e9209);color:#fff;font-family:var(--font, system-ui, sans-serif);font-size:13px;box-shadow:0 -2px 14px rgba(17,24,39,.3)';
  bar.innerHTML =
    '<strong style="font-weight:800;letter-spacing:.05em;text-transform:uppercase;font-size:10.5px">Vista de administrador</strong>' +
    '<span style="opacity:.85">Ver como seller:</span>' +
    '<select id="staff-seller-select" style="min-width:230px;padding:6px 8px;border-radius:6px;border:none;font-size:13px;color:#111">' +
      '<option value="">— Cargando sellers… —</option>' +
    '</select>' +
    '<span style="flex:1"></span>' +
    '<a href="' + _internalHubPath() + '" style="color:#fff;text-decoration:underline;font-size:12px">← Hub interno</a>';
  document.body.appendChild(bar);
  document.body.style.paddingBottom = (bar.offsetHeight + 16) + 'px';

  const sel = document.getElementById('staff-seller-select');
  sel.addEventListener('change', function () {
    SellerSESSION._staffTarget = sel.value; // persiste (o limpia)
    window.location.reload();               // re-arranca la página con el nuevo seller
  });

  try {
    // getSellers con target vacío devuelve todos (para poblar el selector).
    const json = await _apiSellerPost({ action: 'getSellers', target_seller_id: '' });
    const sellers = (json.data || []).slice().sort(function (a, b) {
      return String(a.seller_nombre || a.seller_id).localeCompare(String(b.seller_nombre || b.seller_id), 'es');
    });
    const actual = SellerSESSION.sellerId;
    sel.innerHTML = '<option value="">— Elegí un seller —</option>' +
      sellers.map(function (s) {
        const id  = s.seller_id;
        const nom = s.seller_nombre || s.nombre || id;
        const selAttr = String(id).toUpperCase() === String(actual).toUpperCase() ? ' selected' : '';
        return '<option value="' + id + '"' + selAttr + '>' + nom + ' · ' + id + '</option>';
      }).join('');
  } catch (e) {
    sel.innerHTML = '<option value="">Error al cargar sellers</option>';
  }
  return true;
}

// Etapa 9c — arranca una página externa: valida sesión y monta la barra en modo
// staff. Ejecuta load() en modo seller, o en modo staff si ya hay un seller
// elegido (target persistido). En modo staff sin seller elegido, llama
// onStaffNoTarget() (para mostrar un placeholder) y no carga contenido.
async function initPortalPage(load, onStaffNoTarget) {
  await initSellerAuth();
  if (!SellerSESSION.isLoggedIn()) return; // initSellerAuth ya redirigió
  const staff = await renderStaffSellerBar();
  if (staff && !SellerSESSION.sellerId) {
    if (typeof onStaffNoTarget === 'function') onStaffNoTarget();
    return;
  }
  load();
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
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(17,24,39,.55);display:flex;align-items:center;justify-content:center;z-index:9998;font-family:var(--font, system-ui, sans-serif)';
  overlay.innerHTML = `
    <div style="width:340px;background:var(--card, #fff);border:1px solid var(--line, #e5e7eb);border-radius:var(--radius, 14px);box-shadow:var(--shadow-lg, 0 24px 70px rgba(17,24,39,.2));padding:20px">
      <div style="font-size:15px;font-weight:700;color:var(--text, #111827);margin-bottom:14px">Cambiar contraseña</div>
      <div id="sellerchpw-error" style="color:var(--danger, #991b1b);font-size:12px;margin-bottom:10px" hidden></div>
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:12px;font-weight:500;color:var(--text, #111827);margin-bottom:5px">Contraseña actual</label>
        <input id="sellerchpw-actual" type="password" autocomplete="current-password"
               style="width:100%;padding:8px 10px;font-size:13px;color:var(--text, #111827);border:1px solid var(--line, #e5e7eb);border-radius:var(--radius-sm, 8px);box-sizing:border-box">
      </div>
      <div style="margin-bottom:10px">
        <label style="display:block;font-size:12px;font-weight:500;color:var(--text, #111827);margin-bottom:5px">Nueva contraseña</label>
        <input id="sellerchpw-nueva" type="password" autocomplete="new-password" placeholder="Mínimo 6 caracteres"
               style="width:100%;padding:8px 10px;font-size:13px;color:var(--text, #111827);border:1px solid var(--line, #e5e7eb);border-radius:var(--radius-sm, 8px);box-sizing:border-box">
      </div>
      <div style="margin-bottom:14px">
        <label style="display:block;font-size:12px;font-weight:500;color:var(--text, #111827);margin-bottom:5px">Confirmar nueva contraseña</label>
        <input id="sellerchpw-confirmar" type="password" autocomplete="new-password"
               style="width:100%;padding:8px 10px;font-size:13px;color:var(--text, #111827);border:1px solid var(--line, #e5e7eb);border-radius:var(--radius-sm, 8px);box-sizing:border-box">
      </div>
      <div style="display:flex;gap:8px">
        <button id="sellerchpw-submit" onclick="_submitSellerChangePassword()"
                style="flex:1;padding:8px;font-size:13px;font-weight:600;border:none;border-radius:var(--radius-sm, 8px);background:var(--primary, #25b60c);color:#fff;cursor:pointer">Guardar</button>
        <button onclick="_closeSellerChangePasswordModal()"
                style="padding:8px 14px;font-size:13px;border:1px solid var(--line, #e5e7eb);border-radius:var(--radius-sm, 8px);background:var(--card, #fff);color:var(--text, #111827);cursor:pointer">Cancelar</button>
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

/* ─── LOGO DE SELLER: DETECCIÓN DE PLACEHOLDER EN BLANCO ─────── */

// Los archivos en assets/logos/{seller_id}.png para sellers que todavía no
// subieron su logo real son PNGs válidos (200 OK) pero en blanco — un <img
// onerror> no los detecta porque la carga no falla, solo no tiene contenido
// visible. Se verifica el contenido real vía canvas y se trata como "sin
// logo" si prácticamente no hay píxeles con color/opacidad.
function isBlankLogoImage(img) {
  try {
    const c = document.createElement('canvas');
    const w = (c.width = 24), h = (c.height = 24);
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let visible = 0;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a > 10 && (data[i] < 245 || data[i + 1] < 245 || data[i + 2] < 245)) visible++;
    }
    return visible < 4;
  } catch (e) {
    return false; // no se pudo inspeccionar (imagen cross-origin, etc.) — no bloquear el logo
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

  const payload = Object.assign({ session_token: SellerSESSION.token }, body);
  // Modo staff con un seller elegido: se pasa como target_seller_id. El backend
  // solo lo respeta para sesiones internas; una sesión de seller lo ignora.
  if (SellerSESSION.isStaff && SellerSESSION.sellerId && payload.target_seller_id === undefined) {
    payload.target_seller_id = SellerSESSION.sellerId;
  }

  const res = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  if (!json.ok) {
    if (json.code === 401) {
      // Sesión vencida: redirige según el dominio de la sesión activa.
      if (SellerSESSION.mode === 'staff') {
        localStorage.removeItem('mp_session');
        window.location.href = _internalLoginPath();
      } else {
        logoutSeller();
      }
      throw new Error('Sesión expirada. Ingresá de nuevo.');
    }
    throw new Error(json.error || 'Error desconocido');
  }
  return json;
}
