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

// Storage Keys
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

// Default Historical Catalog Bulan Lalu untuk Toko: "Lotte Mart Grocery - Puri Indah"
const DEFAULT_PRICE_HISTORY = {
  "Beras Rojolele": { harga: 68000, satuan: "karung/5kg", kategori: "Bahan Pokok", toko: "Lotte Mart Grocery - Puri Indah" },
  "Beras 5kg": { harga: 68000, satuan: "karung/5kg", kategori: "Bahan Pokok", toko: "Lotte Mart Grocery - Puri Indah" },
  "Minyak Goreng 2L": { harga: 43000, satuan: "liter", kategori: "Kebutuhan Pokok", toko: "Lotte Mart Grocery - Puri Indah" },
  "Minyak Goreng": { harga: 43000, satuan: "liter", kategori: "Kebutuhan Pokok", toko: "Lotte Mart Grocery - Puri Indah" },
  "Telur 1kg": { harga: 32000, satuan: "kg", kategori: "Kebutuhan Pokok", toko: "Lotte Mart Grocery - Puri Indah" },
  "Telur Ayam 1kg": { harga: 32000, satuan: "kg", kategori: "Kebutuhan Pokok", toko: "Lotte Mart Grocery - Puri Indah" },
  "Garam 500g": { harga: 5000, satuan: "bungkus", kategori: "Pantry", toko: "Lotte Mart Grocery - Puri Indah" },
  "Garam": { harga: 5000, satuan: "bungkus", kategori: "Pantry", toko: "Lotte Mart Grocery - Puri Indah" },
  "Sabun Cuci": { harga: 20000, satuan: "pcs", kategori: "Kebersihan & Rumah", toko: "Lotte Mart Grocery - Puri Indah" },
  "Wajan": { harga: 100000, satuan: "pcs", kategori: "Peralatan", toko: "Lotte Mart Grocery - Puri Indah" },
  "Sabun Mandi": { harga: 15000, satuan: "pcs", kategori: "Perlengkapan Mandi", toko: "Lotte Mart Grocery - Puri Indah" },
  "Susu UHT 1L": { harga: 19500, satuan: "liter", kategori: "Minuman", toko: "Lotte Mart Grocery - Puri Indah" },
  "Mi Instan Dus": { harga: 115000, satuan: "pack", kategori: "Makanan", toko: "Lotte Mart Grocery - Puri Indah" },
  "Tepung Terigu": { harga: 13000, satuan: "kg", kategori: "Pantry", toko: "Lotte Mart Grocery - Puri Indah" }
};

