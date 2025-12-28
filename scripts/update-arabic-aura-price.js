// Script to update Arabic Aura watch price in database
import connectDB from '../lib/db.js';
import Product from '../models/Product.js';

async function updateArabicAuraPrice() {
    try {
        console.log('🔄 Connecting to database...');
        await connectDB();

        console.log('🔍 Finding Arabic Aura watch...');
        const product = await Product.findOne({ slug: 'Arabic-Aura' });

        if (!product) {
            console.log('❌ Product not found with slug "Arabic-Aura"');
            console.log('Searching with alternative case...');

            const productAlt = await Product.findOne({ slug: /arabic-aura/i });
            if (!productAlt) {
                console.log('❌ Product not found. Available slugs:');
                const allProducts = await Product.find({}, 'slug name');
                allProducts.forEach(p => console.log(`  - ${p.slug} (${p.name})`));
                process.exit(1);
            }

            console.log(`✅ Found product: ${productAlt.name}`);
            console.log(`   Current price: Rs. ${productAlt.price}`);
            console.log(`   Updating to: Rs. 2100`);

            productAlt.price = 2100;
            await productAlt.save();

            console.log('✅ Price updated successfully!');
            process.exit(0);
        }

        console.log(`✅ Found product: ${product.name}`);
        console.log(`   Current price: Rs. ${product.price}`);
        console.log(`   Updating to: Rs. 2100`);

        // Update the price
        product.price = 2100;
        await product.save();

        console.log('✅ Price updated successfully!');
        console.log(`   New price: Rs. ${product.price}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating price:', error.message);
        process.exit(1);
    }
}

updateArabicAuraPrice();
