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
  category: String
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
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

// Handcrafted authentic, human reviews specifically written for each individual product
const customProductReviews = {
  // === WOMEN WATCHES ===
  'oliya-emerald-cut-diamond-luxury': [
    {
      name: 'Marium Siddiqui (Karachi - Clifton)',
      rating: 5,
      title: 'Looks so graceful on eastern outfits!',
      comment: 'Got this yesterday. The emerald cut glass sparkles so nicely in indoor lighting and the green dial shade is deep and rich. My mom loved it so much she asked me to order one for her too. Very dainty and doesn’t feel heavy on wrist.',
      daysAgo: 2,
      helpful: 9
    },
    {
      name: 'Ayesha Daniyal (Islamabad - F-10)',
      rating: 5,
      title: 'Diamond cut bezel is gorgeous',
      comment: 'Wore it to my cousin valima and got at least 3 compliments. The lock is easy to open and close with one hand. Delivered in 2 days via Trax courier.',
      daysAgo: 14,
      helpful: 6
    },
    {
      name: 'Hina Tariq (Lahore - DHA)',
      rating: 5,
      title: 'Worth every rupee',
      comment: 'Bohot pyari watch hai exactly jese pictures me thi. Packaging was double bubble wrapped inside a solid box. 10/10 recommended for gifts.',
      daysAgo: 29,
      helpful: 4
    }
  ],

  'cartier-panthere-gold-edition': [
    {
      name: 'Fatima Noor (Peshawar)',
      rating: 5,
      title: 'Graceful jewelry watch',
      comment: 'The brick-link bracelet feels like soft silk on the wrist. The blue spinel crown adds that classic Cartier charm. Wore it for Eid and everyone loved it.',
      daysAgo: 8,
      helpful: 13
    },
    {
      name: 'Mahnoor Tariq (Islamabad)',
      rating: 5,
      title: 'Dainty and vintage',
      comment: 'Fits my small wrist perfectly without needing huge adjustments. Dial Roman numerals are crisp and clear.',
      daysAgo: 27,
      helpful: 7
    }
  ],

  'ieke-vintage-tank-burgundy-gold': [
    {
      name: 'Zainab Qureshi (Lahore)',
      rating: 5,
      title: 'Deep wine color strap is gorgeous',
      comment: 'The burgundy leather strap paired with the gold rectangular case has such old-money aesthetics. Looks fantastic with black abayas or formal kurtis.',
      daysAgo: 11,
      helpful: 9
    },
    {
      name: 'Sadia Imran (Karachi - Gulshan)',
      rating: 5,
      title: 'Elegant minimalism',
      comment: 'Very lightweight and chic. Leather strap is soft right out of the box and does not crack. Quick 2-day delivery.',
      daysAgo: 33,
      helpful: 5
    }
  ],

  'curren-blanche-silver-diamond-accent': [
    {
      name: 'Anum Zahid (Lahore - Wapda Town)',
      rating: 5,
      title: 'Clean minimalist silver dial',
      comment: 'The subtle diamond accent indices give just enough sparkle for office and college wear without being overly blingy. Mesh strap adjusts easily.',
      daysAgo: 6,
      helpful: 8
    },
    {
      name: 'Sara Khan (Rawalpindi)',
      rating: 5,
      title: 'Lightweight & comfortable',
      comment: 'Delivered in 2 days. The silver plating has a clean mirror finish. Doesn’t turn skin green or itch at all.',
      daysAgo: 25,
      helpful: 5
    }
  ],

  'mewear-diamond-faceted-crystal': [
    {
      name: 'Khadija Rizwan (Multan)',
      rating: 5,
      title: 'Crystal cut glass sparkles like a jewel',
      comment: 'The 3D faceted glass reflects ambient light beautifully whenever I move my hand. Magnet clasp is strong and snaps shut securely.',
      daysAgo: 10,
      helpful: 11
    },
    {
      name: 'Nimra Sheikh (Karachi)',
      rating: 4,
      title: 'Very pretty gift',
      comment: 'Bought this for my younger sister’s birthday. She loved the star dust shimmer inside the dial.',
      daysAgo: 40,
      helpful: 4
    }
  ],

  'michael-kors-parker': [
    {
      name: 'Dr. Rabia Khalid (Islamabad)',
      rating: 5,
      title: 'Pavé crystal bezel looks very authentic',
      comment: 'Double row of crystals around the dial looks super luxurious. The chronograph subdials look sharp and the two-tone chain has a solid weight.',
      daysAgo: 7,
      helpful: 12
    },
    {
      name: 'Zunaira Asif (Lahore)',
      rating: 5,
      title: 'Stunning wrist presence',
      comment: 'I usually don’t write reviews but this watch exceeded expectations. Box was sealed and watch was completely scratch-free.',
      daysAgo: 34,
      helpful: 7
    }
  ],

  'truworth-baguette-crystal-luxury': [
    {
      name: 'Sana Farhan (Faisalabad)',
      rating: 5,
      title: 'Baguette crystals look super high end',
      comment: 'Baguette cut crystals catch light differently than round ones, looks very modern European. Clasp is tight and doesn’t slip.',
      daysAgo: 12,
      helpful: 9
    },
    {
      name: 'Bushra Tariq (Karachi)',
      rating: 5,
      title: 'Looks like real diamond jewelry',
      comment: 'Wore it to an engagement party. Everyone thought it was expensive bridal jewelry. Truly 10/10.',
      daysAgo: 42,
      helpful: 6
    }
  ],

  'gucci-109': [
    {
      name: 'Alizeh Shah (Islamabad)',
      rating: 5,
      title: 'Super slender bangle style watch',
      comment: 'Looks more like an Italian designer bracelet than a watch. Slim rectangular case with subtle Gucci green-red motif details.',
      daysAgo: 15,
      helpful: 8
    },
    {
      name: 'Iqra Noor (Lahore)',
      rating: 5,
      title: 'Chic and lightweight',
      comment: 'Perfect for dinner dates and formal evenings. Doesn’t snag on chiffon dupattas.',
      daysAgo: 38,
      helpful: 5
    }
  ],

  // === COMBOS & COUPLE SETS ===
  'timeless-together-couple-combo': [
    {
      name: 'Adeel & Hira Murtaza (Rawalpindi)',
      rating: 5,
      title: 'Perfect matching anniversary gift set',
      comment: 'Ordered this couple set for our 3rd wedding anniversary. Both the men’s and women’s pieces look identical in quality and came packaged together in a luxury velvet gift box. We both wear them to family gatherings!',
      daysAgo: 4,
      helpful: 18
    },
    {
      name: 'Bilal Ahmed (Lahore - Cantt)',
      rating: 5,
      title: 'Huge value for 2 watches',
      comment: 'Getting 2 premium matching watches at this price is an absolute steal. Gents watch has great weight and ladies piece is sleek and graceful.',
      daysAgo: 22,
      helpful: 11
    }
  ],

  // === POPULAR MEN'S PREMIUM & CASUAL WATCHES ===
  'arabic-aura': [
    {
      name: 'Hamza Farooq (Lahore - Johar Town)',
      rating: 5,
      title: 'Super lightweight & looks aesthetic',
      comment: 'The all-black stealth look with Arabic numbers looks so minimalist. Weight is barely noticeable on wrist, perfect for daily gym and university use. Best 2k spend this month.',
      daysAgo: 4,
      helpful: 12
    },
    {
      name: 'Syed Ali Raza (Rawalpindi)',
      rating: 5,
      title: 'Simple, clean and durable',
      comment: 'Dial is clear and easy to read. Chain is light fiber build so it never pulls wrist hair. Rider called before delivery on COD. Satisfied!',
      daysAgo: 18,
      helpful: 8
    },
    {
      name: 'Zeeshan Malik (Faisalabad)',
      rating: 4,
      title: 'Good value for money',
      comment: 'Watch is very lightweight as described. TCS took 4 days due to weekend, but product condition was flawless.',
      daysAgo: 42,
      helpful: 5
    }
  ],

  'sabr-arabic-dial-minimalist': [
    {
      name: 'Usman Ghani (Peshawar)',
      rating: 5,
      title: 'Deep spiritual aesthetics with SABR calligraphy',
      comment: 'The SABR Arabic calligraphy in the center with minimalist hour markers is simply beautiful. Leather strap is soft on the skin and buckle has a clean matte coat.',
      daysAgo: 5,
      helpful: 13
    },
    {
      name: 'Daniyal Noman (Karachi)',
      rating: 5,
      title: 'Meaningful everyday watch',
      comment: 'Constantly reminds me of patience throughout a hectic workday. Slim case slides easily under long sleeve cuffs.',
      daysAgo: 26,
      helpful: 9
    }
  ],

  'royal-square-titanium': [
    {
      name: 'Daniyal Khan (Islamabad)',
      rating: 5,
      title: 'Industrial look with solid build quality',
      comment: 'The square titanium finish gives such an AP style rugged presence. Strap sits flat on the wrist and the bezel finishing is very crisp. Got it delivered in 48 hours.',
      daysAgo: 5,
      helpful: 14
    },
    {
      name: 'Adeel Murtaza (Karachi - PECHS)',
      rating: 5,
      title: 'Heads turn every time I wear it',
      comment: 'Real talk: the case brushing and angles look much better in hand than in photos. Heavy masculine feel without being uncomfortable.',
      daysAgo: 24,
      helpful: 11
    }
  ],

  'rolex-daytona-leather': [
    {
      name: 'Bilal Ahmed Sheikh (Karachi)',
      rating: 5,
      title: 'Subdials and ceramic bezel look top notch',
      comment: 'Chronograph pushers have a satisfying tactile click. The black dial with contrasting subdials looks super sharp with black suit. Very happy with the quality.',
      daysAgo: 7,
      helpful: 15
    },
    {
      name: 'Shahmeer Abbasi (Abbottabad)',
      rating: 5,
      title: 'Executive presence',
      comment: 'Gave this to my elder brother on his promotion, he genuinely thought I bought it from an overseas boutique. Strap quality is soft and comfortable.',
      daysAgo: 31,
      helpful: 9
    },
    {
      name: 'Waleed Butt (Gujranwala)',
      rating: 4,
      title: 'Great piece, slight chain adjustment needed',
      comment: 'Took out 2 links from local shop for 50 rupees, now it fits like a glove. Solid weight and smooth sweeping appearance.',
      daysAgo: 56,
      helpful: 7
    }
  ],

  'rolex-daytona-silver': [
    {
      name: 'Omer Hashmi (Lahore - Model Town)',
      rating: 5,
      title: 'Silver shine is immaculate',
      comment: 'The diamond bezel reflects light subtly without looking too flashy. Clasp lock snaps tightly and doesn’t pop open accidentally. 10/10.',
      daysAgo: 9,
      helpful: 10
    },
    {
      name: 'Kashif Mehmood (Quetta)',
      rating: 5,
      title: 'Fast COD delivery to Quetta',
      comment: 'Usually deliveries take a week here, but received in 4 days. Watch was in mint condition inside the hard case.',
      daysAgo: 38,
      helpful: 6
    }
  ],

  'rolex-daytona-tiger': [
    {
      name: 'Kamran Alvi (Multan)',
      rating: 5,
      title: 'Exotic tiger stripe dial layout',
      comment: 'The golden tiger pattern with black lacquer inserts looks beastly. Heavy gold-tone casing with diamond indices.',
      daysAgo: 13,
      helpful: 12
    },
    {
      name: 'Shahzaib Raza (Lahore)',
      rating: 5,
      title: 'Bold collector’s piece',
      comment: 'Rubber strap makes it comfortable to wear despite the chunky gold case. Definitely a conversation starter.',
      daysAgo: 45,
      helpful: 7
    }
  ],

  'tissot-prx-powermatic-80': [
    {
      name: 'Muhammad Saad (Islamabad - G-11)',
      rating: 5,
      title: 'Waffle dial texture is 10/10',
      comment: 'The integrated bracelet tapers down so smoothly on the wrist. Light catches the brushed links and waffle dial in an unbelievable way. Best everyday watch in this budget.',
      daysAgo: 3,
      helpful: 19
    },
    {
      name: 'Usman Farooq (Lahore)',
      rating: 5,
      title: 'Vintage 70s aesthetic done right',
      comment: 'Butterfly clasp feels sturdy and seamless when closed. Super comfortable for all-day office wear with rolled up sleeves.',
      daysAgo: 21,
      helpful: 12
    }
  ],

  'seastar-integrated-prx-twotone-blue': [
    {
      name: 'Fahad Tariq (Karachi)',
      rating: 5,
      title: 'Two tone gold & steel with sunray blue',
      comment: 'The gold fluted accents against the deep blue dial give this watch a rich vintage look. Integrated bracelet feels like high grade steel.',
      daysAgo: 5,
      helpful: 11
    },
    {
      name: 'Zubair Ansari (Lahore)',
      rating: 5,
      title: 'Very comfortable taper',
      comment: 'Brushed center links look fantastic in daylight. Quick delivery in 48 hours.',
      daysAgo: 29,
      helpful: 6
    }
  ],

  'audemars-piguet-royal-oak-rose-gold': [
    {
      name: 'Fahad Tariq (Karachi - Defence)',
      rating: 5,
      title: 'Heavy weight, rose gold tone is not brassy',
      comment: 'Often replica rose gold looks yellowish or cheap, but this one has that deep copper luxury tone. Octagonal bezel screws are aligned cleanly. Real head-turner at formal dinners.',
      daysAgo: 6,
      helpful: 17
    },
    {
      name: 'Noman Rauf (Hyderabad)',
      rating: 5,
      title: 'Pure royalty on hand',
      comment: 'The Grande Tapisserie waffle dial pattern gives huge depth. Double deployant clasp locks with a solid click.',
      daysAgo: 35,
      helpful: 8
    }
  ],

  'ap-royal-oak': [
    {
      name: 'Sheroz Khan (Lahore)',
      rating: 5,
      title: 'Classic steel sports watch icon',
      comment: 'Brushed vertical bezel lines and polished bevels are crisp. Sits comfortably flat and has that unmistakable AP silhouette.',
      daysAgo: 8,
      helpful: 14
    },
    {
      name: 'Adeel Murtaza (Rawalpindi)',
      rating: 5,
      title: 'Solid steel bracelet',
      comment: 'No rattling links. Clasp has a firm double release mechanism.',
      daysAgo: 32,
      helpful: 8
    }
  ],

  'cartier-tank-must-gold': [
    {
      name: 'Hassan Javed (Lahore - Cantt)',
      rating: 5,
      title: 'Classic rectangular dress watch',
      comment: 'If you wear suits or crisp white shirts, this watch completes the look. The gold plating is smooth and the black leather strap has clean white stitching.',
      daysAgo: 10,
      helpful: 11
    },
    {
      name: 'Adeel Qasim (Rawalpindi)',
      rating: 4,
      title: 'Timeless look, strap took 2 days to soften',
      comment: 'Strap was a bit stiff on day one but became very supple after two days of wearing. Dial is pristine and crown blue stone looks rich.',
      daysAgo: 45,
      helpful: 6
    }
  ],

  'cartier-a-grade-tank-leather': [
    {
      name: 'Dr. Arsalan Baig (Karachi)',
      rating: 5,
      title: 'Old money elegance at its finest',
      comment: 'Clean Roman numerals with blued steel-style hands. Rectangular case is thin and slips effortlessly under French cuff shirts.',
      daysAgo: 9,
      helpful: 13
    },
    {
      name: 'Babar Azim (Islamabad)',
      rating: 5,
      title: 'Subtle and sophisticated',
      comment: 'Doesn’t shout for attention like oversized chronos, pure quiet luxury. High quality leather band.',
      daysAgo: 36,
      helpful: 7
    }
  ],

  'cartier-1st-grade': [
    {
      name: 'Waqas Munir (Sialkot)',
      rating: 5,
      title: 'Heavy grade steel casing & sapphire cabochon',
      comment: 'Crown features the signature blue cabochon gem. Weight feels substantial and the dial railway minute track is super sharp.',
      daysAgo: 11,
      helpful: 10
    }
  ],

  'rado-true-square-automatic-black-ceramic': [
    {
      name: 'Taimoor Shah (Peshawar - University Town)',
      rating: 5,
      title: 'Ceramic gloss & skeleton dial are stunning',
      comment: 'High tech ceramic doesn’t scratch against laptop corners or desks. The open skeleton balance wheel moving back and forth is hypnotic to look at. Premium feel.',
      daysAgo: 12,
      helpful: 16
    },
    {
      name: 'Kamran Alvi (Multan)',
      rating: 5,
      title: 'Solid craftsmanship',
      comment: 'Titanium clasp mechanism is very smooth. Watch feels cold and premium when you first put it on. Worth the price.',
      daysAgo: 48,
      helpful: 9
    }
  ],

  'omega-seamaster-aqua-terra-worldtimer': [
    {
      name: 'Dr. Arsalan Baig (Karachi)',
      rating: 5,
      title: 'The laser-etched earth dial is a masterpiece',
      comment: 'The center Earth disk and 24-hour ring look unbelievable in person. Solid hefty case with blue rubber/steel strap combo. Feels like a 50k watch.',
      daysAgo: 15,
      helpful: 21
    },
    {
      name: 'Shahzaib Lodhi (Islamabad)',
      rating: 5,
      title: 'Intricate details & heavy weight',
      comment: 'Hands and indices have great depth. Received inside the luxury velvet box with warranty card. 100% genuine seller reputation.',
      daysAgo: 50,
      helpful: 11
    }
  ],

  'iced-out-skeleton-chronograph-diamond': [
    {
      name: 'Sheroz Khan (Lahore - Gulberg)',
      rating: 5,
      title: 'Full bling factor for weddings and events',
      comment: 'Every stone is set tight without any crooked gaps. In dim event lights, the wrist catches every strobe light. If you like making a loud statement, this is it.',
      daysAgo: 13,
      helpful: 14
    },
    {
      name: 'Rehan Siddiq (Karachi)',
      rating: 5,
      title: 'Heavy and eye catching',
      comment: 'Skeleton dial with crystal casing looks crazy unique. People keep asking where I got it from.',
      daysAgo: 39,
      helpful: 8
    }
  ],

  'bestwin-diamond-index-twotone-blue': [
    {
      name: 'Taha Nadeem (Lahore)',
      rating: 5,
      title: 'Royal blue sunburst and gold fluted bezel',
      comment: 'Looks far more luxurious than what it costs. Jubilee style bracelet is flexible and comfortable for 12 hours straight.',
      daysAgo: 7,
      helpful: 9
    },
    {
      name: 'Rashid Khan (Peshawar)',
      rating: 5,
      title: 'Diamond indices shine bright',
      comment: 'Date window magnification is clear. Came with adjustment tool in box.',
      daysAgo: 31,
      helpful: 5
    }
  ],

  'rolex-datejust-twotone-royal-blue-diamond': [
    {
      name: 'Waqas Munir (Sialkot)',
      rating: 5,
      title: 'Royal blue sunburst dial is unbelievable',
      comment: 'Under sunlight the blue dial shines from navy to electric blue. Fluted bezel reflects like diamonds. Jubilee bracelet is super flexible and comfortable.',
      daysAgo: 4,
      helpful: 13
    },
    {
      name: 'Zubair Ansari (Lahore)',
      rating: 5,
      title: 'Magnifier cyclops is crystal clear',
      comment: 'Date window magnification is sharp. Double lock clasp works great. Fast delivery within 48h.',
      daysAgo: 26,
      helpful: 7
    }
  ],

  'rolex-datejust-rose-gold-zr-edition': [
    {
      name: 'Murtaza Hashmi (Islamabad)',
      rating: 5,
      title: 'Warm rose gold tone with jubilee chain',
      comment: 'The rose gold color looks very natural, not cheap brassy. Jubilee chain wraps around wrist effortlessly without hair pulling. 5 stars.',
      daysAgo: 16,
      helpful: 10
    },
    {
      name: 'Hamza Nisar (Rawalpindi)',
      rating: 5,
      title: 'Authentic feel and good weight',
      comment: 'Wore it to my graduation ceremony. Solid build and looks very high end in photos.',
      daysAgo: 52,
      helpful: 6
    }
  ],

  'rolex-datejust-classic': [
    {
      name: 'Bilal Ahmed Sheikh (Karachi)',
      rating: 5,
      title: 'Fluted bezel & oystersteel bracelet shine',
      comment: 'Clean silver-steel finish. The fluted bezel cuts the light sharply. Very reliable daily timepiece.',
      daysAgo: 8,
      helpful: 12
    },
    {
      name: 'Adeel Murtaza (Rawalpindi)',
      rating: 5,
      title: 'Signature crown deployant lock',
      comment: 'Oyster clasp feels solid. Timekeeping is precise down to the minute.',
      daysAgo: 33,
      helpful: 7
    }
  ],

  'rolex-datejust-blue-steel': [
    {
      name: 'Daniyal Khan (Islamabad)',
      rating: 5,
      title: 'Navy sunburst dial in all-steel casing',
      comment: 'Under indoor fluorescent lights it looks deep midnight blue, in daylight it turns vivid royal blue. Truly stunning.',
      daysAgo: 10,
      helpful: 14
    }
  ],

  'rolex-datejust-gold': [
    {
      name: 'Shahzaib Raza (Lahore)',
      rating: 5,
      title: 'Rich presidential gold finish',
      comment: 'Champagne dial with gold fluted bezel. Heavy wrist presence for formal dinners and family weddings.',
      daysAgo: 12,
      helpful: 11
    }
  ],

  'rolex-datejust-computer-monogram': [
    {
      name: 'Junaid Afzal (Karachi)',
      rating: 5,
      title: 'Laser etched ROLEX computer dial texture',
      comment: 'The repeated laser monogram across the dial adds so much depth up close. Very unique dial variant.',
      daysAgo: 14,
      helpful: 9
    }
  ],

  'rolex-gmt-master-ii': [
    {
      name: 'Junaid Afzal (Karachi - DHA)',
      rating: 5,
      title: 'Ceramic bezel rotates smoothly with crisp clicks',
      comment: 'Two-color ceramic bezel split is seamless. The extra GMT hand looks awesome. Oyster bracelet has solid links with no hollow rattling sound.',
      daysAgo: 7,
      helpful: 18
    },
    {
      name: 'Babar Azim (Lahore)',
      rating: 5,
      title: 'My new daily driver',
      comment: 'Been wearing it for 3 weeks straight to office. Keeps accurate time and looks masculine with dark shirts.',
      daysAgo: 34,
      helpful: 10
    }
  ],

  'rolex-skydweller-matte-black': [
    {
      name: 'Saqib Mehmood (Faisalabad)',
      rating: 5,
      title: 'Matte black dial gives stealth vibes',
      comment: 'The fluted bezel and off-center 24h disc give a very distinctive dial layout. Substantial wrist presence.',
      daysAgo: 19,
      helpful: 8
    },
    {
      name: 'Ahsan Qureshi (Multan)',
      rating: 4,
      title: 'Heavy watch, looks great',
      comment: 'Quite a thick case which I personally like. Fast COD service and polite courier rider.',
      daysAgo: 60,
      helpful: 4
    }
  ],

  'rolex-land-dweller': [
    {
      name: 'Waleed Butt (Gujranwala)',
      rating: 5,
      title: 'Rugged luxury sports presence',
      comment: 'Solid brushed bezel with polished bevels. Lume on hands glows clearly in dark environments.',
      daysAgo: 11,
      helpful: 8
    }
  ],

  'rolex-oyster-yacht-master': [
    {
      name: 'Taimoor Shah (Peshawar)',
      rating: 5,
      title: 'Embossed matte sandblasted bezel numerals',
      comment: 'The raised polished numbers over the matte bezel look incredible. Oysterflex style strap is comfortable in humid weather.',
      daysAgo: 9,
      helpful: 10
    }
  ],

  'rolex-yacht': [
    {
      name: 'Omer Hashmi (Karachi)',
      rating: 5,
      title: 'All-black stealth Yacht-Master',
      comment: 'Matte ceramic bezel with gloss numerals. Curved lugs sit comfortably around wrist bones.',
      daysAgo: 15,
      helpful: 9
    }
  ],

  'tag-heuer-aquaracer-calibre-5-gmt': [
    {
      name: 'Dr. Tariq Mehmood (Islamabad)',
      rating: 5,
      title: 'Horizontal teak dial lines and ceramic bezel',
      comment: 'Dodecagonal 12-sided bezel turns with authoritative clicks. Magnifier lens over 6 o’clock date window is spot-on.',
      daysAgo: 8,
      helpful: 14
    },
    {
      name: 'Hamza Farooq (Lahore)',
      rating: 5,
      title: 'High grade diver aesthetic',
      comment: 'Lume is super bright blue and green. High quality steel bracelet with micro adjustment.',
      daysAgo: 37,
      helpful: 8
    }
  ],

  'tag-heur-calibre-1969-original': [
    {
      name: 'Shahrukh Khan (Lahore)',
      rating: 5,
      title: 'Motorsport heritage chronograph',
      comment: 'Crown on the left side and pushers on the right give it that true vintage racing vibe. Solid heavy construction.',
      daysAgo: 16,
      helpful: 12
    }
  ],

  'tag-heur-carrera': [
    {
      name: 'Adeel Murtaza (Rawalpindi)',
      rating: 5,
      title: 'Clean chronograph tachymeter bezel',
      comment: 'Subdials are well proportioned and pushers respond with a click. Excellent daily wear watch.',
      daysAgo: 12,
      helpful: 9
    }
  ],

  'hublot-classic-fusion-casual': [
    {
      name: 'Asad Ullah (Islamabad)',
      rating: 5,
      title: 'Slim profile with titanium style H-screws',
      comment: 'H-screws on the bezel give that unmistakable Hublot DNA. Rubber backed leather strap means no sweat stains in summer. Very smart.',
      daysAgo: 8,
      helpful: 12
    },
    {
      name: 'Danish Riaz (Lahore - Wapda Town)',
      rating: 5,
      title: 'Extremely comfortable strap',
      comment: 'Doesn’t pinch the skin even after 10 hours of continuous wear. Dial sunray finish is subtle and classy.',
      daysAgo: 37,
      helpful: 7
    }
  ],

  'hublot-chrono': [
    {
      name: 'Bilal Ahmed (Karachi)',
      rating: 5,
      title: 'Big Bang bold blue dial',
      comment: 'Chunky architectural case with blue textured rubber strap. Very sporty for casual jeans & polo shirts.',
      daysAgo: 10,
      helpful: 10
    }
  ],

  'hublot-meca': [
    {
      name: 'Daniyal Khan (Islamabad)',
      rating: 5,
      title: 'Industrial skeleton movement aesthetic',
      comment: 'Open gears and power reserve indicator styling look very futuristic. Rubber strap has the signature Hublot ribbed texture.',
      daysAgo: 14,
      helpful: 11
    }
  ],

  'hublot-meca-white-ceramic': [
    {
      name: 'Fahad Aslam (Lahore)',
      rating: 5,
      title: 'Crisp white ceramic casing',
      comment: 'White case with contrast black H-screws looks super clean. High scratch resistance.',
      daysAgo: 18,
      helpful: 8
    }
  ],

  'patek-philippe-nautilus': [
    {
      name: 'Daniyal Jahangir (Karachi)',
      rating: 5,
      title: 'Iconic porthole case shape',
      comment: 'Horizontal embossed dial lines give so much character. The rounded octagonal bezel sits flat and slim against the wrist. Pure sophistication.',
      daysAgo: 5,
      helpful: 20
    },
    {
      name: 'Suleman Ghani (Rawalpindi)',
      rating: 5,
      title: 'Double deployant clasp is very secure',
      comment: 'Brushed and polished alternating finishes on the bracelet are executed with precision. Excellent piece.',
      daysAgo: 41,
      helpful: 11
    }
  ],

  'patek-philippe-nautilus-classic': [
    {
      name: 'Dr. Arsalan Baig (Karachi)',
      rating: 5,
      title: 'Classic blue dial Nautilus',
      comment: 'Gradient blue-black sunburst dial is unmatched. Sits low on wrist and slides under cuff effortlessly.',
      daysAgo: 9,
      helpful: 15
    }
  ],

  'patek-phillipe-nautilus-strap': [
    {
      name: 'Adeel Hashmi (Islamabad)',
      rating: 5,
      title: 'Leather strap version of the Nautilus',
      comment: 'Leather strap integrates into the case hinges seamlessly. Very dressy and comfortable.',
      daysAgo: 13,
      helpful: 9
    }
  ],

  'rm-35': [
    {
      name: 'Shahrukh Khan (Lahore - DHA)',
      rating: 5,
      title: 'Futuristic tonneau curve and skeleton gear look',
      comment: 'The curved back fits the curvature of the wrist naturally. Bright accents and skeletonized bridges make it look like a supercar on your wrist.',
      daysAgo: 14,
      helpful: 15
    },
    {
      name: 'Nabeel Ahmed (Karachi)',
      rating: 5,
      title: 'Rubber strap is super supple',
      comment: 'Lightweight despite the bold size. Perfect for sports cars enthusiasts and casual weekend wear.',
      daysAgo: 44,
      helpful: 9
    }
  ],

  'gucci-g-timeless-grip': [
    {
      name: 'Zeeshan Haider (Islamabad)',
      rating: 5,
      title: 'Super quirky roulette window display',
      comment: 'Instead of hands it has rotating discs showing hour, minute and date through little windows. Definitely an artsy conversation starter.',
      daysAgo: 17,
      helpful: 12
    },
    {
      name: 'Haris Javaid (Lahore)',
      rating: 5,
      title: 'Clean engraved monogram finish',
      comment: 'Cushion case with engraved interlocking GG pattern is very unique. Good solid lock.',
      daysAgo: 49,
      helpful: 6
    }
  ],

  'trove-diamond-faceted-royal-blue': [
    {
      name: 'Fahim Abbas (Multan)',
      rating: 5,
      title: 'Geometric prism glass reflection',
      comment: 'The crystal is cut with angular facets like a gemstone. When light hits it from different angles, the blue dial creates geometric patterns. Very cool effect.',
      daysAgo: 9,
      helpful: 11
    },
    {
      name: 'Arham Sheikh (Sialkot)',
      rating: 4,
      title: 'Attractive design, fits well',
      comment: 'Looks more expensive than 3.5k. Mesh/chain strap is easily adjustable at home without tools.',
      daysAgo: 36,
      helpful: 5
    }
  ],

  'denvosi-franck-muller-white-ice': [
    {
      name: 'Hamza Tariq (Lahore)',
      rating: 5,
      title: 'Curvex tonneau case with exploded numerals',
      comment: 'The curved tonneau case wraps around wrist bones comfortably. Arabic exploded font style is unmistakable Franck Muller.',
      daysAgo: 11,
      helpful: 10
    }
  ],

  'fm-diamond-collection': [
    {
      name: 'Sheroz Khan (Lahore)',
      rating: 5,
      title: 'Pave set stones and vibrant dial numbers',
      comment: 'Stones are paved across the whole bezel. Real showstopper for evening receptions.',
      daysAgo: 16,
      helpful: 12
    }
  ],

  'forches-blue-diamond': [
    {
      name: 'Usman Farooq (Faisalabad)',
      rating: 5,
      title: 'Deep sapphire blue dial with diamond indices',
      comment: 'The dial color has a mesmerizing depth. Heavy steel casing with solid butterfly deployant clasp.',
      daysAgo: 10,
      helpful: 9
    }
  ],

  'pierre-cardin-epinettes': [
    {
      name: 'Daniyal Lodhi (Rawalpindi)',
      rating: 5,
      title: 'Minimalist French Parisian styling',
      comment: 'Ultra slim case and clean dial markers. Perfect everyday watch for office shirts and linen suits.',
      daysAgo: 12,
      helpful: 8
    }
  ],

  'tomi-cushion-case-navy-blue': [
    {
      name: 'Bilal Javed (Islamabad)',
      rating: 5,
      title: 'Retro cushion case with textured leather',
      comment: 'Rounded square cushion case gives a nice 60s vintage vibe. Blue dial with cream hands is very readable.',
      daysAgo: 8,
      helpful: 9
    }
  ],

  'tissot-silicum-strap': [
    {
      name: 'Kashif Nazir (Karachi)',
      rating: 5,
      title: 'Smooth silicon strap with sports chronograph',
      comment: 'Silicon strap is waterproof and sweatproof for workouts and rainy season. Solid pushers and clear dial.',
      daysAgo: 14,
      helpful: 10
    }
  ],

  'universe-point-frosted-octagonal': [
    {
      name: 'Zubair Ansari (Lahore)',
      rating: 5,
      title: 'Frosted shimmer finish across bezel and bracelet',
      comment: 'The micro-hammered frosted steel shimmers subtly like diamond dust without any real stones. Very unique texture in hand.',
      daysAgo: 7,
      helpful: 13
    }
  ],

  'universe-point-two-tone-silver': [
    {
      name: 'Muhammad Saad (Islamabad)',
      rating: 5,
      title: 'Two tone brushed and polished luxury finish',
      comment: 'Solid weight and great finish on the links. Butterfly clasp opens smoothly.',
      daysAgo: 15,
      helpful: 8
    }
  ],

  'tubular-emerald-chronograph': [
    {
      name: 'Taha Nadeem (Karachi)',
      rating: 5,
      title: 'Deep emerald green dial is mesmerizing',
      comment: 'Green and gold combination is rich. Chronograph pushers work smoothly and the leather strap has a solid vintage feel.',
      daysAgo: 11,
      helpful: 10
    },
    {
      name: 'Rashid Khan (Peshawar)',
      rating: 5,
      title: 'Hefty and bold',
      comment: 'Large dial size suits broad wrists. Dial glass has great scratch resistance. Recommended.',
      daysAgo: 47,
      helpful: 7
    }
  ],

  'tubular-classic-vintage-quartz': [
    {
      name: 'Waleed Akram (Faisalabad)',
      rating: 5,
      title: 'Clean vintage dial with domed glass',
      comment: 'Slightly domed crystal glass gives vintage reflections. Genuine leather band is soft on the wrist.',
      daysAgo: 13,
      helpful: 8
    }
  ],

  'tubular-tachymeter-ana-digi': [
    {
      name: 'Adeel Hashmi (Rawalpindi)',
      rating: 5,
      title: 'Dual analog and digital displays',
      comment: 'Backlight digital screen inside the analog dial is super handy for night time. Rugged bezel and heavy casing.',
      daysAgo: 17,
      helpful: 9
    }
  ],

  // === BELTS ===
  'hermes-h-buckle-reversible-black-tan': [
    {
      name: 'Usman Farooq (Lahore - Gulberg)',
      rating: 5,
      title: 'Reversible buckle mechanism rotates with ease',
      comment: 'One side is rich black and the other is warm tan brown. Just pull and twist the H-buckle to switch colors. Genuine thick leather that doesn’t crease or peel. Replaced two separate belts for me.',
      daysAgo: 6,
      helpful: 15
    },
    {
      name: 'Bilal Qureshi (Karachi)',
      rating: 5,
      title: 'Gold H-buckle has a heavy mirror finish',
      comment: 'The buckle has substantial weight and zero tarnishing. Comes with hole puncher and branded dust bag. 10/10 quality.',
      daysAgo: 30,
      helpful: 9
    }
  ],

  'gucci-belt-black-snake-edition': [
    {
      name: 'Hamza Sheikh (Islamabad)',
      rating: 5,
      title: 'Matte black interlocking buckle with snake motif',
      comment: 'Leather has that textured grain feel. Stitching along the edges is neat with no loose threads. Fits my 34 waist comfortably.',
      daysAgo: 13,
      helpful: 11
    },
    {
      name: 'Daniyal Lodhi (Rawalpindi)',
      rating: 5,
      title: 'Great casual belt for jeans',
      comment: 'Solid buckle pin doesn’t slip. Packaging was intact and delivery was quick.',
      daysAgo: 46,
      helpful: 6
    }
  ],

  'louis-vuitton-initiales-damier-graphite-belt': [
    {
      name: 'Shahzaib Raza (Lahore)',
      rating: 5,
      title: 'Checkerboard pattern is very crisp',
      comment: 'Damier graphite pattern has that modern charcoal grey aesthetic. LV buckle has a clean brushed finish. Excellent belt for black trousers and chinos.',
      daysAgo: 10,
      helpful: 14
    },
    {
      name: 'Waleed Akram (Faisalabad)',
      rating: 4,
      title: 'Sturdy leather, good packaging',
      comment: 'Buckle is slightly heavy which feels durable. Leather is rigid initially but breaks in nicely within a week.',
      daysAgo: 54,
      helpful: 8
    }
  ],

  'montblanc-reversible-classic-leather-belt': [
    {
      name: 'Dr. Tariq Mehmood (Islamabad - F-7)',
      rating: 5,
      title: 'The ultimate formal office belt',
      comment: 'Subtle rounded horseshoe buckle with the Montblanc emblem. Perfect width for suit pants loops. Reverses smoothly between black and brown.',
      daysAgo: 8,
      helpful: 13
    },
    {
      name: 'Kashif Nazir (Karachi)',
      rating: 5,
      title: 'Clean and dignified design',
      comment: 'Doesn’t scream logos, very understated and gentlemanly. Leather quality is top notch.',
      daysAgo: 38,
      helpful: 7
    }
  ],

  'bally-striped-leather-formal-belt': [
    {
      name: 'Murtaza Ali (Multan)',
      rating: 5,
      title: 'Iconic red and white trainspotting stripe',
      comment: 'Gives a sporty yet refined touch to navy chinos and linen shirts. Buckle chrome finish is very high grade.',
      daysAgo: 18,
      helpful: 9
    }
  ],

  'ferragamo-gancini-reversible-black-brown-belt': [
    {
      name: 'Adeel Murtaza (Rawalpindi)',
      rating: 5,
      title: 'Double Gancini buckle looks sharp',
      comment: 'Two tone functionality means I only packed this one belt for my 4-day business trip to Karachi. Leather smell is authentic.',
      daysAgo: 22,
      helpful: 10
    }
  ],

  'reversible-dress-belt': [
    {
      name: 'Daniyal Khan (Islamabad)',
      rating: 5,
      title: 'Twist buckle makes switching colors instant',
      comment: 'Both black and chocolate brown sides have smooth grain leather. Fits suit trousers perfectly without curling.',
      daysAgo: 9,
      helpful: 11
    }
  ],

  // === WALLETS ===
  'brown-leather-card-holder': [
    {
      name: 'Syed Hamza (Lahore - Model Town)',
      rating: 5,
      title: 'Slim enough for front pocket',
      comment: 'Holds 6 essential cards plus some folded currency in the central slot. No more bulging back pockets while sitting or driving. Leather has a nice rustic patina.',
      daysAgo: 5,
      helpful: 12
    },
    {
      name: 'Zubair Khan (Islamabad)',
      rating: 5,
      title: 'Tight card slots, cards don’t fall out',
      comment: 'Cards stay secure even when flipped upside down. Clean edge finishing.',
      daysAgo: 28,
      helpful: 6
    }
  ],

  'crocodile-style-wallet': [
    {
      name: 'Rehan Qureshi (Karachi - North Nazimabad)',
      rating: 5,
      title: 'Deep croc texture and ample compartments',
      comment: 'Has a dedicated transparent CNIC window, multiple card slots, and dual cash dividers so I can keep receipts separate from rupees. Durable feel.',
      daysAgo: 9,
      helpful: 11
    },
    {
      name: 'Usman Ghani (Peshawar)',
      rating: 5,
      title: 'Solid build quality',
      comment: 'Gifted to my father on his retirement. He was very impressed by the leather embossing and gift box presentation.',
      daysAgo: 43,
      helpful: 7
    }
  ],

  'gucci-card-holder': [
    {
      name: 'Fahad Aslam (Lahore - DHA)',
      rating: 5,
      title: 'Minimalist luxury card wallet',
      comment: 'Compact, classy, fits easily inside shirt or jacket pocket. The emblem is cleanly pinned and stitching is uniform.',
      daysAgo: 12,
      helpful: 10
    },
    {
      name: 'Bilal Javed (Islamabad)',
      rating: 4,
      title: 'Very practical for daily use',
      comment: 'Fits debit card, credit card, driving license and driving registration card effortlessly. Highly recommended.',
      daysAgo: 39,
      helpful: 5
    }
  ],

  'leather-bi-fold-wallet': [
    {
      name: 'Adeel Hashmi (Rawalpindi)',
      rating: 5,
      title: 'Traditional bifold with modern slimness',
      comment: 'Doesn’t get thick like typical local wallets. Real leather that feels smooth in hand. Fits all Pakistani currency notes without folding or sticking out.',
      daysAgo: 14,
      helpful: 8
    },
    {
      name: 'Noman Tariq (Faisalabad)',
      rating: 5,
      title: 'Excellent stitching',
      comment: 'Been using for 2 months now, corners haven’t peeled or cracked at all. Good stuff.',
      daysAgo: 58,
      helpful: 6
    }
  ],

  'long-wallet': [
    {
      name: 'Shahmeer Khan (Karachi)',
      rating: 5,
      title: 'Perfect for passport, checkbook & cash',
      comment: 'Full length cash pockets keep crisp thousand and five-thousand notes flat without any folds. Fits nicely inside briefcase or car glove compartment.',
      daysAgo: 16,
      helpful: 12
    },
    {
      name: 'Dr. Omer Farooq (Lahore)',
      rating: 5,
      title: 'Executive travel wallet',
      comment: 'Zipper compartment inside is great for coins and SIM cards while traveling. Very satisfied.',
      daysAgo: 49,
      helpful: 8
    }
  ],

  'triplet-brown-wallet': [
    {
      name: 'Haris Abbasi (Islamabad)',
      rating: 5,
      title: 'Tri-fold organization with tons of storage',
      comment: 'If you carry multiple bank cards, fuel cards, and IDs, this has space for everything. Rich chocolate brown shade.',
      daysAgo: 20,
      helpful: 7
    }
  ],

  'compact-medium-wallet': [
    {
      name: 'Taimoor Shah (Peshawar)',
      rating: 5,
      title: 'Medium size fits comfortably in jacket pocket',
      comment: 'Just the right size between a bulky bifold and a tiny card holder. Smooth leather texture.',
      daysAgo: 11,
      helpful: 9
    }
  ],

  'medium-style-wallet': [
    {
      name: 'Saad Rehman (Sialkot)',
      rating: 5,
      title: 'Durable construction & deep cash pocket',
      comment: 'Fits currency notes without bending the edges. Card slots are spaced nicely.',
      daysAgo: 17,
      helpful: 6
    }
  ],

  'minimalist-card-holder': [
    {
      name: 'Junaid Afzal (Karachi)',
      rating: 5,
      title: 'Super flat front pocket essential',
      comment: 'Holds my 4 daily cards and few folded 500/1000 notes. Extremely slim and convenient.',
      daysAgo: 8,
      helpful: 11
    }
  ]
};

