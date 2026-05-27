# Email Signature Generator — default template

A clean, brand-agnostic email signature generator. Fork this folder for each
organization you want to ship one to. Drop in a few config values, tweak the
defaults, you're done.

## What's in the box
- Light pastel theme, visitor can pick brand color + background swatch from the UI
- Free profile photo hosting via [imgbb](https://api.imgbb.com/) (one free API key per fork — see below)
- All signature icons (mail, phone, link, location, LinkedIn, Facebook, Instagram) are rendered to PNG inside the page, in the chosen brand color — no icon hosting needed
- Single-file static site: `index.html`, `styles.css`, `script.js`. No build step.

## Per-fork config

Edit the top of `script.js`:

```js
const IMGBB_API_KEY = '';            // free key from https://api.imgbb.com/
const DEFAULT_BRAND = '#6FA88A';     // default brand color
const DEFAULT_PAGE_BG = '#E8F2EB';   // default page background
```

If `IMGBB_API_KEY` is left empty, photo uploads are embedded as base64 inside
the signature HTML itself. That works (Gmail accepts data URIs) but the
signature grows to ~30–80 KB instead of ~1 KB. For any public-facing fork,
grab the free key.

### How to get an imgbb key
1. Sign in at https://imgbb.com/
2. Visit https://api.imgbb.com/
3. Click "Get API key"
4. Paste it into `IMGBB_API_KEY` and ship.

Free tier: unlimited uploads, 32 MB max per image, no expiration.

## Other defaults you may want to tweak per fork
- **Form placeholders** (`index.html`): `yourname@gmail.com`, `+1 555 123 4567`, etc. — generic by default.
- **Background swatches** (`index.html`, search for `bg-swatches`): six pastels by default. Swap hexes or add/remove buttons.
- **Gmail "how to" copy** (`script.js`, `gmailSteps` array): replace with your own client (Outlook etc.) if needed.

## Run locally
```
python -m http.server 8000
```
Then open http://localhost:8000/

## Notes
- Photo uploads use the cropper in-page, then send a 200×200 PNG to imgbb (or embed as base64 if no key).
- Signature is copied as rich HTML via the Clipboard API. Pasting straight into Gmail / Outlook web preserves layout.
- Icons are colored at runtime: changing the brand color regenerates all PNG icons and re-renders the preview.
