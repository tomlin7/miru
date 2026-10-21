/**
 * Record a short product clip for the website.
 *
 * It drives the real app through the automation client, captures the window
 * at each step, and leaves a numbered PNG sequence in `www/assets/frames`.
 * The website build turns that sequence into a loop with ffmpeg.
 *
 *   bun record.ts
 */

import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { launch } from '@gpuix/react/automation'
import { createSampleMangaCbz } from './src/core/sample'

const FRAMES = path.resolve('www/assets/frames')

async function main() {
  if (existsSync(FRAMES)) rmSync(FRAMES, { recursive: true, force: true })
  mkdirSync(FRAMES, { recursive: true })

  const miruHome = mkdtempSync(path.join(tmpdir(), 'miru-clip-'))
  const sample = createSampleMangaCbz()

  console.log('[record] launching the reader...')
  const app = await launch({
    command: 'bun',
    args: ['app.tsx'],
    env: { GPUIX_BACKGROUND: '1', MIRU_HOME: miruHome, MIRU_OPEN: sample },
  })

  let shot = 0
  const capture = async (name: string) => {
    shot += 1
    const file = path.join(FRAMES, `${String(shot).padStart(2, '0')}-${name}.png`)
    await app.screenshot({ path: file })
    console.log(`[record] ${path.basename(file)}`)
  }

  const settle = (ms: number) => new Promise((r) => setTimeout(r, ms))

  try {
    await app.getByTestId('reader').waitFor({ timeoutMs: 30_000 })
    await app.getByTestId('reader-actions').waitFor({ timeoutMs: 20_000 })
    /* The first pages decode from their data URLs, so give the reader room
       to paint before the first frame. */
    await settle(2500)

    await capture('single-1')

    // Turn through the chapter.
    for (let page = 2; page <= 5; page += 1) {
      await app.getByTestId('btn-next').click()
      await settle(900)
      await capture(`single-${page}`)
    }

    // The two-page spread.
    await app.getByTestId('reader-mode-double').click()
    await settle(1400)
    await capture('spread')

    // The page list, drawn over the spread.
    await app.getByTestId('btn-thumbnails').click()
    await settle(1400)
    await capture('thumbnails')
    await app.getByTestId('btn-thumbnails').click()
    await settle(700)

    // The continuous strip.
    await app.getByTestId('reader-mode-webtoon').click()
    await settle(1600)
    await capture('webtoon')

    await app.getByTestId('reader-mode-single').click()
    await settle(1400)
    await capture('single-back')
  } finally {
    await app.close()
  }

  console.log(`[record] wrote ${shot} frames to ${FRAMES}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
