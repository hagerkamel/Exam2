// main.js
// Entry point - initializes each page section
import { updateHeaderDateTime } from "./component/dateTime.js";
import { startCountryClock } from "./component/liveTime.js";
import { initNavigation, registerViewInit } from "./component/router.js";
import { initDestinationSearch } from "./Dashboard/destinationSearch.js";
import { initHolidaysView } from "./Holidays/holidaysView.js";
import { initEventsView } from "./EventsPage/eventsView.js";
import { initWeatherView } from "./Weather/weatherView.js";
import { initLongWeekendsView } from "./longWeekends/longWeekendsView.js";
import { initCurrencyView } from "./currency/currencyView.js";
import { initSunTimesView } from "./sunTimes/sunTimesView.js";
import { initPlansView } from "./plans/plansView.js";
import { updatePlansNavBadge } from "./plans/plansNavBadge.js";
initNavigation();
startCountryClock(["UTC+03:00"]);
updateHeaderDateTime();
initDestinationSearch();
updatePlansNavBadge();
registerViewInit("long-weekends", initLongWeekendsView);
registerViewInit("holidays", initHolidaysView);
registerViewInit("events", initEventsView);
registerViewInit("weather", initWeatherView);
registerViewInit("currency", initCurrencyView);
registerViewInit("sun-times", initSunTimesView);
registerViewInit("my-plans", initPlansView);
