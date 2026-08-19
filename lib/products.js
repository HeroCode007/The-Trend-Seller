// ===== PRODUCT TYPE DEFINITION =====
/*
interface Product {
  id: number;
  slug: string;
  name: string;
  productCode: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  features: string[];
  category: string;
  inStock?: boolean;
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
    inStock: true,
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
    slug: 'Arabic-Aura',
    name: 'Black Arabic Aura',
    productCode: 'TTS-PW-005',
    price: 2100,
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
    slug: 'rolex-datejust-classic',
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
    slug: 'rolex-datejust-gold',
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
    slug: 'rolex-datejust-blue-steel',
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
  },
  {
    id: 32,
    slug: 'hublot-meca-white-ceramic',
    name: 'Hublot Meca White Ceramic',
    productCode: 'TTS-PW-032',
    price: 3350,
    image: '/images/hublot-meca-white-ceramic.jpg',
    description: 'A revolutionary statement piece showcasing the art of fusion. The Hublot Meca White Ceramic features an iconic industrial bezel with exposed screws, a layered skeletonized dial revealing high-precision mechanics, and an ultra-durable hybrid strap secured with a dual deployment butterfly lock.',
    features: [
      'White and grey hybrid leather-rubber strap',
      'Dual deployment butterfly lock',
      'Multi-layer skeletonized mechanical dial',
      'Industrial bezel with exposed H-screws',
      'High-grade white ceramic finish with brushed steel',
      'Date display and chronograph functionality',
      'Scratch-resistant crystal glass'
    ],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 33,
    slug: 'rolex-datejust-computer-monogram',
    name: 'Rolex DateJust Computer Monogram',
    productCode: 'TTS-PW-033',
    price: 2850,
    image: '/images/rolex-datejust-computer-monogram.jpg',
    description: 'An extraordinarily distinctive luxury watch featuring the coveted black computer monogram dial etched with repeating 3D ROLEX typography. Adorned with brilliant diamond hour markers and a classic 5-link Jubilee bracelet with folding master lock.',
    features: [
      '5-link stainless steel Jubilee bracelet',
      'Folding Oyster master lock',
      'Black repeating 3D ROLEX computer monogram dial',
      'Sparkling diamond hour markers',
      'Fluted bezel with Cyclops date magnifier window',
      'Precision quartz movement',
      'Water resistant for daily wear'
    ],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 34,
    slug: 'rolex-skydweller-matte-black',
    name: 'Rolex Sky Dweller Matte Black',
    productCode: 'TTS-PW-034',
    price: 3000,
    image: '/images/rolex-skydweller-matte-black.jpg',
    description: 'Sophisticated engineering meets a stealth contemporary aesthetic. The Sky Dweller in matte black PVD casing features an off-center 24-hour disc for tracking secondary time zones, an annual calendar indicator, and a robust Oysterlock safety clasp.',
    features: [
      'Matte black PVD Oystersteel link bracelet',
      'Folding Oysterlock master safety clasp',
      'Stealth matte black PVD case and fluted bezel',
      'Brushed silver sunray dial with off-center 24-hour GMT ring',
      'Cyclops date magnifier at 3 o\'clock',
      'Luminous geometric hour indices',
      'Scratch-resistant mineral crystal'
    ],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 35,
    slug: 'tag-heuer-aquaracer-calibre-5-gmt',
    name: 'TAG Heuer Aquaracer Calibre 5 GMT',
    productCode: 'TTS-PW-035',
    price: 6700,
    image: '/images/tag-heuer-aquaracer-gmt-black.jpg',
    description: 'A highly sought-after rare collector article engineered for extreme reliability and high-seas sophistication. Features a distinctive horizontal ribbed black dial, 24-hour bi-directional rotating GMT ceramic bezel, and a heavy-duty vulcanized rubber strap with push-button master folding clasp.',
    features: [
      'Textured vulcanized black rubber strap',
      'Security push-button master folding clasp',
      'Rare collector article with horizontal ribbed black dial',
      'Bi-directional rotating 24-hour GMT ceramic bezel',
      'Magnified date window at 3 o\'clock with high-luminescence markers',
      'Heavy-duty stainless steel case with dive-ready water resistance',
      'Swiss-style precision automatic movement'
    ],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 36,
    slug: 'audemars-piguet-royal-oak-rose-gold',
    name: 'Audemars Piguet Royal Oak Rose Gold',
    productCode: 'TTS-PW-036',
    price: 4799,
    image: '/images/ap-royaloak-rosegold-brown.jpg',
    description: 'The defining archetype of luxury sports horology. Featuring an iconic octagonal 18k rose gold plated bezel secured by 8 visible hexagonal screws, a rich chocolate brown Grande Tapisserie waffle dial, and a hand-stitched alligator-grain leather strap with an AP engraved butterfly deployment clasp.',
    features: [
      'Hand-stitched brown alligator-grain leather strap',
      'AP engraved butterfly deployment clasp',
      'Octagonal 18k rose gold plated bezel with 8 hexagonal screws',
      'Chocolate brown Grande Tapisserie waffle dial',
      'Date display at 3 o\'clock',
      'Luminescent rose gold hands and hour markers',
      'Premium scratch-resistant sapphire-grade crystal'
    ],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 37,
    slug: 'rolex-datejust-rose-gold-zr-edition',
    name: 'Rolex Datejust Rose Gold ZR Edition',
    productCode: 'TTS-PW-037',
    price: 4899,
    image: '/images/rolex-datejust-rosegold-zr-box.jpg',
    description: 'An opulent presentation of luxury in warm rose gold. This Datejust ZR Edition features a deep onyx black dial illuminated by 10 brilliant diamond hour markers, a fluted bezel, a 5-link Jubilee bracelet with hidden butterfly lock, and comes complete in an official green Rolex presentation box with certification seal.',
    features: [
      '18k rose gold plated Jubilee link bracelet',
      'Concealed Crownclasp butterfly lock',
      '18k rose gold plated fluted bezel and case',
      'Jet black dial with 10 sparkling diamond hour markers',
      'Cyclops date magnifier window at 3 o\'clock',
      'Includes luxury green Rolex presentation box and tags',
      'High-grade automatic movement'
    ],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 38,
    slug: 'timeless-together-couple-combo',
    name: '"Timeless Together" Couple Combo',
    productCode: 'TTS-PW-038',
    price: 3700,
    compareAtPrice: 5300,
    image: '/images/timeless-together-couple-combo.jpg',
    description: 'An exclusive limited-time 2-in-1 luxury couple combo package. Features the Men\'s TAG Heuer Carrera Day-Date with a rich brown alligator leather strap paired harmoniously with the Women\'s Michael Kors two-tone crystal bezel watch. Save over Rs. 1,600 compared to individual purchases—the ultimate gift set for anniversaries and weddings.',
    features: [
      'Men\'s Watch: Brown genuine leather strap with pin buckle lock',
      'Women\'s Watch: Two-tone stainless steel bracelet with butterfly clasp',
      '2-in-1 Complete Couple Gift Set',
      'Men\'s TAG Heuer Carrera Day-Date with white dial',
      'Women\'s Michael Kors crystal-studded luxury bezel',
      '7 Days checking warranty and fast secure delivery',
      'Save Rs. 1,600+ vs individual purchase'
    ],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 43,
    slug: 'tubular-tachymeter-ana-digi',
    name: 'TUBULAR Tachymeter Ana-Digi',
    productCode: 'TTS-PW-043',
    price: 6999,
    image: '/images/tubular-tachymeter-anadigi-brown.jpg',
    description: 'A rugged dual-display powerhouse. The TUBULAR Ana-Digi combines traditional luminous analogue hands with an illuminated digital LCD screen supporting stopwatch, alarm, date, and calendar modes. Fitted with a heavy genuine leather brown strap.',
    features: [
      'Dark brown genuine stitched leather strap',
      'Heavy-duty dual-pin master buckle lock',
      'Dual analogue and digital LCD display',
      'Built-in stopwatch, alarm, calendar, and backlight',
      'Black tachymeter speed scale bezel',
      'Heavy-duty polished stainless steel case'
    ],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 44,
    slug: 'tubular-emerald-chronograph',
    name: 'TUBULAR Emerald Chronograph',
    productCode: 'TTS-PW-044',
    price: 6600,
    image: '/images/tubular-emerald-chrono-suede.jpg',
    description: 'Vintage motorsports energy. Features a vibrant teal/emerald sunburst dial with fiery orange racing sub-dial hands, a calendar date window, dual pushers, and a distressed vintage brown suede-leather strap with contrast orange edge-stitching.',
    features: [
      'Vintage distressed suede leather strap with orange edge-stitching',
      'Stainless steel pin buckle lock',
      'Teal/emerald sunburst dial with orange racing chronograph hands',
      'Multi-dial chronograph sub-registers and date window',
      'Polished stainless steel case with dual pushers',
      'Precision quartz chronograph movement'
    ],
    category: 'premium-watches',
    inStock: true,
  },
  {
    id: 46,
    slug: 'tubular-classic-vintage-quartz',
    name: 'TUBULAR Classic Vintage Quartz',
    productCode: 'TTS-PW-046',
    price: 5999,
    image: '/images/tubular-classic-vintage-tan.jpg',
    description: 'A timeless dress classic designed for versatile everyday styling. Features a clean brushed silver dial with baton hour indices, a date window at 3 o\'clock, a high-polish case, and a supple tan brown leather strap with contrast white accent stitching.',
    features: [
      'Supple tan brown genuine leather strap with white accent stitching',
      'Polished steel pin buckle lock',
      'Minimalist brushed silver sunburst dial with baton markers',
      'Date display window at 3 o\'clock',
      'Polished stainless steel dress case',
      'Durable daily quartz reliability'
    ],
    category: 'premium-watches',
    inStock: true,
  }
];

// ===== CASUAL WATCHES =====
export const casualWatches = [
  {
    id: 10,
    slug: 'casio-a159w-digital-watch',
    name: 'Casio A159W Digital Watch',
    productCode: 'CASIO-A159W',
    price: 1799,
    image: '/images/CA159-2.jpg',
    description: 'A timeless classic that defined digital watch style. The Casio A159W features a retro-inspired square design with stainless steel construction and modern functionality. Perfect for those who appreciate vintage aesthetics with reliable everyday performance. Water-resistant and incredibly lightweight, this iconic timepiece works seamlessly with any casual or smart-casual outfit.',
    features: ['Stainless steel case', 'Digital LCD display', 'LED backlight', 'Alarm & stopwatch', 'Water resistant', 'Stainless steel bracelet'],
    category: 'casual-watches',
    inStock: false,
  },
  {
    id: 31,
    slug: 'rolex-yacht',
    name: 'Rolex Yacht-Master Black',
    productCode: 'RLX-YT100',
    price: 4299,
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
    slug: 'hublot-big-bang-meca-10',
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
    slug: 'hublot-classic-fusion-casual',
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
    slug: 'pierre-cardin-epinettes',
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
    slug: 'universe-point-two-tone-silver',
    name: 'Universe Point with a Two Tone Silver',
    productCode: 'TTS-CW-013',
    price: 4400,
    image: '/images/C4.png',
    description: 'The best of both worlds in perfect harmony. This two-tone Universe Point blends silver stainless steel with warm gold accents for a versatile aesthetic that complements any wardrobe. The sapphire crystal face resists scratches while maintaining crystal clarity, and the mixed-metal design bridges the gap between casual and dressy occasions.',
    features: ['Stainless steel case', 'Sapphire crystal', 'Two-tone design', 'Versatile styling'],
    category: 'casual-watches',
    inStock: true,
  },
  {
    id: 39,
    slug: 'tissot-prx-powermatic-80',
    name: 'Tissot PRX Powermatic 80',
    productCode: 'TTS-CW-039',
    price: 3499,
    image: '/images/tissot-prx-silver.jpg',
    description: 'A benchmark of modern 70s-inspired sport-chic design. The Tissot PRX features an integrated ultra-slim stainless steel bracelet, a silver-white tapestry waffle dial with date window at 3 o\'clock, and a dual-push concealed butterfly lock.',
    features: [
      'Integrated stainless steel slim-profile bracelet',
      'Concealed push-button butterfly lock',
      'Silver-white waffle tapestry guilloché dial',
      'Date display window at 3 o\'clock',
      'Scratch-resistant crystal glass',
      'Swiss-inspired integrated luxury architecture'
    ],
    category: 'casual-watches',
    inStock: true,
  },
  {
    id: 40,
    slug: 'sabr-arabic-dial-minimalist',
    name: 'SABR Arabic Dial Minimalist',
    productCode: 'TTS-CW-040',
    price: 2199,
    image: '/images/sabr-arabic-dial-white.jpg',
    description: 'A striking cultural statement piece. The SABR Minimalist Arabic Watch features a crisp clean white dial with bold black Eastern Arabic numerals, a circular date window at 3 o\'clock, and a super-soft matte black silicone sports strap.',
    features: [
      'Ultra-soft matte black silicone sports strap',
      'Stainless steel pin buckle lock',
      'Crisp white dial with black Eastern Arabic numerals',
      'Circular date display window at 3 o\'clock',
      'High-polish stainless steel casing',
      'Sweat-resistant lightweight ergonomic build',
      'Water resistant for daily casual wear'
    ],
    category: 'casual-watches',
    inStock: true,
  },
  {
    id: 41,
    slug: 'bestwin-royal-blue-diamond-jubilee',
    name: 'BESTWIN Royal Blue Diamond Jubilee',
    productCode: 'TTS-CW-041',
    price: 3299,
    image: '/images/bestwin-royal-blue-jubilee.jpg',
    description: 'An executive dress watch offering dazzling brilliance. Features a deep royal sunburst blue dial accented with triple-cluster simulated diamond markers, a date indicator at 6 o\'clock, and a two-tone silver & gold Jubilee bracelet with folding master lock.',
    features: [
      'Two-tone gold and silver Jubilee link bracelet',
      'Push-button folding master lock',
      'Sunburst royal blue dial with diamond hour clusters',
      'Date indicator window at 6 o\'clock',
      'Polished gold fluted inner bezel',
      'High-precision quartz movement'
    ],
    category: 'casual-watches',
    inStock: true,
  },
  {
    id: 42,
    slug: 'bestwin-octagonal-stealth-black',
    name: 'BESTWIN Octagonal Stealth Black',
    productCode: 'TTS-CW-042',
    price: 2999,
    image: '/images/bestwin-octagonal-stealth-black.jpg',
    description: 'Understated elegance in a geometric frame. The BESTWIN Stealth Black combines an octagonal gunmetal-toned case with a slate sunray black dial, subtle rose gold hour markers, and a genuine black alligator-embossed leather strap.',
    features: [
      'Genuine black alligator-embossed leather strap',
      'Polished stainless steel pin buckle lock',
      'Geometric octagonal gunmetal case',
      'Slate sunburst black dial with rose gold hour markers',
      'Date window at 6 o\'clock',
      'Lightweight and comfortable all-day wear'
    ],
    category: 'casual-watches',
    inStock: true,
  },
  {
    id: 45,
    slug: 'universe-point-frosted-octagonal',
    name: 'Universe Point (UP) Frosted Octagonal',
    productCode: 'TTS-CW-045',
    price: 3199,
    image: '/images/universe-point-frosted-octagonal.jpg',
    description: 'Contemporary sport-luxury styling at its best. The Universe Point features a frosted-glitter black octagonal bezel framing a brushed silver sunburst dial with oversized 12 and 6 numerals, paired with a contoured black ribbed silicone sports strap.',
    features: [
      'Contoured ribbed black silicone sports strap',
      'Stainless steel pin buckle lock',
      'Brushed silver sunray dial with bold 12 and 6 numerals',
      'Frosted-glitter textured black octagonal bezel',
      'Polished steel angular case',
      'Water resistant for daily casual wear'
    ],
    category: 'casual-watches',
    inStock: true,
  },
  {
    id: 47,
    slug: 'bestwin-arched-day-date-sport',
    name: 'BESTWIN Arched Day-Date Sport',
    productCode: 'TTS-CW-047',
    price: 3199,
    image: '/images/bestwin-arched-daydate-silver.jpg',
    description: 'An architectural sport watch featuring a panoramic curved day-of-the-week arc window across the 12 o\'clock mark and a date display at 3 o\'clock on a clean white dial, finished with an integrated stainless steel bracelet and safety master lock.',
    features: [
      'Integrated stainless steel link bracelet',
      'Dual push-button safety master lock',
      'Curved panoramic day-of-the-week window at 12 o\'clock',
      'Circular date display window at 3 o\'clock',
      'Beveled silver tachymeter-style bezel',
      'Solid all-metal stainless steel build'
    ],
    category: 'casual-watches',
    inStock: true,
  },
  {
    id: 48,
    slug: 'tomi-cushion-case-navy-blue',
    name: 'TOMI Cushion Case Navy Blue',
    productCode: 'TTS-CW-048',
    price: 2799,
    image: '/images/tomi-cushion-navyblue-box.jpg',
    description: 'Sleek luxury with warm rose gold accents. The TOMI Cushion Watch features a distinctive curved square case, a deep royal navy blue sunburst dial with date display at 6 o\'clock, a matching navy leather strap, and comes packaged in an official TOMI presentation gift box.',
    features: [
      'Navy blue genuine stitched leather strap',
      'Rose gold polished pin buckle lock',
      'Rose gold curved square cushion case',
      'Sunburst royal navy blue dial with date at 6 o\'clock',
      'Includes official TOMI presentation gift box',
      'Water resistant for daily use'
    ],
    category: 'casual-watches',
    inStock: true,
  }
];

// ===== STYLISH WATCHES =====
export const stylishWatches = [
  {
    id: 16,
    slug: 'patek-philippe-nautilus',
    name: 'Patek Philippe Nautilus',
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
    slug: 'rm-35',
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
    slug: 'patek-philippe-nautilus-classic',
    name: 'Patek Philippe Nautilus Classic',
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
  },
  {
    id: 49,
    slug: 'denvosi-franck-muller-white-ice',
    name: 'DENVOSI Franck Muller White Ice',
    productCode: 'TTS-SW-049',
    price: 4350,
    image: '/images/denvosi-fm-white-ice.jpg',
    description: 'A dazzling iced-out statement timepiece. The DENVOSI White Ice features a tonneau-shaped case fully encrusted with simulated diamonds, a rose gold bezel framing a compass and Roman numeral dial, date at 6 o\'clock, and a high-grade white silicone strap.',
    features: [
      'High-grade white silicone strap',
      'Heavy-duty master buckle lock',
      'Tonneau case fully encrusted with sparkling simulated diamonds',
      'Rose gold bezel with compass and Roman numeral dial',
      'Date display window at 6 o\'clock',
      'Water resistant for daily use'
    ],
    category: 'stylish-watches',
    inStock: true,
  },
  {
    id: 50,
    slug: 'gucci-g-timeless-grip',
    name: 'Gucci G-Timeless Grip',
    productCode: 'TTS-SW-050',
    price: 4299,
    image: '/images/gucci-gtimeless-grip-green.jpg',
    description: 'A symbol of Italian luxury fashion heritage. Features an emerald green horizontal striped dial embellished with iconic interlocking GG monograms, a solid stainless steel case, and a link bracelet with push-button butterfly deployment clasp.',
    features: [
      'Solid stainless steel link bracelet',
      'Push-button butterfly deployment clasp',
      'Signature emerald green striped dial with interlocking GG monogram',
      'Date display window at 4 o\'clock',
      'Luminous hands for nighttime visibility',
      'High-polish stainless steel casing'
    ],
    category: 'stylish-watches',
    inStock: true,
  },
  {
    id: 51,
    slug: 'cartier-tank-must-gold',
    name: 'Cartier Tank Must Gold',
    productCode: 'TTS-SW-051',
    price: 3899,
    image: '/images/cartier-tank-must-gold-black.jpg',
    description: 'The pinnacle of understated Parisian elegance. The Cartier Tank Must Gold features a slim rectangular 18k gold plated case, a minimalist pitch-black lacquer dial with date window at 6 o\'clock, and a premium black crocodile-grain leather strap.',
    features: [
      'Black crocodile-grain genuine leather strap',
      'Gold-plated classic pin buckle lock',
      'Classic rectangular 18k gold plated Tank case',
      'Minimalist black lacquer dial with date at 6 o\'clock',
      'Polished gold sword hands',
      'Timeless formal and black-tie elegance'
    ],
    category: 'stylish-watches',
    inStock: true,
  },
  {
    id: 52,
    slug: 'trove-diamond-faceted-royal-blue',
    name: 'TROVE Diamond Faceted Royal Blue',
    productCode: 'TTS-SW-052',
    price: 3499,
    image: '/images/trove-diamond-faceted-royalblue.jpg',
    description: 'Dramatic geometry meets horological brilliance. Features multi-faceted 3D prism crystal glass that catches light from every angle, a royal blue sunburst dial with Roman numerals and diamond markers, day-date window, and a 3D pyramid faceted steel bracelet.',
    features: [
      '3D pyramid faceted stainless steel bracelet',
      'Push-button concealed butterfly lock',
      'Multi-faceted geometric cut crystal glass',
      'Royal blue sunburst dial with Roman and diamond markers',
      'Day and date display window at 3 o\'clock',
      'High-polish geometric link architecture'
    ],
    category: 'stylish-watches',
    inStock: true,
  }
];

// ===== WOMEN'S WATCHES =====
export const womensWatches = [
  {
    id: 53,
    slug: 'truworth-baguette-crystal-luxury',
    name: 'Truworth Baguette Crystal Luxury',
    productCode: 'TTS-WW-053',
    price: 3499,
    image: '/images/truworth-baguette-crystal-luxury.jpg',
    description: 'An ethereal jewelry timepiece crafted for galas, weddings, and grand occasions. Features a full bezel and bracelet adorned with baguette-cut sparkling crystals, framing a sunburst charcoal grey dial with diamond accent markers.',
    features: [
      'Full baguette-cut crystal link bracelet',
      'Concealed snap-fit jewelry lock',
      'Dazzling baguette-cut crystal bezel and band',
      'Charcoal sunburst dial with diamond accent markers',
      'Elegant jewelry fit tailored for women\'s wrists',
      'Stainless steel casing with scratch protection'
    ],
    category: 'women-watches',
    inStock: true,
  },
  {
    id: 54,
    slug: 'cartier-panthere-gold-edition',
    name: 'Cartier Panthère Gold Edition',
    productCode: 'TTS-WW-054',
    price: 4650,
    image: '/images/cartier-panthere-gold-box.jpg',
    description: 'A legendary icon of women\'s luxury. The Cartier Panthère Gold Edition features an 18k yellow gold plated square case with exposed bezel screws, a classic white dial with Roman numerals, a blue sapphire cabochon crown, and an ultra-supple 5-link gold Panthère bracelet. Includes the branded Cartier presentation box set.',
    features: [
      '18k yellow gold plated 5-link Panthère bracelet',
      'Concealed double-folding butterfly lock',
      'Square gold case with iconic exposed bezel screws',
      'Classic white dial with black Roman numerals and blued sword hands',
      'Crown set with a synthetic blue sapphire cabochon',
      'Includes branded luxury Cartier presentation box set'
    ],
    category: 'women-watches',
    inStock: true,
  },
  {
    id: 55,
    slug: 'mewear-diamond-faceted-crystal',
    name: 'Mewear Diamond Faceted Crystal',
    productCode: 'TTS-WW-055',
    price: 2699,
    image: '/images/mewear-diamond-faceted-crystal.jpg',
    description: 'Dainty, radiant, and undeniably feminine. The Mewear watch features a 3D diamond-faceted prism crystal that refracts light across a shimmering white mother-of-pearl dial with 4 diamond markers, finished with a two-tone gold and silver 3D pyramid link jewelry bracelet.',
    features: [
      'Two-tone gold and silver 3D pyramid link jewelry bracelet',
      'Secure folding jewelry clasp lock',
      '3D diamond-faceted prism crystal glass',
      'Shimmering white mother-of-pearl dial with 4 crystal markers',
      'Dainty, lightweight luxury jewelry fit',
      'High-precision quartz movement'
    ],
    category: 'women-watches',
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
    slug: 'pure-leather-formal-belt',
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
    slug: 'minimalist-card-holder',
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
    slug: 'medium-style-wallet',
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
    slug: 'gucci-card-holder',
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
    slug: 'triplet-brown-wallet',
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
    slug: 'crocodile-style-wallet',
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
    slug: 'leather-bi-fold-wallet',
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
  ...womensWatches,
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
    case 'women-watches':
      return womensWatches;
    case 'belts':
      return belts;
    case 'wallets':
      return wallets;
    default:
      return [];
  }
}