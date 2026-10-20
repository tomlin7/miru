import React, { useState } from 'react'
import { Button, useGpuix } from '@gpuix/react'
import { Icon, type IconName } from './Icons'
import { DragSpacer, WindowControls, handleTitlebarMouseDown } from './Titlebar'
import {
  clampZoom,
  type FitMode,
  type ReadingDirection,
  type ReadingMode,
  type ReadingPreferences,
} from '../core/preferences'
import { C, FONT_SANS, IS_DARWIN, TITLEBAR_HEIGHT } from '../theme'

const SECTIONS: { id: string; label: string; icon: IconName }[] = [
  { id: 'reading', label: 'Reading', icon: 'singlePage' },
  { id: 'shortcuts', label: 'Shortcuts', icon: 'info' },
]

const SHORTCUTS: { action: string; keys: string }[] = [
  { action: 'Turn page', keys: 'Left / Right' },
  { action: 'Next or previous page', keys: 'J / K' },
  { action: 'Next page', keys: 'Space' },
  { action: 'First or last page', keys: 'Home / End' },
  { action: 'Cycle layout', keys: 'M' },
  { action: 'Toggle direction', keys: 'D' },
  { action: 'Page list', keys: 'T' },
  { action: 'Fullscreen', keys: 'F' },
  { action: 'Zoom', keys: '+ / -' },
  { action: 'Reset zoom', keys: '0' },
  { action: 'Open settings', keys: 'Comma' },
  { action: 'Close settings', keys: 'Esc' },
]

function CycleValue<T extends string>({
  testId,
  value,
  options,
  onChange,
}: {
  testId: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  const currentLabel = options.find((option) => option.value === value)?.label ?? value
  return (
    <Button
      testId={testId}
      onClick={() => {
        const index = options.findIndex((option) => option.value === value)
        const next = options[(index + 1) % options.length]
        if (next) onChange(next.value)
      }}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: 28,
        paddingLeft: 10,
        paddingRight: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: C.border,
        backgroundColor: C.surfaceHighlight,
        cursor: 'pointer',
        hover: { backgroundColor: C.overlayStrong },
        flexShrink: 0,
      }}
    >
      <text
        style={{
          fontSize: 13,
          fontFamily: FONT_SANS,
          color: C.text,
          whiteSpace: 'nowrap',
        }}
      >
        {currentLabel}
      </text>
      <Icon name="chevronDown" size={10} color={C.tertiary} />
    </Button>
  )
}

