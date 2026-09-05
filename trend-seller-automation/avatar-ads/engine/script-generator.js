import fs from 'fs';
import path from 'path';

// High-Converting Video Ad Scripts for Saif's AI Avatar
const ugcAdScripts = [
  {
    id: "UGC-001",
    title: "His & Hers Grand Couple Combo Deal (High-Impulse Offer)",
    target_product: "Rolex Datejust Royal Blue + OLIYA Diamond Emerald-Cut",
    target_audience: "Couples, newlyweds, anniversary shoppers, wedding attendees",
    video_length: "25-30 seconds",
    avatar_pose: "Standing confidently in blazer, holding wrist up toward camera with natural gestures",
    voice_tone: "Warm, authoritative, enthusiastic executive",
    beats: [
      {
        time: "0:00 - 0:03",
        beat_type: "The 2-Second Pattern Interrupt Hook",
        visual_direction: "Saif looks directly into the camera, smiling, gesturing with both hands. Quick B-roll flash of the glowing duo watch box.",
        spoken_dialogue_roman_urdu: "Agar aap apne partner ya kisi special person ke liye aik memorable luxury gift dhoond rahe hain, to aglay 15 seconds miss mat karna!",
        spoken_dialogue_english: "If you're looking for an unforgettable luxury gift for your partner, do not miss the next 15 seconds!"
      },
      {
        time: "0:03 - 0:12",
        beat_type: "The Problem & Solution (Dual Luxury Showcase)",
        visual_direction: "Split screen showing Saif on the left and 4K macro video of both watches on the right with glowing price tags.",
        spoken_dialogue_roman_urdu: "The Trend Seller pe hum launch kar rahe hain apna Grand His & Hers Couple Combo! Men's ke liye royal blue sunburst dial Datejust with gold fluted bezel, aur ladies ke liye stunning OLIYA Diamond Emerald-Cut with faceted crystal. Alag se inki value 10,500 se zyada hai!",
        spoken_dialogue_english: "At The Trend Seller we are dropping our Grand His & Hers Couple Combo! For him, the royal blue sunburst Datejust with gold fluted bezel, and for her, the stunning OLIYA Diamond Emerald-Cut with faceted crystal. Individually they cost over 10,500!"
      },
      {
        time: "0:12 - 0:20",
        beat_type: "The Unbeatable Deal & Risk Reversal",
        visual_direction: "Sticker overlay 'Rs. 6,850 ONLY' and badges 'Open Parcel Check' & '1-Year Warranty'.",
        spoken_dialogue_roman_urdu: "Lekin is limited combo deal me aapko yeh dono watches milengi sirf Rs. 6,850 me! Cash on Delivery all over Pakistan, aur sab se barh kar 100% open parcel check policy. Pehle parcel check karein, phir pay karein.",
        spoken_dialogue_english: "But in this limited combo deal, you get both watches for just Rs. 6,850! Cash on Delivery across Pakistan, and best of all, 100% open parcel inspection before payment."
      },
      {
        time: "0:20 - 0:26",
        beat_type: "The Immediate Call-To-Action (CTA)",
        visual_direction: "Saif points to the screen button. WhatsApp banner 0313-0205251 slides in with animated pulsing click indicator.",
        spoken_dialogue_roman_urdu: "Stock bohot limited hai. Neechay link pe tap karein ya abhi WhatsApp karein 0313-0205251 pe to claim your combo deal today!",
        spoken_dialogue_english: "Stock is strictly limited. Tap the link below or WhatsApp 0313-0205251 now to claim your combo deal today!"
      }
    ],
    avatar_api_payload: {
      provider: "heygen_or_captions",
      avatar_image_path: "trend-seller-automation/avatar-ads/assets/saif-avatar-base.jpg",
      voice_id: "pakistani_male_professional_en_urdu",
      speed: 1.05,
      aspect_ratio: "9:16",
      background_style: "luxury_studio_dark_gradient",
      captions_enabled: true,
      caption_style: "beast_style_glow_yellow_highlight"
    }
  },
  {
    id: "UGC-002",
    title: "OLIYA Diamond Emerald-Cut Luxury (Women's Event Stunner)",
    target_product: "OLIYA Diamond Emerald-Cut Luxury (TTS-WW-067)",
    target_audience: "Women, brides, eastern fashion lovers, gift buyers",
    video_length: "20-25 seconds",
    avatar_pose: "Holding presentation box slightly tilted toward the camera with a refined smile",
    voice_tone: "Sophisticated, passionate, conversational",
    beats: [
      {
        time: "0:00 - 0:03",
        beat_type: "The Curiosity & Visual Sparkle Hook",
        visual_direction: "Macro zoom on the faceted emerald-cut crystal reflecting studio lights.",
        spoken_dialogue_roman_urdu: "Kia aap ne kabhi aisi watch dekhi hai jo ghari se zyada aik real jewelry piece lagti ho?",
        spoken_dialogue_english: "Have you ever seen a watch that looks more like a real piece of fine jewelry?"
      },
      {
        time: "0:03 - 0:11",
        beat_type: "Feature Highlighting",
        visual_direction: "Close-up of the emerald and ruby dials, zooming in on the dainty jewelry lock clasp.",
        spoken_dialogue_roman_urdu: "This is the all-new OLIYA Diamond Emerald-Cut Luxury. Iska geometric cut crystal room lights me diamond ki tarah sparkle karta hai, aur deep emerald dial aapke eastern aur western outfits ko instant luxury feel deta hai.",
        spoken_dialogue_english: "This is the all-new OLIYA Diamond Emerald-Cut Luxury. Its geometric faceted crystal sparkles like a diamond under lights, and the deep emerald dial gives instant luxury to your eastern and western outfits."
      },
      {
        time: "0:11 - 0:18",
        beat_type: "Trust & Pricing Offer",
        visual_direction: "Price pop: 'Rs. 5,800' with 'Free Delivery in PK' pill.",
        spoken_dialogue_roman_urdu: "Deluxe packaging ke sath sirf Rs. 5,800 me with Free Cash on Delivery all across Pakistan aur 1-Year Movement Warranty!",
        spoken_dialogue_english: "Comes in deluxe packaging for just Rs. 5,800 with Free Cash on Delivery nationwide and 1-Year Movement Warranty!"
      },
      {
        time: "0:18 - 0:23",
        beat_type: "The CTA",
        visual_direction: "Saif gestures to bio link / WhatsApp number with smooth transition.",
        spoken_dialogue_roman_urdu: "Yeh limited launch batch hai. Order karne ke liye bio link pe tap karein ya direct WhatsApp 0313-0205251 pe message karein.",
        spoken_dialogue_english: "This is a limited launch batch. Tap the link in bio to order or message directly on WhatsApp 0313-0205251."
      }
    ],
    avatar_api_payload: {
      provider: "heygen_or_captions",
      avatar_image_path: "trend-seller-automation/avatar-ads/assets/saif-avatar-base.jpg",
      voice_id: "pakistani_male_professional_en_urdu",
      speed: 1.05,
      aspect_ratio: "9:16",
      background_style: "warm_luxury_interior_bokeh",
      captions_enabled: true,
      caption_style: "beast_style_glow_emerald_highlight"
    }
  },
  {
    id: "UGC-003",
    title: "Black Arabic Aura (The 44g Featherweight Stealth Watch)",
    target_product: "Black Arabic Aura (TTS-PW-005)",
    target_audience: "Gen-Z, university students, gym enthusiasts, minimalists",
    video_length: "20 seconds",
    avatar_pose: "Casual posture, tapping wrist watch with index finger",
    voice_tone: "Punchy, relatable, modern street smart",
    beats: [
      {
        time: "0:00 - 0:03",
        beat_type: "The Shock Value / Weight Hook",
        visual_direction: "Digital scale showing '44g' as the watch is placed on it.",
        spoken_dialogue_roman_urdu: "Sirf 44 grams! Yeh Pakistan ki sab se lightweight all-black Arabic dial watch hai.",
        spoken_dialogue_english: "Just 44 grams! This is the most lightweight all-black Arabic dial watch in Pakistan."
      },
      {
        time: "0:03 - 0:10",
        beat_type: "Everyday Benefits",
        visual_direction: "Quick transitions: gym wear, hoodie, office desk.",
        spoken_dialogue_roman_urdu: "Black Arabic Aura me hai matte black stealth build aur crisp Arabic numerals. Wrist pe itni light hai ke aapko pata bhi nahi chalega ke aapne watch pehni hui hai.",
        spoken_dialogue_english: "The Black Arabic Aura features a matte black stealth build with crisp Arabic numerals. It feels so light on the wrist you won't even notice you're wearing it."
      },
      {
        time: "0:10 - 0:16",
        beat_type: "Price Drop Announcement",
        visual_direction: "Big bold price tag 'Rs. 2,100' popping up with sound effect.",
        spoken_dialogue_roman_urdu: "Aur best part? Price sirf Rs. 2,100! Cash on delivery har city me available hai.",
        spoken_dialogue_english: "And the best part? Price is just Rs. 2,100! Cash on delivery available in every city."
      },
      {
        time: "0:16 - 0:20",
        beat_type: "Urgent CTA",
        visual_direction: "WhatsApp CTA animation.",
        spoken_dialogue_roman_urdu: "Apna piece claim karne ke liye bio link tap karein ya WhatsApp 0313-0205251 pe message karein.",
        spoken_dialogue_english: "Tap link in bio or WhatsApp 0313-0205251 to claim yours right now."
      }
    ],
    avatar_api_payload: {
      provider: "heygen_or_captions",
      avatar_image_path: "trend-seller-automation/avatar-ads/assets/saif-avatar-base.jpg",
      voice_id: "pakistani_male_energetic_en_urdu",
      speed: 1.08,
      aspect_ratio: "9:16",
      background_style: "dark_minimal_studio",
      captions_enabled: true,
      caption_style: "beast_style_glow_cyan_highlight"
    }
  },
  {
    id: "UGC-004",
    title: "Hermès Reversible Leather Belt (The 2-in-1 Wardrobe Hack)",
    target_product: "Hermès H-Buckle Reversible Leather Belt (TTS-BT-001)",
    target_audience: "Men, corporate professionals, suit wearers",
    video_length: "22 seconds",
    avatar_pose: "Demonstrating the buckle twist with hands close to frame",
    voice_tone: "Practical, clever, premium problem solver",
    beats: [
      {
        time: "0:00 - 0:03",
        beat_type: "The Wardrobe Hack Hook",
        visual_direction: "Hands pull and twist the buckle 180° in 1 second.",
        spoken_dialogue_roman_urdu: "Agar aap alag black aur brown belt khareedte hain, to aap apne paise waste kar rahe hain!",
        spoken_dialogue_english: "If you buy separate black and brown belts, you're wasting your money!"
      },
      {
        time: "0:03 - 0:11",
        beat_type: "The 2-in-1 Twist Demo",
        visual_direction: "Split frame showing Black side with suit pants vs Tan side with jeans.",
        spoken_dialogue_roman_urdu: "Check out this Reversible Luxury Leather Belt. Aik second me buckle twist karein: Black side formal suits ke liye, aur Tan Brown side weekend jeans aur chinos ke liye. Genuine thick leather that never cracks.",
        spoken_dialogue_english: "Check out this Reversible Luxury Leather Belt. Twist the buckle in one second: Black side for formal suits, Tan Brown side for weekend jeans and chinos. Genuine thick leather that never cracks."
      },
      {
        time: "0:11 - 0:17",
        beat_type: "Offer & Free Gift",
        visual_direction: "Shows branded box, dustbag, and free hole puncher tool.",
        spoken_dialogue_roman_urdu: "Sirf Rs. 2,499 me with free hole puncher tool aur free COD all over Pakistan.",
        spoken_dialogue_english: "Just Rs. 2,499 with free hole punch tool and free COD all over Pakistan."
      },
      {
        time: "0:17 - 0:22",
        beat_type: "CTA",
        visual_direction: "WhatsApp CTA prompt.",
        spoken_dialogue_roman_urdu: "Abhi thetrendseller.com visit karein ya WhatsApp 0313-0205251 pe apna size confirm karein.",
        spoken_dialogue_english: "Visit thetrendseller.com now or WhatsApp 0313-0205251 to confirm your waist size."
      }
    ],
    avatar_api_payload: {
      provider: "heygen_or_captions",
      avatar_image_path: "trend-seller-automation/avatar-ads/assets/saif-avatar-base.jpg",
      voice_id: "pakistani_male_professional_en_urdu",
      speed: 1.05,
      aspect_ratio: "9:16",
      background_style: "luxury_wood_leather_backdrop",
      captions_enabled: true,
      caption_style: "beast_style_glow_gold_highlight"
    }
  }
];

