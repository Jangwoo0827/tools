import { LAST_PICK_KEY, type PickedElement, type PickerMessage } from '@/shared/messages'
import pickerScript from '@/content/picker.inject?script'

/** 활성 탭에 picker를 주입한다. 이후 사용자가 클릭하면 결과가 background→storage로 저장된다. */
export async function injectPicker(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.id) throw new Error('활성 탭을 찾을 수 없습니다')
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: [pickerScript] })
}

export async function readLastPick(): Promise<PickedElement | null> {
  const stored = await chrome.storage.session.get(LAST_PICK_KEY)
  return (stored[LAST_PICK_KEY] as PickedElement | undefined) ?? null
}

/** 팝업이 열려 있는 동안 도착하는 선택 결과를 구독. 해제 함수를 반환. */
export function onPicked(cb: (el: PickedElement) => void): () => void {
  const listener = (msg: PickerMessage) => {
    if (msg?.type === 'picker:picked') cb(msg.element)
  }
  chrome.runtime.onMessage.addListener(listener)
  return () => chrome.runtime.onMessage.removeListener(listener)
}
