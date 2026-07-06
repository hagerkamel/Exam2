// longWeekendsApi.js
// Handles all requests to the Nager.Date Long Weekend API

const BASE_URL = "https://date.nager.at/api/v3/LongWeekend";

// Fetches the list of long weekends for a given year and country code
// Example: fetchLongWeekends(2026, "EG")
export async function fetchLongWeekends(year, countryCode) {
  const url = BASE_URL + "/" + year + "/" + countryCode;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        "Long weekends request failed with status " + response.status,
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching long weekends:", error);
    return null;
  }
}
