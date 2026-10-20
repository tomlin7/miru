import fs from 'fs'
import path from 'path'
import os from 'os'

export interface HistoryItem {
  filePath: string
  title: string
  series?: string
  issue?: string
  coverPath?: string
  currentPage: number
  pageCount: number
  lastReadAt: number
  readingMode: 'single' | 'double' | 'webtoon'
  readingDirection: 'rtl' | 'ltr'
}

function getHistoryFilePath(): string {
  const home = os.homedir()
  const dir = path.join(home, '.miru')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return path.join(dir, 'history.json')
}

export function loadHistory(): HistoryItem[] {
  try {
    const file = getHistoryFilePath()
    if (!fs.existsSync(file)) return []
    const content = fs.readFileSync(file, 'utf8')
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item && typeof item.filePath === 'string')
    }
    return []
  } catch {
    return []
  }
}

export function saveHistoryItem(item: HistoryItem): void {
  try {
    const list = loadHistory()
    const existingIndex = list.findIndex((i) => i.filePath === item.filePath)
    if (existingIndex >= 0) {
      list.splice(existingIndex, 1)
    }
    list.unshift(item)
    // keep up to 30 items
    const trimmed = list.slice(0, 30)
    fs.writeFileSync(getHistoryFilePath(), JSON.stringify(trimmed, null, 2), 'utf8')
  } catch {
    // ignore write errors
  }
}

export function removeHistoryItem(filePath: string): void {
  try {
    const list = loadHistory().filter((i) => i.filePath !== filePath)
    fs.writeFileSync(getHistoryFilePath(), JSON.stringify(list, null, 2), 'utf8')
  } catch {
    // ignore write errors
  }
}

export function clearHistory(): void {
  try {
    const file = getHistoryFilePath()
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    }
  } catch {
    // ignore
  }
}
