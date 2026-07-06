import { fetchData } from "../component/api.js";

const BASE_URL = "https://date.nager.at/api/v3/PublicHolidays";

export async function getPublicHolidays(year, countryCode) {
  const url = BASE_URL + "/" + year + "/" + countryCode;
  const data = await fetchData(url);
  return data;
}
