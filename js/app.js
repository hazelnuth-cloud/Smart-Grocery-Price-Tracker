/**
 * Smart Grocery & Budget Safety Tracker
 * PWA Application Logic & Mathematical Engine
 */

// Storage Keys
const STORAGE_KEYS = {
  CART: 'smart_grocery_cart_v1',
  BUDGET: 'smart_grocery_budget_v1',
  THRESHOLD: 'smart_grocery_threshold_v1',
  PRICE_HISTORY: 'smart_grocery_price_history_v1',
  RECEIPTS: 'smart_grocery_receipts_v1',
  SOUND_ENABLED: 'smart_grocery_sound_enabled_v1'
};

// Initial Mock Data (Katalog Acuan Bulan Lalu sesuai SRS)
const DEFAULT_PRICE_HISTORY = {
  "Minyak Goreng": { harga: 18000, satuan: "liter", kategori: "Kebutuhan Pokok" },
  "Beras 5kg": { harga: 68000, satuan: "pack", kategori: "Kebutuhan Pokok" },
  "Sabun Mandi": { harga: 12000, satuan: "pcs", kategori: "Perlengkapan Mandi" },
  "Telur Ayam 1kg": { harga: 28000, satuan: "kg", kategori: "Kebutuhan Pokok" },
  "Mi Instan Dus": { harga: 115000, satuan: "pack", kategori: "Makanan" },
  "Susu UHT 1L": { harga: 19500, satuan: "liter", kategori: "Minuman" },
  "Kopi Bubuk 200g": { harga: 15000, satuan: "pack", kategori: "Minuman" },
  "Deterjen Cair 800ml": { harga: 17500, satuan: "pack", kategori: "Kebersihan & Rumah" }
};

// Initial Mock Cart Items for First Run (Ready to test immediately)
const DEFAULT_CART_ITEMS = [
  {
    id: 'item-1',
    namaBarang: 'Minyak Goreng',
    kategori: 'Kebutuhan Pokok',
    satuan: 'liter',
    qty: 2,
    hargaSatuan: 20000,
    diskonTipe: 'single',
    diskonValue: '10',
    hargaRiwayatBulanLalu: 18000,
    checked: true
  },
  {
    id: 'item-2',
    namaBarang: 'Beras 5kg',
    kategori: 'Kebutuhan Pokok',
    satuan: 'pack',
    qty: 1,
    hargaSatuan: 72000,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: 68000,
    checked: false
  },
  {
    id: 'item-3',
    namaBarang: 'Sabun Mandi',
    kategori: 'Perlengkapan Mandi',
    satuan: 'pcs',
    qty: 3,
    hargaSatuan: 20000,
    diskonTipe: 'tiered',
    diskonValue: '50+20',
    hargaRiwayatBulanLalu: 12000,
    checked: false
  },
  {
    id: 'item-4',
    namaBarang: 'Telur Ayam 1kg',
    kategori: 'Kebutuhan Pokok',
    satuan: 'kg',
    qty: 1,
    hargaSatuan: 27000,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: 28000,
    checked: true
  }
];

// Initial Past Receipts (Bulan Lalu)
const DEFAULT_RECEIPTS = [
  {
    id: 'rec-sep-2026',
    tanggal: '2026-09-05T14:30:00.000Z',
    judul: 'Belanja Bulanan Kos - September 2026',
    totalBelanja: 268000,
    totalHemat: 34000,
    budgetSaatItu: 300000,
    statusBudget: 'safe',
    items: [
      { namaBarang: 'Beras 5kg', qty: 1, satuan: 'pack', hargaAkhirSatuan: 68000, totalHarga: 68000 },
      { namaBarang: 'Minyak Goreng', qty: 2, satuan: 'liter', hargaAkhirSatuan: 18000, totalHarga: 36000 },
      { namaBarang: 'Telur Ayam 1kg', qty: 1, satuan: 'kg', hargaAkhirSatuan: 28000, totalHarga: 28000 },
      { namaBarang: 'Mi Instan Dus', qty: 1, satuan: 'pack', hargaAkhirSatuan: 115000, totalHarga: 115000 },
      { namaBarang: 'Deterjen Cair 800ml', qty: 1, satuan: 'pack', hargaAkhirSatuan: 17500, totalHarga: 17500 },
      { namaBarang: 'Sabun Mandi', qty: 3, satuan: 'pcs', hargaAkhirSatuan: 12000, totalHarga: 36000 }
    ]
  }
];

// State Application
const AppState = {
  cart: [],
  budget: 300000,
  threshold: 80,
  priceHistory: {},
  receipts: [],
  currentTab: 'belanja',
  activeCategoryFilter: 'all',
  searchQuery: '',
  receiptsSearchQuery: '',
  soundEnabled: true,
  audioCtx: null,
  editingItemId: null
};

// ==========================================
// 1. MATHEMATICAL FORMULAS & CALCULATIONS
// ==========================================

/**
 * Kalkulator Diskon Bertingkat & Tunggal (F-03)
 * Formula Tunggal: Harga * (1 - A/100)
 * Formula Bertingkat: Harga * (1 - A/100) * (1 - B/100) * ...
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
      steps: [`Diskon ${val}%: Rp ${formatNumber(price)} × (1 - ${val/100}) = Rp ${formatNumber(finalPrice)} (Hemat Rp ${formatNumber(savings)})`]
    };
  }

  if (discountType === 'tiered') {
    // Parser string fleksibel seperti "50% + 20%", "50+20", "70% + 10%"
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
      steps.push(`Tier ${index + 1} (${tier}%): Rp ${formatNumber(Math.round(prevPrice))} × (1 - ${tier/100}) = Rp ${formatNumber(Math.round(current))}`);
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
 * Komparator Harga Realtime vs Bulan Lalu (F-04)
 * Bandingkan Harga Akhir Satuan Saat Ini vs hargaRiwayatBulanLalu
 */
