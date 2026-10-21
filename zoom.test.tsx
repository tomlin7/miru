/**
 * Zoom, panning and the pointer-anchored wheel.
 *
 * The reader has no scroll container: GPUIX has no transform, so a zoomed
 * page has to be laid out at a different size and moved by hand. These tests
 * drive the real hit test with a real wheel event, in every layout, because
 * the zoom used to work in the single page layout and nowhere else.
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

/** The reader measures its own page, so the size settles a frame after mount. */
const settle = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function openReader() {
  process.env.MIRU_HOME = mkdtempSync(path.join(tmpdir(), 'miru-zoom-'))
  process.env.MIRU_OPEN = createSampleMangaCbz()

  const { render, renderer } = createTestRoot({ width: 1200, height: 800 })
  render(<MiruApp />)
  const app = await connectTest(renderer)

  await app.getByTestId('reader').waitFor({ timeoutMs: 15_000 })
  await app.getByTestId('reader-actions').waitFor({ timeoutMs: 15_000 })
  await settle(500)

  return { app, renderer }
}

type Bounds = { x: number; y: number; width: number; height: number }

/**
 * The content's box, once the page has been laid out at its fitted size.
 *
 * The page is measured before it is fitted, so the first size that settles
 * is the page's natural size. The fitted size is known: the page fills 95%
 * of the viewport's height.
 */
/**
 * The test renderer only paints when something asks it to, so the layout
 * events that tell the reader how big the viewport is do not arrive until
 * the next interaction. A mouse move is enough to force a frame.
 */
async function tick(app: any) {
  await app.mouse.move({ x: 2, y: 2 })
  await settle(150)
}

async function contentBounds(app: any): Promise<Bounds> {
  const content = app.getByTestId('page-content')
  const view = app.getByTestId('reader-viewport')
  await content.waitFor({ timeoutMs: 15_000 })
  await view.waitFor({ timeoutMs: 15_000 })

  // The viewport has to be measured first: until it is, the page is drawn at
  // its own size rather than fitted to the window.
  let viewport = (await view.bounds()) as Bounds
  for (let attempt = 0; attempt < 60 && viewport.height === 0; attempt += 1) {
    await tick(app)
    viewport = (await view.bounds()) as Bounds
  }

  let previous: Bounds | null = null
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const current = (await content.bounds()) as Bounds
    const stable =
      previous !== null &&
      current.width === previous.width &&
      current.height === previous.height
    if (stable && current.width > 0 && current.height > 0) {
      return current
    }
    previous = current
    await tick(app)
  }
  return previous as Bounds
}

async function zoomLabel(renderer: any): Promise<string> {
  const texts: string[] = renderer.getAllText()
  const match = texts.find((text) => /^\d+%$/.test(text))
  return match ?? ''
}

describeNative('Miru zoom', () => {
  afterEach(() => {
    delete process.env.MIRU_OPEN
    delete process.env.MIRU_HOME
  })

  it('zooms with the wheel in the single page layout', async () => {
    const { app, renderer } = await openReader()

    const before = await contentBounds(app)
    const cx = before.x + before.width / 2
    const cy = before.y + before.height / 2

    await app.mouse.wheel({ x: cx, y: cy }, 0, -120, { modifiers: 'ctrl' })
    await settle(500)

    const after = await contentBounds(app)
    expect(after.width).toBeGreaterThan(before.width)
    expect(await zoomLabel(renderer)).not.toBe('100%')

    await app.close()
  }, 20_000)

  it('zooms with the wheel in the two page spread', async () => {
    const { app, renderer } = await openReader()

    await app.getByTestId('reader-mode-double').click()
    await settle(600)

    const before = await contentBounds(app)
    const cx = before.x + before.width / 2
    const cy = before.y + before.height / 2

    await app.mouse.wheel({ x: cx, y: cy }, 0, -120, { modifiers: 'ctrl' })
    await settle(500)

    const after = await contentBounds(app)
    expect(after.width).toBeGreaterThan(before.width)
    expect(await zoomLabel(renderer)).not.toBe('100%')

    await app.close()
  }, 20_000)

  it('zooms with the wheel in the webtoon layout', async () => {
    const { app, renderer } = await openReader()

    await app.getByTestId('reader-mode-webtoon').click()
    await settle(600)

    const before = await contentBounds(app)
    const cx = before.x + before.width / 2
    const cy = before.y + before.height / 2

    await app.mouse.wheel({ x: cx, y: cy }, 0, -120, { modifiers: 'ctrl' })
    await settle(500)

    const after = await contentBounds(app)
    expect(after.width).toBeGreaterThan(before.width)
    expect(await zoomLabel(renderer)).not.toBe('100%')

    await app.close()
  }, 20_000)

  it('keeps the point under the pointer under the pointer', async () => {
    const { app } = await openReader()

    const before = await contentBounds(app)
    // A point off centre, so a zoom that ignores the pointer is visible.
    const cx = before.x + before.width * 0.25
    const cy = before.y + before.height * 0.3

    await app.mouse.wheel({ x: cx, y: cy }, 0, -120, { modifiers: 'ctrl' })
    await settle(500)

    const after = await contentBounds(app)
    // Where the point was, as a fraction of the page.
    const u = (cx - before.x) / before.width
    const v = (cy - before.y) / before.height

    // The same point of the page, after the zoom.
    expect(after.x + u * after.width).toBeCloseTo(cx, 0)
    expect(after.y + v * after.height).toBeCloseTo(cy, 0)

    await app.close()
  }, 20_000)

  it('pans instead of zooming when the wheel is not held with ctrl', async () => {
    const { app, renderer } = await openReader()

    const before = await contentBounds(app)
    const cx = before.x + before.width / 2
    const cy = before.y + before.height / 2

    // Scrolling down moves the page up.
    await app.mouse.wheel({ x: cx, y: cy }, 0, 120)
    await settle(500)

    const after = await contentBounds(app)

    expect(after.width).toBe(before.width)
    expect(after.y).toBeLessThan(before.y)
    expect(await zoomLabel(renderer)).toBe('100%')

    await app.close()
  }, 20_000)
})
