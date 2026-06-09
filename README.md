# Prime Origins Atlas

A verified carbon-credit marketplace built with Next.js 14, Tailwind, and Stripe Checkout. Same stack and deploy flow as GenoVaq — push to GitHub, import to Vercel, set environment variables, done.

## What's inside

- **Homepage** — hero, featured listings, quality pillars, CTA
- **Browse** — filter by category, registry, vintage, price; sort by price/vintage/volume
- **Listing detail** — full project info, registry fields, co-benefits, SDGs, retirement support
- **Buy panel + Stripe Checkout** — calculates 4% platform fee, redirects to Stripe, success page
- **Seller application** (`/sell`) — form for project developers, submissions logged + optional webhook
- **About / How it works / FAQ** — trust pages
- **5 registries supported**: Verra, Gold Standard, ACR, Puro.earth, Climate Action Reserve
- **12 seed listings** spanning nature-based, engineered removals, renewables, community

## Local development

```bash
npm install
cp .env.example .env.local
# edit .env.local with your Stripe test keys (https://dashboard.stripe.com/test/apikeys)
npm run dev
```

Open <http://localhost:3000>.

## Environment variables

| Key | Required | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | yes | `sk_test_…` for testing, `sk_live_…` for production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | optional | only if you add client-side Stripe Elements later |
| `NEXT_PUBLIC_SITE_URL` | yes in prod | e.g. `https://atlas.primeorigins.org` — used for Stripe redirect URLs |
| `BLOB_READ_WRITE_TOKEN` | yes for uploads | Set automatically when you connect a Vercel Blob store to the project (Vercel → Storage → Create → Blob). Required for sellers to upload verification documents. |
| `RESEND_API_KEY` | yes for email | Sign up at [resend.com](https://resend.com) → API Keys → Create. Powers inquiry + seller application emails to ADMIN_EMAIL. |
| `EMAIL_FROM` | optional | Custom sender address. Defaults to Resend's `onboarding@resend.dev`. Set once you've verified `primeorigins.org` in Resend. |
| `ADMIN_EMAIL` | yes for email | Where inquiry + seller emails are delivered. Defaults to `oliver@primeorigins.org`. |
| `SELLER_WEBHOOK_URL` | optional | If set, seller applications are also forwarded as JSON (use Zapier, Make, or Slack incoming webhooks) |
| `INQUIRY_WEBHOOK_URL` | optional | Same as above but for buyer inquiries |

### Enabling email (Resend)

1. Sign up at [resend.com](https://resend.com) — free tier covers 100 emails/day
2. **API Keys → Create API Key** → name it `Atlas Production` → copy the `re_…` key
3. Add it to Vercel: project → **Settings → Environment Variables** → `RESEND_API_KEY` = the key → save → redeploy
4. Inquiries from the "Talk to us" form and seller applications from `/sell` will now land in `oliver@primeorigins.org`
5. (Optional, recommended for production) Verify `primeorigins.org` in Resend → **Domains** → add the DNS records to IONOS → set `EMAIL_FROM` to a custom address like `Atlas <noreply@primeorigins.org>`

### Enabling seller document uploads (Vercel Blob)

1. In your Vercel project → **Storage** tab → **Create Database** → choose **Blob**
2. Name it `atlas-blob` (or whatever) → Create
3. Vercel will automatically connect it to your project and add `BLOB_READ_WRITE_TOKEN` as an environment variable
4. Redeploy. Uploaded files now go to Vercel Blob and the URLs are stored with the submission

## Deploy to Vercel (same flow as GenoVaq)

1. **Push to GitHub.** Create a new empty repo on GitHub called `prime-origins-atlas` (don't initialise with README). Then from this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Prime Origins Atlas"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/prime-origins-atlas.git
   git push -u origin main
   ```
2. **Import to Vercel.** Go to <https://vercel.com/new> → Import this repo → Vercel auto-detects Next.js → click **Deploy**.
3. **Add env vars.** In the Vercel project: **Settings → Environment Variables**. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL` (your `*.vercel.app` URL or custom domain). Redeploy.
4. **Connect custom domain (optional).** Vercel project → **Settings → Domains** → add `atlas.primeorigins.org` (or similar) → follow DNS instructions.

Every commit you push to `main` will auto-deploy. Branches get preview URLs.

## Editing content

| What | Where |
|---|---|
| Listings (the catalog) | `lib/listings.ts` — add/edit entries in the `listings` array |
| Brand colours | `tailwind.config.ts` — change `forest` and `sand` palettes |
| Homepage copy | `app/page.tsx` |
| FAQ entries | `app/faq/page.tsx` |
| Platform fee % | `components/BuyPanel.tsx` and `app/api/checkout/route.ts` (search "0.04") |
| Header/footer links | `components/Header.tsx`, `components/Footer.tsx` |

After editing locally, `git add . && git commit -m "…" && git push` — Vercel redeploys automatically.

## Roadmap to fuller marketplace

The MVP is intentionally lean. Recommended next steps when you're ready:

1. **Database for seller submissions** — Vercel Postgres or Supabase (currently logs to server console + optional webhook)
2. **Buyer accounts + order history** — NextAuth + Stripe customer portal
3. **Seller payouts** — Stripe Connect (so payments split automatically to project developers)
4. **Stripe webhook** — `/api/webhooks/stripe` to mark orders paid in DB and trigger retirement workflow
5. **Email confirmations** — Resend or Postmark for buyer receipts + seller submission acknowledgements
6. **Search index** — for >100 listings, swap the in-memory filter for Algolia or Postgres full-text

## File structure

```
app/
  api/
    checkout/route.ts        # Stripe Checkout session
    sell/route.ts            # Seller submissions
  browse/page.tsx            # Filterable catalog
  listings/[slug]/page.tsx   # Listing detail
  sell/page.tsx              # Seller application
  checkout/success/page.tsx
  about/, how-it-works/, faq/
  layout.tsx, page.tsx, globals.css
components/
  Header.tsx, Footer.tsx
  ListingCard.tsx
  BuyPanel.tsx               # Client component, Stripe redirect
lib/
  types.ts                   # Listing/Registry/Category types
  listings.ts                # Seed data + helpers
```

## License

Proprietary © Prime Origins.