function comparePriceWithLastMonth(currentFinalUnitPrice, lastMonthPrice) {
  const current = Math.round(parseFloat(currentFinalUnitPrice) || 0);
  const baseline = Math.round(parseFloat(lastMonthPrice) || 0);

  if (!baseline || baseline <= 0) {
    return {
      status: 'new',
      label: 'Baru',
      diff: 0,
      percent: 0,
      text: 'Produk Baru',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200'
    };
  }

  const diff = current - baseline;
  const percent = ((diff / baseline) * 100);

  if (diff > 0) {
    // Harga Naik (Merah)
    return {
      status: 'up',
      label: '↑ Naik',
      diff,
      percent: Math.abs(percent),
      text: `↑ Naik Rp ${formatNumber(diff)} (+${Math.abs(percent).toFixed(1)}%)`,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
    };
  } else if (diff < 0) {
    // Harga Turun (Hijau)
    const absDiff = Math.abs(diff);
    return {
      status: 'down',
      label: '↓ Turun',
      diff,
      percent: Math.abs(percent),
      text: `↓ Turun Rp ${formatNumber(absDiff)} (-${Math.abs(percent).toFixed(1)}%)`,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  } else {
    // Harga Stabil (Abu-abu)
    return {
      status: 'stable',
      label: '= Stabil',
      diff: 0,
      percent: 0,
      text: `= Stabil (Rp ${formatNumber(current)})`,
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300'
    };
  }
}

/**
 * Evaluasi Budget Safety Cap (F-05)
 * < 80%: Hijau (Aman)
 * 80% - 99%: Kuning / Oranye (Waspada mendekati limit)
 * >= 100%: Merah & Flashing Warning (Bahaya Overbudget)
 */
function evaluateBudgetSafety(totalBelanja, budget, thresholdPercent = 80) {
  const total = Math.max(0, totalBelanja);
  const maxBudget = Math.max(1, budget);
  const percentage = (total / maxBudget) * 100;
  const sisa = maxBudget - total;

  if (percentage >= 100) {
    return {
      level: 'danger',
      percentage,
      sisa,
      title: 'BAHAYA OVERBUDGET!',
      badgeText: 'Bahaya (≥100%)',
      colorClass: 'text-rose-600',
      bgClass: 'bg-rose-500',
      borderClass: 'border-rose-400',
      alertMessage: `Uang saku tunai defisit Rp ${formatNumber(Math.abs(sisa))}! Kurangi item belanja.`
    };
  } else if (percentage >= thresholdPercent) {
    return {
      level: 'warning',
      percentage,
      sisa,
      title: 'WASPADAI LIMIT!',
      badgeText: `Waspada (${Math.round(percentage)}%)`,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-500',
      borderClass: 'border-amber-400',
      alertMessage: `Mendekati batas anggaran! Tersisa Rp ${formatNumber(sisa)} (${Math.round(100 - percentage)}%).`
    };
  } else {
    return {
      level: 'safe',
      percentage,
      sisa,
      title: 'Kondisi Aman',
      badgeText: `Aman (${Math.round(percentage)}%)`,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-500',
      borderClass: 'border-emerald-400',
      alertMessage: `Anggaran sangat terkendali. Sisa saldo: Rp ${formatNumber(sisa)}.`
    };
  }
}

// ==========================================
// 2. WEB AUDIO & HAPTIC SYSTEM
// ==========================================

function initAudioContext() {
  if (!AppState.audioCtx && window.AudioContext) {
    AppState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  if (!AppState.soundEnabled) return;
  try {
    initAudioContext();
    if (!AppState.audioCtx) return;
    if (AppState.audioCtx.state === 'suspended') {
      AppState.audioCtx.resume();
    }

    const ctx = AppState.audioCtx;
    const now = ctx.currentTime;

    if (type === 'add' || type === 'tap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'danger') {
      // Double low tone warning buzzer
      [0, 0.18].forEach(delay => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now + delay);
        gain.gain.setValueAtTime(0.2, now + delay);
        gain.gain.linearRampToValueAtTime(0.01, now + delay + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.14);
      });
    } else if (type === 'checkout') {
      // Arpeggio celebratory chime (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.08);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.25);
      });
    }
  } catch (e) {
    console.debug('Audio error:', e);
  }

  // Haptic feedback
  if (navigator.vibrate) {
    try {
      if (type === 'danger') {
        navigator.vibrate([100, 50, 100]);
      } else {
        navigator.vibrate(20);
      }
    } catch (e) {}
  }
}

// ==========================================
// 3. STORAGE & STATE MANAGEMENT
// ==========================================

function loadState() {
  try {
    const storedBudget = localStorage.getItem(STORAGE_KEYS.BUDGET);
    AppState.budget = storedBudget !== null ? parseInt(storedBudget, 10) : 300000;

    const storedThreshold = localStorage.getItem(STORAGE_KEYS.THRESHOLD);
    AppState.threshold = storedThreshold !== null ? parseInt(storedThreshold, 10) : 80;

    const storedSound = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    AppState.soundEnabled = storedSound !== null ? JSON.parse(storedSound) : true;

    const storedHistory = localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY);
    if (storedHistory) {
      AppState.priceHistory = JSON.parse(storedHistory);
    } else {
      AppState.priceHistory = { ...DEFAULT_PRICE_HISTORY };
      savePriceHistory();
    }

    const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (storedCart) {
      AppState.cart = JSON.parse(storedCart);
    } else {
      AppState.cart = JSON.parse(JSON.stringify(DEFAULT_CART_ITEMS));
      saveCart();
    }

    const storedReceipts = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
    if (storedReceipts) {
      AppState.receipts = JSON.parse(storedReceipts);
    } else {
      AppState.receipts = JSON.parse(JSON.stringify(DEFAULT_RECEIPTS));
      saveReceipts();
    }
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
    AppState.priceHistory = { ...DEFAULT_PRICE_HISTORY };
    AppState.cart = JSON.parse(JSON.stringify(DEFAULT_CART_ITEMS));
    AppState.receipts = JSON.parse(JSON.stringify(DEFAULT_RECEIPTS));
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(AppState.cart));
}

function saveBudget() {
  localStorage.setItem(STORAGE_KEYS.BUDGET, AppState.budget.toString());
}

function saveThreshold() {
  localStorage.setItem(STORAGE_KEYS.THRESHOLD, AppState.threshold.toString());
}

function savePriceHistory() {
  localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(AppState.priceHistory));
}

function saveReceipts() {
  localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(AppState.receipts));
}

function saveSound() {
  localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(AppState.soundEnabled));
}

// Reset data to defaults
function resetToInitialMockData() {
  AppState.budget = 300000;
  AppState.threshold = 80;
  AppState.priceHistory = { ...DEFAULT_PRICE_HISTORY };
  AppState.cart = JSON.parse(JSON.stringify(DEFAULT_CART_ITEMS));
  AppState.receipts = JSON.parse(JSON.stringify(DEFAULT_RECEIPTS));
  saveBudget();
  saveThreshold();
  savePriceHistory();
  saveCart();
  saveReceipts();
  renderAll();
  showToast('Data awal (Mock Data) berhasil dimuat kembali!', 'success');
}

// ==========================================
// 4. COMPUTED TOTALS & METRICS
// ==========================================

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

  const safety = evaluateBudgetSafety(totalBelanja, AppState.budget, AppState.threshold);

  return {
    totalBelanja,
    totalHemat,
    totalItemsCount,
    checkedItemsCount,
    safety
  };
}

// ==========================================
// 5. UI RENDERING & DOM UPDATES
// ==========================================

function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(Math.round(num || 0));
}

function formatRupiah(num) {
  return `Rp ${formatNumber(num)}`;
}

