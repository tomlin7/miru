import React, { useState } from 'react'
import { Button } from '@gpuix/react'
import { Icon, type IconName } from './components/Icons'

export const C = {
  canvas: '#1A1A1A',
  sidebar: '#181818',
  raised: '#232323',
  composer: '#212121',
  overlay: '#E6EAF20D',
  overlayStrong: '#E6EAF217',
  item: '#F0F0F00F',
  border: '#E6EAF212',
  borderStrong: '#E6EAF224',
  sidebarBorder: '#292929',
  text: '#E2E2E2',
  secondary: '#A3A3A3',
  tertiary: '#7D7D7D',
  ghost: '#575757',
  accent: '#E2795B',
  accentHover: '#E88B70',
  inverse: '#E7E9EC',
  onInverse: '#17181C',
}

export const TITLEBAR_HEIGHT = 48
export const FONT_SANS = typeof window === 'undefined' ? 'Helvetica' : 'IBM Plex Sans'
export const FONT_MONO = typeof window === 'undefined' ? 'Menlo' : 'Lilex'

export function IconButton({
  icon,
  onClick,
  dimmed,
  size = 14,
  testId,
  borderRadius = 7,
  active = false,
  tooltip,
}: {
  icon: IconName
  onClick?: () => void
  dimmed?: boolean
  size?: number
  testId?: string
  borderRadius?: number
  active?: boolean
  tooltip?: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <Button
        testId={testId}
        disabled={dimmed}
        style={{
          width: 28,
          height: 28,
          flexShrink: 0,
          borderRadius,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: dimmed ? 0.35 : 1,
          backgroundColor: active ? '#2B2B2F' : '#00000000',
          hover: dimmed ? undefined : { backgroundColor: active ? '#2B2B2F' : C.overlay },
          active: dimmed ? undefined : { backgroundColor: C.overlayStrong },
        }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Icon name={icon} size={size} color={active ? C.text : C.tertiary} />
      </Button>
      {hovered && tooltip && !active && (
        <div
          style={{
            position: 'absolute',
            top: 34,
            right: 0,
            backgroundColor: '#1E1E20',
            borderWidth: 1,
            borderColor: '#2E2E32',
            borderRadius: 6,
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 8,
            paddingRight: 8,
            boxShadow: {
              offsetX: 0,
              offsetY: 4,
              blurRadius: 12,
              spreadRadius: 0,
              color: '#00000080',
            },
          }}
        >
          <text
            style={{
              fontSize: 11,
              fontFamily: FONT_SANS,
              color: C.secondary,
              whiteSpace: 'nowrap',
            }}
          >
            {tooltip}
          </text>
        </div>
      )}
    </div>
  )
}

export function ResizeHandle({
  testId,
  isResizing,
  side = 'left',
  onMouseDown,
}: {
  testId?: string
  isResizing: boolean
  side?: 'left' | 'right'
  onMouseDown: (e: any) => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      testId={testId}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        ...(side === 'left' ? { right: 0 } : { left: 0 }),
        width: 8,
        cursor: 'col-resize',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: side === 'left' ? 'flex-end' : 'flex-start',
        backgroundColor: '#00000000',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={onMouseDown}
    >
      <div
        style={{
          width: isResizing || hovered ? 2 : 1,
          height: '100%',
          backgroundColor: isResizing ? C.accent : hovered ? C.borderStrong : C.sidebarBorder,
        }}
      />
    </div>
  )
}
