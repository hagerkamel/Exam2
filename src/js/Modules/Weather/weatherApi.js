import { fetchData } from "../component/api.js";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

// Convert a city name into { lat, lng }. Works for any city worldwide.
export async function geocodeCity(cityName, countryCode) {
  const url =
    GEOCODING_URL + "?name=" + encodeURIComponent(cityName) + "&count=1";
  const data = await fetchData(url);

  if (!data || !data.results || data.results.length === 0) {
    return null;
  }

  const result = data.results[0];

  return {
    lat: result.latitude,
    lng: result.longitude,
  };
}

// Fetch the full forecast (current + hourly + 7-day daily) for given coordinates
export async function getWeatherData(lat, lng) {
  const params =
    "latitude=" +
    lat +
    "&longitude=" +
    lng +
    "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index" +
    "&hourly=temperature_2m,weather_code,precipitation_probability" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant" +
    "&timezone=auto";

  const url = FORECAST_URL + "?" + params;
  return await fetchData(url);
}
