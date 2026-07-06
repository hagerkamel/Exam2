// dropdown.js
// Generic reusable dropdown controller.
// Handles opening/closing a single dropdown, and automatically
// closes any other open dropdown when a new one opens.
// Can be reused for any select-like UI in the project (not just this section).

const allDropdowns = [];

export function createDropdown(inputEl, panelEl) {
  const dropdown = {
    panelEl: panelEl,

    close: function () {
      panelEl.classList.add("hidden");
    },

    open: function () {
      closeAllDropdowns();
      panelEl.classList.remove("hidden");
    },

    toggle: function () {
      let isOpen = !panelEl.classList.contains("hidden");
      if (isOpen) {
        dropdown.close();
      } else {
        dropdown.open();
      }
    },
  };

  inputEl.addEventListener("click", dropdown.toggle);
  allDropdowns.push(dropdown);

  return dropdown;
}

export function closeAllDropdowns() {
  for (let i = 0; i < allDropdowns.length; i++) {
    allDropdowns[i].close();
  }
}

// Close all dropdowns when clicking outside any dropdown wrapper
document.addEventListener("click", function (e) {
  if (!e.target.closest(".custom-select-wrapper")) {
    closeAllDropdowns();
  }
});

// Generic function to render a list of clickable items inside any dropdown.
// buildItem(itemEl, item) -> fills the item's content (text, flag, etc.)
// onSelect(item) -> runs when the user clicks that item
export function renderDropdownItems(container, items, buildItem, onSelect) {
  container.innerHTML = "";

  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let itemEl = document.createElement("div");
    itemEl.className =
      "dropdown-item flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer text-sm text-slate-700 hover:bg-blue-50";

    buildItem(itemEl, item);

    itemEl.addEventListener("click", function () {
      onSelect(item);
    });

    container.appendChild(itemEl);
  }
}
