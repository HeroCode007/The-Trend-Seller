import fs from 'fs';
import path from 'path';

const imageMap = [
  { src: 'public/images/new-uploads/IMG-20260401-WA0085.jpg', dest: 'public/images/denvosi-fm-white-ice.jpg' },
  { src: 'public/images/new-uploads/IMG-20260424-WA0048.jpg', dest: 'public/images/hublot-meca-white-ceramic.jpg' },
  { src: 'public/images/new-uploads/IMG-20260724-WA0019.jpg', dest: 'public/images/tissot-prx-silver.jpg' },
  { src: 'public/images/new-uploads/IMG-20260729-WA0003.jpg', dest: 'public/images/gucci-gtimeless-grip-green.jpg' },
  { src: 'public/images/new-uploads/IMG-20260729-WA0004.jpg', dest: 'public/images/rolex-datejust-computer-monogram.jpg' },
  { src: 'public/images/new-uploads/IMG-20260729-WA0007.jpg', dest: 'public/images/rolex-skydweller-matte-black.jpg' },
  { src: 'public/images/new-uploads/IMG-20260807-WA0009.jpg', dest: 'public/images/truworth-baguette-crystal-luxury.jpg' },
  { src: 'public/images/new-uploads/IMG-20260807-WA0019.jpg', dest: 'public/images/tag-heuer-aquaracer-gmt-black.jpg' },
  { src: 'public/images/new-uploads/IMG-20260807-WA0020.jpg', dest: 'public/images/cartier-panthere-gold-box.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0007.jpg', dest: 'public/images/sabr-arabic-dial-white.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0008.jpg', dest: 'public/images/ap-royaloak-rosegold-brown.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0009.jpg', dest: 'public/images/bestwin-royal-blue-jubilee.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0010.jpg', dest: 'public/images/bestwin-octagonal-stealth-black.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0011.jpg', dest: 'public/images/tubular-tachymeter-anadigi-brown.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0012.jpg', dest: 'public/images/tubular-emerald-chrono-suede.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0013.jpg', dest: 'public/images/mewear-diamond-faceted-crystal.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0014.jpg', dest: 'public/images/universe-point-frosted-octagonal.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0015.jpg', dest: 'public/images/tubular-classic-vintage-tan.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0016.jpg', dest: 'public/images/rolex-datejust-rosegold-zr-box.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0017.jpg', dest: 'public/images/cartier-tank-must-gold-black.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0018.jpg', dest: 'public/images/bestwin-arched-daydate-silver.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0019.jpg', dest: 'public/images/trove-diamond-faceted-royalblue.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0020.jpg', dest: 'public/images/tomi-cushion-navyblue-box.jpg' },
  { src: 'public/images/new-uploads/IMG-20260819-WA0021.jpg', dest: 'public/images/timeless-together-couple-combo.jpg' }
];

let copied = 0;
for (const item of imageMap) {
  if (fs.existsSync(item.src)) {
    fs.copyFileSync(item.src, item.dest);
    console.log(`✅ Copied: ${item.dest} (${fs.statSync(item.dest).size} bytes)`);
    copied++;
  } else {
    console.error(`❌ Source missing: ${item.src}`);
  }
}

console.log(`\n🎉 Total ${copied} of ${imageMap.length} images copied to public/images/`);
