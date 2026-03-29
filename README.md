# Tshitasini Enviro Solutions

A full-stack e-commerce web application built for **Tshitasini Enviro Solutions**, a proudly South African supplier of certified Personal Protective Equipment (PPE) and medical safety products. The platform enables customers to browse and purchase PPE products online, while providing the business owner with a full admin dashboard to manage products and orders.

---

## 🌐 Live Demo

[tshitasini.vercel.app](https://tshitasini.vercel.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Authentication Setup](#-authentication-setup)
- [Payment Setup](#-payment-setup)
- [Image Upload Setup](#-image-upload-setup)
- [Deployment](#-deployment)
- [Development Phases](#-development-phases)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## ✨ Features

### Customer-Facing Store
- 🛍️ **Product Catalogue** — Browse all PPE products with category filters, price sorting, and keyword search
- 🎠 **Hero Carousel** — Auto-playing banner showcasing featured product categories
- 🛒 **Shopping Cart** — Persistent cart state across sessions via Zustand + localStorage
- 💳 **Guest Checkout** — No account required — customers fill in contact and shipping details
- 💰 **Dual Payment** — Pay via Stripe (card) or PayPal
- 📦 **Order Confirmation** — Detailed success page with order reference and shipping summary
- 🌙 **Dark Mode** — Full light/dark/system theme support
- 📱 **Fully Responsive** — Mobile-first design across all pages

### Admin Dashboard
- 🔐 **Secure Authentication** — Admin-only login via WorkOS AuthKit
- 📊 **Overview Stats** — Total products, orders, revenue, and active listings at a glance
- 📦 **Product Management** — Create, edit, delete, and toggle product visibility
- 🖼️ **Image Uploads** — Drag-and-drop product image uploader via Vercel Blob (up to 5 images)
- 🧾 **Order Management** — View all orders, filter by status, and update order status
- 🔒 **Route Protection** — All `/dashboard` routes protected by WorkOS middleware

### Pages
| Page | Route |
|---|---|
| Homepage | `/` |
| Products Catalogue | `/products` |
| Product Detail | `/products/[slug]` |
| About Us | `/about` |
| Contact | `/contact` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Order Confirmation | `/checkout/success` |
| Admin Dashboard | `/dashboard` |
| Admin Products | `/dashboard/products` |
| Admin Orders | `/dashboard/orders` |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **UI Library** | shadcn/ui + Tailwind CSS v4 |
| **Database** | PostgreSQL (Neon — serverless) |
| **ORM** | Prisma v7 |
| **Authentication** | WorkOS AuthKit |
| **Payments** | Stripe + PayPal |
| **Image Storage** | Vercel Blob |
| **Cart State** | Zustand (persisted to localStorage) |
| **Form Validation** | React Hook Form + Zod |
| **Carousel** | Embla Carousel (via shadcn) |
| **Notifications** | Sonner |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
tshitasini/
├── app/
│   ├── (store)/                    # Customer-facing store
│   │   ├── layout.tsx              # Store layout with Navbar + Footer
│   │   ├── products/
│   │   │   ├── page.tsx            # Product catalogue
│   │   │   └── [slug]/page.tsx     # Product detail
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── cart/page.tsx
│   │   └── checkout/
│   │       ├── page.tsx
│   │       └── success/page.tsx
│   ├── (admin)/
│   │   └── dashboard/              # Protected admin area
│   │       ├── layout.tsx
│   │       ├── page.tsx            # Dashboard overview
│   │       ├── products/           # Product management
│   │       └── orders/             # Order management
│   ├── api/
│   │   ├── products/               # Product CRUD API
│   │   ├── orders/                 # Order management API
│   │   ├── upload/                 # Vercel Blob upload API
│   │   ├── contact/                # Contact form API
│   │   ├── payments/
│   │   │   ├── stripe/             # Stripe checkout + webhook
│   │   │   └── paypal/             # PayPal create + capture
│   │   └── auth/callback/          # WorkOS auth callback
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   ├── not-found.tsx               # Custom 404
│   └── global-error.tsx            # Global error boundary
├── components/
│   ├── store/                      # Store UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroCarousel.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductImageGallery.tsx
│   │   ├── AddToCart.tsx
│   │   ├── CheckoutForm.tsx
│   │   ├── ContactForm.tsx
│   │   ├── PayPalProvider.tsx
│   │   └── ClearCart.tsx
│   ├── admin/                      # Admin UI components
│   │   ├── Sidebar.tsx
│   │   ├── SidebarMobile.tsx
│   │   ├── SidebarNav.tsx
│   │   ├── TopHeader.tsx
│   │   ├── StatCard.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductsTable.tsx
│   │   ├── OrdersTable.tsx
│   │   ├── RecentOrdersTable.tsx
│   │   ├── OrderStatusUpdater.tsx
│   │   └── ImageUploader.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── stripe.ts                   # Stripe client
│   ├── paypal.ts                   # PayPal REST helpers
│   ├── workos.ts                   # WorkOS client
│   ├── rateLimit.ts                # IP-based rate limiter
│   └── store/
│       └── cartStore.ts            # Zustand cart store
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # Database seeder
├── middleware.ts                   # WorkOS route protection
└── next.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or a [Neon](https://neon.tech) account)
- [WorkOS](https://workos.com) account
- [Stripe](https://stripe.com) account
- [PayPal Developer](https://developer.paypal.com) account
- [Vercel](https://vercel.com) account (for Blob storage)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tshitasini.git
cd tshitasini

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

Fill in all values in `.env.local` — see [Environment Variables](#-environment-variables).

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample products
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root of the project:

```env
# ── Database ──────────────────────────────
DATABASE_URL=

# ── WorkOS AuthKit ────────────────────────
WORKOS_CLIENT_ID=
WORKOS_API_KEY=
WORKOS_COOKIE_PASSWORD=        # Min 32 random characters
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback

# ── Stripe ────────────────────────────────
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# ── PayPal ────────────────────────────────
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=

# ── Vercel Blob ───────────────────────────
BLOB_READ_WRITE_TOKEN=

# ── App ───────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a secure cookie password:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🗄 Database Setup

This project uses **PostgreSQL** via **Prisma v7**.

### Schema Overview

| Model | Description |
|---|---|
| `Product` | PPE products with name, slug, price, stock, images, category |
| `Order` | Customer orders with status, payment method, total |
| `OrderItem` | Individual line items per order (price snapshot) |
| `ShippingAddress` | Delivery details per order |

> **Note:** There is no `AdminUser` model — admin identity is managed entirely by WorkOS.

### Commands

```bash
# Run migrations
npx prisma migrate dev

# Generate client after schema changes
npx prisma generate

# Seed sample products
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

---

## 🔑 Authentication Setup

Authentication is handled by **WorkOS AuthKit** — admin only, no customer login required.

1. Create a [WorkOS](https://workos.com) account
2. Create a new application → enable **AuthKit**
3. Add Redirect URI: `http://localhost:3000/callback`
4. Create your admin user in the WorkOS **Users** dashboard
5. Copy `Client ID` and `API Key` → paste into `.env.local`

Visiting `/dashboard` will automatically redirect unauthenticated users to the WorkOS hosted login page.

---

## 💳 Payment Setup

### Stripe

1. Create a [Stripe](https://stripe.com) account
2. Copy your **test** publishable and secret keys → `.env.local`
3. For local webhook testing, install the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/payments/stripe/webhook
```
4. Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### PayPal

1. Go to [PayPal Developer](https://developer.paypal.com) → Create App
2. Use **Sandbox** credentials for development
3. Copy Client ID and Secret → `.env.local`

---

## 🖼 Image Upload Setup

Product images are stored on **Vercel Blob**.

```bash
# Install Vercel CLI
npm install -g vercel

# Link your project
vercel link

# Pull environment variables including BLOB_READ_WRITE_TOKEN
vercel env pull .env.local
```

Or create a Blob store manually in your Vercel dashboard under **Storage → Create → Blob**, then copy the token.

---

## 🚢 Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git add .
git commit -m "initial commit"
git push origin main
```

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
2. Add all environment variables in **Project Settings → Environment Variables**
3. Update the following for production:
   - `NEXT_PUBLIC_APP_URL` → your Vercel domain
   - `NEXT_PUBLIC_WORKOS_REDIRECT_URI` → `https://yourdomain.vercel.app/callback`
   - Switch Stripe to **live** keys and register the production webhook
   - Switch PayPal to **live** credentials

### Post-deploy checklist

```
✅ Homepage loads with products
✅ Product catalogue filters work
✅ Product detail page loads
✅ Add to cart works
✅ Checkout form validates
✅ Stripe payment completes
✅ PayPal payment completes
✅ Order confirmation page renders
✅ /dashboard redirects to WorkOS login
✅ Admin can sign in and view dashboard
✅ Product CRUD works
✅ Image upload works
✅ Order status update works
```

---

## 📐 Development Phases

The project was built in 10 structured phases:

| Phase | Description |
|---|---|
| 1 | Project scaffolding, folder structure, environment setup |
| 2 | PostgreSQL schema, Prisma migrations, database seeding |
| 3 | Store layout, Navbar, Footer, Homepage, About, Contact |
| 4 | Product catalogue, filters, product detail, cart store |
| 5 | Cart page, guest checkout, Stripe + PayPal integration |
| 6 | WorkOS AuthKit admin authentication |
| 7 | Admin dashboard — products and orders management |
| 8 | Product image uploads via Vercel Blob |
| 9 | SEO metadata, error boundaries, 404, dark mode |
| 10 | Production deployment to Vercel |

---

## 🗂 Data Models

```prisma
model Product {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String
  price       Decimal
  stock       Int
  category    String
  images      String[]
  isActive    Boolean     @default(true)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  items       OrderItem[]
}

model Order {
  id              String          @id @default(cuid())
  status          OrderStatus     @default(PENDING)
  totalAmount     Decimal
  paymentMethod   PaymentMethod
  paymentId       String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  items           OrderItem[]
  shippingAddress ShippingAddress?
}
```

---

## 🎨 Design System

- **Primary colour:** Green (`oklch(0.527 0.154 152.23)`) — health & safety
- **Font:** Inter (Google Fonts)
- **Radius:** `0.625rem`
- **Dark mode:** Full support via `next-themes` + CSS variables
- **Components:** shadcn/ui (New York style, Zinc base)

---

## 🤝 Contributing

Pull requests are welcome. For major changes please open an issue first to discuss what you would like to change.

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature"

# Push and open a PR
git push origin feature/your-feature-name
```

---

## 📄 License

This project is proprietary software built for **Tshitasini Enviro Solutions**. All rights reserved.

---

## 👤 Author

Built with ❤️ for Tshitasini Enviro Solutions — Johannesburg, Gauteng, South Africa.

---

*For support or enquiries: [info@tshitasini.co.za](mailto:info@tshitasini.co.za)*
