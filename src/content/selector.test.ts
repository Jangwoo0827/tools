import { describe, expect, it } from 'vitest'
import { buildSelector, type ChainNode } from './selector'

const n = (p: Partial<ChainNode> & { tag: string }): ChainNode => ({
  id: null,
  classes: [],
  nthOfType: 1,
  siblingsOfType: 1,
  ...p,
})

describe('buildSelector', () => {
  it('stops at the nearest id', () => {
    const chain = [n({ tag: 'span' }), n({ tag: 'div', id: 'app' }), n({ tag: 'body' })]
    expect(buildSelector(chain)).toBe('#app > span')
  })

  it('uses classes, limited to maxClasses', () => {
    const chain = [n({ tag: 'a', classes: ['btn', 'primary', 'big'] }), n({ tag: 'body' })]
    expect(buildSelector(chain)).toBe('body > a.btn.primary')
  })

  it('falls back to nth-of-type when ambiguous', () => {
    const chain = [n({ tag: 'li', nthOfType: 3, siblingsOfType: 5 }), n({ tag: 'ul' }), n({ tag: 'body' })]
    expect(buildSelector(chain)).toBe('body > ul > li:nth-of-type(3)')
  })

  it('escapes special characters in classes', () => {
    const chain = [n({ tag: 'div', classes: ['w-1/2'] }), n({ tag: 'body' })]
    expect(buildSelector(chain)).toBe('body > div.w-1\\/2')
  })
})
