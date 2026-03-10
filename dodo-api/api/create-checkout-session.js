/**
 * Vercel serverless: POST /api/create-checkout-session
 * Creates a Dodo Checkout Session and returns the checkout URL.
 * Keep DODO_API_KEY and DODO_PRODUCT_ID in Vercel Environment Variables (never in code).
 */

const DODO_TEST = 'https://test.dodopayments.com/checkouts';
const DODO_LIVE = 'https://live.dodopayments.com/checkouts';

function getEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = getEnv('DODO_API_KEY');
    const productId = getEnv('DODO_PRODUCT_ID');
    const siteBaseUrl = (getEnv('SITE_BASE_URL') || '').replace(/\/$/, '');
    const useLive = process.env.DODO_ENV === 'live';

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const amountCents = body.amountCents != null ? Number(body.amountCents) : null;
    const email = body.email && String(body.email).trim() || null;
    const name = body.name && String(body.name).trim() || null;

    if (amountCents != null && (amountCents < 0 || !Number.isInteger(amountCents))) {
      return res.status(400).json({ error: 'amountCents must be a non-negative integer' });
    }

    const productCart = [
      {
        product_id: productId,
        quantity: 1,
        ...(amountCents != null && amountCents >= 0 && { amount: amountCents }),
      },
    ];

    const payload = {
      product_cart: productCart,
      ...(email && { customer: { email, ...(name && { name }) } }),
      ...(siteBaseUrl && {
        return_url: `${siteBaseUrl}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      }),
    };

    const dodoUrl = useLive ? DODO_LIVE : DODO_TEST;
    const response = await fetch(dodoUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Dodo API error', response.status, data);
      return res.status(response.status >= 500 ? 502 : 400).json({
        error: data?.message || data?.error || 'Checkout session creation failed',
      });
    }

    const checkoutUrl = data.checkout_url || null;
    if (!checkoutUrl) {
      return res.status(502).json({ error: 'No checkout_url in response' });
    }

    return res.status(200).json({ checkout_url: checkoutUrl });
  } catch (e) {
    if (e.message && e.message.startsWith('Missing env:')) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
