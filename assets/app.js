/* =============================================================
   PIRAMIDA HVAC — app.js
   Full script: company data + product rendering + WhatsApp fix
   ============================================================= */

const COMPANY = {
  name: "Piramida HVAC",
  city: "Fushë Kosovë, Kosovë",
  phoneDisplay: "+383 48 559 888",
  phoneTel: "+38348559888",       // clean (no spaces) for tel: links
  whatsapp: "38348559888",        // clean digits for wa.me links
  email: "info@piramida-hvac.com",
  address: "Nëna Terezë, Fushë Kosovë, Kosovë",
  mapUrl: "https://maps.app.goo.gl/Di5mHocnKfDJe8LY7",
  mapEmbed: "https://www.google.com/maps?q=Piramida%20HVAC%20Fush%C3%AB%20Kosov%C3%AB%20Kosovo&output=embed"
};

/* -----------------------------
   WHATSAPP HELPERS
------------------------------ */
function getWhatsAppLink(message = "") {
  const phone = COMPANY.whatsapp.replace(/[^\d]/g, '');
  return `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
function openWhatsApp(message = "Përshëndetje, dua një ofertë për HVAC") {
  window.open(getWhatsAppLink(message), "_blank");
}

/* -----------------------------
   PRODUCTS (fallback data)
------------------------------ */
const DEFAULT_PRODUCTS = [
  {
    id: "wall-mounted-units",
    title: "Wall Mounted Units",
    sidebarTitle: "Wall Mounted Units",
    image: "assets/products/wall-mounted-units.jpg",
    description: "Njësi murale për ftohje dhe ngrohje."
  },

  {
    id: "multi-variable-r32",
    title: "MULTI VARIABLE Series R32",
    sidebarTitle: "MULTI VARIABLE Series R32",
    image: "assets/products/multi-variable-r32.jpg",
    description: "Sisteme Multi Variable me teknologji R32."
  },

  {
    id: "commercial-system",
    title: "Commercial System",
    sidebarTitle: "Commercial System",
    image: "assets/products/commercial-system.jpg",
    description: "Sisteme komerciale HVAC për biznese dhe objekte të mëdha."
  },

  {
    id: "uni-split-2",
    title: "UNI SPLIT 2",
    sidebarTitle: "UNI SPLIT 2",
    image: "assets/products/uni-split-2.jpg",
    description: "Sisteme UNI SPLIT 2 për aplikime rezidenciale dhe komerciale."
  },

  {
    id: "chillers",
    title: "Chillers",
    sidebarTitle: "Chillers",
    image: "assets/products/chillers.jpg",
    description: "Chiller për ftohje komerciale dhe industriale."
  },

  {
    id: "fan-coil-units",
    title: "Fan Coil Units",
    sidebarTitle: "Fan Coil Units",
    image: "assets/products/fan-coil-units.jpg",
    description: "Fan Coil Units për sisteme HVAC moderne."
  },

  {
    id: "portable-units",
    title: "Portable Units",
    sidebarTitle: "Portable Units",
    image: "assets/products/portable-units.jpg",
    description: "Njësi portative për ftohje dhe ventilim."
  }
];


/* -----------------------------
   NAVIGATION + COMPANY DETAILS
------------------------------ */
function setActiveNavigation() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) link.classList.add("active");
  });
}

function initMobileNav() {
  const button = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav-links]");
  if (!button || !nav) return;
  button.addEventListener("click", () => nav.classList.toggle("open"));
}

function fillCompanyDetails() {
  document.querySelectorAll("[data-company-name]").forEach((el) => {
    el.textContent = COMPANY.name;
  });
  document.querySelectorAll("[data-company-city]").forEach((el) => {
    el.textContent = COMPANY.city;
  });
  document.querySelectorAll("[data-company-phone]").forEach((el) => {
    el.textContent = COMPANY.phoneDisplay;
    if (el.tagName.toLowerCase() === "a") el.href = `tel:${COMPANY.phoneTel}`;
  });
  document.querySelectorAll("[data-company-whatsapp]").forEach((el) => {
    el.href = getWhatsAppLink();
  });
  document.querySelectorAll("[data-company-email]").forEach((el) => {
    el.textContent = COMPANY.email;
    if (el.tagName.toLowerCase() === "a") el.href = `mailto:${COMPANY.email}`;
  });
  document.querySelectorAll("[data-company-address]").forEach((el) => {
    el.textContent = COMPANY.address;
  });
  document.querySelectorAll("[data-map]").forEach((iframe) => {
    iframe.src = COMPANY.mapEmbed;
  });
  document.querySelectorAll("[data-map-link]").forEach((el) => {
    el.href = COMPANY.mapUrl;
  });
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* -----------------------------
   SCROLL REVEAL
------------------------------ */
function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
}

/* -----------------------------
   PRODUCT HELPERS
------------------------------ */
function productIcon(category = "") {
  const value = category.toLowerCase();
  if (value.includes("heat") || value.includes("pomp")) return "♨️";
  if (value.includes("commercial") || value.includes("komercial")) return "🏢";
  if (value.includes("multi")) return "🔁";
  if (value.includes("vent") || value.includes("fan")) return "💨";
  if (value.includes("led")) return "💡";
  return "❄️";
}

function productTitle(product) {
  return product.title || [product.brand, product.model].filter(Boolean).join(" ") || "Produkt";
}

function productBlob(product) {
  return `${product.title || ""} ${product.titleEn || ""} ${product.sidebarTitle || ""} ${product.brand || ""} ${product.model || ""} ${product.category || ""} ${product.description || ""} ${(product.features || []).join(" ")}`.toLowerCase();
}

/* -----------------------------
   PRODUCT CARDS
------------------------------ */
function catalogProductCard(product) {
  const title = productTitle(product);
  const image = product.image
    ? `<img src="${product.image}" alt="${title}" loading="lazy">`
    : `<div class="product-placeholder">${productIcon(product.category || product.title)}</div>`;
  const inquiryHref = getWhatsAppLink(`Përshëndetje, jam i/e interesuar për: ${title}`);
  return `
    <article class="catalog-card reveal" data-product-id="${product.id || ""}">
      <div class="catalog-card-image">
        ${image}
        <div class="catalog-card-overlay">
          <h3>${title}</h3>
          <p>${product.description || "Produkt HVAC profesional për ftohje, ngrohje dhe ventilim."}</p>
        </div>
      </div>
      <div class="catalog-card-body">
        <h3>${title}</h3>
        <div class="catalog-card-actions">
          <a class="catalog-card-btn catalog-card-btn-red" href="${inquiryHref}" target="_blank" rel="noopener">
            Kërko ofertë
          </a>
        </div>
      </div>
    </article>
  `;
}

function legacyProductCard(product) {
  const imageHtml = product.image
    ? `<img src="${product.image}" alt="${product.brand || ""} ${product.model || productTitle(product)}" loading="lazy">`
    : `<div class="product-placeholder" aria-hidden="true">${productIcon(product.category)}</div>`;
  const features = (product.features || []).slice(0, 4).map((feature) => `<li>${feature}</li>`).join("");
  const capacity = product.capacity ? `<span>${product.capacity}</span>` : "";
  const energy = product.energyClass ? `<span>${product.energyClass}</span>` : "";
  const refrigerant = product.refrigerant ? `<span>${product.refrigerant}</span>` : "";
  const productUrl = product.productUrl
    ? `<a class="btn btn-secondary" href="${product.productUrl}" target="_blank" rel="noopener">Detaje</a>`
    : "";
  const inquiryHref = getWhatsAppLink(`Përshëndetje, jam i/e interesuar për: ${productTitle(product)}`);
  return `
    <article class="card product-card reveal" data-category="${product.category || ""}">
      <div class="product-media">${imageHtml}</div>
      <div class="product-body">
        <span class="product-tag">${product.category || "HVAC"}</span>
        <h3>${productTitle(product)}</h3>
        <p>${product.description || "Produkt HVAC për shitje dhe montim profesional."}</p>
        <div class="product-meta">${capacity}${energy}${refrigerant}</div>
        <ul class="product-features">${features}</ul>
        <div class="product-actions">
          <a class="btn btn-primary" href="${inquiryHref}" target="_blank" rel="noopener">Kërko ofertë</a>
          ${productUrl}
        </div>
      </div>
    </article>
  `;
}

/* -----------------------------
   LOAD + RENDER PRODUCTS
------------------------------ */
async function loadProducts() {
  try {
    const response = await fetch("data/products.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load products.json: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("Using built-in fallback products. For automatic updates, run the page through GitHub Pages or a local server.", error);
    return DEFAULT_PRODUCTS;
  }
}

async function initProductsPage() {
  const grid = document.querySelector("[data-products-grid]");
  if (!grid) return;

  const searchInput = document.querySelector("[data-product-search]");
  const categorySelect = document.querySelector("[data-product-category]");
  const sortSelect = document.querySelector("[data-product-sort]");
  const sidebar = document.querySelector("[data-products-sidebar]");
  const empty = document.querySelector("[data-products-empty]");
  const count = document.querySelector("[data-products-count]");
  const isCatalogLayout = document.body.classList.contains("product-catalog-page");

  let products = await loadProducts();
  let activeId = "";

  if (categorySelect) {
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  }

  if (sidebar) {
    const sideClass = isCatalogLayout ? "catalog-side-link" : "sinclair-side-link";
    sidebar.innerHTML = `
      <button class="${sideClass} active" type="button" data-sidebar-id="">Të gjitha produktet <span>›</span></button>
      ${products.map((product) => `
        <button class="${sideClass}" type="button" data-sidebar-id="${product.id}">${product.sidebarTitle || productTitle(product)} <span>›</span></button>
      `).join("")}
    `;
    sidebar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-sidebar-id]");
      if (!button) return;
      activeId = button.dataset.sidebarId || "";
      sidebar.querySelectorAll(`.${sideClass}`).forEach((btn) => btn.classList.toggle("active", btn === button));
      render();
    });
  }

  function render() {
    const term = (searchInput?.value || "").toLowerCase().trim();
    const category = categorySelect?.value || "";

    let filtered = products.filter((product) => {
      const matchesTerm = !term || productBlob(product).includes(term);
      const matchesCategory = !category || product.category === category;
      const matchesSidebar = !activeId || product.id === activeId;
      return matchesTerm && matchesCategory && matchesSidebar;
    });

    if (sortSelect?.value === "az") {
      filtered.sort((a, b) => productTitle(a).localeCompare(productTitle(b)));
    } else if (sortSelect?.value === "category") {
      filtered.sort((a, b) => `${a.category || ""} ${productTitle(a)}`.localeCompare(`${b.category || ""} ${productTitle(b)}`));
    }

    grid.innerHTML = filtered.map(isCatalogLayout ? catalogProductCard : legacyProductCard).join("");
    if (empty) empty.style.display = filtered.length ? "none" : "block";
    if (count) count.textContent = `${filtered.length} kategori të shfaqura`;
    revealOnScroll();
  }

  [searchInput, categorySelect, sortSelect].filter(Boolean).forEach((control) => control.addEventListener("input", render));
  render();
}

/* -----------------------------
   CONTACT FORM
------------------------------ */
function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  const notice = document.querySelector("[data-contact-notice]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name") || "";
    const phone = formData.get("phone") || "";
    const email = formData.get("email") || "";
    const service = formData.get("service") || "";
    const message = formData.get("message") || "";
    const subject = encodeURIComponent(`Kërkesë nga website - ${service || "Piramida HVAC"}`);
    const body = encodeURIComponent(`Emri: ${name}\nTelefoni: ${phone}\nEmail: ${email}\nShërbimi: ${service}\nMesazhi: ${message}`);
    window.location.href = `mailto:${COMPANY.email}?subject=${subject}&body=${body}`;
    if (notice) {
      notice.style.display = "block";
      notice.textContent = "Po hapet email-i juaj. Nëse nuk hapet automatikisht, na kontaktoni në WhatsApp ose telefon.";
    }
  });
}

/* -----------------------------
   GLOBAL EXPORTS
------------------------------ */
window.openWhatsApp = openWhatsApp;
window.getWhatsAppLink = getWhatsAppLink;
window.COMPANY = COMPANY;
window.DEFAULT_PRODUCTS = DEFAULT_PRODUCTS;

/* -----------------------------
   INIT
------------------------------ */
setActiveNavigation();
initMobileNav();
fillCompanyDetails();
revealOnScroll();
initProductsPage();
initContactForm();
