import { samePlace } from '../favorites.js'

export default function Favorites({ favorites, current, onSelect, onRemove }) {
  if (favorites.length === 0) return null

  return (
    <section className="favorites" aria-label="Favoritorter">
      <h2>Favoriter</h2>
      <ul>
        {favorites.map((place) => {
          const active = current && samePlace(place, current)
          return (
            <li key={`${place.lat},${place.lon}`} className={active ? 'chip chip-active' : 'chip'}>
              <button
                type="button"
                className="chip-name"
                onClick={() => onSelect(place)}
                aria-current={active ? 'true' : undefined}
              >
                {place.name}
              </button>
              <button
                type="button"
                className="chip-remove"
                onClick={() => onRemove(place)}
                aria-label={`Ta bort ${place.name} från favoriter`}
              >
                ×
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
