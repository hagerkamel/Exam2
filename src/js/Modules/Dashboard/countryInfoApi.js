// countryInfoApi.js
// Fetches full country info (population, area, currency, languages, etc.)
// for the "Country Information" card on the dashboard.
//
// Uses countries.dev - a free, keyless country-data API (no API key needed,
// no CORS/domain-restriction issues, works from any origin including
// http://127.0.0.1:5501 during local testing).
// Docs: https://countries.dev/docs/api/alpha

import { fetchData } from "../component/api.js";

class CountryInfoApi {
  static BASE_URL = "https://countries.dev/alpha/";

  // countryCode must be an ISO alpha-2 (e.g. "EG") or alpha-3 (e.g. "EGY") code.
  // Returns the raw country object, or null if it couldn't be found/fetched.
  static async getCountryInfo(countryCode) {
    if (!countryCode) {
      return null;
    }

    // full=true asks for every field (population, area, borders, currencies,
    // languages, timezones, topLevelDomain, demonym, maps, flags, etc.)
    const url = `${CountryInfoApi.BASE_URL}${encodeURIComponent(countryCode)}?full=true`;
    const country = await fetchData(url);

    if (!country || !country.name) {
      return null;
    }

    return country;
  }
}

export const getCountryInfo = (countryCode) =>
  CountryInfoApi.getCountryInfo(countryCode);

export default CountryInfoApi;
