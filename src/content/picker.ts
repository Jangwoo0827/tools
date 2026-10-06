import type { PickedElement } from '@/shared/messages'
import { buildSelector, type ChainNode } from './selector'

export interface PickerOptions {
  onPick: (element: PickedElement) => void
  onCancel?: () => void
  /** true면 한 번 선택하고 종료 (기본 true) */
  once?: boolean
}

const HOST_ID = '__devtools_picker_host__'
let active: { stop: () => void } | null = null

export function describeElement(el: Element): PickedElement {
  const cs = getComputedStyle(el)
  const r = el.getBoundingClientRect()
  return {
    selector: buildSelector(chainOf(el)),
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    classes: [...el.classList],
    text: (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 200),
    rect: { x: r.x, y: r.y, width: r.width, height: r.height },
    styles: {
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
    },
    pageUrl: location.href,
  }
}

function chainOf(el: Element): ChainNode[] {
  const chain: ChainNode[] = []
  for (let cur: Element | null = el; cur; cur = cur.parentElement) {
    const node = cur
    const same = node.parentElement
      ? [...node.parentElement.children].filter((c) => c.tagName === node.tagName)
      : [node]
    chain.push({
      tag: node.tagName,
      id: node.id || null,
      classes: [...node.classList],
      nthOfType: same.indexOf(node) + 1,
      siblingsOfType: same.length,
    })
  }
  return chain
}

/** 마우스 오버 하이라이트 + 클릭 선택. 이미 실행 중이면 기존 stop 함수를 돌려준다. */
export function startPicker({ onPick, onCancel, once = true }: PickerOptions): () => void {
  if (active) return active.stop

  // 페이지 CSS와 격리하기 위해 shadow DOM 안에 오버레이를 둔다.
  const host = document.createElement('div')
  host.id = HOST_ID
  host.style.cssText = 'all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none;'
  const shadow = host.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `
    <style>
      .box{position:fixed;border:2px solid #4f46e5;background:rgba(79,70,229,.15);
        box-sizing:border-box;display:none}
      .tag{position:fixed;font:11px/1.4 ui-monospace,monospace;color:#fff;background:#4f46e5;
        padding:1px 6px;border-radius:3px;display:none;white-space:nowrap}
    </style>
    <div class="box"></div><div class="tag"></div>`
  const box = shadow.querySelector<HTMLDivElement>('.box')!
  const tag = shadow.querySelector<HTMLDivElement>('.tag')!
  document.documentElement.appendChild(host)

  const prevCursor = document.documentElement.style.cursor
  document.documentElement.style.cursor = 'crosshair'

  let current: Element | null = null
  const targetAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y)
    return el && el !== host ? el : null
  }

  const onMove = (e: MouseEvent) => {
    const el = targetAt(e.clientX, e.clientY)
    if (!el || el === current) return
    current = el
    const r = el.getBoundingClientRect()
    Object.assign(box.style, {
      display: 'block',
      left: `${r.left}px`,
      top: `${r.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    })
    tag.textContent = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} ${Math.round(r.width)}×${Math.round(r.height)}`
    Object.assign(tag.style, {
      display: 'block',
      left: `${Math.max(0, r.left)}px`,
      top: `${r.top > 22 ? r.top - 20 : r.bottom + 2}px`,
    })
  }

  // 페이지 자체 핸들러(링크 이동 등)가 동작하지 않도록 capture 단계에서 가로챈다.
  const swallow = (e: Event) => {
    e.preventDefault()
    e.stopImmediatePropagation()
  }
  const onClick = (e: MouseEvent) => {
    swallow(e)
    const el = targetAt(e.clientX, e.clientY)
    if (!el) return
    onPick(describeElement(el))
    if (once) stop()
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return
    swallow(e)
    stop()
    onCancel?.()
  }

  const blocked = ['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'auxclick', 'contextmenu'] as const
  document.addEventListener('mousemove', onMove, true)
  document.addEventListener('click', onClick, true)
  document.addEventListener('keydown', onKey, true)
  blocked.forEach((t) => document.addEventListener(t, swallow, true))

  function stop() {
    document.removeEventListener('mousemove', onMove, true)
    document.removeEventListener('click', onClick, true)
    document.removeEventListener('keydown', onKey, true)
    blocked.forEach((t) => document.removeEventListener(t, swallow, true))
    document.documentElement.style.cursor = prevCursor
    host.remove()
    active = null
  }

  active = { stop }
  return stop
}
