import React from 'react'
import { Button, useGpuix } from '@gpuix/react'
import { Icon } from './Icons'
import { C, FONT_SANS, IconButton, TITLEBAR_HEIGHT } from '../theme'

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

export interface TitlebarProps {
  title?: string
  subtitle?: string
  pageProgress?: string
  onBackToLibrary?: () => void
  onOpenClick?: () => void
  isReaderActive?: boolean
}

export function Titlebar({
  title,
  subtitle,
  pageProgress,
  onBackToLibrary,
  onOpenClick,
  isReaderActive,
}: TitlebarProps) {
  const { renderer } = useGpuix()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: TITLEBAR_HEIGHT,
        backgroundColor: C.sidebar,
        borderBottomWidth: 1,
        borderColor: C.sidebarBorder,
        paddingLeft: 12,
        paddingRight: 8,
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Left side: Brand badge & Library navigation */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {isReaderActive && onBackToLibrary ? (
          <IconButton
            icon="home"
            testId="btn-back-library"
            tooltip="Back to Library"
            onClick={onBackToLibrary}
          />
        ) : null}

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              backgroundColor: C.accent,
              paddingLeft: 6,
              paddingRight: 6,
              paddingTop: 2,
              paddingBottom: 2,
              borderRadius: 4,
            }}
          >
            <text
              style={{
                fontSize: 11,
                fontWeight: 700,
                fontFamily: FONT_SANS,
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              {`MIRU`}
            </text>
          </div>
          <text
            style={{
              fontSize: 12,
              fontWeight: 500,
              fontFamily: FONT_SANS,
              color: C.secondary,
              whiteSpace: 'nowrap',
            }}
          >
            {`見る`}
          </text>
        </div>

        {onOpenClick && (
          <Button
            onClick={onOpenClick}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              height: 28,
              paddingLeft: 8,
              paddingRight: 10,
              backgroundColor: C.raised,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: C.border,
              cursor: 'pointer',
              hover: { backgroundColor: C.overlayStrong },
            }}
          >
            <Icon name="folder" size={13} color={C.secondary} />
            <text
              style={{
                fontSize: 12,
                fontFamily: FONT_SANS,
                color: C.text,
                whiteSpace: 'nowrap',
              }}
            >
              {`Open CBZ`}
            </text>
          </Button>
        )}
      </div>

      {/* Middle: Draggable window caption & Comic title */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          height: '100%',
          cursor: 'default',
          gap: 10,
        }}
        onMouseDown={(e: any) => handleTitlebarMouseDown(renderer, e)}
      >
        {title ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <text
              style={{
                fontSize: 13,
                fontWeight: 600,
                fontFamily: FONT_SANS,
                color: C.text,
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </text>
            {subtitle && (
              <text
                style={{
                  fontSize: 12,
                  fontFamily: FONT_SANS,
                  color: C.tertiary,
                  whiteSpace: 'nowrap',
                }}
              >
                {subtitle}
              </text>
            )}
            {pageProgress && (
              <div
                style={{
                  backgroundColor: C.overlay,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 2,
                  paddingBottom: 2,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: C.border,
                }}
              >
                <text
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: FONT_SANS,
                    color: C.accent,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {pageProgress}
                </text>
              </div>
            )}
          </div>
        ) : (
          <text
            style={{
              fontSize: 12,
              fontFamily: FONT_SANS,
              color: C.tertiary,
              whiteSpace: 'nowrap',
            }}
          >
            {`Miru · Manga & Comic Reader`}
          </text>
        )}
      </div>

      {/* Right side: Native Window Controls matching Hiroshi chrome */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button
          onClick={() => renderer?.minimizeWindow?.()}
          style={{
            width: 32,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderRadius: 5,
            cursor: 'pointer',
            hover: { backgroundColor: C.overlay },
            active: { backgroundColor: C.overlayStrong },
          }}
        >
          <Icon name="windowMinimize" size={12} color={C.secondary} />
        </Button>

        <Button
          onClick={() => renderer?.zoomWindow?.()}
          style={{
            width: 32,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderRadius: 5,
            cursor: 'pointer',
            hover: { backgroundColor: C.overlay },
            active: { backgroundColor: C.overlayStrong },
          }}
        >
          <Icon name="windowMaximize" size={11} color={C.secondary} />
        </Button>

        <Button
          testId="window-close"
          onClick={() => {
            if (typeof process !== 'undefined') {
              process.exit(0)
            }
          }}
          style={{
            width: 32,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderRadius: 5,
            cursor: 'pointer',
            hover: { backgroundColor: '#582E33' },
            active: { backgroundColor: '#752B33' },
          }}
        >
          <Icon name="windowClose" size={12} color={C.secondary} />
        </Button>
      </div>
    </div>
  )
}
