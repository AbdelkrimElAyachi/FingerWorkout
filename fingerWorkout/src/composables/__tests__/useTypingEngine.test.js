import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTypingEngine } from '../useTypingEngine';

// useTypingEngine uses Vue refs internally but doesn't need a mounted
// component — we just need the Vue reactivity system (provided by jsdom env).

let engine;

beforeEach(() => {
  engine = useTypingEngine({ phraseRef: { value: null } });
});

// ────────────────────────────────────────────────────────────
// isLetter
// ────────────────────────────────────────────────────────────
describe('isLetter', () => {
  it('accepts lowercase letters', () => {
    expect(engine.isLetter('a')).toBe(true);
    expect(engine.isLetter('z')).toBe(true);
  });

  it('accepts uppercase letters', () => {
    expect(engine.isLetter('A')).toBe(true);
    expect(engine.isLetter('Z')).toBe(true);
  });

  it('accepts digits', () => {
    expect(engine.isLetter('0')).toBe(true);
    expect(engine.isLetter('9')).toBe(true);
  });

  it('accepts space', () => {
    expect(engine.isLetter(' ')).toBe(true);
  });

  it('rejects special keys', () => {
    expect(engine.isLetter('Shift')).toBe(false);
    expect(engine.isLetter('Enter')).toBe(false);
    expect(engine.isLetter('Backspace')).toBe(false);
  });

  it('rejects punctuation', () => {
    expect(engine.isLetter('!')).toBe(false);
    expect(engine.isLetter('@')).toBe(false);
    expect(engine.isLetter('.')).toBe(false);
  });
});

// ────────────────────────────────────────────────────────────
// initWords
// ────────────────────────────────────────────────────────────
describe('initWords', () => {
  it('sets up currentText as a 2D char array', () => {
    engine.initWords(['hello', 'world']);
    expect(engine.currentText.value).toEqual([
      ['h', 'e', 'l', 'l', 'o'],
      ['w', 'o', 'r', 'l', 'd'],
    ]);
  });

  it('initialises wordClasses with first word highlighted', () => {
    engine.initWords(['foo', 'bar']);
    expect(engine.wordClasses.value[0]).toBe('border-b-4 border-primary');
    expect(engine.wordClasses.value[1]).toBe('');
  });

  it('initialises all charClasses as text-secondary', () => {
    engine.initWords(['ab']);
    expect(engine.charClasses.value[0]).toEqual(['text-secondary', 'text-secondary']);
  });

  it('resets indices to 0', () => {
    engine.initWords(['test']);
    expect(engine.charIndex.value).toBe(0);
    expect(engine.wordIndex.value).toBe(0);
  });
});

// ────────────────────────────────────────────────────────────
// handleKeyPress — character matching
// ────────────────────────────────────────────────────────────
describe('handleKeyPress — characters', () => {
  beforeEach(() => {
    engine.initWords(['abc']);
  });

  it('marks a correct character with text-primary', () => {
    engine.handleKeyPress('a');
    expect(engine.charClasses.value[0][0]).toBe('text-primary');
    expect(engine.results.correctCharacters).toBe(1);
  });

  it('marks a wrong character with text-error and the word with border-error', () => {
    engine.handleKeyPress('x');
    expect(engine.charClasses.value[0][0]).toBe('text-error');
    expect(engine.wordClasses.value[0]).toBe('border-b-4 border-error');
    expect(engine.results.wrongCharacters).toBe(1);
  });

  it('increments charIndex after each keypress', () => {
    engine.handleKeyPress('a');
    expect(engine.charIndex.value).toBe(1);
    engine.handleKeyPress('b');
    expect(engine.charIndex.value).toBe(2);
  });

  it('returns false for non-letter keys', () => {
    expect(engine.handleKeyPress('Shift')).toBe(false);
    expect(engine.results.correctCharacters).toBe(0);
  });
});

// ────────────────────────────────────────────────────────────
// handleKeyPress — overflow
// ────────────────────────────────────────────────────────────
describe('handleKeyPress — overflow characters', () => {
  it('appends extra characters marked as errors', () => {
    engine.initWords(['ab']);

    engine.handleKeyPress('a'); // correct
    engine.handleKeyPress('b'); // correct
    engine.handleKeyPress('x'); // overflow

    expect(engine.currentText.value[0]).toEqual(['a', 'b', 'x']);
    expect(engine.charClasses.value[0][2]).toBe('text-error');
    // 1 wrong for the mismatch + 1 wrong for overflow = 2
    expect(engine.results.wrongCharacters).toBe(2);
  });
});

// ────────────────────────────────────────────────────────────
// handleKeyPress — space (word completion)
// ────────────────────────────────────────────────────────────
describe('handleKeyPress — space', () => {
  it('scores a correct word and fires onSpaceCorrect callback', () => {
    const onCorrect = vi.fn();
    const eng = useTypingEngine({ phraseRef: { value: null }, callbacks: { onSpaceCorrect: onCorrect } });
    eng.initWords(['hi', 'ok']);

    eng.handleKeyPress('h');
    eng.handleKeyPress('i');
    eng.handleKeyPress(' ');

    expect(eng.results.correctWords).toBe(1);
    expect(eng.results.wrongWords).toBe(0);
    expect(onCorrect).toHaveBeenCalledOnce();
  });

  it('scores a wrong word when space is pressed early and fires onSpaceWrong', () => {
    const onWrong = vi.fn();
    const eng = useTypingEngine({ phraseRef: { value: null }, callbacks: { onSpaceWrong: onWrong } });
    eng.initWords(['hello', 'ok']);

    eng.handleKeyPress('h'); // only typed 1 of 5 chars
    eng.handleKeyPress(' ');

    expect(eng.results.wrongWords).toBe(1);
    expect(onWrong).toHaveBeenCalledOnce();
  });

  it('highlights the next word after space', () => {
    engine.initWords(['aa', 'bb']);
    engine.handleKeyPress('a');
    engine.handleKeyPress('a');
    engine.handleKeyPress(' ');

    expect(engine.wordClasses.value[1]).toBe('border-b-4 border-primary');
  });
});

// ────────────────────────────────────────────────────────────
// isPastLineEnd
// ────────────────────────────────────────────────────────────
describe('isPastLineEnd', () => {
  it('returns true after all words are completed', () => {
    engine.initWords(['hi']);
    engine.handleKeyPress('h');
    engine.handleKeyPress('i');
    engine.handleKeyPress(' ');

    expect(engine.isPastLineEnd()).toBe(true);
  });
});

// ────────────────────────────────────────────────────────────
// generateHtml
// ────────────────────────────────────────────────────────────
describe('generateHtml', () => {
  it('renders spans for each character and word', () => {
    engine.initWords(['ab']);
    const html = engine.generateHtml();
    expect(html).toContain('<span');
    expect(html).toContain('a');
    expect(html).toContain('b');
  });
});

// ────────────────────────────────────────────────────────────
// resetResults
// ────────────────────────────────────────────────────────────
describe('resetResults', () => {
  it('resets all counters to zero', () => {
    engine.initWords(['ab']);
    engine.handleKeyPress('x'); // create some scores
    engine.resetResults(2);

    expect(engine.results.correctCharacters).toBe(0);
    expect(engine.results.wrongCharacters).toBe(0);
    expect(engine.results.correctWords).toBe(0);
    expect(engine.results.wrongWords).toBe(0);
    expect(engine.results.duration).toBe(2);
  });
});
