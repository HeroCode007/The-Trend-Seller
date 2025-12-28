/**
 * Reset and Re-migrate Products
 * Deletes all products and re-imports from lib/products.js
 */

const mongoose = require('mongoose');
const { allProducts } = require('../lib/products');

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
    enum: ['premium-watches', 'casual-watches', 'stylish-watches', 'belts', 'wallets']
  },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 0, min: 0 },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function resetAndMigrate() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete all existing products
    console.log('🗑️  Deleting all existing products...');
    const deleteResult = await Product.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} products\n`);

    console.log(`📦 Importing ${allProducts.length} products from lib/products.js...\n`);

    let created = 0;
    let errors = 0;

    for (const product of allProducts) {
      try {
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

        console.log(`✅ Created: ${product.name} (Rs. ${product.price})`);
        created++;
      } catch (error) {
        console.error(`❌ Error with ${product.name}:`, error.message);
        errors++;
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📦 Total: ${allProducts.length}\n`);

    // Verify Arabic Aura
    console.log('🔍 Verifying Arabic Aura watch...');
    const arabicAura = await Product.findOne({ productCode: 'TTS-PW-005' });
    if (arabicAura) {
      console.log(`✅ ${arabicAura.name} - Rs. ${arabicAura.price}`);
      console.log(`   Slug: ${arabicAura.slug}`);
      console.log(`   ID: ${arabicAura._id}\n`);
    }

    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

resetAndMigrate();
