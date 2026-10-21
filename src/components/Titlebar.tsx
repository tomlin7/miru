import React, { useState } from 'react'
import { Button, useGpuix } from '@gpuix/react'
import { Icon } from './Icons'
import { C, FONT_SANS, IconButton, IS_DARWIN, TITLEBAR_HEIGHT } from '../theme'
import { clampZoom, type ReadingMode } from '../core/preferences'
import {
  endWindowDrag,
  handleTitlebarMouseDown,
  isWindowMaximized,
  toggleWindowZoom,
  updateWindowDrag,
} from '../window-drag'

export function DragRegion({
  testId,
  style,
  children,
}: {
  testId: string
  style?: Record<string, unknown>
  children?: React.ReactNode
}) {
  const { renderer } = useGpuix()
  return (
    <div
      testId={testId}
      style={{ ...style, pointerEvents: 'auto' }}
      onMouseDown={(e: any) => handleTitlebarMouseDown(renderer, e)}
      onMouseMove={() => updateWindowDrag()}
      onMouseUp={() => endWindowDrag()}
    >
      {children}
    </div>
  )
}

export function WindowControls() {
  const { renderer } = useGpuix()
  const [maximized, setMaximized] = useState(false)
  if (IS_DARWIN) return null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        height: '100%',
        flexShrink: 0,
      }}
    >
      <Button
        testId="window-minimize"
        aria-label="Minimize"
        onClick={() => renderer?.minimizeWindow?.()}
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          hover: { backgroundColor: C.overlay },
          active: { backgroundColor: C.overlayStrong },
        }}
      >
        <Icon name="windowMinimize" size={13} color={C.secondary} />
      </Button>
      <Button
        testId="window-maximize"
        aria-label={maximized ? 'Restore' : 'Maximize'}
        onClick={() => {
          toggleWindowZoom(renderer)
          setMaximized(isWindowMaximized())
        }}
        onMouseEnter={() => setMaximized(isWindowMaximized())}
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          hover: { backgroundColor: C.overlay },
          active: { backgroundColor: C.overlayStrong },
        }}
      >
        <Icon name={maximized ? 'windowRestore' : 'windowMaximize'} size={12} color={C.secondary} />
      </Button>
      <Button
        testId="window-close"
        aria-label="Close"
        onClick={() => {
          if (typeof process !== 'undefined') process.exit(0)
        }}
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          hover: { backgroundColor: '#3F2427' },
          active: { backgroundColor: '#582E33' },
        }}
      >
        <Icon name="windowClose" size={12} color={C.secondary} />
      </Button>
    </div>
  )
}

const LAYOUTS: { mode: ReadingMode; icon: 'singlePage' | 'doublePage' | 'webtoon'; label: string }[] = [
  { mode: 'single', icon: 'singlePage', label: 'Single page' },
  { mode: 'double', icon: 'doublePage', label: 'Spread' },
  { mode: 'webtoon', icon: 'webtoon', label: 'Webtoon' },
]

function ReadingActions({
  readingMode,
  zoom,
  onReadingMode,
  onZoom,
}: {
  readingMode: ReadingMode
  zoom: number
  onReadingMode: (mode: ReadingMode) => void
  onZoom: (zoom: number) => void
}) {
  const zoomLabel = `${Math.round(zoom * 100)}%`
  return (
    <div
      testId="reader-actions"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: '100%',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        {LAYOUTS.map((item) => (
          <IconButton
            key={item.mode}
            icon={item.icon}
            testId={`reader-mode-${item.mode}`}
            active={readingMode === item.mode}
            tooltip={item.label}
            onClick={() => onReadingMode(item.mode)}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          height: 28,
          borderRadius: 8,
          backgroundColor: C.surfaceHighlight,
          flexShrink: 0,
        }}
      >
        <Button
          testId="reader-zoom-out"
          aria-label="Zoom out"
          onClick={() => onZoom(clampZoom(zoom - 0.15))}
          style={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: 8,
            hover: { backgroundColor: C.overlay },
          }}
        >
          <Icon name="zoomOut" size={13} color={C.secondary} />
        </Button>
        <Button
          testId="reader-zoom-reset"
          aria-label="Reset zoom"
          onClick={() => onZoom(1)}
          style={{
            height: 28,
            paddingLeft: 4,
            paddingRight: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: 6,
            hover: { backgroundColor: C.overlay },
          }}
        >
          <text
            style={{
              fontSize: 12,
              fontWeight: 500,
              fontFamily: FONT_SANS,
              color: C.secondary,
              whiteSpace: 'nowrap',
            }}
          >
            {zoomLabel}
          </text>
        </Button>
        <Button
          testId="reader-zoom-in"
          aria-label="Zoom in"
          onClick={() => onZoom(clampZoom(zoom + 0.15))}
          style={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: 8,
            hover: { backgroundColor: C.overlay },
          }}
        >
          <Icon name="zoomIn" size={13} color={C.secondary} />
        </Button>
      </div>
    </div>
  )
}

export interface TitlebarProps {
  title?: string
  issue?: string
  showBack?: boolean
  onBack?: () => void
  onOpenSettings: () => void
  showPages?: boolean
  pagesOpen?: boolean
  onTogglePages?: () => void
  readingMode?: ReadingMode
  zoom?: number
  onReadingMode?: (mode: ReadingMode) => void
  onZoom?: (zoom: number) => void
}

export function Titlebar({
  title,
  issue,
  showBack,
  onBack,
  onOpenSettings,
  showPages,
  pagesOpen,
  onTogglePages,
  readingMode,
  zoom,
  onReadingMode,
  onZoom,
}: TitlebarProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: TITLEBAR_HEIGHT,
        backgroundColor: C.header,
        paddingLeft: IS_DARWIN ? 78 : 12,
        paddingRight: 8,
        userSelect: 'none',
        flexShrink: 0,
        gap: 4,
      }}
    >
      {showBack && onBack ? (
        <IconButton icon="arrowLeft" testId="btn-back-library" onClick={onBack} />
      ) : null}

      <DragRegion
        testId="titlebar-drag-header"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          flexGrow: 1,
          height: '100%',
          minWidth: 0,
        }}
      >
        {showBack ? (
          <text
            style={{
              fontSize: 13,
              fontWeight: 500,
              fontFamily: FONT_SANS,
              color: C.text,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title || 'Miru'}
          </text>
        ) : (
          <text
            style={{
              fontSize: 13,
              fontWeight: 500,
              fontFamily: FONT_SANS,
              color: C.text,
              whiteSpace: 'nowrap',
            }}
          >
            Miru
          </text>
        )}
        {showBack && issue ? (
          <text
            style={{
              fontSize: 12,
              fontFamily: FONT_SANS,
              color: C.tertiary,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {`#${issue}`}
          </text>
        ) : null}
        <div style={{ flexGrow: 1, height: '100%' }} />
      </DragRegion>

      {onReadingMode && onZoom && readingMode && typeof zoom === 'number' ? (
        <ReadingActions
          readingMode={readingMode}
          zoom={zoom}
          onReadingMode={onReadingMode}
          onZoom={onZoom}
        />
      ) : null}

      {showPages && onTogglePages ? (
        <IconButton
          icon="thumbnails"
          testId="btn-thumbnails"
          active={pagesOpen}
          onClick={onTogglePages}
        />
      ) : null}
      <IconButton icon="settings" testId="settings" onClick={onOpenSettings} />
      <WindowControls />
    </div>
  )
}
