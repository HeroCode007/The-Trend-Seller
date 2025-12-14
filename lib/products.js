// ===== PRODUCT TYPE DEFINITION =====
// If using TypeScript, add this to a types.ts file:
/*
interface Product {
  id: number;
  slug: string;
  name: string;
  productCode: string;
  price: number;
  image: string;
  images?: string[];  // Optional gallery
  description: string;
  features: string[];
  category: string;
  inStock?: boolean;  // Optional, defaults to true
}
*/

// ===== PREMIUM WATCHES =====
export const premiumWatches = [
  {
    id: 1,
    slug: 'royal-square-titanium',
    name: 'SKMEI-Royal Square Titanium',
    productCode: 'TTS-PW-001',
    price: 6899,
    image: '/images/SKEMI-1.jpg',
    description: 'The Royal Square Titanium represents the pinnacle of modern watchmaking. Forged from aerospace-grade titanium, this masterpiece combines featherlight comfort with exceptional durability. The distinctive square case design makes a bold architectural statement, while the sapphire crystal ensures scratch-resistant clarity for years to come.',
    features: ['Titanium case', 'Titanium bezel', 'Titanium bracelet', 'Titanium crown'],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 2,
    slug: 'rolex-daytona-leather',
    name: 'Rolex Daytona Black-Dial',
    productCode: 'TTS-PW-002',
    price: 4899,
    image: '/images/RLXB-1.png',
    description: 'A legendary chronograph crafted for professional racing enthusiasts. The Rolex Daytona combines precision timekeeping with iconic design, featuring a robust Oyster case, high-performance automatic movement, and a tachymetric bezel engineered for measuring average speeds. Renowned for its durability, accuracy, and timeless prestige.',

    features: [
      'Chronograph functionality',
      'Tachymetric bezel',
      'Oystersteel or precious metal case',
      'Rolex Caliber 4130 automatic movement'
    ],

    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 3,
    slug: 'rolex-daytona-silver',
    name: 'Rolex Daytona Silver',
    productCode: 'TTS-PW-003',
    price: 4499,
    image: '/images/RLX-1.png',
    description: 'Where technical prowess meets breathtaking beauty. This chronograph is adorned with precisely-cut brilliant diamonds set in the bezel, creating a mesmerizing play of light. The sapphire crystal case back reveals the intricate movement within, while the supple alligator leather strap ensures luxurious comfort.',
    features: ['Diamond bezel', 'Chronograph function', 'Sapphire crystal', 'Alligator strap'],
    category: 'premium-watches',
    inStock: false,
  },
  {
    id: 4,
    slug: 'FM-diamond-collection',
    name: 'Franck Muller Diamond Collection',
    productCode: 'TTS-PW-004',
    price: 4499,
    image: '/images/FM.jpg',
    description: 'A transparent celebration of mechanical artistry. Each Crown Jewel is meticulously hand-assembled by master watchmakers, featuring a fully skeletonized movement that transforms time-telling into theater. Rose gold accents highlight the intricate gears and bridges, while the substantial power reserve ensures days of uninterrupted precision.',
    features: ['Skeletonized movement', 'Hand-assembled', 'Diamond-accents', 'Power reserve'],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 5,
    slug: 'Arabic-Aura',  // ← FIXED: Added "-premium" to differentiate
    name: 'Black Arabic Aura',
    productCode: 'TTS-PW-005',
    price: 3199,
    image: '/images/BlackAura1.jpg',
    description: 'The Arabic Aura Watch – All Black Edition blends cultural elegance with modern minimalism. Featuring a bold Arabic numeral dial and a sleek all-black aesthetic, this lightweight 44g timepiece is designed for those who appreciate style without compromise. Its premium fiber body and feather-light chain strap ensure all-day comfort, while the durable build and water-resistant design make it perfect for both daily wear and standout occasions. A true statement piece that elevates any outfit.',

    features: [
      'Premium lightweight fiber body',
      'Bold Arabic numeral dial',
      'All-black aesthetic design',
      'Ultra-lightweight 44g build',
      'Durable fiber chain strap',
      'Secure butterfly lock',
      'Water resistant for daily use',
      'Premium box packaging'
    ],

    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 6,
    slug: 'rolex-datejust-classic',  // ← FIXED: More descriptive slug
    name: 'Rolex Datejust',
    productCode: 'TTS-PW-006',
    price: 4699,
    image: '/images/rlx-dj.PNG',
    description: 'An icon that needs no introduction. The Rolex Datejust has graced the wrists of world leaders and tastemakers for generations. Its signature fluted bezel catches light from every angle, while the ingenious Cyclops lens magnifies the date window for effortless reading. Swiss craftsmanship ensures this timepiece will serve families for decades.',
    features: [
      'Oyster-steel case and bracelet',
      'Fluted bezel',
      'Automatic self-winding movement',
      'Cyclops lens over the date',
      'Scratch-resistant sapphire crystal',
      'Water resistant up to 100 meters'
    ],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 7,
    slug: 'forches-blue-diamond',
    name: 'Forches Blue Diamond',
    productCode: 'TTS-PW-007',
    price: 4599,
    image: '/images/P1.png',
    description: 'Mediterranean elegance captured in time. The Forches Blue Diamond features a stunning sunburst blue dial that shifts from deep navy to brilliant azure as light dances across its surface. Roman numerals provide classic sophistication, while crystal-style hour markers add a touch of sparkle. The practical day-date display makes it perfect for the modern gentleman.',
    features: [
      'Alloy steel case and bracelet',
      'Blue sunburst dial with Roman numerals',
      'Day and date display window',
      'Diamond-style hour markers',
      'Quartz movement'
    ],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 8,
    slug: 'rolex-datejust-gold',  // ← FIXED: Swapped slugs (was backwards)
    name: 'Rolex Datejust Gold',
    productCode: 'TTS-PW-008',
    price: 4699,
    image: '/images/P2.png',
    description: 'The perfect marriage of steel strength and gold prestige. This two-tone Datejust pairs the durability of Oystersteel with the warm glow of 18k gold accents. Diamond hour markers punctuate the rich blue dial like stars in a twilight sky, while the fluted gold bezel creates Rolex\'s signature play of light and shadow.',
    features: [
      'Two-tone oystersteel and gold bracelet',
      'Fluted gold bezel',
      'Diamond hour markers on blue dial',
      'Cyclops date window',
      'Automatic movement'
    ],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 9,
    slug: 'rolex-datejust-blue-steel',  // ← FIXED: Swapped slugs (was backwards)
    name: 'Rolex Datejust Blue Steel',
    productCode: 'TTS-PW-009',
    price: 4799,
    image: '/images/P3.png',
    description: 'Uncompromising luxury in full gold regalia. This Datejust makes no apologies—it\'s pure opulence from case to clasp. The champagne gold dial creates a warm, sophisticated canvas for diamond markers that catch every ray of light. An Oyster-style bracelet flows like liquid gold across the wrist, making it the ultimate statement piece for galas and celebrations.',
    features: [
      'Full gold-plated finish',
      'Champagne gold dial with diamond markers',
      'Oyster-style gold bracelet',
      'Cyclops date window',
      'Automatic movement'
    ],
    category: 'premium-watches',
    inStock: true,
  }
];

