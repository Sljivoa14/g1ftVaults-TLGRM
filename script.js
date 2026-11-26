// ---------- TELEGRAM SETUP ----------
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
try {
  tg.setHeaderColor("#07060f");
  tg.setBackgroundColor("#07060f");
} catch (e) {}

const user = tg.initDataUnsafe && tg.initDataUnsafe.user; // undefined in a normal browser

// ---------- SETTINGS (demo economy) ----------
const START_BALANCE = 1000;   // fake TON, no real money
const UPGRADE_FEE = 25;
const SELL_FEE = 0.05;        // 5% marketplace fee

const RARITY = {
  Common:    { chance: 0.50, mult: 1.1, color: "#9aa4b2" },
  Rare:      { chance: 0.30, mult: 1.5, color: "#3dc7ff" },
  Epic:      { chance: 0.15, mult: 2.5, color: "#b266ff" },
  Legendary: { chance: 0.05, mult: 5,   color: "#ffc233" }
};

// ---------- ICONS (simple line icons, 24x24) ----------
const ICON = {
  market:    '<path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  inventory: '<path d="M4 8l8-4 8 4v8l-8 4-8-4V8Z"/><path d="M4 8l8 4 8-4"/><path d="M12 12v8"/>',
  upgrade:   '<path d="M13 3L5 14h6l-1 7 8-11h-6l1-7Z"/>',
  profile:   '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  heart:     '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
  gem:       '<path d="M6 4h12l4 6-10 11L2 10l4-6Z"/><path d="M2 10h20"/><path d="M9 4l-2 6 5 11 5-11-2-6"/>',
  filter:    '<path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/>',
  gift:      '<rect x="4" y="10" width="16" height="10" rx="1"/><rect x="3" y="7" width="18" height="3" rx="1"/><path d="M12 7v13"/><path d="M12 7C9 7 7 6 7 4.5S9.5 2.5 11 4l1 3Z"/><path d="M12 7c3 0 5-1 5-2.5S14.5 2.5 13 4l-1 3Z"/>',
  wallet:    '<path d="M3 7h15a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M3 7l12-3v3"/><path d="M17 14h2"/>',
  reset:     '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v4h4"/>'
};
const ico = name => '<svg class="ico" viewBox="0 0 24 24">' + ICON[name] + '</svg>';

// ---------- GIFT ART ----------
// Each gift loads its picture from  gifts/<img>.webp  (transparent cutout).
// If the file is missing, a placeholder gift box is shown instead.
const OUT = 'stroke="#0b0b14" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';

const ART_GENERIC = `
  <rect x="18" y="44" width="64" height="42" rx="6" fill="#ff5fa8" ${OUT}/>
  <rect x="12" y="32" width="76" height="16" rx="5" fill="#ff8ac4" ${OUT}/>
  <rect x="44" y="32" width="12" height="54" fill="#ffd23f" ${OUT}/>
  <path d="M50 32 Q30 6 30 22 Q30 32 50 32 Z" fill="#ffd23f" ${OUT}/>
  <path d="M50 32 Q70 6 70 22 Q70 32 50 32 Z" fill="#ffd23f" ${OUT}/>`;

function fallbackArt() {
  return '<svg class="gift-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' + ART_GENERIC + '</svg>';
}

const art = g =>
  `<img class="gift-img" src="gifts/${g.img}.webp" alt="" draggable="false" onerror="this.outerHTML=fallbackArt()">`;

