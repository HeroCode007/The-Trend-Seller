import fs from 'fs';
import path from 'path';

// Define the 15-day content strategy
const calendarData = [
  {
    day: 1,
    theme: "VIP New Arrival Drop",
    pillar: "New Arrivals",
    format: "Instagram Reel / TikTok (15s) + Feed Carousel + WhatsApp Status",
    product: {
      name: "OLIYA Diamond Emerald-Cut Luxury",
      code: "TTS-WW-067",
      price: 5800,
      slug: "oliya-emerald-cut-diamond-luxury",
      url: "https://thetrendseller.com/watches/women-watches/oliya-emerald-cut-diamond-luxury"
    },
    hook: "Stop scrolling if you’re looking for the most elegant luxury piece for your next event ✨",
    visual_cue: "Macro close-up shot panning over the emerald-cut faceted crystal under warm studio lighting, revealing the deep emerald dial and gleaming jewelry bracelet. End frame showing the watch on wrist with an embroidered sleeve.",
    caption: `✨ JUST DROPPED: The OLIYA Diamond Emerald-Cut Luxury is finally here.

If you love subtle, high-end sophistication that feels like genuine jewelry on your wrist, this piece is made for you.

💎 Why everyone is obsessed:
• Precision-faceted emerald cut crystal that catches every light angle
• Deep rich emerald & ruby dial options that elevate any eastern or western outfit
• Dainty, ultra-comfortable jubilee-style bracelet with secure jewelry clasp
• Sealed in premium luxury presentation box

🏷️ Launch Price: Rs. 5,800 only (Free Delivery across Pakistan)
📦 Cash on Delivery Available | 1-Year Movement Warranty

👉 Tap the link in bio to order now or DM us on WhatsApp at 0313-0205251 with code "TTS-WW-067" before our limited drop sells out!

#TrendSeller #LuxuryWatchesPakistan #WomensWatchesPK #EmeraldCut #OldMoneyAesthetic #PakistaniFashion #WeddingSeasonPK`,
    whatsapp_status: `✨ NEW ARRIVAL DROP!
OLIYA Diamond Emerald-Cut Luxury Watch 💎
Emerald & Ruby Dial with Faceted Crystal
Rs. 5,800 + FREE COD Delivery across Pakistan 🚚
Reply to order / check video! 📲`
  },
  {
    day: 2,
    theme: "The Minimalist All-Black Statement",
    pillar: "Styling & Daily Wear",
    format: "Reel / Quick Cut (12s) + Story Poll",
    product: {
      name: "Black Arabic Aura",
      code: "TTS-PW-005",
      price: 2100,
      slug: "arabic-aura",
      url: "https://thetrendseller.com/watches/premium-watches/arabic-aura"
    },
    hook: "A 44-gram featherweight all-black watch with Arabic numerals? Yes, it exists.",
    visual_cue: "Fast B-roll transitions: Watch sitting on a dark textured desk -> Close-up of bold Arabic numerals -> Person putting it on with a black hoodie/gym tee -> Flexing wrist to show how light and flush it sits.",
    caption: `Minimalism meets bold cultural heritage. Meet the Black Arabic Aura. 🖤

Weighing only 44 grams, this feather-light timepiece gives you pure stealth aesthetic without the bulk or wrist fatigue. Perfect for daily university, office, or gym wear.

⚡ Key Highlights:
• Bold Arabic numeral dial with crisp contrast
• Ultra-lightweight 44g composite body
• Smooth matte black finish that matches literally everything
• Sweat & splash resistant build

💰 Special Price: Rs. 2,100 only
🚚 Cash on Delivery available all over Pakistan | 2-3 Days Fast Dispatch

Tap the link in bio to grab yours or DM / WhatsApp 0313-0205251 to reserve your piece!

#ArabicWatch #AllBlackWatch #StealthLook #MinimalistStylePK #DailyWearPK #TrendSellerWatches #StreetwearPakistan`,
    whatsapp_status: `🖤 Black Arabic Aura (TTS-PW-005)
Ultra-lightweight 44g stealth build with bold Arabic numerals!
Rs. 2,100 with Cash on Delivery 🚚
Tap or reply to get yours today 📲`
  },
  {
    day: 3,
    theme: "Executive Office Styling",
    pillar: "Styling & Use-Case",
    format: "3-Slide Carousel (Outfit Breakdown) + Reel",
    product: {
      name: "Rolex Daytona Black-Dial Chronograph",
      code: "TTS-PW-002",
      price: 4899,
      slug: "rolex-daytona-leather",
      url: "https://thetrendseller.com/watches/premium-watches/rolex-daytona-leather"
    },
    hook: "How to level up your formal office presence without spending a fortune 👔",
    visual_cue: "Slide 1: Crisp white shirt, tailored navy blazer, with the Daytona Black Dial on wrist. Slide 2: Macro shot of the ceramic tachymeter bezel and contrasting sub-dials. Slide 3: Packaging box and warranty card display.",
    caption: `First impressions are made in the first 7 seconds. Make every handshake count. 💼

The Daytona Black-Dial Chronograph brings pure executive power to your daily corporate and formal wardrobe.

🔍 Details that matter:
• High-contrast racing sub-dials with functional pushers
• Deep ceramic tachymeter bezel with razor-sharp engravings
• Supple, breathable strap with deployant safety clasp
• Sapphire coated crystal for daily scratch protection

🏷️ Price: Rs. 4,899 (Free Insured Delivery)
🎁 Comes inside a hard luxury box with 1-Year Movement Warranty

Order online at thetrendseller.com or WhatsApp us at 0313-0205251 for instant COD booking!

#ExecutiveStyle #OfficeWearPK #CorporateFashionPakistan #DaytonaStyle #LuxuryChronograph #MensWatchesPK #TheTrendSeller`,
    whatsapp_status: `👔 The Executive Choice: Daytona Black-Dial Chrono
Flawless tachymeter bezel & solid wrist weight.
Rs. 4,899 + Free Delivery + Luxury Box 🎁
Order on COD: 0313-0205251`
  },
  {
    day: 4,
    theme: "Real Verified Customer Proof",
    pillar: "Social Proof",
    format: "Unboxing Reel + Customer Review Overlay Carousel",
    product: {
      name: "SKMEI Royal Square Titanium",
      code: "TTS-PW-001",
      price: 6899,
      slug: "royal-square-titanium",
      url: "https://thetrendseller.com/watches/premium-watches/royal-square-titanium"
    },
    hook: "“Heads turn every single time I wear this to meetings” — Here’s what real customers are saying 🔥",
    visual_cue: "Real unboxing footage showing the protective plastic peel off the square titanium case, followed by real screenshots of customer 5-star reviews overlaid on screen.",
    caption: `Don't just take our word for it — hear what our verified buyers have to say! ⭐⭐⭐⭐⭐

"The case brushing and angles look 10x better in hand than in photos. Heavy masculine feel without being uncomfortable." — Adeel M. (Karachi)

"Industrial AP style look with solid build quality. Got it delivered in 48 hours to Islamabad." — Daniyal K. (Islamabad)

🛠️ Why the Royal Square Titanium is our flagship:
• Distinct architectural square bezel with precision hex screws
• Brushed industrial titanium finish that resists daily scuffs
• Solid deployant buckle with dual-release pushers

🏷️ Price: Rs. 6,899 | Free Delivery across Pakistan
📦 100% Open Parcel check policy on delivery

Shop with peace of mind at thetrendseller.com or message us on WhatsApp: 0313-0205251.

#VerifiedCustomer #CustomerReview #SKMEIRoyalSquare #TitaniumWatch #MasculineStyle #WatchCollectorPK #TrendSeller`,
    whatsapp_status: `⭐⭐⭐⭐⭐ Verified 5-Star Customer Favorite!
SKMEI Royal Square Titanium (TTS-PW-001)
Industrial build, bold square bezel, titanium finish.
Rs. 6,899 with COD. Reply to order 📲`
  },
  {
    day: 5,
    theme: "Couples & Anniversary Special",
    pillar: "Offers & Combos",
    format: "Romantic Lifestyle Reel / Photo Duo + Story Highlight",
    product: {
      name: "\"Timeless Together\" Couple Combo (2 Watches)",
      code: "TTS-PW-038",
      price: 3700,
      slug: "timeless-together-couple-combo",
      url: "https://thetrendseller.com/watches/premium-watches/timeless-together-couple-combo"
    },
    hook: "Looking for the ultimate anniversary or wedding gift? We made it effortless ❤️",
    visual_cue: "A couple holding hands wearing matching his-and-hers timepieces over festive outfits. Cut to close-up of both watches side-by-side inside the red velvet duo presentation box.",
    caption: `Two matching timepieces. One unforgettable bond. 💍

The "Timeless Together" Couple Combo is designed for couples who love subtle synchronization in style. Whether it's for an anniversary, engagement gift, or Eid celebrations, this combo is the complete luxury gift package.

🎁 What's in the Box:
1️⃣ Premium Men's Executive Timepiece
2️⃣ Elegant Women's Dainty Timepiece
3️⃣ Shared Velvet Deluxe Duo Gift Box

🏷️ Combo Deal Price: Rs. 3,700 for BOTH watches! (Save 35% compared to buying individually)
🚚 Free Fast COD Delivery across all cities in Pakistan

Order yours today at thetrendseller.com or WhatsApp us directly at 0313-0205251 with code "TTS-PW-038".

#CoupleWatches #CoupleGoalsPK #AnniversaryGift #PakistaniWeddings #HisAndHers #LuxuryGiftsPK #TheTrendSeller`,
    whatsapp_status: `❤️ "Timeless Together" Couple Combo Deal!
Get BOTH His & Hers Watches in a Deluxe Velvet Box for just Rs. 3,700!
Perfect for gifts & anniversaries 🎉
Free Delivery on COD across Pakistan. Reply to book now!`
  },
  {
    day: 6,
    theme: "Old Money Aesthetic / Vintage Luxury",
    pillar: "Styling & Use-Case",
    format: "Cinematic Aesthetic Reel (15s) + Moodboard Carousel",
    product: {
      name: "Cartier A-Grade Tank Roman Dial",
      code: "TTS-SW-056",
      price: 3999,
      slug: "cartier-a-grade-tank-leather",
      url: "https://thetrendseller.com/watches/stylish-watches/cartier-a-grade-tank-leather"
    },
    hook: "How to master the ‘Quiet Luxury’ aesthetic with one single accessory 🕯️",
    visual_cue: "Slow cinematic pan across a linen blazer, leather loafers, espresso cup, and the slim rectangular Cartier Tank watch with its sapphire cabochon crown catching the sun.",
    caption: `Loud logos scream. True elegance whispers. 🏛️

The Cartier-Style Tank Roman Dial is the quintessential definition of Old Money quiet luxury. Designed with timeless rectangular proportions that slip under any cuff with effortless grace.

✨ Key Details:
• Iconic Roman numeral railway minute track
• Blued steel sword-style hands
• Synthetic blue cabochon gem set into the winding crown
• Hand-stitched black calfskin leather band

🏷️ Price: Rs. 3,999 with Free Insured Shipping
📦 Includes luxury watch box + 1-Year Movement Guarantee

Elevate your presence today. Tap link in bio or WhatsApp 0313-0205251 to order on Cash on Delivery.

#QuietLuxury #OldMoneyAesthetic #CartierTank #VintageWatch #ClassyMenPK #FormalWearPakistan #TrendSeller`,
    whatsapp_status: `🏛️ Old Money Quiet Luxury: Cartier Tank Roman Dial
Rectangular slim case & blued hands.
Rs. 3,999 with Free Delivery 🚚
WhatsApp order: 0313-0205251`
  },
  {
    day: 7,
    theme: "The 2-in-1 Smart Wardrobe Hack",
    pillar: "Accessories & Functionality",
    format: "Demonstration Reel (10s) — 'Watch this twist!'",
    product: {
      name: "Hermès H-Buckle Reversible Leather Belt (Black & Tan)",
      code: "TTS-BT-001",
      price: 2499,
      slug: "hermes-h-buckle-reversible-black-tan",
      url: "https://thetrendseller.com/belts/hermes-h-buckle-reversible-black-tan"
    },
    hook: "Why buy 2 belts when 1 belt does both? Watch this mechanism 🔄",
    visual_cue: "Hands holding the belt, pulling the buckle gently and twisting it 180° to switch from deep black leather to warm tan brown in 1 second flat. Cut to outfit pairing with formal pants, then jeans.",
    caption: `The only belt you'll ever need in your wardrobe. 🖤🤎

The Hermès-Inspired Reversible Belt gives you two complete colors in one solid piece:
1️⃣ Side A: Deep Formal Black for business suits & dress trousers
2️⃣ Side B: Warm Tan Brown for chinos, linen shirts & weekend jeans

⚡ Features:
• Solid mirror-polished gold H-buckle with weighted durability
• Smooth twist-reversal mechanism (zero screws or tools needed)
• Genuine thick top-layer leather that won't crack or peel
• Free hole punch tool included with every box

🏷️ Price: Rs. 2,499 only (Free COD Delivery)

Upgrade your daily essentials now at thetrendseller.com or WhatsApp 0313-0205251!

#ReversibleBelt #MensAccessoriesPK #LeatherBeltPakistan #StyleHacks #MensWardrobe #TrendSeller`,
    whatsapp_status: `🔄 2-in-1 Reversible Luxury Belt (Black & Tan)!
Twist buckle in 1 second to match black or brown shoes.
Rs. 2,499 with Free COD Delivery 🚚
Reply to order now!`
  },
  {
    day: 8,
    theme: "70s Integrated Sports Watch Hype",
    pillar: "New Arrivals / Trending",
    format: "Macro Wrist Roll Reel + Sunlight Lighting Test",
    product: {
      name: "Tissot PRX Powermatic 80",
      code: "TTS-CW-039",
      price: 3499,
      slug: "tissot-prx-powermatic-80",
      url: "https://thetrendseller.com/watches/casual-watches/tissot-prx-powermatic-80"
    },
    hook: "There’s a reason why the PRX waffle dial is the #1 trending watch in the world right now 🧊",
    visual_cue: "A crisp 4K wrist roll stepping from shadow into bright natural sunlight, demonstrating how the textured waffle dial reflections dance and the integrated bracelet catches light.",
    caption: `The integrated bracelet icon that broke the watch world. 🌊

The PRX Powermatic brings unmatched 1970s sports luxury straight to your wrist at an unbelievable value.

🔥 What makes it legendary:
• Signature embossed waffle dial texture with deep 3D relief
• Tapered integrated steel bracelet that hugs the wrist seamlessly
• Hidden butterfly deployant clasp for a smooth, unbroken look
• Ultra-sharp polished bevels on brushed satin steel

🏷️ Limited Batch Price: Rs. 3,499 (Free Delivery)
📦 Premium box + 1-Year movement warranty

Tap link in bio to order before the current batch sells out, or WhatsApp 0313-0205251 for instant COD!

#TissotPRX #PRXPowermatic #WaffleDial #IntegratedBracelet #WatchLoverPakistan #TrendSellerPK`,
    whatsapp_status: `🧊 Trending: Tissot PRX Waffle Dial Edition!
Integrated steel bracelet + butterfly lock.
Rs. 3,499 with Free Delivery across Pakistan 🚚
Reply to get yours before stock runs out 📲`
  },
  {
    day: 9,
    theme: "Front Pocket Minimalism",
    pillar: "Everyday Carry (EDC)",
    format: "Flat Lay Reel / Photo + Wallet Slimness Comparison",
    product: {
      name: "Brown Leather Card Holder",
      code: "TTS-WL-021",
      price: 1799,
      slug: "brown-leather-card-holder",
      url: "https://thetrendseller.com/wallets/brown-leather-card-holder"
    },
    hook: "Stop carrying that bulky, fat wallet in your back pocket. Try this instead 💳",
    visual_cue: "Side-by-side comparison: Thick bulging old wallet vs. the ultra-slim Brown Leather Card Holder. Demonstration sliding 6 cards + folded 1,000/5,000 notes into the center pocket, then slipping it effortlessly into a slim jean front pocket.",
    caption: `Your back pocket will thank you. Say goodbye to uncomfortable wallet bulges. 👝

The Minimalist Brown Leather Card Holder is engineered for modern everyday carry (EDC):

✨ Why you'll never go back to standard bi-folds:
• Holds 6 essential credit/debit/CNIC cards snug and secure
• Center compartment for folded cash currency & receipts
• Ultra-slim 0.4cm profile that fits effortlessly in shirt or front trouser pockets
• Hand-burnished genuine leather that develops a rich vintage patina over time

🏷️ Price: Rs. 1,799 with Free Cash on Delivery
🎁 Ready to gift in our branded presentation box

Upgrade your everyday carry today at thetrendseller.com or DM us on WhatsApp at 0313-0205251!

#CardHolderPK #SlimWallet #EverydayCarryPK #MensLeatherGoods #MinimalistEDC #TheTrendSeller`,
    whatsapp_status: `💳 Say goodbye to bulky wallets!
Slim Brown Leather Card Holder (Holds 6 cards + cash)
Rs. 1,799 with Free COD Delivery 🚚
Order on WhatsApp: 0313-0205251`
  },
  {
    day: 10,
    theme: "Royal Blue & Gold Luxury",
    pillar: "Social Proof & High Luxury",
    format: "Close-up macro video (10s) with upbeat audio",
    product: {
      name: "Rolex Datejust Two-Tone Royal Blue Diamond",
      code: "TTS-PW-062",
      price: 4799,
      slug: "rolex-datejust-twotone-royal-blue-diamond",
      url: "https://thetrendseller.com/watches/premium-watches/rolex-datejust-twotone-royal-blue-diamond"
    },
    hook: "Under room lights it looks dark navy. Under the sun? Pure electric royal blue 💎",
    visual_cue: "Light sweeping across the royal blue sunburst dial. Zoom-in on the fluted gold bezel reflecting light facets, cyclops 2.5x date magnification lens, and the fluid 5-link jubilee chain.",
    caption: `The King of Two-Tone Luxury: Royal Blue Sunburst & Gold Fluted Bezel. 👑

Whether you're dressing up for a formal banquet, a brother's wedding, or closing high-stakes business deals, this Datejust edition commands supreme respect.

⭐ Key Specifications:
• Radiant royal blue sunburst dial with brilliant diamond index markers
• Fluted bezel engineered to reflect light from every perspective
• 2.5x Cyclops date magnification window
• Fluid 5-piece jubilee bracelet with solid crown deployant lock

🏷️ Price: Rs. 4,799 (Free Insured COD Delivery)
🛡️ Backed by our 1-Year Movement Warranty

Tap the link in bio to inspect photos & order online, or WhatsApp 0313-0205251 for express dispatch!

#RolexDatejust #RoyalBlueWatch #TwoToneLuxury #WeddingWatchPK #PakistaniGrooms #TheTrendSeller`,
    whatsapp_status: `👑 Royal Blue Two-Tone Datejust (TTS-PW-062)
Sunburst blue dial + Diamond indices + Fluted Gold Bezel!
Rs. 4,799 with Free Delivery & Luxury Box 🎁
Reply to order 📲`
  },
  {
    day: 11,
    theme: "Dainty Vintage Wine Aesthetic",
    pillar: "Styling & Womenswear",
    format: "Soft Aesthetic Reel with Lo-Fi music + Carousel",
    product: {
      name: "IEKE Vintage Tank Burgundy & Gold",
      code: "TTS-WW-066",
      price: 3299,
      slug: "ieke-vintage-tank-burgundy-gold",
      url: "https://thetrendseller.com/watches/women-watches/ieke-vintage-tank-burgundy-gold"
    },
    hook: "The vintage burgundy watch every aesthetic moodboard is raving about 🍷",
    visual_cue: "Soft aesthetic shot of the watch resting on a classic book next to a warm cup of coffee, then worn on a wrist wearing a knitted cream sweater / black abaya.",
    caption: `Deep burgundy wine leather meets vintage polished gold. 🍷✨

The IEKE Vintage Tank is crafted for women who appreciate understated vintage sophistication. It effortlessly complements abayas, formal work kurtis, and cozy western layers.

🎀 Why you'll fall in love with it:
• Rich, supple burgundy wine leather strap that softens with wear
• Slim rectangular gold case with vintage art-deco numerals
• Feather-light feel for effortless all-day comfort
• Scratch-resistant mineral crystal dial

🏷️ Price: Rs. 3,299 only (Free Delivery across Pakistan)
📦 Packed safely with protective film inside a luxury box

Order directly at thetrendseller.com or WhatsApp us at 0313-0205251 to claim yours!

#VintageAesthetic #WomensWatchPK #BurgundyWatch #OldMoneyWomen #ModestFashionPK #TrendSeller`,
    whatsapp_status: `🍷 Vintage Burgundy & Gold Tank (TTS-WW-066)
Old-money art-deco aesthetic for women.
Rs. 3,299 with Free COD Delivery 🚚
Reply to order on WhatsApp 📲`
  },
  {
    day: 12,
    theme: "Full Bling & Party Stunner",
    pillar: "Urgency / Special Occasion",
    format: "Flashy Night-Time Video Reel (15s)",
    product: {
      name: "Iced-Out Skeleton Chronograph Diamond Edition",
      code: "TTS-PW-063",
      price: 4999,
      slug: "iced-out-skeleton-chronograph-diamond",
      url: "https://thetrendseller.com/watches/premium-watches/iced-out-skeleton-chronograph-diamond"
    },
    hook: "If you want to enter the wedding hall and have everyone ask what’s on your wrist 💎🔥",
    visual_cue: "Dim lighting with flash on, showing the multi-stone pavé casing dancing with light beams. Transitioning to skeleton movement gears turning inside the dial.",
    caption: `Turn every room into your personal red carpet. 💎✨

The Iced-Out Skeleton Chronograph is unapologetically bold, engineered for high-energy celebrations, concerts, and wedding season.

⚡ Master Craftsmanship:
• Fully paved bezel and casing with precision-set micro crystals
• Open-worked skeleton dial exposing the mechanical gear train
• High-grade silicone sports strap for extreme wrist grip and durability
• Heavy, authentic weight on the wrist

🏷️ Price: Rs. 4,999 (Free COD Delivery across Pakistan)
🎁 Luxury hard case + 1-Year Movement Warranty included

Limited pieces in stock. Tap link in bio or WhatsApp 0313-0205251 to secure yours!

#IcedOutWatch #BlingWatch #WeddingSeasonPakistan #PartyWearPK #StatementPiece #TheTrendSeller`,
    whatsapp_status: `💎 ICED-OUT SKELETON CHRONOGRAPH (TTS-PW-063)
Full pave crystal bezel + Skeleton movement!
Rs. 4,999 with Free Delivery & Luxury Box 🚚
Order on WhatsApp: 0313-0205251`
  },
  {
    day: 13,
    theme: "Ceramic Masterpiece / Scratch-Proof",
    pillar: "Product Feature Deep-Dive",
    format: "Coin Scratch Test Video (8s) + Macro Specs Carousel",
    product: {
      name: "Rado True Square Automatic Black Ceramic",
      code: "TTS-PW-057",
      price: 4999,
      slug: "rado-true-square-automatic-black-ceramic",
      url: "https://thetrendseller.com/watches/premium-watches/rado-true-square-automatic-black-ceramic"
    },
    hook: "We took a metal key to this high-tech ceramic watch. Here’s what happened 🔑",
    visual_cue: "Close-up demonstration rubbing a metal key gently against the glossy black ceramic case, then wiping it with a microfiber cloth to reveal zero scratches. Pan to the hypnotic open skeleton heart wheel.",
    caption: `High-tech ceramic is virtually indestructible. Meet the Rado True Square Automatic. 🖤

Unlike standard stainless steel that collects hairline scratches from laptop desks and car doors, high-tech ceramic retains its mirror gloss luster forever.

🔬 Engineered for Perfection:
• Ultra-hard polished black ceramic case & bracelet
• Open skeleton dial showcasing the oscillating balance wheel
• Titanium 3-fold clasp with push-button release
• Silky-smooth skin temperature adaptation (never feels sticky or cold)

🏷️ Price: Rs. 4,999 (Free Insured Shipping)
🛡️ 1-Year Movement Warranty | Cash on Delivery Available

Inspect full 360° photos at thetrendseller.com or WhatsApp us at 0313-0205251!

#RadoTrueSquare #CeramicWatch #ScratchResistant #SkeletonWatch #LuxuryTimepiecePK #TrendSeller`,
    whatsapp_status: `🖤 Rado True Square Black Ceramic (TTS-PW-057)
High-tech scratch-resistant ceramic + Skeleton balance wheel.
Rs. 4,999 with Free Delivery 🚚
Reply to order on WhatsApp!`
  },
  {
    day: 14,
    theme: "World Traveler Globe Aesthetic",
    pillar: "Product Spotlight",
    format: "High-Production Wrist Macro Reel (12s)",
    product: {
      name: "Omega Seamaster Aqua Terra Worldtimer",
      code: "TTS-PW-061",
      price: 4999,
      slug: "omega-seamaster-aqua-terra-worldtimer",
      url: "https://thetrendseller.com/watches/premium-watches/omega-seamaster-aqua-terra-worldtimer"
    },
    hook: "The world’s most intricate laser-etched dial, right on your wrist 🌍",
    visual_cue: "Extreme macro lens focusing on the center Earth disk surrounded by global cities and the 24-hour day/night ring. Showing the integrated blue rubber strap with polished steel end-links.",
    caption: `Travel the globe without leaving your room. 🌍✈️

The Aqua Terra Worldtimer is renowned as one of the most visually mesmerizing dials ever conceived in modern horology.

🌐 The Art of Timekeeping:
• Laser-etched vision of the Earth from the North Pole at dial center
• 24-Hour dual-color day/night indicator ring
• 24 Global destination cities engraved along the outer perimeter
• Premium textured blue rubber strap with white contrast stitching and deployant clasp

🏷️ Price: Rs. 4,999 with Free Nationwide Delivery
🎁 Includes Deluxe Gift Packaging & 1-Year Warranty

Order yours today at thetrendseller.com or WhatsApp us at 0313-0205251!

#Worldtimer #AquaTerra #HorologyPK #TravelWatch #MensLuxuryPK #TheTrendSeller`,
    whatsapp_status: `🌍 Omega Aqua Terra Worldtimer (TTS-PW-061)
Intricate laser-etched globe dial + 24-hour city ring!
Rs. 4,999 with Free Delivery across Pakistan 🚚
Reply to book yours today 📲`
  },
  {
    day: 15,
    theme: "The Ultimate VIP Catalog Recap & Limited Stock Alert",
    pillar: "Recap & Urgency",
    format: "Fast-Paced 15s Mashup Reel (All Best-Sellers) + Story Q&A",
    product: {
      name: "Trend Seller Best-Sellers Collection (Watches, Belts, Wallets)",
      code: "TTS-CATALOG-2026",
      price: 2100,
      slug: "watches",
      url: "https://thetrendseller.com"
    },
    hook: "Which one are you wearing this weekend? Vote 1, 2, 3, or 4 in the comments! 👇",
    visual_cue: "Fast, punchy 1-second cuts of: 1. OLIYA Emerald Diamond -> 2. Rolex Datejust Two-Tone Blue -> 3. Hermès Reversible Belt -> 4. Black Arabic Aura -> 5. PRX Powermatic Waffle Dial. Ending on the Trend Seller logo with 'Free COD Delivery across Pakistan'.",
    caption: `15 Days of pure horological excellence. Which piece stole your heart? 👑🔥

Whether you're looking for everyday minimalist stealth, wedding season pavé diamonds, or executive boardroom power, The Trend Seller catalog has you covered with over 80+ curated luxury designs.

✨ Why 10,000+ happy customers across Pakistan trust us:
✅ 100% Open parcel inspection before payment
✅ Free express Cash on Delivery to Karachi, Lahore, Islamabad & 200+ cities
✅ 1-Year Movement Warranty on all premium timepieces
✅ Complimentary deluxe hard gift packaging

📲 Browse our full live catalog at thetrendseller.com
💬 Or WhatsApp our 24/7 concierge team at 0313-0205251 to claim today's active promo code!

Drop your favorite number (1-5) below! 👇

#TrendSeller #LuxuryWatchesPakistan #BestSellersPK #MensFashionPakistan #WomensAccessoriesPK #PakistaniShoppers #CashOnDeliveryPK`,
    whatsapp_status: `🔥 WEEKEND RESTOCK ALERT!
Over 80+ Premium Watches, Reversible Belts & Wallets live on website!
🚚 Free COD Delivery + Open Parcel Check
Visit thetrendseller.com or reply here to order 📲`
  }
];

