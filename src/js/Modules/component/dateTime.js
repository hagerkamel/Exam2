
export function updateHeaderDateTime() {
  const dateTimeElement = document.getElementById("current-datetime");
  if (!dateTimeElement) {
    return;
  }
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  // Intl gives "Sat, Jan 25, 08:30 AM" format almost exactly, just needs small cleanup
  dateTimeElement.textContent = formatter.format(now);
}
