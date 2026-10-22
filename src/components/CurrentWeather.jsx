import { iconUrl } from '../api.js'
import { placeLabel } from '../favorites.js'

const round = (n) => Math.round(n)

export default function CurrentWeather({ place, current, isFavorite, onToggleFavorite }) {
  const weather = current.weather[0]

  return (
    <section className="card current" aria-label="Vädret just nu">
      <div className="current-top">
        <h2>{placeLabel(place)}</h2>
        <button
          type="button"
          className={isFavorite ? 'button button-fav is-fav' : 'button button-fav'}
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '★ Sparad' : '☆ Spara'}
        </button>
      </div>

      <div className="current-main">
        <img src={iconUrl(weather.icon)} alt="" width="100" height="100" />
        <div>
          <p className="temp">{round(current.main.temp)}°</p>
          <p className="description">{weather.description}</p>
        </div>
      </div>

      <dl className="details">
        <div>
          <dt>Känns som</dt>
          <dd>{round(current.main.feels_like)}°</dd>
        </div>
        <div>
          <dt>Vind</dt>
          <dd>{round(current.wind.speed)} m/s</dd>
        </div>
        <div>
          <dt>Luftfuktighet</dt>
          <dd>{current.main.humidity} %</dd>
        </div>
        <div>
          <dt>Lufttryck</dt>
          <dd>{current.main.pressure} hPa</dd>
        </div>
      </dl>
    </section>
  )
}
