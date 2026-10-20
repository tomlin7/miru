import React from 'react'
import { Button, useGpuix } from '@gpuix/react'
import type { HistoryItem } from '../core/history'
import { Icon } from './Icons'

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
        backgroundColor: '#0E0E12',
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
          backgroundColor: '#15151E',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#242434',
          paddingTop: 36,
          paddingBottom: 36,
          paddingLeft: 36,
          paddingRight: 36,
          boxShadow: {
            offsetX: 0,
            offsetY: 8,
            blurRadius: 32,
            spreadRadius: 0,
            color: '#00000066',
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
              backgroundColor: '#FF5C00',
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: 8,
            }}
          >
            <text
              style={{
                fontSize: 22,
                fontWeight: '900',
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
              fontWeight: '700',
              color: '#EEEEF8',
              whiteSpace: 'nowrap',
            }}
          >
            {`見る · CBZ Reader`}
          </text>
        </div>

        <text
          style={{
            fontSize: 14,
            color: '#8E8EA8',
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
            gap: 16,
          }}
        >
          <Button
            onClick={handleBrowseFiles}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              height: 40,
              paddingLeft: 20,
              paddingRight: 20,
              backgroundColor: '#FF5C00',
              borderRadius: 8,
              cursor: 'pointer',
              hover: { backgroundColor: '#FF701E' },
            }}
          >
            <Icon name="folder" size={16} color="#FFFFFF" />
            <text
              style={{
                fontSize: 14,
                fontWeight: '700',
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
              height: 40,
              paddingLeft: 18,
              paddingRight: 18,
              backgroundColor: '#20202E',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#323246',
              cursor: 'pointer',
              hover: { backgroundColor: '#2B2B3E' },
            }}
          >
            <Icon name="sparkle" size={15} color="#FF9E66" />
            <text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#EEEEF8',
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
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="history" size={16} color="#FF9E66" />
            <text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#EEEEF8',
                whiteSpace: 'nowrap',
              }}
            >
              {`Recent Comics`}
            </text>
          </div>
          <text
            style={{
              fontSize: 12,
              color: '#707088',
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
              backgroundColor: '#13131A',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#262638',
            }}
          >
            <Icon name="singlePage" size={32} color="#444458" />
            <text
              style={{
                fontSize: 14,
                color: '#707088',
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
              gap: 10,
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
                    paddingTop: 12,
                    paddingBottom: 12,
                    paddingLeft: 12,
                    paddingRight: 12,
                    backgroundColor: '#15151E',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#242432',
                  }}
                >
                  {/* Left: Thumbnail & Details */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                      flexGrow: 1,
                      overflow: 'hidden',
                    }}
                  >
                    {item.coverPath && (
                      <div
                        style={{
                          width: 44,
                          height: 60,
                          backgroundColor: '#0A0A0E',
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
                          fontSize: 14,
                          fontWeight: '700',
                          color: '#FFFFFF',
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
                            fontSize: 12,
                            color: '#8E8EA8',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {`Page ${item.currentPage + 1} of ${item.pageCount} (${progressPct}%)`}
                        </text>
                        <div
                          style={{
                            width: 100,
                            height: 4,
                            backgroundColor: '#262636',
                            borderRadius: 2,
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${progressPct}%`,
                              height: '100%',
                              backgroundColor: '#FF5C00',
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
                        height: 30,
                        paddingLeft: 12,
                        paddingRight: 12,
                        backgroundColor: '#25202C',
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: '#362E40',
                        cursor: 'pointer',
                        hover: { backgroundColor: '#342844' },
                      }}
                    >
                      <text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: '#FF9E66',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {`Resume`}
                      </text>
                      <Icon name="arrowRight" size={13} color="#FF9E66" />
                    </Button>

                    <Button
                      onClick={() => onRemoveHistory(item.filePath)}
                      style={{
                        width: 30,
                        height: 30,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                        borderRadius: 6,
                        cursor: 'pointer',
                        hover: { backgroundColor: '#2C1820' },
                      }}
                    >
                      <Icon name="trash" size={13} color="#888898" />
                    </Button>
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
          marginTop: 36,
          backgroundColor: '#121218',
          borderRadius: 12,
          paddingTop: 18,
          paddingBottom: 18,
          paddingLeft: 18,
          paddingRight: 18,
          borderWidth: 1,
          borderColor: '#1F1F2C',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Icon name="info" size={14} color="#707088" />
          <text style={{ fontSize: 13, fontWeight: '700', color: '#B0B0C4', whiteSpace: 'nowrap' }}>
            {`Keyboard Shortcuts`}
          </text>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                backgroundColor: '#1E1E2A',
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#2E2E3E',
              }}
            >
              <text style={{ fontSize: 11, color: '#FFFFFF', whiteSpace: 'nowrap' }}>{`← / → or J / K`}</text>
            </div>
            <text style={{ fontSize: 11, color: '#888898', whiteSpace: 'nowrap' }}>{`Turn Page`}</text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                backgroundColor: '#1E1E2A',
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#2E2E3E',
              }}
            >
              <text style={{ fontSize: 11, color: '#FFFFFF', whiteSpace: 'nowrap' }}>{`Space`}</text>
            </div>
            <text style={{ fontSize: 11, color: '#888898', whiteSpace: 'nowrap' }}>{`Next Page`}</text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                backgroundColor: '#1E1E2A',
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#2E2E3E',
              }}
            >
              <text style={{ fontSize: 11, color: '#FFFFFF', whiteSpace: 'nowrap' }}>{`M`}</text>
            </div>
            <text style={{ fontSize: 11, color: '#888898', whiteSpace: 'nowrap' }}>{`Switch Mode (Single / Spread / Webtoon)`}</text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                backgroundColor: '#1E1E2A',
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#2E2E3E',
              }}
            >
              <text style={{ fontSize: 11, color: '#FFFFFF', whiteSpace: 'nowrap' }}>{`D`}</text>
            </div>
            <text style={{ fontSize: 11, color: '#888898', whiteSpace: 'nowrap' }}>{`Toggle RTL / LTR`}</text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                backgroundColor: '#1E1E2A',
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#2E2E3E',
              }}
            >
              <text style={{ fontSize: 11, color: '#FFFFFF', whiteSpace: 'nowrap' }}>{`T`}</text>
            </div>
            <text style={{ fontSize: 11, color: '#888898', whiteSpace: 'nowrap' }}>{`Thumbnails Drawer`}</text>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                backgroundColor: '#1E1E2A',
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#2E2E3E',
              }}
            >
              <text style={{ fontSize: 11, color: '#FFFFFF', whiteSpace: 'nowrap' }}>{`F / F11`}</text>
            </div>
            <text style={{ fontSize: 11, color: '#888898', whiteSpace: 'nowrap' }}>{`Fullscreen`}</text>
          </div>
        </div>
      </div>
    </div>
  )
}
