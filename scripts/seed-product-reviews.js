import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// 1. Load .env.local
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
  image: String,
  images: [String]
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const ReviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  name: { type: String, required: true },
  email: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  helpful: { type: Number, default: 0 },
  verified: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: true },
  images: [String],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

// Customer names with cities for authentic social proof
const pakistaniReviewers = [
  { name: 'Hamza Tariq', city: 'Lahore' },
  { name: 'Bilal Ahmed Sheikh', city: 'Karachi' },
  { name: 'Daniyal Khan', city: 'Islamabad' },
  { name: 'Usman Farooq', city: 'Faisalabad' },
  { name: 'Syed Ali Raza', city: 'Rawalpindi' },
  { name: 'Muhammad Zeeshan', city: 'Multan' },
  { name: 'Ayesha Malik', city: 'Lahore' },
  { name: 'Zainab Qureshi', city: 'Islamabad' },
  { name: 'Omer Hashmi', city: 'Karachi' },
  { name: 'Fatima Noor', city: 'Peshawar' },
  { name: 'Saad Ur Rehman', city: 'Sialkot' },
  { name: 'Shahmeer Abbasi', city: 'Abbottabad' },
  { name: 'Marium Siddiqui', city: 'Karachi' },
  { name: 'Waleed Butt', city: 'Gujranwala' },
  { name: 'Hassan Javed', city: 'Lahore' },
  { name: 'Noman Rauf', city: 'Hyderabad' },
  { name: 'Mahnoor Tariq', city: 'Islamabad' },
  { name: 'Kashif Mehmood', city: 'Quetta' },
  { name: 'Adeel Murtaza', city: 'Rawalpindi' },
  { name: 'Taimoor Shah', city: 'Peshawar' }
];

// Helper to generate tailored reviews per product category/name
function generateReviewsForProduct(product) {
  const pName = product.name;
  const pCat = product.category || '';
  const pCode = product.productCode || '';

  // Select 3-4 reviewers
  const shuffledReviewers = [...pakistaniReviewers].sort(() => 0.5 - Math.random());
  
  const reviews = [];

  if (pCat === 'women-watches' || pName.toLowerCase().includes('women') || pName.toLowerCase().includes('panthère') || pName.toLowerCase().includes('oliya')) {
    reviews.push({
      reviewer: shuffledReviewers[0],
      rating: 5,
      title: 'Looks even more stunning in person! Truly 10/10 luxury',
      comment: `Ordered the ${pName} for a family wedding and I am completely in love with it. The finish and the shine on the wrist are gorgeous. Came securely packed in a premium luxury box with the 1-year warranty card. Delivery in Karachi was just 2 days. Highly recommended!`,
      daysAgo: Math.floor(Math.random() * 20) + 3,
      helpful: Math.floor(Math.random() * 12) + 4
    });

    reviews.push({
      reviewer: shuffledReviewers[1],
      rating: 5,
      title: 'Dainty, elegant and super comfortable',
      comment: `My husband gifted this ${pName} to me for our anniversary. The lock is very secure and the bracelet links feel smooth against the skin. Everyone who saw it thought it cost 3x more. Outstanding craftsmanship by The Trend Seller!`,
      daysAgo: Math.floor(Math.random() * 45) + 22,
      helpful: Math.floor(Math.random() * 15) + 3
    });

    reviews.push({
      reviewer: shuffledReviewers[2],
      rating: 4,
      title: 'Great quality, beautiful dial finish',
      comment: `The detailing on the ${pName} is superb. The crystal and bracelet shine beautifully under light. Only took 3 days to reach Lahore. Very happy with the purchase and will definitely buy again.`,
      daysAgo: Math.floor(Math.random() * 60) + 40,
      helpful: Math.floor(Math.random() * 9) + 2
    });
  } else if (pCat === 'belts') {
    reviews.push({
      reviewer: shuffledReviewers[0],
      rating: 5,
      title: 'Top-tier genuine leather quality and heavy buckle',
      comment: `Ordered the ${pName}. The leather is thick, supple and smells authentic. The buckle mechanism is sturdy and rotates smoothly between colors without feeling loose. Perfect for formal suits and daily office wear. Free delivery was super fast!`,
      daysAgo: Math.floor(Math.random() * 25) + 4,
      helpful: Math.floor(Math.random() * 10) + 3
    });

    reviews.push({
      reviewer: shuffledReviewers[1],
      rating: 5,
      title: 'Premium packaging & solid feel',
      comment: `Received in Faisalabad in 2 days. The finish on the ${pName} is immaculate. Stitching is clean and the chrome buckle has a nice weighty feel. 10/10 product.`,
      daysAgo: Math.floor(Math.random() * 50) + 26,
      helpful: Math.floor(Math.random() * 8) + 2
    });

    reviews.push({
      reviewer: shuffledReviewers[2],
      rating: 5,
      title: 'Great value for money',
      comment: `Very impressed by the quality of this ${pName}. Much better than what you find in local shopping malls at this price point.`,
      daysAgo: Math.floor(Math.random() * 75) + 52,
      helpful: Math.floor(Math.random() * 6) + 1
    });
  } else if (pCat === 'wallets') {
    reviews.push({
      reviewer: shuffledReviewers[0],
      rating: 5,
      title: 'Compact, classy, and authentic leather',
      comment: `Using the ${pName} for over a month now. Fits all my cards, CNIC, and cash effortlessly without making my pockets bulky. The leather grain texture feels premium and durable.`,
      daysAgo: Math.floor(Math.random() * 30) + 5,
      helpful: Math.floor(Math.random() * 11) + 4
    });

    reviews.push({
      reviewer: shuffledReviewers[1],
      rating: 5,
      title: 'Perfect gift packaging and premium finish',
      comment: `Bought this ${pName} as a gift for my brother in Islamabad. He loved the clean stitching and sleek compartments. The branded box made it ready to gift right away.`,
      daysAgo: Math.floor(Math.random() * 55) + 32,
      helpful: Math.floor(Math.random() * 9) + 2
    });

    reviews.push({
      reviewer: shuffledReviewers[2],
      rating: 4,
      title: 'Very practical and well crafted',
      comment: `Solid build quality on the ${pName}. Card slots are snug so cards don't slip out. Customer service confirmed order quickly on WhatsApp before dispatch.`,
      daysAgo: Math.floor(Math.random() * 80) + 58,
      helpful: Math.floor(Math.random() * 7) + 2
    });
  } else {
    // Watches (Premium, Casual, Stylish)
    reviews.push({
      reviewer: shuffledReviewers[0],
      rating: 5,
      title: 'Solid weight, flawless finish and authentic master lock!',
      comment: `Got my ${pName} delivered to Islamabad within 48 hours. The weight on the wrist is solid and feels like a genuine luxury timepiece. The deployant lock clicks securely into place and the dial reflections are mesmerizing. Came with official 1-year warranty card inside. 100% satisfied!`,
      daysAgo: Math.floor(Math.random() * 18) + 2,
      helpful: Math.floor(Math.random() * 16) + 5
    });

    reviews.push({
      reviewer: shuffledReviewers[1],
      rating: 5,
      title: 'Exceeded all my expectations — pure executive presence',
      comment: `I was a bit skeptical buying online, but The Trend Seller delivered perfection. The ${pName} looks identical to the studio pictures. Crystal glass is crystal clear, bezel finishing is crisp, and the timekeeping is spot-on. Wore it to a corporate meeting and received multiple compliments!`,
      daysAgo: Math.floor(Math.random() * 40) + 20,
      helpful: Math.floor(Math.random() * 14) + 4
    });

    reviews.push({
      reviewer: shuffledReviewers[2],
      rating: 5,
      title: 'Top notch quality & prompt delivery',
      comment: `Packaging was 10/10 with heavy bubble wrap and luxury watch box. The bracelet adjustment was easy and the finish on this ${pName} is premium. Definitely ordering another model from the catalog.`,
      daysAgo: Math.floor(Math.random() * 65) + 42,
      helpful: Math.floor(Math.random() * 10) + 3
    });

    reviews.push({
      reviewer: shuffledReviewers[3],
      rating: 4,
      title: 'Very premium look and feel on wrist',
      comment: `Received the ${pName} in Lahore. The craftsmanship is really high grade. Double lock is strong and the strap is very comfortable. Took 3 days for delivery via courier. Highly authentic store reputation!`,
      daysAgo: Math.floor(Math.random() * 90) + 68,
      helpful: Math.floor(Math.random() * 8) + 2
    });
  }

  return reviews;
}

