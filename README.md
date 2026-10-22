# Vädret just nu

En glad och enkel väderapp byggd med React och Vite. Sök efter en ort och se vädret just nu och prognosen för de kommande fem dagarna. Spara dina favoritorter och byt snabbt mellan dem. Favoriterna sparas i webbläsaren (localStorage).

Väderdata hämtas från [OpenWeatherMap](https://openweathermap.org/) via deras gratis-API:er för aktuellt väder, femdygnsprognos och ortssökning (Geocoding).

## Kom igång

1. Skaffa en gratis API-nyckel på [openweathermap.org](https://home.openweathermap.org/api_keys). En ny nyckel kan ta upp till ett par timmar att aktiveras.
2. Kopiera `.env.example` till `.env.local` och lägg in din nyckel:

   ```
   VITE_OPENWEATHER_API_KEY=din-nyckel
   ```

3. Installera och starta:

   ```bash
   npm install
   npm run dev
   ```

`npm run build` bygger en färdig version till mappen `dist`. Appen använder relativa sökvägar och fungerar därför på GitHub Pages.

> Obs! Nyckeln byggs in i appens JavaScript och syns för alla som besöker en publicerad version.
