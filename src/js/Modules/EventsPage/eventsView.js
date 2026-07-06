import { getEvents } from "./eventsApi.js";
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

// Format "2026-02-15" + "20:00:00" into "Feb 15, 2026 at 20:00"
function formatEventDateTime(dateStr, timeStr) {
  if (!dateStr) {
    return "Date TBA";
  }

  const dateObj = new Date(dateStr + "T00:00:00");
  const monthName = monthNames[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  const timePart = timeStr ? " at " + timeStr.slice(0, 5) : "";

  return monthName + " " + day + ", " + year + timePart;
}

// Converts the raw event (as it comes from the API/normalizeEvent) into the
// shape Plan.fromEvent() actually expects: dateLabel/venue/city -
// NOT date/time/venueName/venueCity. Passing the raw event straight into
// Plan.fromEvent() is what was producing "undefined" everywhere.
function buildEventPlan(event) {
  return Plan.fromEvent({
    id: event.id,
    name: event.name,
    dateLabel: formatEventDateTime(event.date, event.time),
    venue: event.venueName,
    city: event.venueCity,
  });
}

function renderEventCard(event) {
  const card = document.createElement("div");
  card.className = "event-card";

  card.innerHTML =
    '<div class="event-card-image">' +
    '<img src="' +
    event.imageUrl +
    '" alt="' +
    event.name +
    '" />' +
    '<span class="event-card-category">' +
    event.category +
    "</span>" +
    '<button class="event-card-save save-btn"><i class="fa-regular fa-heart"></i></button>' +
    "</div>" +
    '<div class="event-card-body">' +
    "<h3>" +
    event.name +
    "</h3>" +
    '<div class="event-card-info">' +
    '<div><i class="fa-regular fa-calendar"></i>' +
    formatEventDateTime(event.date, event.time) +
    "</div>" +
    '<div><i class="fa-solid fa-location-dot"></i>' +
    event.venueName +
    ", " +
    event.venueCity +
    "</div>" +
    "</div>" +
    '<div class="event-card-footer">' +
    '<button class="btn-event save-btn"><i class="fa-regular fa-heart"></i> Save</button>' +
    '<a href="' +
    event.ticketUrl +
    '" target="_blank" class="btn-buy-ticket">' +
    '<i class="fa-solid fa-ticket"></i> Buy Tickets' +
    "</a>" +
    "</div>" +
    "</div>";

  // ONE plan object, built once, shared by both Save buttons (the heart icon
  // on the image, and the "Save" text button in the footer). attachSaveButton
  // handles the click listener, the storage call, the toast, AND the red
  // heart styling on its own - nothing else needs to be wired up here.
  const plan = buildEventPlan(event);
  attachSaveButton(card.querySelector(".event-card-save"), plan);
  attachSaveButton(card.querySelector(".btn-event"), plan);

  return card;
}

function renderEvents(events) {
  const content = document.getElementById("events-content");
  content.innerHTML = "";

  if (!events || events.length === 0) {
    renderEmptyState("events-content", {
      icon: "fa-solid fa-ticket",
      title: "No Events Found",
      subtitle: "No events found for this location",
      buttonText: "Go to Dashboard",
      onButtonClick: function () {
        goToView("dashboard");
      },
    });
    return;
  }

  for (let i = 0; i < events.length; i++) {
    content.appendChild(renderEventCard(events[i]));
  }
}

function renderNoCitySelected() {
  renderEmptyState("events-content", {
    icon: "fa-solid fa-ticket",
    title: "No City Selected",
    subtitle: "Select a country and city from the dashboard to discover events",
    buttonText: "Go to Dashboard",
    onButtonClick: function () {
      goToView("dashboard");
    },
  });
}

export async function initEventsView() {
  const selectionContainer = document.getElementById("events-selection");

  // Case 1: no country at all -> hide badge, show "No City Selected"
  if (!hasCountrySelected()) {
    selectionContainer.innerHTML = "";
    renderNoCitySelected();
    return;
  }

  const selection = getSelection();

  // Badge shows as soon as a country exists (with or without a city)
  renderSelectionBadge("events-selection", {
    countryCode: selection.countryCode,
    countryName: selection.countryName,
    mode: "city",
    city: selection.city,
  });

  // Case 2: country selected but no city -> still "No City Selected"
  if (!selection.city) {
    renderNoCitySelected();
    return;
  }

  // Case 3 / 4: country + city -> fetch events
  showLoading();
  try {
    const events = await getEvents(selection.countryCode, selection.city);
    renderEvents(events); // handles both "has events" and "No Events Found" internally
  } finally {
    hideLoading();
  }
}
