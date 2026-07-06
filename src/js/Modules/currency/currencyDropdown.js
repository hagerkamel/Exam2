// currencyDropdown.js
// Fills the From/To <select> elements with every currency code returned by the API

import { getCurrencyInfo } from "./currencyMeta.js";

export function fillCurrencySelect(selectElement, currencyCodes, selectedCode) {
  let optionsHtml = "";

  for (let i = 0; i < currencyCodes.length; i++) {
    const code = currencyCodes[i];
    const info = getCurrencyInfo(code);
    const isSelected = code === selectedCode;

    optionsHtml +=
      '<option value="' +
      code +
      '"' +
      (isSelected ? " selected" : "") +
      ">" +
      code +
      " - " +
      info.name +
      "</option>";
  }

  selectElement.innerHTML = optionsHtml;
}
