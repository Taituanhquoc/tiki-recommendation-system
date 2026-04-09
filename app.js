/* =============================================
   TIKI MOBILE — app.js
   Loads data.json, renders recommendations,
   and powers the suggestion system.
   ============================================= */

'use strict';

// ── State ──────────────────────────────────────
const State = {
  data: null,
  cart: [],
  recentSearches: [],
  currentProduct: null,
  allProducts: [],
};

// ── Extra catalogue products (supplement data.json) ──
const EXTRA_PRODUCTS = [
  { product_id: 9001, product_name: "Tai nghe Sony WH-1000XM5", predicted_rating: 4.8, price: "6.490.000đ", old_price: "8.490.000đ", discount: "-24%", icon: "🎧", category: "Tai nghe", sold: "1.4k", rating_count: 2203, tags: ["sony","tai nghe","âm thanh","chống ồn"], related: [9002, 9003], bundle: [9002] },
  { product_id: 9002, product_name: "MacBook Air M2 8GB 256GB", predicted_rating: 4.9, price: "24.490.000đ", old_price: "29.990.000đ", discount: "-18%", icon: "💻", category: "Laptop", sold: "890", rating_count: 1876, tags: ["apple","laptop","macbook"], related: [9001, 9003], bundle: [9001] },
  { product_id: 9003, product_name: "Nintendo Switch OLED", predicted_rating: 4.7, price: "7.490.000đ", old_price: "9.990.000đ", discount: "-25%", icon: "🎮", category: "Gaming", sold: "2.1k", rating_count: 4102, tags: ["nintendo","gaming","game","switch"], related: [9004, 9001], bundle: [] },
  { product_id: 9004, product_name: "Loa JBL Flip 6", predicted_rating: 4.6, price: "2.190.000đ", old_price: "2.890.000đ", discount: "-24%", icon: "🔊", category: "Âm thanh", sold: "3.7k", rating_count: 1509, tags: ["jbl","loa","âm thanh","bluetooth"], related: [9001, 9002], bundle: [9001] },
];

// ── Keyword → related product ids ──
const KEYWORD_MAP = {
  "iphone": [276110349, 9002, 9001],
  "apple": [276110349, 9002, 9001],
  "điện thoại": [276110349, 4048043, 271234577, 181928208],
  "panasonic": [4048043, 181928208],
  "nokia": [271234577],
  "manga": [278967562],
  "sách": [278967562],
  "tai nghe": [9001],
  "laptop": [9002],
  "gaming": [9003],
  "loa": [9004],
  "âm thanh": [9001, 9004],
};

// ── Init ───────────────────────────────────────
async function init() {
  try {
    const res = await fetch('data.json');
    State.data = await res.json();
  } catch (e) {
    console.warn('Could not fetch data.json, using fallback.');
    State.data = {
      user_id: 29754430,
      recommendations: [
        { product_id: 276110349, product_name: "Apple iPhone 16", predicted_rating: 5.0 },
        { product_id: 4048043, product_name: "Điện Thoại Bàn Panasonic KX-TS500", predicted_rating: 5.0 },
        { product_id: 271234577, product_name: "Điện Thoại Nokia 105 4G Pro - Hàng Chính Hãng", predicted_rating: 5.0 },
        { product_id: 181928208, product_name: "Điện thoại bàn Panasonic KX-TGC310 hàng chính hãng", predicted_rating: 5.0 },
        { product_id: 278967562, product_name: "Monster - Deluxe Edition – [Chọn Tập Lẻ]", predicted_rating: 5.0 },
      ]
    };
  }

  // Enrich recommendations with display data
  const enriched = enrichProducts(State.data.recommendations);
  State.allProducts = [...enriched, ...EXTRA_PRODUCTS];
  State.data.recommendations = enriched;

  render();
}

// ── Enrich raw JSON products with display metadata ──
function enrichProducts(list) {
  const defaults = [
    { price: "22.990.000đ", old_price: "26.990.000đ", discount: "-15%", icon: "📱", category: "Điện thoại", sold: "1.2k", rating_count: 3241, tags: ["apple","iphone","điện thoại"], related: [4048043, 271234577, 9001], bundle: [9001] },
    { price: "390.000đ",    old_price: "490.000đ",     discount: "-20%", icon: "☎️", category: "Điện thoại bàn", sold: "4.5k", rating_count: 892, tags: ["panasonic","điện thoại bàn","văn phòng"], related: [181928208, 271234577], bundle: [] },
    { price: "679.000đ",    old_price: "799.000đ",     discount: "-15%", icon: "📞", category: "Điện thoại", sold: "2.3k", rating_count: 1547, tags: ["nokia","điện thoại","phổ thông","4g"], related: [4048043, 181928208], bundle: [] },
    { price: "890.000đ",    old_price: "1.190.000đ",   discount: "-25%", icon: "📟", category: "Điện thoại bàn", sold: "987", rating_count: 423, tags: ["panasonic","điện thoại bàn","không dây"], related: [4048043, 271234577], bundle: [] },
    { price: "35.000đ",     old_price: "45.000đ",      discount: "-22%", icon: "📚", category: "Sách & Manga", sold: "5.6k", rating_count: 2104, tags: ["manga","sách","monster"], related: [9001, 9003], bundle: [] },
  ];
  return list.map((p, i) => ({ ...defaults[i] || defaults[0], ...p }));
}

