import React from 'react'
import { AnimatePresence, Button, motion } from '@gpuix/react'
import type { HistoryItem } from '../core/history'
import { Icon } from './Icons'
import { C, FONT_SANS } from '../theme'

export interface LibraryProps {
  history: HistoryItem[]
  onOpenComic: (filePath: string) => void
  onOpenFile: () => void
  onOpenSample: () => void
  onRemoveHistory: (filePath: string) => void
}

function TextAction({
  label,
  testId,
  onClick,
}: {
  label: string
  testId?: string
  onClick?: () => void
}) {
  return (
    <Button
      testId={testId}
      onClick={onClick}
      style={{
        height: 28,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 7,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        hover: { backgroundColor: C.overlay },
        active: { backgroundColor: C.overlayStrong },
      }}
    >
      <text
        style={{
          fontSize: 13,
          fontFamily: FONT_SANS,
          color: C.secondary,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </text>
    </Button>
  )
}

export function Library({
  history,
  onOpenComic,
  onOpenFile,
  onOpenSample,
  onRemoveHistory,
}: LibraryProps) {
  return (
    <div
      testId="library-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        flexGrow: 1,
        height: '100%',
        overflowY: 'scroll',
        backgroundColor: C.canvas,
        paddingLeft: 28,
        paddingRight: 28,
        paddingTop: 28,
        paddingBottom: 40,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 32,
            marginBottom: 8,
          }}
        >
          <text
            style={{
              fontSize: 13,
              fontWeight: 500,
              fontFamily: FONT_SANS,
              color: C.secondary,
              whiteSpace: 'nowrap',
            }}
          >
            Library
          </text>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <TextAction label="Open" testId="btn-open" onClick={onOpenFile} />
            <TextAction label="Sample" testId="btn-open-sample" onClick={onOpenSample} />
          </div>
        </div>

        {history.length === 0 ? (
          <text
            style={{
              fontSize: 13,
              fontFamily: FONT_SANS,
              color: C.ghost,
              marginTop: 28,
              whiteSpace: 'nowrap',
            }}
          >
            Nothing here yet.
          </text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <text
              style={{
                fontSize: 12,
                fontFamily: FONT_SANS,
                color: C.ghost,
                whiteSpace: 'nowrap',
                marginBottom: 6,
                marginTop: 12,
              }}
            >
              Recent
            </text>
            <AnimatePresence initial={false}>
              {history.map((item) => {
                const detail = item.series
                  ? `${item.series} · ${item.currentPage + 1} / ${item.pageCount}`
                  : `${item.currentPage + 1} / ${item.pageCount}`
                return (
                  <motion.div
                    key={item.filePath}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 56 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    style={{ overflow: 'hidden', flexShrink: 0 }}
                  >
                    <Button
                      onClick={() => onOpenComic(item.filePath)}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 56,
                        paddingLeft: 8,
                        paddingRight: 6,
                        borderRadius: 8,
                        gap: 12,
                        cursor: 'pointer',
                        hover: { backgroundColor: C.overlay },
                      }}
                    >
                      {item.coverPath ? (
                        <div
                          style={{
                            width: 32,
                            height: 44,
                            backgroundColor: C.surface,
                            borderRadius: 3,
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={item.coverPath}
                            objectFit="cover"
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 32,
                            height: 44,
                            backgroundColor: C.surface,
                            borderRadius: 3,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          flexGrow: 1,
                          minWidth: 0,
                          overflow: 'hidden',
                        }}
                      >
                        <text
                          style={{
                            fontSize: 13,
                            fontFamily: FONT_SANS,
                            color: C.text,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.title}
                        </text>
                        <text
                          style={{
                            fontSize: 12,
                            fontFamily: FONT_SANS,
                            color: C.tertiary,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {detail}
                        </text>
                      </div>
                      <Button
                        aria-label="Remove from library"
                        onClick={(e: any) => {
                          if (e && typeof e.stopPropagation === 'function') e.stopPropagation()
                          onRemoveHistory(item.filePath)
                        }}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0,
                          hover: { backgroundColor: C.overlayStrong },
                        }}
                      >
                        <Icon name="trash" size={13} color={C.ghost} />
                      </Button>
                    </Button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
