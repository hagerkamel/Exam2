// plansStorage.js
// Handles all CRUD operations for saved plans, persisted in localStorage

const STORAGE_KEY = "travelDashboard_savedPlans";

export class PlansStorage {
  constructor() {
    this.storageKey = STORAGE_KEY;
  }

  // Reads all saved plans from localStorage (returns an empty array if none saved yet)
  getAll() {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("Error parsing saved plans:", error);
      return [];
    }
  }

  // Saves the full plans array back to localStorage
  saveAll(plans) {
    localStorage.setItem(this.storageKey, JSON.stringify(plans));
  }

  // Checks whether a plan is already saved (matched by id + type together,
  // since two different features could reuse the same id)
  exists(id, type) {
    const plans = this.getAll();

    for (let i = 0; i < plans.length; i++) {
      if (plans[i].id === id && plans[i].type === type) {
        return true;
      }
    }

    return false;
  }

  // Adds a new plan if it isn't already saved.
  // Returns true if it was added, false if it already existed.
  add(plan) {
    if (this.exists(plan.id, plan.type)) {
      return false;
    }

    const plans = this.getAll();
    plans.push(plan);
    this.saveAll(plans);
    return true;
  }

  // Removes a single plan by id + type
  remove(id, type) {
    const plans = this.getAll();

    const updatedPlans = plans.filter(function (plan) {
      return !(plan.id === id && plan.type === type);
    });

    this.saveAll(updatedPlans);
  }

  // Removes every saved plan
  clear() {
    this.saveAll([]);
  }

  // Returns only plans matching a specific type ("holiday", "event", "longweekend"),
  // or every plan if type is "all"
  getByType(type) {
    if (type === "all") {
      return this.getAll();
    }

    return this.getAll().filter(function (plan) {
      return plan.type === type;
    });
  }

  // Returns the count for each filter tab
  getCounts() {
    const plans = this.getAll();
    const counts = { all: plans.length, holiday: 0, event: 0, longweekend: 0 };

    for (let i = 0; i < plans.length; i++) {
      const type = plans[i].type;
      if (counts[type] !== undefined) {
        counts[type]++;
      }
    }

    return counts;
  }
}
