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

// ---------- FAKE DATABASE 4 now !!!----------
const seedMarket = [
  { id: 1, name: "Pharaoh",     price: 99.9,  serial: "#1042", emoji: "🏺", color: "#f5b82e" },
  { id: 2, name: "Redo",        price: 631.3, serial: "#0077", emoji: "🔄", color: "#c9c9d1" },
  { id: 3, name: "Money Rider", price: 103,   serial: "#5521", emoji: "🚕", color: "#d8d2c2" },
  { id: 4, name: "Ring King",   price: 76.2,  serial: "#3310", emoji: "🎀", color: "#ff5fa8" },
  { id: 5, name: "Star Cat",    price: 45.5,  serial: "#8890", emoji: "🐱", color: "#8ecbff" },
  { id: 6, name: "Rocket",      price: 210,   serial: "#0412", emoji: "🚀", color: "#9b7bff" }
];

const seedInventory = [
  { id: 7, name: "Lucky Duck", price: 38,   serial: "#2210", emoji: "🦆", color: "#ffd84d" },
  { id: 8, name: "Moon Cake",  price: 52.5, serial: "#6034", emoji: "🌙", color: "#7fa8ff" }
];

const fresh = list => list.map(g => ({ ...g, upgraded: false, rarity: null }));

// ---------- HELPERS ----------
const esc = s => String(s).replace(/[&<>"']/g, c => (
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
));
const round1 = n => Math.round(n * 10) / 10;

function haptic(kind) {
  try {
    if (kind === "light") tg.HapticFeedback.impactOccurred("light");
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
function defaultState() {
  let favs = [];
  try { favs = JSON.parse(localStorage.getItem("favs") || "[]"); } catch (e) {}
  return {
    balance: START_BALANCE,
    market: fresh(seedMarket),
    inventory: fresh(seedInventory),
    favorites: favs
  };
}

function load() {
  try {
    const s = JSON.parse(localStorage.getItem("gv_state"));
    if (s && Array.isArray(s.market) && Array.isArray(s.inventory)) return s;
  } catch (e) {}
  return defaultState();
}

function save() {
  try { localStorage.setItem("gv_state", JSON.stringify(state)); } catch (e) {}
}

let state = load();
let tab = "all";
let sort = "default";
let query = "";
let upgradeId = null;

// ---------- ELEMENTS ----------
const grid = document.getElementById("grid");
const invGrid = document.getElementById("invGrid");
const sheet = document.getElementById("sheet");

// ---------- CARD HTML ----------
function cardHTML(g, actions) {
  const tag = g.rarity
    ? `<div class="rarity" style="--r:${RARITY[g.rarity].color}">${g.rarity}</div>`
    : "";
  return `
    <div class="card" style="--c:${g.color}">
      <div class="serial">${g.serial}</div>
      ${tag}
      <div class="art">${g.emoji}</div>
      <h3>${esc(g.name)}</h3>
      <div class="row">${actions}</div>
    </div>`;
}

// ---------- RENDER: MARKET ----------
function renderMarket() {
  let list = state.market.filter(g => g.name.toLowerCase().includes(query.toLowerCase()));

  if (tab === "fav") list = list.filter(g => state.favorites.includes(g.id));
  if (sort === "low")  list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty">Nothing here yet</div>`;
    return;
  }

  grid.innerHTML = list.map(g => cardHTML(g, `
    <button class="price" onclick="buy(${g.id})">💎 ${g.price}</button>
    <button class="heart ${state.favorites.includes(g.id) ? "on" : ""}" onclick="toggleFav(${g.id})">♥</button>
  `)).join("");
}

// ---------- RENDER: INVENTORY ----------
function renderInventory() {
  const total = state.inventory.reduce((sum, g) => sum + g.price, 0);
  document.getElementById("invStats").innerHTML =
    `<span>🎒 ${state.inventory.length} gifts</span><span>Value 💎 ${total.toFixed(1)}</span>`;

  if (state.inventory.length === 0) {
    invGrid.innerHTML = `<div class="empty">Your inventory is empty.<br>Buy a gift on the Market.</div>`;
    return;
  }

  invGrid.innerHTML = state.inventory.map(g => cardHTML(g, `
    <button class="price sell" onclick="sell(${g.id})">Sell ${g.price}</button>
    ${g.upgraded ? "" : `<button class="heart" onclick="goUpgrade(${g.id})">⚡</button>`}
  `)).join("");
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
      <div class="up-art">${sel.emoji}</div>
      <h2>${esc(sel.name)}</h2>
      <p class="muted">${sel.serial} · worth ${sel.price} TON</p>
    </div>

    <div class="picker">
      ${eligible.map(g => `
        <button class="pick ${g.id === sel.id ? "on" : ""}" style="--c:${g.color}" onclick="pickUpgrade(${g.id})">${g.emoji}</button>
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

    <button class="big-btn" onclick="upgrade()">⚡ Upgrade for ${UPGRADE_FEE} TON</button>
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
      <div class="panel stat"><b>💎 ${state.balance.toFixed(1)}</b><span>Balance</span></div>
      <div class="panel stat"><b>${state.inventory.length}</b><span>Gifts owned</span></div>
      <div class="panel stat"><b>${state.favorites.length}</b><span>Favorites</span></div>
      <div class="panel stat"><b>💎 ${total.toFixed(1)}</b><span>Portfolio value</span></div>
    </div>

    <button class="ghost-btn" disabled>👛 Connect wallet (coming soon)</button>
    <button class="ghost-btn danger" onclick="resetDemo()">Reset demo data</button>
    <p class="muted note">Demo mode: all TON here is fake.</p>
  `;
}

function updateBalance() {
  document.getElementById("balance").textContent = "💎 " + state.balance.toFixed(1);
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
}

// ---------- ACTIONS ----------
function toggleFav(id) {
  const i = state.favorites.indexOf(id);
  if (i >= 0) state.favorites.splice(i, 1);
  else state.favorites.push(id);
  save();
  haptic("light");
  renderMarket();
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
      renderAll();
      haptic("success");

      // small delay so the first popup is fully closed
      setTimeout(() => {
        ask("🎉 " + rarity + "!", g.name + " is now " + rarity + ".\nNew value: " + g.price + " TON", [{ type: "close" }]);
      }, 350);
    });
}

function resetDemo() {
  ask("Reset demo?", "This clears your demo inventory, balance and favorites.",
    [{ id: "reset", type: "destructive", text: "Reset" }, { type: "cancel" }],
    btn => {
      if (btn !== "reset") return;
      try {
        localStorage.removeItem("gv_state");
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
    renderMarket();
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
    renderMarket();
  });
});

document.querySelectorAll("nav .tab").forEach(t => {
  t.addEventListener("click", () => showView(t.dataset.view));
});

// ---------- START ----------
renderAll();