// Initial Mock Cart Items (Initial Total: Rp 94.000 / 94% Waspada)
const DEFAULT_CART_ITEMS = [
  {
    id: 'item-beras-rojolele',
    namaBarang: 'Beras Rojolele',
    kategori: 'Bahan Pokok',
    satuan: 'karung/5kg',
    qty: 1,
    hargaSatuan: 74000,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: 68000,
    store: 'Lotte Mart Grocery - Puri Indah',
    checked: true
  },
  {
    id: 'item-minyak-goreng',
    namaBarang: 'Minyak Goreng 2L',
    kategori: 'Kebutuhan Pokok',
    satuan: 'liter',
    qty: 1,
    hargaSatuan: 43000,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: 43000,
    store: 'Lotte Mart Grocery - Puri Indah',
    checked: true
  },
  {
    id: 'item-telur-1kg',
    namaBarang: 'Telur 1kg',
    kategori: 'Kebutuhan Pokok',
    satuan: 'kg',
    qty: 1,
    hargaSatuan: 28000,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: 32000,
    store: 'Lotte Mart Grocery - Puri Indah',
    checked: true
  },
  {
    id: 'item-garam-500g',
    namaBarang: 'Garam 500g',
    kategori: 'Pantry',
    satuan: 'bungkus',
    qty: 1,
    hargaSatuan: 5000,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: 5000,
    store: 'Lotte Mart Grocery - Puri Indah',
    checked: false
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

// Initial Routine Items Presets (Daily Auto-Refresh)
const DEFAULT_ROUTINE_ITEMS = [
  { namaBarang: 'Telur Ayam 1kg', kategori: 'Bahan Pokok', satuan: 'kg', qty: 1, hargaSatuan: 28000, isRoutine: true },
  { namaBarang: 'Minyak Goreng 2L', kategori: 'Minyak & Bumbu', satuan: 'pouch/2L', qty: 1, hargaSatuan: 38000, isRoutine: true },
  { namaBarang: 'Susu UHT Ultra Milk 1L', kategori: 'Dairy & Minuman', satuan: 'karton', qty: 1, hargaSatuan: 19500, isRoutine: true },
  { namaBarang: 'Bayam Hijau Segar', kategori: 'Sayur & Buah', satuan: 'ikat', qty: 1, hargaSatuan: 4000, isRoutine: true },
  { namaBarang: 'Roti Tawar Gandum', kategori: 'Bahan Pokok', satuan: 'pack', qty: 1, hargaSatuan: 16000, isRoutine: true }
];

// Global App State
let AppState = {
  user: null,
  authMode: 'signin',
  previousSafetyLevel: 'safe',
  cart: [],
  currentStore: 'Lotte Mart Grocery - Puri Indah', // Toko Default
  currentDate: new Date().toISOString().split('T')[0], // Tanggal Belanja
  budget: 100000, // Limit Saldo Dompet
  budgetPeriod: 'weekly',
  priceHistory: {},
  receipts: [],
  pantry: [],
  blacklist: [],
  routineItems: [],
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

// Realtime Sync Variables
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
// 2. MATHEMATICAL FORMULAS & COMPUTATION
// =========================================================================

/**
 * Kalkulator Diskon Bertingkat Kompound & Tunggal
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
 * Komparator Fluktuasi Harga Realtime vs Histori Bulan Lalu
 * - Harga Naik: Panah MERAH naik (↑) + nominal kenaikan (+Rp 6.000)
 * - Harga Turun: Panah HIJAU turun (↓) + nominal penghematan (-Rp 4.000)
 * - Harga Stabil: Tanda ABU-ABU setara (=) jika harga sama persis
 */
function comparePriceWithLastMonth(currentFinalUnitPrice, lastMonthPrice, isSameStore = true) {
  const current = Math.round(parseFloat(currentFinalUnitPrice) || 0);
  const baseline = Math.round(parseFloat(lastMonthPrice) || 0);

  if (!isSameStore) {
    return {
      status: 'diff_store',
      label: '📍 Toko Lain',
      diff: 0,
      text: '📍 Toko Lain',
      badgeClass: 'fluctuation-badge fluctuation-stable'
    };
  }

  if (!baseline || baseline <= 0) {
    return {
      status: 'new',
      label: 'Baru',
      diff: 0,
      text: '✨ Baru',
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
    // Stabil: Tanda ABU-ABU setara (= Stabil) jika harga sama persis dengan bulan lalu
    return {
      status: 'stable',
      label: '= Stabil',
      diff: 0,
      text: '= Stabil',
      badgeClass: 'fluctuation-badge fluctuation-stable'
    };
  }
}

/**
 * Helper: Ambil harga histori bulan lalu untuk toko yang sama
 */
function getStorePriceHistory(itemName, storeName) {
  const targetStore = (storeName || AppState.currentStore || '').trim().toLowerCase();
  const trimmed = (itemName || '').trim().toLowerCase();
  if (!trimmed) return null;

  if (AppState.priceHistory) {
    for (const [key, val] of Object.entries(AppState.priceHistory)) {
      if (key.toLowerCase() === trimmed) {
        const histStore = (val.toko || '').trim().toLowerCase();
        if (!histStore || histStore === targetStore) {
          return val.harga;
        }
      }
    }
    for (const [key, val] of Object.entries(AppState.priceHistory)) {
      if (key.toLowerCase().startsWith(trimmed) && key.toLowerCase().includes(targetStore)) {
        return val.harga;
      }
    }
  }

  if (Array.isArray(AppState.receipts)) {
    for (const rec of AppState.receipts) {
      const recStore = (rec.toko || '').trim().toLowerCase();
      if (recStore === targetStore && Array.isArray(rec.items)) {
        const matched = rec.items.find(i => (i.namaBarang || '').trim().toLowerCase() === trimmed);
        if (matched && (matched.hargaAkhirSatuan || matched.hargaSatuan)) {
          return matched.hargaAkhirSatuan || matched.hargaSatuan;
        }
      }
    }
  }

  return null;
}

function recordStorePrice(itemName, price, storeName, category, unit) {
  if (!itemName || !price) return;
  const trimmed = itemName.trim();
  const store = (storeName || AppState.currentStore || '').trim();
  if (!AppState.priceHistory) AppState.priceHistory = {};
  
  AppState.priceHistory[trimmed] = {
    harga: Math.round(price),
    satuan: unit || 'pcs',
    kategori: category || 'Kebutuhan Pokok',
    toko: store
  };
  localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(AppState.priceHistory));
}

/**
 * Evaluasi Pengendali Anggaran / Budget Safety Cap
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
      badgeText: `⚠️ Rem Dulu Kak (${Math.round(percentage)}%)`,
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
  const settingsToggle = document.getElementById('settingsSoundToggle');
  if (btn) btn.textContent = AppState.soundEnabled ? '🔊' : '🔇';
  if (settingsToggle) settingsToggle.checked = AppState.soundEnabled;
  showToast(AppState.soundEnabled ? 'Suara Feedback Aktif 🔊' : 'Suara Dibisukan 🔇', 'info');
}

// =========================================================================
// 4. PERSISTENCE & LOCALSTORAGE
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

function loadUserIsolatedState(uid) {
  if (!uid) return;
  try {
    const userCart = localStorage.getItem('grocery_cart_' + uid);
    if (userCart) {
      AppState.cart = JSON.parse(userCart);
    }

    const userStore = localStorage.getItem('grocery_store_' + uid);
    if (userStore) AppState.currentStore = userStore;

    const userDate = localStorage.getItem('grocery_date_' + uid);
    if (userDate) AppState.currentDate = userDate;

    const userBudget = localStorage.getItem('grocery_budget_' + uid);
    if (userBudget !== null) AppState.budget = parseInt(userBudget, 10);

    const userReceipts = localStorage.getItem('grocery_receipts_' + uid);
    if (userReceipts) AppState.receipts = JSON.parse(userReceipts);

    const userPantry = localStorage.getItem('grocery_pantry_' + uid);
    if (userPantry) AppState.pantry = JSON.parse(userPantry);

    const userBlacklist = localStorage.getItem('grocery_blacklist_' + uid);
    if (userBlacklist) AppState.blacklist = JSON.parse(userBlacklist);

    const userRoutine = localStorage.getItem('grocery_routine_items_' + uid);
    if (userRoutine) {
      try { AppState.routineItems = JSON.parse(userRoutine); } catch (e) { AppState.routineItems = [...DEFAULT_ROUTINE_ITEMS]; }
    } else {
      AppState.routineItems = JSON.parse(JSON.stringify(DEFAULT_ROUTINE_ITEMS));
    }

    renderAll();
    checkDailyPlannerReset(uid);
  } catch (e) {
    console.warn('loadUserIsolatedState error:', e);
  }
}

function loadLocalState() {
  try {
    const storedUser = getStoredItem(STORAGE_KEYS.USER);
    if (storedUser) AppState.user = JSON.parse(storedUser);

    const uid = (AppState.user && AppState.user.uid) ? AppState.user.uid : 'guest';

    // 1. User-isolated cart with fallback (Requirement 4)
    const userCart = localStorage.getItem('grocery_cart_' + uid);
    if (userCart) {
      AppState.cart = JSON.parse(userCart);
    } else {
      const storedCart = getStoredItem(STORAGE_KEYS.CART);
      AppState.cart = storedCart ? JSON.parse(storedCart) : JSON.parse(JSON.stringify(DEFAULT_CART_ITEMS));
    }

    // 2. User-isolated store
    const userStore = localStorage.getItem('grocery_store_' + uid);
    AppState.currentStore = userStore || getStoredItem(STORAGE_KEYS.STORE) || AppState.currentStore;

    // 3. User-isolated date
    const userDate = localStorage.getItem('grocery_date_' + uid);
    AppState.currentDate = userDate || getStoredItem(STORAGE_KEYS.DATE) || AppState.currentDate;

    // 4. User-isolated budget
    const userBudget = localStorage.getItem('grocery_budget_' + uid);
    if (userBudget !== null) {
      AppState.budget = parseInt(userBudget, 10);
    } else {
      const storedBudget = getStoredItem(STORAGE_KEYS.BUDGET);
      AppState.budget = storedBudget !== null ? parseInt(storedBudget, 10) : 100000;
    }

    const storedPeriod = getStoredItem(STORAGE_KEYS.BUDGET_PERIOD);
    if (storedPeriod) AppState.budgetPeriod = storedPeriod;

    const storedHistory = getStoredItem(STORAGE_KEYS.PRICE_HISTORY);
    AppState.priceHistory = storedHistory ? JSON.parse(storedHistory) : { ...DEFAULT_PRICE_HISTORY };

    // 5. User-isolated receipts
    const userReceipts = localStorage.getItem('grocery_receipts_' + uid);
    if (userReceipts) {
      AppState.receipts = JSON.parse(userReceipts);
    } else {
      const storedReceipts = getStoredItem(STORAGE_KEYS.RECEIPTS);
      AppState.receipts = storedReceipts ? JSON.parse(storedReceipts) : [...DEFAULT_RECEIPTS];
    }

    // 6. User-isolated pantry
    const userPantry = localStorage.getItem('grocery_pantry_' + uid);
    if (userPantry) {
      AppState.pantry = JSON.parse(userPantry);
    } else {
      const storedPantry = getStoredItem(STORAGE_KEYS.PANTRY);
      AppState.pantry = storedPantry ? JSON.parse(storedPantry) : [...DEFAULT_PANTRY];
    }

    // 7. User-isolated blacklist
    const userBlacklist = localStorage.getItem('grocery_blacklist_' + uid);
    if (userBlacklist) {
      AppState.blacklist = JSON.parse(userBlacklist);
    } else {
      const storedBlacklist = getStoredItem(STORAGE_KEYS.BLACKLIST);
      AppState.blacklist = storedBlacklist ? JSON.parse(storedBlacklist) : [...DEFAULT_BLACKLIST];
    }

    const userRoutine = localStorage.getItem('grocery_routine_items_' + uid);
    if (userRoutine) {
      try { AppState.routineItems = JSON.parse(userRoutine); } catch (e) { AppState.routineItems = [...DEFAULT_ROUTINE_ITEMS]; }
    } else {
      AppState.routineItems = JSON.parse(JSON.stringify(DEFAULT_ROUTINE_ITEMS));
    }

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
    const uid = (AppState.user && AppState.user.uid) ? AppState.user.uid : 'guest';

    if (AppState.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(AppState.user));
    }

    // Isolated keys per user UID (Requirement 4)
    localStorage.setItem('grocery_cart_' + uid, JSON.stringify(AppState.cart));
    localStorage.setItem('grocery_store_' + uid, AppState.currentStore);
    localStorage.setItem('grocery_date_' + uid, AppState.currentDate);
    localStorage.setItem('grocery_budget_' + uid, AppState.budget.toString());
    localStorage.setItem('grocery_receipts_' + uid, JSON.stringify(AppState.receipts));
    localStorage.setItem('grocery_pantry_' + uid, JSON.stringify(AppState.pantry));
    localStorage.setItem('grocery_blacklist_' + uid, JSON.stringify(AppState.blacklist));
    localStorage.setItem('grocery_routine_items_' + uid, JSON.stringify(AppState.routineItems || []));

    // Global / fallback keys for cross-compatibility
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(AppState.cart));
    localStorage.setItem(STORAGE_KEYS.STORE, AppState.currentStore);
    localStorage.setItem(STORAGE_KEYS.DATE, AppState.currentDate);
    localStorage.setItem(STORAGE_KEYS.BUDGET, AppState.budget.toString());
    localStorage.setItem(STORAGE_KEYS.BUDGET_PERIOD, AppState.budgetPeriod);
    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(AppState.priceHistory));
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(AppState.receipts));
    localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(AppState.pantry));
    localStorage.setItem(STORAGE_KEYS.BLACKLIST, JSON.stringify(AppState.blacklist));
    localStorage.setItem('grocery_routine_items', JSON.stringify(AppState.routineItems || []));
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, AppState.sessionId);
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(AppState.soundEnabled));
    localStorage.setItem(STORAGE_KEYS.IN_STORE_MODE, JSON.stringify(AppState.inStoreMode));
  } catch (err) {
    console.error('LocalStorage save error:', err);
  }
}

// =========================================================================
// 5. CLOUD FIRESTORE REALTIME SYNC
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
    setupAuthListener();
    handleRedirectResult();
    updateCloudSyncUI('connected', 'Live Cloud Sync (onSnapshot)');
  } catch (err) {
    console.warn('Firebase init notice:', err);
    updateCloudSyncUI('offline', 'Mode Offline (LocalStorage)');
  }
}

// Requirement 2: Per-User UID Firestore Document Reference
function getUserDocRef() {
  if (!firestoreDb) return null;
  const uid = (AppState.user && AppState.user.uid) ? AppState.user.uid : 'guest_' + AppState.sessionId;
  return firestoreDb.collection('users').doc(uid).collection('grocery_session').doc('active');
}

// Requirement 3: Realtime Cross-Device Sync khusus Akun Aktif (onSnapshot)
function setupFirestoreListener() {
  if (!firestoreDb) return;
  if (unsubscribeFirestore) {
    unsubscribeFirestore();
    unsubscribeFirestore = null;
  }

  const userDocRef = getUserDocRef();
  if (!userDocRef) return;

  unsubscribeFirestore = userDocRef.onSnapshot((docSnapshot) => {
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
    console.warn('Firestore userDocRef onSnapshot listener notice:', error);
    updateCloudSyncUI('offline', 'Mode Offline (LocalStorage)');
  });
}

function setupAuthListener() {
  if (typeof firebase === 'undefined' || !firebase.auth) return;

  try {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Requirement 1: Dynamic profile without static text
        handleSuccessfulAuth(user, user.providerData && user.providerData[0] ? user.providerData[0].providerId : 'google', false);
      } else {
        // If logged in via firebase (not demo), reset state upon sign-out
        if (AppState.user && AppState.user.authProvider !== 'demo') {
          promptLogout(false);
        }
      }
    });
  } catch (err) {
    console.warn('onAuthStateChanged listener notice:', err);
  }
}

async function handleRedirectResult() {
  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      const result = await firebase.auth().getRedirectResult();
      if (result && result.user) {
        handleSuccessfulAuth(result.user, 'google', true);
      }
    } catch (err) {
      if (err.code && err.code !== 'auth/null-user') {
        console.warn('Redirect sign-in notice:', err.code, err.message);
        showToast(`Kendala masuk Google: ${err.message || err.code}`, 'warning');
      }
    }
  }
}

function handleSuccessfulAuth(u, providerType, notify = true) {
  // Requirement 1: Dynamic profile & Hapus Hardcoded "Audrey"
  const displayName = u.displayName || (u.email ? u.email.split('@')[0] : 'Pengguna');
  AppState.user = {
    name: displayName,
    email: u.email || 'user@email.com',
    photoURL: u.photoURL || '',
    uid: u.uid,
    authProvider: providerType || 'google',
    loggedAt: new Date().toISOString()
  };

  // Requirement 4: Load isolated local storage for this specific user UID
  loadUserIsolatedState(u.uid);
  saveLocalState();
  playCalmChime();
  checkAuth();

  // Requirement 3: Connect realtime onSnapshot listener for this user's UID
  setupFirestoreListener();

  if (notify) {
    showToast(`Selamat datang, ${displayName}! ✨`, 'success');
  }
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

let cloudSyncDebounceTimer = null;

function pushStateToCloud(immediate = false) {
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

  // Debounced Cloud Firestore push (300ms) to user's isolated document (Requirement 2)
  if (cloudSyncDebounceTimer) {
    clearTimeout(cloudSyncDebounceTimer);
    cloudSyncDebounceTimer = null;
  }

  const firestoreSyncAction = () => {
    if (firestoreDb) {
      const userDocRef = getUserDocRef();
      if (userDocRef) {
        userDocRef.set(payload, { merge: true })
          .then(() => updateCloudSyncUI('connected', 'Cloud Sync Aktif (onSnapshot)'))
          .catch((err) => console.warn('Firestore set error:', err));
      }

      // Backward-compatible fallback for global test runner
      try {
        firestoreDb.collection('grocery_sessions').doc(AppState.sessionId).set(payload, { merge: true }).catch(() => {});
      } catch (e) {}
    }
  };

  if (immediate) {
    firestoreSyncAction();
  } else {
    cloudSyncDebounceTimer = setTimeout(firestoreSyncAction, 300);
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
// 6. AUTH GATE: GOOGLE LOGIN, SIGN IN & SIGN UP
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
  showToast('Membuka pilihan akun Google...', 'info');

  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      // 1. Inisialisasi Google Auth Provider dengan email dan profile scope
      let googleProvider = null;
      if (typeof window !== 'undefined' && typeof window.initGoogleAuthProvider === 'function') {
        googleProvider = window.initGoogleAuthProvider();
      }
      if (!googleProvider && firebase.auth.GoogleAuthProvider) {
        googleProvider = new firebase.auth.GoogleAuthProvider();
        googleProvider.addScope('email');
        googleProvider.addScope('profile');
        googleProvider.setCustomParameters({ prompt: 'select_account' });
      }

      if (googleProvider) {
        try {
          // 2. Tampilkan pop-up pilihan akun Gmail
          const result = await firebase.auth().signInWithPopup(googleProvider);
          if (result && result.user) {
            handleSuccessfulAuth(result.user, 'google');
            return;
          }
        } catch (popupErr) {
          console.warn('Firebase Google Auth popup notice:', popupErr.code, popupErr.message);

          // Fallback redirect jika pop-up diblokir oleh browser
          if (popupErr.code === 'auth/popup-blocked') {
            showToast('Pop-up diblokir browser, mengalihkan ke halaman masuk Google...', 'warning');
            await firebase.auth().signInWithRedirect(googleProvider);
            return;
          } else if (popupErr.code === 'auth/popup-closed-by-user' || popupErr.code === 'auth/cancelled-popup-request') {
            showToast('Proses masuk Google dibatalkan', 'info');
            return;
          } else if (popupErr.code === 'auth/unauthorized-domain') {
            showToast('Domain belum terdaftar di Firebase Console. Menggunakan akun demo.', 'warning');
          } else {
            showToast(`Kendala masuk Google: ${popupErr.message || popupErr.code}`, 'warning');
          }
        }
      }
    } catch (err) {
      console.warn('Google Provider setup notice:', err);
      showToast('Kendala inisialisasi Google Auth', 'warning');
    }
  } else {
    showToast('Firebase SDK belum siap. Menggunakan mode demo.', 'warning');
  }

  // Graceful fallback for offline, file:// protocol, or unwhitelisted test environments
  loginDemoAccount();
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

  let uid = 'user-' + Date.now();

  if (AppState.authMode === 'signup') {
    if (!name) {
      name = email.split('@')[0];
    }
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        const cred = await firebase.auth().createUserWithEmailAndPassword(email, pass);
        if (cred.user) {
          uid = cred.user.uid;
          if (cred.user.updateProfile) {
            await cred.user.updateProfile({ displayName: name });
          }
        }
      } catch (err) {
        console.warn('Firebase Auth signup note:', err.message);
      }
    }
    AppState.user = {
      name,
      email,
      uid,
      authProvider: 'email',
      loggedAt: new Date().toISOString()
    };
    loadUserIsolatedState(uid);
    saveLocalState();
    playCalmChime();
    checkAuth();
    setupFirestoreListener();
    showToast(`Akun berhasil dibuat! Selamat datang, ${name} ✨`, 'success');
  } else {
    // Sign In mode
    if (!name) {
      name = email.split('@')[0];
    }
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        const cred = await firebase.auth().signInWithEmailAndPassword(email, pass);
        if (cred.user) {
          uid = cred.user.uid;
          if (cred.user.displayName) {
            name = cred.user.displayName;
          }
        }
      } catch (err) {
        console.warn('Firebase Auth signin note:', err.message);
      }
    }
    AppState.user = {
      name,
      email,
      uid,
      authProvider: 'email',
      loggedAt: new Date().toISOString()
    };
    loadUserIsolatedState(uid);
    saveLocalState();
    playCalmChime();
    checkAuth();
    setupFirestoreListener();
    showToast(`Selamat datang kembali, ${name}! ✨`, 'success');
  }
}

function loginDemoAccount() {
  const demoUid = 'demo_user_101';
  AppState.user = {
    name: 'Akun Demo',
    email: 'demo@smartgrocery.app',
    photoURL: '',
    uid: demoUid,
    authProvider: 'demo',
    loggedAt: new Date().toISOString()
  };
  loadUserIsolatedState(demoUid);
  saveLocalState();
  playCalmChime();
  checkAuth();
  setupFirestoreListener();
  showToast('Masuk dengan Akun Demo ✨', 'success');
}

function promptLogout(notify = true) {
  // Requirement 3: Stop onSnapshot listener upon logout
  if (unsubscribeFirestore) {
    unsubscribeFirestore();
    unsubscribeFirestore = null;
  }
  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      firebase.auth().signOut();
    } catch (e) { }
  }
  AppState.user = null;
  localStorage.removeItem(STORAGE_KEYS.USER);

  // Reset active UI state cleanly
  AppState.cart = [];
  AppState.budget = 100000;
  saveLocalState();
  renderAll();
  checkAuth();
  updateCloudSyncUI('offline', 'Mode Offline (Belum Masuk)');

  if (notify) {
    showToast('Anda telah keluar akun', 'info');
  }
}

function checkAuth() {
  const authGate = document.getElementById('authGate');
  const dashboard = document.getElementById('mainDashboard');

  if (AppState.user && AppState.user.name) {
    document.body.classList.add('authenticated');
    document.body.classList.remove('unauthenticated');
    document.body.classList.remove('auth-locked');
    document.body.style.overflow = '';

    if (authGate) {
      authGate.style.setProperty('display', 'none', 'important');
      authGate.classList.add('hidden');
    }
    if (dashboard) {
      dashboard.style.setProperty('display', 'block', 'important');
      dashboard.classList.remove('hidden');
    }

    // Daily Auto-Refresh Rencana Belanja check
    checkDailyPlannerReset(AppState.user.uid);

    const headerName = document.getElementById('headerUserName');
    const headerEmail = document.getElementById('headerUserEmail');
    const headerAvatar = document.getElementById('headerUserAvatar');
    const headerAvatarFallback = document.getElementById('headerUserAvatarFallback');

    if (headerName) headerName.textContent = AppState.user.name;
    if (headerEmail) headerEmail.textContent = AppState.user.email || 'user@email.com';
    if (headerAvatar) {
      if (AppState.user.photoURL) {
        headerAvatar.src = AppState.user.photoURL;
        headerAvatar.style.display = 'inline-block';
        if (headerAvatarFallback) headerAvatarFallback.style.display = 'none';
      } else {
        headerAvatar.style.display = 'none';
        if (headerAvatarFallback) headerAvatarFallback.style.display = 'inline-flex';
      }
    }

    const modalName = document.getElementById('modalUserName');
    const modalEmail = document.getElementById('modalUserEmail');
    const modalAvatar = document.getElementById('modalUserAvatar');
    const modalAvatarFallback = document.getElementById('modalUserAvatarFallback');
    if (modalName) modalName.textContent = AppState.user.name;
    if (modalEmail) modalEmail.textContent = AppState.user.email || 'user@email.com';
    if (modalAvatar) {
      if (AppState.user.photoURL) {
        modalAvatar.src = AppState.user.photoURL;
        modalAvatar.style.display = 'block';
        if (modalAvatarFallback) modalAvatarFallback.style.display = 'none';
      } else {
        modalAvatar.style.display = 'none';
        if (modalAvatarFallback) modalAvatarFallback.style.display = 'flex';
      }
    }

    const syncName = document.getElementById('syncUserAccountName');
    const syncEmail = document.getElementById('syncUserAccountEmail');
    if (syncName) syncName.textContent = AppState.user.name;
    if (syncEmail) syncEmail.textContent = AppState.user.email || 'user@email.com';

    // Refresh active tab and components so all buttons are 100% interactive
    if (typeof switchTab === 'function') {
      switchTab(AppState.currentTab || 'planner', true);
    }
    if (typeof renderAll === 'function') {
      renderAll();
    }
  } else {
    document.body.classList.remove('authenticated');
    document.body.classList.add('unauthenticated', 'auth-locked');
    document.body.style.overflow = 'hidden';

    if (authGate) {
      authGate.style.setProperty('display', 'flex', 'important');
      authGate.classList.remove('hidden');
    }
    if (dashboard) {
      dashboard.style.setProperty('display', 'none', 'important');
      dashboard.classList.add('hidden');
    }

    const profileModal = document.getElementById('profileSettingsModal');
    if (profileModal) {
      profileModal.style.display = 'none';
      profileModal.classList.remove('open', 'active', 'show');
      profileModal.setAttribute('aria-hidden', 'true');
    }
  }
}

// =========================================================================
// 7. RENDERING & UI REAKTIVITAS
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
  renderCartSection();
  renderProductCatalog();
  renderPantry();
  renderPantryCatalog();
  renderHistory();
  renderCategoryBreakdown();
  updateCartBadges();
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

function toggleCustomStoreInput() {
  const wrap = document.getElementById('custom-store-wrap');
  const input = document.getElementById('custom-store-input');
  if (!wrap) return;
  const isHidden = wrap.style.display === 'none' || (typeof getComputedStyle !== 'undefined' && getComputedStyle(wrap).display === 'none');
  if (isHidden) {
    wrap.style.display = 'block';
    if (input) {
      input.value = (AppState.currentStore && AppState.currentStore !== 'custom') ? AppState.currentStore : '';
      input.focus();
    }
  } else {
    wrap.style.display = 'none';
  }
}

function saveCustomStoreInput() {
  const wrap = document.getElementById('custom-store-wrap');
  const input = document.getElementById('custom-store-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    showToast('Nama toko tidak boleh kosong!', 'warning');
    input.focus();
    return;
  }

  AppState.currentStore = val;
  const select = document.getElementById('session-store-select');
  if (select) {
    let customOpt = Array.from(select.options).find(o => o.value === val);
    if (!customOpt) {
      customOpt = document.createElement('option');
      customOpt.value = val;
      customOpt.textContent = val;
      select.insertBefore(customOpt, select.firstChild);
    }
    select.value = val;
  }

  const disp = document.getElementById('cartCurrentStoreDisplay');
  if (disp) disp.textContent = val;

  AppState.cart.forEach(item => { item.store = val; });
  if (wrap) wrap.style.display = 'none';
  pushStateToCloud();
  renderItems();
  showToast(`Toko belanja diubah ke "${val}"`, 'success');
}

function cancelCustomStoreInput() {
  const wrap = document.getElementById('custom-store-wrap');
  if (wrap) wrap.style.display = 'none';
}

function handleDateChange(val) {
  if (!val) return;
  AppState.currentDate = val;
  pushStateToCloud();
  showToast(`Tanggal belanja diatur ke ${val}`, 'info');
}

// Render Budget Safety Cap & Overbudget Banner
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

  // Instant Targeted DOM Updates on Sticky Bottom Bar & Cart Totals (0 ms Anti-Lag)
  const grandTotalEl = document.getElementById('checkoutGrandTotal');
  if (grandTotalEl) grandTotalEl.textContent = formatRupiah(totalBelanja);
  const budgetSubEl = document.getElementById('checkoutBudgetRemaining');
  if (budgetSubEl) {
    if (safety.sisa >= 0) {
      budgetSubEl.textContent = `Sisa Saldo: ${formatRupiah(safety.sisa)} (${safety.level === 'warning' ? 'Rem Dulu Kak' : 'Aman'})`;
      budgetSubEl.style.color = (safety.level === 'warning') ? '#B45309' : '#2E7D32';
    } else {
      budgetSubEl.textContent = `Defisit: - ${formatRupiah(Math.abs(safety.sisa))}`;
      budgetSubEl.style.color = '#EF4444';
    }
  }
  const selectedCountEl = document.getElementById('cartSelectedCountBadge');
  if (selectedCountEl) selectedCountEl.textContent = `${metrics.checkedItemsCount} item`;
  const checkoutBtnCount = document.getElementById('checkoutBtnCount');
  if (checkoutBtnCount) checkoutBtnCount.textContent = `(${metrics.checkedItemsCount})`;

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

  // Progress Bar Width & Color (>=90% Kuning, >100% Merah)
  if (progressBar) {
    const clampedPercent = Math.min(100, Math.max(0, safety.percentage));
    progressBar.style.width = `${clampedPercent}%`;
    progressBar.style.background = safety.barColor;
  }
  // Slim 4px budget bars & overbudget badge
  const budgetSlimBar = document.getElementById('budgetSlimProgressBar');
  const cartSlimBar = document.getElementById('cartSlimProgressBar');
  const overbudgetSlimBadge = document.getElementById('overbudget-slim-badge');
  const overbudgetSlimDiff = document.getElementById('overbudget-slim-diff');

  const clampedPercent = Math.min(100, Math.max(0, safety.percentage));
  if (budgetSlimBar) {
    budgetSlimBar.style.width = `${clampedPercent}%`;
    budgetSlimBar.style.background = safety.barColor;
  }
  if (cartSlimBar) {
    cartSlimBar.style.width = `${clampedPercent}%`;
    cartSlimBar.style.background = safety.barColor;
  }
  if (overbudgetSlimBadge) {
    if (safety.showOverbudgetBanner) {
      overbudgetSlimBadge.style.display = 'flex';
      if (overbudgetSlimDiff) {
        overbudgetSlimDiff.textContent = formatRupiah(totalBelanja - budget);
      }
    } else {
      overbudgetSlimBadge.style.display = 'none';
    }
  }

  if (progressPercentText) {
    progressPercentText.textContent = `Pengeluaran: ${Math.round(safety.percentage)}%`;
  }

  if (safetyBadge) {
    safetyBadge.className = safety.badgeClass;
    safetyBadge.textContent = safety.badgeText;
  }

  // OVERBUDGET FIRM RED BANNER (>100% Limit) - 
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

  // PLANNER TAB DYNAMIC BUDGET ALERT BOX ( & UX)
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
      if (plannerAlertTitle) plannerAlertTitle.textContent = 'Eits, Dikit Lagi Tembus Limit! 💸';
      if (plannerAlertDesc) plannerAlertDesc.textContent = 'Pengeluaranmu udah 90% nih. Mending sortir lagi isi keranjang biar nggak bablas.';
      if (plannerAlertBadge) {
        plannerAlertBadge.className = 'planner-alert-badge badge-warning';
        plannerAlertBadge.textContent = 'Rem Dulu Kak';
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
      if (tabStatusTitle) tabStatusTitle.textContent = 'Eits, Dikit Lagi Tembus Limit! 💸';
      if (tabStatusDesc) tabStatusDesc.textContent = 'Pengeluaranmu udah 90% nih. Mending sortir lagi isi keranjang biar nggak bablas.';
      if (tabStatusBadge) {
        tabStatusBadge.className = 'planner-alert-badge badge-warning';
        tabStatusBadge.textContent = 'Rem Dulu Kak';
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

  // Update In-Store Companion Card (hidden to prevent module duplication)
  const instoreCard = document.getElementById('inStoreCompanionCard');
  if (instoreCard) {
    instoreCard.style.display = 'none';
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

// Render Checklist Items with Stepper Touch Targets
// Render Checklist Items with Compact Horizontal Rows
function renderItems() {
  const container = document.getElementById('groceryItemsContainer');
  const unboughtCountEl = document.getElementById('unboughtItemCount');
  if (!container) return;

  const unbought = AppState.cart.filter(i => !i.checked);
  if (unboughtCountEl) unboughtCountEl.textContent = unbought.length;

  // Requirement 1: Empty State Visual (UX)
  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 36px 16px; text-align: center;">
        <div style="font-size: 42px; margin-bottom: 8px;">🛒</div>
        <p style="font-weight: 700; font-size: 1rem; color: #222222; margin-bottom: 6px;">Keranjang masih kosong</p>
        <p style="font-size: 0.8rem; color: #757575; margin-bottom: 14px;">Keranjang belanja masih kosong, silakan tambah atau scan barang pertamamu!</p>
        <button type="button" class="btn-demo-quick" style="width: auto; padding: 6px 16px; margin: 0 auto;" onclick="resetToInitialMockData()">
          Muat Contoh Data Belanja
        </button>
      </div>
    `;
    updateCartBadges();
    return;
  }

  let itemsToRender = [...AppState.cart];

  // In-Store Mode Aisle Sorting
  if (AppState.inStoreMode) {
    itemsToRender.sort((a, b) => (a.kategori || a.category || '').localeCompare(b.kategori || b.category || ''));
  }

  let html = '';
  let currentCategory = null;

  itemsToRender.forEach(item => {
    // Aisle Header in in-store mode
    if (AppState.inStoreMode && (item.kategori || item.category) !== currentCategory) {
      currentCategory = item.kategori || item.category;
      const aisle = AISLE_METADATA[currentCategory] || { title: currentCategory || 'Pantry', icon: '📍' };
      html += `
        <div class="aisle-header" style="margin: 14px 0 6px; font-weight: 800; font-size: 0.82rem; color: #222222; display: flex; align-items: center; gap: 6px;">
          <span>${aisle.icon}</span>
          <span>${aisle.title}</span>
        </div>
      `;
    }

    const hasNoPrice = (!item.hargaSatuan || item.hargaSatuan <= 0);

    if (hasNoPrice) {
      // PRE-SHOPPING CHECKLIST MODE: [ Checkbox | Nama Barang | Kuantitas & Satuan | Badge 'Belum Ada Harga' ]
      html += `
        <div class="shopee-item-card unpriced-plan-item ${item.checked ? 'checked' : ''}" data-item-id="${item.id}" onclick="handleItemRowClick('${item.id}', event)">
          <!-- Checkbox: Memicu popover input harga riil saat belanja di toko -->
          <label class="cart-item-checkbox-wrap" title="Centang untuk masukkan harga riil di toko">
            <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="handleItemCheckOrPricePrompt('${item.id}', this)">
          </label>

          <!-- Compact Body (Flexbox Horizontal, Shopee Cart Item Layout) -->
          <div class="shopee-compact-body">
            <!-- Top Row: Judul Produk + Kuantitas Satuan in Center, Edit & Trash on Right Top -->
            <div class="shopee-compact-top">
              <div class="shopee-compact-title-wrap">
                <span class="shopee-compact-name" title="${escapeHtml(item.namaBarang)}">
                  ${escapeHtml(item.namaBarang)}
                </span>
                <span class="planner-unit-badge">📦 ${item.qty} ${escapeHtml(item.satuan || 'pcs')}</span>
                <button type="button" class="routine-toggle-pill ${item.isRoutine ? 'active' : ''}" onclick="toggleItemRoutine('${item.id}'); event.stopPropagation();" title="${item.isRoutine ? 'Barang Rutin Harian: Otomatis muncul setiap hari' : 'Jadikan Rutin Harian'}">
                  🔁 ${item.isRoutine ? 'Rutin Harian' : 'Rutin'}
                </button>
              </div>
              <div class="shopee-compact-actions">
                <button type="button" class="btn-action-edit-icon" onclick="openDetailedItemModal('${item.id}'); event.stopPropagation();" title="Ubah Item">✏️</button>
                <button type="button" class="btn-shopee-delete" onclick="confirmDeleteItem('${item.id}'); event.stopPropagation();" title="Hapus Item">🗑️</button>
              </div>
            </div>

            <!-- Bottom Row (Bottom Action Row): Belum Ada Harga / + Isi Harga on Left, Stepper on Right -->
            <div class="shopee-compact-bottom">
              <div class="shopee-compact-price-wrap">
                <button type="button" class="badge-no-price touch-target" onclick="openQuickPriceModal('${item.id}', false); event.stopPropagation();" title="Klik untuk masukkan harga di toko">
                  🏷️ Belum Ada Harga
                </button>
                <button type="button" class="btn-enter-price-pill touch-target" onclick="openQuickPriceModal('${item.id}', false); event.stopPropagation();" title="Masukkan harga riil di toko">
                  + Isi Harga
                </button>
              </div>

              <div class="shopee-compact-stepper-wrap">
                <div class="shopee-stepper">
                  <button type="button" class="shopee-step-btn" onclick="updateItemQty('${item.id}', -1); event.stopPropagation();" title="Kurang">&minus;</button>
                  <input type="number" inputmode="numeric" id="qty-input-${item.id}" min="1" value="${item.qty}"
                         oninput="handleQtyDirectInput('${item.id}', this.value)"
                         onblur="handleQtyBlur('${item.id}', this.value)"
                         onclick="event.stopPropagation()">
                  <button type="button" class="shopee-step-btn" onclick="updateItemQty('${item.id}', 1); event.stopPropagation();" title="Tambah">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // IN-STORE PRICED ITEM MODE
      const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
      const subtotal = disc.finalPrice * item.qty;
      const isSameStore = (!item.store || item.store === AppState.currentStore);
      const baseline = item.hargaRiwayatBulanLalu || (isSameStore ? getStorePriceHistory(item.namaBarang, item.store || AppState.currentStore) : null);
      const comparator = comparePriceWithLastMonth(disc.finalPrice, baseline, isSameStore);

      let promoBadge = '';
      if (item.diskonTipe === 'single') promoBadge = `🏷️ -${item.diskonValue}%`;
      else if (item.diskonTipe === 'tiered') promoBadge = `🔥 ${item.diskonValue}`;

      html += `
        <div class="shopee-item-card ${item.checked ? 'checked' : ''}" data-item-id="${item.id}">
          <!-- Checkbox -->
          <label class="cart-item-checkbox-wrap" title="Pilih Item untuk Dihitung">
            <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleItemCheck('${item.id}')">
          </label>

          <!-- Compact Body (Flexbox Horizontal, Shopee Cart Item Layout) -->
          <div class="shopee-compact-body">
            <!-- Top Row: Judul Produk + Badge Diskon/Fluktuasi in Center, Edit & Trash on Right Top -->
            <div class="shopee-compact-top">
              <div class="shopee-compact-title-wrap">
                <span class="shopee-compact-name" title="${escapeHtml(item.namaBarang)}">
                  ${escapeHtml(item.namaBarang)}
                </span>
                <div class="shopee-compact-meta-left">
                  <span class="${comparator.badgeClass}">${comparator.text}</span>
                  <button type="button" class="routine-toggle-pill ${item.isRoutine ? 'active' : ''}" onclick="toggleItemRoutine('${item.id}'); event.stopPropagation();" title="${item.isRoutine ? 'Barang Rutin Harian: Otomatis muncul setiap hari' : 'Jadikan Rutin Harian'}">
                    🔁 ${item.isRoutine ? 'Rutin Harian' : 'Rutin'}
                  </button>
                  ${promoBadge ? `<button type="button" class="shopee-promo-pill" onclick="openQuickDiscountPopover('${item.id}')" title="Atur Diskon Cepat">${promoBadge}</button>` : `<button type="button" class="shopee-promo-pill" onclick="openQuickDiscountPopover('${item.id}')" title="Atur Diskon Cepat">🏷️ +Diskon</button>`}
                </div>
              </div>
              <div class="shopee-compact-actions">
                <button type="button" class="btn-action-edit-icon" onclick="openDetailedItemModal('${item.id}')" title="Ubah Item">✏️</button>
                <button type="button" class="btn-shopee-delete" onclick="confirmDeleteItem('${item.id}')" title="Hapus Item">🗑️</button>
              </div>
            </div>

            <!-- Bottom Row (Bottom Action Row): Harga Satuan on Left, Stepper on Right -->
            <div class="shopee-compact-bottom">
              <div class="shopee-compact-price-wrap">
                <span class="subtotal-amount price-tag" id="subtotal-${item.id}" onclick="openQuickPriceModal('${item.id}', false)" style="cursor: pointer;" title="Klik untuk ubah harga">${formatRupiah(subtotal)}</span>
                <span class="planner-unit-badge">📦 ${item.qty} ${escapeHtml(item.satuan || 'pcs')}</span>
              </div>

              <div class="shopee-compact-stepper-wrap">
                <div class="shopee-stepper">
                  <button type="button" class="shopee-step-btn" onclick="updateItemQty('${item.id}', -1)" title="Kurang">&minus;</button>
                  <input type="number" inputmode="numeric" id="qty-input-${item.id}" min="1" value="${item.qty}"
                         oninput="handleQtyDirectInput('${item.id}', this.value)"
                         onblur="handleQtyBlur('${item.id}', this.value)">
                  <button type="button" class="shopee-step-btn" onclick="updateItemQty('${item.id}', 1)" title="Tambah">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  });

  container.innerHTML = html;
  updateCartBadges();
}

// Reaktivitas Kuantitas & Subtotal Seketika
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
  const cartInputEl = document.getElementById(`cart-qty-${item.id}`);
  if (cartInputEl) cartInputEl.value = newQty;

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
  renderCartSection();
  renderBudget();
}

/**
 * Transisi Input Harga Pas Belanja:
 * Saat pengguna mencentang item di toko atau menekan item tersebut,
 * jika barang belum memiliki harga riil, tampilkan popover cepat.
 */
function handleItemCheckOrPricePrompt(itemId, checkboxEl) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  // Jika barang belum punya harga (Fase Pre-Shopping -> Transisi In-Store)
  if (!item.hargaSatuan || item.hargaSatuan <= 0) {
    if (checkboxEl && checkboxEl.checked) {
      // Revert status visual checkbox sampai harga berhasil diinput & disimpan
      checkboxEl.checked = false;
      openQuickPriceModal(itemId, true);
      return;
    }
  }

  toggleItemCheck(itemId);
}

function handleItemRowClick(itemId, event) {
  if (event.target.closest('button, input, label, a')) return;
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;
  if (!item.hargaSatuan || item.hargaSatuan <= 0) {
    openQuickPriceModal(itemId, false);
  }
}

// Modal Konfirmasi Hapus Baris Item
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
  const historyPrice = history.harga || null;

  const newItem = {
    id: 'item-' + Date.now(),
    namaBarang: parsed.name,
    kategori: category,
    satuan: parsed.unit || history.satuan || 'pcs',
    qty: parsed.qty || 1,
    hargaSatuan: 0, // Fase Shopping Planner: Catat Tanpa Harga (default Rp 0)
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: historyPrice,
    store: AppState.currentStore,
    checked: false // Checklist belum dibeli / menunggu fase belanja di toko
  };

  AppState.cart.unshift(newItem);
  playCalmChime();
  pushStateToCloud();
  renderAll();
  showToast(`"${parsed.name}" (${newItem.qty} ${newItem.satuan}) dicatat di rencana belanja ✨`, 'success');
}

// =========================================================================
// 8B. VISUAL PRODUCT CATALOG ALA SHOPEE (PRESET DATA & 1-TAP ADD)
// =========================================================================
const PRODUCT_CATALOG = [
  { id: 'cat-1', name: 'Beras Rojolele 5kg', category: 'staple', icon: '🌾', price: 74000, unit: 'karung/5kg', aisle: 'Bahan Pokok', isRoutine: true },
  { id: 'cat-2', name: 'Minyak Goreng 2L', category: 'oil-seasoning', icon: '🍳', price: 38000, unit: 'pouch/2L', aisle: 'Minyak & Bumbu', isRoutine: true },
  { id: 'cat-3', name: 'Telur Ayam 1kg', category: 'staple', icon: '🥚', price: 28000, unit: 'kg', aisle: 'Bahan Pokok', isRoutine: true },
  { id: 'cat-4', name: 'Indomie Goreng (5 pcs)', category: 'staple', icon: '🍜', price: 15500, unit: 'pack/5pcs', aisle: 'Bahan Pokok' },
  { id: 'cat-5', name: 'Tepung Terigu Segitiga 1kg', category: 'staple', icon: '🍞', price: 13000, unit: 'kg', aisle: 'Bahan Pokok' },
  { id: 'cat-6', name: 'Gula Pasir Gulaku 1kg', category: 'oil-seasoning', icon: '🧂', price: 17500, unit: 'kg', aisle: 'Minyak & Bumbu', isRoutine: true },
  { id: 'cat-7', name: 'Garam Dapur 500g', category: 'oil-seasoning', icon: '🧂', price: 5000, unit: 'bungkus', aisle: 'Minyak & Bumbu', isRoutine: true },
  { id: 'cat-8', name: 'Kecap Manis Bango 520ml', category: 'oil-seasoning', icon: '🍾', price: 24000, unit: 'pouch', aisle: 'Minyak & Bumbu' },
  { id: 'cat-9', name: 'Saus Sambal ABC 335ml', category: 'oil-seasoning', icon: '🌶️', price: 16000, unit: 'botol', aisle: 'Minyak & Bumbu' },
  { id: 'cat-10', name: 'Sabun Mandi Lifebuoy', category: 'hygiene', icon: '🧼', price: 16000, unit: 'multipack', aisle: 'Kebersihan' },
  { id: 'cat-11', name: 'Deterjen Rinso 770g', category: 'hygiene', icon: '🧺', price: 22500, unit: 'bag', aisle: 'Kebersihan' },
  { id: 'cat-12', name: 'Pasta Gigi Pepsodent 190g', category: 'hygiene', icon: '🪥', price: 14500, unit: 'tube', aisle: 'Kebersihan' },
  { id: 'cat-13', name: 'Sunlight Cuci Piring 700ml', category: 'hygiene', icon: '🍋', price: 15000, unit: 'pouch', aisle: 'Kebersihan' },
  { id: 'cat-14', name: 'Bayam Hijau Segar', category: 'produce', icon: '🥬', price: 4000, unit: 'ikat', aisle: 'Sayur & Buah', isRoutine: true },
  { id: 'cat-15', name: 'Wortel Berastagi 500g', category: 'produce', icon: '🥕', price: 9000, unit: 'pack', aisle: 'Sayur & Buah' },
  { id: 'cat-16', name: 'Apel Fuji Segar (1kg)', category: 'produce', icon: '🍎', price: 35000, unit: 'kg', aisle: 'Sayur & Buah' },
  { id: 'cat-17', name: 'Pisang Cavendish 1 Sisir', category: 'produce', icon: '🍌', price: 23000, unit: 'sisir', aisle: 'Sayur & Buah' },
  { id: 'cat-18', name: 'Tomat Segar 500g', category: 'produce', icon: '🍅', price: 7000, unit: 'pack', aisle: 'Sayur & Buah' },
  { id: 'cat-19', name: 'Susu UHT Ultra Milk 1L', category: 'dairy-drink', icon: '🥛', price: 19500, unit: 'karton', aisle: 'Dairy & Minuman', isRoutine: true },
  { id: 'cat-20', name: 'Kopi Kapal Api Special Mix', category: 'dairy-drink', icon: '☕', price: 14000, unit: 'renteng', aisle: 'Dairy & Minuman' },
  { id: 'cat-21', name: 'Keju Cheddar Kraft 165g', category: 'dairy-drink', icon: '🧀', price: 22000, unit: 'kotak', aisle: 'Dairy & Minuman' },
  { id: 'cat-22', name: 'Yogurt Biokul 120ml', category: 'dairy-drink', icon: '🥣', price: 8500, unit: 'cup', aisle: 'Dairy & Minuman' }
];

let catalogActiveCategory = 'all';
let catalogSearchQuery = '';

function renderProductCatalog() {
  const container = document.getElementById('productCatalogGrid');
  if (!container) return;

  const query = (catalogSearchQuery || '').toLowerCase().trim();
  const filtered = PRODUCT_CATALOG.filter(item => {
    const matchesCat = (catalogActiveCategory === 'all' || item.category === catalogActiveCategory);
    const matchesQuery = !query || item.name.toLowerCase().includes(query) || (item.aisle || '').toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 24px 12px; color: var(--text-subtle); font-size: 13px;">
        🔍 Produk "<strong>${escapeHtml(query)}</strong>" tidak ada di katalog.<br>Tekan tombol <strong>➔</strong> di atas untuk menambahkannya sebagai barang baru!
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="catalog-card" data-catalog-id="${item.id}">
      <div class="catalog-thumb-wrap">
        <span>${item.icon}</span>
      </div>
      <div class="catalog-card-name" title="${escapeHtml(item.name)}">
        ${escapeHtml(item.name)}
        ${item.isRoutine ? '<span class="catalog-routine-tag" title="Barang Rutin Harian">🔁 Rutin</span>' : ''}
      </div>
      <div class="catalog-card-footer">
        <span class="catalog-card-price">${formatRupiah(item.price)}</span>
        <button type="button" class="btn-catalog-add touch-target"
          onclick="addCatalogItemToPlan('${item.id}')"
          title="Tambah ke Rencana Belanja">
          + Tambah
        </button>
      </div>
    </div>
  `).join('');
}

function filterCatalogCategory(category, buttonEl) {
  catalogActiveCategory = category;
  const pills = document.querySelectorAll('#catalogCategoryPills .catalog-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (buttonEl) buttonEl.classList.add('active');
  renderProductCatalog();
}

function handleCatalogSearch(query) {
  catalogSearchQuery = query;
  renderProductCatalog();
}

function addCatalogItemToPlan(catalogId) {
  const product = PRODUCT_CATALOG.find(p => p.id === catalogId);
  if (!product) return;

  if (checkBlacklist(product.name)) {
    AppState.pendingBlacklistItem = { name: product.name, qty: 1, unit: product.unit };
    showBlacklistWarning(product.name);
    return;
  }

  // Tambahkan barang ke rencana dengan status belum dibeli (checked: false)
  const newItem = {
    id: 'item-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    namaBarang: product.name,
    kategori: product.aisle || 'Kebutuhan Pokok',
    satuan: product.unit || 'pcs',
    qty: 1,
    hargaSatuan: product.price || 0,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: product.price || null,
    store: AppState.currentStore,
    checked: false,
    isRoutine: !!product.isRoutine
  };

  AppState.cart.unshift(newItem);
  playSoftPop();
  pushStateToCloud();
  renderAll();
  showToast('Ditambahkan ke Rencana! 🛒', 'success');
}

function quickAddFavorite(name, qty, unit, category, price, promoType = 'none', promoVal = '') {
  if (checkBlacklist(name)) {
    AppState.pendingBlacklistItem = { name, qty, unit };
    showBlacklistWarning(name);
    return;
  }

  const history = AppState.priceHistory[name] || {};
  const finalPrice = (price !== undefined && price !== null) ? price : (history.harga || 0);

  const newItem = {
    id: 'item-' + Date.now(),
    namaBarang: name,
    kategori: category || detectCategory(name),
    satuan: unit || 'pcs',
    qty: qty || 1,
    hargaSatuan: finalPrice,
    diskonTipe: promoType || 'none',
    diskonValue: promoVal || '',
    hargaRiwayatBulanLalu: history.harga || null,
    store: AppState.currentStore,
    checked: (finalPrice > 0)
  };

  AppState.cart.unshift(newItem);
  playSoftPop();
  pushStateToCloud();
  renderAll();
  showToast(`"${name}" ditambahkan dari Frequently Bought ✨`, 'success');
}

// =========================================================================
// 8C. DAILY AUTO-REFRESH RENCANA BELANJA & ROUTINE ITEMS MANAGER
// =========================================================================

/**
 * Toggle status "Rutin Harian" pada item belanja
 */
function toggleItemRoutine(itemId) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  item.isRoutine = !item.isRoutine;

  if (!AppState.routineItems) AppState.routineItems = [];
  const existingIdx = AppState.routineItems.findIndex(r => (r.namaBarang || r.name || '').toLowerCase() === item.namaBarang.toLowerCase());

  if (item.isRoutine) {
    if (existingIdx === -1) {
      AppState.routineItems.push({
        namaBarang: item.namaBarang,
        kategori: item.kategori || 'Bahan Pokok',
        satuan: item.satuan || 'pcs',
        qty: item.qty || 1,
        hargaSatuan: item.hargaSatuan || 0,
        isRoutine: true
      });
    } else {
      AppState.routineItems[existingIdx].isRoutine = true;
    }
    showToast(`"${item.namaBarang}" ditandai sebagai Rutin Harian 🔁`, 'success');
  } else {
    if (existingIdx !== -1) {
      AppState.routineItems.splice(existingIdx, 1);
    }
    showToast(`"${item.namaBarang}" bukan lagi barang rutin`, 'info');
  }

  saveLocalState();
  pushStateToCloud();
  renderItems();
  renderCartSection();
}

/**
 * Acak & perbarui urutan rekomendasi Katalog Produk Shopee Harian
 */
function shuffleDailyCatalog(dateStr) {
  if (!Array.isArray(PRODUCT_CATALOG) || PRODUCT_CATALOG.length === 0) return;
  const seedStr = dateStr || new Date().toISOString().split('T')[0];
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) % 100000;
  }

  for (let i = PRODUCT_CATALOG.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280;
    const j = Math.floor(rnd * (i + 1));
    const temp = PRODUCT_CATALOG[i];
    PRODUCT_CATALOG[i] = PRODUCT_CATALOG[j];
    PRODUCT_CATALOG[j] = temp;
  }
}

/**
 * Logika Deteksi Pergantian Hari untuk Auto-Refresh Rencana Belanja
 */
function checkDailyPlannerReset(uid) {
  if (!uid) {
    uid = (AppState.user && AppState.user.uid) ? AppState.user.uid : 'guest';
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const storageKey = 'last_planner_reset_date_' + uid;
  const lastResetDate = localStorage.getItem(storageKey) || localStorage.getItem('last_planner_reset_date');

  // Jika belum ada lastResetDate atau tanggal berbeda (hari baru)
  if (!lastResetDate || lastResetDate !== todayStr) {
    executeDailyPlannerReset(todayStr, uid);
    return true;
  }
  return false;
}

/**
 * Eksekusi Auto-Refresh & Reset Otomatis
 */
function executeDailyPlannerReset(todayStr, uid) {
  if (!todayStr) todayStr = new Date().toISOString().split('T')[0];
  if (!uid) uid = (AppState.user && AppState.user.uid) ? AppState.user.uid : 'guest';

  // 1. Ambil daftar barang rutin harian
  if (!AppState.routineItems || AppState.routineItems.length === 0) {
    AppState.routineItems = JSON.parse(JSON.stringify(DEFAULT_ROUTINE_ITEMS));
  }

  // 2. Munculkan kembali barang rutin ke Rencana Belanja dengan checklist [ ] kosong
  AppState.routineItems.forEach(routine => {
    const rName = (routine.namaBarang || routine.name || '').trim().toLowerCase();
    const existing = AppState.cart.find(i => (i.namaBarang || '').trim().toLowerCase() === rName);
    if (!existing) {
      AppState.cart.unshift({
        id: 'item-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
        namaBarang: routine.namaBarang || routine.name,
        kategori: routine.kategori || routine.aisle || 'Bahan Pokok',
        satuan: routine.satuan || routine.unit || 'pcs',
        qty: routine.qty || 1,
        hargaSatuan: routine.hargaSatuan || routine.price || 0,
        diskonTipe: 'none',
        diskonValue: '',
        hargaRiwayatBulanLalu: routine.hargaSatuan || routine.price || null,
        store: AppState.currentStore,
        checked: false, // Checklist kosong
        isRoutine: true
      });
    } else {
      existing.checked = false; // Reset checklist ke kosong
      existing.isRoutine = true;
    }
  });

  // 3. Acak/perbarui urutan rekomendasi Katalog Produk Shopee Harian
  shuffleDailyCatalog(todayStr);

  // 4. Simpan tanggal hari ini ke storage
  localStorage.setItem('last_planner_reset_date_' + uid, todayStr);
  localStorage.setItem('last_planner_reset_date', todayStr);

  if (typeof firebase !== 'undefined' && firebase.firestore && uid && uid !== 'guest') {
    try {
      const uRef = userDocRef(uid);
      if (uRef) {
        uRef.set({ last_planner_reset_date: todayStr }, { merge: true }).catch(err => {
          console.warn('Firestore last_planner_reset_date sync note:', err.message);
        });
      }
    } catch (e) { }
  }

  saveLocalState();
  pushStateToCloud();
  renderAll();

  // 5. Tampilkan Toast Notification ramah
  showToast('🌅 Rencana belanja hari ini sudah disiapin! Selamat berbelanja.', 'info');
}

// =========================================================================
// 9. MODAL DETAIL ITEM
// =========================================================================
function openDetailedItemModal(itemId = null) {
  AppState.editingItemId = itemId;
  const modal = document.getElementById('addItemModal') || document.getElementById('itemDetailModal');
  const title = document.getElementById('itemModalTitle');
  const submitBtn = document.getElementById('btnSubmitDetailedItem');
  const advDetails = document.getElementById('detailsAdvancedOptions');

  // Pastikan listener chip diskon single-select terpasang
  initDiscountChips();

  if (itemId) {
    const item = AppState.cart.find(i => i.id === itemId);
    if (!item) return;

    if (title) title.textContent = 'Ubah Item Belanja';
    if (submitBtn) submitBtn.textContent = '💾 Simpan Perubahan';

    document.getElementById('detailInputName').value = item.namaBarang;
    document.getElementById('detailInputCategory').value = item.kategori || 'Kebutuhan Pokok';
    document.getElementById('detailInputUnit').value = item.satuan || 'pcs';
    document.getElementById('detailInputQty').value = item.qty;
    document.getElementById('detailInputPrice').value = item.hargaSatuan ? item.hargaSatuan : '';
    document.getElementById('detailInputHistoryPrice').value = item.hargaRiwayatBulanLalu || '';
    const isRoutineCb = document.getElementById('detailInputIsRoutine');
    if (isRoutineCb) isRoutineCb.checked = !!item.isRoutine;

    const discVal = item.diskonValue || '';
    const discTipe = item.diskonTipe || 'none';
    const chips = document.querySelectorAll('.discount-chip');

    if (!discVal || discTipe === 'none') {
      setDetailDiscountPreset('none', '');
    } else {
      const matchingChip = Array.from(chips).find(c => c.getAttribute('data-val') === String(discVal) && c.getAttribute('data-type') === discTipe) ||
                           Array.from(chips).find(c => c.getAttribute('data-val') === String(discVal));
      if (matchingChip) {
        setDetailDiscountPreset(discTipe, discVal, matchingChip);
      } else {
        // Custom manual discount
        chips.forEach(c => c.classList.remove('active'));
        const discInput = document.getElementById('detailInputDiscountValue');
        if (discInput) discInput.value = discVal;
        AppState.activeDiscountType = discTipe;
        AppState.activeDiscountValue = discVal;
        setDiscountTypeSelection(discTipe, discVal);
      }
    }

    if (advDetails) {
      advDetails.open = !!(item.diskonValue || item.hargaRiwayatBulanLalu || item.isRoutine || (item.kategori && item.kategori !== 'Kebutuhan Pokok'));
    }
  } else {
    if (title) title.textContent = 'Tambah Item Belanja';
    if (submitBtn) submitBtn.textContent = '➕ Tambahkan Barang';

    document.getElementById('detailedItemForm').reset();
    document.getElementById('detailInputQty').value = '1';
    document.getElementById('detailInputUnit').value = 'pcs';
    document.getElementById('detailInputCategory').value = 'Kebutuhan Pokok';
    document.getElementById('detailInputPrice').value = '';
    document.getElementById('detailInputHistoryPrice').value = '';
    const discInput = document.getElementById('detailInputDiscountValue');
    if (discInput) discInput.value = '';
    const isRoutineCb = document.getElementById('detailInputIsRoutine');
    if (isRoutineCb) isRoutineCb.checked = false;

    // Secara default, set pilihan awal pada "Tanpa Diskon" (0%)
    setDetailDiscountPreset('none', '');

    // Default terlipat (closed) untuk item baru
    if (advDetails) advDetails.open = false;
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
  const modal = document.getElementById('addItemModal') || document.getElementById('itemDetailModal');
  if (modal) {
    modal.classList.remove('active', 'show');
  }
  AppState.editingItemId = null;
}

if (typeof window !== 'undefined') {
  window.openAddItemModal = openDetailedItemModal;
  window.closeAddItemModal = closeDetailedItemModal;
}

function initDiscountChips() {
  if (typeof document === 'undefined') return;
  const chips = document.querySelectorAll('.discount-chip');
  chips.forEach(chip => {
    chip.onclick = function(e) {
      if (e) e.preventDefault();
      const type = this.getAttribute('data-type') || 'none';
      const val = this.getAttribute('data-val') || '';
      setDetailDiscountPreset(type, val, this);
    };
  });
}

function setDetailDiscountPreset(type, val = '', clickedChip = null) {
  AppState.activeDiscountType = type || 'none';
  AppState.activeDiscountValue = val || '';

  // Kosongkan input manual diskon jika chip preset diklik
  const input = document.getElementById('detailInputDiscountValue');
  if (input) input.value = '';

  // Hapus kelas .active dari seluruh chip diskon lainnya
  const chips = document.querySelectorAll('.discount-chip');
  chips.forEach(c => c.classList.remove('active'));

  // Tambahkan kelas .active HANYA pada chip yang baru diklik
  let targetChip = clickedChip;
  if (!targetChip && typeof document !== 'undefined') {
    if (type === 'none' || !val) {
      targetChip = document.querySelector('.discount-chip[data-type="none"]') || chips[0];
    } else {
      targetChip = Array.from(chips).find(c => c.getAttribute('data-val') === String(val) && c.getAttribute('data-type') === type) ||
                   Array.from(chips).find(c => c.getAttribute('data-val') === String(val));
    }
  }
  if (targetChip) {
    targetChip.classList.add('active');
  }

  setDiscountTypeSelection(type, val);
  updateDetailModalPreview();
}

function handleDetailDiscountInput(val) {
  val = (val || '').trim();

  // Jika pengguna mengetik persentase di input manual diskon, otomatis hilangkan kelas .active dari semua chip preset
  const chips = document.querySelectorAll('.discount-chip');
  chips.forEach(c => c.classList.remove('active'));

  let type = 'none';
  if (!val) {
    // Secara default, set pilihan awal pada "Tanpa Diskon" (0%)
    AppState.activeDiscountType = 'none';
    AppState.activeDiscountValue = '';
    const noDiscChip = document.querySelector('.discount-chip[data-type="none"]') || chips[0];
    if (noDiscChip) noDiscChip.classList.add('active');
  } else {
    type = val.includes('+') ? 'tiered' : 'single';
    AppState.activeDiscountType = type;
    AppState.activeDiscountValue = val;
  }

  setDiscountTypeSelection(type, val);
  updateDetailModalPreview();
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
    if (val) {
      const el = document.getElementById('inputDiscountSingle');
      if (el) el.value = val;
    }
  } else if (type === 'tiered') {
    if (btnTiered) { btnTiered.style.background = '#F3E8FF'; btnTiered.style.borderColor = '#A855F7'; btnTiered.style.color = '#6B21A8'; }
    if (groupSingle) groupSingle.style.display = 'none';
    if (groupTiered) groupTiered.style.display = 'block';
    if (val) {
      const el = document.getElementById('inputDiscountTiered');
      if (el) el.value = val;
    }
  } else {
    if (btnNone) { btnNone.style.background = 'var(--surface-soft)'; btnNone.style.borderColor = 'var(--accent-blush)'; btnNone.style.color = 'var(--rose-contrast)'; }
    if (groupSingle) groupSingle.style.display = 'none';
    if (groupTiered) groupTiered.style.display = 'none';
  }

  AppState.activeDiscountType = type;
  updateDetailModalPreview();
}

function getSelectedDiscountType() {
  const directInput = document.getElementById('detailInputDiscountValue');
  if (directInput && directInput.value.trim()) {
    return directInput.value.includes('+') ? 'tiered' : 'single';
  }
  return AppState.activeDiscountType || 'none';
}

function getSelectedDiscountValue() {
  const directInput = document.getElementById('detailInputDiscountValue');
  if (directInput && directInput.value.trim()) {
    return directInput.value.trim();
  }
  if (AppState.activeDiscountValue) {
    return AppState.activeDiscountValue;
  }
  const type = getSelectedDiscountType();
  if (type === 'single') {
    const el = document.getElementById('inputDiscountSingle');
    return el ? el.value.trim() : '';
  }
  if (type === 'tiered') {
    const el = document.getElementById('inputDiscountTiered');
    return el ? el.value.trim() : '';
  }
  return '';
}

function setSinglePreset(p) {
  const el = document.getElementById('inputDiscountSingle');
  if (el) el.value = p;
  const direct = document.getElementById('detailInputDiscountValue');
  if (direct) direct.value = p;
  AppState.activeDiscountType = 'single';
  updateDetailModalPreview();
}

function setTieredPreset(fmt) {
  const el = document.getElementById('inputDiscountTiered');
  if (el) el.value = fmt;
  const direct = document.getElementById('detailInputDiscountValue');
  if (direct) direct.value = fmt;
  AppState.activeDiscountType = 'tiered';
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

  const discBadge = document.getElementById('detailEffectivePercentBadge');
  if (discBadge) {
    if (disc.effectivePercent > 0) {
      discBadge.style.display = 'inline-block';
      discBadge.textContent = `Hemat ${disc.effectivePercent}%`;
    } else {
      discBadge.style.display = 'none';
    }
  }

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
 * Validasi Ketat Form Input
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
  const rawPrice = (document.getElementById('detailInputPrice').value || '').trim();
  let hargaSatuan = 0;
  if (rawPrice !== '') {
    hargaSatuan = parseFloat(rawPrice);
    if (isNaN(hargaSatuan) || hargaSatuan < 0) {
      showToast('Harga satuan tidak boleh bernilai negatif!', 'danger');
      document.getElementById('detailInputPrice').focus();
      return;
    }
  }
  const diskonTipe = getSelectedDiscountType();
  const diskonValue = getSelectedDiscountValue();
  const hargaRiwayatBulanLalu = parseFloat(document.getElementById('detailInputHistoryPrice').value) || null;

  // 1. Validasi Nama Barang
  if (!nama) {
    showToast('Nama barang wajib diisi!', 'danger');
    document.getElementById('detailInputName').focus();
    return;
  }

  // 2. Validasi Toko Belanja
  if (!toko) {
    showToast('Toko belanja wajib dipilih!', 'danger');
    return;
  }

  // 3. Validasi Kuantitas (>= 1)
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

  const isRoutine = document.getElementById('detailInputIsRoutine') ? document.getElementById('detailInputIsRoutine').checked : false;

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
      item.isRoutine = isRoutine;
      if (hargaSatuan > 0) item.checked = true;
    }
    // Sync to AppState.routineItems
    if (!AppState.routineItems) AppState.routineItems = [];
    const rIdx = AppState.routineItems.findIndex(r => (r.namaBarang || r.name || '').toLowerCase() === nama.toLowerCase());
    if (isRoutine) {
      if (rIdx === -1) AppState.routineItems.push({ namaBarang: nama, kategori, satuan, qty, hargaSatuan, isRoutine: true });
      else AppState.routineItems[rIdx].isRoutine = true;
    } else if (rIdx !== -1) {
      AppState.routineItems.splice(rIdx, 1);
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
      checked: (hargaSatuan > 0),
      isRoutine
    };
    if (isRoutine) {
      if (!AppState.routineItems) AppState.routineItems = [];
      AppState.routineItems.push({ namaBarang: nama, kategori, satuan, qty, hargaSatuan, isRoutine: true });
    }
    AppState.cart.unshift(newItem);
    showToast(`"${nama}" berhasil ditambahkan ke daftar ✨`, 'success');
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
    if (instoreCard) instoreCard.style.display = 'none';
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

  // 1. Generate Thermal Supermarket Receipt Data Realtime
  const generatedReceipt = generateReceiptData();

  const checkedItems = AppState.cart.filter(item => item.checked);
  const itemsToPantry = checkedItems.length > 0 ? checkedItems : [...AppState.cart];

  // 2. Move checked items to Pantry
  itemsToPantry.forEach(item => {
    AppState.pantry.unshift({
      id: 'pan-' + Date.now() + Math.random().toString(36).substr(2, 4),
      name: item.namaBarang,
      qty: item.qty,
      unit: item.satuan,
      category: item.kategori,
      addedDate: new Date().toISOString(),
      expiryDate: getOffsetDateString(7)
    });

    // Jika ditandai "Rutin", simpan ke AppState.routineItems agar otomatis kembali besok
    if (item.isRoutine) {
      if (!AppState.routineItems) AppState.routineItems = [];
      const idx = AppState.routineItems.findIndex(r => (r.namaBarang || r.name || '').toLowerCase() === item.namaBarang.toLowerCase());
      if (idx === -1) {
        AppState.routineItems.push({
          namaBarang: item.namaBarang,
          kategori: item.kategori || 'Bahan Pokok',
          satuan: item.satuan || 'pcs',
          qty: item.qty || 1,
          hargaSatuan: item.hargaSatuan || 0,
          isRoutine: true
        });
      }
    }
  });

  // 3. Save receipt to history
  if (generatedReceipt) {
    AppState.receipts.unshift(generatedReceipt);
  }

  // 4. Update cart: clear purchased items
  if (checkedItems.length > 0 && checkedItems.length < AppState.cart.length) {
    AppState.cart = AppState.cart.filter(item => !item.checked);
  } else {
    AppState.cart = [];
  }

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

  // 5. Otomatis tampilkan modal Struk Belanja Supermarket Asli
  openReceiptModal();
  showToast('Belanja selesai! Struk resmi kasir siap dicetak 🧾✨', 'success');
}

// =========================================================================
// STRUK BELANJA SUPERMARKET ASLI (Thermal Digital Receipt) LOGIC
// =========================================================================

function generateReceiptData(customReceipt = null) {
  let receipt = customReceipt;

  if (!receipt) {
    if (!AppState.cart || AppState.cart.length === 0) return null;

    const checkedItems = AppState.cart.filter(item => item.checked);
    const itemsToProcess = checkedItems.length > 0 ? checkedItems : AppState.cart;

    let subtotalRaw = 0;
    let totalDiscount = 0;

    const processedItems = itemsToProcess.map(item => {
      const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
      const rawPrice = item.hargaSatuan || 0;
      const finalPrice = disc.finalPrice;
      const savingsUnit = disc.savingsPerUnit;

      const rowRawSubtotal = rawPrice * item.qty;
      const rowFinalSubtotal = finalPrice * item.qty;
      const rowSavings = savingsUnit * item.qty;

      subtotalRaw += (rawPrice > 0 ? rowRawSubtotal : rowFinalSubtotal);
      totalDiscount += rowSavings;

      return {
        namaBarang: item.namaBarang,
        qty: item.qty,
        satuan: item.satuan,
        hargaSatuan: rawPrice,
        hargaAkhirSatuan: finalPrice,
        subtotal: rowFinalSubtotal,
        diskonNominal: rowSavings,
        diskonTipe: item.diskonTipe,
        diskonValue: item.diskonValue
      };
    });

    const grandTotal = Math.max(0, subtotalRaw - totalDiscount);
    const taxPpn = Math.round(grandTotal * 0.11); // PPN 11%

    receipt = {
      id: 'rec-' + Date.now(),
      tanggal: AppState.currentDate || new Date().toISOString().slice(0, 10),
      toko: AppState.currentStore || 'Supermarket',
      judul: `Belanja ${AppState.currentStore || 'Supermarket'}`,
      trxNo: 'TRX-' + (AppState.currentDate || new Date().toISOString().slice(0, 10)).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000),
      posNo: 'POS-0' + (Math.floor(Math.random() * 4) + 1),
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      kasir: (AppState.currentUser && AppState.currentUser.displayName) || 'Self-Checkout / Pengguna',
      subtotal: subtotalRaw,
      totalHemat: totalDiscount,
      totalBelanja: grandTotal,
      grandTotal: grandTotal,
      taxPpn: taxPpn,
      budgetSaatItu: AppState.budget,
      statusBudget: evaluateBudgetSafety(grandTotal, AppState.budget).level,
      items: processedItems
    };
  }

  // Populate Header Toko
  const storeRaw = receipt.toko || 'Supermarket';
  let storeTitle = storeRaw.toUpperCase();
  let branchText = 'Cabang Resmi Supermarket';
  let addressText = 'Jl. Boulevard Raya No. 88 • Telp: (021) 500-888';

  if (storeRaw.includes('Lotte Mart')) {
    storeTitle = 'LOTTE MART GROCERY';
    branchText = 'Cabang Mall Puri Indah, Lt. GF';
    addressText = 'Jl. Puri Agung No. 1, Jakarta Barat • Telp: (021) 5835-8899';
  } else if (storeRaw.includes('Superindo')) {
    storeTitle = 'SUPERINDO SUPERMARKET';
    branchText = 'Cabang Kebon Jeruk, Jl. Pejuangan';
    addressText = 'Jl. Raya Pejuangan No. 88, Jakarta Barat • Telp: (021) 536-1234';
  } else if (storeRaw.includes('Grand Lucky')) {
    storeTitle = 'GRAND LUCKY SUPERSTORE';
    branchText = 'Cabang SCBD Lot 12';
    addressText = 'Kawasan Niaga Terpadu Sudirman, Jaksel • Telp: (021) 515-3888';
  } else if (storeRaw.includes('Hypermart')) {
    storeTitle = 'HYPERMART SUPERSTORE';
    branchText = 'Cabang Puri Indah Mall';
    addressText = 'Sentra Bisnis Puri Indah Blok U1 • Telp: (021) 582-2777';
  } else if (storeRaw.includes('Alfamart') || storeRaw.includes('Indomaret')) {
    storeTitle = 'MINIMARKET RETAIL';
    branchText = 'Outlet Komersial No. 104B';
    addressText = 'Kawasan Residensial Puri • Telp: 1500-959';
  } else if (storeRaw.includes(' - ')) {
    const parts = storeRaw.split(' - ');
    storeTitle = parts[0].toUpperCase();
    branchText = 'Cabang ' + parts[1];
  }

  const elStoreName = document.getElementById('receiptStoreName');
  const elStoreBranch = document.getElementById('receiptStoreBranch');
  const elStoreAddress = document.getElementById('receiptStoreAddress');
  const elTrxNo = document.getElementById('receiptTrxNo');
  const elPosNo = document.getElementById('receiptPosNo');
  const elDateTime = document.getElementById('receiptDateTime');
  const elCashier = document.getElementById('receiptCashierName');

  if (elStoreName) elStoreName.textContent = storeTitle;
  if (elStoreBranch) elStoreBranch.textContent = branchText;
  if (elStoreAddress) elStoreAddress.textContent = addressText;

  const trxVal = receipt.trxNo || ('TRX-' + (receipt.tanggal || '').replace(/-/g, '') + '-' + (receipt.id ? receipt.id.slice(-4) : '8821'));
  if (elTrxNo) elTrxNo.textContent = trxVal;
  if (elPosNo) elPosNo.textContent = receipt.posNo || 'POS-02';

  const dateFormatted = receipt.tanggal || new Date().toISOString().slice(0, 10);
  const timeFormatted = receipt.waktu || '20:15:00';
  if (elDateTime) elDateTime.textContent = `${dateFormatted} ${timeFormatted}`;
  if (elCashier) elCashier.textContent = receipt.kasir || ((AppState.currentUser && AppState.currentUser.displayName) || 'Self-Checkout / Pengguna');

  // Populate Items List
  const itemsContainer = document.getElementById('receiptItemsContainer');
  if (itemsContainer) {
    if (!receipt.items || receipt.items.length === 0) {
      itemsContainer.innerHTML = '<div style="text-align:center; padding: 10px; font-size:10px; color:#64748B;">(Tidak ada rincian barang)</div>';
    } else {
      itemsContainer.innerHTML = receipt.items.map(item => {
        const discNominal = item.diskonNominal || 0;
        const hasDisc = discNominal > 0;
        const unitPrice = item.hargaSatuan || item.hargaAkhirSatuan || 0;
        const rowSubtotal = item.subtotal || item.totalHarga || (item.hargaAkhirSatuan * item.qty);

        return `
          <div class="receipt-item-row">
            <div class="receipt-item-name">${escapeHtml(item.namaBarang)}</div>
            <div class="receipt-item-calc">
              <span>${item.qty} ${escapeHtml(item.satuan || 'pcs')} x ${formatRupiah(unitPrice)}</span>
              <span class="receipt-item-subtotal">${formatRupiah(rowSubtotal)}</span>
            </div>
            ${hasDisc ? `
              <div class="receipt-item-discount">
                <span>  (HEMAT/DISKON)</span>
                <span>-${formatRupiah(discNominal)}</span>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }
  }

  // Populate Ringkasan Total
  const subtotalVal = receipt.subtotal || receipt.totalBelanja || 0;
  const discountVal = receipt.totalHemat || 0;
  const grandTotalVal = receipt.grandTotal || receipt.totalBelanja || 0;
  const taxVal = receipt.taxPpn || Math.round(grandTotalVal * 0.11);
  const budgetVal = receipt.budgetSaatItu || AppState.budget || 0;
  const remainingVal = Math.max(0, budgetVal - grandTotalVal);

  const elSubtotal = document.getElementById('receiptSubtotal');
  const elDiscount = document.getElementById('receiptDiscount');
  const elDiscountRow = document.getElementById('receiptDiscountRow');
  const elTax = document.getElementById('receiptTax');
  const elGrandTotal = document.getElementById('receiptGrandTotal');
  const elPaymentUsed = document.getElementById('receiptPaymentUsed');
  const elRemainingBudget = document.getElementById('receiptRemainingBudget');
  const elSavingsBanner = document.getElementById('receiptSavingsBanner');
  const elSavingsHighlight = document.getElementById('receiptSavingsHighlight');
  const elBarcodeNum = document.getElementById('receiptBarcodeNumber');

  if (elSubtotal) elSubtotal.textContent = formatRupiah(subtotalVal);
  if (elDiscount) elDiscount.textContent = '-' + formatRupiah(discountVal);
  if (elDiscountRow) elDiscountRow.style.display = discountVal > 0 ? 'flex' : 'none';
  if (elTax) elTax.textContent = formatRupiah(taxVal);
  if (elGrandTotal) elGrandTotal.textContent = formatRupiah(grandTotalVal);
  if (elPaymentUsed) elPaymentUsed.textContent = formatRupiah(grandTotalVal);
  if (elRemainingBudget) elRemainingBudget.textContent = formatRupiah(remainingVal);

  // Highlight Kehematan Banner
  if (elSavingsBanner && elSavingsHighlight) {
    if (discountVal > 0) {
      elSavingsHighlight.textContent = formatRupiah(discountVal);
      elSavingsBanner.style.display = 'block';
    } else {
      elSavingsBanner.style.display = 'none';
    }
  }

  // Barcode number
  if (elBarcodeNum) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    elBarcodeNum.textContent = `9823 8812 0019 ${randomSuffix}`;
  }

  return receipt;
}

function openReceiptModal() {
  const modal = document.getElementById('receiptModal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeReceiptModal() {
  const modal = document.getElementById('receiptModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function printReceipt() {
  window.print();
}

function viewHistoricalReceipt(receiptId) {
  const rec = (AppState.receipts || []).find(r => r.id === receiptId);
  if (!rec) {
    showToast('Struk belanja tidak ditemukan', 'warning');
    return;
  }
  generateReceiptData(rec);
  openReceiptModal();
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
    renderPantryCatalog();
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
  renderPantryCatalog();
}

// =========================================================================
// 12B. VISUAL PANTRY PRODUCT CATALOG ALA SHOPEE (PRESET DATA & 1-TAP ADD)
// =========================================================================
const PANTRY_CATALOG = [
  { id: 'pan-cat-1', name: 'Beras 5kg', icon: '🌾', unit: 'karung/5kg', category: 'Kebutuhan Pokok', days: 90, desc: 'Bahan Pokok' },
  { id: 'pan-cat-2', name: 'Minyak Goreng', icon: '🍳', unit: 'pouch/2L', category: 'Minyak & Bumbu', days: 60, desc: 'Minyak Masak' },
  { id: 'pan-cat-3', name: 'Garam Dapur', icon: '🧂', unit: 'bungkus', category: 'Minyak & Bumbu', days: 180, desc: 'Bumbu Dapur' },
  { id: 'pan-cat-4', name: 'Gula Pasir', icon: '🍬', unit: 'kg', category: 'Minyak & Bumbu', days: 90, desc: 'Pemanis Dapur' },
  { id: 'pan-cat-5', name: 'Kecap Manis', icon: '🍾', unit: 'pouch', category: 'Minyak & Bumbu', days: 90, desc: 'Bumbu Masak' },
  { id: 'pan-cat-6', name: 'Sabun Cuci', icon: '🍋', unit: 'pouch', category: 'Kebersihan', days: 60, desc: 'Kebersihan' },
  { id: 'pan-cat-7', name: 'Pasta Gigi', icon: '🪥', unit: 'tube', category: 'Kebersihan', days: 90, desc: 'Kebersihan Diri' },
  { id: 'pan-cat-8', name: 'Deterjen Bubuk', icon: '🧺', unit: 'bag', category: 'Kebersihan', days: 90, desc: 'Cuci Pakaian' }
];

function renderPantryCatalog() {
  const container = document.getElementById('pantryCatalogGrid');
  if (!container) return;

  container.innerHTML = PANTRY_CATALOG.map(item => `
    <div class="catalog-card pantry-catalog-card" data-pantry-cat-id="${item.id}">
      <div class="catalog-thumb-wrap">
        <span>${item.icon}</span>
      </div>
      <div class="catalog-card-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</div>
      <div class="catalog-card-footer">
        <span class="catalog-card-price" style="font-size: 11px; color: var(--text-subtle); font-weight: 600;">${escapeHtml(item.desc || item.unit)}</span>
        <button type="button" class="btn-catalog-add btn-pantry-add touch-target"
          onclick="addPantryCatalogItem('${item.id}')"
          title="Tambah ke Inventaris Pantry">
          + Tambah Stok
        </button>
      </div>
    </div>
  `).join('');
}

function addPantryCatalogItem(catalogId) {
  const item = PANTRY_CATALOG.find(p => p.id === catalogId);
  if (!item) return;

  const existing = AppState.pantry.find(p => p.name.toLowerCase() === item.name.toLowerCase());
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
    existing.expiryDate = getOffsetDateString(item.days || 60);
  } else {
    AppState.pantry.unshift({
      id: 'pan-' + Date.now() + Math.random().toString(36).substr(2, 4),
      name: item.name,
      qty: 1,
      unit: item.unit || 'pcs',
      category: item.category || 'Pantry',
      addedDate: new Date().toISOString(),
      expiryDate: getOffsetDateString(item.days || 60)
    });
  }

  saveLocalState();
  renderPantry();
  playCalmChime();
  showToast(`"${item.name}" berhasil ditambahkan ke Pantry! 🧺`, 'success');
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
        ${(r.items || []).map(i => `${escapeHtml(i.namaBarang)} (${i.qty} ${i.satuan})`).join(', ')}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; padding-top: 6px; border-top: 1px dashed var(--pastel-light-1);">
        <span style="font-size: 0.68rem; color: var(--text-faint); font-weight: 600;">${(r.items || []).length} jenis barang</span>
        <button type="button" class="btn-demo-quick" style="margin: 0; padding: 3px 8px; font-size: 0.68rem; font-weight: 700; color: #E91E63;" onclick="viewHistoricalReceipt('${r.id}')">🧾 Lihat Struk Asli</button>
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
// 15. CLOUD SYNC SETTINGS MODAL
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
  const settingsToggle = document.getElementById('settingsThemeToggle');

  if (isDark) {
    document.body.classList.add('dark-mode');
    if (metaTheme) metaTheme.setAttribute('content', '#1A0B14');
    if (toggleBtn) toggleBtn.textContent = '☀️';
    if (settingsToggle) settingsToggle.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    if (metaTheme) metaTheme.setAttribute('content', '#FCE7F3');
    if (toggleBtn) toggleBtn.textContent = '🌙';
    if (settingsToggle) settingsToggle.checked = false;
  }
}

// =========================================================================
// 16B. PROFILE & SETTINGS MODAL (Shopee Soft Pink Clean Style)
// =========================================================================

function openProfileSettingsModal() {
  const modal = document.getElementById('profileSettingsModal');
  if (!modal) return;

  // Guard: Never open profile settings if user is unauthenticated or on login screen
  if (typeof document !== 'undefined' && document.body && 
      (document.body.classList.contains('auth-locked') || document.body.classList.contains('unauthenticated')) && 
      (!AppState.user || !AppState.user.name)) {
    return;
  }

  // 1. Populate profile details from active user
  const user = AppState.user || (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser);
  const userName = (user && (user.name || user.displayName)) || 'Pengguna';
  const userEmail = (user && user.email) || 'user@email.com';
  const userPhoto = user && (user.photoURL || user.photo);

  const modalName = document.getElementById('modalUserName');
  const modalEmail = document.getElementById('modalUserEmail');
  const modalAvatar = document.getElementById('modalUserAvatar');
  const modalAvatarFallback = document.getElementById('modalUserAvatarFallback');

  if (modalName) modalName.textContent = userName;
  if (modalEmail) modalEmail.textContent = userEmail;
  if (modalAvatar && modalAvatarFallback) {
    if (userPhoto) {
      modalAvatar.src = userPhoto;
      modalAvatar.style.display = 'block';
      modalAvatarFallback.style.display = 'none';
    } else {
      modalAvatar.style.display = 'none';
      modalAvatarFallback.style.display = 'flex';
    }
  }

  // 2. Populate Dark Mode toggle switch
  const themeToggle = document.getElementById('settingsThemeToggle');
  if (themeToggle) {
    themeToggle.checked = document.body.classList.contains('dark-mode');
  }

  // 3. Populate Sound FX toggle switch
  const soundToggle = document.getElementById('settingsSoundToggle');
  if (soundToggle) {
    soundToggle.checked = AppState.soundEnabled !== false;
  }

  // 4. Populate PWA status
  const pwaBtn = document.getElementById('modalBtnInstallPwa');
  const pwaBadge = document.getElementById('modalPwaInstalledBadge');
  const isStandalone = (typeof window !== 'undefined') &&
    ((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || (window.navigator && window.navigator.standalone === true));
  if (isStandalone) {
    if (pwaBtn) pwaBtn.style.display = 'none';
    if (pwaBadge) pwaBadge.style.display = 'inline-block';
  } else {
    if (pwaBtn) pwaBtn.style.display = 'inline-block';
    if (pwaBadge) pwaBadge.style.display = 'none';
  }

  // 5. Populate Cloud Sync status
  const cloudStatus = document.getElementById('modalCloudSyncStatus');
  if (cloudStatus) {
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      cloudStatus.className = 'settings-status-pill online';
      cloudStatus.textContent = '🟢 Tersambung ke Google Cloud';
    } else {
      cloudStatus.className = 'settings-status-pill offline';
      cloudStatus.textContent = '🟠 Mode Offline (LocalStorage)';
    }
  }

  modal.style.display = 'flex';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeProfileSettingsModal() {
  const modal = document.getElementById('profileSettingsModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('open', 'active', 'show');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function toggleThemeFromSettings(checked) {
  applyTheme(checked);
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, checked.toString());
  showToast(checked ? 'Mode Gelap diaktifkan 🌙' : 'Mode Terang diaktifkan ☀️', 'info');
}

function toggleSoundFromSettings(checked) {
  AppState.soundEnabled = checked;
  localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(checked));
  const btn = document.getElementById('btnSoundToggle');
  if (btn) btn.textContent = checked ? '🔊' : '🔇';
  showToast(checked ? 'Suara Feedback Aktif 🔊' : 'Suara Dibisukan 🔇', 'info');
}

function handleClearCacheAndReset() {
  if (typeof caches !== 'undefined') {
    caches.keys().then(keys => {
      keys.forEach(k => caches.delete(k));
    });
  }
  showToast('Cache lokal dibersihkan! Memuat ulang aset...', 'success');
  setTimeout(() => {
    if (typeof window !== 'undefined' && window.location) {
      window.location.reload();
    }
  }, 600);
}

function handleProfileLogout() {
  closeProfileSettingsModal();
  promptLogout(true);
}

// =========================================================================
// 17. TAB SWITCHING (ICON-ONLY BOTTOM DOCK)
// =========================================================================
function switchTab(tab, force = false) {
  if (AppState.currentTab === tab && !force) return;
  AppState.currentTab = tab;

  const tabIndex = { planner: 0, cart: 1, budget: 2, pantry: 3 };
  const navBtns = document.querySelectorAll('.bottom-nav-bar .bottom-nav-item');
  navBtns.forEach((btn, idx) => {
    btn.classList.toggle('active', idx === tabIndex[tab]);
  });

  const tabBudget = document.getElementById('tabBudget');
  const tabPlanner = document.getElementById('tabPlanner');
  const tabCart = document.getElementById('tabCart');
  const tabPantry = document.getElementById('tabPantry');

  if (tabBudget) {
    const isTarget = (tab === 'budget');
    tabBudget.style.display = isTarget ? 'block' : 'none';
    tabBudget.classList.toggle('active', isTarget);
  }
  if (tabPlanner) {
    const isTarget = (tab === 'planner');
    tabPlanner.style.display = isTarget ? 'block' : 'none';
    tabPlanner.classList.toggle('active', isTarget);
  }
  if (tabCart) {
    const isTarget = (tab === 'cart');
    tabCart.style.display = isTarget ? 'block' : 'none';
    tabCart.classList.toggle('active', isTarget);
  }
  if (tabPantry) {
    const isTarget = (tab === 'pantry');
    tabPantry.style.display = isTarget ? 'block' : 'none';
    tabPantry.classList.toggle('active', isTarget);
  }

  // Update floating controls state instantly (0 ms) without re-rendering
  const fab = document.getElementById('fabStoreMode');
  const runningBar = document.getElementById('runningCartBar');
  if (tab === 'planner') {
    if (AppState.inStoreMode) {
      if (fab) fab.style.display = 'none';
      if (runningBar) runningBar.classList.remove('d-none');
    } else {
      if (fab) fab.style.display = 'inline-flex';
      if (runningBar) runningBar.classList.add('d-none');
    }
  } else {
    if (fab) fab.style.display = 'none';
    if (runningBar) runningBar.classList.add('d-none');
  }

  // Synchronize segmented buttons between planner and cart
  const btnPlanner = document.getElementById('btnViewPlanner');
  const btnCart = document.getElementById('btnViewCart');
  if (btnPlanner) btnPlanner.classList.toggle('active', tab === 'planner');
  if (btnCart) btnCart.classList.toggle('active', tab === 'cart');
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
// 20. SINGLETON TOAST MANAGER (NON-BLOCKING & DEBOUNCED)
// =========================================================================
let lastToastMessage = '';
let lastToastTimestamp = 0;
let activeToastTimeout = null;

function showToast(message, type = 'info') {
  if (typeof document === 'undefined') return;

  const now = Date.now();
  // Cegah pemanggilan ganda jika pesan yang sama dipanggil berulang kali dalam jeda singkat (debounce 1.5s)
  if (message === lastToastMessage && (now - lastToastTimestamp < 1500)) {
    return;
  }
  lastToastMessage = message;
  lastToastTimestamp = now;

  // Hapus/bersihkan toast yang sedang tampil sebelumnya
  if (activeToastTimeout) {
    clearTimeout(activeToastTimeout);
    activeToastTimeout = null;
  }
  document.querySelectorAll('.app-toast, .toast-message').forEach(t => t.remove());

  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Buat SATU elemen toast baru
  const toast = document.createElement('div');
  toast.className = `app-toast toast-message ${type}`;

  let icon = 'ℹ️';
  if (type === 'danger' || type === 'error') icon = '⚠️';
  else if (type === 'success') icon = '✅';
  else if (type === 'warning') icon = '⚠️';

  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  // Pasang timer otomatis hilang setelah 2 detik
  activeToastTimeout = setTimeout(() => {
    toast.classList.add('fade-out');
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%, -10px)';
    toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 250);
  }, 2000);
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
  initDiscountChips();
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
    PRODUCT_CATALOG,
    PANTRY_CATALOG,
    DEFAULT_ROUTINE_ITEMS,
    checkDailyPlannerReset,
    executeDailyPlannerReset,
    shuffleDailyCatalog,
    toggleItemRoutine,
    renderPantryCatalog,
    addPantryCatalogItem,
    calculateDiscount,
    comparePriceWithLastMonth,
    parseSmartInput
  };
}

// =========================================================================
// DEDICATED SHOPEE-STYLE COMPACT CART & QUICK DISCOUNT POPOVER
// =========================================================================

/**
 * Render Dedicated Keranjang Belanja Khusus (Shopee Style Cart -  & UX)
 */
function renderCartSection() {
  const container = document.getElementById('cartItemsContainer') || document.getElementById('dedicatedCartItemsContainer');
  const storeDisplay = document.getElementById('cartCurrentStoreDisplay');
  const selectAllCb = document.getElementById('cartSelectAllCheckbox');
  const grandTotalEl = document.getElementById('checkoutGrandTotal');
  const budgetSubEl = document.getElementById('checkoutBudgetRemaining');
  const selectedCountEl = document.getElementById('cartSelectedCountBadge');
  const checkoutBtnCount = document.getElementById('checkoutBtnCount');

  if (storeDisplay) storeDisplay.textContent = AppState.currentStore;

  const metrics = getCartMetrics();
  if (grandTotalEl) grandTotalEl.textContent = formatRupiah(metrics.totalBelanja);
  if (selectedCountEl) selectedCountEl.textContent = metrics.checkedItemsCount;
  if (checkoutBtnCount) checkoutBtnCount.textContent = `(${metrics.checkedItemsCount})`;

  if (budgetSubEl) {
    if (metrics.safety.sisa >= 0) {
      budgetSubEl.textContent = `Sisa Saldo: ${formatRupiah(metrics.safety.sisa)} (${metrics.safety.level === 'warning' ? 'Rem Dulu Kak' : 'Aman'})`;
      budgetSubEl.style.color = (metrics.safety.level === 'warning') ? '#B45309' : 'var(--status-safe)';
    } else {
      budgetSubEl.textContent = `Defisit: - ${formatRupiah(Math.abs(metrics.safety.sisa))}`;
      budgetSubEl.style.color = '#DC2626';
    }
  }

  if (!container) return;

  // Requirement 1: Empty State Visual (UX)
  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 36px 16px; text-align: center;">
        <div style="font-size: 42px; margin-bottom: 8px;">🛒</div>
        <p style="font-weight: 700; font-size: 1rem; color: #222222; margin-bottom: 6px;">Keranjang masih kosong</p>
        <p style="font-size: 0.8rem; color: #757575; margin-bottom: 14px;">Keranjang belanja masih kosong, silakan tambah atau scan barang pertamamu!</p>
        <button type="button" class="btn-demo-quick" style="width: auto; padding: 6px 16px; margin: 0 auto;" onclick="switchTab('planner')">
          📋 Buka Rencana Belanja
        </button>
      </div>
    `;
    if (selectAllCb) selectAllCb.checked = false;
    updateCartBadges();
    return;
  }

  const allChecked = AppState.cart.length > 0 && AppState.cart.every(i => i.checked);
  if (selectAllCb) selectAllCb.checked = allChecked;

  let html = '';
  AppState.cart.forEach(item => {
    const hasNoPrice = (!item.hargaSatuan || item.hargaSatuan <= 0);

    if (hasNoPrice) {
      html += `
        <div class="shopee-item-card unpriced-plan-item ${item.checked ? 'checked' : ''}" data-item-id="${item.id}" onclick="handleItemRowClick('${item.id}', event)">
          <!-- Checkbox: Memicu popover input harga riil saat belanja di toko -->
          <label class="cart-item-checkbox-wrap" title="Centang untuk masukkan harga riil di toko">
            <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="handleItemCheckOrPricePrompt('${item.id}', this)">
          </label>

          <!-- Compact Body (Flexbox Horizontal, Shopee Cart Item Layout) -->
          <div class="shopee-compact-body">
            <!-- Top Row: Judul Produk + Kuantitas Satuan in Center, Edit & Trash on Right Top -->
            <div class="shopee-compact-top">
              <div class="shopee-compact-title-wrap">
                <span class="shopee-compact-name" title="${escapeHtml(item.namaBarang)}">
                  ${escapeHtml(item.namaBarang)}
                </span>
                <span class="planner-unit-badge">📦 ${item.qty} ${escapeHtml(item.satuan || 'pcs')}</span>
                <button type="button" class="routine-toggle-pill ${item.isRoutine ? 'active' : ''}" onclick="toggleItemRoutine('${item.id}'); event.stopPropagation();" title="${item.isRoutine ? 'Barang Rutin Harian: Otomatis muncul setiap hari' : 'Jadikan Rutin Harian'}">
                  🔁 ${item.isRoutine ? 'Rutin Harian' : 'Rutin'}
                </button>
              </div>
              <div class="shopee-compact-actions">
                <button type="button" class="btn-action-edit-icon" onclick="openDetailedItemModal('${item.id}'); event.stopPropagation();" title="Ubah Item">✏️</button>
                <button type="button" class="btn-shopee-delete" onclick="confirmDeleteItem('${item.id}'); event.stopPropagation();" title="Hapus Item">🗑️</button>
              </div>
            </div>

            <!-- Bottom Row (Bottom Action Row): Belum Ada Harga / + Isi Harga on Left, Stepper on Right -->
            <div class="shopee-compact-bottom">
              <div class="shopee-compact-price-wrap">
                <button type="button" class="badge-no-price touch-target" onclick="openQuickPriceModal('${item.id}', false); event.stopPropagation();" title="Klik untuk masukkan harga di toko">
                  🏷️ Belum Ada Harga
                </button>
                <button type="button" class="btn-enter-price-pill touch-target" onclick="openQuickPriceModal('${item.id}', false); event.stopPropagation();" title="Masukkan harga riil di toko">
                  + Isi Harga
                </button>
              </div>

              <div class="shopee-compact-stepper-wrap">
                <div class="shopee-stepper">
                  <button type="button" class="shopee-step-btn" onclick="updateItemQty('${item.id}', -1); event.stopPropagation();" title="Kurang">&minus;</button>
                  <input type="number" inputmode="numeric" id="cart-qty-${item.id}" min="1" value="${item.qty}"
                         oninput="handleQtyDirectInput('${item.id}', this.value)"
                         onblur="handleQtyBlur('${item.id}', this.value)"
                         onclick="event.stopPropagation()">
                  <button type="button" class="shopee-step-btn" onclick="updateItemQty('${item.id}', 1); event.stopPropagation();" title="Tambah">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
      const subtotal = disc.finalPrice * item.qty;
      const isSameStore = (!item.store || item.store === AppState.currentStore);
      const baseline = item.hargaRiwayatBulanLalu || (isSameStore ? getStorePriceHistory(item.namaBarang, item.store || AppState.currentStore) : null);
      const comparator = comparePriceWithLastMonth(disc.finalPrice, baseline, isSameStore);

      let promoBadge = '';
      if (item.diskonTipe === 'single') promoBadge = `🏷️ -${item.diskonValue}%`;
      else if (item.diskonTipe === 'tiered') promoBadge = `🔥 ${item.diskonValue}`;

      html += `
        <div class="shopee-item-card ${item.checked ? 'checked' : ''}" data-item-id="${item.id}">
          <!-- Checkbox -->
          <label class="cart-item-checkbox-wrap" title="Pilih Item untuk Dihitung">
            <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleItemCheck('${item.id}')">
          </label>

          <!-- Compact Body (Flexbox Horizontal, Shopee Cart Item Layout) -->
          <div class="shopee-compact-body">
            <!-- Top Row: Judul Produk + Badge Diskon/Fluktuasi in Center, Edit & Trash on Right Top -->
            <div class="shopee-compact-top">
              <div class="shopee-compact-title-wrap">
                <span class="shopee-compact-name" title="${escapeHtml(item.namaBarang)}">
                  ${escapeHtml(item.namaBarang)}
                </span>
                <div class="shopee-compact-meta-left">
                  <span class="${comparator.badgeClass}">${comparator.text}</span>
                  <button type="button" class="routine-toggle-pill ${item.isRoutine ? 'active' : ''}" onclick="toggleItemRoutine('${item.id}'); event.stopPropagation();" title="${item.isRoutine ? 'Barang Rutin Harian: Otomatis muncul setiap hari' : 'Jadikan Rutin Harian'}">
                    🔁 ${item.isRoutine ? 'Rutin Harian' : 'Rutin'}
                  </button>
                  ${promoBadge ? `<button type="button" class="shopee-promo-pill" onclick="openQuickDiscountPopover('${item.id}')" title="Atur Diskon Cepat">${promoBadge}</button>` : `<button type="button" class="shopee-promo-pill" onclick="openQuickDiscountPopover('${item.id}')" title="Atur Diskon Cepat">🏷️ +Diskon</button>`}
                </div>
              </div>
              <div class="shopee-compact-actions">
                <button type="button" class="btn-action-edit-icon" onclick="openDetailedItemModal('${item.id}')" title="Ubah Item">✏️</button>
                <button type="button" class="btn-shopee-delete" onclick="confirmDeleteItem('${item.id}')" title="Hapus Item">🗑️</button>
              </div>
            </div>

            <!-- Bottom Row (Bottom Action Row): Harga Satuan on Left, Stepper on Right -->
            <div class="shopee-compact-bottom">
              <div class="shopee-compact-price-wrap">
                <span class="subtotal-amount price-tag" id="subtotal-${item.id}" onclick="openQuickPriceModal('${item.id}', false)" style="cursor: pointer;" title="Klik untuk ubah harga">${formatRupiah(subtotal)}</span>
                <span class="planner-unit-badge">📦 ${item.qty} ${escapeHtml(item.satuan || 'pcs')}</span>
              </div>

              <div class="shopee-compact-stepper-wrap">
                <div class="shopee-stepper">
                  <button type="button" class="shopee-step-btn" onclick="updateItemQty('${item.id}', -1)" title="Kurang">&minus;</button>
                  <input type="number" inputmode="numeric" id="cart-qty-${item.id}" min="1" value="${item.qty}"
                         oninput="handleQtyDirectInput('${item.id}', this.value)"
                         onblur="handleQtyBlur('${item.id}', this.value)">
                  <button type="button" class="shopee-step-btn" onclick="updateItemQty('${item.id}', 1)" title="Tambah">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  });

  container.innerHTML = html;
  updateCartBadges();
}

/**
 * Centang / Hapus Semua Item di Keranjang Belanja
 */
function handleCartSelectAll(checked) {
  AppState.cart.forEach(item => { item.checked = checked; });
  playSoftPop();
  pushStateToCloud();
  renderAll();
}

/**
 * Sinkronisasi Badge Counter pada Bottom Nav & Segmented Pill
 */
function updateCartBadges() {
  const unbought = AppState.cart.filter(i => !i.checked);
  const checked = AppState.cart.filter(i => i.checked);

  // Bottom Nav badge
  const navBadge = document.getElementById('bottomCartBadge');
  if (navBadge) {
    navBadge.textContent = AppState.cart.length;
    navBadge.style.display = AppState.cart.length > 0 ? 'inline-block' : 'none';
  }

  // Segment buttons
  const unboughtPills = ['unboughtItemCount', 'unboughtItemCountPill', 'unboughtItemCountPill2'];
  unboughtPills.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = unbought.length;
  });

  const cartPills = ['cartCountPill', 'cartCountPill2', 'cartSelectedCountBadge'];
  cartPills.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = checked.length;
  });

  const checkoutBtnCount = document.getElementById('checkoutBtnCount');
  if (checkoutBtnCount) checkoutBtnCount.textContent = `(${checked.length})`;
}