// ===== CASUAL WATCHES =====
export const casualWatches = [
  {
    id: 10,  // ← FIXED: Sequential ID
    slug: 'casio-a159w-digital-watch',
    name: 'Casio A159W Digital Watch',
    productCode: 'CASIO-A159W',
    price: 1799,
    image: '/images/CA159-2.jpg',
    description: 'A timeless classic that defined digital watch style. The Casio A159W features a retro-inspired square design with stainless steel construction and modern functionality. Perfect for those who appreciate vintage aesthetics with reliable everyday performance. Water-resistant and incredibly lightweight, this iconic timepiece works seamlessly with any casual or smart-casual outfit.',
    features: ['Stainless steel case', 'Digital LCD display', 'LED backlight', 'Alarm & stopwatch', 'Water resistant', 'Stainless steel bracelet'],
    category: 'casual-watches',
    inStock: false,  // OUT OF STOCK
  },
  {
    id: 31,  // ← FIXED: Sequential ID
    slug: 'rolex-yacht',
    name: 'Rolex Yacht-Master Black',
    productCode: 'RLX-YT100',
    price: 4899,
    image: '/images/RLX-Yacht.PNG',
    description: 'Inspired by the spirit of open waters, this Yacht Master–style timepiece blends sport luxury with dependable performance. Its 40mm stainless steel case is paired with a striking black and rose-gold dial, creating a bold yet refined nautical aesthetic. The premium silicon strap offers exceptional comfort, while the rotating bezel and date display enhance everyday functionality. Built with a reliable quartz movement, mineral glass protection, and water-resistant construction, it’s a versatile companion designed for both sea adventures and sophisticated settings.',

    features: [
      '40mm stainless steel case',
      'Black and rose-gold dial',
      'Reliable quartz movement',
      'Premium silicon strap',
      'Water-resistant construction',
      'Mineral glass protection',
      'Functional rotating bezel',
      'Date display window',
      'Secure master lock mechanism',
    ],

    category: 'casual-watches',
    inStock: true,
  },
  {
    id: 11,
    slug: 'hublot-big-bang-meca-10',  // ← FIXED: Slug matches name
    name: 'Hublot Big Bang Meca-10',
    productCode: 'TTS-CW-010',
    price: 4199,
    image: '/images/C1.png',
    description: 'Engineering meets adventure in the Big Bang Meca-10. This robust timepiece features an industrial-chic design with visible mechanical elements that celebrate watchmaking\'s technical side. Built from lightweight titanium with sapphire crystal protection, it\'s designed for those who demand performance without sacrificing style.',
    features: ['Titanium case', 'Sapphire crystal glass', 'Visible mechanical elements', 'Industrial design'],
    category: 'casual-watches',
    inStock: true,
  },
  {
    id: 12,
    slug: 'hublot-classic-fusion-casual',  // ← FIXED: Added "-casual" to differentiate
    name: 'Hublot Classic Fusion',
    productCode: 'TTS-CW-011',
    price: 3999,
    image: '/images/C2.png',
    description: 'Versatility redefined for the active lifestyle. This Classic Fusion transitions effortlessly from boardroom to beach house. The titanium construction keeps it featherlight during long wear, while the sapphire crystal withstands the rigors of daily adventures. Clean lines and understated elegance make it the perfect everyday companion.',
    features: ['Titanium case', 'Sapphire crystal', 'Lightweight design', 'Everyday versatility'],
    category: 'casual-watches',
    inStock: true,
  },
  {
    id: 13,
    slug: 'pierre-cardin-epinettes',  // ← FIXED: Slug matches name
    name: 'Pierre Cardin Épinettes',
    productCode: 'TTS-CW-012',
    price: 4499,
    image: '/images/C3.png',
    description: 'French fashion legacy meets Swiss precision. The Épinettes by Pierre Cardin embodies Parisian sophistication with its sleek titanium profile and architectural dial design. Sapphire crystal ensures clarity in any condition, while the balanced weight makes it comfortable for all-day wear, whether you\'re at the office or exploring the city.',
    features: ['Titanium case', 'Sapphire crystal', 'French design heritage', 'Architectural dial'],
    category: 'casual-watches',
    inStock: true,
  },
  {
    id: 14,
    slug: 'universe-point-two-tone-silver',  // ← FIXED: Slug matches name
    name: 'Universe Point with a Two Tone Silver',
    productCode: 'TTS-CW-013',
    price: 4400,
    image: '/images/C4.png',
    description: 'The best of both worlds in perfect harmony. This two-tone Universe Point blends silver stainless steel with warm gold accents for a versatile aesthetic that complements any wardrobe. The sapphire crystal face resists scratches while maintaining crystal clarity, and the mixed-metal design bridges the gap between casual and dressy occasions.',
    features: ['Stainless steel case', 'Sapphire crystal', 'Two-tone design', 'Versatile styling'],
    category: 'casual-watches',
    inStock: true,
  },
];

