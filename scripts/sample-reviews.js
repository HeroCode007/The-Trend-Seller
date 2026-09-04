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

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const revs = await mongoose.connection.db.collection('reviews').aggregate([
    { $sample: { size: 6 } },
    { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } }
  ]).toArray();

  revs.forEach((r, idx) => {
    const p = r.product[0];
    console.log(`\n--- Sample ${idx + 1}: [${p ? p.name : 'Unknown'}] ---`);
    console.log(`User: ${r.name} | Rating: ${r.rating}★`);
    console.log(`Title: ${r.title}`);
    console.log(`Comment: "${r.comment}"`);
  });
  await mongoose.connection.close();
}
test();
