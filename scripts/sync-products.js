/**
 * Sync Products to MongoDB Atlas / Local Database
 * Run with: node scripts/sync-products.js
 */

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { allProducts } from '../lib/products.js';

// Manually parse .env.local if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.substring(0, eqIdx).trim();
          let val = trimmed.substring(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    });
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trendseller';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  productCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, default: null, min: 0 },
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, default: '' },
  features: [{ type: String }],
  category: {
    type: String,
    required: true,
    enum: ['premium-watches', 'casual-watches', 'stylish-watches', 'women-watches', 'belts', 'wallets']
  },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 10, min: 0 },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function syncAllProducts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log(`📡 URI: ${MONGODB_URI.split('@')[1] ? 'MongoDB Atlas (Cluster)' : MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log(`📦 Syncing ${allProducts.length} total products to database...\n`);

    let created = 0;
    let updated = 0;
    let unchanged = 0;
    let errors = 0;

    for (const product of allProducts) {
      try {
        const existingProduct = await Product.findOne({
          $or: [
            { slug: product.slug },
            { productCode: product.productCode }
          ]
        });

        if (existingProduct) {
          // Check if any fields changed
          existingProduct.name = product.name;
          existingProduct.slug = product.slug;
          existingProduct.productCode = product.productCode;
          existingProduct.price = product.price;
          existingProduct.compareAtPrice = product.compareAtPrice || null;
          existingProduct.image = product.image;
          existingProduct.images = product.images || [];
          existingProduct.description = product.description || '';
          existingProduct.features = product.features || [];
          existingProduct.category = product.category;
          existingProduct.inStock = product.inStock !== false;
          existingProduct.isActive = true;

          await existingProduct.save();
          console.log(`🔄 Synced/Updated: [${product.productCode}] ${product.name} (Rs. ${product.price})`);
          updated++;
        } else {
          // Create brand new product in DB
          await Product.create({
            name: product.name,
            slug: product.slug,
            productCode: product.productCode,
            price: product.price,
            compareAtPrice: product.compareAtPrice || null,
            image: product.image,
            images: product.images || [],
            description: product.description || '',
            features: product.features || [],
            category: product.category,
            inStock: product.inStock !== false,
            stockQuantity: 10,
            isActive: true,
            sortOrder: 0
          });
          console.log(`🆕 Created in DB: [${product.productCode}] ${product.name} (Rs. ${product.price})`);
          created++;
        }
      } catch (err) {
        console.error(`❌ Error syncing ${product.name}:`, err.message);
        errors++;
      }
    }

    console.log(`\n========================================`);
    console.log(`📊 SYNC SUMMARY:`);
    console.log(`   🆕 Newly Created : ${created}`);
    console.log(`   🔄 Synced/Updated: ${updated}`);
    console.log(`   ❌ Errors        : ${errors}`);
    console.log(`   📦 Total Products: ${allProducts.length}`);
    console.log(`========================================\n`);

    await mongoose.connection.close();
    console.log('👋 Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection or sync failure:', error);
    process.exit(1);
  }
}

syncAllProducts();
