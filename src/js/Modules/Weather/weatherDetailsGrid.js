// Builds the 5 small cards under the hero card: Humidity, Wind, UV Index, Precipitation, Sun times

import {
  getUVLevel,
  getWindDirectionLabel,
  formatSunTime,
} from "./weatherFormatters.js";

function renderHumidityCard(current) {
  const humidity = current.relative_humidity_2m;

  return (
    '<div class="weather-detail-card">' +
    '<div class="detail-icon humidity"><i class="fa-solid fa-droplet"></i></div>' +
    '<div class="detail-info">' +
    '<span class="detail-label">Humidity</span>' +
    '<span class="detail-value">' +
    humidity +
    "%</span>" +
    "</div>" +
    '<div class="detail-progress-bar">' +
    '<div class="detail-progress-fill" style="width: ' +
    humidity +
    '%"></div>' +
    "</div>" +
    "</div>"
  );
}

function renderWindCard(current) {
  // NOTE: current.wind_direction_10m must be requested in weatherApi.js (Open-Meteo "current" params)
  const speed = Math.round(current.wind_speed_10m);
  const directionLabel = getWindDirectionLabel(current.wind_direction_10m);

  return (
    '<div class="weather-detail-card">' +
    '<div class="detail-icon wind"><i class="fa-solid fa-wind"></i></div>' +
    '<div class="detail-info">' +
    '<span class="detail-label">Wind</span>' +
    '<span class="detail-value">' +
    speed +
    " km/h</span>" +
    "</div>" +
    '<span class="detail-subtext">' +
    directionLabel +
    "</span>" +
    "</div>"
  );
}

function renderUVCard(current) {
  const uvLevel = getUVLevel(current.uv_index);

  return (
    '<div class="weather-detail-card">' +
    '<div class="detail-icon uv"><i class="fa-solid fa-sun"></i></div>' +
    '<div class="detail-info">' +
    '<span class="detail-label">UV Index</span>' +
    '<span class="detail-value">' +
    Math.round(current.uv_index) +
    "</span>" +
    "</div>" +
    '<span class="detail-badge ' +
    uvLevel.cssClass +
    '">' +
    uvLevel.text +
    "</span>" +
    "</div>"
  );
}

function renderPrecipitationCard(daily) {
  // NOTE: daily.precipitation_sum must be requested in weatherApi.js for the "mm expected" text
  const precipChance = daily.precipitation_probability_max[0];
  const precipAmount = daily.precipitation_sum ? daily.precipitation_sum[0] : 0;

  return (
    '<div class="weather-detail-card">' +
    '<div class="detail-icon precip"><i class="fa-solid fa-cloud-rain"></i></div>' +
    '<div class="detail-info">' +
    '<span class="detail-label">Precipitation</span>' +
    '<span class="detail-value">' +
    precipChance +
    "%</span>" +
    "</div>" +
    '<span class="detail-subtext">' +
    precipAmount +
    "mm expected</span>" +
    "</div>"
  );
}

function renderSunTimesCard(daily) {
  return (
    '<div class="weather-detail-card sun-times-card">' +
    '<div class="sun-time-item">' +
    '<div class="sun-icon-circle"><i class="fa-solid fa-sunrise"></i></div>' +
    '<span class="detail-label">SUNRISE</span>' +
    '<span class="detail-value">' +
    formatSunTime(daily.sunrise[0]) +
    "</span>" +
    "</div>" +
    '<div class="sun-time-item">' +
    '<div class="sun-icon-circle"><i class="fa-solid fa-sunset"></i></div>' +
    '<span class="detail-label">SUNSET</span>' +
    '<span class="detail-value">' +
    formatSunTime(daily.sunset[0]) +
    "</span>" +
    "</div>" +
    "</div>"
  );
}

export function renderDetailsGrid(current, daily) {
  return (
    '<div class="weather-details-grid">' +
    renderHumidityCard(current) +
    renderWindCard(current) +
    renderUVCard(current) +
    renderPrecipitationCard(daily) +
    renderSunTimesCard(daily) +
    "</div>"
  );
}
