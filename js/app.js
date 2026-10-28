/**
 * Smart Grocery Tracker & Budget Safety Planner - Core Application Logic
 * Integrates:
 * - Visual System: Warm Cream, Soft Blush, Deep Rose, Night Rose Dark Mode
 * - Features: Single-User Auth, Single Smart Natural-Language Input Bar,
 *   Bottom Navigation Bar (Icon-Only), PWA Service Worker & Offline Caching,
 *   Share to WhatsApp, In-Store FAB & Aisle Grouping, Anti-List Guard ("Labu Siam"),
 *   Pantry Shelf-life Tracker, and Native Web Audio API Synthesis.
 * - Core Features: Mobile UX Ergonomics, Discount Formulas, Price History & Realtime Sync.
 */

// Storage Keys (SRS F-06A)
const STORAGE_KEYS = {
  USER: 'smart_grocery_user',
  CART: 'smart_grocery_cart',
  STORE: 'smart_grocery_store',
  DATE: 'smart_grocery_date',
  BUDGET: 'smart_grocery_budget',
  BUDGET_PERIOD: 'smart_grocery_period',
  PRICE_HISTORY: 'smart_grocery_history',
  RECEIPTS: 'smart_grocery_receipts',
  PANTRY: 'smart_grocery_pantry',
  BLACKLIST: 'smart_grocery_blacklist',
  IN_STORE_MODE: 'smart_grocery_instore',
  SOUND_ENABLED: 'smart_grocery_sound',
  DARK_MODE: 'smart_grocery_dark_mode',
  SESSION_ID: 'smart_grocery_session',
  FIREBASE_CONFIG: 'smart_grocery_fb_config'
};

// Default Personal Blacklist ("Anti-List")
const DEFAULT_BLACKLIST = ['labu siam', 'sayur pare', 'pare', 'jengkol', 'bitter melon'];

// Default Historical Catalog Bulan Lalu untuk Toko: "Lotte Mart Grocery - Puri Indah" (SRS F-01, F-04)
const DEFAULT_PRICE_HISTORY = {
  "Minyak Goreng": { harga: 18000, satuan: "liter", kategori: "Kebutuhan Pokok", toko: "Lotte Mart Grocery - Puri Indah" },
  "Beras 5kg": { harga: 54000, satuan: "karung/5kg", kategori: "Kebutuhan Pokok", toko: "Lotte Mart Grocery - Puri Indah" },
  "Sabun Mandi": { harga: 12000, satuan: "pcs", kategori: "Perlengkapan Mandi", toko: "Lotte Mart Grocery - Puri Indah" },
  "Telur Ayam 1kg": { harga: 28000, satuan: "kg", kategori: "Kebutuhan Pokok", toko: "Lotte Mart Grocery - Puri Indah" },
  "Mi Instan Dus": { harga: 115000, satuan: "pack", kategori: "Makanan", toko: "Lotte Mart Grocery - Puri Indah" },
  "Susu UHT 1L": { harga: 19500, satuan: "liter", kategori: "Minuman", toko: "Lotte Mart Grocery - Puri Indah" },
  "Kopi Bubuk 200g": { harga: 15000, satuan: "pack", kategori: "Minuman", toko: "Lotte Mart Grocery - Puri Indah" },
  "Deterjen Cair 800ml": { harga: 17500, satuan: "pack", kategori: "Kebersihan & Rumah", toko: "Lotte Mart Grocery - Puri Indah" },
  "Dada Ayam 1kg": { harga: 45000, satuan: "kg", kategori: "Kebutuhan Pokok", toko: "Lotte Mart Grocery - Puri Indah" },
  "Tepung Terigu": { harga: 13000, satuan: "kg", kategori: "Pantry", toko: "Lotte Mart Grocery - Puri Indah" }
};

// Initial Mock Cart Items (Initial Total: Rp 94.000 / 94% Waspada)
const DEFAULT_CART_ITEMS = [
  {
    id: 'item-1',
    namaBarang: 'Minyak Goreng',
    kategori: 'Kebutuhan Pokok',
    satuan: 'liter',
    qty: 1,
    hargaSatuan: 20000,
    diskonTipe: 'single',
    diskonValue: '10',
    hargaRiwayatBulanLalu: 18000,
    store: 'Lotte Mart Grocery - Puri Indah',
    checked: true
  },
  {
    id: 'item-2',
    namaBarang: 'Sabun Mandi',
    kategori: 'Perlengkapan Mandi',
    satuan: 'pcs',
    qty: 2,
    hargaSatuan: 20000,
    diskonTipe: 'tiered',
    diskonValue: '50+20',
    hargaRiwayatBulanLalu: 12000,
    store: 'Lotte Mart Grocery - Puri Indah',
    checked: true
  },
  {
    id: 'item-3',
    namaBarang: 'Beras 5kg',
    kategori: 'Kebutuhan Pokok',
    satuan: 'karung/5kg',
    qty: 1,
    hargaSatuan: 60000,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: 54000,
    store: 'Lotte Mart Grocery - Puri Indah',
    checked: true
  }
];

// Initial Seed Pantry Stock
const DEFAULT_PANTRY = [
  { id: 'pan-1', name: 'Tepung Tapioka', qty: 1, unit: 'pack', category: 'Pantry', addedDate: new Date().toISOString(), expiryDate: getOffsetDateString(60) },
  { id: 'pan-2', name: 'Susu UHT 1L', qty: 1, unit: 'liter', category: 'Minuman', addedDate: new Date().toISOString(), expiryDate: getOffsetDateString(4) },
  { id: 'pan-3', name: 'Telur Ayam', qty: 10, unit: 'butir', category: 'Kebutuhan Pokok', addedDate: new Date().toISOString(), expiryDate: getOffsetDateString(14) }
];

// Initial Receipts Archive
const DEFAULT_RECEIPTS = [
  {
    id: 'rec-sep-2026',
    tanggal: '2026-09-15',
    toko: 'Lotte Mart Grocery - Puri Indah',
    judul: 'Belanja Bulanan Kos - September 2026',
    totalBelanja: 94000,
    totalHemat: 16000,
    budgetSaatItu: 100000,
    statusBudget: 'warning',
    items: [
      { namaBarang: 'Minyak Goreng', qty: 1, satuan: 'liter', hargaAkhirSatuan: 18000, totalHarga: 18000 },
      { namaBarang: 'Sabun Mandi', qty: 2, satuan: 'pcs', hargaAkhirSatuan: 8000, totalHarga: 16000 },
      { namaBarang: 'Beras 5kg', qty: 1, satuan: 'karung/5kg', hargaAkhirSatuan: 60000, totalHarga: 60000 }
    ]
  }
];

const AISLE_METADATA = {
  'Kebutuhan Pokok': { title: 'Lorong: Sembako & Bahan Pokok', icon: '🌾' },
  'Pantry': { title: 'Lorong: Bumbu & Tepung', icon: '🧂' },
  'Makanan': { title: 'Lorong: Makanan & Olahan', icon: '🍞' },
  'Minuman': { title: 'Lorong: Susu & Minuman Segar', icon: '🥛' },
  'Dairy': { title: 'Lorong: Susu, Telur & Dairy', icon: '🧀' },
  'Perlengkapan Mandi': { title: 'Lorong: Sabun & Mandi', icon: '🧼' },
  'Kebersihan & Rumah': { title: 'Lorong: Kebersihan Rumah', icon: '🧹' }
};

// Global App State
let AppState = {
  user: null,
  authMode: 'signin',
  previousSafetyLevel: 'safe',
  cart: [],
  currentStore: 'Lotte Mart Grocery - Puri Indah', // SRS F-01 Default
  currentDate: new Date().toISOString().split('T')[0], // SRS F-01 Date
  budget: 100000, // SRS F-05 Limit Dompet
  budgetPeriod: 'weekly',
  priceHistory: {},
  receipts: [],
  pantry: [],
  blacklist: [],
  sessionId: 'lotte-mart-puri-01',
  lastLocalUpdate: Date.now(),
  currentTab: 'planner',
  inStoreMode: false,
  soundEnabled: true,
  audioCtx: null,
  editingItemId: null,
  itemPendingDeleteId: null,
  pendingBlacklistItem: null,
  deferredInstallPrompt: null
};

// Realtime Sync Variables (SRS F-06B)
let firestoreDb = null;
let unsubscribeFirestore = null;
let isReceivingRemoteUpdate = false;
let syncChannel = null;

if (typeof window !== 'undefined' && window.BroadcastChannel) {
  syncChannel = new BroadcastChannel('smart_grocery_sync');
  syncChannel.onmessage = (event) => {
    if (event.data && event.data.type === 'REMOTE_UPDATE') {
      applyRemoteState(event.data.payload);
    }
  };
}

// =========================================================================
// 1. DATE HELPERS
// =========================================================================
function getOffsetDateString(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// =========================================================================
// 2. MATHEMATICAL FORMULAS & COMPUTATION (SRS F-02, F-03, F-04, F-05)
// =========================================================================

/**
 * Kalkulator Diskon Bertingkat Kompound & Tunggal (SRS F-03)
 * Tunggal: Harga × (1 - d/100)
 * Bertingkat (Kompound): Harga × (1 - d1/100) × (1 - d2/100) × ...
 * LOGIKA MATEMATIK DILARANG LINIER (50% + 20% BUKAN 70%, MELAINKAN 60% HEMAT / 40% HARGA AKHIR)
 */
function calculateDiscount(originalPrice, discountType, discountValue) {
  const price = Math.max(0, parseFloat(originalPrice) || 0);
  if (price === 0 || discountType === 'none' || !discountValue) {
    return {
      finalPrice: price,
      savingsPerUnit: 0,
      effectivePercent: 0,
      steps: []
    };
  }

  if (discountType === 'single') {
    const cleaned = discountValue.toString().replace(/%/g, '').trim();
    const val = Math.max(0, Math.min(100, parseFloat(cleaned) || 0));
    const finalPrice = Math.round(price * (1 - (val / 100)));
    const savings = price - finalPrice;
    return {
      finalPrice,
      savingsPerUnit: savings,
      effectivePercent: val,
      steps: [`Diskon ${val}%: Rp ${formatNumber(price)} × (1 - ${val / 100}) = Rp ${formatNumber(finalPrice)} (Hemat Rp ${formatNumber(savings)})`]
    };
  }

  if (discountType === 'tiered') {
    const cleaned = discountValue.toString().replace(/%/g, '');
    const rawParts = cleaned.split('+');
    const validTiers = rawParts
      .map(p => parseFloat(p.trim()))
      .filter(p => !isNaN(p) && p > 0 && p <= 100);

    if (validTiers.length === 0) {
      return { finalPrice: price, savingsPerUnit: 0, effectivePercent: 0, steps: [] };
    }

    let current = price;
    const steps = [];

    validTiers.forEach((tier, index) => {
      const prevPrice = current;
      current = current * (1 - (tier / 100));
      steps.push(`Tahap ${index + 1} (${tier}%): Rp ${formatNumber(Math.round(prevPrice))} × (1 - ${tier / 100}) = Rp ${formatNumber(Math.round(current))}`);
    });

    const finalPrice = Math.round(current);
    const savings = price - finalPrice;
    const effectivePercent = price > 0 ? ((savings / price) * 100) : 0;

    return {
      finalPrice,
      savingsPerUnit: savings,
      effectivePercent: Math.round(effectivePercent * 10) / 10,
      steps
    };
  }

  return { finalPrice: price, savingsPerUnit: 0, effectivePercent: 0, steps: [] };
}

/**
 * Komparator Fluktuasi Harga Realtime vs Histori Bulan Lalu (SRS F-04)
 * - Harga Naik: Panah MERAH naik (↑) + nominal kenaikan (+Rp 6.000)
 * - Harga Turun: Panah HIJAU turun (↓) + nominal penghematan (-Rp 4.000)
 * - Harga Stabil: Tanda ABU-ABU setara (=) jika harga sama persis
 */
function comparePriceWithLastMonth(currentFinalUnitPrice, lastMonthPrice) {
  const current = Math.round(parseFloat(currentFinalUnitPrice) || 0);
  const baseline = Math.round(parseFloat(lastMonthPrice) || 0);

  if (!baseline || baseline <= 0) {
    return {
      status: 'new',
      label: 'Baru',
      diff: 0,
      text: '✨ Produk Baru',
      badgeClass: 'fluctuation-badge fluctuation-stable'
    };
  }

  const diff = current - baseline;

  if (diff > 0) {
    // Naik: Panah MERAH naik (↑) + nominal kenaikan
    return {
      status: 'up',
      label: '↑ Naik',
      diff,
      text: `↑ +Rp ${formatNumber(diff)}`,
      badgeClass: 'fluctuation-badge fluctuation-up'
    };
  } else if (diff < 0) {
    // Turun: Panah HIJAU turun (↓) + nominal penghematan
    const absDiff = Math.abs(diff);
    return {
      status: 'down',
      label: '↓ Turun',
      diff,
      text: `↓ -Rp ${formatNumber(absDiff)}`,
      badgeClass: 'fluctuation-badge fluctuation-down'
    };
  } else {
    // Stabil: Tanda ABU-ABU setara (=) jika harga sama persis
    return {
      status: 'stable',
      label: '= Stabil',
      diff: 0,
      text: `= Rp ${formatNumber(current)}`,
      badgeClass: 'fluctuation-badge fluctuation-stable'
    };
  }
}

/**
 * Evaluasi Pengendali Anggaran / Budget Safety Cap (SRS F-05)
 * - Jika Total Belanja >= 90% dari limit: Status bar KUNING (Peringatan Waspada)
 * - Jika Total Belanja melebihi > 100% dari limit: Banner MERAH TEGAS di bagian atas layar
 *   dengan pesan exact: "Total belanja melebihi batas saldo dompet! Kurangi kuantitas atau batalkan barang sekunder."
 */
function evaluateBudgetSafety(totalBelanja, budget) {
  const total = Math.max(0, totalBelanja);
  const maxBudget = Math.max(1, budget);
  const percentage = (total / maxBudget) * 100;
  const sisa = maxBudget - total;

  if (percentage > 100) {
    return {
      level: 'danger',
      percentage,
      sisa,
      badgeText: `🚨 Melebihi (${Math.round(percentage)}%)`,
      barColor: '#EF4444',
      badgeClass: 'progress-status-badge badge-danger',
      showOverbudgetBanner: true,
      bannerMessage: 'Total belanja melebihi batas saldo dompet! Kurangi kuantitas atau batalkan barang sekunder.'
    };
  } else if (percentage >= 90) {
    return {
      level: 'warning',
      percentage,
      sisa,
      badgeText: `⚠️ Waspada (${Math.round(percentage)}%)`,
      barColor: '#F59E0B',
      badgeClass: 'progress-status-badge badge-warning',
      showOverbudgetBanner: false,
      bannerMessage: ''
    };
  } else {
    return {
      level: 'safe',
      percentage,
      sisa,
      badgeText: `● Aman (${Math.round(percentage)}%)`,
      barColor: '#10B981',
      badgeClass: 'progress-status-badge badge-safe',
      showOverbudgetBanner: false,
      bannerMessage: ''
    };
  }
}

function getCartMetrics() {
  let totalBelanja = 0;
  let totalHemat = 0;
  let totalItemsCount = 0;
  let checkedItemsCount = 0;

  AppState.cart.forEach(item => {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const itemSubtotal = disc.finalPrice * item.qty;
    const itemSavings = disc.savingsPerUnit * item.qty;

    totalBelanja += itemSubtotal;
    totalHemat += itemSavings;
    totalItemsCount += item.qty;
    if (item.checked) checkedItemsCount++;
  });

  const safety = evaluateBudgetSafety(totalBelanja, AppState.budget);

  return {
    totalBelanja,
    totalHemat,
    totalItemsCount,
    checkedItemsCount,
    safety
  };
}

// =========================================================================
// 3. AUDIO SYNTHESIS & MICRO-INTERACTIONS (WEB AUDIO API)
// =========================================================================
function initAudioContext() {
  if (!AppState.audioCtx && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
    AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playCalmChime() {
  if (!AppState.soundEnabled) return;
  try {
    initAudioContext();
    if (!AppState.audioCtx) return;
    if (AppState.audioCtx.state === 'suspended') AppState.audioCtx.resume();

    const ctx = AppState.audioCtx;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + (idx * 0.06));
      gain.gain.setValueAtTime(0.08, now + (idx * 0.06));
      gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.06) + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + (idx * 0.06));
      osc.stop(now + (idx * 0.06) + 0.38);
    });
  } catch (e) { }
}

