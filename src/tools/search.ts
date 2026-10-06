import type { Tool } from './types'

type Searchable = Pick<Tool, 'id' | 'name' | 'description' | 'keywords'>

/** 공백으로 나눈 모든 토큰이 id/이름/설명/키워드 중 어디든 포함되면 매치 (대소문자 무시). */
export function filterTools<T extends Searchable>(list: T[], query: string): T[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!tokens.length) return list
  return list.filter((t) => {
    const hay = [t.id, t.name, t.description, ...(t.keywords ?? [])].join(' ').toLowerCase()
    return tokens.every((tok) => hay.includes(tok))
  })
}