// Ensure output directories
const outDir = path.resolve(process.cwd(), 'trend-seller-automation', 'avatar-ads');
fs.mkdirSync(path.join(outDir, 'scripts'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'prompts'), { recursive: true });

// 1. Write JSON file
fs.writeFileSync(
  path.join(outDir, 'scripts', 'batch-ugc-scripts.json'),
  JSON.stringify(ugcAdScripts, null, 2),
  'utf8'
);
console.log('✅ Generated batch-ugc-scripts.json');

// 2. Write Ready API Payloads
const apiPayloads = ugcAdScripts.map(item => ({
  script_id: item.id,
  title: item.title,
  target_product: item.target_product,
  avatar_reference_image: "assets/saif-avatar-base.jpg",
  full_spoken_script_roman_urdu: item.beats.map(b => b.spoken_dialogue_roman_urdu).join(" "),
  full_spoken_script_english: item.beats.map(b => b.spoken_dialogue_english).join(" "),
  estimated_duration_sec: parseInt(item.video_length),
  settings: item.avatar_api_payload
}));

fs.writeFileSync(
  path.join(outDir, 'prompts', 'avatar-api-payloads.json'),
  JSON.stringify(apiPayloads, null, 2),
  'utf8'
);
console.log('✅ Generated avatar-api-payloads.json');