// Ensure output directories exist
const outDir = path.resolve(process.cwd(), 'trend-seller-automation', 'content-calendar');
fs.mkdirSync(outDir, { recursive: true });

// 1. Write JSON file
fs.writeFileSync(
  path.join(outDir, 'calendar-15-days.json'),
  JSON.stringify(calendarData, null, 2),
  'utf8'
);
console.log('✅ Generated calendar-15-days.json');

// 2. Write CSV file
const csvHeaders = ['Day', 'Theme', 'Pillar', 'Product Name', 'Product Code', 'Price (PKR)', 'Format', 'Hook', 'URL'];
const csvRows = calendarData.map(item => {
  return [
    item.day,
    `"${item.theme.replace(/"/g, '""')}"`,
    `"${item.pillar.replace(/"/g, '""')}"`,
    `"${item.product.name.replace(/"/g, '""')}"`,
    `"${item.product.code}"`,
    item.product.price,
    `"${item.format.replace(/"/g, '""')}"`,
    `"${item.hook.replace(/"/g, '""')}"`,
    `"${item.product.url}"`
  ].join(',');
});
fs.writeFileSync(
  path.join(outDir, 'calendar-15-days.csv'),
  [csvHeaders.join(','), ...csvRows].join('\n'),
  'utf8'
);
console.log('✅ Generated calendar-15-days.csv');

