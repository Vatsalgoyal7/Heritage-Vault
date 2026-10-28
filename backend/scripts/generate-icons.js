const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function generateSVG(size) {
  const r = size * 0.15; // corner radius
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a1a"/>
      <stop offset="100%" style="stop-color:#1a0a2e"/>
    </linearGradient>
    <linearGradient id="shield" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed"/>
      <stop offset="60%" style="stop-color:#9d5cf5"/>
      <stop offset="100%" style="stop-color:#f59e0b"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="${size * 0.02}" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#bg)"/>
  <!-- Shield -->
  <path d="
    M ${size/2} ${size*0.18}
    L ${size*0.78} ${size*0.30}
    L ${size*0.78} ${size*0.52}
    Q ${size*0.78} ${size*0.82} ${size/2} ${size*0.88}
    Q ${size*0.22} ${size*0.82} ${size*0.22} ${size*0.52}
    L ${size*0.22} ${size*0.30}
    Z
  " fill="url(#shield)" filter="url(#glow)"/>
  <!-- Lock body -->
  <rect x="${size*0.38}" y="${size*0.46}" width="${size*0.24}" height="${size*0.22}" rx="${size*0.04}" ry="${size*0.04}" fill="white" opacity="0.95"/>
  <!-- Lock shackle -->
  <path d="M ${size*0.40} ${size*0.46} Q ${size*0.40} ${size*0.30} ${size/2} ${size*0.30} Q ${size*0.60} ${size*0.30} ${size*0.60} ${size*0.46}" 
        fill="none" stroke="white" stroke-width="${size*0.05}" stroke-linecap="round" opacity="0.95"/>
  <!-- Keyhole -->
  <circle cx="${size/2}" cy="${size*0.535}" r="${size*0.04}" fill="url(#bg)" opacity="0.8"/>
  <rect x="${size*0.485}" y="${size*0.535}" width="${size*0.03}" height="${size*0.07}" rx="${size*0.01}" fill="url(#bg)" opacity="0.8"/>
</svg>`;
}

sizes.forEach(size => {
  const svg = generateSVG(size);
  const svgPath = path.join(outputDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log(`✅ Generated icon-${size}x${size}.svg`);
});

console.log('\n🎉 All SVG icons generated in public/icons/');
console.log('ℹ️  SVG icons work for manifest.json - update manifest to use .svg extension');
