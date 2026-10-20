import React from 'react'
import { Button, useGpuix } from '@gpuix/react'
import { Icon } from './Icons'
import { C, FONT_SANS, IconButton, IS_DARWIN, TITLEBAR_HEIGHT } from '../theme'

let user32Ffi: any = null

function getWin32Hwnd(): any {
  if (typeof process === 'undefined' || process.platform !== 'win32') return null
  try {
    if (!user32Ffi) {
      const { dlopen, FFIType } = require('bun:ffi')
      user32Ffi = dlopen('user32.dll', {
        FindWindowW: {
          args: [FFIType.ptr, FFIType.ptr],
          returns: FFIType.ptr,
        },
        GetForegroundWindow: {
          args: [],
          returns: FFIType.ptr,
        },
        ReleaseCapture: {
          args: [],
          returns: FFIType.bool,
        },
        SendMessageW: {
          args: [FFIType.ptr, FFIType.u32, FFIType.ptr, FFIType.ptr],
          returns: FFIType.ptr,
        },
      })
    }
    const titleBuf = Buffer.from('Miru · Manga & Comic Reader\0', 'utf16le')
    const found = user32Ffi.symbols.FindWindowW(null, titleBuf)
    if (found) return found
    return user32Ffi.symbols.GetForegroundWindow()
  } catch {
    return null
  }
}

export function startWindowDrag() {
  if (typeof process === 'undefined' || process.platform !== 'win32') return
  try {
    const hwnd = getWin32Hwnd()
    if (hwnd && user32Ffi) {
      user32Ffi.symbols.ReleaseCapture()
      user32Ffi.symbols.SendMessageW(hwnd, 0x0112, 0xf012, 0)
    }
  } catch {
    // ignore
  }
}

let lastTitlebarClick = 0
export function handleTitlebarMouseDown(renderer?: any, e?: any) {
  if (e && e.button !== 0) return
  const now = Date.now()
  if (now - lastTitlebarClick < 300) {
    lastTitlebarClick = 0
    renderer?.zoomWindow?.()
    return
  }
  lastTitlebarClick = now
  startWindowDrag()
}

export function WindowControls() {
  const { renderer } = useGpuix()
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
        aria-label="Maximize"
        onClick={() => renderer?.zoomWindow?.()}
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
        <Icon name="windowMaximize" size={12} color={C.secondary} />
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
  const { renderer } = useGpuix()

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

      {showBack ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            minWidth: 0,
            maxWidth: 460,
            overflow: 'hidden',
          }}
        >
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
          {issue ? (
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
        </div>
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

      <div
        style={{ flexGrow: 1, height: '100%' }}
        onMouseDown={(e: any) => handleTitlebarMouseDown(renderer, e)}
      />

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

export function DragSpacer() {
  const { renderer } = useGpuix()
  return (
    <div
      style={{ flexGrow: 1, height: '100%' }}
      onMouseDown={(e: any) => handleTitlebarMouseDown(renderer, e)}
    />
  )
}
