const products = [
  {
    id: "linen-bomber",
    name: "Linen Utility Bomber",
    category: "Fashion",
    price: 3299,
    oldPrice: 4299,
    rating: 4.8,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80",
    description: "A light structured layer with breathable linen blend fabric, matte hardware, and roomy daily pockets.",
    colors: ["#101828", "#b1a58b", "#667085"]
  },
  {
    id: "audio-loop",
    name: "Loop Wireless Headphones",
    category: "Tech",
    price: 5999,
    oldPrice: 7499,
    rating: 4.7,
    badge: "New",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Comfort-first headphones with rich bass, 42-hour battery life, and easy switching across devices.",
    colors: ["#111827", "#e5e7eb", "#35c2a1"]
  },
  {
    id: "glow-serum",
    name: "Daily Glow Serum",
    category: "Beauty",
    price: 1299,
    oldPrice: 1699,
    rating: 4.9,
    badge: "Clean",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
    description: "A lightweight vitamin serum made for morning routines, quick absorption, and fresh dewy skin.",
    colors: ["#f7c948", "#f4a4a4", "#35c2a1"]
  },
  {
    id: "arc-lamp",
    name: "Arc Table Lamp",
    category: "Home",
    price: 2499,
    oldPrice: 3199,
    rating: 4.6,
    badge: "Warm",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    description: "A compact lamp with warm diffusion, metal base, and a clean profile for desks or bedside tables.",
    colors: ["#d4a373", "#101828", "#f7f3e7"]
  },
  {
    id: "travel-tote",
    name: "Weekender Travel Tote",
    category: "Fashion",
    price: 3899,
    oldPrice: 4699,
    rating: 4.5,
    badge: "Travel",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    description: "A polished carryall with laptop sleeve, shoe pocket, and durable handles for short trips.",
    colors: ["#6b4f3f", "#111827", "#c3b091"]
  },
  {
    id: "smart-watch",
    name: "Pulse Smart Watch",
    category: "Tech",
    price: 6999,
    oldPrice: 8999,
    rating: 4.8,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description: "A slim watch with health tracking, crisp notifications, sleep insights, and seven-day battery.",
    colors: ["#101828", "#98a2b3", "#2a7665"]
  },
  {
    id: "ceramic-set",
    name: "Ceramic Dinner Set",
    category: "Home",
    price: 4599,
    oldPrice: 5399,
    rating: 4.4,
    badge: "Set of 16",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80",
    description: "Stackable matte ceramic plates and bowls with a restaurant-inspired finish for everyday hosting.",
    colors: ["#f2f4f7", "#98a2b3", "#667085"]
  },
  {
    id: "calm-candle",
    name: "Calm Ritual Candle",
    category: "Beauty",
    price: 899,
    oldPrice: 1199,
    rating: 4.6,
    badge: "Aroma",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80",
    description: "A soy wax candle with cedar, citrus, and soft musk notes for evening reset rituals.",
    colors: ["#f4ecd8", "#d4a373", "#101828"]
  }
];

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const storage = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

let cart = storage.get("veloraCart", []);
let wishlist = storage.get("veloraWishlist", []);

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = (value) => formatter.format(value);
const productById = (id) => products.find((product) => product.id === id) || products[0];

function saveCart() {
  storage.set("veloraCart", cart);
  updateCounts();
}

function saveWishlist() {
  storage.set("veloraWishlist", wishlist);
  updateCounts();
}

function updateCounts() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $$("[data-cart-count]").forEach((node) => {
    node.textContent = count;
  });
  $$("[data-wishlist-count]").forEach((node) => {
    node.textContent = wishlist.length;
  });
}

function showToast(message) {
  let toast = $(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1900);
}

function addToCart(id, qty = 1) {
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart();
  showToast("Added to cart");
  renderCart();
  renderCheckout();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
  renderCheckout();
}

function updateQuantity(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart();
  renderCart();
  renderCheckout();
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter((entry) => entry !== id);
    showToast("Removed from wishlist");
  } else {
    wishlist.push(id);
    showToast("Saved to wishlist");
  }
  saveWishlist();
  renderProductCollections();
  renderWishlist();
}

