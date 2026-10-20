import { mkdtempSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { launch, type App } from '@gpuix/react/automation'
import { createSampleMangaCbz } from './src/core/sample'

const outDir = 'screenshots'
mkdirSync(outDir, { recursive: true })
const miruHome = mkdtempSync(path.join(tmpdir(), 'miru-shot-'))
const samplePath = createSampleMangaCbz()

async function assertNoSampleButton(app: App) {
  let visible = false
  try {
    await app.getByTestId('btn-open-sample').waitFor({ timeoutMs: 600 })
    visible = true
  } catch {
    visible = false
  }
  if (visible) {
    throw new Error('Sample button is still visible in the product UI')
  }
}

console.log('[screenshot] Launching empty library...')
const library = await launch({
  command: 'bun',
  args: ['app.tsx'],
  env: { GPUIX_BACKGROUND: '1', MIRU_HOME: miruHome },
})

try {
  await library.getByTestId('library-container').waitFor({ timeoutMs: 15_000 })
  await library.getByTestId('btn-open').waitFor({ timeoutMs: 5_000 })
  await assertNoSampleButton(library)
  await new Promise((r) => setTimeout(r, 400))
  await library.screenshot({ path: path.join(outDir, '01_miru_library.png') })
  console.log('[screenshot] captured screenshots/01_miru_library.png')
} finally {
  await library.close()
}

console.log('[screenshot] Launching reader with the test fixture...')
const app = await launch({
  command: 'bun',
  args: ['app.tsx'],
  env: { GPUIX_BACKGROUND: '1', MIRU_HOME: miruHome, MIRU_OPEN: samplePath },
})

try {
  await app.getByTestId('reader').waitFor({ timeoutMs: 15_000 })
  await assertNoSampleButton(app)
  await new Promise((r) => setTimeout(r, 600))

  await app.screenshot({ path: path.join(outDir, '02_miru_reader_single.png') })
  console.log('[screenshot] captured screenshots/02_miru_reader_single.png')

  await app.getByTestId('settings').click()
  await app.getByTestId('settings-mode').waitFor({ timeoutMs: 10_000 })
  await new Promise((r) => setTimeout(r, 300))
  await app.screenshot({ path: path.join(outDir, '06_miru_settings.png') })
  console.log('[screenshot] captured screenshots/06_miru_settings.png')

  await app.getByTestId('settings-mode').click()
  await new Promise((r) => setTimeout(r, 200))
  await app.getByTestId('settings-back').click()
  await app.getByTestId('reader').waitFor({ timeoutMs: 10_000 })
  await app.getByTestId('btn-next').click()
  await new Promise((r) => setTimeout(r, 500))

  await app.screenshot({ path: path.join(outDir, '03_miru_reader_spread.png') })
  console.log('[screenshot] captured screenshots/03_miru_reader_spread.png')

  await app.getByTestId('btn-thumbnails').click()
  await new Promise((r) => setTimeout(r, 500))

  await app.screenshot({ path: path.join(outDir, '04_miru_thumbnails_drawer.png') })
  console.log('[screenshot] captured screenshots/04_miru_thumbnails_drawer.png')

  await app.getByTestId('btn-thumbnails').click()
  await new Promise((r) => setTimeout(r, 250))

  await app.getByTestId('settings').click()
  await app.getByTestId('settings-mode').waitFor({ timeoutMs: 10_000 })
  await app.getByTestId('settings-mode').click()
  await new Promise((r) => setTimeout(r, 200))
  await app.getByTestId('settings-back').click()
  await new Promise((r) => setTimeout(r, 500))

  await app.screenshot({ path: path.join(outDir, '05_miru_webtoon_mode.png') })
  console.log('[screenshot] captured screenshots/05_miru_webtoon_mode.png')

  await app.getByTestId('btn-back-library').click()
  await app.getByTestId('library-container').waitFor({ timeoutMs: 10_000 })
  await app.getByTestId('btn-open').waitFor({ timeoutMs: 5_000 })
  await assertNoSampleButton(app)
  await new Promise((r) => setTimeout(r, 400))
  await app.screenshot({ path: path.join(outDir, '07_miru_library_recent.png') })
  console.log('[screenshot] captured screenshots/07_miru_library_recent.png')

  console.log('[screenshot] All screenshots captured successfully!')
} finally {
  await app.close()
}
