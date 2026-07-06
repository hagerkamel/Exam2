import { fetchData } from "../component/api.js";

const BASE_URL = "https://app.ticketmaster.com/discovery/v2/events.json";
const API_KEY = "VwECw2OiAzxVzIqnwmKJUG41FbeXJk1y";

// Pick the best image for the card (prefer 16_9 ratio, medium width)
function pickEventImage(images) {
  if (!images || images.length === 0) {
    return "";
  }

  const preferred = images.find(function (img) {
    return img.ratio === "16_9" && img.width >= 300 && img.width <= 700;
  });

  return preferred ? preferred.url : images[0].url;
}

// Extract only the fields the UI actually needs, in a clean shape
function normalizeEvent(rawEvent) {
  const venue =
    rawEvent._embedded &&
    rawEvent._embedded.venues &&
    rawEvent._embedded.venues.length > 0
      ? rawEvent._embedded.venues[0]
      : null;

  const category =
    rawEvent.classifications && rawEvent.classifications.length > 0
      ? rawEvent.classifications[0].segment.name
      : "Event";

  return {
    name: rawEvent.name,
    imageUrl: pickEventImage(rawEvent.images),
    category: category,
    date:
      rawEvent.dates && rawEvent.dates.start
        ? rawEvent.dates.start.localDate
        : "",
    time:
      rawEvent.dates && rawEvent.dates.start
        ? rawEvent.dates.start.localTime
        : "",
    venueName: venue ? venue.name : "Unknown venue",
    venueCity: venue && venue.city ? venue.city.name : "",
    ticketUrl: rawEvent.url,
  };
}

// Public function: fetch events by country code + city, already cleaned up
export async function getEvents(countryCode, city) {
  const url =
    BASE_URL +
    "?apikey=" +
    API_KEY +
    "&city=" +
    encodeURIComponent(city) +
    "&countryCode=" +
    countryCode +
    "&size=20";

  const data = await fetchData(url);

  if (!data || !data._embedded || !data._embedded.events) {
    return [];
  }

  return data._embedded.events.map(normalizeEvent);
}
