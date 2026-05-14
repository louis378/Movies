import { useState, useRef } from 'react'
import StarRating from './StarRating'
import { searchMoviePoster } from '../api/tmdb'
import { extractYouTubeId, youTubeThumbnail } from '../utils/youtube'

const MAX_CHARS = 280
const MAX_IMAGE_SIZE_MB = 1.5
const EMPTY = {
  title: '',
  originalTitle: '',
  rating: 0,
  quote: '',
  review: '',
  youtubeUrl: '',
  posterUrl: '',
  watchedAt: new Date().toISOString().slice(0, 10),
}

function compressImage(file, maxWidth = 600) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    img.onerror = reject
    img.src = url
  })
}

export default function AddReviewForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [posterLoading, setPosterLoading] = useState(false)
  const [posterError, setPosterError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)
  const titleDebounce = useRef(null)

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleTitleChange(e) {
    const value = e.target.value
    setForm((f) => ({ ...f, title: value }))
    clearTimeout(titleDebounce.current)
    if (value.trim().length < 2) return
    titleDebounce.current = setTimeout(() => fetchPoster(value.trim()), 800)
  }

  async function fetchPoster(title) {
    setPosterLoading(true)
    setPosterError('')
    try {
      const info = await searchMoviePoster(title)
      if (info?.posterUrl) {
        setForm((f) => ({
          ...f,
          posterUrl: info.posterUrl,
          originalTitle: f.originalTitle || info.originalTitle || '',
        }))
      }
    } catch {
      // silently ignore TMDB errors
    } finally {
      setPosterLoading(false)
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPosterError('請選擇圖片檔案')
      return
    }
    const sizeMB = file.size / 1024 / 1024
    setPosterError('')
    setPosterLoading(true)
    try {
      const base64 = await compressImage(file, sizeMB > MAX_IMAGE_SIZE_MB ? 400 : 600)
      setForm((f) => ({ ...f, posterUrl: base64 }))
    } catch {
      setPosterError('圖片處理失敗，請改用 URL')
    } finally {
      setPosterLoading(false)
    }
    e.target.value = ''
  }

  const ytId = extractYouTubeId(form.youtubeUrl)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) { setError('請填入電影名稱'); return }
    if (form.rating === 0) { setError('請選擇評分'); return }
    if (!form.review.trim()) { setError('請填入評論內容'); return }
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({
        id: crypto.randomUUID(),
        ...form,
        title: form.title.trim(),
        createdAt: new Date().toISOString(),
      })
      setForm(EMPTY)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card p-5 md:p-7">
      <h2 className="text-lg font-semibold text-zinc-200 mb-5">新增電影評論</h2>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-2.5 mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">電影中文名稱 *</label>
            <input
              className="input"
              placeholder="陽光普照"
              value={form.title}
              onChange={handleTitleChange}
            />
          </div>
          <div>
            <label className="label">英文 / 原文名稱</label>
            <input
              className="input"
              placeholder="A Sun"
              value={form.originalTitle}
              onChange={set('originalTitle')}
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="label">評分</label>
          <StarRating value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} size="lg" />
        </div>

        {/* Quote */}
        <div>
          <label className="label">電影金句（選填）</label>
          <textarea
            className="input resize-none"
            rows={2}
            placeholder="一句觸動你的台詞或感受…"
            value={form.quote}
            onChange={set('quote')}
          />
        </div>

        {/* Review */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="label mb-0">短評內容 *</label>
            <span className={`text-xs ${form.review.length > MAX_CHARS ? 'text-red-400' : 'text-zinc-500'}`}>
              {form.review.length} / {MAX_CHARS}
            </span>
          </div>
          <textarea
            className="input resize-none"
            rows={5}
            placeholder="看完的當下，一時間不知該怎麼形容這部片…"
            value={form.review}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) set('review')(e)
            }}
          />
        </div>

        {/* YouTube */}
        <div>
          <label className="label">YouTube 預告片網址（選填）</label>
          <input
            className="input"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={form.youtubeUrl}
            onChange={set('youtubeUrl')}
          />
          {ytId && (
            <div className="mt-2 rounded-xl overflow-hidden aspect-video max-w-xs">
              <img
                src={youTubeThumbnail(ytId)}
                alt="YouTube 縮圖預覽"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Poster */}
        <div>
          <label className="label">電影海報</label>

          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-ghost text-sm flex items-center gap-2"
            >
              <span>📁</span> 上傳圖片
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <span className="text-zinc-600 text-sm self-center">或</span>
            <input
              className="input text-sm flex-1"
              type="url"
              placeholder="貼上圖片網址"
              value={form.posterUrl.startsWith('data:') ? '' : form.posterUrl}
              onChange={(e) => setForm((f) => ({ ...f, posterUrl: e.target.value }))}
            />
          </div>

          {posterLoading && <p className="text-xs text-zinc-500 mt-1">處理中…</p>}
          {posterError && <p className="text-xs text-amber-400 mt-1">{posterError}</p>}

          {form.posterUrl && !posterLoading && (
            <div className="relative inline-block mt-2">
              <img
                src={form.posterUrl}
                alt="海報預覽"
                className="w-24 rounded-lg border border-zinc-700 object-cover"
              />
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, posterUrl: '' }))}
                className="absolute -top-2 -right-2 bg-zinc-700 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none transition-colors"
              >
                ×
              </button>
            </div>
          )}

          <p className="text-xs text-zinc-600 mt-1.5">
            支援直接上傳（自動壓縮）或貼上圖片網址。
          </p>
        </div>

        {/* Watched date */}
        <div>
          <label className="label">觀影日期</label>
          <input
            className="input"
            type="date"
            value={form.watchedAt}
            onChange={set('watchedAt')}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting || form.review.length > MAX_CHARS}
            className="btn-primary flex-1"
          >
            {submitting ? '儲存中…' : '發布評論'}
          </button>
          <button type="button" onClick={onCancel} className="btn-ghost">取消</button>
        </div>
      </form>
    </div>
  )
}
