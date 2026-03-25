import { ref, computed, onUnmounted } from 'vue';

/**
 * Composable for a countdown timer.
 *
 * @param {number} [initialSeconds=60] - Starting time in seconds.
 * @returns Reactive timer state and controls.
 */
export function useTimer(initialSeconds = 60) {
  const timeLeft = ref(initialSeconds);
  const isFinished = computed(() => timeLeft.value <= 0);
  let intervalId = null;

  /** Starts the countdown (1-second ticks). */
  function start() {
    if (intervalId) return; // already running
    intervalId = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        stop();
      }
    }, 1000);
  }

  /** Pauses the countdown. */
  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  /** Resets the timer to a new duration (in seconds) and stops it. */
  function reset(seconds) {
    stop();
    timeLeft.value = seconds;
  }

  // Auto-cleanup when the owning component unmounts.
  onUnmounted(() => stop());

  return { timeLeft, isFinished, start, stop, reset };
}
