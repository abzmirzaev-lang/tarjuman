# TARJUMAN — Deployment Guide

## Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account
- A [SendGrid](https://sendgrid.com) account (or any SMTP)
- A Telegram bot (create via @BotFather)
- A [Vercel](https://vercel.com) account

---

## Step 1 — Clone & Install

```bash
git clone https://github.com/your-org/tarjuman
cd tarjuman
npm install
cp .env.example .env.local
```

---

## Step 2 — Supabase Setup

### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **Anon Key** (Settings → API)
3. Note your **Service Role Key** (Settings → API → service_role — keep secret!)

### 2.2 Run Migration
In Supabase Dashboard → SQL Editor, paste and run the full contents of:
```
supabase/migrations/001_initial_schema.sql
```
This creates all tables, RLS policies, triggers, and seeds university data.

### 2.3 Create Storage Buckets
In Supabase Dashboard → Storage → New Bucket:
- **documents** — Private (no public access)
- **avatars** — Public

Add Storage RLS policies (from the comments at the bottom of the SQL migration file).

### 2.4 Enable Google OAuth
1. Supabase Dashboard → Authentication → Providers → Google
2. Enable Google, enter your Google Client ID & Secret
3. Add redirect URL: `https://your-domain.com/auth/callback`

### 2.5 Get Google OAuth Credentials
1. [console.cloud.google.com](https://console.cloud.google.com) → Create Project
2. APIs & Services → Credentials → OAuth 2.0 Client ID
3. Authorized redirect URIs: `https://[your-project].supabase.co/auth/v1/callback`

---

## Step 3 — Stripe Setup

### 3.1 Create Products & Prices
In Stripe Dashboard → Products → Add Product, create 3:

| Product | Price | ID goes in env |
|---------|-------|----------------|
| Submission Only | $29 one-time | NEXT_PUBLIC_STRIPE_PRICE_BASIC |
| Standard        | $69 one-time | NEXT_PUBLIC_STRIPE_PRICE_STANDARD |
| VIP Fast Track  | $99 one-time | NEXT_PUBLIC_STRIPE_PRICE_VIP |

### 3.2 Webhook
1. Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://your-domain.com/api/payments/webhook`
3. Events to listen: `checkout.session.completed`, `payment_intent.payment_failed`
4. Copy the **Signing Secret** → `STRIPE_WEBHOOK_SECRET`

### 3.3 Enable Apple Pay
Stripe Dashboard → Settings → Payment Methods → Apple Pay → Enable
Register your domain for Apple Pay domain verification.

---

## Step 4 — SendGrid Setup

1. [sendgrid.com](https://sendgrid.com) → Create API Key (Full Access)
2. Add sender authentication for your domain
3. Verify sender email in Settings → Sender Authentication

---

## Step 5 — Telegram Bot

1. Message @BotFather on Telegram: `/newbot`
2. Follow prompts, get **BOT_TOKEN**
3. Create an admin channel/group, add your bot as admin
4. Get the chat ID: message the bot, then visit:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. For user DMs: users must start your bot first (`/start`)

---

## Step 6 — CIS Payments (UzCard/Humo)

Options for Uzbekistan card payments:
- **Payme** → [payme.uz](https://payme.uz) — most popular in UZ
- **Click** → [click.uz](https://click.uz)
- **Stripe** with local card acquiring (coming soon for UZ)

Plug your provider credentials into `.env.local`:
```env
CIS_PAYMENT_MERCHANT_ID=your-merchant-id
CIS_PAYMENT_SECRET_KEY=your-secret
CIS_PAYMENT_API_URL=https://checkout.paycom.uz
```

The `src/lib/cis-payment.ts` adapter is ready for implementation.

---

## Step 7 — Environment Variables

Fill in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_BASIC=price_...
NEXT_PUBLIC_STRIPE_PRICE_STANDARD=price_...
NEXT_PUBLIC_STRIPE_PRICE_VIP=price_...

SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=info@tarjuman.com
SENDGRID_FROM_NAME=TARJUMAN

TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_ADMIN_CHAT_ID=-100123456789

NEXT_PUBLIC_APP_URL=https://tarjuman.com
ADMIN_SECRET_KEY=super-secret-internal-key-change-this
```

---

## Step 8 — Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

Or connect GitHub repo in Vercel Dashboard → New Project.

In Vercel Project Settings → Environment Variables, add all variables from `.env.local`.

### Vercel Build Settings
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

### Add Custom Domain
Vercel Dashboard → Domains → Add `tarjuman.com`
Update DNS at your registrar to point to Vercel.

---

## Step 9 — Post-Deployment

### Make yourself admin
In Supabase SQL Editor:
```sql
UPDATE public.users SET is_admin = TRUE WHERE email = 'your@email.com';
```

### Test the full flow
1. Visit `/` → sign in with Google
2. Click "Apply" → fill form → upload docs → choose package
3. Pay with Stripe test card: `4242 4242 4242 4242`
4. Check dashboard — status should update to PAID
5. Login to `/admin` — you should see the application

### Stripe CLI for local webhook testing
```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

---

## Project Structure

```
tarjuman/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── about/page.tsx
│   │   ├── universities/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── apply/page.tsx        # Multi-step form
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx    # User dashboard
│   │   ├── admin/page.tsx        # Admin panel
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── auth/callback/route.ts
│   │   └── api/
│   │       ├── payments/
│   │       │   ├── create-checkout/route.ts
│   │       │   └── webhook/route.ts
│   │       └── notifications/
│   │           ├── payment-success/route.ts
│   │           └── status-change/route.ts
│   ├── components/
│   │   ├── ui/          # Button, Badge, Input, Modal
│   │   └── layout/      # Navbar, Footer
│   ├── lib/
│   │   ├── supabase/    # client, server, admin
│   │   ├── email.ts     # SendGrid
│   │   ├── telegram.ts  # Telegram bot
│   │   └── utils.ts
│   ├── i18n/            # ru, uz, en translations
│   ├── types/           # TypeScript types + constants
│   ├── middleware.ts    # Auth protection
│   └── styles/globals.css
├── supabase/
│   └── migrations/001_initial_schema.sql
├── .env.example
├── package.json
├── tailwind.config.ts
└── DEPLOYMENT.md
```

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TailwindCSS, Framer Motion |
| Backend | Next.js API Routes (serverless) |
| Database | Supabase (PostgreSQL) with RLS |
| Auth | Supabase Auth + Google OAuth |
| Storage | Supabase Storage |
| Payments | Stripe (global) + CIS adapter |
| Email | SendGrid |
| Notifications | Telegram Bot API |
| Deployment | Vercel |
| i18n | Russian / Uzbek / English |

---

## Support & Maintenance

- Monitor errors: Vercel Dashboard → Functions → Logs
- Monitor payments: Stripe Dashboard → Events
- Monitor DB: Supabase Dashboard → Logs
- Set up Sentry for production error tracking (recommended)
