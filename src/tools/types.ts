import type { ComponentType } from 'react'

/** 도구 한 개의 메타 정보 + UI. 각 도구의 index.ts가 default로 내보낸다. */
export interface Tool {
  /** 고유 id (폴더명과 동일하게) */
  id: string
  name: string
  description: string
  /** 이모지 또는 짧은 문자열 */
  icon: string
  /** 검색에 추가로 쓰일 키워드 */
  keywords?: string[]
  /** React.lazy로 감싼 UI 컴포넌트 — 도구를 열 때만 로드된다 */
  component: ComponentType
}
