import { useMemo, useState } from 'react'
import ReviewCard from './ReviewCard'

export default function ReviewList({ reviews, isAuthenticated, onDelete }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return reviews
    return reviews.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.originalTitle?.toLowerCase().includes(q) ||
        r.review?.toLowerCase().includes(q) ||
        r.quote?.toLowerCase().includes(q)
    )
  }, [reviews, query])

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [filtered]
  )

  return (
    <section>
      {/* Search bar */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
          🔍
        </span>
        <input
          className="input pl-10"
          type="search"
          placeholder="搜尋電影名稱或評論內容…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
          >
            ×
          </button>
        )}
      </div>

      {/* Results count */}
      {query && (
        <p className="text-sm text-zinc-500 mb-4">
          找到 {sorted.length} 筆結果
        </p>
      )}

      {/* Empty states */}
      {reviews.length === 0 && (
        <div className="text-center py-20 text-zinc-600">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-lg">還沒有評論，快去看一部電影吧！</p>
        </div>
      )}

      {reviews.length > 0 && sorted.length === 0 && (
        <div className="text-center py-16 text-zinc-600">
          <p className="text-3xl mb-3">🔎</p>
          <p>找不到「{query}」相關的評論</p>
        </div>
      )}

      {/* List */}
      <div className="space-y-6">
        {sorted.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            isAuthenticated={isAuthenticated}
            onDelete={onDelete}
          />
        ))}
      </div>

      {sorted.length > 0 && (
        <p className="text-center text-xs text-zinc-700 mt-8">
          共 {reviews.length} 篇評論
        </p>
      )}
    </section>
  )
}
