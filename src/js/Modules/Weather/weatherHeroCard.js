// Builds the big top card: location, current temperature, condition, feels-like, high/low

import { formatFullDate } from "./weatherFormatters.js";

export function renderHeroCard(current, daily, cityName, currentInfo) {
  const now = new Date();

  return (
    '<div class="weather-hero-card ' +
    currentInfo.cssClass +
    '">' +
    '<div class="weather-location">' +
    '<i class="fa-solid fa-location-dot"></i>' +
    "<span>" +
    cityName +
    "</span>" +
    '<span class="weather-time">' +
    formatFullDate(now) +
    "</span>" +
    "</div>" +
    '<div class="weather-hero-main">' +
    '<div class="weather-hero-left">' +
    '<div class="weather-hero-icon"><i class="fa-solid ' +
    currentInfo.icon +
    '"></i></div>' +
    '<div class="weather-hero-temp">' +
    '<span class="temp-value">' +
    Math.round(current.temperature_2m) +
    "</span>" +
    '<span class="temp-unit">°C</span>' +
    "</div>" +
    "</div>" +
    '<div class="weather-hero-right">' +
    '<div class="weather-condition">' +
    currentInfo.text +
    "</div>" +
    '<div class="weather-feels">Feels like ' +
    Math.round(current.apparent_temperature) +
    "°C</div>" +
    '<div class="weather-high-low">' +
    '<span class="high"><i class="fa-solid fa-arrow-up"></i> ' +
    Math.round(daily.temperature_2m_max[0]) +
    "°</span>" +
    '<span class="low"><i class="fa-solid fa-arrow-down"></i> ' +
    Math.round(daily.temperature_2m_min[0]) +
    "°</span>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>"
  );
}
