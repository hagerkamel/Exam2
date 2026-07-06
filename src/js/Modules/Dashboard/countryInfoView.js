// countryInfoView.js
// Replaces the static Egypt data in the "Country Information" card with real
// data for whatever country (and, if picked, city) the user selects + clicks
// Explore on. Data comes from the free countries.dev API (see
// countryInfoApi.js and cities.js).

import { getCountryInfo } from "./countryInfoApi.js";
import { getCityDetails } from "./cities.js";
import { startCountryClock } from "../component/liveTime.js";

const CONTAINER_ID = "dashboard-country-info";

// Keeps track of the running clock interval so we can stop the old one
// before starting a new one (otherwise switching countries quickly would
// leave multiple intervals running at once, all fighting over the same DOM node)
let activeClockInterval = null;

function stopActiveClock() {
  if (activeClockInterval) {
    console.log("[countryInfoView] Stopping previous clock interval");
    clearInterval(activeClockInterval);
    activeClockInterval = null;
  }
}

function formatNumber(num) {
  return typeof num === "number" ? num.toLocaleString("en-US") : "--";
}

function renderErrorState() {
  console.log(
    "[countryInfoView] Rendering error state (fetch failed or no data)",
  );
  stopActiveClock();

  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    console.log("[countryInfoView] #" + CONTAINER_ID + " not found in DOM");
    return;
  }

  container.innerHTML =
    '<div class="empty-state">' +
    '<div class="empty-state-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>' +
    "<h3>Failed to load country information</h3>" +
    "<p>Please try again.</p>" +
    "</div>";
}

// country       -> raw object from countries.dev (see countryInfoApi.js)
// cityInfo      -> raw object from cities.js getCityDetails(), or null
// clockTimezone -> resolved IANA timezone string (e.g. "Africa/Cairo") to
//                  drive the live clock, or null if none could be resolved

function renderCountryInfo(country, cityInfo, clockTimezone) {
  const commonName = (country.name && country.name.common) || country.name;
  console.log(
    "[countryInfoView] Rendering country info for:",
    commonName,
    "| city:",
    cityInfo ? cityInfo.name : "(none selected)",
    "| clock timezone:",
    clockTimezone,
  );
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    console.log("[countryInfoView] #" + CONTAINER_ID + " not found in DOM");
    return;
  }
  const flagUrl =
    (country.flags && (country.flags.png || country.flags.svg)) || "";
  const capital = country.capital || "--";
  const currency =
    country.currencies && country.currencies.length > 0
      ? country.currencies[0].name +
        " (" +
        country.currencies[0].code +
        (country.currencies[0].symbol
          ? " " + country.currencies[0].symbol
          : "") +
        ")"
      : "--";
  const languages =
    country.languages && country.languages.length > 0
      ? country.languages
          .map(function (lang) {
            return lang.name;
          })
          .join(", ")
      : "--";
  const callingCode =
    country.callingCodes && country.callingCodes.length > 0
      ? "+" + country.callingCodes[0]
      : "--";
  const topLevelDomain =
    country.topLevelDomain && country.topLevelDomain.length > 0
      ? country.topLevelDomain[0]
      : "--";
  const demonym = country.demonym || "--";
  const region = country.region || "--";
  const subregion = country.subregion || "--";
  const areaKm = country.area ? formatNumber(country.area) + " km²" : "--";
  const population = formatNumber(country.population);
  const mapsLink =
    country.maps && country.maps.googleMaps ? country.maps.googleMaps : "#";

  let neighborsHtml = "";
  if (country.borders && country.borders.length > 0) {
    for (let i = 0; i < country.borders.length; i++) {
      neighborsHtml +=
        '<span class="extra-tag border-tag">' + country.borders[i] + "</span>";
    }
  } else {
    neighborsHtml = '<span class="extra-tag">No neighboring countries</span>';
  }

  // Dynamic "selected city" block - only rendered when a city was picked AND
  // we managed to find real data for it. This is what replaces the old
  // static "Cairo" values: whichever city the user actually chose shows its
  // own live population/timezone here.
  let cityBlockHtml = "";
  if (cityInfo) {
    cityBlockHtml =
      '<div class="dashboard-country-extra">' +
      '<h4><i class="fa-solid fa-city"></i> Selected City: ' +
      cityInfo.name +
      "</h4>" +
      '<div class="extra-tags">' +
      '<span class="extra-tag">Population: ' +
      formatNumber(cityInfo.population) +
      "</span>" +
      '<span class="extra-tag">Timezone: ' +
      (cityInfo.timezone || "--") +
      "</span>" +
      "</div></div>";
  }

  container.innerHTML =
    '<div class="dashboard-country-header">' +
    '<img src="' +
    flagUrl +
    '" alt="' +
    commonName +
    '" class="dashboard-country-flag" />' +
    '<div class="dashboard-country-title">' +
    "<h3>" +
    commonName +
    (cityInfo ? " • " + cityInfo.name : "") +
    "</h3>" +
    '<span class="region"><i class="fa-solid fa-location-dot"></i> ' +
    region +
    " • " +
    subregion +
    "</span>" +
    "</div>" +
    "</div>" +
    '<div class="dashboard-local-time">' +
    '<div class="local-time-display">' +
    '<i class="fa-solid fa-clock"></i>' +
    '<span class="local-time-value" id="country-local-time">--:--:--</span>' +
    '<span class="local-time-zone"></span>' +
    "</div>" +
    "</div>" +
    '<div class="dashboard-country-grid">' +
    '<div class="dashboard-country-detail"><i class="fa-solid fa-building-columns"></i><span class="label">Capital</span><span class="value">' +
    capital +
    "</span></div>" +
    '<div class="dashboard-country-detail"><i class="fa-solid fa-users"></i><span class="label">Population</span><span class="value">' +
    population +
    "</span></div>" +
    '<div class="dashboard-country-detail"><i class="fa-solid fa-ruler-combined"></i><span class="label">Area</span><span class="value">' +
    areaKm +
    "</span></div>" +
    '<div class="dashboard-country-detail"><i class="fa-solid fa-globe"></i><span class="label">Continent</span><span class="value">' +
    region +
    "</span></div>" +
    '<div class="dashboard-country-detail"><i class="fa-solid fa-phone"></i><span class="label">Calling Code</span><span class="value">' +
    callingCode +
    "</span></div>" +
    '<div class="dashboard-country-detail"><i class="fa-solid fa-globe"></i><span class="label">Domain</span><span class="value">' +
    topLevelDomain +
    "</span></div>" +
    '<div class="dashboard-country-detail"><i class="fa-solid fa-user-group"></i><span class="label">Demonym</span><span class="value">' +
    demonym +
    "</span></div>" +
    "</div>" +
    '<div class="dashboard-country-extras">' +
    '<div class="dashboard-country-extra"><h4><i class="fa-solid fa-coins"></i> Currency</h4><div class="extra-tags"><span class="extra-tag">' +
    currency +
    "</span></div></div>" +
    '<div class="dashboard-country-extra"><h4><i class="fa-solid fa-language"></i> Languages</h4><div class="extra-tags"><span class="extra-tag">' +
    languages +
    "</span></div></div>" +
    '<div class="dashboard-country-extra"><h4><i class="fa-solid fa-map-location-dot"></i> Neighbors</h4><div class="extra-tags">' +
    neighborsHtml +
    "</div></div>" +
    cityBlockHtml +
    "</div>" +
    '<div class="dashboard-country-actions">' +
    '<a href="' +
    mapsLink +
    '" target="_blank" class="btn-map-link"><i class="fa-solid fa-map"></i> View on Google Maps</a>' +
    "</div>";

  stopActiveClock();

  if (clockTimezone) {
    console.log(
      "[countryInfoView] Starting live clock with IANA timezone:",
      clockTimezone,
    );
    activeClockInterval = startCountryClock(clockTimezone);
  } else {
    console.log(
      "[countryInfoView] No resolvable timezone - skipping live clock",
    );
    stopActiveClock(); // still clears the display via startCountryClock(null) path if ever called directly
  }
}

