import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { launch } from '@gpuix/react/automation'

const outDir = 'screenshots'
mkdirSync(outDir, { recursive: true })

console.log('[screenshot] Launching Miru...')
const app = await launch({
  command: 'bun',
  args: ['app.tsx'],
  env: { GPUIX_BACKGROUND: '1' },
})

try {
  // Wait for Library to mount
  await app.getByTestId('library-container').waitFor({ timeoutMs: 15_000 })
  await new Promise((r) => setTimeout(r, 600))

  // 1. Capture Library / Welcome View
  await app.screenshot({ path: path.join(outDir, '01_miru_library.png') })
  console.log('[screenshot] captured screenshots/01_miru_library.png')

  // 2. Click "Read Sample Manga" button to load sample comic
  await app.getByTestId('btn-open-sample').click()
  await app.getByTestId('btn-mode-single').waitFor({ timeoutMs: 15_000 })
  await new Promise((r) => setTimeout(r, 600))

  // Capture Single Page View (Cover)
  await app.screenshot({ path: path.join(outDir, '02_miru_reader_single.png') })
  console.log('[screenshot] captured screenshots/02_miru_reader_single.png')

  // 3. Switch to Two-Page Spread Mode
  await app.getByTestId('btn-mode-double').click()
  await new Promise((r) => setTimeout(r, 400))
  // Advance to next spread
  await app.getByTestId('btn-next').click()
  await new Promise((r) => setTimeout(r, 600))

  await app.screenshot({ path: path.join(outDir, '03_miru_reader_spread.png') })
  console.log('[screenshot] captured screenshots/03_miru_reader_spread.png')

  // 4. Open Thumbnails drawer
  await app.getByTestId('btn-thumbnails').click()
  await new Promise((r) => setTimeout(r, 600))

  await app.screenshot({ path: path.join(outDir, '04_miru_thumbnails_drawer.png') })
  console.log('[screenshot] captured screenshots/04_miru_thumbnails_drawer.png')

  // 5. Switch to Webtoon Mode
  await app.getByTestId('btn-mode-webtoon').click()
  await new Promise((r) => setTimeout(r, 600))

  await app.screenshot({ path: path.join(outDir, '05_miru_webtoon_mode.png') })
  console.log('[screenshot] captured screenshots/05_miru_webtoon_mode.png')

  console.log('[screenshot] All screenshots captured successfully!')
} finally {
  await app.close()
}
