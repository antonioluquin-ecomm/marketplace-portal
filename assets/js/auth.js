/* ============================================================
   MARKETPLACE PORTAL — auth.js
   Sistema de autenticación y control de acceso por roles (RBAC)

   Carga: después de config.js, en cada página de internal/ e index.html.
   initAuth() se llama al final del <body> (o en window.onload) antes de
   renderizar contenido sensible.
   ============================================================ */

function _escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
var escapeHtml = _escHtml;

/* ─── SESSION ─────────────────────────────────────────────── */

const SESSION = {
  get data()  { return JSON.parse(localStorage.getItem('mp_session') || 'null'); },
  set data(v) { localStorage.setItem('mp_session', JSON.stringify(v)); },
  clear()     { localStorage.removeItem('mp_session'); },

  isLoggedIn() {
    const d = this.data;
    return !!d && !!d.expira_en && new Date(d.expira_en) > new Date();
  },
  isAdmin() { return this.isLoggedIn() && this.data.usuario.id_rol === 1; },

  canView(mod) {
    if (!this.isLoggedIn()) return false;
    if (this.isAdmin()) return true;
    const d = this.data;
    return !!(d && d.permisos && d.permisos[mod] && d.permisos[mod].ver);
  },
  canEdit(mod) {
    if (!this.isLoggedIn()) return false;
    if (this.isAdmin()) return true;
    const d = this.data;
    return !!(d && d.permisos && d.permisos[mod] && d.permisos[mod].editar);
  },

  get token() { return (this.data && this.data.session_token) || ''; },
};

/* ─── LOGIN PATH ──────────────────────────────────────────── */

function _loginPath() {
  const tag = document.querySelector('script[src*="config.js"]');
  if (tag) {
    const src = tag.getAttribute('src'); // ej: '../../assets/js/config.js'
    return src.replace(/assets\/js\/config\.js$/, '') + 'login.html';
  }
  return 'login.html';
}

function _hubPath() {
  const tag = document.querySelector('script[src*="config.js"]');
  if (tag) {
    const src = tag.getAttribute('src');
    return src.replace(/assets\/js\/config\.js$/, '') + 'index.html';
  }
  return 'index.html';
}

/* ─── INIT ────────────────────────────────────────────────── */

/**
 * @param {string} [pageModule] - key de MP_RBAC_MODULOS que gobierna esta
 *   página (ej. 'backlog'). Si se pasa y el usuario no es Admin ni tiene
 *   permiso de ver ese módulo, se lo redirige al Hub. Omitir en páginas sin
 *   módulo asociado (Hub, administración).
 */
async function initAuth(pageModule) {
  // Etapa 7 — un solo round-trip por carga de página. Antes se hacía
  // checkSetup + validateSession secuenciales; checkSetup era redundante —
  // sin sesión local se va al login igual (0 llamadas), y con sesión válida
  // el sistema de usuarios está configurado por definición (1 llamada).
  if (!SESSION.isLoggedIn()) {
    window.location.href = _loginPath();
    return;
  }

  try {
    const fresh = await _apiAuthPost({ action: 'validateSession' });
    if (fresh && fresh.permisos) {
      const cur = SESSION.data;
      if (cur) SESSION.data = Object.assign({}, cur, { permisos: fresh.permisos });
    }
  } catch (e) { /* sin conexión o sesión expirada: logoutUser() ya fue llamado */ }

  if (!SESSION.isLoggedIn()) { window.location.href = _loginPath(); return; }

  if (pageModule && !SESSION.isAdmin() && !SESSION.canView(pageModule)) {
    window.location.href = _hubPath() + '?acceso_denegado=' + encodeURIComponent(pageModule);
    return;
  }

  _applySession();
}

function _applySession() {
  _renderUserIndicator();
  applyPermissionsToSidebar();
  initSidebarCollapse();
}

/* ─── PERMISOS — SIDEBAR ─────────────────────────────────────── */

/* --- SIDEBAR COLLAPSE ------------------------------------- */

function initSidebarCollapse() {
  const nav = document.querySelector('[data-portal-nav]');
  if (!nav) return;

  let btn = document.getElementById('sidebarCollapseBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'sidebarCollapseBtn';
    btn.className = 'sidebar-collapse-toggle';
    btn.type = 'button';
    document.body.appendChild(btn);
  } else if (btn.parentElement !== document.body) {
    document.body.appendChild(btn);
  }

  function sync() {
    const navHidden = window.getComputedStyle(nav).display === 'none';
    btn.hidden = navHidden;
    const collapsed = document.documentElement.getAttribute('data-sidebar') === 'collapsed';
    btn.setAttribute('aria-label', collapsed ? 'Mostrar menu lateral' : 'Ocultar menu lateral');
    btn.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
    btn.setAttribute('title', collapsed ? 'Mostrar menu lateral' : 'Ocultar menu lateral');
    btn.textContent = collapsed ? '>>' : '<<';
  }

  if (!btn.dataset.bound) {
    btn.addEventListener('click', function () {
      const collapsed = document.documentElement.getAttribute('data-sidebar') === 'collapsed';
      if (collapsed) {
        document.documentElement.removeAttribute('data-sidebar');
        localStorage.removeItem('mp_sidebar');
      } else {
        document.documentElement.setAttribute('data-sidebar', 'collapsed');
        localStorage.setItem('mp_sidebar', 'collapsed');
      }
      sync();
    });
    window.addEventListener('resize', sync);
    btn.dataset.bound = '1';
  }

  sync();
}
function applyPermissionsToSidebar() {
  const isAdmin = SESSION.isAdmin();

  document.querySelectorAll('[data-portal-nav] [data-page]').forEach(function (el) {
    const mod = el.getAttribute('data-page');
    if (mod === 'administracion') {
      el.style.display = isAdmin ? '' : 'none'; // Configuración: admin-only, no es un módulo RBAC
      return;
    }
    if (isAdmin) return; // Admin ve el resto de los módulos sin restricción
    el.style.display = SESSION.canView(mod) ? '' : 'none';
  });
}

