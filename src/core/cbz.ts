import fs from 'fs'
import path from 'path'
import os from 'os'
import AdmZip from 'adm-zip'
import { createExtractorFromData } from 'node-unrar-js'
import { readImageSize } from './image-size'

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

export type ArchiveKind = 'zip' | 'rar'

interface ArchiveFile {
  name: string
  data: Buffer
}

/** ZIP local/empty/spanned headers start with PK. RAR starts with Rar!. */
export function detectArchiveKind(bytes: Uint8Array): ArchiveKind | null {
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07)
  ) {
    return 'zip'
  }
  if (
    bytes.length >= 7 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x61 &&
    bytes[2] === 0x72 &&
    bytes[3] === 0x21 &&
    bytes[4] === 0x1a &&
    bytes[5] === 0x07
  ) {
    return 'rar'
  }
  return null
}

function kindForFile(filePath: string, bytes: Uint8Array): ArchiveKind {
  const sniffed = detectArchiveKind(bytes)
  if (sniffed) return sniffed
  const ext = path.extname(filePath).toLowerCase()
  if (ext === '.cbz' || ext === '.zip') return 'zip'
  if (ext === '.cbr' || ext === '.rar') return 'rar'
  throw new Error('Open a .cbz or .cbr file.')
}

function readComicInfo(entries: ArchiveFile[]): ComicInfo {
  const info = entries.find((entry) => entry.name.toLowerCase().endsWith('comicinfo.xml'))
  if (!info) return {}
  try {
    return parseComicInfoXml(info.data.toString('utf8'))
  } catch {
    return {}
  }
}

function comicFromEntries(
  comicFilePath: string,
  entries: ArchiveFile[],
  comicInfo: ComicInfo,
): ComicBook {
  const images = entries
    .filter((entry) => isImageFile(entry.name))
    .sort((a, b) => naturalCompare(a.name, b.name))

  if (images.length === 0) {
    throw new Error('No supported image pages found in this archive.')
  }

  const cacheDir = getComicCacheDir(comicFilePath)
  const pages: ComicPage[] = images.map((entry, index) => {
    const ext = path.extname(entry.name).toLowerCase() || '.jpg'
    const cachedFileName = `page_${String(index + 1).padStart(4, '0')}${ext}`
    const cachedPath = path.join(cacheDir, cachedFileName)
    if (!fs.existsSync(cachedPath)) {
      fs.writeFileSync(cachedPath, entry.data)
    }
    const size = readImageSize(cachedPath)
    return {
      index,
      entryName: entry.name,
      cachedPath,
      width: size?.width,
      height: size?.height,
    }
  })

  const filenameWithoutExt = path.basename(comicFilePath, path.extname(comicFilePath))
  return {
    filePath: comicFilePath,
    title: comicInfo.title || comicInfo.series || filenameWithoutExt,
    series: comicInfo.series,
    issue: comicInfo.number,
    summary: comicInfo.summary,
    pageCount: pages.length,
    pages,
    coverPath: pages[0]?.cachedPath || '',
    cacheDir,
  }
}

function readZipEntries(comicFilePath: string): ArchiveFile[] {
  const zip = new AdmZip(comicFilePath)
  return zip
    .getEntries()
    .filter((entry) => !entry.isDirectory)
    .map((entry) => ({
      name: entry.entryName,
      data: entry.getData(),
    }))
}

async function readRarEntries(bytes: Buffer): Promise<ArchiveFile[]> {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  let extractor
  try {
    extractor = await createExtractorFromData({ data: copy.buffer })
  } catch (err: any) {
    throw new Error(err?.message || 'Could not read this .cbr archive.')
  }
  const extracted = extractor.extract()
  const files: ArchiveFile[] = []
  for (const file of extracted.files) {
    if (file.fileHeader.flags.directory || !file.extraction) continue
    files.push({
      name: file.fileHeader.name,
      data: Buffer.from(file.extraction),
    })
  }
  return files
}

/**
 * Opens and extracts a .cbz archive.
 */
export function openCbz(comicFilePath: string): ComicBook {
  if (!fs.existsSync(comicFilePath)) {
    throw new Error(`Comic file not found: ${comicFilePath}`)
  }
  const entries = readZipEntries(comicFilePath)
  return comicFromEntries(comicFilePath, entries, readComicInfo(entries))
}

/**
 * Opens a .cbz or .cbr archive. The file header wins over the extension,
 * so a mislabeled comic still opens.
 */
export async function openComic(comicFilePath: string): Promise<ComicBook> {
  if (!fs.existsSync(comicFilePath)) {
    throw new Error(`Comic file not found: ${comicFilePath}`)
  }
  const bytes = fs.readFileSync(comicFilePath)
  const kind = kindForFile(comicFilePath, new Uint8Array(bytes))
  if (kind === 'zip') {
    const entries = readZipEntries(comicFilePath)
    return comicFromEntries(comicFilePath, entries, readComicInfo(entries))
  }
  const entries = await readRarEntries(bytes)
  return comicFromEntries(comicFilePath, entries, readComicInfo(entries))
}
