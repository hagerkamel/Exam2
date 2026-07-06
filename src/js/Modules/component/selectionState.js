// Single shared source of truth for the user's current selection
// Any page (Holidays, Events, Weather...) reads from here instead of
// duplicating its own country/city/year state.

let selection = {
  countryCode: null,
  countryName: null,
  city: null,
  year: null,
};

export function setSelectedCountry(code, name) {
  selection.countryCode = code;
  selection.countryName = name;
}

export function setSelectedCity(cityName) {
  selection.city = cityName;
}

export function setSelectedYear(year) {
  selection.year = year;
}

export function clearSelectedCity() {
  selection.city = null;
}

export function clearSelection() {
  selection = { countryCode: null, countryName: null, city: null, year: null };
}

// Returns the full selection object at once - most pages will just use this
export function getSelection() {
  return selection;
}

// Convenience helper: true only if a country has actually been picked
export function hasCountrySelected() {
  return selection.countryCode !== null;
}