function SettingRow({
  title,
  description,
  control,
}: {
  title: string
  description: string
  control: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 18,
        paddingRight: 18,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <text
          style={{
            fontSize: 14,
            fontWeight: 600,
            fontFamily: FONT_SANS,
            color: C.text,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </text>
        <text
          style={{
            fontSize: 13,
            fontFamily: FONT_SANS,
            color: C.secondary,
            maxWidth: 460,
          }}
        >
          {description}
        </text>
      </div>
      {control}
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: C.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: C.cardBorder,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: C.cardBorder }} />
}

export function Settings({
  readingMode,
  readingDirection,
  fitMode,
  zoom,
  onChange,
  onBack,
}: {
  readingMode: ReadingMode
  readingDirection: ReadingDirection
  fitMode: FitMode
  zoom: number
  onChange: (partial: Partial<ReadingPreferences>) => void
  onBack: () => void
}) {
  const [section, setSection] = useState('reading')
  const { renderer } = useGpuix()
  const zoomLabel = `${Math.round(zoom * 100)}%`

  return (
    <div
      testId="settings-view"
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        backgroundColor: C.canvas,
        color: C.text,
        userSelect: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 240,
          flexShrink: 0,
          height: '100%',
          backgroundColor: C.sidebar,
          borderRightWidth: 1,
          borderColor: C.sidebarBorder,
          paddingTop: IS_DARWIN ? 36 : 12,
          paddingLeft: 12,
          paddingRight: 12,
        }}
      >
        <Button
          testId="settings-back"
          onClick={onBack}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            height: 32,
            paddingLeft: 6,
            paddingRight: 10,
            borderRadius: 7,
            cursor: 'pointer',
            hover: { backgroundColor: C.overlay },
            marginBottom: 14,
          }}
        >
          <Icon name="arrowLeft" size={14} color={C.secondary} />
          <text
            style={{
              fontSize: 13,
              fontWeight: 500,
              fontFamily: FONT_SANS,
              color: C.text,
              whiteSpace: 'nowrap',
            }}
          >
            Back
          </text>
        </Button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SECTIONS.map((item) => {
            const active = section === item.id
            return (
              <Button
                key={item.id}
                testId={`settings-section-${item.id}`}
                onClick={() => setSection(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  height: 36,
                  paddingLeft: 10,
                  paddingRight: 10,
                  borderRadius: 7,
                  cursor: 'pointer',
                  backgroundColor: active ? C.surfaceHighlight : '#00000000',
                  hover: { backgroundColor: active ? C.surfaceHighlight : C.item },
                }}
              >
                <Icon name={item.icon} size={15} color={active ? C.text : C.secondary} />
                <text
                  style={{
                    fontSize: 13,
                    fontWeight: active ? 500 : 400,
                    fontFamily: FONT_SANS,
                    color: active ? C.text : C.secondary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </text>
              </Button>
            )
          })}
        </div>

        <div
          style={{ flexGrow: 1 }}
          onMouseDown={(e: any) => handleTitlebarMouseDown(renderer, e)}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minWidth: 0,
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: TITLEBAR_HEIGHT,
            flexShrink: 0,
            paddingRight: 8,
          }}
        >
          <DragSpacer />
          <WindowControls />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minHeight: 0,
            overflowY: 'scroll',
            paddingTop: 4,
            paddingLeft: 44,
            paddingRight: 44,
            paddingBottom: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: 720,
              gap: 14,
            }}
          >
            {section === 'reading' ? (
              <>
                <text
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    fontFamily: FONT_SANS,
                    color: C.text,
                    marginBottom: 10,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Reading
                </text>
                <Card>
                  <SettingRow
                    title="Layout"
                    description="Single page, two-page spread, or a continuous strip."
                    control={
                      <CycleValue
                        testId="settings-mode"
                        value={readingMode}
                        options={[
                          { value: 'single', label: 'Single' },
                          { value: 'double', label: 'Spread' },
                          { value: 'webtoon', label: 'Webtoon' },
                        ]}
                        onChange={(value) => onChange({ readingMode: value })}
                      />
                    }
                  />
                  <Divider />
                  <SettingRow
                    title="Direction"
                    description="Right to left for manga. Left to right for comics."
                    control={
                      <CycleValue
                        testId="settings-direction"
                        value={readingDirection}
                        options={[
                          { value: 'rtl', label: 'Right to left' },
                          { value: 'ltr', label: 'Left to right' },
                        ]}
                        onChange={(value) => onChange({ readingDirection: value })}
                      />
                    }
                  />
                  <Divider />
                  <SettingRow
                    title="Fit"
                    description="How each page meets the window."
                    control={
                      <CycleValue
                        testId="settings-fit"
                        value={fitMode}
                        options={[
                          { value: 'height', label: 'Height' },
                          { value: 'width', label: 'Width' },
                          { value: 'best', label: 'Window' },
                        ]}
                        onChange={(value) => onChange({ fitMode: value })}
                      />
                    }
                  />
                  <Divider />
                  <SettingRow
                    title="Zoom"
                    description="Scale on top of fit. The plus and minus keys change this too."
                    control={
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          height: 28,
                          borderRadius: 6,
                          borderWidth: 1,
                          borderColor: C.border,
                          backgroundColor: C.surfaceHighlight,
                          flexShrink: 0,
                        }}
                      >
                        <Button
                          testId="settings-zoom-out"
                          onClick={() => onChange({ zoom: clampZoom(zoom - 0.15) })}
                          style={{
                            width: 28,
                            height: 26,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            borderRadius: 6,
                            hover: { backgroundColor: C.overlay },
                          }}
                        >
                          <Icon name="zoomOut" size={13} color={C.secondary} />
                        </Button>
                        <Button
                          testId="settings-zoom-reset"
                          onClick={() => onChange({ zoom: 1 })}
                          style={{
                            height: 26,
                            paddingLeft: 6,
                            paddingRight: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            borderRadius: 4,
                            hover: { backgroundColor: C.overlay },
                          }}
                        >
                          <text
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              fontFamily: FONT_SANS,
                              color: C.secondary,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {zoomLabel}
                          </text>
                        </Button>
                        <Button
                          testId="settings-zoom-in"
                          onClick={() => onChange({ zoom: clampZoom(zoom + 0.15) })}
                          style={{
                            width: 28,
                            height: 26,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            borderRadius: 6,
                            hover: { backgroundColor: C.overlay },
                          }}
                        >
                          <Icon name="zoomIn" size={13} color={C.secondary} />
                        </Button>
                      </div>
                    }
                  />
                </Card>
              </>
            ) : (
              <>
                <text
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    fontFamily: FONT_SANS,
                    color: C.text,
                    marginBottom: 10,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Shortcuts
                </text>
                <Card>
                  {SHORTCUTS.map((shortcut, index) => (
                    <div key={shortcut.action} style={{ display: 'flex', flexDirection: 'column' }}>
                      {index > 0 ? <Divider /> : null}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: 14,
                          paddingBottom: 14,
                          paddingLeft: 18,
                          paddingRight: 18,
                          gap: 16,
                        }}
                      >
                        <text
                          style={{
                            fontSize: 13,
                            fontFamily: FONT_SANS,
                            color: C.text,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {shortcut.action}
                        </text>
                        <text
                          style={{
                            fontSize: 12,
                            fontFamily: FONT_SANS,
                            color: C.tertiary,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {shortcut.keys}
                        </text>
                      </div>
                    </div>
                  ))}
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
