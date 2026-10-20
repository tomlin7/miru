import React from 'react'
import { Button, useGpuix } from '@gpuix/react'
import { Icon } from './Icons'

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
  currentPage,
  pageCount,
  onPageChange,
  onPrevPage,
  onNextPage,
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
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: '#16161EEE',
          borderBottomWidth: 1,
          borderColor: '#262636',
          boxShadow: { offsetX: 0, offsetY: 4, blurRadius: 16, spreadRadius: 0, color: '#00000066' },
        }}
      >
        {/* Left: Reading Mode options */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1E1E2A',
            borderRadius: 8,
            paddingTop: 3,
            paddingBottom: 3,
            paddingLeft: 3,
            paddingRight: 3,
            gap: 2,
            borderWidth: 1,
            borderColor: '#2D2D40',
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
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: 6,
              backgroundColor: readingMode === 'single' ? '#FF5C00' : 'transparent',
              cursor: 'pointer',
              hover: { backgroundColor: readingMode === 'single' ? '#FF5C00' : '#2A2A3C' },
            }}
          >
            <Icon
              name="singlePage"
              size={14}
              color={readingMode === 'single' ? '#FFFFFF' : '#9E9EB2'}
            />
            <text
              style={{
                fontSize: 12,
                fontWeight: readingMode === 'single' ? '700' : '500',
                color: readingMode === 'single' ? '#FFFFFF' : '#9E9EB2',
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
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: 6,
              backgroundColor: readingMode === 'double' ? '#FF5C00' : 'transparent',
              cursor: 'pointer',
              hover: { backgroundColor: readingMode === 'double' ? '#FF5C00' : '#2A2A3C' },
            }}
          >
            <Icon
              name="doublePage"
              size={14}
              color={readingMode === 'double' ? '#FFFFFF' : '#9E9EB2'}
            />
            <text
              style={{
                fontSize: 12,
                fontWeight: readingMode === 'double' ? '700' : '500',
                color: readingMode === 'double' ? '#FFFFFF' : '#9E9EB2',
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
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: 6,
              backgroundColor: readingMode === 'webtoon' ? '#FF5C00' : 'transparent',
              cursor: 'pointer',
              hover: { backgroundColor: readingMode === 'webtoon' ? '#FF5C00' : '#2A2A3C' },
            }}
          >
            <Icon
              name="webtoon"
              size={14}
              color={readingMode === 'webtoon' ? '#FFFFFF' : '#9E9EB2'}
            />
            <text
              style={{
                fontSize: 12,
                fontWeight: readingMode === 'webtoon' ? '700' : '500',
                color: readingMode === 'webtoon' ? '#FFFFFF' : '#9E9EB2',
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
            gap: 12,
          }}
        >
          {/* Direction toggle */}
          {readingMode !== 'webtoon' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#1E1E2A',
                borderRadius: 8,
                paddingTop: 3,
                paddingBottom: 3,
                paddingLeft: 3,
                paddingRight: 3,
                gap: 2,
                borderWidth: 1,
                borderColor: '#2D2D40',
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
                  borderRadius: 6,
                  backgroundColor: readingDirection === 'rtl' ? '#323246' : 'transparent',
                  cursor: 'pointer',
                  hover: { backgroundColor: '#3A3A52' },
                }}
              >
                <Icon
                  name="directionRtl"
                  size={14}
                  color={readingDirection === 'rtl' ? '#FF9E66' : '#8E8EA0'}
                />
                <text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: readingDirection === 'rtl' ? '#FFFFFF' : '#8E8EA0',
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
                  borderRadius: 6,
                  backgroundColor: readingDirection === 'ltr' ? '#323246' : 'transparent',
                  cursor: 'pointer',
                  hover: { backgroundColor: '#3A3A52' },
                }}
              >
                <Icon
                  name="directionLtr"
                  size={14}
                  color={readingDirection === 'ltr' ? '#FF9E66' : '#8E8EA0'}
                />
                <text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: readingDirection === 'ltr' ? '#FFFFFF' : '#8E8EA0',
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
              backgroundColor: '#1E1E2A',
              borderRadius: 8,
              paddingTop: 3,
              paddingBottom: 3,
              paddingLeft: 3,
              paddingRight: 3,
              gap: 2,
              borderWidth: 1,
              borderColor: '#2D2D40',
            }}
          >
            <Button
              onClick={() => onChangeFitMode('height')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
                borderRadius: 6,
                backgroundColor: fitMode === 'height' ? '#323246' : 'transparent',
                cursor: 'pointer',
                hover: { backgroundColor: '#3A3A52' },
              }}
            >
              <Icon
                name="fitHeight"
                size={14}
                color={fitMode === 'height' ? '#FF9E66' : '#8E8EA0'}
              />
            </Button>

            <Button
              onClick={() => onChangeFitMode('width')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
                borderRadius: 6,
                backgroundColor: fitMode === 'width' ? '#323246' : 'transparent',
                cursor: 'pointer',
                hover: { backgroundColor: '#3A3A52' },
              }}
            >
              <Icon
                name="fitWidth"
                size={14}
                color={fitMode === 'width' ? '#FF9E66' : '#8E8EA0'}
              />
            </Button>

            <Button
              onClick={() => onChangeFitMode('best')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
                borderRadius: 6,
                backgroundColor: fitMode === 'best' ? '#323246' : 'transparent',
                cursor: 'pointer',
                hover: { backgroundColor: '#3A3A52' },
              }}
            >
              <Icon
                name="fitWindow"
                size={14}
                color={fitMode === 'best' ? '#FF9E66' : '#8E8EA0'}
              />
            </Button>
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
              backgroundColor: '#1E1E2A',
              borderRadius: 8,
              paddingTop: 2,
              paddingBottom: 2,
              paddingLeft: 2,
              paddingRight: 2,
              gap: 2,
              borderWidth: 1,
              borderColor: '#2D2D40',
            }}
          >
            <Button
              onClick={onZoomOut}
              style={{
                width: 26,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                borderRadius: 4,
                cursor: 'pointer',
                hover: { backgroundColor: '#2E2E40' },
              }}
            >
              <Icon name="zoomOut" size={13} color="#9E9EB2" />
            </Button>

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
                hover: { backgroundColor: '#2E2E40' },
              }}
            >
              <text style={{ fontSize: 11, fontWeight: '600', color: '#D0D0E2', whiteSpace: 'nowrap' }}>
                {`${Math.round(zoom * 100)}%`}
              </text>
            </Button>

            <Button
              onClick={onZoomIn}
              style={{
                width: 26,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                borderRadius: 4,
                cursor: 'pointer',
                hover: { backgroundColor: '#2E2E40' },
              }}
            >
              <Icon name="zoomIn" size={13} color="#9E9EB2" />
            </Button>
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
              backgroundColor: isThumbnailsOpen ? '#FF5C00' : '#1E1E2A',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#2D2D40',
              cursor: 'pointer',
              hover: { backgroundColor: isThumbnailsOpen ? '#FF5C00' : '#2C2C3E' },
            }}
          >
            <Icon
              name="thumbnails"
              size={13}
              color={isThumbnailsOpen ? '#FFFFFF' : '#A0A0B8'}
            />
            <text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: isThumbnailsOpen ? '#FFFFFF' : '#D0D0E2',
                whiteSpace: 'nowrap',
              }}
            >
              {`Pages`}
            </text>
          </Button>

          {/* Fullscreen button */}
          <Button
            onClick={() => renderer?.toggleFullscreen?.()}
            style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1E1E2A',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#2D2D40',
              cursor: 'pointer',
              hover: { backgroundColor: '#2C2C3E' },
            }}
          >
            <Icon name="fullscreen" size={14} color="#A0A0B8" />
          </Button>
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
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#14141CEE',
        borderTopWidth: 1,
        borderColor: '#222230',
        boxShadow: { offsetX: 0, offsetY: -4, blurRadius: 16, spreadRadius: 0, color: '#00000066' },
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
          height: 30,
          paddingLeft: 12,
          paddingRight: 12,
          backgroundColor: '#1E1E2A',
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#2C2C3C',
          cursor: 'pointer',
          hover: { backgroundColor: '#2B2B3C' },
        }}
      >
        <Icon name="arrowLeft" size={14} color="#E0E0EE" />
        <text style={{ fontSize: 12, fontWeight: '600', color: '#E0E0EE', whiteSpace: 'nowrap' }}>
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
            height: 6,
            backgroundColor: '#262636',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pageCount > 0 ? ((currentPage + 1) / pageCount) * 100 : 0}%`,
              backgroundColor: '#FF5C00',
              borderRadius: 3,
            }}
          />
        </div>

        {/* Current page badge */}
        <div
          style={{
            backgroundColor: '#222230',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 3,
            paddingBottom: 3,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#303044',
          }}
        >
          <text
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: '#FFFFFF',
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
          height: 30,
          paddingLeft: 12,
          paddingRight: 12,
          backgroundColor: '#1E1E2A',
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#2C2C3C',
          cursor: 'pointer',
          hover: { backgroundColor: '#2B2B3C' },
        }}
      >
        <text style={{ fontSize: 12, fontWeight: '600', color: '#E0E0EE', whiteSpace: 'nowrap' }}>
          {`Next`}
        </text>
        <Icon name="arrowRight" size={14} color="#E0E0EE" />
      </Button>
    </div>
  )
}