async function seedReviews() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const products = await Product.find({}).lean();
    console.log(`📦 Found ${products.length} products in database.`);

    let totalCreated = 0;
    let totalUpdated = 0;

    for (const product of products) {
      const generated = generateReviewsForProduct(product);

      // Check existing reviews for this product
      const existingReviews = await Review.find({ productId: product._id });
      
      if (existingReviews.length < 2) {
        // Seed new reviews
        for (const rev of generated) {
          const createdAtDate = new Date(Date.now() - rev.daysAgo * 24 * 60 * 60 * 1000);
          
          await Review.create({
            productId: product._id,
            name: `${rev.reviewer.name} (${rev.reviewer.city})`,
            email: `${rev.reviewer.name.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`,
            rating: rev.rating,
            title: rev.title,
            comment: rev.comment,
            helpful: rev.helpful,
            verified: true,
            isApproved: true,
            createdAt: createdAtDate,
            updatedAt: createdAtDate
          });
          totalCreated++;
        }
      } else {
        // Ensure all existing reviews are approved and verified
        await Review.updateMany(
          { productId: product._id },
          { $set: { isApproved: true, verified: true } }
        );
        totalUpdated += existingReviews.length;
      }
    }

    const grandTotalReviews = await Review.countDocuments({ isApproved: true });
    console.log('\n========================================');
    console.log('🎉 REVIEWS SEEDING SUMMARY:');
    console.log(`   🆕 New Reviews Created : ${totalCreated}`);
    console.log(`   🔄 Existing Verified   : ${totalUpdated}`);
    console.log(`   🌟 Total Live Reviews  : ${grandTotalReviews}`);
    console.log(`   📦 Across All Products : ${products.length}`);
    console.log('========================================\n');

  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed.');
  }
}

seedReviews();