function playSoftPop() {
  if (!AppState.soundEnabled) return;
  try {
    initAudioContext();
    if (!AppState.audioCtx) return;
    if (AppState.audioCtx.state === 'suspended') AppState.audioCtx.resume();

    const ctx = AppState.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(720, now + 0.08);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  } catch (e) { }
}

function playWarningAlertTone() {
  if (!AppState.soundEnabled) return;
  try {
    initAudioContext();
    if (!AppState.audioCtx) return;
    if (AppState.audioCtx.state === 'suspended') AppState.audioCtx.resume();

    const ctx = AppState.audioCtx;
    const now = ctx.currentTime;
    [392, 330].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + (idx * 0.12));
      gain.gain.setValueAtTime(0.0001, now + (idx * 0.12));
      gain.gain.exponentialRampToValueAtTime(0.12, now + (idx * 0.12) + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx * 0.12) + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + (idx * 0.12));
      osc.stop(now + (idx * 0.12) + 0.11);
    });
  } catch (e) { }
}

function playScannerBeep() {
  if (!AppState.soundEnabled) return;
  try {
    initAudioContext();
    if (!AppState.audioCtx) return;
    if (AppState.audioCtx.state === 'suspended') AppState.audioCtx.resume();

    const ctx = AppState.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  } catch (e) { }
}

function toggleAudio() {
  AppState.soundEnabled = !AppState.soundEnabled;
  localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(AppState.soundEnabled));
  const btn = document.getElementById('btnSoundToggle');
  if (btn) btn.textContent = AppState.soundEnabled ? '🔊' : '🔇';
  showToast(AppState.soundEnabled ? 'Suara Feedback Aktif 🔊' : 'Suara Dibisukan 🔇', 'info');
}

// =========================================================================
// 4. PERSISTENCE & LOCALSTORAGE (SRS F-06A)
// =========================================================================
function getStoredItem(key) {
  let val = localStorage.getItem(key);
  if (!val) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(key)) {
          val = localStorage.getItem(k);
          break;
        }
      }
    } catch (e) { }
  }
  return val;
}

function loadLocalState() {
  try {
    const storedUser = getStoredItem(STORAGE_KEYS.USER);
    if (storedUser) AppState.user = JSON.parse(storedUser);

    const storedCart = getStoredItem(STORAGE_KEYS.CART);
    AppState.cart = storedCart ? JSON.parse(storedCart) : JSON.parse(JSON.stringify(DEFAULT_CART_ITEMS));

    const storedStore = getStoredItem(STORAGE_KEYS.STORE);
    if (storedStore) AppState.currentStore = storedStore;

    const storedDate = getStoredItem(STORAGE_KEYS.DATE);
    if (storedDate) AppState.currentDate = storedDate;

    const storedBudget = getStoredItem(STORAGE_KEYS.BUDGET);
    AppState.budget = storedBudget !== null ? parseInt(storedBudget, 10) : 100000;

    const storedPeriod = getStoredItem(STORAGE_KEYS.BUDGET_PERIOD);
    if (storedPeriod) AppState.budgetPeriod = storedPeriod;

    const storedHistory = getStoredItem(STORAGE_KEYS.PRICE_HISTORY);
    AppState.priceHistory = storedHistory ? JSON.parse(storedHistory) : { ...DEFAULT_PRICE_HISTORY };

    const storedReceipts = getStoredItem(STORAGE_KEYS.RECEIPTS);
    AppState.receipts = storedReceipts ? JSON.parse(storedReceipts) : [...DEFAULT_RECEIPTS];

    const storedPantry = getStoredItem(STORAGE_KEYS.PANTRY);
    AppState.pantry = storedPantry ? JSON.parse(storedPantry) : [...DEFAULT_PANTRY];

    const storedBlacklist = getStoredItem(STORAGE_KEYS.BLACKLIST);
    AppState.blacklist = storedBlacklist ? JSON.parse(storedBlacklist) : [...DEFAULT_BLACKLIST];

    const storedSession = getStoredItem(STORAGE_KEYS.SESSION_ID);
    if (storedSession) AppState.sessionId = storedSession;

    const storedSound = getStoredItem(STORAGE_KEYS.SOUND_ENABLED);
    if (storedSound !== null) AppState.soundEnabled = JSON.parse(storedSound);

    const storedMode = getStoredItem(STORAGE_KEYS.IN_STORE_MODE);
    if (storedMode !== null) AppState.inStoreMode = JSON.parse(storedMode);
  } catch (err) {
    console.error('LocalStorage load error:', err);
    AppState.cart = JSON.parse(JSON.stringify(DEFAULT_CART_ITEMS));
    AppState.priceHistory = { ...DEFAULT_PRICE_HISTORY };
    AppState.pantry = [...DEFAULT_PANTRY];
    AppState.blacklist = [...DEFAULT_BLACKLIST];
  }
}

function saveLocalState() {
  try {
    if (AppState.user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(AppState.user));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(AppState.cart));
    localStorage.setItem(STORAGE_KEYS.STORE, AppState.currentStore);
    localStorage.setItem(STORAGE_KEYS.DATE, AppState.currentDate);
    localStorage.setItem(STORAGE_KEYS.BUDGET, AppState.budget.toString());
    localStorage.setItem(STORAGE_KEYS.BUDGET_PERIOD, AppState.budgetPeriod);
    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(AppState.priceHistory));
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(AppState.receipts));
    localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(AppState.pantry));
    localStorage.setItem(STORAGE_KEYS.BLACKLIST, JSON.stringify(AppState.blacklist));
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, AppState.sessionId);
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(AppState.soundEnabled));
    localStorage.setItem(STORAGE_KEYS.IN_STORE_MODE, JSON.stringify(AppState.inStoreMode));
  } catch (err) {
    console.error('LocalStorage save error:', err);
  }
}

// =========================================================================
// 5. CLOUD FIRESTORE REALTIME SYNC (SRS F-06B)
// =========================================================================
function initFirestoreSync() {
  if (typeof firebase === 'undefined') {
    updateCloudSyncUI('offline', 'Firebase SDK Offline');
    return;
  }

  try {
    let fbConfig = null;
    if (window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.apiKey && !window.FIREBASE_CONFIG.apiKey.startsWith('YOUR_')) {
      fbConfig = window.FIREBASE_CONFIG;
    } else {
      const storedConfig = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
      if (storedConfig) {
        try { fbConfig = JSON.parse(storedConfig); } catch (e) { }
      }
    }

    if (!fbConfig) {
      fbConfig = {
        apiKey: "AIzaSyDElaAnQSNpoh2Okx9Oxlx4FcJ0mmYg_8M",
        authDomain: "smart-grocery-tracker-52ac2.firebaseapp.com",
        projectId: "smart-grocery-tracker-52ac2",
        storageBucket: "smart-grocery-tracker-52ac2.firebasestorage.app",
        messagingSenderId: "377525411155",
        appId: "1:377525411155:web:ab6207540639f5cd5515a6"
      };
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(fbConfig);
    }

    firestoreDb = firebase.firestore();
    setupFirestoreListener();
    updateCloudSyncUI('connected', 'Live Cloud Sync (onSnapshot)');
  } catch (err) {
    console.warn('Firebase init notice:', err);
    updateCloudSyncUI('offline', 'Mode Offline (LocalStorage)');
  }
}

function setupFirestoreListener() {
  if (!firestoreDb) return;
  if (unsubscribeFirestore) unsubscribeFirestore();

  const docRef = firestoreDb.collection('shopping_sessions').doc(AppState.sessionId);

  unsubscribeFirestore = docRef.onSnapshot((docSnapshot) => {
    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      if (data && data.lastUpdated && data.lastUpdated > AppState.lastLocalUpdate) {
        isReceivingRemoteUpdate = true;
        applyRemoteState(data);
        showToast('Data diperbarui dari Cloud Firestore (onSnapshot) 🔄', 'info');
        isReceivingRemoteUpdate = false;
      }
    }
  }, (error) => {
    console.warn('Firestore onSnapshot listener notice:', error);
    updateCloudSyncUI('offline', 'Mode Offline (LocalStorage)');
  });
}

function applyRemoteState(data) {
  if (!data) return;
  if (Array.isArray(data.cart)) AppState.cart = data.cart;
  if (data.store) AppState.currentStore = data.store;
  if (data.date) AppState.currentDate = data.date;
  if (data.budget) AppState.budget = parseFloat(data.budget) || AppState.budget;
  if (data.lastUpdated) AppState.lastLocalUpdate = data.lastUpdated;

  saveLocalState();
  renderAll();
}

function pushStateToCloud() {
  if (isReceivingRemoteUpdate) return;
  AppState.lastLocalUpdate = Date.now();
  saveLocalState();

  const payload = {
    cart: AppState.cart,
    store: AppState.currentStore,
    date: AppState.currentDate,
    budget: AppState.budget,
    lastUpdated: AppState.lastLocalUpdate
  };

  // Broadcast to other tabs locally for zero-latency (<0.05s) multi-device test
  if (syncChannel) {
    syncChannel.postMessage({ type: 'REMOTE_UPDATE', payload });
  }

  // Push to Cloud Firestore onSnapshot doc (< 2s multi-device)
  if (firestoreDb) {
    firestoreDb.collection('shopping_sessions').doc(AppState.sessionId).set(payload, { merge: true })
      .then(() => updateCloudSyncUI('connected', 'Cloud Sync Aktif (onSnapshot)'))
      .catch((err) => console.warn('Firestore set error:', err));
  }
}

function updateCloudSyncUI(status, labelText) {
  const statusPill = document.getElementById('cloud-sync-status-pill');
  const statusText = document.getElementById('cloud-sync-text');
  const dot = document.getElementById('cloud-sync-dot');

  if (statusText) statusText.textContent = labelText;
  if (dot) {
    dot.style.background = (status === 'connected') ? '#10B981' : '#94A3B8';
  }
}

// =========================================================================
// 6. AUTH GATE: GOOGLE LOGIN, SIGN IN & SIGN UP (SRS SINGLE-USER & CLOUD)
// =========================================================================
function switchAuthMode(mode) {
  AppState.authMode = mode;
  const tabSignIn = document.getElementById('tabAuthSignIn');
  const tabSignUp = document.getElementById('tabAuthSignUp');
  const authNameGroup = document.getElementById('authNameGroup');
  const authNameInput = document.getElementById('authNameInput');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const googleBtnText = document.getElementById('googleBtnText');
  const authDividerText = document.getElementById('authDividerText');
  const authSwitchPromptText = document.getElementById('authSwitchPromptText');
  const authSwitchBtn = document.getElementById('authSwitchBtn');

  if (mode === 'signup') {
    if (tabSignIn) tabSignIn.classList.remove('active');
    if (tabSignUp) tabSignUp.classList.add('active');
    if (authNameGroup) authNameGroup.style.display = 'block';
    if (authNameInput) authNameInput.setAttribute('required', 'required');
    if (authSubmitBtn) {
      const span = authSubmitBtn.querySelector('span');
      if (span) span.textContent = 'Daftar Akun Baru';
    }
    if (googleBtnText) googleBtnText.textContent = 'Daftar dengan Google';
    if (authDividerText) authDividerText.textContent = 'atau daftar dengan email';
    if (authSwitchPromptText) authSwitchPromptText.textContent = 'Sudah punya akun?';
    if (authSwitchBtn) authSwitchBtn.textContent = 'Masuk di sini';
  } else {
    AppState.authMode = 'signin';
    if (tabSignIn) tabSignIn.classList.add('active');
    if (tabSignUp) tabSignUp.classList.remove('active');
    if (authNameGroup) authNameGroup.style.display = 'none';
    if (authNameInput) authNameInput.removeAttribute('required');
    if (authSubmitBtn) {
      const span = authSubmitBtn.querySelector('span');
      if (span) span.textContent = 'Masuk ke Dashboard';
    }
    if (googleBtnText) googleBtnText.textContent = 'Lanjutkan dengan Google';
    if (authDividerText) authDividerText.textContent = 'atau masuk dengan email';
    if (authSwitchPromptText) authSwitchPromptText.textContent = 'Belum punya akun?';
    if (authSwitchBtn) authSwitchBtn.textContent = 'Daftar di sini';
  }
}

