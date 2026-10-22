import React, { useEffect, useRef, useState } from 'react'

import type { ComicPage } from '../core/cbz'
import { clampZoom, type FitMode, type ReadingDirection, type ReadingMode } from '../core/preferences'
import { C } from '../theme'

/**
 * The reader's page area.
 *
 * GPUIX has no transform, so a zoomed page cannot be scaled in place: it has
 * to be laid out at a different size and moved by hand. The page is centred
 * by the flexbox and the pan is an offset on top of that, so a zoom around
 * the pointer only has to work out where the point under the cursor lands.
 *
 * The page's proportions come from its own header, so a page is drawn into
 * a box of its own shape and is never letterboxed.
 */

/** The share of the viewport a fitted page fills. */
const FIT = 0.95
/** The gutter between the two pages of a spread, in fitted pixels. */
const SPREAD_GAP = 4
/** How much one wheel notch zooms. */
const ZOOM_RATE = 0.002
/** The width of a webtoon page, for the fits that size by height. */
const WEBTOON_HEIGHT_WIDTH = 700
const WEBTOON_BEST_WIDTH = 800

type Box = { w: number; h: number }
type Point = { x: number; y: number }

/** A page's proportions, or null when its header could not be read. */
function aspectOf(page: ComicPage): number | null {
  if (!page.width || !page.height) return null
  return page.width / page.height
}

export interface ViewerProps {
  pages: ComicPage[]
  currentPage: number
  readingMode: ReadingMode
  readingDirection: ReadingDirection
  fitMode: FitMode
  zoom: number
  onZoom: (next: number) => void
  onPageClick: (side: 'left' | 'right') => void
}

