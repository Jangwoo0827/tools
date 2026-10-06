import { describe, expect, it } from 'vitest'
import { filterTools } from './search'

const list = [
  { id: 'color-picker', name: 'Color Picker', description: '페이지 색상 추출', keywords: ['eyedropper'] },
  { id: 'font-inspector', name: 'Font Inspector', description: '글꼴 검사' },
]

describe('filterTools', () => {
  it('returns everything for an empty query', () => {
    expect(filterTools(list, '  ')).toHaveLength(2)
  })
  it('matches name case-insensitively', () => {
    expect(filterTools(list, 'FONT').map((t) => t.id)).toEqual(['font-inspector'])
  })
  it('matches Korean description and keywords', () => {
    expect(filterTools(list, '색상').map((t) => t.id)).toEqual(['color-picker'])
    expect(filterTools(list, 'eyedropper').map((t) => t.id)).toEqual(['color-picker'])
  })
  it('requires every token to match', () => {
    expect(filterTools(list, 'color 글꼴')).toEqual([])
  })
})
