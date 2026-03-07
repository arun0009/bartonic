import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const publicDir = path.resolve('public')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="none">
  <defs>
    <linearGradient id="bg" x1="120" y1="80" x2="900" y2="940" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0A1324"/>
      <stop offset="1" stop-color="#06101E"/>
    </linearGradient>
    <linearGradient id="train" x1="280" y1="280" x2="760" y2="780" gradientUnits="userSpaceOnUse">
      <stop stop-color="#A5F3FC"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </linearGradient>
  </defs>
  <rect x="56" y="56" width="912" height="912" rx="220" fill="url(#bg)"/>
  <rect x="56" y="56" width="912" height="912" rx="220" stroke="#1F2E45" stroke-width="8"/>
  <path d="M240 340C324 254 420 218 512 218C604 218 700 254 784 340" stroke="#2AA1D8" stroke-opacity="0.85" stroke-width="24" stroke-linecap="round"/>
  <rect x="286" y="334" width="452" height="370" rx="124" fill="url(#train)"/>
  <rect x="322" y="376" width="380" height="178" rx="80" fill="#0B1D30"/>
  <rect x="358" y="414" width="128" height="96" rx="32" fill="#5FD6FF"/>
  <rect x="538" y="414" width="128" height="96" rx="32" fill="#5FD6FF"/>
  <circle cx="398" cy="652" r="26" fill="#091727"/>
  <circle cx="626" cy="652" r="26" fill="#091727"/>
  <rect x="240" y="760" width="544" height="24" rx="12" fill="#2AA1D8"/>
  <rect x="240" y="792" width="544" height="24" rx="12" fill="#F1C40F"/>
  <rect x="240" y="824" width="544" height="24" rx="12" fill="#2ECC71"/>
  <rect x="240" y="856" width="544" height="24" rx="12" fill="#F39C12"/>
</svg>`

const socialCardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <defs>
    <linearGradient id="bg" x1="100" y1="40" x2="1110" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#081526"/>
      <stop offset="1" stop-color="#0B213B"/>
    </linearGradient>
    <linearGradient id="hero" x1="136" y1="96" x2="456" y2="416" gradientUnits="userSpaceOnUse">
      <stop stop-color="#A5F3FC"/>
      <stop offset="1" stop-color="#22D3EE"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" rx="48" fill="url(#bg)"/>
  <rect x="24" y="24" width="1152" height="582" rx="36" stroke="#20334D" stroke-width="2"/>

  <rect x="88" y="88" width="388" height="454" rx="48" fill="#0A1A30" fill-opacity="0.74"/>
  <rect x="126" y="126" width="312" height="312" rx="82" fill="url(#hero)"/>
  <rect x="151" y="151" width="262" height="262" rx="70" fill="#0B1D30"/>
  <path d="M188 208C224 172 252 154 282 154C312 154 340 172 376 208" stroke="#2AA1D8" stroke-opacity="0.9" stroke-width="14" stroke-linecap="round"/>
  <rect x="180" y="210" width="204" height="156" rx="46" fill="url(#hero)"/>
  <rect x="197" y="228" width="170" height="74" rx="30" fill="#0B1D30"/>
  <rect x="214" y="246" width="54" height="36" rx="12" fill="#69DAFF"/>
  <rect x="297" y="246" width="54" height="36" rx="12" fill="#69DAFF"/>
  <circle cx="230" cy="339" r="11" fill="#081425"/>
  <circle cx="334" cy="339" r="11" fill="#081425"/>
  <rect x="190" y="378" width="184" height="10" rx="5" fill="#2AA1D8"/>
  <rect x="190" y="392" width="184" height="10" rx="5" fill="#F1C40F"/>
  <rect x="190" y="406" width="184" height="10" rx="5" fill="#2ECC71"/>
  <rect x="190" y="420" width="184" height="10" rx="5" fill="#F39C12"/>
  <rect x="126" y="458" width="312" height="48" rx="20" fill="#0A2038"/>
  <text x="282" y="490" text-anchor="middle" fill="#8FD8F7" font-size="22" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif">BARTonic</text>

  <text x="530" y="214" fill="#E9F5FF" font-size="72" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-weight="800">BARTonic</text>
  <text x="530" y="278" fill="#8DC1E8" font-size="32" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif">Live BART departures and route tracking.</text>
  <text x="530" y="324" fill="#8DC1E8" font-size="32" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif">Installable PWA for Bay Area commuters.</text>

  <rect x="530" y="392" width="548" height="74" rx="18" fill="#0A1A30" fill-opacity="0.72" stroke="#234161" stroke-width="1"/>
  <text x="560" y="438" fill="#A5F3FC" font-size="28" font-family="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif">bartonic.arun0009.workers.dev</text>
</svg>`

async function writeSvg() {
  await fs.writeFile(path.join(publicDir, 'favicon.svg'), svg, 'utf8')
  await fs.writeFile(path.join(publicDir, 'social-card.svg'), socialCardSvg, 'utf8')
}

async function writePng(size, filename) {
  await sharp(Buffer.from(svg))
    .resize(size, size, { fit: 'cover' })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, filename))
}

async function run() {
  await writeSvg()
  await Promise.all([
    writePng(16, 'favicon-16.png'),
    writePng(32, 'favicon-32.png'),
    writePng(180, 'apple-touch-icon.png'),
    writePng(192, 'icon-192.png'),
    writePng(512, 'icon-512.png'),
    writePng(512, 'icon-maskable-512.png'),
    sharp(Buffer.from(socialCardSvg))
      .resize(1200, 630, { fit: 'cover' })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(path.join(publicDir, 'social-card.png'))
  ])
  console.log('Generated favicon, PWA icons, and social card in public/')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