/* ─── LOGOUT ──────────────────────────────────────────────── */

function logoutUser() {
  const token = SESSION.token;
  SESSION.clear();

  if (token) {
    const apiUrl = window.MP_CONFIG && window.MP_CONFIG.APPS_SCRIPT_URL;
    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({ action: 'logout', session_token: token }),
    }).catch(function () {});
  }

  window.location.href = _loginPath();
}

/* ─── CAMBIAR CONTRASEÑA ─────────────────────────────────────── */

function _showChangePasswordModal() {
  if (document.getElementById('chpw-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'chpw-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(17,24,39,.55);display:flex;align-items:center;justify-content:center;z-index:9998';
  overlay.innerHTML = `
    <div style="width:340px;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-lg);padding:20px">
      <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:14px">Cambiar contraseña</div>
      <div id="chpw-error" style="color:var(--danger);font-size:12px;margin-bottom:10px" hidden></div>
      <div class="field" style="margin-bottom:10px">
        <label style="display:block;font-size:12px;font-weight:500;color:var(--text);margin-bottom:5px">Contraseña actual</label>
        <input id="chpw-actual" type="password" autocomplete="current-password"
               style="width:100%;padding:8px 10px;font-size:13px;border:1px solid var(--line);border-radius:var(--radius-sm);box-sizing:border-box">
      </div>
      <div class="field" style="margin-bottom:10px">
        <label style="display:block;font-size:12px;font-weight:500;color:var(--text);margin-bottom:5px">Nueva contraseña</label>
        <input id="chpw-nueva" type="password" autocomplete="new-password" placeholder="Mínimo 6 caracteres"
               style="width:100%;padding:8px 10px;font-size:13px;border:1px solid var(--line);border-radius:var(--radius-sm);box-sizing:border-box">
      </div>
      <div class="field" style="margin-bottom:14px">
        <label style="display:block;font-size:12px;font-weight:500;color:var(--text);margin-bottom:5px">Confirmar nueva contraseña</label>
        <input id="chpw-confirmar" type="password" autocomplete="new-password"
               style="width:100%;padding:8px 10px;font-size:13px;border:1px solid var(--line);border-radius:var(--radius-sm);box-sizing:border-box">
      </div>
      <div style="display:flex;gap:8px">
        <button id="chpw-submit" onclick="_submitChangePassword()"
                style="flex:1;padding:8px;font-size:13px;font-weight:600;border:none;border-radius:var(--radius-sm);background:var(--primary);color:#fff;cursor:pointer">Guardar</button>
        <button onclick="_closeChangePasswordModal()"
                style="padding:8px 14px;font-size:13px;border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--card);color:var(--text);cursor:pointer">Cancelar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(function () {
    const el = document.getElementById('chpw-actual');
    if (el) el.focus();
  }, 80);

  overlay.addEventListener('keydown', function (e) {
    if (e.key === 'Enter')  _submitChangePassword();
    if (e.key === 'Escape') _closeChangePasswordModal();
  });
}

function _closeChangePasswordModal() {
  const overlay = document.getElementById('chpw-overlay');
  if (overlay) overlay.remove();
}

async function _submitChangePassword() {
  const actualEl    = document.getElementById('chpw-actual');
  const nuevaEl     = document.getElementById('chpw-nueva');
  const confirmarEl = document.getElementById('chpw-confirmar');
  const errorEl     = document.getElementById('chpw-error');
  const submitEl    = document.getElementById('chpw-submit');

  const actual    = actualEl    ? actualEl.value    : '';
  const nueva     = nuevaEl     ? nuevaEl.value     : '';
  const confirmar = confirmarEl ? confirmarEl.value : '';

  if (errorEl) errorEl.hidden = true;

  if (!actual) {
    if (errorEl) { errorEl.textContent = 'Ingresá tu contraseña actual.'; errorEl.hidden = false; }
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
    await _apiAuthPost({ action: 'changePassword', password_actual_hash: actualHash, password_nueva_hash: nuevaHash });
    _closeChangePasswordModal();
  } catch (err) {
    if (submitEl) { submitEl.disabled = false; submitEl.textContent = 'Guardar'; }
    if (errorEl)  { errorEl.textContent = err.message || 'Error al cambiar la contraseña.'; errorEl.hidden = false; }
  }
}

/* ─── USER INDICATOR EN SIDEBAR ─────────────────────────────── */

function _openUserDropdown() {
  const drop = document.getElementById('user-dropdown');
  const chip = document.getElementById('sb-user-chip');
  if (!drop || !chip) return;
  drop.style.display = 'block';
  const rect = chip.getBoundingClientRect();
  drop.style.bottom = (window.innerHeight - rect.top + 6) + 'px';
  drop.style.left   = rect.left + 'px';
  drop.style.width  = rect.width + 'px';
  chip.setAttribute('aria-expanded', 'true');
  chip.classList.add('open');
}

function _closeUserDropdown() {
  const drop = document.getElementById('user-dropdown');
  const chip = document.getElementById('sb-user-chip');
  if (drop) drop.style.display = 'none';
  if (chip) { chip.setAttribute('aria-expanded', 'false'); chip.classList.remove('open'); }
}

function _renderUserIndicator() {
  const nav = document.querySelector('[data-portal-nav]');
  if (!nav || document.getElementById('sb-user-chip')) return;

  const user = SESSION.data && SESSION.data.usuario;
  if (!user) return;

  // El nav (secciones + links) scrollea en su propio wrapper; el footer
  // (Configuración + usuario) queda como hermano flex fijo, nunca solapado
  // por contenido largo (páginas con muchas secciones, ej. Gantt Operativo).
  let scroll = nav.querySelector('.sb-scroll');
  if (!scroll) {
    scroll = document.createElement('div');
    scroll.className = 'sb-scroll';
    while (nav.firstChild) scroll.appendChild(nav.firstChild);
    nav.appendChild(scroll);
  }

  let footer = nav.querySelector('.sb-footer');
  if (!footer) {
    footer = document.createElement('div');
    footer.className = 'sb-footer';

    const adminLink = scroll.querySelector('.nav[data-page="administracion"]');
    const adminSection = adminLink && adminLink.closest ? adminLink.closest('.sb-section') : null;
    if (adminSection) footer.appendChild(adminSection);

    nav.appendChild(footer);
  }

  const chip = document.createElement('div');
  chip.id = 'sb-user-chip';
  chip.className = 'sb-user-chip';
  chip.setAttribute('role', 'button');
  chip.setAttribute('aria-haspopup', 'true');
  chip.setAttribute('aria-expanded', 'false');
  chip.setAttribute('title', user.nombre || user.email || '');
  chip.innerHTML =
    '<div class="sb-user-chip-info">' +
      '<span class="sb-user-chip-name">' + escapeHtml(user.nombre || user.email || '') +
        ' <span class="sb-user-chip-chevron" aria-hidden="true">▾</span></span>' +
      '<span class="sb-user-chip-role">' + escapeHtml(user.nombre_rol || '') + '</span>' +
    '</div>';
  chip.addEventListener('click', function (e) {
    e.stopPropagation();
    const drop = document.getElementById('user-dropdown');
    if (drop && drop.style.display !== 'none') _closeUserDropdown();
    else _openUserDropdown();
  });
  footer.appendChild(chip);

  if (!document.getElementById('user-dropdown')) {
    const drop = document.createElement('div');
    drop.id = 'user-dropdown';
    drop.className = 'sb-user-dropdown';
    drop.setAttribute('role', 'menu');
    drop.style.display = 'none';
    drop.innerHTML =
      '<div class="sb-user-dropdown-header">' +
        '<div class="sb-user-dropdown-name">' + escapeHtml(user.nombre || user.email || '') + '</div>' +
        '<div class="sb-user-dropdown-email">' + escapeHtml(user.email || '') + '</div>' +
        '<div class="sb-user-dropdown-meta"><span class="sb-user-role-badge">' + escapeHtml(user.nombre_rol || '') + '</span></div>' +
      '</div>' +
      '<div class="sb-user-dropdown-sep"></div>' +
      '<button class="sb-user-dropdown-item" type="button" onclick="_showChangePasswordModal()">Cambiar contraseña</button>' +
      '<div class="sb-user-dropdown-sep"></div>' +
      '<button class="sb-user-dropdown-item danger" type="button" onclick="logoutUser()">Cerrar sesión</button>';
    drop.addEventListener('click', function (e) { e.stopPropagation(); });
    document.body.appendChild(drop);

    drop.querySelectorAll('.sb-user-dropdown-item').forEach(function (btn) {
      btn.addEventListener('click', _closeUserDropdown);
    });
  }

  document.addEventListener('click', _closeUserDropdown);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') _closeUserDropdown(); });
}

/* ─── GESTIÓN DE USUARIOS / ROLES / PERMISOS (admin) ─────────── */

let _rolesData = [];
let _sellersData = [];
let _usuariosData = [];

/* Cierra un modal-overlay con click afuera o Escape, y envía el form con
   Enter (excepto si el foco está en un <select> o <button>, donde Enter ya
   tiene su propio comportamiento nativo). Mismo patrón que el modal de
   "Cambiar contraseña" más arriba en este archivo. */
function _wireModalDismiss(modalId, onClose, onSubmit) {
  const overlay = document.getElementById(modalId);
  if (!overlay || overlay.dataset.wired) return;
  overlay.dataset.wired = '1';
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) onClose();
  });
  overlay.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'Enter' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      onSubmit();
    }
  });
}

function renderUserManagementSection() {
  if (!SESSION.isAdmin()) return;
  const host = document.getElementById('cfg-tabs-host');
  if (!host || document.getElementById('user-mgmt-section')) return;

  const section = document.createElement('div');
  section.id = 'user-mgmt-section';
  section.innerHTML = `
    <div class="tabs-nav">
      <button type="button" class="tab-btn active" id="ctab-usuarios" onclick="_showCfgTab('usuarios')">Usuarios</button>
      <button type="button" class="tab-btn" id="ctab-roles" onclick="_showCfgTab('roles')">Roles y permisos</button>
      <button type="button" class="tab-btn" id="ctab-integraciones" onclick="_showCfgTab('integraciones')">Integraciones</button>
    </div>

    <div class="tab-pane active" id="ctab-content-usuarios">
      <section class="panel">
        <div class="panel-toolbar">
          <div>
            <h2>Usuarios del sistema</h2>
            <p class="text-muted" id="usuarios-count">Cargando…</p>
          </div>
          <button class="button" id="uf-new-btn" disabled onclick="_openUserForm()">+ Nuevo usuario</button>
        </div>
        <div id="uf-sellers-error" class="status-bar error" style="margin-bottom:14px" hidden></div>
        <div class="field-row" style="margin-bottom:14px">
          <div class="field" style="max-width:280px">
            <input type="search" id="uf-search" placeholder="Buscar por nombre, email o seller…" oninput="_renderUsuariosTable()">
          </div>
          <div class="field" style="max-width:260px">
            <select id="uf-seller-filter" onchange="_renderUsuariosTable()">
              <option value="">Todos los sellers</option>
            </select>
          </div>
        </div>
        <div id="usuarios-table-wrap"><div class="status-bar">Cargando usuarios…</div></div>
      </section>
    </div>

    <div class="tab-pane" id="ctab-content-roles" hidden>
      <section class="panel">
        <div class="panel-toolbar">
          <h2>Roles del sistema</h2>
          <button class="button" onclick="_openRolForm()">+ Nuevo rol</button>
        </div>
        <div id="roles-table-wrap"><div class="status-bar">Cargando roles…</div></div>
      </section>
      <section class="panel" id="permisos-panel-wrap" hidden>
        <div id="permisos-matrix-wrap"></div>
      </section>
    </div>

    <div class="tab-pane" id="ctab-content-integraciones" hidden>
      <div class="cfg-section">
        <div class="cfg-title">Conexión</div>
        <div class="cfg-row">
          <span class="cfg-label">Apps Script URL</span>
          <span class="cfg-val" id="cfg-apps-script-url">—</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:8px">
          <button class="button secondary" onclick="_testConexionApi()">Probar conexión</button>
          <span id="cfg-conexion-status" class="text-muted" style="font-size:12px"></span>
        </div>
      </div>

      <div class="cfg-section">
        <div class="cfg-title">Estado de las hojas</div>
        <div class="cfg-row"><span class="cfg-label">config</span><span class="cfg-val">CSV público</span></div>
        <div class="cfg-row"><span class="cfg-label">sc_roadmap</span><span class="cfg-val">CSV público</span></div>
        <div class="cfg-row"><span class="cfg-label">sellers</span><span class="cfg-val">Endpoint con sesión (getSellers)</span></div>
        <div class="cfg-row"><span class="cfg-label">timeline</span><span class="cfg-val">Endpoint con sesión (getGantt)</span></div>
        <div class="cfg-row"><span class="cfg-label">tarifas</span><span class="cfg-val">Endpoint con sesión (getTarifas)</span></div>
        <div class="cfg-row"><span class="cfg-label">overrides</span><span class="cfg-val">Endpoint con sesión (getOverrides)</span></div>
        <div class="cfg-row"><span class="cfg-label">relevamientos</span><span class="cfg-val">Endpoint con sesión (getRelevamientos)</span></div>
      </div>

      <div class="cfg-section">
        <div class="cfg-title">Hojas de auth</div>
        <div class="cfg-row"><span class="cfg-label">USUARIOS</span><span class="cfg-val">Cuentas internas y de seller</span></div>
        <div class="cfg-row"><span class="cfg-label">ROLES</span><span class="cfg-val">Roles del sistema</span></div>
        <div class="cfg-row"><span class="cfg-label">PERMISOS_MODULOS</span><span class="cfg-val">Matriz de permisos por rol</span></div>
        <div class="cfg-row"><span class="cfg-label">SESIONES</span><span class="cfg-val">Tokens de sesión activos</span></div>
      </div>
    </div>

    <!-- MODAL: crear / editar usuario -->
    <div class="modal-overlay" id="user-modal" style="display:none">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="user-form-title">
        <h3 id="user-form-title">Nuevo usuario</h3>
        <div class="field" style="margin-bottom:12px">
          <label>Tipo de cuenta</label>
          <div class="segmented">
            <button type="button" id="uf-tipo-interno" class="active" onclick="_setTipoCuenta('interno')">Interno</button>
            <button type="button" id="uf-tipo-seller" onclick="_setTipoCuenta('seller')">Seller</button>
          </div>
        </div>
        <div class="field-row" style="margin-bottom:12px">
          <div class="field">
            <label for="uf-nombre">Nombre *</label>
            <input id="uf-nombre" type="text" placeholder="Nombre completo">
            <span class="field-error" id="uf-nombre-err" hidden></span>
          </div>
          <div class="field">
            <label for="uf-email">Email *</label>
            <input id="uf-email" type="email" placeholder="email@empresa.com">
            <span class="field-error" id="uf-email-err" hidden></span>
          </div>
        </div>
        <div class="field" style="margin-bottom:12px">
          <label for="uf-password">Contraseña <span id="uf-pw-req">*</span></label>
          <div class="pw-group">
            <input id="uf-password" type="password" placeholder="Mínimo 6 caracteres" autocomplete="new-password">
            <button type="button" id="uf-pw-toggle" onclick="_togglePasswordVisibility()">Ver</button>
            <button type="button" onclick="_generatePassword()">Generar</button>
          </div>
          <span class="field-hint" id="uf-pw-hint"></span>
          <span class="field-error" id="uf-password-err" hidden></span>
        </div>
        <div class="field-row" style="margin-bottom:6px">
          <div class="field" id="uf-rol-wrap">
            <label for="uf-rol">Rol *</label>
            <select id="uf-rol"></select>
          </div>
          <div class="field" id="uf-sellerid-wrap" hidden>
            <label for="uf-sellerid">Seller *</label>
            <select id="uf-sellerid" onchange="_updateSellerAccountsHint()"></select>
            <span class="field-hint" id="uf-seller-hint">Podés dar de alta varias cuentas para el mismo seller</span>
            <span class="field-error" id="uf-sellerid-err" hidden></span>
          </div>
        </div>
        <div class="status-bar error" id="uf-error" style="margin-top:10px" hidden></div>
        <div class="modal-actions">
          <button class="button secondary" onclick="_closeUserForm()">Cancelar</button>
          <button class="button" id="uf-save-btn" onclick="_saveUser()">Guardar</button>
        </div>
      </div>
    </div>

    <!-- MODAL: crear / editar rol -->
    <div class="modal-overlay" id="rol-modal" style="display:none">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="rol-form-title" style="max-width:380px">
        <h3 id="rol-form-title">Nuevo rol</h3>
        <div class="field">
          <label for="rf-nombre">Nombre del rol *</label>
          <input id="rf-nombre" placeholder="Ej: Backlog, Gestión Comercial">
        </div>
        <div class="status-bar error" id="rf-error" style="margin-top:10px" hidden></div>
        <div class="modal-actions">
          <button class="button secondary" onclick="_closeRolForm()">Cancelar</button>
          <button class="button" onclick="_saveRol()">Guardar</button>
        </div>
      </div>
    </div>
  `;

  host.appendChild(section);
  _wireModalDismiss('user-modal', _closeUserForm, _saveUser);
  _wireModalDismiss('rol-modal', _closeRolForm, _saveRol);
  const urlEl = document.getElementById('cfg-apps-script-url');
  if (urlEl) urlEl.textContent = (window.MP_CONFIG && window.MP_CONFIG.APPS_SCRIPT_URL) || '—';
  Promise.all([_loadRoles(), _loadSellers()]).then(function (results) {
    const sellersOk = results[1];
    const errEl = document.getElementById('uf-sellers-error');
    if (errEl) {
      errEl.textContent = 'No se pudo cargar la lista de sellers. Recargá la página o revisá la conexión con Apps Script antes de crear o editar cuentas de tipo Seller.';
      errEl.hidden = sellersOk !== false;
    }
    const newBtn = document.getElementById('uf-new-btn');
    if (newBtn) newBtn.disabled = false;
    _loadUsuarios();
  });
}

async function _testConexionApi() {
  const statusEl = document.getElementById('cfg-conexion-status');
  if (statusEl) statusEl.textContent = 'Probando…';
  try {
    const url = window.MP_CONFIG && window.MP_CONFIG.APPS_SCRIPT_URL;
    if (!url) throw new Error('No hay URL de API configurada');
    const res  = await fetch(url, { method: 'POST', body: JSON.stringify({ action: 'checkSetup' }) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    await res.json();
    if (statusEl) statusEl.textContent = '✓ Conexión OK';
  } catch (err) {
    if (statusEl) statusEl.textContent = 'Error: ' + (err.message || 'No se pudo conectar');
  }
}

function _showCfgTab(tab) {
  ['usuarios', 'roles', 'integraciones'].forEach(function (t) {
    const content = document.getElementById('ctab-content-' + t);
    const btn     = document.getElementById('ctab-' + t);
    if (content) { content.hidden = (t !== tab); content.classList.toggle('active', t === tab); }
    if (btn)     btn.classList.toggle('active', t === tab);
  });
}

function _rolNombre(id) {
  const r = _rolesData.find(function (x) { return Number(x.id) === Number(id); });
  return r ? r.nombre : ('Rol ' + id);
}

function _populateRolSelect(selectedId) {
  const sel = document.getElementById('uf-rol');
  if (!sel) return;
  const activos = _rolesData.filter(function (r) { return String(r.activo) !== 'NO'; });
  sel.innerHTML = activos.map(function (r) {
    return '<option value="' + r.id + '">' + _escHtml(r.nombre) + '</option>';
  }).join('');
  if (selectedId != null) sel.value = String(selectedId);
}

async function _loadRoles() {
  try {
    const res = await _apiAuthPost({ action: 'getRoles' });
    _rolesData = res.data || [];
  } catch (e) {
    _rolesData = [];
  }
  _renderRolesTable();
  _populateRolSelect();
}

function _sellerNombre(sellerId) {
  if (!sellerId) return '';
  const s = _sellersData.find(function (x) { return String(x.seller_id).toUpperCase() === String(sellerId).toUpperCase(); });
  return s ? (s.seller_nombre || s.seller_id) : sellerId;
}

function _sellersOrdenados() {
  return _sellersData.slice().sort(function (a, b) {
    return String(a.seller_nombre || a.seller_id).localeCompare(String(b.seller_nombre || b.seller_id), 'es');
  });
}

function _populateSellerSelect(selectedId) {
  const sel = document.getElementById('uf-sellerid');
  if (!sel) return;
  const selectedUp = selectedId != null ? String(selectedId).toUpperCase() : null;
  sel.innerHTML = '<option value="">— Seleccioná un seller —</option>' + _sellersOrdenados().map(function (s) {
    return '<option value="' + _escHtml(s.seller_id) + '">' + _escHtml(s.seller_nombre || s.seller_id) + ' (' + _escHtml(s.seller_id) + ')</option>';
  }).join('');
  if (selectedUp) {
    const match = _sellersData.find(function (s) { return String(s.seller_id).toUpperCase() === selectedUp; });
    sel.value = match ? match.seller_id : '';
  }
}

function _populateSellerFilter() {
  const sel = document.getElementById('uf-seller-filter');
  if (!sel) return;
  const usados = {};
  _usuariosData.forEach(function (u) { if (u.seller_id) usados[String(u.seller_id).toUpperCase()] = true; });
  const ordenados = _sellersOrdenados().filter(function (s) { return usados[String(s.seller_id).toUpperCase()]; });
  const actual = sel.value;
  sel.innerHTML = '<option value="">Todos los sellers</option>' + ordenados.map(function (s) {
    return '<option value="' + _escHtml(s.seller_id) + '">' + _escHtml(s.seller_nombre || s.seller_id) + '</option>';
  }).join('');
  sel.value = actual;
}

async function _loadSellers() {
  try {
    const res = await _apiAuthPost({ action: 'getSellers' });
    _sellersData = res.data || [];
    return true;
  } catch (e) {
    _sellersData = [];
    return false;
  }
}

function _normalizeText(v) {
  return (v || '').toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

let _editingUserId = null;

function _setTipoCuenta(tipo) {
  const rolWrap  = document.getElementById('uf-rol-wrap');
  const selWrap  = document.getElementById('uf-sellerid-wrap');
  const btnInt   = document.getElementById('uf-tipo-interno');
  const btnSel   = document.getElementById('uf-tipo-seller');
  if (rolWrap) rolWrap.hidden = tipo === 'seller';
  if (selWrap) selWrap.hidden = tipo !== 'seller';
  if (btnInt)  btnInt.classList.toggle('active', tipo !== 'seller');
  if (btnSel)  btnSel.classList.toggle('active', tipo === 'seller');
  if (tipo === 'seller') _updateSellerAccountsHint();
}

function _updateSellerAccountsHint() {
  const hintEl = document.getElementById('uf-seller-hint');
  const sel    = document.getElementById('uf-sellerid');
  if (!hintEl || !sel) return;
  const sellerId = sel.value;
  if (!sellerId) { hintEl.textContent = 'Podés dar de alta varias cuentas para el mismo seller'; return; }
  const count = _usuariosData.filter(function (u) {
    return Number(u.id_rol) === 2 && u.activo === 'SI' && Number(u.id) !== Number(_editingUserId) &&
      String(u.seller_id || '').toUpperCase() === sellerId.toUpperCase();
  }).length;
  hintEl.textContent = count > 0
    ? 'Este seller ya tiene ' + count + ' cuenta' + (count !== 1 ? 's' : '') + ' activa' + (count !== 1 ? 's' : '') + '.'
    : 'Este seller todavía no tiene ninguna cuenta activa.';
}

function _togglePasswordVisibility() {
  const inp = document.getElementById('uf-password');
  const btn = document.getElementById('uf-pw-toggle');
  if (!inp || !btn) return;
  const showing = inp.type === 'text';
  inp.type = showing ? 'password' : 'text';
  btn.textContent = showing ? 'Ver' : 'Ocultar';
}

function _generatePassword() {
  const inp = document.getElementById('uf-password');
  if (!inp) return;
  // Sin caracteres ambiguos (0/O, 1/l/I) — el admin suele tener que dictarla o pasarla a mano.
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const bytes = new Uint32Array(12);
  crypto.getRandomValues(bytes);
  let pw = '';
  for (let i = 0; i < bytes.length; i++) pw += chars[bytes[i] % chars.length];
  inp.value = pw;
  inp.type = 'text';
  const btn = document.getElementById('uf-pw-toggle');
  if (btn) btn.textContent = 'Ocultar';
  _clearFieldError('uf-password');
}

function _setFieldError(id, msg) {
  const el  = document.getElementById(id);
  const err = document.getElementById(id + '-err');
  if (el)  el.classList.toggle('error', !!msg);
  if (err) { err.textContent = msg || ''; err.hidden = !msg; }
}

function _clearFieldError(id) { _setFieldError(id, ''); }

function _openUserForm(usuario) {
  _editingUserId = usuario ? Number(usuario.id) : null;
  const modal  = document.getElementById('user-modal');
  const title  = document.getElementById('user-form-title');
  const pwHint = document.getElementById('uf-pw-hint');
  const pwReq  = document.getElementById('uf-pw-req');
  const errEl  = document.getElementById('uf-error');

  if (errEl) errEl.hidden = true;
  ['uf-nombre', 'uf-email', 'uf-password', 'uf-sellerid'].forEach(_clearFieldError);

  const pwEl = document.getElementById('uf-password');
  if (pwEl) pwEl.type = 'password';
  const pwToggle = document.getElementById('uf-pw-toggle');
  if (pwToggle) pwToggle.textContent = 'Ver';

  const esSeller = !!(usuario && usuario.seller_id);
  _setTipoCuenta(esSeller ? 'seller' : 'interno');
  _populateSellerSelect(usuario && usuario.seller_id);
  _updateSellerAccountsHint();

  if (usuario) {
    if (title)  title.textContent = 'Editar usuario';
    document.getElementById('uf-nombre').value   = usuario.nombre   || '';
    document.getElementById('uf-email').value    = usuario.email    || '';
    document.getElementById('uf-password').value = '';
    _populateRolSelect(usuario.id_rol);
    if (pwHint) pwHint.textContent = 'Dejar vacío para no cambiar la contraseña';
    if (pwReq)  pwReq.style.display = 'none';
  } else {
    if (title)  title.textContent = 'Nuevo usuario';
    document.getElementById('uf-nombre').value   = '';
    document.getElementById('uf-email').value    = '';
    document.getElementById('uf-password').value = '';
    _populateRolSelect();
    if (pwHint) pwHint.textContent = '';
    if (pwReq)  pwReq.style.display = '';
  }

  if (modal) modal.style.display = 'flex';
  const nameEl = document.getElementById('uf-nombre');
  if (nameEl) nameEl.focus();
}

function _closeUserForm() {
  const modal = document.getElementById('user-modal');
  if (modal) modal.style.display = 'none';
  _editingUserId = null;
}

const _EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function _saveUser() {
  const nombre   = (document.getElementById('uf-nombre')   || {}).value || '';
  const email    = (document.getElementById('uf-email')    || {}).value || '';
  const password = (document.getElementById('uf-password') || {}).value || '';
  const errEl    = document.getElementById('uf-error');
  if (errEl) errEl.hidden = true;

  const esSeller = document.getElementById('uf-sellerid-wrap') && !document.getElementById('uf-sellerid-wrap').hidden;
  const sellerId = esSeller ? (document.getElementById('uf-sellerid').value || '').trim() : '';
  const id_rol   = esSeller ? 2 : Number((document.getElementById('uf-rol') || {}).value || 1);

  ['uf-nombre', 'uf-email', 'uf-password', 'uf-sellerid'].forEach(_clearFieldError);
  let firstInvalid = null;
  const invalid = function (id, msg) { _setFieldError(id, msg); firstInvalid = firstInvalid || id; };

  if (!nombre.trim()) invalid('uf-nombre', 'El nombre es obligatorio.');
  if (!email.trim()) invalid('uf-email', 'El email es obligatorio.');
  else if (!_EMAIL_RE.test(email.trim())) invalid('uf-email', 'El email no tiene un formato válido.');
  if (esSeller && !sellerId) invalid('uf-sellerid', 'Elegí un seller para la cuenta.');
  if (!_editingUserId && !password.trim()) invalid('uf-password', 'La contraseña es requerida para nuevos usuarios.');
  else if (password.trim() && password.trim().length < 6) invalid('uf-password', 'La contraseña debe tener al menos 6 caracteres.');

  if (firstInvalid) {
    const el = document.getElementById(firstInvalid);
    if (el) el.focus();
    return;
  }

  const btn = document.getElementById('uf-save-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Guardando…'; }

  try {
    if (_editingUserId) {
      const data = { nombre: nombre.trim(), email: email.toLowerCase().trim(), id_rol, seller_id: sellerId };
      if (password) data.password_hash = await sha256(password);
      await _apiAuthPost({ action: 'updateUsuario', id: _editingUserId, data });
    } else {
      await _apiAuthPost({
        action: 'createUsuario',
        data: { nombre: nombre.trim(), email: email.toLowerCase().trim(), password_hash: await sha256(password), id_rol, seller_id: sellerId },
      });
    }
    _closeUserForm();
    _loadUsuarios();
  } catch (err) {
    if (errEl) { errEl.textContent = err.message || 'Error al guardar'; errEl.hidden = false; }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Guardar'; }
  }
}

async function _loadUsuarios() {
  const wrap = document.getElementById('usuarios-table-wrap');
  if (!wrap) return;

  try {
    const res = await _apiAuthPost({ action: 'getUsuarios' });
    _usuariosData = res.data || [];
  } catch (err) {
    wrap.innerHTML = '<div class="status-bar error">Error: ' + (err.message || 'No se pudo cargar') + '</div>';
    return;
  }

  _populateSellerFilter();
  _renderUsuariosTable();
}

function _renderUsuariosTable() {
  const wrap = document.getElementById('usuarios-table-wrap');
  if (!wrap) return;

  const q      = _normalizeText((document.getElementById('uf-search') || {}).value);
  const seller = (document.getElementById('uf-seller-filter') || {}).value || '';

  const usuarios = _usuariosData.filter(function (u) {
    if (seller && String(u.seller_id || '').toUpperCase() !== seller.toUpperCase()) return false;
    if (!q) return true;
    const haystack = _normalizeText(u.nombre + ' ' + u.email + ' ' + u.seller_id + ' ' + _sellerNombre(u.seller_id));
    return haystack.indexOf(q) !== -1;
  });

  const countEl = document.getElementById('usuarios-count');
  if (countEl) {
    countEl.textContent = usuarios.length + ' de ' + _usuariosData.length + ' usuario' + (_usuariosData.length !== 1 ? 's' : '');
  }

  if (!usuarios.length) {
    wrap.innerHTML = '<div class="status-bar">Ningún usuario coincide con el filtro.</div>';
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Seller</th>
            <th>Estado</th>
            <th style="text-align:right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${usuarios.map(function (u) {
            const rolLabel = _rolNombre(u.id_rol);
            const activo   = u.activo === 'SI';
            const uJson    = JSON.stringify(u).replace(/"/g, '&quot;');
            return `<tr>
              <td>${_escHtml(u.nombre || '—')}</td>
              <td style="font-family:var(--mono);font-size:11.5px;color:var(--muted)">${_escHtml(u.email || '—')}</td>
              <td>${_escHtml(rolLabel)}</td>
              <td>${u.seller_id ? _escHtml(_sellerNombre(u.seller_id)) + ' <span style="color:var(--muted);font-family:var(--mono);font-size:11px">(' + _escHtml(u.seller_id) + ')</span>' : '<span class="text-muted">—</span>'}</td>
              <td><span class="status-pill ${activo ? 'active' : 'inactive'}">${activo ? 'Activo' : 'Inactivo'}</span></td>
              <td>
                <div class="row-actions">
                  <button class="button secondary" onclick="_openUserForm(${uJson})">Editar</button>
                  <button class="button ${activo ? 'danger' : 'secondary'}" onclick="_toggleUserActivo(${u.id},'${activo ? 'NO' : 'SI'}')">${activo ? 'Desactivar' : 'Activar'}</button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function _toggleUserActivo(id, nuevoActivo) {
  try {
    await _apiAuthPost({ action: 'updateUsuario', id: id, data: { activo: nuevoActivo } });
    _loadUsuarios();
  } catch (err) {
    alert(err.message || 'Error al actualizar el usuario');
  }
}

function _renderRolesTable() {
  const wrap = document.getElementById('roles-table-wrap');
  if (!wrap) return;

  if (!_rolesData.length) {
    wrap.innerHTML = '<div class="status-bar">No hay roles configurados.</div>';
    return;
  }

  wrap.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Rol</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th style="text-align:right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${_rolesData.map(function (r) {
            const sistema = String(r.es_sistema) === 'SI';
            const activo  = String(r.activo) !== 'NO';
            const rJson   = JSON.stringify(r).replace(/"/g, '&quot;');
            return `<tr>
              <td style="font-weight:500">${_escHtml(r.nombre || '—')}</td>
              <td><span class="role-pill ${sistema ? 'sistema' : 'personalizado'}">${sistema ? 'Sistema' : 'Personalizado'}</span></td>
              <td><span class="status-pill ${activo ? 'active' : 'inactive'}">${activo ? 'Activo' : 'Inactivo'}</span></td>
              <td>
                <div class="row-actions">
                  <button class="button secondary" onclick="_selectRolForPermisos(${r.id})">Permisos</button>
                  ${sistema ? '' :
                    `<button class="button secondary" onclick="_openRolForm(${rJson})">Editar</button>
                     <button class="button ${activo ? 'danger' : 'secondary'}" onclick="_toggleRolActivo(${r.id},'${activo ? 'NO' : 'SI'}')">${activo ? 'Desactivar' : 'Activar'}</button>`}
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

let _editingRolId = null;

function _openRolForm(rol) {
  _editingRolId = rol ? Number(rol.id) : null;
  const modal = document.getElementById('rol-modal');
  const title = document.getElementById('rol-form-title');
  const err   = document.getElementById('rf-error');
  const inp   = document.getElementById('rf-nombre');
  if (err) err.hidden = true;
  if (title) title.textContent = rol ? 'Editar rol' : 'Nuevo rol';
  if (inp) inp.value = rol ? (rol.nombre || '') : '';
  if (modal) modal.style.display = 'flex';
  if (inp) inp.focus();
}

function _closeRolForm() {
  const modal = document.getElementById('rol-modal');
  if (modal) modal.style.display = 'none';
  _editingRolId = null;
}

async function _saveRol() {
  const nombre = (document.getElementById('rf-nombre') || {}).value || '';
  const err    = document.getElementById('rf-error');
  if (!nombre.trim()) {
    if (err) { err.textContent = 'El nombre del rol es requerido.'; err.hidden = false; }
    return;
  }
  try {
    if (_editingRolId) {
      await _apiAuthPost({ action: 'updateRol', id: _editingRolId, nombre: nombre.trim() });
    } else {
      await _apiAuthPost({ action: 'createRol', nombre: nombre.trim() });
    }
    _closeRolForm();
    _loadRoles();
  } catch (e) {
    if (err) { err.textContent = e.message || 'Error al guardar'; err.hidden = false; }
  }
}

async function _toggleRolActivo(id, nuevoActivo) {
  try {
    await _apiAuthPost({ action: 'updateRol', id: id, activo: nuevoActivo });
    _loadRoles();
  } catch (e) {
    alert(e.message || 'Error al actualizar el rol');
  }
}

let _permisosData = [];

function _selectRolForPermisos(idRol) {
  const panelWrap = document.getElementById('permisos-panel-wrap');
  if (panelWrap) panelWrap.hidden = false;
  _renderPermisosMatrix(idRol);
  const wrap = document.getElementById('permisos-matrix-wrap');
  if (wrap && wrap.scrollIntoView) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function _renderPermisosMatrix(idRol) {
  const wrap = document.getElementById('permisos-matrix-wrap');
  if (!wrap) return;
  wrap.innerHTML = '<div class="status-bar">Cargando permisos…</div>';

  try {
    const res = await _apiAuthPost({ action: 'getPermisos' });
    _permisosData = res.data || [];
  } catch (e) {
    wrap.innerHTML = '<div class="status-bar error">Error: ' + (e.message || 'No se pudo cargar') + '</div>';
    return;
  }

  const rol     = _rolesData.find(function (r) { return Number(r.id) === Number(idRol); });
  const sistema = rol && String(rol.es_sistema) === 'SI';

  const idx = {};
  _permisosData.forEach(function (p) { if (Number(p.id_rol) === Number(idRol)) idx[p.modulo] = p; });

  const MODULOS = (window.MP_RBAC_MODULOS || []);

  function estadoDe(mod) {
    if (sistema) return 'editar';
    const p = idx[mod] || {};
    if (String(p.puede_ver) !== 'SI') return 'oculto';
    return String(p.puede_editar) === 'SI' ? 'editar' : 'ver';
  }

  function radio(mod, val, est) {
    const dis = sistema ? 'disabled' : '';
    return '<input type="radio" name="perm-' + mod + '" value="' + val + '"' + (est === val ? ' checked' : '') + ' ' + dis + '>';
  }

  if (!MODULOS.length) {
    wrap.innerHTML = `
      <div class="status-bar">
        Permisos — ${_escHtml(rol ? rol.nombre : '')}: todavía no hay módulos definidos para asignar permisos granulares.
        ${sistema ? 'El Administrador tiene acceso total.' : ''}
      </div>`;
    return;
  }

  wrap.innerHTML = `
    <div class="panel-toolbar" style="margin-bottom:6px">
      <h2>Permisos — ${_escHtml(rol ? rol.nombre : '')}</h2>
      ${sistema ? '' : `<button class="button" onclick="_savePermisosMatrix(${idRol})">Guardar permisos</button>`}
    </div>
    <p class="text-muted" style="margin:0 0 14px">
      ${sistema
        ? 'El <strong>Administrador</strong> tiene acceso total a todos los módulos y no es configurable.'
        : 'Definí el acceso de este rol a cada módulo.'}
    </p>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Módulo</th>
            <th style="text-align:center;width:110px">Oculto</th>
            <th style="text-align:center;width:110px">Solo ver</th>
            <th style="text-align:center;width:120px">Ver + editar</th>
          </tr>
        </thead>
        <tbody>
          ${MODULOS.map(function (mod) {
            const est = estadoDe(mod.key);
            return `<tr>
              <td style="font-weight:500">${_escHtml(mod.label)}</td>
              <td style="text-align:center">${radio(mod.key, 'oculto', est)}</td>
              <td style="text-align:center">${radio(mod.key, 'ver', est)}</td>
              <td style="text-align:center">${radio(mod.key, 'editar', est)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    ${sistema ? '' : `<div id="permisos-save-status" class="text-muted" style="font-size:12px;margin-top:10px"></div>`}
  `;
}

async function _savePermisosMatrix(idRol) {
  const statusEl = document.getElementById('permisos-save-status');
  if (statusEl) statusEl.textContent = 'Guardando…';

  const MAP = {
    oculto: { ver: 'NO', editar: 'NO' },
    ver:    { ver: 'SI', editar: 'NO' },
    editar: { ver: 'SI', editar: 'SI' },
  };
  const MODULOS = (window.MP_RBAC_MODULOS || []);

  try {
    const promises = [];
    MODULOS.forEach(function (mod) {
      const sel = document.querySelector('input[name="perm-' + mod.key + '"]:checked');
      const est = sel ? sel.value : 'oculto';
      const v   = MAP[est] || MAP.oculto;
      promises.push(_apiAuthPost({
        action:       'updatePermisos',
        id_rol:       idRol,
        modulo:       mod.key,
        puede_ver:    v.ver,
        puede_editar: v.editar,
      }));
    });
    await Promise.all(promises);
    if (statusEl) statusEl.textContent = '✓ Guardado';
    setTimeout(function () { if (statusEl) statusEl.textContent = ''; }, 3000);
  } catch (err) {
    if (statusEl) statusEl.textContent = 'Error: ' + (err.message || 'No se pudo guardar');
  }
}

/* ─── SHA-256 ─────────────────────────────────────────────── */

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ─── API HELPER (RBAC) ───────────────────────────────────── */

async function _apiAuthPost(body) {
  const url = window.MP_CONFIG && window.MP_CONFIG.APPS_SCRIPT_URL;
  if (!url) throw new Error('No hay URL de API configurada');

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(Object.assign({ session_token: SESSION.token }, body)),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  if (!json.ok) {
    if (json.code === 401) {
      logoutUser();
      throw new Error('Sesión expirada. Ingresá de nuevo.');
    }
    throw new Error(json.error || 'Error desconocido');
  }
  return json;
}
