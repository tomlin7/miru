import React, { useState } from 'react'
import { Button, useGpuix } from '@gpuix/react'
import { Icon } from './Icons'
import { C, FONT_SANS, IconButton, IS_DARWIN, TITLEBAR_HEIGHT } from '../theme'
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

export interface TitlebarProps {
  title?: string
  issue?: string
  showBack?: boolean
  onBack?: () => void
  onOpenSettings: () => void
  showPages?: boolean
  pagesOpen?: boolean
  onTogglePages?: () => void
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
