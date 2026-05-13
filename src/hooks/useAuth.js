import { useState, useCallback } from 'react'
import { storage } from '../utils/storage'

export function useAuth() {
  const [token, setTokenState] = useState(() => storage.getToken())
  const [gistId, setGistIdState] = useState(() => storage.getGistId())

  const saveCredentials = useCallback((newToken, newGistId) => {
    storage.setToken(newToken)
    storage.setGistId(newGistId)
    setTokenState(newToken)
    setGistIdState(newGistId)
  }, [])

  const clearCredentials = useCallback(() => {
    storage.clearAll()
    setTokenState('')
    setGistIdState('')
  }, [])

  return {
    token,
    gistId,
    isAuthenticated: Boolean(token && gistId),
    saveCredentials,
    clearCredentials,
  }
}
