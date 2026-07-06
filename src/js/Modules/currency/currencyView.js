// currencyView.js
// Main view: loads currency options, wires up the form, and handles conversions

import { getLatestRates, convertPair } from "./currencyApi.js";
import { getCountryCurrencyCode } from "./countryCurrencyApi.js";
import { fillCurrencySelect } from "./currencyDropdown.js";
import {
  renderConversionResult,
  renderPopularCurrencyCard,
} from "./currencyResult.js";
import { POPULAR_CURRENCY_CODES, formatUpdateDate } from "./currencyMeta.js";
import {
  getSelection,
  hasCountrySelected,
} from "../component/selectionState.js";
import { showLoading, hideLoading } from "../component/loadingOverlay.js";

const DEFAULT_FROM = "USD";
const DEFAULT_TO = "EGP";
const DEFAULT_AMOUNT = 100;

let amountInput;
let fromSelect;
let toSelect;
let convertBtn;
let swapBtn;
let lastUpdateLabel = "";
let destinationCurrencyCode = null; // currency of the country selected on the dashboard

// Fetches all rates once (relative to USD) and fills both dropdowns from the same list
async function loadCurrencyOptions() {
  const data = await getLatestRates(DEFAULT_FROM);
  if (!data) return null;

  const currencyCodes = Object.keys(data.conversion_rates).sort();
  const defaultTo = await resolveDefaultToCurrency(currencyCodes);

  fillCurrencySelect(fromSelect, currencyCodes, DEFAULT_FROM);
  fillCurrencySelect(toSelect, currencyCodes, defaultTo);

  lastUpdateLabel = formatUpdateDate(data.time_last_update_utc);

  return data;
}

function renderPopularCurrencies(conversionRates) {
  const grid = document.getElementById("popular-currencies");
  let cardsHtml = "";

  for (let i = 0; i < POPULAR_CURRENCY_CODES.length; i++) {
    const code = POPULAR_CURRENCY_CODES[i];
    const rate = conversionRates[code];

    if (rate === undefined) continue; // skip if this code isn't returned for some reason

    cardsHtml += renderPopularCurrencyCard(code, rate);
  }

  grid.innerHTML = cardsHtml;
}

// Decides which currency should be selected by default in the "To" dropdown.
// If a destination country is selected on the dashboard, use its local currency.
// Otherwise fall back to the original default (EGP).
async function resolveDefaultToCurrency(availableCurrencyCodes) {
  if (!hasCountrySelected()) {
    return DEFAULT_TO;
  }

  const selection = getSelection();
  const currencyCode = await getCountryCurrencyCode(selection.countryCode);

  if (currencyCode && availableCurrencyCodes.includes(currencyCode)) {
    destinationCurrencyCode = currencyCode;
    return currencyCode;
  }

  return DEFAULT_TO;
}

// When a Quick Convert card is clicked, convert between that currency
// and the destination country's currency (not always EGP)
function handleQuickConvertClick(event) {
  const card = event.target.closest(".popular-currency-card");
  if (!card) return;

  const clickedCode = card.dataset.code;
  const toCode = destinationCurrencyCode || DEFAULT_TO;

  fromSelect.value = clickedCode;
  toSelect.value = toCode;

  handleConvert();
}

async function handleConvert() {
  const amount = parseFloat(amountInput.value);

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  const fromCode = fromSelect.value;
  const toCode = toSelect.value;

  showLoading();
  try {
    const result = await convertPair(fromCode, toCode, amount);

    if (!result) {
      alert("Couldn't fetch the conversion rate. Please try again.");
      return;
    }

    renderConversionResult(
      amount,
      fromCode,
      result.conversion_result,
      toCode,
      result.conversion_rate,
      lastUpdateLabel,
    );
  } finally {
    hideLoading();
  }
}

function handleSwap() {
  const fromValue = fromSelect.value;
  const toValue = toSelect.value;

  fromSelect.value = toValue;
  toSelect.value = fromValue;

  handleConvert();
}

export async function initCurrencyView() {
  amountInput = document.getElementById("currency-amount");
  fromSelect = document.getElementById("currency-from");
  toSelect = document.getElementById("currency-to");
  convertBtn = document.getElementById("convert-btn");
  swapBtn = document.getElementById("swap-currencies-btn");

  amountInput.value = DEFAULT_AMOUNT;

  showLoading();
  const data = await loadCurrencyOptions();
  hideLoading();

  if (!data) {
    return;
  }

  renderPopularCurrencies(data.conversion_rates);

  convertBtn.addEventListener("click", handleConvert);
  swapBtn.addEventListener("click", handleSwap);
  document
    .getElementById("popular-currencies")
    .addEventListener("click", handleQuickConvertClick);

  // Also allow pressing Enter inside the amount field to convert
  amountInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      handleConvert();
    }
  });

  // Run one conversion right away so the result card shows real data, not the static placeholder
  handleConvert();
}
