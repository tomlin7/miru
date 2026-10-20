import React from 'react'
import { Button, useGpuix } from '@gpuix/react'
import { Icon } from './Icons'

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

let lastClickTime = 0
export function handleCaptionMouseDown(renderer?: any, e?: any) {
  if (e && e.button !== 0) return
  const now = Date.now()
  if (now - lastClickTime < 300) {
    lastClickTime = 0
    renderer?.zoomWindow?.()
    return
  }
  lastClickTime = now
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
        height: 42,
        backgroundColor: '#121216',
        borderBottomWidth: 1,
        borderColor: '#202028',
        paddingLeft: 12,
        paddingRight: 8,
        flexShrink: 0,
      }}
    >
      {/* Left side: Logo & Library / Open action */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {isReaderActive && onBackToLibrary && (
          <Button
            onClick={onBackToLibrary}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              height: 28,
              paddingLeft: 8,
              paddingRight: 10,
              backgroundColor: '#1A1A22',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#2A2A38',
              cursor: 'pointer',
              hover: { backgroundColor: '#262634' },
            }}
          >
            <Icon name="home" size={14} color="#A0A0B8" />
            <text style={{ fontSize: 12, color: '#D0D0E0', whiteSpace: 'nowrap' }}>
              {`Library`}
            </text>
          </Button>
        )}

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
              backgroundColor: '#FF5C00',
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
                fontWeight: '800',
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
              fontWeight: '600',
              color: '#8E8EA8',
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
              backgroundColor: '#181820',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#262634',
              cursor: 'pointer',
              hover: { backgroundColor: '#222230' },
            }}
          >
            <Icon name="folder" size={13} color="#9090A8" />
            <text style={{ fontSize: 12, color: '#C8C8DC', whiteSpace: 'nowrap' }}>
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
          gap: 12,
        }}
        onMouseDown={(e: any) => handleCaptionMouseDown(renderer, e)}
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
                fontWeight: '600',
                color: '#EEEEF8',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </text>
            {subtitle && (
              <text
                style={{
                  fontSize: 12,
                  color: '#7E7E98',
                  whiteSpace: 'nowrap',
                }}
              >
                {subtitle}
              </text>
            )}
            {pageProgress && (
              <div
                style={{
                  backgroundColor: '#20202E',
                  paddingLeft: 7,
                  paddingRight: 7,
                  paddingTop: 1,
                  paddingBottom: 1,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#2E2E42',
                }}
              >
                <text
                  style={{
                    fontSize: 11,
                    fontWeight: '500',
                    color: '#FF9E66',
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
              color: '#6E6E88',
              whiteSpace: 'nowrap',
            }}
          >
            {`Miru · Manga & Comic Reader`}
          </text>
        )}
      </div>

      {/* Right side: Native Window Controls */}
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
            borderRadius: 4,
            cursor: 'pointer',
            hover: { backgroundColor: '#22222E' },
          }}
        >
          <Icon name="windowMinimize" size={12} color="#A0A0B8" />
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
            borderRadius: 4,
            cursor: 'pointer',
            hover: { backgroundColor: '#22222E' },
          }}
        >
          <Icon name="windowMaximize" size={11} color="#A0A0B8" />
        </Button>

        <Button
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
            borderRadius: 4,
            cursor: 'pointer',
            hover: { backgroundColor: '#C53030' },
          }}
        >
          <Icon name="windowClose" size={12} color="#A0A0B8" />
        </Button>
      </div>
    </div>
  )
}
