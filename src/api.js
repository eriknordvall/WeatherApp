import { placeLabel } from './favorites.js'

const API_KEY =import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE = 'https://api.openweathermap.org'

export const MISSING_KEY_MESSAGE =
  'API-nyckel saknas. Lägg in din nyckel från OpenWeatherMap i filen .env.local (VITE_OPENWEATHER_API_KEY=...) och starta om utvecklingsservern.'

export class WeatherError extends Error {}

export function hasApiKey() {
  return Boolean(API_KEY && API_KEY.trim())
}

async function request(path, params) {
  if (!hasApiKey()) {
    throw new WeatherError(MISSING_KEY_MESSAGE)
  }

  const url = new URL(path, BASE)
  Object.entries({ ...params, appid: API_KEY.trim() }).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  )

  let response
  try {
    response = await fetch(url)
  } catch {
    throw new WeatherError('Kunde inte nå vädertjänsten. Kontrollera din internetanslutning och försök igen.')
  }

  if (response.status === 401) {
    throw new WeatherError(
      'API-nyckeln fungerar inte. Kontrollera att nyckeln i .env.local är rätt. En nyskapad nyckel kan ta upp till ett par timmar innan den aktiveras.'
    )
  }
  if (response.status === 429) {
    throw new WeatherError('För många förfrågningar just nu. Vänta en stund och försök igen.')
  }
  if (!response.ok) {
    throw new WeatherError(`Något gick fel hos vädertjänsten (felkod ${response.status}). Försök igen senare.`)
  }
  return response.json()
}

export async function searchPlaces(query) {
  const results = await request('/geo/1.0/direct', { q: query, limit: 5 })
  const places = results.map((place) => ({
    name: place.local_names?.sv || place.name,
    country: place.country,
    state: place.state,
    lat: place.lat,
    lon: place.lon,
  }))

  // Geocoding kan ge flera punkter med samma namn. Behåll bara den första,
  // annars visas förslag som inte går att skilja åt.
  const seen = new Set()
  return places.filter((place) => {
    const label = placeLabel(place)
    if (seen.has(label)) return false
    seen.add(label)
    return true
  })
}

export async function getWeather(place) {
  const params = { lat: place.lat, lon: place.lon, units: 'metric', lang: 'sv' }
  const [current, forecast] = await Promise.all([
    request('/data/2.5/weather', params),
    request('/data/2.5/forecast', params),
  ])
  return { current, days: groupByDay(forecast) }
}

// Prognosen kommer i steg om tre timmar. Slå ihop dem till en post per dag,
// räknat i ortens egen tidszon.
function groupByDay(forecast) {
  const offset = forecast.city.timezone
  const localDate = (dt) => new Date((dt + offset) * 1000).toISOString().slice(0, 10)
  const today = localDate(Date.now() / 1000)

  const days = new Map()
  for (const item of forecast.list) {
    const date = localDate(item.dt)
    if (date === today) continue
    if (!days.has(date)) days.set(date, [])
    days.get(date).push(item)
  }

  return [...days.entries()].slice(0, 5).map(([date, items]) => {
    const hour = (item) => new Date((item.dt + offset) * 1000).getUTCHours()
    const midday = items.reduce((best, item) =>
      Math.abs(hour(item) - 13) < Math.abs(hour(best) - 13) ? item : best
    )
    return {
      date,
      min: Math.min(...items.map((i) => i.main.temp_min)),
      max: Math.max(...items.map((i) => i.main.temp_max)),
      icon: midday.weather[0].icon.replace('n', 'd'),
      description: midday.weather[0].description,
      pop: Math.max(...items.map((i) => i.pop ?? 0)),
    }
  })
}

export function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`
}
