import sharp from 'sharp';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const fontPath = join(__dirname, 'RubikDistressed.ttf').replace(/\\/g, '/');
const fontFace = `@font-face { font-family: 'Rubik Distressed'; src: url('file:///${fontPath}') format('truetype'); }`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <style>${fontFace}</style>
    <radialGradient id="bg" cx="45%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#2c2c2c"/>
      <stop offset="55%" stop-color="#181818"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </radialGradient>

    <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
      <stop offset="40%" stop-color="transparent"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.8"/>
    </radialGradient>

    <!-- Stone grey gradient for letters -->
    <linearGradient id="stoneGrey" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#f0ede8"/>
      <stop offset="30%"  stop-color="#cac7c2"/>
      <stop offset="65%"  stop-color="#999590"/>
      <stop offset="100%" stop-color="#6a6866"/>
    </linearGradient>

    <!-- Chisel/carve filter for letters -->
    <filter id="chisel" x="-8%" y="-8%" width="116%" height="116%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur"/>
      <!-- deep shadow bottom-right -->
      <feOffset dx="5" dy="7" in="blur" result="shadowOff"/>
      <feFlood flood-color="#000000" flood-opacity="0.55" result="shadowClr"/>
      <feComposite in="shadowClr" in2="shadowOff" operator="in" result="shadow"/>
      <!-- highlight top-left -->
      <feOffset dx="-4" dy="-5" in="blur" result="hlOff"/>
      <feFlood flood-color="#ffffff" flood-opacity="0.22" result="hlClr"/>
      <feComposite in="hlClr" in2="hlOff" operator="in" result="hl"/>
      <feMerge>
        <feMergeNode in="shadow"/>
        <feMergeNode in="SourceGraphic"/>
        <feMergeNode in="hl"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" fill="url(#bg)" rx="96"/>
  <rect width="1024" height="1024" fill="url(#vignette)" rx="96"/>

  <!-- ── CRACKS (dark gap + bright edge) ── -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">

    <!-- Main crack: top-centre down through both letters -->
    <path d="M 500 30 L 488 120 L 512 200 L 495 290 L 520 380 L 498 460 L 518 545 L 500 630 L 522 720 L 505 820 L 525 950"
      stroke="#111" stroke-width="5" opacity="1"/>
    <path d="M 500 30 L 488 120 L 512 200 L 495 290 L 520 380 L 498 460 L 518 545 L 500 630 L 522 720 L 505 820 L 525 950"
      stroke="#888" stroke-width="1.5" opacity="0.5"/>

    <!-- Branch left from crack ~mid -->
    <path d="M 498 460 L 420 445 L 380 462 L 340 448"
      stroke="#111" stroke-width="3.5" opacity="0.9"/>
    <path d="M 498 460 L 420 445 L 380 462 L 340 448"
      stroke="#777" stroke-width="1" opacity="0.45"/>

    <!-- Branch right from crack lower -->
    <path d="M 518 545 L 600 535 L 650 548 L 700 538 L 740 550"
      stroke="#111" stroke-width="3" opacity="0.85"/>
    <path d="M 518 545 L 600 535 L 650 548 L 700 538 L 740 550"
      stroke="#777" stroke-width="0.9" opacity="0.4"/>

    <!-- Second vertical crack through G area -->
    <path d="M 750 60 L 732 155 L 748 230 L 728 310 L 745 400 L 725 490 L 742 580 L 720 680 L 738 800 L 715 920"
      stroke="#111" stroke-width="4" opacity="0.9"/>
    <path d="M 750 60 L 732 155 L 748 230 L 728 310 L 745 400 L 725 490 L 742 580 L 720 680 L 738 800 L 715 920"
      stroke="#888" stroke-width="1.2" opacity="0.45"/>

    <!-- Branch from G crack -->
    <path d="M 728 310 L 790 295 L 830 305 L 870 292"
      stroke="#111" stroke-width="2.5" opacity="0.8"/>
    <path d="M 728 310 L 790 295 L 830 305 L 870 292"
      stroke="#888" stroke-width="0.8" opacity="0.35"/>

    <!-- Crack through D left side -->
    <path d="M 270 80 L 258 180 L 272 270 L 255 360 L 268 450 L 250 560 L 265 670 L 248 790 L 260 920"
      stroke="#111" stroke-width="3.5" opacity="0.85"/>
    <path d="M 270 80 L 258 180 L 272 270 L 255 360 L 268 450 L 250 560 L 265 670 L 248 790 L 260 920"
      stroke="#888" stroke-width="1" opacity="0.4"/>

    <!-- Horizontal crack mid-icon -->
    <path d="M 60 508 L 150 498 L 230 510 L 340 500 L 450 512 L 560 502 L 660 514 L 760 504 L 860 516 L 960 506"
      stroke="#111" stroke-width="3" opacity="0.8"/>
    <path d="M 60 508 L 150 498 L 230 510 L 340 500 L 450 512 L 560 502 L 660 514 L 760 504 L 860 516 L 960 506"
      stroke="#888" stroke-width="0.9" opacity="0.35"/>

    <!-- Fine hairline cracks -->
    <path d="M 140 260 L 178 290 L 165 338" stroke="#555" stroke-width="1.5" opacity="0.5"/>
    <path d="M 880 580 L 842 610 L 858 655" stroke="#555" stroke-width="1.5" opacity="0.45"/>
    <path d="M 420 70 L 408 115 L 428 155" stroke="#555" stroke-width="1.5" opacity="0.4"/>
    <path d="M 600 880 L 630 905 L 618 950" stroke="#555" stroke-width="1.5" opacity="0.4"/>
  </g>

  <!-- ── DG LETTERS ── -->
  <!-- Deep drop shadow -->
  <text x="519" y="598"
    font-family="'Rubik Distressed', Georgia, serif"
    font-size="300" font-weight="bold"
    text-anchor="middle"
    fill="#000" opacity="0.75">DG</text>

  <!-- Main stone grey letters -->
  <text x="512" y="590"
    font-family="'Rubik Distressed', Georgia, serif"
    font-size="300" font-weight="bold"
    text-anchor="middle"
    fill="url(#stoneGrey)"
    filter="url(#chisel)">DG</text>
</svg>`;

// Foreground-only SVG (DG on transparent) for adaptive icon
const svgFg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <style>${fontFace}</style>
    <filter id="chisel2" x="-8%" y="-8%" width="116%" height="116%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur"/>
      <feOffset dx="5" dy="7" in="blur" result="shadowOff"/>
      <feFlood flood-color="#000000" flood-opacity="0.55" result="shadowClr"/>
      <feComposite in="shadowClr" in2="shadowOff" operator="in" result="shadow"/>
      <feOffset dx="-4" dy="-5" in="blur" result="hlOff"/>
      <feFlood flood-color="#ffffff" flood-opacity="0.22" result="hlClr"/>
      <feComposite in="hlClr" in2="hlOff" operator="in" result="hl"/>
      <feMerge>
        <feMergeNode in="shadow"/>
        <feMergeNode in="SourceGraphic"/>
        <feMergeNode in="hl"/>
      </feMerge>
    </filter>
    <linearGradient id="stone2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#f0ede8"/>
      <stop offset="30%"  stop-color="#cac7c2"/>
      <stop offset="65%"  stop-color="#999590"/>
      <stop offset="100%" stop-color="#6a6866"/>
    </linearGradient>
  </defs>
  <text x="519" y="590" font-family="'Rubik Distressed', Georgia, serif" font-size="300" font-weight="bold" text-anchor="middle" fill="#000000" opacity="0.75" transform="translate(6,8)">DG</text>
  <text x="512" y="582" font-family="'Rubik Distressed', Georgia, serif" font-size="300" font-weight="bold" text-anchor="middle" fill="url(#stone2)" filter="url(#chisel2)">DG</text>
</svg>`;

const sizes = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi':  144,
  'mipmap-xxxhdpi': 192,
};

