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

const DID_KEY = process.env.D_ID_API_KEY;
if (!DID_KEY) {
  console.error('❌ D_ID_API_KEY is missing');
  process.exit(1);
}

const auth = Buffer.from(DID_KEY).toString('base64');
const headers = {
  'Authorization': 'Basic ' + auth,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

const outputDir = path.resolve(process.cwd(), 'trend-seller-automation', 'avatar-ads', 'output');
fs.mkdirSync(outputDir, { recursive: true });

async function uploadImage(imagePath) {
  console.log(`📤 Uploading avatar image to D-ID: ${imagePath}`);
  const fileBuffer = fs.readFileSync(imagePath);
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  const form = new FormData();
  form.append('image', blob, path.basename(imagePath));

  const res = await fetch('https://api.d-id.com/images', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + auth
    },
    body: form
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to upload image: ${JSON.stringify(data)}`);
  }
  console.log('✅ Image uploaded successfully:', data.url);
  return data.url;
}

async function createTalk(sourceUrl) {
  console.log('🎬 Initiating AI Talking Avatar Video generation...');

  const scriptInput = "Agar aap apne partner ke liye aik memorable luxury gift dhoond rahe hain, to aglay 15 seconds miss mat karna! The Trend Seller pe hum launch kar rahe hain apna Grand Couple Combo. Mens ke liye royal blue Datejust aur ladies ke liye stunning OLIYA Diamond Emerald-Cut. Dono luxury watches milengi sirf Rs 6,850 me with Free Cash on Delivery aur 100% Open Parcel Check policy. Pehle parcel check karein, phir pay karein. Stock limited hai, abhi WhatsApp karein 0313-0205251 pe!";

  const payload = {
    source_url: sourceUrl,
    script: {
      type: 'text',
      subtitles: 'false',
      provider: {
        type: 'microsoft',
        voice_id: 'ur-PK-AsadNeural'
      },
      ssml: 'false',
      input: scriptInput
    },
    config: {
      fluent: 'true',
      pad_audio: '0.0',
      stitch: true,
      align_driver: true
    }
  };

  const res = await fetch('https://api.d-id.com/talks', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to create talk: ${JSON.stringify(data)}`);
  }

  console.log(`✅ Talk job created! ID: ${data.id}, status: ${data.status}`);
  return data.id;
}

async function pollTalkStatus(talkId) {
  console.log(`⏳ Waiting for D-ID to render Saif's talking avatar video...`);
  const startTime = Date.now();

  while (Date.now() - startTime < 300000) { // 5 minutes max
    const res = await fetch(`https://api.d-id.com/talks/${talkId}`, {
      headers: headers
    });
    const data = await res.json();

    console.log(`   Status: [${data.status}]`);

    if (data.status === 'done') {
      console.log('\n🎉 Video rendering completed successfully!');
      console.log('🔗 Video Result URL:', data.result_url);
      return data.result_url;
    }

    if (data.status === 'error' || data.status === 'rejected') {
      throw new Error(`Video rendering failed: ${JSON.stringify(data)}`);
    }

    // Wait 5 seconds before next check
    await new Promise(r => setTimeout(r, 5000));
  }

  throw new Error('Timed out waiting for video rendering');
}

async function downloadVideo(videoUrl, destinationPath) {
  console.log(`⬇️ Downloading MP4 to: ${destinationPath}`);
  const res = await fetch(videoUrl);
  if (!res.ok) throw new Error(`Failed to download video: ${res.statusText}`);

  const buffer = await res.arrayBuffer();
  fs.writeFileSync(destinationPath, Buffer.from(buffer));
  console.log(`✅ Video saved successfully! Size: ${(buffer.byteLength / (1024 * 1024)).toFixed(2)} MB`);
}

async function main() {
  try {
    const portraitPath = path.resolve('trend-seller-automation/avatar-ads/assets/saif-avatar-portrait.jpg');
    const s3Url = await uploadImage(portraitPath);
    const talkId = await createTalk(s3Url);
    const resultUrl = await pollTalkStatus(talkId);

    const targetFile = path.join(outputDir, 'saif-couple-combo-ad.mp4');
    await downloadVideo(resultUrl, targetFile);

    console.log('\n===========================================================');
    console.log('🚀 AI AVATAR AD VIDEO READY!');
    console.log(`📁 File: ${targetFile}`);
    console.log('===========================================================\n');
  } catch (error) {
    console.error('❌ Error during avatar video rendering:', error);
  }
}

main();
