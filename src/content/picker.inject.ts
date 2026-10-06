// chrome.scripting.executeScript로 주입되는 진입점.
// 선택/취소 결과를 백그라운드로 보내면 백그라운드가 storage.session에 저장하고
// 열려 있는 팝업에도 전달한다 (팝업은 페이지 클릭 시 닫히므로 저장이 필요).
import type { PickerMessage } from '@/shared/messages'
import { startPicker } from './picker'

const send = (msg: PickerMessage) => chrome.runtime.sendMessage(msg).catch(() => {})

startPicker({
  onPick: (element) => void send({ type: 'picker:picked', element }),
  onCancel: () => void send({ type: 'picker:cancelled' }),
})
