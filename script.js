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

// ---------- GIFT ART (original bubbly sticker drawings, keyed by gift id) ----------
const OUT = 'stroke="#0b0b14" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';

const ART = {
  // 1 - Pharaoh
  1: `
    <path d="M22 42 Q20 10 50 10 Q80 10 78 42 L88 86 Q50 96 12 86 Z" fill="#f5b82e" ${OUT}/>
    <path d="M30 26 Q50 20 70 26" fill="none" stroke="#2a6bff" stroke-width="5" stroke-linecap="round"/>
    <path d="M20 58 Q50 52 80 58" fill="none" stroke="#2a6bff" stroke-width="5" stroke-linecap="round"/>
    <path d="M19 68 Q50 62 81 68" fill="none" stroke="#2a6bff" stroke-width="5" stroke-linecap="round"/>
    <path d="M18 78 Q50 72 82 78" fill="none" stroke="#2a6bff" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="50" cy="50" rx="20" ry="25" fill="#ffd98a" ${OUT}/>
    <path d="M36 41 L46 42 M54 42 L64 41" stroke="#0b0b14" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="42" cy="49" rx="3.5" ry="4" fill="#0b0b14"/>
    <ellipse cx="58" cy="49" rx="3.5" ry="4" fill="#0b0b14"/>
    <circle cx="43" cy="47.6" r="1.2" fill="#fff"/><circle cx="59" cy="47.6" r="1.2" fill="#fff"/>
    <circle cx="35" cy="58" r="4" fill="#ff7a9c" opacity=".5"/><circle cx="65" cy="58" r="4" fill="#ff7a9c" opacity=".5"/>
    <path d="M43 62 Q50 67 57 62" fill="none" stroke="#0b0b14" stroke-width="3" stroke-linecap="round"/>
    <path d="M50 25 L54 30 L50 35 L46 30 Z" fill="#ff4fa3" stroke="#0b0b14" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M44 74 L56 74 L55 90 L45 90 Z" fill="#2a6bff" ${OUT}/>
    <ellipse cx="33" cy="22" rx="7" ry="3" fill="#fff" opacity=".6" transform="rotate(-25 33 22)"/>`,

  // 2 - Redo
  2: `
    <circle cx="50" cy="50" r="40" fill="#d6d6df" ${OUT}/>
    <circle cx="50" cy="50" r="30" fill="#8b5cff" ${OUT}/>
    <path d="M66 50 A16 16 0 1 1 58 36.1" fill="none" stroke="#0b0b14" stroke-width="12" stroke-linecap="round"/>
    <path d="M61.5 29.9 L54.5 42.1 L65.8 40.5 Z" fill="#0b0b14" stroke="#0b0b14" stroke-width="7" stroke-linejoin="round"/>
    <path d="M66 50 A16 16 0 1 1 58 36.1" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
    <path d="M61.5 29.9 L54.5 42.1 L65.8 40.5 Z" fill="#fff" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="32" cy="28" rx="10" ry="4" fill="#fff" opacity=".6" transform="rotate(-35 32 28)"/>`,

  // 3 - Money Rider
  3: `
    <g transform="translate(0 6)">
      <rect x="44" y="20" width="16" height="9" rx="3" fill="#fff" stroke="#0b0b14" stroke-width="3" stroke-linejoin="round"/>
      <path d="M10 62 Q10 52 22 50 L32 36 Q35 32 40 32 L62 32 Q67 32 70 36 L78 50 Q92 52 92 62 L92 68 L10 68 Z" fill="#ffd23f" ${OUT}/>
      <path d="M36 38 L32 49 L48 49 L48 38 Z" fill="#8ecbff" stroke="#0b0b14" stroke-width="3" stroke-linejoin="round"/>
      <path d="M54 38 L54 49 L73 49 L66 38 Z" fill="#8ecbff" stroke="#0b0b14" stroke-width="3" stroke-linejoin="round"/>
      <rect x="84" y="55" width="6" height="5" rx="2" fill="#fff" stroke="#0b0b14" stroke-width="2"/>
      <circle cx="29" cy="70" r="10" fill="#2b2b36" ${OUT}/><circle cx="29" cy="70" r="3.5" fill="#d6d6df"/>
      <circle cx="73" cy="70" r="10" fill="#2b2b36" ${OUT}/><circle cx="73" cy="70" r="3.5" fill="#d6d6df"/>
      <circle cx="82" cy="22" r="10" fill="#5dffb8" stroke="#0b0b14" stroke-width="3"/>
      <text x="82" y="27" text-anchor="middle" font-size="14" font-weight="800" fill="#0b0b14" font-family="Arial, sans-serif">$</text>
      <ellipse cx="24" cy="57" rx="7" ry="2.5" fill="#fff" opacity=".6" transform="rotate(-20 24 57)"/>
    </g>`,

  // 4 - Ring King
  4: `
    <circle cx="50" cy="66" r="21" fill="none" stroke="#0b0b14" stroke-width="15"/>
    <circle cx="50" cy="66" r="21" fill="none" stroke="#ff5fa8" stroke-width="8"/>
    <path d="M33 74 Q36 84 46 87" fill="none" stroke="#fff" stroke-width="3" opacity=".65" stroke-linecap="round"/>
    <path d="M32 42 L32 16 L42 28 L50 10 L58 28 L68 16 L68 42 Z" fill="#ffd23f" ${OUT}/>
    <circle cx="50" cy="32" r="4.5" fill="#ff4fa3" stroke="#0b0b14" stroke-width="2.5"/>
    <circle cx="40" cy="36" r="2.5" fill="#8ef0ff" stroke="#0b0b14" stroke-width="1.5"/>
    <circle cx="60" cy="36" r="2.5" fill="#8ef0ff" stroke="#0b0b14" stroke-width="1.5"/>
    <ellipse cx="38" cy="24" rx="4" ry="2" fill="#fff" opacity=".7" transform="rotate(-50 38 24)"/>`,

  // 5 - Star Cat
  5: `
    <path d="M20 44 L22 14 L40 28 Q50 26 60 28 L78 14 L80 44 Q82 80 50 83 Q18 80 20 44 Z" fill="#f4f1ff" ${OUT}/>
    <path d="M26 24 L26 37 L34 31 Z" fill="#ff8ac4"/><path d="M74 24 L74 37 L66 31 Z" fill="#ff8ac4"/>
    <path d="M50 30 L52.5 36 L59 36.5 L54 40.5 L55.8 47 L50 43.5 L44.2 47 L46 40.5 L41 36.5 L47.5 36 Z" fill="#ffd23f" stroke="#0b0b14" stroke-width="2.5" stroke-linejoin="round"/>
    <ellipse cx="36" cy="56" rx="5" ry="7" fill="#0b0b14"/><ellipse cx="64" cy="56" rx="5" ry="7" fill="#0b0b14"/>
    <circle cx="38" cy="53" r="2" fill="#fff"/><circle cx="66" cy="53" r="2" fill="#fff"/>
    <path d="M46 64 L54 64 L50 69 Z" fill="#ff5fa8" stroke="#0b0b14" stroke-width="2" stroke-linejoin="round"/>
    <path d="M50 69 Q46 75 42 72 M50 69 Q54 75 58 72" fill="none" stroke="#0b0b14" stroke-width="3" stroke-linecap="round"/>
    <path d="M24 62 L10 59 M24 68 L11 72 M76 62 L90 59 M76 68 L89 72" stroke="#0b0b14" stroke-width="3" stroke-linecap="round"/>
    <circle cx="28" cy="68" r="4" fill="#ff8ac4" opacity=".6"/><circle cx="72" cy="68" r="4" fill="#ff8ac4" opacity=".6"/>`,

  // 6 - Rocket
  6: `
    <path d="M38 66 Q50 98 62 66 Z" fill="#ffd23f" ${OUT}/>
    <path d="M44 66 Q50 84 56 66 Z" fill="#ff7a3d"/>
    <path d="M32 52 L16 74 L33 70 Z" fill="#ff4fa3" ${OUT}/>
    <path d="M68 52 L84 74 L67 70 Z" fill="#ff4fa3" ${OUT}/>
    <path d="M50 8 Q74 28 69 66 L31 66 Q26 28 50 8 Z" fill="#f4f1ff" ${OUT}/>
    <path d="M50 8 Q60 16 64 30 L36 30 Q40 16 50 8 Z" fill="#ff4fa3" ${OUT}/>
    <circle cx="50" cy="47" r="10" fill="#8ecbff" ${OUT}/>
    <ellipse cx="46" cy="43" rx="3" ry="2" fill="#fff" opacity=".85"/>
    <path d="M38 40 Q36 52 38 60" fill="none" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/>`,

  // 7 - Lucky Duck
  7: `
    <ellipse cx="46" cy="68" rx="32" ry="20" fill="#ffd84d" ${OUT}/>
    <path d="M22 64 Q34 78 50 66 Q36 56 22 64 Z" fill="#ffc21a" stroke="#0b0b14" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="58" cy="38" r="19" fill="#ffd84d" ${OUT}/>
    <path d="M74 40 L92 45 L74 52 Z" fill="#ff8a3d" stroke="#0b0b14" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="62" cy="34" r="3.5" fill="#0b0b14"/><circle cx="63.2" cy="32.8" r="1.2" fill="#fff"/>
    <ellipse cx="52" cy="26" rx="6" ry="3" fill="#fff" opacity=".6" transform="rotate(-30 52 26)"/>
    <g fill="#0b0b14">
      <circle cx="28" cy="26" r="8"/><circle cx="38" cy="26" r="8"/><circle cx="33" cy="19" r="8"/><circle cx="33" cy="33" r="8"/>
    </g>
    <g fill="#3ddc84">
      <circle cx="28" cy="26" r="5.5"/><circle cx="38" cy="26" r="5.5"/><circle cx="33" cy="19" r="5.5"/><circle cx="33" cy="33" r="5.5"/>
    </g>
    <path d="M33 38 L28 48" stroke="#0b0b14" stroke-width="3" stroke-linecap="round"/>`,

  // 8 - Moon Cake
  8: `
    <path d="M51 14 A36 36 0 1 0 82.8 64.8 A30 30 0 1 1 51 14 Z" fill="#fff1b8" ${OUT}/>
    <circle cx="26" cy="52" r="4.5" fill="#e8cf7a"/><circle cx="34" cy="72" r="3.5" fill="#e8cf7a"/><circle cx="30" cy="34" r="3" fill="#e8cf7a"/>
    <path d="M0 -8 Q1 -1 8 0 Q1 1 0 8 Q-1 1 -8 0 Q-1 -1 0 -8 Z" transform="translate(76 28)" fill="#fff" stroke="#0b0b14" stroke-width="2" stroke-linejoin="round"/>
    <path d="M0 -6 Q1 -1 6 0 Q1 1 0 6 Q-1 1 -6 0 Q-1 -1 0 -6 Z" transform="translate(84 50)" fill="#ffd23f" stroke="#0b0b14" stroke-width="2" stroke-linejoin="round"/>
    <ellipse cx="28" cy="30" rx="9" ry="3.5" fill="#fff" opacity=".7" transform="rotate(-40 28 30)"/>`
};

