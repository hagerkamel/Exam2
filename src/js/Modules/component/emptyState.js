export function renderEmptyState(containerId, options) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { icon, title, subtitle, onButtonClick } = options;

  container.innerHTML =
    '<div class="empty-state">' +
    '<div class="empty-state-icon"><i class="' +
    icon +
    '"></i></div>' +
    "<h3>" +
    title +
    "</h3>" +
    "<p>" +
    subtitle +
    "</p>" +
    '<button id="empty-state-btn" class="btn-primary"><i class="fa-solid fa-globe"></i> ' +
        'Go to Dashboard' +
        "</button>"
     +
    "</div>";

  if ( onButtonClick) {
    const btn = document.getElementById("empty-state-btn");
    btn.addEventListener("click", onButtonClick);
  }
}
