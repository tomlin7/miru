import React from 'react'
import { C, FONT_SANS, IconButton } from '../theme'

export function PageRail({
  currentPage,
  pageCount,
  onPrevPage,
  onNextPage,
}: {
  currentPage: number
  pageCount: number
  onPrevPage: () => void
  onNextPage: () => void
}) {
  const pct = pageCount > 0 ? ((currentPage + 1) / pageCount) * 100 : 0

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        paddingLeft: 8,
        paddingRight: 14,
        gap: 8,
        flexShrink: 0,
        backgroundColor: C.header,
        borderTopWidth: 1,
        borderColor: C.border,
      }}
    >
      <IconButton icon="arrowLeft" testId="btn-prev" onClick={onPrevPage} />
      <div
        style={{
          flexGrow: 1,
          height: 2,
          backgroundColor: C.overlayStrong,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: C.accent,
          }}
        />
      </div>
      <text
        style={{
          fontSize: 12,
          fontFamily: FONT_SANS,
          color: C.tertiary,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {`${currentPage + 1} / ${pageCount}`}
      </text>
      <IconButton icon="arrowRight" testId="btn-next" onClick={onNextPage} />
    </div>
  )
}
