# 🛒 SokoDigital Marketplace

**Tanzania's premier online marketplace** — a full-featured e-commerce platform connecting buyers and sellers across the nation.

Built with **React 19**, **TypeScript**, **Vite**, and **Supabase**.

---

## ✨ Features

### For Buyers
- **Browse & Search** — Explore thousands of products with real-time search suggestions, category filtering, and price ranges
- **Product Details** — Image galleries, specifications, reviews, seller info, and delivery options
- **Shopping Cart** — Add/remove items, update quantities, coupon codes, and subtotal calculation
- **Wishlist** — Save products to buy later (persisted in localStorage)
- **Checkout** — Shipping address, payment method, order summary
- **Order Tracking** — Real-time order status with timeline view
- **User Dashboard** — Manage orders, profile, addresses, and payment methods
- **AI Chat Assistant** — Get product recommendations and answers via the AI widget or full chat page
- **Dark Mode** — Toggle between light and dark themes
- **Swahili i18n** — Full English/Swahili language support

### For Sellers
- **Seller Onboarding** — 8-step registration flow (business info, verification, banking, policies)
- **Product Management** — Add/edit/delete listings with images, specs, and pricing
- **Seller Dashboard** — Manage inventory, view orders, track sales
- **Store Page** — Custom storefront with banner, logo, and product catalog
- **Messaging** — Chat with buyers directly through the platform

### For Admins
- **Admin Dashboard** — User management, product moderation, order overview, analytics

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 7 |
| **Routing** | React Router 7 |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Animation** | GSAP + Framer Motion |
| **Backend** | Supabase (Auth, Database, Edge Functions) |
| **State** | React Context + Hooks |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **AI** | Supabase Edge Functions + local fallback |

---

## 📂 Project Structure

```
src/
├── assets/              # Static assets (banner images)
├── components/
│   ├── ai/              # AI Assistant (removed — consolidated to AIWidget)
│   ├── landing/         # Hero banner component
│   ├── layout/          # Header, Footer, MobileBottomNav
│   ├── product/         # ProductCard, ProductCardSkeleton
│   ├── shared/          # LazySection, OptimizedImage, ThemeToggle, LanguageSelector
│   ├── site/            # AIWidget (global chatbot)
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks (use-mobile, use-theme, use-gsap-scroll)
├── lib/
│   ├── auth.tsx         # Authentication provider
│   ├── cart-context.tsx  # Shopping cart state
│   ├── wishlist-context.tsx  # Wishlist state
│   ├── constants.ts     # Mock product/seller/category data
│   ├── i18n.tsx         # Internationalization
│   ├── seo.tsx          # SEO meta tags
│   └── utils.ts         # Utility functions
├── integrations/
│   ├── lovable/         # Lovable auth integration
│   └── supabase/        # Supabase client & types
├── pages/
│   ├── Landing.tsx      # Home page with hero, deals, categories, products
│   ├── MarketplacePage.tsx  # Product listing with filters
│   ├── ProductDetailPage.tsx # Full product view
│   ├── CategoriesPage.tsx    # Category grid
│   ├── DealsPage.tsx         # Flash sales & discounts
│   ├── ShopsPage.tsx         # Store directory
│   ├── CartPage.tsx          # Shopping cart
│   ├── CheckoutPage.tsx      # Checkout flow
│   ├── OrderConfirmationPage.tsx # Order receipt
│   ├── AuthPage.tsx          # Login/register
│   ├── DashboardPage.tsx     # User dashboard
│   ├── SellerOnboardingPage.tsx # Seller registration
│   ├── SellerListingsPage.tsx   # Seller product list
│   ├── SellerProductFormPage.tsx # Add/edit product
│   ├── MessagesPage.tsx      # Inbox & chat
│   ├── FAQPage.tsx           # Frequently asked questions
│   ├── ReturnsPage.tsx       # Returns & refunds
│   ├── AboutPage.tsx         # About us
│   ├── ContactPage.tsx       # Contact form
│   ├── PrivacyPage.tsx       # Privacy policy
│   ├── TermsPage.tsx         # Terms of service
│   ├── AIChatPage.tsx        # Full AI chat
│   ├── AdminDashboardPage.tsx # Admin panel
│   ├── StorePage.tsx         # Seller storefront
│   └── NotFound.tsx          # 404 page
└── types/               # TypeScript type definitions
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** 18+ (or **Bun**)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/chifie/sokomarket-hub.git
cd sokomarket-hub

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun run dev
```

The app will be available at **http://localhost:5173**.

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

> **Note:** The app works with mock data without Supabase configured. Auth, cart persistence, and AI features require Supabase setup.

---

## 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## 🔌 API Integration

The app uses **Supabase** for:
- **Authentication** — Email/password + Google OAuth
- **Edge Functions** — AI chat (`soko-ai`), Newsletter (`newsletter-subscribe`)
- **Database** — User profiles, products, orders (schema in `supabase/migrations/`)

> **Frontend-first:** All UIs are built with mock data from `src/lib/constants.ts`. To connect to a real backend, replace the mock data imports with Supabase queries.

---

## 🎨 Design System

- **Colors:** Custom Tailwind theme with `primary` (brand blue), `secondary`, `accent`, and `muted` palettes
- **Components:** [shadcn/ui](https://ui.shadcn.com/) — buttons, cards, dialogs, dropdowns, inputs, modals, tables, toasts
- **Typography:** Inter font via Google Fonts, responsive text scale
- **Dark Mode:** `next-themes` with system preference detection
- **Animations:** GSAP `ScrollTrigger` for scroll-based reveals, Framer Motion for page transitions

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 🙋 Support

- **Email:** support@sokodigital.co.tz
- **Phone:** +255 712 345 678
- **Website:** [sokodigital.co.tz](https://sokodigital.co.tz)
