// currencyApi.js
// Handles all requests to the ExchangeRate-API

const API_KEY = "adabf5c9e9736b0fa04df164";
const BASE_URL = "https://v6.exchangerate-api.com/v6/" + API_KEY;

// Gets all conversion rates relative to one base currency (e.g. "USD")
// Used once on page load to fill the dropdowns and the Quick Convert grid
export async function getLatestRates(baseCurrency) {
  const url = BASE_URL + "/latest/" + baseCurrency;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.result !== "success") {
      console.error("Exchange rate request failed:", data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching latest rates:", error);
    return null;
  }
}

// Converts a specific amount directly between two currencies
// Used every time the user clicks the "Convert" button
export async function convertPair(fromCurrency, toCurrency, amount) {
  const url =
    BASE_URL + "/pair/" + fromCurrency + "/" + toCurrency + "/" + amount;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.result !== "success") {
      console.error("Currency conversion failed:", data);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error converting currency:", error);
    return null;
  }
}