// Render Top Sticky Budget Safety Header
function renderBudgetSafetyHeader() {
  const metrics = getCartMetrics();
  const { totalBelanja, safety } = metrics;
  const budget = AppState.budget;

  const headerContainer = document.getElementById('budget-safety-header');
  if (!headerContainer) return;

  const progressBar = document.getElementById('budget-progress-bar');
  const progressPercentText = document.getElementById('budget-progress-percent');
  const totalBelanjaText = document.getElementById('header-total-belanja');
  const budgetLimitText = document.getElementById('header-budget-limit');
  const sisaBudgetText = document.getElementById('header-sisa-budget');
  const sisaBadgeLabel = document.getElementById('header-sisa-label');
  const safetyBadge = document.getElementById('header-safety-badge');
  const alertBanner = document.getElementById('header-warning-banner');
  const alertBannerText = document.getElementById('header-warning-text');

  if (totalBelanjaText) totalBelanjaText.textContent = formatRupiah(totalBelanja);
  if (budgetLimitText) budgetLimitText.textContent = formatRupiah(budget);

  // Remaining or deficit
  if (sisaBudgetText && sisaBadgeLabel) {
    if (safety.sisa >= 0) {
      sisaBadgeLabel.textContent = 'Sisa Tunai:';
      sisaBudgetText.textContent = formatRupiah(safety.sisa);
      sisaBudgetText.className = 'font-bold text-slate-800 text-sm';
    } else {
      sisaBadgeLabel.textContent = 'Defisit Tunai:';
      sisaBudgetText.textContent = `- ${formatRupiah(Math.abs(safety.sisa))}`;
      sisaBudgetText.className = 'font-bold text-rose-600 text-sm animate-pulse';
    }
  }

  // Progress Bar Width & Color
  if (progressBar) {
    const clampedPercent = Math.min(100, Math.max(0, safety.percentage));
    progressBar.style.width = `${clampedPercent}%`;

    // Remove previous color classes
    progressBar.classList.remove('bg-emerald-500', 'bg-amber-500', 'bg-rose-600', 'animate-pulse');

    if (safety.level === 'danger') {
      progressBar.classList.add('bg-rose-600', 'animate-pulse');
    } else if (safety.level === 'warning') {
      progressBar.classList.add('bg-amber-500');
    } else {
      progressBar.classList.add('bg-emerald-500');
    }
  }

  if (progressPercentText) {
    progressPercentText.textContent = `${safety.percentage.toFixed(0)}%`;
  }

  // Safety Status Badge
  if (safetyBadge) {
    safetyBadge.className = 'px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm';
    if (safety.level === 'danger') {
      safetyBadge.classList.add('bg-rose-100', 'text-rose-700', 'border', 'border-rose-300', 'animate-pulse');
      safetyBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span> <span>Bahaya (≥100%)</span>`;
    } else if (safety.level === 'warning') {
      safetyBadge.classList.add('bg-amber-100', 'text-amber-800', 'border', 'border-amber-300');
      safetyBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span> <span>Waspada (${Math.round(safety.percentage)}%)</span>`;
    } else {
      safetyBadge.classList.add('bg-emerald-100', 'text-emerald-800', 'border', 'border-emerald-300');
      safetyBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500"></span> <span>Aman (${Math.round(safety.percentage)}%)</span>`;
    }
  }

  // Warning Banner visibility & Audio check
  if (alertBanner && alertBannerText) {
    if (safety.level === 'danger') {
      alertBanner.classList.remove('hidden');
      alertBanner.className = 'mt-2.5 px-3 py-2 rounded-xl bg-rose-600 text-white flex items-center justify-between text-xs font-semibold shadow-md animate-pulse-danger';
      alertBannerText.innerHTML = `⚠️ <b>PERINGATAN:</b> Belanja melampaui uang saku! Kurangi Rp ${formatNumber(Math.abs(safety.sisa))}.`;
      headerContainer.classList.add('animate-flash-border');
    } else if (safety.level === 'warning') {
      alertBanner.classList.remove('hidden');
      alertBanner.className = 'mt-2.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs font-medium shadow-sm';
      alertBannerText.innerHTML = `⚠️ <b>PERHATIAN:</b> Pengeluaran mencapai ${Math.round(safety.percentage)}% dari batas dompet!`;
      headerContainer.classList.remove('animate-flash-border');
    } else {
      alertBanner.classList.add('hidden');
      headerContainer.classList.remove('animate-flash-border');
    }
  }

  // Update floating cart badge in bottom nav
  const navCartBadge = document.getElementById('nav-cart-badge');
  if (navCartBadge) {
    navCartBadge.textContent = metrics.totalItemsCount;
    navCartBadge.style.display = metrics.totalItemsCount > 0 ? 'flex' : 'none';
  }

  // Update realtime comparator counter in cart header (F-04)
  renderCartComparatorPill();
}

