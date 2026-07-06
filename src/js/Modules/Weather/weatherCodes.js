// Weather/weatherCodes.js
const weatherCodeMap = {
  0: { text: "Clear sky", icon: "fa-sun", cssClass: "weather-sunny" },
  1: { text: "Mainly clear", icon: "fa-sun", cssClass: "weather-sunny" },
  2: {
    text: "Partly cloudy",
    icon: "fa-cloud-sun",
    cssClass: "weather-cloudy",
  },
  3: { text: "Overcast", icon: "fa-cloud", cssClass: "weather-cloudy" },
  45: { text: "Fog", icon: "fa-smog", cssClass: "weather-cloudy" },
  48: { text: "Rime fog", icon: "fa-smog", cssClass: "weather-cloudy" },
  51: {
    text: "Light drizzle",
    icon: "fa-cloud-rain",
    cssClass: "weather-rainy",
  },
  53: {
    text: "Moderate drizzle",
    icon: "fa-cloud-rain",
    cssClass: "weather-rainy",
  },
  55: {
    text: "Dense drizzle",
    icon: "fa-cloud-rain",
    cssClass: "weather-rainy",
  },
  61: { text: "Slight rain", icon: "fa-cloud-rain", cssClass: "weather-rainy" },
  63: {
    text: "Moderate rain",
    icon: "fa-cloud-showers-heavy",
    cssClass: "weather-rainy",
  },
  65: {
    text: "Heavy rain",
    icon: "fa-cloud-showers-heavy",
    cssClass: "weather-rainy",
  },
  71: { text: "Slight snow", icon: "fa-snowflake", cssClass: "weather-snowy" },
  73: {
    text: "Moderate snow",
    icon: "fa-snowflake",
    cssClass: "weather-snowy",
  },
  75: { text: "Heavy snow", icon: "fa-snowflake", cssClass: "weather-snowy" },
  80: {
    text: "Slight showers",
    icon: "fa-cloud-rain",
    cssClass: "weather-rainy",
  },
  81: {
    text: "Moderate showers",
    icon: "fa-cloud-showers-heavy",
    cssClass: "weather-rainy",
  },
  82: {
    text: "Violent showers",
    icon: "fa-cloud-showers-heavy",
    cssClass: "weather-rainy",
  },
  95: { text: "Thunderstorm", icon: "fa-bolt", cssClass: "weather-stormy" },
  96: {
    text: "Thunderstorm with hail",
    icon: "fa-cloud-bolt",
    cssClass: "weather-stormy",
  },
  99: {
    text: "Severe thunderstorm with hail",
    icon: "fa-cloud-bolt",
    cssClass: "weather-stormy",
  },
};

export function getWeatherInfo(code) {
  return (
    weatherCodeMap[code] || {
      text: "Unknown",
      icon: "fa-question",
      cssClass: "weather-cloudy",
    }
  );
}
