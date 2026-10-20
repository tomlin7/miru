import fs from 'fs'
import os from 'os'
import path from 'path'
import { describe, expect, it } from 'vitest'
import { detectArchiveKind, isImageFile, naturalCompare, openCbz, openComic, parseComicInfoXml } from './cbz'
import { createSampleMangaCbz } from './sample'

const cbrFixture = path.join(import.meta.dir, 'fixtures', 'two-pages.cbr')

describe('CBZ Engine', () => {
  it('naturalCompare sorts filenames correctly with numerical awareness', () => {
    const list = ['page-10.jpg', 'page-1.jpg', 'page-2.jpg', 'page-20.jpg']
    const sorted = [...list].sort(naturalCompare)
    expect(sorted).toEqual(['page-1.jpg', 'page-2.jpg', 'page-10.jpg', 'page-20.jpg'])
  })

  it('isImageFile identifies valid images and filters junk', () => {
    expect(isImageFile('01.jpg')).toBe(true)
    expect(isImageFile('cover.png')).toBe(true)
    expect(isImageFile('chapter/page_3.webp')).toBe(true)
    expect(isImageFile('art.svg')).toBe(true)
    expect(isImageFile('__MACOSX/._01.jpg')).toBe(false)
    expect(isImageFile('ComicInfo.xml')).toBe(false)
    expect(isImageFile('.DS_Store')).toBe(false)
  })

  it('parseComicInfoXml extracts comic metadata correctly', () => {
    const xml = `<?xml version="1.0"?>
    <ComicInfo>
      <Title>Akira Vol 1</Title>
      <Series>Akira</Series>
      <Number>1</Number>
      <Summary>Neo-Tokyo is about to explode.</Summary>
      <Writer>Katsuhiro Otomo</Writer>
      <PageCount>120</PageCount>
    </ComicInfo>`
    const info = parseComicInfoXml(xml)
    expect(info.title).toBe('Akira Vol 1')
    expect(info.series).toBe('Akira')
    expect(info.number).toBe('1')
    expect(info.writer).toBe('Katsuhiro Otomo')
    expect(info.pageCount).toBe(120)
  })

  it('createSampleMangaCbz generates a valid .cbz and openCbz extracts pages and metadata', () => {
    const samplePath = createSampleMangaCbz()
    expect(samplePath).toBeDefined()

    const comic = openCbz(samplePath)
    expect(comic.title).toBe('Chronicles of Light: Chapter 1')
    expect(comic.series).toBe('Miru Chronicles (見る年代記)')
    expect(comic.pageCount).toBe(6)
    expect(comic.pages.length).toBe(6)
    expect(comic.coverPath).toBeDefined()
    expect(comic.pages[0].cachedPath).toContain('page_0001')
  })

  it('openComic reads a .cbr archive and sorts pages naturally', async () => {
    const comic = await openComic(cbrFixture)
    expect(comic.title).toBe('Rar Fixture')
    expect(comic.series).toBe('Miru Fixtures')
    expect(comic.issue).toBe('2')
    expect(comic.pageCount).toBe(3)
    expect(comic.pages.map((page) => page.entryName)).toEqual([
      'page-1.png',
      'page-2.png',
      'page-10.png',
    ])
  })

  it('openComic trusts the header when the extension is wrong', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'miru-kind-'))
    const zipAsCbr = path.join(dir, 'mislabeled.cbr')
    const rarAsCbz = path.join(dir, 'mislabeled.cbz')
    fs.copyFileSync(createSampleMangaCbz(), zipAsCbr)
    fs.copyFileSync(cbrFixture, rarAsCbz)

    expect(detectArchiveKind(new Uint8Array(fs.readFileSync(zipAsCbr)))).toBe('zip')
    expect(detectArchiveKind(new Uint8Array(fs.readFileSync(rarAsCbz)))).toBe('rar')

    const fromZip = await openComic(zipAsCbr)
    const fromRar = await openComic(rarAsCbz)
    expect(fromZip.pageCount).toBe(6)
    expect(fromRar.title).toBe('Rar Fixture')
    expect(fromRar.pageCount).toBe(3)
  })

  it('openComic rejects a file that is neither zip nor rar', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'miru-kind-'))
    const textFile = path.join(dir, 'notes.txt')
    fs.writeFileSync(textFile, 'not a comic')
    await expect(openComic(textFile)).rejects.toThrow('Open a .cbz or .cbr file.')
  })
})
