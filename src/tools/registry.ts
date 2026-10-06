import type { Tool } from './types'
import elementInfo from './element-info'

/** 새 도구: src/tools/<id>/ 폴더를 만들고 위에 import, 아래 배열에 한 줄 추가. */
export const tools: Tool[] = [
  elementInfo,
]
