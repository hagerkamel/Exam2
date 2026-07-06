// component/mobileSidebar.js

export function initMobileSidebar() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const navItems = document.querySelectorAll(".nav-item");

  function openSidebar() {
    sidebar.classList.add("show");
    overlay.classList.remove("hidden");
  }

  function closeSidebar() {
    sidebar.classList.remove("show");
    overlay.classList.add("hidden");
  }

  menuBtn.addEventListener("click", openSidebar);

  overlay.addEventListener("click", closeSidebar);

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });
}
