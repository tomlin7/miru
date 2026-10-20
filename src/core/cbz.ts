import fs from 'fs'
import path from 'path'
import os from 'os'
import AdmZip from 'adm-zip'

export interface ComicInfo {
  title?: string
  series?: string
  number?: string
  summary?: string
  writer?: string
  penciller?: string
  pageCount?: number
}

export interface ComicPage {
  index: number
  entryName: string
  cachedPath: string
  width?: number
  height?: number
}

export interface ComicBook {
  filePath: string
  title: string
  series?: string
  issue?: string
  summary?: string
  pageCount: number
  pages: ComicPage[]
  coverPath: string
  cacheDir: string
}

/**
 * Natural sort comparator for filenames (e.g. "page 2" before "page 10").
 */
export function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

const SUPPORTED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.avif',
  '.bmp',
  '.svg',
])

export function isImageFile(entryName: string): boolean {
  if (entryName.startsWith('__MACOSX') || entryName.includes('/.') || entryName.startsWith('.')) {
    return false
  }
  const ext = path.extname(entryName).toLowerCase()
  return SUPPORTED_EXTENSIONS.has(ext)
}

/**
 * Lightweight ComicInfo.xml metadata parser
 */
export function parseComicInfoXml(xmlText: string): ComicInfo {
  const getTag = (tag: string): string | undefined => {
    const match = xmlText.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
    return match ? match[1].trim() : undefined
  }

  const pageCountStr = getTag('PageCount')
  const pageCount = pageCountStr ? parseInt(pageCountStr, 10) : undefined

  return {
    title: getTag('Title'),
    series: getTag('Series'),
    number: getTag('Number'),
    summary: getTag('Summary') ?? getTag('Notes'),
    writer: getTag('Writer'),
    penciller: getTag('Penciller'),
    pageCount: isNaN(pageCount as number) ? undefined : pageCount,
  }
}

/**
 * Creates a unique safe cache directory for a comic file
 */
export function getComicCacheDir(comicFilePath: string): string {
  const baseName = path.basename(comicFilePath, path.extname(comicFilePath))
  const sanitized = baseName.replace(/[^a-zA-Z0-9_-]/g, '_')
  const hash = Buffer.from(comicFilePath).toString('hex').slice(0, 8)
  const cacheDir = path.join(os.tmpdir(), 'miru-cache', `${sanitized}_${hash}`)
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true })
  }
  return cacheDir
}

/**
 * Opens and extracts a .cbz archive
 */
export function openCbz(comicFilePath: string): ComicBook {
  if (!fs.existsSync(comicFilePath)) {
    throw new Error(`Comic file not found: ${comicFilePath}`)
  }

  const zip = new AdmZip(comicFilePath)
  const entries = zip.getEntries()

  // Look for ComicInfo.xml
  let comicInfo: ComicInfo = {}
  const infoEntry = entries.find((e) => e.entryName.toLowerCase().endsWith('comicinfo.xml'))
  if (infoEntry) {
    try {
      const xml = infoEntry.getData().toString('utf8')
      comicInfo = parseComicInfoXml(xml)
    } catch {
      // ignore XML parse error
    }
  }

  // Filter image files
  const imageEntries = entries
    .filter((e) => !e.isDirectory && isImageFile(e.entryName))
    .sort((a, b) => naturalCompare(a.entryName, b.entryName))

  if (imageEntries.length === 0) {
    throw new Error('No supported image pages found in CBZ archive.')
  }

  const cacheDir = getComicCacheDir(comicFilePath)

  // Extract all pages to cache directory
  const pages: ComicPage[] = imageEntries.map((entry, index) => {
    const ext = path.extname(entry.entryName).toLowerCase() || '.jpg'
    const cachedFileName = `page_${String(index + 1).padStart(4, '0')}${ext}`
    const cachedPath = path.join(cacheDir, cachedFileName)

    // Only write if not already cached
    if (!fs.existsSync(cachedPath)) {
      const data = entry.getData()
      fs.writeFileSync(cachedPath, data)
    }

    return {
      index,
      entryName: entry.entryName,
      cachedPath,
    }
  })

  const filenameWithoutExt = path.basename(comicFilePath, path.extname(comicFilePath))
  const title = comicInfo.title || comicInfo.series || filenameWithoutExt

  return {
    filePath: comicFilePath,
    title,
    series: comicInfo.series,
    issue: comicInfo.number,
    summary: comicInfo.summary,
    pageCount: pages.length,
    pages,
    coverPath: pages[0]?.cachedPath || '',
    cacheDir,
  }
}
