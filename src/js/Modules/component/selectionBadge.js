import { getFlagUrl } from "../Dashboard/countries.js";
// mode: "year" -> shows country + year (Holidays style)
// mode: "city" -> shows country + dot, and + city if a city is selected (Events style)
export function renderSelectionBadge(containerId, options) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const { countryCode, countryName, mode, year, city } = options;
  let suffixHtml = "";
  if (mode === "year") {
    suffixHtml = '<span class="selection-year">' + year + "</span>";
  } else if (mode === "city") {
    suffixHtml = city
      ? '<span class="selection-city">' + city + "</span>"
      : '<span class="selection-dot">•</span>';
  }

  container.innerHTML =
    '<div class="current-selection-badge">' +
    '<img src="' +
    getFlagUrl(countryCode) +
    '" alt="' +
    countryName +
    '" class="selection-flag" />' +
    "<span>" +
    countryName +
    "</span>" +
    suffixHtml +
    "</div>";
}
