const COMPANY = {
  name: "Piramida HVAC",
  city: "Fushë Kosovë, Kosovë",
  phoneDisplay: "+383 48 559 888",
  phoneTel: "+38348559888",
  whatsapp: "38348559888",
  email: "info@piramida-hvac.com",
  address: "Nëna Terezë, Fushë Kosovë, Kosovë",
  mapUrl: "https://maps.app.goo.gl/Di5mHocnKfDJe8LY7",
  mapEmbed: "https://www.google.com/maps?q=Piramida%20HVAC%20Fush%C3%AB%20Kosov%C3%AB%20Kosovo&output=embed"
};

/* -----------------------------
   WHATSAPP FIX (IMPORTANT)
------------------------------ */
function getWhatsAppLink(message = "") {
  const phone = COMPANY.whatsapp.replace(/[^\d]/g, '');
  return `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

function openWhatsApp(message = "Përshëndetje, dua një ofertë për HVAC") {
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
    description: "Klima murale Sinclair për ftohje dhe ngrohje në shtëpi, banesa, zyra dhe lokale."
  },
  {
    id: "multi-variable-r32",
    title: "Seria MULTI VARIABLE R32",
    titleEn: "MULTI VARIABLE series R32",
    sidebarTitle: "Seria MULTI VARIABLE R32",
    image: "assets/products/multi-variable-r32.svg",
    productUrl: "https://www.sinclair-solutions.com/en/products/",
    description: "Zgjidhje multi-split me njësi të jashtme dhe disa njësi të brendshme."
  },
  {
    id: "commercial-sdv5",
    title: "Sistemi komercial SDV5",
    titleEn: "Commercial system SDV5",
    sidebarTitle: "Sistemi komercial SDV5",
    image: "assets/products/commercial-sdv5.svg",
    productUrl: "https://www.sinclair-solutions.com/en/products/",
    description: "Sisteme komerciale për objekte biznesi dhe hapësira më të mëdha."
  },
  {
    id: "commercial-sdv6",
    title: "Sistemi komercial SDV6",
    titleEn: "Commercial system SDV6",
    sidebarTitle: "Sistemi komercial SDV6",
    image: "assets/products/commercial-sdv6.svg",
    productUrl: "https://www.sinclair-solutions.com/en/products/",
    description: "Gjeneratë komerciale për ftohje dhe ngrohje me projektim profesional."
  },
  {
    id: "heat-pumps-r32",
    title: "Pompa termike R32",
    titleEn: "Heat Pumps R32",
    sidebarTitle: "Pompa termike R32",
    image: "assets/products/heat-pumps-r32.svg",
    productUrl: "https://www.sinclair-solutions.com/en/products/",
    description: "Pompa termike për ngrohje, ftohje dhe efikasitet energjetik."
  },
  {
    id: "heat-pumps-r290",
    title: "Pompa termike R290",
    titleEn: "Heat Pumps R290",
    sidebarTitle: "Pompa termike R290",
    image: "assets/products/heat-pumps-r290.svg",
    productUrl: "https://www.sinclair-solutions.com/en/products/",
    description: "Pompa termike për ngrohje dhe ftohje me teknologji të avancuar."
  }
];

/* -----------------------------
   GLOBAL CLICK HANDLERS (SAFE)
------------------------------ */

// Example usage in HTML:
// onclick="openWhatsApp('Hi, dua ofertë')"
window.openWhatsApp = openWhatsApp;
window.getWhatsAppLink = getWhatsAppLink;
window.COMPANY = COMPANY;
window.DEFAULT_PRODUCTS = DEFAULT_PRODUCTS;
