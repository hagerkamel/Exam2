// longWeekendsFormatters.js
// Helpers for building the day-by-day visual and date labels for each long weekend card

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

// Countries where the weekend falls on Friday/Saturday instead of Saturday/Sunday.
// Used only to color the day boxes - not provided by the API itself.
const FRI_SAT_WEEKEND_COUNTRIES = [
  "EG",
  "SA",
  "AE",
  "QA",
  "OM",
  "KW",
  "BH",
  "JO",
  "SY",
  "IQ",
  "LY",
  "DZ",
  "YE",
];

function getWeekendDayNumbers(countryCode) {
  if (FRI_SAT_WEEKEND_COUNTRIES.includes(countryCode)) {
    return [5, 6]; // Friday, Saturday
  }
  return [0, 6]; // Sunday, Saturday
}

// Builds an array of day objects between startDate and endDate (inclusive)
// Each day object looks like: { dayName, dayNum, isWeekend, isBridge }
export function buildDaysVisual(startDate, endDate, bridgeDays, countryCode) {
  const weekendDayNumbers = getWeekendDayNumbers(countryCode);
  const days = [];

  const currentDate = new Date(startDate + "T00:00:00");
  const lastDate = new Date(endDate + "T00:00:00");

  while (currentDate <= lastDate) {
    const isoDate = currentDate.toISOString().split("T")[0];
    const isBridge = bridgeDays.includes(isoDate);
    const isWeekend = weekendDayNumbers.includes(currentDate.getDay());

    days.push({
      dayName: dayNames[currentDate.getDay()],
      dayNum: currentDate.getDate(),
      isWeekend: isWeekend,
      isBridge: isBridge,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

// Formats a date range like "Jan 7 - Jan 10, 2026"
export function formatDateRange(startDate, endDate) {
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");

  const startLabel = monthNames[start.getMonth()] + " " + start.getDate();
  const endLabel =
    monthNames[end.getMonth()] + " " + end.getDate() + ", " + end.getFullYear();

  return startLabel + " - " + endLabel;
}
