// ════════════════════════════════════════════════════════════
//  IMPORTS — Firebase SDK (loaded from Google's CDN)
// ════════════════════════════════════════════════════════════
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';
 
 
// ════════════════════════════════════════════════════════════
//  🔥 FIREBASE CONFIG
// ════════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyB4_FzQ0yVuW9x1C9GZJXAdkS9QFn_Rjps",
  authDomain: "kitchen-tracker-3d183.firebaseapp.com",
  projectId: "kitchen-tracker-3d183",
  storageBucket: "kitchen-tracker-3d183.firebasestorage.app",
  messagingSenderId: "778501989830",
  appId: "1:778501989830:web:bde0367715a4a9c0f7fec7",
  measurementId: "G-1PTX6QXVGL"
};
// ════════════════════════════════════════════════════════════
 
 
// ─── Firebase init ───────────────────────────────────────────
const DEMO_MODE = firebaseConfig.apiKey === "YOUR_API_KEY";
 
let app, auth, db, storage;
if (!DEMO_MODE) {
  app     = initializeApp(firebaseConfig);
  auth    = getAuth(app);
  db      = getFirestore(app);
  storage = getStorage(app);
}
 
 
// ════════════════════════════════════════════════════════════
//  TRANSLATIONS  (i18n)
// ════════════════════════════════════════════════════════════
const T = {
  en: {
    signin: 'Sign In',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    household_name: 'Household Name',
    app_sub: 'Track your fridge & pantry. Sign in to sync across all your devices.',
    fridge: 'Fridge',
    pantry: 'Pantry',
    alerts: 'Alerts',
    settings: 'Settings',
    add_item_fridge: 'Add item to Fridge',
    add_item_pantry: 'Add item to Pantry',
    total_items: 'Total items',
    low_stock: 'Low stock',
    photo: 'Photo',
    photo_tap: 'Tap to take or upload a photo',
    item_name: 'Item Name',
    category: 'Category',
    quantity: 'Quantity',
    low_stock_alert: 'Low Stock Alert',
    notify_low: 'Notify when running low',
    alert_desc: 'Alert when quantity drops to threshold',
    alert_below: 'Alert when below',
    units: 'units',
    expiry: 'Expiry Date (optional)',
    save_item: 'Save Item',
    edit_item: 'Edit Item',
    unit_placeholder: 'unit (bags, oz, lbs…)',
    cat_dairy: 'Dairy',
    cat_produce: 'Produce',
    cat_meat: 'Meat & Seafood',
    cat_beverages: 'Beverages',
    cat_grains: 'Grains & Pasta',
    cat_canned: 'Canned & Jarred',
    cat_snacks: 'Snacks',
    cat_condiments: 'Condiments',
    cat_other: 'Other',
    all: 'All',
    edit: 'Edit',
    add_more: '+ Add',
    use: '− Use',
    remove: 'Remove',
    running_low: 'Running Low',
    well_stocked: 'Well Stocked',
    restock: 'Restock +5',
    left: 'left',
    threshold: 'threshold',
    no_alerts: 'No alerts set up',
    no_alerts_sub: 'Turn on "Notify when running low" when adding items to get alerts here.',
    empty_fridge: 'Your fridge is empty',
    empty_pantry: 'Your pantry is empty',
    empty_sub: 'Tap "Add item" above to start tracking your groceries.',
    loading: 'Loading…',
    language: 'Language',
    language_sub: 'Choose your preferred language',
    account: 'Account',
    household: 'Household',
    sign_out: 'Sign Out',
    confirm_delete: 'Remove this item from your inventory?',
    no_cat: 'No items in this category.',
    header_manager: 'Fridge & Pantry Manager',
    err_name: 'Please enter an item name.',
    err_email: 'Please enter your email.',
    err_pass: 'Password must be at least 6 characters.',
    err_household: 'Please enter your household name.',
  },
  es: {
    signin: 'Iniciar sesión',
    signup: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    household_name: 'Nombre del hogar',
    app_sub: 'Rastrea tu nevera y despensa. Inicia sesión para sincronizar en todos tus dispositivos.',
    fridge: 'Nevera',
    pantry: 'Despensa',
    alerts: 'Alertas',
    settings: 'Configuración',
    add_item_fridge: 'Agregar a la Nevera',
    add_item_pantry: 'Agregar a la Despensa',
    total_items: 'Total artículos',
    low_stock: 'Stock bajo',
    photo: 'Foto',
    photo_tap: 'Toca para tomar o subir una foto',
    item_name: 'Nombre del artículo',
    category: 'Categoría',
    quantity: 'Cantidad',
    low_stock_alert: 'Alerta de stock bajo',
    notify_low: 'Notificar cuando quede poco',
    alert_desc: 'Alertar cuando la cantidad baje del umbral',
    alert_below: 'Alertar cuando baje de',
    units: 'unidades',
    expiry: 'Fecha de vencimiento (opcional)',
    save_item: 'Guardar artículo',
    edit_item: 'Editar artículo',
    unit_placeholder: 'unidad (bolsas, oz, kg…)',
    cat_dairy: 'Lácteos',
    cat_produce: 'Frutas y verduras',
    cat_meat: 'Carne y mariscos',
    cat_beverages: 'Bebidas',
    cat_grains: 'Granos y pasta',
    cat_canned: 'Enlatados',
    cat_snacks: 'Aperitivos',
    cat_condiments: 'Condimentos',
    cat_other: 'Otros',
    all: 'Todos',
    edit: 'Editar',
    add_more: '+ Agregar',
    use: '− Usar',
    remove: 'Eliminar',
    running_low: 'Stock bajo',
    well_stocked: 'Bien abastecido',
    restock: 'Reabastecer +5',
    left: 'restantes',
    threshold: 'umbral',
    no_alerts: 'Sin alertas configuradas',
    no_alerts_sub: 'Activa "Notificar cuando quede poco" al agregar artículos para recibir alertas aquí.',
    empty_fridge: 'Tu nevera está vacía',
    empty_pantry: 'Tu despensa está vacía',
    empty_sub: 'Toca "Agregar" arriba para empezar a rastrear tus comestibles.',
    loading: 'Cargando…',
    language: 'Idioma',
    language_sub: 'Elige tu idioma preferido',
    account: 'Cuenta',
    household: 'Hogar',
    sign_out: 'Cerrar sesión',
    confirm_delete: '¿Eliminar este artículo del inventario?',
    no_cat: 'No hay artículos en esta categoría.',
    header_manager: 'Gestión de Nevera y Despensa',
    err_name: 'Por favor ingresa el nombre del artículo.',
    err_email: 'Por favor ingresa tu correo electrónico.',
    err_pass: 'La contraseña debe tener al menos 6 caracteres.',
    err_household: 'Por favor ingresa el nombre de tu hogar.',
  }
};
 
 
// ════════════════════════════════════════════════════════════
//  STATE
// ════════════════════════════════════════════════════════════
let lang          = localStorage.getItem('kt_lang') || 'en';
let currentUser   = null;
let householdId   = null;
let householdName = '';
let items         = [];
let unsubscribe   = null;
let editId        = null;
let currentSection = 'fridge';
let qty           = 1;
let threshold     = 2;
let alertOn       = false;
let photoData     = null;
let authMode      = 'signin';
 
