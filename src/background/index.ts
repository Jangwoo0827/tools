import { LAST_PICK_KEY, type PickerMessage } from '@/shared/messages'

// 요소 선택 결과를 storage.session에 보관한다. 팝업이 닫혀 있어도 다시 열 때 읽을 수 있다.
// 열려 있는 팝업은 같은 runtime 메시지를 직접 수신한다.
chrome.runtime.onMessage.addListener((msg: PickerMessage) => {
  if (msg?.type === 'picker:picked') {
    void chrome.storage.session.set({ [LAST_PICK_KEY]: msg.element })
  }
})
