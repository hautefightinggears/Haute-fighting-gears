# Haute Fighting Gears

Custom combat sports equipment manufacturer based in Sialkot, Pakistan. OEM, ODM, and private label boxing gloves, MMA gear, Muay Thai equipment, and fight gear.

**Live site:** [hautefightinggears.com](https://www.hautefightinggears.com)

---

## Stack

- Pure HTML / CSS (Tailwind CDN) / Vanilla JS
- No build step, no dependencies, no Node.js required
- Static site — deployable to any static host (GitHub Pages, Netlify, Cloudflare Pages)

## Structure

```
/
├── index.html              # Home page
├── about/                  # About page
├── contact/                # Contact page
├── inquiry/                # Manufacturing inquiry / bulk order form
├── product/                # Single product page (query-param routing: ?id=)
├── products/               # Product catalogue
├── privacy-policy/
├── shipping/
├── terms/
├── 404.html
├── assets/
│   ├── images/             # Site images (logo, hero thumbs)
│   ├── js/
│   │   └── app.js          # All JS merged: mobile-fixes + main + products-engine + animations
│   └── products/           # Product images (folders 1–11)
└── assets2/
    └── products/           # Product images (folders 12–22, split for file-count balance)
```

## Local Development

No install needed. Just open with any static server:

```bash
# VS Code Live Server (recommended)
# or
npx serve .
# or
python -m http.server 8000
```

> **Note:** Do not open via `file://` — product images and JSON fetch require a local server.

## Deployment

### GitHub Pages

Push to the `main` branch. GitHub Actions (`.github/workflows/deploy.yml`) automatically deploys to GitHub Pages.

Set the Pages source to **GitHub Actions** in your repo settings.

### Netlify / Cloudflare Pages

Connect repo → set build command to **none** → set publish directory to **`.`** (root).

## Forms

- Contact and inquiry forms post to Google Apps Script endpoints defined in `assets/js/app.js`
- Newsletter subscribes to the same endpoint with `type: newsletter`
- No server-side code required

## Product Data

All product data lives in two places (kept in sync):

1. `_INLINE_PRODUCT_DATA` constant inside `assets/js/app.js` — used as fallback
2. Previously also in `products/products.json` — now inlined, no separate file needed

To add or edit products, update the `_INLINE_PRODUCT_DATA` object in `app.js`.

## TikTok Feed

TikTok video data is inlined in `index.html` inside the `getPosts()` function. To refresh videos, run the fetch script locally and paste the output JSON back in.

---

Made with ❤️ in Sialkot, Pakistan.
