// longWeekendsCard.js
// Builds the HTML for a single long weekend card

import { buildDaysVisual, formatDateRange } from "./longWeekendsFormatters.js";

export function renderLongWeekendCard(weekend, index, countryCode) {
  const cardNumber = index + 1;
  const days = buildDaysVisual(
    weekend.startDate,
    weekend.endDate,
    weekend.bridgeDays,
    countryCode,
  );

  // Build the row of day boxes (Wed 7, Thu 8, Fri 9, Sat 10...)
  let daysHtml = "";
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    let dayClass = "lw-day";

    if (day.isBridge) {
      dayClass += " bridge";
    } else if (day.isWeekend) {
      dayClass += " weekend";
    }

    daysHtml +=
      '<div class="' +
      dayClass +
      '">' +
      '<span class="name">' +
      day.dayName +
      "</span> " +
      '<span class="num">' +
      day.dayNum +
      "</span>" +
      "</div>";
  }

  // Build the info box (success if free, warning if a bridge day is needed)
  let infoBoxHtml = "";
  if (weekend.needBridgeDay) {
    infoBoxHtml =
      '<div class="lw-info-box warning">' +
      '<i class="fa-solid fa-info-circle"></i> Requires taking a bridge day off' +
      "</div>";
  } else {
    infoBoxHtml =
      '<div class="lw-info-box success">' +
      '<i class="fa-solid fa-check-circle"></i> No extra days off needed!' +
      "</div>";
  }

  return (
    '<div class="lw-card">' +
    '<div class="lw-card-header">' +
    '<span class="lw-badge"><i class="fa-solid fa-calendar-days"></i> ' +
    weekend.dayCount +
    " Days</span>" +
    '<button class="holiday-action-btn save-btn"><i class="fa-regular fa-heart"></i></button>' +
    "</div>" +
    "<h3>Long Weekend #" +
    cardNumber +
    "</h3>" +
    '<div class="lw-dates">' +
    '<i class="fa-regular fa-calendar"></i> ' +
    formatDateRange(weekend.startDate, weekend.endDate) +
    "</div>" +
    infoBoxHtml +
    '<div class="lw-days-visual">' +
    daysHtml +
    "</div>" +
    "</div>"
  );
}
