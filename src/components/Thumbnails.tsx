import React from 'react'
import { motion, Button } from '@gpuix/react'
import type { ComicPage } from '../core/cbz'
import { Icon } from './Icons'

export interface ThumbnailsProps {
  open: boolean
  pages: ComicPage[]
  currentPage: number
  onSelectPage: (index: number) => void
  onClose: () => void
}

export function Thumbnails({
  open,
  pages,
  currentPage,
  onSelectPage,
  onClose,
}: ThumbnailsProps) {
  return (
    <motion.div
      initial={false}
      animate={{ width: open ? 260 : 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        height: '100%',
        backgroundColor: '#14141A',
        borderLeftWidth: open ? 1 : 0,
        borderColor: '#242432',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
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
          paddingRight: 12,
          height: 40,
          borderBottomWidth: 1,
          borderColor: '#222230',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="thumbnails" size={14} color="#FF5C00" />
          <text style={{ fontSize: 13, fontWeight: '700', color: '#EEEEF8', whiteSpace: 'nowrap' }}>
            {`Pages (${pages.length})`}
          </text>
        </div>

        <Button
          onClick={onClose}
          style={{
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            borderRadius: 4,
            cursor: 'pointer',
            hover: { backgroundColor: '#262638' },
          }}
        >
          <Icon name="windowClose" size={12} color="#A0A0B8" />
        </Button>
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
          gap: 10,
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
                gap: 10,
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 6,
                paddingRight: 6,
                backgroundColor: isSelected ? '#252028' : '#1A1A22',
                borderRadius: 8,
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? '#FF5C00' : '#282838',
                cursor: 'pointer',
                hover: { backgroundColor: isSelected ? '#2A2030' : '#22222E' },
              }}
            >
              {/* Thumbnail image */}
              <div
                style={{
                  width: 54,
                  height: 76,
                  backgroundColor: '#0F0F14',
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
                <div
                  style={{
                    backgroundColor: isSelected ? '#FF5C00' : '#2A2A3C',
                    paddingLeft: 6,
                    paddingRight: 6,
                    paddingTop: 2,
                    paddingBottom: 2,
                    borderRadius: 4,
                    alignSelf: 'flex-start',
                  }}
                >
                  <text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: isSelected ? '#FFFFFF' : '#C0C0D4',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {`Page ${page.index + 1}`}
                  </text>
                </div>
                <text
                  style={{
                    fontSize: 10,
                    color: '#707088',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {page.entryName}
                </text>
              </div>
            </Button>
          )
        })}
      </div>
    </motion.div>
  )
}
