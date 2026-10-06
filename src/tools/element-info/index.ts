import { lazy } from 'react'
import type { Tool } from '../types'

const tool: Tool = {
  id: 'element-info',
  name: 'Element Info',
  description: '페이지에서 요소를 클릭해 selector와 스타일 확인 (picker 데모)',
  icon: '🎯',
  keywords: ['picker', 'selector', 'inspect', 'css'],
  component: lazy(() => import('./ElementInfo')),
}

export default tool
