import { useEffect, useState } from 'react'
import type { PickedElement } from '@/shared/messages'
import { injectPicker, onPicked, readLastPick } from '@/popup/picker-client'
import { describePicked, toClipboardText } from './logic'

export default function ElementInfo() {
  const [picked, setPicked] = useState<PickedElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    void readLastPick().then(setPicked)
    return onPicked(setPicked)
  }, [])

  const start = async () => {
    setError(null)
    try {
      await injectPicker()
      // 페이지를 클릭하면 팝업이 닫힌다. 결과는 다시 열 때 자동으로 표시된다.
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const copy = async () => {
    if (!picked) return
    await navigator.clipboard.writeText(toClipboardText(picked))
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="stack">
      <button className="primary" onClick={start}>
        페이지에서 요소 선택
      </button>
      <p className="hint">선택 후 팝업을 다시 열면 결과가 표시됩니다. Esc로 취소.</p>
      {error && <p className="error">{error}</p>}
      {picked && (
        <>
          <dl className="kv">
            {describePicked(picked).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <button onClick={copy}>{copied ? '복사됨 ✓' : '복사'}</button>
        </>
      )}
    </div>
  )
}
