// plansView.js
// Main view for "My Plans": renders saved plans, handles the filter tabs,
// removing a single plan, and clearing all plans.

import { PlansStorage } from "./plansStorage.js";
import { PlansDialogs } from "./plansDialogs.js";
import { renderPlanCard } from "./plansCard.js";
import { updatePlansNavBadge } from "./plansNavBadge.js";
import { goToView } from "../component/router.js";

export class PlansView {
  constructor() {
    this.storage = new PlansStorage();
    this.currentFilter = "all";
  }

  init() {
    this.contentEl = document.getElementById("plans-content");
    this.clearAllBtn = document.getElementById("clear-all-plans-btn");
    this.filterButtons = document.querySelectorAll(".plan-filter");

    updatePlansNavBadge();
    this.render();
    this.attachEvents();
  }

  attachEvents() {
    const self = this;

    this.clearAllBtn.addEventListener("click", function () {
      self.handleClearAll();
    });

    for (let i = 0; i < this.filterButtons.length; i++) {
      this.filterButtons[i].addEventListener("click", function (event) {
        self.handleFilterClick(event.currentTarget);
      });
    }

    // Event delegation: the Remove buttons and "Start Exploring" button
    // are created dynamically, so we listen on the container instead
    this.contentEl.addEventListener("click", function (event) {
      const removeBtn = event.target.closest(".plan-remove-btn");
      if (removeBtn) {
        self.handleRemove(
          removeBtn.dataset.removeId,
          removeBtn.dataset.removeType,
        );
        return;
      }

      const startExploringBtn = event.target.closest("#start-exploring-btn");
      if (startExploringBtn) {
        goToView("dashboard");
      }
    });
  }

  handleFilterClick(button) {
    for (let i = 0; i < this.filterButtons.length; i++) {
      this.filterButtons[i].classList.remove("active");
    }
    button.classList.add("active");

    this.currentFilter = button.dataset.filter;
    this.render();
  }

  handleRemove(id, type) {
    const self = this;

    PlansDialogs.confirmRemove().then(function (result) {
      if (result.isConfirmed) {
        self.storage.remove(id, type);
        PlansDialogs.showRemoved();
        updatePlansNavBadge();
        self.render();
      }
    });
  }

  handleClearAll() {
    const self = this;

    // If there's nothing saved, show a simple info message instead of the
    // destructive "are you sure" confirm
    if (this.storage.getAll().length === 0) {
      PlansDialogs.showNoPlansToClear();
      return;
    }

    PlansDialogs.confirmClearAll().then(function (result) {
      if (result.isConfirmed) {
        self.storage.clear();
        PlansDialogs.showCleared();
        updatePlansNavBadge();
        self.render();
      }
    });
  }

  renderEmptyState() {
    this.contentEl.innerHTML =
      '<div class="empty-state">' +
      '<div class="empty-icon"><i class="fa-solid fa-heart-crack"></i></div>' +
      "<h3>No Saved Plans Yet</h3>" +
      "<p>Start exploring and save holidays, events, or long weekends you like!</p>" +
      '<button class="btn-primary" id="start-exploring-btn"><i class="fa-solid fa-compass"></i> Start Exploring</button>' +
      "</div>";
    const startExploringBtn = document.getElementById("start-exploring-btn");
    if (startExploringBtn) {
      startExploringBtn.addEventListener("click", function () {
        goToView("dashboard");
      });
    }
  }

  updateFilterCounts() {
    const counts = this.storage.getCounts();
    document.getElementById("filter-all-count").textContent = counts.all;
    document.getElementById("filter-holiday-count").textContent =
      counts.holiday;
    document.getElementById("filter-event-count").textContent = counts.event;
    document.getElementById("filter-lw-count").textContent = counts.longweekend;
  }

  render() {
    this.updateFilterCounts();

    const plans = this.storage.getByType(this.currentFilter);

    if (plans.length === 0) {
      this.renderEmptyState();
      return;
    }

    let cardsHtml = "";
    for (let i = 0; i < plans.length; i++) {
      cardsHtml += renderPlanCard(plans[i]);
    }

    this.contentEl.innerHTML = cardsHtml;
  }
}

// One shared instance + an init function, to match the initXView() pattern
// used by the other views in this project (initWeatherView, initCurrencyView...)
const plansView = new PlansView();

export function initPlansView() {
  plansView.init();
}