const catEmoji = {
  dairy: '🥛', produce: '🥦', meat: '🥩', beverages: '🧃',
  grains: '🌾', canned: '🥫', snacks: '🍪', condiments: '🧂', other: '📦'
};
 
 
// ════════════════════════════════════════════════════════════
//  i18n HELPERS
// ════════════════════════════════════════════════════════════
function t(key) {
  return T[lang][key] || T['en'][key] || key;
}
 
function applyLang() {
  document.documentElement.lang = lang;
 
  // Translate all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
 
  // Update category select options
  const sel = document.getElementById('item-category');
  if (sel) {
    const cats   = ['dairy','produce','meat','beverages','grains','canned','snacks','condiments','other'];
    const emojis = ['🥛','🥦','🥩','🧃','🌾','🥫','🍪','🧂','📦'];
    cats.forEach((c, i) => { sel.options[i].text = emojis[i] + ' ' + t('cat_' + c); });
  }
 
  // Update unit input placeholder
  const unitInput = document.getElementById('item-unit');
  if (unitInput) unitInput.placeholder = t('unit_placeholder');
 
  // Update auth UI text
  const authSub = document.getElementById('auth-sub-text');
  if (authSub) authSub.textContent = t('app_sub');
 
  const submitBtn = document.getElementById('auth-submit');
  if (submitBtn) submitBtn.textContent = authMode === 'signin' ? t('signin') : t('signup');
 
  // Refresh current view
  if (currentSection === 'alerts') renderAlerts();
  else renderSection(currentSection);
  updateAlertBadge();
}
 