// ── Render entry point ─────────────────────────
function render() {
  renderRecommendedSection();
  renderFlashSale();
  updateCartBadge();
}

// ── Recommendation Section ─────────────────────
function renderRecommendedSection() {
  const userId = State.data.user_id;
  const recoBanner = document.getElementById('reco-banner');
  recoBanner.innerHTML = `
    <div class="reco-banner-icon">🤖</div>
    <div class="reco-banner-text">
      <h4>Gợi ý dành riêng cho bạn</h4>
      <p>Dựa trên lịch sử mua sắm của tài khoản #${userId}</p>
    </div>`;

  const row = document.getElementById('recommended-row');
  row.innerHTML = State.data.recommendations.map(p => productCardHTML(p)).join('');
}

// ── Flash Sale section (extra products) ───────
function renderFlashSale() {
  const row = document.getElementById('flashsale-row');
  row.innerHTML = EXTRA_PRODUCTS.map(p => productCardHTML(p)).join('');
}

// ── Product Card HTML ──────────────────────────
function productCardHTML(p) {
  return `<div class="product-card" onclick="openDetail(${p.product_id})">
    <div class="product-img">${p.icon}</div>
    <div class="product-name">${p.product_name}</div>
    <div class="product-price">${p.price}</div>
    <div class="product-old-price">${p.old_price}</div>
    <div class="rating-bar">
      <span class="product-badge">${p.discount}</span>
      ${p.predicted_rating >= 4.9 ? '<span class="pred-rating">⭐ Gợi ý</span>' : ''}
    </div>
  </div>`;
}

// ── Page Navigation ────────────────────────────
function goPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + name);
  if (target) target.classList.add('active');
  updateCartBadge();
  if (name === 'cart') renderCart();
}

// ── Open Product Detail ────────────────────────
function openDetail(id) {
  const p = findProduct(id);
  if (!p) return;
  State.currentProduct = p;

  document.getElementById('detail-header-title').textContent =
    p.product_name.length > 22 ? p.product_name.substring(0, 22) + '…' : p.product_name;
  document.getElementById('detail-img-box').textContent = p.icon;
  document.getElementById('detail-name').textContent = p.product_name;
  document.getElementById('detail-price').textContent = p.price;
  document.getElementById('detail-old').textContent = p.old_price;
  document.getElementById('detail-disc').textContent = p.discount;
  document.getElementById('detail-rating-count').textContent = `(${(p.rating_count || 0).toLocaleString('vi-VN')} đánh giá)`;

  // Predicted rating note
  const predEl = document.getElementById('detail-predicted');
  if (p.predicted_rating) {
    predEl.style.display = 'block';
    predEl.textContent = `🤖 Hệ thống dự đoán bạn sẽ thích sản phẩm này (${p.predicted_rating.toFixed(1)}/5.0)`;
  } else {
    predEl.style.display = 'none';
  }

  // Similar products
  renderSimilar(p);
  // Bundle products
  renderBundle(p);

  goPage('detail');
}

function findProduct(id) {
  return State.allProducts.find(p => p.product_id === id) || null;
}

// ── Similar Products ───────────────────────────
function renderSimilar(p) {
  const row = document.getElementById('similar-row');
  const ids = p.related || [];
  const items = ids.map(id => findProduct(id)).filter(Boolean);
  row.innerHTML = items.length
    ? items.map(r => productCardHTML(r)).join('')
    : '<div style="font-size:12px;color:#aaa;padding:4px;">Không có gợi ý liên quan.</div>';
}

// ── Bundle Products ────────────────────────────
function renderBundle(p) {
  const row = document.getElementById('bundle-row');
  const ids = p.bundle || [];
  const items = ids.map(id => findProduct(id)).filter(Boolean);
  row.innerHTML = items.length
    ? items.map(r => productCardHTML(r)).join('')
    : '<div style="font-size:12px;color:#aaa;padding:4px;">Không có sản phẩm kết hợp.</div>';
}

// ── Cart ───────────────────────────────────────
function addToCart() {
  if (!State.currentProduct) return;
  State.cart.push({ ...State.currentProduct });
  updateCartBadge();
  showToast('✅ Đã thêm vào giỏ hàng');
}

function addToWishlist() {
  showToast('❤️ Đã thêm vào yêu thích');
}

function updateCartBadge() {
  const n = State.cart.length;
  document.querySelectorAll('.cart-badge').forEach(el => (el.textContent = n));
}