export function Viewer({
  pages,
  currentPage,
  readingMode,
  readingDirection,
  fitMode,
  zoom,
  onZoom,
  onPageClick,
}: ViewerProps) {
  // The viewport's box, in window coordinates. The wheel reports the pointer
  // in window coordinates, so the two have to share a frame.
  const [viewport, setViewport] = useState({ w: 0, h: 0, x: 0, y: 0 })
  // The content's laid-out box, which the zoom scales.
  const [content, setContent] = useState<Box>({ w: 0, h: 0 })
  // The offset of the content from where the flexbox centres it.
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 })

  // The zoom the wheel last set. A zoom from anywhere else re-centres.
  const wheelZoom = useRef<number | null>(null)
  const lastZoom = useRef(zoom)

  useEffect(() => {
    if (zoom === lastZoom.current) return
    lastZoom.current = zoom
    if (wheelZoom.current !== zoom) {
      setPan({ x: 0, y: 0 })
    }
    wheelZoom.current = null
  }, [zoom])

  // A new page is a new picture: start it centred.
  useEffect(() => {
    setPan({ x: 0, y: 0 })
  }, [currentPage, readingMode])

  const handleViewportLayout = (event: any) => {
    if (typeof event?.width !== 'number') return
    setViewport({ w: event.width, h: event.height, x: event.x ?? 0, y: event.y ?? 0 })
  }

  const handleContentLayout = (event: any) => {
    if (typeof event?.width !== 'number') return
    setContent({ w: event.width, h: event.height })
  }

  /**
   * The wheel: ctrl zooms around the pointer, everything else pans.
   */
  const handleWheel = (event: any) => {
    const deltaX = typeof event?.deltaX === 'number' ? event.deltaX : 0
    const deltaY = typeof event?.deltaY === 'number' ? event.deltaY : 0
    if (deltaX === 0 && deltaY === 0) return

    if (!event?.modifiers?.ctrl) {
      setPan((prev) => ({ x: prev.x - deltaX, y: prev.y - deltaY }))
      return
    }

    const next = clampZoom(zoom * Math.exp(-deltaY * ZOOM_RATE))
    if (next === zoom) return

    wheelZoom.current = next
    onZoom(next)

    if (content.w === 0 || content.h === 0) return

    // The pointer, in the viewport's own coordinates.
    const pointer = { x: (event.x ?? 0) - viewport.x, y: (event.y ?? 0) - viewport.y }
    // Where the flexbox puts the content on its own, without the pan.
    const centred = (size: number, viewportSize: number) => (viewportSize - size) / 2
    // The point of the page under the pointer, in fitted (zoom 1) units.
    const pointX = (pointer.x - centred(content.w, viewport.w) - pan.x) / zoom
    const pointY = (pointer.y - centred(content.h, viewport.h) - pan.y) / zoom
    // After the zoom the content is bigger, so the flexbox centres it
    // somewhere else, and the pan has to make up the difference.
    const ratio = next / zoom
    setPan({
      x: pointer.x - pointX * next - centred(content.w * ratio, viewport.w),
      y: pointer.y - pointY * next - centred(content.h * ratio, viewport.h),
    })
  }

  if (pages.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: C.canvas,
        }}
      >
        <text style={{ fontSize: 14, color: C.ghost, whiteSpace: 'nowrap' }}>
          {`No comic pages loaded.`}
        </text>
      </div>
    )
  }

  // The viewport is the same in every layout: it clips the content, centres
  // it, and takes the wheel.
  const viewportStyle: Record<string, unknown> = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    height: '100%',
    backgroundColor: C.canvas,
    overflow: 'hidden',
  }

  // The content is sized by the zoom and moved by the pan.
  const contentStyle: Record<string, unknown> = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    left: pan.x,
    top: pan.y,
  }

  /**
   * The size a page takes when it is fitted to the viewport, times the zoom.
   */
  const fitted = (pageAspect: number): Box => {
    if (fitMode === 'width') {
      const w = viewport.w * FIT * zoom
      return { w, h: w / pageAspect }
    }
    if (fitMode === 'best') {
      const w = Math.min(viewport.w * FIT * zoom, viewport.h * FIT * zoom * pageAspect)
      return { w, h: w / pageAspect }
    }
    const h = viewport.h * FIT * zoom
    return { w: h * pageAspect, h }
  }

  const handleScroll = (event: any) => handleWheel(event)

  const clickZone = (side: 'left' | 'right', width: string) => (
    <div
      style={{
        position: 'absolute',
        left: side === 'left' ? 0 : undefined,
        right: side === 'right' ? 0 : undefined,
        top: 0,
        width,
        height: '100%',
        cursor: 'pointer',
        backgroundColor: '#00000001',
      }}
      onClick={() => onPageClick(side)}
    />
  )

  if (readingMode === 'webtoon') {
    const baseWidth =
      fitMode === 'width'
        ? viewport.w * 0.96
        : fitMode === 'height'
          ? WEBTOON_HEIGHT_WIDTH
          : WEBTOON_BEST_WIDTH

    return (
      <div
        testId="reader-viewport"
        style={viewportStyle}
        onScroll={handleScroll}
        onLayout={handleViewportLayout}
      >
        <div
          testId="page-content"
          style={{
            ...contentStyle,
            flexDirection: 'column',
            alignItems: 'center',
            width: viewport.w > 0 ? baseWidth * zoom : 'auto',
            paddingTop: 16,
            paddingBottom: 40,
          }}
          onLayout={handleContentLayout}
        >
          {pages.map((page) => {
            const aspect = aspectOf(page)
            return (
              <div
                key={page.index}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={page.cachedPath}
                  objectFit="contain"
                  style={{
                    width: '100%',
                    // The width is definite, so the height follows the page's
                    // own proportions and the strip needs no measuring.
                    height: aspect ? 'auto' : undefined,
                    display: 'block',
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (readingMode === 'double') {
    const isCoverSolo = currentPage === 0
    let leftPage: ComicPage | null = null
    let rightPage: ComicPage | null = null

    if (isCoverSolo) {
      rightPage = pages[0]
    } else if (readingDirection === 'rtl') {
      rightPage = pages[currentPage]
      leftPage = pages[currentPage + 1] ?? null
    } else {
      leftPage = pages[currentPage]
      rightPage = pages[currentPage + 1] ?? null
    }

    const leftAspect = leftPage ? aspectOf(leftPage) : null
    const rightAspect = rightPage ? aspectOf(rightPage) : null
    // The spread is one picture as far as the layout is concerned, so its
    // proportions are the two pages side by side.
    const spreadAspect =
      leftAspect && rightAspect
        ? leftAspect + rightAspect
        : leftAspect ?? rightAspect ?? null
    const spread = spreadAspect ? fitted(spreadAspect) : { w: 0, h: 0 }
    // Until the viewport has been measured there is no size to lay the
    // spread out at, and an element with a zero dimension takes the reader
    // down with it.
    const spreadHeight = spread.h > 0 ? spread.h : 'auto'
    const gap = SPREAD_GAP * zoom

    const pageStyle: any = {
      width: '100%',
      height: '100%',
      borderRadius: 2,
      boxShadow: {
        offsetX: 0,
        offsetY: 8,
        blurRadius: 24,
        spreadRadius: 0,
        color: '#00000099',
      },
    }

    return (
      <div
        testId="reader-viewport"
        style={viewportStyle}
        onScroll={handleScroll}
        onLayout={handleViewportLayout}
      >
        <div
          testId="page-content"
          style={{
            ...contentStyle,
            flexDirection: 'row',
            alignItems: 'stretch',
            height: spreadHeight,
            gap,
          }}
          onLayout={handleContentLayout}
        >
          {leftPage && (
            <div
              style={{
                width: leftAspect && spread.h > 0 ? spread.h * leftAspect : 'auto',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img src={leftPage.cachedPath} objectFit="contain" style={pageStyle} />
            </div>
          )}
          {rightPage && (
            <div
              style={{
                width: rightAspect && spread.h > 0 ? spread.h * rightAspect : 'auto',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img src={rightPage.cachedPath} objectFit="contain" style={pageStyle} />
            </div>
          )}
        </div>

        {/* The click zones are rendered AFTER the content so they stack on
            top: GPUIX has no z-index, the tree order is the paint order. */}
        {clickZone('left', '25%')}
        {clickZone('right', '25%')}
      </div>
    )
  }

  // Single page.
  const page = pages[currentPage] || pages[0]
  const aspect = aspectOf(page)
  const box = aspect ? fitted(aspect) : { w: 0, h: 0 }

  return (
    <div
      testId="reader-viewport"
      style={viewportStyle}
      onScroll={handleScroll}
      onLayout={handleViewportLayout}
    >
      <div
        testId="page-content"
        style={{
          ...contentStyle,
          width: aspect && box.w > 0 ? box.w : 'auto',
          height: aspect && box.h > 0 ? box.h : 'auto',
        }}
        onLayout={handleContentLayout}
      >
        <img
          src={page.cachedPath}
          objectFit="contain"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 4,
            boxShadow: {
              offsetX: 0,
              offsetY: 8,
              blurRadius: 32,
              spreadRadius: 0,
              color: '#000000B3',
            },
          }}
        />
      </div>

      {/* The click zones are rendered AFTER the content so they stack on
          top: GPUIX has no z-index, the tree order is the paint order. */}
      {clickZone('left', '30%')}
      {clickZone('right', '30%')}
    </div>
  )
}