export function setLang(l, btn) {
  lang = l;
  localStorage.setItem('kt_lang', l);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyLang();
}
 
export function setLangApp(l, btn) {
  lang = l;
  localStorage.setItem('kt_lang', l);
  document.querySelectorAll('#settings-modal .lang-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyLang();
}
 
// Expose to HTML onclick attributes
window.setLang    = setLang;
window.setLangApp = setLangApp;
 
 
// ════════════════════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════════════════════
export function switchAuthTab(mode) {
  authMode = mode;
  document.getElementById('tab-signin').classList.toggle('active', mode === 'signin');
  document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');
  document.getElementById('name-field').style.display = mode === 'signup' ? 'block' : 'none';
  document.getElementById('auth-submit').textContent  = t(mode);
  document.getElementById('auth-error').textContent   = '';
}
window.switchAuthTab = switchAuthTab;
 
export async function doAuth() {
  const email  = document.getElementById('auth-email').value.trim();
  const pass   = document.getElementById('auth-password').value;
  const errEl  = document.getElementById('auth-error');
  errEl.textContent = '';
 
  if (!email)       { errEl.textContent = t('err_email'); return; }
  if (pass.length < 6) { errEl.textContent = t('err_pass');  return; }
 
  // No Firebase config yet — run in demo mode
  if (DEMO_MODE) { startDemoMode(); return; }
 
  try {
    if (authMode === 'signup') {
      const hName = document.getElementById('household-name').value.trim();
      if (!hName) { errEl.textContent = t('err_household'); return; }
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await setDoc(doc(db, 'households', cred.user.uid), {
        name: hName, ownerEmail: email, createdAt: serverTimestamp()
      });
    } else {
      await signInWithEmailAndPassword(auth, email, pass);
    }
  } catch (e) {
    errEl.textContent = e.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim();
  }
}
window.doAuth = doAuth;
 
export async function signOut() {
  if (unsubscribe) unsubscribe();
  if (!DEMO_MODE) await fbSignOut(auth);
  items = []; currentUser = null; householdId = null;
  closeModal('settings-modal');
  document.getElementById('main-app').style.display   = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
  applyLang();
}
window.signOut = signOut;
 
function startDemoMode() {
  householdId   = 'demo';
  householdName = 'Demo Household';
  currentUser   = { email: 'demo@kitchentracker.app', uid: 'demo' };
  try { items = JSON.parse(localStorage.getItem('kt_demo_items') || '[]'); } catch (e) { items = []; }
  showApp();
}
 
function showApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('main-app').style.display    = 'flex';
  document.getElementById('household-title').textContent = householdName || 'Kitchen Tracker';
  document.getElementById('header-sub-text').textContent = t('header_manager');
  document.getElementById('settings-email').textContent  = currentUser?.email || '';
  document.getElementById('settings-household').textContent = householdName || '';
  document.getElementById('lang-en-btn').classList.toggle('active', lang === 'en');
  document.getElementById('lang-es-btn').classList.toggle('active', lang === 'es');
  showTab('fridge');
  applyLang();
}
 
 
// ════════════════════════════════════════════════════════════
//  FIREBASE REALTIME LISTENER
// ════════════════════════════════════════════════════════════
function subscribeItems() {
  if (DEMO_MODE || !db) return;
  if (unsubscribe) unsubscribe();
  const q = query(collection(db, 'items'), where('householdId', '==', householdId));
  unsubscribe = onSnapshot(q, snap => {
    items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderSection(currentSection);
    if (currentSection === 'alerts') renderAlerts();
    updateAlertBadge();
  });
}
 
