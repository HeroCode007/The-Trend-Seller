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
  const Review = (await import('../models/Review.js')).default;
  const Product = (await import('../models/Product.js')).default;

  const rawProductId = 'oliya-emerald-cut-diamond-luxury';
  let targetId = null;
  if (mongoose.isValidObjectId(rawProductId)) {
    targetId = rawProductId;
  } else {
    const p = await Product.findOne({ $or: [{ slug: rawProductId }, { productCode: rawProductId }] }).select('_id').lean();
    if (p) targetId = p._id.toString();
  }

  console.log('Target Product ID:', targetId);

  try {
    const avg = await Review.getAverageRating(targetId);
    console.log('getAverageRating output:', avg);
  } catch (e) {
    console.error('getAverageRating failed:', e);
  }

  try {
    const dist = await Review.getRatingDistribution(targetId);
    console.log('getRatingDistribution output:', dist);
  } catch (e) {
    console.error('getRatingDistribution failed:', e);
  }

  await mongoose.connection.close();
}

test();
