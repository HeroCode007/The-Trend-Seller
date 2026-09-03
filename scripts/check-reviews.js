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

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const total = await mongoose.connection.db.collection('reviews').countDocuments({ isApproved: true });
  console.log('✅ Total Approved Reviews in MongoDB Atlas:', total);

  const sampleProducts = [
    'oliya-emerald-cut-diamond-luxury',
    'rolex-datejust-twotone-royal-blue-diamond',
    'cartier-a-grade-tank-leather',
    'reversible-dress-belt',
    'brown-leather-card-holder'
  ];

  for (const slug of sampleProducts) {
    const p = await mongoose.connection.db.collection('products').findOne({ slug });
    if (p) {
      const reviews = await mongoose.connection.db.collection('reviews').find({ productId: p._id }).toArray();
      console.log(`\n📦 [${p.name}] (${reviews.length} reviews):`);
      reviews.forEach(r => console.log(`   ⭐ ${r.rating}/5 — "${r.title}" by ${r.name}`));
    }
  }

  await mongoose.connection.close();
}

main();
