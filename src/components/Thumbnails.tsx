import React from 'react'
import { motion, Button } from '@gpuix/react'
import type { ComicPage } from '../core/cbz'
import { C, FONT_SANS, IconButton, ResizeHandle } from '../theme'

export interface ThumbnailsProps {
  open: boolean
  width: number
  isResizing: boolean
  onStartResize: (e: any) => void
  pages: ComicPage[]
  currentPage: number
  onSelectPage: (index: number) => void
  onClose: () => void
}

export function Thumbnails({
  open,
  width,
  isResizing,
  onStartResize,
  pages,
  currentPage,
  onSelectPage,
  onClose,
}: ThumbnailsProps) {
  return (
    <motion.div
      initial={false}
      animate={{ width: open ? width : 0 }}
      transition={{ duration: isResizing ? 0 : 0.2, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: C.sidebar,
        borderLeftWidth: open ? 1 : 0,
        borderColor: C.sidebarBorder,
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 14,
          paddingRight: 10,
          height: 42,
          borderBottomWidth: 1,
          borderColor: C.sidebarBorder,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <text
            style={{
              fontSize: 13,
              fontWeight: 500,
              fontFamily: FONT_SANS,
              color: C.text,
              whiteSpace: 'nowrap',
            }}
          >
            Pages
          </text>
          <text
            style={{
              fontSize: 12,
              fontFamily: FONT_SANS,
              color: C.tertiary,
              whiteSpace: 'nowrap',
            }}
          >
            {`${pages.length}`}
          </text>
        </div>

        <IconButton
          icon="windowClose"
          size={11}
          tooltip="Close Thumbnails"
          onClick={onClose}
        />
      </div>

      {/* Pages List */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflowY: 'scroll',
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
          gap: 8,
        }}
      >
        {pages.map((page) => {
          const isSelected = page.index === currentPage
          return (
            <Button
              key={page.index}
              onClick={() => onSelectPage(page.index)}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                gap: 10,
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 6,
                paddingRight: 8,
                backgroundColor: isSelected ? C.surfaceHighlight : '#00000000',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: isSelected ? C.borderStrong : '#00000000',
                cursor: 'pointer',
                hover: { backgroundColor: isSelected ? C.overlayStrong : C.overlay },
              }}
            >
              {/* Thumbnail image */}
              <div
                style={{
                  width: 52,
                  height: 72,
                  backgroundColor: C.canvas,
                  borderRadius: 4,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <img
                  src={page.cachedPath}
                  objectFit="contain"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Page details */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  overflow: 'hidden',
                }}
              >
                <text
                  style={{
                    fontSize: 12,
                    fontWeight: isSelected ? 500 : 400,
                    fontFamily: FONT_SANS,
                    color: isSelected ? C.text : C.secondary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {`${page.index + 1}`}
                </text>
              </div>
            </Button>
          )
        })}
      </div>

      {/* Resize Handle placed as LAST child per hiroshi-gpuix invariant */}
      <ResizeHandle
        testId="resize-handle-thumbnails"
        side="right"
        isResizing={isResizing}
        onMouseDown={onStartResize}
      />
    </motion.div>
  )
}
