import type { PickedElement } from '@/shared/messages'

/** 선택된 요소 → 사람이 읽을 (라벨, 값) 목록. 복사/표시에 공통 사용. */
export function describePicked(el: PickedElement): [label: string, value: string][] {
  const rows: [string, string][] = [
    ['selector', el.selector],
    ['tag', el.tag],
    ['size', `${Math.round(el.rect.width)} × ${Math.round(el.rect.height)}`],
    ['color', el.styles.color],
    ['background', el.styles.backgroundColor],
    ['font', `${el.styles.fontSize} / ${el.styles.lineHeight} ${el.styles.fontWeight}`],
    ['font-family', el.styles.fontFamily],
  ]
  if (el.id) rows.splice(2, 0, ['id', el.id])
  if (el.classes.length) rows.splice(el.id ? 3 : 2, 0, ['class', el.classes.join(' ')])
  if (el.text) rows.push(['text', el.text])
  return rows
}

export const toClipboardText = (el: PickedElement) =>
  describePicked(el)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')
