import { getPublicHolidays } from "./holidaysApi.js";
import {
  getSelection,
  hasCountrySelected,
} from "../component/selectionState.js";
import { renderEmptyState } from "../component/emptyState.js";
import { renderSelectionBadge } from "../component/selectionBadge.js";
import { showLoading, hideLoading } from "../component/loadingOverlay.js";
import { goToView } from "../component/router.js";
import { attachSaveButton } from "../plans/plansSaveHelper.js";
import { Plan } from "../plans/plan.js";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function parseHolidayDate(dateStr) {
  const dateObj = new Date(dateStr + "T00:00:00");
  return {
    day: dateObj.getDate(),
    month: monthNames[dateObj.getMonth()],
    weekday: dayNames[dateObj.getDay()],
    year: dateObj.getFullYear(),
  };
}

// Converts a raw holiday (Nager API shape) + the parsed date + country name
// into the shape Plan.fromHoliday() expects
function buildHolidayPlan(holiday, parsedDate, countryName) {
  const dateLabel =
    parsedDate.weekday +
    ", " +
    parsedDate.month +
    " " +
    parsedDate.day +
    ", " +
    parsedDate.year;
  return Plan.fromHoliday(holiday, dateLabel, countryName);
}

function renderHolidays(holidays, countryName) {
  const content = document.getElementById("holidays-content");
  content.innerHTML = "";

  if (!holidays || holidays.length === 0) {
    content.innerHTML =
      '<p class="no-results">No public holidays found for this year.</p>';
    return;
  }

  for (let i = 0; i < holidays.length; i++) {
    const holiday = holidays[i];
    const parsedDate = parseHolidayDate(holiday.date);
    const holidayTypes = holiday.types || ["Public"];

    let typeBadges = "";
    for (let j = 0; j < holidayTypes.length; j++) {
      typeBadges +=
        '<span class="holiday-type-badge ms-3">' + holidayTypes[j] + "</span>";
    }

    const card = document.createElement("div");
    card.className = "holiday-card";
    card.innerHTML =
      '<div class="holiday-card-header">' +
      '<div class="holiday-date-box">' +
      '<span class="day">' +
      parsedDate.day +
      "</span>" +
      '<span class="month">' +
      parsedDate.month +
      "</span>" +
      "</div>" +
      '<button class="holiday-action-btn save-btn"><i class="fa-regular fa-heart"></i></button>' +
      "</div>" +
      "<h3>" +
      holiday.localName +
      "</h3>" +
      '<p class="holiday-name">' +
      holiday.name +
      "</p>" +
      '<div class="holiday-card-footer">' +
      '<span class="holiday-day-badge"><i class="fa-regular fa-calendar"></i> ' +
      parsedDate.weekday +
      "</span>" +
      "<div>" +
      typeBadges +
      " </div>" +
      "</div>";

    content.appendChild(card);

    // Wire up the heart button: red-heart styling + toast + storage, all in one call
    const plan = buildHolidayPlan(holiday, parsedDate, countryName);
    attachSaveButton(card.querySelector(".holiday-action-btn"), plan);
  }
}

export async function initHolidaysView() {
  if (!hasCountrySelected()) {
    document.getElementById("holidays-selection").innerHTML = "";
    renderEmptyState("holidays-content", {
      icon: "fa-solid fa-calendar-xmark",
      title: "No Country Selected",
      subtitle:
        "Select a country from the dashboard to explore public holidays",
      onButtonClick: function () {
        goToView("dashboard");
      },
    });
    return;
  }

  const selection = getSelection();

  renderSelectionBadge("holidays-selection", {
    countryCode: selection.countryCode,
    countryName: selection.countryName,
    mode: "year",
    year: selection.year,
  });

  showLoading();
  try {
    const holidays = await getPublicHolidays(
      selection.year,
      selection.countryCode,
    );
    renderHolidays(holidays, selection.countryName);
  } finally {
    hideLoading();
  }
}
