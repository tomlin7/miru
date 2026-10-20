import React from 'react'
import type { ComicPage } from '../core/cbz'
import type { FitMode, ReadingDirection, ReadingMode } from './Toolbar'

export interface ViewerProps {
  pages: ComicPage[]
  currentPage: number
  readingMode: ReadingMode
  readingDirection: ReadingDirection
  fitMode: FitMode
  zoom: number
  onPageClick: (side: 'left' | 'right') => void
}

export function Viewer({
  pages,
  currentPage,
  readingMode,
  readingDirection,
  fitMode,
  zoom,
  onPageClick,
}: ViewerProps) {
  if (pages.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0E',
        }}
      >
        <text style={{ fontSize: 14, color: '#666680', whiteSpace: 'nowrap' }}>
          {`No comic pages loaded.`}
        </text>
      </div>
    )
  }

  // 1. Continuous Webtoon Mode
  if (readingMode === 'webtoon') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexGrow: 1,
          height: '100%',
          overflowY: 'scroll',
          backgroundColor: '#08080C',
          paddingTop: 16,
          paddingBottom: 40,
        }}
      >
        {pages.map((page) => (
          <div
            key={page.index}
            style={{
              width: fitMode === 'width' ? '96%' : fitMode === 'height' ? 700 : 800,
              maxWidth: '100%',
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
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  // 2. Two-Page Spread Mode
  if (readingMode === 'double') {
    // If page 0 is cover, display solo cover
    const isCoverSolo = currentPage === 0
    let leftPageIndex: number | null = null
    let rightPageIndex: number | null = null

    if (isCoverSolo) {
      rightPageIndex = 0
    } else {
      // In RTL (Manga): Page N is on Right, Page N+1 is on Left
      // In LTR (Comic): Page N is on Left, Page N+1 is on Right
      if (readingDirection === 'rtl') {
        rightPageIndex = currentPage
        leftPageIndex = currentPage + 1 < pages.length ? currentPage + 1 : null
      } else {
        leftPageIndex = currentPage
        rightPageIndex = currentPage + 1 < pages.length ? currentPage + 1 : null
      }
    }

    const leftPage = leftPageIndex !== null ? pages[leftPageIndex] : null
    const rightPage = rightPageIndex !== null ? pages[rightPageIndex] : null

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          height: '100%',
          backgroundColor: '#0A0A0E',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Left Click Zone */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '25%',
            height: '100%',
            cursor: 'pointer',
          }}
          onClick={() => onPageClick('left')}
        />

        {/* Right Click Zone */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '25%',
            height: '100%',
            cursor: 'pointer',
          }}
          onClick={() => onPageClick('right')}
        />

        {/* Spread Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: fitMode === 'height' || fitMode === 'best' ? '94%' : 'auto',
            width: fitMode === 'width' ? '96%' : 'auto',
            gap: 4,
          }}
        >
          {leftPage && (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <img
                src={leftPage.cachedPath}
                objectFit={fitMode === 'width' ? 'contain' : 'scaleDown'}
                style={{
                  height: '100%',
                  maxHeight: '100%',
                  borderRadius: 2,
                  boxShadow: {
                    offsetX: 0,
                    offsetY: 8,
                    blurRadius: 24,
                    spreadRadius: 0,
                    color: '#00000099',
                  },
                }}
              />
            </div>
          )}

          {rightPage && (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCoverSolo ? 'center' : 'flex-start',
              }}
            >
              <img
                src={rightPage.cachedPath}
                objectFit={fitMode === 'width' ? 'contain' : 'scaleDown'}
                style={{
                  height: '100%',
                  maxHeight: '100%',
                  borderRadius: 2,
                  boxShadow: {
                    offsetX: 0,
                    offsetY: 8,
                    blurRadius: 24,
                    spreadRadius: 0,
                    color: '#00000099',
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  // 3. Single Page Mode (Default)
  const page = pages[currentPage] || pages[0]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        height: '100%',
        backgroundColor: '#0A0A0E',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left Click Zone */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '30%',
          height: '100%',
          cursor: 'pointer',
        }}
        onClick={() => onPageClick('left')}
      />

      {/* Right Click Zone */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '30%',
          height: '100%',
          cursor: 'pointer',
        }}
        onClick={() => onPageClick('right')}
      />

      {/* Page Image Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: fitMode === 'height' || fitMode === 'best' ? '95%' : 'auto',
          width: fitMode === 'width' ? '95%' : 'auto',
        }}
      >
        <img
          src={page.cachedPath}
          objectFit={fitMode === 'width' ? 'contain' : 'scaleDown'}
          style={{
            height: zoom === 1 ? '100%' : `${zoom * 100}%`,
            maxHeight: zoom === 1 ? '100%' : undefined,
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
    </div>
  )
}
