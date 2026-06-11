# E-Commerce Platform — User Guide

## Table of Contents
1. [Getting Started](#1-getting-started)
2. [Customer Features](#2-customer-features)
3. [Admin Features](#3-admin-features)
4. [Order Status Flow](#4-order-status-flow)

---

## 1. Getting Started

### Access the Application

Open the deployed frontend URL in your browser or on your phone.

### Account Types

| Role | Description |
|------|-------------|
| **Customer** | Browse products, place orders, manage wishlist |
| **Admin** | Manage products, categories, coupons, view reports |

### Create an Account

1. Click **Register** on the login page
2. Fill in your name, email, mobile number, and password
3. Submit — you'll be logged in automatically

### Default Test Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@ecommerce.com | admin123 | Admin |
| john@example.com | customer123 | Customer |

---

## 2. Customer Features

### 2.1 Browsing Products

- Browse all products on the **Products** page
- Search by product name
- Filter by category
- Sort by price, name, or newest
- Click a product card to view details

### 2.2 Product Detail Page

- View product images, description, brand, and SKU
- See current price and sale price (if applicable)
- Check stock availability
- Select quantity and **Add to Cart**
- **Add to Wishlist** to save for later
- Read and submit reviews

### 2.3 Cart & Checkout

**Cart:**
- View all items in your cart
- Adjust quantities or remove items
- See subtotal for each item and the cart total
- Apply a coupon code for discounts
- Proceed to **Checkout**

**Checkout:**
- Select a shipping address (or add a new one)
- Review your order summary
- Place the order

### 2.4 Orders

- View your order history in **My Orders**
- See order number, date, status, and total for each order
- Click an order to view detailed information including items and shipping address
- Track order status: Pending → Confirmed → Shipped → Delivered

### 2.5 Wishlist

- Save products you're interested in for later
- Add or remove items from your wishlist
- Click directly from wishlist to add items to cart

### 2.6 Addresses

- Add multiple shipping addresses
- Edit or delete saved addresses
- Select your preferred address at checkout

### 2.7 Notifications

- View platform notifications
- Mark notifications as read
- Stay updated on order status changes

---

## 3. Admin Features

### 3.1 Dashboard

The admin dashboard gives you an overview of your store:

| Card | Description |
|------|-------------|
| **Total Products** | Number of active products in your catalog |
| **Categories** | Number of product categories |
| **Total Orders** | All orders placed by customers |
| **Customers** | Number of registered customers |
| **Low Stock Items** | Products with low inventory (≤10 units) |

**Quick Actions** — shortcuts to manage products, categories, coupons, and inventory.

**Low Stock Alerts** — see which products are running low and need restocking.

**Recent Orders** — view the latest 5 orders with status and amount.

### 3.2 Managing Products

**Add a Product:**
1. Go to **Admin → Products → Add Product**
2. Fill in name, description, brand, SKU, price, stock quantity, and category
3. Optionally set a sale price
4. Upload one or more product images
5. Submit

**Edit / Delete:**
- Click **Edit** to update product details
- Click **Delete** to soft-delete (product is hidden from store but data is preserved)

### 3.3 Categories

- **Add** new categories (name + description)
- **Edit** existing categories
- **Delete** categories (won't delete associated products)

### 3.4 Coupons

- Create discount coupons with a code, discount percentage, expiry date, and max usage limit
- Customers apply coupons at checkout
- Track how many times a coupon has been used

### 3.5 Inventory

- View all products and their current stock levels
- Products with low stock (\(\leq\)10) are highlighted
- Update stock quantities directly

### 3.6 Reports

Click a report button to load the data:

| Report | What You See |
|--------|-------------|
| **Sales Report** | Total orders, total revenue, average order value. Bar chart & pie chart of orders by status. |
| **Orders Report** | Counts for each order status (pending, confirmed, shipped, delivered, cancelled). Bar chart overview. |
| **Customers Report** | Total customers, total orders placed, avg orders per customer. Trend line chart. |
| **Inventory Report** | Total products, categories, low stock count. Pie chart distribution. |

Raw JSON data is also displayed below the charts for reference.

---

## 4. Order Status Flow

```
PENDING → CONFIRMED → SHIPPED → DELIVERED
                                ↘ CANCELLED (at any stage)
```

| Status | Meaning |
|--------|---------|
| **PENDING** | Order placed, awaiting confirmation |
| **CONFIRMED** | Order accepted and payment verified |
| **SHIPPED** | Package has been dispatched |
| **DELIVERED** | Successfully delivered to customer |
| **CANCELLED** | Order was cancelled |

### Status Colors (UI)
- **Pending** — Yellow
- **Confirmed** — Blue
- **Shipped** — Purple
- **Delivered** — Green
- **Cancelled** — Red

---

*Last updated: June 2026*
