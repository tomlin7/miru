import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  applyMacCpuThrottleFromEnv,
  render,
  useGpuix,
} from '@gpuix/react'
import { openComic, type ComicBook } from './src/core/cbz'
import {
  loadHistory,
  removeHistoryItem,
  saveHistoryItem,
  type HistoryItem,
} from './src/core/history'
import {
  clampZoom,
  cycleMode,
  loadPreferences,
  savePreferences,
  type FitMode,
  type ReadingDirection,
  type ReadingMode,
  type ReadingPreferences,
} from './src/core/preferences'
import { Titlebar } from './src/components/Titlebar'
import { PageRail } from './src/components/PageRail'
import { Viewer } from './src/components/Viewer'
import { Thumbnails } from './src/components/Thumbnails'
import { Library } from './src/components/Library'
import { Settings } from './src/components/Settings'
import { C, FONT_SANS } from './src/theme'

export function MiruApp() {
  const { renderer } = useGpuix()
  const seed = useState(loadPreferences)[0]

  const [comic, setComic] = useState<ComicBook | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [readingMode, setReadingMode] = useState<ReadingMode>(seed.readingMode)
  const [readingDirection, setReadingDirection] = useState<ReadingDirection>(seed.readingDirection)
  const [fitMode, setFitMode] = useState<FitMode>(seed.fitMode)
  const [zoom, setZoom] = useState<number>(seed.zoom)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [isThumbnailsOpen, setIsThumbnailsOpen] = useState<boolean>(false)
  const [thumbnailsWidth, setThumbnailsWidth] = useState<number>(240)
  const [resizing, setResizing] = useState<string | null>(null)
  const resizeOrigin = useRef({ startX: 0, startWidth: 240 })
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const prefsRef = useRef<ReadingPreferences>(seed)
  const comicRef = useRef<ComicBook | null>(null)
  const pageRef = useRef(0)
  prefsRef.current = { readingMode, readingDirection, fitMode, zoom }
  comicRef.current = comic
  pageRef.current = currentPage

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  const applyReading = useCallback((partial: Partial<ReadingPreferences>, persist: boolean) => {
    const prev = prefsRef.current
    const next: ReadingPreferences = {
      readingMode: partial.readingMode ?? prev.readingMode,
      readingDirection: partial.readingDirection ?? prev.readingDirection,
      fitMode: partial.fitMode ?? prev.fitMode,
      zoom: clampZoom(partial.zoom ?? prev.zoom),
    }
    prefsRef.current = next
    setReadingMode(next.readingMode)
    setReadingDirection(next.readingDirection)
    setFitMode(next.fitMode)
    setZoom(next.zoom)
    if (persist) savePreferences(next)

    const book = comicRef.current
    const touchesBook =
      partial.readingMode !== undefined || partial.readingDirection !== undefined
    if (persist && book && touchesBook) {
      saveHistoryItem({
        filePath: book.filePath,
        title: book.title,
        series: book.series,
        issue: book.issue,
        coverPath: book.coverPath,
        currentPage: pageRef.current,
        pageCount: book.pageCount,
        lastReadAt: Date.now(),
        readingMode: next.readingMode,
        readingDirection: next.readingDirection,
      })
      setHistory(loadHistory())
    }
  }, [])

  const handleOpenComic = useCallback(
    async (filePath: string) => {
      try {
        setErrorMessage(null)
        const loadedComic = await openComic(filePath)
        setComic(loadedComic)
        setSettingsOpen(false)

        const hist = loadHistory()
        const existing = hist.find((h) => h.filePath === filePath)
        const mode = existing?.readingMode || prefsRef.current.readingMode
        const direction = existing?.readingDirection || prefsRef.current.readingDirection
        const page = existing
          ? Math.min(existing.currentPage, loadedComic.pageCount - 1)
          : 0
        setCurrentPage(page)
        applyReading({ readingMode: mode, readingDirection: direction }, false)

        saveHistoryItem({
          filePath,
          title: loadedComic.title,
          series: loadedComic.series,
          issue: loadedComic.issue,
          coverPath: loadedComic.coverPath,
          currentPage: page,
          pageCount: loadedComic.pageCount,
          lastReadAt: Date.now(),
          readingMode: mode,
          readingDirection: direction,
        })
        setHistory(loadHistory())
      } catch (err: any) {
        setErrorMessage(err?.message || 'Failed to open this comic.')
      }
    },
    [applyReading]
  )

  // MIRU_OPEN is for the test harness only. It is not a product entry point.
  useEffect(() => {
    const openPath = typeof process !== 'undefined' ? process.env.MIRU_OPEN : undefined
    if (openPath) handleOpenComic(openPath)
  }, [handleOpenComic])

  const rememberPage = useCallback(
    (page: number) => {
      const book = comicRef.current
      const prefs = prefsRef.current
      if (!book) return
      saveHistoryItem({
        filePath: book.filePath,
        title: book.title,
        series: book.series,
        issue: book.issue,
        coverPath: book.coverPath,
        currentPage: page,
        pageCount: book.pageCount,
        lastReadAt: Date.now(),
        readingMode: prefs.readingMode,
        readingDirection: prefs.readingDirection,
      })
    },
    []
  )

  const handleNextPage = useCallback(() => {
    const book = comicRef.current
    if (!book) return
    setCurrentPage((prev) => {
      const step = prefsRef.current.readingMode === 'double' && prev > 0 ? 2 : 1
      const next = Math.min(prev + step, book.pageCount - 1)
      if (next !== prev) rememberPage(next)
      return next
    })
  }, [rememberPage])

  const handlePrevPage = useCallback(() => {
    const book = comicRef.current
    if (!book) return
    setCurrentPage((prev) => {
      const step = prefsRef.current.readingMode === 'double' && prev > 1 ? 2 : 1
      const next = Math.max(prev - step, 0)
      if (next !== prev) rememberPage(next)
      return next
    })
  }, [rememberPage])

  const handlePageClick = useCallback(
    (side: 'left' | 'right') => {
      const direction = prefsRef.current.readingDirection
      if (direction === 'rtl') {
        if (side === 'left') handleNextPage()
        else handlePrevPage()
      } else {
        if (side === 'right') handleNextPage()
        else handlePrevPage()
      }
    },
    [handleNextPage, handlePrevPage]
  )

  const handleSelectPage = useCallback(
    (index: number) => {
      const book = comicRef.current
      if (!book) return
      const valid = Math.max(0, Math.min(index, book.pageCount - 1))
      setCurrentPage(valid)
      rememberPage(valid)
    },
    [rememberPage]
  )

  const handleRemoveHistory = useCallback((filePath: string) => {
    removeHistoryItem(filePath)
    setHistory(loadHistory())
  }, [])

  const handleOpenFileDialog = useCallback(async () => {
    try {
      if (!renderer?.promptForPaths) return
      const paths = await renderer.promptForPaths({
        files: true,
        directories: false,
        multiple: false,
        prompt: 'Open comic',
      })
      if (paths && paths.length > 0 && paths[0]) {
        handleOpenComic(paths[0])
      }
    } catch {
      // ignore
    }
  }, [renderer, handleOpenComic])

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      const key = e.key || ''
      if (settingsOpen) {
        if (key === 'Escape') setSettingsOpen(false)
        return
      }

      const direction = prefsRef.current.readingDirection
      if (key === 'ArrowRight') {
        if (direction === 'rtl') handlePrevPage()
        else handleNextPage()
      } else if (key === 'ArrowLeft') {
        if (direction === 'rtl') handleNextPage()
        else handlePrevPage()
      } else if (key === ' ' || key === 'PageDown' || key === 'j') {
        handleNextPage()
      } else if (key === 'PageUp' || key === 'k') {
        handlePrevPage()
      } else if (key === 'Home') {
        handleSelectPage(0)
      } else if (key === 'End' && comicRef.current) {
        handleSelectPage(comicRef.current.pageCount - 1)
      } else if (key === 'm' || key === 'M') {
        applyReading({ readingMode: cycleMode(prefsRef.current.readingMode) }, true)
      } else if (key === 'd' || key === 'D') {
        applyReading(
          { readingDirection: prefsRef.current.readingDirection === 'rtl' ? 'ltr' : 'rtl' },
          true
        )
      } else if (key === 't' || key === 'T') {
        if (comicRef.current) setIsThumbnailsOpen((prev) => !prev)
      } else if (key === 'f' || key === 'F' || key === 'F11') {
        renderer?.toggleFullscreen?.()
      } else if (key === '+' || key === '=') {
        applyReading({ zoom: clampZoom(prefsRef.current.zoom + 0.15) }, true)
      } else if (key === '-' || key === '_') {
        applyReading({ zoom: clampZoom(prefsRef.current.zoom - 0.15) }, true)
      } else if (key === '0') {
        applyReading({ zoom: 1 }, true)
      } else if (key === ',' || key === 'Escape') {
        if (key === ',') setSettingsOpen(true)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    settingsOpen,
    handleNextPage,
    handlePrevPage,
    handleSelectPage,
    applyReading,
    renderer,
  ])

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
        fontFamily: FONT_SANS,
        position: 'relative',
      }}
    >
      {settingsOpen ? (
        <Settings
          readingMode={readingMode}
          readingDirection={readingDirection}
          fitMode={fitMode}
          zoom={zoom}
          onChange={(partial) => applyReading(partial, true)}
          onBack={() => setSettingsOpen(false)}
        />
      ) : (
        <>
          <Titlebar
            title={comic?.title}
            issue={comic?.issue}
            showBack={comic !== null}
            onBack={() => setComic(null)}
            onOpenSettings={() => setSettingsOpen(true)}
            showPages={comic !== null}
            pagesOpen={isThumbnailsOpen}
            onTogglePages={() => setIsThumbnailsOpen((open) => !open)}
            readingMode={comic ? readingMode : undefined}
            zoom={comic ? zoom : undefined}
            onReadingMode={
              comic ? (mode) => applyReading({ readingMode: mode }, true) : undefined
            }
            onZoom={comic ? (next) => applyReading({ zoom: next }, true) : undefined}
          />

          {comic ? (
            <div
              testId="reader"
              style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
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

              {readingMode !== 'webtoon' && (
                <PageRail
                  currentPage={currentPage}
                  pageCount={comic.pageCount}
                  onPrevPage={handlePrevPage}
                  onNextPage={handleNextPage}
                />
              )}

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
                      const newWidth = Math.max(
                        200,
                        Math.min(460, resizeOrigin.current.startWidth + delta)
                      )
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
              onOpenFile={handleOpenFileDialog}
              onRemoveHistory={handleRemoveHistory}
            />
          )}
        </>
      )}

      {errorMessage && (
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
          onMouseDown={() => setErrorMessage(null)}
        >
          <div
            style={{
              backgroundColor: C.raised,
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 8,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <text
              style={{
                fontSize: 12,
                fontFamily: FONT_SANS,
                color: C.error,
                whiteSpace: 'nowrap',
              }}
            >
              {errorMessage}
            </text>
          </div>
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