// ---------- FAKE DATABASE ----------
const CATALOG = [
  { id: 1,  img: "panda",    name: "Panda",    price: 120, serial: "#1042", color: "#ff8fc4", category: "animals" },
  { id: 2,  img: "fox",      name: "Fox",      price: 85,  serial: "#0077", color: "#ff8a3d", category: "animals" },
  { id: 3,  img: "frog",     name: "Frog",     price: 40,  serial: "#5521", color: "#8be04e", category: "animals" },
  { id: 4,  img: "bunny",    name: "Bunny",    price: 55,  serial: "#3310", color: "#b79cff", category: "animals" },
  { id: 5,  img: "cat",      name: "Cat",      price: 62,  serial: "#8890", color: "#6fd9a0", category: "animals" },
  { id: 6,  img: "bear",     name: "Bear",     price: 70,  serial: "#0412", color: "#ffc233", category: "animals" },
  { id: 7,  img: "monkey",   name: "Monkey",   price: 150, serial: "#2210", color: "#5be3a8", category: "animals" },
  { id: 8,  img: "tiger",    name: "Tiger",    price: 210, serial: "#6034", color: "#ff7a7a", category: "animals" },
  { id: 9,  img: "dog",      name: "Dog",      price: 48,  serial: "#7781", color: "#ff9a6b", category: "animals" },
  { id: 10, img: "wolf",     name: "Wolf",     price: 130, serial: "#0951", color: "#ffe14d", category: "animals" },
  { id: 11, img: "eagle",    name: "Eagle",    price: 260, serial: "#4406", color: "#8fa0ff", category: "animals" },
  { id: 12, img: "elephant", name: "Elephant", price: 175, serial: "#3028", color: "#d68cff", category: "animals" },
  { id: 13, img: "horse",    name: "Horse",    price: 95,  serial: "#1859", color: "#a8e04d", category: "animals" },
  { id: 14, img: "giraffe",  name: "Giraffe",  price: 88,  serial: "#9313", color: "#4dd0ee", category: "animals" },
  { id: 15, img: "lion",    name: "Lion",    price: 190, serial: "#2764", color: "#ffb347", category: "animals" },
  { id: 16, img: "penguin", name: "Penguin", price: 65,  serial: "#5390", color: "#6be0e8", category: "animals" },
  { id: 17, img: "owl",     name: "Owl",     price: 110, serial: "#8127", color: "#7ee0b5", category: "animals" },
  { id: 18, img: "zebra",   name: "Zebra",   price: 78,  serial: "#4845", color: "#9fb4ff", category: "animals" },
  { id: 19, img: "rhino",   name: "Rhino",   price: 160, serial: "#1136", color: "#ff8fd0", category: "animals" },
  { id: 20, img: "hippo",   name: "Hippo",   price: 92,  serial: "#6679", color: "#c9a8ff", category: "animals" },
  { id: 21, img: "koala", name: "Koala", price: 105, serial: "#3471", color: "#9fd0ff", category: "animals" },
  { id: 22, img: "sloth", name: "Sloth", price: 58, serial: "#7015", color: "#c9a47a", category: "animals" },
  { id: 23, img: "raccoon", name: "Raccoon", price: 72, serial: "#2589", color: "#a3adb8", category: "animals" },
  { id: 24, img: "deer", name: "Deer", price: 98, serial: "#6203", color: "#e0b07a", category: "animals" },
  { id: 25, img: "shark", name: "Shark", price: 140, serial: "#9954", color: "#6fb0e0", category: "animals" },
  { id: 26, img: "crocodile", name: "Crocodile", price: 150, serial: "#4332", color: "#6fcf6f", category: "animals" },
  { id: 27, img: "flamingo", name: "Flamingo", price: 118, serial: "#1198", color: "#ff8fb8", category: "animals" },
  { id: 28, img: "parrot", name: "Parrot", price: 135, serial: "#5607", color: "#ff6b6b", category: "animals" },
  { id: 29, img: "hedgehog", name: "Hedgehog", price: 52, serial: "#8820", color: "#b08a6a", category: "animals" },
  { id: 30, img: "otter", name: "Otter", price: 76, serial: "#3944", color: "#9a6b45", category: "animals" },
  { id: 31, img: "camel", name: "Camel", price: 85, serial: "#7261", color: "#e0b070", category: "animals" },
  { id: 32, img: "pig", name: "Pig", price: 45, serial: "#5088", color: "#ff9fbd", category: "animals" }
];

const START_OWNED = [1, 7];   // panda + monkey start in your inventory

const fresh = list => list.map(g => ({ ...g, upgraded: false, rarity: null }));

// ---------- HELPERS ----------
const esc = s => String(s).replace(/[&<>"']/g, c => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));
const round1 = n => Math.round(n * 10) / 10;

function haptic(kind) {
  try {
    if (kind === "light" || kind === "medium" || kind === "heavy") tg.HapticFeedback.impactOccurred(kind);
    else if (kind === "select") tg.HapticFeedback.selectionChanged();
    else tg.HapticFeedback.notificationOccurred(kind); // success / error / warning
  } catch (e) {}
}

// Telegram popup, with a simple fallback when opened in a normal browser
function ask(title, message, buttons, cb) {
  try {
    tg.showPopup({ title, message, buttons }, cb);
  } catch (e) {
    if (buttons.length > 1) {
      const ok = confirm(title + "\n\n" + message);
      if (cb) cb(ok ? buttons[0].id : null);
    } else {
      alert(title + "\n\n" + message);
    }
  }
}

// ---------- STATE (saved on this device for now) ----------
const SAVE_KEY = "gv_state_v2";

function defaultState() {
  let favs = [];
  try { favs = JSON.parse(localStorage.getItem("favs") || "[]"); } catch (e) {}
  return {
    balance: START_BALANCE,
    market: fresh(CATALOG.filter(g => !START_OWNED.includes(g.id))),
    inventory: fresh(CATALOG.filter(g => START_OWNED.includes(g.id))),
    favorites: favs
  };
}

function load() {
  try { localStorage.removeItem("gv_state"); } catch (e) {} // old demo data
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && Array.isArray(s.market) && Array.isArray(s.inventory)) return s;
  } catch (e) {}
  return defaultState();
}

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
}

