# The Trend Seller

Live e-commerce brand for premium watches, belts, and wallets — built, deployed, and operated end-to-end by one developer. This isn't a demo storefront: real customers place real orders through this codebase every day.

🔗 **Live site:** [thetrendseller.com](https://www.thetrendseller.com)

## What it does

- **Catalog** across watches (with dedicated Premium, Casual, Stylish, and Women's collections), belts, and wallets, backed by MongoDB
- **Cart → checkout → fulfillment**, with three payment methods: Cash on Delivery, JazzCash, and NayaPay — the latter two collect a payment screenshot and go through manual admin verification before an order ships
- **Free delivery over Rs. 6,000**, flat Rs. 250 below that threshold, calculated server-side at checkout
- **Order notifications fan out automatically**: an admin email, a customer confirmation email, and a WhatsApp message to the store's official number — each best-effort, so a failure in one channel never blocks the order
- **JWT-secured admin dashboard** for order management and payment verification, gated by Next.js middleware
- **SEO built in**: dynamic per-page metadata, Open Graph tags, JSON-LD structured data for products, sitemap and robots.txt generation

## Tech stack

**Framework:** Next.js 13 (App Router) · **Database:** MongoDB + Mongoose · **Auth:** JWT (`jose`) via middleware · **Styling:** Tailwind CSS + Radix UI · **Animation:** Framer Motion · **Email:** Nodemailer (SMTP) · **WhatsApp:** Green API · **Language:** TypeScript / JavaScript

## Getting started

**Prerequisites:** Node 18+, a MongoDB URI, SMTP credentials for email, and (optionally) Green API credentials for WhatsApp notifications — checkout works fine without the last one, it just skips that notification.

```bash
git clone https://github.com/HeroCode007/The-Trend-Seller.git
cd The-Trend-Seller
npm install
```

Create `.env.local` with:

```
MONGODB_URI=
JWT_SECRET=
ADMIN_PASSWORD=
ADMIN_EMAIL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
GREEN_API_ID_INSTANCE=
GREEN_API_TOKEN_INSTANCE=
ORDER_NOTIFY_WHATSAPP=
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
├── api/                  # Route handlers — checkout, cart, orders, auth, admin
├── watches/              # Premium / Casual / Stylish collection pages
├── women-watches/
├── belts/
├── wallets/
├── cart/, checkout/      # Cart and checkout flow
├── payment-verification/ # Customer-facing payment screenshot upload
├── admin/                # JWT-gated order & payment management dashboard
├── about/, contact/, founder/
├── sitemap.js, robots.js # SEO
components/               # Header (with watch mega-menu), ProductCard, admin UI, ui/ primitives
lib/                      # db connection, email, whatsapp, product data, watch category registry
models/                   # Mongoose schemas — Order, Cart, Product
middleware.js             # JWT admin-route protection
```

## Available scripts

- `npm run dev` — start the development server
- `npm run build` / `npm run start` — production build and serve
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript type checking
- `npm run sync:products` / `npm run migrate:products` — catalog maintenance scripts

## License

Proprietary — this is the live source for an operating business, not licensed for reuse.
