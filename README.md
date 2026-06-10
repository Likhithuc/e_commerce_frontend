# E-Commerce Frontend

React 19 e-commerce storefront built with Vite, TypeScript, Tailwind CSS v4, and Recharts.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| HTTP | Axios |
| Routing | React Router v7 |
| Bundler | Vite 8 |
| Deployment | Vercel (recommended) |

## Quick Start (Local)

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Environment Variable

Create `.env.local` in the project root:

```
VITE_API_URL=http://localhost:4999/api
```

## Features

### Public
- Product listing with search, filters, and pagination
- Product detail page with reviews
- User registration & login

### Authenticated (Customer)
- Shopping cart management
- Checkout & order placement
- Order history & tracking
- Wishlist
- Address management
- Notifications

### Admin
- **Dashboard** — stats cards, quick actions, low stock alerts, recent orders
- **Reports** — sales, orders, customers, inventory with interactive charts
- **Products** — CRUD management
- **Categories** — CRUD management
- **Coupons** — discount management
- **Inventory** — stock tracking

## Project Structure

```
src/
├── components/     # Shared UI (Layout, Navbar, ProductCard, etc.)
├── contexts/       # React contexts (AuthContext)
├── pages/          # Route pages
│   ├── admin/      # Dashboard, Products, Reports, Inventory, etc.
│   ├── auth/       # Login, Register, Forgot/Reset Password
│   ├── cart/       # Cart, Checkout
│   ├── orders/     # Order list & detail
│   ├── products/   # Product list & detail
│   ├── addresses/  # Address management
│   ├── wishlist/   # Wishlist
│   └── notifications/
├── services/       # API service functions (axios)
├── types/          # TypeScript type definitions
└── utils/          # Utility helpers
```

## Deployment (Vercel)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Repository**
3. Set environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend.up.railway.app/api` |

4. Deploy (Vercel auto-detects Vite settings)

### Image Serving
Product images are proxied from the backend. Make sure `VITE_API_URL` points to your backend's API root. The `imageUrl()` utility prepends it automatically.

## Local Proxy

In development, Vite proxies `/uploads` to the backend:

```
http://localhost:5173/uploads/... → http://localhost:4999/api/uploads/...
```

This matches the Vite config in `vite.config.ts`.
