import React from 'react'
import { Button, useGpuix } from '@gpuix/react'
import { Icon } from './Icons'
import { C, FONT_SANS, IconButton } from '../theme'

export type ReadingMode = 'single' | 'double' | 'webtoon'
export type ReadingDirection = 'rtl' | 'ltr'
export type FitMode = 'height' | 'width' | 'best'

export interface ToolbarProps {
  readingMode: ReadingMode
  onChangeReadingMode: (mode: ReadingMode) => void
  readingDirection: ReadingDirection
  onChangeReadingDirection: (dir: ReadingDirection) => void
  fitMode: FitMode
  onChangeFitMode: (fit: FitMode) => void
  zoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  isThumbnailsOpen: boolean
  onToggleThumbnails: () => void
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
  onPrevPage: () => void
  onNextPage: () => void
}

export function Toolbar({
  readingMode,
  onChangeReadingMode,
  readingDirection,
  onChangeReadingDirection,
  fitMode,
  onChangeFitMode,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  isThumbnailsOpen,
  onToggleThumbnails,
}: ToolbarProps) {
  const { renderer } = useGpuix()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        pointerEvents: 'auto',
      }}
    >
      {/* Top Floating Control Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 7,
          paddingBottom: 7,
          backgroundColor: C.composer,
          borderBottomWidth: 1,
          borderColor: C.border,
          boxShadow: {
            offsetX: 0,
            offsetY: 4,
            blurRadius: 16,
            spreadRadius: 0,
            color: '#0000004D',
          },
        }}
      >
        {/* Left: Reading Mode options */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: C.raised,
            borderRadius: 7,
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 2,
            paddingRight: 2,
            gap: 2,
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          <Button
            testId="btn-mode-single"
            onClick={() => onChangeReadingMode('single')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: 5,
              backgroundColor: readingMode === 'single' ? C.accent : 'transparent',
              cursor: 'pointer',
              hover: { backgroundColor: readingMode === 'single' ? C.accent : C.overlay },
            }}
          >
            <Icon
              name="singlePage"
              size={13}
              color={readingMode === 'single' ? '#FFFFFF' : C.secondary}
            />
            <text
              style={{
                fontSize: 12,
                fontWeight: readingMode === 'single' ? 600 : 400,
                fontFamily: FONT_SANS,
                color: readingMode === 'single' ? '#FFFFFF' : C.secondary,
                whiteSpace: 'nowrap',
              }}
            >
              {`Single`}
            </text>
          </Button>

          <Button
            testId="btn-mode-double"
            onClick={() => onChangeReadingMode('double')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: 5,
              backgroundColor: readingMode === 'double' ? C.accent : 'transparent',
              cursor: 'pointer',
              hover: { backgroundColor: readingMode === 'double' ? C.accent : C.overlay },
            }}
          >
            <Icon
              name="doublePage"
              size={13}
              color={readingMode === 'double' ? '#FFFFFF' : C.secondary}
            />
            <text
              style={{
                fontSize: 12,
                fontWeight: readingMode === 'double' ? 600 : 400,
                fontFamily: FONT_SANS,
                color: readingMode === 'double' ? '#FFFFFF' : C.secondary,
                whiteSpace: 'nowrap',
              }}
            >
              {`Spread`}
            </text>
          </Button>

          <Button
            testId="btn-mode-webtoon"
            onClick={() => onChangeReadingMode('webtoon')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              paddingLeft: 9,
              paddingRight: 9,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: 5,
              backgroundColor: readingMode === 'webtoon' ? C.accent : 'transparent',
              cursor: 'pointer',
              hover: { backgroundColor: readingMode === 'webtoon' ? C.accent : C.overlay },
            }}
          >
            <Icon
              name="webtoon"
              size={13}
              color={readingMode === 'webtoon' ? '#FFFFFF' : C.secondary}
            />
            <text
              style={{
                fontSize: 12,
                fontWeight: readingMode === 'webtoon' ? 600 : 400,
                fontFamily: FONT_SANS,
                color: readingMode === 'webtoon' ? '#FFFFFF' : C.secondary,
                whiteSpace: 'nowrap',
              }}
            >
              {`Webtoon`}
            </text>
          </Button>
        </div>

        {/* Center: Reading Direction & Fit Modes */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {/* Direction toggle */}
          {readingMode !== 'webtoon' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: C.raised,
                borderRadius: 7,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 2,
                paddingRight: 2,
                gap: 2,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Button
                onClick={() => onChangeReadingDirection('rtl')}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 4,
                  paddingBottom: 4,
                  borderRadius: 5,
                  backgroundColor: readingDirection === 'rtl' ? C.overlayStrong : 'transparent',
                  cursor: 'pointer',
                  hover: { backgroundColor: C.overlay },
                }}
              >
                <Icon
                  name="directionRtl"
                  size={13}
                  color={readingDirection === 'rtl' ? C.accent : C.tertiary}
                />
                <text
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: FONT_SANS,
                    color: readingDirection === 'rtl' ? C.text : C.tertiary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {`Manga (RTL)`}
                </text>
              </Button>

              <Button
                onClick={() => onChangeReadingDirection('ltr')}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  paddingLeft: 8,
                  paddingRight: 8,
                  paddingTop: 4,
                  paddingBottom: 4,
                  borderRadius: 5,
                  backgroundColor: readingDirection === 'ltr' ? C.overlayStrong : 'transparent',
                  cursor: 'pointer',
                  hover: { backgroundColor: C.overlay },
                }}
              >
                <Icon
                  name="directionLtr"
                  size={13}
                  color={readingDirection === 'ltr' ? C.accent : C.tertiary}
                />
                <text
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: FONT_SANS,
                    color: readingDirection === 'ltr' ? C.text : C.tertiary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {`Comic (LTR)`}
                </text>
              </Button>
            </div>
          )}

          {/* Fit Selector */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: C.raised,
              borderRadius: 7,
              paddingTop: 2,
              paddingBottom: 2,
              paddingLeft: 2,
              paddingRight: 2,
              gap: 2,
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <IconButton
              icon="fitHeight"
              size={13}
              active={fitMode === 'height'}
              tooltip="Fit to Height"
              onClick={() => onChangeFitMode('height')}
            />
            <IconButton
              icon="fitWidth"
              size={13}
              active={fitMode === 'width'}
              tooltip="Fit to Width"
              onClick={() => onChangeFitMode('width')}
            />
            <IconButton
              icon="fitWindow"
              size={13}
              active={fitMode === 'best'}
              tooltip="Best Fit"
              onClick={() => onChangeFitMode('best')}
            />
          </div>
        </div>

        {/* Right: Zoom & Tool Drawer & Fullscreen */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {/* Zoom controls */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: C.raised,
              borderRadius: 7,
              paddingTop: 2,
              paddingBottom: 2,
              paddingLeft: 2,
              paddingRight: 2,
              gap: 2,
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <IconButton icon="zoomOut" size={13} tooltip="Zoom Out (-)" onClick={onZoomOut} />
            <Button
              onClick={onZoomReset}
              style={{
                paddingLeft: 6,
                paddingRight: 6,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                borderRadius: 4,
                cursor: 'pointer',
                hover: { backgroundColor: C.overlay },
              }}
            >
              <text
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: FONT_SANS,
                  color: C.secondary,
                  whiteSpace: 'nowrap',
                }}
              >
                {`${Math.round(zoom * 100)}%`}
              </text>
            </Button>
            <IconButton icon="zoomIn" size={13} tooltip="Zoom In (+)" onClick={onZoomIn} />
          </div>

          {/* Thumbnails toggle */}
          <Button
            testId="btn-thumbnails"
            onClick={onToggleThumbnails}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              height: 28,
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: isThumbnailsOpen ? C.accent : C.raised,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: isThumbnailsOpen ? C.accent : C.border,
              cursor: 'pointer',
              hover: { backgroundColor: isThumbnailsOpen ? C.accent : C.overlayStrong },
            }}
          >
            <Icon
              name="thumbnails"
              size={13}
              color={isThumbnailsOpen ? '#FFFFFF' : C.secondary}
            />
            <text
              style={{
                fontSize: 12,
                fontWeight: 600,
                fontFamily: FONT_SANS,
                color: isThumbnailsOpen ? '#FFFFFF' : C.text,
                whiteSpace: 'nowrap',
              }}
            >
              {`Pages`}
            </text>
          </Button>

          {/* Fullscreen button */}
          <IconButton
            icon="fullscreen"
            size={14}
            tooltip="Toggle Fullscreen (F)"
            onClick={() => renderer?.toggleFullscreen?.()}
          />
        </div>
      </div>
    </div>
  )
}