function productCard(product) {
  const saved = wishlist.includes(product.id);
  return `
    <article class="product-card">
      <a class="product-media" href="product.html?id=${product.id}" aria-label="View ${product.name}">
        <img src="${product.image}" alt="${product.name}">
        <span class="pill">${product.badge}</span>
      </a>
      <button class="heart-btn ${saved ? "active" : ""}" type="button" data-wishlist-toggle="${product.id}" aria-label="${saved ? "Remove from" : "Add to"} wishlist">♥</button>
      <div class="product-info">
        <div class="product-meta"><span>${product.category}</span><span>★ ${product.rating}</span></div>
        <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <div class="price-row">
          <div><span class="price">${money(product.price)}</span> <span class="old-price">${money(product.oldPrice)}</span></div>
        </div>
        <button class="btn primary full" type="button" data-add-cart="${product.id}">Add to cart</button>
      </div>
    </article>
  `;
}

function attachProductActions(root = document) {
  $$("[data-add-cart]", root).forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.addCart));
  });
  $$("[data-wishlist-toggle]", root).forEach((button) => {
    button.addEventListener("click", () => toggleWishlist(button.dataset.wishlistToggle));
  });
}

function renderProductCollections() {
  const featured = $("[data-featured-products]");
  if (featured) {
    featured.innerHTML = products.slice(0, 4).map(productCard).join("");
    attachProductActions(featured);
  }

  const shop = $("[data-shop-products]");
  if (!shop) return;

  const search = $("[data-search]")?.value.trim().toLowerCase() || "";
  const category = $("[data-category-filter]")?.value || "All";
  const sort = $("[data-sort-filter]")?.value || "featured";

  let filtered = products.filter((product) => {
    const matchesSearch = [product.name, product.category, product.description].join(" ").toLowerCase().includes(search);
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);

  shop.innerHTML = filtered.map(productCard).join("");
  $("[data-result-count]").textContent = filtered.length;
  $("[data-empty-shop]")?.classList.toggle("hidden", filtered.length > 0);
  attachProductActions(shop);
}

function renderProductDetail() {
  const mount = $("[data-product-detail]");
  if (!mount) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const product = productById(id);
  const saved = wishlist.includes(product.id);
  mount.innerHTML = `
    <section class="product-detail">
      <div class="detail-media">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="detail-panel">
        <p class="eyebrow">${product.category}</p>
        <h1>${product.name}</h1>
        <p class="rating">★ ${product.rating} customer rating</p>
        <p>${product.description}</p>
        <div class="price-row">
          <div><span class="price">${money(product.price)}</span> <span class="old-price">${money(product.oldPrice)}</span></div>
          <span>${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>
        </div>
        <div>
          <h3>Available colors</h3>
          <div class="swatches">${product.colors.map((color) => `<span class="swatch" style="background:${color}"></span>`).join("")}</div>
        </div>
        <div class="hero-actions">
          <button class="btn primary" type="button" data-add-cart="${product.id}">Add to cart</button>
          <button class="btn ghost" type="button" data-wishlist-toggle="${product.id}">${saved ? "Remove from wishlist" : "Save to wishlist"}</button>
        </div>
      </div>
    </section>
    <section class="section compact">
      <div class="section-heading row">
        <div><p class="eyebrow">You may also like</p><h2>Complete the look</h2></div>
      </div>
      <div class="product-grid">${products.filter((item) => item.id !== product.id).slice(0, 4).map(productCard).join("")}</div>
    </section>
  `;
  attachProductActions(mount);
}

function cartTotals() {
  const subtotal = cart.reduce((sum, item) => {
    const product = productById(item.id);
    return sum + product.price * item.qty;
  }, 0);
  const shipping = subtotal === 0 || subtotal >= 3999 ? 0 : 199;
  const discount = subtotal >= 7000 ? 600 : 0;
  return { subtotal, shipping, discount, total: Math.max(subtotal + shipping - discount, 0) };
}

function summaryHtml(action = true) {
  const totals = cartTotals();
  return `
    <h2>Order summary</h2>
    <div class="summary-line"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
    <div class="summary-line"><span>Shipping</span><strong>${totals.shipping ? money(totals.shipping) : "Free"}</strong></div>
    <div class="summary-line"><span>Discount</span><strong>-${money(totals.discount)}</strong></div>
    <div class="summary-line total"><span>Total</span><strong>${money(totals.total)}</strong></div>
    ${action ? `<a class="btn primary full ${cart.length ? "" : "hidden"}" href="checkout.html">Checkout</a>` : ""}
    <a class="btn ghost full" href="shop.html">Continue shopping</a>
  `;
}

function renderCart() {
  const list = $("[data-cart-items]");
  const summary = $("[data-cart-summary]");
  if (!list || !summary) return;

  if (!cart.length) {
    list.innerHTML = `<div class="empty-state"><h2>Your cart is empty</h2><p>Add products from the shop to start checkout.</p><a class="btn primary" href="shop.html">Shop products</a></div>`;
  } else {
    list.innerHTML = cart.map((item) => {
      const product = productById(item.id);
      return `
        <article class="cart-item">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <p class="eyebrow">${product.category}</p>
            <h3>${product.name}</h3>
            <p>${money(product.price)} each</p>
          </div>
          <div class="cart-actions">
            <div class="qty-control" aria-label="Quantity controls">
              <button type="button" data-qty="${product.id}" data-delta="-1">−</button>
              <span>${item.qty}</span>
              <button type="button" data-qty="${product.id}" data-delta="1">+</button>
            </div>
            <button class="btn ghost full" type="button" data-remove-cart="${product.id}">Remove</button>
          </div>
        </article>
      `;
    }).join("");
  }

  summary.innerHTML = summaryHtml(true);
  $$("[data-qty]", list).forEach((button) => {
    button.addEventListener("click", () => updateQuantity(button.dataset.qty, Number(button.dataset.delta)));
  });
  $$("[data-remove-cart]", list).forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.removeCart));
  });
}

