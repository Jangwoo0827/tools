/** 요소 → 루트 방향 조상 체인의 한 단계 (DOM 비의존 순수 데이터). */
export interface ChainNode {
  tag: string
  id: string | null
  classes: string[]
  /** 같은 태그 형제 중 1-based 순번 */
  nthOfType: number
  /** 같은 태그 형제 수 */
  siblingsOfType: number
}

const cssEscape = (s: string) => s.replace(/([^\w-])/g, '\\$1')

/** 가능한 한 짧고 안정적인 CSS selector. chain은 [요소 자신, 부모, ...] 순서. */
export function buildSelector(chain: ChainNode[], maxClasses = 2): string {
  const parts: string[] = []
  for (const node of chain) {
    const tag = node.tag.toLowerCase()
    if (node.id) {
      parts.unshift(`#${cssEscape(node.id)}`)
      break
    }
    let part = tag
    const classes = node.classes.filter(Boolean).slice(0, maxClasses)
    if (classes.length) part += classes.map((c) => `.${cssEscape(c)}`).join('')
    else if (node.siblingsOfType > 1) part += `:nth-of-type(${node.nthOfType})`
    parts.unshift(part)
    if (tag === 'body' || tag === 'html') break
  }
  return parts.join(' > ')
}
