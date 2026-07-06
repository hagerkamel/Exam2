// plansSaveHelper.js
// Shared helper that other views (Events, Holidays, Long Weekends) import
// whenever a "Save" button is clicked. Handles the duplicate check and shows
// the right toast, so those views don't need to touch PlansStorage directly.

import { PlansStorage } from "./plansStorage.js";
import { PlansDialogs } from "./plansDialogs.js";
import { updatePlansNavBadge } from "./plansNavBadge.js";

const storage = new PlansStorage();

// Returns true if the plan was newly saved, false if it was already saved
export function savePlan(plan) {
  const wasAdded = storage.add(plan);

  if (wasAdded) {
    PlansDialogs.showSaved();
  } else {
    PlansDialogs.showAlreadySaved();
  }

  updatePlansNavBadge();
  return wasAdded;
}

// Lets other views check saved state up front, e.g. to show a filled heart icon
// on cards that are already saved
export function isPlanSaved(id, type) {
  return storage.exists(id, type);
}
export function attachSaveButton(buttonEl, plan) {
  if (!buttonEl) return;

  setHeartState(buttonEl, isPlanSaved(plan.id, plan.type));

  buttonEl.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    const wasAdded = savePlan(plan);
    if (wasAdded) {
      setHeartState(buttonEl, true);
    }
  });
}
function setHeartState(buttonEl, saved) {
  const icon = buttonEl.querySelector("i");
  buttonEl.classList.toggle("saved", saved);
  if (icon) {
    icon.classList.toggle("fa-solid", saved);
    icon.classList.toggle("fa-regular", !saved);
  }
}