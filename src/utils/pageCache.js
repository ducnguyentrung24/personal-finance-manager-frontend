const cache = new Map()

export const setCache = (key, value, ttlMs) => {
  const expiresAt = ttlMs ? Date.now() + ttlMs : null
  cache.set(key, { value, expiresAt })
}

export const getCache = (key) => {
  const entry = cache.get(key)
  if (!entry) return undefined

  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    cache.delete(key)
    return undefined
  }

  return entry.value
}

export const clearCache = (key) => {
  if (key) {
    cache.delete(key)
    return
  }

  cache.clear()
}