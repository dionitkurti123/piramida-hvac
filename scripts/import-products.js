#!/usr/bin/env node
/*
  Optional product synchronizer for GitHub Actions.

  Best use:
  1) Ask Sinclair/distributor for an official JSON, CSV, or API feed.
  2) Save the feed URL as a GitHub repository secret named SINCLAIR_PRODUCTS_URL.
  3) The workflow .github/workflows/sync-products.yml will run this script and update data/products.json.

  The website itself is static and reads data/products.json in the browser.
*/

const fs = require("fs/promises");
const path = require("path");

const OUT_FILE = path.join(process.cwd(), "data", "products.json");
const SOURCE_URL = process.env.SINCLAIR_PRODUCTS_URL;

function cleanText(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function slugify(value) {
  return cleanText(value, "product")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "product";
}

function normalizeProduct(item, index) {
  const brand = cleanText(item.brand || item.manufacturer || "Sinclair", "Sinclair");
  const model = cleanText(item.model || item.name || item.title || `Product ${index + 1}`);
  const category = cleanText(item.category || item.type || "Klima / AC");
  const featuresSource = item.features || item.highlights || item.properties || [];
  const features = Array.isArray(featuresSource)
    ? featuresSource.map((feature) => cleanText(feature)).filter(Boolean)
    : cleanText(featuresSource).split(/[;,|]/).map((feature) => cleanText(feature)).filter(Boolean);

  return {
    id: cleanText(item.id || item.sku || slugify(`${brand}-${model}`)),
    brand,
    model,
    category,
    capacity: cleanText(item.capacity || item.power || item.btu || item.kw || "Sipas modelit"),
    energyClass: cleanText(item.energyClass || item.energy || item.seer || "Sipas modelit"),
    refrigerant: cleanText(item.refrigerant || item.gas || "Sipas modelit"),
    description: cleanText(item.description || item.summary || "Produkt HVAC për shitje dhe montim profesional."),
    features: features.slice(0, 8),
    image: cleanText(item.image || item.imageUrl || item.photo || ""),
    productUrl: cleanText(item.productUrl || item.url || item.link || "https://www.sinclair-solutions.com/en/products/")
  };
}

async function loadCurrentProducts() {
  const raw = await fs.readFile(OUT_FILE, "utf8");
  return JSON.parse(raw);
}

async function fetchSourceProducts(url) {
  const response = await fetch(url, {
    headers: {
      "accept": "application/json,text/csv,text/plain;q=0.9,*/*;q=0.8",
      "user-agent": "PiramidaHVACProductSync/1.0"
    }
  });
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);

  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (contentType.includes("json") || text.trim().startsWith("[") || text.trim().startsWith("{")) {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.products)) return parsed.products;
    if (Array.isArray(parsed.items)) return parsed.items;
    throw new Error("JSON was loaded, but no product array was found. Expected array, products[], or items[].");
  }

  throw new Error("This starter script currently expects JSON. Convert CSV/XML to JSON or extend this parser.");
}

async function main() {
  let products;

  if (!SOURCE_URL) {
    console.log("SINCLAIR_PRODUCTS_URL is not set. Validating current data/products.json only.");
    products = await loadCurrentProducts();
  } else {
    console.log(`Loading products from official feed: ${SOURCE_URL}`);
    const sourceProducts = await fetchSourceProducts(SOURCE_URL);
    products = sourceProducts.map(normalizeProduct);
  }

  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("No products found. data/products.json was not changed.");
  }

  const normalized = products.map(normalizeProduct);
  normalized.sort((a, b) => `${a.category} ${a.brand} ${a.model}`.localeCompare(`${b.category} ${b.brand} ${b.model}`));
  await fs.writeFile(OUT_FILE, JSON.stringify(normalized, null, 2) + "\n", "utf8");
  console.log(`Saved ${normalized.length} products to data/products.json`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
