# 🛍️ Admin Product Management Setup

## What This Does

Now you can **add, edit, and delete products from the Admin Panel** and they will **automatically show on your website**!

---

## ✅ What's Already Set Up

1. **Product Model** - MongoDB schema for products ✅
2. **Admin API** - `/api/admin/products` for CRUD operations ✅
3. **Public API** - `/api/products` for website display ✅
4. **Admin Pages** - `/admin/products` for management ✅

---

## 🚀 Quick Start

### Step 1: Migrate Existing Products (One-Time)

Run this command to copy your static products to the database:

```bash
node scripts/migrateProducts.js
```

This will:
- ✅ Copy all products from `lib/products.js` to MongoDB
- ✅ Skip duplicates
- ✅ Show you a summary

---

### Step 2: Add Products via Admin Panel

1. Go to **http://localhost:3000/admin/products**
2. Click **"Add New Product"**
3. Fill in the form:
   - Name
   - Product Code (e.g., TTS-PW-010)
   - Price
   - Category
   - Image URL
   - Description
   - Features
4. Click **Save**

**That's it!** The product will show on your website immediately.

---

## 📂 File Structure

```
✅ Created Files:
├── app/api/products/route.js          # Public API for all products
├── app/api/products/[slug]/route.js   # Public API for single product
├── lib/productService.js              # Utility to fetch products
└── scripts/migrateProducts.js         # Migration script

✅ Already Exists:
├── models/Product.js                  # Product schema
├── app/api/admin/products/route.js    # Admin CRUD API
├── app/admin/products/page.jsx        # Product list page
└── app/admin/products/new/page.jsx    # Add product page
```

---

## 🔄 How It Works

### Adding a Product:

```
Admin Panel
    ↓
POST /api/admin/products
    ↓
Save to MongoDB
    ↓
Automatically available on website!
```

### Viewing Products on Website:

```
User visits /watches/premium
    ↓
GET /api/products?category=premium-watches
    ↓
Fetch from MongoDB
    ↓
Display on page
```

---

## 📝 Product Fields

When adding a product in admin:

| Field | Required | Example |
|-------|----------|---------|
| Name | ✅ | "Rolex Submariner" |
| Slug | Auto-generated | "rolex-submariner" |
| Product Code | ✅ | "TTS-PW-010" |
| Price | ✅ | 4999 |
| Image | ✅ | "/images/watch.jpg" |
| Images | ❌ | ["/images/w1.jpg", "/images/w2.jpg"] |
| Description | ❌ | "Luxury diving watch..." |
| Features | ❌ | ["Waterproof", "Automatic"] |
| Category | ✅ | "premium-watches" |
| In Stock | ✅ | true |
| Is Active | ✅ | true |

---

## 🎯 Categories

Available categories:
- `premium-watches`
- `casual-watches`
- `stylish-watches`
- `belts`
- `wallets`

---

## 💡 Usage Examples

### Add Product via Admin Panel

1. Navigate to: `/admin/products/new`
2. Fill form
3. Submit
4. Product appears on website!

### View Products

- All products: `http://localhost:3000/api/products`
- By category: `http://localhost:3000/api/products?category=premium-watches`
- Single product: `http://localhost:3000/api/products/rolex-submariner`

---

## 🔧 Troubleshooting

### Products not showing on website?

**Check:**
1. Is `isActive` set to `true`?
2. Is `inStock` set to `true`?
3. Is the category correct?
4. Clear browser cache

### Migration script fails?

**Fix:**
1. Make sure MongoDB is running
2. Check `MONGODB_URI` in `.env`
3. Install dependencies: `npm install mongoose`

---

## 🎨 Customization

### Change Product Display

Products are fetched dynamically. To customize display:

1. Edit the page component (e.g., `/app/watches/premium/page.js`)
2. Products come from `/api/products`
3. Style them however you want!

### Add More Fields

1. Edit `models/Product.js`
2. Add new field to schema
3. Update admin form
4. Done!

---

## ✨ Benefits

✅ **No code changes** to add products
✅ **Instant updates** - shows on website immediately
✅ **SEO-friendly** - proper URLs and metadata
✅ **Stock management** - mark in/out of stock
✅ **Image galleries** - multiple images per product
✅ **Search & filter** - built-in admin features

---

## 🚀 Next Steps

1. **Run migration**: `node scripts/migrateProducts.js`
2. **Access admin**: http://localhost:3000/admin/products
3. **Add a test product**
4. **Check website** - it should appear!

---

**That's it! Your admin panel is ready to manage products!** 🎉
