// plansCard.js
// Builds the HTML for a single saved plan card

const TYPE_LABELS = {
  holiday: "HOLIDAY",
  event: "EVENT",
  longweekend: "LONG WEEKEND",
};

const TYPE_BADGE_CLASSES = {
  holiday: "badge-holiday",
  event: "badge-event",
  longweekend: "badge-longweekend",
};

export function renderPlanCard(plan) {
  const badgeLabel = TYPE_LABELS[plan.type] || plan.type;
  const badgeClass = TYPE_BADGE_CLASSES[plan.type] || "";

  return (
    '<div class="plan-card" data-id="' +
    plan.id +
    '" data-type="' +
    plan.type +
    '">' +
    '<span class="plan-badge ' +
    badgeClass +
    '">' +
    badgeLabel +
    "</span>" +
    "<h3>" +
    plan.title +
    "</h3>" +
    '<div class="plan-date"><i class="fa-regular fa-calendar"></i> ' +
    plan.date +
    "</div>" +
    '<div class="plan-location"><i class="fa-solid fa-location-dot"></i> ' +
    plan.location +
    "</div>" +
    '<button class="plan-remove-btn" data-remove-id="' +
    plan.id +
    '" data-remove-type="' +
    plan.type +
    '">' +
    '<i class="fa-solid fa-trash"></i> Remove' +
    "</button>" +
    "</div>"
  );
}