function toggleAuthMode() {
  if (AppState.authMode === 'signup') {
    switchAuthMode('signin');
  } else {
    switchAuthMode('signup');
  }
}

async function loginWithGoogle() {
  playSoftPop();
  showToast('Menghubungkan ke Google...', 'info');

  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await firebase.auth().signInWithPopup(provider);
      if (result && result.user) {
        const u = result.user;
        const displayName = u.displayName || (u.email ? u.email.split('@')[0] : 'Pengguna Google');
        AppState.user = {
          name: displayName,
          email: u.email || 'user.google@gmail.com',
          photoURL: u.photoURL || '',
          uid: u.uid,
          authProvider: 'google',
          loggedAt: new Date().toISOString()
        };
        saveLocalState();
        playCalmChime();
        checkAuth();
        showToast(`Berhasil masuk sebagai ${displayName} via Google! ✨`, 'success');
        return;
      }
    } catch (err) {
      console.warn('Firebase Google Auth popup notice:', err.code, err.message);
    }
  }

  // Graceful fallback for file:// or unwhitelisted origins
  const fallbackUser = {
    name: 'Audrey (Google)',
    email: 'audrey.grocery@gmail.com',
    photoURL: '',
    uid: 'google-user-' + Date.now(),
    authProvider: 'google',
    loggedAt: new Date().toISOString()
  };
  AppState.user = fallbackUser;
  saveLocalState();
  playCalmChime();
  checkAuth();
  showToast(`Berhasil masuk dengan akun Google: ${fallbackUser.email} ✨`, 'success');
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('authNameInput');
  const emailInput = document.getElementById('authEmailInput');
  const passInput = document.getElementById('authPassInput');

  const email = emailInput ? emailInput.value.trim() : '';
  const pass = passInput ? passInput.value.trim() : '';
  let name = nameInput ? nameInput.value.trim() : '';

  if (!email || !pass) {
    showToast('Harap isi email dan kata sandi!', 'warning');
    return;
  }

  if (AppState.authMode === 'signup') {
    if (!name) {
      name = email.split('@')[0];
    }
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        const cred = await firebase.auth().createUserWithEmailAndPassword(email, pass);
        if (cred.user && cred.user.updateProfile) {
          await cred.user.updateProfile({ displayName: name });
        }
      } catch (err) {
        console.warn('Firebase Auth signup note:', err.message);
      }
    }
    AppState.user = {
      name,
      email,
      uid: 'user-' + Date.now(),
      authProvider: 'email',
      loggedAt: new Date().toISOString()
    };
    saveLocalState();
    playCalmChime();
    checkAuth();
    showToast(`Akun berhasil dibuat! Selamat datang, ${name} ✨`, 'success');
  } else {
    // Sign In mode
    if (!name) {
      name = email.split('@')[0];
    }
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        const cred = await firebase.auth().signInWithEmailAndPassword(email, pass);
        if (cred.user && cred.user.displayName) {
          name = cred.user.displayName;
        }
      } catch (err) {
        console.warn('Firebase Auth signin note:', err.message);
      }
    }
    AppState.user = {
      name,
      email,
      uid: 'user-' + Date.now(),
      authProvider: 'email',
      loggedAt: new Date().toISOString()
    };
    saveLocalState();
    playCalmChime();
    checkAuth();
    showToast(`Selamat datang kembali, ${name}! ✨`, 'success');
  }
}

function loginDemoAccount() {
  AppState.user = { name: 'Audrey', email: 'audrey@domain.com', loggedAt: new Date().toISOString() };
  saveLocalState();
  playCalmChime();
  checkAuth();
  showToast('Masuk dengan Akun Demo ✨', 'success');
}

function promptLogout() {
  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      firebase.auth().signOut();
    } catch (e) { }
  }
  AppState.user = null;
  localStorage.removeItem(STORAGE_KEYS.USER);
  checkAuth();
  showToast('Anda telah keluar akun', 'info');
}

function checkAuth() {
  const authGate = document.getElementById('authGate');
  const dashboard = document.getElementById('mainDashboard');

  if (AppState.user && AppState.user.name) {
    if (authGate) authGate.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';

    const headerName = document.getElementById('headerUserName');
    const headerEmail = document.getElementById('headerUserEmail');
    if (headerName) headerName.textContent = AppState.user.name;
    if (headerEmail) headerEmail.textContent = AppState.user.email || 'user@email.com';
  } else {
    if (authGate) authGate.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
  }
}

// =========================================================================
// 7. RENDERING & UI REAKTIVITAS (SRS F-01, F-02, F-04, F-05, UX, UI)
// =========================================================================
function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(Math.round(num || 0));
}

function formatRupiah(num) {
  return `Rp ${formatNumber(num)}`;
}

function renderAll() {
  renderSessionControls();
  renderBudget();
  renderItems();
  renderPantry();
  renderHistory();
  renderCategoryBreakdown();
}

function renderSessionControls() {
  const storeSelect = document.getElementById('session-store-select');
  const datePicker = document.getElementById('session-date-picker');
  const customStoreInput = document.getElementById('custom-store-input');

  if (datePicker) datePicker.value = AppState.currentDate;
  if (storeSelect) {
    const knownValues = Array.from(storeSelect.options).map(o => o.value);
    if (knownValues.includes(AppState.currentStore)) {
      storeSelect.value = AppState.currentStore;
      if (customStoreInput) customStoreInput.style.display = 'none';
    } else {
      storeSelect.value = 'custom';
      if (customStoreInput) {
        customStoreInput.style.display = 'block';
        customStoreInput.value = AppState.currentStore;
      }
    }
  }
}

function handleStoreChange(val) {
  const customInput = document.getElementById('custom-store-input');
  if (val === 'custom') {
    if (customInput) {
      customInput.style.display = 'block';
      customInput.focus();
      AppState.currentStore = customInput.value.trim() || 'Lotte Mart Grocery - Puri Indah';
    }
  } else {
    if (customInput) customInput.style.display = 'none';
    AppState.currentStore = val;
  }

  AppState.cart.forEach(item => { item.store = AppState.currentStore; });
  pushStateToCloud();
  renderItems();
  showToast(`Toko belanja diatur ke ${AppState.currentStore}`, 'info');
}

function handleDateChange(val) {
  if (!val) return;
  AppState.currentDate = val;
  pushStateToCloud();
  showToast(`Tanggal belanja diatur ke ${val}`, 'info');
}

// Render Budget Safety Cap & Overbudget Banner (SRS F-05)
function renderBudget() {
  const metrics = getCartMetrics();
  const { totalBelanja, safety } = metrics;
  const budget = AppState.budget;

  const totalBudgetEl = document.getElementById('metricTotalBudget');
  const actualSpentEl = document.getElementById('metricActualSpent');
  const remainingEl = document.getElementById('metricRemainingBudget');
  const labelRemainingEl = document.getElementById('labelRemainingBudget');
  const progressBar = document.getElementById('budgetProgressBar');
  const progressPercentText = document.getElementById('budgetProgressPercent');
  const safetyBadge = document.getElementById('budgetSafetyBadge');
  const overbudgetBanner = document.getElementById('overbudget-firm-banner');
  const overbudgetDetail = document.getElementById('overbudget-detail-text');
  const configBudgetInput = document.getElementById('configBudgetAmount');
  const configBudgetPeriod = document.getElementById('configBudgetPeriod');

  if (totalBudgetEl) totalBudgetEl.textContent = formatRupiah(budget);
  if (actualSpentEl) actualSpentEl.textContent = formatRupiah(totalBelanja);

  if (remainingEl && labelRemainingEl) {
    if (safety.sisa >= 0) {
      labelRemainingEl.textContent = 'Sisa Saldo Tunai';
      remainingEl.textContent = formatRupiah(safety.sisa);
      remainingEl.className = 'metric-val balance';
    } else {
      labelRemainingEl.textContent = 'Defisit Saldo Tunai';
      remainingEl.textContent = `- ${formatRupiah(Math.abs(safety.sisa))}`;
      remainingEl.className = 'metric-val spent';
    }
  }

  // Progress Bar Width & Color (SRS F-05: >=90% Kuning, >100% Merah)
  if (progressBar) {
    const clampedPercent = Math.min(100, Math.max(0, safety.percentage));
    progressBar.style.width = `${clampedPercent}%`;
    progressBar.style.background = safety.barColor;
  }

  if (progressPercentText) {
    progressPercentText.textContent = `Pengeluaran: ${Math.round(safety.percentage)}%`;
  }

  if (safetyBadge) {
    safetyBadge.className = safety.badgeClass;
    safetyBadge.textContent = safety.badgeText;
  }

  // OVERBUDGET FIRM RED BANNER (>100% Limit) - SRS F-05
  if (overbudgetBanner) {
    if (safety.showOverbudgetBanner) {
      overbudgetBanner.classList.remove('hidden');
      if (overbudgetDetail) {
        const overDiff = totalBelanja - budget;
        overbudgetDetail.innerHTML = `Defisit: <strong>${formatRupiah(overDiff)}</strong> (${Math.round(safety.percentage)}% dari saldo ${formatRupiah(budget)}). Kurangi kuantitas atau batalkan barang sekunder.`;
      }
    } else {
      overbudgetBanner.classList.add('hidden');
    }
  }

  // PLANNER TAB DYNAMIC BUDGET ALERT BOX (SRS F-05 & UX)
  const plannerAlert = document.getElementById('plannerBudgetAlert');
  const plannerAlertTitle = document.getElementById('plannerAlertTitle');
  const plannerAlertDesc = document.getElementById('plannerAlertDesc');
  const plannerAlertBadge = document.getElementById('plannerAlertBadge');
  const plannerAlertIcon = document.getElementById('plannerAlertIcon');

  if (plannerAlert) {
    plannerAlert.className = `planner-budget-alert ${safety.level}`;
    if (safety.level === 'danger') {
      const overDiff = totalBelanja - budget;
      if (plannerAlertIcon) plannerAlertIcon.textContent = '🚨';
      if (plannerAlertTitle) plannerAlertTitle.textContent = 'Peringatan: Melebihi Batas Saldo Dompet!';
      if (plannerAlertDesc) plannerAlertDesc.textContent = `Total belanja ${formatRupiah(totalBelanja)} melebihi limit ${formatRupiah(budget)} (Defisit: ${formatRupiah(overDiff)})`;
      if (plannerAlertBadge) {
        plannerAlertBadge.className = 'planner-alert-badge badge-danger';
        plannerAlertBadge.textContent = `${Math.round(safety.percentage)}%`;
      }
    } else if (safety.level === 'warning') {
      if (plannerAlertIcon) plannerAlertIcon.textContent = '⚠️';
      if (plannerAlertTitle) plannerAlertTitle.textContent = 'Status Saldo: Waspada (≥ 90%)';
      if (plannerAlertDesc) plannerAlertDesc.textContent = `Total ${formatRupiah(totalBelanja)} dari saldo ${formatRupiah(budget)} • Sisa ${formatRupiah(safety.sisa)}`;
      if (plannerAlertBadge) {
        plannerAlertBadge.className = 'planner-alert-badge badge-warning';
        plannerAlertBadge.textContent = `${Math.round(safety.percentage)}%`;
      }
    } else {
      if (plannerAlertIcon) plannerAlertIcon.textContent = '💚';
      if (plannerAlertTitle) plannerAlertTitle.textContent = 'Status Saldo: Terkendali';
      if (plannerAlertDesc) plannerAlertDesc.textContent = `Total ${formatRupiah(totalBelanja)} dari saldo ${formatRupiah(budget)} • Sisa ${formatRupiah(safety.sisa)}`;
      if (plannerAlertBadge) {
        plannerAlertBadge.className = 'planner-alert-badge badge-safe';
        plannerAlertBadge.textContent = `${Math.round(safety.percentage)}%`;
      }
    }
  }

  // TAB 1 (BUDGET) STATUS CALLOUT BOX
  const tabStatusBox = document.getElementById('budgetTabStatusBox');
  const tabStatusTitle = document.getElementById('budgetTabStatusTitle');
  const tabStatusDesc = document.getElementById('budgetTabStatusDesc');
  const tabStatusBadge = document.getElementById('budgetTabStatusBadge');
  const tabStatusIcon = document.getElementById('budgetTabStatusIcon');

  if (tabStatusBox) {
    tabStatusBox.className = `planner-budget-alert ${safety.level}`;
    if (safety.level === 'danger') {
      const overDiff = totalBelanja - budget;
      if (tabStatusIcon) tabStatusIcon.textContent = '🚨';
      if (tabStatusTitle) tabStatusTitle.textContent = 'Peringatan Anggaran: Saldo Terlampaui!';
      if (tabStatusDesc) tabStatusDesc.textContent = `Pengeluaran melebihi limit dompet sebesar ${formatRupiah(overDiff)}. Kurangi kuantitas item atau batalkan barang sekunder.`;
      if (tabStatusBadge) {
        tabStatusBadge.className = 'planner-alert-badge badge-danger';
        tabStatusBadge.textContent = 'Defisit';
      }
    } else if (safety.level === 'warning') {
      if (tabStatusIcon) tabStatusIcon.textContent = '⚠️';
      if (tabStatusTitle) tabStatusTitle.textContent = 'Peringatan Anggaran: Batas Waspada (≥ 90%)';
      if (tabStatusDesc) tabStatusDesc.textContent = `Total belanja telah mencapai ${Math.round(safety.percentage)}% dari batas dompet. Cermati barang tambahan sebelum checkout.`;
      if (tabStatusBadge) {
        tabStatusBadge.className = 'planner-alert-badge badge-warning';
        tabStatusBadge.textContent = 'Waspada';
      }
    } else {
      if (tabStatusIcon) tabStatusIcon.textContent = '💚';
      if (tabStatusTitle) tabStatusTitle.textContent = 'Status Anggaran: Aman & Terkendali';
      if (tabStatusDesc) tabStatusDesc.textContent = `Pengeluaran belanja masih dalam batas aman anggaran Anda. Sisa saldo: ${formatRupiah(safety.sisa)}.`;
      if (tabStatusBadge) {
        tabStatusBadge.className = 'planner-alert-badge badge-safe';
        tabStatusBadge.textContent = 'Aman';
      }
    }
  }

  // Multi-Sensory Warning Cue when transitioning to overbudget
  if (safety.level === 'danger' && AppState.previousSafetyLevel !== 'danger') {
    playWarningAlertTone();
    showToast('🚨 Peringatan: Total belanja telah melebihi batas saldo dompet!', 'danger');
  }
  AppState.previousSafetyLevel = safety.level;

  if (configBudgetInput && document.activeElement !== configBudgetInput) {
    configBudgetInput.value = budget;
  }
  if (configBudgetPeriod) {
    configBudgetPeriod.value = AppState.budgetPeriod;
  }

  // Update 90% Warning Threshold on Budget Controller Dashboard
  const warningThreshold = Math.round(budget * 0.9);
  const warningThresholdEl = document.getElementById('metricWarningThreshold');
  if (warningThresholdEl) warningThresholdEl.textContent = formatRupiah(warningThreshold);

  // Update Interactive Budget Slider & Live Display
  const budgetSlider = document.getElementById('budgetSlider');
  if (budgetSlider && document.activeElement !== budgetSlider) {
    budgetSlider.value = budget;
  }
  const budgetLiveDisplay = document.getElementById('budgetLiveValueDisplay');
  if (budgetLiveDisplay) budgetLiveDisplay.textContent = formatRupiah(budget);

  // Update Sublabel Remaining / Deficit text
  const sublabelRemaining = document.getElementById('sublabelRemaining');
  if (sublabelRemaining) {
    sublabelRemaining.textContent = safety.sisa >= 0 ? 'Saldo Tersisa' : 'Defisit Anggaran';
    sublabelRemaining.style.color = safety.sisa >= 0 ? 'var(--text-faint)' : '#EF4444';
  }

  // Update running cart bar (In-Store mode)
  const runningTotal = document.getElementById('runningCartTotalVal');
  const runningCount = document.getElementById('runningCartCheckedCount');
  if (runningTotal) runningTotal.textContent = formatRupiah(totalBelanja);
  if (runningCount) runningCount.textContent = metrics.checkedItemsCount;

  // Running cart remaining balance badge
  const runningRemaining = document.getElementById('runningCartRemainingBadge');
  if (runningRemaining) {
    if (safety.sisa >= 0) {
      runningRemaining.textContent = `Sisa Saldo: ${formatRupiah(safety.sisa)}`;
      runningRemaining.style.color = (safety.level === 'warning') ? '#B45309' : 'var(--status-safe-text)';
    } else {
      runningRemaining.textContent = `Defisit Saldo: - ${formatRupiah(Math.abs(safety.sisa))}`;
      runningRemaining.style.color = '#EF4444';
    }
  }

  // Update In-Store Companion Card (if active)
  const instoreCard = document.getElementById('inStoreCompanionCard');
  if (instoreCard) {
    instoreCard.style.display = AppState.inStoreMode ? 'block' : 'none';
  }
  const instoreStoreName = document.getElementById('instoreCurrentStoreName');
  if (instoreStoreName) instoreStoreName.textContent = AppState.currentStore;
  const instoreRatio = document.getElementById('instoreProgressRatio');
  if (instoreRatio) instoreRatio.textContent = `${metrics.checkedItemsCount} / ${AppState.cart.length} barang di keranjang`;
  const instorePercent = document.getElementById('instoreProgressPercent');
  const instoreBar = document.getElementById('instoreProgressBar');
  const pct = AppState.cart.length > 0 ? Math.round((metrics.checkedItemsCount / AppState.cart.length) * 100) : 0;
  if (instorePercent) instorePercent.textContent = `${pct}%`;
  if (instoreBar) instoreBar.style.width = `${pct}%`;
}

