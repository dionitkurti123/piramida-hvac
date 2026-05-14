const COMPANY = {
  name: "Piramida HVAC",
  city: "Fushë Kosovë, Kosovë",
  phoneDisplay: "+383 4X XXX XXX",
  phoneTel: "+3834XXXXXXX",
  whatsapp: "3834XXXXXXX",
  email: "info@piramidahvac.com",
  address: "Piramida HVAC, Fushë Kosovë, Kosovë",
  mapUrl: "https://maps.app.goo.gl/gH9mqYwz3zxkeoAa6",
  mapEmbed: "https://www.google.com/maps?q=Piramida%20HVAC%20Fush%C3%AB%20Kosov%C3%AB%20Kosovo&output=embed"
};

function setActiveNavigation() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .products-nav a").forEach((link) => {
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
  document.querySelectorAll("[data-company-name]").forEach((el) => { el.textContent = COMPANY.name; });
  document.querySelectorAll("[data-company-city]").forEach((el) => { el.textContent = COMPANY.city; });
  document.querySelectorAll("[data-company-phone]").forEach((el) => {
    el.textContent = COMPANY.phoneDisplay;
    if (el.tagName.toLowerCase() === "a") el.href = `tel:${COMPANY.phoneTel}`;
  });
  document.querySelectorAll("[data-company-whatsapp]").forEach((el) => {
    el.href = `https://wa.me/${COMPANY.whatsapp}`;
  });
  document.querySelectorAll("[data-company-email]").forEach((el) => {
    el.textContent = COMPANY.email;
    if (el.tagName.toLowerCase() === "a") el.href = `mailto:${COMPANY.email}`;
  });
  document.querySelectorAll("[data-company-address]").forEach((el) => { el.textContent = COMPANY.address; });
  document.querySelectorAll("[data-map]").forEach((iframe) => { iframe.src = COMPANY.mapEmbed; });
  document.querySelectorAll("[data-map-link]").forEach((el) => { el.href = COMPANY.mapUrl; });
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
}

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

function productIcon(category = "") {
  const value = category.toLowerCase();
  if (value.includes("heat") || value.includes("pomp")) return "♨️";
  if (value.includes("commercial") || value.includes("komercial")) return "🏢";
  if (value.includes("multi")) return "🔁";
  if (value.includes("vent")) return "💨";
  return "❄️";
}

function sinclairProductCard(product) {
  const title = product.title || [product.brand, product.model].filter(Boolean).join(" ") || "Produkt";
  const image = product.image
    ? `<img src="${product.image}" alt="${title}" loading="lazy">`
    : `<div class="product-placeholder" aria-hidden="true">${productIcon(product.category || product.title)}</div>`;
  const link = product.productUrl || "contact.html";
  const description = product.description || "Produkt Sinclair për shitje, montim dhe projektim nga Piramida HVAC.";
  return `
    <article class="sinclair-card reveal" data-product-id="${product.id || ""}">
      <div class="sinclair-card-image">${image}</div>
      <h3>${title}</h3>
      <p>${description}</p>
      <a class="sinclair-card-btn" href="${link}" target="${link.startsWith("http") ? "_blank" : "_self"}" rel="${link.startsWith("http") ? "noopener" : ""}">Përmbledhja e produkteve</a>
    </article>
  `;
}

