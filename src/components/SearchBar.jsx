import { useState } from 'react'
import { placeLabel } from '../favorites.js'

export default function SearchBar({ onSearch, suggestions, onPick, disabled }) {
  const [query, setQuery] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = query.trim()
    if (trimmed) onSearch(trimmed)
  }

  return (
    <section className="search">
      <form onSubmit={handleSubmit} className="search-form" role="search">
        <label htmlFor="search-input" className="visually-hidden">
          Sök ort
        </label>
        <input
          id="search-input"
          type="search"
          placeholder="Sök ort …"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          enterKeyHint="search"
        />
        <button type="submit" className="button button-primary" disabled={disabled || !query.trim()}>
          Sök
        </button>
      </form>

      {suggestions.length > 0 && (
        <div className="suggestions">
          <p>Vilken ort menar du?</p>
          <ul>
            {suggestions.map((place) => (
              <li key={`${place.lat},${place.lon}`}>
                <button type="button" className="suggestion" onClick={() => onPick(place)}>
                  {placeLabel(place)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