// Called from destinationSearch.js whenever Explore is clicked.
// countryCode: ISO alpha-2 code (required)
// countryName: display name, used only for logging
// cityName: the city string the user picked, or "" if none
export async function loadCountryInfo(countryCode, countryName, cityName) {
  console.log(
    "[countryInfoView] loadCountryInfo() called - country:",
    countryName,
    "(" + countryCode + ")",
    "| city:",
    cityName || "(none)",
  );

  try {
    const country = await getCountryInfo(countryCode);

    if (!country) {
      console.log(
        "[countryInfoView] getCountryInfo() returned null - showing error state",
      );
      renderErrorState();
      return;
    }

    // City lookup is best-effort: if it fails or finds nothing, we still
    // show the country card, just without the "Selected City" block.
    let cityInfo = null;
    if (cityName) {
      try {
        cityInfo = await getCityDetails(cityName, countryCode);
      } catch (cityError) {
        console.log(
          "[countryInfoView] City lookup threw an error - continuing without it:",
          cityError,
        );
        cityInfo = null;
      }
    }

    // Resolve a real IANA timezone for the clock. countries.dev's country
    // record only gives a fixed offset like "UTC+02:00" (no DST awareness),
    // so instead we look up an actual city's timezone (which IS a proper
    // IANA zone, e.g. "Africa/Cairo") - either the selected city, or the
    // country's capital if no city was picked. Intl then handles DST for us.
    let clockTimezone = null;
    if (cityInfo && cityInfo.timezone) {
      clockTimezone = cityInfo.timezone;
      console.log(
        "[countryInfoView] Using selected city's timezone for clock:",
        clockTimezone,
      );
    } else if (country.capital) {
      try {
        const capitalCity = await getCityDetails(country.capital, countryCode);
        if (capitalCity && capitalCity.timezone) {
          clockTimezone = capitalCity.timezone;
          console.log(
            "[countryInfoView] Using capital's timezone for clock:",
            country.capital,
            "->",
            clockTimezone,
          );
        } else {
          console.log(
            "[countryInfoView] Could not resolve a timezone for the capital:",
            country.capital,
          );
        }
      } catch (capitalError) {
        console.log(
          "[countryInfoView] Capital timezone lookup threw an error:",
          capitalError,
        );
      }
    }

    renderCountryInfo(country, cityInfo, clockTimezone);
  } catch (error) {
    console.log(
      "[countryInfoView] Unexpected error while loading country info:",
      error,
    );
    renderErrorState();
  }
}
