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
    '<button class="btn-primary empty-state-btn"><i class="fa-solid fa-globe"></i> ' +
    "Go to Dashboard" +
    "</button>" +
    "</div>";

  if ( onButtonClick) {
    const btn = container.querySelector(".empty-state-btn");
    btn.addEventListener("click", onButtonClick);
  }
}
