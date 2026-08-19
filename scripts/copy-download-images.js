import fs from 'fs';
import path from 'path';

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

const destDir = path.resolve('public', 'images', 'new-uploads');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

downloadFiles.forEach((src, idx) => {
  const filename = path.basename(src);
  const dest = path.join(destDir, filename);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied [${idx + 1}] ${filename} -> public/images/new-uploads/${filename}`);
  } else {
    console.warn(`File not found: ${src}`);
  }
});
