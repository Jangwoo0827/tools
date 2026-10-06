import { describe, expect, it } from 'vitest'
import type { PickedElement } from '@/shared/messages'
import { describePicked, toClipboardText } from './logic'

const base: PickedElement = {
  selector: 'body > a.btn',
  tag: 'a',
  id: null,
  classes: ['btn'],
  text: 'Click',
  rect: { x: 0, y: 0, width: 100.4, height: 30 },
  styles: {
    color: 'rgb(0, 0, 0)',
    backgroundColor: 'rgb(255, 255, 255)',
    fontFamily: 'Arial',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
  },
  pageUrl: 'https://example.com',
}

describe('describePicked', () => {
  it('rounds size and includes class and text', () => {
    const rows = Object.fromEntries(describePicked(base))
    expect(rows.size).toBe('100 × 30')
    expect(rows.class).toBe('btn')
    expect(rows.text).toBe('Click')
    expect(rows.id).toBeUndefined()
  })
  it('includes id when present', () => {
    expect(Object.fromEntries(describePicked({ ...base, id: 'x' })).id).toBe('x')
  })
  it('formats clipboard text one row per line', () => {
    expect(toClipboardText(base).split('\n')[0]).toBe('selector: body > a.btn')
  })
})