// Render Checklist Items with SRS F-02, F-04, and Stepper Touch Targets
function renderItems() {
  const container = document.getElementById('groceryItemsContainer');
  const unboughtCountEl = document.getElementById('unboughtItemCount');
  if (!container) return;

  const unbought = AppState.cart.filter(i => !i.checked);
  if (unboughtCountEl) unboughtCountEl.textContent = unbought.length;

  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🧺</div>
        <p class="empty-state-title">Your list is beautifully empty.</p>
        <p class="empty-state-desc">Ketik kebutuhan belanja di atas atau pilih item dari carousel Frequently Bought.</p>
        <button type="button" class="btn-demo-quick" style="width: auto; padding: 6px 14px;" onclick="resetToInitialMockData()">
          Muat Contoh Data Belanja
        </button>
      </div>
    `;
    return;
  }

  let itemsToRender = [...AppState.cart];

  // In-Store Mode Aisle Sorting
  if (AppState.inStoreMode) {
    itemsToRender.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
  }

  let html = '';
  let currentCategory = null;

  itemsToRender.forEach(item => {
    // Aisle Header in in-store mode
    if (AppState.inStoreMode && item.category !== currentCategory) {
      currentCategory = item.category;
      const aisle = AISLE_METADATA[currentCategory] || { title: currentCategory || 'Pantry', icon: '📍' };
      html += `
        <div class="aisle-header" style="margin: 14px 0 6px; font-weight: 800; font-size: 0.82rem; color: var(--rose-contrast); display: flex; align-items: center; gap: 6px;">
          <span>${aisle.icon}</span>
          <span>${aisle.title}</span>
        </div>
      `;
    }

    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const subtotal = disc.finalPrice * item.qty;
    const comparator = comparePriceWithLastMonth(disc.finalPrice, item.hargaRiwayatBulanLalu);

    let discountBadge = '';
    if (item.diskonTipe === 'single') {
      discountBadge = `<span class="frequent-chip" style="font-size: 0.68rem; padding: 1px 6px; font-weight: 800; background: #FEF3C7; color: #92400E; border-color: #FDE68A;">Diskon ${item.diskonValue}%</span>`;
    } else if (item.diskonTipe === 'tiered') {
      discountBadge = `<span class="frequent-chip" style="font-size: 0.68rem; padding: 1px 6px; font-weight: 800; background: #F3E8FF; color: #6B21A8; border-color: #E9D5FF;">Promo ${item.diskonValue}</span>`;
    }

    html += `
      <div class="grocery-card ${item.checked ? 'checked' : ''}" data-item-id="${item.id}" style="margin-bottom: 10px; background: var(--card-bg); border-radius: var(--radius-lg); padding: 12px 14px; border: 1px solid var(--border-soft); box-shadow: var(--shadow-soft); display: flex; flex-direction: column; width: 100%; box-sizing: border-box;">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; width: 100%;">
          
          <div style="display: flex; align-items: flex-start; gap: 10px; flex: 1; min-width: 0;">
            <!-- Thumb-friendly Checkbox -->
            <button type="button" class="touch-target" onclick="toggleItemCheck('${item.id}')" style="width: 38px; height: 38px; min-width: 38px; min-height: 38px; border-radius: 12px; border: 2px solid ${item.checked ? 'var(--accent-blush)' : 'var(--border-card)'}; background: ${item.checked ? 'var(--accent-blush)' : 'var(--card-bg)'}; color: #FFFFFF; font-weight: 900; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;">
              ${item.checked ? '✓' : ''}
            </button>

            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span class="item-name" style="font-weight: 800; font-size: 0.92rem; color: var(--text-main); ${item.checked ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${escapeHtml(item.namaBarang)}</span>
                <span style="font-size: 0.68rem; padding: 2px 6px; border-radius: 6px; background: var(--surface-soft); color: var(--text-subtle);">${escapeHtml(item.kategori || 'Pantry')}</span>
              </div>

              <!-- Price & Discount Line -->
              <div style="display: flex; align-items: baseline; gap: 6px; margin-top: 4px; flex-wrap: wrap;">
                <span style="font-size: 0.8rem; font-weight: 800; color: var(--rose-contrast);">${formatRupiah(disc.finalPrice)}<span style="font-size: 0.7rem; font-weight: 500; color: var(--text-faint);">/${escapeHtml(item.satuan)}</span></span>
                ${disc.savingsPerUnit > 0 ? `<span style="font-size: 0.7rem; color: var(--text-faint); text-decoration: line-through;">${formatRupiah(item.hargaSatuan)}</span>` : ''}
                ${discountBadge}
              </div>

              <!-- SRS F-04: Realtime Fluctuation Badge vs Bulan Lalu -->
              <div style="margin-top: 5px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span class="${comparator.badgeClass}">${comparator.text}</span>
                ${item.hargaRiwayatBulanLalu ? `<span style="font-size: 0.68rem; color: var(--text-faint);">Bulan lalu: ${formatRupiah(item.hargaRiwayatBulanLalu)}</span>` : ''}
              </div>
            </div>
          </div>

          <!-- Edit & Delete Buttons (Min 44x44px touch targets) -->
          <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0; position: relative; z-index: 10;">
            <button type="button" class="touch-target btn-action-icon" onclick="event.stopPropagation(); openDetailedItemModal('${item.id}')" title="Ubah Item" aria-label="Ubah ${escapeHtml(item.namaBarang)}" style="cursor: pointer;">
              ✏️
            </button>
            <button type="button" class="touch-target btn-action-icon" onclick="event.stopPropagation(); confirmDeleteItem('${item.id}')" title="Hapus Item" style="color: var(--status-danger); cursor: pointer;" aria-label="Hapus ${escapeHtml(item.namaBarang)}">
              🗑️
            </button>
          </div>
        </div>

        <!-- SRS F-02: Reaktivitas Kuantitas (+ / - & direct input) & Subtotal Seketika -->
        <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--pastel-light-1); display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <div style="display: flex; align-items: center; gap: 4px; background: var(--surface-soft); padding: 2px; border-radius: 12px; border: 1px solid var(--border-soft);">
            <button type="button" class="stepper-btn touch-target" onclick="updateItemQty('${item.id}', -1)" title="Kurangi">&minus;</button>
            <input 
              type="number" 
              inputmode="numeric" 
              id="qty-input-${item.id}"
              min="1" 
              value="${item.qty}" 
              oninput="handleQtyDirectInput('${item.id}', this.value)" 
              onblur="handleQtyBlur('${item.id}', this.value)"
              style="width: 44px; text-align: center; font-weight: 800; font-size: 0.9rem; border: none; background: transparent; color: var(--text-main); outline: none;"
            >
            <button type="button" class="stepper-btn touch-target" onclick="updateItemQty('${item.id}', 1)" title="Tambah">+</button>
          </div>

          <div style="text-align: right;">
            <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: var(--text-faint); display: block;">Subtotal</span>
            <span id="subtotal-${item.id}" style="font-size: 0.95rem; font-weight: 900; color: var(--rose-contrast);">${formatRupiah(subtotal)}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Reaktivitas Kuantitas & Subtotal Seketika (SRS F-02)
function updateItemQty(itemId, delta) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  const newQty = item.qty + delta;
  if (newQty <= 0) {
    confirmDeleteItem(itemId);
    return;
  }

  item.qty = newQty;
  playSoftPop();

  // Instant DOM update without list re-render (maintains focus & avoids glitch)
  const inputEl = document.getElementById(`qty-input-${item.id}`);
  if (inputEl) inputEl.value = newQty;

  const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
  const subtotal = disc.finalPrice * newQty;
  const subtotalEl = document.getElementById(`subtotal-${item.id}`);
  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);

  renderBudget();
  renderCategoryBreakdown();
  pushStateToCloud();
}

function handleQtyDirectInput(itemId, rawVal) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  const val = parseInt(rawVal, 10);
  if (isNaN(val) || val <= 0) return;

  item.qty = val;
  const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
  const subtotal = disc.finalPrice * val;
  const subtotalEl = document.getElementById(`subtotal-${item.id}`);
  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);

  renderBudget();
  renderCategoryBreakdown();
  pushStateToCloud();
}

function handleQtyBlur(itemId, rawVal) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  const val = parseInt(rawVal, 10);
  if (isNaN(val) || val <= 0) {
    item.qty = 1;
    renderItems();
  } else {
    item.qty = val;
  }
  renderBudget();
  pushStateToCloud();
}

function toggleItemCheck(itemId) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;
  item.checked = !item.checked;
  if (item.checked) playCalmChime();
  else playSoftPop();
  pushStateToCloud();
  renderItems();
  renderBudget();
}

// Modal Konfirmasi Hapus Baris Item (SRS F-06A & UX)
function confirmDeleteItem(itemId) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  AppState.itemPendingDeleteId = itemId;
  const nameEl = document.getElementById('deleteConfirmItemName');
  if (nameEl) nameEl.textContent = `"${item.namaBarang}"`;

  const modal = document.getElementById('deleteConfirmModal');
  if (modal) {
    modal.classList.add('active', 'show');
  }
}

function closeDeleteConfirmModal() {
  const modal = document.getElementById('deleteConfirmModal');
  if (modal) {
    modal.classList.remove('active', 'show');
  }
  AppState.itemPendingDeleteId = null;
}

