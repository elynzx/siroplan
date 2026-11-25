export function initSidebar(onNavigate = null) {
  const sidebar = document.getElementById("sidebarAside");
  const backdrop = document.getElementById("sidebarBackdrop");
  const btnOpen = document.getElementById("btnOpenSidebar");
  const btnPomo = document.getElementById("btnMobilePomodoro");
  const btnClose = document.getElementById("btnCloseSidebar");

  const openSidebar = (scrollToPomo = false) => {
    if (!sidebar) return;
    sidebar.classList.add("is-open");
    if (backdrop) backdrop.classList.add("is-active");
    if (scrollToPomo) {
      const pomoEl = sidebar.querySelector(".pomodoro-container");
      if (pomoEl) {
        setTimeout(() => pomoEl.scrollIntoView({ behavior: "smooth" }), 150);
      }
    }
  };

  const closeSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-active");
  };

  if (btnOpen) btnOpen.addEventListener("click", () => openSidebar(false));
  if (btnPomo) btnPomo.addEventListener("click", () => openSidebar(true));
  if (btnClose) btnClose.addEventListener("click", closeSidebar);
  if (backdrop) backdrop.addEventListener("click", closeSidebar);

  const menuItems = document.querySelectorAll(".sidebar-menu .menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      menuItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
      closeSidebar();

      const targetView = item.getAttribute("href")?.replace("#", "") || "kanban";
      if (typeof onNavigate === "function") {
        onNavigate(targetView, event);
      }
    });
  });
}