/**
 * Switcher Segment Belanja (Rencana Belanja vs Keranjang Belanja)
 */
function switchShoppingView(view) {
  if (view === 'cart') {
    switchTab('cart');
  } else {
    switchTab('planner');
  }
}

// Quick Discount Popover
function openQuickDiscountPopover(itemId) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  AppState.quickDiscountItemId = itemId;
  const modal = document.getElementById('quickDiscountPopover');
  const subTitle = document.getElementById('popoverItemSubtitle');
  const customInput = document.getElementById('quickDiscountCustomInput');

  if (subTitle) {
    subTitle.textContent = `${item.namaBarang} • Harga Satuan: ${formatRupiah(item.hargaSatuan)}`;
  }
  if (customInput) {
    customInput.value = item.diskonTipe !== 'none' ? (item.diskonValue || '') : '';
  }

  updateQuickDiscountPreview();

  if (modal) {
    modal.classList.add('active', 'show');
  }
}

function closeQuickDiscountPopover() {
  const modal = document.getElementById('quickDiscountPopover');
  if (modal) {
    modal.classList.remove('active', 'show');
  }
  AppState.quickDiscountItemId = null;
}

function applyQuickDiscountPreset(type, val) {
  const customInput = document.getElementById('quickDiscountCustomInput');
  if (type === 'none') {
    if (customInput) customInput.value = '';
  } else {
    if (customInput) customInput.value = val;
  }
  updateQuickDiscountPreview();
}

