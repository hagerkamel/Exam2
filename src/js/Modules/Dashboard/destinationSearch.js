// destinationSearch.js
// All logic specific to the "Select Your Destination" search section

import {
  setSelectedCountry,
  setSelectedCity,
  setSelectedYear,
  clearSelectedCity,
} from "../component/selectionState.js";
import { getAllCountries, getFlagUrl } from "./countries.js";
import { getCitiesByCountry } from "./cities.js";
import { createDropdown, renderDropdownItems } from "../component/dropdown.js";
import { loadCountryInfo } from "./countryInfoView.js";
import { showToast } from "../component/toastNotifications.js";

class DestinationSearch {
  constructor() {
    // ------- Element references -------
    this.countryInput = document.getElementById("countryInput");
    this.countryInputText = document.getElementById("countryInputText");
    this.countryDropdown = document.getElementById("countryDropdown");
    this.countrySearch = document.getElementById("countrySearch");
    this.countryList = document.getElementById("countryList");

    this.cityInput = document.getElementById("cityInput");
    this.cityInputText = document.getElementById("cityInputText");
    this.cityDropdown = document.getElementById("cityDropdown");
    this.cityList = document.getElementById("cityList");

    this.yearInput = document.getElementById("yearInput");
    this.yearInputText = document.getElementById("yearInputText");
    this.yearDropdown = document.getElementById("yearDropdown");
    this.yearList = document.getElementById("yearList");

    this.selectedBox = document.getElementById("selected-destination");
    this.selectedFlag = document.getElementById("selected-country-flag");
    this.selectedCountryName = document.getElementById("selected-country-name");
    this.selectedCityName = document.getElementById("selected-city-name");
    this.clearBtn = document.getElementById("clear-selection-btn");
    this.exploreButton = document.getElementById("global-search-btn");

    // ------- State -------
    this.allCountries = [];
    this.selectedCountryCode = "";
    this.selectedCountryNameValue = "";
    this.selectedCity = "";
    this.selectedYear = "2026";

    // ------- Dropdown controllers -------
    this.countryDD = createDropdown(this.countryInput, this.countryDropdown);
    this.cityDD = createDropdown(this.cityInput, this.cityDropdown);
    this.yearDD = createDropdown(this.yearInput, this.yearDropdown);

    this.#bindEvents();
    this.init();
  }

  // ------- Country -------
  renderCountryList(countries) {
    renderDropdownItems(
      this.countryList,
      countries,
      (itemEl, country) => {
        itemEl.innerHTML = `
          <img src="${getFlagUrl(country.countryCode)}" alt="" class="w-[22px] h-4 object-cover rounded-sm shrink-0">
          <span>${country.name}</span>
          <span class="ml-auto text-slate-400 text-xs">${country.countryCode}</span>
        `;
      },
      (country) => this.selectCountry(country),
    );
  }

  selectCountry(country) {
    this.selectedCountryCode = country.countryCode;
    this.selectedCountryNameValue = country.name;
    setSelectedCountry(country.countryCode, country.name);
    clearSelectedCity();

    this.countryInputText.textContent = country.name;
    this.countryDD.close();

    this.selectedCity = "";
    this.cityInputText.textContent = "Select City";

    this.renderCityList(this.selectedCountryCode);
    this.updateSelectedDestination();
  }

  // ------- City -------
  // Cities come from the countries.dev Cities API (see cities.js), so this
  // has to be async instead of reading a static local list.
  async renderCityList(countryCode) {
    this.cityList.innerHTML = `<div class="px-3.5 py-2.5 text-sm text-slate-400">Loading cities...</div>`;

    let cities = [];
    try {
      cities = await getCitiesByCountry(countryCode);
    } catch {
      cities = [];
    }

    if (!cities || cities.length === 0) {
      this.cityList.innerHTML = `<div class="px-3.5 py-2.5 text-sm text-slate-400">No cities available</div>`;
      return;
    }

    renderDropdownItems(
      this.cityList,
      cities,
      (itemEl, city) => {
        itemEl.textContent = city.name;
      },
      (city) => {
        this.selectedCity = city.name;
        setSelectedCity(city.name);
        this.cityInputText.textContent = city.name;
        this.cityDD.close();
        this.updateSelectedDestination();
      },
    );
  }

  // ------- Year -------
  renderYearList() {
    const years = ["2026", "2027", "2028"];

    renderDropdownItems(
      this.yearList,
      years,
      (itemEl, year) => {
        itemEl.textContent = year;
      },
      (year) => {
        this.selectedYear = year;
        setSelectedYear(year);
        this.yearInputText.textContent = year;
        this.yearDD.close();
      },
    );
  }

  // ------- Selected destination box -------
  updateSelectedDestination() {
    if (this.selectedCountryCode === "") {
      this.selectedBox.classList.remove("active");
      return;
    }

    this.selectedFlag.src = getFlagUrl(this.selectedCountryCode, "w80");
    this.selectedFlag.alt = this.selectedCountryNameValue;
    this.selectedCountryName.textContent = this.selectedCountryNameValue;
    this.selectedCityName.textContent = this.selectedCity
      ? `• ${this.selectedCity}`
      : "";
    this.selectedBox.classList.add("active");
  }

  // ------- Handlers -------
  handleCountrySearch() {
    const searchValue = this.countrySearch.value.toLowerCase();
    const filtered = this.allCountries.filter((country) =>
      country.name.toLowerCase().includes(searchValue),
    );
    this.renderCountryList(filtered);
  }

  handleClearSelection() {
    this.selectedCountryCode = "";
    this.selectedCountryNameValue = "";
    this.selectedCity = "";
    this.countryInputText.textContent = "Select Country";
    this.cityInputText.textContent = "Select City";
    this.cityList.innerHTML = "";
    this.selectedBox.classList.remove("active");
  }

  handleExploreClick() {
    if (this.selectedCountryNameValue === "") {
      return;
    }

    const label = this.selectedCity
      ? `${this.selectedCountryNameValue}, ${this.selectedCity}`
      : this.selectedCountryNameValue;

    showToast(`Exploring ${label}!`, "success", 2500);

    // Fetches real country (+ city, if one was picked) data and re-renders
    // the "Country Information" card - shows the error state on its own if
    // the request fails
    loadCountryInfo(
      this.selectedCountryCode,
      this.selectedCountryNameValue,
      this.selectedCity,
    );
  }

  // ------- Private: wire up event listeners -------
  #bindEvents() {
    this.countrySearch.addEventListener("input", () =>
      this.handleCountrySearch(),
    );
    this.clearBtn.addEventListener("click", () => this.handleClearSelection());
    this.exploreButton.addEventListener("click", () =>
      this.handleExploreClick(),
    );
  }

  // ------- Init -------
  async init() {
    this.allCountries = await getAllCountries();
    this.renderCountryList(this.allCountries);
    this.renderYearList();
    setSelectedYear(this.selectedYear);
  }
}

export function initDestinationSearch() {
  return new DestinationSearch();
}
