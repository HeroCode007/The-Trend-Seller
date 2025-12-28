// Script to check Arabic Aura price in database
import connectDB from '../lib/db.js';
import Product from '../models/Product.js';

async function checkPrice() {
    try {
        console.log('🔄 Connecting to database...');
        await connectDB();

        console.log('🔍 Finding Arabic Aura watch...\n');
        const product = await Product.findOne({ slug: /arabic-aura/i });

        if (!product) {
            console.log('❌ Product not found!');
            process.exit(1);
        }

        console.log(`✅ Found: ${product.name}`);
        console.log(`   Slug: ${product.slug}`);
        console.log(`   Price in database: Rs. ${product.price}`);
        console.log(`   Product Code: ${product.productCode}`);
        console.log(`   Category: ${product.category}`);
        console.log(`   In Stock: ${product.inStock}`);
        console.log(`   MongoDB ID: ${product._id}\n`);

        console.log('💡 To edit this product in admin panel, go to:');
        console.log(`   http://localhost:3001/admin/products/${product._id}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkPrice();
