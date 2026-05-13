# Piramida HVAC Website

Static website for **Piramida HVAC** in Fushë Kosovë, built for GitHub Pages.

## Pages

- `index.html` — home page
- `about.html` — about us
- `products.html` — product catalog loaded from JSON
- `contact.html` — contact form using `mailto:`
- `data/products.json` — product data
- `assets/app.js` — company settings + product rendering
- `assets/style.css` — all styling
- `.github/workflows/sync-products.yml` — optional product sync workflow

## Edit company details

Open `assets/app.js` and change:

```js
const COMPANY = {
  phoneDisplay: "+383 4X XXX XXX",
  phoneTel: "+3834XXXXXXX",
  whatsapp: "3834XXXXXXX",
  email: "info@piramidahvac.com",
  address: "Fushë Kosovë, Kosovë"
};
```

## Edit products manually

Open `data/products.json` and add/edit products. The product page will update automatically.

Example product:

```json
{
  "id": "sinclair-example",
  "brand": "Sinclair",
  "model": "Example Model",
  "category": "Klima / AC",
  "capacity": "12000 BTU",
  "energyClass": "A++",
  "refrigerant": "R32",
  "description": "Short product description.",
  "features": ["Inverter", "Heating and cooling", "Wi‑Fi optional"],
  "image": "assets/products/example.png",
  "productUrl": "https://example.com/product"
}
```

## Automatic Sinclair product updates

GitHub Pages cannot run backend code. The best static solution is:

1. Get an official Sinclair/distributor JSON feed URL.
2. In GitHub, go to **Settings → Secrets and variables → Actions → New repository secret**.
3. Add a secret named `SINCLAIR_PRODUCTS_URL`.
4. Go to **Actions → Sync Sinclair products → Run workflow**.

The workflow runs every Monday and updates `data/products.json`.

If the supplier gives CSV/XML instead of JSON, extend `scripts/import-products.js` to parse that format.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. Go to **Settings → Pages**.
4. Source: **Deploy from a branch**.
5. Branch: **main**, folder: **/** root.
6. Save.

Your website will be online after GitHub finishes the Pages deployment.

## Local preview

Run:

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```
