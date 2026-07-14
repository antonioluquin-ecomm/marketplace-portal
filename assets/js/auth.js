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

  const topbarActions = document.querySelector(
    '.portal-topbar .tb-right, .portal-topbar .top-actions, .portal-topbar .topbar-right, .topbar .tb-right, .topbar .top-actions, .topbar .topbar-right'
  );
  if (!topbarActions) return;

  let btn = document.getElementById('sidebarCollapseBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'sidebarCollapseBtn';
    btn.className = 'sidebar-collapse-toggle';
    btn.type = 'button';
    topbarActions.insertBefore(btn, topbarActions.firstChild);
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
      (SESSION.isAdmin() ? '<a class="sb-user-dropdown-item" href="internal/administracion/configuracion.html">Configuración</a><div class="sb-user-dropdown-sep"></div>' : '') +
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

function renderUserManagementSection() {
  if (!SESSION.isAdmin()) return;
  const host = document.getElementById('cfg-tabs-host');
  if (!host || document.getElementById('user-mgmt-section')) return;

  const section = document.createElement('div');
  section.id = 'user-mgmt-section';
  section.innerHTML = `
    <div class="cfg-tabs" style="display:flex;gap:8px;margin-bottom:14px">
      <button class="cfg-tab active" id="ctab-usuarios" onclick="_showCfgTab('usuarios')">Usuarios</button>
      <button class="cfg-tab" id="ctab-roles" onclick="_showCfgTab('roles')">Roles y permisos</button>
      <button class="cfg-tab" id="ctab-integraciones" onclick="_showCfgTab('integraciones')">Integraciones</button>
    </div>

    <div id="ctab-content-usuarios">
      <div style="display:flex;align-items:center;margin-bottom:10px">
        <span id="usuarios-count" style="font-size:12px;color:var(--muted)">Cargando…</span>
        <div style="flex:1"></div>
        <button class="btn" onclick="_openUserForm()">+ Nuevo usuario</button>
      </div>

      <div id="user-form-inline" hidden
           style="background:var(--sidebar-bg);border:1px solid var(--line);border-radius:var(--radius);padding:16px;margin-bottom:14px">
        <div id="user-form-title" style="font-weight:700;margin-bottom:12px">Nuevo usuario</div>
        <div style="margin-bottom:10px">
          <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px">Tipo de cuenta</label>
          <div style="display:flex;gap:6px">
            <button type="button" id="uf-tipo-interno" class="cfg-tab active" onclick="_setTipoCuenta('interno')">Interno</button>
            <button type="button" id="uf-tipo-seller" class="cfg-tab" onclick="_setTipoCuenta('seller')">Seller</button>
          </div>
        </div>
        <div style="display:flex;gap:12px;margin-bottom:10px">
          <div style="flex:1">
            <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px">Nombre *</label>
            <input id="uf-nombre" placeholder="Nombre completo" style="width:100%;padding:8px 10px;font-size:13px;border:1px solid var(--line);border-radius:var(--radius-sm);box-sizing:border-box">
          </div>
          <div style="flex:1">
            <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px">Email *</label>
            <input id="uf-email" type="email" placeholder="email@empresa.com" style="width:100%;padding:8px 10px;font-size:13px;border:1px solid var(--line);border-radius:var(--radius-sm);box-sizing:border-box">
          </div>
        </div>
        <div style="display:flex;gap:12px;margin-bottom:10px">
          <div style="flex:1">
            <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px">Contraseña <span id="uf-pw-req">*</span></label>
            <input id="uf-password" type="password" placeholder="Mínimo 6 caracteres" autocomplete="new-password" style="width:100%;padding:8px 10px;font-size:13px;border:1px solid var(--line);border-radius:var(--radius-sm);box-sizing:border-box">
            <div id="uf-pw-hint" style="font-size:11px;color:var(--muted);margin-top:4px"></div>
          </div>
          <div style="flex:1" id="uf-rol-wrap">
            <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px">Rol *</label>
            <select id="uf-rol" style="width:100%;padding:8px 10px;font-size:13px;border:1px solid var(--line);border-radius:var(--radius-sm);box-sizing:border-box"></select>
          </div>
          <div style="flex:1" id="uf-sellerid-wrap" hidden>
            <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px">Seller ID *</label>
            <input id="uf-sellerid" placeholder="SPT-XXX" style="width:100%;padding:8px 10px;font-size:13px;border:1px solid var(--line);border-radius:var(--radius-sm);box-sizing:border-box">
            <div style="font-size:11px;color:var(--muted);margin-top:4px">Debe coincidir con el seller_id de la hoja sellers</div>
          </div>
        </div>
        <div id="uf-error" style="color:var(--danger);font-size:12px;margin-bottom:10px" hidden></div>
        <div style="display:flex;gap:8px">
          <button class="btn" onclick="_saveUser()">Guardar</button>
          <button onclick="_closeUserForm()" style="padding:8px 14px;font-size:13px;border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--card);cursor:pointer">Cancelar</button>
        </div>
      </div>

      <div id="usuarios-table-wrap"><div style="font-size:12px;color:var(--muted)">Cargando usuarios…</div></div>
    </div>

    <div id="ctab-content-roles" hidden>
      <div style="display:flex;align-items:center;margin-bottom:10px">
        <span style="font-size:12px;color:var(--muted)">Roles del sistema</span>
        <div style="flex:1"></div>
        <button class="btn" onclick="_openRolForm()">+ Nuevo rol</button>
      </div>

      <div id="rol-form-inline" hidden
           style="background:var(--sidebar-bg);border:1px solid var(--line);border-radius:var(--radius);padding:16px;margin-bottom:14px">
        <div id="rol-form-title" style="font-weight:700;margin-bottom:12px">Nuevo rol</div>
        <label style="display:block;font-size:12px;font-weight:500;margin-bottom:5px">Nombre del rol *</label>
        <input id="rf-nombre" placeholder="Ej: Backlog, Gestión Comercial" style="width:100%;padding:8px 10px;font-size:13px;border:1px solid var(--line);border-radius:var(--radius-sm);box-sizing:border-box;margin-bottom:10px">
        <div id="rf-error" style="color:var(--danger);font-size:12px;margin-bottom:10px" hidden></div>
        <div style="display:flex;gap:8px">
          <button class="btn" onclick="_saveRol()">Guardar</button>
          <button onclick="_closeRolForm()" style="padding:8px 14px;font-size:13px;border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--card);cursor:pointer">Cancelar</button>
        </div>
      </div>

      <div id="roles-table-wrap"><div style="font-size:12px;color:var(--muted)">Cargando roles…</div></div>
      <div id="permisos-matrix-wrap" style="margin-top:18px"></div>
    </div>

    <div id="ctab-content-integraciones" hidden>
      <div class="cfg-section">
        <div class="cfg-title">Conexión</div>
        <div class="cfg-row">
          <span class="cfg-label">Apps Script URL</span>
          <span class="cfg-val" id="cfg-apps-script-url">—</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-top:8px">
          <button class="btn" onclick="_testConexionApi()">Probar conexión</button>
          <span id="cfg-conexion-status" style="font-size:12px;color:var(--muted)"></span>
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
  `;

  host.appendChild(section);
  const urlEl = document.getElementById('cfg-apps-script-url');
  if (urlEl) urlEl.textContent = (window.MP_CONFIG && window.MP_CONFIG.APPS_SCRIPT_URL) || '—';
  _loadRoles().then(_loadUsuarios);
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
    if (content) content.hidden = (t !== tab);
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
}

function _openUserForm(usuario) {
  _editingUserId = usuario ? Number(usuario.id) : null;
  const form   = document.getElementById('user-form-inline');
  const title  = document.getElementById('user-form-title');
  const pwHint = document.getElementById('uf-pw-hint');
  const pwReq  = document.getElementById('uf-pw-req');
  const errEl  = document.getElementById('uf-error');

  if (errEl) errEl.hidden = true;

  const esSeller = !!(usuario && usuario.seller_id);
  _setTipoCuenta(esSeller ? 'seller' : 'interno');
  document.getElementById('uf-sellerid').value = (usuario && usuario.seller_id) || '';

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

  if (form) form.hidden = false;
  const nameEl = document.getElementById('uf-nombre');
  if (nameEl) nameEl.focus();
}

function _closeUserForm() {
  const form = document.getElementById('user-form-inline');
  if (form) form.hidden = true;
  _editingUserId = null;
}

async function _saveUser() {
  const nombre   = (document.getElementById('uf-nombre')   || {}).value || '';
  const email    = (document.getElementById('uf-email')    || {}).value || '';
  const password = (document.getElementById('uf-password') || {}).value || '';
  const errEl    = document.getElementById('uf-error');

  const esSeller = document.getElementById('uf-sellerid-wrap') && !document.getElementById('uf-sellerid-wrap').hidden;
  const sellerId = esSeller ? (document.getElementById('uf-sellerid').value || '').trim() : '';
  const id_rol   = esSeller ? 2 : Number((document.getElementById('uf-rol') || {}).value || 1);

  if (!nombre.trim() || !email.trim()) {
    if (errEl) { errEl.textContent = 'Nombre y email son requeridos.'; errEl.hidden = false; }
    return;
  }
  if (esSeller && !sellerId) {
    if (errEl) { errEl.textContent = 'El Seller ID es requerido para cuentas de tipo Seller.'; errEl.hidden = false; }
    return;
  }
  if (!_editingUserId && !password.trim()) {
    if (errEl) { errEl.textContent = 'La contraseña es requerida para nuevos usuarios.'; errEl.hidden = false; }
    return;
  }
  if (password.trim() && password.trim().length < 6) {
    if (errEl) { errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.'; errEl.hidden = false; }
    return;
  }

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
  }
}

async function _loadUsuarios() {
  const wrap = document.getElementById('usuarios-table-wrap');
  if (!wrap) return;

  try {
    const res      = await _apiAuthPost({ action: 'getUsuarios' });
    const usuarios = res.data || [];

    const countEl = document.getElementById('usuarios-count');
    if (countEl) countEl.textContent = usuarios.length + ' usuario' + (usuarios.length !== 1 ? 's' : '');

    if (!usuarios.length) {
      wrap.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:8px 0">No hay usuarios configurados.</div>';
      return;
    }

    wrap.innerHTML = `
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--sidebar-bg);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)">
            <th style="padding:7px 10px;text-align:left;border-bottom:1px solid var(--line)">Nombre</th>
            <th style="padding:7px 10px;text-align:left;border-bottom:1px solid var(--line)">Email</th>
            <th style="padding:7px 10px;text-align:left;border-bottom:1px solid var(--line)">Rol</th>
            <th style="padding:7px 10px;text-align:center;border-bottom:1px solid var(--line)">Estado</th>
            <th style="padding:7px 10px;text-align:right;border-bottom:1px solid var(--line)">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${usuarios.map(function (u) {
            const rolLabel = _rolNombre(u.id_rol);
            const activo   = u.activo === 'SI';
            const uJson    = JSON.stringify(u).replace(/"/g, '&quot;');
            return `<tr style="border-bottom:1px solid var(--line)">
              <td style="padding:7px 10px;color:var(--text)">${_escHtml(u.nombre || '—')}</td>
              <td style="padding:7px 10px;color:var(--muted);font-family:var(--mono);font-size:11px">${_escHtml(u.email || '—')}</td>
              <td style="padding:7px 10px">${_escHtml(rolLabel)}${u.seller_id ? ' <span style="color:var(--muted);font-family:var(--mono);font-size:11px">(' + _escHtml(u.seller_id) + ')</span>' : ''}</td>
              <td style="padding:7px 10px;text-align:center">${activo ? 'Activo' : 'Inactivo'}</td>
              <td style="padding:7px 10px;text-align:right;white-space:nowrap">
                <button style="margin-right:4px;font-size:11px;padding:4px 8px;border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--card);cursor:pointer"
                        onclick="_openUserForm(${uJson})">Editar</button>
                <button style="font-size:11px;padding:4px 8px;border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--card);cursor:pointer"
                        onclick="_toggleUserActivo(${u.id},'${activo ? 'NO' : 'SI'}')">${activo ? 'Desactivar' : 'Activar'}</button>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    wrap.innerHTML = '<div style="color:var(--danger);font-size:12px;padding:8px 0">Error: ' + (err.message || 'No se pudo cargar') + '</div>';
  }
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
    wrap.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:8px 0">No hay roles configurados.</div>';
    return;
  }

  wrap.innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:12px">
      <thead>
        <tr style="background:var(--sidebar-bg);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)">
          <th style="padding:7px 10px;text-align:left;border-bottom:1px solid var(--line)">Rol</th>
          <th style="padding:7px 10px;text-align:left;border-bottom:1px solid var(--line)">Tipo</th>
          <th style="padding:7px 10px;text-align:center;border-bottom:1px solid var(--line)">Estado</th>
          <th style="padding:7px 10px;text-align:right;border-bottom:1px solid var(--line)">Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${_rolesData.map(function (r) {
          const sistema = String(r.es_sistema) === 'SI';
          const activo  = String(r.activo) !== 'NO';
          const rJson   = JSON.stringify(r).replace(/"/g, '&quot;');
          return `<tr style="border-bottom:1px solid var(--line)">
            <td style="padding:7px 10px;color:var(--text);font-weight:500">${_escHtml(r.nombre || '—')}</td>
            <td style="padding:7px 10px">${sistema ? 'Sistema' : 'Personalizado'}</td>
            <td style="padding:7px 10px;text-align:center">${activo ? 'Activo' : 'Inactivo'}</td>
            <td style="padding:7px 10px;text-align:right;white-space:nowrap">
              <button style="margin-right:4px;font-size:11px;padding:4px 8px;border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--card);cursor:pointer" onclick="_selectRolForPermisos(${r.id})">Permisos</button>
              ${sistema ? '' :
                `<button style="margin-right:4px;font-size:11px;padding:4px 8px;border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--card);cursor:pointer" onclick="_openRolForm(${rJson})">Editar</button>
                 <button style="font-size:11px;padding:4px 8px;border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--card);cursor:pointer" onclick="_toggleRolActivo(${r.id},'${activo ? 'NO' : 'SI'}')">${activo ? 'Desactivar' : 'Activar'}</button>`}
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;
}

let _editingRolId = null;

function _openRolForm(rol) {
  _editingRolId = rol ? Number(rol.id) : null;
  const form  = document.getElementById('rol-form-inline');
  const title = document.getElementById('rol-form-title');
  const err   = document.getElementById('rf-error');
  const inp   = document.getElementById('rf-nombre');
  if (err) err.hidden = true;
  if (title) title.textContent = rol ? 'Editar rol' : 'Nuevo rol';
  if (inp) inp.value = rol ? (rol.nombre || '') : '';
  if (form) form.hidden = false;
  if (inp) inp.focus();
}

function _closeRolForm() {
  const form = document.getElementById('rol-form-inline');
  if (form) form.hidden = true;
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
  _renderPermisosMatrix(idRol);
  const wrap = document.getElementById('permisos-matrix-wrap');
  if (wrap && wrap.scrollIntoView) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function _renderPermisosMatrix(idRol) {
  const wrap = document.getElementById('permisos-matrix-wrap');
  if (!wrap) return;
  wrap.innerHTML = '<div style="font-size:12px;color:var(--muted)">Cargando permisos…</div>';

  try {
    const res = await _apiAuthPost({ action: 'getPermisos' });
    _permisosData = res.data || [];
  } catch (e) {
    wrap.innerHTML = '<div style="color:var(--danger);font-size:12px;padding:8px 0">Error: ' + (e.message || 'No se pudo cargar') + '</div>';
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
      <div style="font-size:12px;color:var(--muted);padding:8px 0">
        Permisos — ${_escHtml(rol ? rol.nombre : '')}: todavía no hay módulos definidos para asignar permisos granulares.
        ${sistema ? 'El Administrador tiene acceso total.' : ''}
      </div>`;
    return;
  }

  wrap.innerHTML = `
    <div>
      <div style="font-weight:700;margin-bottom:6px">Permisos — ${_escHtml(rol ? rol.nombre : '')}</div>
      ${sistema
        ? '<p style="font-size:12px;color:var(--muted);margin:4px 0 12px">El <strong>Administrador</strong> tiene acceso total a todos los módulos y no es configurable.</p>'
        : '<p style="font-size:12px;color:var(--muted);margin:4px 0 12px">Definí el acceso de este rol a cada módulo.</p>'}
      <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead>
          <tr style="background:var(--sidebar-bg);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)">
            <th style="padding:7px 10px;text-align:left;border-bottom:1px solid var(--line)">Módulo</th>
            <th style="padding:7px 10px;text-align:center;border-bottom:1px solid var(--line)">Oculto</th>
            <th style="padding:7px 10px;text-align:center;border-bottom:1px solid var(--line)">Solo ver</th>
            <th style="padding:7px 10px;text-align:center;border-bottom:1px solid var(--line)">Ver + editar</th>
          </tr>
        </thead>
        <tbody>
          ${MODULOS.map(function (mod) {
            const est = estadoDe(mod.key);
            return `<tr style="border-bottom:1px solid var(--line)">
              <td style="padding:7px 10px;color:var(--text);font-weight:500">${_escHtml(mod.label)}</td>
              <td style="padding:7px 10px;text-align:center">${radio(mod.key, 'oculto', est)}</td>
              <td style="padding:7px 10px;text-align:center">${radio(mod.key, 'ver', est)}</td>
              <td style="padding:7px 10px;text-align:center">${radio(mod.key, 'editar', est)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
      ${sistema ? '' : `
        <div style="display:flex;gap:8px;align-items:center;margin-top:12px">
          <button class="btn" onclick="_savePermisosMatrix(${idRol})">Guardar permisos</button>
          <span id="permisos-save-status" style="font-size:12px;color:var(--muted)"></span>
        </div>`}
    </div>
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