// Render Cart Card List (Tab 1: Belanja)
function renderCartList() {
  const container = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('cart-empty-state');
  const footerBar = document.getElementById('cart-floating-footer');
  if (!container) return;

  // Filter items by category & search
  const filteredItems = AppState.cart.filter(item => {
    const matchCategory = AppState.activeCategoryFilter === 'all' || item.kategori === AppState.activeCategoryFilter;
    const matchSearch = !AppState.searchQuery || item.namaBarang.toLowerCase().includes(AppState.searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (AppState.cart.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (footerBar) footerBar.classList.add('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (footerBar) footerBar.classList.remove('hidden');

  if (filteredItems.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-sm">
        <p class="text-slate-500 text-sm">Tidak ada barang yang cocok dengan filter "${AppState.searchQuery || AppState.activeCategoryFilter}".</p>
        <button onclick="resetFilters()" class="mt-3 text-xs font-semibold text-emerald-600 underline">Reset Filter & Pencarian</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredItems.map(item => {
    // Discount Calculation (F-03)
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const subtotal = disc.finalPrice * item.qty;
    const totalHemat = disc.savingsPerUnit * item.qty;

    // Price Comparator (F-04)
    const comparator = comparePriceWithLastMonth(disc.finalPrice, item.hargaRiwayatBulanLalu);

    // Discount Display Tag
    let discountTagHtml = '';
    if (item.diskonTipe === 'single') {
      discountTagHtml = `
        <span class="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          Diskon ${item.diskonValue}%
        </span>
      `;
    } else if (item.diskonTipe === 'tiered') {
      discountTagHtml = `
        <span class="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          Diskon ${item.diskonValue}% (Hemat ${disc.effectivePercent}%)
        </span>
      `;
    }

    return `
      <div class="cart-item-card bg-white rounded-2xl p-3.5 border ${item.checked ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'} shadow-sm transition-all hover:shadow-md mb-3" data-id="${item.id}">
        <!-- Top Row: Checkbox, Name, Category, Edit & Delete -->
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-start gap-2.5 flex-1 min-w-0">
            <button onclick="toggleItemCheck('${item.id}')" class="mt-0.5 w-6 h-6 min-w-6 rounded-lg border flex items-center justify-center transition-colors ${item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-slate-50 text-transparent hover:border-slate-400'}" title="Tandai dalam troli">
              <svg class="w-4 h-4 stroke-current stroke-[3]" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
            </button>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h4 class="font-bold text-slate-800 text-sm leading-tight truncate ${item.checked ? 'line-through text-slate-400' : ''}">
                  ${escapeHtml(item.namaBarang)}
                </h4>
                <span class="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  ${escapeHtml(item.kategori || 'Umum')}
                </span>
              </div>
              <div class="text-[11px] text-slate-500 mt-0.5">
                Satuan: <span class="font-medium text-slate-700">${escapeHtml(item.satuan)}</span>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-1">
            <button onclick="openEditItemModal('${item.id}')" class="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-50 transition-colors" title="Edit Item">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button onclick="deleteCartItem('${item.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors" title="Hapus Item">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </div>

        <!-- Middle Row: Price Comparator Badge & History Baseline -->
        <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <!-- Comparator Badge (F-04) -->
          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${comparator.badgeClass}">
            <span>${comparator.text}</span>
          </div>

          <!-- Baseline Reference -->
          <div class="text-[11px] text-slate-500 text-right">
            ${item.hargaRiwayatBulanLalu > 0 ? `Bulan lalu: <span class="font-semibold text-slate-700">${formatRupiah(item.hargaRiwayatBulanLalu)}</span>` : '<span class="italic text-slate-400">Belum ada acuan</span>'}
          </div>
        </div>

        <!-- Price Breakdown & Discounts -->
        <div class="mt-2 bg-slate-50 rounded-xl p-2.5 text-xs flex items-center justify-between">
          <div>
            <div class="flex items-center gap-1.5">
              ${disc.savingsPerUnit > 0 ? `<span class="line-through text-slate-400 text-[11px]">${formatRupiah(item.hargaSatuan)}</span>` : ''}
              <span class="font-bold text-slate-900">${formatRupiah(disc.finalPrice)}</span>
              <span class="text-slate-500 text-[10px]">/${item.satuan}</span>
            </div>
            <div class="mt-0.5">
              ${discountTagHtml}
              ${totalHemat > 0 ? `<span class="text-[10px] text-emerald-600 font-semibold ml-1">Hemat ${formatRupiah(totalHemat)}</span>` : ''}
            </div>
          </div>

          <!-- Stepper Kuantitas Ramah Jempol (F-02) -->
          <div class="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            <button onclick="updateItemQty('${item.id}', -1)" class="stepper-btn" title="Kurangi Kuantitas" aria-label="Kurangi kuantitas">−</button>
            <span onclick="promptDirectQtyEdit('${item.id}')" class="w-8 text-center font-bold text-slate-800 text-sm select-none cursor-pointer hover:bg-slate-100 rounded py-0.5" title="Klik untuk ubah kuantitas langsung">${item.qty}</span>
            <button onclick="updateItemQty('${item.id}', 1)" class="stepper-btn" title="Tambah Kuantitas" aria-label="Tambah kuantitas">+</button>
          </div>
        </div>

        <!-- Bottom Line: Item Subtotal -->
        <div class="mt-2 flex items-center justify-between text-xs pt-1">
          <span class="text-slate-500 font-medium">${item.qty} × ${formatRupiah(disc.finalPrice)}</span>
          <div class="text-right">
            <span class="text-slate-400 text-[11px]">Subtotal: </span>
            <span class="font-extrabold text-slate-900 text-sm">${formatRupiah(subtotal)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Update Footer Bar Summary
  const metrics = getCartMetrics();
  const footerTotal = document.getElementById('footer-total-belanja');
  const footerSavings = document.getElementById('footer-total-savings');
  const footerItemsCount = document.getElementById('footer-items-count');

  if (footerTotal) footerTotal.textContent = formatRupiah(metrics.totalBelanja);
  if (footerSavings) {
    footerSavings.textContent = metrics.totalHemat > 0 ? `Hemat ${formatRupiah(metrics.totalHemat)}` : 'Rp 0 hemat';
  }
  if (footerItemsCount) {
    footerItemsCount.textContent = `${metrics.totalItemsCount} item (${metrics.checkedItemsCount} troli)`;
  }
}

// Render Receipts (Tab 2: Riwayat)
function renderReceiptsList() {
  const container = document.getElementById('receipts-list-container');
  const emptyState = document.getElementById('receipts-empty-state');
  if (!container) return;

  if (AppState.receipts.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  // Filter receipts by search query (F-06 search)
  const filteredReceipts = AppState.receipts.filter(rec => {
    if (!AppState.receiptsSearchQuery) return true;
    const q = AppState.receiptsSearchQuery.toLowerCase();
    const titleMatch = (rec.judul || '').toLowerCase().includes(q);
    const dateFormatted = new Date(rec.tanggal).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }).toLowerCase();
    const dateMatch = dateFormatted.includes(q);
    const itemMatch = rec.items && rec.items.some(it => (it.namaBarang || '').toLowerCase().includes(q));
    return titleMatch || dateMatch || itemMatch;
  });

  if (filteredReceipts.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-sm">
        <p class="text-slate-500 text-sm">Tidak ada riwayat belanja yang cocok dengan "${AppState.receiptsSearchQuery}".</p>
        <button onclick="handleReceiptsSearch('')" class="mt-2 text-xs font-semibold text-emerald-600 underline">Tampilkan Semua Riwayat</button>
      </div>
    `;
    if (emptyState) emptyState.classList.add('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = filteredReceipts.map((rec, index) => {
    const dateFormatted = new Date(rec.tanggal).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const isOverbudget = rec.totalBelanja > rec.budgetSaatItu;

    return `
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-3 transition-all hover:shadow-md">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">${escapeHtml(rec.judul || 'Belanja Bulanan')}</h4>
            <div class="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>${dateFormatted}</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-bold ${isOverbudget ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}">
            ${isOverbudget ? 'Overbudget' : 'Sesuai Budget'}
          </span>
        </div>

        <!-- Receipt Financial Summary -->
        <div class="mt-3 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl text-xs">
          <div>
            <div class="text-slate-400 text-[10px]">Total Belanja</div>
            <div class="font-bold text-slate-900 text-sm">${formatRupiah(rec.totalBelanja)}</div>
          </div>
          <div class="text-right">
            <div class="text-slate-400 text-[10px]">Total Penghematan</div>
            <div class="font-bold text-emerald-600 text-sm">${formatRupiah(rec.totalHemat || 0)}</div>
          </div>
        </div>

        <!-- Item Accordion -->
        <div class="mt-3">
          <button onclick="toggleReceiptAccordion('rec-items-${index}')" class="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-emerald-600 py-1">
            <span>Rincian Barang (${rec.items.length} item)</span>
            <svg id="rec-chevron-${index}" class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div id="rec-items-${index}" class="hidden mt-2 pt-2 border-t border-slate-100 divide-y divide-slate-100 text-xs">
            ${rec.items.map(it => `
              <div class="py-1.5 flex justify-between items-center text-slate-700">
                <div>
                  <span class="font-medium text-slate-800">${escapeHtml(it.namaBarang)}</span>
                  <span class="text-slate-400 text-[11px]"> (${it.qty} ${it.satuan})</span>
                </div>
                <div class="font-semibold text-slate-900">${formatRupiah(it.totalHarga)}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <button onclick="copyReceiptText('${rec.id}')" class="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            <span>Salin Struk</span>
          </button>
          <div class="flex items-center gap-1">
            <button onclick="reloadReceiptToCart('${rec.id}')" class="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Pakai Ulang</span>
            </button>
            <button onclick="deleteReceipt('${rec.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors" title="Hapus Sesi Riwayat">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Render Analytics & Budget Setting (Tab 3: Anggaran)
function renderBudgetTab() {
  const budgetInput = document.getElementById('input-budget-cap');
  const thresholdSlider = document.getElementById('input-threshold-slider');
  const thresholdValueText = document.getElementById('threshold-slider-val');

  if (budgetInput) budgetInput.value = AppState.budget;
  if (thresholdSlider) thresholdSlider.value = AppState.threshold;
  if (thresholdValueText) thresholdValueText.textContent = `${AppState.threshold}%`;

  // Render Category Breakdown Charts
  renderCategoryBreakdown();

  // Render Price Reference Catalog (Katalog Acuan Bulan Lalu)
  renderPriceHistoryTable();
}

function renderCategoryBreakdown() {
  const container = document.getElementById('category-breakdown-container');
  if (!container) return;

  const categories = ['Kebutuhan Pokok', 'Makanan', 'Minuman', 'Perlengkapan Mandi', 'Kebersihan & Rumah', 'Lainnya'];
  const categoryTotals = {};
  categories.forEach(c => categoryTotals[c] = 0);

  let grandTotal = 0;
  AppState.cart.forEach(item => {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const subtotal = disc.finalPrice * item.qty;
    const cat = categories.includes(item.kategori) ? item.kategori : 'Lainnya';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + subtotal;
    grandTotal += subtotal;
  });

  const categoryColors = {
    'Kebutuhan Pokok': '#10B981',
    'Makanan': '#F59E0B',
    'Minuman': '#3B82F6',
    'Perlengkapan Mandi': '#EC4899',
    'Kebersihan & Rumah': '#8B5CF6',
    'Lainnya': '#64748B'
  };

  const activeCategories = categories.filter(c => categoryTotals[c] > 0);

  if (activeCategories.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-400 italic text-center py-4">Belum ada barang di keranjang belanja saat ini.</p>`;
    return;
  }

  container.innerHTML = activeCategories.map(cat => {
    const total = categoryTotals[cat];
    const pct = grandTotal > 0 ? ((total / grandTotal) * 100).toFixed(1) : 0;
    const color = categoryColors[cat] || '#10B981';

    return `
      <div class="mb-3">
        <div class="flex justify-between items-center text-xs mb-1">
          <span class="font-semibold text-slate-800 flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${color}"></span>
            ${escapeHtml(cat)}
          </span>
          <span class="text-slate-600 font-bold">${formatRupiah(total)} (${pct}%)</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background-color: ${color};"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderPriceHistoryTable() {
  const container = document.getElementById('price-history-catalog');
  if (!container) return;

  const entries = Object.entries(AppState.priceHistory);
  if (entries.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-400 italic text-center py-3">Tidak ada data harga acuan.</p>`;
    return;
  }

  // Count items with price changes in current cart
  let countUp = 0;
  let countDown = 0;
  let countStable = 0;

  AppState.cart.forEach(item => {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const comp = comparePriceWithLastMonth(disc.finalPrice, item.hargaRiwayatBulanLalu);
    if (comp.status === 'up') countUp++;
    else if (comp.status === 'down') countDown++;
    else if (comp.status === 'stable') countStable++;
  });

  const statsContainer = document.getElementById('price-trend-stats');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="grid grid-cols-3 gap-2 text-center text-xs">
        <div class="bg-rose-50 border border-rose-200 rounded-xl p-2">
          <div class="text-[10px] text-rose-600 font-bold">Harga Naik</div>
          <div class="font-extrabold text-rose-700 text-base">${countUp}</div>
        </div>
        <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-2">
          <div class="text-[10px] text-emerald-600 font-bold">Harga Turun</div>
          <div class="font-extrabold text-emerald-700 text-base">${countDown}</div>
        </div>
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-2">
          <div class="text-[10px] text-slate-600 font-bold">Harga Stabil</div>
          <div class="font-extrabold text-slate-700 text-base">${countStable}</div>
        </div>
      </div>
    `;
  }

  container.innerHTML = entries.map(([name, data]) => {
    return `
      <div class="py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs mb-2">
        <div>
          <div class="font-bold text-slate-800">${escapeHtml(name)}</div>
          <div class="text-[10px] text-slate-500">${escapeHtml(data.kategori || 'Umum')} • Satuan: ${escapeHtml(data.satuan || 'pcs')}</div>
        </div>
        <div class="text-right">
          <div class="font-extrabold text-emerald-700">${formatRupiah(data.harga)}</div>
          <div class="text-[10px] text-slate-400">Acuan Bulan Lalu</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderAll() {
  renderBudgetSafetyHeader();
  if (AppState.currentTab === 'belanja') {
    renderCartList();
  } else if (AppState.currentTab === 'riwayat') {
    renderReceiptsList();
  } else if (AppState.currentTab === 'anggaran') {
    renderBudgetTab();
  }
}

// ==========================================
// 6. CART CRUD & EVENT HANDLERS
// ==========================================

function updateItemQty(itemId, delta) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  const newQty = item.qty + delta;
  if (newQty <= 0) {
    if (confirm(`Hapus "${item.namaBarang}" dari keranjang?`)) {
      deleteCartItem(itemId);
    }
    return;
  }

  item.qty = newQty;
  saveCart();
  playSound('tap');
  renderBudgetSafetyHeader();
  renderCartList();

  // Check if budget exceeded after qty increase
  checkBudgetAlertTrigger();
}

function toggleItemCheck(itemId) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;
  item.checked = !item.checked;
  saveCart();
  playSound('tap');
  renderCartList();
}

function deleteCartItem(itemId) {
  AppState.cart = AppState.cart.filter(i => i.id !== itemId);
  saveCart();
  playSound('tap');
  renderBudgetSafetyHeader();
  renderCartList();
  showToast('Item berhasil dihapus.', 'info');
}

function checkBudgetAlertTrigger() {
  const metrics = getCartMetrics();
  if (metrics.safety.level === 'danger') {
    playSound('danger');
  }
}

// ==========================================
// 7. MODAL ADD / EDIT ITEM (F-01, F-03, F-04)
// ==========================================

function openAddItemModal(prefilledName = '') {
  AppState.editingItemId = null;
  const modal = document.getElementById('item-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('item-form');
  if (!modal || !form) return;

  form.reset();
  modalTitle.textContent = 'Tambah Item Belanja';

  const submitBtn = document.getElementById('btn-submit-item');
  if (submitBtn) submitBtn.textContent = 'Tambahkan ke Keranjang';

  // Set default values
  document.getElementById('input-qty').value = '1';
  document.getElementById('input-satuan').value = 'pcs';
  document.getElementById('input-kategori').value = 'Kebutuhan Pokok';
  setDiscountTypeSelection('none');

  if (prefilledName) {
    document.getElementById('input-nama').value = prefilledName;
    handleItemNameChange(prefilledName);
  } else {
    document.getElementById('input-harga-lalu').value = '';
    updateModalPreview();
  }

  modal.classList.add('active');
  document.getElementById('input-nama').focus();
}

function openEditItemModal(itemId) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;

  AppState.editingItemId = itemId;
  const modal = document.getElementById('item-modal');
  const modalTitle = document.getElementById('modal-title');
  const submitBtn = document.getElementById('btn-submit-item');

  modalTitle.textContent = 'Edit Item Belanja';
  if (submitBtn) submitBtn.textContent = 'Simpan Perubahan';

  document.getElementById('input-nama').value = item.namaBarang;
  document.getElementById('input-kategori').value = item.kategori;
  document.getElementById('input-satuan').value = item.satuan;
  document.getElementById('input-qty').value = item.qty;
  document.getElementById('input-harga-satuan').value = item.hargaSatuan;
  document.getElementById('input-harga-lalu').value = item.hargaRiwayatBulanLalu || '';

  setDiscountTypeSelection(item.diskonTipe || 'none', item.diskonValue || '');
  updateModalPreview();

  modal.classList.add('active');
}

function closeItemModal() {
  const modal = document.getElementById('item-modal');
  if (modal) modal.classList.remove('active');
  AppState.editingItemId = null;
}

function setDiscountTypeSelection(type, value = '') {
  const container = document.getElementById('discount-type-group');
  const singleInputGroup = document.getElementById('group-discount-single');
  const tieredInputGroup = document.getElementById('group-discount-tiered');
  const singleInput = document.getElementById('input-discount-single');
  const tieredInput = document.getElementById('input-discount-tiered');

  if (!container) return;

  // Radio button updates
  const radios = container.querySelectorAll('input[name="diskonTipe"]');
  radios.forEach(r => {
    r.checked = r.value === type;
  });

  if (type === 'single') {
    singleInputGroup.classList.remove('hidden');
    tieredInputGroup.classList.add('hidden');
    if (value) singleInput.value = value;
  } else if (type === 'tiered') {
    singleInputGroup.classList.add('hidden');
    tieredInputGroup.classList.remove('hidden');
    if (value) tieredInput.value = value;
  } else {
    singleInputGroup.classList.add('hidden');
    tieredInputGroup.classList.add('hidden');
  }

  updateModalPreview();
}

function getSelectedDiscountType() {
  const checked = document.querySelector('input[name="diskonTipe"]:checked');
  return checked ? checked.value : 'none';
}

function getSelectedDiscountValue() {
  const type = getSelectedDiscountType();
  if (type === 'single') {
    return document.getElementById('input-discount-single').value.trim();
  } else if (type === 'tiered') {
    return document.getElementById('input-discount-tiered').value.trim();
  }
  return '';
}

// Auto-fill Last Month Price when Item Name is typed or selected (F-04 Helper)
function handleItemNameChange(name) {
  const trimmed = name.trim();
  const match = AppState.priceHistory[trimmed];
  if (match) {
    document.getElementById('input-harga-lalu').value = match.harga;
    if (match.satuan) document.getElementById('input-satuan').value = match.satuan;
    if (match.kategori) document.getElementById('input-kategori').value = match.kategori;
    showToast(`Acuan harga bulan lalu ditemukan: ${formatRupiah(match.harga)}/${match.satuan}`, 'info');
  }
  updateModalPreview();
}

// Live calculation preview inside Modal (F-02, F-03, F-04 Realtime Preview)
function updateModalPreview() {
  const hargaSatuan = parseFloat(document.getElementById('input-harga-satuan').value) || 0;
  const qty = parseInt(document.getElementById('input-qty').value, 10) || 1;
  const diskonTipe = getSelectedDiscountType();
  const diskonValue = getSelectedDiscountValue();
  const hargaLalu = parseFloat(document.getElementById('input-harga-lalu').value) || 0;

  const disc = calculateDiscount(hargaSatuan, diskonTipe, diskonValue);
  const comp = comparePriceWithLastMonth(disc.finalPrice, hargaLalu);
  const subtotal = disc.finalPrice * qty;

  const previewFinalUnit = document.getElementById('preview-final-unit');
  const previewSavings = document.getElementById('preview-savings');
  const previewSubtotal = document.getElementById('preview-subtotal');
  const previewCompBadge = document.getElementById('preview-comparator-badge');
  const previewSteps = document.getElementById('preview-steps-log');

  if (previewFinalUnit) previewFinalUnit.textContent = formatRupiah(disc.finalPrice);
  if (previewSavings) {
    if (disc.savingsPerUnit > 0) {
      previewSavings.textContent = `Hemat ${formatRupiah(disc.savingsPerUnit * qty)} (${disc.effectivePercent}% diskon)`;
      previewSavings.classList.remove('hidden');
    } else {
      previewSavings.classList.add('hidden');
    }
  }

  if (previewSubtotal) previewSubtotal.textContent = formatRupiah(subtotal);

  if (previewCompBadge) {
    previewCompBadge.className = `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${comp.badgeClass}`;
    previewCompBadge.textContent = comp.text;
  }

  if (previewSteps) {
    if (disc.steps.length > 0) {
      previewSteps.innerHTML = disc.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('');
      previewSteps.classList.remove('hidden');
    } else {
      previewSteps.classList.add('hidden');
    }
  }
}

// Form Submit Handler (F-01, F-02, F-03, F-04 Validation)
function handleItemFormSubmit(e) {
  e.preventDefault();

  const namaBarang = document.getElementById('input-nama').value.trim();
  const kategori = document.getElementById('input-kategori').value;
  const satuan = document.getElementById('input-satuan').value;
  const qty = parseInt(document.getElementById('input-qty').value, 10);
  const hargaSatuan = parseFloat(document.getElementById('input-harga-satuan').value);
  const diskonTipe = getSelectedDiscountType();
  const diskonValue = getSelectedDiscountValue();
  const hargaRiwayatBulanLalu = parseFloat(document.getElementById('input-harga-lalu').value) || 0;

  // Clean validation rules
  if (!namaBarang || namaBarang.length < 2) {
    showToast('Harap masukkan nama barang minimal 2 karakter!', 'error');
    document.getElementById('input-nama')?.focus();
    return;
  }

  if (isNaN(qty) || qty < 1) {
    showToast('Kuantitas beli (Qty) minimal 1!', 'error');
    document.getElementById('input-qty')?.focus();
    return;
  }

  if (isNaN(hargaSatuan) || hargaSatuan <= 0) {
    showToast('Harap masukkan harga satuan yang valid (> Rp 0)!', 'error');
    document.getElementById('input-harga-satuan')?.focus();
    return;
  }

  if (diskonTipe === 'single') {
    const val = parseFloat(diskonValue.replace(/%/g, '')) || 0;
    if (val < 0 || val > 100) {
      showToast('Diskon tunggal harus antara 0% dan 100%!', 'error');
      document.getElementById('input-discount-single')?.focus();
      return;
    }
  }

  if (diskonTipe === 'tiered') {
    const parts = diskonValue.replace(/%/g, '').split('+').map(p => parseFloat(p.trim()));
    const hasInvalid = parts.some(p => isNaN(p) || p <= 0 || p > 100);
    if (parts.length === 0 || hasInvalid) {
      showToast('Format diskon bertingkat tidak valid! Contoh: 50% + 20% atau 50+20', 'error');
      document.getElementById('input-discount-tiered')?.focus();
      return;
    }
  }

  if (AppState.editingItemId) {
    // Update existing item
    const index = AppState.cart.findIndex(i => i.id === AppState.editingItemId);
    if (index !== -1) {
      AppState.cart[index] = {
        ...AppState.cart[index],
        namaBarang,
        kategori,
        satuan,
        qty,
        hargaSatuan,
        diskonTipe,
        diskonValue,
        hargaRiwayatBulanLalu
      };
      showToast('Perubahan item disimpan.', 'success');
    }
  } else {
    // Add new item
    const newItem = {
      id: `item-${Date.now()}`,
      namaBarang,
      kategori,
      satuan,
      qty,
      hargaSatuan,
      diskonTipe,
      diskonValue,
      hargaRiwayatBulanLalu,
      checked: false
    };
    AppState.cart.unshift(newItem);
    showToast(`"${namaBarang}" ditambahkan ke keranjang!`, 'success');
  }

  // Update reference price database if provided
  if (hargaRiwayatBulanLalu > 0) {
    AppState.priceHistory[namaBarang] = {
      harga: hargaRiwayatBulanLalu,
      satuan,
      kategori
    };
    savePriceHistory();
  }

  saveCart();
  playSound('add');
  closeItemModal();
  renderBudgetSafetyHeader();
  renderCartList();

  // Check budget alert
  checkBudgetAlertTrigger();
}

// ==========================================
// 8. CHECKOUT & RECEIPT ENGINE (F-06)
// ==========================================

function handleCheckout() {
  if (AppState.cart.length === 0) {
    showToast('Keranjang belanja masih kosong!', 'error');
    return;
  }

  const metrics = getCartMetrics();
  const isOverbudget = metrics.totalBelanja > AppState.budget;

  const confirmMsg = isOverbudget
    ? `⚠️ Perhatian! Belanja saat ini melebihi budget sebesar Rp ${formatNumber(metrics.totalBelanja - AppState.budget)}. Tetap selesaikan belanja?`
    : `Selesaikan belanja sebesar ${formatRupiah(metrics.totalBelanja)}? Riwayat akan disimpan dan harga akan dijadikan acuan untuk bulan depan.`;

  if (!confirm(confirmMsg)) return;

  const now = new Date();
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const receiptTitle = `Belanja Bulanan - ${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  // Map active cart items into receipt snapshot
  const receiptItems = AppState.cart.map(item => {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    // Update reference price history for future months!
    AppState.priceHistory[item.namaBarang] = {
      harga: disc.finalPrice,
      satuan: item.satuan,
      kategori: item.kategori
    };

    return {
      namaBarang: item.namaBarang,
      qty: item.qty,
      satuan: item.satuan,
      hargaAkhirSatuan: disc.finalPrice,
      totalHarga: disc.finalPrice * item.qty
    };
  });

  const newReceipt = {
    id: `rec-${Date.now()}`,
    tanggal: now.toISOString(),
    judul: receiptTitle,
    totalBelanja: metrics.totalBelanja,
    totalHemat: metrics.totalHemat,
    budgetSaatItu: AppState.budget,
    statusBudget: metrics.safety.level,
    items: receiptItems
  };

  AppState.receipts.unshift(newReceipt);
  saveReceipts();
  savePriceHistory();

  // Clear current cart
  AppState.cart = [];
  saveCart();

  playSound('checkout');
  renderAll();

  // Show celebratory Checkout Success Modal
  showCheckoutSuccessModal(newReceipt);
}

function showCheckoutSuccessModal(receipt) {
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  document.getElementById('checkout-modal-title').textContent = receipt.judul;
  document.getElementById('checkout-modal-total').textContent = formatRupiah(receipt.totalBelanja);
  document.getElementById('checkout-modal-savings').textContent = formatRupiah(receipt.totalHemat);
  document.getElementById('checkout-modal-budget').textContent = formatRupiah(receipt.budgetSaatItu);

  const statusPill = document.getElementById('checkout-modal-status');
  if (receipt.totalBelanja > receipt.budgetSaatItu) {
    statusPill.textContent = 'Defisit / Overbudget';
    statusPill.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700';
  } else {
    statusPill.textContent = 'Aman Sesuai Anggaran';
    statusPill.className = 'px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700';
  }

  const itemsContainer = document.getElementById('checkout-modal-items');
  itemsContainer.innerHTML = receipt.items.map(it => `
    <div class="flex justify-between items-center py-1 text-xs border-b border-slate-100">
      <span class="text-slate-700">${escapeHtml(it.namaBarang)} (${it.qty} ${it.satuan})</span>
      <span class="font-bold text-slate-900">${formatRupiah(it.totalHarga)}</span>
    </div>
  `).join('');

  modal.classList.add('active');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');
  switchTab('riwayat');
}

function copyReceiptText(receiptId) {
  const rec = AppState.receipts.find(r => r.id === receiptId);
  if (!rec) return;

  const dateFormatted = new Date(rec.tanggal).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let text = `🛒 STRUK BELANJA: ${rec.judul}\n`;
  text += `📅 Tanggal: ${dateFormatted}\n`;
  text += `💰 Batas Dompet: ${formatRupiah(rec.budgetSaatItu)}\n`;
  text += `--------------------------------\n`;
  rec.items.forEach((it, idx) => {
    text += `${idx + 1}. ${it.namaBarang} (${it.qty} ${it.satuan}) : ${formatRupiah(it.totalHarga)}\n`;
  });
  text += `--------------------------------\n`;
  text += `TOTAL BELANJA: ${formatRupiah(rec.totalBelanja)}\n`;
  text += `HEMAT DISKON: ${formatRupiah(rec.totalHemat)}\n`;
  text += `STATUS: ${rec.totalBelanja > rec.budgetSaatItu ? 'OVERBUDGET' : 'AMAN'}\n`;
  text += `Catatan: Dikelola via Smart Grocery Tracker (Rian)\n`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Struk belanja disalin ke clipboard!', 'success');
    });
  } else {
    showToast('Teks struk disiapkan.', 'info');
  }
}

function reloadReceiptToCart(receiptId) {
  const rec = AppState.receipts.find(r => r.id === receiptId);
  if (!rec) return;

  if (AppState.cart.length > 0) {
    if (!confirm('Ganti keranjang belanja saat ini dengan daftar belanja dari riwayat ini?')) return;
  }

  AppState.cart = rec.items.map((it, idx) => ({
    id: `item-reload-${Date.now()}-${idx}`,
    namaBarang: it.namaBarang,
    kategori: AppState.priceHistory[it.namaBarang]?.kategori || 'Kebutuhan Pokok',
    satuan: it.satuan,
    qty: it.qty,
    hargaSatuan: it.hargaAkhirSatuan,
    diskonTipe: 'none',
    diskonValue: '',
    hargaRiwayatBulanLalu: AppState.priceHistory[it.namaBarang]?.harga || it.hargaAkhirSatuan,
    checked: false
  }));

  saveCart();
  playSound('tap');
  switchTab('belanja');
  showToast('Item riwayat dimuat ke keranjang belanja!', 'success');
}

function deleteReceipt(receiptId) {
  if (!confirm('Hapus sesi riwayat belanja ini?')) return;
  AppState.receipts = AppState.receipts.filter(r => r.id !== receiptId);
  saveReceipts();
  playSound('tap');
  renderReceiptsList();
  showToast('Sesi riwayat dihapus.', 'info');
}

function toggleReceiptAccordion(containerId) {
  const elem = document.getElementById(containerId);
  if (!elem) return;
  const isHidden = elem.classList.contains('hidden');
  elem.classList.toggle('hidden');
  const index = containerId.replace('rec-items-', '');
  const chevron = document.getElementById(`rec-chevron-${index}`);
  if (chevron) {
    chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  }
}

// ==========================================
// 9. SETTINGS & BUDGET CONTROLS (F-05)
// ==========================================

function handleBudgetCapChange(newVal) {
  const val = Math.max(10000, parseInt(newVal, 10) || 300000);
  AppState.budget = val;
  saveBudget();
  renderBudgetSafetyHeader();
  renderBudgetTab();
  showToast(`Batas dompet tunai diatur ke ${formatRupiah(val)}`, 'success');
}

function setQuickBudget(amount) {
  const input = document.getElementById('input-budget-cap');
  if (input) input.value = amount;
  handleBudgetCapChange(amount);
  playSound('tap');
}

function handleThresholdChange(newVal) {
  const val = Math.max(50, Math.min(95, parseInt(newVal, 10) || 80));
  AppState.threshold = val;
  saveThreshold();
  const valText = document.getElementById('threshold-slider-val');
  if (valText) valText.textContent = `${val}%`;
  renderBudgetSafetyHeader();
  showToast(`Ambang batas waspada diatur ke ${val}%`, 'info');
}

function toggleSound() {
  AppState.soundEnabled = !AppState.soundEnabled;
  saveSound();
  updateSoundButtonUI();
  if (AppState.soundEnabled) {
    playSound('add');
    showToast('Suara & getaran diaktifkan', 'info');
  } else {
    showToast('Suara dinonaktifkan', 'info');
  }
}

function updateSoundButtonUI() {
  const btn = document.getElementById('btn-sound-toggle');
  if (!btn) return;
  if (AppState.soundEnabled) {
    btn.innerHTML = `<svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
    btn.title = "Suara Aktif (Klik untuk Mute)";
  } else {
    btn.innerHTML = `<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
    btn.title = "Suara Mute (Klik untuk Aktifkan)";
  }
}

// ==========================================
// 10. TABS & NAVIGATION
// ==========================================

function switchTab(tabName) {
  AppState.currentTab = tabName;

  // Toggle view containers
  const tabBelanja = document.getElementById('tab-view-belanja');
  const tabRiwayat = document.getElementById('tab-view-riwayat');
  const tabAnggaran = document.getElementById('tab-view-anggaran');

  if (tabBelanja) tabBelanja.classList.toggle('hidden', tabName !== 'belanja');
  if (tabRiwayat) tabRiwayat.classList.toggle('hidden', tabName !== 'riwayat');
  if (tabAnggaran) tabAnggaran.classList.toggle('hidden', tabName !== 'anggaran');

  // Toggle bottom nav active states
  const navBtns = document.querySelectorAll('.nav-item');
  navBtns.forEach(btn => {
    const isTarget = btn.getAttribute('data-tab') === tabName;
    btn.classList.toggle('active', isTarget);
  });

  playSound('tap');
  renderAll();

  // Scroll app content to top
  const content = document.querySelector('.app-content');
  if (content) content.scrollTop = 0;
}

function setCategoryFilter(category) {
  AppState.activeCategoryFilter = category;
  const pills = document.querySelectorAll('.category-filter-pill');
  pills.forEach(pill => {
    const cat = pill.getAttribute('data-category');
    if (cat === category) {
      pill.className = 'category-filter-pill px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white whitespace-nowrap shadow-sm transition-all';
    } else {
      pill.className = 'category-filter-pill px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 whitespace-nowrap transition-all';
    }
  });
  renderCartList();
}

function handleSearch(query) {
  AppState.searchQuery = query;
  renderCartList();
}

function resetFilters() {
  AppState.searchQuery = '';
  AppState.activeCategoryFilter = 'all';
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  setCategoryFilter('all');
}

// ==========================================
// 11. TOAST NOTIFICATIONS & UTILS
// ==========================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' || type === 'danger' ? 'toast-danger' : type === 'success' ? 'toast-success' : ''}`;

  let icon = '<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
  if (type === 'success') {
    icon = '<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  }

  toast.innerHTML = `${icon}<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================
// 11B. INTERACTIVE HELPERS & QUICK CONTROLS
// ==========================================

function promptDirectQtyEdit(itemId) {
  const item = AppState.cart.find(i => i.id === itemId);
  if (!item) return;
  const input = prompt(`Masukkan kuantitas baru untuk "${item.namaBarang}":`, item.qty);
  if (input === null) return;
  const val = parseInt(input, 10);
  if (isNaN(val) || val <= 0) {
    showToast('Kuantitas harus berupa angka bulat minimal 1!', 'error');
    return;
  }
  item.qty = val;
  saveCart();
  playSound('tap');
  renderBudgetSafetyHeader();
  renderCartList();
  checkBudgetAlertTrigger();
  showToast(`Kuantitas "${item.namaBarang}" diubah menjadi ${val}.`, 'success');
}

function promptBudgetEdit() {
  const current = AppState.budget;
  const input = prompt('Atur Batas Uang Saku Tunai (Rp):', current);
  if (input === null) return;
  const val = parseInt(input.toString().replace(/[^0-9]/g, ''), 10);
  if (isNaN(val) || val < 10000) {
    showToast('Batas uang saku minimal Rp 10.000!', 'error');
    return;
  }
  handleBudgetCapChange(val);
}

function adjustModalQty(delta) {
  const input = document.getElementById('input-qty');
  if (!input) return;
  const current = parseInt(input.value, 10) || 1;
  const next = Math.max(1, current + delta);
  input.value = next;
  updateModalPreview();
  playSound('tap');
}

function setCategoryChoice(cat) {
  const select = document.getElementById('input-kategori');
  if (select) {
    select.value = cat;
    syncCategoryChips(cat);
    updateModalPreview();
  }
}

function syncCategoryChips(cat) {
  const chips = document.querySelectorAll('.modal-cat-chip');
  chips.forEach(chip => {
    const isMatch = chip.textContent.trim().toLowerCase() === cat.toLowerCase() ||
                    cat.toLowerCase().includes(chip.textContent.trim().toLowerCase());
    if (isMatch) {
      chip.className = 'modal-cat-chip text-[10px] px-2 py-0.5 rounded-lg border border-emerald-400 bg-emerald-50 font-bold text-emerald-800 shadow-xs';
    } else {
      chip.className = 'modal-cat-chip text-[10px] px-2 py-0.5 rounded-lg border border-slate-200 bg-slate-100 font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700';
    }
  });
}

function setUnitChoice(unit) {
  const select = document.getElementById('input-satuan');
  if (select) {
    select.value = unit;
    syncUnitChips(unit);
    updateModalPreview();
  }
}

function syncUnitChips(unit) {
  const chips = document.querySelectorAll('.modal-unit-chip');
  chips.forEach(chip => {
    const isMatch = chip.textContent.trim().toLowerCase() === unit.toLowerCase();
    if (isMatch) {
      chip.className = 'modal-unit-chip text-[10px] px-2 py-0.5 rounded-lg border border-emerald-400 bg-emerald-50 font-bold text-emerald-800 shadow-xs';
    } else {
      chip.className = 'modal-unit-chip text-[10px] px-2 py-0.5 rounded-lg border border-slate-200 bg-slate-100 font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700';
    }
  });
}

function setSinglePreset(percent) {
  setDiscountTypeSelection('single', percent);
  const input = document.getElementById('input-discount-single');
  if (input) input.value = percent;
  updateModalPreview();
}

function setTieredPreset(presetStr) {
  setDiscountTypeSelection('tiered', presetStr);
  const input = document.getElementById('input-discount-tiered');
  if (input) input.value = presetStr;
  updateModalPreview();
}

function handleReceiptsSearch(query) {
  AppState.receiptsSearchQuery = query.trim();
  renderReceiptsList();
}

function renderCartComparatorPill() {
  const pill = document.getElementById('cart-comparator-pill');
  if (!pill) return;

  let countUp = 0;
  let countDown = 0;
  let countStable = 0;

  AppState.cart.forEach(item => {
    const disc = calculateDiscount(item.hargaSatuan, item.diskonTipe, item.diskonValue);
    const comp = comparePriceWithLastMonth(disc.finalPrice, item.hargaRiwayatBulanLalu);
    if (comp.status === 'up') countUp++;
    else if (comp.status === 'down') countDown++;
    else if (comp.status === 'stable') countStable++;
  });

  if (AppState.cart.length === 0) {
    pill.classList.add('hidden');
    return;
  }

  pill.classList.remove('hidden');
  pill.innerHTML = `
    <span class="text-rose-600 font-black">↑${countUp}</span>
    <span class="text-slate-300">|</span>
    <span class="text-emerald-600 font-black">↓${countDown}</span>
    <span class="text-slate-300">|</span>
    <span class="text-slate-500 font-black">=${countStable}</span>
  `;
}

// ==========================================
// 12. PWA SERVICE WORKER REGISTRATION
// ==========================================

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        console.log('PWA ServiceWorker registered successfully:', reg.scope);
      }).catch((err) => {
        console.warn('PWA ServiceWorker registration failed:', err);
      });
    });
  }
}

// Global Event Listeners & Boot
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  updateSoundButtonUI();
  registerServiceWorker();
  renderAll();

  // Discount radio change listener in modal
  const discountRadios = document.querySelectorAll('input[name="diskonTipe"]');
  discountRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      setDiscountTypeSelection(e.target.value);
    });
  });

  // Modal input live preview listeners
  const previewTriggers = [
    'input-harga-satuan',
    'input-qty',
    'input-discount-single',
    'input-discount-tiered',
    'input-harga-lalu'
  ];
  previewTriggers.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateModalPreview);
    }
  });

  // Name change autocomplete trigger
  const nameInput = document.getElementById('input-nama');
  if (nameInput) {
    nameInput.addEventListener('change', (e) => handleItemNameChange(e.target.value));
  }

  // Budget Cap change listener
  const budgetInput = document.getElementById('input-budget-cap');
  if (budgetInput) {
    budgetInput.addEventListener('change', (e) => handleBudgetCapChange(e.target.value));
  }

  const thresholdSlider = document.getElementById('input-threshold-slider');
  if (thresholdSlider) {
    thresholdSlider.addEventListener('input', (e) => handleThresholdChange(e.target.value));
  }
});
