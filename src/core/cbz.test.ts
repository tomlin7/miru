import { describe, expect, it } from 'vitest'
import { isImageFile, naturalCompare, openCbz, parseComicInfoXml } from './cbz'
import { createSampleMangaCbz } from './sample'

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
})
