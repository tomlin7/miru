/**
 * Reading actions sit in the titlebar only while a book is open.
 *
 *   bun test reader-actions.test.tsx
 */

import React from 'react'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { connectTest } from '@gpuix/react/automation'
import { createTestRoot, hasNativeTestRenderer } from '@gpuix/react/testing'

import { MiruApp } from './app'
import { createSampleMangaCbz } from './src/core/sample'

const describeNative = hasNativeTestRenderer ? describe : describe.skip

async function absent(app: any, testId: string) {
  let visible = false
  try {
    await app.getByTestId(testId).waitFor({ timeoutMs: 400 })
    visible = true
  } catch {
    visible = false
  }
  expect(visible).toBe(false)
}

describeNative('reader titlebar actions', () => {
  const previousOpen = process.env.MIRU_OPEN
  const previousHome = process.env.MIRU_HOME

  afterEach(() => {
    if (previousOpen === undefined) delete process.env.MIRU_OPEN
    else process.env.MIRU_OPEN = previousOpen
    if (previousHome === undefined) delete process.env.MIRU_HOME
    else process.env.MIRU_HOME = previousHome
  })

  it('hides layout and zoom on the library', async () => {
    delete process.env.MIRU_OPEN
    const { render, renderer } = createTestRoot({ width: 1200, height: 800 })
    render(<MiruApp />)
    const app = await connectTest(renderer)

    await app.getByTestId('library-container').waitFor({ timeoutMs: 10_000 })
    await absent(app, 'reader-actions')

    await app.close()
  })

  it('reveals layout and zoom while a book is open', async () => {
    process.env.MIRU_HOME = mkdtempSync(path.join(tmpdir(), 'miru-actions-'))
    process.env.MIRU_OPEN = createSampleMangaCbz()

    const { render, renderer } = createTestRoot({ width: 1200, height: 800 })
    render(<MiruApp />)
    const app = await connectTest(renderer)

    await app.getByTestId('reader-actions').waitFor({ timeoutMs: 10_000 })
    await app.getByTestId('reader-mode-single').waitFor({ timeoutMs: 5_000 })
    await app.getByTestId('btn-next').waitFor({ timeoutMs: 5_000 })

    await app.getByTestId('reader-mode-webtoon').click()
    await absent(app, 'btn-next')

    await app.getByTestId('reader-mode-double').click()
    await app.getByTestId('btn-next').waitFor({ timeoutMs: 5_000 })

    await app.getByTestId('reader-zoom-in').click()
    await app.getByTestId('reader-zoom-reset').click()
    await app.getByTestId('reader-zoom-out').waitFor({ timeoutMs: 5_000 })

    await app.close()
  })
})
