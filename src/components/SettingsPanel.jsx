import { useState } from 'react'
import { createReviewsGist } from '../api/gist'

export default function SettingsPanel({ token, gistId, isAuthenticated, onSave, onClear }) {
  const [localToken, setLocalToken] = useState(token)
  const [localGistId, setLocalGistId] = useState(gistId)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleSave(e) {
    e.preventDefault()
    if (!localToken.trim() || !localGistId.trim()) {
      setError('Token 與 Gist ID 均為必填')
      return
    }
    onSave(localToken.trim(), localGistId.trim())
    setError('')
    setSuccess('設定已儲存')
    setOpen(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  async function handleCreateGist() {
    if (!localToken.trim()) {
      setError('請先填入 GitHub PAT')
      return
    }
    setCreating(true)
    setError('')
    try {
      const id = await createReviewsGist(localToken.trim())
      setLocalGistId(id)
      setSuccess(`已建立 Gist：${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  function handleLogout() {
    onClear()
    setLocalToken('')
    setLocalGistId('')
    setOpen(true)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost text-xs flex items-center gap-1.5 shadow-lg"
        title="站長設定"
      >
        <span>⚙</span>
        <span className="hidden sm:inline">{isAuthenticated ? '已登入' : '站長設定'}</span>
        {isAuthenticated && <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />}
      </button>

      {open && (
        <div className="card absolute bottom-12 right-0 w-80 p-5 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-zinc-200">站長設定</h3>
            <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-200 text-lg leading-none">×</button>
          </div>

          {error && <p className="text-red-400 text-xs mb-3 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
          {success && <p className="text-green-400 text-xs mb-3 bg-green-500/10 rounded-lg px-3 py-2">{success}</p>}

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="label">GitHub PAT（需有 gist 權限）</label>
              <input
                type="password"
                className="input text-sm"
                placeholder="ghp_xxxxxxxxxxxx"
                value={localToken}
                onChange={(e) => setLocalToken(e.target.value)}
                autoComplete="off"
              />
              <p className="text-xs text-zinc-600 mt-1">
                <a
                  href="https://github.com/settings/tokens/new?scopes=gist"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-500/70 hover:text-amber-400"
                >
                  建立 PAT ↗
                </a>
              </p>
            </div>

            <div>
              <label className="label">Gist ID</label>
              <input
                type="text"
                className="input text-sm"
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={localGistId}
                onChange={(e) => setLocalGistId(e.target.value)}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={handleCreateGist}
                disabled={creating}
                className="text-xs text-amber-500/70 hover:text-amber-400 mt-1 disabled:opacity-40"
              >
                {creating ? '建立中…' : '← 或自動建立新 Gist'}
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <button type="submit" className="btn-primary text-sm flex-1">儲存設定</button>
              {isAuthenticated && (
                <button type="button" onClick={handleLogout} className="btn-ghost text-sm">登出</button>
              )}
            </div>
          </form>

          <p className="text-zinc-600 text-xs mt-4 leading-relaxed">
            Token 僅儲存於您的瀏覽器 localStorage，不會傳送至任何伺服器以外的地方。
          </p>
        </div>
      )}
    </div>
  )
}
