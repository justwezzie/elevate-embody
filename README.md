## Getting Started

Run the local dev server:

```bash
npm run dev
```

## Netlify Deployment

This project is configured for Netlify with [`@netlify/plugin-nextjs`](https://www.netlify.com/platform/core/nextjs/) via [netlify.toml](/Users/wezziembale/LisasYoga/netlify.toml).

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
RESEND_API_KEY=...
```

Recommended:

```env
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

Notes:

- If `NEXT_PUBLIC_APP_URL` is not set, the app falls back to Netlify-provided URL env vars like `URL`, `DEPLOY_PRIME_URL`, and `DEPLOY_URL`.
- Stripe webhook endpoint should be:
  `https://your-site.netlify.app/api/webhooks/stripe`
- Stripe checkout, refunds, and webhook handlers are pinned to the Node runtime for Netlify compatibility.