// ===== STYLISH WATCHES =====
export const stylishWatches = [
  {
    id: 16,
    slug: 'patek-philippe-nautilus',  // ← FIXED: Descriptive unique slug
    name: 'Patek Philippe Nautilus',  // ← FIXED: Unique name
    productCode: 'TTS-SW-015',
    price: 4100,
    image: '/images/PP-Nautilus.png',
    description: 'Legendary design that transcends trends. The Patek Philippe Nautilus sports watch revolutionized luxury timepieces with its porthole-inspired case and horizontal embossed dial. This iteration pairs a crisp white dial with luminescent markers for day-to-night legibility, all secured by a supple brown leather strap that develops character with age.',
    features: [
      'Stainless steel case',
      'White dial with luminescent markers',
      'Brown leather strap with folding clasp',
    ],
    category: 'stylish-watches',
    inStock: true,
  },
  {
    id: 17,
    slug: 'rm-35',  // ← FIXED: Slug matches name
    name: 'Richard Mille-TSAR',
    productCode: 'TTS-SW-016',
    price: 4400,
    image: '/images/RM2.jpg',
    description: 'A bold fusion of modern engineering and avant-garde design. This timepiece showcases a striking tonneau-shaped case paired with a vibrant blue-tinted skeleton dial that reveals the intricate mechanics within. The high-polish black finish and exposed screws create a strong technical presence, while the durable rubber strap delivers all-day comfort. Built for those who appreciate innovation and statement-making style, it’s a watch that demands attention from every angle.',

    features: [
      'High-polish black tonneau-shaped case',
      'Blue-tinted skeleton dial with luminous hands and markers',
      'Exposed mechanical movement architecture',
      'Scratch-resistant crystal',
      'Comfort-fit black rubber strap',
    ],

    category: 'stylish-watches',
    inStock: true,
  },
  {
    id: 18,
    slug: 'hublot-chrono',
    name: 'Hublot Blue Dial Chrono',
    productCode: 'TTS-SW-017',
    price: 3299,
    image: '/images/HB-Chrono.png',
    description: 'For those who dare to be different. This avant-garde timepiece pushes boundaries with its geometric case architecture and unconventional dial layout. Premium materials meet bold design choices, creating a conversation piece that\'s as much art as it is instrument. Limited production ensures exclusivity for style pioneers.',
    features: ['Geometric design', 'Premium materials', 'Unique styling', 'Fashion-forward'],
    category: 'stylish-watches',
    inStock: true,
  },
  {
    id: 19,
    slug: 'patek-philippe-nautilus-classic',  // ← FIXED: Unique slug
    name: 'Patek Philippe Nautilus Classic',  // ← FIXED: Unique name
    productCode: 'TTS-SW-018',
    price: 4699,
    image: '/images/S5.jpg',
    description: 'Timeless charm with contemporary reliability. This vintage-inspired Nautilus captures the golden age of watchmaking while incorporating modern materials and movements. The white dial with luminescent details ensures readability, while 120-meter water resistance provides peace of mind. A folding clasp on the leather strap adds security and convenience.',
    features: [
      'Stainless steel or precious metal case',
      'White dial with luminescent hands and markers',
      'Brown leather strap with folding clasp',
      'Automatic self-winding movement',
      'Date display at 3 o clock',
      'Water resistant up to 120 meters'
    ],
    category: 'stylish-watches',
    inStock: true,
  }
];

