import { fetchData } from "../component/api.js";
import { showLoading, hideLoading } from "../component/loadingOverlay.js";
import {
  getSelection,
  hasCountrySelected,
} from "../component/selectionState.js";
import { renderSelectionBadge } from "../component/selectionBadge.js";
import { renderEmptyState } from "../component/emptyState.js";
import { goToView } from "../component/router.js";

const SUNRISE_SUNSET_URL = "https://api.sunrise-sunset.org/json";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

class SunTimesApi {
  async getCoordinates(city) {
    const url =
      GEOCODING_URL + "?name=" + encodeURIComponent(city) + "&count=1";
    const data = await fetchData(url);
    if (!data || !data.results || data.results.length === 0) return null;
    const r = data.results[0];
    return { lat: r.latitude, lng: r.longitude, timezone: r.timezone || null };
  }

  async getSunTimes(lat, lng, timezone) {
    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lng),
      formatted: "0",
    });
    // No "date" param on purpose: without it the API defaults to "today"
    // measured in the tzid's own calendar.
    if (timezone) params.set("tzid", timezone);

    const data = await fetchData(SUNRISE_SUNSET_URL + "?" + params.toString());
    if (!data || data.status !== "OK") return null;
    return data.results;
  }
}

class SunTimesFormatter {
  static time(iso) {
    if (!iso) return "--:--";
    const match = iso.match(/T(\d{2}):(\d{2})/);
    if (!match) return "--:--";

    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;

    return String(hours).padStart(2, "0") + ":" + minutes + " " + period;
  }

  static duration(seconds) {
    if (seconds == null) return "--";
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    return h + "h " + m + "m";
  }

  static percent(seconds) {
    if (seconds == null) return 0;
    return Math.round((seconds / 86400) * 1000) / 10;
  }

  static date(d) {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  static day(d) {
    return d.toLocaleDateString("en-US", { weekday: "long" });
  }
}

class SunTimesView {
  setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  showContent() {
    const content = document.getElementById("sun-times-content");
    const empty = document.getElementById("sun-times-empty");
    if (content) content.classList.remove("hidden");
    if (empty) {
      empty.classList.add("hidden");
      empty.innerHTML = "";
    }
  }

  showEmpty(config) {
    const content = document.getElementById("sun-times-content");
    if (content) content.classList.add("hidden");
    renderEmptyState("sun-times-empty", config);
    const empty = document.getElementById("sun-times-empty");
    if (empty) empty.classList.remove("hidden");
  }

  // Badge reflects whatever is selected: nothing, country only, or country+city.
  // It ONLY updates the badge markup - it must never touch the main
  // content/empty containers, that's initSunTimesView's job.
  updateBadge(selection) {
    const badge = document.getElementById("sun-selection-badge");
    if (!badge) return;

    if (!selection.countryCode) {
      badge.innerHTML = "";
      return;
    }

    renderSelectionBadge("sun-selection-badge", {
      countryCode: selection.countryCode,
      countryName: selection.countryName,
      mode: "city",
      city: selection.city,
    });
  }

  render(city, results, dateObj) {
    this.setText("sun-city-name", city);
    this.setText("sun-date", SunTimesFormatter.date(dateObj));
    this.setText("sun-day", SunTimesFormatter.day(dateObj));

    this.setText(
      "sun-dawn-time",
      SunTimesFormatter.time(results.civil_twilight_begin),
    );
    this.setText("sun-sunrise-time", SunTimesFormatter.time(results.sunrise));
    this.setText("sun-noon-time", SunTimesFormatter.time(results.solar_noon));
    this.setText("sun-sunset-time", SunTimesFormatter.time(results.sunset));
    this.setText(
      "sun-dusk-time",
      SunTimesFormatter.time(results.civil_twilight_end),
    );

    const dayLength = SunTimesFormatter.duration(results.day_length);
    const dayPercent = SunTimesFormatter.percent(results.day_length);
    const nightLength = SunTimesFormatter.duration(86400 - results.day_length);

    this.setText("sun-daylength-time", dayLength);
    this.setText("sun-stat-daylight", dayLength);
    this.setText("sun-stat-percent", dayPercent + "%");
    this.setText("sun-stat-darkness", nightLength);

    const fill = document.getElementById("sun-progress-fill");
    if (fill) fill.style.width = dayPercent + "%";

    this.showContent();
  }
}

const api = new SunTimesApi();
const view = new SunTimesView();

export async function initSunTimesView() {
  const selection = getSelection();

  // Badge reflects whatever is selected, even partially (country only)
  view.updateBadge(selection);

  if (!hasCountrySelected()) {
    view.showEmpty({
      icon: "fa-solid fa-cloud-sun",
      title: "No Country Selected",
      subtitle:
        "Select a country and city from the dashboard to check the sun times",
      onButtonClick: function () {
        goToView("dashboard");
      },
    });
    return;
  }

  if (!selection.city) {
    view.showEmpty({
      icon: "fa-solid fa-cloud-sun",
      title: "No City Selected",
      subtitle:
        "Select a country and city from the dashboard to check the sun times",
      onButtonClick: function () {
        goToView("dashboard");
      },
    });
    return;
  }

  showLoading();
  try {
    const coords = await api.getCoordinates(selection.city);
    if (!coords) {
      view.showEmpty({
        icon: "fa-solid fa-triangle-exclamation",
        title: "Location Not Found",
        subtitle: "Couldn't find coordinates for this city",
      });
      return;
    }

    const results = await api.getSunTimes(
      coords.lat,
      coords.lng,
      coords.timezone,
    );
    if (!results) {
      view.showEmpty({
        icon: "fa-solid fa-triangle-exclamation",
        title: "No Sun Data",
        subtitle: "Couldn't load sun times for this location",
      });
      return;
    }

    view.render(selection.city, results, new Date());
  } finally {
    hideLoading();
  }
}
