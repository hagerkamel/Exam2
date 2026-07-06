// plan.js
// Represents one saved plan. Different features (Events, Holidays, Long Weekends)
// have different data shapes, so this class normalizes them all into one common shape
// before they get saved to storage.

export class Plan {
  constructor(id, type, title, date, location) {
    this.id = id;
    this.type = type; // "holiday" | "event" | "longweekend"
    this.title = title;
    this.date = date;
    this.location = location;
  }

  // Builds a Plan from an event card (Events Explorer feature)
  // Falls back to a generated id if the source event doesn't provide one
  static fromEvent(event) {
    const id = event.id || event.name + "-" + event.dateLabel;

    return new Plan(
      id,
      "event",
      event.name,
      event.dateLabel,
      event.venue + ", " + event.city,
    );
  }

  // Builds a Plan from a public holiday (Nager PublicHolidays API)
  static fromHoliday(holiday, dateLabel, countryName) {
    return new Plan(
      holiday.date + "-" + holiday.name,
      "holiday",
      holiday.localName,
      dateLabel,
      countryName,
    );
  }

  // Builds a Plan from a long weekend
  static fromLongWeekend(weekend, countryName) {
    return new Plan(
      weekend.startDate + "-" + weekend.endDate,
      "longweekend",
      "Long Weekend (" + weekend.dayCount + " Days)",
      weekend.startDate + " - " + weekend.endDate,
      countryName,
    );
  }
}