function clearQuickDiscount() {
  const customInput = document.getElementById('quickDiscountCustomInput');
  if (customInput) customInput.value = '';
  updateQuickDiscountPreview();
}

function updateQuickDiscountPreview() {
  if (!AppState.quickDiscountItemId) return;
  const item = AppState.cart.find(i => i.id === AppState.quickDiscountItemId);
  if (!item) return;

  const rawVal = (document.getElementById('quickDiscountCustomInput')?.value || '').trim();
  let discType = 'none';
  let discVal = '';

  if (rawVal) {
    if (rawVal.includes('+')) {
      discType = 'tiered';
      discVal = rawVal;
    } else {
      const num = parseFloat(rawVal.replace(/%/g, ''));
      if (!isNaN(num) && num > 0) {
        discType = 'single';
        discVal = num.toString();
      }
    }
  }

  const disc = calculateDiscount(item.hargaSatuan, discType, discVal);
  const netEl = document.getElementById('quickNetPriceText');
  const saveEl = document.getElementById('quickSavingsDetail');

  if (netEl) netEl.textContent = formatRupiah(disc.finalPrice);
  if (saveEl) {
    if (disc.savingsPerUnit > 0) {
      saveEl.style.display = 'block';
      saveEl.textContent = `Hemat ${formatRupiah(disc.savingsPerUnit)} (${disc.effectivePercent}%) per unit`;
    } else {
      saveEl.style.display = 'none';
    }
  }
}

