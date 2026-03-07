import { promises as fs } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const publicDir = path.resolve('public')

const variants = [
  {
    id: 'premium',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="none">
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
  },
  {
    id: 'playful',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="none">
      <defs>
        <linearGradient id="bg2" x1="140" y1="70" x2="900" y2="960" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0D2038"/>
          <stop offset="1" stop-color="#0A1629"/>
        </linearGradient>
        <linearGradient id="rail2" x1="220" y1="240" x2="820" y2="780" gradientUnits="userSpaceOnUse">
          <stop stop-color="#60A5FA"/>
          <stop offset="1" stop-color="#22D3EE"/>
        </linearGradient>
      </defs>
      <rect x="56" y="56" width="912" height="912" rx="220" fill="url(#bg2)"/>
      <rect x="56" y="56" width="912" height="912" rx="220" stroke="#244160" stroke-width="8"/>
      <path d="M228 692L386 476L512 608L638 426L796 642" stroke="url(#rail2)" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="228" cy="692" r="32" fill="#60A5FA"/>
      <circle cx="386" cy="476" r="32" fill="#2AA1D8"/>
      <circle cx="512" cy="608" r="32" fill="#F1C40F"/>
      <circle cx="638" cy="426" r="32" fill="#2ECC71"/>
      <circle cx="796" cy="642" r="32" fill="#F39C12"/>
      <rect x="252" y="264" width="520" height="172" rx="84" fill="#A5F3FC"/>
      <rect x="294" y="302" width="436" height="96" rx="48" fill="#0B1D30"/>
      <rect x="332" y="324" width="110" height="52" rx="20" fill="#6EE7FF"/>
      <rect x="582" y="324" width="110" height="52" rx="20" fill="#6EE7FF"/>
    </svg>`
  }
]

async function writeVariant(variant) {
  const base = `icon-${variant.id}`
  await fs.writeFile(path.join(publicDir, `${base}.svg`), variant.svg, 'utf8')
  await Promise.all([
    sharp(Buffer.from(variant.svg)).resize(192, 192).png({ quality: 100 }).toFile(path.join(publicDir, `${base}-192.png`)),
    sharp(Buffer.from(variant.svg)).resize(512, 512).png({ quality: 100 }).toFile(path.join(publicDir, `${base}-512.png`))
  ])
}

async function run() {
  await Promise.all(variants.map(writeVariant))
  console.log('Generated icon variants in public/: premium, playful')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
