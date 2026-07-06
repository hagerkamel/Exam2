import { geocodeCity, getWeatherData } from "./weatherApi.js";
import { getWeatherInfo } from "./weatherCodes.js";
import {
  getSelection,
  hasCountrySelected,
} from "../component/selectionState.js";
import { renderEmptyState } from "../component/emptyState.js";
import { renderSelectionBadge } from "../component/selectionBadge.js";
import { showLoading, hideLoading } from "../component/loadingOverlay.js";
import { goToView } from "../component/router.js";

import { renderHeroCard } from "./weatherHeroCard.js";
import { renderDetailsGrid } from "./weatherDetailsGrid.js";
import { renderHourlyForecast } from "./weatherHourlyForecast.js";
import { renderDailyForecast } from "./weatherDailyForecast.js";

function renderNoCitySelected() {
  renderEmptyState("weather-content", {
    icon: "fa-solid fa-cloud-sun",
    title: "No City Selected",
    subtitle:
      "Select a country and city from the dashboard to check the weather",
  });
}

function renderWeather(weatherData, cityName) {
  const content = document.getElementById("weather-content");

  const current = weatherData.current;
  const daily = weatherData.daily;
  const hourly = weatherData.hourly;
  const currentInfo = getWeatherInfo(current.weather_code);

  content.innerHTML =
    renderHeroCard(current, daily, cityName, currentInfo) +
    renderDetailsGrid(current, daily) +
    renderHourlyForecast(hourly, current.time) +
    renderDailyForecast(daily);
}

export async function initWeatherView() {
  const selectionContainer = document.getElementById("weather-selection");

  if (!hasCountrySelected()) {
    selectionContainer.innerHTML = "";
    renderNoCitySelected();
    return;
  }

  const selection = getSelection();

  renderSelectionBadge("weather-selection", {
    countryCode: selection.countryCode,
    countryName: selection.countryName,
    mode: "city",
    city: selection.city,
  });

  if (!selection.city) {
    renderNoCitySelected();
    return;
  }

  showLoading();
  try {
    const coordinates = await geocodeCity(
      selection.city,
      selection.countryCode,
    );

    if (!coordinates) {
      renderEmptyState("weather-content", {
        icon: "fa-solid fa-cloud-sun",
        title: "Location Not Found",
        subtitle: "Couldn't find coordinates for this city",
      });
      return;
    }

    const weatherData = await getWeatherData(coordinates.lat, coordinates.lng);

    if (!weatherData) {
      renderEmptyState("weather-content", {
        icon: "fa-solid fa-cloud-sun",
        title: "No Weather Data",
        subtitle: "Couldn't load weather data for this location",
      });
      return;
    }

    renderWeather(weatherData, selection.city);
  } finally {
    hideLoading();
  }
}