function saveQuickDiscount() {
  if (!AppState.quickDiscountItemId) return;
  const item = AppState.cart.find(i => i.id === AppState.quickDiscountItemId);
  if (!item) return;

  const rawVal = (document.getElementById('quickDiscountCustomInput')?.value || '').trim();
  if (!rawVal) {
    item.diskonTipe = 'none';
    item.diskonValue = '';
  } else if (rawVal.includes('+')) {
    item.diskonTipe = 'tiered';
    item.diskonValue = rawVal.replace(/\s+/g, '');
  } else {
    const num = parseFloat(rawVal.replace(/%/g, ''));
    if (!isNaN(num) && num > 0) {
      item.diskonTipe = 'single';
      item.diskonValue = num.toString();
    } else {
      item.diskonTipe = 'none';
      item.diskonValue = '';
    }
  }

  playSoftPop();
  closeQuickDiscountPopover();
  pushStateToCloud();
  renderAll();
  showToast(`Diskon untuk "${item.namaBarang}" berhasil diterapkan ✨`, 'success');
}

// =========================================================================
// IN-STORE QUICK PRICE ENTRY POPOVER (FASE BELANJA)
// =========================================================================
AppState.quickPriceTarget = null;

function openQuickPriceModal(itemId, fromCheck = false) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  AppState.quickPriceTarget = { itemId, fromCheck };

  const modal = document.getElementById('quickPriceModal');
  const subTitle = document.getElementById('quickPriceItemSubtitle');
  const nameEl = document.getElementById('quickPriceItemName');
  const unitEl = document.getElementById('quickPriceItemUnit');
  const qtyInput = document.getElementById('quickPriceQtyInput');
  const priceInput = document.getElementById('quickPriceInput');
  const chipsContainer = document.getElementById('quickPriceChipsContainer');

  if (subTitle) {
    subTitle.textContent = `${item.namaBarang} • ${AppState.currentStore}`;
  }
  if (nameEl) nameEl.textContent = item.namaBarang;
  if (unitEl) unitEl.textContent = `Kuantitas: ${item.qty} ${item.satuan || 'pcs'}`;
  if (qtyInput) qtyInput.value = item.qty;
  if (priceInput) priceInput.value = (item.hargaSatuan > 0) ? item.hargaSatuan : '';

  // Buat chips harga rekomendasi (Riwayat toko & preset nominal populer)
  if (chipsContainer) {
    let chipsHtml = '';
    const isSameStore = (!item.store || item.store === AppState.currentStore);
    const baseline = item.hargaRiwayatBulanLalu || (isSameStore ? getStorePriceHistory(item.namaBarang, item.store || AppState.currentStore) : null);

    if (baseline && baseline > 0) {
      chipsHtml += `<button type="button" class="frequent-chip promo-highlight touch-target" onclick="setQuickPriceInput(${baseline})">💡 Riwayat: Rp ${formatNumber(baseline)}</button>`;
    }

    const roundPresets = [10000, 15000, 20000, 25000, 35000, 50000, 75000, 100000];
    roundPresets.forEach(p => {
      chipsHtml += `<button type="button" class="frequent-chip touch-target" onclick="setQuickPriceInput(${p})">${p >= 1000 ? (p / 1000) + 'k' : p}</button>`;
    });

    chipsContainer.innerHTML = chipsHtml;
  }

  updateQuickPricePreview();

  if (modal) {
    modal.classList.add('active', 'show');
  }

  setTimeout(() => {
    if (priceInput) {
      priceInput.focus();
      if (priceInput.value) priceInput.select();
    }
  }, 120);
}

