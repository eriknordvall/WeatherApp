import { iconUrl } from '../api.js'

const weekday = new Intl.DateTimeFormat('sv-SE', { weekday: 'short', timeZone: 'UTC' })
const dayMonth = new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short', timeZone: 'UTC' })

export default function Forecast({ days }) {
  return (
    <section className="forecast" aria-label="Prognos för fem dagar">
      <h2>Kommande dagar</h2>
      <ol>
        {days.map((day) => {
          const date = new Date(`${day.date}T12:00:00Z`)
          return (
            <li key={day.date} className="card day">
              <p className="day-name">{weekday.format(date)}</p>
              <p className="day-date">{dayMonth.format(date)}</p>
              <img src={iconUrl(day.icon)} alt={day.description} width="64" height="64" />
              <p className="day-temp">
                <span className="max">{Math.round(day.max)}°</span>
                <span className="min">{Math.round(day.min)}°</span>
              </p>
              {day.pop >= 0.2 && <p className="day-pop">💧 {Math.round(day.pop * 100)} %</p>}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
