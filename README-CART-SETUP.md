# Shopping Cart & Checkout Setup Guide

This guide will help you set up the shopping cart and checkout functionality for your e-commerce website.

## Prerequisites

1. **MongoDB Database**: You need a MongoDB database running. You can either:
   - Install MongoDB locally: https://www.mongodb.com/try/download/community
   - Use MongoDB Atlas (free cloud database): https://www.mongodb.com/cloud/atlas

## Setup Instructions

### 1. Install Dependencies

All required dependencies are already installed:
- `mongoose` - MongoDB ODM (Object Data Modeling)

### 2. Configure Database Connection

1. Create a `.env.local` file in the root directory of your project
2. Add your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/trendseller
```

For MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trendseller
```

### 3. Start Your Development Server

```bash
npm run dev
```

## Features Implemented

### ✅ Shopping Cart
- Add items to cart from product detail pages
- View cart with all items
- Update item quantities
- Remove items from cart
- Cart persists using session-based storage

### ✅ Checkout Process
- Complete checkout form with shipping information
- Order creation and confirmation
- Order tracking with unique order numbers

### ✅ Database Models
- **Cart**: Stores cart items per session
- **Order**: Stores completed orders with shipping details

### ✅ API Routes
- `/api/cart` - GET, POST, PUT, DELETE cart operations
- `/api/cart/clear` - Clear entire cart
- `/api/checkout` - Create order from cart
- `/api/orders` - Get all orders for session
- `/api/orders/[orderNumber]` - Get specific order

### ✅ Frontend Components
- `AddToCartButton` - Reusable add to cart button
- `CartContext` - Global cart state management
- Cart page (`/cart`)
- Checkout page (`/checkout`)
- Order confirmation page (`/orders/[orderNumber]`)
- Cart icon in header with item count

## Usage

### Adding Items to Cart
1. Navigate to any product detail page
2. Click "Add to Cart" button
3. Item is added to cart and notification appears

### Viewing Cart
1. Click the cart icon in the header
2. Or navigate to `/cart`
3. View all items, update quantities, or remove items

### Checkout
1. Go to cart page
2. Click "Proceed to Checkout"
3. Fill in shipping information
4. Click "Place Order"
5. Receive order confirmation with order number

## Database Schema

### Cart Collection
```javascript
{
  sessionId: String (unique),
  items: [{
    productId: Number,
    slug: String,
    name: String,
    price: Number,
    image: String,
    quantity: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Collection
```javascript
{
  orderNumber: String (unique),
  items: [{
    productId: Number,
    slug: String,
    name: String,
    price: Number,
    image: String,
    quantity: Number
  }],
  shippingAddress: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  totalAmount: Number,
  status: String (pending, confirmed, processing, shipped, delivered, cancelled),
  sessionId: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### Database Connection Issues
- Ensure MongoDB is running (if using local)
- Check your connection string in `.env.local`
- Verify network access (if using MongoDB Atlas)

### Cart Not Persisting
- Check browser cookies are enabled
- Verify session ID is being set correctly
- Check database connection

### Order Creation Fails
- Verify all required fields in checkout form
- Check database connection
- Ensure cart has items before checkout

## Next Steps (Optional Enhancements)

1. **Payment Integration**: Add payment gateway (Stripe, PayPal, etc.)
2. **Email Notifications**: Send order confirmation emails
3. **User Authentication**: Add user accounts and order history
4. **Admin Panel**: Manage orders and update order status
5. **Inventory Management**: Track product stock levels
6. **Order Tracking**: Real-time order status updates

## Support

If you encounter any issues, check:
1. MongoDB connection string
2. Environment variables
3. Database server status
4. Browser console for errors
5. Server logs for API errors