function renderCart() {
  const empty = document.getElementById('cart-empty');
  const list = document.getElementById('cart-list');
  const bar = document.getElementById('checkout-bar');

  if (State.cart.length === 0) {
    empty.style.display = 'block';
    list.innerHTML = '';
    bar.style.display = 'none';
    return;
  }
  empty.style.display = 'none';
  bar.style.display = 'block';

  list.innerHTML = State.cart.map((p, i) => `
    <div class="cart-item">
      <div class="cart-item-img">${p.icon}</div>
      <div style="flex:1;">
        <div class="cart-item-name">${p.product_name}</div>
        <div class="cart-item-price">${p.price}</div>
        <button class="cart-remove" onclick="removeFromCart(${i})">Xóa</button>
      </div>
    </div>`).join('');

  const total = State.cart.reduce((sum, p) => {
    const n = parseInt((p.price || '0').replace(/[^0-9]/g, ''));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);
  document.getElementById('cart-total').textContent = total.toLocaleString('vi-VN') + 'đ';
}

function removeFromCart(i) {
  State.cart.splice(i, 1);
  renderCart();
  updateCartBadge();
}

function placeOrder() {
  State.cart = [];
  updateCartBadge();
  renderCart();
  showToast('🎉 Đặt hàng thành công!');
}

// ── Search ─────────────────────────────────────
function openSearch() {
  document.getElementById('search-overlay').classList.add('open');
  setTimeout(() => document.getElementById('search-input').focus(), 100);
  renderRecentSearches();
}

function closeSearch() {
  document.getElementById('search-overlay').classList.remove('open');
  document.getElementById('search-input').value = '';
  showHotSection();
}

function showHotSection() {
  document.getElementById('hot-section').style.display = 'block';
  document.getElementById('search-results').classList.remove('show');
}

function renderRecentSearches() {
  const el = document.getElementById('recent-searches');
  if (State.recentSearches.length === 0) {
    el.innerHTML = '<div style="font-size:12px;color:#aaa;">Chưa có tìm kiếm nào</div>';
    return;
  }
  el.innerHTML = State.recentSearches.slice(0, 5).map(s => `
    <div class="recent-item" onclick="fillSearch('${s}')">
      <span class="recent-icon">🕐</span>
      <span>${s}</span>
    </div>`).join('');
}

function onSearch(val) {
  if (!val.trim()) { showHotSection(); return; }

  document.getElementById('hot-section').style.display = 'none';
  document.getElementById('search-results').classList.add('show');

  const q = val.toLowerCase().trim();

  // Full-text match on all products
  const matched = State.allProducts.filter(p =>
    p.product_name.toLowerCase().includes(q) ||
    (p.tags || []).some(t => t.includes(q)) ||
    (p.category || '').toLowerCase().includes(q)
  );

  // AI suggestion via keyword map
  let aiIds = [];
  for (const [kw, ids] of Object.entries(KEYWORD_MAP)) {
    if (q.includes(kw) || kw.includes(q)) {
      aiIds = [...aiIds, ...ids];
    }
  }
  // Also pull related from matched items
  matched.forEach(p => { if (p.related) aiIds = [...aiIds, ...p.related]; });
  aiIds = [...new Set(aiIds)].filter(id => !matched.find(m => m.product_id === id)).slice(0, 5);

  renderSearchResults(matched);
  renderAISuggestions(aiIds, q);
}

function renderSearchResults(items) {
  const rl = document.getElementById('result-list');
  if (items.length === 0) {
    rl.innerHTML = '<div class="no-results">😕 Không tìm thấy sản phẩm phù hợp</div>';
    return;
  }
  rl.innerHTML = items.map(p => `
    <div class="result-item" onclick="openDetailFromSearch(${p.product_id})">
      <div class="result-img">${p.icon}</div>
      <div style="flex:1;">
        <div class="result-name">${p.product_name}</div>
        <div class="result-price">${p.price}
          <span style="font-size:10px;color:#aaa;text-decoration:line-through;margin-left:4px;">${p.old_price}</span>
        </div>
        <div class="result-stars">⭐⭐⭐⭐⭐ &nbsp;<span style="color:#888;">(${(p.rating_count||0).toLocaleString('vi-VN')})</span></div>
      </div>
      <div class="product-badge">${p.discount}</div>
    </div>`).join('');
}

function renderAISuggestions(ids, query) {
  const container = document.getElementById('ai-suggest-cards');
  const items = ids.map(id => findProduct(id)).filter(Boolean);
  if (items.length === 0) {
    container.innerHTML = `<div style="font-size:11px;color:#aaa;padding:4px;">Không có gợi ý thêm cho "${query}"</div>`;
    return;
  }
  container.innerHTML = items.map(p => `
    <div class="ai-card" onclick="openDetailFromSearch(${p.product_id})">
      <div class="ai-card-icon">${p.icon}</div>
      <div class="ai-card-name">${p.product_name.substring(0, 20)}${p.product_name.length > 20 ? '…' : ''}</div>
    </div>`).join('');
}

function fillSearch(text) {
  document.getElementById('search-input').value = text;
  onSearch(text);
  addRecentSearch(text);
}

function addRecentSearch(text) {
  State.recentSearches = [text, ...State.recentSearches.filter(s => s !== text)].slice(0, 6);
}

function openDetailFromSearch(id) {
  closeSearch();
  openDetail(id);
}

// ── Toast ──────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ── Start ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);