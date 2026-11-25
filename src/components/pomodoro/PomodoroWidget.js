const POMODORO_STORAGE_KEY = "siro_pomodoro_state";

export function initPomodoroWidget() {
  const modeTabs = document.querySelectorAll(".pomodoro-container .timer-option p");
  const timeDisplay = document.querySelector(".pomodoro-container .time");
  const statusDisplay = document.querySelector(".pomodoro-container .timer-status");
  const btnStart = document.getElementById("btnStartTimer");
  const btnPause = document.getElementById("btnPauseTimer");
  const btnReset = document.getElementById("btnResetTimer");
  const stars = document.querySelectorAll(".pomodoro-container .timer-log-activity i");
  const logCount = document.querySelector(".pomodoro-container .log-count");

  if (!modeTabs.length || !timeDisplay) return;

  const DURATIONS = {
    Pomodoro: 25 * 60,
    "Short Break": 5 * 60,
    "Long Break": 15 * 60,
  };

  let currentMode = "Pomodoro";
  let runningMode = null;
  let completedPomodoros = 0;
  let remainingTimes = {
    Pomodoro: DURATIONS.Pomodoro,
    "Short Break": DURATIONS["Short Break"],
    "Long Break": DURATIONS["Long Break"],
  };
  let timerInterval = null;

  function saveToLocalStorage() {
    const state = {
      currentMode,
      completedPomodoros,
      remainingTimes,
    };
    localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify(state));
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem(POMODORO_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (parsed.currentMode && DURATIONS[parsed.currentMode]) {
        currentMode = parsed.currentMode;
      }
      if (typeof parsed.completedPomodoros === "number") {
        completedPomodoros = Math.min(Math.max(parsed.completedPomodoros, 0), 4);
      }
      if (parsed.remainingTimes) {
        Object.keys(DURATIONS).forEach((mode) => {
          const val = Number(parsed.remainingTimes[mode]);
          if (val > 0 && val <= DURATIONS[mode]) {
            remainingTimes[mode] = val;
          }
        });
      }
    } catch {
      // Si hay datos corruptos en localStorage, se mantienen los valores por defecto
    }
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function updateControlsUI() {
    const isRunningHere = runningMode === currentMode;
    const isPausedMidway =
      !isRunningHere && remainingTimes[currentMode] < DURATIONS[currentMode];
    const isAtInitialTime =
      !isRunningHere && remainingTimes[currentMode] === DURATIONS[currentMode];

    if (btnStart) {
      btnStart.disabled = isRunningHere;
      const startLabel = isPausedMidway ? "Resume" : "Start";
      btnStart.innerHTML = `<i class="hn hn-play-solid"></i>${startLabel}`;
    }

    if (btnPause) {
      btnPause.disabled = !isRunningHere;
    }

    if (btnReset) {
      btnReset.disabled = isAtInitialTime;
    }

    modeTabs.forEach((tab) => {
      const tabMode = tab.textContent.trim();
      tab.classList.toggle("active", tabMode === currentMode);
      tab.classList.toggle("is-running", tabMode === runningMode);
    });
  }

  function updateStatusText() {
    if (!statusDisplay) return;

    if (runningMode === currentMode) {
      statusDisplay.textContent =
        currentMode === "Pomodoro" ? "Focusing with Siro..." : "Resting...";
      return;
    }

    if (runningMode && runningMode !== currentMode) {
      statusDisplay.textContent = `${runningMode} is running...`;
      return;
    }

    const isPausedMidway = remainingTimes[currentMode] < DURATIONS[currentMode];
    if (isPausedMidway) {
      statusDisplay.textContent = "Timer paused, press Resume";
    } else if (currentMode === "Pomodoro") {
      statusDisplay.textContent = "Ready when you are";
    } else if (currentMode === "Short Break") {
      statusDisplay.textContent = "Time for a short break!";
    } else {
      statusDisplay.textContent = "4/4 done! Enjoy a long break!";
    }
  }

  function updateDisplay() {
    timeDisplay.textContent = formatTime(remainingTimes[currentMode]);
    updateStatusText();
    updateControlsUI();
  }

  function updateStars() {
    stars.forEach((star, index) => {
      star.classList.toggle("is-done", index < completedPomodoros);
    });
    if (logCount) {
      logCount.textContent = `${completedPomodoros}/4`;
    }
  }

  function stopTimer() {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    runningMode = null;
  }

  function switchMode(newMode) {
    currentMode = newMode;
    updateDisplay();
  }

  function handleTimerComplete(finishedMode) {
    stopTimer();
    remainingTimes[finishedMode] = DURATIONS[finishedMode];

    if (finishedMode === "Pomodoro") {
      completedPomodoros++;
      updateStars();

      if (completedPomodoros >= 4) {
        switchMode("Long Break");
      } else {
        switchMode("Short Break");
      }
    } else {
      if (finishedMode === "Long Break" || completedPomodoros >= 4) {
        completedPomodoros = 0;
        updateStars();
      }
      switchMode("Pomodoro");
    }

    saveToLocalStorage();
  }

  function startTimer() {
    if (timerInterval !== null && runningMode === currentMode) return;

    stopTimer();
    runningMode = currentMode;

    if (runningMode === "Pomodoro" && completedPomodoros >= 4) {
      completedPomodoros = 0;
      updateStars();
    }

    updateDisplay();

    timerInterval = setInterval(() => {
      if (!runningMode) return;

      if (remainingTimes[runningMode] > 0) {
        remainingTimes[runningMode]--;

        if (currentMode === runningMode) {
          timeDisplay.textContent = formatTime(remainingTimes[currentMode]);
        }
      }

      if (remainingTimes[runningMode] === 0) {
        handleTimerComplete(runningMode);
      }
    }, 1000);
  }

  function pauseTimer() {
    if (timerInterval === null) return;
    stopTimer();
    updateDisplay();
    saveToLocalStorage();
  }

  function resetTimer() {
    if (runningMode === currentMode) {
      stopTimer();
    }
    remainingTimes[currentMode] = DURATIONS[currentMode];
    updateDisplay();
    saveToLocalStorage();
  }

  modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selectedMode = tab.textContent.trim();
      if (DURATIONS[selectedMode]) {
        switchMode(selectedMode);
      }
    });
  });

  if (btnStart) btnStart.addEventListener("click", startTimer);
  if (btnPause) btnPause.addEventListener("click", pauseTimer);
  if (btnReset) btnReset.addEventListener("click", resetTimer);

  window.addEventListener("beforeunload", saveToLocalStorage);

  loadFromLocalStorage();
  updateStars();
  switchMode(currentMode);
}
