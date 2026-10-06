/** 선택된 요소의 직렬화 가능한 스냅샷. 색상 추출·글꼴 검사 등이 재사용한다. */
export interface PickedElement {
  selector: string
  tag: string
  id: string | null
  classes: string[]
  text: string
  rect: { x: number; y: number; width: number; height: number }
  styles: {
    color: string
    backgroundColor: string
    fontFamily: string
    fontSize: string
    fontWeight: string
    lineHeight: string
  }
  pageUrl: string
}

export type PickerMessage =
  | { type: 'picker:picked'; element: PickedElement }
  | { type: 'picker:cancelled' }

export const LAST_PICK_KEY = 'lastPick'
