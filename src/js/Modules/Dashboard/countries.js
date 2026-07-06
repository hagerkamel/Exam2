//countries.js
import { fetchData } from "../component/api.js";

const COUNTRIES_API = "https://date.nager.at/api/v3/AvailableCountries";

export function getFlagUrl(countryCode, size = "w40") {
  let code = countryCode.toLowerCase();
  return "https://flagcdn.com/" + size + "/" + code + ".png";
}

// Get all countries, sorted alphabetically by name
export async function getAllCountries() {
  let countries = await fetchData(COUNTRIES_API);

  if (countries === null) {
    return [];
  }

  countries.sort(function (a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return countries;
}
