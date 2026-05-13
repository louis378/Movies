import { useState } from 'react'
import StarRating from './StarRating'
import { extractYouTubeId, youTubeEmbedUrl, youTubeThumbnail } from '../utils/youtube'

function YoutubeEmbed({ url }) {
  const videoId = extractYouTubeId(url)
  const [playing, setPlaying] = useState(false)
  if (!videoId) return null

  return (
    <div className="mt-4">
      {playing ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
          <iframe
            src={`${youTubeEmbedUrl(videoId)}&autoplay=1`}
            title="YouTube 預告片"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="relative w-full aspect-video rounded-xl overflow-hidden group block"
          aria-label="播放預告片"
        >
          <img
            src={youTubeThumbnail(videoId)}
            alt="預告片縮圖"
            className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-200"
          />
          {/* Play button overlay */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="bg-red-600/90 group-hover:bg-red-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl transition-all duration-200 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="w-6 h-6 ml-0.5 fill-current">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md">
            預告片
          </span>
        </button>
      )}
    </div>
  )
}

export default function ReviewCard({ review, isAuthenticated, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const dateStr = review.watchedAt
    ? new Date(review.watchedAt).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
    : review.createdAt
      ? new Date(review.createdAt).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
      : ''

  async function handleDelete() {
    setDeleting(true)
    try {
      await onDelete(review.id)
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  return (
    <article className="card">
      {/* Header */}
      <div className="p-5 md:p-6 space-y-4">
        {/* Title + rating row */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <StarRating value={review.rating} readOnly size="md" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-100 mt-1.5 leading-tight">
              《{review.title}》
              {review.originalTitle && (
                <span className="text-zinc-500 text-base font-normal ml-2">（{review.originalTitle}）</span>
              )}
            </h2>
          </div>
          {isAuthenticated && (
            <div className="flex-shrink-0">
              {confirmDelete ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-400">確認刪除？</span>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="text-red-400 hover:text-red-300 disabled:opacity-40"
                  >
                    {deleting ? '…' : '確認'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-zinc-600 hover:text-red-400 transition-colors text-sm"
                  title="刪除"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Quote */}
        {review.quote && (
          <blockquote className="border-l-2 border-amber-500/60 pl-4 text-zinc-300 italic leading-relaxed">
            『{review.quote}』
          </blockquote>
        )}

        {/* Review text */}
        <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-[15px]">
          {review.review}
        </p>

        {/* Date */}
        {dateStr && (
          <p className="text-xs text-zinc-600">{dateStr} 觀影</p>
        )}
      </div>

      {/* Poster */}
      {review.posterUrl && (
        <div className="px-5 md:px-6 pb-0">
          <img
            src={review.posterUrl}
            alt={`${review.title} 電影海報`}
            className="w-36 md:w-44 rounded-xl border border-zinc-800 object-cover shadow-lg"
            loading="lazy"
          />
        </div>
      )}

      {/* YouTube embed */}
      {review.youtubeUrl && (
        <div className="px-5 md:px-6 pb-5 md:pb-6">
          <YoutubeEmbed url={review.youtubeUrl} />
        </div>
      )}

      {!review.posterUrl && !review.youtubeUrl && <div className="pb-1" />}
    </article>
  )
}