let state = load();
let tab = "all";
let sort = "default";
let query = "";
let upgradeId = null;
let loading = true;

// ---------- ELEMENTS ----------
const grid = document.getElementById("grid");
const invGrid = document.getElementById("invGrid");
const sheet = document.getElementById("sheet");

// fill every <span data-ico="..."> with its icon
document.querySelectorAll("[data-ico]").forEach(el => { el.innerHTML = ico(el.dataset.ico); });

// ---------- CARD HTML ----------
function cardHTML(g, actions, i = 0, animate = false) {
  const tag = g.rarity
    ? `<div class="rarity" style="--r:${RARITY[g.rarity].color}">${g.rarity}</div>`
    : "";
  // --fd: each character floats out of sync with the others
  return `
    <div class="card${animate ? " pop" : ""}" style="--c:${g.color};--d:${(i * 0.06).toFixed(2)}s;--fd:${(-i * 0.7).toFixed(1)}s">
      <div class="serial">${g.serial}</div>
      ${tag}
      <div class="art"><div class="shadow"></div>${art(g)}</div>
      <h3>${esc(g.name)}</h3>
      <div class="row">${actions}</div>
    </div>`;
}

// ---------- RENDER: MARKET ----------
function renderMarket(animate = false) {
  if (loading) return;

  let list = state.market.filter(g => g.name.toLowerCase().includes(query.toLowerCase()));

  if (tab === "fav") list = list.filter(g => state.favorites.includes(g.id));
  if (sort === "low")  list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty">Nothing here yet</div>`;
    return;
  }

  grid.innerHTML = list.map((g, i) => cardHTML(g, `
    <button class="price" onclick="buy(${g.id})">${ico("gem")}${g.price}</button>
    <button class="heart ${state.favorites.includes(g.id) ? "on" : ""}" onclick="toggleFav(${g.id})">${ico("heart")}</button>
  `, i, animate)).join("");
}

// loading placeholders (shimmer)
function showSkeleton() {
  grid.innerHTML = Array(6).fill('<div class="sk"></div>').join("");
}

// ---------- RENDER: INVENTORY ----------
function renderInventory(animate = false) {
  const total = state.inventory.reduce((sum, g) => sum + g.price, 0);
  document.getElementById("invStats").innerHTML =
    `<span>${ico("inventory")}${state.inventory.length} gifts</span><span>Value ${ico("gem")}${total.toFixed(1)}</span>`;

  if (state.inventory.length === 0) {
    invGrid.innerHTML = `<div class="empty">Your inventory is empty.<br>Buy a gift on the Market.</div>`;
    return;
  }

  invGrid.innerHTML = state.inventory.map((g, i) => cardHTML(g, `
    <button class="price sell" onclick="sell(${g.id})">Sell ${g.price}</button>
    ${g.upgraded ? "" : `<button class="heart" onclick="goUpgrade(${g.id})">${ico("upgrade")}</button>`}
  `, i, animate)).join("");
}

// ---------- RENDER: UPGRADE ----------
function renderUpgrade() {
  const box = document.getElementById("upgradeBox");
  const eligible = state.inventory.filter(g => !g.upgraded);

  if (eligible.length === 0) {
    box.innerHTML = `<div class="empty">Nothing to upgrade.<br>Buy a gift on the Market first.</div>`;
    return;
  }

  const sel = eligible.find(g => g.id === upgradeId) || eligible[0];
  upgradeId = sel.id;

  box.innerHTML = `
    <div class="up-hero" style="--c:${sel.color}">
      <div class="up-art">${art(sel)}</div>
      <h2>${esc(sel.name)}</h2>
      <p class="muted">${sel.serial} · worth ${sel.price} TON</p>
    </div>

    <div class="picker">
      ${eligible.map(g => `
        <button class="pick ${g.id === sel.id ? "on" : ""}" style="--c:${g.color}" onclick="pickUpgrade(${g.id})">${art(g)}</button>
      `).join("")}
    </div>

    <div class="panel">
      <h4>Possible results</h4>
      ${Object.entries(RARITY).map(([name, r]) => `
        <div class="odd">
          <span style="color:${r.color}">● ${name}</span>
          <span>${Math.round(r.chance * 100)}%</span>
          <span>x${r.mult} value</span>
        </div>`).join("")}
    </div>

    <button class="big-btn" onclick="upgrade()">${ico("upgrade")}Upgrade for ${UPGRADE_FEE} TON</button>
  `;
}