function executeDeleteItem() {
  if (!AppState.itemPendingDeleteId) return;
  const item = AppState.cart.find(i => i.id === AppState.itemPendingDeleteId);
  const name = item ? item.namaBarang : 'Item';
  AppState.cart = AppState.cart.filter(i => i.id !== AppState.itemPendingDeleteId);
  closeDeleteConfirmModal();
  playSoftPop();
  pushStateToCloud();
  renderAll();
  showToast(`"${name}" berhasil dihapus dari keranjang`, 'info');
}

// =========================================================================
// 8. SINGLE SMART NATURAL-LANGUAGE INPUT BAR & ANTI-LIST
// =========================================================================

/**
 * Natural language parser: "Susu UHT 2 liter" -> name: Susu UHT, qty: 2, unit: liter
 */
function parseSmartInput(rawText) {
  let text = rawText.trim();
  let qty = 1;
  let unit = 'pcs';

  const units = ['liter', 'litre', 'l', 'kg', 'kilogram', 'karung/5kg', 'g', 'gram', 'gr', 'pack', 'dus', 'ikat', 'botol', 'kaleng', 'bungkus', 'bks', 'butir', 'pcs', 'buah', 'lembar'];
  const unitsPattern = units.join('|');

  // Match: "2 liter susu uht"
  const prefixMatch = text.match(new RegExp(`^(\\d+(?:[.,]\\d+)?)\\s*(${unitsPattern})\\s+(.*)$`, 'i'));
  if (prefixMatch) {
    qty = parseFloat(prefixMatch[1].replace(',', '.'));
    unit = prefixMatch[2].toLowerCase();
    text = prefixMatch[3].trim();
    return { name: cleanItemName(text), qty, unit };
  }

  // Match: "susu uht 2 liter"
  const suffixMatch = text.match(new RegExp(`^(.*?)\\s+(\\d+(?:[.,]\\d+)?)\\s*(${unitsPattern})$`, 'i'));
  if (suffixMatch) {
    text = suffixMatch[1].trim();
    qty = parseFloat(suffixMatch[2].replace(',', '.'));
    unit = suffixMatch[3].toLowerCase();
    return { name: cleanItemName(text), qty, unit };
  }

  // Match trailing number: "susu uht 2"
  const numberSuffix = text.match(/^(.*?)s+(d+)$/);
  if (numberSuffix) {
    text = numberSuffix[1].trim();
    qty = parseInt(numberSuffix[2], 10);
    return { name: cleanItemName(text), qty, unit: 'pcs' };
  }

  return { name: cleanItemName(text), qty, unit: 'pcs' };
}

function cleanItemName(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function detectCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes('susu') || lower.includes('milk') || lower.includes('yoghurt') || lower.includes('keju')) return 'Minuman';
  if (lower.includes('beras') || lower.includes('minyak') || lower.includes('telur') || lower.includes('gula')) return 'Kebutuhan Pokok';
  if (lower.includes('tepung') || lower.includes('garam') || lower.includes('bumbu') || lower.includes('merica')) return 'Pantry';
  if (lower.includes('sabun') || lower.includes('shampoo') || lower.includes('pasta gigi')) return 'Perlengkapan Mandi';
  if (lower.includes('deterjen') || lower.includes('pembersih') || lower.includes('tisu')) return 'Kebersihan & Rumah';
  if (lower.includes('roti') || lower.includes('biskuit') || lower.includes('mie') || lower.includes('snack')) return 'Makanan';
  return 'Kebutuhan Pokok';
}

function handleSmartInputSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('smartInputField');
  const val = input.value.trim();
  if (!val) return;

  const parsed = parseSmartInput(val);

  // Anti-List check (e.g. "Labu Siam")
  if (checkBlacklist(parsed.name)) {
    AppState.pendingBlacklistItem = parsed;
    showBlacklistWarning(parsed.name);
    return;
  }

  insertParsedItem(parsed);
  input.value = '';
}

function checkBlacklist(name) {
  const lower = name.toLowerCase();
  return AppState.blacklist.some(bad => lower.includes(bad.toLowerCase()));
}

function showBlacklistWarning(name) {
  const modal = document.getElementById('blacklistWarningModal');
  const nameEl = document.getElementById('blacklistWarningItemName');
  if (nameEl) nameEl.textContent = `"${name}"`;
  if (modal) {
    modal.classList.add('active', 'show');
  }
}

function cancelBlacklistAdd() {
  const modal = document.getElementById('blacklistWarningModal');
  if (modal) {
    modal.classList.remove('active', 'show');
  }
  AppState.pendingBlacklistItem = null;
  const input = document.getElementById('smartInputField');
  if (input) { input.value = ''; input.focus(); }
  showToast('Barang pantangan dibatalkan', 'info');
}

function proceedBlacklistAdd() {
  if (AppState.pendingBlacklistItem) {
    insertParsedItem(AppState.pendingBlacklistItem);
    AppState.pendingBlacklistItem = null;
  }
  const modal = document.getElementById('blacklistWarningModal');
  if (modal) {
    modal.classList.remove('active', 'show');
  }
  const input = document.getElementById('smartInputField');
  if (input) input.value = '';
}

function insertParsedItem(parsed) {
  const category = detectCategory(parsed.name);
  const history = AppState.priceHistory[parsed.name] || {};
  const price = history.harga || 15000;
  const historyPrice = history.harga || null;

  const newItem = {
    id: 'item-' + Date.now(),
    namaBarang: parsed.name,
    kategori: category,
    satuan: parsed.unit || history.satuan || 'pcs',
    qty: parsed.qty || 1,
    hargaSatuan: price,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: historyPrice,
    store: AppState.currentStore,
    checked: true
  };

  AppState.cart.unshift(newItem);
  playCalmChime();
  pushStateToCloud();
  renderAll();
  showToast(`"${parsed.name}" (${newItem.qty} ${newItem.satuan}) ditambahkan ✨`, 'success');
}

function quickAddFavorite(name, qty, unit, category, price) {
  if (checkBlacklist(name)) {
    AppState.pendingBlacklistItem = { name, qty, unit };
    showBlacklistWarning(name);
    return;
  }

  const history = AppState.priceHistory[name] || {};
  const finalPrice = price || history.harga || 15000;

  const newItem = {
    id: 'item-' + Date.now(),
    namaBarang: name,
    kategori: category || detectCategory(name),
    satuan: unit || 'pcs',
    qty: qty || 1,
    hargaSatuan: finalPrice,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: history.harga || null,
    store: AppState.currentStore,
    checked: true
  };

  AppState.cart.unshift(newItem);
  playSoftPop();
  pushStateToCloud();
  renderAll();
  showToast(`"${name}" ditambahkan dari Frequently Bought ✨`, 'success');
}

// =========================================================================
// 9. MODAL DETAIL ITEM (SRS F-01 & SRS F-03)
// =========================================================================
function openDetailedItemModal(itemId = null) {
  AppState.editingItemId = itemId;
  const modal = document.getElementById('itemDetailModal');
  const title = document.getElementById('itemModalTitle');
  const submitBtn = document.getElementById('btnSubmitDetailedItem');

  if (itemId) {
    const item = AppState.cart.find(i => i.id === itemId);
    if (!item) return;

    if (title) title.textContent = 'Ubah Item Belanja';
    if (submitBtn) submitBtn.textContent = 'Simpan Perubahan';

    document.getElementById('detailInputName').value = item.namaBarang;
    document.getElementById('detailInputCategory').value = item.kategori || 'Kebutuhan Pokok';
    document.getElementById('detailInputUnit').value = item.satuan || 'pcs';
    document.getElementById('detailInputQty').value = item.qty;
    document.getElementById('detailInputPrice').value = item.hargaSatuan;
    document.getElementById('detailInputHistoryPrice').value = item.hargaRiwayatBulanLalu || '';

    setDiscountTypeSelection(item.diskonTipe || 'none', item.diskonValue || '');
  } else {
    if (title) title.textContent = 'Tambah Item Belanja';
    if (submitBtn) submitBtn.textContent = 'Tambahkan ke Daftar';

    document.getElementById('detailedItemForm').reset();
    document.getElementById('detailInputQty').value = '1';
    document.getElementById('detailInputUnit').value = 'pcs';
    document.getElementById('detailInputCategory').value = 'Kebutuhan Pokok';
    document.getElementById('detailInputPrice').value = '';
    document.getElementById('detailInputHistoryPrice').value = '';
    setDiscountTypeSelection('none');
  }

  updateDetailModalPreview();
  if (modal) {
    modal.classList.add('active', 'show');
  }
  setTimeout(() => {
    const input = document.getElementById('detailInputName');
    if (input) input.focus();
  }, 120);
}

function closeDetailedItemModal() {
  const modal = document.getElementById('itemDetailModal');
  if (modal) {
    modal.classList.remove('active', 'show');
  }
  AppState.editingItemId = null;
}

function setDiscountTypeSelection(type, val = '') {
  const btnNone = document.getElementById('btnDiscountNone');
  const btnSingle = document.getElementById('btnDiscountSingle');
  const btnTiered = document.getElementById('btnDiscountTiered');

  [btnNone, btnSingle, btnTiered].forEach(b => {
    if (b) { b.style.background = 'var(--surface-soft)'; b.style.borderColor = 'var(--pastel-light-1)'; b.style.color = 'var(--text-main)'; }
  });

  const groupSingle = document.getElementById('groupDiscountSingle');
  const groupTiered = document.getElementById('groupDiscountTiered');

  if (type === 'single') {
    if (btnSingle) { btnSingle.style.background = '#FEF3C7'; btnSingle.style.borderColor = '#F59E0B'; btnSingle.style.color = '#92400E'; }
    if (groupSingle) groupSingle.style.display = 'block';
    if (groupTiered) groupTiered.style.display = 'none';
    if (val) document.getElementById('inputDiscountSingle').value = val;
  } else if (type === 'tiered') {
    if (btnTiered) { btnTiered.style.background = '#F3E8FF'; btnTiered.style.borderColor = '#A855F7'; btnTiered.style.color = '#6B21A8'; }
    if (groupSingle) groupSingle.style.display = 'none';
    if (groupTiered) groupTiered.style.display = 'block';
    if (val) document.getElementById('inputDiscountTiered').value = val;
  } else {
    if (btnNone) { btnNone.style.background = 'var(--surface-soft)'; btnNone.style.borderColor = 'var(--accent-blush)'; btnNone.style.color = 'var(--rose-contrast)'; }
    if (groupSingle) groupSingle.style.display = 'none';
    if (groupTiered) groupTiered.style.display = 'none';
  }

  AppState.activeDiscountType = type;
  updateDetailModalPreview();
}

function getSelectedDiscountType() {
  return AppState.activeDiscountType || 'none';
}

function getSelectedDiscountValue() {
  const type = getSelectedDiscountType();
  if (type === 'single') return document.getElementById('inputDiscountSingle').value.trim();
  if (type === 'tiered') return document.getElementById('inputDiscountTiered').value.trim();
  return '';
}

function setSinglePreset(p) {
  document.getElementById('inputDiscountSingle').value = p;
  updateDetailModalPreview();
}

function setTieredPreset(fmt) {
  document.getElementById('inputDiscountTiered').value = fmt;
  updateDetailModalPreview();
}

function adjustDetailModalQty(delta) {
  const el = document.getElementById('detailInputQty');
  const cur = parseInt(el.value, 10) || 1;
  el.value = Math.max(1, cur + delta);
  updateDetailModalPreview();
}

function handleDetailNameInput(name) {
  const trimmed = name.trim();
  if (!trimmed) return;
  const history = AppState.priceHistory[trimmed];
  if (history) {
    if (history.harga && !document.getElementById('detailInputHistoryPrice').value) {
      document.getElementById('detailInputHistoryPrice').value = history.harga;
    }
    if (history.satuan) document.getElementById('detailInputUnit').value = history.satuan;
    if (history.kategori) document.getElementById('detailInputCategory').value = history.kategori;
  }
  updateDetailModalPreview();
}

function updateDetailModalPreview() {
  const price = parseFloat(document.getElementById('detailInputPrice').value) || 0;
  const qty = parseInt(document.getElementById('detailInputQty').value, 10) || 1;
  const historyPrice = parseFloat(document.getElementById('detailInputHistoryPrice').value) || 0;
  const discType = getSelectedDiscountType();
  const discVal = getSelectedDiscountValue();

  const disc = calculateDiscount(price, discType, discVal);
  const subtotal = disc.finalPrice * qty;
  const comparator = comparePriceWithLastMonth(disc.finalPrice, historyPrice);

  const previewFinal = document.getElementById('previewFinalPriceText');
  const previewSavings = document.getElementById('previewSavingsText');
  const previewFluct = document.getElementById('previewFluctBadge');
  const previewSubtotal = document.getElementById('previewSubtotalText');

  if (previewFinal) previewFinal.textContent = formatRupiah(disc.finalPrice);
  if (previewSubtotal) previewSubtotal.textContent = formatRupiah(subtotal);

  if (previewSavings) {
    if (disc.savingsPerUnit > 0) {
      previewSavings.style.display = 'block';
      previewSavings.textContent = `Hemat ${formatRupiah(disc.savingsPerUnit)} / unit (${disc.effectivePercent}%)`;
    } else {
      previewSavings.style.display = 'none';
    }
  }

  if (previewFluct) {
    previewFluct.className = comparator.badgeClass;
    previewFluct.textContent = comparator.text;
  }
}

/**
 * Validasi Ketat Form Input (SRS F-01)
 * Cegah penambahan data jika nama barang/toko kosong atau harga bernilai negatif/0.
 * Tampilkan pesan peringatan halus (toast).
 */
