const KEYS = {
  TOKEN: 'movie_review_pat',
  GIST_ID: 'movie_review_gist_id',
}

export const storage = {
  getToken: () => localStorage.getItem(KEYS.TOKEN) ?? '',
  setToken: (v) => localStorage.setItem(KEYS.TOKEN, v),
  removeToken: () => localStorage.removeItem(KEYS.TOKEN),

  getGistId: () => localStorage.getItem(KEYS.GIST_ID) ?? '',
  setGistId: (v) => localStorage.setItem(KEYS.GIST_ID, v),
  removeGistId: () => localStorage.removeItem(KEYS.GIST_ID),

  clearAll: () => {
    localStorage.removeItem(KEYS.TOKEN)
    localStorage.removeItem(KEYS.GIST_ID)
  },
}