// ---------- RENDER: PROFILE ----------
function renderProfile() {
  const rawName = user ? user.first_name : "Guest";
  const handle = user && user.username ? "@" + esc(user.username) : "demo mode";
  const avatar = user && user.photo_url
    ? `<img class="avatar" src="${esc(user.photo_url)}" alt="">`
    : `<div class="avatar avatar-fallback">${esc(rawName.charAt(0).toUpperCase())}</div>`;

  const total = state.inventory.reduce((sum, g) => sum + g.price, 0);

  document.getElementById("profileBox").innerHTML = `
    <div class="profile-head">
      ${avatar}
      <h2>${esc(rawName)}</h2>
      <p class="muted">${handle}</p>
    </div>

    <div class="stats">
      <div class="panel stat"><b>${ico("gem")}${state.balance.toFixed(1)}</b><span>Balance</span></div>
      <div class="panel stat"><b>${state.inventory.length}</b><span>Gifts owned</span></div>
      <div class="panel stat"><b>${state.favorites.length}</b><span>Favorites</span></div>
      <div class="panel stat"><b>${ico("gem")}${total.toFixed(1)}</b><span>Portfolio value</span></div>
    </div>

    <button class="ghost-btn" disabled>${ico("wallet")}Connect wallet (coming soon)</button>
    <button class="ghost-btn danger" onclick="resetDemo()">${ico("reset")}Reset demo data</button>
    <p class="muted note">Demo mode: all TON here is fake.</p>
  `;
}

function updateBalance() {
  document.getElementById("balanceVal").textContent = state.balance.toFixed(1);
}

function renderAll() {
  renderMarket();
  renderInventory();
  renderUpgrade();
  renderProfile();
  updateBalance();
}

// ---------- TABS ----------
function showView(name) {
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + name));
  document.querySelectorAll("nav .tab").forEach(t => t.classList.toggle("active", t.dataset.view === name));
  sheet.classList.remove("open");
  window.scrollTo(0, 0);
  haptic("select");

  // cards pop in each time you open a tab
  if (name === "market") renderMarket(true);
  if (name === "inventory") renderInventory(true);
  if (name === "upgrade") renderUpgrade();
  if (name === "profile") renderProfile();
}

// ---------- ACTIONS ----------
function toggleFav(id) {
  const i = state.favorites.indexOf(id);
  if (i >= 0) state.favorites.splice(i, 1);
  else state.favorites.push(id);
  save();
  haptic("light");
  renderMarket();   // no animation here, so the grid doesn't replay on every heart
  renderProfile();
}

function buy(id) {
  const g = state.market.find(x => x.id === id);
  if (!g) return;

  if (state.balance < g.price) {
    haptic("error");
    ask("Not enough TON", "You need " + g.price + " TON but have " + state.balance.toFixed(1) + ".", [{ type: "close" }]);
    return;
  }

  ask("Buy " + g.name, "Price: " + g.price + " TON\n(demo money, no real payment)",
    [{ id: "buy", type: "default", text: "Buy" }, { type: "cancel" }],
    btn => {
      if (btn !== "buy") return;
      state.balance = round1(state.balance - g.price);
      state.market = state.market.filter(x => x.id !== id);
      state.inventory.push(g);
      save();
      haptic("success");
      renderAll();
    });
}

function sell(id) {
  const g = state.inventory.find(x => x.id === id);
  if (!g) return;

  const fee = round1(g.price * SELL_FEE);
  const get = round1(g.price - fee);

  ask("Sell " + g.name,
    "Price: " + g.price + " TON\nFee (5%): " + fee + " TON\nYou get: " + get + " TON",
    [{ id: "sell", type: "default", text: "Sell" }, { type: "cancel" }],
    btn => {
      if (btn !== "sell") return;
      state.balance = round1(state.balance + get);
      state.inventory = state.inventory.filter(x => x.id !== id);
      state.market.push(g); // demo: it goes back on the market
      save();
      haptic("success");
      renderAll();
    });
}

