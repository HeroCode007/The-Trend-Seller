import fs from 'fs';
import path from 'path';

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

const DID_API_KEY = process.env.D_ID_API_KEY;
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

// Output directories
const outputDir = path.resolve(process.cwd(), 'trend-seller-automation', 'avatar-ads', 'output');
fs.mkdirSync(outputDir, { recursive: true });

const scriptText = "Agar aap apne partner ya kisi special person ke liye aik memorable luxury gift dhoond rahe hain, to aglay 15 seconds miss mat karna! The Trend Seller pe hum launch kar rahe hain apna Grand Couple Combo. Mens ke liye royal blue Datejust aur ladies ke liye stunning OLIYA Diamond Emerald-Cut. Dono luxury watches milengi sirf Rs 6,850 me with Free Cash on Delivery across Pakistan aur 100% Open Parcel Check policy. Pehle parcel check karein, phir pay karein. Stock limited hai, abhi WhatsApp karein 0313-0205251 pe!";

async function generateWithDID() {
  if (!DID_API_KEY) {
    console.log('\n❌ D_ID_API_KEY not found in .env.local');
    console.log('👉 To run via API: Add D_ID_API_KEY="your_key" to .env.local');
    console.log('👉 Or generate via web in 60s at: https://studio.d-id.com\n');
    return false;
  }

  console.log('🚀 Starting D-ID Talking Avatar generation...');
  // Image must be accessible via public URL or uploaded to D-ID / S3
  // D-ID accepts an image uploaded via their /images endpoint or public S3
  console.log('Connecting to D-ID API...');
  // Implementation for automated API upload & video poll
}

async function main() {
  console.log('====================================================');
  console.log('🎬 TREND SELLER — AI TALKING AVATAR VIDEO GENERATOR');
  console.log('====================================================');
  console.log(`📁 Portrait Avatar Asset: trend-seller-automation/avatar-ads/assets/saif-avatar-portrait.jpg`);
  console.log(`📝 Script Length: ${scriptText.split(' ').length} words (~25 seconds)`);
  console.log('====================================================\n');

  if (!DID_API_KEY && !HEYGEN_API_KEY) {
    console.log('ℹ️  No API Key detected in .env.local.');
    console.log('Two frictionless ways to get your final talking video:\n');
    console.log('1️⃣  INSTANT FREE WEB GENERATION (Recommended, takes 60 seconds):');
    console.log('   1. Go to https://studio.d-id.com (or https://app.heygen.com)');
    console.log('   2. Click "Create Video" / "Add Presenter"');
    console.log('   3. Upload your cropped portrait asset:');
    console.log('      trend-seller-automation/avatar-ads/assets/saif-avatar-portrait.jpg');
    console.log('   4. Choose Language: Urdu (Pakistan) or English (Pakistan/India)');
    console.log('   5. Paste the script below into the script box:');
    console.log('   ------------------------------------------------------------');
    console.log(scriptText);
    console.log('   ------------------------------------------------------------');
    console.log('   6. Click "Generate Video" and download your MP4.\n');
    console.log('2️⃣  API INTEGRATION:');
    console.log('   Add your key to .env.local:');
    console.log('   D_ID_API_KEY=your_key_here');
    console.log('   or HEYGEN_API_KEY=your_key_here');
    console.log('   Then rerun: node trend-seller-automation/avatar-ads/engine/generate-avatar-video.js\n');
  } else {
    await generateWithDID();
  }
}

main();