const authenticReviewers = [
  { name: 'Hamza Tariq', city: 'Lahore (Johar Town)' },
  { name: 'Bilal Ahmed Sheikh', city: 'Karachi (Gulshan-e-Iqbal)' },
  { name: 'Daniyal Khan', city: 'Islamabad (F-11)' },
  { name: 'Usman Farooq', city: 'Faisalabad' },
  { name: 'Syed Ali Raza', city: 'Rawalpindi (Saddar)' },
  { name: 'Muhammad Zeeshan', city: 'Multan (Cantt)' },
  { name: 'Ayesha Malik', city: 'Lahore (DHA Phase 5)' },
  { name: 'Zainab Qureshi', city: 'Islamabad (G-9)' },
  { name: 'Omer Hashmi', city: 'Karachi (PECHS)' },
  { name: 'Fatima Noor', city: 'Peshawar (Hayatabad)' },
  { name: 'Saad Ur Rehman', city: 'Sialkot' },
  { name: 'Shahmeer Abbasi', city: 'Abbottabad' },
  { name: 'Marium Siddiqui', city: 'Karachi (Clifton)' },
  { name: 'Waleed Butt', city: 'Gujranwala' },
  { name: 'Hassan Javed', city: 'Lahore (Bahria Town)' },
  { name: 'Noman Rauf', city: 'Hyderabad (Qasimabad)' },
  { name: 'Mahnoor Tariq', city: 'Islamabad (E-11)' },
  { name: 'Kashif Mehmood', city: 'Quetta (Jinnah Road)' },
  { name: 'Adeel Murtaza', city: 'Rawalpindi (Bahria Phase 7)' },
  { name: 'Taimoor Shah', city: 'Peshawar (University Town)' },
  { name: 'Dr. Arsalan Baig', city: 'Karachi (DHA Phase 6)' },
  { name: 'Fahad Aslam', city: 'Lahore (Cantt)' },
  { name: 'Suleman Ghani', city: 'Sargodha' },
  { name: 'Sadia Imran', city: 'Karachi (North Nazimabad)' },
  { name: 'Taha Nadeem', city: 'Lahore (Model Town)' },
  { name: 'Kamran Alvi', city: 'Sahiwal' },
  { name: 'Junaid Afzal', city: 'Karachi (KDA Scheme 1)' },
  { name: 'Zubair Ansari', city: 'Wah Cantt' },
  { name: 'Babar Azim', city: 'Islamabad (I-8)' },
  { name: 'Sheroz Khan', city: 'Lahore (Gulberg III)' }
];

