# Credible Technologies Apps – Website

Website for [Credible Technologies Apps](https://play.google.com/store/apps/developer?id=Credible+Technologies+Apps) on Google Play. Design inspired by [Mave Health](https://www.mavehealth.com/).

## Hosting on GitHub Pages

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Source**: choose **Deploy from a branch**.
3. Branch: **main** (or **master**), folder: **/ (root)**.
4. Save. The site will be at `https://<username>.github.io/<repo-name>/` (e.g. `https://username.github.io/website_credible/`).

If you use a **custom domain**, set it in the same Pages settings and put your domain in **CNAME** (or use the GitHub-provided one). Then `assetlinks.json` and redirects will work at that domain.

## Structure

- **`index.html`** – Landing page (hero, app grid, steps, CTA).
- **`/<app_slug>/`** – One page per app (e.g. `/offline-metro-map/`, `/pro-pdf/`, `/geopolitics/`). Each uses `js/app-detail.js` and `js/apps-data.js`.
- **`/a/?t=<token>`** – Redirect page for deep links. Token can be an app slug (redirects to Play Store) or custom token (extend logic in `a/index.html`).
- **`/a/<token>`** – Handled by `404.html`: redirects to `/a/?t=<token>`.
- **`/.well-known/assetlinks.json`** – For [Android App Links](https://developer.android.com/training/app-links). Replace `REPLACE_WITH_SHA256_FINGERPRINT` with your app’s SHA-256 cert fingerprint(s) for each package.

## Article / deep links

See **`web/ARTICLE_LINKS_README.md`** for:

- How `/a/<token>` and `/a/?t=<token>` work.
- Optional `/?t=<token>` on the main page.
- Android App Links and `assetlinks.json`.

## Local preview

From the project root:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Open `http://localhost:8000` (or `http://localhost:8000/website_credible/` if you mirror GitHub Pages path). App links and base path are adjusted for GitHub Pages when deployed.

## Apps included

Data is in **`js/apps-data.js`**. Current apps:

- Offline Metro Map Delhi & more  
- Pro PDF: No Internet Edit/Read  
- No Internet Compass App  
- StarFollow : Celebrity Monitor  
- Cat Directory, Guide, Pet App  
- Gali Cricket Scoring & Games  
- Dog Directory, Guide, Pets App  
- Wishing Status & Story App  
- World Famous 22 Card Game Free  
- Geopolitics & Conflict Monitor  

To add or edit apps, update `CREDIBLE_APPS` in `js/apps-data.js` and add an `index.html` under a new `/<slug>/` folder if needed.