export function BottomScrubber({
  currentPage,
  pageCount,
  onPrevPage,
  onNextPage,
  onPageChange,
  readingDirection,
}: {
  currentPage: number
  pageCount: number
  onPrevPage: () => void
  onNextPage: () => void
  onPageChange: (page: number) => void
  readingDirection: ReadingDirection
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
        height: 44,
        backgroundColor: C.composer,
        borderTopWidth: 1,
        borderColor: C.border,
        boxShadow: {
          offsetX: 0,
          offsetY: -4,
          blurRadius: 16,
          spreadRadius: 0,
          color: '#0000004D',
        },
        gap: 16,
      }}
    >
      {/* Prev button */}
      <Button
        testId="btn-prev"
        onClick={onPrevPage}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          height: 28,
          paddingLeft: 10,
          paddingRight: 12,
          backgroundColor: C.raised,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: C.border,
          cursor: 'pointer',
          hover: { backgroundColor: C.overlayStrong },
        }}
      >
        <Icon name="arrowLeft" size={13} color={C.secondary} />
        <text
          style={{
            fontSize: 12,
            fontWeight: 500,
            fontFamily: FONT_SANS,
            color: C.text,
            whiteSpace: 'nowrap',
          }}
        >
          {`Prev`}
        </text>
      </Button>

      {/* Progress track */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexGrow: 1,
          gap: 12,
        }}
      >
        <div
          style={{
            flexGrow: 1,
            height: 4,
            backgroundColor: C.overlayStrong,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pageCount > 0 ? ((currentPage + 1) / pageCount) * 100 : 0}%`,
              backgroundColor: C.accent,
              borderRadius: 2,
            }}
          />
        </div>

        {/* Current page badge */}
        <div
          style={{
            backgroundColor: C.raised,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 3,
            paddingBottom: 3,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          <text
            style={{
              fontSize: 11,
              fontWeight: 600,
              fontFamily: FONT_SANS,
              color: C.text,
              whiteSpace: 'nowrap',
            }}
          >
            {`${currentPage + 1} / ${pageCount}`}
          </text>
        </div>
      </div>

      {/* Next button */}
      <Button
        testId="btn-next"
        onClick={onNextPage}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          height: 28,
          paddingLeft: 12,
          paddingRight: 10,
          backgroundColor: C.raised,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: C.border,
          cursor: 'pointer',
          hover: { backgroundColor: C.overlayStrong },
        }}
      >
        <text
          style={{
            fontSize: 12,
            fontWeight: 500,
            fontFamily: FONT_SANS,
            color: C.text,
            whiteSpace: 'nowrap',
          }}
        >
          {`Next`}
        </text>
        <Icon name="arrowRight" size={13} color={C.secondary} />
      </Button>
    </div>
  )
}
