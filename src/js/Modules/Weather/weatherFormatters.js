// Shared date/time formatting helpers and small lookup functions used across the weather view

export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Example output: "Sunday, Jul 5"
export function formatFullDate(dateObj) {
  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday",
  ];
  return days[dateObj.getDay()] + ", " + monthNames[dateObj.getMonth()] + " " + dateObj.getDate();
}

// isoString looks like "2026-07-05T14:00" -> "2 PM"
export function formatHour(isoString) {
  const timePart = isoString.split("T")[1];
  const hoursStr = timePart.split(":")[0];
  let hours = parseInt(hoursStr, 10);

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return hours + " " + period;
}

// isoString looks like "2026-07-05T06:01" -> "6:01 AM"
export function formatSunTime(isoString) {
  const dateObj = new Date(isoString);
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  return hours + ":" + minutesStr + " " + period;
}

// Finds the index of the first hourly entry that is now or later
export function findCurrentHourIndex(hourlyTimes, currentTimeIso) {
  for (let i = 0; i < hourlyTimes.length; i++) {
    if (hourlyTimes[i] >= currentTimeIso) {
      return i;
    }
  }
  return 0;
}

// Show exactly 24 hours starting from the current hour
export function findEndIndex(startIndex, hourlyTimesLength) {
  const endIndex = startIndex + 23; // 24 hours total (start + 23 more)
  return Math.min(endIndex, hourlyTimesLength - 1);
}

// Show only remaining hours of today (from now until 23:00 today)
export function findTodayEndIndex(hourlyTimes, currentTimeIso) {
  const currentDate = new Date(currentTimeIso);
  const todayDateString = currentDate.toISOString().split("T")[0];

  let lastIndexOfToday = 0;
  for (let i = 0; i < hourlyTimes.length; i++) {
    const hourDateString = hourlyTimes[i].split("T")[0];
    if (hourDateString === todayDateString) {
      lastIndexOfToday = i;
    } else if (hourDateString > todayDateString) {
      break;
    }
  }
  return lastIndexOfToday;
}

// Converts a UV index number into a readable level + a CSS class for coloring the badge
export function getUVLevel(uvIndex) {
  const value = Math.round(uvIndex);

  if (value <= 2) {
    return { text: "LOW", cssClass: "uv-low" };
  } else if (value <= 5) {
    return { text: "MODERATE", cssClass: "uv-moderate" };
  } else if (value <= 7) {
    return { text: "HIGH", cssClass: "uv-high" };
  } else if (value <= 10) {
    return { text: "VERY HIGH", cssClass: "uv-very-high" };
  } else {
    return { text: "EXTREME", cssClass: "uv-extreme" };
  }
}

// Converts wind direction in degrees (0-360) into a compass label like "WNW"
// NOTE: this needs "wind_direction_10m" to be included in the "current" params
// of your Open-Meteo request in weatherApi.js. Add it there if it's missing.
export function getWindDirectionLabel(degrees) {
  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}