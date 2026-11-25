const POMODORO_STORAGE_KEY = "siro_pomodoro_state";

/**
 * Initializes and manages the Pomodoro Timer functionality inside the Sidebar,
 * handling countdown intervals, mode switching, star ratings, and local storage state.
 *
 * @returns {void}
 */
export function initPomodoroTimer() {

  const modeTabs = document.querySelectorAll(".pomodoro-container .timer-option p");
  const timeDisplay = document.querySelector(".pomodoro-container .time");
  const statusDisplay = document.querySelector(".pomodoro-container .timer-status");
  const btnStart = document.getElementById("btnStartTimer");
  const btnPause = document.getElementById("btnPauseTimer");
  const btnReset = document.getElementById("btnResetTimer");
  const stars = document.querySelectorAll(".pomodoro-container .timer-log-activity i");
  const logCount = document.querySelector(".pomodoro-container .log-count");

  if (!modeTabs.length || !timeDisplay) return;

  // Timer Configuration (in seconds)
  const DURATIONS = {
    Pomodoro: 25 * 60,
    "Short Break": 5 * 60,
    "Long Break": 15 * 60,
  };

  // State Variables
  let currentMode = "Pomodoro";
  let runningMode = null;
  let completedPomodoros = 0;
  let timerInterval = null;

  let remainingTimes = {
    Pomodoro: DURATIONS.Pomodoro,
    "Short Break": DURATIONS["Short Break"],
    "Long Break": DURATIONS["Long Break"],
  };

  /**
   * Persists current timer state to local storage.
   */
  function saveToLocalStorage() {
    const state = {
      currentMode: currentMode,
      completedPomodoros: completedPomodoros,
      remainingTimes: remainingTimes,
    };
    localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify(state));
  }

  /**
   * Restores timer state from local storage if valid data exists.
   */
  function loadFromLocalStorage() {
    const saved = localStorage.getItem(POMODORO_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      if (parsed.currentMode && DURATIONS[parsed.currentMode]) {
        currentMode = parsed.currentMode;
      }

      if (typeof parsed.completedPomodoros === "number") {
        if (parsed.completedPomodoros < 0) {
          completedPomodoros = 0;
        } else if (parsed.completedPomodoros > 4) {
          completedPomodoros = 4;
        } else {
          completedPomodoros = parsed.completedPomodoros;
        }
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
    }
  }

  /**
   * Formats total seconds into MM:SS display format.
   */
  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    let minutesStr = String(minutes);
    if (minutes < 10) {
      minutesStr = "0" + minutes;
    }

    let secondsStr = String(seconds);
    if (seconds < 10) {
      secondsStr = "0" + seconds;
    }

    return `${minutesStr}:${secondsStr}`;
  }

  /**
   * Updates state and attributes for control buttons and mode tabs.
   */
  function updateControlsUI() {
    const isRunningHere = runningMode === currentMode;
    const currentRemaining = remainingTimes[currentMode];
    const initialDuration = DURATIONS[currentMode];

    const isPausedMidway = !isRunningHere && currentRemaining < initialDuration;
    const isAtInitialTime = !isRunningHere && currentRemaining === initialDuration;

    if (btnStart) {
      btnStart.disabled = isRunningHere;
      let startLabel = "Start";
      if (isPausedMidway) {
        startLabel = "Resume";
      }
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
      const isActive = tabMode === currentMode;
      const isRunning = tabMode === runningMode;

      tab.classList.toggle("active", isActive);
      tab.classList.toggle("is-running", isRunning);
    });
  }

  function updateStatusText() {
    if (!statusDisplay) return;

    if (runningMode === currentMode) {
      if (currentMode === "Pomodoro") {
        statusDisplay.textContent = "Focusing with Siro...";
      } else {
        statusDisplay.textContent = "Resting...";
      }
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

  /**
   * Refreshes overall timer display components.
   */
  function updateDisplay() {
    timeDisplay.textContent = formatTime(remainingTimes[currentMode]);
    updateStatusText();
    updateControlsUI();
  }

  function updateStars() {
    stars.forEach((star, index) => {
      const isDone = index < completedPomodoros;
      star.classList.toggle("is-done", isDone);
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

  /**
   * Changes current timer mode and refreshes view.
   *
   * @param {string} newMode - Target timer mode name.
   */
  function switchMode(newMode) {
    currentMode = newMode;
    updateDisplay();
  }

  /**
   * Handles sequence when a timer cycle completes.
   *
   * @param {string} finishedMode - Mode that just completed.
   */
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

  /**
   * Starts or resumes countdown interval.
   */
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