// cities.js
// Provides real, dynamic city data (population, timezone, coordinates) using
// the countries.dev Cities API - free, keyless, no CORS issues.
// Docs: https://countries.dev/docs/api/cities

import { fetchData } from "../component/api.js";

const CITIES_API = "https://countries.dev/cities";

// Returns an array of city objects for a given ISO alpha-2 country code:
// { geonameId, name, asciiName, countryCode, latitude, longitude, population, timezone }
export async function getCitiesByCountry(countryCode) {
  if (!countryCode) {
    return [];
  }

  const url =
    CITIES_API + "?country=" + encodeURIComponent(countryCode) + "&limit=20";
  const cities = await fetchData(url);

  if (!cities || !Array.isArray(cities)) {
    return [];
  }

  // Sort alphabetically (A→Z) by name before handing back to the dropdown
  const sortedCities = cities.slice().sort(function (a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
  return sortedCities;
}

// Fetches the full detail for one specific city (used to make the
// "Country Information" card react to whichever city was actually selected,
// instead of showing static capital-city data).
// Returns a single city object, or null if nothing matched / request failed.
export async function getCityDetails(cityName, countryCode) {
  if (!cityName || !countryCode) {
    return null;
  }

  const url =
    CITIES_API +
    "?q=" +
    encodeURIComponent(cityName) +
    "&country=" +
    encodeURIComponent(countryCode) +
    "&limit=1";

  const cities = await fetchData(url);

  if (!cities || !Array.isArray(cities) || cities.length === 0) {
    return null;
  }
  return cities[0];
}
