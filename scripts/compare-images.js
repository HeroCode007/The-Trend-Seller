import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const downloadFiles = [
  "C:\\Users\\user\\Downloads\\IMG-20260226-WA0018.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260401-WA0085.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260424-WA0048.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260724-WA0019.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260729-WA0003.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260729-WA0004.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260729-WA0007.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260615-WA0017.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260807-WA0009.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260807-WA0019.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260807-WA0020.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0007.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0008.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0009.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0010.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0011.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0012.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0013.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0014.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0015.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0016.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0017.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0018.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0019.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0020.jpg",
  "C:\\Users\\user\\Downloads\\IMG-20260819-WA0021.jpg"
];

function getHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

const publicImagesDir = 'c:\\Users\\user\\Desktop\\TrendSeller Update\\The-Trend-Seller\\public\\images';
const existingFiles = fs.readdirSync(publicImagesDir);
const existingHashes = {};

for (const file of existingFiles) {
  const fullPath = path.join(publicImagesDir, file);
  if (fs.statSync(fullPath).isFile()) {
    try {
      const hash = getHash(fullPath);
      const size = fs.statSync(fullPath).size;
      existingHashes[hash] = { file, size };
    } catch (e) {}
  }
}

console.log(`Loaded ${Object.keys(existingHashes).length} existing image hashes from public/images.\n`);

const results = [];

for (let i = 0; i < downloadFiles.length; i++) {
  const dlPath = downloadFiles[i];
  const basename = path.basename(dlPath);
  if (!fs.existsSync(dlPath)) {
    console.log(`[${i+1}] ❌ File not found: ${basename}`);
    results.push({ index: i+1, file: basename, exists: false });
    continue;
  }
  const size = fs.statSync(dlPath).size;
  const hash = getHash(dlPath);
  
  if (existingHashes[hash]) {
    console.log(`[${i+1}] 🔄 MATCH FOUND: ${basename} (${size} bytes) is identical to public/images/${existingHashes[hash].file}`);
    results.push({ index: i+1, file: basename, match: existingHashes[hash].file, status: 'EXACT_MATCH' });
  } else {
    console.log(`[${i+1}] 🆕 NEW IMAGE: ${basename} (${size} bytes, hash: ${hash.substring(0,8)})`);
    results.push({ index: i+1, file: basename, size, hash, status: 'NEW' });
  }
}

fs.writeFileSync('scripts/compare-results.json', JSON.stringify(results, null, 2));
