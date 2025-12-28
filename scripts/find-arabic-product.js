// Script to find products with "arabic" or "aura" in name
import connectDB from '../lib/db.js';
import Product from '../models/Product.js';

async function findProduct() {
    try {
        console.log('🔄 Connecting to database...');
        await connectDB();

        console.log('🔍 Searching for products with "arabic" or "aura"...\n');

        const products = await Product.find({
            $or: [
                { name: /arabic/i },
                { name: /aura/i },
                { slug: /arabic/i },
                { slug: /aura/i }
            ]
        });

        if (products.length === 0) {
            console.log('❌ No products found!');
            console.log('\nLet me show all premium watches instead:\n');

            const premiumWatches = await Product.find({ category: 'premium-watches' });
            premiumWatches.forEach((p, i) => {
                console.log(`${i + 1}. ${p.name}`);
                console.log(`   Slug: ${p.slug}`);
                console.log(`   Price: Rs. ${p.price}`);
                console.log(`   ID: ${p._id}\n`);
            });
        } else {
            console.log(`✅ Found ${products.length} product(s):\n`);
            products.forEach((p) => {
                console.log(`Name: ${p.name}`);
                console.log(`Slug: ${p.slug}`);
                console.log(`Price: Rs. ${p.price}`);
                console.log(`ID: ${p._id}`);
                console.log(`\nEdit URL: http://localhost:3001/admin/products/${p._id}\n`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

findProduct();
