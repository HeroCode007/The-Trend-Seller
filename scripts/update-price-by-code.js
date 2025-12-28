// Script to update Arabic Aura price using productCode
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trendseller';

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  slug: { type: String },
  productCode: { type: String },
  price: { type: Number },
  category: { type: String }
}, { timestamps: true, strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function updatePrice() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find by product code
    console.log('🔍 Searching for product with code TTS-PW-005...');
    const product = await Product.findOne({ productCode: 'TTS-PW-005' });

    if (!product) {
      console.log('❌ Product not found!');
      console.log('\nLet me show all products:');
      const all = await Product.find({}).limit(5);
      all.forEach(p => console.log(`  - ${p.productCode}: ${p.name} (Rs. ${p.price})`));
      process.exit(1);
    }

    console.log(`✅ Found: ${product.name}`);
    console.log(`   Current price: Rs. ${product.price}`);
    console.log(`   Slug: ${product.slug}`);
    console.log(`   Product Code: ${product.productCode}\n`);

    // Update price
    console.log('💰 Updating price to Rs. 2100...');
    product.price = 2100;
    await product.save();

    console.log('✅ Price updated successfully!');
    console.log(`   New price: Rs. ${product.price}\n`);

    await mongoose.connection.close();
    console.log('👋 Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updatePrice();