function generateDynamicHumanReviews(product, index) {
  const pName = product.name;
  const pCat = product.category || '';
  const pPrice = product.price || 3000;
  
  const rev1 = authenticReviewers[(index * 3) % authenticReviewers.length];
  const rev2 = authenticReviewers[(index * 3 + 1) % authenticReviewers.length];
  const rev3 = authenticReviewers[(index * 3 + 2) % authenticReviewers.length];

  if (pCat === 'women-watches') {
    return [
      {
        name: `${rev1.name} (${rev1.city})`,
        rating: 5,
        title: 'Bohat pyari watch hai, delicate & shiny!',
        comment: `Received in 2 days. The dial and the chain sparkle so nicely in room light. Sits very comfortably on thin wrists and doesn't feel heavy. Gifted myself for Eid and totally satisfied with the purchase.`,
        daysAgo: ((index * 5) % 30) + 2,
        helpful: 8 + (index % 7)
      },
      {
        name: `${rev2.name} (${rev2.city})`,
        rating: 5,
        title: 'Perfect for formal events & family weddings',
        comment: `Looks very elegant when paired with Eastern outfits. The lock is smooth and clasp holds firmly. Packaging came with protective film all over the glass and bracelet.`,
        daysAgo: ((index * 7) % 45) + 15,
        helpful: 5 + (index % 5)
      },
      {
        name: `${rev3.name} (${rev3.city})`,
        rating: 4,
        title: 'Very pretty design, good quality',
        comment: `Looks just like the photos. The shine on the casing is clean. Courier delivered on day 3 in good condition. Definitely recommend!`,
        daysAgo: ((index * 11) % 60) + 30,
        helpful: 3 + (index % 4)
      }
    ];
  }

  if (pCat === 'belts') {
    return [
      {
        name: `${rev1.name} (${rev1.city})`,
        rating: 5,
        title: 'Sturdy buckle and authentic leather feel',
        comment: `Leather is thick and doesn’t get crease lines when bent. Buckle mechanism feels solid in hand with nice weight. Fits 32-38 waist easily. Great value for money.`,
        daysAgo: ((index * 4) % 25) + 3,
        helpful: 9 + (index % 6)
      },
      {
        name: `${rev2.name} (${rev2.city})`,
        rating: 5,
        title: 'Smooth finish, works great for formal & casual',
        comment: `Matches well with both suit trousers and daily jeans. Packaging was neat with buckle wrapped in protective pouch. Very satisfied with The Trend Seller service.`,
        daysAgo: ((index * 8) % 40) + 12,
        helpful: 6 + (index % 5)
      }
    ];
  }

  if (pCat === 'wallets') {
    return [
      {
        name: `${rev1.name} (${rev1.city})`,
        rating: 5,
        title: 'Compact yet spacious for cards & cash',
        comment: `Fits all my cards, CNIC, and cash without bulging out of pocket. Stitching along the edges is even and clean. Leather has a good texture that doesn't feel plastic-like.`,
        daysAgo: ((index * 5) % 28) + 2,
        helpful: 10 + (index % 7)
      },
      {
        name: `${rev2.name} (${rev2.city})`,
        rating: 5,
        title: 'Great daily carry wallet',
        comment: `Been using it for over 3 weeks now. Card slots hold cards firmly so nothing slips out accidentally. Comes in a nice gift-ready presentation box.`,
        daysAgo: ((index * 9) % 50) + 16,
        helpful: 5 + (index % 4)
      }
    ];
  }

  const isHeavyLuxury = pPrice >= 4500;
  
  return [
    {
      name: `${rev1.name} (${rev1.city})`,
      rating: 5,
      title: isHeavyLuxury ? 'Solid heavy weight on wrist & clean dial finishing' : 'Awesome watch for everyday office & casual wear',
      comment: isHeavyLuxury 
        ? `Delivered within 48 hours via COD. The weight and wrist presence are surprisingly solid, feels just like high-end timepieces. Bezel brushing and glass clarity are 10/10.`
        : `Got it delivered on time. Dial is very clear and the strap is comfortable even during hot weather. Looks much better in real life than on screen.`,
      daysAgo: ((index * 3) % 22) + 2,
      helpful: 11 + (index % 8)
    },
    {
      name: `${rev2.name} (${rev2.city})`,
      rating: 5,
      title: 'Received multiple compliments from colleagues',
      comment: `Wore it to office yesterday and 2 people asked where I got it from. Clasp lock clicks firmly into place with zero rattle. Accurate timekeeping so far.`,
      daysAgo: ((index * 6) % 45) + 14,
      helpful: 7 + (index % 6)
    },
    {
      name: `${rev3.name} (${rev3.city})`,
      rating: 4,
      title: 'Solid build quality, minor chain adjustment needed',
      comment: `Watch itself is fantastic. Chain was slightly loose for my wrist so had 2 links removed locally for 50 PKR, now fits like a charm. Recommended!`,
      daysAgo: ((index * 11) % 65) + 32,
      helpful: 4 + (index % 4)
    }
  ];
}

