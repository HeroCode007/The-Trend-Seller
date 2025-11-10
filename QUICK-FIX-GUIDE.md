# Quick Fix: "Failed to add item to cart" Error

## The Problem
The "Add to Cart" feature requires a MongoDB database connection. If you see a "Failed" message, it's likely because MongoDB is not running or not configured.

## Quick Solutions

### Option 1: Use MongoDB Atlas (Recommended - Easiest)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a free cluster (M0 - Free tier)
4. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/trendseller`)
5. Update `.env.local` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trendseller
   ```
6. Restart your development server

### Option 2: Install MongoDB Locally
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. The `.env.local` file already has the default local connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/trendseller
   ```
4. Restart your development server

### Option 3: Check Current Setup
1. Open `.env.local` file in the project root
2. Verify `MONGODB_URI` is set correctly
3. Check terminal/console for MongoDB connection errors
4. Restart the dev server: `npm run dev`

## Verify It's Working
1. Check the terminal/console - you should see: "✅ MongoDB connected successfully"
2. Try adding an item to cart again
3. If it still fails, check the browser console (F12) for detailed error messages

## Common Errors

### "Database connection failed"
- MongoDB is not running
- Connection string is incorrect
- Firewall blocking connection (for Atlas)

### "Missing required fields"
- This is a different error - check product data

## Need Help?
Check the server terminal for detailed error messages. The improved error handling will now show exactly what's wrong.


