/**
 * Sync Products Script
 * Updates database products with current prices from lib/products.js
 * Does NOT delete or add products, only updates existing ones
 *
 * Run with: node scripts/sync-products.js
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

async function syncProducts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log(`📦 Syncing ${allProducts.length} products from lib/products.js...\n`);

    let updated = 0;
    let created = 0;
    let unchanged = 0;
    let errors = 0;

    for (const product of allProducts) {
      try {
        // Find product by slug or productCode
        const existingProduct = await Product.findOne({
          $or: [
            { slug: product.slug },
            { productCode: product.productCode }
          ]
        });

        if (existingProduct) {
          // Check if anything changed
          const hasChanges =
            existingProduct.name !== product.name ||
            existingProduct.price !== product.price ||
            existingProduct.image !== product.image ||
            existingProduct.description !== product.description ||
            JSON.stringify(existingProduct.features) !== JSON.stringify(product.features || []) ||
            JSON.stringify(existingProduct.images) !== JSON.stringify(product.images || []) ||
            existingProduct.inStock !== (product.inStock !== false);

          if (hasChanges) {
            // Update existing product
            existingProduct.name = product.name;
            existingProduct.price = product.price;
            existingProduct.image = product.image;
            existingProduct.images = product.images || [];
            existingProduct.description = product.description || '';
            existingProduct.features = product.features || [];
            existingProduct.inStock = product.inStock !== false;

            await existingProduct.save();
            console.log(`✅ Updated: ${product.name} (Rs. ${product.price})`);
            updated++;
          } else {
            console.log(`⏭️  Unchanged: ${product.name}`);
            unchanged++;
          }
        } else {
          // Create new product if it doesn't exist
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
          console.log(`🆕 Created: ${product.name} (Rs. ${product.price})`);
          created++;
        }
      } catch (error) {
        console.error(`❌ Error with ${product.name}:`, error.message);
        errors++;
      }
    }

    console.log(`\n📊 Sync Summary:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   🆕 Created: ${created}`);
    console.log(`   ⏭️  Unchanged: ${unchanged}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📦 Total: ${allProducts.length}\n`);

    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
    console.log('\n💡 Your website will now show the updated prices!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

// Run sync
syncProducts();
