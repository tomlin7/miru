import React from 'react'
import { Button, useGpuix } from '@gpuix/react'
import type { HistoryItem } from '../core/history'
import { Icon } from './Icons'
import { C, FONT_SANS, IconButton } from '../theme'

export interface LibraryProps {
  history: HistoryItem[]
  onOpenComic: (filePath: string) => void
  onOpenSample: () => void
  onRemoveHistory: (filePath: string) => void
}

export function Library({
  history,
  onOpenComic,
  onOpenSample,
  onRemoveHistory,
}: LibraryProps) {
  const { renderer } = useGpuix()

  const handleBrowseFiles = async () => {
    try {
      if (!renderer?.promptForPaths) return
      const paths = await renderer.promptForPaths({
        files: true,
        directories: false,
        multiple: false,
        prompt: 'Open CBZ Comic',
      })
      if (paths && paths.length > 0 && paths[0]) {
        onOpenComic(paths[0])
      }
    } catch {
      // ignore
    }
  }

  return (
    <div
      testId="library-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        height: '100%',
        overflowY: 'scroll',
        backgroundColor: C.canvas,
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 36,
        paddingBottom: 48,
      }}
    >
      {/* Hero Welcome Card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 820,
          backgroundColor: C.raised,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: C.borderStrong,
          paddingTop: 36,
          paddingBottom: 36,
          paddingLeft: 36,
          paddingRight: 36,
          boxShadow: {
            offsetX: 0,
            offsetY: 8,
            blurRadius: 24,
            spreadRadius: 0,
            color: '#00000040',
          },
        }}
      >
        {/* Brand Icon / Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              backgroundColor: C.accent,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: 7,
            }}
          >
            <text
              style={{
                fontSize: 22,
                fontWeight: 800,
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
              fontSize: 24,
              fontWeight: 700,
              fontFamily: FONT_SANS,
              color: C.text,
              whiteSpace: 'nowrap',
            }}
          >
            {`見る · CBZ Reader`}
          </text>
        </div>

        <text
          style={{
            fontSize: 14,
            fontFamily: FONT_SANS,
            color: C.secondary,
            marginBottom: 28,
            whiteSpace: 'nowrap',
          }}
        >
          {`Fast, GPU-accelerated comic book and manga reader built with GPUIX`}
        </text>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <Button
            onClick={handleBrowseFiles}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              height: 38,
              paddingLeft: 18,
              paddingRight: 18,
              backgroundColor: C.accent,
              borderRadius: 7,
              cursor: 'pointer',
              hover: { backgroundColor: C.accentHover },
            }}
          >
            <Icon name="folder" size={15} color="#FFFFFF" />
            <text
              style={{
                fontSize: 13,
                fontWeight: 600,
                fontFamily: FONT_SANS,
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              {`Open .CBZ Archive`}
            </text>
          </Button>

          <Button
            testId="btn-open-sample"
            onClick={onOpenSample}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              height: 38,
              paddingLeft: 16,
              paddingRight: 16,
              backgroundColor: C.sidebar,
              borderRadius: 7,
              borderWidth: 1,
              borderColor: C.borderStrong,
              cursor: 'pointer',
              hover: { backgroundColor: C.overlayStrong },
            }}
          >
            <Icon name="sparkle" size={14} color={C.accent} />
            <text
              style={{
                fontSize: 13,
                fontWeight: 600,
                fontFamily: FONT_SANS,
                color: C.text,
                whiteSpace: 'nowrap',
              }}
            >
              {`Read Sample Manga`}
            </text>
          </Button>
        </div>
      </div>

      {/* Recent Reading Shelf */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 820,
          marginTop: 32,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="history" size={15} color={C.accent} />
            <text
              style={{
                fontSize: 15,
                fontWeight: 600,
                fontFamily: FONT_SANS,
                color: C.text,
                whiteSpace: 'nowrap',
              }}
            >
              {`Recent Comics`}
            </text>
          </div>
          <text
            style={{
              fontSize: 12,
              fontFamily: FONT_SANS,
              color: C.tertiary,
              whiteSpace: 'nowrap',
            }}
          >
            {`${history.length} items`}
          </text>
        </div>

        {history.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 40,
              paddingBottom: 40,
              paddingLeft: 20,
              paddingRight: 20,
              backgroundColor: C.raised,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <Icon name="singlePage" size={32} color={C.ghost} />
            <text
              style={{
                fontSize: 13,
                fontFamily: FONT_SANS,
                color: C.tertiary,
                marginTop: 10,
                whiteSpace: 'nowrap',
              }}
            >
              {`No recent comics. Open a .cbz file or explore the sample comic.`}
            </text>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {history.map((item) => {
              const progressPct =
                item.pageCount > 0 ? Math.round(((item.currentPage + 1) / item.pageCount) * 100) : 0
              return (
                <div
                  key={item.filePath}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 12,
                    paddingRight: 12,
                    backgroundColor: C.raised,
                    borderRadius: 9,
                    borderWidth: 1,
                    borderColor: C.border,
                  }}
                >
                  {/* Left: Thumbnail & Details */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      flexGrow: 1,
                      overflow: 'hidden',
                    }}
                  >
                    {item.coverPath && (
                      <div
                        style={{
                          width: 42,
                          height: 58,
                          backgroundColor: C.canvas,
                          borderRadius: 4,
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
                    )}

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
                          fontSize: 13,
                          fontWeight: 600,
                          fontFamily: FONT_SANS,
                          color: C.text,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.title}
                      </text>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <text
                          style={{
                            fontSize: 11,
                            fontFamily: FONT_SANS,
                            color: C.tertiary,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {`Page ${item.currentPage + 1} of ${item.pageCount} (${progressPct}%)`}
                        </text>
                        <div
                          style={{
                            width: 90,
                            height: 4,
                            backgroundColor: C.overlayStrong,
                            borderRadius: 2,
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${progressPct}%`,
                              height: '100%',
                              backgroundColor: C.accent,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    <Button
                      onClick={() => onOpenComic(item.filePath)}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        height: 28,
                        paddingLeft: 10,
                        paddingRight: 10,
                        backgroundColor: C.overlay,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: C.borderStrong,
                        cursor: 'pointer',
                        hover: { backgroundColor: C.overlayStrong },
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
                        {`Resume`}
                      </text>
                      <Icon name="arrowRight" size={12} color={C.secondary} />
                    </Button>

                    <IconButton
                      icon="trash"
                      size={12}
                      tooltip="Remove from History"
                      onClick={() => onRemoveHistory(item.filePath)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Cheatsheet */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 820,
          marginTop: 32,
          backgroundColor: C.raised,
          borderRadius: 12,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 18,
          paddingRight: 18,
          borderWidth: 1,
          borderColor: C.border,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Icon name="info" size={13} color={C.tertiary} />
          <text
            style={{
              fontSize: 12,
              fontWeight: 600,
              fontFamily: FONT_SANS,
              color: C.secondary,
              whiteSpace: 'nowrap',
            }}
          >
            {`Keyboard Shortcuts`}
          </text>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                backgroundColor: C.composer,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <text style={{ fontSize: 11, fontFamily: FONT_SANS, color: C.text, whiteSpace: 'nowrap' }}>{`← / → or J / K`}</text>
            </div>
            <text style={{ fontSize: 11, fontFamily: FONT_SANS, color: C.tertiary, whiteSpace: 'nowrap' }}>{`Turn Page`}</text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                backgroundColor: C.composer,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <text style={{ fontSize: 11, fontFamily: FONT_SANS, color: C.text, whiteSpace: 'nowrap' }}>{`Space`}</text>
            </div>
            <text style={{ fontSize: 11, fontFamily: FONT_SANS, color: C.tertiary, whiteSpace: 'nowrap' }}>{`Next Page`}</text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                backgroundColor: C.composer,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <text style={{ fontSize: 11, fontFamily: FONT_SANS, color: C.text, whiteSpace: 'nowrap' }}>{`M`}</text>
            </div>
            <text style={{ fontSize: 11, fontFamily: FONT_SANS, color: C.tertiary, whiteSpace: 'nowrap' }}>{`Switch Mode (Single / Spread / Webtoon)`}</text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                backgroundColor: C.composer,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <text style={{ fontSize: 11, fontFamily: FONT_SANS, color: C.text, whiteSpace: 'nowrap' }}>{`D`}</text>
            </div>
            <text style={{ fontSize: 11, fontFamily: FONT_SANS, color: C.tertiary, whiteSpace: 'nowrap' }}>{`Toggle RTL / LTR`}</text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                backgroundColor: C.composer,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <text style={{ fontSize: 11, fontFamily: FONT_SANS, color: C.text, whiteSpace: 'nowrap' }}>{`T`}</text>
            </div>
            <text style={{ fontSize: 11, fontFamily: FONT_SANS, color: C.tertiary, whiteSpace: 'nowrap' }}>{`Thumbnails Drawer`}</text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                backgroundColor: C.composer,
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <text style={{ fontSize: 11, fontFamily: FONT_SANS, color: C.text, whiteSpace: 'nowrap' }}>{`F / F11`}</text>
            </div>
            <text style={{ fontSize: 11, fontFamily: FONT_SANS, color: C.tertiary, whiteSpace: 'nowrap' }}>{`Fullscreen`}</text>
          </div>
        </div>
      </div>
    </div>
  )
}
