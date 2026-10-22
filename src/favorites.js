const STORAGE_KEY = 'vaderappen-favoriter'

export function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch {
    // Privat läge eller full lagring: favoriterna gäller bara den här sessionen.
  }
}

export function samePlace(a, b) {
  return Math.abs(a.lat - b.lat) < 0.01 && Math.abs(a.lon - b.lon) < 0.01
}

export function placeLabel(place) {
  return [place.name, place.state, place.country].filter(Boolean).join(', ')
}