function renderWishlist() {
  const mount = $("[data-wishlist-products]");
  if (!mount) return;
  const savedProducts = products.filter((product) => wishlist.includes(product.id));
  mount.innerHTML = savedProducts.map(productCard).join("");
  $("[data-empty-wishlist]")?.classList.toggle("hidden", savedProducts.length > 0);
  attachProductActions(mount);
}

function renderCheckout() {
  const summary = $("[data-checkout-summary]");
  if (!summary) return;
  const items = cart.map((item) => {
    const product = productById(item.id);
    return `<div class="summary-line"><span>${product.name} × ${item.qty}</span><strong>${money(product.price * item.qty)}</strong></div>`;
  }).join("");
  summary.innerHTML = `<h2>Your order</h2>${items || `<p>Your cart is empty.</p>`}${summaryHtml(false)}`;
}

function bindCheckout() {
  const form = $("[data-checkout-form]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!cart.length) {
      showToast("Your cart is empty");
      return;
    }
    const orderId = `VL-${Math.floor(1000 + Math.random() * 9000)}`;
    storage.set("veloraLastOrder", { orderId, cart, totals: cartTotals(), placedAt: new Date().toISOString() });
    cart = [];
    saveCart();
    window.location.href = `order-success.html?order=${orderId}`;
  });
}

function renderSuccess() {
  const node = $("[data-order-id]");
  if (!node) return;
  const orderId = new URLSearchParams(window.location.search).get("order") || storage.get("veloraLastOrder", {}).orderId || "VL-0000";
  node.textContent = orderId;
}

function bindFilters() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");
  if (category && $("[data-category-filter]")) {
    $("[data-category-filter]").value = category;
  }
  ["input", "change"].forEach((eventName) => {
    $("[data-search]")?.addEventListener(eventName, renderProductCollections);
    $("[data-category-filter]")?.addEventListener(eventName, renderProductCollections);
    $("[data-sort-filter]")?.addEventListener(eventName, renderProductCollections);
  });
  $("[data-clear-filters]")?.addEventListener("click", () => {
    $("[data-search]").value = "";
    $("[data-category-filter]").value = "All";
    $("[data-sort-filter]").value = "featured";
    renderProductCollections();
  });
}

function bindNavigation() {
  const toggle = $(".nav-toggle");
  const nav = $(".main-nav");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  const current = location.pathname.split("/").pop() || "index.html";
  $$(".main-nav a").forEach((link) => {
    if (link.getAttribute("href") === current) link.classList.add("active");
  });
}

function bindNewsletter() {
  $(".newsletter-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Preference saved");
  });
}

function init() {
  bindNavigation();
  bindFilters();
  updateCounts();
  renderProductCollections();
  renderProductDetail();
  renderCart();
  renderWishlist();
  renderCheckout();
  renderSuccess();
  bindCheckout();
  bindNewsletter();
}

document.addEventListener("DOMContentLoaded", init);
