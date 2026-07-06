// currencyResult.js
// Builds the HTML for the conversion result and for each Quick Convert card

import { getCurrencyInfo } from "./currencyMeta.js";

// Formats a number with thousands separators and 2 decimals, e.g. 3090 -> "3,090.00"
function formatAmount(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function renderConversionResult(
  fromAmount,
  fromCode,
  toAmount,
  toCode,
  rate,
  updateLabel,
) {
  const resultBox = document.getElementById("currency-result");

  resultBox.innerHTML =
    '<div class="conversion-display">' +
    '<div class="conversion-from">' +
    '<span class="amount">' +
    formatAmount(fromAmount) +
    "</span>" +
    '<span class="currency-code">' +
    fromCode +
    "</span>" +
    "</div>" +
    '<div class="conversion-equals"><i class="fa-solid fa-equals"></i></div>' +
    '<div class="conversion-to">' +
    '<span class="amount">' +
    formatAmount(toAmount) +
    "</span>" +
    '<span class="currency-code">' +
    toCode +
    "</span>" +
    "</div>" +
    "</div>" +
    '<div class="exchange-rate-info">' +
    "<p>1 " +
    fromCode +
    " = " +
    rate.toFixed(4) +
    " " +
    toCode +
    "</p>" +
    "<small>Last updated: " +
    updateLabel +
    "</small>" +
    "</div>";
}

export function renderPopularCurrencyCard(code, rate) {
  const info = getCurrencyInfo(code);

  let flagHtml;
  if (info.countryCode) {
    flagHtml =
      '<img src="https://flagcdn.com/w40/' +
      info.countryCode +
      '.png" alt="' +
      code +
      '" class="flag" />';
  } else {
    flagHtml =
      '<div class="flag flag-placeholder"><i class="fa-solid fa-coins"></i></div>';
  }

  return (
    '<div class="popular-currency-card" data-code="' +
    code +
    '">' +
    flagHtml +
    '<div class="info">' +
    '<div class="code">' +
    code +
    "</div>" +
    '<div class="name">' +
    info.name +
    "</div>" +
    "</div>" +
    '<div class="rate">' +
    rate.toFixed(4) +
    "</div>" +
    "</div>"
  );
}
