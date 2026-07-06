const viewInitializers = {};
const DEFAULT_VIEW = "dashboard";

export function registerViewInit(viewName, callback) {
  viewInitializers[viewName] = callback;
}

// Changes the URL hash to match the requested view. If we're already on
// that view (hash won't change, so "hashchange" won't fire on its own),
// call the show function directly instead.
export function goToView(viewName) {
  if (location.hash.slice(1) === viewName) {
    if (window.__appShowView) window.__appShowView(viewName);
  } else {
    location.hash = viewName;
  }
}

export function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item[data-view]");
  const views = document.querySelectorAll(".view");
  const pageTitleElement = document.getElementById("page-title");
  const pageSubtitleElement = document.getElementById("page-subtitle");

  const viewContent = {
    dashboard: {
      title: "Dashboard",
      subtitle: "Welcome back! Ready to plan your next adventure?",
    },
    holidays: {
      title: "Holidays",
      subtitle: "Explore public holidays around the world",
    },
    events: {
      title: "Events",
      subtitle: "Find concerts, sports, and entertainment",
    },
    weather: {
      title: "Weather",
      subtitle: "Check forecasts for any destination",
    },
    "long-weekends": {
      title: "Long Weekends",
      subtitle: "Find the perfect mini-trip opportunities",
    },
    currency: {
      title: "Currency",
      subtitle: "Convert currencies with live exchange rates",
    },
    "sun-times": {
      title: "Sun Times",
      subtitle: "Check sunrise and sunset times worldwide",
    },
    "my-plans": {
      title: "My Plans",
      subtitle: "Your saved holidays and events",
    },
  };

  function updateHeaderText(viewName) {
    const content = viewContent[viewName];
    if (!content) return;
    pageTitleElement.textContent = content.title;
    pageSubtitleElement.textContent = content.subtitle;
  }

  function showView(viewName) {
    if (!viewContent[viewName]) {
      viewName = DEFAULT_VIEW;
    }

    views.forEach(function (view) {
      view.classList.remove("active");
    });
    const targetView = document.getElementById(viewName + "-view");
    if (targetView) targetView.classList.add("active");

    navItems.forEach(function (item) {
      item.classList.remove("active");
    });
    const activeNavItem = document.querySelector(
      '.nav-item[data-view="' + viewName + '"]',
    );
    if (activeNavItem) activeNavItem.classList.add("active");

    updateHeaderText(viewName);

    if (viewInitializers[viewName]) {
      viewInitializers[viewName]();
    }
  }

  // expose showView so goToView (outside this closure) can call it
  window.__appShowView = showView;
  navItems.forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      goToView(item.getAttribute("data-view"));
    });
  });

  function handleHashChange() {
    const viewName = location.hash.slice(1) || DEFAULT_VIEW;
    showView(viewName);
  }

  window.addEventListener("hashchange", handleHashChange);

  // Run once on page load / refresh so a direct link like "index.html#events"
  // or the browser's back/forward navigation lands on the right view instead
  // of always defaulting to the dashboard
  handleHashChange();
}
