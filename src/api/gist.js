const GIST_API = 'https://api.github.com/gists'

/**
 * Fetch reviews from a GitHub Gist.
 * Returns an array of review objects, or [] on failure.
 */
export async function fetchReviews(gistId) {
  const res = await fetch(`${GIST_API}/${gistId}`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) throw new Error(`Gist fetch failed: ${res.status}`)
  const data = await res.json()
  const file = data.files?.['reviews.json']
  if (!file) return []
  return JSON.parse(file.content)
}

/**
 * Save reviews array back to the Gist (requires PAT with gist scope).
 */
export async function saveReviews(gistId, token, reviews) {
  const res = await fetch(`${GIST_API}/${gistId}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        'reviews.json': { content: JSON.stringify(reviews, null, 2) },
      },
    }),
  })
  if (!res.ok) throw new Error(`Gist save failed: ${res.status}`)
  return res.json()
}

/**
 * Create a brand-new Gist with an empty reviews.json.
 * Call once during first-time setup.
 */
export async function createReviewsGist(token) {
  const res = await fetch(GIST_API, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: 'Movie reviews data',
      public: false,
      files: { 'reviews.json': { content: '[]' } },
    }),
  })
  if (!res.ok) throw new Error(`Gist create failed: ${res.status}`)
  const data = await res.json()
  return data.id
}