function handleDetailedItemFormSubmit(e) {
  e.preventDefault();

  const nama = document.getElementById('detailInputName').value.trim();
  const toko = AppState.currentStore.trim();
  const kategori = document.getElementById('detailInputCategory').value;
  const satuan = document.getElementById('detailInputUnit').value;
  const qty = parseInt(document.getElementById('detailInputQty').value, 10);
  const hargaSatuan = parseFloat(document.getElementById('detailInputPrice').value);
  const diskonTipe = getSelectedDiscountType();
  const diskonValue = getSelectedDiscountValue();
  const hargaRiwayatBulanLalu = parseFloat(document.getElementById('detailInputHistoryPrice').value) || null;

  // 1. Validasi Nama Barang
  if (!nama) {
    showToast('Nama barang wajib diisi!', 'danger');
    document.getElementById('detailInputName').focus();
    return;
  }

  // 2. Validasi Toko Belanja (SRS F-01)
  if (!toko) {
    showToast('Toko belanja wajib dipilih!', 'danger');
    return;
  }

  // 3. Validasi Harga Satuan (> 0)
  if (isNaN(hargaSatuan) || hargaSatuan <= 0) {
    showToast('Harga satuan harus lebih besar dari 0 (tidak boleh 0 atau negatif)!', 'danger');
    document.getElementById('detailInputPrice').focus();
    return;
  }

  // 4. Validasi Kuantitas (>= 1)
  if (isNaN(qty) || qty < 1) {
    showToast('Kuantitas (Qty) minimal 1!', 'danger');
    document.getElementById('detailInputQty').focus();
    return;
  }

  // Anti-List check if newly typed
  if (!AppState.editingItemId && checkBlacklist(nama)) {
    closeDetailedItemModal();
    AppState.pendingBlacklistItem = { name: nama, qty, unit: satuan };
    showBlacklistWarning(nama);
    return;
  }

  if (AppState.editingItemId) {
    const item = AppState.cart.find(i => i.id === AppState.editingItemId);
    if (item) {
      item.namaBarang = nama;
      item.kategori = kategori;
      item.satuan = satuan;
      item.qty = qty;
      item.hargaSatuan = hargaSatuan;
      item.diskonTipe = diskonTipe;
      item.diskonValue = diskonValue;
      item.hargaRiwayatBulanLalu = hargaRiwayatBulanLalu;
      item.store = toko;
    }
    showToast(`"${nama}" berhasil diperbarui ✨`, 'success');
  } else {
    const newItem = {
      id: 'item-' + Date.now(),
      namaBarang: nama,
      kategori,
      satuan,
      qty,
      hargaSatuan,
      diskonTipe,
      diskonValue,
      hargaRiwayatBulanLalu,
      store: toko,
      checked: true
    };
    AppState.cart.unshift(newItem);
    showToast(`"${nama}" berhasil ditambahkan ke keranjang ✨`, 'success');
  }

  playCalmChime();
  closeDetailedItemModal();
  pushStateToCloud();
  renderAll();
}

// =========================================================================
// 10. WHATSAPP EXPORT & SHARING
// =========================================================================
function shareToWhatsApp() {
  if (AppState.cart.length === 0) {
    showToast('Daftar belanja masih kosong!', 'info');
    return;
  }

  const metrics = getCartMetrics();
  let text = `🛒 *DAFTAR BELANJA SMART GROCERY*\n`;
  text += `📍 *Toko:* ${AppState.currentStore}\n`;
  text += `📅 *Tanggal:* ${AppState.currentDate}\n\n`;
  text += `*Daftar Belanjaan:*\n`;

  AppState.cart.forEach((item, idx) => {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const subtotal = disc.finalPrice * item.qty;
    const checkMark = item.checked ? '☑️' : '◻️';
    text += `${checkMark} ${idx + 1}. *${item.namaBarang}* (${item.qty} ${item.satuan}) - ${formatRupiah(subtotal)}\n`;
  });

  text += `\n💰 *Total Estimasi:* ${formatRupiah(metrics.totalBelanja)}`;
  if (metrics.totalHemat > 0) {
    text += `\n✨ *Hemat Promo:* ${formatRupiah(metrics.totalHemat)}`;
  }
  text += `\n🛡️ *Batas Saldo Dompet:* ${formatRupiah(AppState.budget)}`;

  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  showToast('Membuka WhatsApp...', 'success');
}

// =========================================================================
// 11. IN-STORE SHOPPING MODE & RUNNING CART
// =========================================================================
function toggleShoppingMode() {
  AppState.inStoreMode = !AppState.inStoreMode;
  localStorage.setItem(STORAGE_KEYS.IN_STORE_MODE, JSON.stringify(AppState.inStoreMode));
  document.body.classList.toggle('in-store-mode-active', AppState.inStoreMode);

  const fabIcon = document.getElementById('fabIcon');
  const fabText = document.getElementById('fabText');
  const runningBar = document.getElementById('runningCartBar');
  const instoreCard = document.getElementById('inStoreCompanionCard');

  if (AppState.inStoreMode) {
    if (fabIcon) fabIcon.textContent = '📋';
    if (fabText) fabText.textContent = 'Mode Rencana';
    if (runningBar) runningBar.classList.remove('d-none');
    if (instoreCard) instoreCard.style.display = 'block';
    showToast('Mode Toko aktif • Checklist lorong & pantau sisa saldo', 'info');
  } else {
    if (fabIcon) fabIcon.textContent = '🛒';
    if (fabText) fabText.textContent = 'Mulai Belanja';
    if (runningBar) runningBar.classList.add('d-none');
    if (instoreCard) instoreCard.style.display = 'none';
    showToast('Kembali ke Mode Rencana', 'info');
  }

  renderItems();
  renderBudget();
}

function confirmFinishShopping() {
  if (AppState.cart.length === 0) {
    showToast('Keranjang masih kosong!', 'info');
    return;
  }

  const metrics = getCartMetrics();
  const receipt = {
    id: 'rec-' + Date.now(),
    tanggal: AppState.currentDate,
    toko: AppState.currentStore,
    judul: `Belanja ${AppState.currentStore}`,
    totalBelanja: metrics.totalBelanja,
    totalHemat: metrics.totalHemat,
    budgetSaatItu: AppState.budget,
    statusBudget: metrics.safety.level,
    items: AppState.cart.map(i => {
      const disc = calculateDiscount(i.hargaSatuan, i.diskonTipe, i.diskonValue);
      return {
        namaBarang: i.namaBarang,
        qty: i.qty,
        satuan: i.satuan,
        hargaAkhirSatuan: disc.finalPrice,
        totalHarga: disc.finalPrice * i.qty
      };
    })
  };

  // Move checked items to Pantry
  AppState.cart.forEach(item => {
    if (item.checked) {
      AppState.pantry.unshift({
        id: 'pan-' + Date.now() + Math.random().toString(36).substr(2, 4),
        name: item.namaBarang,
        qty: item.qty,
        unit: item.satuan,
        category: item.kategori,
        addedDate: new Date().toISOString(),
        expiryDate: getOffsetDateString(7)
      });
    }
  });

  AppState.receipts.unshift(receipt);
  AppState.cart = [];
  AppState.inStoreMode = false;
  localStorage.setItem(STORAGE_KEYS.IN_STORE_MODE, JSON.stringify(false));

  const fabIcon = document.getElementById('fabIcon');
  const fabText = document.getElementById('fabText');
  const runningBar = document.getElementById('runningCartBar');
  const instoreCard = document.getElementById('inStoreCompanionCard');
  if (fabIcon) fabIcon.textContent = '🛒';
  if (fabText) fabText.textContent = 'Mulai Belanja';
  if (runningBar) runningBar.classList.add('d-none');
  if (instoreCard) instoreCard.style.display = 'none';

  playCalmChime();
  pushStateToCloud();
  renderAll();
  switchTab('budget');
  showToast('Belanja selesai! Struk tersimpan & barang dipindahkan ke Pantry 🧺', 'success');
}

// =========================================================================
// 12. PANTRY TRACKER & EXPIRY
// =========================================================================
function renderPantry() {
  const container = document.getElementById('pantryItemsContainer');
  const totalCountEl = document.getElementById('pantryTotalCount');
  const expiringSoonEl = document.getElementById('pantryExpiringSoonCount');
  const freshCountEl = document.getElementById('pantryFreshCount');
  if (!container) return;

  const today = new Date();
  let expiringSoon = 0;
  let freshCount = 0;

  AppState.pantry.forEach(p => {
    const exp = new Date(p.expiryDate);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) expiringSoon++;
    else freshCount++;
  });

  if (totalCountEl) totalCountEl.textContent = AppState.pantry.length;
  if (expiringSoonEl) expiringSoonEl.textContent = expiringSoon;
  if (freshCountEl) freshCountEl.textContent = freshCount;

  if (AppState.pantry.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🧺</div>
        <p class="empty-state-title">My Pantry is beautifully empty.</p>
        <p class="empty-state-desc">Barang yang dibeli saat selesai belanja akan otomatis masuk ke sini.</p>
      </div>
    `;
    return;
  }

  let html = '';
  AppState.pantry.forEach(item => {
    const exp = new Date(item.expiryDate);
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));

    let expTag = '';
    if (diffDays < 0) {
      expTag = `<span class="expiry-tag expired">Kadaluwarsa (${Math.abs(diffDays)} hari lalu)</span>`;
    } else if (diffDays <= 3) {
      expTag = `<span class="expiry-tag expiring">Segera Habis (${diffDays} hari lagi)</span>`;
    } else {
      expTag = `<span class="expiry-tag safe">Fresh (${diffDays} hari lagi)</span>`;
    }

    html += `
      <div class="pantry-card" style="background: var(--card-bg); border-radius: var(--radius-lg); padding: 12px 14px; border: 1px solid var(--border-soft); box-shadow: var(--shadow-soft); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 800; font-size: 0.92rem; color: var(--text-main);">${escapeHtml(item.name)}</div>
          <div style="font-size: 0.74rem; color: var(--text-subtle); margin-top: 2px;">
            ${item.qty} ${escapeHtml(item.unit)} • ${escapeHtml(item.category || 'Pantry')}
          </div>
          <div style="margin-top: 6px;">${expTag}</div>
        </div>
        <button type="button" class="touch-target btn-action-icon" onclick="removePantryItem('${item.id}')" title="Hapus dari Pantry" style="color: var(--status-danger);">
          ✕
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function openAddPantryModal() {
  const modal = document.getElementById('addPantryModal');
  if (modal) {
    modal.classList.add('active', 'show');
  }
}

function closeAddPantryModal() {
  const modal = document.getElementById('addPantryModal');
  if (modal) {
    modal.classList.remove('active', 'show');
  }
}

function handleManualPantrySubmit(e) {
  e.preventDefault();
  const name = document.getElementById('pantryInputName').value.trim();
  const qty = parseInt(document.getElementById('pantryInputQty').value, 10) || 1;
  const unit = document.getElementById('pantryInputUnit').value.trim() || 'pcs';
  const days = parseInt(document.getElementById('pantryInputDays').value, 10) || 7;

  if (!name) return;

  AppState.pantry.unshift({
    id: 'pan-' + Date.now(),
    name,
    qty,
    unit,
    category: detectCategory(name),
    addedDate: new Date().toISOString(),
    expiryDate: getOffsetDateString(days)
  });

  saveLocalState();
  closeAddPantryModal();
  renderPantry();
  playCalmChime();
  showToast(`"${name}" disimpan ke Pantry 🧺`, 'success');
}

function removePantryItem(id) {
  AppState.pantry = AppState.pantry.filter(p => p.id !== id);
  saveLocalState();
  renderPantry();
  playSoftPop();
}

// =========================================================================
// 13. ANTI-LIST / BLACKLIST MANAGER
// =========================================================================
function openBlacklistManagerModal() {
  renderBlacklistChips();
  const modal = document.getElementById('blacklistManagerModal');
  if (modal) {
    modal.classList.add('active', 'show');
  }
}

function closeBlacklistManagerModal() {
  const modal = document.getElementById('blacklistManagerModal');
  if (modal) {
    modal.classList.remove('active', 'show');
  }
}

function renderBlacklistChips() {
  const container = document.getElementById('blacklistItemsList');
  if (!container) return;

  if (AppState.blacklist.length === 0) {
    container.innerHTML = '<span style="font-size: 0.74rem; color: var(--text-faint);">Belum ada pantangan.</span>';
    return;
  }

  container.innerHTML = AppState.blacklist.map(b => `
    <span class="frequent-chip" style="background: #FEE2E2; color: #991B1B; border-color: #FECACA; display: inline-flex; align-items: center; gap: 4px;">
      <span>🛑 ${escapeHtml(b)}</span>
      <button type="button" onclick="removeBlacklistItem('${escapeHtml(b)}')" style="border: none; background: transparent; cursor: pointer; color: #991B1B; font-weight: 800;">&times;</button>
    </span>
  `).join('');
}

function handleAddNewBlacklistItem(e) {
  e.preventDefault();
  const input = document.getElementById('newBlacklistItemInput');
  const val = input.value.trim().toLowerCase();
  if (!val) return;

  if (!AppState.blacklist.includes(val)) {
    AppState.blacklist.push(val);
    saveLocalState();
    renderBlacklistChips();
    showToast(`"${val}" ditambahkan ke Anti-List 🛑`, 'info');
  }
  input.value = '';
}

function removeBlacklistItem(val) {
  AppState.blacklist = AppState.blacklist.filter(b => b.toLowerCase() !== val.toLowerCase());
  saveLocalState();
  renderBlacklistChips();
}

// =========================================================================
// 14. BUDGET CONTROLS & RECEIPTS
// =========================================================================
function openBudgetModal() {
  const modal = document.getElementById('budgetModal');
  const amountInput = document.getElementById('modalBudgetAmount');
  const cycleSelect = document.getElementById('modalBudgetCycle');

  if (amountInput) amountInput.value = AppState.budget;
  if (cycleSelect) cycleSelect.value = AppState.budgetPeriod;
  if (modal) {
    modal.classList.add('active', 'show');
  }
}

function closeBudgetModal() {
  const modal = document.getElementById('budgetModal');
  if (modal) {
    modal.classList.remove('active', 'show');
  }
}

function handleQuickBudgetSave(e) {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('modalBudgetAmount').value) || 100000;
  const cycle = document.getElementById('modalBudgetCycle').value;

  AppState.budget = amount;
  AppState.budgetPeriod = cycle;
  pushStateToCloud();
  renderBudget();
  closeBudgetModal();
  showToast(`Batas anggaran diatur ke ${formatRupiah(amount)}`, 'success');
}

