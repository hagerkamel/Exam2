// plansNavBadge.js
// Keeps the "My Plans" nav link badge (the little count pill) in sync with
// the number of saved plans. Called from anywhere a plan is added, removed,
// or cleared - and once on app startup.

import { PlansStorage } from "./plansStorage.js";

const storage = new PlansStorage();

export function updatePlansNavBadge() {
  const badge = document.getElementById("plans-count");
  if (!badge) return;

  const count = storage.getCounts().all;

  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove("hidden");
  } else {
    badge.textContent = "0";
    badge.classList.add("hidden");
  }
}
