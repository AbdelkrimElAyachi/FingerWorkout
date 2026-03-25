import { useSoundStore } from '@/stores';

/**
 * Composable for keystroke audio playback with an object pool.
 *
 * Maintains a small pool of pre-created Audio elements so that
 * rapid keystrokes each get their own playback channel, preventing
 * the "swallowed click" problem that occurs when a single Audio
 * element is restarted before it finishes.
 *
 * @returns {{ init: function, play: function }}
 */
export function useAudio() {
  const POOL_SIZE = 8;
  let pool = [];
  let poolIndex = 0;
  let soundSrc = '';

  /** Creates (or re-creates) the audio pool for the current sound. */
  function init() {
    const soundStore = useSoundStore();
    soundSrc = `/assets/sounds/${soundStore.getSound}.wav`;
    pool = Array.from({ length: POOL_SIZE }, () => {
      const a = new Audio(soundSrc);
      a.preload = 'auto';
      return a;
    });
    poolIndex = 0;
  }

  /** Plays the next audio element in the pool (round-robin). */
  function play() {
    if (pool.length === 0) return;
    const soundStore = useSoundStore();
    const audio = pool[poolIndex];
    audio.currentTime = 0.1;
    audio.volume = soundStore.getSoundLevel / 100;
    audio.play().catch(() => {});
    poolIndex = (poolIndex + 1) % POOL_SIZE;
  }

  return { init, play };
}