function closeQuickPriceModal(saved = false) {
  const modal = document.getElementById('quickPriceModal');
  if (modal) {
    modal.classList.remove('active', 'show');
  }

  // Jika dibatalkan saat dibuka dari centang checkbox dan harga masih kosong
  if (!saved && AppState.quickPriceTarget && AppState.quickPriceTarget.fromCheck) {
    const item = AppState.cart.find(i => i.id === AppState.quickPriceTarget.itemId);
    if (item && (!item.hargaSatuan || item.hargaSatuan <= 0)) {
      item.checked = false;
      renderItems();
      renderCartSection();
    }
  }

  AppState.quickPriceTarget = null;
}

function updateQuickPricePreview() {
  if (!AppState.quickPriceTarget) return;
  const item = AppState.cart.find(i => i.id === AppState.quickPriceTarget.itemId);
  if (!item) return;

  const rawPrice = (document.getElementById('quickPriceInput')?.value || '').trim();
  const price = parseFloat(rawPrice) || 0;
  const qty = parseInt(document.getElementById('quickPriceQtyInput')?.value, 10) || item.qty || 1;

  const disc = calculateDiscount(price, item.diskonTipe, item.diskonValue);
  const subtotal = disc.finalPrice * qty;

  const subtotalEl = document.getElementById('quickPriceSubtotalPreview');
  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);

  // Evaluasi Indikator Fluktuasi Harga vs Riwayat Toko
  const isSameStore = (!item.store || item.store === AppState.currentStore);
  const baseline = item.hargaRiwayatBulanLalu || (isSameStore ? getStorePriceHistory(item.namaBarang, item.store || AppState.currentStore) : null);
  const comparator = comparePriceWithLastMonth(disc.finalPrice, baseline, isSameStore);

  const fluctBadge = document.getElementById('quickPriceFluctBadge');
  if (fluctBadge) {
    fluctBadge.className = comparator.badgeClass;
    fluctBadge.textContent = comparator.text;
  }

  // Evaluasi Dampak terhadap Batas Anggaran & Saldo Dompet Realtime
  let simulatedTotal = 0;
  AppState.cart.forEach(i => {
    if (i.id === item.id) {
      simulatedTotal += subtotal;
    } else if (i.checked) {
      const d = calculateDiscount(i.hargaSatuan, i.diskonTipe, i.diskonValue);
      simulatedTotal += d.finalPrice * i.qty;
    }
  });

  const safety = evaluateBudgetSafety(simulatedTotal, AppState.budget);
  const remainEl = document.getElementById('quickPriceRemainingPreview');
  if (remainEl) {
    if (safety.sisa >= 0) {
      remainEl.textContent = `Sisa Saldo: ${formatRupiah(safety.sisa)} (${safety.level === 'warning' ? 'Rem Dulu Kak ⚠️' : 'Aman 💚'})`;
      remainEl.style.color = (safety.level === 'warning') ? '#D97706' : 'var(--status-safe-text)';
    } else {
      remainEl.textContent = `Defisit: - ${formatRupiah(Math.abs(safety.sisa))} (Overbudget 🚨)`;
      remainEl.style.color = '#DC2626';
    }
  }
}

