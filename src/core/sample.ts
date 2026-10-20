import fs from 'fs'
import path from 'path'
import os from 'os'
import AdmZip from 'adm-zip'

export function createSampleMangaCbz(): string {
  const samplePath = path.join(os.tmpdir(), 'miru_chronicles_of_light_vol1.cbz')

  // If already exists and is not empty, return path
  if (fs.existsSync(samplePath) && fs.statSync(samplePath).size > 1000) {
    return samplePath
  }

  const zip = new AdmZip()

  // 1. ComicInfo.xml
  const comicInfoXml = `<?xml version="1.0" encoding="utf-8"?>
<ComicInfo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <Title>Chronicles of Light: Chapter 1</Title>
  <Series>Miru Chronicles (見る年代記)</Series>
  <Number>1</Number>
  <Summary>In Neo Kyoto, year 2088, an ancient optic artifact known as Miru awakens within the GPU core of an abandoned android. The boundary between digital illusions and reality begins to shatter.</Summary>
  <Writer>Hiroshi Tanaka</Writer>
  <Penciller>Kenshiro Sato</Penciller>
  <PageCount>6</PageCount>
</ComicInfo>`
  zip.addFile('ComicInfo.xml', Buffer.from(comicInfoXml, 'utf8'))

  // 2. Generate 6 styled manga pages in SVG format
  const pages: { name: string; svg: string }[] = [
    {
      name: '01_cover.svg',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0a12"/>
      <stop offset="40%" stop-color="#141426"/>
      <stop offset="100%" stop-color="#241432"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="45%">
      <stop offset="0%" stop-color="#FF5C00" stop-opacity="0.8"/>
      <stop offset="60%" stop-color="#FF007A" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="1200" fill="url(#bg)"/>
  <circle cx="400" cy="460" r="280" fill="url(#glow)"/>
  
  <!-- Stylized Sun / Moon -->
  <circle cx="400" cy="460" r="160" fill="#FFE2C6" opacity="0.95"/>
  <circle cx="400" cy="460" r="150" fill="#0A0A12"/>
  
  <!-- Silhouette & Cyber Blade -->
  <polygon points="400,220 406,620 394,620" fill="#00E5FF"/>
  <line x1="200" y1="620" x2="600" y2="620" stroke="#FF5C00" stroke-width="3" stroke-dasharray="8,4"/>
  <polygon points="360,650 440,650 420,530 380,530" fill="#18182E"/>
  <circle cx="400" cy="500" r="28" fill="#18182E"/>
  
  <!-- Manga Typography / Title -->
  <text x="400" y="160" font-family="sans-serif" font-size="78" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="8">MIRU</text>
  <text x="400" y="210" font-family="sans-serif" font-size="28" font-weight="700" fill="#FF5C00" text-anchor="middle" letter-spacing="12">見る · 光の年代記</text>
  
  <rect x="330" y="850" width="140" height="38" rx="6" fill="#FF007A" opacity="0.85"/>
  <text x="400" y="875" font-family="sans-serif" font-size="16" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">ACT 1 · AWAKENING</text>
  
  <!-- Sub details -->
  <text x="400" y="1080" font-family="sans-serif" font-size="14" fill="#8E8EA8" text-anchor="middle">STORY &amp; ART · HIROSHI TANAKA</text>
  <text x="400" y="1110" font-family="sans-serif" font-size="12" fill="#585870" text-anchor="middle">OFFICIAL GPUIX DIGITAL COMICS EDITION</text>
</svg>`,
    },
    {
      name: '02_chapter_start.svg',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
  <rect width="800" height="1200" fill="#FFFFFF"/>
  <rect x="30" y="30" width="740" height="1140" fill="none" stroke="#111111" stroke-width="4"/>
  
  <!-- Panel 1: Establishing Shot -->
  <rect x="50" y="50" width="700" height="320" fill="#14141A"/>
  <!-- Skyline -->
  <polygon points="60,370 120,200 160,200 200,370" fill="#22222E"/>
  <polygon points="180,370 240,140 310,140 340,370" fill="#2D2D3E"/>
  <polygon points="320,370 380,180 430,180 470,370" fill="#1C1C26"/>
  <polygon points="450,370 510,120 570,120 620,370" fill="#2A2A38"/>
  <polygon points="600,370 650,220 710,220 740,370" fill="#20202C"/>
  <text x="80" y="90" font-family="sans-serif" font-size="18" font-weight="800" fill="#FF5C00">NEO-KYOTO // DISTRICT 09</text>
  <text x="80" y="120" font-family="sans-serif" font-size="14" fill="#A0A0B8">MIDNIGHT · RAINFALL: 98%</text>

  <!-- Panel 2: Character intro (Left) -->
  <rect x="50" y="390" width="340" height="420" fill="#F4F4F6" stroke="#111111" stroke-width="3"/>
  <circle cx="220" cy="560" r="80" fill="#2A2A35"/>
  <rect x="180" y="640" width="80" height="140" rx="10" fill="#1E1E26"/>
  <!-- Speech balloon -->
  <path d="M 120,440 Q 120,410 180,410 L 300,410 Q 350,410 350,450 L 350,500 Q 350,540 280,540 L 230,570 L 230,540 L 180,540 Q 120,540 120,500 Z" fill="#FFFFFF" stroke="#111111" stroke-width="2.5"/>
  <text x="235" y="460" font-family="sans-serif" font-size="15" font-weight="700" fill="#111111" text-anchor="middle">"The neural resonance..."</text>
  <text x="235" y="490" font-family="sans-serif" font-size="14" fill="#333333" text-anchor="middle">It's coming from sector 4.</text>

  <!-- Panel 3: Terminal display (Right) -->
  <rect x="410" y="390" width="340" height="420" fill="#0C1018" stroke="#111111" stroke-width="3"/>
  <text x="440" y="440" font-family="monospace" font-size="18" fill="#00FF66">&gt; MIRU_KERNEL: ACTIVE</text>
  <text x="440" y="480" font-family="monospace" font-size="14" fill="#00CC55">&gt; CLOCK: 4.8 GHz GPU SYNC</text>
  <text x="440" y="520" font-family="monospace" font-size="14" fill="#00CC55">&gt; BUFFER DETECTED [OK]</text>
  <rect x="440" y="560" width="280" height="180" fill="#15202B" stroke="#00FF66" stroke-width="1.5"/>
  <circle cx="580" cy="650" r="45" fill="none" stroke="#00FF66" stroke-width="2" stroke-dasharray="6,4"/>
  <circle cx="580" cy="650" r="20" fill="#FF0055"/>

  <!-- Panel 4: Action bottom -->
  <rect x="50" y="830" width="700" height="320" fill="#EEEEF0" stroke="#111111" stroke-width="3"/>
  <text x="400" y="940" font-family="sans-serif" font-size="64" font-weight="900" fill="#111111" text-anchor="middle" font-style="italic">ZZZZRAAAAASH!!</text>
  <text x="400" y="990" font-family="sans-serif" font-size="28" font-weight="800" fill="#FF5C00" text-anchor="middle">ド ド ド ド ド</text>
  <text x="400" y="1060" font-family="sans-serif" font-size="16" fill="#555555" text-anchor="middle">"Stand back! The GPU pipeline is overloading!"</text>
  <text x="730" y="1145" font-family="sans-serif" font-size="14" font-weight="700" fill="#888888" text-anchor="end">2</text>
</svg>`,
    },
    {
      name: '03_awakening.svg',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
  <rect width="800" height="1200" fill="#FFFFFF"/>
  <rect x="30" y="30" width="740" height="1140" fill="none" stroke="#111111" stroke-width="4"/>

  <!-- Dramatic Speed Lines -->
  <rect x="50" y="50" width="700" height="520" fill="#0B0B14"/>
  <g stroke="#FFFFFF" stroke-width="1.5" opacity="0.6">
    <line x1="400" y1="310" x2="60" y2="70"/>
    <line x1="400" y1="310" x2="160" y2="60"/>
    <line x1="400" y1="310" x2="280" y2="55"/>
    <line x1="400" y1="310" x2="520" y2="55"/>
    <line x1="400" y1="310" x2="650" y2="70"/>
    <line x1="400" y1="310" x2="740" y2="120"/>
    <line x1="400" y1="310" x2="740" y2="280"/>
    <line x1="400" y1="310" x2="740" y2="450"/>
    <line x1="400" y1="310" x2="60" y2="480"/>
    <line x1="400" y1="310" x2="60" y2="300"/>
    <line x1="400" y1="310" x2="60" y2="160"/>
  </g>
  <circle cx="400" cy="310" r="90" fill="#FF5C00" opacity="0.9"/>
  <circle cx="400" cy="310" r="60" fill="#FFEAA7"/>
  <text x="400" y="325" font-family="sans-serif" font-size="44" font-weight="900" fill="#111111" text-anchor="middle">覚醒</text>
  
  <!-- Dialogue Overlay -->
  <rect x="180" y="470" width="440" height="70" rx="12" fill="#FFFFFF" stroke="#111111" stroke-width="3"/>
  <text x="400" y="512" font-family="sans-serif" font-size="20" font-weight="800" fill="#111111" text-anchor="middle">"I CAN SEE EVERYTHING NOW."</text>

  <!-- Panel 2 (Bottom Left) -->
  <rect x="50" y="590" width="340" height="560" fill="#F8F8FA" stroke="#111111" stroke-width="3"/>
  <text x="220" y="680" font-family="sans-serif" font-size="48" font-weight="900" fill="#222222" text-anchor="middle">ゴ ゴ ゴ ゴ</text>
  <circle cx="220" cy="850" r="100" fill="#1A1A24"/>
  <rect x="190" y="790" width="60" height="12" rx="6" fill="#00E5FF"/>
  <text x="220" y="1030" font-family="sans-serif" font-size="16" font-weight="700" fill="#444444" text-anchor="middle">"Target locked. Frame 0."</text>

  <!-- Panel 3 (Bottom Right) -->
  <rect x="410" y="590" width="340" height="560" fill="#111116" stroke="#111111" stroke-width="3"/>
  <polygon points="440,650 710,750 440,850" fill="#FF0055" opacity="0.8"/>
  <text x="580" y="930" font-family="sans-serif" font-size="32" font-weight="900" fill="#FFFFFF" text-anchor="middle">SHKKKK-!!</text>
  <text x="580" y="980" font-family="sans-serif" font-size="16" fill="#BBBBCC" text-anchor="middle">The blade slices the latency.</text>
  <text x="730" y="1145" font-family="sans-serif" font-size="14" font-weight="700" fill="#888888" text-anchor="end">3</text>
</svg>`,
    },
    {
      name: '04_spread_left.svg',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
  <defs>
    <linearGradient id="skyL" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#140b28"/>
      <stop offset="50%" stop-color="#2a164d"/>
      <stop offset="100%" stop-color="#692257"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1200" fill="url(#skyL)"/>
  <!-- Mountain & Cherry Blossom (Left Half of Two-page spread) -->
  <polygon points="0,1200 450,750 800,1200" fill="#0e071c"/>
  <polygon points="100,1200 550,650 800,1000" fill="#1a0f30" opacity="0.85"/>
  <circle cx="750" cy="500" r="220" fill="#FFE3CC" opacity="0.8"/>
  
  <!-- Floating Torii Gate -->
  <rect x="250" y="480" width="220" height="16" fill="#FF334B"/>
  <rect x="280" y="496" width="16" height="140" fill="#FF334B"/>
  <rect x="424" y="496" width="16" height="140" fill="#FF334B"/>
  
  <!-- Spanning text indicator -->
  <rect x="60" y="80" width="260" height="40" rx="8" fill="#000000" opacity="0.6"/>
  <text x="190" y="106" font-family="sans-serif" font-size="15" font-weight="700" fill="#FFFFFF" text-anchor="middle">SPREAD VIEW [PAGE 4 · LEFT]</text>
  <text x="730" y="1145" font-family="sans-serif" font-size="14" font-weight="700" fill="#CCCCCC" text-anchor="end">4</text>
</svg>`,
    },
    {
      name: '05_spread_right.svg',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
  <defs>
    <linearGradient id="skyR" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2a164d"/>
      <stop offset="50%" stop-color="#4e1b52"/>
      <stop offset="100%" stop-color="#8c2e55"/>
    </linearGradient>
  </defs>
  <rect width="800" height="1200" fill="url(#skyR)"/>
  <!-- Moon Continuation & Dragon (Right Half of Two-page spread) -->
  <circle cx="50" cy="500" r="220" fill="#FFE3CC" opacity="0.8"/>
  <polygon points="0,1000 250,650 700,1200 0,1200" fill="#1a0f30" opacity="0.85"/>
  <polygon points="0,1200 350,750 800,1200" fill="#0e071c"/>
  
  <!-- Celestial Citadel -->
  <rect x="400" y="620" width="180" height="180" fill="#0c0717"/>
  <polygon points="380,620 490,520 600,620" fill="#FF5C00"/>
  
  <text x="400" y="320" font-family="sans-serif" font-size="42" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="6">THE FLOATING CITADEL</text>
  <text x="400" y="370" font-family="sans-serif" font-size="20" fill="#FFC38B" text-anchor="middle">"Where all frames converge."</text>
  
  <rect x="480" y="80" width="260" height="40" rx="8" fill="#000000" opacity="0.6"/>
  <text x="610" y="106" font-family="sans-serif" font-size="15" font-weight="700" fill="#FFFFFF" text-anchor="middle">SPREAD VIEW [PAGE 5 · RIGHT]</text>
  <text x="730" y="1145" font-family="sans-serif" font-size="14" font-weight="700" fill="#CCCCCC" text-anchor="end">5</text>
</svg>`,
    },
    {
      name: '06_climax.svg',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">
  <rect width="800" height="1200" fill="#0B0B0E"/>
  <rect x="30" y="30" width="740" height="1140" fill="none" stroke="#22222E" stroke-width="4"/>
  
  <circle cx="400" cy="480" r="200" fill="#161622"/>
  <circle cx="400" cy="480" r="160" fill="none" stroke="#FF5C00" stroke-width="4" stroke-dasharray="16,8"/>
  <text x="400" y="500" font-family="sans-serif" font-size="72" font-weight="900" fill="#FFFFFF" text-anchor="middle">つづく</text>
  <text x="400" y="560" font-family="sans-serif" font-size="24" font-weight="700" fill="#FF5C00" text-anchor="middle" letter-spacing="4">TO BE CONTINUED</text>
  
  <rect x="150" y="740" width="500" height="180" rx="16" fill="#14141C" stroke="#2A2A38" stroke-width="2"/>
  <text x="400" y="790" font-family="sans-serif" font-size="20" font-weight="800" fill="#FFFFFF" text-anchor="middle">CHAPTER 1 COMPLETE</text>
  <text x="400" y="830" font-family="sans-serif" font-size="15" fill="#8888A0" text-anchor="middle">Thank you for reading with Miru!</text>
  <text x="400" y="865" font-family="sans-serif" font-size="14" fill="#666680" text-anchor="middle">GPUIX Ultra-Fast Vector &amp; Texture Pipeline</text>
  
  <text x="730" y="1145" font-family="sans-serif" font-size="14" font-weight="700" fill="#666680" text-anchor="end">6</text>
</svg>`,
    },
  ]

  for (const page of pages) {
    zip.addFile(page.name, Buffer.from(page.svg, 'utf8'))
  }

  zip.writeZip(samplePath)
  return samplePath
}