// 3. Write Markdown file
let mdContent = `# Trend Seller — 15-Day High-Converting Content Calendar (Phase 1)

**Strategy Overview:**
- **Pillars:** New Arrivals (25%), Use-Case Styling (30%), Social Proof & Reviews (15%), Offers/Combos (15%), Urgency/Recap (15%).
- **Channels Covered:** Instagram Reels & Carousels, TikTok, Facebook Page, and WhatsApp Status updates.
- **Conversion Mechanisms:** 2-Second Attention Hooks, Clear Value Props & Features, Direct Pricing, and Friction-Free WhatsApp / Website CTAs with COD.

---

`;

calendarData.forEach(item => {
  mdContent += `## 📅 Day ${item.day}: ${item.theme}
- **Pillar:** \`${item.pillar}\`
- **Target Product:** [${item.product.name}](${item.product.url}) (\`${item.product.code}\` — **Rs. ${item.product.price.toLocaleString()}**)
- **Recommended Format:** ${item.format}

### 🎯 2-Second Hook (Visual & Voice)
> **"${item.hook}"**

### 🎬 Visual Direction / B-Roll Cue
*${item.visual_cue}*

### 📝 Full Instagram / Facebook Caption
\`\`\`text
${item.caption}
\`\`\`

### 📲 WhatsApp Status Copy (For Instant Broadcast)
\`\`\`text
${item.whatsapp_status}
\`\`\`

---

`;
});

fs.writeFileSync(path.join(outDir, 'calendar-15-days.md'), mdContent, 'utf8');
console.log('✅ Generated calendar-15-days.md');

// Also create a standalone handy text file in the workspace root for quick mobile reference
fs.writeFileSync(path.resolve(process.cwd(), 'trend-seller-15-days-content.txt'), mdContent, 'utf8');
console.log('✅ Generated trend-seller-15-days-content.txt for quick access');
