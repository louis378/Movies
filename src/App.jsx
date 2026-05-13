import { useState, useEffect, useCallback } from 'react'
import { fetchReviews, saveReviews } from './api/gist'
import { useAuth } from './hooks/useAuth'
import AddReviewForm from './components/AddReviewForm'
import ReviewList from './components/ReviewList'
import SettingsPanel from './components/SettingsPanel'

export default function App() {
  const { token, gistId, isAuthenticated, saveCredentials, clearCredentials } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const loadReviews = useCallback(async () => {
    if (!gistId) return
    setLoading(true)
    setLoadError('')
    try {
      const data = await fetchReviews(gistId)
      setReviews(data)
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }, [gistId])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  async function handleAddReview(review) {
    const updated = [review, ...reviews]
    await saveReviews(gistId, token, updated)
    setReviews(updated)
    setShowForm(false)
  }

  async function handleDeleteReview(id) {
    const updated = reviews.filter((r) => r.id !== id)
    await saveReviews(gistId, token, updated)
    setReviews(updated)
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-100 leading-tight">🎬 我的電影短評</h1>
            <p className="text-xs text-zinc-600 mt-0.5">Movie Reviews</p>
          </div>
          {isAuthenticated && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary text-sm"
            >
              + 新增評論
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Load error banner */}
        {loadError && (
          <div className="mb-5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-start justify-between gap-3">
            <p className="text-red-400 text-sm">{loadError}</p>
            <button onClick={loadReviews} className="text-xs text-red-400 hover:text-red-200 underline flex-shrink-0">
              重試
            </button>
          </div>
        )}

        {/* No Gist configured */}
        {!gistId && (
          <div className="text-center py-24 text-zinc-600">
            <p className="text-5xl mb-4">🔐</p>
            <p className="text-lg text-zinc-500 font-medium mb-2">尚未設定資料來源</p>
            <p className="text-sm text-zinc-600">
              點擊右下角 ⚙ 設定 GitHub PAT 與 Gist ID 後即可讀取評論
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-zinc-800 rounded w-1/4 mb-3" />
                <div className="h-6 bg-zinc-800 rounded w-2/3 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-zinc-800 rounded" />
                  <div className="h-3 bg-zinc-800 rounded w-5/6" />
                  <div className="h-3 bg-zinc-800 rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add review form */}
        {isAuthenticated && showForm && !loading && (
          <div className="mb-8">
            <AddReviewForm
              onSubmit={handleAddReview}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Review list */}
        {!loading && gistId && (
          <ReviewList
            reviews={reviews}
            isAuthenticated={isAuthenticated}
            onDelete={handleDeleteReview}
          />
        )}
      </main>

      {/* Settings panel (floating, bottom-right) */}
      <SettingsPanel
        token={token}
        gistId={gistId}
        isAuthenticated={isAuthenticated}
        onSave={saveCredentials}
        onClear={clearCredentials}
      />
    </div>
  )
}
