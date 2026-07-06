// countryCurrencyApi.js
// Looks up the local currency code for a given country using countries.dev.
const BASE_URL = "https://countries.dev/alpha";

// Simple in-memory cache so we don't re-fetch the same country more than once
// while the app is open
const currencyCache = {};

export async function getCountryCurrencyCode(countryCode) {
  if (currencyCache[countryCode]) {
    return currencyCache[countryCode];
  }

  const url = BASE_URL + "/" + countryCode + "?fields=currencies";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        "Country currency request failed with status " + response.status,
      );
      return null;
    }

    const data = await response.json();
    const currencies = data.currencies;

    if (!currencies || currencies.length === 0) {
      return null;
    }

    const currencyCode = currencies[0].code; // most countries have a single main currency
    currencyCache[countryCode] = currencyCode;
    return currencyCode;
  } catch (error) {
    console.error("Error fetching country currency:", error);
    return null;
  }
}
