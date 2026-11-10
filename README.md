# 🍔 Swigi — Modern Campus Food Ordering & Delivery Platform

Swigi is a modern, high-performance food ordering and campus delivery web application designed for SRM University AP, built with **React 18**, **TypeScript**, **Tailwind CSS**, **Leaflet Maps**, and **Framer Motion**.

---

## 🌟 Key Highlights & Architecture

- **Frontend Only with Mock Services**: 100% frontend architecture powered by realistic mock JSON databases, local state, and simulated asynchronous network delay (`services/api.ts`).
- **Production-Ready Folder Structure**: Component-driven architecture cleanly split into UI primitives, domain modules, contexts, layouts, and services.
- **Glassmorphism & Clean Card Design**: Balanced light & dark mode styling with subtle backdrop blur, pill badges, and micro-interactions.
- **State Management & Local Persistence**:
  - `CartContext`: Basket state with option customization, quantity controls, auto-tax (8%), promo voucher discounts (`TASTY20`, `HUNGRY5`, `FREEDEL`, `WELCOME10`), and `localStorage` persistence.
  - `AuthContext`: Simulated JWT sessions, fast 1-click customer/admin switcher, saved delivery addresses, and tokenized payment methods.
  - `WishlistContext`: Favorited dishes and restaurant kitchens persisted in `localStorage`.
  - `OrderContext`: Global order management, real-time lifecycle tracking, simulated status stepper, and reactive notifications.
  - `NotificationContext`: Push-style alert center for tracking order milestones and secret chef promo drops.
  - `ToastContext`: Animated stackable toast system.

---

## 🚀 Complete Application Flow

### 1. Public & Customer Pages
1. **Landing Page (`/`)**:
   - Hero section with live search input and trust badges
   - Category scroller (Pizza, Burgers, Asian, Healthy, Indian, Mexican, etc.)
   - Voucher banner with 1-click copy & automatic discount activation
   - Featured partner restaurants grid
   - Trending dishes with direct add-to-cart controls
   - Customer foodie testimonials & footer
2. **Restaurant Listing Page (`/restaurants`)**:
   - Filter by Cuisine, Minimum Rating (4.0+, 4.5+), Delivery Time (< 25 min, < 30 min), Deals & Offers only
   - Multi-option sorting (Recommended, Highest Rating, Fastest Delivery, Price)
   - Shimmer skeleton loaders during filter transitions
3. **Restaurant Detail Page (`/restaurants/:id`)**:
   - Hero banner with delivery badges, opening hours, and distance
   - Category menu tabs with live item counters
   - Food cards with customization options modal (Crust size, toppings, spice level)
   - Verified reviews tab with "Write a Review" modal
4. **Food Search Page (`/search`)**:
   - Global multi-restaurant search with autocomplete queries
   - Veg-only & bestseller filter pills
5. **Cart Page (`/cart`) & Slide-over Drawer**:
   - Full basket summary with quantity modifiers
   - Promo coupon code verification with instant deductions
   - Empty cart state with quick redirect
6. **Checkout Page (`/checkout`)**:
   - Delivery address picker + "Add New Address" modal
   - Payment method selection UI (Cards, Instant UPI / QR, Apple Pay, Cash on Delivery)
   - Courier notes & simulated order placement
7. **Order Success Page (`/order-success/:orderId`)**:
   - Celebration confetti animation (`canvas-confetti`)
   - Order receipt breakdown with direct links to Live GPS Tracking

### 2. User Account Features
- **Auth Flow (`/login`, `/signup`, `/forgot-password`, `/otp`)**:
  - 1-click test credentials for Alex Rivera (Customer) and Sarah Chen (Admin)
  - 6-digit auto-advancing OTP verification with countdown timer
- **Profile Center (`/profile`)**:
  - Personal Information editor
  - Past Orders list with quick re-order & status pills
  - Saved Address book manager
  - Payment credentials vault
  - System preferences (Dark/Light toggle, SMS alerts)
- **Live Order Tracking (`/track/:orderId`)**:
  - Simulated interactive vector map route
  - Animated courier courier position
  - Step-by-step order timeline
  - Courier card with direct phone call action
  - **Interactive Simulation Button**: 1-click "Next Stage" button to advance the order from Placed ➔ Confirmed ➔ Preparing ➔ Out for Delivery ➔ Delivered