async function seedHumanizedReviews() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    console.log('🧹 Clearing old reviews from database...');
    const deleteResult = await Review.deleteMany({});
    console.log(`🗑️ Removed ${deleteResult.deletedCount} old reviews.`);

    const products = await Product.find({}).sort({ category: 1, name: 1 }).lean();
    console.log(`📦 Processing ${products.length} products for custom human reviews...`);

    let totalCreated = 0;
    let customCount = 0;
    let dynamicCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const slug = product.slug;

      let reviewList = customProductReviews[slug];

      if (reviewList && reviewList.length > 0) {
        customCount++;
      } else {
        reviewList = generateDynamicHumanReviews(product, i);
        dynamicCount++;
      }

      for (const rev of reviewList) {
        const createdAtDate = new Date(Date.now() - (rev.daysAgo || 10) * 24 * 60 * 60 * 1000);
        
        const cleanName = rev.name.split('(')[0].trim().toLowerCase().replace(/[^a-z]/g, '');
        const randomNum = Math.floor(Math.random() * 89) + 10;
        const email = `${cleanName}${randomNum}@gmail.com`;

        await Review.create({
          productId: product._id,
          name: rev.name,
          email: email,
          rating: rev.rating,
          title: rev.title,
          comment: rev.comment,
          helpful: rev.helpful || 5,
          verified: true,
          isApproved: true,
          createdAt: createdAtDate,
          updatedAt: createdAtDate
        });
        totalCreated++;
      }
    }

    console.log('\n======================================================');
    console.log('🎉 HUMANIZED REVIEWS OVERHAUL COMPLETED SUCCESSFULLY:');
    console.log(`   ✨ Handcrafted Custom Sets Used : ${customCount} products`);
    console.log(`   ✨ Tailored Dynamic Sets Used   : ${dynamicCount} products`);
    console.log(`   🌟 Total New Natural Reviews    : ${totalCreated}`);
    console.log(`   📦 Total Products Covered       : ${products.length}`);
    console.log('======================================================\n');

  } catch (error) {
    console.error('❌ Error in humanized review seeding:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 MongoDB connection closed.');
  }
}

seedHumanizedReviews();
