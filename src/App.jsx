import { useEffect, useState } from 'react'
import { MISSING_KEY_MESSAGE, getWeather, hasApiKey, searchPlaces } from './api.js'
import { loadFavorites, samePlace, saveFavorites } from './favorites.js'
import SearchBar from './components/SearchBar.jsx'
import Favorites from './components/Favorites.jsx'
import CurrentWeather from './components/CurrentWeather.jsx'
import Forecast from './components/Forecast.jsx'

export default function App() {
  const [favorites, setFavorites] = useState(loadFavorites)
  const [place, setPlace] = useState(null)
  const [weather, setWeather] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(hasApiKey() ? '' : MISSING_KEY_MESSAGE)

  useEffect(() => saveFavorites(favorites), [favorites])

  // Visa första favoriten direkt när appen öppnas.
  useEffect(() => {
    if (favorites.length > 0 && hasApiKey()) showPlace(favorites[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function showPlace(newPlace) {
    setSuggestions([])
    setPlace(newPlace)
    setLoading(true)
    setError('')
    try {
      setWeather(await getWeather(newPlace))
    } catch (err) {
      setWeather(null)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch(query) {
    setLoading(true)
    setError('')
    setSuggestions([])
    try {
      const places = await searchPlaces(query)
      if (places.length === 0) {
        setError(`Hittade ingen ort som heter "${query}". Kontrollera stavningen och försök igen.`)
      } else if (places.length === 1) {
        await showPlace(places[0])
      } else {
        setSuggestions(places)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isFavorite = place && favorites.some((f) => samePlace(f, place))

  function toggleFavorite() {
    setFavorites((current) =>
      isFavorite ? current.filter((f) => !samePlace(f, place)) : [...current, place]
    )
  }

  function removeFavorite(toRemove) {
    setFavorites((current) => current.filter((f) => !samePlace(f, toRemove)))
  }

  return (
    <div className="app">
      <header className="header">
        <h1>
          <img src="./favicon.svg" alt="" className="logo" /> Vädret just nu
        </h1>
        <p className="tagline">Sök en ort och se vädret idag och fem dagar framåt.</p>
      </header>

      <main>
        <SearchBar
          onSearch={handleSearch}
          suggestions={suggestions}
          onPick={showPlace}
          disabled={loading}
        />

        <Favorites
          favorites={favorites}
          current={place}
          onSelect={showPlace}
          onRemove={removeFavorite}
        />

        {error && (
          <div className="message message-error" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="message" role="status">
            Hämtar väder …
          </div>
        )}

        {!loading && weather && place && (
          <>
            <CurrentWeather
              place={place}
              current={weather.current}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
            <Forecast days={weather.days} />
          </>
        )}

        {!loading && !weather && !error && suggestions.length === 0 && (
          <div className="message message-welcome">
            ☀️ Skriv in en ort ovan, till exempel Stockholm eller Malmö, för att komma igång.
          </div>
        )}
      </main>

      <footer className="footer">Väderdata från OpenWeatherMap</footer>
    </div>
  )
}
