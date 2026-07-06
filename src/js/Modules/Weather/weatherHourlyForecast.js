// Builds the horizontal scrolling list of hourly forecast items

import {
  formatHour,
  findCurrentHourIndex,
  findEndIndex,
} from "./weatherFormatters.js";
import { getWeatherInfo } from "./weatherCodes.js";

export function renderHourlyForecast(hourly, currentTimeIso) {
  const startIndex = findCurrentHourIndex(hourly.time, currentTimeIso) - 1;
  const endIndex = findEndIndex(startIndex, hourly.time.length);

  let hourlyHtml = "";
  for (let i = startIndex; i <= endIndex; i++) {
    const isNow = i === startIndex;
    const hourInfo = getWeatherInfo(hourly.weather_code[i]);
    const label = isNow ? "Now" : formatHour(hourly.time[i]);

    hourlyHtml +=
      '<div class="hourly-item' +
      (isNow ? " now" : "") +
      '">' +
      '<span class="hourly-time">' +
      label +
      "</span>" +
      '<div class="hourly-icon"><i class="fa-solid ' +
      hourInfo.icon +
      '"></i></div>' +
      '<span class="hourly-temp">' +
      Math.round(hourly.temperature_2m[i]) +
      "°</span>" +
      "</div>";
  }

  return (
    '<div class="weather-section">' +
    '<h3 class="weather-section-title"><i class="fa-solid fa-clock"></i> Hourly Forecast</h3>' +
    '<div class="hourly-scroll">' +
    hourlyHtml +
    "</div>" +
    "</div>"
  );
}