function saveDemo() {
  if (DEMO_MODE) {
    try { localStorage.setItem('kt_demo_items', JSON.stringify(items)); } catch (e) {}
  }
}
 
 
// ════════════════════════════════════════════════════════════
//  AUTH STATE LISTENER  (runs on page load)
// ════════════════════════════════════════════════════════════
if (!DEMO_MODE) {
  onAuthStateChanged(auth, async user => {
    if (user) {
      currentUser  = user;
      householdId  = user.uid;
      const snap   = await getDoc(doc(db, 'households', user.uid));
      householdName = snap.exists() ? snap.data().name : 'My Household';
      showApp();
      subscribeItems();
    } else {
      document.getElementById('auth-screen').style.display = 'flex';
      document.getElementById('main-app').style.display    = 'none';
      applyLang();
    }
  });
} else {
  // Show auth screen in demo mode
  document.getElementById('auth-screen').style.display = 'flex';
  applyLang();
}
 
 
// ════════════════════════════════════════════════════════════
//  TAB NAVIGATION
// ════════════════════════════════════════════════════════════
export function showTab(tab) {
  currentSection = tab;
  ['fridge', 'pantry', 'alerts'].forEach((name, i) => {
    document.querySelectorAll('.tab')[i].classList.toggle('active', name === tab);
  });
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  if (tab === 'alerts') renderAlerts();
  else renderSection(tab);
}
window.showTab = showTab;
 
 
// ════════════════════════════════════════════════════════════
//  RENDER — SECTION
// ════════════════════════════════════════════════════════════
function renderSection(section) {
  const el       = document.getElementById(section);
  const list     = items.filter(i => i.location === section);
  const cats     = [...new Set(list.map(i => i.category))];
  const lowCount = list.filter(i => i.alertOn && i.qty <= i.threshold).length;
  const addLabel = section === 'fridge' ? t('add_item_fridge') : t('add_item_pantry');
 
  let html = `<button class="add-btn" onclick="openModal('${section}')">
    <span style="font-size:18px">+</span> ${addLabel}
  </button>`;
 
  if (list.length > 0) {
    html += `
      <div class="stat-row">
        <div class="stat-card">
          <div class="stat-num">${list.length}</div>
          <div class="stat-lbl">${t('total_items')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color:${lowCount > 0 ? 'var(--red)' : 'var(--green)'}">${lowCount}</div>
          <div class="stat-lbl">${t('low_stock')}</div>
        </div>
      </div>
      <div class="cat-filter">
        <div class="cat-chip active" onclick="filterCat(this,'all','${section}')">${t('all')}</div>
        ${cats.map(c => `<div class="cat-chip" onclick="filterCat(this,'${c}','${section}')">${catEmoji[c]} ${t('cat_' + c)}</div>`).join('')}
      </div>
      <div id="items-list-${section}">${renderItems(list)}</div>`;
  } else {
    const emptyTitle = section === 'fridge' ? t('empty_fridge') : t('empty_pantry');
    html += `
      <div class="empty">
        <div class="empty-icon">${section === 'fridge' ? '🧊' : '🥫'}</div>
        <div class="empty-title">${emptyTitle}</div>
        <div class="empty-sub">${t('empty_sub')}</div>
      </div>`;
  }
 
  el.innerHTML = html;
}
 
 
// ════════════════════════════════════════════════════════════
//  RENDER — ITEM CARDS
// ════════════════════════════════════════════════════════════
function renderItems(list) {
  if (!list.length) {
    return `<div class="empty" style="padding:30px 0"><div class="empty-sub">${t('no_cat')}</div></div>`;
  }
 
  return list.map(item => {
    const maxQty   = Math.max(item.qty, (item.threshold || 1) * 2, 5);
    const pct      = Math.round((item.qty / maxQty) * 100);
    const isLow    = item.alertOn && item.qty <= item.threshold;
    const barColor = item.qty === 0 ? 'var(--red)' : isLow ? 'var(--red)' : pct < 50 ? 'var(--amber)' : 'var(--green)';
    const expText  = item.expiry ? ` · ${item.expiry}` : '';
 
    return `
      <div class="item-card">
        <div class="item-img">
          ${item.photo ? `<img src="${item.photo}" alt="${item.name}" loading="lazy">` : catEmoji[item.category]}
        </div>
        <div class="item-info">
          <div class="item-name">
            ${item.name}
            ${isLow ? `<span class="low-badge">${t('low_stock')}</span>` : ''}
          </div>
          <div class="item-meta">${t('cat_' + item.category)}${expText}</div>
          <div class="item-bottom">
            <div class="stock-bar-wrap">
              <div class="stock-bar" style="width:${pct}%;background:${barColor}"></div>
            </div>
            <div class="stock-label" style="color:${barColor}">${item.qty} ${item.unit || t('units')}</div>
          </div>
        </div>
        <div class="item-actions">
          <button class="action-btn" onclick="editItem('${item.id}')">${t('edit')}</button>
          <button class="action-btn" onclick="adjustQty('${item.id}',1)">${t('add_more')}</button>
          <button class="action-btn" onclick="adjustQty('${item.id}',-1)" ${item.qty <= 0 ? 'disabled style="opacity:.4"' : ''}>${t('use')}</button>
          <button class="action-btn danger" onclick="deleteItem('${item.id}')">${t('remove')}</button>
        </div>
      </div>`;
  }).join('');
}
 
 
// ════════════════════════════════════════════════════════════
//  RENDER — ALERTS TAB
// ════════════════════════════════════════════════════════════
function renderAlerts() {
  const el        = document.getElementById('alerts');
  const lowItems  = items.filter(i => i.alertOn && i.qty <= i.threshold);
  const allAlerts = items.filter(i => i.alertOn);
 
  if (allAlerts.length === 0) {
    el.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🔔</div>
        <div class="empty-title">${t('no_alerts')}</div>
        <div class="empty-sub">${t('no_alerts_sub')}</div>
      </div>`;
    return;
  }
 
  let html = '';
 
  if (lowItems.length > 0) {
    html += `<div class="alert-section-title" style="color:var(--red)">⚠️ ${t('running_low')} (${lowItems.length})</div>`;
    html += lowItems.map(item => `
      <div class="notif-item" style="border-color:var(--red);background:var(--red-light)">
        <div class="notif-icon" style="background:rgba(192,57,43,.12)">${catEmoji[item.category]}</div>
        <div style="flex:1">
          <div class="notif-text">${item.name}</div>
          <div class="notif-sub">${item.qty} ${item.unit || t('units')} ${t('left')} · ${t('threshold')}: ${item.threshold}</div>
          <div class="notif-sub">${item.location === 'fridge' ? '🧊 ' + t('fridge') : '🥫 ' + t('pantry')}</div>
        </div>
        <button class="restock-btn" onclick="quickRestock('${item.id}')">${t('restock')}</button>
      </div>`).join('');
    html += '<div style="margin-bottom:16px"></div>';
  }
 
  const okItems = allAlerts.filter(i => !(i.alertOn && i.qty <= i.threshold));
  if (okItems.length > 0) {
    html += `<div class="alert-section-title">✅ ${t('well_stocked')} (${okItems.length})</div>`;
    html += okItems.map(item => `
      <div class="notif-item">
        <div class="notif-icon" style="background:var(--green-light)">${catEmoji[item.category]}</div>
        <div>
          <div class="notif-text">${item.name}</div>
          <div class="notif-sub">${item.qty} / ${item.threshold} ${item.unit || t('units')}</div>
          <div class="notif-sub">${item.location === 'fridge' ? '🧊 ' + t('fridge') : '🥫 ' + t('pantry')}</div>
        </div>
      </div>`).join('');
  }
 
  el.innerHTML = html;
}
 
function updateAlertBadge() {
  const lowCount = items.filter(i => i.alertOn && i.qty <= i.threshold).length;
  const tabEl    = document.querySelectorAll('.tab')[2];
  if (!tabEl) return;
  const alertText = t('alerts');
  if (lowCount > 0) {
    tabEl.innerHTML = `🔔 <span>${alertText}</span> <span style="background:var(--red);color:#fff;font-size:10px;padding:1px 6px;border-radius:10px">${lowCount}</span>`;
  } else {
    tabEl.innerHTML = `🔔 <span>${alertText}</span>`;
  }
}
 
export function filterCat(el, cat, section) {
  document.querySelectorAll(`#${section} .cat-chip`).forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const list     = items.filter(i => i.location === section);
  const filtered = cat === 'all' ? list : list.filter(i => i.category === cat);
  document.getElementById(`items-list-${section}`).innerHTML = renderItems(filtered);
}
window.filterCat = filterCat;
 
 
// ════════════════════════════════════════════════════════════
//  MODAL — OPEN / CLOSE
// ════════════════════════════════════════════════════════════
export function openModal(section, id = null) {
  editId    = id;
  qty       = 1;
  threshold = 2;
  alertOn   = false;
  photoData = null;
 
  document.getElementById('modal-title').textContent = id ? t('edit_item') : `+ ${t('add_item_' + section)}`;
 
  // Reset all fields
  ['item-name', 'item-unit', 'item-expiry'].forEach(f => document.getElementById(f).value = '');
  document.getElementById('item-unit').placeholder     = t('unit_placeholder');
  document.getElementById('item-category').value       = 'dairy';
  document.getElementById('qty-display').textContent   = 1;
  document.getElementById('threshold-display').textContent = 2;
  document.getElementById('alert-toggle').className    = 'toggle-switch';
  document.getElementById('threshold-field').style.display = 'none';
  document.getElementById('photo-preview').style.display  = 'none';
  document.getElementById('photo-placeholder').style.display = 'block';
  document.getElementById('photo-input').value         = '';
 
  // Populate if editing
  if (id) {
    const item = items.find(i => i.id === id);
    if (item) {
      document.getElementById('item-name').value     = item.name;
      document.getElementById('item-unit').value     = item.unit || '';
      document.getElementById('item-expiry').value   = item.expiry || '';
      document.getElementById('item-category').value = item.category;
      qty = item.qty; threshold = item.threshold || 2; alertOn = item.alertOn || false;
      document.getElementById('qty-display').textContent       = qty;
      document.getElementById('threshold-display').textContent = threshold;
      if (alertOn) {
        document.getElementById('alert-toggle').className       = 'toggle-switch on';
        document.getElementById('threshold-field').style.display = 'block';
      }
      if (item.photo) {
        photoData = item.photo;
        document.getElementById('photo-preview').src            = item.photo;
        document.getElementById('photo-preview').style.display  = 'block';
        document.getElementById('photo-placeholder').style.display = 'none';
      }
      document.getElementById('item-modal').dataset.section = item.location;
    }
  } else {
    document.getElementById('item-modal').dataset.section = section;
  }
 
  document.getElementById('item-modal').classList.add('open');
}
 
export function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
 
window.openModal  = openModal;
window.closeModal = closeModal;
 
 
// ════════════════════════════════════════════════════════════
//  PHOTO UPLOAD
// ════════════════════════════════════════════════════════════
export function handlePhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    photoData = e.target.result;
    document.getElementById('photo-preview').src            = photoData;
    document.getElementById('photo-preview').style.display  = 'block';
    document.getElementById('photo-placeholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
}
window.handlePhoto = handlePhoto;
 
 
// ════════════════════════════════════════════════════════════
//  FORM CONTROLS
// ════════════════════════════════════════════════════════════
export function changeQty(d) {
  qty = Math.max(0, qty + d);
  document.getElementById('qty-display').textContent = qty;
}
 
export function changeThreshold(d) {
  threshold = Math.max(1, threshold + d);
  document.getElementById('threshold-display').textContent = threshold;
}
 
export function toggleAlert() {
  alertOn = !alertOn;
  document.getElementById('alert-toggle').className        = 'toggle-switch' + (alertOn ? ' on' : '');
  document.getElementById('threshold-field').style.display = alertOn ? 'block' : 'none';
}
 
window.changeQty      = changeQty;
window.changeThreshold = changeThreshold;
window.toggleAlert    = toggleAlert;
 
 
// ════════════════════════════════════════════════════════════
//  SAVE ITEM
// ════════════════════════════════════════════════════════════
export async function saveItem() {
  const name = document.getElementById('item-name').value.trim();
  if (!name) { alert(t('err_name')); return; }
 
  const section  = document.getElementById('item-modal').dataset.section;
  const itemData = {
    name,
    category:    document.getElementById('item-category').value,
    qty,
    unit:        document.getElementById('item-unit').value.trim(),
    alertOn,
    threshold,
    expiry:      document.getElementById('item-expiry').value,
    location:    section,
    householdId
  };
 
  // ── Demo mode ──────────────────────────────────────────────
  if (DEMO_MODE) {
    if (editId) {
      const idx = items.findIndex(i => i.id === editId);
      if (idx > -1) items[idx] = { ...items[idx], ...itemData, photo: photoData || items[idx].photo };
    } else {
      items.push({ id: Date.now().toString(), ...itemData, photo: photoData, added: new Date().toISOString() });
    }
    saveDemo();
    closeModal('item-modal');
    renderSection(section);
    updateAlertBadge();
    return;
  }
 
  // ── Firebase mode ──────────────────────────────────────────
  // Upload photo to Firebase Storage if a new one was chosen
  let photoUrl = null;
  if (photoData && photoData.startsWith('data:')) {
    try {
      const photoRef = ref(storage, `households/${householdId}/items/${Date.now()}.jpg`);
      await uploadString(photoRef, photoData, 'data_url');
      photoUrl = await getDownloadURL(photoRef);
    } catch (e) {
      photoUrl = null;
    }
  }
 
  if (editId) {
    const existing = items.find(i => i.id === editId);
    await updateDoc(doc(db, 'items', editId), {
      ...itemData,
      photo:     photoUrl || existing?.photo || null,
      updatedAt: serverTimestamp()
    });
  } else {
    await addDoc(collection(db, 'items'), {
      ...itemData,
      photo:     photoUrl,
      createdAt: serverTimestamp()
    });
  }
 
  closeModal('item-modal');
}
window.saveItem = saveItem;
 
 
// ════════════════════════════════════════════════════════════
//  EDIT / ADJUST / DELETE ITEMS
// ════════════════════════════════════════════════════════════
export function editItem(id) {
  const item = items.find(i => i.id === id);
  openModal(item?.location || currentSection, id);
}
window.editItem = editItem;
 
export async function adjustQty(id, d) {
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return;
  const newQty = Math.max(0, items[idx].qty + d);
 
  if (DEMO_MODE) {
    items[idx].qty = newQty;
    saveDemo();
    renderSection(items[idx].location);
    updateAlertBadge();
    if (currentSection === 'alerts') renderAlerts();
    return;
  }
 
  await updateDoc(doc(db, 'items', id), { qty: newQty, updatedAt: serverTimestamp() });
}
window.adjustQty = adjustQty;
 
export async function quickRestock(id) {
  await adjustQty(id, 5);
  if (currentSection === 'alerts') renderAlerts();
}
window.quickRestock = quickRestock;
 
export async function deleteItem(id) {
  if (!confirm(t('confirm_delete'))) return;
 
  if (DEMO_MODE) {
    const item = items.find(i => i.id === id);
    items = items.filter(i => i.id !== id);
    saveDemo();
    renderSection(item?.location || currentSection);
    updateAlertBadge();
    return;
  }
 
  await deleteDoc(doc(db, 'items', id));
}
window.deleteItem = deleteItem;
 
 
// ════════════════════════════════════════════════════════════
//  SETTINGS
// ════════════════════════════════════════════════════════════
export function openSettings() {
  document.getElementById('settings-email').textContent     = currentUser?.email || '';
  document.getElementById('settings-household').textContent = householdName || '';
  document.getElementById('lang-en-btn').classList.toggle('active', lang === 'en');
  document.getElementById('lang-es-btn').classList.toggle('active', lang === 'es');
  document.getElementById('settings-modal').classList.add('open');
}
window.openSettings = openSettings;
 
 
// ════════════════════════════════════════════════════════════
//  CLOSE MODALS ON BACKDROP TAP
// ════════════════════════════════════════════════════════════
['item-modal', 'settings-modal'].forEach(id => {
  document.getElementById(id).addEventListener('click', function (e) {
    if (e.target === this) closeModal(id);
  });
});
 
 
// ════════════════════════════════════════════════════════════
//  SERVICE WORKER  (offline support)
// ════════════════════════════════════════════════════════════
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
 
 
// ════════════════════════════════════════════════════════════
//  INIT
// ════════════════════════════════════════════════════════════
applyLang();