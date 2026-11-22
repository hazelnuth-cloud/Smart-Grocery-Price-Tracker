
// =========================================================================
// HAPTIC FEEDBACK ENGINE (NATIVE iOS / ANDROID VIBRATION API)
// =========================================================================
const HapticEngine = {
  light() {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10);
      }
    } catch (_) {}
  },
  medium() {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(18);
      }
    } catch (_) {}
  },
  success() {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([15, 50, 15]);
      }
    } catch (_) {}
  },
  warning() {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([25, 40, 25]);
      }
    } catch (_) {}
  }
};


// =========================================================================
// ZERO NATIVE BROWSER DIALOGS (NO "THIS PAGE SAYS" EVER)
// 100% In-App Aesthetic Modals & Non-Blocking Toast Notifications
// =========================================================================
if (typeof window !== 'undefined') {
  window.alert = function (msg) {
    if (typeof showToast === 'function') {
      showToast(String(msg || ''), 'info');
    }
  };
  window.confirm = function (msg) {
    console.warn('Native window.confirm is disabled. Please use showAppModalBubble for asynchronous in-app confirmation.');
    if (typeof showToast === 'function') {
      showToast(String(msg || ''), 'warning');
    }
    return true;
  };
  window.prompt = function (msg, defaultVal) {
    console.warn('Native window.prompt is disabled.');
    if (typeof showToast === 'function') {
      showToast(String(msg || ''), 'info');
    }
    return defaultVal || null;
  };
}

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

// =========================================================================
// 0. GLOBAL ERROR SHIELD & ANTI-CRASH PROTECTION (JARI CEROBOH & OFFLINE RESILIENCY)
// =========================================================================
if (typeof window !== 'undefined') {
  window.addEventListener('error', function (e) {
    console.warn('Proteksi Antigravity: Terdeteksi error tertangkap tanpa memutus UI:', e.message);
  });
  window.addEventListener('unhandledrejection', function (e) {
    console.warn('Proteksi Antigravity: Terdeteksi unhandled Promise rejection:', e.reason);
    if (e && e.preventDefault) e.preventDefault();
  });
}

// Storage Keys
const STORAGE_KEYS = {
  USER: 'smart_grocery_user',
  REGISTERED_USERS: 'smart_grocery_registered_users',
  GOOGLE_ACCOUNTS: 'smart_grocery_google_accounts',
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
  SOUND_VOLUME: 'smart_grocery_sound_volume',
  SOUND_THEME: 'smart_grocery_sound_theme',
  DARK_MODE: 'smart_grocery_dark_mode',
  SESSION_ID: 'smart_grocery_session',
  FIREBASE_CONFIG: 'smart_grocery_fb_config',
  STICKY_SALDO_DISMISSED: 'smart_grocery_sticky_saldo_dismissed'
};

// Default Personal Blacklist ("Anti-List")
const DEFAULT_BLACKLIST = ['labu siam', 'sayur pare', 'pare', 'jengkol', 'bitter melon'];

// Daftar Kategori Standar Supermarket
const DEFAULT_CATEGORIES = [
  'Bahan Pokok',
  'Kebutuhan Pokok',
  'Peralatan',
  'Makanan',
  'Minuman',
  'Perlengkapan Mandi',
  'Kebersihan & Rumah',
  'Pantry',
  'Dairy'
];

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
    kasir: 'Mr. Tio',
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

let isInitialAppLoad = true;

// Global App State
let AppState = {
  user: null,
  authMode: 'signin',
  previousSafetyLevel: null,
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
  userCustomCategories: [], // Kategori produk baru khusus akun user (terisolasi)
  userCustomItems: [],      // Koleksi produk katalog baru khusus akun user (terisolasi)
  userStores: [],           // Preferensi lokasi belanja / toko tersimpan 1-klik akun user
  sessionId: 'lotte-mart-puri-01',
  lastLocalUpdate: Date.now(),
  currentTab: 'planner',
  inStoreMode: false,
  soundEnabled: true,
  soundVolume: 0.75,
  soundTheme: 'kawaii', // 'kawaii' (Default) | 'musicbox' | 'zen'
  audioCtx: null,
  editingItemId: null,
  itemPendingDeleteId: null,
  pendingBlacklistItem: null,
  deferredInstallPrompt: null,
  stickySaldoDismissed: false
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

// =========================================================================
// 2. FITUR AKURAT ANALISIS HARGA BELI ULANG (REPURCHASE PRICE COMPARISON)
// =========================================================================

/**
 * Normalisasi nama barang untuk pencocokan riwayat yang presisi (anti-spasi, anti-simbol)
 */
function normalizeItemKey(name) {
  if (!name || typeof name !== 'string') return '';
  return name.toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Temukan catatan pembelian riil sebelumnya untuk item ini.
 * Memeriksa secara akurat:
 * 1. Struk resmi kasir sebelumnya (AppState.receipts), diurutkan dari transaksi terbaru
 * 2. Catatan harga riwayat toko (AppState.priceHistory)
 * 3. Arsip harga bulan lalu (DEFAULT_PRICE_HISTORY)
 */
function findPreviousPurchaseRecord(itemName, storeName = null) {
  if (!itemName) return null;
  const targetKey = normalizeItemKey(itemName);
  if (!targetKey) return null;
  const targetStore = (storeName || AppState.currentStore || '').trim().toLowerCase();

  // 1. Periksa riwayat struk resmi yang tersimpan (terbaru paling atas)
  if (Array.isArray(AppState.receipts)) {
    // Pass 1: Pencocokan di Toko yang Sama
    for (const rec of AppState.receipts) {
      const recStore = (rec.toko || '').trim().toLowerCase();
      const isStoreMatch = (targetStore && recStore && (recStore === targetStore || recStore.includes(targetStore) || targetStore.includes(recStore)));
      if (isStoreMatch && Array.isArray(rec.items)) {
        const found = rec.items.find(i => {
          const itemKey = normalizeItemKey(i.namaBarang);
          return itemKey === targetKey || itemKey.startsWith(targetKey) || targetKey.startsWith(itemKey);
        });
        if (found && (found.hargaAkhirSatuan || found.hargaSatuan)) {
          return {
            price: Math.round(found.hargaAkhirSatuan || found.hargaSatuan),
            store: rec.toko || targetStore,
            date: rec.tanggal || null,
            isSameStore: true,
            source: 'receipt'
          };
        }
      }
    }

    // Pass 2: Jika tidak ada di toko yang sama, periksa toko manapun user pernah beli barang ini
    for (const rec of AppState.receipts) {
      if (Array.isArray(rec.items)) {
        const found = rec.items.find(i => {
          const itemKey = normalizeItemKey(i.namaBarang);
          return itemKey === targetKey || itemKey.startsWith(targetKey) || targetKey.startsWith(itemKey);
        });
        if (found && (found.hargaAkhirSatuan || found.hargaSatuan)) {
          const recStore = (rec.toko || '').trim();
          return {
            price: Math.round(found.hargaAkhirSatuan || found.hargaSatuan),
            store: recStore || 'Toko Lain',
            date: rec.tanggal || null,
            isSameStore: (recStore.toLowerCase() === targetStore),
            source: 'receipt'
          };
        }
      }
    }
  }

  // 2. Periksa AppState.priceHistory
  if (AppState.priceHistory && typeof AppState.priceHistory === 'object') {
    for (const [key, val] of Object.entries(AppState.priceHistory)) {
      const histKey = normalizeItemKey(key);
      if ((histKey === targetKey || histKey.startsWith(targetKey) || targetKey.startsWith(histKey)) && val && val.harga > 0) {
        const histStore = (val.toko || '').trim();
        return {
          price: Math.round(val.harga),
          store: histStore || targetStore,
          date: val.tanggal || null,
          isSameStore: (!histStore || histStore.toLowerCase() === targetStore),
          source: 'priceHistory'
        };
      }
    }
  }

  // 3. Fallback ke DEFAULT_PRICE_HISTORY
  if (typeof DEFAULT_PRICE_HISTORY !== 'undefined') {
    for (const [key, val] of Object.entries(DEFAULT_PRICE_HISTORY)) {
      const defKey = normalizeItemKey(key);
      if ((defKey === targetKey || defKey.startsWith(targetKey) || targetKey.startsWith(defKey)) && val && val.harga > 0) {
        return {
          price: Math.round(val.harga),
          store: val.toko || targetStore,
          date: 'Bulan Lalu',
          isSameStore: true,
          source: 'default_history'
        };
      }
    }
  }

  return null;
}

/**
 * Analisis Akurat Kenaikan / Penurunan Harga Barang Beli Ulang (Repurchase Price Analysis)
 */
function getRepurchaseAnalysis(currentPrice, prevRecord, isSameStore = true) {
  const current = Math.round(parseFloat(currentPrice) || 0);

  if (!prevRecord || !prevRecord.price || prevRecord.price <= 0) {
    return {
      status: 'new',
      isRepurchase: false,
      previousPrice: null,
      currentPrice: current,
      diff: 0,
      absDiff: 0,
      percent: 0,
      badgeText: '✨ Baru',
      text: '✨ Baru',
      badgeClass: 'fluctuation-badge fluctuation-stable',
      diffClass: 'diff-stable',
      detailText: 'Belum ada catatan harga belanja sebelumnya.',
      shortDetail: '',
      arrow: ''
    };
  }

  const baseline = Math.round(prevRecord.price);

  if (current <= 0) {
    return {
      status: 'unpriced_repurchase',
      isRepurchase: true,
      previousPrice: baseline,
      currentPrice: 0,
      diff: 0,
      absDiff: 0,
      percent: 0,
      badgeText: `💡 Dulu: Rp ${formatNumber(baseline)}`,
      text: `💡 Dulu: Rp ${formatNumber(baseline)}`,
      badgeClass: 'fluctuation-badge fluctuation-stable',
      diffClass: 'diff-stable',
      detailText: `Pernah dibeli seharga Rp ${formatNumber(baseline)}${prevRecord.store ? ' di ' + prevRecord.store : ''}`,
      shortDetail: `Dulu: Rp ${formatNumber(baseline)}`,
      arrow: '💡'
    };
  }

  const diff = current - baseline;
  const absDiff = Math.abs(diff);
  const percentNum = baseline > 0 ? ((absDiff / baseline) * 100).toFixed(1) : '0';
  const percent = parseFloat(percentNum);
  const storeContext = (!prevRecord.isSameStore && prevRecord.store) ? ` (vs ${prevRecord.store})` : '';

  if (diff > 0) {
    // NAIK (Lebih Mahal)
    return {
      status: 'up',
      label: '↑ Naik',
      isRepurchase: true,
      previousPrice: baseline,
      currentPrice: current,
      diff,
      absDiff,
      percent,
      badgeText: `↑ +Rp ${formatNumber(diff)} (${percentNum}%)`,
      text: `↑ +Rp ${formatNumber(diff)} (+${percentNum}%)`,
      badgeClass: 'fluctuation-badge fluctuation-up',
      diffClass: 'diff-up',
      detailText: `Harga naik +Rp ${formatNumber(diff)} (+${percentNum}%) dibanding belanja sebelumnya (Rp ${formatNumber(baseline)}${storeContext})`,
      shortDetail: `Dulu: Rp ${formatNumber(baseline)}`,
      arrow: '↑'
    };
  } else if (diff < 0) {
    // TURUN (Lebih Murah / Hemat)
    return {
      status: 'down',
      label: '↓ Turun',
      isRepurchase: true,
      previousPrice: baseline,
      currentPrice: current,
      diff,
      absDiff,
      percent,
      badgeText: `↓ -Rp ${formatNumber(absDiff)} (${percentNum}%)`,
      text: `↓ -Rp ${formatNumber(absDiff)} (-${percentNum}%)`,
      badgeClass: 'fluctuation-badge fluctuation-down',
      diffClass: 'diff-down',
      detailText: `Harga turun -Rp ${formatNumber(absDiff)} (-${percentNum}%) lebih hemat dibanding belanja sebelumnya (Rp ${formatNumber(baseline)}${storeContext})`,
      shortDetail: `Dulu: Rp ${formatNumber(baseline)}`,
      arrow: '↓'
    };
  } else {
    // STABIL (Sama Persis)
    return {
      status: 'stable',
      label: '= Stabil',
      isRepurchase: true,
      previousPrice: baseline,
      currentPrice: current,
      diff: 0,
      absDiff: 0,
      percent: 0,
      badgeText: `= Stabil (Rp ${formatNumber(baseline)})`,
      text: `= Stabil (Rp ${formatNumber(baseline)})`,
      badgeClass: 'fluctuation-badge fluctuation-stable',
      diffClass: 'diff-stable',
      detailText: `Harga sama persis dengan belanja sebelumnya (Rp ${formatNumber(baseline)}${storeContext})`,
      shortDetail: `Stabil: Rp ${formatNumber(baseline)}`,
      arrow: '='
    };
  }
}

/**
 * Komparator Fluktuasi Harga Realtime vs Histori Pembelian Lalu (Backward Compatible)
 */
function comparePriceWithLastMonth(currentFinalUnitPrice, lastMonthPrice, isSameStore = true, itemName = null) {
  let baseline = Math.round(parseFloat(lastMonthPrice) || 0);

  if ((!baseline || baseline <= 0) && itemName) {
    const prev = findPreviousPurchaseRecord(itemName, AppState.currentStore);
    if (prev && prev.price > 0) {
      baseline = prev.price;
      isSameStore = prev.isSameStore;
    }
  }

  const prevRecord = baseline > 0 ? { price: baseline, isSameStore, store: isSameStore ? AppState.currentStore : 'Toko Lain' } : null;
  return getRepurchaseAnalysis(currentFinalUnitPrice, prevRecord, isSameStore);
}

/**
 * Helper: Ambil harga histori riil untuk toko yang sama atau toko sebelumnya
 */
function getStorePriceHistory(itemName, storeName) {
  const prev = findPreviousPurchaseRecord(itemName, storeName || AppState.currentStore);
  return prev ? prev.price : null;
}

/**
 * Simpan harga riil item ke database riwayat harga toko
 */
function recordStorePrice(itemName, price, storeName, category, unit) {
  if (!itemName || !price) return;
  const trimmed = itemName.trim();
  const store = (storeName || AppState.currentStore || '').trim();
  if (!AppState.priceHistory) AppState.priceHistory = {};

  AppState.priceHistory[trimmed] = {
    harga: Math.round(price),
    satuan: unit || 'pcs',
    kategori: category || 'Kebutuhan Pokok',
    toko: store,
    tanggal: new Date().toISOString().slice(0, 10)
  };

  try {
    const uid = (AppState.user && AppState.user.uid) ? AppState.user.uid : 'guest';
    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(AppState.priceHistory));
    localStorage.setItem('grocery_prices_' + uid, JSON.stringify(AppState.priceHistory));
  } catch (e) { }
}

/**
 * Automatisasi Riwayat Harga Bulan Lalu:
 * Menemukan harga terkini / baseline riil dari transaksi sebelumnya,
 * riwayat toko, katalog produk, atau koleksi produk kustom pengguna.
 */
function findLatestItemPrice(itemName, storeName = null) {
  if (!itemName) return null;
  const clean = itemName.trim().toLowerCase();

  // 1. Cek dari AppState.priceHistory (data paling spesifik & terkini)
  if (AppState.priceHistory && typeof AppState.priceHistory === 'object') {
    for (const [key, val] of Object.entries(AppState.priceHistory)) {
      if (key.trim().toLowerCase() === clean && val && typeof val.harga === 'number' && val.harga > 0) {
        return Math.round(val.harga);
      }
    }
  }

  // 2. Cek dari Struk Riwayat Belanja (transaksi belanja riil akun pengguna)
  if (Array.isArray(AppState.receipts) && AppState.receipts.length > 0) {
    for (const r of AppState.receipts) {
      if (Array.isArray(r.items)) {
        const found = r.items.find(i => (i.namaBarang || i.name || '').trim().toLowerCase() === clean);
        if (found) {
          const p = found.hargaSatuan || found.finalPrice || found.price;
          if (p && p > 0) return Math.round(p);
        }
      }
    }
  }

  // 3. Cek dari Koleksi Kustom Pengguna (User-Isolated Custom Items)
  if (Array.isArray(AppState.userCustomItems)) {
    const custom = AppState.userCustomItems.find(ci => (ci.name || '').trim().toLowerCase() === clean);
    if (custom && custom.price && custom.price > 0) return Math.round(custom.price);
  }

  // 4. Cek dari PRODUCT_CATALOG
  if (typeof PRODUCT_CATALOG !== 'undefined' && Array.isArray(PRODUCT_CATALOG)) {
    const prod = PRODUCT_CATALOG.find(p => (p.name || '').trim().toLowerCase() === clean);
    if (prod && prod.price && prod.price > 0) return Math.round(prod.price);
  }

  // 5. Cek dari DEFAULT_PRICE_HISTORY
  if (typeof DEFAULT_PRICE_HISTORY !== 'undefined') {
    for (const [key, val] of Object.entries(DEFAULT_PRICE_HISTORY)) {
      if (key.trim().toLowerCase() === clean && val && typeof val.harga === 'number' && val.harga > 0) {
        return Math.round(val.harga);
      }
    }
  }

  return null;
}

/**
 * Helper icon emoji kategori
 */
function getCategoryIcon(category) {
  if (!category) return '🛍️';
  const c = category.toLowerCase();
  if (c.includes('beras') || c.includes('pokok') || c.includes('staple')) return '🌾';
  if (c.includes('minyak') || c.includes('bumbu') || c.includes('pantry') || c.includes('seasoning')) return '🍳';
  if (c.includes('bersih') || c.includes('hygiene') || c.includes('mandi') || c.includes('sabun')) return '🧼';
  if (c.includes('sayur') || c.includes('buah') || c.includes('produce')) return '🥬';
  if (c.includes('susu') || c.includes('dairy') || c.includes('minum')) return '🥛';
  if (c.includes('makan') || c.includes('snack') || c.includes('roti') || c.includes('biskuit')) return '🍞';
  if (c.includes('alat') || c.includes('dapur') || c.includes('rumah')) return '🍳';
  if (c.includes('daging') || c.includes('ikan') || c.includes('ayam')) return '🥩';
  if (c.includes('skin') || c.includes('kosmetik') || c.includes('cantik')) return '💄';
  if (c.includes('bayi') || c.includes('anak')) return '🍼';
  if (c.includes('hewan') || c.includes('pet')) return '🐾';
  if (c.includes('koleksi')) return '⭐';
  return '🏷️';
}

/**
 * Simpan Item Baru ke Koleksi Produk Pengguna (Preferensi Akun User - 1-Klik Beli Ulang)
 * Strictly Isolated to User Account (uid)
 */
function saveUserCustomItem({ name, category, unit, price, isRoutine = false }) {
  if (!name) return;
  const cleanName = name.trim().replace(/\s+/g, ' ').replace(/[<>]/g, '');
  if (cleanName.length < 2) return;

  if (!Array.isArray(AppState.userCustomItems)) {
    AppState.userCustomItems = [];
  }

  const cleanCategory = category || detectCategory(cleanName);
  const existingIdx = AppState.userCustomItems.findIndex(ci => ci.name.toLowerCase() === cleanName.toLowerCase());
  
  const customObj = {
    id: existingIdx !== -1 ? AppState.userCustomItems[existingIdx].id : ('custom-prod-' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')),
    name: cleanName,
    category: cleanCategory,
    unit: unit || 'pcs',
    price: Math.max(0, parseFloat(price) || 0),
    icon: getCategoryIcon(cleanCategory),
    isRoutine: !!isRoutine,
    isUserCustom: true,
    updatedAt: new Date().toISOString()
  };

  if (existingIdx !== -1) {
    AppState.userCustomItems[existingIdx] = { ...AppState.userCustomItems[existingIdx], ...customObj };
  } else {
    AppState.userCustomItems.unshift(customObj);
  }

  // Batasi maksimal 80 item preferensi akun agar memori efisien dan cepat
  if (AppState.userCustomItems.length > 80) {
    AppState.userCustomItems = AppState.userCustomItems.slice(0, 80);
  }

  saveLocalState();
  renderCatalogCategoryPills();
  renderProductCatalog();
}

/**
 * Sinkronisasi Opsi Dropdown Kategori di Modal Detail Item (Kategori Standar Rapi)
 */
function syncCategoryDropdownOptions(selectedCategory = null) {
  const select = document.getElementById('detailInputCategory');
  if (!select) return;

  const currentVal = selectedCategory || select.value || 'Kebutuhan Pokok';
  select.innerHTML = DEFAULT_CATEGORIES.map(cat => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join('');

  const optMatch = Array.from(select.options || []).find(o => (o.value || '').toLowerCase() === currentVal.toLowerCase());
  if (optMatch) {
    select.value = optMatch.value;
  } else {
    select.value = 'Kebutuhan Pokok';
  }
}

/**
 * Render Pill Kategori di Rak Katalog Produk (Menampilkan Pill "⭐ Produk Saya" untuk Belanja 1-Klik)
 */
function renderCatalogCategoryPills() {
  const container = document.getElementById('catalogCategoryPills');
  if (!container) return;

  const standardPills = [
    { id: 'all', label: 'Semua' },
    { id: 'staple', label: '🌾 Bahan Pokok' },
    { id: 'oil-seasoning', label: '🍳 Minyak & Bumbu' },
    { id: 'hygiene', label: '🧼 Kebersihan' },
    { id: 'produce', label: '🥬 Sayur & Buah' },
    { id: 'dairy-drink', label: '🥛 Dairy & Minuman' }
  ];

  let html = standardPills.map(p => `
    <button type="button" class="catalog-pill ${catalogActiveCategory === p.id ? 'active' : ''}"
      onclick="filterCatalogCategory('${p.id}', this)">${escapeHtml(p.label)}</button>
  `).join('');

  // Pill Produk Pilihan / Preferensi Akun Pengguna (1-Tap Filter untuk beli ulang tanpa ketik)
  if (Array.isArray(AppState.userCustomItems) && AppState.userCustomItems.length > 0) {
    const isCustomActive = catalogActiveCategory === 'user-custom';
    html += `
      <button type="button" class="catalog-pill ${isCustomActive ? 'active' : ''}"
        onclick="filterCatalogCategory('user-custom', this)" style="border-color: #D56989; font-weight: 700;">
        ⭐ Produk Saya (${AppState.userCustomItems.length})
      </button>
    `;
  }

  container.innerHTML = html;
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
      barColor: 'linear-gradient(90deg, #F97316 0%, #EF4444 50%, #E11D48 100%)',
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
      barColor: 'linear-gradient(90deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)',
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
      barColor: 'linear-gradient(90deg, #059669 0%, #10B981 50%, #34D399 100%)',
      badgeClass: 'progress-status-badge badge-safe',
      showOverbudgetBanner: false,
      bannerMessage: ''
    };
  }
}

function getCartMetrics() {
  let totalBelanja = 0;       // Keranjang aktif (checked === true)
  let totalRencana = 0;       // Rencana belanja (checked === false)
  let totalAll = 0;           // Total gabungan
  let totalHemat = 0;
  let totalItemsCount = 0;
  let checkedItemsCount = 0;
  let unboughtItemsCount = 0;

  AppState.cart.forEach(item => {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const itemSubtotal = disc.finalPrice * item.qty;
    const itemSavings = disc.savingsPerUnit * item.qty;

    totalAll += itemSubtotal;
    totalItemsCount += item.qty;

    if (item.checked) {
      totalBelanja += itemSubtotal;
      totalHemat += itemSavings;
      checkedItemsCount++;
    } else {
      totalRencana += itemSubtotal;
      unboughtItemsCount++;
    }
  });

  const isPlanner = (AppState.currentTab === 'planner');
  const evaluatedTotal = (isPlanner && !AppState.inStoreMode) ? totalAll : totalBelanja;
  const safety = evaluateBudgetSafety(evaluatedTotal, AppState.budget);

  return {
    totalBelanja,
    totalRencana,
    totalAll,
    totalHemat,
    totalItemsCount,
    checkedItemsCount,
    unboughtItemsCount,
    safety
  };
}

/**
 * Beri efek animasi berdenyut (pulse) dan sorotan visual pada banner / kotak peringatan overbudget
 */
function highlightOverbudgetBanner() {
  if (typeof document === 'undefined') return;
  const firmBanner = document.getElementById('overbudget-firm-banner');
  const slimBadge = document.getElementById('overbudget-slim-badge');
  const plannerAlert = document.getElementById('plannerBudgetAlert');
  const targets = [firmBanner, slimBadge, plannerAlert].filter(Boolean);

  targets.forEach(el => {
    if (el === plannerAlert && AppState.stickySaldoDismissed) return;
    el.classList.remove('hidden');
    el.classList.remove('pulse-highlight');
    void el.offsetWidth; // Trigger reflow
    el.classList.add('pulse-highlight');
  });

  if (firmBanner && !firmBanner.classList.contains('hidden')) {
    try {
      firmBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) { }
  }

  setTimeout(() => {
    targets.forEach(el => {
      if (el) el.classList.remove('pulse-highlight');
    });
  }, 1800);
}

/**
 * Memeriksa apakah pengguna saat ini telah melebihi batas anggaran (overbudget)
 * atau apakah penambahan biaya tertentu akan membuatnya overbudget.
 * @param {number} additionalCost - Biaya tambahan yang akan ditambahkan ke belanjaan
 * @returns {boolean}
 */
function isUserOverbudget(additionalCost = 0) {
  const budget = AppState.budget || 0;
  if (budget <= 0) return false;
  const metrics = getCartMetrics();
  const currentTotal = metrics.totalBelanja || 0;
  const cost = Math.max(0, additionalCost || 0);
  return (currentTotal > budget) || ((currentTotal + cost) > budget);
}

/**
 * Validasi ketat pencegahan overbudget:
 * Jika overbudget atau penambahan akan melampaui limit anggaran,
 * blokir aksi, bunyikan alarm peringatan, berikan toast penjelasan detail,
 * dan buat banner overbudget berkedip (pulse).
 * @param {string} actionName - Deskripsi tindakan (misal: "menambah barang baru")
 * @param {number} additionalCost - Estimasi biaya tambahan dari aksi tersebut
 * @returns {boolean} true jika DIBLOKIR, false jika AMAN/DIIZINKAN
 */
function checkOverbudgetBlock(actionName = 'menambah belanjaan', additionalCost = 0) {
  const budget = AppState.budget || 0;
  if (budget <= 0) return false; // Anggaran tidak aktif / 0

  const metrics = getCartMetrics();
  const currentTotal = metrics.totalBelanja || 0;
  const cost = Math.max(0, additionalCost || 0);
  const projectedTotal = currentTotal + cost;

  if (currentTotal > budget || projectedTotal > budget) {
    const deficit = (projectedTotal > budget) ? (projectedTotal - budget) : (currentTotal - budget);
    playWarningAlertTone();
    showToast(
      `Tidak bisa ${actionName}! Melebihi anggaran dompet. Defisit: ${formatRupiah(deficit)} (Limit: ${formatRupiah(budget)}). Kurangi barang belanjaan terlebih dahulu!`,
      'danger'
    );
    highlightOverbudgetBanner();
    return true; // DIBLOKIR
  }

  return false; // AMAN
}

// =========================================================================
// 3. JAPANESE-INSPIRED SOUND DESIGN SYSTEM (WEB AUDIO API SYNTHESIS)
// Soft Kawaii, Delicate Music-Box, Marimba, Windchime, & Zen Bell Sounds
// =========================================================================

const SoundEngine = {
  ctx: null,
  masterGain: null,
  hasPlayedWelcome: false,
  lastPlayed: {},

  init() {
    if (!this.ctx && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      try {
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtxClass();
        this.masterGain = this.ctx.createGain();
        const vol = (typeof AppState !== 'undefined' && typeof AppState.soundVolume === 'number') ? AppState.soundVolume : 0.75;
        this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        if (AppState) AppState.audioCtx = this.ctx;
      } catch (e) {
        console.warn('AudioContext init note:', e);
      }
    }
  },

  unlock() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        if (!this.hasPlayedWelcome && AppState && AppState.soundEnabled) {
          this.hasPlayedWelcome = true;
          setTimeout(() => this.play('welcome'), 120);
        }
      }).catch(() => {});
    } else if (!this.hasPlayedWelcome && AppState && AppState.soundEnabled) {
      this.hasPlayedWelcome = true;
      setTimeout(() => this.play('welcome'), 120);
    }
  },

  setVolume(vol) {
    if (!this.ctx) this.init();
    const clamped = Math.max(0, Math.min(1, vol));
    if (AppState) AppState.soundVolume = clamped;
    try {
      localStorage.setItem('smart_grocery_sound_volume', clamped.toString());
    } catch (e) {}
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
  },

  setTheme(theme) {
    if (AppState) AppState.soundTheme = theme;
    try {
      localStorage.setItem('smart_grocery_sound_theme', theme);
    } catch (e) {}
  },

  play(type) {
    if (!AppState || !AppState.soundEnabled) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = Date.now();
    const last = this.lastPlayed[type] || 0;
    // Throttling to prevent overlapping sounds from becoming annoying
    const throttles = {
      click: 45,
      qty_up: 50,
      qty_down: 50,
      nav_switch: 80,
      add_item: 70,
      remove_item: 80,
      add_to_cart: 70,
      modal_open: 120,
      modal_close: 120,
      pantry_update: 100,
      sync_success: 150,
      budget_warn: 200,
      budget_exceed: 250,
      checkout: 300,
      welcome: 500,
      error: 150
    };
    if (now - last < (throttles[type] || 60)) return;
    this.lastPlayed[type] = now;

    const ctx = this.ctx;
    const dest = this.masterGain || ctx.destination;
    const theme = (AppState && AppState.soundTheme) ? AppState.soundTheme : 'kawaii';
    const t0 = ctx.currentTime;

    try {
      switch (type) {
        // 1. Website welcome: soft Japanese-inspired opening chime
        case 'welcome': {
          if (theme === 'zen') {
            this._synthBell(t0, 392, 0.14, 0.8, 'sine', dest);
            this._synthBell(t0 + 0.18, 1318.5, 0.08, 0.5, 'sine', dest);
            this._synthBell(t0 + 0.32, 1760, 0.06, 0.6, 'sine', dest);
          } else if (theme === 'musicbox') {
            const notes = [523.25, 659.25, 783.99, 1046.5];
            notes.forEach((freq, i) => {
              this._synthTine(t0 + (i * 0.09), freq, 0.1, 0.45, dest);
            });
          } else {
            // Japanese Soft Kawaii Yo-scale pentatonic bloom (D5, E5, G5, A5, D6)
            const notes = [587.33, 659.25, 783.99, 880.00, 1174.66];
            notes.forEach((freq, i) => {
              this._synthKawaiiTone(t0 + (i * 0.075), freq, 0.09, 0.45, dest);
            });
          }
          break;
        }

        // 2. Button click: tiny soft pop
        case 'click': {
          if (theme === 'zen') {
            this._synthWoodTap(t0, 620, 0.08, 0.035, dest);
          } else if (theme === 'musicbox') {
            this._synthTine(t0, 1174.66, 0.07, 0.03, dest);
          } else {
            this._synthWaterDrop(t0, 720, 860, 0.08, 0.035, dest);
          }
          break;
        }

        // 3. Add grocery item: cute "pon" confirmation
        case 'add_item': {
          if (theme === 'zen') {
            this._synthMokugyo(t0, 520, 360, 0.12, 0.08, dest);
          } else if (theme === 'musicbox') {
            this._synthTine(t0, 880, 0.11, 0.14, dest);
            this._synthTine(t0 + 0.05, 1318.5, 0.09, 0.18, dest);
          } else {
            // Iconic Kawaii "Pon!" pitch drop
            this._synthPon(t0, 580, 320, 0.13, 0.09, dest);
          }
          break;
        }

        // 4. Remove grocery item: gentle descending chime
        case 'remove_item': {
          if (theme === 'zen') {
            this._synthBell(t0, 987.77, 0.08, 0.15, 'sine', dest);
            this._synthBell(t0 + 0.07, 783.99, 0.06, 0.22, 'sine', dest);
          } else if (theme === 'musicbox') {
            this._synthTine(t0, 1046.5, 0.09, 0.14, dest);
            this._synthTine(t0 + 0.07, 659.25, 0.08, 0.2, dest);
          } else {
            this._synthMarimba(t0, 880, 0.09, 0.13, dest);
            this._synthMarimba(t0 + 0.065, 659.25, 0.08, 0.18, dest);
          }
          break;
        }

        // 5. Add to cart: delicate sparkle sound
        case 'add_to_cart': {
          if (theme === 'zen') {
            this._synthBell(t0, 1318.5, 0.09, 0.25, 'sine', dest);
            this._synthBell(t0 + 0.05, 1760, 0.08, 0.3, 'sine', dest);
            this._synthBell(t0 + 0.10, 2637, 0.06, 0.35, 'sine', dest);
          } else if (theme === 'musicbox') {
            this._synthTine(t0, 1046.5, 0.09, 0.2, dest);
            this._synthTine(t0 + 0.04, 1318.5, 0.09, 0.22, dest);
            this._synthTine(t0 + 0.08, 1567.98, 0.08, 0.25, dest);
            this._synthTine(t0 + 0.12, 2093.0, 0.07, 0.32, dest);
          } else {
            const sparkleNotes = [987.77, 1318.51, 1661.22];
            sparkleNotes.forEach((freq, idx) => {
              this._synthSparkle(t0 + (idx * 0.045), freq, 0.09, 0.22, dest);
            });
          }
          break;
        }

        // 6. Increase quantity: subtle soft click
        case 'qty_up': {
          this._synthPitchStep(t0, 520, 680, 0.07, 0.028, dest);
          break;
        }

        // 7. Decrease quantity: subtle lower-pitched click
        case 'qty_down': {
          this._synthPitchStep(t0, 480, 360, 0.07, 0.028, dest);
          break;
        }

        // 8. Successful checkout: happy celebratory Japanese-inspired chime
        case 'checkout': {
          if (theme === 'zen') {
            const zenNotes = [392, 523.25, 659.25, 783.99, 1046.5];
            zenNotes.forEach((freq, i) => {
              this._synthBell(t0 + (i * 0.08), freq, 0.12, 0.5, 'sine', dest);
            });
          } else if (theme === 'musicbox') {
            const mbNotes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5];
            mbNotes.forEach((freq, i) => {
              this._synthTine(t0 + (i * 0.07), freq, 0.11, 0.38, dest);
            });
          } else {
            const celebration = [
              { freq: 523.25, t: 0.00, d: 0.25 },
              { freq: 659.25, t: 0.07, d: 0.25 },
              { freq: 783.99, t: 0.14, d: 0.28 },
              { freq: 880.00, t: 0.21, d: 0.30 },
              { freq: 1046.50, t: 0.29, d: 0.55 },
              { freq: 1318.51, t: 0.37, d: 0.65 }
            ];
            celebration.forEach(n => {
              this._synthKawaiiTone(t0 + n.t, n.freq, 0.12, n.d, dest);
            });
          }
          break;
        }

        // 9. Budget warning: gentle notification bell
        case 'budget_warn': {
          this._synthBell(t0, 440, 0.11, 0.65, 'sine', dest);
          this._synthBell(t0 + 0.01, 884, 0.05, 0.55, 'sine', dest);
          break;
        }

        // 10. Budget exceeded: distinct but soft warning tone
        case 'budget_exceed': {
          this._synthMarimba(t0, 293.66, 0.13, 0.16, dest);
          this._synthMarimba(t0 + 0.12, 277.18, 0.12, 0.20, dest);
          break;
        }

        // 11. Navigation switch: delicate UI click
        case 'nav_switch': {
          this._synthDelicateTick(t0, 920, 0.05, 0.018, dest);
          break;
        }

        // 12. Open modal: soft airy chime
        case 'modal_open': {
          this._synthAiryChime(t0, 698.46, 1046.5, 0.08, 0.22, dest);
          break;
        }

        // 13. Close modal: gentle fading tone
        case 'modal_close': {
          this._synthAiryChime(t0, 1046.5, 783.99, 0.06, 0.18, dest);
          break;
        }

        // 14. Pantry update: cute confirmation sound
        case 'pantry_update': {
          this._synthMarimba(t0, 698.46, 0.1, 0.12, dest);
          this._synthMarimba(t0 + 0.07, 880.00, 0.11, 0.18, dest);
          break;
        }

        // 15. Successful data synchronization: short positive chime
        case 'sync_success': {
          const syncNotes = [659.25, 830.61, 987.77];
          syncNotes.forEach((freq, idx) => {
            this._synthKawaiiTone(t0 + (idx * 0.055), freq, 0.08, 0.22, dest);
          });
          break;
        }

        // 16. Error: gentle low-pitched notification
        case 'error': {
          this._synthSoftThud(t0, 310, 240, 0.11, 0.09, dest);
          break;
        }

        default:
          this._synthWaterDrop(t0, 650, 750, 0.07, 0.03, dest);
      }
    } catch (e) {
      console.warn('Sound play error:', e);
    }
  },

  _synthPon(t, startFreq, endFreq, vol, dur, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, t);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  },

  _synthMarimba(t, freq, vol, dur, dest) {
    const osc = this.ctx.createOscillator();
    const overtone = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 3, t);
    const overGain = this.ctx.createGain();
    overGain.gain.setValueAtTime(vol * 0.15, t);
    overGain.gain.exponentialRampToValueAtTime(0.0001, t + (dur * 0.4));
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    overtone.connect(overGain);
    overGain.connect(dest);
    gain.connect(dest);
    osc.start(t);
    overtone.start(t);
    osc.stop(t + dur + 0.01);
    overtone.stop(t + dur + 0.01);
  },

  _synthKawaiiTone(t, freq, vol, dur, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  },

  _synthTine(t, freq, vol, dur, dest) {
    const osc = this.ctx.createOscillator();
    const harmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const harmGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(freq * 2.76, t);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    harmGain.gain.setValueAtTime(vol * 0.18, t);
    harmGain.gain.exponentialRampToValueAtTime(0.0001, t + (dur * 0.35));
    osc.connect(gain);
    harmonic.connect(harmGain);
    gain.connect(dest);
    harmGain.connect(dest);
    osc.start(t);
    harmonic.start(t);
    osc.stop(t + dur + 0.02);
    harmonic.stop(t + dur + 0.02);
  },

  _synthSparkle(t, freq, vol, dur, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.linearRampToValueAtTime(freq * 1.02, t + dur);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  },

  _synthBell(t, freq, vol, dur, type, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  },

  _synthWoodTap(t, freq, vol, dur, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, t);
    filter.Q.setValueAtTime(3, t);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 1.2, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  },

  _synthMokugyo(t, startFreq, endFreq, vol, dur, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  },

  _synthWaterDrop(t, startFreq, endFreq, vol, dur, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  },

  _synthPitchStep(t, startFreq, endFreq, vol, dur, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.linearRampToValueAtTime(endFreq, t + dur);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  },

  _synthDelicateTick(t, freq, vol, dur, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.005);
  },

  _synthAiryChime(t, f1, f2, vol, dur, dest) {
    const half = dur * 0.45;
    this._synthBell(t, f1, vol * 0.8, half, 'sine', dest);
    this._synthBell(t + half * 0.6, f2, vol, dur - half * 0.6, 'sine', dest);
  },

  _synthSoftThud(t, startFreq, endFreq, vol, dur, dest) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  }
};

// Global User Interaction Listener to Unlock Audio on iOS Safari & Android
if (typeof window !== 'undefined') {
  const unlockAudioOnGesture = () => {
    SoundEngine.unlock();
  };
  window.addEventListener('pointerdown', unlockAudioOnGesture, { once: true, passive: true });
  window.addEventListener('touchstart', unlockAudioOnGesture, { once: true, passive: true });
  window.addEventListener('click', unlockAudioOnGesture, { once: true, passive: true });
}

// Backward-Compatible Bridge Functions
function initAudioContext() {
  SoundEngine.init();
}

function playSound(type) {
  SoundEngine.play(type);
}

function playCalmChime() {
  SoundEngine.play('sync_success');
}

function playSoftPop() {
  SoundEngine.play('click');
}

function playWarningAlertTone() {
  SoundEngine.play('budget_warn');
}

function playScannerBeep() {
  SoundEngine.play('add_item');
}

function playCelebrationFanfare() {
  SoundEngine.play('checkout');
}

// =========================================================================
// 3B. CUTE CELEBRATION CONFETTI SHOWER (OPTIMIZED 60 FPS SPRITE CACHE)
// =========================================================================
let activeConfettiAnimId = null;
let confettiStartTimeout = null;

// Reusable offscreen sprite cache to eliminate font parsing & bezier redraws every frame
const _confettiSpriteCache = {
  emojis: {},
  hearts: {},
  sparkles: {}
};

function _getEmojiSprite(emoji) {
  if (typeof document === 'undefined') return null;
  if (_confettiSpriteCache.emojis[emoji]) return _confettiSpriteCache.emojis[emoji];
  try {
    const off = document.createElement('canvas');
    const sz = 44;
    off.width = sz;
    off.height = sz;
    const ctx = off.getContext('2d');
    if (!ctx) return null;
    ctx.font = '28px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, sz / 2, sz / 2 + 1);
    _confettiSpriteCache.emojis[emoji] = off;
    return off;
  } catch (e) {
    return null;
  }
}

function _getHeartSprite(color) {
  if (typeof document === 'undefined') return null;
  if (_confettiSpriteCache.hearts[color]) return _confettiSpriteCache.hearts[color];
  try {
    const off = document.createElement('canvas');
    const sz = 44;
    off.width = sz;
    off.height = sz;
    const ctx = off.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = color;
    ctx.beginPath();
    const half = sz * 0.28;
    ctx.translate(sz / 2, sz * 0.40);
    ctx.moveTo(0, -half * 0.3);
    ctx.bezierCurveTo(-half * 0.5, -half * 1.1, -half * 1.4, -half * 0.4, -half * 1.4, half * 0.2);
    ctx.bezierCurveTo(-half * 1.4, half * 0.8, -half * 0.5, half * 1.3, 0, half * 1.7);
    ctx.bezierCurveTo(half * 0.5, half * 1.3, half * 1.4, half * 0.8, half * 1.4, half * 0.2);
    ctx.bezierCurveTo(half * 1.4, -half * 0.4, half * 0.5, -half * 1.1, 0, -half * 0.3);
    ctx.closePath();
    ctx.fill();
    _confettiSpriteCache.hearts[color] = off;
    return off;
  } catch (e) {
    return null;
  }
}

function _getSparkleSprite(color) {
  if (typeof document === 'undefined') return null;
  if (_confettiSpriteCache.sparkles[color]) return _confettiSpriteCache.sparkles[color];
  try {
    const off = document.createElement('canvas');
    const sz = 36;
    off.width = sz;
    off.height = sz;
    const ctx = off.getContext('2d');
    if (!ctx) return null;
    ctx.fillStyle = color;
    const rad = sz * 0.42;
    ctx.translate(sz / 2, sz / 2);
    ctx.beginPath();
    ctx.moveTo(0, -rad);
    ctx.quadraticCurveTo(0, 0, rad, 0);
    ctx.quadraticCurveTo(0, 0, 0, rad);
    ctx.quadraticCurveTo(0, 0, -rad, 0);
    ctx.quadraticCurveTo(0, 0, 0, -rad);
    ctx.closePath();
    ctx.fill();
    _confettiSpriteCache.sparkles[color] = off;
    return off;
  } catch (e) {
    return null;
  }
}

function triggerCuteLoginConfetti() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  // Respect user preference for reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Cancel any running confetti cleanly to prevent duplicate stacking
  if (activeConfettiAnimId) {
    cancelAnimationFrame(activeConfettiAnimId);
    activeConfettiAnimId = null;
  }
  if (confettiStartTimeout) {
    clearTimeout(confettiStartTimeout);
    confettiStartTimeout = null;
  }
  const oldCanvas = document.getElementById('celebrationConfettiCanvas');
  if (oldCanvas) {
    if (typeof oldCanvas.remove === 'function') oldCanvas.remove();
    else if (oldCanvas.parentNode) oldCanvas.parentNode.removeChild(oldCanvas);
  }

  // Stagger execution slightly (50ms) so heavy synchronous auth DOM rendering settles first
  confettiStartTimeout = setTimeout(() => {
    confettiStartTimeout = null;
    _runCuteConfettiAnimation();
  }, 50);
}

function _runCuteConfettiAnimation() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.id = 'celebrationConfettiCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  canvas.style.opacity = '1';
  canvas.style.transition = 'opacity 0.45s ease-out';
  document.body.appendChild(canvas);

  if (typeof canvas.getContext !== 'function') return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // Cap DPR at 1.25 for massive GPU fillrate savings while keeping visuals crisp
  const dpr = Math.min(1.25, window.devicePixelRatio || 1);
  const w = (canvas.width = Math.round(window.innerWidth * dpr));
  const h = (canvas.height = Math.round(window.innerHeight * dpr));

  // Vibrant, cheerful pastel-candy palette
  const CUTE_PALETTE = [
    '#FF4B72', '#B95679', '#F472B6', '#FDA4AF', '#FB7185',
    '#C084FC', '#A855F7', '#FBBF24', '#FDE047', '#34D399', '#38BDF8'
  ];
  const CUTE_EMOJIS = ['💖', '💕', '❤️', '🌸', '✨', '⭐', '🎀', '🍓', '🎉', '🥰'];

  // Optimal particle count: 28-38 on mobile, up to 48 on desktop (prevents lag, remains festive)
  const count = Math.min(48, Math.max(28, Math.floor(window.innerWidth / 11)));
  const particles = [];

  for (let i = 0; i < count; i++) {
    const typeRoll = Math.random();
    let type = 'heart';
    if (typeRoll < 0.38) type = 'heart';
    else if (typeRoll < 0.65) type = 'emoji';
    else if (typeRoll < 0.85) type = 'ribbon';
    else type = 'sparkle';

    const emoji = CUTE_EMOJIS[Math.floor(Math.random() * CUTE_EMOJIS.length)];
    const color = CUTE_PALETTE[Math.floor(Math.random() * CUTE_PALETTE.length)];
    const size = (type === 'emoji') ? (20 + Math.random() * 10) * dpr :
      (type === 'heart') ? (14 + Math.random() * 10) * dpr :
        (type === 'ribbon') ? (9 + Math.random() * 7) * dpr :
          (8 + Math.random() * 6) * dpr;

    let sprite = null;
    if (type === 'emoji') sprite = _getEmojiSprite(emoji);
    else if (type === 'heart') sprite = _getHeartSprite(color);
    else if (type === 'sparkle') sprite = _getSparkleSprite(color);

    let x, y, vx, vy;
    const isBurst = (i < count * 0.65); // 65% twin bottom-corner cannons
    if (isBurst) {
      const fromLeft = (i % 2 === 0);
      x = fromLeft ? w * (0.05 + Math.random() * 0.12) : w * (0.83 + Math.random() * 0.12);
      y = h * (0.75 + Math.random() * 0.18);
      const angle = fromLeft
        ? (-Math.PI * 0.48 + (Math.random() - 0.5) * 0.45)
        : (-Math.PI * 0.52 - (Math.random() - 0.5) * 0.45);
      const speed = (9 + Math.random() * 11) * dpr;
      vx = Math.cos(angle) * speed;
      vy = Math.sin(angle) * speed;
    } else {
      x = Math.random() * w;
      y = -15 * dpr - Math.random() * 70 * dpr;
      vx = (Math.random() - 0.5) * 2.5 * dpr;
      vy = (2.0 + Math.random() * 3.2) * dpr;
    }

    particles.push({
      type,
      emoji,
      color,
      sprite,
      size,
      x,
      y,
      vx,
      vy,
      gravity: (0.17 + Math.random() * 0.09) * dpr,
      drag: 0.985,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.04 + Math.random() * 0.04,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.10,
      tilt: Math.random() * Math.PI * 2,
      tiltSpeed: 0.05 + Math.random() * 0.07,
      opacity: 1,
      fadeSpeed: 0.005 + Math.random() * 0.004
    });
  }

  let lastTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  const startTime = lastTime;
  const maxDuration = 2400; // Snappy 2.4s celebration

  function renderFrame(now) {
    const currentTime = now || ((typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now());
    const dt = Math.min(2.5, Math.max(0.4, (currentTime - lastTime) / 16.67));
    lastTime = currentTime;
    const elapsed = currentTime - startTime;

    ctx.clearRect(0, 0, w, h);

    let activeCount = 0;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity <= 0 || p.y > h + 50 * dpr) continue;
      activeCount++;

      p.x += (p.vx + Math.sin(p.wobble) * (1.2 * dpr)) * dt;
      p.y += p.vy * dt;
      p.vx *= Math.pow(p.drag, dt);
      p.vy += p.gravity * dt;
      p.wobble += p.wobbleSpeed * dt;
      p.rotation += p.rotSpeed * dt;
      p.tilt += p.tiltSpeed * dt;

      if (elapsed > 1300) {
        p.opacity -= p.fadeSpeed * 1.6 * dt;
      }

      const currentAlpha = Math.max(0, Math.min(1, p.opacity));
      if (currentAlpha <= 0.01) continue;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = currentAlpha;

      if (p.type === 'ribbon') {
        ctx.scale(Math.cos(p.tilt), 1);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size * 0.5, -p.size * 0.25, p.size, p.size * 0.5);
      } else if (p.sprite) {
        if (p.type === 'heart') {
          ctx.scale(Math.cos(p.tilt), 1);
        }
        ctx.drawImage(p.sprite, -p.size * 0.5, -p.size * 0.5, p.size, p.size);
      } else if (p.type === 'emoji') {
        // Fallback if sprite creation failed
        ctx.font = `${Math.round(p.size)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
      }
      ctx.restore();
    }

    if (activeCount > 0 && elapsed < maxDuration) {
      activeConfettiAnimId = requestAnimationFrame(renderFrame);
    } else {
      canvas.style.opacity = '0';
      setTimeout(() => {
        if (canvas.parentNode) {
          if (typeof canvas.remove === 'function') canvas.remove();
          else canvas.parentNode.removeChild(canvas);
        }
        activeConfettiAnimId = null;
      }, 450);
    }
  }

  activeConfettiAnimId = requestAnimationFrame(renderFrame);
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
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

// Requirement: Purge legacy Audrey/demo data completely
function purgeLegacyAudreyData() {
  try {
    const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser);
        if (u && (
          u.uid === 'demo_user_101' ||
          (u.name && u.name.toLowerCase().includes('audrey')) ||
          (u.email && u.email.toLowerCase().includes('audrey'))
        )) {
          localStorage.removeItem(STORAGE_KEYS.USER);
          if (AppState.user && (
            AppState.user.uid === 'demo_user_101' ||
            (AppState.user.name && AppState.user.name.toLowerCase().includes('audrey')) ||
            (AppState.user.email && AppState.user.email.toLowerCase().includes('audrey'))
          )) {
            AppState.user = null;
          }
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }

    // Clean saved Google accounts list
    let googleAccs = getSavedGoogleAccounts();
    if (Array.isArray(googleAccs)) {
      const filtered = googleAccs.filter(a =>
        a && a.email && !a.email.toLowerCase().includes('audrey') &&
        (!a.name || !a.name.toLowerCase().includes('audrey'))
      );
      if (filtered.length !== googleAccs.length) {
        saveSavedGoogleAccounts(filtered);
      }
    }

    // Clean registered users list
    let regUsers = getRegisteredUsers();
    if (Array.isArray(regUsers)) {
      const filteredReg = regUsers.filter(u =>
        u && u.email && !u.email.toLowerCase().includes('audrey') &&
        (!u.name || !u.name.toLowerCase().includes('audrey')) &&
        u.uid !== 'demo_user_101'
      );
      if (filteredReg.length !== regUsers.length) {
        saveRegisteredUsers(filteredReg);
      }
    }

    // Purge any key in localStorage containing audrey or demo_user_101
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && (k.toLowerCase().includes('audrey') || k.includes('demo_user_101'))) {
        localStorage.removeItem(k);
      }
    }
  } catch (err) {
    console.warn('Purge legacy demo users notice:', err);
  }
}

function loadUserIsolatedState(uid) {
  if (!uid) uid = 'guest';
  try {
    // 1. User-isolated cart
    // Brand new accounts and clean guest sessions start strictly with an empty cart ([]).
    // NEVER inherit guest or legacy items into a new or authenticated account!
    const userCart = localStorage.getItem('grocery_cart_' + uid);
    if (userCart) {
      try {
        AppState.cart = JSON.parse(userCart);
      } catch (e) {
        AppState.cart = [];
      }
    } else {
      // Only demo_user_101 loads mock cart items
      AppState.cart = (uid === 'demo_user_101') ? JSON.parse(JSON.stringify(DEFAULT_CART_ITEMS)) : [];
    }

    // 2. User-isolated store
    const userStore = localStorage.getItem('grocery_store_' + uid);
    AppState.currentStore = userStore || 'Lotte Mart Grocery - Puri Indah';

    // 3. User-isolated date
    const userDate = localStorage.getItem('grocery_date_' + uid);
    AppState.currentDate = userDate || new Date().toISOString().split('T')[0];

    // 4. User-isolated budget
    const userBudget = localStorage.getItem('grocery_budget_' + uid);
    if (userBudget !== null && !isNaN(parseInt(userBudget, 10)) && parseInt(userBudget, 10) > 0) {
      AppState.budget = parseInt(userBudget, 10);
    } else {
      AppState.budget = 100000;
    }

    // 5. User-isolated budget period
    const userPeriod = localStorage.getItem('grocery_period_' + uid);
    AppState.budgetPeriod = userPeriod || 'weekly';

    // 6. User-isolated receipts history
    const userReceipts = localStorage.getItem('grocery_receipts_' + uid);
    if (userReceipts) {
      try {
        AppState.receipts = JSON.parse(userReceipts);
      } catch (e) {
        AppState.receipts = [];
      }
    } else {
      AppState.receipts = (uid === 'demo_user_101') ? JSON.parse(JSON.stringify(DEFAULT_RECEIPTS)) : [];
    }
    if (Array.isArray(AppState.receipts)) {
      AppState.receipts.forEach(r => {
        if (!r.kasir || r.kasir.includes('Self-Checkout') || r.kasir.includes('Pengguna') || r.kasir.includes('Evelina')) {
          r.kasir = 'Mr. Tio';
        }
      });
    }

    // 7. User-isolated pantry inventory
    const userPantry = localStorage.getItem('grocery_pantry_' + uid);
    if (userPantry) {
      try {
        AppState.pantry = JSON.parse(userPantry);
      } catch (e) {
        AppState.pantry = [];
      }
    } else {
      AppState.pantry = (uid === 'demo_user_101') ? JSON.parse(JSON.stringify(DEFAULT_PANTRY)) : [];
    }

    // 8. User-isolated anti-list / blacklist
    const userBlacklist = localStorage.getItem('grocery_blacklist_' + uid);
    if (userBlacklist) {
      try {
        AppState.blacklist = JSON.parse(userBlacklist);
      } catch (e) {
        AppState.blacklist = [...DEFAULT_BLACKLIST];
      }
    } else {
      AppState.blacklist = [...DEFAULT_BLACKLIST];
    }

    // 9. User-isolated routine items (Auto-refresh)
    const userRoutine = localStorage.getItem('grocery_routine_items_' + uid);
    if (userRoutine) {
      try {
        AppState.routineItems = JSON.parse(userRoutine);
      } catch (e) {
        AppState.routineItems = (uid === 'demo_user_101') ? JSON.parse(JSON.stringify(DEFAULT_ROUTINE_ITEMS)) : [];
      }
    } else {
      AppState.routineItems = (uid === 'demo_user_101') ? JSON.parse(JSON.stringify(DEFAULT_ROUTINE_ITEMS)) : [];
    }

    // 10. User-isolated price history
    const userHistory = localStorage.getItem('grocery_history_' + uid);
    if (userHistory) {
      try {
        AppState.priceHistory = JSON.parse(userHistory);
      } catch (e) {
        AppState.priceHistory = JSON.parse(JSON.stringify(DEFAULT_PRICE_HISTORY));
      }
    } else {
      AppState.priceHistory = JSON.parse(JSON.stringify(DEFAULT_PRICE_HISTORY));
    }

    // 11. User-isolated in-store mode
    const userInStore = localStorage.getItem('grocery_instore_' + uid);
    AppState.inStoreMode = (userInStore === 'true');

    // 12. User-isolated active tab
    const userTab = localStorage.getItem('grocery_tab_' + uid);
    if (userTab && ['planner', 'cart', 'budget', 'pantry'].includes(userTab)) {
      AppState.currentTab = userTab;
    }

    // 13. User-isolated custom categories (khusus akun user ini)
    const userCats = localStorage.getItem('grocery_custom_categories_' + uid);
    if (userCats) {
      try {
        AppState.userCustomCategories = JSON.parse(userCats);
      } catch (e) {
        AppState.userCustomCategories = [];
      }
    } else {
      AppState.userCustomCategories = [];
    }

    // 14. User-isolated custom products catalog (koleksi produk akun user ini)
    const userItems = localStorage.getItem('grocery_custom_items_' + uid);
    if (userItems) {
      try {
        AppState.userCustomItems = JSON.parse(userItems);
      } catch (e) {
        AppState.userCustomItems = [];
      }
    } else {
      AppState.userCustomItems = [];
    }

    // 15. User-isolated saved store history (riwayat lokasi tersimpan akun user ini)
    const userStores = localStorage.getItem('grocery_user_stores_' + uid);
    if (userStores) {
      try {
        AppState.userStores = JSON.parse(userStores);
      } catch (e) {
        AppState.userStores = ['Lotte Mart Grocery - Puri Indah', 'Superindo - Kebon Jeruk', 'Grand Lucky - SCBD'];
      }
    } else {
      AppState.userStores = ['Lotte Mart Grocery - Puri Indah', 'Superindo - Kebon Jeruk', 'Grand Lucky - SCBD'];
    }
    if (AppState.currentStore && !AppState.userStores.some(s => s.toLowerCase() === AppState.currentStore.toLowerCase())) {
      AppState.userStores.unshift(AppState.currentStore);
    }

    syncCategoryDropdownOptions();

    // Reset safety level tracking so no phantom warnings fire
    AppState.previousSafetyLevel = null;

    renderAll();
    checkDailyPlannerReset(uid);
  } catch (e) {
    console.warn('loadUserIsolatedState error:', e);
  }
}

function loadLocalState() {
  try {
    purgeLegacyAudreyData();
    const storedUser = getStoredItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && (
          parsed.uid === 'demo_user_101' ||
          (parsed.name && parsed.name.toLowerCase().includes('audrey')) ||
          (parsed.email && parsed.email.toLowerCase().includes('audrey'))
        )) {
          AppState.user = null;
          localStorage.removeItem(STORAGE_KEYS.USER);
        } else {
          AppState.user = parsed;
          if (AppState.user) {
            const uid = AppState.user.uid || 'guest';
            const customAvatar = localStorage.getItem('smart_grocery_custom_avatar_' + uid) ||
                                 localStorage.getItem('smart_grocery_custom_avatar_latest') ||
                                 localStorage.getItem('smart_grocery_custom_avatar_guest');
            if (customAvatar) {
              AppState.user.photoURL = customAvatar;
              AppState.user.photo = customAvatar;
              AppState.user.customAvatar = customAvatar;
            }
          }
        }
      } catch (e) {
        AppState.user = null;
      }
    }

    const uid = (AppState.user && AppState.user.uid) ? AppState.user.uid : 'guest';
    loadUserIsolatedState(uid);

    const storedSound = getStoredItem(STORAGE_KEYS.SOUND_ENABLED);
    if (storedSound !== null) AppState.soundEnabled = JSON.parse(storedSound);

    const storedVol = getStoredItem(STORAGE_KEYS.SOUND_VOLUME);
    if (storedVol !== null) AppState.soundVolume = parseFloat(storedVol);
    else AppState.soundVolume = 0.75;

    const storedTheme = getStoredItem(STORAGE_KEYS.SOUND_THEME);
    if (storedTheme) AppState.soundTheme = storedTheme;
    else AppState.soundTheme = 'kawaii';

    const storedSession = getStoredItem(STORAGE_KEYS.SESSION_ID);
    if (storedSession) AppState.sessionId = storedSession;

    const storedDismissed = getStoredItem(STORAGE_KEYS.STICKY_SALDO_DISMISSED);
    if (storedDismissed !== null) {
      try {
        AppState.stickySaldoDismissed = JSON.parse(storedDismissed);
      } catch (e) {
        AppState.stickySaldoDismissed = storedDismissed;
      }
    }
  } catch (err) {
    console.error('LocalStorage load error:', err);
    AppState.cart = [];
    AppState.priceHistory = { ...DEFAULT_PRICE_HISTORY };
    AppState.pantry = [];
    AppState.blacklist = [...DEFAULT_BLACKLIST];
  }
}

function saveLocalState() {
  try {
    const uid = (AppState.user && AppState.user.uid) ? AppState.user.uid : 'guest';

    if (AppState.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(AppState.user));
    }

    // Isolated keys per user UID (Guarantees every account's progress is saved independently)
    localStorage.setItem('grocery_cart_' + uid, JSON.stringify(AppState.cart));
    localStorage.setItem('grocery_store_' + uid, AppState.currentStore);
    localStorage.setItem('grocery_date_' + uid, AppState.currentDate);
    localStorage.setItem('grocery_budget_' + uid, AppState.budget.toString());
    localStorage.setItem('grocery_period_' + uid, AppState.budgetPeriod || 'weekly');
    localStorage.setItem('grocery_receipts_' + uid, JSON.stringify(AppState.receipts));
    localStorage.setItem('grocery_pantry_' + uid, JSON.stringify(AppState.pantry));
    localStorage.setItem('grocery_blacklist_' + uid, JSON.stringify(AppState.blacklist));
    localStorage.setItem(STORAGE_KEYS.STICKY_SALDO_DISMISSED, JSON.stringify(AppState.stickySaldoDismissed));
    localStorage.setItem('grocery_routine_items_' + uid, JSON.stringify(AppState.routineItems || []));
    localStorage.setItem('grocery_custom_categories_' + uid, JSON.stringify(AppState.userCustomCategories || []));
    localStorage.setItem('grocery_custom_items_' + uid, JSON.stringify(AppState.userCustomItems || []));
    localStorage.setItem('grocery_user_stores_' + uid, JSON.stringify(AppState.userStores || []));
    localStorage.setItem('grocery_history_' + uid, JSON.stringify(AppState.priceHistory));
    localStorage.setItem('grocery_instore_' + uid, JSON.stringify(AppState.inStoreMode));
    if (AppState.currentTab) {
      localStorage.setItem('grocery_tab_' + uid, AppState.currentTab);
      localStorage.setItem('smart_grocery_current_tab', AppState.currentTab);
    }
    const todayStr = AppState.currentDate || new Date().toISOString().split('T')[0];
    localStorage.setItem('last_planner_reset_date_' + uid, todayStr);
    localStorage.setItem('last_planner_reset_date', todayStr);

    // Global / fallback keys for cross-compatibility
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(AppState.cart));
    localStorage.setItem(STORAGE_KEYS.STORE, AppState.currentStore);
    localStorage.setItem(STORAGE_KEYS.DATE, AppState.currentDate);
    localStorage.setItem(STORAGE_KEYS.BUDGET, AppState.budget.toString());
    localStorage.setItem(STORAGE_KEYS.BUDGET_PERIOD, AppState.budgetPeriod || 'weekly');
    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(AppState.priceHistory));
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(AppState.receipts));
    localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(AppState.pantry));
    localStorage.setItem(STORAGE_KEYS.BLACKLIST, JSON.stringify(AppState.blacklist));
    localStorage.setItem('grocery_routine_items', JSON.stringify(AppState.routineItems || []));
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, AppState.sessionId);
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(AppState.soundEnabled));
    localStorage.setItem(STORAGE_KEYS.SOUND_VOLUME, (AppState.soundVolume !== undefined ? AppState.soundVolume : 0.75).toString());
    localStorage.setItem(STORAGE_KEYS.SOUND_THEME, AppState.soundTheme || 'kawaii');
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

    // Pastikan persistensi sesi lokal aktif sehingga tidak perlu login ulang saat kembali
    if (firebase.auth) {
      try {
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .catch(e => console.warn('Firebase setPersistence notice:', e));
      } catch (e) { }
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
    const uid = (AppState.user && AppState.user.uid) ? AppState.user.uid : null;
    if (docSnapshot.exists) {
      const data = docSnapshot.data();
      const hasLocalCart = uid ? !!localStorage.getItem('grocery_cart_' + uid) : true;

      // Apply remote data if:
      // 1. Device has no local data yet for this user (e.g. login on new device/browser), OR
      // 2. Cloud data has a newer timestamp than local
      if (data && (!hasLocalCart || (data.lastUpdated && data.lastUpdated > AppState.lastLocalUpdate))) {
        isReceivingRemoteUpdate = true;
        applyRemoteState(data);
        showToast('Data diperbarui dari Cloud Firestore (onSnapshot) 🔄', 'info');
        isReceivingRemoteUpdate = false;
      }
    } else {
      // Document does not exist in Firestore -> Brand new account
      if (uid && uid !== 'demo_user_101') {
        const hasLocalCart = !!localStorage.getItem('grocery_cart_' + uid);
        if (!hasLocalCart) {
          AppState.cart = [];
          AppState.budget = 100000;
          AppState.receipts = [];
          AppState.pantry = [];
          AppState.routineItems = [];
          AppState.previousSafetyLevel = null;
          saveLocalState();
          renderAll();
        }
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
        // Never allow legacy demo/audrey account
        if ((user.displayName && user.displayName.toLowerCase().includes('audrey')) ||
          (user.email && user.email.toLowerCase().includes('audrey'))) {
          return;
        }

        user.isLiveFirebaseSession = true;
        const rawProv = (user.providerData && user.providerData[0] && user.providerData[0].providerId)
          ? user.providerData[0].providerId
          : 'google';
        const cleanProv = rawProv.includes('google') ? 'google' : (rawProv.includes('password') || rawProv.includes('email')) ? 'email' : 'google';

        // Only switch if no user or different user
        if (!AppState.user || AppState.user.uid !== user.uid) {
          handleSuccessfulAuth(user, cleanProv, false);
        } else {
          // Sinkronisasi sesi live & avatar jika ada pembaruan
          AppState.user.isLiveFirebaseSession = true;
          const savedCustomAvatar = localStorage.getItem('smart_grocery_custom_avatar_' + user.uid) ||
                                    localStorage.getItem('smart_grocery_custom_avatar_latest') ||
                                    localStorage.getItem('smart_grocery_custom_avatar_guest');
          if (!savedCustomAvatar && user.photoURL && user.photoURL !== AppState.user.photoURL) {
            AppState.user.photoURL = user.photoURL;
            updateHeaderAvatar(user.photoURL);
            updateModalAvatar(user.photoURL);
          }
        }
      } else {
        // DO NOT log out on initial null or pending Firebase state during page refresh!
        // Logout should only occur via explicit user action (e.g. clicking 'Keluar Akun').
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
      try { sessionStorage.removeItem('pending_google_redirect'); } catch (e) { }
      if (result && result.user) {
        result.user.isLiveFirebaseSession = true;
        handleSuccessfulAuth(result.user, 'google', true);
      }
    } catch (err) {
      try { sessionStorage.removeItem('pending_google_redirect'); } catch (e) { }
      if (err.code && err.code !== 'auth/null-user') {
        console.warn('Redirect sign-in notice:', err.code, err.message);
        showToast(getAuthErrorMessage(err), 'error');
      }
    }
  }
}

function handleSuccessfulAuth(u, providerType, notify = true) {
  const cleanProvider = (providerType && (providerType.includes('google') || providerType === 'google.com'))
    ? 'google'
    : (providerType && (providerType.includes('password') || providerType === 'email'))
      ? 'email'
      : (providerType || 'google');

  const displayName = u.displayName || (u.email ? u.email.split('@')[0] : 'Pengguna');
  const uid = u.uid || getDeterministicUid(u.email, cleanProvider === 'google' ? 'google_' : 'usr_');
  
  // Prioritaskan custom avatar tersimpan (foto upload / kawaii preset)
  const savedCustomAvatar = localStorage.getItem('smart_grocery_custom_avatar_' + uid) ||
                            localStorage.getItem('smart_grocery_custom_avatar_latest') ||
                            localStorage.getItem('smart_grocery_custom_avatar_guest') ||
                            (AppState.user && AppState.user.customAvatar);

  const photoURL = savedCustomAvatar || u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4285F4&color=fff&bold=true`;

  AppState.user = {
    name: displayName,
    email: u.email || 'user@email.com',
    photoURL: photoURL,
    customAvatar: savedCustomAvatar || null,
    uid: uid,
    authProvider: cleanProvider,
    isLiveFirebaseSession: !!u.isLiveFirebaseSession,
    loggedAt: new Date().toISOString()
  };

  // Backup profile to Cloud Firestore registered_accounts
  if (firestoreDb && u.email) {
    const cleanEmail = u.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    firestoreDb.collection('registered_accounts').doc(cleanEmail).set({
      name: displayName,
      email: u.email.toLowerCase().trim(),
      uid: uid,
      photoURL: photoURL,
      authProvider: cleanProvider,
      lastLogin: new Date().toISOString()
    }, { merge: true }).catch(err => console.info('Firestore profile sync notice:', err));
  }

  // Backup profile to Local Registry registered_users
  if (u.email) {
    try {
      const regUsers = getRegisteredUsers();
      const cleanMail = u.email.toLowerCase().trim();
      const existingIdx = regUsers.findIndex(usr => usr.email && usr.email.toLowerCase() === cleanMail);
      const userProfileEntry = {
        name: displayName,
        email: cleanMail,
        uid: uid,
        photoURL: photoURL,
        authProvider: cleanProvider,
        lastLogin: new Date().toISOString()
      };
      if (existingIdx >= 0) {
        regUsers[existingIdx] = { ...regUsers[existingIdx], ...userProfileEntry };
      } else {
        regUsers.push(userProfileEntry);
      }
      saveRegisteredUsers(regUsers);
    } catch (regErr) {
      console.warn('Local registered_users save notice:', regErr);
    }
  }

  // Check if this is a first-time local login for this user UID
  const isExistingLocalUser = !!localStorage.getItem('grocery_cart_' + uid);
  const isInitialized = localStorage.getItem('grocery_user_initialized_' + uid) === 'true';

  if (!isExistingLocalUser && !isInitialized && uid !== 'demo_user_101') {
    // Brand new account: start completely clean with empty cart and default budget
    AppState.cart = [];
    AppState.receipts = [];
    AppState.pantry = [];
    AppState.budget = 100000;
    AppState.budgetPeriod = 'weekly';
    AppState.routineItems = [];
    AppState.previousSafetyLevel = null;
    localStorage.setItem('grocery_user_initialized_' + uid, 'true');
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem('last_planner_reset_date_' + uid, todayStr);
    localStorage.setItem('last_planner_reset_date', todayStr);
  }

  // Load isolated local storage for this specific user UID
  loadUserIsolatedState(uid);
  AppState.previousSafetyLevel = null; // Always reset so no phantom warnings fire on auth

  // Ensure any lingering overbudget banner in DOM is hidden
  const overbudgetBanner = document.getElementById('overbudget-firm-banner');
  if (overbudgetBanner) overbudgetBanner.classList.add('hidden');
  const overbudgetSlimBadge = document.getElementById('overbudget-slim-badge');
  if (overbudgetSlimBadge) overbudgetSlimBadge.style.display = 'none';

  saveLocalState();
  playCalmChime();
  checkAuth();

  // Connect realtime onSnapshot listener for this user's UID
  setupFirestoreListener();

  if (notify) {
    playCelebrationFanfare();
    triggerCuteLoginConfetti();
    showToast(`Selamat datang, ${displayName}! ✨`, 'success');
  }
}

function applyRemoteState(data) {
  if (!data) return;
  if (Array.isArray(data.cart)) AppState.cart = data.cart;
  if (data.store) AppState.currentStore = data.store;
  if (data.date) AppState.currentDate = data.date;
  if (data.budget) AppState.budget = parseFloat(data.budget) || AppState.budget;
  if (data.budgetPeriod) AppState.budgetPeriod = data.budgetPeriod;
  if (Array.isArray(data.receipts)) AppState.receipts = data.receipts;
  if (Array.isArray(data.pantry)) AppState.pantry = data.pantry;
  if (Array.isArray(data.userStores) && data.userStores.length > 0) {
    const combined = [...data.userStores];
    (AppState.userStores || []).forEach(s => {
      if (!combined.some(c => c.toLowerCase() === s.toLowerCase())) {
        combined.push(s);
      }
    });
    AppState.userStores = combined;
  }
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
    budgetPeriod: AppState.budgetPeriod || 'weekly',
    receipts: AppState.receipts || [],
    pantry: AppState.pantry || [],
    userStores: AppState.userStores || [],
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
        firestoreDb.collection('grocery_sessions').doc(AppState.sessionId).set(payload, { merge: true }).catch(() => { });
      } catch (e) { }
    }
  };

  if (immediate) {
    firestoreSyncAction();
  } else {
    cloudSyncDebounceTimer = setTimeout(firestoreSyncAction, 300);
  }
}

function updateCloudSyncUI(status, labelText) {
  const isOnline = (status === 'connected') || (status !== 'offline' && typeof navigator !== 'undefined' && navigator.onLine);
  const statusPill = document.getElementById('cloud-sync-status-pill');
  const statusText = document.getElementById('cloud-sync-text') || document.querySelector('.cloud-sync-text');
  const dot = document.getElementById('cloud-sync-dot');

  if (statusPill) {
    statusPill.classList.toggle('status-online', isOnline);
    statusPill.classList.toggle('status-offline', !isOnline);
    statusPill.title = labelText || (isOnline ? 'Koneksi Online & Cloud Sync Siap' : 'Mode Offline (Penyimpanan Lokal)');
  }
  if (statusText) {
    // Keep it short, clean, and elegant - no overflowing or overlapping text!
    statusText.textContent = isOnline ? 'Aktif' : 'Offline';
  }
  if (dot) {
    dot.className = `cloud-sync-dot ${isOnline ? 'online pulsing' : 'offline'}`;
    dot.style.background = isOnline ? '#10B981' : '#94A3B8';
  }

  const modalCloudStatus = document.getElementById('modalCloudSyncStatus');
  if (modalCloudStatus) {
    modalCloudStatus.className = `settings-status-pill ${isOnline ? 'online' : 'offline'}`;
    modalCloudStatus.textContent = isOnline ? '🟢 Online (Cloud Ready)' : '🟠 Mode Offline (LocalStorage)';
  }
}

// =========================================================================
// 6. AUTH GATE: USER REGISTRY, GOOGLE AUTH & EMAIL SIGN IN / SIGN UP
// =========================================================================

function getDeterministicUid(email, prefix = 'usr_') {
  if (!email) return prefix + 'guest';
  const clean = email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  return prefix + clean;
}

function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(u => u && u.email && !u.email.toLowerCase().includes('audrey') && (!u.name || !u.name.toLowerCase().includes('audrey')) && u.uid !== 'demo_user_101');
  } catch (e) {
    return [];
  }
}

function saveRegisteredUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users || []));
  } catch (e) {
    console.warn('Error saving registered users:', e);
  }
}

function getSavedGoogleAccounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOOGLE_ACCOUNTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(a => a && a.email && !a.email.toLowerCase().includes('audrey') && (!a.name || !a.name.toLowerCase().includes('audrey')));
  } catch (e) {
    return [];
  }
}

function saveSavedGoogleAccounts(accounts) {
  try {
    localStorage.setItem(STORAGE_KEYS.GOOGLE_ACCOUNTS, JSON.stringify(accounts || []));
  } catch (e) {
    console.warn('Error saving google accounts:', e);
  }
}

function setAuthAlert(message, type = 'warning') {
  const alertBox = document.getElementById('authAlertBox');
  if (!alertBox) return;
  alertBox.className = `auth-alert-box alert-${type}`;
  const icon = (type === 'danger') ? '❌' : (type === 'success') ? '✅' : '⚠️';
  alertBox.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  alertBox.style.display = 'flex';
}

function clearAuthAlert() {
  const alertBox = document.getElementById('authAlertBox');
  if (alertBox) {
    alertBox.style.display = 'none';
    alertBox.innerHTML = '';
  }
}

function switchAuthMode(mode) {
  AppState.authMode = mode;
  clearAuthAlert();
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

  // Reset password visibility to hidden by default on mode switch
  const passInput = document.getElementById('authPassInput');
  const passBtn = document.getElementById('btnToggleAuthPass');
  if (passInput) passInput.type = 'password';
  if (passBtn) {
    const openIcon = passBtn.querySelector('.eye-open');
    const closedIcon = passBtn.querySelector('.eye-closed');
    if (openIcon && closedIcon) {
      openIcon.style.display = 'block';
      closedIcon.style.display = 'none';
    }
    passBtn.setAttribute('aria-label', 'Lihat kata sandi');
    passBtn.title = 'Lihat kata sandi';
  }
}

function toggleAuthMode() {
  if (AppState.authMode === 'signup') {
    switchAuthMode('signin');
  } else {
    switchAuthMode('signup');
  }
}

// -------------------------------------------------------------------------
// GOOGLE ACCOUNT CHOOSER MODAL HANDLERS
function getAuthErrorMessage(err) {
  if (!err) return 'Terjadi kesalahan saat masuk.';
  switch (err.code) {
    case 'auth/unauthorized-domain':
      return 'Domain aplikasi belum terdaftar di Firebase Authorized Domains. Pastikan membuka dari domain resmi.';
    case 'auth/operation-not-supported-in-this-environment':
      return 'Lingkungan peramban membatasi pop-up OAuth. Mengalihkan ke login resmi Google...';
    case 'auth/popup-blocked':
      return 'Pop-up diblokir peramban. Mengalihkan ke login resmi Google...';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Masuk dengan Google dibatalkan.';
    case 'auth/network-request-failed':
      return 'Koneksi jaringan terputus. Silakan coba lagi.';
    case 'auth/user-disabled':
      return 'Akun Google ini telah dinonaktifkan.';
    case 'auth/operation-not-allowed':
      return 'Layanan masuk Google belum diaktifkan di Firebase Console.';
    default:
      return err.message || 'Gagal masuk dengan Google.';
  }
}

async function loginWithGoogle() {
  playSoftPop();
  clearAuthAlert();
  purgeLegacyAudreyData();

  // 1. Cek jika protokol file:// (dibuka langsung dari file explorer Windows/Mac tanpa web server)
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    setAuthAlert(
      '<strong>Google Sign-In memerlukan server web (http/https).</strong><br>' +
      'Kebijakan keamanan Google OAuth memblokir login dari file lokal (<code>file:///</code>).<br><br>' +
      '💡 <strong>Solusi:</strong><br>' +
      '1. Buka via link web resmi: <a href="https://artgrocery-ashen.vercel.app" target="_blank" style="color: #BE185D; font-weight: 800; text-decoration: underline;">artgrocery-ashen.vercel.app</a><br>' +
      '2. Atau gunakan opsi <strong>Masuk dengan Email &amp; Kata Sandi</strong> atau <strong>Akun Demo</strong> di bawah.',
      'warning'
    );
    showToast('Buka via web resmi untuk masuk dengan Google 🌐', 'warning');
    return;
  }

  // 2. Deteksi In-App Browser (WhatsApp, Instagram, Facebook, Line, TikTok) yang diblokir oleh Google
  const ua = (typeof navigator !== 'undefined' && (navigator.userAgent || navigator.vendor || window.opera)) || '';
  const isInAppBrowser = /FBAN|FBAV|Instagram|Line|WhatsApp|MicroMessenger/i.test(ua);
  if (isInAppBrowser) {
    setAuthAlert(
      '<strong>Google Sign-In diblokir di peramban internal WhatsApp/Instagram.</strong><br>' +
      'Google melarang autentikasi di dalam in-app browser demi keamanan akun Anda.<br><br>' +
      '💡 <strong>Solusi Mudah:</strong> Ketuk tombol titik tiga (⋮) atau bagikan di pojok atas, lalu pilih <strong>"Buka di Browser"</strong> (Chrome atau Safari) untuk masuk lancar.',
      'warning'
    );
    showToast('Buka di Chrome/Safari untuk masuk dengan Google 🌐', 'warning');
    return;
  }

  // 3. Cek kesiapan Firebase SDK
  if (typeof firebase === 'undefined' || !firebase.auth) {
    setAuthAlert('Layanan Firebase tidak dapat dijangkau. Periksa koneksi internet Anda atau muat ulang halaman.', 'danger');
    showToast('Layanan Firebase tidak terjangkau. Periksa internet Anda.', 'error');
    return;
  }

  // 4. State UI: Kunci tombol & tampilkan status loading untuk mencegah tap ganda (anti-double tap)
  const googleBtn = document.querySelector('.btn-google-auth');
  const googleBtnText = document.getElementById('googleBtnText');
  const originalText = googleBtnText ? googleBtnText.textContent : 'Lanjutkan dengan Google';

  if (googleBtn) {
    googleBtn.disabled = true;
    googleBtn.style.opacity = '0.75';
    googleBtn.style.pointerEvents = 'none';
  }
  if (googleBtnText) {
    googleBtnText.textContent = 'Menghubungkan ke Google... ⏳';
  }

  const restoreBtn = () => {
    if (googleBtn) {
      googleBtn.disabled = false;
      googleBtn.style.opacity = '';
      googleBtn.style.pointerEvents = '';
    }
    if (googleBtnText) {
      googleBtnText.textContent = originalText;
    }
  };

  const provider = (typeof window.initGoogleAuthProvider === 'function')
    ? window.initGoogleAuthProvider(false)
    : new firebase.auth.GoogleAuthProvider();

  if (!provider) {
    restoreBtn();
    showToast('Inisialisasi Google Auth gagal.', 'error');
    return;
  }

  // 5. Pastikan persistensi sesi lokal aktif
  try {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  } catch (persErr) {
    console.warn('Firebase setPersistence notice:', persErr);
  }

  // 6. POPUP-FIRST UNTUK SEMUA PERANGKAT (HP, Laptop & PWA)
  // Popup di event tap langsung TIDAK DIBLOKIR browser HP & kebal dari masalah third-party cookie/Storage Partitioning
  showToast('Menghubungkan ke Google...', 'info');
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    if (result && result.user) {
      result.user.isLiveFirebaseSession = true;
      handleSuccessfulAuth(result.user, 'google', true);
    }
    restoreBtn();
  } catch (popupError) {
    console.warn('Firebase signInWithPopup notice:', popupError);

    // Pengguna membatalkan sendiri jendela pop-up
    if (popupError.code === 'auth/popup-closed-by-user' || popupError.code === 'auth/cancelled-popup-request') {
      showToast('Masuk dengan Google dibatalkan.', 'info');
      restoreBtn();
      return;
    }

    // 7. Fallback otomatis ke signInWithRedirect HANYA jika pop-up diblokir secara ketat
    if (
      popupError.code === 'auth/operation-not-supported-in-this-environment' ||
      popupError.code === 'auth/popup-blocked' ||
      popupError.code === 'auth/internal-error' ||
      (popupError.message && popupError.message.toLowerCase().includes('supported')) ||
      (popupError.message && popupError.message.toLowerCase().includes('popup'))
    ) {
      showToast('Mengalihkan ke halaman masuk resmi Google...', 'info');
      try {
        try { sessionStorage.setItem('pending_google_redirect', 'true'); } catch (e) { }
        await firebase.auth().signInWithRedirect(provider);
      } catch (redirErr) {
        try { sessionStorage.removeItem('pending_google_redirect'); } catch (e) { }
        restoreBtn();
        console.error('Firebase signInWithRedirect fallback error:', redirErr);
        showToast(getAuthErrorMessage(redirErr), 'error');
        setAuthAlert(getAuthErrorMessage(redirErr), 'danger');
      }
      return;
    }

    restoreBtn();
    showToast(getAuthErrorMessage(popupError), 'error');
    setAuthAlert(getAuthErrorMessage(popupError), 'danger');
  }
}

async function syncLocalAccountsToCloud() {
  if (typeof firebase === 'undefined') return;
  try {
    const users = getRegisteredUsers();
    if (AppState.user && AppState.user.email && AppState.user.authProvider === 'email') {
      const exists = users.find(u => u.email.toLowerCase() === AppState.user.email.toLowerCase());
      if (!exists && AppState.user.password) {
        users.push(AppState.user);
      }
    }

    if (!users || users.length === 0) return;

    for (const u of users) {
      if (!u || !u.email) continue;
      const cleanEmail = u.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');

      // 1. Cadangkan ke Cloud Firestore collection 'registered_accounts'
      if (firestoreDb) {
        try {
          await firestoreDb.collection('registered_accounts').doc(cleanEmail).set({
            name: u.name || cleanEmail,
            email: u.email.toLowerCase().trim(),
            password: u.password || '',
            uid: u.uid || getDeterministicUid(u.email, 'usr_'),
            photoURL: u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=E91E63&color=fff&bold=true`,
            authProvider: u.authProvider || 'email',
            lastSynced: new Date().toISOString()
          }, { merge: true });
        } catch (fsErr) {
          console.info('Firestore account backup notice:', fsErr);
        }
      }

      // 2. Daftarkan ke Firebase Auth jika belum terdaftar
      if (firebase.auth && u.password && u.password.length >= 6) {
        try {
          await firebase.auth().createUserWithEmailAndPassword(u.email, u.password);
          console.log('Akun berhasil dicadangkan ke Firebase Auth:', u.email);
        } catch (authErr) {
          // auth/email-already-in-use berarti sudah ada di Firebase Auth
        }
      }
    }
  } catch (err) {
    console.warn('syncLocalAccountsToCloud notice:', err);
  }
}

/**
 * Validasi Format Alamat Email Standar RFC 5322 dengan Cek Domain & TLD Aktif
 * Mencegah email asal-asalan / tidak valid digunakan untuk pendaftaran dan login.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  if (trimmed.length < 6 || trimmed.length > 254) return false;

  // Cek struktur dasar: local-part @ domain-part
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) return false;

  // Tolak titik berturutan atau di samping @
  if (trimmed.includes('..') || trimmed.includes('@.') || trimmed.includes('.@')) return false;

  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  if (!localPart || !domain || localPart.length > 64) return false;

  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;

  // Pastikan Top-Level Domain (TLD) minimal 2 karakter alfabet murni (misal: .com, .id, .sch.id, .org, .net, dll.)
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) return false;

  // Setiap segmen domain tidak boleh kosong, tidak boleh diawali atau diakhiri strip '-'
  for (const seg of domainParts) {
    if (!seg || seg.startsWith('-') || seg.endsWith('-')) return false;
  }

  return true;
}

/**
 * Soroti tombol Google Sign In dengan animasi berdenyut agar pengguna langsung tahu
 * akun mereka harus masuk via Google, bukan ketik manual kata sandi.
 */
function highlightGoogleButton() {
  const googleBtn = document.getElementById('btnGoogleAuth') || document.querySelector('.btn-google-auth');
  if (googleBtn) {
    googleBtn.classList.remove('pulse-highlight');
    void googleBtn.offsetWidth;
    googleBtn.classList.add('pulse-highlight');
    try {
      googleBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (e) { }
    setTimeout(() => {
      if (googleBtn) googleBtn.classList.remove('pulse-highlight');
    }, 4500);
  }
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  clearAuthAlert();

  const nameInput = document.getElementById('authNameInput');
  const emailInput = document.getElementById('authEmailInput');
  const passInput = document.getElementById('authPassInput');

  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const pass = passInput ? passInput.value.trim() : '';
  let name = nameInput ? nameInput.value.trim() : '';

  if (!email || !pass) {
    setAuthAlert('Harap isi alamat email dan kata sandi!', 'warning');
    showToast('Harap isi email dan kata sandi!', 'warning');
    return;
  }

  // Validasi format email secara ketat (mencegah email ngasal)
  if (!isValidEmail(email)) {
    setAuthAlert('Format email tidak valid! Harap gunakan alamat email aktif yang benar (contoh: nama@gmail.com).', 'warning');
    showToast('Format email tidak valid!', 'warning');
    if (emailInput) {
      emailInput.focus();
    }
    return;
  }

  if (pass.length < 6) {
    setAuthAlert('Kata sandi minimal harus 6 karakter!', 'warning');
    showToast('Kata sandi minimal 6 karakter!', 'warning');
    if (passInput) passInput.focus();
    return;
  }

  const cleanEmail = email.replace(/[^a-z0-9]/g, '_');

  if (AppState.authMode === 'signup') {
    // ---------------------------------------------------------------------
    // SIGN UP FLOW (CROSS-DEVICE CLOUD SYNC)
    // ---------------------------------------------------------------------
    if (!name) {
      name = email.split('@')[0];
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    // 1. Cek duplikasi lokal
    const users = getRegisteredUsers();
    const existingLocal = users.find(u => u.email && u.email.toLowerCase() === email);
    if (existingLocal) {
      if (existingLocal.authProvider === 'google' || !existingLocal.password) {
        setAuthAlert(`Email "${email}" sudah terdaftar menggunakan Akun Google. Harap masuk menggunakan tombol "Lanjutkan dengan Google" di atas!`, 'warning');
        showToast('Akun ini terdaftar via Google. Silakan masuk via Google!', 'warning');
        highlightGoogleButton();
      } else {
        setAuthAlert(`Email "${email}" sudah terdaftar! Silakan beralih ke tab "Masuk" untuk login.`, 'warning');
        showToast('Email sudah terdaftar, silakan Masuk', 'warning');
        switchAuthMode('signin');
        if (emailInput) emailInput.value = email;
        if (passInput) {
          passInput.value = '';
          passInput.focus();
        }
      }
      return;
    }

    // 2. Cek duplikasi di Cloud Firestore jika online
    if (firestoreDb) {
      try {
        const docSnap = await firestoreDb.collection('registered_accounts').doc(cleanEmail).get();
        if (docSnap.exists) {
          const remoteUser = docSnap.data();
          if (remoteUser && (remoteUser.authProvider === 'google' || !remoteUser.password)) {
            setAuthAlert(`Email "${email}" sudah terdaftar di Cloud menggunakan Akun Google. Harap masuk menggunakan tombol "Lanjutkan dengan Google" di atas!`, 'warning');
            showToast('Akun ini terdaftar via Google. Silakan masuk via Google!', 'warning');
            highlightGoogleButton();
          } else {
            setAuthAlert(`Email "${email}" sudah terdaftar di Cloud! Silakan beralih ke tab "Masuk" untuk login.`, 'warning');
            showToast('Email sudah terdaftar, silakan Masuk', 'warning');
            switchAuthMode('signin');
            if (emailInput) emailInput.value = email;
            if (passInput) {
              passInput.value = '';
              passInput.focus();
            }
          }
          return;
        }
      } catch (fsErr) {
        console.warn('Firestore duplicate check notice:', fsErr);
      }
    }

    // 3. Daftarkan ke live Firebase Authentication
    let isLive = false;
    let fbUid = null;
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        const cred = await firebase.auth().createUserWithEmailAndPassword(email, pass);
        if (cred && cred.user) {
          isLive = true;
          fbUid = cred.user.uid;
          if (cred.user.updateProfile) {
            await cred.user.updateProfile({ displayName: name });
          }
        }
      } catch (fbErr) {
        console.info('Firebase Auth signup note:', fbErr.code || fbErr.message);
        if (fbErr.code === 'auth/email-already-in-use') {
          setAuthAlert(`Email "${email}" sudah terdaftar di server. Silakan beralih ke tab Masuk.`, 'warning');
          showToast('Email sudah terdaftar di server, silakan Masuk', 'warning');
          switchAuthMode('signin');
          return;
        }
      }
    }

    const uid = fbUid || getDeterministicUid(email, 'usr_');
    const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E91E63&color=fff&bold=true`;

    const newUser = {
      name,
      email,
      password: pass,
      uid,
      photoURL,
      authProvider: 'email',
      isLiveFirebaseSession: isLive,
      createdAt: new Date().toISOString()
    };

    // 4. Simpan ke database pengguna lokal
    users.push(newUser);
    saveRegisteredUsers(users);

    // 5. Simpan ke Cloud Firestore agar langsung tersinkronisasi ke laptop/perangkat lain
    if (firestoreDb) {
      try {
        await firestoreDb.collection('registered_accounts').doc(cleanEmail).set(newUser, { merge: true });
        console.log('Profil akun tersimpan di Cloud Firestore:', cleanEmail);
      } catch (fsErr) {
        console.warn('Gagal menyimpan profil akun ke Firestore:', fsErr);
      }
    }

    AppState.user = {
      name,
      email,
      uid,
      photoURL,
      authProvider: 'email',
      isLiveFirebaseSession: isLive,
      loggedAt: new Date().toISOString()
    };

    // Clean slate for brand-new registered account: empty cart, fresh 100k budget, zero warnings
    AppState.cart = [];
    AppState.receipts = [];
    AppState.pantry = [];
    AppState.budget = 100000;
    AppState.budgetPeriod = 'weekly';
    AppState.routineItems = [];
    AppState.previousSafetyLevel = null;
    localStorage.setItem('grocery_user_initialized_' + uid, 'true');
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem('last_planner_reset_date_' + uid, todayStr);
    localStorage.setItem('last_planner_reset_date', todayStr);

    loadUserIsolatedState(uid);
    AppState.previousSafetyLevel = null;

    const overbudgetBanner = document.getElementById('overbudget-firm-banner');
    if (overbudgetBanner) overbudgetBanner.classList.add('hidden');
    const overbudgetSlimBadge = document.getElementById('overbudget-slim-badge');
    if (overbudgetSlimBadge) overbudgetSlimBadge.style.display = 'none';

    saveLocalState();
    playCelebrationFanfare();
    triggerCuteLoginConfetti();
    checkAuth();
    setupFirestoreListener();
    showToast(`Akun berhasil dibuat! Selamat datang, ${name} ✨`, 'success');
  } else {
    // ---------------------------------------------------------------------
    // SIGN IN FLOW (CROSS-DEVICE CLOUD SUPPORT)
    // ---------------------------------------------------------------------
    let isLive = false;
    let fbUser = null;
    let fbErrorCode = null;

    // 1. Coba login via Firebase Authentication (Server Resmi)
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try {
        const cred = await firebase.auth().signInWithEmailAndPassword(email, pass);
        if (cred && cred.user) {
          isLive = true;
          fbUser = cred.user;
        }
      } catch (fbErr) {
        fbErrorCode = fbErr.code;
        console.info('Firebase Auth signin note:', fbErr.code || fbErr.message);
      }
    }

    // 2. Cek di registri lokal (localStorage)
    const users = getRegisteredUsers();
    let foundUser = users.find(u => u.email && u.email.toLowerCase() === email);

    // 3. Jika belum ada di lokal (misal baru buka di laptop), ambil dari Cloud Firestore!
    if (!foundUser && firestoreDb) {
      try {
        const docSnap = await firestoreDb.collection('registered_accounts').doc(cleanEmail).get();
        if (docSnap.exists) {
          const remoteUser = docSnap.data();
          if (remoteUser && remoteUser.email) {
            foundUser = remoteUser;
            // Cache ke lokal browser agar berikutnya instan
            users.push(remoteUser);
            saveRegisteredUsers(users);
            console.log('Akun berhasil diunduh dari Cloud Firestore ke perangkat ini:', cleanEmail);
          }
        }
      } catch (fsErr) {
        console.warn('Gagal mengambil profil akun dari Firestore:', fsErr);
      }
    }

    // 4. Validasi Akun Google vs Akun Email/Password Manual
    if (foundUser) {
      // PERLINDUNGAN UTAMA: Jika akun terdaftar via Google (tidak memiliki password manual lokal/server)
      if (foundUser.authProvider === 'google' || !foundUser.password) {
        setAuthAlert(`Email "${email}" terdaftar menggunakan Akun Google. Harap masuk dengan mengetuk tombol "Lanjutkan dengan Google" di atas!`, 'warning');
        showToast('Akun ini terdaftar via Google. Silakan masuk via Google!', 'warning');
        highlightGoogleButton();
        if (passInput) passInput.value = '';
        return;
      }

      // Validasi kata sandi untuk akun email/password biasa
      if (foundUser.password !== pass) {
        setAuthAlert('Kata sandi yang Anda masukkan salah. Silakan periksa kembali kata sandi Anda!', 'danger');
        showToast('Kata sandi salah!', 'danger');
        if (passInput) {
          passInput.value = '';
          passInput.focus();
        }
        return;
      }

      // Jika belum aktif di Firebase Auth, sinkronkan secara seamless
      if (!isLive && typeof firebase !== 'undefined' && firebase.auth && pass && pass.length >= 6) {
        try {
          const cred = await firebase.auth().createUserWithEmailAndPassword(email, pass);
          if (cred && cred.user) isLive = true;
        } catch (e) {
          if (e.code === 'auth/email-already-in-use') {
            try {
              const cred = await firebase.auth().signInWithEmailAndPassword(email, pass);
              if (cred && cred.user) isLive = true;
            } catch (e2) { }
          }
        }
      }

      AppState.user = {
        name: foundUser.name,
        email: foundUser.email,
        uid: foundUser.uid || getDeterministicUid(foundUser.email, 'usr_'),
        photoURL: foundUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(foundUser.name)}&background=E91E63&color=fff&bold=true`,
        authProvider: 'email',
        isLiveFirebaseSession: isLive,
        loggedAt: new Date().toISOString()
      };

      loadUserIsolatedState(AppState.user.uid);
      saveLocalState();
      playCelebrationFanfare();
      triggerCuteLoginConfetti();
      checkAuth();
      setupFirestoreListener();
      showToast(`Selamat datang kembali, ${foundUser.name}! ✨`, 'success');
      return;
    }

    // Jika kata sandi salah dari Firebase Auth
    if (fbErrorCode === 'auth/wrong-password' || fbErrorCode === 'auth/invalid-credential') {
      setAuthAlert('Kata sandi yang Anda masukkan salah. Silakan periksa kembali kata sandi Anda!', 'danger');
      showToast('Kata sandi salah!', 'danger');
      if (passInput) {
        passInput.value = '';
        passInput.focus();
      }
      return;
    }

    if (fbUser) {
      fbUser.isLiveFirebaseSession = true;
      handleSuccessfulAuth(fbUser, 'email', true);
      return;
    }

    // Pengguna tidak ditemukan di manapun
    setAuthAlert(`Email "${email}" belum terdaftar! Silakan pilih tab "Daftar" untuk membuat akun baru.`, 'warning');
    showToast('Email belum terdaftar. Silakan buat akun baru!', 'warning');
    if (emailInput) emailInput.focus();
  }
}

// =========================================================================
// 6b. PASSWORD VISIBILITY TOGGLE (SHOW / HIDE PASSWORD WITH EYE ICON)
// =========================================================================
function togglePasswordVisibility(inputId = 'authPassInput', btnId = 'btnToggleAuthPass') {
  if (typeof playSoftPop === 'function') {
    playSoftPop();
  }
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input) return;

  const isPassword = (input.type === 'password');
  input.type = isPassword ? 'text' : 'password';

  if (btn) {
    const openIcon = btn.querySelector('.eye-open');
    const closedIcon = btn.querySelector('.eye-closed');
    if (openIcon && closedIcon) {
      openIcon.style.display = isPassword ? 'none' : 'block';
      closedIcon.style.display = isPassword ? 'block' : 'none';
    }
    const label = isPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi';
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }
}

function loginDemoAccount() {
  clearAuthAlert();
  const demoUid = 'demo_user_101';
  AppState.user = {
    name: 'Akun Demo',
    email: 'demo@smartgrocery.app',
    photoURL: '',
    uid: demoUid,
    authProvider: 'demo',
    isLiveFirebaseSession: false,
    loggedAt: new Date().toISOString()
  };
  loadUserIsolatedState(demoUid);
  saveLocalState();
  playCelebrationFanfare();
  triggerCuteLoginConfetti();
  checkAuth();
  setupFirestoreListener();
  showToast('Masuk dengan Akun Demo ✨', 'success');
}

function promptLogout(notify = true) {
  hidePwaInstallBanner();
  // Requirement 3: Stop onSnapshot listener upon logout
  if (unsubscribeFirestore) {
    try { unsubscribeFirestore(); } catch (e) { }
    unsubscribeFirestore = null;
  }
  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      firebase.auth().signOut();
    } catch (e) { }
  }
  AppState.user = null;
  localStorage.removeItem(STORAGE_KEYS.USER);
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith('smart_grocery_user')) {
        localStorage.removeItem(k);
      }
    }
  } catch (e) { }

  // Purge global cart, receipts, pantry, and budget so no residual items linger
  try {
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.RECEIPTS);
    localStorage.removeItem(STORAGE_KEYS.PANTRY);
    localStorage.removeItem(STORAGE_KEYS.BUDGET);
    localStorage.removeItem(STORAGE_KEYS.BUDGET_PERIOD);
    localStorage.removeItem('grocery_cart_guest');
    localStorage.removeItem('grocery_receipts_guest');
    localStorage.removeItem('grocery_pantry_guest');
    localStorage.removeItem('grocery_budget_guest');
  } catch (e) { }

  // Reset active UI state cleanly
  AppState.cart = [];
  AppState.receipts = [];
  AppState.pantry = [];
  AppState.budget = 100000;
  AppState.budgetPeriod = 'weekly';
  AppState.inStoreMode = false;
  AppState.previousSafetyLevel = null;

  // Immediately hide any overbudget alert banners
  const overbudgetBanner = document.getElementById('overbudget-firm-banner');
  if (overbudgetBanner) overbudgetBanner.classList.add('hidden');
  const overbudgetSlimBadge = document.getElementById('overbudget-slim-badge');
  if (overbudgetSlimBadge) overbudgetSlimBadge.style.display = 'none';

  renderAll();
  checkAuth();
  updateCloudSyncUI('offline', 'Mode Offline (Belum Masuk)');

  if (notify) {
    showToast('Anda telah keluar akun', 'info');
  }
}

function updateHeaderAvatar(photoURL) {
  const avatarImg = document.getElementById('headerUserAvatar');
  const fallback = document.getElementById('headerUserAvatarFallback');
  if (!avatarImg || !fallback) return;

  if (photoURL && typeof photoURL === 'string' && photoURL.trim().length > 0) {
    avatarImg.src = photoURL.trim();
    avatarImg.style.setProperty('display', 'inline-block', 'important');
    avatarImg.classList.remove('hidden');
    avatarImg.removeAttribute('hidden');

    fallback.style.setProperty('display', 'none', 'important');
    fallback.classList.add('hidden');
    fallback.setAttribute('hidden', 'true');
  } else {
    avatarImg.style.setProperty('display', 'none', 'important');
    avatarImg.classList.add('hidden');
    avatarImg.setAttribute('hidden', 'true');

    fallback.style.setProperty('display', 'inline-flex', 'important');
    fallback.classList.remove('hidden');
    fallback.removeAttribute('hidden');
  }
}

function updateModalAvatar(photoURL) {
  const avatarImg = document.getElementById('modalUserAvatar');
  const fallback = document.getElementById('modalUserAvatarFallback');
  if (!avatarImg || !fallback) return;

  if (photoURL && typeof photoURL === 'string' && photoURL.trim().length > 0) {
    avatarImg.src = photoURL.trim();
    avatarImg.style.setProperty('display', 'block', 'important');
    avatarImg.classList.remove('hidden');
    avatarImg.removeAttribute('hidden');

    fallback.style.setProperty('display', 'none', 'important');
    fallback.classList.add('hidden');
    fallback.setAttribute('hidden', 'true');
  } else {
    avatarImg.style.setProperty('display', 'none', 'important');
    avatarImg.classList.add('hidden');
    avatarImg.setAttribute('hidden', 'true');

    fallback.style.setProperty('display', 'flex', 'important');
    fallback.classList.remove('hidden');
    fallback.removeAttribute('hidden');
  }
}

function handleHeaderAvatarError() {
  updateHeaderAvatar(null);
}

function handleModalAvatarError() {
  updateModalAvatar(null);
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
    if (headerName) headerName.textContent = AppState.user.name;
    if (headerEmail) headerEmail.textContent = AppState.user.email || 'user@email.com';

    // Check custom saved avatar first (uploaded photo or kawaii preset)
    try {
      const customAvatar = localStorage.getItem('smart_grocery_custom_avatar_' + (AppState.user.uid || 'guest')) ||
                           localStorage.getItem('smart_grocery_custom_avatar_guest');
      if (customAvatar) {
        AppState.user.photoURL = customAvatar;
        AppState.user.photo = customAvatar;
      }
    } catch (e) {
      console.warn('Custom avatar localStorage read error:', e);
    }

    const userPhoto = AppState.user && (AppState.user.photoURL || AppState.user.photo);
    updateHeaderAvatar(userPhoto);

    const modalName = document.getElementById('modalUserName');
    const modalEmail = document.getElementById('modalUserEmail');
    if (modalName) modalName.textContent = AppState.user.name;
    if (modalEmail) modalEmail.textContent = AppState.user.email || 'user@email.com';
    updateModalAvatar(userPhoto);

    const syncName = document.getElementById('syncUserAccountName');
    const syncEmail = document.getElementById('syncUserAccountEmail');
    const syncAvatar = document.getElementById('syncUserAccountAvatar');
    if (syncName) syncName.textContent = AppState.user.name;
    if (syncEmail) syncEmail.textContent = AppState.user.email || 'user@email.com';
    if (syncAvatar) {
      if (userPhoto && (userPhoto.startsWith('http') || userPhoto.startsWith('data:image'))) {
        syncAvatar.innerHTML = `<img src="${userPhoto}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
      } else {
        syncAvatar.textContent = userPhoto || '👤';
      }
    }

    // Update personalized greeting based on user name
    if (typeof updateDashboardGreeting === 'function') {
      updateDashboardGreeting();
    }

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

// =========================================================================
// CUSTOM IN-APP SUPERMARKET / STORE PICKER POPUP MODAL & USER PREFERENCES
// =========================================================================
const PRESET_SUPERMARKETS = [
  { name: 'Lotte Mart Grocery - Puri Indah', icon: '🏬', tag: 'Supermarket Lengkap • Puri Indah' },
  { name: 'Superindo - Kebon Jeruk', icon: '🛒', tag: 'Produk Segar & Promo Harian • Kebon Jeruk' },
  { name: 'Grand Lucky - SCBD', icon: '✨', tag: 'Supermarket Premium & Impor • SCBD' },
  { name: 'Hypermart - Puri Mall', icon: '🛍️', tag: 'Kebutuhan Rumah Tangga Lengkap • Puri Mall' },
  { name: 'Alfamart / Indomaret', icon: '🏪', tag: 'Minimarket Terdekat • Belanja Praktis' },
  { name: 'Pasar Tradisional / Pasar Basah', icon: '🧺', tag: 'Bahan Dapur Segar & Ekonomis' }
];

function getStoreIcon(storeName) {
  if (!storeName) return '🏬';
  const s = storeName.toLowerCase();
  if (s.includes('lotte')) return '🛒';
  if (s.includes('superindo')) return '🦁';
  if (s.includes('grand lucky')) return '🍀';
  if (s.includes('hypermart')) return '🛍️';
  if (s.includes('alfa') || s.includes('indo')) return '🏪';
  if (s.includes('pasar')) return '🥬';
  if (s.includes('toko') || s.includes('warung')) return '🏡';
  return '🏬';
}

function saveUserStorePreference(storeName) {
  if (!storeName) return;
  const cleanName = storeName.trim().replace(/\s+/g, ' ').replace(/[<>]/g, '');
  if (cleanName.length < 2 || !/[a-zA-Z0-9]/.test(cleanName)) return;

  if (!Array.isArray(AppState.userStores)) AppState.userStores = [];
  const existingIdx = AppState.userStores.findIndex(s => s.toLowerCase() === cleanName.toLowerCase());
  if (existingIdx !== -1) {
    AppState.userStores.splice(existingIdx, 1);
  }
  AppState.userStores.unshift(cleanName);
  if (AppState.userStores.length > 30) {
    AppState.userStores = AppState.userStores.slice(0, 30);
  }
  saveLocalState();
  pushStateToCloud();
}

function deleteUserStore(storeName, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  if (!storeName || !Array.isArray(AppState.userStores)) return;

  const target = storeName.trim().toLowerCase();
  AppState.userStores = AppState.userStores.filter(s => s.trim().toLowerCase() !== target);

  // If deleted store was the active store, fall back to next available or default
  if (AppState.currentStore && AppState.currentStore.trim().toLowerCase() === target) {
    AppState.currentStore = AppState.userStores.length > 0 ? AppState.userStores[0] : 'Lotte Mart Grocery - Puri Indah';
    const dispPlanner = document.getElementById('session-store-display');
    if (dispPlanner) dispPlanner.textContent = AppState.currentStore;
    const dispCart = document.getElementById('cartCurrentStoreDisplay');
    if (dispCart) dispCart.textContent = AppState.currentStore;
  }

  saveLocalState();
  pushStateToCloud();
  const searchVal = document.getElementById('storePickerSearchInput')?.value || '';
  renderStorePickerList(searchVal);
  showToast(`Lokasi "${storeName}" dihapus dari riwayat akun Anda.`, 'info');
}

function renderQuickUserStoreBar() {
  // Sistem 1-klik di header ditiadakan sesuai preferensi tampilan bersih
}

function renderUserSavedStoresChips() {
  // Sistem 1-klik di modal ditiadakan sesuai preferensi tampilan bersih
}

function openStorePickerModal() {
  const modal = document.getElementById('storePickerModal');
  const searchInput = document.getElementById('storePickerSearchInput');
  const customInput = document.getElementById('storePickerCustomInput');
  if (searchInput) searchInput.value = '';
  if (customInput) customInput.value = '';

  renderStorePickerList('');
  if (modal) {
    modal.classList.add('active', 'show');
    SoundEngine.play('modal_open');
  }
  if (searchInput) {
    setTimeout(() => searchInput.focus(), 150);
  }
}

function closeStorePickerModal() {
  const modal = document.getElementById('storePickerModal');
  if (modal) {
    modal.classList.remove('active', 'show');
    SoundEngine.play('modal_close');
  }
}

function renderStorePickerList(query = '') {
  const container = document.getElementById('storePickerList');
  if (!container) return;

  const q = (query || '').trim().toLowerCase();

  // Deduplicated map of known stores (user stores first, then presets, then receipts)
  const knownStoresMap = new Map();

  if (Array.isArray(AppState.userStores)) {
    AppState.userStores.forEach(s => {
      if (s && s.trim()) {
        const clean = s.trim();
        const isPreset = PRESET_SUPERMARKETS.some(p => p.name.toLowerCase() === clean.toLowerCase());
        knownStoresMap.set(clean.toLowerCase(), {
          name: clean,
          icon: getStoreIcon(clean),
          tag: isPreset ? (PRESET_SUPERMARKETS.find(p => p.name.toLowerCase() === clean.toLowerCase())?.tag || 'Supermarket') : 'Lokasi Riwayat Tersimpan 📍',
          isUserSaved: !isPreset
        });
      }
    });
  }

  PRESET_SUPERMARKETS.forEach(s => {
    if (!knownStoresMap.has(s.name.toLowerCase())) {
      knownStoresMap.set(s.name.toLowerCase(), { ...s, isUserSaved: false });
    }
  });

  if (AppState.currentStore && !knownStoresMap.has(AppState.currentStore.toLowerCase())) {
    knownStoresMap.set(AppState.currentStore.toLowerCase(), {
      name: AppState.currentStore,
      icon: getStoreIcon(AppState.currentStore),
      tag: 'Toko Pilihan Anda',
      isUserSaved: true
    });
  }

  if (Array.isArray(AppState.receipts)) {
    AppState.receipts.forEach(r => {
      if (r.store && !knownStoresMap.has(r.store.toLowerCase())) {
        knownStoresMap.set(r.store.toLowerCase(), {
          name: r.store,
          icon: '🧾',
          tag: 'Dari Riwayat Struk',
          isUserSaved: false
        });
      }
    });
  }

  let storeList = Array.from(knownStoresMap.values());
  if (q) {
    storeList = storeList.filter(s => s.name.toLowerCase().includes(q) || (s.tag && s.tag.toLowerCase().includes(q)));
  }

  let html = '';

  // If query does not match any existing store, offer quick "Add new store" button
  if (q && !storeList.some(s => s.name.toLowerCase() === q)) {
    const rawVal = query.trim().replace(/\s+/g, ' ').replace(/[<>]/g, '');
    html += `
      <div class="store-picker-item store-picker-item-new" onclick="selectStoreFromPicker('${escapeHtml(rawVal)}')">
        <div class="store-picker-item-left">
          <div class="store-picker-item-icon">➕</div>
          <div class="store-picker-item-info">
            <span class="store-picker-item-name">Gunakan "${escapeHtml(rawVal)}"</span>
            <span class="store-picker-item-desc">Simpan sebagai lokasi baru akun Anda</span>
          </div>
        </div>
        <span class="store-picker-item-badge" style="background: #E8F5E9; color: #2E7D32; border-color: #C8E6C9;">Pilih ➔</span>
      </div>
    `;
  }

  if (storeList.length === 0 && !q) {
    html = '<div style="text-align: center; padding: 20px; font-size: 0.8rem; color: #757575;">Belum ada daftar supermarket.</div>';
  } else {
    html += storeList.map(s => {
      const isSelected = (AppState.currentStore || '').trim().toLowerCase() === s.name.trim().toLowerCase();
      return `
        <div class="store-picker-item ${isSelected ? 'active' : ''}" onclick="selectStoreFromPicker('${escapeHtml(s.name)}')">
          <div class="store-picker-item-left">
            <div class="store-picker-item-icon">${s.icon || '🏬'}</div>
            <div class="store-picker-item-info">
              <span class="store-picker-item-name">${escapeHtml(s.name)}</span>
              <span class="store-picker-item-desc">${escapeHtml(s.tag || 'Supermarket')}</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            ${s.isUserSaved ? `
              <button type="button" class="btn-store-del touch-target" onclick="deleteUserStore('${escapeHtml(s.name)}', event)" title="Hapus dari riwayat lokasi Anda">
                ✕
              </button>
            ` : ''}
            ${isSelected ? `
              <span class="store-picker-item-badge">
                <span>✓</span>
                <span>Terpilih</span>
              </span>
            ` : `
              <span style="font-size: 14px; color: #94A3B8; margin-left: 4px;">➔</span>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  container.innerHTML = html;
}

function handleStorePickerSearch(val) {
  renderStorePickerList(val);
}

function submitCustomStorePicker() {
  const searchInput = document.getElementById('storePickerSearchInput');
  if (searchInput && searchInput.value.trim()) {
    selectStoreFromPicker(searchInput.value.trim());
  }
}

function handleCustomStoreSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const customInput = document.getElementById('storePickerCustomInput');
  if (!customInput) return;
  const val = customInput.value.trim().replace(/\s+/g, ' ').replace(/[<>]/g, '');
  if (!val || val.length < 2) {
    showToast('Ketik nama supermarket minimal 2 huruf!', 'warning');
    customInput.focus();
    return;
  }
  selectStoreFromPicker(val);
}

function selectStoreFromPicker(storeName) {
  if (!storeName) return;
  const val = storeName.trim().replace(/\s+/g, ' ').replace(/[<>]/g, '');
  if (val.length < 2) {
    showToast('Nama toko terlalu pendek!', 'warning');
    return;
  }

  const isAlreadyActive = (AppState.currentStore || '').trim().toLowerCase() === val.toLowerCase();
  AppState.currentStore = val;
  saveUserStorePreference(val);

  // Sync to fallback select and display elements
  const select = document.getElementById('session-store-select');
  if (select) {
    let opt = Array.from(select.options).find(o => o.value.toLowerCase() === val.toLowerCase());
    if (!opt) {
      opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val;
      select.insertBefore(opt, select.firstChild);
    }
    select.value = val;
  }

  const dispPlanner = document.getElementById('session-store-display');
  if (dispPlanner) dispPlanner.textContent = val;

  const dispCart = document.getElementById('cartCurrentStoreDisplay');
  if (dispCart) dispCart.textContent = val;

  // Update store attribute for active cart items
  AppState.cart.forEach(item => { item.store = val; });

  saveLocalState();
  pushStateToCloud();
  renderItems();
  renderCartSection();

  playCalmChime();
  if (!isAlreadyActive) {
    showToast(`Lokasi belanja diatur ke "${val}" 🏬`, 'success');
  }
  closeStorePickerModal();
}

// =========================================================================
// CUSTOM IN-APP ITEM PICKER MODAL & AUTOCOMPLETE (IDENTIK DENGAN STORE PICKER)
// =========================================================================
function getAllItemOptions() {
  const itemMap = new Map();

  // 0. Koleksi Kustom Akun Pengguna (User-Isolated Custom Items)
  if (AppState && Array.isArray(AppState.userCustomItems)) {
    AppState.userCustomItems.forEach(ci => {
      const key = (ci.name || '').toLowerCase();
      if (key && !itemMap.has(key)) {
        itemMap.set(key, {
          name: ci.name,
          icon: ci.icon || getCategoryIcon(ci.category) || '⭐',
          category: ci.category || 'Koleksi Saya',
          unit: ci.unit || 'pcs',
          price: ci.price || 0,
          tag: 'Koleksi Akun Anda ⭐',
          isUserCustom: true
        });
      }
    });
  }

  // 1. Dari PRODUCT_CATALOG
  if (typeof PRODUCT_CATALOG !== 'undefined' && Array.isArray(PRODUCT_CATALOG)) {
    PRODUCT_CATALOG.forEach(p => {
      if (p.name) {
        itemMap.set(p.name.toLowerCase(), {
          name: p.name,
          icon: p.icon || '🛒',
          category: p.aisle || p.category || 'Bahan Pokok',
          unit: p.unit || 'pcs',
          price: p.price || 0,
          tag: 'Katalog Pilihan'
        });
      }
    });
  }

  // 2. Dari DEFAULT_ROUTINE_ITEMS
  if (typeof DEFAULT_ROUTINE_ITEMS !== 'undefined' && Array.isArray(DEFAULT_ROUTINE_ITEMS)) {
    DEFAULT_ROUTINE_ITEMS.forEach(r => {
      const key = (r.namaBarang || r.name || '').toLowerCase();
      if (key && !itemMap.has(key)) {
        itemMap.set(key, {
          name: r.namaBarang || r.name,
          icon: '🔁',
          category: r.kategori || 'Bahan Pokok',
          unit: r.satuan || 'pcs',
          price: r.hargaSatuan || 0,
          tag: 'Rutin Harian'
        });
      }
    });
  }

  // 3. Dari AppState.priceHistory (Riwayat Belanja Pengguna)
  if (AppState && AppState.priceHistory && typeof AppState.priceHistory === 'object') {
    Object.keys(AppState.priceHistory).forEach(name => {
      const hist = AppState.priceHistory[name];
      const key = name.toLowerCase();
      if (key && !itemMap.has(key)) {
        itemMap.set(key, {
          name: name,
          icon: '🧾',
          category: (hist && hist.kategori) || 'Bahan Pokok',
          unit: (hist && hist.satuan) || 'pcs',
          price: (hist && hist.harga) || 0,
          tag: 'Riwayat Toko'
        });
      }
    });
  }

  // 4. Preset tambahan bawaan yang populer
  const defaultPresets = [
    { name: 'Beras Rojolele', icon: '🌾', category: 'Bahan Pokok', unit: 'karung/5kg', price: 74000, tag: 'Bahan Pokok' },
    { name: 'Minyak Goreng 2L', icon: '🍳', category: 'Bahan Pokok', unit: 'pouch/2L', price: 38000, tag: 'Bahan Pokok' },
    { name: 'Telur 1kg', icon: '🥚', category: 'Bahan Pokok', unit: 'kg', price: 28000, tag: 'Bahan Pokok' },
    { name: 'Garam 500g', icon: '🧂', category: 'Pantry', unit: 'pcs', price: 5000, tag: 'Bumbu Dapur' },
    { name: 'Wajan', icon: '🍳', category: 'Peralatan', unit: 'pcs', price: 65000, tag: 'Peralatan Dapur' },
    { name: 'Sabun Cuci', icon: '🧼', category: 'Kebersihan & Rumah', unit: 'pcs', price: 15000, tag: 'Kebersihan' },
    { name: 'Minyak Goreng', icon: '🍳', category: 'Bahan Pokok', unit: 'liter', price: 18000, tag: 'Bahan Pokok' },
    { name: 'Beras 5kg', icon: '🌾', category: 'Bahan Pokok', unit: 'karung/5kg', price: 60000, tag: 'Bahan Pokok' },
    { name: 'Sabun Mandi', icon: '🧼', category: 'Perlengkapan Mandi', unit: 'pcs', price: 8000, tag: 'Mandi' },
    { name: 'Telur Ayam 1kg', icon: '🥚', category: 'Bahan Pokok', unit: 'kg', price: 28000, tag: 'Bahan Pokok' },
    { name: 'Susu UHT 1L', icon: '🥛', category: 'Dairy', unit: 'karton', price: 19500, tag: 'Minuman' },
    { name: 'Mi Instan Dus', icon: '🍜', category: 'Makanan', unit: 'dus', price: 115000, tag: 'Sembako' },
    { name: 'Tepung Terigu', icon: '🍞', category: 'Pantry', unit: 'kg', price: 13000, tag: 'Bahan Pokok' }
  ];

  defaultPresets.forEach(dp => {
    const key = dp.name.toLowerCase();
    if (!itemMap.has(key)) {
      itemMap.set(key, dp);
    }
  });

  return Array.from(itemMap.values());
}

function openItemPickerModal() {
  const modal = document.getElementById('itemPickerModal');
  const searchInput = document.getElementById('itemPickerSearchInput');
  const customInput = document.getElementById('itemPickerCustomInput');
  if (searchInput) searchInput.value = '';
  if (customInput) customInput.value = '';

  renderItemPickerList('');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active', 'show');
  }
  if (searchInput) {
    setTimeout(() => searchInput.focus(), 150);
  }
}

function closeItemPickerModal() {
  const modal = document.getElementById('itemPickerModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active', 'show');
  }
}

function renderItemPickerList(query = '') {
  const container = document.getElementById('itemPickerList');
  const countBadge = document.getElementById('itemPickerCountBadge');
  if (countBadge) {
    countBadge.remove(); // Hapus badge count agar tidak memotong teks dan tidak memenuhi baris
  }
  if (!container) return;

  const q = (query || '').trim().toLowerCase();
  const allItems = getAllItemOptions();

  let filtered = allItems;
  if (q) {
    filtered = allItems.filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.tag && item.tag.toLowerCase().includes(q))
    );
  }

  let html = '';

  // Jika pencarian tidak ada di daftar, tampilkan opsi 1-tap "Gunakan [Nama Baru]"
  if (q && !filtered.some(i => i.name.toLowerCase() === q)) {
    const rawVal = query.trim();
    html += `
      <div class="store-picker-item store-picker-item-new item-picker-clean-row" onclick="selectItemFromPicker('${escapeHtml(rawVal)}')">
        <div class="store-picker-item-info" style="flex: 1; min-width: 0; text-align: left;">
          <div class="store-picker-item-name" style="font-size: 13.5px; font-weight: 700; line-height: 1.3; margin-bottom: 2px;">Gunakan "${escapeHtml(rawVal)}"</div>
          <div class="store-picker-item-desc" style="font-size: 11.5px; line-height: 1.25;">Pilih sebagai nama barang baru</div>
        </div>
        <span class="store-picker-item-badge" style="background: #E8F5E9; color: #2E7D32; border-color: #C8E6C9; flex-shrink: 0; margin-left: 10px;">Pilih ➔</span>
      </div>
    `;
  }

  if (filtered.length === 0 && !q) {
    html = '<div style="text-align: center; padding: 20px; font-size: 0.8rem; color: var(--text-subtle);">Belum ada opsi barang.</div>';
  } else {
    html += filtered.map(item => {
      const currentVal = (document.getElementById('detailInputName') ? document.getElementById('detailInputName').value : '').trim().toLowerCase();
      const isSelected = currentVal === item.name.toLowerCase();
      const priceText = item.price > 0 ? formatRupiah(item.price) : '';

      return `
        <div class="store-picker-item item-picker-clean-row ${isSelected ? 'active' : ''}" onclick="selectItemFromPicker('${escapeHtml(item.name)}')">
          <div class="store-picker-item-info" style="flex: 1; min-width: 0; text-align: left;">
            <div class="store-picker-item-name" style="font-size: 13.5px; font-weight: 700; line-height: 1.3; margin-bottom: 2px;">${escapeHtml(item.name)}</div>
            <div class="store-picker-item-desc" style="font-size: 11.5px; line-height: 1.25;">${escapeHtml(item.category || 'Bahan Pokok')}${item.unit ? ' • ' + escapeHtml(item.unit) : ''}</div>
          </div>
          ${priceText ? `<span class="store-picker-item-badge" style="flex-shrink: 0; margin-left: 10px;">${priceText}</span>` : `<span class="store-picker-item-arrow" style="font-size: 14px; color: #94A3B8; margin-left: 8px; flex-shrink: 0;">➔</span>`}
        </div>
      `;
    }).join('');
  }

  container.innerHTML = html;
}

function handleItemPickerSearch(val) {
  renderItemPickerList(val);
}

function submitCustomItemPicker() {
  const searchInput = document.getElementById('itemPickerSearchInput');
  if (searchInput && searchInput.value.trim()) {
    selectItemFromPicker(searchInput.value.trim());
  }
}

function handleCustomItemPickerSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('itemPickerCustomInput');
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    showToast('Ketik nama barang terlebih dahulu!', 'warning');
    input.focus();
    return;
  }
  selectItemFromPicker(val);
}

function selectItemFromPicker(itemName) {
  if (!itemName) return;
  const nameInput = document.getElementById('detailInputName');
  if (nameInput) {
    nameInput.value = itemName;
  }

  // Auto-populate kategori, satuan unit, dan harga jika tersedia di opsi/katalog
  const allItems = getAllItemOptions();
  const matched = allItems.find(i => i.name.toLowerCase() === itemName.toLowerCase());
  if (matched) {
    const categoryEl = document.getElementById('detailInputCategory');
    const unitEl = document.getElementById('detailInputUnit');
    const priceEl = document.getElementById('detailInputPrice');

    if (matched.category) {
      syncCategoryDropdownOptions(matched.category);
      if (categoryEl) categoryEl.value = matched.category;
    }
    if (matched.unit && unitEl) {
      for (let opt of unitEl.options) {
        if (opt.value.toLowerCase() === matched.unit.toLowerCase()) {
          unitEl.value = opt.value;
          break;
        }
      }
    }
    if (matched.price > 0 && priceEl && (!priceEl.value || parseFloat(priceEl.value) === 0)) {
      priceEl.value = matched.price;
    }
  }

  handleDetailNameInput(itemName);
  closeItemPickerModal();
  hideCustomItemSuggestions();
}

function handleDetailNameFocus() {
  const input = document.getElementById('detailInputName');
  if (input && input.value.trim().length > 0) {
    showCustomItemSuggestions(input.value);
  }
}

function showCustomItemSuggestions(query = '') {
  const dropdown = document.getElementById('customItemSuggestionsDropdown');
  if (!dropdown) return;

  const q = (query || '').trim().toLowerCase();
  const allItems = getAllItemOptions();

  let filtered = allItems;
  if (q) {
    filtered = allItems.filter(i => i.name.toLowerCase().includes(q) || (i.category && i.category.toLowerCase().includes(q)));
  }

  // Tampilkan maksimal 5 saran cepat
  const topSuggestions = filtered.slice(0, 5);

  if (topSuggestions.length === 0 && !q) {
    dropdown.style.display = 'none';
    return;
  }

  let html = '';
  if (topSuggestions.length === 0) {
    html = `
      <div style="padding: 10px; text-align: center; font-size: 11.5px; color: var(--text-subtle);">
        Tidak ada rekomendasi yang persis.
      </div>
      <div class="custom-suggestion-more" onclick="openItemPickerModal()">
        <span>🔍 Buka Menu Pemilihan Lengkap (Katalog) ➔</span>
      </div>
    `;
  } else {
    html = topSuggestions.map(item => `
      <div class="custom-suggestion-item" onclick="selectItemFromPicker('${escapeHtml(item.name)}')">
        <div class="custom-suggestion-item-left" style="flex: 1; min-width: 0;">
          <div class="custom-suggestion-info">
            <span class="custom-suggestion-name">${escapeHtml(item.name)}</span>
            <span class="custom-suggestion-desc">${escapeHtml(item.category || 'Bahan Pokok')}</span>
          </div>
        </div>
        ${item.price > 0 ? `<span class="custom-suggestion-badge">${formatRupiah(item.price)}</span>` : '<span style="font-size: 11px; color: #94A3B8;">➔</span>'}
      </div>
    `).join('');

    html += `
      <div class="custom-suggestion-more touch-target" onclick="openItemPickerModal()">
        <span>📋 Buka Katalog Rekomendasi Lengkap (${allItems.length} barang) ➔</span>
      </div>
    `;
  }

  dropdown.innerHTML = html;
  dropdown.style.display = 'block';
}

function hideCustomItemSuggestions() {
  const dropdown = document.getElementById('customItemSuggestionsDropdown');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
}

// Tutup dropdown in-app saat klik di luar
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('customItemSuggestionsDropdown');
  const input = document.getElementById('detailInputName');
  if (dropdown && dropdown.style.display !== 'none') {
    if (!dropdown.contains(e.target) && e.target !== input) {
      dropdown.style.display = 'none';
    }
  }
});

function renderSessionControls() {
  const storeSelect = document.getElementById('session-store-select');
  const storeDisplay = document.getElementById('session-store-display');
  const cartStoreDisplay = document.getElementById('cartCurrentStoreDisplay');
  const datePicker = document.getElementById('session-date-picker');
  const customStoreInput = document.getElementById('custom-store-input');
  const dateHint = document.getElementById('sessionDateHint');

  if (datePicker) datePicker.value = AppState.currentDate;
  if (dateHint) {
    const today = new Date().toISOString().split('T')[0];
    dateHint.textContent = (AppState.currentDate === today) ? 'Hari Ini 🌿' : 'Jadwal 🗓️';
  }
  if (storeDisplay) storeDisplay.textContent = AppState.currentStore;
  if (cartStoreDisplay) cartStoreDisplay.textContent = AppState.currentStore;

  if (storeSelect) {
    const knownValues = storeSelect.options ? Array.from(storeSelect.options).map(o => o.value) : [];
    if (!knownValues.includes(AppState.currentStore)) {
      const opt = document.createElement('option');
      opt.value = AppState.currentStore;
      opt.textContent = AppState.currentStore;
      storeSelect.insertBefore(opt, storeSelect.firstChild);
    }
    storeSelect.value = AppState.currentStore;
  }
}

function handleStoreChange(val) {
  if (val === 'custom') {
    openStorePickerModal();
    return;
  }
  selectStoreFromPicker(val);
}

function toggleCustomStoreInput() {
  openStorePickerModal();
}

function saveCustomStoreInput() {
  const input = document.getElementById('custom-store-input');
  if (!input) {
    openStorePickerModal();
    return;
  }
  const val = input.value.trim();
  if (!val) {
    showToast('Nama toko tidak boleh kosong!', 'warning');
    input.focus();
    return;
  }
  selectStoreFromPicker(val);
  const wrap = document.getElementById('custom-store-wrap');
  if (wrap) wrap.style.display = 'none';
}

function cancelCustomStoreInput() {
  const wrap = document.getElementById('custom-store-wrap');
  if (wrap) wrap.style.display = 'none';
}

function handleDateChange(val) {
  if (!val) return;
  AppState.currentDate = val;
  const dateHint = document.getElementById('sessionDateHint');
  if (dateHint) {
    const today = new Date().toISOString().split('T')[0];
    dateHint.textContent = (AppState.currentDate === today) ? 'Hari Ini 🌿' : 'Jadwal 🗓️';
  }
  saveLocalState();
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

  if (configBudgetInput) configBudgetInput.value = budget;
  if (configBudgetPeriod) configBudgetPeriod.value = AppState.budgetPeriod || 'weekly';
  const currentPeriod = AppState.budgetPeriod || 'weekly';
  document.querySelectorAll('.cycle-seg-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cycle === currentPeriod);
  });
  const cycleHint = document.getElementById('cycleActiveHint');
  const cycleLabels = { weekly: 'Mingguan', monthly: 'Bulanan', session: 'Per Sesi Belanja' };
  if (cycleHint) cycleHint.textContent = cycleLabels[currentPeriod] || currentPeriod;
  updateBudgetPresetChips(budget);

  if (totalBudgetEl) totalBudgetEl.textContent = formatRupiah(budget);
  if (actualSpentEl) actualSpentEl.textContent = formatRupiah(totalBelanja);

  // Instant Targeted DOM Updates on Sticky Bottom Bar & Cart Totals (0 ms Anti-Lag)
  const grandTotalEl = document.getElementById('checkoutGrandTotal');
  if (grandTotalEl) grandTotalEl.textContent = formatRupiah(totalBelanja);
  const budgetSubEl = document.getElementById('checkoutBudgetRemaining');
  if (budgetSubEl) {
    if (safety.sisa >= 0) {
      budgetSubEl.textContent = `Sisa: ${formatRupiah(safety.sisa)}`;
      budgetSubEl.style.color = (safety.level === 'warning') ? '#B45309' : '#166534';
    } else {
      budgetSubEl.textContent = `Defisit: -${formatRupiah(Math.abs(safety.sisa))}`;
      budgetSubEl.style.color = '#DC2626';
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
  const overbudgetSlimDiff = document.getElementById('overbudget-slim-diff') || document.getElementById('slimOverbudgetDiff');

  const clampedPercent = Math.min(100, Math.max(0, safety.percentage));
  if (budgetSlimBar) {
    budgetSlimBar.style.width = `${clampedPercent}%`;
    budgetSlimBar.style.background = safety.barColor;
  }
  if (cartSlimBar) {
    cartSlimBar.style.width = `${clampedPercent}%`;
    cartSlimBar.style.background = safety.barColor;
  }
  if (overbudgetSlimBadge) { overbudgetSlimBadge.style.display = 'none'; }

  if (progressPercentText) {
    progressPercentText.textContent = `Pengeluaran: ${Math.round(safety.percentage)}%`;
  }

  if (safetyBadge) {
    safetyBadge.className = safety.badgeClass;
    safetyBadge.textContent = safety.badgeText;
  }

  // OVERBUDGET FIRM RED BANNER (>100% Limit) - With Strict Safety Guards
  const isPlanner = (AppState.currentTab === 'planner');
  const activeSpend = AppState.inStoreMode ? totalBelanja : (isPlanner ? (metrics.totalAll || 0) : totalBelanja);
  const overDiff = Math.max(0, activeSpend - budget);
  if (overbudgetBanner) {
    if (safety.showOverbudgetBanner && overDiff > 0) {
      overbudgetBanner.classList.remove('hidden');
      if (overbudgetDetail) {
        overbudgetDetail.innerHTML = `Defisit: <strong>${formatRupiah(overDiff)}</strong> (${Math.round(safety.percentage)}% dari saldo ${formatRupiah(budget)}). Kurangi kuantitas atau batalkan barang sekunder.`;
      }
    } else {
      overbudgetBanner.classList.add('hidden');
    }
  }

  // PLANNER TAB STICKY DASHBOARD TRACKER BOX
  const trackerSaldoLabel = document.getElementById('trackerSaldoLabel');
  const trackerSaldoValue = document.getElementById('trackerSaldoValue');
  const trackerSpentVal = document.getElementById('trackerSpentVal');
  const trackerPercentVal = document.getElementById('trackerPercentVal');

  if (trackerSaldoLabel && trackerSaldoValue) {
    if (safety.sisa >= 0) {
      trackerSaldoLabel.textContent = 'Sisa Saldo';
      trackerSaldoValue.textContent = formatRupiah(safety.sisa);
      trackerSaldoValue.className = `tracker-saldo-value ${safety.level}`;
    } else {
      trackerSaldoLabel.textContent = 'Defisit Saldo';
      trackerSaldoValue.textContent = `- ${formatRupiah(Math.abs(safety.sisa))}`;
      trackerSaldoValue.className = 'tracker-saldo-value danger';
    }
  }

  const trackerSpentLabel = document.getElementById('trackerSpentLabel');
  if (trackerSpentLabel) {
    trackerSpentLabel.textContent = isPlanner ? 'Total Rencana' : 'Total Belanja';
  }

  if (trackerSpentVal) {
    trackerSpentVal.textContent = formatRupiah(activeSpend);
  }
  const trackerLimitVal = document.getElementById('trackerLimitVal');
  if (trackerLimitVal) {
    trackerLimitVal.textContent = formatRupiah(budget);
  }
  if (trackerPercentVal) {
    trackerPercentVal.textContent = `(${Math.round(safety.percentage)}%)`;
  }

  const plannerAlert = document.getElementById('plannerBudgetAlert');
  const plannerAlertTitle = document.getElementById('plannerAlertTitle');
  const plannerAlertDesc = document.getElementById('plannerAlertDesc');
  const plannerAlertBadge = document.getElementById('plannerAlertBadge');
  const plannerAlertIcon = document.getElementById('plannerAlertIcon');

  const trackerAlertNotice = document.getElementById('trackerAlertNotice');

  if (plannerAlert) {
    plannerAlert.className = `sticky-dashboard-tracker planner-budget-alert budget-status-card ${safety.level}`;
    if (plannerAlertBadge) {
      plannerAlertBadge.textContent = (safety.level === 'danger')
        ? 'Overbudget'
        : (safety.level === 'warning' ? 'Rem Dulu' : 'Aman');
      plannerAlertBadge.className = `planner-alert-badge badge-${safety.level}`;
    }
    if (trackerAlertNotice) {
      trackerAlertNotice.className = `tracker-alert-notice ${safety.level}`;
    }

    if (safety.level === 'danger') {
      const overDiff = (activeSpend > budget) ? (activeSpend - budget) : (totalBelanja - budget);
      if (plannerAlertIcon) plannerAlertIcon.textContent = '🚨';
      if (plannerAlertTitle) plannerAlertTitle.textContent = 'Saldo Melebihi Limit!';
      if (plannerAlertDesc) plannerAlertDesc.textContent = `Total belanja ${formatRupiah(activeSpend)} melebihi limit ${formatRupiah(budget)} (Defisit: ${formatRupiah(overDiff)}). Kurangi kuantitas item atau batalkan barang sekunder agar pengeluaran tetap aman.`;
      if (plannerAlertBadge) {
        plannerAlertBadge.className = 'planner-alert-badge badge-danger';
        plannerAlertBadge.textContent = 'Overbudget';
      }
    } else if (safety.level === 'warning') {
      if (plannerAlertIcon) plannerAlertIcon.textContent = '⚠️';
      if (plannerAlertTitle) plannerAlertTitle.textContent = 'Mendekati Batas Saldo!';
      if (plannerAlertDesc) plannerAlertDesc.textContent = `Pengeluaranmu sudah mencapai ${Math.round(safety.percentage)}% (${formatRupiah(activeSpend)} dari saldo ${formatRupiah(budget)}). Sortir lagi isi keranjang belanja agar tidak melebihi batas saldo.`;
      if (plannerAlertBadge) {
        plannerAlertBadge.className = 'planner-alert-badge badge-warning';
        plannerAlertBadge.textContent = 'Rem Dulu';
      }
    } else {
      if (plannerAlertIcon) plannerAlertIcon.textContent = '💚';
      if (plannerAlertTitle) plannerAlertTitle.textContent = 'Status Saldo: Terkendali';
      if (plannerAlertDesc) plannerAlertDesc.textContent = `Total belanja ${formatRupiah(activeSpend)} dari batas saldo ${formatRupiah(budget)} • Sisa saldo aman: ${formatRupiah(safety.sisa)}.`;
      if (plannerAlertBadge) {
        plannerAlertBadge.className = 'planner-alert-badge badge-safe';
        plannerAlertBadge.textContent = 'Aman';
      }
    }
  }

  // Mini Sticky Saldo Bar & Dismissed States Updates (Strictly Mutually Exclusive)
  const miniBar = document.getElementById('stickySaldoMiniBar');
  const miniSaldoAmount = document.getElementById('miniSaldoAmount');
  const miniSaldoLabel = document.getElementById('miniSaldoLabel');
  const miniSaldoBadge = document.getElementById('miniSaldoBadge');
  const miniBarIcon = document.getElementById('miniBarIcon');
  const btnReopenStickySaldo = document.getElementById('btnReopenStickySaldo');

  if (miniSaldoAmount) {
    if (safety.sisa >= 0) {
      if (miniSaldoLabel) miniSaldoLabel.textContent = 'Sisa:';
      miniSaldoAmount.textContent = formatRupiah(safety.sisa);
      miniSaldoAmount.className = `mini-bar-val ${safety.level}`;
    } else {
      if (miniSaldoLabel) miniSaldoLabel.textContent = 'Defisit:';
      miniSaldoAmount.textContent = `- ${formatRupiah(Math.abs(safety.sisa))}`;
      miniSaldoAmount.className = 'mini-bar-val danger';
    }
  }

  if (miniBarIcon) {
    miniBarIcon.textContent = (safety.level === 'danger') ? '🚨' : '💳';
  }

  if (miniSaldoBadge) {
    miniSaldoBadge.textContent = (safety.level === 'danger')
      ? 'Overbudget'
      : (safety.level === 'warning' ? 'Rem Dulu' : 'Aman');
    miniSaldoBadge.className = `planner-alert-badge badge-${safety.level}`;
  }

  if (miniBar) {
    miniBar.className = `sticky-saldo-mini-bar ${safety.level}`;
  }

  // Handle visibility according to AppState.stickySaldoDismissed ('open' / false, 'mini', 'hidden')
  // Guaranteed: Mini bar and Full card are NEVER visible at the same time
  const dismissedState = AppState.stickySaldoDismissed;
  if (safety.level === 'danger' && dismissedState === 'hidden') {
    // If overbudget occurred while completely hidden, wake up mini bar so user sees alert
    if (plannerAlert) {
      plannerAlert.classList.add('is-hidden');
      plannerAlert.style.setProperty('display', 'none', 'important');
    }
    if (miniBar) {
      miniBar.classList.add('is-visible');
      miniBar.style.setProperty('display', 'flex', 'important');
    }
    if (btnReopenStickySaldo) {
      btnReopenStickySaldo.classList.remove('is-visible');
      btnReopenStickySaldo.style.setProperty('display', 'none', 'important');
    }
  } else if (dismissedState === 'hidden') {
    if (plannerAlert) {
      plannerAlert.classList.add('is-hidden');
      plannerAlert.style.setProperty('display', 'none', 'important');
    }
    if (miniBar) {
      miniBar.classList.remove('is-visible');
      miniBar.style.setProperty('display', 'none', 'important');
    }
    if (btnReopenStickySaldo) {
      btnReopenStickySaldo.classList.add('is-visible');
      btnReopenStickySaldo.style.setProperty('display', 'inline-flex', 'important');
    }
  } else if (dismissedState === 'mini' || dismissedState === true) {
    if (plannerAlert) {
      plannerAlert.classList.add('is-hidden');
      plannerAlert.style.setProperty('display', 'none', 'important');
    }
    if (miniBar) {
      miniBar.classList.add('is-visible');
      miniBar.style.setProperty('display', 'flex', 'important');
    }
    if (btnReopenStickySaldo) {
      btnReopenStickySaldo.classList.remove('is-visible');
      btnReopenStickySaldo.style.setProperty('display', 'none', 'important');
    }
  } else {
    // Fully open (default)
    if (plannerAlert) {
      plannerAlert.classList.remove('is-hidden');
      plannerAlert.style.setProperty('display', 'flex', 'important');
      plannerAlert.style.setProperty('flex-direction', 'column', 'important');
    }
    if (miniBar) {
      miniBar.classList.remove('is-visible');
      miniBar.style.setProperty('display', 'none', 'important');
    }
    if (btnReopenStickySaldo) {
      btnReopenStickySaldo.classList.remove('is-visible');
      btnReopenStickySaldo.style.setProperty('display', 'none', 'important');
    }
  }

  // TAB 1 (BUDGET) STATUS CALLOUT BOX
  const tabStatusBox = document.getElementById('budgetTabStatusBox');
  const tabStatusTitle = document.getElementById('budgetTabStatusTitle');
  const tabStatusDesc = document.getElementById('budgetTabStatusDesc');
  const tabStatusBadge = document.getElementById('budgetTabStatusBadge');
  const tabStatusIcon = document.getElementById('budgetTabStatusIcon');

  if (tabStatusBox) {
    tabStatusBox.className = `planner-budget-alert budget-status-card ${safety.level}`;
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

  // Multi-Sensory Warning Cue: ONLY trigger on dynamic user actions when authenticated, NEVER on initial page load / refresh / unauthenticated gate!
  const isAuth = !!(AppState.user && AppState.user.name);
  if (!isInitialAppLoad && isAuth && AppState.previousSafetyLevel !== null) {
    if (safety.level === 'danger' && AppState.previousSafetyLevel !== 'danger') {
      playWarningAlertTone();
      showToast('🚨 Peringatan: Total belanja telah melebihi batas saldo dompet!', 'danger');
    }
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

  // Update Finish Shopping buttons visual state when overbudget
  if (typeof document !== 'undefined') {
    const finishButtons = document.querySelectorAll('.btn-shopee-finish-action, .btn-finish-shopping, .instore-action-btn.secondary');
    finishButtons.forEach(btn => {
      if (safety.level === 'danger') {
        btn.classList.add('overbudget-blocked');
        btn.title = `Belanja melebihi anggaran dompet! Defisit ${formatRupiah(totalBelanja - budget)}. Kurangi barang sebelum selesai.`;
      } else {
        btn.classList.remove('overbudget-blocked');
        btn.title = 'Selesai Belanja & Simpan Struk';
      }
    });
  }

  // Update Personalized Dashboard Greeting & Shopping Insights
  updateDashboardGreeting();
  updateDashboardInsights();
  updateHeroBudgetMascot(safety.level);
}

/**
 * Tutup / Minimalkan / Buka kembali Sticky Dashboard Tracker Saldo
 * @param {boolean|string} action - true / 'mini': minimalkan, 'hide-all' / 'hidden': tutup total, false / 'open': buka kembali
 */
function dismissStickySaldoCard(action) {
  let newState = 'open';
  if (action === true || action === 'mini') {
    newState = 'mini';
  } else if (action === 'hide-all' || action === 'hidden') {
    newState = 'hidden';
  } else {
    newState = 'open';
  }

  AppState.stickySaldoDismissed = (newState === 'open') ? false : newState;
  try {
    localStorage.setItem(STORAGE_KEYS.STICKY_SALDO_DISMISSED, JSON.stringify(AppState.stickySaldoDismissed));
  } catch (e) { }

  renderBudget();

  if (newState === 'mini') {
    showToast('Kartu saldo diminimalkan. Ketuk "Buka ▾" untuk membuka kembali.', 'info');
  } else if (newState === 'hidden') {
    showToast('Kartu saldo disembunyikan. Ketuk tombol "💳 Saldo" untuk membuka.', 'info');
  } else {
    showToast('Kartu saldo ditampilkan kembali 💳', 'success');
  }
}

// =========================================================================
// PERSONALIZED DASHBOARD GREETING & SHOPPING INSIGHTS (STREAK, HEMAT, KATEGORI)
// =========================================================================

/**
 * Dapatkan nama panggilan pengguna untuk sambutan personal
 */
function getGreetingDisplayName() {
  if (AppState.user && AppState.user.name) {
    const rawName = AppState.user.name.trim();
    if (rawName) {
      const firstPart = rawName.split(/\s+/)[0];
      return firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
    }
  }
  const headerNameEl = document.getElementById('headerUserName');
  if (headerNameEl && headerNameEl.textContent && headerNameEl.textContent.trim()) {
    const raw = headerNameEl.textContent.trim();
    if (raw !== 'Masuk Akun' && raw !== 'Pengguna Tamu' && raw !== 'Akun') {
      const firstPart = raw.split(/\s+/)[0];
      return firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
    }
  }
  return 'Kakak';
}

/**
 * Tentukan periode waktu dan ucapan motivasi ramah
 */
function getDashboardTimeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) {
    return {
      period: 'Pagi',
      badge: 'Pagi yang cerah ☀️',
      titleSuffix: 'Pagi',
      emoji: '☀️',
      sub: 'Yuk, atur rencana belanja hemat hari ini! ✨'
    };
  } else if (hour >= 11 && hour < 15) {
    return {
      period: 'Siang',
      badge: 'Siang produktif 🌸',
      titleSuffix: 'Siang',
      emoji: '🌸',
      sub: 'Cek kebutuhan belanja & pantau sisa saldomu 🧺'
    };
  } else if (hour >= 15 && hour < 18) {
    return {
      period: 'Sore',
      // badge removed
      titleSuffix: 'Sore',
      emoji: '⛅',
      sub: 'Waktunya sortir kebutuhan belanja sore ini 🍓'
    };
  } else {
    return {
      period: 'Malam',
      // badge removed
      titleSuffix: 'Malam',
      emoji: '🌙',
      sub: 'Yuk, evaluasi catatan belanja & hematmu hari ini 💫'
    };
  }
}

/**
 * Render ucapan selamat personal di bagian atas tab Planner
 */
function updateDashboardGreeting() {
  const greetingSection = document.getElementById('dashboardGreetingSection');
  if (!greetingSection) return;

  const name = getGreetingDisplayName();
  const timeInfo = getDashboardTimeGreeting();

  const nameEl = document.getElementById('dashboardGreetingUserName');
  const badgeEl = document.getElementById('greetingTimePill');
  const subEl = document.getElementById('dashboardGreetingSubtitle');
  const titleEl = document.getElementById('dashboardGreetingTitle');

  if (badgeEl) badgeEl.remove();
  if (nameEl) nameEl.textContent = name;
  if (subEl) subEl.textContent = timeInfo.sub;
  if (titleEl) {
    titleEl.innerHTML = `Selamat ${timeInfo.titleSuffix}, <span id="dashboardGreetingUserName" class="greeting-name-highlight">${name}</span>!&nbsp;${timeInfo.emoji}`;
  }
}

/**
 * Hitung streak hari berturut-turut mencatat/menyelesaikan belanja dari AppState.receipts
 */
function calculateShoppingStreak() {
  if (!AppState.receipts || !Array.isArray(AppState.receipts) || AppState.receipts.length === 0) {
    return 0;
  }
  const dates = AppState.receipts
    .map(r => r.tanggal ? r.tanggal.slice(0, 10) : '')
    .filter(Boolean);
  const uniqueDates = Array.from(new Set(dates)).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  const latestDate = uniqueDates[0];
  if (latestDate !== todayStr && latestDate !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(latestDate);
  for (const dateStr of uniqueDates) {
    const d = new Date(dateStr);
    const diffDays = Math.round((checkDate - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Hitung total penghematan dari diskon transaksi struk
 */
function calculateTotalSavings() {
  if (!AppState.receipts || !Array.isArray(AppState.receipts) || AppState.receipts.length === 0) {
    return 0;
  }
  return AppState.receipts.reduce((sum, r) => sum + (Number(r.totalHemat) || 0), 0);
}

/**
 * Render ringkasan pengeluaran per kategori belanja di dalam kartu dashboard
 */
function renderDashboardCategorySummary() {
  const listEl = document.getElementById('categorySpendingList');
  const countPill = document.getElementById('categoryActiveCountPill');
  if (!listEl) return;

  // Sumber data: AppState.cart (atau AppState.items jika di planner belum masuk keranjang)
  const items = (AppState.cart && AppState.cart.length > 0)
    ? AppState.cart
    : (AppState.items && AppState.items.length > 0 ? AppState.items : []);

  if (!items || items.length === 0) {
    if (countPill) countPill.textContent = '0 Kategori';
    listEl.innerHTML = `
      <div class="category-summary-empty">
        <span class="cat-empty-mascot" aria-hidden="true">🌸</span>
        <div class="cat-empty-text">
          <p class="cat-empty-title">Belum ada alokasi belanja</p>
          <p class="cat-empty-sub">Tambahkan kebutuhan belanja untuk melihat ringkasan kategori</p>
        </div>
      </div>
    `;
    return;
  }

  const totals = {};
  let grandTotal = 0;

  items.forEach(item => {
    const rawPrice = item.hargaSatuan || item.hargaAkhirSatuan || 0;
    const disc = (typeof calculateDiscount === 'function')
      ? calculateDiscount(rawPrice, item.diskonTipe, item.diskonValue)
      : { finalPrice: rawPrice };
    const price = disc.finalPrice || rawPrice;
    const qty = Number(item.qty) || 1;
    const sub = price * qty;
    const cat = item.kategori || 'Bahan Pokok';
    totals[cat] = (totals[cat] || 0) + sub;
    grandTotal += sub;
  });

  if (grandTotal === 0) {
    if (countPill) countPill.textContent = '0 Kategori';
    listEl.innerHTML = `
      <div class="category-summary-empty">
        <span class="cat-empty-mascot" aria-hidden="true">🌸</span>
        <div class="cat-empty-text">
          <p class="cat-empty-title">Belum ada alokasi harga</p>
          <p class="cat-empty-sub">Isi perkiraan harga barang untuk melihat proporsi belanja</p>
        </div>
      </div>
    `;
    return;
  }

  const catEntries = Object.entries(totals)
    .map(([cat, amt]) => ({
      name: cat,
      amount: amt,
      percent: Math.round((amt / grandTotal) * 100)
    }))
    .sort((a, b) => b.amount - a.amount);

  if (countPill) countPill.textContent = `${catEntries.length} Kategori`;

  // Perbandingan tren dari struk transaksi sebelumnya
  let prevCatMap = null;
  if (AppState.receipts && AppState.receipts.length > 0) {
    prevCatMap = {};
    const latestRec = AppState.receipts[0];
    if (latestRec && Array.isArray(latestRec.items)) {
      latestRec.items.forEach(it => {
        const c = it.kategori || 'Bahan Pokok';
        prevCatMap[c] = (prevCatMap[c] || 0) + (it.subtotal || it.totalHarga || (it.hargaAkhirSatuan ? it.hargaAkhirSatuan * it.qty : 0));
      });
    }
  }

  // Tampilkan maksimal 4 kategori teratas agar hemat ruang & tidak memakan setengah layar
  const visibleEntries = catEntries.slice(0, 4);

  const html = visibleEntries.map(entry => {
    const icon = (typeof getCategoryIcon === 'function') ? getCategoryIcon(entry.name) : '🏷️';
    let trendBadge = '';
    if (prevCatMap && prevCatMap[entry.name] !== undefined) {
      const prevAmt = prevCatMap[entry.name];
      if (prevAmt > 0) {
        const diffPercent = Math.round(((entry.amount - prevAmt) / prevAmt) * 100);
        if (diffPercent > 5) {
          trendBadge = `<span class="cat-trend-pill up" title="Pengeluaran kategori naik ${diffPercent}% dibanding belanja sebelumnya">+${diffPercent}% ↗</span>`;
        } else if (diffPercent < -5) {
          trendBadge = `<span class="cat-trend-pill down" title="Pengeluaran kategori hemat ${Math.abs(diffPercent)}% dibanding belanja sebelumnya">${diffPercent}% ↘</span>`;
        } else {
          trendBadge = `<span class="cat-trend-pill neutral" title="Pengeluaran kategori stabil">Stabil</span>`;
        }
      } else {
        trendBadge = `<span class="cat-trend-pill new">Rencana</span>`;
      }
    } else {
      trendBadge = `<span class="cat-trend-pill new">Rencana</span>`;
    }

    return `
      <div class="category-summary-row">
        <div class="cat-row-top">
          <div class="cat-row-name-wrap">
            <span class="cat-row-icon" aria-hidden="true">${icon}</span>
            <span class="cat-row-name">${entry.name}</span>
            ${trendBadge}
          </div>
          <div class="cat-row-amounts">
            <span class="cat-row-val">${formatRupiah(entry.amount)}</span>
            <span class="cat-row-pct">${entry.percent}%</span>
          </div>
        </div>
        <div class="cat-progress-track">
          <div class="cat-progress-bar" style="width: ${Math.min(100, Math.max(3, entry.percent))}%;"></div>
        </div>
      </div>
    `;
  }).join('');

  listEl.innerHTML = html;
}

/**
 * Perbarui seluruh indikator insight di dashboard saldo
 */
function updateDashboardInsights() {
  // 1. Shopping Streak
  const streakValEl = document.getElementById('shoppingStreakValue');
  const streakSubEl = document.getElementById('shoppingStreakSub');
  const streak = calculateShoppingStreak();
  if (streakValEl) {
    streakValEl.textContent = `${streak} Hari`;
  }
  if (streakSubEl) {
    if (streak === 0) {
      streakSubEl.textContent = 'Yuk catat belanja pertamamu! ✨';
    } else if (streak >= 7) {
      streakSubEl.textContent = 'Hebat! Streak mingguan aktif 🔥';
    } else if (streak >= 3) {
      streakSubEl.textContent = 'Konsisten belanja bijak! 🌸';
    } else {
      streakSubEl.textContent = 'Catatan belanja tersambung ✨';
    }
  }

  // 2. Total Hemat dari Diskon
  const hematValEl = document.getElementById('totalHematValue');
  const hematSubEl = document.getElementById('totalHematSub');
  const totalHemat = calculateTotalSavings();
  if (hematValEl) {
    hematValEl.textContent = formatRupiah(totalHemat);
  }
  if (hematSubEl) {
    if (totalHemat > 0) {
      hematSubEl.textContent = 'Terselamatkan dari diskon! 💖';
    } else {
      hematSubEl.textContent = 'Belum ada diskon tercatat 🌸';
    }
  }

  // 3. Category Spending Summary
  renderDashboardCategorySummary();
}

// =========================================================================
// DYNAMIC HERO KAWAII MASCOT EMOTIONAL EXPRESSIONS
// =========================================================================

/**
 * Update Dynamic Kawaii Mascot Expression & Emotional Speech Message
 * States: 'safe' (Aman), 'warning' (Rem Dulu), 'danger' (Overbudget)
 * @param {string} safetyLevel - 'safe' | 'warning' | 'danger'
 */
let _mascotBubbleTimeout = null;

function updateHeroBudgetMascot(safetyLevel) {
  const greetingMascot = document.getElementById('greetingMascot');
  const bubbleText = document.getElementById('greetingMascotSpeechText');
  const bubbleEl = document.getElementById('greetingMascotSpeechBubble');

  const level = (safetyLevel === 'danger' || safetyLevel === 'overbudget')
    ? 'danger'
    : (safetyLevel === 'warning' ? 'warning' : 'safe');

  if (greetingMascot) {
    greetingMascot.classList.remove('state-safe', 'state-warning', 'state-danger');
    greetingMascot.classList.add('state-' + level);
  }

  let msg = 'Yeay! Belanjamu masih aman! ♡';
  if (level === 'danger') {
    msg = 'Oops! Budget kamu terlewati. Yuk evaluasi belanja! 🥺';
  } else if (level === 'warning') {
    msg = 'Eits, pelan-pelan ya! Cek sisa saldo 🌸';
  }

  if (bubbleText) bubbleText.textContent = msg;
  if (bubbleEl) {
    bubbleEl.classList.remove('state-safe', 'state-warning', 'state-danger');
    bubbleEl.classList.add('state-' + level);
  }

  // Synchronize Sticky Mascot Companion (reacts dynamically while scrolled down)
  const stickyCompanion = document.getElementById('stickyMascotCompanion');
  const stickyEyeLeft = document.getElementById('stickyEyeLeft');
  const stickyEyeRight = document.getElementById('stickyEyeRight');
  const stickyMouth = document.getElementById('stickyMouth');
  const stickyText = document.getElementById('stickyMascotText');
  if (stickyCompanion) {
    stickyCompanion.classList.remove('state-safe', 'state-warning', 'state-danger');
    stickyCompanion.classList.add('state-' + level);
  }
  if (level === 'danger') {
    if (stickyEyeLeft) stickyEyeLeft.setAttribute('d', 'M27 34L32 30M27 30L32 34'); // > < crying/overwhelmed eyes
    if (stickyEyeRight) stickyEyeRight.setAttribute('d', 'M38 30L43 34M38 34L43 30');
    if (stickyMouth) stickyMouth.setAttribute('d', 'M32.5 39C34 37.5 36 37.5 37.5 39'); // worried mouth
    if (stickyText) stickyText.textContent = 'Overbudget! 🚨';
  } else if (level === 'warning') {
    if (stickyEyeLeft) stickyEyeLeft.setAttribute('d', 'M27 33A2 2 0 1 1 31 33'); // round nervous eyes
    if (stickyEyeRight) stickyEyeRight.setAttribute('d', 'M39 33A2 2 0 1 1 43 33');
    if (stickyMouth) stickyMouth.setAttribute('d', 'M33 37.5H37'); // straight mouth
    if (stickyText) stickyText.textContent = 'Rem Dulu! ⚠️';
  } else {
    if (stickyEyeLeft) stickyEyeLeft.setAttribute('d', 'M26.5 33.5C28 31 31 31 32.5 33.5'); // curved happy eyes
    if (stickyEyeRight) stickyEyeRight.setAttribute('d', 'M37.5 33.5C39 31 42 31 43.5 33.5');
    if (stickyMouth) stickyMouth.setAttribute('d', 'M32.5 37.5C34 39 36 39 37.5 37.5'); // smile
    if (stickyText) stickyText.textContent = 'Aman ♡';
  }
}

function triggerGreetingMascotReaction() {
  if (typeof getCartMetrics === 'function' && typeof updateGreetingMascotMood === 'function') {
    const metrics = getCartMetrics();
    const lvl = (metrics && metrics.safety && metrics.safety.level) ? metrics.safety.level : 'safe';
    updateGreetingMascotMood(lvl);
  }
  const greetingMascot = document.getElementById('greetingMascot');
  const bubbleEl = document.getElementById('greetingMascotSpeechBubble');
  const bubbleText = document.getElementById('greetingMascotSpeechText');

  if (greetingMascot) {
    greetingMascot.classList.remove('reacting');
    void greetingMascot.offsetWidth;
    greetingMascot.classList.add('reacting');
  }

  if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
    SoundEngine.play('add_item');
  } else if (typeof playSoftPop === 'function') {
    playSoftPop();
  }

  if (bubbleEl) {
    bubbleEl.style.display = 'flex';
    bubbleEl.classList.add('show');

    if (_mascotBubbleTimeout) clearTimeout(_mascotBubbleTimeout);
    _mascotBubbleTimeout = setTimeout(() => {
      if (bubbleEl) {
        bubbleEl.classList.remove('show');
        setTimeout(() => { if (bubbleEl) bubbleEl.style.display = 'none'; }, 250);
      }
    }, 3800);
  }
}

function triggerMascotReaction() {
  triggerGreetingMascotReaction();
}
// Render Checklist Items with Stepper Touch Targets
// Render Checklist Items with Compact Horizontal Rows

/**
 * Gesture Swipe-to-Dismiss untuk Notifikasi Toast (Mobile & Desktop Drag)
 * Memungkinkan pengguna menggeser/flick toast ke atas atau ke samping untuk menutup instan
 */
function attachSwipeToDismiss(toast, onDismiss) {
  if (!toast) return;

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let isSwiping = false;
  let isDragging = false;
  let hasMoved = false;

  const onStart = (clientX, clientY, target) => {
    if (target && target.closest && target.closest('.btn-toast-undo')) return false;
    startX = clientX;
    startY = clientY;
    currentX = startX;
    currentY = startY;
    isSwiping = true;
    isDragging = false;
    hasMoved = false;
    toast.style.setProperty('transition', 'none', 'important');
    if (activeToastTimeout) {
      clearTimeout(activeToastTimeout);
      activeToastTimeout = null;
    }
    return true;
  };

  const onMove = (clientX, clientY) => {
    if (!isSwiping) return;
    currentX = clientX;
    currentY = clientY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      isDragging = true;
      hasMoved = true;
    }

    if (isDragging) {
      toast.classList.add('is-dragging');
      const dampedY = deltaY > 0 ? deltaY * 0.4 : deltaY;
      const progress = Math.min(1, Math.max(0, Math.max(Math.abs(deltaX) / 120, Math.abs(dampedY) / 45)));
      toast.style.setProperty('transform', `translate(${deltaX}px, ${dampedY}px)`, 'important');
      toast.style.setProperty('opacity', `${Math.max(0.12, 1 - progress * 0.88)}`, 'important');
    }
  };

  const onEnd = () => {
    if (!isSwiping) return;
    isSwiping = false;
    toast.classList.remove('is-dragging');

    if (!isDragging) {
      // Ketukan singkat tanpa drag tidak menutup instan: penutupan hanya via drag-to-remove
      toast.style.removeProperty('transition');
      if (!activeToastTimeout) {
        activeToastTimeout = setTimeout(() => {
          dismissToastWithAnimation('up');
        }, 2500);
      }
      return;
    }

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const dismissedUp = deltaY < -15;
    const dismissedDown = deltaY > 35;
    const dismissedRight = deltaX > 30;
    const dismissedLeft = deltaX < -30;

    if (dismissedUp || dismissedDown || dismissedRight || dismissedLeft) {
      let direction = 'up';
      if (dismissedDown) direction = 'down';
      else if (dismissedRight) direction = 'right';
      else if (dismissedLeft) direction = 'left';
      dismissToastWithAnimation(direction, deltaX, deltaY);
    } else {
      // Kembali ke posisi semula jika tarikan belum mencapai batas
      toast.style.setProperty('transition', 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease', 'important');
      toast.style.setProperty('transform', 'translate(0, 0)', 'important');
      toast.style.setProperty('opacity', '1', 'important');
      activeToastTimeout = setTimeout(() => {
        dismissToastWithAnimation('up');
      }, 2500);
    }
  };

  function dismissToastWithAnimation(direction, dx = 0, dy = 0) {
    toast.style.setProperty('transition', 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.18s ease', 'important');
    if (direction === 'up' || direction === 'tap') {
      toast.style.setProperty('transform', `translate(${dx}px, -70px) scale(0.92)`, 'important');
    } else if (direction === 'down') {
      toast.style.setProperty('transform', `translate(${dx}px, 60px) scale(0.92)`, 'important');
    } else if (direction === 'right') {
      toast.style.setProperty('transform', `translate(${dx + 200}px, ${dy}px) scale(0.92)`, 'important');
    } else if (direction === 'left') {
      toast.style.setProperty('transform', `translate(${dx - 200}px, ${dy}px) scale(0.92)`, 'important');
    }
    toast.style.setProperty('opacity', '0', 'important');

    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
      SoundEngine.play('button_click');
    }

    setTimeout(() => {
      if (typeof onDismiss === 'function') onDismiss();
      if (toast.parentNode) toast.remove();
    }, 200);
  }

  // Pointer Events API (Mendukung Mouse, Touch, dan Stylus dengan Pointer Capture)
  toast.addEventListener('pointerdown', (e) => {
    if (!onStart(e.clientX, e.clientY, e.target)) return;
    try {
      toast.setPointerCapture(e.pointerId);
    } catch (_) { }

    const onPointerMove = (pe) => {
      if (pe.pointerId === e.pointerId) {
        onMove(pe.clientX, pe.clientY);
      }
    };

    const onPointerUp = (pe) => {
      if (pe.pointerId === e.pointerId) {
        try {
          toast.releasePointerCapture(e.pointerId);
        } catch (_) { }
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
        onEnd();
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });
  });

  // Touch Events Fallback
  toast.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      const t = e.touches[0];
      onStart(t.clientX, t.clientY, e.target);
    }
  }, { passive: true });

  toast.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const t = e.touches[0];
      onMove(t.clientX, t.clientY);
    }
  }, { passive: true });

  toast.addEventListener('touchend', onEnd, { passive: true });
  toast.addEventListener('touchcancel', onEnd, { passive: true });

  // Cegah trigger klik setelah selesai dragging
  toast.addEventListener('click', (e) => {
    if (hasMoved) {
      e.stopPropagation();
      e.preventDefault();
      hasMoved = false;
    }
  }, true);
}
function showToastWithUndo(message, onUndoAction) {
  if (typeof document === 'undefined') return;

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

  const toast = document.createElement('div');
  toast.className = 'app-toast toast-message info toast-with-undo';

  // Format bertingkat 2 baris sengaja untuk aksi undo (anti teks terpotong)
  let titleText = 'Operasi Selesai';
  let descText = message;
  const quoteMatch = message.match(/^"([^"]+)"\s*(.*)$/);
  if (quoteMatch) {
    titleText = `"${quoteMatch[1]}"`;
    descText = quoteMatch[2] || 'Berhasil dipindahkan';
  }

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1;">
      <span class="toast-icon">✨</span>
      <div class="toast-stacked-wrap" style="flex: 1; min-width: 0;">
        <div class="toast-title" style="white-space: normal; word-break: break-word;">${escapeHtml(titleText)}</div>
        <div class="toast-desc" style="white-space: normal; word-break: break-word; line-height: 1.3;">${escapeHtml(descText)}</div>
      </div>
    </div>
    <button type="button" class="btn-toast-undo touch-target" title="Urungkan" aria-label="Urungkan">
      <svg class="toast-undo-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 7v6h6"></path>
        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
      </svg>
    </button>
  `;

  const undoBtn = toast.querySelector('.btn-toast-undo');
  if (undoBtn && typeof onUndoAction === 'function') {
    undoBtn.onclick = (e) => {
      e.stopPropagation();
      onUndoAction();
      toast.remove();
      playSoftPop();
    };
  }

  container.appendChild(toast);
  attachSwipeToDismiss(toast);

  activeToastTimeout = setTimeout(() => {
    toast.classList.add('fade-out');
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-12px)';
    toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 250);
  }, 4500);
}

function moveItemToCart(itemId) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  item.checked = true;
  playCalmChime();
  saveLocalState();
  pushStateToCloud();
  renderAll();

  showToastWithUndo(`"${item.namaBarang}" dipindahkan ke Keranjang 🛒`, () => {
    moveItemToPlan(itemId, true);
  });
}

function moveItemToPlan(itemId, isSilent = false) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  item.checked = false;
  playSoftPop();
  saveLocalState();
  pushStateToCloud();
  renderAll();

  if (!isSilent) {
    showToastWithUndo(`"${item.namaBarang}" dikembalikan ke Rencana 📋`, () => {
      moveItemToCart(itemId);
    });
  }
}

function startShoppingFromPlan() {
  const unbought = AppState.cart.filter(i => !i.checked);
  if (unbought.length === 0) {
    if (AppState.cart.length === 0) {
      showToast('Tambahkan barang ke Rencana Belanja terlebih dahulu! ✨', 'info');
      const input = document.getElementById('smartInputField');
      if (input) input.focus();
      return;
    }
    switchTab('cart');
    showToast('Semua barang sudah berada di Keranjang Belanja 🛒', 'info');
    return;
  }

  const movedIds = unbought.map(i => i.id);
  unbought.forEach(i => { i.checked = true; });

  playCalmChime();
  saveLocalState();
  pushStateToCloud();
  renderAll();
  switchTab('cart');

  showToastWithUndo(`${movedIds.length} barang dipindahkan ke Keranjang Belanja 🛒`, () => {
    movedIds.forEach(id => {
      const it = AppState.cart.find(item => item.id === id);
      if (it) it.checked = false;
    });
    saveLocalState();
    pushStateToCloud();
    renderAll();
    switchTab('planner');
    showToast('Pengalihan ke Keranjang dibatalkan ↩️', 'info');
  });
}

function renderItems() {
  const container = document.getElementById('groceryItemsContainer');
  const unboughtCountEl = document.getElementById('unboughtItemCount');
  if (!container) return;

  const unbought = AppState.cart.filter(i => !i.checked);
  const inCart = AppState.cart.filter(i => i.checked);
  if (unboughtCountEl) unboughtCountEl.textContent = unbought.length;

  const clearPlanBtn = document.getElementById('btnClearPlan');
  if (clearPlanBtn) {
    clearPlanBtn.style.display = unbought.length > 0 ? 'inline-flex' : 'none';
  }

  // Empty state: No items at all in plan or cart
  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="ios-empty-state-card">
        <div class="empty-state-mascot">🌸</div>
        <h4 class="empty-state-headline">Rencana Belanja Masih Kosong ♡</h4>
        <p class="empty-state-desc">Yuk catat kebutuhan belanjamu di kolom atas atau pilih langsung dari katalog populer di bawah!</p>
        <div class="empty-state-btn-row">
          <button type="button" class="btn-primary touch-target" style="width: auto; padding: 10px 22px; font-size: 0.84rem; font-weight: 800; border-radius: 999px;" onclick="loadRoutineItemsToPlanner()">
            🛍️ Muat Barang Rutin
          </button>
        </div>
      </div>
    `;
    updateCartBadges();
    return;
  }

  // Empty state: All planned items are already moved to cart
  if (unbought.length === 0 && inCart.length > 0) {
    container.innerHTML = `
      <div class="ios-empty-state-card">
        <div class="empty-state-mascot">🎉</div>
        <h4 class="empty-state-headline" style="color: #15803D;">Semua Rencana Sudah Masuk Keranjang!</h4>
        <p class="empty-state-desc">${inCart.length} barang rencana sudah siap di Keranjang Belanja untuk dibayar.</p>
        <div class="empty-state-btn-row">
          <button type="button" class="btn-primary touch-target" onclick="switchTab('cart')" style="width: auto; padding: 10px 22px; font-size: 0.84rem; font-weight: 800; border-radius: 999px; box-shadow: 0 4px 14px rgba(22, 101, 52, 0.25);">
            🛒 Buka Keranjang Belanja (${inCart.length})
          </button>
        </div>
      </div>
    `;
    updateCartBadges();
    return;
  }

  let itemsToRender = [...unbought];

  if (AppState.inStoreMode) {
    itemsToRender.sort((a, b) => (a.kategori || a.category || '').localeCompare(b.kategori || b.category || ''));
  }

  let html = '';
  let currentCategory = null;

  itemsToRender.forEach(item => {
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

    const prevRec = findPreviousPurchaseRecord(item.namaBarang, item.store || AppState.currentStore);
    const baseline = (prevRec && prevRec.price) ? prevRec.price : item.hargaRiwayatBulanLalu;
    const isSameStore = (!item.store || item.store === AppState.currentStore);
    const analysis = getRepurchaseAnalysis(item.hargaSatuan || 0, prevRec || (baseline ? { price: baseline, store: item.store, isSameStore } : null), isSameStore);

    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const subtotal = disc.finalPrice * item.qty;

    html += `
      <div class="ios-product-card plan-item-card" data-item-id="${item.id}">
        <!-- Top Section: Product Name, Routine Pill, & Icon Actions -->
        <div class="ios-card-top-row">
          <div class="ios-card-title-col">
            <span class="ios-product-title" title="${escapeHtml(item.namaBarang)}">
              ${escapeHtml(item.namaBarang)}
            </span>
            <div class="ios-card-tags-row">
              <span class="ios-meta-pill unit-pill" id="plan-unit-badge-${item.id}">📦 ${item.qty} ${escapeHtml(item.satuan || 'pcs')}</span>
              ${analysis.isRepurchase ? `<span class="ios-meta-pill analysis-pill ${analysis.badgeClass}" title="${escapeHtml(analysis.detailText)}">${analysis.badgeText}</span>` : ''}
              <button type="button" class="routine-toggle-pill ${item.isRoutine ? 'active' : ''}" onclick="toggleItemRoutine('${item.id}'); event.stopPropagation();" title="${item.isRoutine ? 'Barang Rutin Harian: Otomatis muncul setiap hari' : 'Jadikan Rutin Harian'}">
                ${item.isRoutine ? '🌸 Rutin Harian' : '🔁 Rutin'}
              </button>
            </div>
          </div>
          <div class="ios-card-actions-col">
            <button type="button" class="btn-ios-icon-action btn-edit touch-target" onclick="openDetailedItemModal('${item.id}'); event.stopPropagation();" title="Ubah Rincian Item" aria-label="Ubah Rincian Item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button type="button" class="btn-ios-icon-action btn-delete touch-target" onclick="confirmDeleteItem('${item.id}'); event.stopPropagation();" title="Hapus Item" aria-label="Hapus Item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Card Divider -->
        <div class="ios-card-divider"></div>

        <!-- Bottom Section: Price & Custom Stepper + Add to Cart -->
        <div class="ios-card-bottom-row">
          <div class="ios-card-price-col">
            ${item.hargaSatuan > 0 ? `
              <div class="ios-price-wrap" onclick="openQuickPriceModal('${item.id}', false); event.stopPropagation();" style="cursor: pointer;" title="Klik untuk ubah perkiraan harga">
                <span class="ios-price-label">Perkiraan:</span>
                <span class="ios-price-value price-tag" id="subtotal-${item.id}">${formatRupiah(subtotal)}</span>
              </div>
            ` : `
              <button type="button" class="badge-no-price touch-target" id="subtotal-${item.id}" onclick="openQuickPriceModal('${item.id}', false); event.stopPropagation();" title="Klik untuk masukkan harga perkiraan">
                ${analysis.previousPrice ? `💡 Dulu: ${formatRupiah(analysis.previousPrice)}` : '🏷️ Isi Harga'}
              </button>
            `}
          </div>

          <div class="ios-card-controls-col">
            <!-- Custom iOS Quantity Stepper -->
            <div class="ios-stepper-capsule">
              <button type="button" class="ios-step-btn minus" onclick="updateItemQty('${item.id}', -1); event.stopPropagation();" title="Kurangi Kuantitas" aria-label="Kurangi Kuantitas">&minus;</button>
              <input type="number" inputmode="numeric" class="ios-step-input" id="qty-input-${item.id}" min="1" value="${item.qty}"
                     oninput="handleQtyDirectInput('${item.id}', this.value)"
                     onblur="handleQtyBlur('${item.id}', this.value)"
                     onclick="event.stopPropagation()">
              <button type="button" class="ios-step-btn plus" onclick="updateItemQty('${item.id}', 1); event.stopPropagation();" title="Tambah Kuantitas" aria-label="Tambah Kuantitas">+</button>
            </div>

            <!-- Dedicated Primary Add to Cart Button -->
            <button type="button" class="btn-ios-add-cart touch-target" onclick="moveItemToCartWithFeedback('${item.id}', this); event.stopPropagation();" title="Pindahkan barang ini ke Keranjang Belanja" aria-label="Pindahkan ke Keranjang Belanja">
              <span>🛒</span>
              <span>Keranjang</span>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  // Summary strip if some items are already in cart
  if (inCart.length > 0) {
    html += `
      <div class="plan-incart-summary touch-target" onclick="switchTab('cart')" title="Buka Keranjang Belanja">
        <div class="plan-incart-left">
          <span class="plan-incart-icon">🛒</span>
          <span class="plan-incart-text">Ada <strong>${inCart.length} barang</strong> di Keranjang</span>
        </div>
        <span class="plan-incart-link">Buka Keranjang ➔</span>
      </div>
    `;
  }

  container.innerHTML = html;
  updateCartBadges();
}

// Reaktivitas Kuantitas & Subtotal Seketika (Proteksi Jari Ceroboh)
function updateItemQty(itemId, delta) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  const currentQty = parseInt(item.qty, 10) || 1;
  const newQty = currentQty + delta;
  if (newQty <= 0) {
    confirmDeleteItem(itemId);
    return;
  }
  if (newQty > 9999) {
    showToast('Kuantitas maksimal 9.999 pcs!', 'warning');
    return;
  }

  // Jika menambah kuantitas (delta > 0), periksa proteksi overbudget
  if (delta > 0) {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const addedCost = (disc.finalPrice || item.hargaSatuan || 0) * delta;
    if (checkOverbudgetBlock('menambah jumlah barang', addedCost)) return;
  }

  item.qty = newQty;
  SoundEngine.play(delta > 0 ? 'qty_up' : 'qty_down');

  // Instant DOM update without list re-render (maintains focus & avoids glitch)
  const inputEl = document.getElementById(`qty-input-${item.id}`);
  if (inputEl) {
    inputEl.value = newQty;
    inputEl.classList.remove('qty-bump');
    void inputEl.offsetWidth;
    inputEl.classList.add('qty-bump');
  }
  const cartInputEl = document.getElementById(`cart-qty-${item.id}`);
  if (cartInputEl) {
    cartInputEl.value = newQty;
    cartInputEl.classList.remove('qty-bump');
    void cartInputEl.offsetWidth;
    cartInputEl.classList.add('qty-bump');
  }
  if (typeof HapticEngine !== 'undefined') HapticEngine.light();

  const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
  const subtotal = disc.finalPrice * newQty;
  const subtotalEl = document.getElementById(`subtotal-${item.id}`);
  if (subtotalEl && item.hargaSatuan > 0) {
    subtotalEl.textContent = formatRupiah(subtotal);
  }

  // Update unit badges instantly in Planner and Cart
  const planUnitBadge = document.getElementById(`plan-unit-badge-${item.id}`);
  if (planUnitBadge) {
    planUnitBadge.textContent = `📦 ${newQty} ${item.satuan || 'pcs'}`;
  }
  const cartUnitBadge = document.getElementById(`cart-unit-badge-${item.id}`);
  if (cartUnitBadge) {
    cartUnitBadge.textContent = `📦 ${newQty} ${item.satuan || 'pcs'}`;
  }

  saveLocalState();
  renderBudget();
  renderCategoryBreakdown();
  pushStateToCloud();
}

function handleQtyDirectInput(itemId, rawVal) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  const val = parseInt(rawVal, 10);
  if (isNaN(val) || val <= 0) return;

  const prevQty = parseInt(item.qty, 10) || 1;
  if (val > prevQty) {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const addedCost = (disc.finalPrice || item.hargaSatuan || 0) * (val - prevQty);
    if (isUserOverbudget(addedCost)) {
      checkOverbudgetBlock('menambah jumlah barang', addedCost);
      const inputEl = document.getElementById(`qty-input-${item.id}`);
      if (inputEl) inputEl.value = prevQty;
      const cartInputEl = document.getElementById(`cart-qty-${item.id}`);
      if (cartInputEl) cartInputEl.value = prevQty;
      return;
    }
  }

  item.qty = Math.min(val, 9999);
  const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
  const subtotal = disc.finalPrice * item.qty;
  const subtotalEl = document.getElementById(`subtotal-${item.id}`);
  if (subtotalEl && item.hargaSatuan > 0) {
    subtotalEl.textContent = formatRupiah(subtotal);
  }

  // Update unit badges instantly in Planner and Cart
  const planUnitBadge = document.getElementById(`plan-unit-badge-${item.id}`);
  if (planUnitBadge) {
    planUnitBadge.textContent = `📦 ${item.qty} ${item.satuan || 'pcs'}`;
  }
  const cartUnitBadge = document.getElementById(`cart-unit-badge-${item.id}`);
  if (cartUnitBadge) {
    cartUnitBadge.textContent = `📦 ${item.qty} ${item.satuan || 'pcs'}`;
  }

  saveLocalState();
  renderBudget();
  renderCategoryBreakdown();
  pushStateToCloud();
}

function handleQtyBlur(itemId, rawVal) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  const prevQty = parseInt(item.qty, 10) || 1;
  const val = parseInt(rawVal, 10);
  let targetQty = 1;
  if (isNaN(val) || val <= 0) {
    targetQty = 1;
  } else {
    targetQty = Math.min(val, 9999);
  }

  if (targetQty > prevQty) {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const addedCost = (disc.finalPrice || item.hargaSatuan || 0) * (targetQty - prevQty);
    if (checkOverbudgetBlock('menambah jumlah barang', addedCost)) {
      const inputEl = document.getElementById(`qty-input-${item.id}`);
      if (inputEl) inputEl.value = prevQty;
      const cartInputEl = document.getElementById(`cart-qty-${item.id}`);
      if (cartInputEl) cartInputEl.value = prevQty;
      return;
    }
  }

  item.qty = targetQty;

  // Koreksi visual input agar user melihat angka yang aman dan valid
  const inputEl = document.getElementById(`qty-input-${item.id}`);
  if (inputEl) inputEl.value = item.qty;
  const cartInputEl = document.getElementById(`cart-qty-${item.id}`);
  if (cartInputEl) cartInputEl.value = item.qty;

  const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
  const subtotal = disc.finalPrice * item.qty;
  const subtotalEl = document.getElementById(`subtotal-${item.id}`);
  if (subtotalEl && item.hargaSatuan > 0) {
    subtotalEl.textContent = formatRupiah(subtotal);
  }

  // Update unit badges instantly in Planner and Cart
  const planUnitBadge = document.getElementById(`plan-unit-badge-${item.id}`);
  if (planUnitBadge) {
    planUnitBadge.textContent = `📦 ${item.qty} ${item.satuan || 'pcs'}`;
  }
  const cartUnitBadge = document.getElementById(`cart-unit-badge-${item.id}`);
  if (cartUnitBadge) {
    cartUnitBadge.textContent = `📦 ${item.qty} ${item.satuan || 'pcs'}`;
  }

  saveLocalState();
  renderBudget();
  pushStateToCloud();
}

function toggleItemCheck(itemId) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;
  item.checked = !item.checked;
  if (item.checked) SoundEngine.play('add_to_cart');
  else SoundEngine.play('remove_item');
  saveLocalState();
  pushStateToCloud();
  renderItems();
  renderCartSection();
  renderBudget();
  syncCartBottomPadding();
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
  // Proteksi sentuhan: abaikan jika klik mengenai elemen interaktif atau badge
  if (event.target.closest('button, input, label, a, .shopee-stepper, .shopee-compact-actions, .planner-unit-badge, .routine-toggle-pill, .shopee-promo-pill, .cart-item-checkbox-wrap, .subtotal-amount, .badge-no-price, .btn-enter-price-pill')) return;
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

let isDeletingItem = false;
function executeDeleteItem() {
  if (isDeletingItem) return;
  if (!AppState.itemPendingDeleteId) return;

  const idx = AppState.cart.findIndex(i => i.id === AppState.itemPendingDeleteId);
  if (idx === -1) {
    closeDeleteConfirmModal();
    return;
  }

  isDeletingItem = true;
  setTimeout(() => isDeletingItem = false, 500);

  const item = AppState.cart[idx];
  const name = item ? item.namaBarang : 'Item';
  // Simpan data cadangan untuk fitur Undo (Urungkan)
  AppState._lastDeletedItem = { item: JSON.parse(JSON.stringify(item)), index: idx };
  AppState.cart.splice(idx, 1);

  closeDeleteConfirmModal();
  SoundEngine.play('remove_item');
  saveLocalState();
  pushStateToCloud();
  renderAll();
  showToastWithUndo(`"${name}" dihapus dari daftar belanja`, () => undoDeleteItem());
}

// Fitur Undo / Pemulihan Item yang Tidak Sengaja Terhapus
function undoDeleteItem() {
  if (!AppState._lastDeletedItem) {
    showToast('Tidak ada item yang dapat dipulihkan', 'info');
    return;
  }
  const restored = AppState._lastDeletedItem.item;
  const insertIdx = Math.min(AppState._lastDeletedItem.index || 0, AppState.cart.length);
  AppState.cart.splice(insertIdx, 0, restored);
  AppState._lastDeletedItem = null;

  saveLocalState();
  pushStateToCloud();
  renderAll();
  playCalmChime();
  showToast(`"${restored.namaBarang}" berhasil dipulihkan ke keranjang! ✨`, 'success');
}

/**
 * Hapus Semua Barang di Keranjang Belanja (Trolley)
 */
async function clearCartAll() {
  const inCartItems = AppState.cart.filter(i => i.checked);
  if (!inCartItems || inCartItems.length === 0) {
    showToast('Keranjang belanja Anda sudah kosong! 🛒', 'info');
    return;
  }

  playSoftPop();
  const count = inCartItems.length;
  const confirmed = await showAppModalBubble({
    title: 'Kosongkan Keranjang',
    message: `Apakah Anda yakin ingin menghapus semua (${count}) barang dari keranjang belanja?`,
    icon: '🗑️',
    confirmText: 'Ya, Hapus Semua',
    cancelText: 'Batal'
  });

  if (!confirmed) return;

  // Simpan backup untuk fitur Undo
  AppState._lastClearedCartBackup = JSON.parse(JSON.stringify(AppState.cart));

  // Hapus semua barang yang dicentang (di keranjang)
  AppState.cart = AppState.cart.filter(i => !i.checked);

  if (AppState.cart.length === 0) {
    AppState.previousSafetyLevel = null;
  }

  saveLocalState();
  pushStateToCloud();
  renderAll();
  playCalmChime();
  showToastWithUndo(`Keranjang berhasil dikosongkan (${count} barang dihapus) ✨`, () => undoClearCart());
}

/**
 * Hapus Semua Barang di Rencana Belanja (Plan)
 */
async function clearPlanAll() {
  const unbought = AppState.cart.filter(i => !i.checked);
  if (!unbought || unbought.length === 0) {
    showToast('Daftar rencana belanja Anda sudah kosong! 📋', 'info');
    return;
  }

  playSoftPop();
  const count = unbought.length;
  const confirmed = await showAppModalBubble({
    title: 'Kosongkan Rencana Belanja',
    message: `Apakah Anda yakin ingin menghapus semua (${count}) barang dari daftar rencana belanja?`,
    icon: '🗑️',
    confirmText: 'Ya, Hapus Semua',
    cancelText: 'Batal'
  });

  if (!confirmed) return;

  // Simpan backup untuk fitur Undo
  AppState._lastClearedCartBackup = JSON.parse(JSON.stringify(AppState.cart));

  // Hapus semua barang rencana (belum dicentang)
  AppState.cart = AppState.cart.filter(i => i.checked);

  if (AppState.cart.length === 0) {
    AppState.previousSafetyLevel = null;
  }

  saveLocalState();
  pushStateToCloud();
  renderAll();
  playCalmChime();
  showToastWithUndo(`Rencana belanja berhasil dikosongkan (${count} barang dihapus) ✨`, () => undoClearCart());
}

/**
 * Kosongkan Seluruh Belanjaan (Keranjang + Rencana)
 */
async function clearEntireCart() {
  if (!AppState.cart || AppState.cart.length === 0) {
    showToast('Keranjang dan rencana belanja sudah kosong! 🛒', 'info');
    return;
  }

  playSoftPop();
  const count = AppState.cart.length;
  const confirmed = await showAppModalBubble({
    title: 'Kosongkan Seluruh Belanjaan',
    message: `Apakah Anda yakin ingin menghapus seluruh ${count} barang dari keranjang dan rencana belanja?`,
    icon: '🗑️',
    confirmText: 'Ya, Kosongkan Semua',
    cancelText: 'Batal'
  });

  if (!confirmed) return;

  // Simpan backup untuk fitur Undo
  AppState._lastClearedCartBackup = JSON.parse(JSON.stringify(AppState.cart));
  AppState.cart = [];
  AppState.previousSafetyLevel = null;

  saveLocalState();
  pushStateToCloud();
  renderAll();
  playCalmChime();
  showToastWithUndo(`Seluruh belanjaan (${count} barang) berhasil dikosongkan ✨`, () => undoClearCart());
}

/**
 * Urungkan (Undo) Pengosongan Keranjang / Rencana Belanja
 */
function undoClearCart() {
  if (!AppState._lastClearedCartBackup || AppState._lastClearedCartBackup.length === 0) {
    showToast('Tidak ada data keranjang yang dapat dipulihkan', 'info');
    return;
  }

  AppState.cart = JSON.parse(JSON.stringify(AppState._lastClearedCartBackup));
  AppState._lastClearedCartBackup = null;

  saveLocalState();
  pushStateToCloud();
  renderAll();
  playCalmChime();
  showToast('Keranjang belanja berhasil dipulihkan kembali! ✨', 'success');
}

/**
 * Buka Modal Pembatalan Sesi Belanja (Cancel Shopping)
 */
function openCancelShoppingModal() {
  playSoftPop();
  const modal = document.getElementById('cancelShoppingModal');
  const bodyEl = document.getElementById('cancelModalBody');
  const titleEl = document.getElementById('cancelModalTitle');
  const subtitleEl = document.getElementById('cancelModalSubtitle');
  if (!modal || !bodyEl) return;

  const inCartItems = (AppState.cart || []).filter(i => i.checked);
  const totalCartCount = inCartItems.length;

  if (totalCartCount > 0) {
    if (titleEl) titleEl.textContent = 'Batalkan Sesi Belanja?';
    if (subtitleEl) subtitleEl.textContent = `Ada ${totalCartCount} barang di keranjang belanja. Pilih cara pembatalan:`;

    bodyEl.innerHTML = `
      <div class="cancel-options-list">
        <!-- Opsi 1: Kembalikan semua ke Rencana Belanja -->
        <button type="button" class="cancel-option-card touch-target" onclick="executeCancelShopping('return_to_plan')">
          <div class="cancel-option-icon">↩️</div>
          <div class="cancel-option-info">
            <strong class="cancel-option-title">Kembalikan ke Rencana Belanja</strong>
            <span class="cancel-option-desc">Simpan semua barang (${totalCartCount} item) di daftar Rencana agar bisa dibeli lain waktu.</span>
          </div>
          <span class="cancel-option-arrow" aria-hidden="true">➔</span>
        </button>

        <!-- Opsi 2: Hapus semua barang di keranjang & batalkan -->
        <button type="button" class="cancel-option-card danger touch-target" onclick="executeCancelShopping('clear_all')">
          <div class="cancel-option-icon">🗑️</div>
          <div class="cancel-option-info">
            <strong class="cancel-option-title">Hapus Semua & Kosongkan Keranjang</strong>
            <span class="cancel-option-desc">Hapus seluruh isi keranjang belanjaan dan batalkan sesi belanja.</span>
          </div>
          <span class="cancel-option-arrow" aria-hidden="true">➔</span>
        </button>
      </div>
    `;
  } else {
    // Keranjang sudah kosong (misal produk sudah dihapus pengguna sebelumnya)
    if (titleEl) titleEl.textContent = 'Batalkan Sesi Belanja?';
    if (subtitleEl) subtitleEl.textContent = 'Keranjang belanja saat ini sudah kosong.';

    bodyEl.innerHTML = `
      <div class="cancel-empty-prompt">
        <div class="cancel-empty-icon">🛒</div>
        <p class="cancel-empty-text">
          Keranjang belanja Anda sudah kosong. Ingin membatalkan sesi belanja ini dan kembali ke menu Rencana Belanja?
        </p>
        <button type="button" class="btn-confirm-cancel-session touch-target" onclick="executeCancelShopping('direct_cancel')">
          🚫 Ya, Batalkan Sesi Belanja
        </button>
      </div>
    `;
  }

  modal.style.display = 'flex';
  modal.classList.add('active', 'show');
  modal.setAttribute('aria-hidden', 'false');
}

/**
 * Tutup Modal Pembatalan Sesi Belanja
 */
function closeCancelShoppingModal() {
  const modal = document.getElementById('cancelShoppingModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active', 'show');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Entry Point Membatalkan Sesi Belanja
 */
function cancelShoppingSession() {
  openCancelShoppingModal();
}

/**
 * Eksekusi Pembatalan Belanja sesuai pilihan user
 * @param {'return_to_plan'|'clear_all'|'direct_cancel'} action
 */
function executeCancelShopping(action) {
  closeCancelShoppingModal();

  const inCartItems = (AppState.cart || []).filter(i => i.checked);
  const count = inCartItems.length;

  if (action === 'return_to_plan') {
    // 1. Kembalikan semua barang keranjang ke rencana
    (AppState.cart || []).forEach(item => {
      if (item.checked) {
        item.checked = false;
      }
    });

    // 2. Nonaktifkan Mode Toko (In-Store Mode)
    AppState.inStoreMode = false;
    document.body.classList.remove('in-store-mode-active');
    try {
      localStorage.setItem(STORAGE_KEYS.IN_STORE_MODE, JSON.stringify(false));
    } catch (e) { }

    saveLocalState();
    pushStateToCloud();
    renderAll();
    switchTab('planner');
    playCalmChime();
    showToast(`Belanja dibatalkan • ${count} barang dikembalikan ke Rencana ↩️`, 'info');

  } else if (action === 'clear_all') {
    // 1. Simpan backup cart untuk fitur Undo jika berubah pikiran
    AppState._lastClearedCartBackup = JSON.parse(JSON.stringify(AppState.cart || []));

    // 2. Hapus barang yang ada di keranjang
    AppState.cart = (AppState.cart || []).filter(i => !i.checked);

    if (AppState.cart.length === 0) {
      AppState.previousSafetyLevel = null;
    }

    // 3. Nonaktifkan Mode Toko (In-Store Mode)
    AppState.inStoreMode = false;
    document.body.classList.remove('in-store-mode-active');
    try {
      localStorage.setItem(STORAGE_KEYS.IN_STORE_MODE, JSON.stringify(false));
    } catch (e) { }

    saveLocalState();
    pushStateToCloud();
    renderAll();
    switchTab('planner');
    playCalmChime();
    showToastWithUndo(`Sesi belanja dibatalkan (${count} barang dihapus) ✨`, () => undoClearCart());

  } else {
    // 'direct_cancel' ketika keranjang sudah kosong
    AppState.inStoreMode = false;
    document.body.classList.remove('in-store-mode-active');
    try {
      localStorage.setItem(STORAGE_KEYS.IN_STORE_MODE, JSON.stringify(false));
    } catch (e) { }

    saveLocalState();
    pushStateToCloud();
    renderAll();
    switchTab('planner');
    playCalmChime();
    showToast('Sesi belanja berhasil dibatalkan ↩️', 'info');
  }
}

// =========================================================================
// 8. SINGLE SMART NATURAL-LANGUAGE INPUT BAR & ANTI-LIST
// =========================================================================

/**
 * Natural language parser cerdas:
 * "Beras 5kg 75000" -> name: Beras, qty: 5, unit: kg, price: 75000
 * "Minyak 2L 38000" -> name: Minyak, qty: 2, unit: l, price: 38000
 * "Susu UHT 2 liter Rp 18.000" -> name: Susu UHT, qty: 2, unit: liter, price: 18000
 * "Roti Tawar 15k" -> name: Roti Tawar, qty: 1, unit: pcs, price: 15000
 */
function parseSmartInput(rawText) {
  let text = rawText.trim();
  let qty = 1;
  let unit = 'pcs';
  let price = 0;

  // 1. Ekstraksi Harga jika dicantumkan di akhir (contoh: "Rp 75.000", "75000", "75k", "75.000")
  const priceRegex = /(?:rp\.?\s*([0-9.,]+)|([0-9.,]+)\s*k|\b([0-9]{1,3}(?:\.[0-9]{3})+)\b|\b([1-9][0-9]{3,7})\b)$/i;
  const priceMatch = text.match(priceRegex);
  if (priceMatch) {
    const rawPriceStr = priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4];
    if (rawPriceStr) {
      if (priceMatch[2]) {
        price = Math.round(parseFloat(rawPriceStr.replace(',', '.')) * 1000);
      } else {
        price = Math.round(parseFloat(rawPriceStr.replace(/\./g, '').replace(',', '.')) || 0);
      }
      text = text.substring(0, priceMatch.index).trim();
    }
  }

  const units = ['liter', 'litre', 'l', 'kg', 'kilogram', 'karung/5kg', 'g', 'gram', 'gr', 'pack', 'pouch', 'dus', 'ikat', 'botol', 'kaleng', 'bungkus', 'bks', 'butir', 'pcs', 'buah', 'lembar'];
  const unitsPattern = units.join('|');

  // Match: "2 liter susu uht" atau "2 pouch minyak"
  const prefixMatch = text.match(new RegExp(`^(\\d+(?:[.,]\\d+)?)\\s*(${unitsPattern})\\s+(.*)$`, 'i'));
  if (prefixMatch) {
    qty = parseFloat(prefixMatch[1].replace(',', '.'));
    unit = prefixMatch[2].toLowerCase();
    text = prefixMatch[3].trim();
    return { name: cleanItemName(text), qty, unit, price };
  }

  // Match: "susu uht 2 liter"
  const suffixMatch = text.match(new RegExp(`^(.*?)\\s+(\\d+(?:[.,]\\d+)?)\\s*(${unitsPattern})$`, 'i'));
  if (suffixMatch) {
    text = suffixMatch[1].trim();
    qty = parseFloat(suffixMatch[2].replace(',', '.'));
    unit = suffixMatch[3].toLowerCase();
    return { name: cleanItemName(text), qty, unit, price };
  }

  // Match trailing number kuantitas: "susu uht 2" (hanya jika <= 500 pcs)
  const numberSuffix = text.match(/^(.*?)\s+(\d+)$/);
  if (numberSuffix) {
    const n = parseInt(numberSuffix[2], 10);
    if (n <= 500) {
      text = numberSuffix[1].trim();
      qty = n;
      return { name: cleanItemName(text), qty, unit: 'pcs', price };
    }
  }

  return { name: cleanItemName(text), qty, unit: 'pcs', price };
}

function cleanItemName(str) {
  if (!str) return 'Barang Belanja';
  str = String(str).trim().slice(0, 80);
  if (str.length === 0) return 'Barang Belanja';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function detectCategory(name) {
  if (!name || typeof name !== 'string') return 'Kebutuhan Pokok';
  const lower = name.toLowerCase();
  if (lower.includes('susu') || lower.includes('milk') || lower.includes('yoghurt') || lower.includes('keju')) return 'Minuman';
  if (lower.includes('beras') || lower.includes('minyak') || lower.includes('telur') || lower.includes('gula')) return 'Kebutuhan Pokok';
  if (lower.includes('tepung') || lower.includes('garam') || lower.includes('bumbu') || lower.includes('merica')) return 'Pantry';
  if (lower.includes('sabun') || lower.includes('shampoo') || lower.includes('pasta gigi')) return 'Perlengkapan Mandi';
  if (lower.includes('deterjen') || lower.includes('pembersih') || lower.includes('tisu')) return 'Kebersihan & Rumah';
  if (lower.includes('roti') || lower.includes('biskuit') || lower.includes('mie') || lower.includes('snack')) return 'Makanan';
  return 'Kebutuhan Pokok';
}

let isSubmittingSmartInput = false;
function handleSmartInputSubmit(e) {
  e.preventDefault();
  if (isSubmittingSmartInput) return;

  const input = document.getElementById('smartInputField');
  if (!input) return;
  const val = input.value.trim().slice(0, 80);
  if (!val) {
    showToast('Ketik nama barang terlebih dahulu!', 'info');
    input.focus();
    return;
  }

  if (isUserOverbudget()) {
    checkOverbudgetBlock('menambah barang baru');
    return;
  }

  isSubmittingSmartInput = true;
  setTimeout(() => isSubmittingSmartInput = false, 350);

  const parsed = parseSmartInput(val);
  if (!parsed.name || parsed.name.trim() === '') {
    showToast('Nama barang tidak valid!', 'warning');
    return;
  }

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
  if (checkOverbudgetBlock('menambah barang baru')) return;

  const category = detectCategory(parsed.name);
  const history = AppState.priceHistory[parsed.name] || {};
  const historyPrice = history.harga || null;

  // Proteksi duplikasi tidak sengaja: jika nama barang persis sudah ada di rencana (belum dibeli), tambahkan kuantitasnya saja
  const existing = AppState.cart.find(i => (i.namaBarang || '').toLowerCase() === parsed.name.toLowerCase() && !i.checked);
  if (existing) {
    const addedCost = (existing.hargaSatuan || 0) * (parsed.qty || 1);
    if (addedCost > 0 && checkOverbudgetBlock('menambah kuantitas barang', addedCost)) return;
    existing.qty = Math.min(9999, (existing.qty || 1) + (parsed.qty || 1));
    SoundEngine.play('qty_up');
    pushStateToCloud();
    renderAll();
    showToast(`"${parsed.name}" kuantitas ditambah jadi ${existing.qty} ✨`, 'success');
    return;
  }

  const initialPrice = (parsed.price && parsed.price > 0) ? parsed.price : (historyPrice || 0);

  const newItem = {
    id: 'item-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    namaBarang: parsed.name,
    kategori: category,
    satuan: parsed.unit || history.satuan || 'pcs',
    qty: Math.min(9999, Math.max(1, parsed.qty || 1)),
    hargaSatuan: initialPrice,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: historyPrice,
    store: AppState.currentStore,
    checked: false // Checklist belum dibeli / menunggu fase belanja di toko
  };

  // Simpan item ke koleksi produk akun pengguna (Preferensi 1-Klik Beli Ulang)
  saveUserCustomItem({
    name: parsed.name,
    category: category,
    unit: parsed.unit || history.satuan || 'pcs',
    price: initialPrice
  });

  AppState.cart.unshift(newItem);
  SoundEngine.play('add_item');
  pushStateToCloud();
  renderAll();
  const priceNotice = initialPrice > 0 ? ` @ ${formatRupiah(initialPrice)}` : '';
  showToast(`"${parsed.name}" (${newItem.qty} ${newItem.satuan}${priceNotice}) dicatat di rencana belanja ✨`, 'success');
}

// =========================================================================
// 8B. VISUAL PRODUCT CATALOG (PRESET DATA & 1-TAP ADD)
// =========================================================================
const PRODUCT_CATALOG = [
  { id: 'cat-1', name: 'Beras Rojolele 5kg', category: 'staple', icon: '🌾', iconSvg: 'staple_rice', price: 74000, unit: 'karung/5kg', aisle: 'Bahan Pokok', isRoutine: true },
  { id: 'cat-croissant', name: 'Croissant Butter Sakura', category: 'staple', icon: '🥐', iconSvg: 'ribbon_croissant', price: 16000, unit: 'pcs', aisle: 'Bahan Pokok', isRoutine: true },
  { id: 'cat-cake', name: 'Strawberry Shortcake Slice', category: 'produce', icon: '🍰', iconSvg: 'strawberry_cake', price: 28000, unit: 'slice', aisle: 'Sayur & Buah' },
  { id: 'cat-tea', name: 'Traditional English Tea Tin', category: 'dairy-drink', icon: '🫖', iconSvg: 'english_tea_tin', price: 26500, unit: 'kaleng/100g', aisle: 'Dairy & Minuman', isRoutine: true },
  { id: 'cat-teacup', name: 'English Rose Teacup Blend', category: 'dairy-drink', icon: '☕', iconSvg: 'rose_teacup', price: 18000, unit: 'cangkir', aisle: 'Dairy & Minuman' },
  { id: 'cat-cupcake', name: 'Strawberry Rose Cupcake', category: 'produce', icon: '🧁', iconSvg: 'strawberry_cupcake', price: 18500, unit: 'pcs', aisle: 'Sayur & Buah' },
  { id: 'cat-macaron', name: 'Macaron Afternoon Tea Tier', category: 'produce', icon: '🧁', iconSvg: 'macaron_tier', price: 35000, unit: 'set/3pcs', aisle: 'Sayur & Buah' },
  { id: 'cat-cookie', name: 'Heart Jam Butter Cookie', category: 'staple', icon: '🍪', iconSvg: 'heart_cookie', price: 12000, unit: 'pack', aisle: 'Bahan Pokok' },
  { id: 'cat-teapot', name: 'Teh Mawar Porcelain (Pot)', category: 'dairy-drink', icon: '🫖', iconSvg: 'porcelain_teapot', price: 32000, unit: 'pot', aisle: 'Dairy & Minuman' },
  { id: 'cat-2', name: 'Minyak Goreng 2L', category: 'oil-seasoning', icon: '🍳', price: 38000, unit: 'pouch/2L', aisle: 'Minyak & Bumbu', isRoutine: true },
  { id: 'cat-3', name: 'Telur Ayam 1kg', category: 'staple', icon: '🥚', price: 28000, unit: 'kg', aisle: 'Bahan Pokok', isRoutine: true },
  { id: 'cat-4', name: 'Indomie Goreng (5 pcs)', category: 'staple', icon: '🍜', iconSvg: 'staple_noodle', price: 15500, unit: 'pack/5pcs', aisle: 'Bahan Pokok' },
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
  { id: 'cat-19', name: 'Susu UHT Ultra Milk 1L', category: 'dairy-drink', icon: '🥛', iconSvg: 'dairy_milk', price: 19500, unit: 'karton', aisle: 'Dairy & Minuman', isRoutine: true },
  { id: 'cat-20', name: 'Kopi Kapal Api Special Mix', category: 'dairy-drink', icon: '☕', price: 14000, unit: 'renteng', aisle: 'Dairy & Minuman' },
  { id: 'cat-21', name: 'Keju Cheddar Kraft 165g', category: 'dairy-drink', icon: '🧀', price: 22000, unit: 'kotak', aisle: 'Dairy & Minuman' },
  { id: 'cat-22', name: 'Yogurt Biokul 120ml', category: 'dairy-drink', icon: '🥣', price: 8500, unit: 'cup', aisle: 'Dairy & Minuman' }
];

let catalogActiveCategory = 'all';
let catalogSearchQuery = '';
let catalogExpanded = false;

function toggleCatalogExpand() {
  catalogExpanded = !catalogExpanded;
  renderProductCatalog();
}

/**
 * Render Thumbnail Item Katalog (Mendukung KawaiiArt SVG, image URL, atau fallback emoji)
 */
function renderCatalogItemThumb(item) {
  if (item.iconSvg && typeof KawaiiArt !== 'undefined' && KawaiiArt[item.iconSvg]) {
    return `<div class="catalog-thumb-art">${KawaiiArt[item.iconSvg]}</div>`;
  }
  if (item.icon && typeof item.icon === 'string') {
    if (item.icon.startsWith('<svg')) {
      return `<div class="catalog-thumb-art">${item.icon}</div>`;
    }
    if (item.icon.startsWith('data:image') || item.icon.startsWith('http') || item.icon.endsWith('.png') || item.icon.endsWith('.svg')) {
      return `<img src="${item.icon}" alt="${escapeHtml(item.name)}" class="catalog-thumb-img" loading="lazy">`;
    }
    return `<span class="catalog-thumb-emoji">${item.icon}</span>`;
  }
  return `<span class="catalog-thumb-emoji">🛍️</span>`;
}

function renderProductCatalog() {
  const container = document.getElementById('productCatalogGrid');
  if (!container) return;

  // Pastikan filter pills tersinkronisasi termasuk kategori kustom pengguna
  renderCatalogCategoryPills();

  // Gabungkan user custom items dengan default PRODUCT_CATALOG
  const userItems = (Array.isArray(AppState.userCustomItems) ? AppState.userCustomItems : []).map(ci => ({
    id: ci.id || ('custom-' + ci.name),
    name: ci.name,
    category: ci.category || 'Kebutuhan Pokok',
    aisle: ci.category || 'Kebutuhan Pokok',
    unit: ci.unit || 'pcs',
    price: ci.price || 0,
    icon: ci.icon || getCategoryIcon(ci.category) || '🛍️',
    isRoutine: !!ci.isRoutine,
    isUserCustom: true
  }));

  const allCatalog = [...userItems, ...PRODUCT_CATALOG];
  const query = (catalogSearchQuery || '').toLowerCase().trim();

  const filtered = allCatalog.filter(item => {
    let matchesCat = false;
    if (catalogActiveCategory === 'all') {
      matchesCat = true;
    } else if (catalogActiveCategory === 'user-custom') {
      matchesCat = !!item.isUserCustom;
    } else if (catalogActiveCategory.startsWith('user-cat-')) {
      const targetCatName = catalogActiveCategory.replace('user-cat-', '').toLowerCase();
      matchesCat = (item.category || item.aisle || '').toLowerCase().replace(/\s+/g, '-') === targetCatName;
    } else {
      matchesCat = (item.category === catalogActiveCategory);
    }

    const matchesQuery = !query ||
      item.name.toLowerCase().includes(query) ||
      (item.aisle || '').toLowerCase().includes(query) ||
      (item.category || '').toLowerCase().includes(query);

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

  // Tampilkan 4 item saja secara default agar grid ringkas dan tidak scroll terlalu jauh
  const itemsToDisplay = (catalogExpanded || query || catalogActiveCategory !== 'all') ? filtered : filtered.slice(0, 4);
  const isOver = isUserOverbudget();

  let html = itemsToDisplay.map(item => `
    <div class="catalog-card" data-catalog-id="${escapeHtml(item.id)}">
      <div class="catalog-thumb-wrap">
        ${renderCatalogItemThumb(item)}
      </div>
      <div class="catalog-card-name" title="${escapeHtml(item.name)}">
        ${escapeHtml(item.name)}
      </div>
      <div class="catalog-card-meta-row">
        ${item.isUserCustom ? '<span class="custom-user-catalog-badge">⭐ Koleksi Anda</span>' : (item.isRoutine ? '<span class="catalog-routine-tag" title="Barang Rutin Harian">🔁 Rutin</span>' : '<span class="catalog-routine-spacer"></span>')}
      </div>
      <div class="catalog-card-footer">
        <span class="catalog-card-price">${formatRupiah(item.price)}</span>
        <button type="button" class="btn-catalog-add touch-target ${isOver ? 'overbudget-blocked' : ''}"
          onclick="addCatalogItemToPlan('${escapeHtml(item.id)}')"
          title="${isOver ? 'Anggaran belanja sudah melebihi batas!' : 'Tambah ke Rencana Belanja'}">
          + Tambah
        </button>
      </div>
    </div>
  `).join('');

  // Tombol toggle Lihat Lebih Banyak / Sedikit jika lebih dari 4 item dan tidak sedang mencari
  if (!query && catalogActiveCategory === 'all' && filtered.length > 4) {
    html += `
      <div style="grid-column: 1 / -1; text-align: center; margin-top: 6px; padding: 4px 0;">
        <button type="button" class="btn-catalog-toggle touch-target" onclick="toggleCatalogExpand()">
          ${catalogExpanded ? '▴ Tampilkan 4 Produk Saja (Ringkas)' : `▾ Lihat ${filtered.length - 4} Produk Lainnya`}
        </button>
      </div>
    `;
  }

  container.innerHTML = html;
}

function filterCatalogCategory(category, buttonEl) {
  catalogActiveCategory = category;
  const pills = document.querySelectorAll('#catalogCategoryPills .catalog-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (buttonEl) buttonEl.classList.add('active');
  renderProductCatalog();
}

let catalogSearchDebounceTimer = null;
function handleCatalogSearch(query) {
  catalogSearchQuery = query;
  if (catalogSearchDebounceTimer) clearTimeout(catalogSearchDebounceTimer);
  catalogSearchDebounceTimer = setTimeout(() => {
    renderProductCatalog();
  }, 120);
}

let lastCatalogAddTimestamp = 0;
function addCatalogItemToPlan(catalogId) {
  const now = Date.now();
  if (now - lastCatalogAddTimestamp < 250) return; // Anti-spam jari terburu-buru
  lastCatalogAddTimestamp = now;

  const product = (Array.isArray(AppState.userCustomItems) ? AppState.userCustomItems.find(p => p.id === catalogId) : null) ||
    PRODUCT_CATALOG.find(p => p.id === catalogId);
  if (!product) return;

  const addedCost = product.price || 0;
  if (checkOverbudgetBlock('menambah barang dari katalog', addedCost)) return;

  if (checkBlacklist(product.name)) {
    AppState.pendingBlacklistItem = { name: product.name, qty: 1, unit: product.unit };
    showBlacklistWarning(product.name);
    return;
  }

  // Proteksi Jari Ceroboh: Jika barang ini sudah ada di rencana & belum dibeli,
  // tambahkan kuantitasnya saja agar daftar tidak dipenuhi kartu duplikat
  const existing = AppState.cart.find(i => (i.namaBarang || '').toLowerCase() === product.name.toLowerCase() && !i.checked);
  if (existing) {
    existing.qty = Math.min(9999, (parseInt(existing.qty, 10) || 1) + 1);
    SoundEngine.play('qty_up');
    pushStateToCloud();
    renderAll();
    showToast(`"${product.name}" kuantitas ditambah jadi ${existing.qty} ✨`, 'success');
    return;
  }

  // Automatisasi riwayat harga bulan lalu dari history terkini
  const autoHistoryPrice = findLatestItemPrice(product.name, AppState.currentStore) || product.price || null;

  // Tambahkan barang ke rencana dengan status belum dibeli (checked: false)
  const newItem = {
    id: 'item-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    namaBarang: product.name,
    kategori: product.aisle || product.category || 'Kebutuhan Pokok',
    satuan: product.unit || 'pcs',
    qty: 1,
    hargaSatuan: product.price || 0,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: autoHistoryPrice,
    store: AppState.currentStore,
    checked: false,
    isRoutine: !!product.isRoutine
  };

  AppState.cart.unshift(newItem);
  SoundEngine.play('add_item');
  pushStateToCloud();
  renderAll();
  showToast(`"${product.name}" dicatat di rencana belanja! 🛒`, 'success');
}

function quickAddFavorite(name, qty, unit, category, price, promoType = 'none', promoVal = '') {
  const history = AppState.priceHistory[name] || {};
  const finalPrice = (price !== undefined && price !== null) ? price : (history.harga || 0);
  const estimatedCost = Math.max(0, finalPrice) * (parseInt(qty, 10) || 1);

  if (checkOverbudgetBlock('menambah barang favorit', estimatedCost)) return;

  if (checkBlacklist(name)) {
    AppState.pendingBlacklistItem = { name, qty, unit };
    showBlacklistWarning(name);
    return;
  }

  // Proteksi duplikasi tidak sengaja jika barang sudah ada
  const existing = AppState.cart.find(i => (i.namaBarang || '').toLowerCase() === name.toLowerCase() && !i.checked);
  if (existing) {
    existing.qty = Math.min(9999, (parseInt(existing.qty, 10) || 1) + (parseInt(qty, 10) || 1));
    playSoftPop();
    pushStateToCloud();
    renderAll();
    showToast(`"${name}" kuantitas ditambah jadi ${existing.qty} ✨`, 'success');
    return;
  }

  const newItem = {
    id: 'item-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    namaBarang: name,
    kategori: category || detectCategory(name),
    satuan: unit || 'pcs',
    qty: Math.min(9999, Math.max(1, parseInt(qty, 10) || 1)),
    hargaSatuan: Math.max(0, finalPrice),
    diskonTipe: promoType || 'none',
    diskonValue: promoVal || '',
    hargaRiwayatBulanLalu: history.harga || null,
    store: AppState.currentStore,
    checked: (finalPrice > 0)
  };

  AppState.cart.unshift(newItem);
  SoundEngine.play('add_item');
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
 * Muat barang belanja rutin harian langsung ke daftar Rencana Belanja
 */
function loadRoutineItemsToPlanner() {
  if (typeof playSoftPop === 'function') playSoftPop();

  let routineList = [];
  if (Array.isArray(AppState.routineItems) && AppState.routineItems.length > 0) {
    routineList = AppState.routineItems;
  } else if (typeof DEFAULT_ROUTINE_ITEMS !== 'undefined' && Array.isArray(DEFAULT_ROUTINE_ITEMS)) {
    routineList = DEFAULT_ROUTINE_ITEMS;
  }

  if (!routineList || routineList.length === 0) {
    showToast('Belum ada barang rutin yang tersimpan! Tandai barang dengan ikon 🔁 Rutin terlebih dahulu.', 'info');
    return;
  }

  if (!Array.isArray(AppState.cart)) {
    AppState.cart = [];
  }

  let addedCount = 0;
  const store = AppState.currentStore || 'Supermarket';

  routineList.forEach((r, idx) => {
    const itemName = (r.namaBarang || r.name || '').trim();
    if (!itemName) return;

    // Periksa apakah barang sudah ada di rencana (yang belum dibeli / checked: false)
    const existing = AppState.cart.find(i => (i.namaBarang || '').trim().toLowerCase() === itemName.toLowerCase() && !i.checked);
    if (!existing) {
      let lastPrice = null;
      try {
        const prevRec = findPreviousPurchaseRecord(itemName, store);
        lastPrice = prevRec ? prevRec.price : (r.hargaSatuan || r.price || null);
      } catch (e) {
        lastPrice = r.hargaSatuan || r.price || null;
      }

      AppState.cart.unshift({
        id: 'item-' + Date.now() + '-' + idx + '-' + Math.floor(Math.random() * 10000),
        namaBarang: itemName,
        kategori: r.kategori || r.aisle || 'Bahan Pokok',
        satuan: r.satuan || r.unit || 'pcs',
        qty: parseInt(r.qty, 10) || 1,
        hargaSatuan: parseFloat(r.hargaSatuan || r.price) || 0,
        diskonTipe: 'none',
        diskonValue: '',
        hargaRiwayatBulanLalu: lastPrice,
        store: store,
        checked: false,
        isRoutine: true
      });
      addedCount++;
    }
  });

  saveLocalState();
  pushStateToCloud();
  renderAll();

  if (addedCount > 0) {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play('success');
    showToast(`${addedCount} barang rutin berhasil dimuat ke Rencana Belanja! 🔁✨`, 'success');
  } else {
    showToast('Semua barang rutin harian sudah ada di rencana belanja Anda! 🌸', 'info');
  }
}

/**
 * Acak & perbarui urutan rekomendasi Katalog Produk Harian
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

  // Jika sudah tercatat hari ini, tidak perlu reset ulang
  if (lastResetDate === todayStr) {
    return false;
  }

  // Akun baru atau pengguna reguler harus mulai dari awal dengan keranjang kosong (tanpa inject paksa rutin)
  const hasUserCustomRoutine = AppState.routineItems && AppState.routineItems.length > 0;
  if (!hasUserCustomRoutine || uid !== 'demo_user_101') {
    localStorage.setItem(storageKey, todayStr);
    localStorage.setItem('last_planner_reset_date', todayStr);
    shuffleDailyCatalog(todayStr);
    return false;
  }

  // Jika user sudah memiliki keranjang belanja aktif (sedang dipakai/dicentang),
  // jangan suntikkan barang baru atau ubah status barang yang sedang dikerjakan user!
  if (AppState.cart && AppState.cart.length > 0) {
    localStorage.setItem(storageKey, todayStr);
    localStorage.setItem('last_planner_reset_date', todayStr);
    return false;
  }

  // Hanya jalankan untuk demo_user_101
  executeDailyPlannerReset(todayStr, uid);
  return true;
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
      // PRESERVE user progress across refreshes and daily sync!
      existing.isRoutine = true;
    }
  });

  // 3. Acak/perbarui urutan rekomendasi Katalog Produk Harian
  shuffleDailyCatalog(todayStr);

  // 4. Simpan tanggal hari ini ke storage
  localStorage.setItem('last_planner_reset_date_' + uid, todayStr);
  localStorage.setItem('last_planner_reset_date', todayStr);

  if (typeof firebase !== 'undefined' && firebase.firestore && uid && uid !== 'guest') {
    try {
      const uRef = getUserDocRef();
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
  const subtitle = document.getElementById('itemModalSubtitle');
  const submitBtn = document.getElementById('btnSubmitDetailedItem');
  const advDetails = document.getElementById('detailsAdvancedOptions');

  // Pastikan listener chip diskon single-select terpasang
  initDiscountChips();

  if (itemId) {
    const item = AppState.cart.find(i => i.id === itemId);
    if (!item) return;

    if (title) title.textContent = 'Edit Detail Produk';
    if (subtitle) subtitle.textContent = 'Ubah nama, jumlah, harga, atau diskon';
    if (submitBtn) submitBtn.textContent = '💾 Simpan Perubahan';

    syncCategoryDropdownOptions(item.kategori || 'Kebutuhan Pokok');
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
    if (title) title.textContent = 'Tambah Produk';
    if (subtitle) subtitle.textContent = 'Atur detail & estimasi belanja';
    if (submitBtn) submitBtn.textContent = '➕ Tambahkan Barang';

    document.getElementById('detailedItemForm').reset();
    syncCategoryDropdownOptions('Kebutuhan Pokok');
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
    SoundEngine.play('modal_open');
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
    SoundEngine.play('modal_close');
  }
  hideCustomItemSuggestions();
  closeItemPickerModal();
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
    chip.onclick = function (e) {
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

let detailNameDebounceTimer = null;
function handleDetailNameInput(name) {
  const trimmed = (name || '').trim();
  if (detailNameDebounceTimer) clearTimeout(detailNameDebounceTimer);
  detailNameDebounceTimer = setTimeout(() => {
    showCustomItemSuggestions(trimmed);
  }, 100);
  if (!trimmed) {
    updateDetailModalPreview();
    return;
  }

  // Otomatisasi riwayat harga bulan lalu & auto-fill satuan/kategori
  const historyPrice = findLatestItemPrice(trimmed, AppState.currentStore);
  const histInput = document.getElementById('detailInputHistoryPrice');
  if (histInput && historyPrice && (!histInput.value || parseFloat(histInput.value) === 0)) {
    histInput.value = historyPrice;
  }

  // Auto-match category and unit from user custom items, priceHistory, or catalog
  const customItem = Array.isArray(AppState.userCustomItems)
    ? AppState.userCustomItems.find(i => i.name.toLowerCase() === trimmed.toLowerCase())
    : null;
  const history = AppState.priceHistory ? AppState.priceHistory[trimmed] : null;

  if (customItem) {
    if (customItem.category) {
      syncCategoryDropdownOptions(customItem.category);
      const catEl = document.getElementById('detailInputCategory');
      if (catEl) catEl.value = customItem.category;
    }
    if (customItem.unit) {
      const uEl = document.getElementById('detailInputUnit');
      if (uEl) uEl.value = customItem.unit;
    }
    if (customItem.price && (!document.getElementById('detailInputPrice').value || parseFloat(document.getElementById('detailInputPrice').value) === 0)) {
      document.getElementById('detailInputPrice').value = customItem.price;
    }
  } else if (history) {
    if (history.satuan) {
      const uEl = document.getElementById('detailInputUnit');
      if (uEl) uEl.value = history.satuan;
    }
    if (history.kategori) {
      syncCategoryDropdownOptions(history.kategori);
      const catEl = document.getElementById('detailInputCategory');
      if (catEl) catEl.value = history.kategori;
    }
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
  let kategori = (document.getElementById('detailInputCategory')?.value || '').trim();
  if (!kategori) {
    kategori = detectCategory(nama) || 'Kebutuhan Pokok';
  }

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
  let hargaRiwayatBulanLalu = parseFloat(document.getElementById('detailInputHistoryPrice').value) || null;

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

  // Automatisasi riwayat harga bulan lalu dari history terkini jika belum diisi manual
  if (!hargaRiwayatBulanLalu || hargaRiwayatBulanLalu <= 0) {
    hargaRiwayatBulanLalu = findLatestItemPrice(nama, toko) || (hargaSatuan > 0 ? hargaSatuan : null);
  }

  // Rekam harga terkini ke riwayat toko jika ada harga riil
  if (hargaSatuan > 0) {
    recordStorePrice(nama, hargaSatuan, toko, kategori, satuan);
  } else if (hargaRiwayatBulanLalu && hargaRiwayatBulanLalu > 0) {
    recordStorePrice(nama, hargaRiwayatBulanLalu, toko, kategori, satuan);
  }

  const isRoutine = document.getElementById('detailInputIsRoutine') ? document.getElementById('detailInputIsRoutine').checked : false;

  // Simpan item ke koleksi produk kustom akun pengguna (Strictly Isolated to User Account)
  saveUserCustomItem({
    name: nama,
    category: kategori,
    unit: satuan,
    price: hargaSatuan > 0 ? hargaSatuan : (hargaRiwayatBulanLalu || 0),
    isRoutine
  });

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
      const oldDisc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
      const oldSubtotal = oldDisc.finalPrice * item.qty;
      const newDisc = calculateDiscount(hargaSatuan, diskonTipe, diskonValue);
      const newSubtotal = newDisc.finalPrice * qty;
      const diffCost = newSubtotal - oldSubtotal;

      if (diffCost > 0 && checkOverbudgetBlock('memperbarui item dengan harga atau jumlah lebih tinggi', diffCost)) {
        return;
      }

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
    const newDisc = calculateDiscount(hargaSatuan, diskonTipe, diskonValue);
    const addedCost = newDisc.finalPrice * qty;
    if (checkOverbudgetBlock('menambah barang baru', addedCost)) return;

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
function prepareRoutineItemsForNewShopping() {
  const routineList = (AppState.routineItems && AppState.routineItems.length > 0)
    ? AppState.routineItems
    : DEFAULT_ROUTINE_ITEMS;

  AppState.cart = routineList.map(r => {
    const itemName = r.namaBarang || r.name;
    const prevRec = findPreviousPurchaseRecord(itemName, AppState.currentStore);
    const lastPrice = prevRec ? prevRec.price : (r.hargaSatuan || r.price || null);

    return {
      id: 'item-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
      namaBarang: itemName,
      kategori: r.kategori || r.aisle || 'Bahan Pokok',
      satuan: r.satuan || r.unit || 'pcs',
      qty: r.qty || 1,
      hargaSatuan: r.hargaSatuan || r.price || 0,
      diskonTipe: 'none',
      diskonValue: '',
      hargaRiwayatBulanLalu: lastPrice,
      store: AppState.currentStore,
      checked: false,
      isRoutine: true
    };
  });
}

function startNewShoppingSession() {
  closeReceiptModal();
  AppState.inStoreMode = false;
  document.body.classList.remove('in-store-mode-active');
  localStorage.setItem(STORAGE_KEYS.IN_STORE_MODE, JSON.stringify(false));

  const fabStoreMode = document.getElementById('fabStoreMode');
  const fabIcon = document.getElementById('fabIcon');
  const fabText = document.getElementById('fabText');
  const runningBar = document.getElementById('runningCartBar');
  const instoreCard = document.getElementById('inStoreCompanionCard');

  if (fabStoreMode) {
    fabStoreMode.style.display = 'none';
    fabStoreMode.classList.add('d-none');
  }
  if (fabIcon) fabIcon.textContent = '🛒';
  if (fabText) fabText.textContent = 'Mulai Belanja';
  if (runningBar) runningBar.classList.add('d-none');
  if (instoreCard) instoreCard.style.display = 'none';

  switchTab('planner', true);
  loadRoutineItemsToPlanner();
}

function toggleShoppingMode() {
  // Jika pengguna ingin memulai belanja tapi keranjang masih kosong (misal baru selesai belanja)
  if (!AppState.inStoreMode && (!AppState.cart || AppState.cart.length === 0)) {
    prepareRoutineItemsForNewShopping();
    saveLocalState();
    pushStateToCloud();
    renderAll();
    showToast('Daftar barang rutin disiapkan untuk belanja! 🛒', 'info');
  }

  AppState.inStoreMode = !AppState.inStoreMode;
  saveLocalState();
  pushStateToCloud();
  document.body.classList.toggle('in-store-mode-active', AppState.inStoreMode);

  const fabStoreMode = document.getElementById('fabStoreMode');
  const fabIcon = document.getElementById('fabIcon');
  const fabText = document.getElementById('fabText');
  const runningBar = document.getElementById('runningCartBar');
  const instoreCard = document.getElementById('inStoreCompanionCard');

  if (AppState.inStoreMode) {
    if (fabStoreMode) {
      fabStoreMode.style.display = 'none';
      fabStoreMode.classList.add('d-none');
    }
    if (fabIcon) fabIcon.textContent = '📋';
    if (fabText) fabText.textContent = 'Mode Rencana';
    if (runningBar) runningBar.classList.add('d-none'); runningBar.style.display = 'none';
    if (instoreCard) instoreCard.style.display = 'none';
    showToast('Mode Toko aktif • Checklist lorong & pantau sisa saldo', 'info');
  } else {
    if (fabStoreMode) {
      fabStoreMode.style.display = 'none';
      fabStoreMode.classList.add('d-none');
    }
    if (fabIcon) fabIcon.textContent = '🛒';
    if (fabText) fabText.textContent = 'Mulai Belanja';
    if (runningBar) runningBar.classList.add('d-none');
    if (instoreCard) instoreCard.style.display = 'none';
    showToast('Kembali ke Mode Rencana', 'info');
  }

  renderItems();
  renderBudget();
  syncCartBottomPadding();
}

let isFinishingShopping = false;
async function confirmFinishShopping() {
  if (isFinishingShopping) return;

  if (!AppState.cart || AppState.cart.length === 0) {
    playSoftPop();
    const wantCancel = await showAppModalBubble({
      title: 'Keranjang Masih Kosong',
      message: 'Belum ada barang di daftar belanja Anda. Apakah Anda ingin membatalkan sesi belanja ini dan kembali ke menu utama?',
      icon: '🛒',
      confirmText: 'Ya, Batalkan Belanja',
      cancelText: 'Lanjut Catat Barang'
    });
    if (wantCancel) {
      executeCancelShopping('direct_cancel');
    }
    return;
  }

  const metrics = getCartMetrics();
  if (metrics.totalBelanja > AppState.budget) {
    const deficit = metrics.totalBelanja - AppState.budget;
    SoundEngine.play('budget_exceed');
    showToast(`Tidak bisa menyelesaikan belanja! Melebihi anggaran dompet. Defisit: ${formatRupiah(deficit)} (Limit: ${formatRupiah(AppState.budget)}). Kurangi barang atau kuantitas terlebih dahulu!`, 'danger');
    highlightOverbudgetBanner();
    return;
  }

  const checkedItems = AppState.cart.filter(item => item.checked);
  // Proteksi Jari Ceroboh: Jika belum ada barang yang dicentang di keranjang, tawarkan batalkan belanja
  if (checkedItems.length === 0) {
    playSoftPop();
    const wantCancel = await showAppModalBubble({
      title: 'Keranjang Belanja Kosong',
      message: 'Belum ada barang yang dimasukkan ke troli belanja. Apakah Anda ingin membatalkan sesi belanja ini dan kembali ke Rencana?',
      icon: '🛒',
      confirmText: 'Ya, Batalkan Belanja',
      cancelText: 'Pilih Barang Dulu'
    });
    if (wantCancel) {
      executeCancelShopping('direct_cancel');
    }
    return;
  }

  const confirmed = await showAppModalBubble({
    title: 'Selesai Belanja',
    message: `Selesaikan belanja untuk ${checkedItems.length} barang? Struk digital akan otomatis dicetak & disimpan ke Pantry.`,
    icon: '🛍️',
    confirmText: 'Ya, Selesaikan',
    cancelText: 'Lanjut Belanja'
  });
  if (!confirmed) return;

  isFinishingShopping = true;
  setTimeout(() => isFinishingShopping = false, 1500);

  // 1. Generate Thermal Supermarket Receipt Data Realtime
  const generatedReceipt = generateReceiptData();

  const itemsToPantry = [...checkedItems];

  // Simpan data cadangan untuk fitur "Batalkan / Urungkan Selesai Belanja"
  AppState._lastFinishedSessionBackup = {
    cart: JSON.parse(JSON.stringify(AppState.cart)),
    pantryItemsAddedCount: itemsToPantry.length
  };
  AppState._lastFinishedReceiptId = generatedReceipt ? generatedReceipt.id : null;

  // 2. Move checked items to Pantry & Record Purchase Price History for accurate future repurchase tracking
  itemsToPantry.forEach(item => {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const finalUnitPrice = Math.round(disc.finalPrice || item.hargaSatuan || 0);
    if (finalUnitPrice > 0) {
      recordStorePrice(item.namaBarang, finalUnitPrice, AppState.currentStore, item.kategori, item.satuan);
    }

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
  if (checkedItems.length < AppState.cart.length) {
    AppState.cart = AppState.cart.filter(item => !item.checked);
  } else {
    AppState.cart = [];
  }

  AppState.inStoreMode = false;
  document.body.classList.remove('in-store-mode-active');
  localStorage.setItem(STORAGE_KEYS.IN_STORE_MODE, JSON.stringify(false));

  const fabStoreMode = document.getElementById('fabStoreMode');
  const fabIcon = document.getElementById('fabIcon');
  const fabText = document.getElementById('fabText');
  const runningBar = document.getElementById('runningCartBar');
  const instoreCard = document.getElementById('inStoreCompanionCard');
  if (fabStoreMode) {
    fabStoreMode.style.display = 'none';
    fabStoreMode.classList.add('d-none');
  }
  if (fabIcon) fabIcon.textContent = '🛒';
  if (fabText) fabText.textContent = 'Mulai Belanja';
  if (runningBar) runningBar.classList.add('d-none');
  if (instoreCard) instoreCard.style.display = 'none';

  SoundEngine.play('checkout');
  saveLocalState();
  pushStateToCloud();
  renderAll();
  switchTab('budget');

  // 5. Otomatis tampilkan modal Struk Belanja Supermarket Asli
  openReceiptModal();
  showToast('Belanja selesai! Struk resmi kasir siap dicetak 🧾✨', 'success');
}

// Fitur Undo / Pemulihan jika pengguna tidak sengaja menekan "Selesai Belanja"
function undoFinishShopping() {
  if (!AppState._lastFinishedSessionBackup) {
    showToast('Tidak ada sesi yang dapat dikembalikan', 'info');
    return;
  }

  AppState.cart = JSON.parse(JSON.stringify(AppState._lastFinishedSessionBackup.cart));
  if (AppState._lastFinishedReceiptId && AppState.receipts) {
    AppState.receipts = AppState.receipts.filter(r => r.id !== AppState._lastFinishedReceiptId);
  }
  if (AppState._lastFinishedSessionBackup.pantryItemsAddedCount > 0 && AppState.pantry) {
    AppState.pantry.splice(0, AppState._lastFinishedSessionBackup.pantryItemsAddedCount);
  }

  AppState._lastFinishedSessionBackup = null;
  AppState._lastFinishedReceiptId = null;

  closeReceiptModal();
  saveLocalState();
  pushStateToCloud();
  renderAll();
  switchTab('cart', true);
  playCalmChime();
  showToast('Selesai belanja dibatalkan, keranjang Anda telah dipulihkan! ↩️', 'success');
}

// =========================================================================
// STRUK BELANJA SUPERMARKET ASLI (Thermal Digital Receipt) LOGIC
// =========================================================================

function formatReceiptDate(rawDate, rawTime) {
  try {
    const d = rawDate ? new Date(rawDate) : new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dayName = days[isNaN(d.getDay()) ? 1 : d.getDay()] || 'Senin';
    const dayNum = isNaN(d.getDate()) ? 16 : d.getDate();
    const monthName = months[isNaN(d.getMonth()) ? 10 : d.getMonth()] || 'Nov';
    const year = isNaN(d.getFullYear()) ? 2026 : d.getFullYear();
    let timeStr = rawTime || '17.07';
    timeStr = timeStr.replace(/:/g, '.');
    if (timeStr.split('.').length > 2) {
      timeStr = timeStr.split('.').slice(0, 2).join('.');
    }
    return `${dayName}, ${dayNum} ${monthName} ${year}, ${timeStr} WIB`;
  } catch (e) {
    return 'Senin, 16 Nov 2026, 17.07 WIB';
  }
}

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

      const prevRec = findPreviousPurchaseRecord(item.namaBarang, AppState.currentStore);
      const repurchaseAnalysis = getRepurchaseAnalysis(finalPrice, prevRec);

      return {
        namaBarang: item.namaBarang,
        qty: item.qty,
        satuan: item.satuan,
        hargaSatuan: rawPrice,
        hargaAkhirSatuan: finalPrice,
        subtotal: rowFinalSubtotal,
        diskonNominal: rowSavings,
        diskonTipe: item.diskonTipe,
        diskonValue: item.diskonValue,
        repurchaseAnalysis
      };
    });

    const grandTotal = Math.max(0, subtotalRaw - totalDiscount);
    const taxPpn = 1000; // Biaya Layanan

    receipt = {
      id: 'rec-' + Date.now(),
      tanggal: AppState.currentDate || new Date().toISOString().slice(0, 10),
      toko: AppState.currentStore || 'Supermarket',
      judul: `Belanja ${AppState.currentStore || 'Supermarket'}`,
      trxNo: 'LOTTE-' + (AppState.currentDate || new Date().toISOString().slice(0, 10)).replace(/-/g, '') + '-' + Math.floor(10000 + Math.random() * 90000),
      posNo: 'POS-0' + (Math.floor(Math.random() * 4) + 1),
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      kasir: 'Sistem Mandiri Lotte Mart',
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
  let branchText = 'Puri Indah Mall Lt. LG • Kembangan, Jakarta Barat';
  let addressText = '';

  if (storeRaw.includes('Lotte Mart')) {
    storeTitle = 'LOTTE MART GROCERY - PURI INDAH';
    branchText = 'Puri Indah Mall Lt. LG • Kembangan, Jakarta Barat';
  } else if (storeRaw.includes('Superindo')) {
    storeTitle = 'SUPERINDO - PURI INDAH';
    branchText = 'Cabang Kebon Jeruk, Jl. Pejuangan';
  } else if (storeRaw.includes('Grand Lucky')) {
    storeTitle = 'GRAND LUCKY SUPERSTORE';
    branchText = 'Cabang SCBD Lot 12';
  } else if (storeRaw.includes('Hypermart')) {
    storeTitle = 'HYPERMART - PURI INDAH';
    branchText = 'Puri Indah Mall Blok U1';
  } else if (storeRaw.includes(' - ')) {
    const parts = storeRaw.split(' - ');
    storeTitle = parts[0].toUpperCase() + ' - ' + parts[1].toUpperCase();
    branchText = 'Cabang ' + parts[1];
  }

  const elStoreName = document.getElementById('receiptStoreName');
  const elStoreBranch = document.getElementById('receiptStoreBranch');
  const elStoreAddress = document.getElementById('receiptStoreAddress');
  const elTrxNo = document.getElementById('receiptTrxNo');
  const elPosNo = document.getElementById('receiptPosNo');
  const elDateTime = document.getElementById('receiptDateTime');
  const elCashier = document.getElementById('receiptCashierName');
  const elCustomer = document.getElementById('receiptCustomerName');
  const elPaymentMethod = document.getElementById('receiptPaymentMethod');
  const elFooterStore = document.getElementById('receiptFooterStore');

  if (elStoreName) elStoreName.textContent = storeTitle;
  if (elStoreBranch) elStoreBranch.textContent = branchText;
  if (elStoreAddress) elStoreAddress.textContent = addressText;

  let trxVal = receipt.trxNo || '';
  if (!trxVal || !trxVal.includes('LOTTE')) {
    const dStr = (receipt.tanggal || new Date().toISOString().slice(0, 10)).replace(/-/g, '');
    const randSuffix = Math.floor(10000 + Math.random() * 90000);
    trxVal = 'LOTTE-' + dStr + '-' + randSuffix;
  } else {
    trxVal = trxVal.replace(/^TRX:\s*/, '');
  }
  if (elTrxNo) elTrxNo.textContent = trxVal;
  if (elPosNo) elPosNo.textContent = receipt.posNo || 'POS-02';

  const dateFormatted = formatReceiptDate(receipt.tanggal, receipt.waktu);
  if (elDateTime) elDateTime.textContent = dateFormatted;

  // Kasir: Sistem Mandiri Lotte Mart (sesuai referensi struk asli)
  const cashierDisplay = receipt.kasir || 'Sistem Mandiri Lotte Mart';
  if (elCashier) elCashier.textContent = cashierDisplay;
  receipt.kasir = cashierDisplay;

  // Pelanggan: Nama Pengguna (Evelina Metta Putri MB2)
  if (elCustomer) {
    const custName = (AppState.user && AppState.user.name) ? AppState.user.name : (AppState.currentUser && AppState.currentUser.displayName ? AppState.currentUser.displayName : 'Evelina Metta Putri MB2');
    elCustomer.textContent = custName;
  }

  // Metode Bayar
  if (elPaymentMethod) {
    elPaymentMethod.textContent = storeTitle.includes('LOTTE') ? 'QRIS Lotte Mart Instant' : 'QRIS Instant';
  }

  // Footer Store
  if (elFooterStore) {
    elFooterStore.textContent = storeTitle.includes('LOTTE') ? 'Lotte Mart Puri Indah' : (storeRaw || 'Supermarket');
  }

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
            <div class="receipt-item-headline">
              <span class="receipt-item-name">${escapeHtml(item.namaBarang)}</span>
              <span class="receipt-item-subtotal">${formatRupiah(rowSubtotal)}</span>
            </div>
            <div class="receipt-item-calc">
              <span>${item.qty} ${escapeHtml(item.satuan || 'pcs')} @ ${formatRupiah(unitPrice)}</span>
            </div>
            ${(item.repurchaseAnalysis && item.repurchaseAnalysis.isRepurchase && item.repurchaseAnalysis.status !== 'new') ? `
              <div class="receipt-item-repurchase-tag ${item.repurchaseAnalysis.diffClass}">
                ${item.repurchaseAnalysis.status === 'up' ? `  ↑ Naik +Rp ${formatNumber(item.repurchaseAnalysis.diff)} vs belanja lalu` : (item.repurchaseAnalysis.status === 'down' ? `  ↓ Hemat -Rp ${formatNumber(item.repurchaseAnalysis.absDiff)} vs belanja lalu` : '  = Harga sama dengan belanja lalu')}
              </div>
            ` : ''}
            ${hasDisc ? `
              <div class="receipt-item-discount">
                <span class="receipt-green-text">Hemat Voucher:</span>
                <span class="receipt-green-text">-${formatRupiah(discNominal)}</span>
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
  const serviceFee = 1000;
  const grandTotalVal = Math.max(0, subtotalVal - discountVal + serviceFee);
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
  if (elDiscount) elDiscount.textContent = discountVal > 0 ? ('-' + formatRupiah(discountVal)) : 'Rp 0';
  if (elDiscountRow) elDiscountRow.style.display = 'flex';
  if (elTax) elTax.textContent = formatRupiah(serviceFee);
  if (elGrandTotal) elGrandTotal.textContent = formatRupiah(grandTotalVal);
  if (elPaymentUsed) elPaymentUsed.textContent = formatRupiah(grandTotalVal);
  if (elRemainingBudget) elRemainingBudget.textContent = formatRupiah(remainingVal);

  // Highlight Kehematan Banner
  if (elSavingsBanner) {
    elSavingsBanner.style.display = 'flex';
    if (discountVal > 0) {
      elSavingsBanner.innerHTML = `<span class="savings-sparkle">🎉</span><span class="savings-text">Yeay! Kamu hemat <strong>${formatRupiah(discountVal)}</strong> hari ini ♡</span>`;
    } else {
      elSavingsBanner.innerHTML = `<span class="savings-sparkle">🌸</span><span class="savings-text">Belanja hemat & terkendali bersama Smart Grocery ♡</span>`;
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
    modal.classList.add('active', 'show');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    modal.scrollTop = 0;
  }
  document.body.style.overflow = 'hidden';
  // Mascot celebratory jump on shopping complete
  const mascot = document.getElementById('greetingMascot');
  if (mascot) {
    mascot.classList.remove('celebrating');
    void mascot.offsetWidth;
    mascot.classList.add('celebrating');
    setTimeout(() => { if (mascot) mascot.classList.remove('celebrating'); }, 800);
  }
  if (typeof HapticEngine !== 'undefined') HapticEngine.success();
}

function closeReceiptModal() {
  const modal = document.getElementById('receiptModal');
  if (modal) {
    modal.classList.remove('active', 'show');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
}

function printReceipt() {
  window.print();
}

function copyReceiptText() {
  const paper = document.getElementById('thermalReceiptPaper');
  if (!paper) return;

  const store = document.getElementById('receiptStoreName')?.textContent?.trim() || 'LOTTE MART GROCERY - PURI INDAH';
  const branch = document.getElementById('receiptStoreBranch')?.textContent?.trim() || 'Puri Indah Mall Lt. LG • Kembangan, Jakarta Barat';
  const dateStr = document.getElementById('receiptDateTime')?.textContent?.trim() || 'Senin, 16 Nov 2026, 17.07 WIB';
  const trx = document.getElementById('receiptTrxNo')?.textContent?.trim() || 'LOTTE-20261026-22511';
  const customer = document.getElementById('receiptCustomerName')?.textContent?.trim() || 'Evelina Metta Putri MB2';
  const cashier = document.getElementById('receiptCashierName')?.textContent?.trim() || 'Sistem Mandiri Lotte Mart';
  const subtotal = document.getElementById('receiptSubtotal')?.textContent?.trim() || 'Rp 0';
  const discount = document.getElementById('receiptDiscount')?.textContent?.trim() || 'Rp 0';
  const tax = document.getElementById('receiptTax')?.textContent?.trim() || 'Rp 1.000';
  const total = document.getElementById('receiptGrandTotal')?.textContent?.trim() || 'Rp 0';

  let itemsText = '';
  const itemEls = paper.querySelectorAll('.receipt-item-row');
  itemEls.forEach(el => {
    const name = el.querySelector('.receipt-item-name')?.textContent?.trim() || '';
    const calc = el.querySelector('.receipt-item-calc')?.textContent?.trim() || '';
    const sub = el.querySelector('.receipt-item-subtotal')?.textContent?.trim() || '';
    itemsText += `${name}\n  ${calc} -> ${sub}\n`;
  });

  const textToCopy = `================================
${store}
${branch}
${dateStr}
TRX: ${trx}
--------------------------------
Pelanggan : ${customer}
Kasir     : ${cashier}
--------------------------------
${itemsText}--------------------------------
Subtotal Belanja : ${subtotal}
Hemat Voucher    : ${discount}
Biaya Layanan    : ${tax}
--------------------------------
TOTAL AKHIR      : ${total}
================================
Terima kasih telah berbelanja dengan hati di ${store}!
Simpan struk ini sebagai catatan belanja sah.`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Teks struk berhasil disalin! 📋', 'success');
    }).catch(() => {
      fallbackCopyReceiptText(textToCopy);
    });
  } else {
    fallbackCopyReceiptText(textToCopy);
  }
}

function fallbackCopyReceiptText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('Teks struk berhasil disalin! 📋', 'success');
  } catch (err) {
    showToast('Gagal menyalin teks struk', 'warning');
  }
  document.body.removeChild(ta);
}

function openReceiptHistory() {
  closeReceiptModal();
  if (typeof switchTab === 'function') {
    switchTab('budget');
  }
  setTimeout(() => {
    const el = document.getElementById('receiptHistoryContainer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 250);
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
      <div class="pantry-card" style="background: var(--card-bg); border-radius: var(--radius-lg); padding: 12px 14px; border: 1px solid var(--border-soft); box-shadow: var(--shadow-soft); display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <div style="min-width: 0; flex: 1; word-break: break-word;">
          <div style="font-weight: 800; font-size: 0.92rem; color: var(--text-main); word-break: break-word; line-height: 1.3;">${escapeHtml(item.name)}</div>
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
// 12B. VISUAL PANTRY PRODUCT CATALOG (PRESET DATA & 1-TAP ADD)
// =========================================================================
const PANTRY_CATALOG = [
  { id: 'pan-cat-1', name: 'Beras 5kg', icon: '🌾', iconSvg: 'staple_rice', unit: 'karung/5kg', category: 'Kebutuhan Pokok', days: 90, desc: 'Bahan Pokok' },
  { id: 'pan-cat-2', name: 'Minyak Goreng', icon: '🍳', unit: 'pouch/2L', category: 'Minyak & Bumbu', days: 60, desc: 'Minyak Masak' },
  { id: 'pan-cat-3', name: 'Garam Dapur', icon: '🧂', unit: 'bungkus', category: 'Minyak & Bumbu', days: 180, desc: 'Bumbu Dapur' },
  { id: 'pan-cat-4', name: 'Gula Pasir', icon: '🍬', unit: 'kg', category: 'Minyak & Bumbu', days: 90, desc: 'Pemanis Dapur' },
  { id: 'pan-cat-5', name: 'Traditional English Tea', icon: '🫖', iconSvg: 'english_tea_tin', unit: 'kaleng', category: 'Minyak & Bumbu', days: 180, desc: 'Teh Seduh' },
  { id: 'pan-cat-6', name: 'Sabun Cuci', icon: '🍋', unit: 'pouch', category: 'Kebersihan', days: 60, desc: 'Kebersihan' },
  { id: 'pan-cat-7', name: 'Pasta Gigi', icon: '🪥', unit: 'tube', category: 'Kebersihan', days: 90, desc: 'Kebersihan Diri' },
  { id: 'pan-cat-8', name: 'Deterjen Bubuk', icon: '🧺', unit: 'bag', category: 'Kebersihan', days: 90, desc: 'Cuci Pakaian' }
];

let pantryCatalogExpanded = false;

function togglePantryCatalogExpand() {
  pantryCatalogExpanded = !pantryCatalogExpanded;
  renderPantryCatalog();
}

function renderPantryCatalog() {
  const container = document.getElementById('pantryCatalogGrid');
  if (!container) return;

  // Tampilkan 4 item saja secara default agar grid ringkas dan tidak scroll terlalu jauh
  const itemsToDisplay = pantryCatalogExpanded ? PANTRY_CATALOG : PANTRY_CATALOG.slice(0, 4);

  let html = itemsToDisplay.map(item => `
    <div class="catalog-card pantry-catalog-card" data-pantry-cat-id="${item.id}">
      <div class="catalog-thumb-wrap">
        ${renderCatalogItemThumb(item)}
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

  if (PANTRY_CATALOG.length > 4) {
    html += `
      <div style="grid-column: 1 / -1; text-align: center; margin-top: 6px; padding: 4px 0;">
        <button type="button" class="btn-catalog-toggle touch-target" onclick="togglePantryCatalogExpand()">
          ${pantryCatalogExpanded ? '▴ Tampilkan 4 Bahan Saja (Ringkas)' : `▾ Lihat ${PANTRY_CATALOG.length - 4} Bahan Lainnya`}
        </button>
      </div>
    `;
  }

  container.innerHTML = html;
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
    SoundEngine.play('modal_open');
  }
}

function closeAddPantryModal() {
  const modal = document.getElementById('addPantryModal');
  if (modal) {
    modal.classList.remove('active', 'show');
    SoundEngine.play('modal_close');
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
  SoundEngine.play('pantry_update');
  showToast(`"${name}" disimpan ke Pantry 🧺`, 'success');
}

async function removePantryItem(id) {
  const item = (AppState.pantry || []).find(p => p.id === id);
  const name = item ? item.name : 'Item pantry';
  const confirmed = await showAppModalBubble({
    title: 'Hapus dari Pantry',
    message: `Hapus "${name}" dari stok pantry Anda?`,
    icon: '🧺',
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal'
  });
  if (!confirmed) return;
  AppState.pantry = AppState.pantry.filter(p => p.id !== id);
  saveLocalState();
  pushStateToCloud();
  renderPantry();
  playSoftPop();
  showToast(`"${name}" dihapus dari pantry`, 'info');
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
    showToast(`"${val}" ditambahkan ke Anti\u2011List 🛑`, 'info');
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
function updateBudgetPresetChips(currentBudget = AppState.budget) {
  const targetAmt = parseInt(currentBudget, 10);
  const chips = document.querySelectorAll('.budget-preset-chip');
  chips.forEach(chip => {
    const chipAmt = parseInt(chip.getAttribute('data-amount'), 10);
    if (chipAmt === targetAmt) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

function openBudgetModal() {
  const modal = document.getElementById('budgetModal');
  const amountInput = document.getElementById('modalBudgetAmount');
  const cycleSelect = document.getElementById('modalBudgetCycle');

  if (amountInput) amountInput.value = AppState.budget;
  if (cycleSelect) cycleSelect.value = AppState.budgetPeriod;
  updateBudgetPresetChips(AppState.budget);
  if (modal) {
    modal.classList.add('active', 'show');
    SoundEngine.play('modal_open');
  }
}

function closeBudgetModal() {
  const modal = document.getElementById('budgetModal');
  if (modal) {
    modal.classList.remove('active', 'show');
    SoundEngine.play('modal_close');
  }
}

function setModalQuickBudget(amt) {
  const amountInput = document.getElementById('modalBudgetAmount');
  if (amountInput) amountInput.value = amt;
  updateBudgetPresetChips(amt);
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

function setQuickBudgetAmount(amt, btnEl) {
  if (btnEl) {
    btnEl.classList.add('chip-tapped');
    setTimeout(() => btnEl.classList.remove('chip-tapped'), 280);
  } else {
    const chip = document.querySelector(`.budget-preset-chip[data-amount="${amt}"]`);
    if (chip) {
      chip.classList.add('chip-tapped');
      setTimeout(() => chip.classList.remove('chip-tapped'), 280);
    }
  }
  AppState.budget = amt;
  localStorage.setItem(STORAGE_KEYS.BUDGET, amt);
  const slider = document.getElementById('budgetSlider');
  if (slider) slider.value = amt;
  const display = document.getElementById('budgetLiveValueDisplay');
  if (display) display.textContent = formatRupiah(amt);
  const amtInput = document.getElementById('configBudgetAmount');
  if (amtInput) amtInput.value = amt;
  const modalAmtInput = document.getElementById('modalBudgetAmount');
  if (modalAmtInput) modalAmtInput.value = amt;

  updateBudgetPresetChips(amt);
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
  updateBudgetPresetChips(amount);
  pushStateToCloud();
}

function adjustBudgetByDelta(delta, btnEl) {
  if (btnEl) {
    btnEl.classList.add('chip-tapped');
    setTimeout(() => btnEl.classList.remove('chip-tapped'), 280);
  }
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
  updateBudgetPresetChips(newBudget);
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
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; gap: 8px;">
        <div style="flex: 1; min-width: 0;">
          <span style="display: block; font-size: 0.68rem; color: var(--text-faint); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.tanggal} • ${escapeHtml(r.toko || 'Lotte Mart')}</span>
          <div style="font-weight: 800; font-size: 0.86rem; color: var(--text-main); white-space: normal; word-break: break-word;">${escapeHtml(r.judul)}</div>
        </div>
        <span class="price-tag receipt-total-val" style="font-weight: 900; font-size: 0.88rem; color: var(--rose-contrast); white-space: nowrap !important; flex-shrink: 0 !important; text-align: right;">${formatRupiah(r.totalBelanja)}</span>
      </div>
      <div style="font-size: 0.7rem; color: var(--text-subtle); margin-top: 2px;">
        ${(r.items || []).map(i => `${escapeHtml(i.namaBarang)} (${i.qty} ${i.satuan})`).join(', ')}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 6px; border-top: 1px dashed var(--pastel-light-1);">
        <span style="font-size: 0.68rem; color: var(--text-faint); font-weight: 600;">${(r.items || []).length} jenis barang</span>
        <button type="button" class="btn-demo-quick" style="margin: 0; padding: 4px 10px; font-size: 0.68rem; font-weight: 700; color: #B95679;" onclick="viewHistoricalReceipt('${r.id}')">🧾 Lihat Struk Asli</button>
      </div>
    </div>
  `).join('');
}

async function clearHistory() {
  if (!AppState.receipts || AppState.receipts.length === 0) {
    showToast('Riwayat struk belanja masih kosong!', 'info');
    return;
  }
  const confirmed = await showAppModalBubble({
    title: 'Hapus Riwayat Struk',
    message: 'Apakah Anda yakin ingin menghapus seluruh riwayat struk belanja? Tindakan ini tidak dapat dibatalkan.',
    icon: '🗑️',
    confirmText: 'Ya, Hapus Semua',
    cancelText: 'Batal'
  });
  if (!confirmed) return;

  AppState.receipts = [];
  saveLocalState();
  pushStateToCloud();
  renderHistory();
  showToast('Riwayat struk telah dibersihkan ✨', 'info');
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

  // Dynamic logged-in user profile update in sync modal
  const nameEl = document.getElementById('syncUserAccountName');
  const emailEl = document.getElementById('syncUserAccountEmail');
  const avatarEl = document.getElementById('syncUserAccountAvatar');
  if (nameEl) nameEl.textContent = AppState.user ? AppState.user.name : 'Pengguna Tamu';
  if (emailEl) emailEl.textContent = AppState.user ? AppState.user.email : 'Belum masuk akun';
  if (avatarEl && AppState.user) {
    const photo = AppState.user.photo;
    if (photo && (photo.startsWith('http') || photo.startsWith('data:image'))) {
      avatarEl.innerHTML = `<img src="${photo}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else {
      avatarEl.textContent = photo || '👤';
    }
  }

  const modal = document.getElementById('cloudSyncModal');
  if (modal) {
    modal.classList.add('active', 'show');
    SoundEngine.play('modal_open');
  }
}

function closeCloudSyncModal() {
  const modal = document.getElementById('cloudSyncModal');
  if (modal) {
    modal.classList.remove('active', 'show');
    SoundEngine.play('modal_close');
  }
}

function forcePushSingleUserCloud() {
  try {
    pushStateToCloud(true);
    SoundEngine.play('sync_success');
    showToast('Data berhasil dicadangkan ke Cloud Firestore! ☁️', 'success');
  } catch (err) {
    console.error('Push cloud error:', err);
    showToast('Gagal mencadangkan data ke Cloud', 'danger');
  }
}

async function forcePullSingleUserCloud() {
  try {
    if (!firestoreDb) {
      showToast('Firebase belum terhubung. Berjalan dalam mode offline.', 'warning');
      return;
    }
    const userDocRef = getUserDocRef();
    if (!userDocRef) {
      showToast('Sesi pengguna belum aktif.', 'warning');
      return;
    }
    showToast('Mengambil data cadangan dari Cloud... 📥', 'info');
    const docSnapshot = await userDocRef.get();
    if (docSnapshot && docSnapshot.exists) {
      const data = docSnapshot.data();
      applyRemoteState(data);
      SoundEngine.play('sync_success');
      showToast('Data berhasil dipulihkan dari Cloud! ☁️✨', 'success');
    } else {
      showToast('Belum ada cadangan data di Cloud untuk akun ini.', 'info');
    }
  } catch (err) {
    console.error('Pull cloud error:', err);
    showToast('Gagal memulihkan dari Cloud: ' + (err.message || err), 'danger');
  }
}

function exportLocalJsonBackup() {
  try {
    const backupData = {
      app: 'Smart Grocery Price Tracker',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      user: AppState.user ? { name: AppState.user.name, email: AppState.user.email, uid: AppState.user.uid } : null,
      currentStore: AppState.currentStore,
      currentDate: AppState.currentDate,
      budget: AppState.budget,
      cart: AppState.cart,
      pantry: AppState.pantry,
      history: AppState.history,
      receipts: AppState.receipts || []
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sgt-backup-${AppState.currentDate || new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Cadangan data berhasil diunduh (JSON)! 💾', 'success');
  } catch (err) {
    console.error('Export error:', err);
    showToast('Gagal mengunduh cadangan JSON', 'danger');
  }
}

function saveCustomFirebaseConfig() {
  const customJsonInput = document.getElementById('customFirebaseJson');
  if (!customJsonInput || !customJsonInput.value.trim()) {
    showToast('Masukkan konfigurasi JSON Firebase!', 'warning');
    return;
  }
  try {
    const parsedConfig = JSON.parse(customJsonInput.value.trim());
    localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(parsedConfig));
    initFirestoreSync();
    setTimeout(syncLocalAccountsToCloud, 600);
    showToast('Konfigurasi Firebase berhasil disimpan! ⚙️', 'success');
  } catch (err) {
    showToast('Format JSON Firebase tidak valid: ' + (err.message || ''), 'danger');
  }
}

let pendingModalBubbleResolver = null;

function handleModalBubbleAction(confirmed) {
  const modal = document.getElementById('appModalBubble');
  const inputEl = document.getElementById('modalBubbleInput');
  const inputValue = inputEl ? inputEl.value : '';

  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active', 'show');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (pendingModalBubbleResolver) {
    pendingModalBubbleResolver(confirmed ? (inputValue || true) : false);
    pendingModalBubbleResolver = null;
  }
}

function showAppModalBubble({
  title = 'Konfirmasi',
  message = '',
  icon = '✨',
  showInput = false,
  inputPlaceholder = '',
  defaultValue = '',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal'
} = {}) {
  return new Promise((resolve) => {
    pendingModalBubbleResolver = resolve;
    const modal = document.getElementById('appModalBubble');
    const titleEl = document.getElementById('modalBubbleTitle');
    const msgEl = document.getElementById('modalBubbleMessage');
    const iconEl = document.getElementById('modalBubbleIcon');
    const inputWrap = document.getElementById('modalBubbleInputWrap');
    const inputEl = document.getElementById('modalBubbleInput');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (iconEl) iconEl.textContent = icon;
    const btnCancel = document.getElementById('modalBubbleBtnCancel');
    const btnConfirm = document.getElementById('modalBubbleBtnConfirm');
    if (btnCancel) btnCancel.textContent = cancelText;
    if (btnConfirm) btnConfirm.textContent = confirmText;

    if (inputWrap && inputEl) {
      if (showInput) {
        inputWrap.style.display = 'block';
        inputEl.placeholder = inputPlaceholder;
        inputEl.value = defaultValue;
        setTimeout(() => inputEl.focus(), 100);
      } else {
        inputWrap.style.display = 'none';
      }
    }

    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('active', 'show');
      modal.setAttribute('aria-hidden', 'false');
    }
  });
}

if (typeof window !== 'undefined') {
  window.forcePushSingleUserCloud = forcePushSingleUserCloud;
  window.forcePullSingleUserCloud = forcePullSingleUserCloud;
  window.exportLocalJsonBackup = exportLocalJsonBackup;
  window.saveCustomFirebaseConfig = saveCustomFirebaseConfig;
  window.handleModalBubbleAction = handleModalBubbleAction;
  window.showAppModalBubble = showAppModalBubble;
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
      setTimeout(syncLocalAccountsToCloud, 600);
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
  const isDark = !document.body.classList.contains('dark-mode') && !document.body.classList.contains('theme-dark');
  applyTheme(isDark);
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDark.toString());
  showToast(isDark ? 'Mode Gelap (Night Rose) diaktifkan 🌙' : 'Mode Terang diaktifkan ☀️', 'info');
}

function applyTheme(isDark) {
  const metaTheme = document.getElementById('themeColorMeta');
  const toggleBtn = document.getElementById('btnThemeToggle');
  const settingsToggle = document.getElementById('settingsThemeToggle');

  if (isDark) {
    document.body.classList.add('dark-mode', 'theme-dark');
    document.documentElement.classList.add('dark-mode', 'theme-dark');
    if (metaTheme) metaTheme.setAttribute('content', '#160810');
    if (toggleBtn) toggleBtn.textContent = '☀️';
    if (settingsToggle) settingsToggle.checked = true;
  } else {
    document.body.classList.remove('dark-mode', 'theme-dark');
    document.documentElement.classList.remove('dark-mode', 'theme-dark');
    if (metaTheme) metaTheme.setAttribute('content', '#FCE7F3');
    if (toggleBtn) toggleBtn.textContent = '🌙';
    if (settingsToggle) settingsToggle.checked = false;
  }
}

// =========================================================================
// 16B. PROFILE & SETTINGS MODAL (Soft Pink Clean Style)
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
  updateModalAvatar(userPhoto);
  updateHeaderAvatar(userPhoto);

  // Render Kawaii Art Presets (Canva Vector Style)
  if (typeof renderAvatarPresets === 'function') {
    renderAvatarPresets();
  }

  // Update auth provider badge chip (Google vs Email)
  const authChipText = document.getElementById('modalAuthChipText');
  if (authChipText) {
    const isGoogle = (user && (user.authProvider === 'google' || (user.providerData && user.providerData.some(p => p.providerId === 'google.com'))));
    authChipText.textContent = isGoogle ? '✓ Terhubung Akun Google' : '✓ Akun Email Terdaftar';
  }

  // 2. Populate Dark Mode toggle switch
  const themeToggle = document.getElementById('settingsThemeToggle');
  if (themeToggle) {
    themeToggle.checked = document.body.classList.contains('dark-mode') || document.body.classList.contains('theme-dark');
  }

  // 3. Populate Japanese Sound Design Settings
  const soundToggle = document.getElementById('settingsSoundToggle');
  if (soundToggle) {
    soundToggle.checked = AppState.soundEnabled !== false;
  }
  const soundVolSlider = document.getElementById('settingsSoundVolume');
  if (soundVolSlider) {
    const vol = (typeof AppState.soundVolume === 'number') ? AppState.soundVolume : 0.75;
    const volPercent = Math.round(vol * 100);
    soundVolSlider.value = volPercent;
    const label = document.getElementById('soundVolumeLabel');
    if (label) label.textContent = `Kekuatan suara mikro-interaksi (${volPercent}%)`;
    const percent = document.getElementById('soundVolumePercent');
    if (percent) percent.textContent = `${volPercent}%`;
  }
  const soundThemeSelect = document.getElementById('settingsSoundTheme');
  if (soundThemeSelect) {
    soundThemeSelect.value = AppState.soundTheme || 'kawaii';
  }

  // 4. Populate PWA status
  updatePwaInstallUI();

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
  SoundEngine.play('modal_open');
}

function closeProfileSettingsModal() {
  const modal = document.getElementById('profileSettingsModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('open', 'active', 'show');
    modal.setAttribute('aria-hidden', 'true');
    SoundEngine.play('modal_close');
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
  showToast(checked ? 'Suara Feedback Jepang Aktif 🌸🔊' : 'Suara Dibisukan 🔇', 'info');
  if (checked) {
    SoundEngine.play('welcome');
  }
}

function changeSoundVolume(val) {
  const num = parseInt(val, 10);
  const vol = num / 100;
  SoundEngine.setVolume(vol);
  const label = document.getElementById('soundVolumeLabel');
  if (label) label.textContent = `Kekuatan suara mikro-interaksi (${num}%)`;
  const percent = document.getElementById('soundVolumePercent');
  if (percent) percent.textContent = `${num}%`;
}

function changeSoundTheme(theme) {
  SoundEngine.setTheme(theme);
  const themeNames = {
    kawaii: 'Japanese Soft Kawaii 🌸',
    musicbox: 'Kotak Musik Celesta 🎵',
    zen: 'Zen Furin & Bambu 🎐'
  };
  showToast(`Tema suara diubah: ${themeNames[theme] || theme}`, 'info');
  SoundEngine.play('welcome');
}

function previewCurrentSoundTheme() {
  SoundEngine.play('checkout');
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

async function handleProfileLogout() {
  const confirmed = await showAppModalBubble({
    title: 'Keluar dari Akun',
    message: 'Apakah Anda yakin ingin keluar dari akun Anda saat ini?',
    icon: '🚪',
    confirmText: 'Ya, Keluar Akun',
    cancelText: 'Tetap Masuk'
  });
  if (!confirmed) return;

  closeProfileSettingsModal();
  promptLogout(true);
}

// =========================================================================
// 17. TAB SWITCHING (ICON-ONLY BOTTOM DOCK)
// =========================================================================
function switchTab(tab, force = false) {
  if (AppState.currentTab === tab && !force) return;
  AppState.currentTab = tab;
  SoundEngine.play('nav_switch');
  try {
    localStorage.setItem('smart_grocery_current_tab', tab);
    const uid = (AppState.user && AppState.user.uid) ? AppState.user.uid : 'guest';
    localStorage.setItem('grocery_tab_' + uid, tab);
  } catch (e) { }

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

  // Update floating controls state dynamically (FAB disabled to prevent mobile tap collision)
  const fab = document.getElementById('fabStoreMode');
  const runningBar = document.getElementById('runningCartBar');

  if (runningBar) runningBar.classList.add('d-none');
  if (fab) fab.style.display = 'none';

  // Synchronize segmented buttons between planner and cart
  const btnPlanner = document.getElementById('btnViewPlanner');
  const btnCart = document.getElementById('btnViewCart');
  if (btnPlanner) btnPlanner.classList.toggle('active', tab === 'planner');
  if (btnCart) btnCart.classList.toggle('active', tab === 'cart');

  if (tab === 'cart') {
    renderCartSection();
    syncCartBottomPadding();
  } else if (tab === 'planner') {
    renderItems();
  } else if (tab === 'budget') {
    renderBudget();
  } else if (tab === 'pantry') {
    if (typeof renderPantry === 'function') renderPantry();
  }
  syncCartBottomPadding();
}

// Fallback aliases to protect against any missing reference calls
window.renderCart = renderCartSection;
window.renderPlanner = renderItems;

// =========================================================================
// 18. RESET DEMO DATA
// =========================================================================
async function resetToInitialMockData() {
  if (AppState.cart && AppState.cart.length > 0) {
    const confirmed = await showAppModalBubble({
      title: 'Muat Contoh Data',
      message: 'Perhatian: Memuat contoh data akan menggantikan daftar belanjaan Anda saat ini. Lanjutkan?',
      icon: '📦',
      confirmText: 'Ya, Gantikan',
      cancelText: 'Batal'
    });
    if (!confirmed) return;
  }
  AppState.cart = JSON.parse(JSON.stringify(DEFAULT_CART_ITEMS));
  AppState.currentStore = 'Lotte Mart Grocery - Puri Indah';
  AppState.currentDate = new Date().toISOString().split('T')[0];
  AppState.budget = 100000;
  AppState.priceHistory = JSON.parse(JSON.stringify(DEFAULT_PRICE_HISTORY));
  AppState.receipts = JSON.parse(JSON.stringify(DEFAULT_RECEIPTS));
  AppState.pantry = JSON.parse(JSON.stringify(DEFAULT_PANTRY));
  AppState.blacklist = [...DEFAULT_BLACKLIST];

  saveLocalState();
  pushStateToCloud();
  renderAll();
  showToast('Contoh data belanja berhasil dimuat kembali! ✨', 'success');
}

// =========================================================================
// 19. PWA INSTALL PROMPT & INSTALL GUIDE (KOMPUTER & HP)
// =========================================================================
function isAppStandalone() {
  if (typeof window === 'undefined') return false;
  const isStandaloneMatch = window.matchMedia && (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches
  );
  return Boolean(isStandaloneMatch || (window.navigator && window.navigator.standalone === true));
}

function updatePwaInstallUI() {
  const isStandalone = isAppStandalone();
  const headerBtn = document.getElementById('btnHeaderInstallPwa');
  const modalBtn = document.getElementById('modalBtnInstallPwa');
  const modalBadge = document.getElementById('modalPwaInstalledBadge');
  const directBox = document.getElementById('pwaDirectInstallBox');

  // Keep header neat & concise as requested by user (hidden from top bar)
  if (headerBtn) {
    headerBtn.style.setProperty('display', 'none', 'important');
    headerBtn.classList.add('hidden');
  }

  // Inside Profile Settings: show exactly ONE element (either Install button OR Installed badge)
  if (isStandalone) {
    if (modalBtn) {
      modalBtn.style.setProperty('display', 'none', 'important');
      modalBtn.classList.add('hidden');
    }
    if (modalBadge) {
      modalBadge.style.setProperty('display', 'inline-flex', 'important');
      modalBadge.classList.remove('hidden');
    }
    if (directBox) directBox.style.display = 'none';
  } else {
    if (modalBtn) {
      modalBtn.style.setProperty('display', 'inline-flex', 'important');
      modalBtn.classList.remove('hidden');
    }
    if (modalBadge) {
      modalBadge.style.setProperty('display', 'none', 'important');
      modalBadge.classList.add('hidden');
    }
    if (directBox) directBox.style.display = AppState.deferredInstallPrompt ? 'block' : 'none';
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    AppState.deferredInstallPrompt = e;
    updatePwaInstallUI();
    setTimeout(checkAndShowPwaBanner, 2200);
  });

  window.addEventListener('appinstalled', () => {
    AppState.deferredInstallPrompt = null;
    hidePwaInstallBanner();
    showToast('Aplikasi Smart Grocery berhasil dipasang! 🎉', 'success');
    try {
      localStorage.setItem('sgt_pwa_dismissed_until', String(Date.now() + 365 * 24 * 60 * 60 * 1000));
    } catch (e) { }
    updatePwaInstallUI();
    closePwaInstallGuideModal();
  });
}

/**
 * PWA Install Bottom Prompt Banner (Inspirasi Mie Gacoan A2HS Popup)
 */
function checkAndShowPwaBanner() {
  if (typeof window === 'undefined') return;
  // Jangan tampilkan jika sudah dalam standalone mode (sudah terpasang)
  if (isAppStandalone()) return;
  // Jangan tampilkan jika user belum terautentikasi (hindari menutupi form login)
  if (!AppState.user) return;
  // Jangan tampilkan jika user menekan "NANTI SAJA" baru-baru ini (cooldown 3 hari)
  const dismissedUntil = localStorage.getItem('sgt_pwa_dismissed_until');
  if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) return;

  const banner = document.getElementById('pwaInstallBanner');
  if (banner) {
    banner.style.display = 'block';
    // Trigger reflow untuk animasi slide-up mulus
    void banner.offsetWidth;
    banner.classList.add('show');
  }
}

function hidePwaInstallBanner() {
  if (typeof document === 'undefined') return;
  const banner = document.getElementById('pwaInstallBanner');
  if (banner) {
    banner.classList.remove('show');
    setTimeout(() => {
      if (banner && !banner.classList.contains('show')) {
        banner.style.display = 'none';
      }
    }, 400);
  }
}

function dismissPwaInstallBanner() {
  hidePwaInstallBanner();
  // Simpan cooldown 3 hari agar tidak mengganggu user secara berulang
  try {
    localStorage.setItem('sgt_pwa_dismissed_until', String(Date.now() + 3 * 24 * 60 * 60 * 1000));
  } catch (e) { }
}

function acceptPwaInstallBanner() {
  hidePwaInstallBanner();
  if (AppState.deferredInstallPrompt) {
    AppState.deferredInstallPrompt.prompt();
    AppState.deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult && choiceResult.outcome === 'accepted') {
        showToast('Memasang Smart Grocery ke perangkat... 🚀', 'success');
        try {
          localStorage.setItem('sgt_pwa_dismissed_until', String(Date.now() + 365 * 24 * 60 * 60 * 1000));
        } catch (e) { }
      } else {
        dismissPwaInstallBanner();
      }
      AppState.deferredInstallPrompt = null;
      updatePwaInstallUI();
    }).catch(() => {
      openPwaInstallGuideModal();
    });
  } else {
    // Browser yang butuh petunjuk manual (seperti Safari iOS)
    openPwaInstallGuideModal();
  }
}

function installPwa() {
  if (isAppStandalone()) {
    showToast('Aplikasi sudah terpasang dan berjalan dalam mode aplikasi ✨', 'info');
    return;
  }
  if (AppState.deferredInstallPrompt) {
    AppState.deferredInstallPrompt.prompt();
    AppState.deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult && choiceResult.outcome === 'accepted') {
        showToast('Memasang Smart Grocery ke perangkat... 🚀', 'success');
        updatePwaInstallUI();
      } else {
        showToast('Instalasi ditutup. Anda dapat memasangnya kapan saja.', 'info');
      }
      AppState.deferredInstallPrompt = null;
    }).catch(() => {
      openPwaInstallGuideModal();
    });
  } else {
    openPwaInstallGuideModal();
  }
}

function triggerDirectPwaInstall() {
  if (AppState.deferredInstallPrompt) {
    AppState.deferredInstallPrompt.prompt();
    AppState.deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult && choiceResult.outcome === 'accepted') {
        showToast('Memasang Smart Grocery ke perangkat... 🚀', 'success');
        closePwaInstallGuideModal();
        updatePwaInstallUI();
      }
      AppState.deferredInstallPrompt = null;
    });
  } else {
    showToast('Silakan ikuti petunjuk manual sesuai perangkat Anda di bawah ini 👇', 'info');
  }
}

function openPwaInstallGuideModal() {
  const modal = document.getElementById('pwaInstallGuideModal');
  const directBox = document.getElementById('pwaDirectInstallBox');
  if (directBox) {
    directBox.style.display = AppState.deferredInstallPrompt ? 'block' : 'none';
  }
  if (modal) {
    closeProfileSettingsModal();
    modal.classList.add('active', 'show');
  }
}

function closePwaInstallGuideModal() {
  const modal = document.getElementById('pwaInstallGuideModal');
  if (modal) {
    modal.classList.remove('active', 'show');
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

  // Guard: Never display budget or saldo alerts when user is on the login screen (unauthenticated)
  if (!AppState.user && (message.includes('saldo') || message.includes('belanja') || message.includes('limit'))) {
    return;
  }

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

  // Buat SATU elemen toast baru dengan format bertingkat 2 baris (intentional multi-tier layout)
  const toast = document.createElement('div');
  toast.className = `app-toast toast-message ${type}`;

  let icon = '✨';
  if (type === 'danger' || type === 'error') {
    icon = '🚨';
    SoundEngine.play('error');
  } else if (type === 'success') {
    icon = '🌸';
  } else if (type === 'warning') {
    icon = '⚠️';
  }

  // Bersihkan emoji di awal teks pesan agar tidak terjadi ikon ganda dengan ikon bawaan toast
  const cleanMessage = (message || '').replace(/^([\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}]+\s*)+/u, '').trim();

  // Pecah pesan menjadi 2 baris bertingkat hanya jika memuat titik dua (:) atau kalimat kedua nyata
  // (BUKAN sekadar emoji seperti ✨ atau tanda baca pendek)
  const isMeaningfulText = (t) => {
    if (!t) return false;
    const stripped = t.replace(/[\p{Emoji}\p{P}\s]/gu, '');
    return stripped.length >= 4;
  };

  let contentHtml = '';
  if (cleanMessage.includes(':')) {
    const colonIdx = cleanMessage.indexOf(':');
    const titlePart = cleanMessage.substring(0, colonIdx).trim();
    const descPart = cleanMessage.substring(colonIdx + 1).trim();
    if (isMeaningfulText(descPart)) {
      contentHtml = `
        <div class="toast-stacked-wrap">
          <div class="toast-title">${escapeHtml(titlePart)}</div>
          <div class="toast-desc">${escapeHtml(descPart)}</div>
        </div>
      `;
    }
  } else if (cleanMessage.includes('!') && cleanMessage.length > 40) {
    const exclIdx = cleanMessage.indexOf('!');
    const titlePart = cleanMessage.substring(0, exclIdx + 1).trim();
    const descPart = cleanMessage.substring(exclIdx + 1).trim();
    if (isMeaningfulText(descPart)) {
      contentHtml = `
        <div class="toast-stacked-wrap">
          <div class="toast-title">${escapeHtml(titlePart)}</div>
          <div class="toast-desc">${escapeHtml(descPart)}</div>
        </div>
      `;
    }
  }

  if (!contentHtml) {
    contentHtml = `
      <div class="toast-stacked-wrap">
        <div class="toast-desc single-flow">${escapeHtml(cleanMessage)}</div>
      </div>
    `;
  }

  toast.innerHTML = `<span class="toast-icon">${icon}</span>${contentHtml}`;
  container.appendChild(toast);
  attachSwipeToDismiss(toast);

  const isUndoToast = message.includes('Urungkan');
  if (isUndoToast) {
    toast.style.cursor = 'pointer';
    toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
    toast.onclick = () => {
      if (AppState._lastDeletedItem && typeof undoDeleteItem === 'function') {
        undoDeleteItem();
        toast.remove();
      }
    };
  } else {
    // Tidak menutup instan dengan sekali ketuk; interaksi penutupan hanya via drag-away (swipe-to-dismiss)
    toast.style.cursor = 'grab';
  }

  // Pasang timer otomatis hilang (5 detik untuk undo, 2.5 detik untuk notifikasi biasa)
  const duration = isUndoToast ? 5000 : 2500;
  activeToastTimeout = setTimeout(() => {
    toast.classList.add('fade-out');
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-12px)';
    toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 250);
  }, duration);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Close modal when tapping on backdrop outside modal card with proper cleanup
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
      const modalId = e.target.id;
      if (modalId === 'deleteConfirmModal') {
        closeDeleteConfirmModal();
      } else if (modalId === 'quickPriceModal') {
        closeQuickPriceModal(false);
      } else if (modalId === 'addItemModal') {
        closeDetailedItemModal();
      } else if (modalId === 'productScannerModal') {
        closeProductScannerModal();
      } else if (modalId === 'budgetModal') {
        closeBudgetModal();
      } else if (modalId === 'addPantryModal') {
        closeAddPantryModal();
      } else if (modalId === 'blacklistManagerModal') {
        closeBlacklistManagerModal();
      } else if (modalId === 'cloudSyncModal') {
        closeCloudSyncModal();
      } else if (modalId === 'storePickerModal') {
        closeStorePickerModal();
      } else if (modalId === 'itemPickerModal') {
        closeItemPickerModal();
      } else if (modalId === 'cancelShoppingModal') {
        closeCancelShoppingModal();
      } else {
        e.target.classList.remove('active', 'show');
        if (e.target.style) e.target.style.display = 'none';
      }
    }
  });
}

// =========================================================================
// 21. APP INITIALIZATION
// =========================================================================
function initApp() {
  isInitialAppLoad = true;
  AppState.previousSafetyLevel = null;
  purgeLegacyAudreyData();
  initTheme();
  loadLocalState();
  closeReceiptModal();
  closeCancelShoppingModal();
  initFirestoreSync();
  setTimeout(syncLocalAccountsToCloud, 600);
  document.body.classList.toggle('in-store-mode-active', !!AppState.inStoreMode);

  const fabIcon = document.getElementById('fabIcon');
  const fabText = document.getElementById('fabText');
  const runningBar = document.getElementById('runningCartBar');
  const instoreCard = document.getElementById('inStoreCompanionCard');
  if (AppState.inStoreMode) {
    if (fabIcon) fabIcon.textContent = '📋';
    if (fabText) fabText.textContent = 'Mode Rencana';
    if (runningBar) runningBar.classList.add('d-none'); runningBar.style.display = 'none';
    if (instoreCard) instoreCard.style.display = 'block';
  } else {
    if (fabIcon) fabIcon.textContent = '🛒';
    if (fabText) fabText.textContent = 'Mulai Belanja';
    if (runningBar) runningBar.classList.add('d-none');
    if (instoreCard) instoreCard.style.display = 'none';
  }

  checkAuth();
  switchTab(AppState.currentTab || 'planner', true);
  initDiscountChips();
  renderAll();
  updatePwaInstallUI();
  syncAppHeaderHeight();
  if (typeof window !== 'undefined' && window.ResizeObserver) {
    const headerEl = document.querySelector('.app-header');
    if (headerEl) {
      new ResizeObserver(() => syncAppHeaderHeight()).observe(headerEl);
    }
  }

  // Allow initial rendering pass to settle quietly without firing unsolicited toasts
  setTimeout(() => {
    isInitialAppLoad = false;
  }, 600);

  // Periksa apakah prompt install PWA (ala Mie Gacoan) layak ditampilkan
  setTimeout(checkAndShowPwaBanner, 2800);
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initApp);
}

// Synchronize dynamic app header height for sticky tracker and subheaders
function syncAppHeaderHeight() {
  const header = document.querySelector('.app-header');
  const overbudgetBanner = document.getElementById('overbudget-firm-banner');
  const isOverbudgetBannerVisible = overbudgetBanner && !overbudgetBanner.classList.contains('hidden') && overbudgetBanner.offsetHeight > 0;
  if (header) {
    const rect = header.getBoundingClientRect();
    let h = Math.ceil(rect.height);
    if (!isOverbudgetBannerVisible) {
      h = Math.min(Math.max(h, 52), 56);
    }
    if (h > 0) {
      document.documentElement.style.setProperty('--app-header-height', `${h}px`);
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', syncAppHeaderHeight, { passive: true });
  window.addEventListener('orientationchange', syncAppHeaderHeight, { passive: true });
  window.addEventListener('load', syncAppHeaderHeight, { passive: true });
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

  // If still not matched, check user's custom collection
  if (!matched && Array.isArray(AppState.userCustomItems)) {
    const qLower = barcodeOrQuery.toLowerCase();
    const custom = AppState.userCustomItems.find(p => p.name.toLowerCase().includes(qLower));
    if (custom) {
      matched = {
        barcode: 'KOLEKSI-USER',
        name: custom.name,
        category: custom.category || 'Kebutuhan Pokok',
        unit: custom.unit || 'pcs',
        price: custom.price || 15000,
        historyPrice: findLatestItemPrice(custom.name, AppState.currentStore) || custom.price || 15000
      };
    }
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
      historyPrice: findLatestItemPrice(barcodeOrQuery, AppState.currentStore) || 15000
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

  const confirmBtn = document.getElementById('btnConfirmScannedAdd');
  if (confirmBtn) {
    if (projectedRemaining < 0 || isUserOverbudget(subtotal)) {
      confirmBtn.classList.add('overbudget-blocked');
      confirmBtn.title = 'Tidak bisa menambah: melebihi batas saldo anggaran dompet!';
    } else {
      confirmBtn.classList.remove('overbudget-blocked');
      confirmBtn.title = '';
    }
  }
}

function confirmAddScannedProduct() {
  if (!currentScannedItem) return;

  const prod = currentScannedItem;
  const qty = currentScannedQty;
  const addedCost = (prod.price || 0) * (qty || 1);

  if (checkOverbudgetBlock('menambah barang hasil scan barcode', addedCost)) return;

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

  // Simpan ke preferensi belanja produk kustom user jika item baru
  saveUserCustomItem({
    name: prod.name,
    category: prod.category || detectCategory(prod.name),
    unit: prod.unit || 'pcs',
    price: prod.price || 0
  });

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
// DEDICATED COMPACT CART & QUICK DISCOUNT POPOVER
// =========================================================================

/**
 * Render Dedicated Keranjang Belanja Khusus (Compact Cart -  & UX)
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

  const inCartItems = AppState.cart.filter(i => i.checked);
  const unboughtItems = AppState.cart.filter(i => !i.checked);
  const hasInCart = inCartItems.length > 0;

  const emptyCartBtn = document.getElementById('btnEmptyCart');
  const cancelShoppingBtnBottom = document.getElementById('btnCancelShoppingBottom');
  const cartActionsToolbar = document.getElementById('cartActionsToolbar');
  const cartStickyBottomBar = document.getElementById('cartStickyBottomBar') || document.querySelector('.cart-floating-checkout-dock');

  if (cartActionsToolbar) {
    if (hasInCart) {
      cartActionsToolbar.classList.remove('hidden');
      cartActionsToolbar.style.display = 'flex';
    } else {
      cartActionsToolbar.classList.add('hidden');
      cartActionsToolbar.style.display = 'none';
    }
  }

  // Manage checkout dock visibility based on items & active tab
  if (cartStickyBottomBar) {
    const isCartActive = (AppState.currentTab === 'cart');
    if (isCartActive && hasInCart) {
      cartStickyBottomBar.classList.remove('hidden');
      cartStickyBottomBar.style.display = 'flex';
      const finishBtn = document.getElementById('btnFinishShoppingBottom');
      if (finishBtn) {
        finishBtn.style.opacity = '1';
        finishBtn.style.pointerEvents = 'auto';
      }
    } else {
      cartStickyBottomBar.classList.add('hidden');
      cartStickyBottomBar.style.display = 'none';
    }
  }

  if (emptyCartBtn) {
    emptyCartBtn.style.display = hasInCart ? 'inline-flex' : 'none';
  }
  if (cancelShoppingBtnBottom) {
    cancelShoppingBtnBottom.style.display = hasInCart ? 'inline-flex' : 'none';
  }

  const metrics = getCartMetrics();
  if (grandTotalEl) grandTotalEl.textContent = formatRupiah(metrics.totalBelanja);
  if (selectedCountEl) selectedCountEl.textContent = `${inCartItems.length} item`;
  if (checkoutBtnCount) checkoutBtnCount.textContent = `(${inCartItems.length})`;

  if (budgetSubEl) {
    if (metrics.safety.sisa >= 0) {
      budgetSubEl.textContent = `Sisa: ${formatRupiah(metrics.safety.sisa)}`;
      budgetSubEl.style.color = (metrics.safety.level === 'warning') ? '#B45309' : '#166534';
    } else {
      budgetSubEl.textContent = `Defisit: -${formatRupiah(Math.abs(metrics.safety.sisa))}`;
      budgetSubEl.style.color = '#DC2626';
    }
  }

  if (!container) return;

  // Empty cart state
  if (inCartItems.length === 0) {
    container.innerHTML = `
      <div class="ios-empty-state-card">
        <div class="empty-state-mascot">🛒</div>
        <h4 class="empty-state-headline">Keranjang Belanja Masih Kosong ♡</h4>
        <p class="empty-state-desc">
          ${unboughtItems.length > 0 ? `Ada ${unboughtItems.length} barang di Rencana Belanja yang siap dimasukkan ke keranjang!` : 'Belum ada barang di rencana belanja. Mulai catat kebutuhanmu!'}
        </p>
        <div class="empty-state-btn-row">
          ${unboughtItems.length > 0 ? `
            <button type="button" class="btn-primary touch-target" style="width: auto; padding: 11px 22px; font-size: 0.85rem; font-weight: 800; border-radius: 999px;" onclick="startShoppingFromPlan()">
              🛍️ Masukkan Semua (${unboughtItems.length}) ke Keranjang
            </button>
            <button type="button" class="btn-goto-planner-secondary touch-target" onclick="switchShoppingView('planner')">
              📋 Buka Rencana Belanja
            </button>
          ` : `
            <button type="button" class="btn-goto-planner-pill touch-target" onclick="switchShoppingView('planner')">
              <span>📋 Buka Rencana Belanja</span>
              <span style="font-size: 1.1em; margin-left: 2px;">➔</span>
            </button>
          `}
        </div>
      </div>
    `;
    if (selectAllCb) selectAllCb.checked = false;
    updateCartBadges();
    syncCartBottomPadding();
    return;
  }

  if (selectAllCb) selectAllCb.checked = true;

  let html = '';

  // Notice banner in cart if there are still items remaining in Rencana
  if (unboughtItems.length > 0) {
    html += `
      <div class="cart-unbought-notice" onclick="switchTab('planner')" style="cursor: pointer;" title="Lihat barang yang masih di Rencana">
        <div class="cart-unbought-left">
          <span class="cart-unbought-icon">📋</span>
          <span class="cart-unbought-text">Ada <strong>${unboughtItems.length} barang</strong> di Rencana Belanja</span>
        </div>
        <div class="cart-unbought-right">
          <button type="button" class="btn-quick-take-all" onclick="startShoppingFromPlan(); event.stopPropagation();" title="Ambil semua barang rencana ke keranjang">
            + Ambil Semua
          </button>
          <span class="cart-unbought-link">Lihat ➔</span>
        </div>
      </div>
    `;
  }

  inCartItems.forEach(item => {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const subtotal = disc.finalPrice * item.qty;
    const isSameStore = (!item.store || item.store === AppState.currentStore);
    const prevRec = findPreviousPurchaseRecord(item.namaBarang, item.store || AppState.currentStore);
    const baseline = (prevRec && prevRec.price) ? prevRec.price : item.hargaRiwayatBulanLalu;
    const analysis = getRepurchaseAnalysis(disc.finalPrice, prevRec || (baseline ? { price: baseline, store: item.store, isSameStore } : null), isSameStore);

    let promoBadge = '';
    if (item.diskonTipe === 'single') promoBadge = `🏷️ -${item.diskonValue}%`;
    else if (item.diskonTipe === 'tiered') promoBadge = `🔥 ${item.diskonValue}`;

    html += `
      <div class="ios-product-card cart-item-card checked" data-item-id="${item.id}">
        <!-- Top Section: Checkbox, Product Name, Tags & Actions -->
        <div class="ios-card-top-row">
          <div class="cart-item-header-left">
            <label class="ios-custom-checkbox-label" onclick="event.stopPropagation();" title="Centang / Batal Masukkan Keranjang">
              <input type="checkbox" class="ios-custom-checkbox cart-item-cb" ${item.checked ? 'checked' : ''} onchange="moveItemToPlan('${item.id}')">
              <span class="ios-checkbox-box"><span class="ios-checkbox-icon">✓</span></span>
            </label>
            <div class="ios-card-title-col">
              <span class="ios-product-title" title="${escapeHtml(item.namaBarang)}">
                ${escapeHtml(item.namaBarang)}
              </span>
              <div class="ios-card-tags-row">
                <span class="ios-meta-pill unit-pill" id="cart-unit-badge-${item.id}">📦 ${item.qty} ${escapeHtml(item.satuan || 'pcs')}</span>
                ${analysis.isRepurchase ? `<span class="ios-meta-pill analysis-pill ${analysis.badgeClass}" title="${escapeHtml(analysis.detailText)}">${analysis.badgeText}</span>` : ''}
                ${promoBadge ? `<button type="button" class="shopee-promo-pill" onclick="openQuickDiscountPopover('${item.id}'); event.stopPropagation();">${promoBadge}</button>` : `<button type="button" class="shopee-promo-pill" onclick="openQuickDiscountPopover('${item.id}'); event.stopPropagation();">🏷️ +Diskon</button>`}
              </div>
            </div>
          </div>

          <div class="ios-card-actions-col">
            <button type="button" class="btn-ios-icon-action btn-edit touch-target" onclick="openDetailedItemModal('${item.id}'); event.stopPropagation();" title="Ubah Rincian Item" aria-label="Ubah Rincian Item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button type="button" class="btn-ios-icon-action btn-delete touch-target" onclick="confirmDeleteItem('${item.id}'); event.stopPropagation();" title="Hapus Item" aria-label="Hapus Item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Card Divider -->
        <div class="ios-card-divider"></div>

        <!-- Bottom Section: Subtotal & Return to Plan + Stepper -->
        <div class="ios-card-bottom-row">
          <div class="ios-card-price-col">
            <div class="ios-price-wrap" onclick="openQuickPriceModal('${item.id}', false); event.stopPropagation();" style="cursor: pointer;" title="Klik untuk ubah harga">
              <span class="ios-price-label">Subtotal:</span>
              <span class="ios-price-value price-tag" id="subtotal-${item.id}">${formatRupiah(subtotal)}</span>
            </div>
            ${(analysis.isRepurchase && analysis.shortDetail) ? `<span class="repurchase-price-history-sub ${analysis.diffClass}" title="${escapeHtml(analysis.detailText)}">${escapeHtml(analysis.shortDetail)}</span>` : ''}
          </div>

          <div class="ios-card-controls-col">
            <!-- Return to Plan Button -->
            <button type="button" class="btn-ios-return-plan touch-target" onclick="moveItemToPlan('${item.id}'); event.stopPropagation();" title="Kembalikan barang ini ke Rencana Belanja">
              <span>↩️ Rencana</span>
            </button>

            <!-- Custom iOS Quantity Stepper -->
            <div class="ios-stepper-capsule">
              <button type="button" class="ios-step-btn minus" onclick="updateItemQty('${item.id}', -1); event.stopPropagation();" title="Kurangi Kuantitas" aria-label="Kurangi Kuantitas">&minus;</button>
              <input type="number" inputmode="numeric" class="ios-step-input" id="qty-input-${item.id}" min="1" value="${item.qty}"
                     oninput="handleQtyDirectInput('${item.id}', this.value)"
                     onblur="handleQtyBlur('${item.id}', this.value)"
                     onclick="event.stopPropagation()">
              <button type="button" class="ios-step-btn plus" onclick="updateItemQty('${item.id}', 1); event.stopPropagation();" title="Tambah Kuantitas" aria-label="Tambah Kuantitas">+</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  updateCartBadges();
  syncCartBottomPadding();
}

/**
 * Centang / Hapus Semua Item di Keranjang Belanja
 */
function handleCartSelectAll(checked) {
  if (checked) {
    let unpricedCount = 0;
    AppState.cart.forEach(item => {
      if (item.hargaSatuan && item.hargaSatuan > 0) {
        item.checked = true;
      } else {
        item.checked = false;
        unpricedCount++;
      }
    });
    if (unpricedCount > 0) {
      showToast(`${unpricedCount} barang belum memiliki harga riil. Ketuk barang untuk mengisi harga sebelum dicentang.`, 'info');
    }
  } else {
    AppState.cart.forEach(item => { item.checked = false; });
  }
  playSoftPop();
  saveLocalState();
  pushStateToCloud();
  renderAll();
}

/**
 * Sinkronisasi Badge Counter pada Bottom Nav & Segmented Pill
 */
function updateCartBadges() {
  const unbought = AppState.cart.filter(i => !i.checked);
  const checked = AppState.cart.filter(i => i.checked);

  // Bottom Nav badge with iOS spring bounce
  const navBadge = document.getElementById('bottomCartBadge');
  if (navBadge) {
    const prevCount = parseInt(navBadge.textContent, 10) || 0;
    const newCount = AppState.cart.length;
    navBadge.textContent = newCount;
    navBadge.style.display = newCount > 0 ? 'inline-block' : 'none';
    if (newCount !== prevCount) {
      navBadge.classList.remove('badge-pop');
      void navBadge.offsetWidth;
      navBadge.classList.add('badge-pop');
    }
  }

  // Segment buttons
  const unboughtPills = ['unboughtItemCount', 'unboughtItemCountPill', 'unboughtItemCountPill2'];
  unboughtPills.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = unbought.length;
  });

  const cartPills = ['cartCountPill', 'cartCountPill2'];
  cartPills.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = checked.length;
  });
  const selectedCountEl = document.getElementById('cartSelectedCountBadge');
  if (selectedCountEl) selectedCountEl.textContent = `${checked.length} item`;

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
    const prevRec = findPreviousPurchaseRecord(item.namaBarang, item.store || AppState.currentStore);
    const baseline = (prevRec && prevRec.price) ? prevRec.price : item.hargaRiwayatBulanLalu;

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

  // Evaluasi Indikator Fluktuasi Harga vs Riwayat Toko (Analisis Beli Ulang)
  const isSameStore = (!item.store || item.store === AppState.currentStore);
  const prevRec = findPreviousPurchaseRecord(item.namaBarang, item.store || AppState.currentStore);
  const baseline = (prevRec && prevRec.price) ? prevRec.price : item.hargaRiwayatBulanLalu;
  const analysis = getRepurchaseAnalysis(disc.finalPrice, prevRec || (baseline ? { price: baseline, store: item.store, isSameStore } : null), isSameStore);

  const fluctBadge = document.getElementById('quickPriceFluctBadge');
  if (fluctBadge) {
    fluctBadge.className = analysis.badgeClass;
    fluctBadge.textContent = analysis.badgeText;
  }

  const detailEl = document.getElementById('quickPriceRepurchaseDetail');
  if (detailEl) {
    if (analysis.isRepurchase) {
      detailEl.style.display = 'block';
      detailEl.innerHTML = `🔁 <strong>Perbandingan Beli Ulang:</strong> ${escapeHtml(analysis.detailText)}`;
    } else {
      detailEl.style.display = 'none';
    }
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

  if (typeof document !== 'undefined') {
    const saveBtn = document.querySelector('#quickPriceModal .btn-primary');
    if (saveBtn) {
      if (safety.level === 'danger') {
        saveBtn.classList.add('overbudget-blocked');
        saveBtn.title = 'Tidak bisa membeli barang ini: total belanja akan melebihi saldo anggaran!';
      } else {
        saveBtn.classList.remove('overbudget-blocked');
        saveBtn.title = '';
      }
    }
  }
}

let isSavingQuickPrice = false;
function saveQuickPrice() {
  if (isSavingQuickPrice) return;
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

  if (price > 999999999) {
    showToast('Harga maksimal Rp 999.999.999!', 'warning');
    return;
  }

  const rawQty = parseInt(document.getElementById('quickPriceQtyInput')?.value, 10);
  const targetQty = (!isNaN(rawQty) && rawQty >= 1) ? Math.min(rawQty, 9999) : 1;

  // Evaluasi dampak perubahan harga/kuantitas terhadap anggaran belanja
  const oldDisc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
  const oldSubtotal = oldDisc.finalPrice * (item.qty || 1);
  const newDisc = calculateDiscount(price, item.diskonTipe, item.diskonValue);
  const newSubtotal = newDisc.finalPrice * targetQty;
  const diffCost = newSubtotal - oldSubtotal;

  if (diffCost > 0 && checkOverbudgetBlock('membeli barang ini dengan harga tersebut', diffCost)) {
    return;
  }

  isSavingQuickPrice = true;
  setTimeout(() => isSavingQuickPrice = false, 600);

  item.qty = targetQty;
  item.hargaSatuan = price;
  item.checked = true; // Otomatis aktif & masuk hitungan keranjang
  item.store = AppState.currentStore;

  // Rekam harga riil saat belanja ke database riwayat harga toko
  recordStorePrice(item.namaBarang, price, AppState.currentStore, item.kategori, item.satuan);

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
  input.value = Math.min(9999, Math.max(1, cur + delta));
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
    setTimeout(syncLocalAccountsToCloud, 600);
    pushStateToCloud();
  });
  window.addEventListener('offline', () => {
    updateCloudSyncUI('offline', 'Mode Offline (LocalStorage)');
    showToast('Koneksi internet terputus. Bekerja dalam mode offline.', 'warning');
  });

  // Global window bindings for HTML event handlers
  window.SoundEngine = SoundEngine;
  window.playSound = playSound;
  window.changeSoundVolume = changeSoundVolume;
  window.changeSoundTheme = changeSoundTheme;
  window.previewCurrentSoundTheme = previewCurrentSoundTheme;
  window.toggleSoundFromSettings = toggleSoundFromSettings;
  window.triggerCuteLoginConfetti = triggerCuteLoginConfetti;
  window.playCelebrationFanfare = playCelebrationFanfare;
  window.switchAuthMode = switchAuthMode;
  window.toggleAuthMode = toggleAuthMode;
  window.loginWithGoogle = loginWithGoogle;
  window.handleAuthSubmit = handleAuthSubmit;
  window.syncLocalAccountsToCloud = syncLocalAccountsToCloud;
  window.loginDemoAccount = loginDemoAccount;
  window.handleProfileLogout = handleProfileLogout;
  window.promptLogout = promptLogout;
  window.AppState = AppState;
  window.saveLocalState = saveLocalState;
  window.loadLocalState = loadLocalState;
  window.loadUserIsolatedState = loadUserIsolatedState;
  window.executeDailyPlannerReset = executeDailyPlannerReset;
  window.startNewShoppingSession = startNewShoppingSession;
  window.prepareRoutineItemsForNewShopping = prepareRoutineItemsForNewShopping;
  window.confirmFinishShopping = confirmFinishShopping;
  window.toggleShoppingMode = toggleShoppingMode;
  window.moveItemToCart = moveItemToCart;
  window.moveItemToPlan = moveItemToPlan;
  window.startShoppingFromPlan = startShoppingFromPlan;
  window.moveItemToCartWithFeedback = moveItemToCartWithFeedback;
  window.syncCartBottomPadding = syncCartBottomPadding;
  window.showToastWithUndo = showToastWithUndo;
  window.toggleItemCheck = toggleItemCheck;
  window.toggleCatalogExpand = toggleCatalogExpand;
  window.togglePantryCatalogExpand = togglePantryCatalogExpand;
  window.togglePasswordVisibility = togglePasswordVisibility;
  window.clearCartAll = clearCartAll;
  window.clearPlanAll = clearPlanAll;
  window.clearEntireCart = clearEntireCart;
  window.undoClearCart = undoClearCart;
  window.checkAndShowPwaBanner = checkAndShowPwaBanner;
  window.hidePwaInstallBanner = hidePwaInstallBanner;
  window.dismissPwaInstallBanner = dismissPwaInstallBanner;
  window.acceptPwaInstallBanner = acceptPwaInstallBanner;
  window.dismissStickySaldoCard = dismissStickySaldoCard;
  window.attachSwipeToDismiss = attachSwipeToDismiss;
  window.showToast = showToast;
  window.showToastWithUndo = showToastWithUndo;
  window.updateDashboardGreeting = updateDashboardGreeting;
  window.updateDashboardInsights = updateDashboardInsights;
  window.updateHeroBudgetMascot = updateHeroBudgetMascot;
  window.triggerMascotReaction = triggerMascotReaction;
  window.calculateShoppingStreak = calculateShoppingStreak;
  window.calculateTotalSavings = calculateTotalSavings;
  window.renderDashboardCategorySummary = renderDashboardCategorySummary;
  window.openCancelShoppingModal = openCancelShoppingModal;
  window.closeCancelShoppingModal = closeCancelShoppingModal;
  window.cancelShoppingSession = cancelShoppingSession;
  window.executeCancelShopping = executeCancelShopping;
}

if (typeof window !== 'undefined') {
  window.triggerGreetingMascotReaction = triggerGreetingMascotReaction;
}


// =========================================================================
// ADVANCED iOS LIQUID UX: BOTTOM SHEET DRAG-TO-DISMISS & GESTURES
// =========================================================================

/**
 * Universal Drag-to-Dismiss Handler for iOS Bottom Sheets
 */
function initBottomSheetGestures() {
  if (typeof document === 'undefined') return;

  const sheetBackdrops = document.querySelectorAll(
    '.modal-backdrop:not(.modal-dialog-centered), .profile-settings-backdrop'
  );

  sheetBackdrops.forEach(backdrop => {
    if (backdrop.dataset.sheetGestureAttached) return;
    backdrop.dataset.sheetGestureAttached = 'true';

    const card = backdrop.querySelector('.modal-card, .profile-settings-card');
    if (!card) return;

    // Inject visible drag handle if not already present
    if (!card.querySelector('.sheet-drag-handle')) {
      const handle = document.createElement('div');
      handle.className = 'sheet-drag-handle';
      handle.setAttribute('aria-hidden', 'true');
      card.insertBefore(handle, card.firstChild);
    }

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const onStart = (clientY, target) => {
      const isHandle = target && target.classList && target.classList.contains('sheet-drag-handle');
      const isHeader = target && target.closest && (target.closest('.modal-header') || target.closest('.sheet-drag-handle'));
      if (!isHandle && !isHeader && card.scrollTop > 0) return false;

      startY = clientY;
      currentY = startY;
      isDragging = false;
      return true;
    };

    const onMove = (clientY, e) => {
      if (startY === 0) return;
      currentY = clientY;
      const deltaY = currentY - startY;

      if (deltaY > 0 && card.scrollTop <= 0) {
        if (deltaY > 6) {
          isDragging = true;
          if (e && e.cancelable) e.preventDefault();
        }
        if (isDragging) {
          const dampedY = Math.pow(deltaY, 0.95);
          card.style.transition = 'none';
          card.style.transform = `translateY(${dampedY}px)`;
          backdrop.style.backgroundColor = `rgba(35, 15, 28, ${Math.max(0.08, 0.42 * (1 - deltaY / 420))})`;
        }
      }
    };

    const onEnd = () => {
      if (!isDragging) {
        startY = 0;
        return;
      }
      const deltaY = currentY - startY;
      isDragging = false;
      startY = 0;

      if (deltaY > 80) {
        // Dismiss sheet with fluid spring physics
        card.style.transition = 'transform 0.24s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease';
        card.style.transform = 'translateY(100%)';
        backdrop.style.transition = 'opacity 0.22s ease';
        backdrop.style.opacity = '0';

        if (typeof HapticEngine !== 'undefined') HapticEngine.light();
        if (typeof SoundEngine !== 'undefined') SoundEngine.play('modal_close');

        setTimeout(() => {
          const id = backdrop.id;
          if (id === 'addItemModal' && typeof closeDetailedItemModal === 'function') closeDetailedItemModal();
          else if (id === 'quickPriceModal' && typeof closeQuickPriceModal === 'function') closeQuickPriceModal(false);
          else if (id === 'quickDiscountPopover' && typeof closeQuickDiscountPopover === 'function') closeQuickDiscountPopover();
          else if (id === 'budgetModal' && typeof closeBudgetModal === 'function') closeBudgetModal();
          else if (id === 'addPantryModal' && typeof closeAddPantryModal === 'function') closeAddPantryModal();
          else if (id === 'blacklistManagerModal' && typeof closeBlacklistManagerModal === 'function') closeBlacklistManagerModal();
          else if (id === 'cloudSyncModal' && typeof closeCloudSyncModal === 'function') closeCloudSyncModal();
          else if (id === 'storePickerModal' && typeof closeStorePickerModal === 'function') closeStorePickerModal();
          else if (id === 'itemPickerModal' && typeof closeItemPickerModal === 'function') closeItemPickerModal();
          else if (id === 'profileSettingsModal' && typeof closeProfileSettingsModal === 'function') closeProfileSettingsModal();
          else if (id === 'receiptModal' && typeof closeReceiptModal === 'function') closeReceiptModal();
          else if (id === 'pwaInstallGuideModal' && typeof closePwaInstallGuideModal === 'function') closePwaInstallGuideModal();
          else {
            backdrop.classList.remove('active', 'show', 'open');
            backdrop.style.display = 'none';
          }
          card.style.transform = '';
          card.style.transition = '';
          backdrop.style.backgroundColor = '';
          backdrop.style.opacity = '';
        }, 220);
      } else {
        // Snap back up
        card.style.transition = 'transform 0.32s cubic-bezier(0.175, 0.885, 0.32, 1.25)';
        card.style.transform = 'translateY(0)';
        backdrop.style.transition = 'background-color 0.28s ease';
        backdrop.style.backgroundColor = '';
        setTimeout(() => {
          card.style.transform = '';
          card.style.transition = '';
        }, 320);
      }
    };

    card.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) onStart(e.touches[0].clientY, e.target);
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) onMove(e.touches[0].clientY, e);
    }, { passive: false });

    card.addEventListener('touchend', onEnd, { passive: true });
    card.addEventListener('touchcancel', onEnd, { passive: true });
  });
}

/**
 * Horizontal Swipe Between Top-Level Tabs
 */
function initSwipeBetweenTabs() {
  if (typeof document === 'undefined') return;

  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let isSwiping = false;

  const dashboard = document.getElementById('mainDashboard');
  if (!dashboard) return;

  dashboard.addEventListener('touchstart', (e) => {
    // Ignore swipe when modals, bottom sheets, or range sliders are active
    if (document.querySelector('.modal-backdrop.active, .modal-backdrop.show, .profile-settings-backdrop.open, .receipt-modal-backdrop.active')) {
      return;
    }
    if (e.target.closest('.quick-budget-presets, input[type="range"], .horizontal-scroll, .catalog-category-filter')) {
      return;
    }

    if (e.touches && e.touches[0]) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentX = startX;
      currentY = startY;
      isSwiping = true;
    }
  }, { passive: true });

  dashboard.addEventListener('touchmove', (e) => {
    if (!isSwiping || !e.touches || !e.touches[0]) return;
    currentX = e.touches[0].clientX;
    currentY = e.touches[0].clientY;
  }, { passive: true });

  dashboard.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    if (Math.abs(deltaX) > 65 && Math.abs(deltaX) > 2.2 * Math.abs(deltaY)) {
      const tabs = ['planner', 'cart', 'budget', 'pantry'];
      const currentIndex = tabs.indexOf(AppState.currentTab || 'planner');
      if (currentIndex === -1) return;

      if (deltaX < 0 && currentIndex < tabs.length - 1) {
        switchTab(tabs[currentIndex + 1]);
      } else if (deltaX > 0 && currentIndex > 0) {
        switchTab(tabs[currentIndex - 1]);
      }
    }
    startX = 0;
    startY = 0;
  }, { passive: true });
}

/**
 * Dynamic Glass Header Scroll Listener
 */
function initDynamicHeaderScroll() {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 15;
        document.body.classList.toggle('is-scrolled', isScrolled);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Pull to Refresh Handler on Dashboard
 */
function initPullToRefresh() {
  const ptr = document.getElementById('pullToRefreshIndicator');
  if (!ptr) return;

  let startY = 0;
  let isPulling = false;
  let refreshSafetyTimer = null;

  const resetIndicator = () => {
    isPulling = false;
    startY = 0;
    ptr.classList.remove('refreshing', 'visible');
    const icon = ptr.querySelector('.ptr-icon');
    if (icon) icon.style.transform = 'none';
    if (refreshSafetyTimer) {
      clearTimeout(refreshSafetyTimer);
      refreshSafetyTimer = null;
    }
  };

  window.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0 && e.touches && e.touches[0]) {
      startY = e.touches[0].clientY;
      isPulling = false;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (startY === 0 || window.scrollY > 0) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    if (deltaY > 65 && deltaY < 140) {
      isPulling = true;
      ptr.classList.add('visible');
      const icon = ptr.querySelector('.ptr-icon');
      if (icon) icon.style.transform = `rotate(${(deltaY - 65) * 4}deg)`;
    } else if (deltaY <= 0) {
      ptr.classList.remove('visible');
      isPulling = false;
    }
  }, { passive: true });

  const finishPull = () => {
    if (!isPulling) {
      resetIndicator();
      return;
    }
    isPulling = false;
    startY = 0;

    ptr.classList.add('refreshing');
    if (typeof HapticEngine !== 'undefined') HapticEngine.light();

    // Guaranteed safety timeout: cannot stay stuck under any circumstances
    refreshSafetyTimer = setTimeout(() => {
      resetIndicator();
    }, 1200);

    setTimeout(() => {
      try {
        if (typeof syncFromCloud === 'function' && AppState.user) {
          syncFromCloud();
        } else if (typeof renderAll === 'function') {
          renderAll();
        }
        if (typeof SoundEngine !== 'undefined') SoundEngine.play('sync_success');
      } catch (err) {
        console.error('PTR error:', err);
      } finally {
        resetIndicator();
      }
    }, 600);
  };

  window.addEventListener('touchend', finishPull, { passive: true });
  window.addEventListener('touchcancel', resetIndicator, { passive: true });
}

// Auto-initialize Liquid UX systems on DOM ready & window resize
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    if (typeof updateNavGlider === 'function') updateNavGlider();
  }, { passive: true });

  window.addEventListener('DOMContentLoaded', () => {
    initDynamicHeaderScroll();
    initBottomSheetGestures();
    initSwipeBetweenTabs();
    initPullToRefresh();
    setTimeout(() => {
      if (typeof updateNavGlider === 'function') updateNavGlider();
    }, 150);
  });
}

/**
 * Pindahkan barang dari Rencana ke Keranjang dengan Feedback Visual & Haptik
 */
function moveItemToCartWithFeedback(itemId, btnEl) {
  if (btnEl) {
    btnEl.classList.add('added-animating');
    setTimeout(() => {
      if (btnEl) btnEl.classList.remove('added-animating');
    }, 450);
  }

  // Animate cart counter pills and bottom nav cart icon
  const cartPills = document.querySelectorAll('#cartCountPill, #cartCountPill2, #cartCountPill, .bottom-nav-item[data-tab="cart"] .nav-icon');
  cartPills.forEach(p => {
    p.classList.add('cart-badge-bounce');
    setTimeout(() => p.classList.remove('cart-badge-bounce'), 500);
  });

  moveItemToCart(itemId);
}

/**
 * Sinkronisasi Padding Bawah Keranjang untuk Mencegah Tumpang Tindih dengan Checkout Dock
 */
function syncCartBottomPadding() {
  const dock = document.getElementById('cartStickyBottomBar');
  const cartList = document.getElementById('cartItemsContainer');
  const tabCart = document.getElementById('tabCart');
  if (!cartList || !tabCart) return;

  const currentTab = AppState.currentTab || 'planner';
  const inCartItems = (AppState.cart || []).filter(i => i.checked);
  const hasInCart = inCartItems.length > 0;

  if (dock) {
    if (currentTab === 'cart' && hasInCart) {
      dock.style.display = 'flex';
      dock.classList.remove('hidden');
      const dockHeight = dock.offsetHeight || 60;
      const navBar = document.querySelector('.bottom-nav-bar');
      const navHeight = navBar ? navBar.offsetHeight : 70;
      const totalPad = dockHeight + navHeight + 28;
      cartList.style.paddingBottom = totalPad + 'px';
      tabCart.style.paddingBottom = totalPad + 'px';
    } else {
      dock.style.display = 'none';
      dock.classList.add('hidden');
      cartList.style.paddingBottom = 'calc(var(--bottom-nav-height) + 24px)';
      tabCart.style.paddingBottom = 'calc(var(--bottom-nav-height) + 24px)';
    }
  }
}
window.addEventListener('resize', syncCartBottomPadding);


/**
 * Pilih Siklus Anggaran (iOS Segmented Control)
 */
function selectBudgetCycle(period) {
  if (!period) return;
  AppState.budgetPeriod = period;

  // Sync hidden native select
  const sel = document.getElementById('configBudgetPeriod');
  if (sel) sel.value = period;

  // Update segmented buttons active state
  document.querySelectorAll('.cycle-seg-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cycle === period);
  });

  // Update label hint
  const hint = document.getElementById('cycleActiveHint');
  const labels = {
    weekly: 'Mingguan',
    monthly: 'Bulanan',
    session: 'Per Sesi Belanja'
  };
  if (hint) hint.textContent = labels[period] || period;

  updateBudgetConfig();
  if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
    SoundEngine.play('nav_switch');
  } else if (typeof playSoftPop === 'function') {
    playSoftPop();
  }
}
window.selectBudgetCycle = selectBudgetCycle;

/**
 * =========================================================================
 * AVATAR MANAGEMENT (CUSTOM PHOTO UPLOAD & KAWAII PRESETS)
 * =========================================================================
 */
function triggerProfileAvatarUpload() {
  if (typeof playSoftPop === 'function') playSoftPop();
  const fileInput = document.getElementById('profileAvatarFileInput');
  if (fileInput) fileInput.click();
}

function handleProfileAvatarUpload(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    if (typeof showToast === 'function') {
      showToast('Harap pilih file gambar (JPG, PNG, atau WebP)!', 'warning');
    }
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      // Compress with 180x180 canvas for ultra-fast storage & zero lag
      const canvas = document.createElement('canvas');
      canvas.width = 180;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');

      // Square crop centered
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;
      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, 180, 180);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      applyUserAvatar(compressedDataUrl);

      if (typeof showToast === 'function') {
        showToast('Foto profil baru berhasil disimpan! 🌸', 'success');
      }
      if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
        SoundEngine.play('success');
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);

  // Reset input value so same image can be re-selected if desired
  if (event.target) event.target.value = '';
}

function selectAvatarPreset(emoji) {
  if (typeof playSoftPop === 'function') playSoftPop();
  if (!emoji) return;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFEBF2"/><stop offset="100%" stop-color="#FFD6E5"/></linearGradient></defs><circle cx="80" cy="80" r="76" fill="url(#g)" stroke="#F4BFD0" stroke-width="4"/><text x="80" y="104" font-size="70" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`;
  const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);

  applyUserAvatar(dataUrl);

  if (typeof showToast === 'function') {
    showToast(`Avatar ${emoji} berhasil dipilih! 🌸`, 'success');
  }
  if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
    SoundEngine.play('nav_switch');
  }
}

function selectKawaiiAvatarPreset(presetId) {
  if (typeof playSoftPop === 'function') playSoftPop();
  if (!presetId) return;

  let dataUrl = '';
  let presetName = presetId;

  if (typeof getKawaiiArtDataUrl === 'function') {
    dataUrl = getKawaiiArtDataUrl(presetId);
  } else if (typeof KawaiiArt !== 'undefined' && KawaiiArt[presetId]) {
    dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(KawaiiArt[presetId]);
  }

  if (typeof KAWAII_AVATAR_PRESETS !== 'undefined') {
    const found = KAWAII_AVATAR_PRESETS.find(p => p.id === presetId);
    if (found) presetName = found.name;
  }

  if (dataUrl) {
    applyUserAvatar(dataUrl);

    // Update active highlight on presets
    document.querySelectorAll('.btn-avatar-preset').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('onclick')?.includes(`'${presetId}'`));
    });

    if (typeof showToast === 'function') {
      showToast(`Avatar ${presetName} berhasil dipilih! 🌸`, 'success');
    }
    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
      SoundEngine.play('nav_switch');
    }
  }
}

function renderAvatarPresets() {
  const grid = document.getElementById('avatarPresetsGrid');
  if (!grid || typeof KAWAII_AVATAR_PRESETS === 'undefined' || typeof KawaiiArt === 'undefined') return;

  grid.innerHTML = KAWAII_AVATAR_PRESETS.map(p => {
    const svg = KawaiiArt[p.svgKey] || '🌸';
    return `
      <button type="button" class="btn-avatar-preset"
              onclick="selectKawaiiAvatarPreset('${p.id}')"
              title="${escapeHtml(p.title || p.name)}"
              aria-label="${escapeHtml(p.name)}">
        ${svg}
      </button>
    `;
  }).join('');
}

function applyUserAvatar(avatarUrl) {
  if (!avatarUrl) return;

  if (!AppState.user) {
    AppState.user = { name: 'Pengguna', email: 'user@email.com', uid: 'guest' };
  }
  AppState.user.photoURL = avatarUrl;
  AppState.user.photo = avatarUrl;
  AppState.user.customAvatar = avatarUrl;

  const uid = AppState.user.uid || 'guest';
  try {
    localStorage.setItem('smart_grocery_custom_avatar_' + uid, avatarUrl);
    localStorage.setItem('smart_grocery_custom_avatar_guest', avatarUrl);
    localStorage.setItem('smart_grocery_custom_avatar_latest', avatarUrl);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(AppState.user));
    localStorage.setItem('sgt_current_user', JSON.stringify(AppState.user));
  } catch (err) {
    console.warn('LocalStorage avatar quota check:', err);
  }

  saveLocalState();
  if (typeof pushStateToCloud === 'function') {
    pushStateToCloud();
  }
  if (typeof firestoreDb !== 'undefined' && firestoreDb && AppState.user.email) {
    const cleanEmail = AppState.user.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    firestoreDb.collection('registered_accounts').doc(cleanEmail).set({
      photoURL: avatarUrl,
      customAvatar: avatarUrl
    }, { merge: true }).catch(err => console.info('Firestore avatar sync notice:', err));
  }

  updateHeaderAvatar(avatarUrl);
  updateModalAvatar(avatarUrl);
}

/**
 * =========================================================================
 * STICKY KAWAII MASCOT COMPANION (SCROLL BEHAVIOR & INTERACTION)
 * =========================================================================
 */
function handleStickyMascotClick() {
  if (typeof playSoftPop === 'function') playSoftPop();
  const stickyMascot = document.getElementById('stickyMascotCompanion');
  if (stickyMascot) {
    stickyMascot.style.transform = 'scale(1.15)';
    setTimeout(() => {
      if (stickyMascot) stickyMascot.style.transform = '';
    }, 250);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

if (typeof window !== 'undefined') {
  window.triggerProfileAvatarUpload = triggerProfileAvatarUpload;
  window.handleProfileAvatarUpload = handleProfileAvatarUpload;
  window.selectAvatarPreset = selectAvatarPreset;
  window.selectKawaiiAvatarPreset = selectKawaiiAvatarPreset;
  window.renderAvatarPresets = renderAvatarPresets;
  window.renderCatalogItemThumb = renderCatalogItemThumb;
  window.applyUserAvatar = applyUserAvatar;
  window.handleStickyMascotClick = handleStickyMascotClick;
  window.loadRoutineItemsToPlanner = loadRoutineItemsToPlanner;

  let _stickyScrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!_stickyScrollTicking) {
      window.requestAnimationFrame(() => {
        const stickyMascot = document.getElementById('stickyMascotCompanion');
        if (stickyMascot) {
          if (window.scrollY > 130) {
            stickyMascot.classList.add('visible');
          } else {
            stickyMascot.classList.remove('visible');
          }
        }
        _stickyScrollTicking = false;
      });
      _stickyScrollTicking = true;
    }
  }, { passive: true });
}