// 3. Write Comprehensive Markdown Guide
let mdGuide = `# Trend Seller — AI Avatar UGC Video Ad Scripts (Phase 2)

**Avatar Baseline Reference:** [saif-avatar-base.jpg](file:///c:/Users/user/Desktop/TrendSeller%20Update/The-Trend-Seller/trend-seller-automation/avatar-ads/assets/saif-avatar-base.jpg)
**Target Format:** 9:16 Vertical (1080x1920) for Instagram Reels, TikTok, YouTube Shorts, and Facebook Reels.
**Vocal Delivery:** Natural conversational Roman Urdu + Pakistani English with high enthusiasm and clear pacing.

---

`;

ugcAdScripts.forEach((ad, i) => {
  mdGuide += `## 🎬 Ad Script #${i+1}: ${ad.title} (\`${ad.id}\`)
- **Target Product:** ${ad.target_product}
- **Target Audience:** ${ad.target_audience}
- **Duration:** ${ad.video_length}
- **Voice Tone:** ${ad.voice_tone}
- **Avatar Pose & Gesture:** ${ad.avatar_pose}

### ⏱️ Scene-by-Scene Storyboard & Dialogue

`;

  ad.beats.forEach((b, idx) => {
    mdGuide += `#### Beat ${idx+1} [${b.time}] — ${b.beat_type}
- **Visual & B-Roll Cue:** *${b.visual_direction}*
- **🎙️ Spoken Dialogue (Roman Urdu):**
> "${b.spoken_dialogue_roman_urdu}"
- **🌐 Translation (English Reference):**
> *"${b.spoken_dialogue_english}"*

`;
  });

  mdGuide += `### ⚙️ Avatar Tool API Configuration
\`\`\`json
${JSON.stringify(ad.avatar_api_payload, null, 2)}
\`\`\`

---

`;
});

fs.writeFileSync(path.join(outDir, 'scripts', 'batch-ugc-scripts.md'), mdGuide, 'utf8');
console.log('✅ Generated batch-ugc-scripts.md');
