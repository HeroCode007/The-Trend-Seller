/**
 * Product Migration Script
 * Migrates static products from lib/products.js to MongoDB
 *
 * Run with: node scripts/migrateProducts.js
 */

const mongoose = require('mongoose');

// Import your static products
const { allProducts } = require('../lib/products');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database';

// Product Schema (copy of models/Product.js)
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  productCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, default: '' },
  features: [{ type: String }],
  category: {
    type: String,
    required: true,
    enum: ['premium-watches', 'casual-watches', 'stylish-watches', 'belts', 'wallets']
  },
  inStock: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function migrateProducts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log(`\n📦 Found ${allProducts.length} static products to migrate\n`);

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const product of allProducts) {
      try {
        // Check if product already exists
        const existing = await Product.findOne({
          $or: [
            { slug: product.slug },
            { productCode: product.productCode }
          ]
        });

        if (existing) {
          console.log(`⏭️  Skipped: ${product.name} (already exists)`);
          skipped++;
          continue;
        }

        // Create new product
        await Product.create({
          name: product.name,
          slug: product.slug,
          productCode: product.productCode,
          price: product.price,
          image: product.image,
          images: product.images || [],
          description: product.description || '',
          features: product.features || [],
          category: product.category,
          inStock: product.inStock !== false,
          isActive: true,
          sortOrder: 0
        });

        console.log(`✅ Created: ${product.name}`);
        created++;
      } catch (error) {
        console.error(`❌ Error with ${product.name}:`, error.message);
        errors++;
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📦 Total: ${allProducts.length}\n`);

    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateProducts();