// ===== BELTS =====
export const belts = [
  {
    id: 20,
    slug: 'reversible-dress-belt',
    name: 'Reversible Dress Belt',
    productCode: 'TTS-BT-019',
    price: 1899,
    image: '/images/Belt2.png',
    description: 'Versatility engineered into every inch. This ingenious reversible belt features black on one side and rich brown on the other, effectively giving you two premium belts in one. The rotating buckle mechanism allows instant switching, while the dual-tone finish ensures you\'re always coordinated whether wearing black or brown shoes.',
    features: ['Reversible design', 'Rotating buckle', 'Dual-tone finish', 'Premium leather'],
    category: 'belts',
    inStock: true,
  },
  {
    id: 21,
    slug: 'pure-leather-formal-belt',  // ← FIXED: Slug matches name
    name: 'Pure Leather Formal Belt',
    productCode: 'TTS-BT-020',
    price: 2100,
    image: '/images/Belt3.png',
    description: 'The foundation of any refined wardrobe. Crafted from single-piece genuine leather with a smooth, burnished finish, this formal belt exudes understated elegance. The polished metal buckle adds subtle shine without distraction, while the adjustable length ensures a perfect fit. A timeless accessory that elevates suits and dress trousers.',
    features: ['Genuine leather', 'Polished metal buckle', 'Adjustable length', 'Classic formal design'],
    category: 'belts',
    inStock: true,
  }
];

