// Builds the 7-day forecast list

import { dayNames, monthNames } from "./weatherFormatters.js";
import { getWeatherInfo } from "./weatherCodes.js";

export function renderDailyForecast(daily) {
  let dailyHtml = "";

  for (let i = 0; i < daily.time.length; i++) {
    const dateObj = new Date(daily.time[i] + "T00:00:00");
    const dayInfo = getWeatherInfo(daily.weather_code[i]);
    const isToday = i === 0;
    const precip = daily.precipitation_probability_max[i];
    const dayLabel = isToday ? "Today" : dayNames[dateObj.getDay()];
    const precipOpacity = precip > 0 ? Math.max(precip / 100, 0.3) : 0.15;
    const precipText = precip > 0 ? "<span>" + precip + "%</span>" : "";

    dailyHtml +=
      '<div class="forecast-day' +
      (isToday ? " today" : "") +
      '">' +
      '<div class="forecast-day-name">' +
      '<span class="day-label">' +
      dayLabel +
      "</span>" +
      '<span class="day-date">' +
      dateObj.getDate() +
      " " +
      monthNames[dateObj.getMonth()] +
      "</span>" +
      "</div>" +
      '<div class="forecast-icon"><i class="fa-solid ' +
      dayInfo.icon +
      '"></i></div>' +
      '<div class="forecast-temps">' +
      '<span class="temp-max">' +
      Math.round(daily.temperature_2m_max[i]) +
      "°</span>" +
      '<span class="temp-min">' +
      Math.round(daily.temperature_2m_min[i]) +
      "°</span>" +
      "</div>" +
      '<div class="forecast-precip">' +
      '<div class="precip-indicator" style="opacity: ' +
      precipOpacity +
      '"></div>' +
      precipText +
      "</div>" +
      "</div>";
  }

  return (
    '<div class="weather-section">' +
    '<h3 class="weather-section-title"><i class="fa-solid fa-calendar-week"></i> 7-Day Forecast</h3>' +
    '<div class="forecast-list">' +
    dailyHtml +
    "</div>" +
    "</div>"
  );
}
