import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// useTimer calls onUnmounted — we need to mock it since we're not inside a component.
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return { ...actual, onUnmounted: vi.fn() };
});

import { useTimer } from '../useTimer';

describe('useTimer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('initialises with the given seconds', () => {
    const { timeLeft } = useTimer(30);
    expect(timeLeft.value).toBe(30);
  });

  it('defaults to 60 seconds', () => {
    const { timeLeft } = useTimer();
    expect(timeLeft.value).toBe(60);
  });

  it('isFinished is false initially', () => {
    const { isFinished } = useTimer(10);
    expect(isFinished.value).toBe(false);
  });

  it('decrements every second after start()', () => {
    const { timeLeft, start } = useTimer(5);
    start();
    vi.advanceTimersByTime(3000);
    expect(timeLeft.value).toBe(2);
  });

  it('stops at 0 and isFinished becomes true', () => {
    const { timeLeft, isFinished, start } = useTimer(2);
    start();
    vi.advanceTimersByTime(5000);
    expect(timeLeft.value).toBe(0);
    expect(isFinished.value).toBe(true);
  });

  it('stop() pauses the countdown', () => {
    const { timeLeft, start, stop } = useTimer(10);
    start();
    vi.advanceTimersByTime(3000);
    stop();
    vi.advanceTimersByTime(5000);
    expect(timeLeft.value).toBe(7); // stopped at 7
  });

  it('reset() sets a new value and stops the timer', () => {
    const { timeLeft, start, reset } = useTimer(10);
    start();
    vi.advanceTimersByTime(2000);
    reset(30);
    expect(timeLeft.value).toBe(30);
    // should not decrement further
    vi.advanceTimersByTime(5000);
    expect(timeLeft.value).toBe(30);
  });

  it('multiple start() calls are idempotent', () => {
    const { timeLeft, start } = useTimer(10);
    start();
    start(); // should not create a second interval
    vi.advanceTimersByTime(2000);
    expect(timeLeft.value).toBe(8); // not 6
  });
});
