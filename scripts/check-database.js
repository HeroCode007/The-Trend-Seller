// Script to check if products exist in database
import connectDB from '../lib/db.js';
import Product from '../models/Product.js';

async function checkDatabase() {
    try {
        console.log('🔄 Connecting to database...');
        await connectDB();

        console.log('🔍 Checking products in database...\n');
        const count = await Product.countDocuments();

        console.log(`📦 Total products in database: ${count}\n`);

        if (count === 0) {
            console.log('❌ No products found in database!');
            console.log('💡 This is why the edit page shows no details.\n');
            console.log('To fix this, you have two options:');
            console.log('1. Migrate products from lib/products.js to database');
            console.log('2. Add products manually through the admin panel\n');
        } else {
            console.log('✅ Products found! Listing first 10:\n');
            const products = await Product.find().limit(10).select('name slug price category');
            products.forEach((p, index) => {
                console.log(`${index + 1}. ${p.name}`);
                console.log(`   Slug: ${p.slug}`);
                console.log(`   Price: Rs. ${p.price}`);
                console.log(`   Category: ${p.category}\n`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkDatabase();