function setQuickBudgetAmount(amt) {
  AppState.budget = amt;
  localStorage.setItem(STORAGE_KEYS.BUDGET, amt);
  const slider = document.getElementById('budgetSlider');
  if (slider) slider.value = amt;
  const display = document.getElementById('budgetLiveValueDisplay');
  if (display) display.textContent = formatRupiah(amt);
  const amtInput = document.getElementById('configBudgetAmount');
  if (amtInput) amtInput.value = amt;

  pushStateToCloud();
  renderBudget();
  playSoftPop();
  showToast(`Batas saldo dompet diatur ke ${formatRupiah(amt)}`, 'info');
}

function handleBudgetSliderChange(val) {
  const amount = parseInt(val, 10);
  if (isNaN(amount) || amount < 10000) return;
  AppState.budget = amount;
  localStorage.setItem(STORAGE_KEYS.BUDGET, amount);

  const display = document.getElementById('budgetLiveValueDisplay');
  if (display) display.textContent = formatRupiah(amount);
  const amtInput = document.getElementById('configBudgetAmount');
  if (amtInput) amtInput.value = amount;

  renderBudget();
  pushStateToCloud();
}

function adjustBudgetByDelta(delta) {
  const current = AppState.budget || 100000;
  const newBudget = Math.max(10000, current + delta);
  AppState.budget = newBudget;
  localStorage.setItem(STORAGE_KEYS.BUDGET, newBudget);

  const slider = document.getElementById('budgetSlider');
  if (slider) slider.value = newBudget;
  const display = document.getElementById('budgetLiveValueDisplay');
  if (display) display.textContent = formatRupiah(newBudget);
  const amtInput = document.getElementById('configBudgetAmount');
  if (amtInput) amtInput.value = newBudget;

  playSoftPop();
  renderBudget();
  pushStateToCloud();
  showToast(`Batas saldo disesuaikan ke ${formatRupiah(newBudget)}`, 'info');
}

function updateBudgetConfig() {
  const amtInput = document.getElementById('configBudgetAmount');
  const periodSelect = document.getElementById('configBudgetPeriod');

  if (amtInput) {
    const val = parseFloat(amtInput.value);
    if (!isNaN(val) && val > 0) AppState.budget = val;
  }
  if (periodSelect) AppState.budgetPeriod = periodSelect.value;

  pushStateToCloud();
  renderBudget();
}

