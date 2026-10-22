import fs from 'fs'

/**
 * The size of an image file, read from its header.
 *
 * The reader needs a page's proportions to lay it out: a page that is
 * drawn into a box of the wrong shape is letterboxed, and a zoom around
 * the pointer cannot know where the page actually is. The archive only
 * carries pixels, so the size has to come from the file.
 *
 * Every format Miru opens is covered. A file whose header cannot be read
 * returns null, and the reader falls back to drawing the page at whatever
 * size the layout gives it.
 */

export interface ImageSize {
  width: number
  height: number
}

function u16be(buf: Buffer, at: number): number {
  return buf.readUInt16BE(at)
}

function u16le(buf: Buffer, at: number): number {
  return buf.readUInt16LE(at)
}

function u32be(buf: Buffer, at: number): number {
  return buf.readUInt32BE(at)
}

function u32le(buf: Buffer, at: number): number {
  return buf.readUInt32LE(at)
}

function u24le(buf: Buffer, at: number): number {
  return buf[at] | (buf[at + 1] << 8) | (buf[at + 2] << 16)
}

function pngSize(buf: Buffer): ImageSize | null {
  // 8 byte signature, 4 byte length, "IHDR", then width and height.
  if (buf.length < 24) return null
  if (buf.readUInt32BE(0) !== 0x89504e47) return null
  return { width: u32be(buf, 16), height: u32be(buf, 20) }
}

function jpegSize(buf: Buffer): ImageSize | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null

  let at = 2
  while (at + 9 < buf.length) {
    if (buf[at] !== 0xff) {
      at += 1
      continue
    }
    const marker = buf[at + 1]
    // Standalone markers carry no payload.
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      at += 2
      continue
    }
    const length = u16be(buf, at + 2)
    // Start of frame: the height and width follow the precision byte.
    const isFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
    if (isFrame) {
      return { width: u16be(buf, at + 7), height: u16be(buf, at + 5) }
    }
    at += 2 + length
  }
  return null
}

function gifSize(buf: Buffer): ImageSize | null {
  if (buf.length < 10) return null
  const magic = buf.toString('ascii', 0, 6)
  if (magic !== 'GIF87a' && magic !== 'GIF89a') return null
  return { width: u16le(buf, 6), height: u16le(buf, 8) }
}

function bmpSize(buf: Buffer): ImageSize | null {
  if (buf.length < 26 || buf.toString('ascii', 0, 2) !== 'BM') return null
  // A negative height means the rows run upwards.
  const height = buf.readInt32LE(22)
  return { width: u32le(buf, 18), height: Math.abs(height) }
}

function webpSize(buf: Buffer): ImageSize | null {
  if (buf.length < 30) return null
  if (buf.toString('ascii', 0, 4) !== 'RIFF') return null
  if (buf.toString('ascii', 8, 12) !== 'WEBP') return null

  const chunk = buf.toString('ascii', 12, 16)
  if (chunk === 'VP8 ') {
    // A key frame: 3 bytes of frame tag, 3 bytes of sync code, then the
    // dimensions in 14 bits each.
    if (buf[23] !== 0x9d || buf[24] !== 0x01 || buf[25] !== 0x2a) return null
    return { width: u16le(buf, 26) & 0x3fff, height: u16le(buf, 28) & 0x3fff }
  }
  if (chunk === 'VP8L') {
    if (buf[20] !== 0x2f) return null
    const bits = u32le(buf, 21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  if (chunk === 'VP8X') {
    return { width: u24le(buf, 24) + 1, height: u24le(buf, 27) + 1 }
  }
  return null
}

/** Walk the ISOBMFF boxes of an HEIF file and find the image's extents. */
function heifSize(buf: Buffer): ImageSize | null {
  let at = 0
  while (at + 8 < buf.length) {
    const size = u32be(buf, at)
    const type = buf.toString('ascii', at + 4, at + 8)
    if (size < 8) return null

    if (type === 'ispe') {
      // 4 bytes of version and flags, then the width and the height.
      if (at + 24 > buf.length) return null
      return { width: u32be(buf, at + 16), height: u32be(buf, at + 20) }
    }
    if (type === 'meta') {
      // The meta box carries a full box header before its children.
      const found = heifSize(buf.subarray(at + 12))
      if (found) return found
    }
    if (type === 'iprp' || type === 'ipco') {
      const found = heifSize(buf.subarray(at + 8))
      if (found) return found
    }
    at += size
  }
  return null
}

function svgSize(text: string): ImageSize | null {
  const root = text.match(/<svg[^>]*>/i)
  if (!root) return null
  const tag = root[0]

  const attribute = (name: string): number | null => {
    const match = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, 'i'))
    if (!match) return null
    const value = parseFloat(match[1])
    return Number.isFinite(value) && value > 0 ? value : null
  }

  const width = attribute('width')
  const height = attribute('height')
  if (width && height) return { width, height }

  const viewBox = tag.match(/viewBox\s*=\s*"([^"]*)"/i)
  if (viewBox) {
    const parts = viewBox[1].trim().split(/[\s,]+/).map(Number)
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n)) && parts[2] > 0 && parts[3] > 0) {
      return { width: parts[2], height: parts[3] }
    }
  }
  return null
}

/**
 * The size of an image file, or null when the header cannot be read.
 */
export function readImageSize(filePath: string): ImageSize | null {
  let head: Buffer
  try {
    const handle = fs.openSync(filePath, 'r')
    try {
      head = Buffer.alloc(64 * 1024)
      const read = fs.readSync(handle, head, 0, head.length, 0)
      head = head.subarray(0, read)
    } finally {
      fs.closeSync(handle)
    }
  } catch {
    return null
  }

  if (head.length < 8) return null

  const png = pngSize(head)
  if (png) return png
  const jpeg = jpegSize(head)
  if (jpeg) return jpeg
  const gif = gifSize(head)
  if (gif) return gif
  const bmp = bmpSize(head)
  if (bmp) return bmp
  const webp = webpSize(head)
  if (webp) return webp
  if (head.toString('ascii', 4, 8) === 'ftyp') {
    const heif = heifSize(head)
    if (heif) return heif
  }

  // SVG is text, so it needs a different read.
  try {
    const text = fs.readFileSync(filePath, 'utf8').slice(0, 4096)
    if (/<svg/i.test(text)) return svgSize(text)
  } catch {
    // not text
  }

  return null
}
