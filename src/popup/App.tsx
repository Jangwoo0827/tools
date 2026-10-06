import { Suspense, useMemo, useState } from 'react'
import { tools } from '@/tools/registry'
import { filterTools } from '@/tools/search'

export function App() {
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const filtered = useMemo(() => filterTools(tools, query), [query])
  const open = tools.find((t) => t.id === openId)

  if (open) {
    const Tool = open.component
    return (
      <main>
        <header className="bar">
          <button className="ghost" onClick={() => setOpenId(null)} aria-label="뒤로">
            ←
          </button>
          <h1>
            {open.icon} {open.name}
          </h1>
        </header>
        <Suspense fallback={<p className="hint">불러오는 중…</p>}>
          <Tool />
        </Suspense>
      </main>
    )
  }

  return (
    <main>
      <input
        autoFocus
        type="search"
        placeholder={`도구 검색 (${tools.length})`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="list">
        {filtered.map((t) => (
          <li key={t.id}>
            <button className="item" onClick={() => setOpenId(t.id)}>
              <span className="icon">{t.icon}</span>
              <span>
                <strong>{t.name}</strong>
                <small>{t.description}</small>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {!filtered.length && <p className="hint">일치하는 도구가 없습니다.</p>}
    </main>
  )
}
