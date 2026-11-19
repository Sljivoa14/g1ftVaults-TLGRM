 // FAKE DATABASE 4 NOW
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const user = tg.initDataUnsafe.user;
if (user) {
  document.getElementById("userName").textContent = "👋 " + user.first_name;
}
    const gifts = [
      { id: 1, name: "Pharaoh",     price: 99.9,  serial: "#1042", emoji: "🏺", color: "#f5b82e" },
      { id: 2, name: "Redo",        price: 631.3, serial: "#0077", emoji: "🔄", color: "#c9c9d1" },
      { id: 3, name: "Money Rider", price: 103,   serial: "#5521", emoji: "🚕", color: "#d8d2c2" },
      { id: 4, name: "Ring King",   price: 76.2,  serial: "#3310", emoji: "🎀", color: "#ff5fa8" },
      { id: 5, name: "Star Cat",    price: 45.5,  serial: "#8890", emoji: "🐱", color: "#8ecbff" },
      { id: 6, name: "Rocket",      price: 210,   serial: "#0412", emoji: "🚀", color: "#9b7bff" }
    ];

    // ---------- STATE ----------
    let favorites = [];
    let tab = "all";
    let sort = "default";
    let query = "";

    // ---------- ELEMENTS ----------
    const grid = document.getElementById("grid");
    const sheet = document.getElementById("sheet");

    // ---------- DRAW THE GRID ----------
    function render() {
      let list = gifts.filter(g => g.name.toLowerCase().includes(query.toLowerCase()));

      if (tab === "fav") list = list.filter(g => favorites.includes(g.id));
      if (sort === "low")  list.sort((a, b) => a.price - b.price);
      if (sort === "high") list.sort((a, b) => b.price - a.price);

      if (list.length === 0) {
        grid.innerHTML = `<div class="empty">Nothing here yet</div>`;
        return;
      }

      grid.innerHTML = list.map(g => `
        <div class="card" style="background:${g.color}">
          <div class="serial">${g.serial}</div>
          <div class="art">${g.emoji}</div>
          <h3>${g.name}</h3>
          <div class="row">
            <button class="price" onclick="buy(${g.id})">💎 ${g.price}</button>
            <button class="heart ${favorites.includes(g.id) ? "on" : ""}" onclick="toggleFav(${g.id})">♥</button>
          </div>
        </div>
      `).join("");
    }

    // ---------- ACTIONS ----------
    function toggleFav(id) {
      if (favorites.includes(id)) favorites = favorites.filter(f => f !== id);
      else favorites.push(id);
      render();
    }

    function buy(id) {
      const g = gifts.find(x => x.id === id);
      alert("Buy " + g.name + " for " + g.price + " TON? (not connected yet)");
    }

    // ---------- EVENTS ----------
    document.getElementById("search").addEventListener("input", e => {
      query = e.target.value;
      render();
    });

    document.querySelectorAll(".chip").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        tab = btn.dataset.tab;
        render();
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
        render();
      });
    });

    render();