// Test script to verify static generation
const { premiumWatches, casualWatches, stylishWatches } = require('./lib/products.js');

console.log('Testing static generation...');
console.log('Premium watches:', premiumWatches.length);
console.log('Casual watches:', casualWatches.length);
console.log('Stylish watches:', stylishWatches.length);

const allWatches = [...premiumWatches, ...casualWatches, ...stylishWatches];
console.log('Total watches:', allWatches.length);

console.log('First few slugs:');
allWatches.slice(0, 5).forEach(watch => {
  console.log(`- ${watch.slug}`);
});
