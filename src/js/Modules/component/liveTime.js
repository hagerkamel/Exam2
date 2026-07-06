// liveEgyptTime.js
// Shows a live, ticking local time for a given IANA timezone
// (e.g. "Africa/Cairo", "Europe/Paris", "America/New_York").
//
// Uses the browser's built-in Intl API instead of manually parsing a fixed
// "UTC+02:00" offset. Intl already knows every timezone's DST rules, so
// summer/winter time switches (e.g. Cairo, Paris, New York) are handled
// automatically with zero extra logic here.

export function startCountryClock(timezone) {
  const countryLocalTimeElement = document.getElementById("country-local-time");
  const countryTimeZoneElement = document.querySelector(".local-time-zone");

  if (!timezone) {
    if (countryLocalTimeElement)
      countryLocalTimeElement.textContent = "--:--:--";
    if (countryTimeZoneElement) countryTimeZoneElement.textContent = "";
    return null;
  }

  function getCurrentTime() {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date());
    } catch (error) {
      return "--:--:--";
    }
  }

  // Reads the UTC offset that's ACTUALLY in effect right now (so it flips
  // automatically between e.g. UTC+02:00 in winter and UTC+03:00 in summer
  // for timezones that observe daylight saving).
  function getUtcOffsetLabel() {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "shortOffset",
      }).formatToParts(new Date());

      const offsetPart = parts.find(function (p) {
        return p.type === "timeZoneName";
      });

      // e.g. "GMT+3" -> "UTC+03:00"
      if (!offsetPart) return "";

      const match = offsetPart.value.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
      if (!match) return offsetPart.value.replace("GMT", "UTC");

      const [, sign, hours, minutes] = match;
      const paddedHours = hours.padStart(2, "0");
      const paddedMinutes = (minutes || "00").padStart(2, "0");
      return "UTC" + sign + paddedHours + ":" + paddedMinutes;
    } catch (error) {
      return "";
    }
  }

  function update() {
    const time = getCurrentTime();
    const offsetLabel = getUtcOffsetLabel();

    if (countryLocalTimeElement) {
      countryLocalTimeElement.textContent = time;
    }
    if (countryTimeZoneElement) {
      countryTimeZoneElement.textContent = offsetLabel;
    }
  }

  update(); // show immediately, don't wait for the first interval tick
  return setInterval(update, 1000);
}