// ===== WALLETS =====
export const wallets = [
  {
    id: 22,
    slug: 'brown-leather-card-holder',
    name: 'Brown Leather Card Holder',
    productCode: 'TTS-WL-021',
    price: 1799,
    image: '/images/CB-Front.png',
    images: [
      '/images/Open.png',
      '/images/CB-Front.png',
    ],
    description: 'Minimalism that makes sense. This brown leather card holder strips away the unnecessary, keeping only what matters. The slim profile slides effortlessly into any pocket, while the refined matte finish develops a rich patina over time. Reinforced stitching ensures it handles 6-8 cards daily without losing shape or integrity.',
    features: ['Genuine brown leather', 'Slim pocket-friendly profile', 'Holds 6–8 cards', 'Reinforced stitching', 'Modern matte finish'],
    category: 'wallets',
    inStock: true,
  },
  {
    id: 23,
    slug: 'minimalist-card-holder',  // ← FIXED: Lowercase, consistent
    name: 'Minimalist Card Holder',
    productCode: 'TTS-WL-022',
    price: 1799,
    image: '/images/Wallet2.png',
    images: [
      '/images/M1.png',
      '/images/M2.png',
    ],
    description: 'Pure leather craftsmanship in elegant black. This minimalist card holder represents the "less is more" philosophy perfectly executed. The sleek silhouette eliminates bulk while maintaining functionality for essential cards. Durable stitching and premium construction ensure this everyday carry piece ages gracefully alongside you.',
    features: ['Pure leather construction', 'Matte black finish', 'Holds 6–8 cards', 'Slim pocket-friendly profile', 'Durable stitching'],
    category: 'wallets',
    inStock: true,
  },
  {
    id: 24,
    slug: 'medium-style-wallet',  // ← FIXED: Slug matches name
    name: 'Medium Style Wallet',
    productCode: 'TTS-WL-023',
    price: 2299,
    image: '/images/Medi.jpg',
    images: [
      '/images/MS1.png',
      '/images/MS2.png',
      '/images/DBW.png'
    ],
    description: 'Smart organization in a refined package. This double-compartment wallet separates your essentials with intelligent design—one side for cards, the other for cash and coins. The soft leather exterior feels luxurious while maintaining structure, and the thoughtful layout means you\'ll always find what you need without fumbling.',
    features: ['2 main compartments', 'Card organizer', 'Cash pouch', 'Soft leather exterior'],
    category: 'wallets',
    inStock: true,
  },
  {
    id: 25,
    slug: 'gucci-card-holder',  // ← FIXED: Slug matches name
    name: 'Gucci Card Holder',
    productCode: 'TTS-WL-024',
    price: 1799,
    image: '/images/Gucci.png',
    images: [
      '/images/GC2.png',
      '/images/GC1.png',
    ],
    description: 'Italian luxury heritage in your pocket. This Gucci card holder showcases the brand\'s legendary craftsmanship with full-grain leather and meticulous handcrafted details. RFID-blocking technology protects your cards from digital theft, while the elegant design makes a subtle statement about your appreciation for timeless quality.',
    features: ['Elegant design', 'Full-grain leather', 'Handcrafted details', 'RFID secure'],
    category: 'wallets',
    inStock: true,
  },
  {
    id: 26,
    slug: 'long-wallet',
    name: 'Long Wallet',
    productCode: 'TTS-WL-025',
    price: 2499,
    image: '/images/LW-F.jpg',
    images: [
      '/images/LW.jpg',
      '/images/LW2.png',
    ],
    description: 'Refined organization for the well-prepared. This long wallet offers generous capacity without sacrificing elegance. The extended bill section accommodates currency flat and wrinkle-free, while 12 dedicated card slots keep everything accessible. Premium full-grain leather and expert stitching ensure decades of reliable service.',
    features: ['Full-grain leather construction', 'Extended bill section', '12 card slots', 'Secure pocket', 'Slim, elegant silhouette', 'Durable stitching'],
    category: 'wallets',
    inStock: true,
  },
  {
    id: 27,
    slug: 'compact-medium-wallet',
    name: 'Compact Medium Wallet',
    productCode: 'TTS-WL-026',
    price: 2370,
    image: '/images/medium.png',
    images: [
      '/images/MB-C.png',
      '/images/MB-Open.png',
      '/images/MB-D.png',
      '/images/MB-Up.png'
    ],
    description: 'The Goldilocks of wallets—not too big, not too small, just right. This medium-sized wallet balances capacity with portability perfectly. RFID protection shields your cards from electronic pickpockets, while the smooth interior lining makes card retrieval effortless. Durable leather construction ensures it maintains its shape through years of daily use.',
    features: ['Compact yet spacious', 'RFID protection', 'Durable leather', 'Smooth lining'],
    category: 'wallets',
    inStock: true,
  },
  {
    id: 28,
    slug: 'triplet-brown-wallet',  // ← FIXED: Slug matches name
    name: 'Triplet Brown',
    productCode: 'TTS-WL-027',
    price: 2499,
    image: '/images/TS-F.png',
    images: [
      '/images/TS-1.png',
      '/images/TS-2.png',
      '/images/TS-3.png'
    ],
    description: 'Security meets sophistication with 360° protection. The full zip-around closure ensures nothing escapes this elegant wallet—perfect for travelers and busy professionals. A dedicated coin pocket keeps change organized, while RFID shielding technology guards against digital theft. Premium leather construction wrapped in practical design.',
    features: ['360° zip enclosure', 'Coin pocket', 'Premium leather', 'RFID shield'],
    category: 'wallets',
    inStock: true,
  },
  {
    id: 29,
    slug: 'crocodile-style-wallet',  // ← FIXED: Slug matches name
    name: 'Crocodile Style Wallet',
    productCode: 'TTS-WL-028',
    price: 2150,
    image: '/images/Wallet4.png',
    images: [
      '/images/CS1.png',
      '/images/CS2.png',
    ],
    description: 'Exotic texture with everyday practicality. This wallet features premium leather embossed with a realistic crocodile pattern, delivering luxury aesthetics at an accessible price point. The bold texture makes a distinctive statement, while the slim profile and thoughtful organization keep it functional for daily use.',
    features: ['Crocodile-embossed finish', 'Genuine leather', 'Multiple card slots and bill compartment', 'Slim, pocket-friendly profile'],
    category: 'wallets',
    inStock: true,
  },
  {
    id: 30,
    slug: 'leather-bi-fold-wallet',  // ← FIXED: Slug matches name
    name: 'Leather Bi-Fold Wallet',
    productCode: 'TTS-WL-029',
    price: 2200,
    image: '/images/RG.jpg',
    images: [
      '/images/RG1.jpg',
      '/images/RG2.jpg',
      '/images/RG3.jpg'
    ],
    description: 'Timeless brown leather in classic bi-fold configuration. This wallet represents traditional craftsmanship at its finest—genuine leather that breaks in beautifully, organized compartments for cards and cash, and reinforced stitching that promises longevity. The slim profile prevents pocket bulk while the warm brown tone adds sophistication to any outfit.',
    features: ['Genuine brown leather', 'Bi-fold design', 'Multiple card slots', 'Full-length bill compartment', 'Slim pocket-friendly profile', 'Reinforced stitching'],
    category: 'wallets',
    inStock: true,
  }
];