- **Wishlist (`/wishlist`)**:
  - Dual tabs for saved favorite foods and saved partner restaurants
- **Notification Center (`/notifications`)**:
  - Real-time updates with unread badges and filters

### 3. Admin Control Console (`/admin`)
- **Dashboard Overview (`/admin`)**:
  - Gross volume & revenue velocity metrics
  - Active orders & kitchen fulfillment statistics
  - Weekly revenue bar chart analytics
  - AI dispatch efficiency meters
- **Order Management (`/admin/orders`)**:
  - Searchable table with status dropdown modifier (Placed, Confirmed, Preparing, On the way, Delivered, Cancelled)
  - Status filters and pagination
- **Restaurant Management (`/admin/restaurants`)**:
  - Add / Edit / Delete partner restaurant modals
  - Delivery radius and minimum order configurations
- **Food Catalog (`/admin/foods`)**:
  - Add / Edit / Delete menu items modal with photo previews, category tagging, and vegetarian flags
- **User Management (`/admin/users`)**:
  - Registered customer table with roles and saved address counts
- **Coupons & Promo Codes (`/admin/coupons`)**:
  - Active vouchers table with percentage/flat discount rules and status toggling
- **Fleet & Courier Management (`/admin/delivery`)**:
  - Live rider dispatch status, vehicle registrations, and star ratings
- **Reports & Analytics (`/admin/reports`)**:
  - Top 5 best selling dishes and highest grossing kitchens with CSV export simulation
- **System Settings (`/admin/settings`)**:
  - Platform commission rates, base delivery fee, and customer care hotlines

---

## 🛠️ Code Structure

```
src/
├── assets/
├── components/
│   ├── common/              # Reusable UI primitives (Button, Input, Card, Modal, Table, Badge, Loader, Skeleton, Pagination, Tabs, EmptyState)
│   ├── layout/              # Navbar, Footer, AdminSidebar, AdminNavbar, MobileBottomNav
│   ├── food/                # FoodCard, FoodOptionModal
│   ├── restaurant/          # RestaurantCard
│   └── cart/                # CartDrawer
├── context/                 # AuthContext, CartContext, OrderContext, WishlistContext, ThemeContext, NotificationContext, ToastContext
├── data/                    # Realistic mock JSON data (Restaurants, Foods, Categories, Orders, Reviews, Coupons, Users)
├── hooks/
├── layouts/                 # MainLayout, AuthLayout, AdminLayout
├── pages/
│   ├── public/              # LandingPage, RestaurantListingPage, RestaurantDetailPage, FoodSearchPage, CartPage, CheckoutPage, OrderSuccessPage
│   ├── user/                # ProfilePage, OrderTrackingPage, WishlistPage, NotificationsPage
│   ├── auth/                # LoginPage, SignupPage, ForgotPasswordPage, OtpVerificationPage
│   ├── admin/               # Overview, Orders, Restaurants, Foods, Users, Coupons, Delivery, Reports, Settings
│   └── NotFoundPage.tsx
├── services/                # Simulated API service layer with network latency and comments for future Node.js integration
├── types/                   # Comprehensive TypeScript interfaces
└── utils/                   # Helpers, formatters, constants
```

---

## 🧑‍💻 Running Locally

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev

# 3. Build for production
pnpm build
```

---

## 🚀 Deploying to Vercel

This repository is pre-configured for seamless deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub and connect the repository in Vercel.
2. Vercel automatically detects the **Vite** framework:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build` (or `npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install` (or `npm install`)
3. The included `vercel.json` provides SPA routing rewrites so all routes (`/restaurants`, `/cart`, `/checkout`, `/track`, etc.) work without 404 errors on page reload.
4. Click **Deploy**!

---

## 🔑 Quick Demo Credentials

For swift evaluation, the Login page provides 1-click sign-in buttons:
- **Customer Account**: `alex@foodhub.com` (Alex Rivera)
- **Admin Account**: `admin@foodhub.com` (Sarah Chen)
- Additionally, the user profile dropdown includes a instant **Demo Role Switcher** to flip between Customer and Admin views on the fly.

