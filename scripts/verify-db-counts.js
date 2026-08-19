import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

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

const ProductSchema = new mongoose.Schema({
  name: String,
  slug: String,
  productCode: String,
  price: Number,
  category: String,
  inStock: Boolean,
  image: String
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function testFetch() {
  await mongoose.connect(process.env.MONGODB_URI);
  const total = await Product.countDocuments();
  const countsByCategory = {};
  const categories = ['premium-watches', 'casual-watches', 'stylish-watches', 'women-watches', 'belts', 'wallets'];
  
  for (const cat of categories) {
    countsByCategory[cat] = await Product.countDocuments({ category: cat });
  }

  console.log(`✅ Total products in MongoDB Atlas: ${total}`);
  console.log(`📊 Breakdown:`, JSON.stringify(countsByCategory, null, 2));

  await mongoose.connection.close();
}

testFetch();
