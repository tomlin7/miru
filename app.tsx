import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  applyMacCpuThrottleFromEnv,
  render,
  useGpuix,
} from '@gpuix/react'
import { openCbz, type ComicBook } from './src/core/cbz'
import {
  loadHistory,
  removeHistoryItem,
  saveHistoryItem,
  type HistoryItem,
} from './src/core/history'
import { createSampleMangaCbz } from './src/core/sample'
import { Titlebar } from './src/components/Titlebar'
import {
  BottomScrubber,
  Toolbar,
  type FitMode,
  type ReadingDirection,
  type ReadingMode,
} from './src/components/Toolbar'
import { Viewer } from './src/components/Viewer'
import { Thumbnails } from './src/components/Thumbnails'
import { Library } from './src/components/Library'
import { C } from './src/theme'

export function MiruApp() {
  const { renderer } = useGpuix()

  // State
  const [comic, setComic] = useState<ComicBook | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [readingMode, setReadingMode] = useState<ReadingMode>('single')
  const [readingDirection, setReadingDirection] = useState<ReadingDirection>('rtl')
  const [fitMode, setFitMode] = useState<FitMode>('height')
  const [zoom, setZoom] = useState<number>(1.0)
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState<boolean>(false)
  const [thumbnailsWidth, setThumbnailsWidth] = useState<number>(260)
  const [resizing, setResizing] = useState<string | null>(null)
  const resizeOrigin = useRef({ startX: 0, startWidth: 260 })
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  // Open a comic file
  const handleOpenComic = useCallback((filePath: string) => {
    try {
      setErrorMessage(null)
      const loadedComic = openCbz(filePath)
      setComic(loadedComic)

      const hist = loadHistory()
      const existing = hist.find((h) => h.filePath === filePath)
      if (existing) {
        setCurrentPage(Math.min(existing.currentPage, loadedComic.pageCount - 1))
        setReadingMode(existing.readingMode || 'single')
        setReadingDirection(existing.readingDirection || 'rtl')
      } else {
        setCurrentPage(0)
      }

      saveHistoryItem({
        filePath,
        title: loadedComic.title,
        series: loadedComic.series,
        issue: loadedComic.issue,
        coverPath: loadedComic.coverPath,
        currentPage: existing ? existing.currentPage : 0,
        pageCount: loadedComic.pageCount,
        lastReadAt: Date.now(),
        readingMode: existing?.readingMode || 'single',
        readingDirection: existing?.readingDirection || 'rtl',
      })
      setHistory(loadHistory())
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to open CBZ archive.')
    }
  }, [])

  const handleOpenSample = useCallback(() => {
    const samplePath = createSampleMangaCbz()
    handleOpenComic(samplePath)
  }, [handleOpenComic])

  // Page navigation
  const handleNextPage = useCallback(() => {
    if (!comic) return
    setCurrentPage((prev) => {
      const step = readingMode === 'double' && prev > 0 ? 2 : 1
      const next = Math.min(prev + step, comic.pageCount - 1)
      if (next !== prev) {
        saveHistoryItem({
          filePath: comic.filePath,
          title: comic.title,
          series: comic.series,
          issue: comic.issue,
          coverPath: comic.coverPath,
          currentPage: next,
          pageCount: comic.pageCount,
          lastReadAt: Date.now(),
          readingMode,
          readingDirection,
        })
      }
      return next
    })
  }, [comic, readingMode, readingDirection])

  const handlePrevPage = useCallback(() => {
    if (!comic) return
    setCurrentPage((prev) => {
      const step = readingMode === 'double' && prev > 1 ? 2 : 1
      const next = Math.max(prev - step, 0)
      if (next !== prev) {
        saveHistoryItem({
          filePath: comic.filePath,
          title: comic.title,
          series: comic.series,
          issue: comic.issue,
          coverPath: comic.coverPath,
          currentPage: next,
          pageCount: comic.pageCount,
          lastReadAt: Date.now(),
          readingMode,
          readingDirection,
        })
      }
      return next
    })
  }, [comic, readingMode, readingDirection])

  const handlePageClick = useCallback(
    (side: 'left' | 'right') => {
      if (readingDirection === 'rtl') {
        if (side === 'left') handleNextPage()
        else handlePrevPage()
      } else {
        if (side === 'right') handleNextPage()
        else handlePrevPage()
      }
    },
    [readingDirection, handleNextPage, handlePrevPage]
  )

  const handleSelectPage = useCallback(
    (index: number) => {
      if (!comic) return
      const valid = Math.max(0, Math.min(index, comic.pageCount - 1))
      setCurrentPage(valid)
      saveHistoryItem({
        filePath: comic.filePath,
        title: comic.title,
        series: comic.series,
        issue: comic.issue,
        coverPath: comic.coverPath,
        currentPage: valid,
        pageCount: comic.pageCount,
        lastReadAt: Date.now(),
        readingMode,
        readingDirection,
      })
    },
    [comic, readingMode, readingDirection]
  )

  const handleRemoveHistory = useCallback((filePath: string) => {
    removeHistoryItem(filePath)
    setHistory(loadHistory())
  }, [])

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      const key = e.key || ''

      if (key === 'ArrowRight') {
        if (readingDirection === 'rtl') handlePrevPage()
        else handleNextPage()
      } else if (key === 'ArrowLeft') {
        if (readingDirection === 'rtl') handleNextPage()
        else handlePrevPage()
      } else if (key === ' ' || key === 'PageDown' || key === 'j') {
        handleNextPage()
      } else if (key === 'PageUp' || key === 'k') {
        handlePrevPage()
      } else if (key === 'Home') {
        handleSelectPage(0)
      } else if (key === 'End' && comic) {
        handleSelectPage(comic.pageCount - 1)
      } else if (key === 'm' || key === 'M') {
        setReadingMode((prev) =>
          prev === 'single' ? 'double' : prev === 'double' ? 'webtoon' : 'single'
        )
      } else if (key === 'd' || key === 'D') {
        setReadingDirection((prev) => (prev === 'rtl' ? 'ltr' : 'rtl'))
      } else if (key === 't' || key === 'T') {
        setIsThumbnailsOpen((prev) => !prev)
      } else if (key === 'f' || key === 'F' || key === 'F11') {
        renderer?.toggleFullscreen?.()
      } else if (key === '+' || key === '=') {
        setZoom((prev) => Math.min(prev + 0.15, 3.0))
      } else if (key === '-' || key === '_') {
        setZoom((prev) => Math.max(prev - 0.15, 0.5))
      } else if (key === '0') {
        setZoom(1.0)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [comic, readingDirection, handleNextPage, handlePrevPage, handleSelectPage, renderer])

  // Open file dialog
  const handleOpenFileDialog = async () => {
    try {
      if (!renderer?.promptForPaths) return
      const paths = await renderer.promptForPaths({
        files: true,
        directories: false,
        multiple: false,
        prompt: 'Select .cbz comic archive',
      })
      if (paths && paths.length > 0 && paths[0]) {
        handleOpenComic(paths[0])
      }
    } catch {
      // ignore
    }
  }

  const pageProgressText = comic
    ? `Page ${currentPage + 1} of ${comic.pageCount} (${Math.round(
        ((currentPage + 1) / comic.pageCount) * 100
      )}%)`
    : undefined

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: C.canvas,
        color: C.text,
        overflow: 'hidden',
      }}
    >
      {/* Titlebar */}
      <Titlebar
        title={comic?.title}
        subtitle={comic?.issue ? `Issue #${comic.issue}` : undefined}
        pageProgress={pageProgressText}
        isReaderActive={comic !== null}
        onBackToLibrary={() => setComic(null)}
        onOpenClick={handleOpenFileDialog}
      />

      {/* Main Content Area */}
      {comic ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Controls HUD */}
          <Toolbar
            readingMode={readingMode}
            onChangeReadingMode={setReadingMode}
            readingDirection={readingDirection}
            onChangeReadingDirection={setReadingDirection}
            fitMode={fitMode}
            onChangeFitMode={setFitMode}
            zoom={zoom}
            onZoomIn={() => setZoom((z) => Math.min(z + 0.15, 3.0))}
            onZoomOut={() => setZoom((z) => Math.max(z - 0.15, 0.5))}
            onZoomReset={() => setZoom(1.0)}
            isThumbnailsOpen={isThumbnailsOpen}
            onToggleThumbnails={() => setIsThumbnailsOpen((open) => !open)}
            currentPage={currentPage}
            pageCount={comic.pageCount}
            onPageChange={handleSelectPage}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />

          {/* Central Viewer & Sliding Thumbnails */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexGrow: 1,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Viewer
              pages={comic.pages}
              currentPage={currentPage}
              readingMode={readingMode}
              readingDirection={readingDirection}
              fitMode={fitMode}
              zoom={zoom}
              onPageClick={handlePageClick}
            />

            {/* Resizable Thumbnails Drawer – per hiroshi-gpuix pattern:
                ResizeHandle is last child inside the motion.div drawer,
                zero-latency drag via duration: 0 when resizing */}
            <Thumbnails
              open={isThumbnailsOpen}
              width={thumbnailsWidth}
              isResizing={resizing === 'thumbnails'}
              onStartResize={(e: any) => {
                if (e.button === 0) {
                  resizeOrigin.current = {
                    startX: e.x ?? 0,
                    startWidth: thumbnailsWidth,
                  }
                  setResizing('thumbnails')
                }
              }}
              pages={comic.pages}
              currentPage={currentPage}
              onSelectPage={handleSelectPage}
              onClose={() => setIsThumbnailsOpen(false)}
            />
          </div>

          {/* Bottom Scrubber */}
          {readingMode !== 'webtoon' && (
            <BottomScrubber
              currentPage={currentPage}
              pageCount={comic.pageCount}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
              onPageChange={handleSelectPage}
              readingDirection={readingDirection}
            />
          )}

          {/* Global Resizing Overlay – per hiroshi-gpuix pattern:
              Full-screen transparent overlay captures mouse across the entire window */}
          {resizing !== null && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: 'col-resize',
                backgroundColor: '#00000001',
              }}
              onMouseMove={(e: any) => {
                const currentX = e.x ?? 0
                if (resizing === 'thumbnails') {
                  const delta = resizeOrigin.current.startX - currentX
                  const newWidth = Math.max(200, Math.min(460, resizeOrigin.current.startWidth + delta))
                  setThumbnailsWidth(newWidth)
                }
              }}
              onMouseUp={() => setResizing(null)}
            />
          )}
        </div>
      ) : (
        <Library
          history={history}
          onOpenComic={handleOpenComic}
          onOpenSample={handleOpenSample}
          onRemoveHistory={handleRemoveHistory}
        />
      )}

      {/* Error alert toast */}
      {errorMessage && (
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 200,
            right: 200,
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 8,
            boxShadow: {
              offsetX: 0,
              offsetY: 8,
              blurRadius: 24,
              spreadRadius: 0,
              color: '#00000080',
            },
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <text style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
            {errorMessage}
          </text>
        </div>
      )}
    </div>
  )
}

export default MiruApp

const isEntryPoint =
  typeof Bun !== 'undefined'
    ? Bun.isStandaloneExecutable || Bun.main === import.meta.path
    : typeof process !== 'undefined' &&
      (process.argv[1]?.endsWith('app.tsx') || process.argv[1]?.endsWith('miru.tsx'))

if (isEntryPoint) {
  applyMacCpuThrottleFromEnv()
  render(<MiruApp />, {
    title: 'Miru · Manga & Comic Reader',
    width: 1200,
    height: 840,
    titlebarTransparent: true,
    windowBackground: 'blurred',
    trafficLightX: 16,
    trafficLightY: 17,
    debugFrameOverlay: 'hidden',
    focus: process.env.GPUIX_BACKGROUND !== '1',
  })
}