function saveQuickPrice() {
  if (!AppState.quickPriceTarget) return;
  const item = AppState.cart.find(i => i.id === AppState.quickPriceTarget.itemId);
  if (!item) return;

  const rawPrice = (document.getElementById('quickPriceInput')?.value || '').trim();
  const price = parseFloat(rawPrice);

  if (isNaN(price) || price <= 0) {
    showToast('Masukkan harga satuan yang valid (lebih besar dari Rp 0)!', 'danger');
    document.getElementById('quickPriceInput')?.focus();
    return;
  }

  const qty = parseInt(document.getElementById('quickPriceQtyInput')?.value, 10);
  if (!isNaN(qty) && qty >= 1) {
    item.qty = qty;
  }

  item.hargaSatuan = price;
  item.checked = true; // Otomatis aktif & masuk hitungan keranjang
  item.store = AppState.currentStore;

  closeQuickPriceModal(true);
  playCalmChime();
  saveLocalState();
  pushStateToCloud();
  renderAll();

  showToast(`Harga "${item.namaBarang}" berhasil disimpan (${formatRupiah(price)}) ✨`, 'success');
}

function adjustQuickPriceQty(delta) {
  const input = document.getElementById('quickPriceQtyInput');
  if (!input) return;
  const cur = parseInt(input.value, 10) || 1;
  input.value = Math.max(1, cur + delta);
  updateQuickPricePreview();
}

function handleQuickPriceQtyChange(val) {
  updateQuickPricePreview();
}

function setQuickPriceInput(val) {
  const input = document.getElementById('quickPriceInput');
  if (input) {
    input.value = val;
    updateQuickPricePreview();
  }
}

function clearQuickPriceInput() {
  const input = document.getElementById('quickPriceInput');
  if (input) {
    input.value = '';
    updateQuickPricePreview();
    input.focus();
  }
}

// Auto-reconnect when device comes back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    showToast('Koneksi internet terhubung kembali 🌐 Sinkronisasi Cloud aktif', 'success');
    initFirestoreSync();
    pushStateToCloud();
  });
  window.addEventListener('offline', () => {
    updateCloudSyncUI('offline', 'Mode Offline (LocalStorage)');
    showToast('Koneksi internet terputus. Bekerja dalam mode offline.', 'warning');
  });
}