// ===== ALL PRODUCTS =====
export const allProducts = [
  ...premiumWatches,
  ...casualWatches,
  ...stylishWatches,
  ...belts,
  ...wallets
];

// ===== HELPER FUNCTIONS =====
export function getProductBySlug(slug) {
  return allProducts.find((p) => p.slug === slug);
}

export function getProductsByCategory(category) {
  switch (category) {
    case 'premium-watches':
      return premiumWatches;
    case 'casual-watches':
      return casualWatches;
    case 'stylish-watches':
      return stylishWatches;
    case 'belts':
      return belts;
    case 'wallets':
      return wallets;
    default:
      return [];
  }
}

// // ===== NEW: Get in-stock products only =====
// export function getInStockProducts() {
//   return allProducts.filter((p) => p.inStock !== false);
// }

// // ===== NEW: Get out-of-stock products =====
// export function getOutOfStockProducts() {
//   return allProducts.filter((p) => p.inStock === false);
// }

// // ===== NEW: Search products =====
// export function searchProducts(query) {
//   const lowerQuery = query.toLowerCase();
//   return allProducts.filter(
//     (p) =>
//       p.name.toLowerCase().includes(lowerQuery) ||
//       p.description.toLowerCase().includes(lowerQuery) ||
//       p.productCode.toLowerCase().includes(lowerQuery)
//   );
// }