const resDir = join(root, 'android', 'app', 'src', 'main', 'res');

async function generate() {
  const buf = Buffer.from(svg);

  // Generate master 1024px PNG first
  const masterPng = await sharp(buf, { density: 300 })
    .resize(1024, 1024)
    .png()
    .toBuffer();

  console.log('Master PNG generated');

  for (const [dir, size] of Object.entries(sizes)) {
    const outDir = join(resDir, dir);
    mkdirSync(outDir, { recursive: true });

    const resized = await sharp(masterPng)
      .resize(size, size)
      .png()
      .toBuffer();

    writeFileSync(join(outDir, 'ic_launcher.png'), resized);
    writeFileSync(join(outDir, 'ic_launcher_round.png'), resized);
    console.log(`  ${dir}: ${size}x${size}`);
  }

  // Foreground PNG for adaptive icon
  const fgBuf = Buffer.from(svgFg);
  const fgSizes = { 'mipmap-mdpi': 48, 'mipmap-hdpi': 72, 'mipmap-xhdpi': 96, 'mipmap-xxhdpi': 144, 'mipmap-xxxhdpi': 192 };
  for (const [dir, size] of Object.entries(fgSizes)) {
    const fg = await sharp(fgBuf, { density: 300 }).resize(size, size).png().toBuffer();
    writeFileSync(join(resDir, dir, 'ic_launcher_foreground.png'), fg);
  }
  console.log('  Foreground layers written.');

  console.log('\nDone. All mipmap icons written.');
}

generate().catch(err => { console.error(err); process.exit(1); });