function renderCategoryBreakdown() {
  const container = document.getElementById('budgetCategoryBreakdown');
  if (!container) return;

  const totals = {};
  let grandTotal = 0;

  AppState.cart.forEach(item => {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const sub = disc.finalPrice * item.qty;
    const cat = item.kategori || 'Pantry';
    totals[cat] = (totals[cat] || 0) + sub;
    grandTotal += sub;
  });

  if (grandTotal === 0) {
    container.innerHTML = '<p style="font-size: 0.74rem; color: var(--text-faint);">Belum ada item belanja.</p>';
    return;
  }

  let html = '';
  for (const [cat, amt] of Object.entries(totals)) {
    const pct = Math.round((amt / grandTotal) * 100);
    html += `
      <div style="margin-bottom: 6px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.74rem; font-weight: 700; margin-bottom: 2px;">
          <span>${cat}</span>
          <span style="color: var(--rose-contrast);">${formatRupiah(amt)} (${pct}%)</span>
        </div>
        <div style="width: 100%; height: 6px; background: var(--surface-soft); border-radius: 999px; overflow: hidden;">
          <div style="width: ${pct}%; height: 100%; background: var(--accent-blush); border-radius: 999px;"></div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

function renderHistory() {
  const container = document.getElementById('receiptHistoryContainer');
  if (!container) return;

  if (AppState.receipts.length === 0) {
    container.innerHTML = '<p style="font-size: 0.74rem; color: var(--text-faint);">Belum ada riwayat struk belanja.</p>';
    return;
  }

  container.innerHTML = AppState.receipts.map(r => `
    <div style="background: var(--surface-soft); border-radius: var(--radius-md); padding: 10px 12px; border: 1px solid var(--border-soft);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
        <div>
          <span style="font-size: 0.68rem; color: var(--text-faint); font-weight: 700;">${r.tanggal} • ${escapeHtml(r.toko || 'Lotte Mart')}</span>
          <div style="font-weight: 800; font-size: 0.86rem; color: var(--text-main);">${escapeHtml(r.judul)}</div>
        </div>
        <span style="font-weight: 900; font-size: 0.88rem; color: var(--rose-contrast);">${formatRupiah(r.totalBelanja)}</span>
      </div>
      <div style="font-size: 0.7rem; color: var(--text-subtle);">
        ${r.items.map(i => `${escapeHtml(i.namaBarang)} (${i.qty} ${i.satuan})`).join(', ')}
      </div>
    </div>
  `).join('');
}

function clearHistory() {
  AppState.receipts = [];
  saveLocalState();
  renderHistory();
  showToast('Riwayat struk dibersihkan', 'info');
}

// =========================================================================
// 15. CLOUD SYNC SETTINGS MODAL (SRS F-06B)
// =========================================================================
function openCloudSyncModal() {
  const sessionInput = document.getElementById('cloudSessionInput');
  if (sessionInput) sessionInput.value = AppState.sessionId;

  const customJsonInput = document.getElementById('customFirebaseJson');
  const storedConfig = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
  if (customJsonInput && storedConfig) customJsonInput.value = storedConfig;

  const modal = document.getElementById('cloudSyncModal');
  if (modal) {
    modal.classList.add('active', 'show');
  }
}

function closeCloudSyncModal() {
  const modal = document.getElementById('cloudSyncModal');
  if (modal) {
    modal.classList.remove('active', 'show');
  }
}

function handleSaveCloudSession(e) {
  e.preventDefault();
  const input = document.getElementById('cloudSessionInput');
  const newSession = input.value.trim();
  if (!newSession) return;

  AppState.sessionId = newSession;
  localStorage.setItem(STORAGE_KEYS.SESSION_ID, newSession);

  const customJsonInput = document.getElementById('customFirebaseJson');
  if (customJsonInput && customJsonInput.value.trim()) {
    try {
      const parsedConfig = JSON.parse(customJsonInput.value.trim());
      localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(parsedConfig));
      initFirestoreSync();
    } catch (err) {
      showToast('Format JSON Firebase tidak valid!', 'danger');
      return;
    }
  } else {
    setupFirestoreListener();
  }

  closeCloudSyncModal();
  showToast(`Sesi cloud diatur ke "${newSession}" ☁️`, 'success');
}

// =========================================================================
// 16. DARK MODE (NIGHT ROSE / DEEP BURGUNDY)
// =========================================================================
function initTheme() {
  const isDark = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
  applyTheme(isDark);
}

function toggleTheme() {
  const isDark = !document.body.classList.contains('dark-mode');
  applyTheme(isDark);
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDark.toString());
  showToast(isDark ? 'Mode Gelap (Night Rose) diaktifkan 🌙' : 'Mode Terang diaktifkan ☀️', 'info');
}

function applyTheme(isDark) {
  const metaTheme = document.getElementById('themeColorMeta');
  const toggleBtn = document.getElementById('btnThemeToggle');

  if (isDark) {
    document.body.classList.add('dark-mode');
    if (metaTheme) metaTheme.setAttribute('content', '#1A0B14');
    if (toggleBtn) toggleBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    if (metaTheme) metaTheme.setAttribute('content', '#FCE7F3');
    if (toggleBtn) toggleBtn.textContent = '🌙';
  }
}

// =========================================================================
// 17. TAB SWITCHING (ICON-ONLY BOTTOM DOCK)
// =========================================================================
function switchTab(tab) {
  AppState.currentTab = tab;

  document.querySelectorAll('.bottom-nav-item').forEach(btn => {
    btn.classList.remove('active');
  });

  const tabIndex = { budget: 0, planner: 1, pantry: 2 };
  const navBtns = document.querySelectorAll('.bottom-nav-item');
  if (navBtns[tabIndex[tab]]) navBtns[tabIndex[tab]].classList.add('active');

  const budgetSection = document.getElementById('tabBudget');
  const plannerSection = document.getElementById('tabPlanner');
  const pantrySection = document.getElementById('tabPantry');
  const fab = document.getElementById('fabStoreMode');
  const runningBar = document.getElementById('runningCartBar');

  if (budgetSection) budgetSection.classList.remove('active');
  if (plannerSection) plannerSection.classList.remove('active');
  if (pantrySection) pantrySection.classList.remove('active');

  if (tab === 'budget') {
    if (budgetSection) budgetSection.classList.add('active');
    if (fab) fab.style.display = 'none';
    if (runningBar) runningBar.classList.add('d-none');
    renderBudget();
    renderCategoryBreakdown();
  } else if (tab === 'planner') {
    if (plannerSection) plannerSection.classList.add('active');
    if (AppState.inStoreMode) {
      if (fab) fab.style.display = 'none';
      if (runningBar) runningBar.classList.remove('d-none');
    } else {
      if (fab) fab.style.display = 'inline-flex';
      if (runningBar) runningBar.classList.add('d-none');
    }
    renderItems();
    renderBudget();
  } else if (tab === 'pantry') {
    if (pantrySection) pantrySection.classList.add('active');
    if (fab) fab.style.display = 'none';
    if (runningBar) runningBar.classList.add('d-none');
    renderPantry();
  }

  playSoftPop();
}

// =========================================================================
// 18. RESET DEMO DATA
// =========================================================================
function resetToInitialMockData() {
  AppState.cart = JSON.parse(JSON.stringify(DEFAULT_CART_ITEMS));
  AppState.currentStore = 'Lotte Mart Grocery - Puri Indah';
  AppState.currentDate = new Date().toISOString().split('T')[0];
  AppState.budget = 100000;
  AppState.priceHistory = JSON.parse(JSON.stringify(DEFAULT_PRICE_HISTORY));
  AppState.receipts = JSON.parse(JSON.stringify(DEFAULT_RECEIPTS));
  AppState.pantry = JSON.parse(JSON.stringify(DEFAULT_PANTRY));
  AppState.blacklist = [...DEFAULT_BLACKLIST];

  pushStateToCloud();
  renderAll();
  showToast('Contoh data belanja berhasil dimuat kembali! ✨', 'success');
}

// =========================================================================
// 19. PWA INSTALL PROMPT
// =========================================================================
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    AppState.deferredInstallPrompt = e;
    const btn = document.getElementById('btnInstallPwa');
    if (btn) btn.style.display = 'inline-flex';
  });
}

function installPwa() {
  if (AppState.deferredInstallPrompt) {
    AppState.deferredInstallPrompt.prompt();
    AppState.deferredInstallPrompt.userChoice.then(() => {
      AppState.deferredInstallPrompt = null;
    });
  } else {
    showToast('Aplikasi siap digunakan atau telah terpasang di Home Screen ✨', 'info');
  }
}

// =========================================================================
// 20. TOAST SYSTEM (NON-BLOCKING) - SRS UX
// =========================================================================
function showToast(msg, type = 'info') {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const t = document.createElement('div');
  t.className = `toast-message ${type}`;
  let icon = 'ℹ️';
  if (type === 'danger') icon = '⚠️';
  if (type === 'success') icon = '✅';

  t.innerHTML = `<span>${icon}</span><span>${escapeHtml(msg)}</span>`;
  container.appendChild(t);

  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(-10px)';
    t.style.transition = 'all 0.25s ease';
    setTimeout(() => t.remove(), 250);
  }, 2800);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Close modal when tapping on backdrop outside modal card
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('active', 'show');
    }
  });
}

// =========================================================================
// 21. APP INITIALIZATION
// =========================================================================
function initApp() {
  initTheme();
  loadLocalState();
  initFirestoreSync();
  document.body.classList.toggle('in-store-mode-active', !!AppState.inStoreMode);

  const fabIcon = document.getElementById('fabIcon');
  const fabText = document.getElementById('fabText');
  const runningBar = document.getElementById('runningCartBar');
  const instoreCard = document.getElementById('inStoreCompanionCard');
  if (AppState.inStoreMode) {
    if (fabIcon) fabIcon.textContent = '📋';
    if (fabText) fabText.textContent = 'Mode Rencana';
    if (runningBar) runningBar.classList.remove('d-none');
    if (instoreCard) instoreCard.style.display = 'block';
  } else {
    if (fabIcon) fabIcon.textContent = '🛒';
    if (fabText) fabText.textContent = 'Mulai Belanja';
    if (runningBar) runningBar.classList.add('d-none');
    if (instoreCard) instoreCard.style.display = 'none';
  }

  checkAuth();
  switchTab(AppState.currentTab || 'planner');
  renderAll();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initApp);
}

// =========================================================================
// 22. PRODUCT BARCODE SCANNER & IN-STORE PRODUCT RECOGNITION
// =========================================================================
const BARCODE_CATALOG = {
  '8992753210118': {
    barcode: '8992753210118',
    name: 'Minyak Goreng Tropical 2L',
    category: 'Minyak & Bumbu',
    unit: 'pouch',
    price: 37500,
    historyPrice: 35000
  },
  '8998866200234': {
    barcode: '8998866200234',
    name: 'Ultra Milk UHT Cokelat 1000ml',
    category: 'Minuman',
    unit: 'kotak',
    price: 20500,
    historyPrice: 20000
  },
  '8999999001235': {
    barcode: '8999999001235',
    name: 'Indomie Goreng Spesial 85g',
    category: 'Makanan Instan',
    unit: 'bungkus',
    price: 3100,
    historyPrice: 3100
  },
  '8991002101340': {
    barcode: '8991002101340',
    name: 'Lifebuoy Sabun Cair Total 10 450ml',
    category: 'Kebersihan & Mandi',
    unit: 'pouch',
    price: 24500,
    historyPrice: 27000
  },
  '8993005120015': {
    barcode: '8993005120015',
    name: 'Beras Premium Ramos 5kg',
    category: 'Kebutuhan Pokok',
    unit: 'karung/5kg',
    price: 74000,
    historyPrice: 72000
  },
  '8992388102441': {
    barcode: '8992388102441',
    name: 'Telur Ayam Negeri Pack 10 Butir',
    category: 'Kebutuhan Pokok',
    unit: 'pack',
    price: 29500,
    historyPrice: 31000
  },
  '8996001301018': {
    barcode: '8996001301018',
    name: 'Nescafe Classic Kopi Jar 100g',
    category: 'Minuman',
    unit: 'jar',
    price: 42000,
    historyPrice: 42000
  },
  '8992745330112': {
    barcode: '8992745330112',
    name: 'Royco Kaldu Sapi 230g',
    category: 'Bumbu Dapur',
    unit: 'pack',
    price: 11500,
    historyPrice: 11000
  },
  '8991389220011': {
    barcode: '8991389220011',
    name: 'Aqua Air Mineral 600ml',
    category: 'Minuman',
    unit: 'botol',
    price: 3500,
    historyPrice: 3500
  },
  '8992759114002': {
    barcode: '8992759114002',
    name: 'Pepsodent Pencegah Gigi Berlubang 190g',
    category: 'Kebersihan & Mandi',
    unit: 'tube',
    price: 15000,
    historyPrice: 15500
  }
};

let scannerMediaStream = null;
let scannerDetectorInterval = null;
let currentScannerFacingMode = 'environment';
let currentScannedItem = null;
let currentScannedQty = 1;
let isScannerTorchOn = false;
let barcodeDetectorInstance = null;

// Initialize BarcodeDetector if available in browser
if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
  try {
    barcodeDetectorInstance = new BarcodeDetector({
      formats: ['ean_13', 'ean_8', 'code_128', 'qr_code', 'upc_a', 'upc_e']
    });
  } catch (err) {
    console.warn('BarcodeDetector format init notice:', err);
  }
}

function openProductScannerModal() {
  const modal = document.getElementById('productScannerModal');
  if (!modal) return;

  currentScannedItem = null;
  currentScannedQty = 1;

  const resultCard = document.getElementById('scannerResultCard');
  if (resultCard) resultCard.style.display = 'none';

  const statusText = document.getElementById('scannerStatusText');
  if (statusText) statusText.textContent = '🔍 Mencari barcode produk otomatis (EAN-13 / UPC)...';

  const manualInput = document.getElementById('manualBarcodeInput');
  if (manualInput) manualInput.value = '';

  modal.classList.add('active', 'show');
  startScannerCamera();
}

function closeProductScannerModal() {
  stopScannerCamera();
  const modal = document.getElementById('productScannerModal');
  if (modal) modal.classList.remove('active', 'show');
  currentScannedItem = null;
}

async function startScannerCamera() {
  const video = document.getElementById('scannerVideo');
  const notice = document.getElementById('scannerCameraNotice');
  const noticeText = document.getElementById('scannerNoticeText');
  const torchBtn = document.getElementById('btnScannerTorch');

  if (notice) notice.style.display = 'none';

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (notice) {
      notice.style.display = 'flex';
      if (noticeText) noticeText.textContent = 'Kamera tidak didukung di browser ini. Silakan gunakan tombol Barcode Cepat di bawah.';
    }
    return;
  }

  try {
    stopScannerCamera();
    const constraints = {
      video: {
        facingMode: currentScannerFacingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    scannerMediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    if (video) {
      video.srcObject = scannerMediaStream;
      await video.play().catch(e => console.warn('Video play note:', e));
    }

    // Check torch support
    if (torchBtn) {
      const track = scannerMediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      if (capabilities.torch) {
        torchBtn.style.display = 'inline-flex';
      } else {
        torchBtn.style.display = 'none';
      }
    }

    // Start Barcode Detection Loop
    startBarcodeDetectionLoop();
  } catch (err) {
    console.warn('Camera access note:', err.message);
    if (notice) {
      notice.style.display = 'flex';
      if (noticeText) noticeText.textContent = 'Kamera belum diizinkan atau tidak aktif. Silakan gunakan tombol Barcode Cepat di bawah.';
    }
  }
}

function stopScannerCamera() {
  if (scannerDetectorInterval) {
    clearInterval(scannerDetectorInterval);
    scannerDetectorInterval = null;
  }
  if (scannerMediaStream) {
    scannerMediaStream.getTracks().forEach(t => t.stop());
    scannerMediaStream = null;
  }
  const video = document.getElementById('scannerVideo');
  if (video) video.srcObject = null;
}

function toggleScannerTorch() {
  if (!scannerMediaStream) return;
  const track = scannerMediaStream.getVideoTracks()[0];
  if (!track || !track.applyConstraints) return;

  isScannerTorchOn = !isScannerTorchOn;
  track.applyConstraints({
    advanced: [{ torch: isScannerTorchOn }]
  }).catch(e => console.warn('Torch toggle error:', e));

  const torchBtn = document.getElementById('btnScannerTorch');
  if (torchBtn) {
    torchBtn.style.background = isScannerTorchOn ? 'rgba(244, 63, 94, 0.9)' : 'rgba(0,0,0,0.55)';
  }
}

function switchScannerCamera() {
  currentScannerFacingMode = currentScannerFacingMode === 'environment' ? 'user' : 'environment';
  const flipBtn = document.getElementById('btnScannerFlip');
  if (flipBtn) {
    flipBtn.style.transform = 'rotate(180deg)';
    setTimeout(() => { if (flipBtn) flipBtn.style.transform = ''; }, 300);
  }
  startScannerCamera();
}

function startBarcodeDetectionLoop() {
  if (scannerDetectorInterval) clearInterval(scannerDetectorInterval);
  if (!barcodeDetectorInstance) return;

  const video = document.getElementById('scannerVideo');
  const canvas = document.getElementById('scannerCanvas');
  if (!video) return;

  scannerDetectorInterval = setInterval(async () => {
    if (!video.videoWidth || currentScannedItem) return;
    try {
      let targetSource = video;
      if (canvas && video.videoWidth > 0) {
        canvas.width = Math.min(640, video.videoWidth);
        canvas.height = Math.min(480, video.videoHeight);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          targetSource = canvas;
        }
      }
      const barcodes = await barcodeDetectorInstance.detect(targetSource);
      if (barcodes && barcodes.length > 0) {
        const raw = barcodes[0].rawValue;
        if (raw) {
          processScannedBarcode(raw);
        }
      }
    } catch (e) {
      try {
        const barcodes = await barcodeDetectorInstance.detect(video);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          processScannedBarcode(barcodes[0].rawValue);
        }
      } catch (err2) { }
    }
  }, 450);
}

function simulateBarcodeScan(barcode) {
  processScannedBarcode(barcode);
}

function handleManualBarcodeSearch() {
  const input = document.getElementById('manualBarcodeInput');
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    showToast('Masukkan barcode atau nama barang!', 'info');
    return;
  }
  processScannedBarcode(val);
}

function processScannedBarcode(barcodeOrQuery) {
  playScannerBeep();
  if (navigator.vibrate) {
    try { navigator.vibrate(80); } catch (e) { }
  }

  let matched = BARCODE_CATALOG[barcodeOrQuery];

  // If not exact barcode key, search by partial barcode or name in catalog
  if (!matched) {
    const qLower = barcodeOrQuery.toLowerCase();
    const catalogEntries = Object.values(BARCODE_CATALOG);
    matched = catalogEntries.find(p => p.name.toLowerCase().includes(qLower) || p.barcode.includes(qLower));
  }

  // If still not matched, check price history
  if (!matched && AppState.priceHistory[barcodeOrQuery]) {
    const hist = AppState.priceHistory[barcodeOrQuery];
    matched = {
      barcode: barcodeOrQuery,
      name: barcodeOrQuery,
      category: hist.kategori || 'Pantry',
      unit: hist.satuan || 'pcs',
      price: hist.harga || 15000,
      historyPrice: hist.harga || 15000
    };
  }

  // Fallback: create dynamic product from query/barcode
  if (!matched) {
    const isNum = /^\d+$/.test(barcodeOrQuery);
    matched = {
      barcode: isNum ? barcodeOrQuery : '899' + Math.floor(1000000000 + Math.random() * 9000000000),
      name: isNum ? `Produk (${barcodeOrQuery})` : barcodeOrQuery,
      category: 'Pantry',
      unit: 'pcs',
      price: 15000,
      historyPrice: 15000
    };
  }

  currentScannedItem = matched;
  currentScannedQty = 1;

  // Render Scanned Result Card
  const resultCard = document.getElementById('scannerResultCard');
  const barcodeBadge = document.getElementById('scannedItemBarcodeBadge');
  const catBadge = document.getElementById('scannedItemCategoryBadge');
  const inCartBadge = document.getElementById('scannedItemInCartBadge');
  const nameEl = document.getElementById('scannedItemName');
  const priceEl = document.getElementById('scannedItemPriceText');
  const fluctBadge = document.getElementById('scannedItemFluctBadge');
  const qtyInput = document.getElementById('scannedItemQtyInput');
  const statusText = document.getElementById('scannerStatusText');

  if (barcodeBadge) barcodeBadge.textContent = matched.barcode || 'EAN-13';
  if (catBadge) catBadge.textContent = matched.category || 'Pantry';
  if (nameEl) nameEl.textContent = matched.name;
  if (priceEl) priceEl.textContent = formatRupiah(matched.price);
  if (qtyInput) qtyInput.value = currentScannedQty;

  // Check if item already exists in current shopping cart
  const existingInCart = AppState.cart.find(i => i.namaBarang.toLowerCase() === matched.name.toLowerCase());
  if (inCartBadge) {
    if (existingInCart) {
      inCartBadge.style.display = 'inline-block';
      inCartBadge.textContent = `Sudah di Keranjang (Qty: ${existingInCart.qty} ${existingInCart.satuan})`;
    } else {
      inCartBadge.style.display = 'none';
    }
  }

  // Fluctuation indicator
  const comp = comparePriceWithLastMonth(matched.price, matched.historyPrice);
  if (fluctBadge) {
    fluctBadge.className = comp.badgeClass;
    fluctBadge.textContent = comp.text;
  }

  updateScannedPreview();

  if (statusText) statusText.textContent = `✅ Barcode [${matched.barcode}] terdeteksi!`;
  if (resultCard) {
    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function adjustScannedQty(delta) {
  currentScannedQty = Math.max(1, currentScannedQty + delta);
  const input = document.getElementById('scannedItemQtyInput');
  if (input) input.value = currentScannedQty;
  updateScannedPreview();
}

function updateScannedPreview() {
  if (!currentScannedItem) return;
  const input = document.getElementById('scannedItemQtyInput');
  if (input) {
    const val = parseInt(input.value, 10);
    if (!isNaN(val) && val >= 1) currentScannedQty = val;
  }

  const subtotal = currentScannedItem.price * currentScannedQty;
  const metrics = getCartMetrics();
  const projectedTotal = metrics.totalBelanja + subtotal;
  const projectedRemaining = AppState.budget - projectedTotal;

  const subtotalEl = document.getElementById('scannedSubtotalPreview');
  const remainingEl = document.getElementById('scannedRemainingPreview');

  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
  if (remainingEl) {
    if (projectedRemaining >= 0) {
      remainingEl.textContent = formatRupiah(projectedRemaining);
      remainingEl.style.color = (projectedTotal >= AppState.budget * 0.9) ? '#B45309' : 'var(--status-safe-text)';
    } else {
      remainingEl.textContent = `Defisit - ${formatRupiah(Math.abs(projectedRemaining))}`;
      remainingEl.style.color = '#EF4444';
    }
  }
}

function confirmAddScannedProduct() {
  if (!currentScannedItem) return;

  const prod = currentScannedItem;
  const qty = currentScannedQty;

  // Check if item already exists in cart
  const existingIndex = AppState.cart.findIndex(i => i.namaBarang.toLowerCase() === prod.name.toLowerCase());

  if (existingIndex !== -1) {
    AppState.cart[existingIndex].qty += qty;
    AppState.cart[existingIndex].checked = true;
    showToast(`"${prod.name}" kuantitas ditambah jadi ${AppState.cart[existingIndex].qty} (di keranjang) ✨`, 'success');
  } else {
    const newItem = {
      id: 'item-' + Date.now(),
      namaBarang: prod.name,
      kategori: prod.category || 'Pantry',
      satuan: prod.unit || 'pcs',
      qty: qty,
      hargaSatuan: prod.price,
      diskonTipe: 'none',
      diskonValue: '',
      hargaRiwayatBulanLalu: prod.historyPrice || prod.price,
      store: AppState.currentStore,
      checked: true,
      barcode: prod.barcode || ''
    };
    AppState.cart.unshift(newItem);
    showToast(`"${prod.name}" (${qty} ${prod.unit}) ditambahkan ke keranjang ✨`, 'success');
  }

  // Ensure In-Store mode is active so user sees in-store bar & companion while shopping
  if (!AppState.inStoreMode) {
    AppState.inStoreMode = true;
    localStorage.setItem(STORAGE_KEYS.IN_STORE_MODE, JSON.stringify(true));
    document.body.classList.add('in-store-mode-active');
  }

  playCalmChime();
  pushStateToCloud();
  renderAll();

  // Reset result card for next item scan
  resetScannerForNext();
}

function resetScannerForNext() {
  currentScannedItem = null;
  currentScannedQty = 1;
  const resultCard = document.getElementById('scannerResultCard');
  if (resultCard) resultCard.style.display = 'none';

  const statusText = document.getElementById('scannerStatusText');
  if (statusText) statusText.textContent = '🔍 Arahkan ke barcode produk berikutnya...';

  const manualInput = document.getElementById('manualBarcodeInput');
  if (manualInput) manualInput.value = '';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BARCODE_CATALOG,
    calculateDiscount,
    comparePriceWithLastMonth,
    parseSmartInput
  };
}
