import { describe, it, expect, vi } from 'vitest';
import { useTypingEngine } from '../useTypingEngine';

/**
 * Integration test — exercises a realistic end-to-end typing flow
 * through the composable without any individual method mocks.
 */
describe('useTypingEngine — full typing flow', () => {
  it('completes two correct words with accurate scores', () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    const engine = useTypingEngine({
      phraseRef: { value: null },
      callbacks: { onSpaceCorrect: onCorrect, onSpaceWrong: onWrong },
    });

    engine.initWords(['hello', 'world']);

    // Type "hello" correctly
    'hello'.split('').forEach((ch) => engine.handleKeyPress(ch));
    engine.handleKeyPress(' ');

    // Type "world" correctly
    'world'.split('').forEach((ch) => engine.handleKeyPress(ch));
    engine.handleKeyPress(' ');

    expect(engine.results.correctCharacters).toBe(10);
    expect(engine.results.wrongCharacters).toBe(0);
    expect(engine.results.correctWords).toBe(2);
    expect(engine.results.wrongWords).toBe(0);
    expect(onCorrect).toHaveBeenCalledTimes(2);
    expect(onWrong).not.toHaveBeenCalled();
    expect(engine.isPastLineEnd()).toBe(true);
  });

  it('handles mixed correct and incorrect input', () => {
    const engine = useTypingEngine({ phraseRef: { value: null } });
    engine.initWords(['cat', 'dog']);

    // Type "cat" with one wrong character: c-x-t
    engine.handleKeyPress('c'); // correct
    engine.handleKeyPress('x'); // wrong
    engine.handleKeyPress('t'); // correct

    engine.handleKeyPress(' '); // word is wrong (had an error)

    // Type "dog" correctly
    'dog'.split('').forEach((ch) => engine.handleKeyPress(ch));
    engine.handleKeyPress(' ');

    expect(engine.results.correctCharacters).toBe(5); // c, t, d, o, g
    expect(engine.results.wrongCharacters).toBe(1);   // x
    expect(engine.results.correctWords).toBe(1);       // "dog"
    expect(engine.results.wrongWords).toBe(1);         // "cat" had error
  });

  it('handles overflow characters correctly', () => {
    const engine = useTypingEngine({ phraseRef: { value: null } });
    engine.initWords(['ab', 'cd']);

    // Type "ab" + extra "z" → overflow
    engine.handleKeyPress('a');
    engine.handleKeyPress('b');
    engine.handleKeyPress('z'); // overflow character

    engine.handleKeyPress(' ');

    // Word should be wrong due to overflow error marking
    expect(engine.results.wrongWords).toBe(1);
    // 2 wrong: one for mismatch at index 2, one for overflow push
    expect(engine.results.wrongCharacters).toBe(2);
    expect(engine.currentText.value[0]).toEqual(['a', 'b', 'z']);
  });

  it('resetResults clears everything after a completed session', () => {
    const engine = useTypingEngine({ phraseRef: { value: null } });
    engine.initWords(['hi']);
    engine.handleKeyPress('h');
    engine.handleKeyPress('i');
    engine.handleKeyPress(' ');

    expect(engine.results.correctWords).toBe(1);

    engine.resetResults(3);
    expect(engine.results.correctCharacters).toBe(0);
    expect(engine.results.wrongCharacters).toBe(0);
    expect(engine.results.correctWords).toBe(0);
    expect(engine.results.wrongWords).toBe(0);
    expect(engine.results.duration).toBe(3);
  });
});