function legacyProductCard(product) {
  const imageHtml = product.image
    ? `<img src="${product.image}" alt="${product.brand} ${product.model}" loading="lazy">`
    : `<div class="product-placeholder" aria-hidden="true">${productIcon(product.category)}</div>`;

  const features = (product.features || []).slice(0, 4).map((feature) => `<li>${feature}</li>`).join("");
  const capacity = product.capacity ? `<span>${product.capacity}</span>` : "";
  const energy = product.energyClass ? `<span>${product.energyClass}</span>` : "";
  const refrigerant = product.refrigerant ? `<span>${product.refrigerant}</span>` : "";
  const productUrl = product.productUrl ? `<a class="btn btn-secondary" href="${product.productUrl}" target="_blank" rel="noopener">Detaje</a>` : "";
  const inquiryText = encodeURIComponent(`Përshëndetje, jam i/e interesuar për: ${product.brand} ${product.model}`);

  return `
    <article class="card product-card reveal" data-category="${product.category}">
      <div class="product-media">${imageHtml}</div>
      <div class="product-body">
        <span class="product-tag">${product.category}</span>
        <h3>${product.brand} ${product.model}</h3>
        <p>${product.description || "Produkt HVAC për shitje dhe montim profesional."}</p>
        <div class="product-meta">${capacity}${energy}${refrigerant}</div>
        <ul class="product-features">${features}</ul>
        <div class="product-actions">
          <a class="btn btn-primary" href="https://wa.me/${COMPANY.whatsapp}?text=${inquiryText}" target="_blank" rel="noopener">Kërko ofertë</a>
          ${productUrl}
        </div>
      </div>
    </article>
  `;
}

async function initProductsPage() {
  const grid = document.querySelector("[data-products-grid]");
  if (!grid) return;

  const searchInput = document.querySelector("[data-product-search]");
  const categorySelect = document.querySelector("[data-product-category]");
  const sortSelect = document.querySelector("[data-product-sort]");
  const sidebar = document.querySelector("[data-products-sidebar]");
  const empty = document.querySelector("[data-products-empty]");
  const isSinclairLayout = document.body.classList.contains("sinclair-products-page");

  let products = [];
  try {
    const response = await fetch("data/products.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load products.json: ${response.status}`);
    products = await response.json();
  } catch (error) {
    grid.innerHTML = `<div class="card"><h3>Produktet nuk u ngarkuan</h3><p>Kontrollo që file <strong>data/products.json</strong> ekziston në GitHub.</p></div>`;
    console.error(error);
    return;
  }

  let activeId = "";

  function productTitle(product) {
    return product.title || product.model || "Produkt";
  }

  function productBlob(product) {
    return `${product.title || ""} ${product.titleEn || ""} ${product.sidebarTitle || ""} ${product.brand || ""} ${product.model || ""} ${product.category || ""} ${product.description || ""} ${(product.features || []).join(" ")}`.toLowerCase();
  }

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
    sidebar.innerHTML = `
      <button class="sinclair-side-link active" type="button" data-sidebar-id="">Të gjitha produktet <span>›</span></button>
      ${products.map((product) => `
        <button class="sinclair-side-link" type="button" data-sidebar-id="${product.id}">${product.sidebarTitle || productTitle(product)} <span>›</span></button>
      `).join("")}
    `;
    sidebar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-sidebar-id]");
      if (!button) return;
      activeId = button.dataset.sidebarId || "";
      sidebar.querySelectorAll(".sinclair-side-link").forEach((btn) => btn.classList.toggle("active", btn === button));
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

    grid.innerHTML = filtered.map(isSinclairLayout ? sinclairProductCard : legacyProductCard).join("");
    if (empty) empty.style.display = filtered.length ? "none" : "block";
    revealOnScroll();
  }

  [searchInput, categorySelect, sortSelect].filter(Boolean).forEach((control) => control.addEventListener("input", render));
  render();
}

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
    const body = encodeURIComponent(`Emri: ${name}\nTelefoni: ${phone}\nEmail: ${email}\nShërbimi: ${service}\n\nMesazhi:\n${message}`);
    window.location.href = `mailto:${COMPANY.email}?subject=${subject}&body=${body}`;
    if (notice) {
      notice.style.display = "block";
      notice.textContent = "Po hapet email-i juaj. Nëse nuk hapet automatikisht, na kontaktoni në WhatsApp ose telefon.";
    }
  });
}

setActiveNavigation();
initMobileNav();
fillCompanyDetails();
revealOnScroll();
initProductsPage();
initContactForm();
