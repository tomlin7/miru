import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import { readImageSize } from './image-size'

function write(name: string, bytes: Buffer | string): string {
  const file = path.join(os.tmpdir(), `miru-size-${name}`)
  fs.writeFileSync(file, bytes as any)
  return file
}

function pngHeader(width: number, height: number): Buffer {
  const buf = Buffer.alloc(24)
  buf.writeUInt32BE(0x89504e47, 0)
  buf.write('IHDR', 12, 'ascii')
  buf.writeUInt32BE(width, 16)
  buf.writeUInt32BE(height, 20)
  return buf
}

function jpegHeader(width: number, height: number): Buffer {
  const buf = Buffer.alloc(30)
  buf[0] = 0xff
  buf[1] = 0xd8
  buf[2] = 0xff
  buf[3] = 0xc0 // start of frame
  buf.writeUInt16BE(17, 4) // the length of the segment
  buf[6] = 8 // the precision
  buf.writeUInt16BE(height, 7)
  buf.writeUInt16BE(width, 9)
  return buf
}

function gifHeader(width: number, height: number): Buffer {
  const buf = Buffer.alloc(16)
  buf.write('GIF89a', 0, 'ascii')
  buf.writeUInt16LE(width, 6)
  buf.writeUInt16LE(height, 8)
  return buf
}

function bmpHeader(width: number, height: number): Buffer {
  const buf = Buffer.alloc(30)
  buf.write('BM', 0, 'ascii')
  buf.writeInt32LE(width, 18)
  buf.writeInt32LE(-height, 22) // a negative height means the rows run upwards
  return buf
}

function webpHeader(width: number, height: number): Buffer {
  const buf = Buffer.alloc(32)
  buf.write('RIFF', 0, 'ascii')
  buf.write('WEBP', 8, 'ascii')
  buf.write('VP8 ', 12, 'ascii')
  buf[23] = 0x9d
  buf[24] = 0x01
  buf[25] = 0x2a
  buf.writeUInt16LE(width, 26)
  buf.writeUInt16LE(height, 28)
  return buf
}

describe('readImageSize', () => {
  it('reads a PNG header', () => {
    expect(readImageSize(write('a.png', pngHeader(800, 1200)))).toEqual({ width: 800, height: 1200 })
  })

  it('reads a JPEG header', () => {
    expect(readImageSize(write('a.jpg', jpegHeader(1654, 2339)))).toEqual({
      width: 1654,
      height: 2339,
    })
  })

  it('reads a GIF header', () => {
    expect(readImageSize(write('a.gif', gifHeader(640, 480)))).toEqual({ width: 640, height: 480 })
  })

  it('reads a BMP header, including an upside down one', () => {
    expect(readImageSize(write('a.bmp', bmpHeader(320, 200)))).toEqual({ width: 320, height: 200 })
  })

  it('reads a WebP header', () => {
    expect(readImageSize(write('a.webp', webpHeader(1024, 768)))).toEqual({ width: 1024, height: 768 })
  })

  it('reads an SVG root', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1200" width="800" height="1200">'
    expect(readImageSize(write('a.svg', svg))).toEqual({ width: 800, height: 1200 })
  })

  it('falls back to the view box of an SVG without a size', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">'
    expect(readImageSize(write('b.svg', svg))).toEqual({ width: 100, height: 200 })
  })

  it('returns null for a file it cannot read', () => {
    expect(readImageSize(write('a.bin', Buffer.from('not an image at all')))).toBe(null)
  })
})
