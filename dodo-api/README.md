# Dodo Checkout API (serverless)

Backend for creating [Dodo Payments](https://docs.dodopayments.com) checkout sessions. Deploy **for free** to [Vercel](https://vercel.com); API keys stay in environment variables (never in code).

## What it does

- **POST** `/api/create-checkout-session`
- Body: `{ "amountCents": 999, "email": "optional@example.com", "name": "Optional Name" }`
- Response: `{ "checkout_url": "https://..." }` — redirect the user here to pay.
- Sets `return_url` so after payment the user is sent back to your site (success or cancel).

## Deploy to Vercel (free)

### 1. Push this folder to GitHub

Either:

- **Option A – Same repo:** Use this repo and in Vercel set **Root Directory** to `dodo-api`, or  
- **Option B – New repo:** Create a new repo, copy the contents of `dodo-api/` into it (including `api/`, `package.json`, `vercel.json`, `README.md`), and push.

### 2. Import on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New** → **Project** → import the repo (or same repo with root dir `dodo-api`).
3. Do **not** add a build command; leave defaults and deploy.

### 3. Set environment variables

In the project: **Settings → Environment Variables**. Add:

| Name             | Value                    | Notes                                      |
|------------------|---------------------------|--------------------------------------------|
| `DODO_API_KEY`   | Your Dodo API key         | From Dodo Dashboard → Developer → API      |
| `DODO_PRODUCT_ID` | Your product ID (e.g. `prod_xxx`) | Create a product in Dodo (use “pay what you want” if you pass `amountCents`) |
| `SITE_BASE_URL`  | `https://www.credibletechnologies.in` | No trailing slash; used for `return_url` |
| `DODO_ENV`       | `test` or `live`          | `test` = test.dodopayments.com, `live` = live |

Redeploy after changing env vars.

### 4. Your API base URL

After deploy you’ll get a URL like:

`https://your-project.vercel.app`

So the endpoint is:

**POST** `https://your-project.vercel.app/api/create-checkout-session`

Use this as `dodoCheckoutBaseUrl` in your app (no trailing slash):  
`dodoCheckoutBaseUrl = 'https://your-project.vercel.app'`

## App config (Flutter)

In `lib/utilities/app_config.dart`:

```dart
static const String dodoCheckoutBaseUrl = 'https://your-project.vercel.app';  // no trailing slash
```

The app should:

1. POST to `$dodoCheckoutBaseUrl/api/create-checkout-session` with `amountCents` (and optional `email` / `name`).
2. Use the returned `checkout_url` to open the browser (or in-app WebView) for payment.
3. Handle the redirect when the user returns (e.g. to `SITE_BASE_URL/checkout/return?session_id=...`); you can add a simple success/cancel page or deep link back into the app.

## Redirects and webhooks

- **Redirect:** `return_url` is set to `{SITE_BASE_URL}/checkout/return?session_id={CHECKOUT_SESSION_ID}`. You can add a page or route at `/checkout/return` on your site (or in the app) to show “Payment complete” or “Payment cancelled” and then close the browser or navigate back.
- **Webhooks (optional):** For confirmed payments, configure a webhook in the Dodo Dashboard to call a URL you control (e.g. another serverless function that verifies the event and updates your backend). This API only creates the session; it does not handle webhooks.

## Security

- **API key:** Stored only in Vercel Environment Variables, not in code or Git. Only the serverless function sees it.
- **HTTPS:** Vercel serves the API over HTTPS.
- **CORS:** If your app runs in a browser, you may need to allow your app’s origin in Vercel (e.g. in `vercel.json` headers or a CORS middleware). For a mobile app opening the checkout in a browser, no CORS change is needed for the redirect flow.

## Cost

- Vercel hobby (free) tier is enough for this single serverless function.
- Dodo pricing is per their docs; this backend only creates sessions and does not store card data.
