export function initSplashScreen() {
  const splashScreen = document.getElementById("splashScreen");
  if (!splashScreen) return;

  const splashStatus = splashScreen.querySelector(".splash-status");
  setTimeout(() => {
    if (splashStatus) splashStatus.textContent = "Ready! Welcome in ✦";
  }, 1550);

  setTimeout(() => {
    splashScreen.classList.add("is-hidden");
    setTimeout(() => splashScreen.remove(), 650);
  }, 2150);
}
