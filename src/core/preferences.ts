import fs from 'fs'
import path from 'path'
import { miruDir } from './history'

export type ReadingMode = 'single' | 'double' | 'webtoon'
export type ReadingDirection = 'rtl' | 'ltr'
export type FitMode = 'height' | 'width' | 'best'

export interface ReadingPreferences {
  readingMode: ReadingMode
  readingDirection: ReadingDirection
  fitMode: FitMode
  zoom: number
}

export const DEFAULT_PREFERENCES: ReadingPreferences = {
  readingMode: 'single',
  readingDirection: 'rtl',
  fitMode: 'height',
  zoom: 1,
}

const MODES: ReadingMode[] = ['single', 'double', 'webtoon']
const DIRECTIONS: ReadingDirection[] = ['rtl', 'ltr']
const FITS: FitMode[] = ['height', 'width', 'best']

export function clampZoom(zoom: number): number {
  if (!Number.isFinite(zoom)) return 1
  return Math.min(3, Math.max(0.5, zoom))
}

export function cycleMode(mode: ReadingMode): ReadingMode {
  if (mode === 'single') return 'double'
  if (mode === 'double') return 'webtoon'
  return 'single'
}

export function normalizePreferences(raw: unknown): ReadingPreferences {
  const value = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    readingMode: MODES.includes(value.readingMode as ReadingMode)
      ? (value.readingMode as ReadingMode)
      : DEFAULT_PREFERENCES.readingMode,
    readingDirection: DIRECTIONS.includes(value.readingDirection as ReadingDirection)
      ? (value.readingDirection as ReadingDirection)
      : DEFAULT_PREFERENCES.readingDirection,
    fitMode: FITS.includes(value.fitMode as FitMode)
      ? (value.fitMode as FitMode)
      : DEFAULT_PREFERENCES.fitMode,
    zoom: clampZoom(typeof value.zoom === 'number' ? value.zoom : DEFAULT_PREFERENCES.zoom),
  }
}

function preferencesPath(): string {
  return path.join(miruDir(), 'preferences.json')
}

export function loadPreferences(): ReadingPreferences {
  try {
    const file = preferencesPath()
    if (!fs.existsSync(file)) return { ...DEFAULT_PREFERENCES }
    return normalizePreferences(JSON.parse(fs.readFileSync(file, 'utf8')))
  } catch {
    return { ...DEFAULT_PREFERENCES }
  }
}

export function savePreferences(prefs: ReadingPreferences): void {
  try {
    const next = normalizePreferences(prefs)
    fs.writeFileSync(preferencesPath(), JSON.stringify(next, null, 2), 'utf8')
  } catch {
    // ignore write errors
  }
}
