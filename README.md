# Nazara Diamonds E-Commerce Web Application (MERN Stack)

This repository contains the complete MERN stack (MongoDB, Express, React, Node.js) clone of the premium **Nazara Diamonds** lab-grown diamond jewellery store. It features full e-commerce support, admin controls, inventory tracking, and dynamic festival offer coupon management.

---

## Key Features

1.  **Dynamic Pricing & Variations**: Replicates Nazara's custom options. Selecting metal purities (9KT, 14KT, 18KT), metal colors (Rose Gold, White Gold, Yellow Gold), and sizes dynamically adjusts the price in real-time.
2.  **Admin Dashboard**:
    *   **Products**: Full CRUD interface to add, list, and delete diamond jewellery items.
    *   **Orders**: View customer orders, track payments, and update shipping status (Processing ➔ Shipped ➔ Delivered).
    *   **Festival Offers**: Create custom coupon codes (percentage or flat discounts, min-purchase checks, validity date limits) directly from the admin interface.
3.  **Cart & Checkout Flow**: Add variants, apply coupons, fill in shipping address, and execute simulated payment.
4.  **Simulated Gateway**: Built-in simulated Razorpay overlay to test the full checkout and inventory-reduction process.
5.  **Pre-Seeded Database**: Automatically populates users, products, and offers on the first backend run if the database is empty.

---

## Folder Structure

```text
nazara-diamonds-project/
├── server/                    # Node.js + Express Backend & Seeder
│   ├── config/db.js           # Mongoose MongoDB Connection
│   ├── controllers/           # API Controllers (Auth, Catalog, Orders, Coupons)
│   ├── models/                # Database Schemas (User, Product, Order, Offer)
│   ├── routes/                # Express API Route definition
│   └── server.js              # Backend Entry Point
└── client/                    # React Frontend (Vite)
    ├── src/
    │   ├── components/        # Shared components (Navbar, Footer)
    │   ├── store/useStore.js  # Global State Store (Zustand)
    │   ├── pages/             # App Pages (Home, Catalog, Detail, Cart, Checkout, Dashboard)
    │   └── App.jsx            # Routing structure
    └── index.html             # SEO-optimized viewport and fonts
```

---

## Quick Start Guide

### Step 1: Start MongoDB
Ensure that you have MongoDB running locally on your system:
```bash
# Default URI used in configuration:
mongodb://127.0.0.1:27017/nazara-diamonds
```

### Step 2: Launch the Backend Server
Open a terminal in the `server` folder, install dependencies (if not done already), and start the developer server:
```bash
cd server
npm install
npm run dev
```
*Note: On launch, the server will connect to MongoDB and output messages confirming seeding of initial admin accounts, products, and promo codes.*

### Step 3: Launch the Frontend Client
Open a second terminal in the `client` folder and launch the Vite server:
```bash
cd client
npm install
npm run dev
```
The terminal will display the local development link (usually `http://localhost:5173`). Click it to open the shop!

---

## Test Credentials

For quick evaluation, use these pre-seeded accounts:

### 1. Admin Account (Dashboard Controls)
*   **Email**: `admin@nazaradiamonds.com`
*   **Password**: `admin12345`

### 2. Customer Account (Checkout & Purchase)
*   **Email**: `user@nazaradiamonds.com`
*   **Password**: `user12345`

### 3. Pre-seeded Promo Coupons
Apply these coupon codes in the shopping cart to test festival offers:
*   `DIWALI20` (20% Off, min. purchase ₹10,000)
*   `RAKHI15` (15% Off, min. purchase ₹5,000)
*   `WELCOME1000` (Flat ₹1,000 Off, min. purchase ₹15,000)
