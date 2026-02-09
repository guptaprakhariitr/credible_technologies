# Article / Deep Links (Redirect Page)

This site supports redirect links for app deep linking (e.g. opening specific content in an Android app or sending users to the right app page).

## How it works

- **Same domain**: The redirect page is hosted at the same domain as your app’s `ArticleDeepLinkService.baseArticleLinkUrl` (e.g. `https://yourusername.github.io/website_credible` or your custom domain).

### Option 1: Path-based links (`/a/<token>`)

- Paths under `/a/` are handled so that **`/a/<token>`** redirects to the correct destination.
- On GitHub Pages there are no dynamic routes, so:
  - **`/a/?t=<token>`** is served by `a/index.html` (the redirect page).
  - **`/a/<token>`** (e.g. `/a/geopolitics`) returns 404; `404.html` detects this and redirects to **`/a/?t=<token>`**, which then runs the redirect logic.

So effectively:

- User opens: `https://your-domain/a/geopolitics`
- 404 page redirects to: `https://your-domain/a/?t=geopolitics`
- `a/index.html` reads `t=geopolitics` and redirects to the Geopolitics app on Play Store (or to the app if opened from a device with the app installed and App Links configured).

### Option 2: Query links (main page)

- You can also use the main page with a query: **`/?t=<token>`**.
- To support this, add a small script on the main `index.html` that checks `location.search` for `t=` and, if present, redirects to **`/a/?t=<token>`** (so one place handles all redirect logic).

Example: `https://your-domain/?t=geopolitics` → redirect to `/a/?t=geopolitics` → then same behavior as above.

## Token behavior

- If `t` matches an **app slug** (e.g. `geopolitics`, `pro-pdf`, `offline-metro-map`), the user is sent to that app’s Play Store page.
- You can extend the logic in `a/index.html` to map other tokens (e.g. article IDs) to in-app URLs or other destinations.

## Android App Links (optional)

To have HTTPS links open the app directly when it is installed (without showing the redirect page):

1. Host **`assetlinks.json`** at:
   ```text
   https://<your-domain>/.well-known/assetlinks.json
   ```
   For GitHub Pages, the file is in this repo at **`.well-known/assetlinks.json`**. Configure your repo so the site is published from the root (or ensure `/.well-known/assetlinks.json` is reachable at that URL).

2. In your Android app’s manifest, set the intent filter’s host to the same domain (e.g. `your-domain` or `yourusername.github.io` and path prefix `/a/` as needed).

After verification, Android will open the app for links like `https://<your-domain>/a/<token>` when the app is installed; otherwise the browser will load the redirect page.

## Summary

| URL pattern           | Served by     | Action                                      |
|-----------------------|---------------|---------------------------------------------|
| `/a/?t=<token>`       | `a/index.html`| Read token, redirect to app/Play Store/etc.  |
| `/a/<token>`          | 404 → redirect| Redirect to `/a/?t=<token>`                  |
| `/?t=<token>` (optional) | `index.html` | Can redirect to `/a/?t=<token>`             |

See `a/index.html` for the current token-to-destination mapping and to add new tokens or article IDs.
