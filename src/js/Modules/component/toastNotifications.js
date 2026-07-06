// toastNotifications.js
// Lightweight, STACKABLE toast notifications.
// Unlike SweetAlert2's toast (which is a singleton - only one can ever be
// visible, later calls replace the earlier one), each call here appends an
// independent element to a fixed container. Click "Save" on 3 cards quickly
// and you'll get 3 toasts stacked on top of each other, each disappearing on
// its own timer. Click once, and you'll only ever see one.

let container = null;

function getContainer() {
  if (container) return container;
  container = document.createElement("div");
  container.className = "toast-stack-container";
  document.body.appendChild(container);
  return container;
}

const ICONS = {
  success: '<i class="fa-solid fa-circle-check"></i>',
  info: '<i class="fa-solid fa-circle-info"></i>',
};

export function showToast(message, type, duration) {
  type = type || "success";
  duration = duration || 2500;

  const stack = getContainer();

  const toast = document.createElement("div");
  toast.className = "app-toast app-toast-" + type;
  toast.innerHTML =
    '<span class="app-toast-icon">' +
    (ICONS[type] || ICONS.success) +
    "</span>" +
    '<span class="app-toast-text">' +
    message +
    "</span>" +
    '<button type="button" class="app-toast-close" aria-label="Close">&times;</button>';

  stack.appendChild(toast);

  function remove() {
    toast.classList.add("app-toast-hide");
    setTimeout(function () {
      toast.remove();
    }, 200);
  }

  let timeoutId = setTimeout(remove, duration);

  toast.querySelector(".app-toast-close").addEventListener("click", remove);
  toast.addEventListener("mouseenter", function () {
    clearTimeout(timeoutId);
  });
  toast.addEventListener("mouseleave", function () {
    timeoutId = setTimeout(remove, duration);
  });
}