function goUpgrade(id) {
  upgradeId = id;
  renderUpgrade();
  showView("upgrade");
}

function pickUpgrade(id) {
  upgradeId = id;
  haptic("light");
  renderUpgrade();
}

function rollRarity() {
  let r = Math.random();
  for (const [name, info] of Object.entries(RARITY)) {
    if (r < info.chance) return name;
    r -= info.chance;
  }
  return "Common";
}

function upgrade() {
  const g = state.inventory.find(x => x.id === upgradeId);
  if (!g) return;

  if (state.balance < UPGRADE_FEE) {
    haptic("error");
    ask("Not enough TON", "Upgrading costs " + UPGRADE_FEE + " TON.", [{ type: "close" }]);
    return;
  }

  ask("Upgrade " + g.name, "Cost: " + UPGRADE_FEE + " TON\nYou get a random rarity.",
    [{ id: "go", type: "default", text: "Upgrade" }, { type: "cancel" }],
    btn => {
      if (btn !== "go") return;

      state.balance = round1(state.balance - UPGRADE_FEE);
      const rarity = rollRarity();
      g.rarity = rarity;
      g.upgraded = true;
      g.price = round1(g.price * RARITY[rarity].mult);
      g.serial = "#" + (Math.floor(Math.random() * 9000) + 1000);
      save();

      // small delay so the confirm popup is fully closed
      setTimeout(() => showReveal(g, rarity), 350);
    });
}

// ---------- UPGRADE REVEAL (spin, burst, flash) ----------
function showReveal(g, rarity) {
  const rv = document.getElementById("reveal");
  const box = document.getElementById("revArt");
  const color = RARITY[rarity].color;

  rv.style.setProperty("--rc", color);
  rv.className = "reveal show";
  box.className = "reveal-art";
  box.innerHTML = art(g);
  document.getElementById("revRarity").textContent = rarity;
  document.getElementById("revName").textContent = g.name;
  document.getElementById("revValue").innerHTML = ico("gem") + g.price + " TON";

  void box.offsetWidth;          // restart the animation
  box.classList.add("spin");
  haptic("light");

  setTimeout(() => {
    box.classList.remove("spin");
    box.classList.add("pop");
    rv.classList.add("done", "glow");

    const big = rarity === "Epic" || rarity === "Legendary";
    if (big) rv.classList.add("flash");

    burst(box, rarity === "Legendary" ? 46 : rarity === "Epic" ? 32 : 20);
    haptic(rarity === "Legendary" ? "heavy" : big ? "medium" : "light");
    setTimeout(() => haptic("success"), 120);
  }, 1300);
}

function burst(box, count) {
  const wrap = document.createElement("div");
  wrap.className = "burst";
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 120;
    p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    p.style.animationDelay = (Math.random() * 0.15) + "s";
    if (i % 3 === 0) p.style.background = "#fff";
    wrap.appendChild(p);
  }
  box.appendChild(wrap);
}

function resetDemo() {
  ask("Reset demo?", "This clears your demo inventory, balance and favorites.",
    [{ id: "reset", type: "destructive", text: "Reset" }, { type: "cancel" }],
    btn => {
      if (btn !== "reset") return;
      try {
        localStorage.removeItem(SAVE_KEY);
        localStorage.removeItem("favs");
      } catch (e) {}
      state = load();
      upgradeId = null;
      renderAll();
    });
}

// ---------- EVENTS ----------
document.getElementById("search").addEventListener("input", e => {
  query = e.target.value;
  renderMarket();
});

document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    tab = btn.dataset.tab;
    haptic("select");
    renderMarket(true);
  });
});

document.getElementById("openFilter").addEventListener("click", () => {
  sheet.classList.toggle("open");
});

document.querySelectorAll(".opt").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".opt").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    sort = btn.dataset.sort;
    sheet.classList.remove("open");
    renderMarket(true);
  });
});

document.querySelectorAll("nav .tab").forEach(t => {
  t.addEventListener("click", () => showView(t.dataset.view));
});

document.getElementById("revClose").addEventListener("click", () => {
  document.getElementById("reveal").className = "reveal";
  renderAll();
});

// ---------- START ----------
renderAll();     // fills the other tabs
showSkeleton();  // market shows shimmer first
setTimeout(() => {
  loading = false;       // later: this is where we fetch real data from the backend
  renderMarket(true);
}, 800);