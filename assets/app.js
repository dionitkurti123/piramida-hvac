const COMPANY = {
  name: "Piramida HVAC",
  city: "Fushë Kosovë, Kosovë",
  phoneDisplay: "+383 48 559 888",
  phoneTel: "+383 48 559 888",
  whatsapp: "+383 48 559 888",
  email: "info@piramida-hvac.com",
  address: "Nëna Terezë, Fushë Kosovë, Kosovë",
  mapUrl: "https://maps.app.goo.gl/Di5mHocnKfDJe8LY7",
  mapEmbed:
    "https://www.google.com/maps?q=Piramida%20HVAC%20Fush%C3%AB%20Kosov%C3%AB%20Kosovo&output=embed",
};

/* -----------------------------
   WHATSAPP FIX (GLOBAL)
------------------------------ */

function getWhatsAppLink(message = "") {
  const phone = COMPANY.whatsapp.replace(/[^\d]/g, "");
  return `https://wa.me/${phone}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
}

function openWhatsApp(
  message = "Përshëndetje, dua një ofertë për HVAC"
) {
  window.open(getWhatsAppLink(message), "_blank");
}

/* -----------------------------
   PRODUCTS
------------------------------ */

const DEFAULT_PRODUCTS = [
  {
    id: "wall-mounted-units",
    title: "Njësi murale",
    titleEn: "Wall mounted units",
    sidebarTitle: "Njësi murale",
    image: "assets/products/wall-mounted-units.svg",
    productUrl: "https://www.sinclair-solutions.com/en/products/",
    description:
      "Klima murale Sinclair për ftohje dhe ngrohje në shtëpi, banesa, zyra dhe lokale.",
  },
  {
    id: "multi-variable-r32",
    title: "Seria MULTI VARIABLE R32",
    titleEn: "MULTI VARIABLE series R32",
    sidebarTitle: "Seria MULTI VARIABLE R32",
    image: "assets/products/multi-variable-r32.svg",
    productUrl: "https://www.sinclair-solutions.com/en/products/",
    description:
      "Zgjidhje multi-split me njësi të jashtme dhe disa njësi të brendshme.",
  },
];

/* -----------------------------
   NAVIGATION
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

/* -----------------------------
   COMPANY FILL
------------------------------ */

function fillCompanyDetails() {
  document.querySelectorAll("[data-company-name]").forEach((el) => {
    el.textContent = COMPANY.name;
  });

  document.querySelectorAll("[data-company-city]").forEach((el) => {
    el.textContent = COMPANY.city;
  });

  document.querySelectorAll("[data-company-phone]").forEach((el) => {
    el.textContent = COMPANY.phoneDisplay;
    if (el.tagName.toLowerCase() === "a") {
      el.href = `tel:${COMPANY.phoneTel.replace(/\s/g, "")}`;
    }
  });

  document.querySelectorAll("[data-company-whatsapp]").forEach((el) => {
    const message = "Përshëndetje";
    el.href = getWhatsAppLink(message);
  });

  document.querySelectorAll("[data-company-email]").forEach((el) => {
    el.textContent = COMPANY.email;
    if (el.tagName.toLowerCase() === "a") {
      el.href = `mailto:${COMPANY.email}`;
    }
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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}

/* -----------------------------
   PRODUCTS HELPERS
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
  return (
    product.title ||
    [product.brand, product.model].filter(Boolean).join(" ") ||
    "Produkt"
  );
}

function productBlob(product) {
  return `
    ${product.title || ""}
    ${product.titleEn || ""}
    ${product.sidebarTitle || ""}
    ${product.brand || ""}
    ${product.model || ""}
    ${product.category || ""}
    ${product.description || ""}
    ${(product.features || []).join(" ")}
  `.toLowerCase();
}

/* -----------------------------
   PRODUCT CARDS
------------------------------ */

function catalogProductCard(product) {
  const title = productTitle(product);

  const image = product.image
    ? `<img src="${product.image}" alt="${title}" loading="lazy">`
    : `<div class="product-placeholder">${productIcon(
        product.category || product.title
      )}</div>`;

  const inquiryText = `Përshëndetje, jam i/e interesuar për: ${title}`;

  return `
    <article class="catalog-card reveal">
      <div class="catalog-card-image">
        ${image}
        <div class="catalog-card-overlay">
          <h3>${title}</h3>
          <p>${product.description || "Produkt HVAC profesional."}</p>
        </div>
      </div>

      <div class="catalog-card-body">
        <h3>${title}</h3>

        <div class="catalog-card-actions">
          <a class="catalog-card-btn catalog-card-btn-red"
             href="${getWhatsAppLink(inquiryText)}"
             target="_blank"
             rel="noopener">
            Kërko ofertë
          </a>
        </div>
      </div>
    </article>
  `;
}

function legacyProductCard(product) {
  const title = productTitle(product);

  const imageHtml = product.image
    ? `<img src="${product.image}" alt="${title}" loading="lazy">`
    : `<div class="product-placeholder">${productIcon(product.category)}</div>`;

  const features = (product.features || [])
    .slice(0, 4)
    .map((f) => `<li>${f}</li>`)
    .join("");

  const inquiryText = `Përshëndetje, jam i/e interesuar për: ${title}`;

  return `
    <article class="card product-card reveal">
      <div class="product-media">${imageHtml}</div>

      <div class="product-body">
        <h3>${title}</h3>
        <p>${product.description || "Produkt HVAC profesional."}</p>

        <ul class="product-features">${features}</ul>

        <div class="product-actions">
          <a class="btn btn-primary"
             href="${getWhatsAppLink(inquiryText)}"
             target="_blank"
             rel="noopener">
            Kërko ofertë
          </a>
        </div>
      </div>
    </article>
  `;
}

/* -----------------------------
   INIT
------------------------------ */

setActiveNavigation();
initMobileNav();
fillCompanyDetails();
revealOnScroll();