const ART_GENERIC = `
  <rect x="18" y="44" width="64" height="42" rx="6" fill="#ff5fa8" ${OUT}/>
  <rect x="12" y="32" width="76" height="16" rx="5" fill="#ff8ac4" ${OUT}/>
  <rect x="44" y="32" width="12" height="54" fill="#ffd23f" ${OUT}/>
  <path d="M50 32 Q30 6 30 22 Q30 32 50 32 Z" fill="#ffd23f" ${OUT}/>
  <path d="M50 32 Q70 6 70 22 Q70 32 50 32 Z" fill="#ffd23f" ${OUT}/>`;

const art = id =>
  '<svg class="gift-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' + (ART[id] || ART_GENERIC) + '</svg>';

// ---------- FAKE DATABASE ----------
const seedMarket = [
  { id: 1, name: "Pharaoh",     price: 99.9,  serial: "#1042", color: "#f5b82e" },
  { id: 2, name: "Redo",        price: 631.3, serial: "#0077", color: "#a98cff" },
  { id: 3, name: "Money Rider", price: 103,   serial: "#5521", color: "#ffd23f" },
  { id: 4, name: "Ring King",   price: 76.2,  serial: "#3310", color: "#ff5fa8" },
  { id: 5, name: "Star Cat",    price: 45.5,  serial: "#8890", color: "#8ecbff" },
  { id: 6, name: "Rocket",      price: 210,   serial: "#0412", color: "#ff4fa3" }
];

const seedInventory = [
  { id: 7, name: "Lucky Duck", price: 38,   serial: "#2210", color: "#ffd84d" },
  { id: 8, name: "Moon Cake",  price: 52.5, serial: "#6034", color: "#7fa8ff" }
];

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
  return `
    <div class="card${animate ? " pop" : ""}" style="--c:${g.color};--d:${(i * 0.06).toFixed(2)}s">
      <div class="serial">${g.serial}</div>
      ${tag}
      <div class="art">${art(g.id)}</div>
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
      <div class="up-art">${art(sel.id)}</div>
      <h2>${esc(sel.name)}</h2>
      <p class="muted">${sel.serial} · worth ${sel.price} TON</p>
    </div>

    <div class="picker">
      ${eligible.map(g => `
        <button class="pick ${g.id === sel.id ? "on" : ""}" style="--c:${g.color}" onclick="pickUpgrade(${g.id})">${art(g.id)}</button>
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
  box.innerHTML = art(g.id);
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