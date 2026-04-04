import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shuffleArray, getPhrases } from '../phrases';

// ────────────────────────────────────────────────────────────
// shuffleArray
// ────────────────────────────────────────────────────────────
describe('shuffleArray', () => {
  it('returns an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray([...arr]);
    expect(result).toHaveLength(arr.length);
  });

  it('contains the same elements after shuffle', () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    shuffleArray(copy);
    expect(copy.sort()).toEqual(arr.sort());
  });

  it('mutates the array in-place and returns the same reference', () => {
    const arr = [1, 2, 3];
    const result = shuffleArray(arr);
    expect(result).toBe(arr);
  });

  it('handles an empty array without errors', () => {
    const arr = [];
    expect(shuffleArray(arr)).toEqual([]);
  });

  it('handles a single-element array', () => {
    const arr = [42];
    expect(shuffleArray(arr)).toEqual([42]);
  });
});

// ────────────────────────────────────────────────────────────
// getPhrases
// ────────────────────────────────────────────────────────────
describe('getPhrases', () => {
  const fakeText = 'The quick brown fox jumps over the lazy dog and then runs away fast into the deep dark forest beyond the hills';

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns an array of strings', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        query: { pages: [{ extract: fakeText }] },
      }),
    }));

    const phrases = await getPhrases(5, 'Test');
    expect(Array.isArray(phrases)).toBe(true);
    phrases.forEach((p) => expect(typeof p).toBe('string'));
  });

  it('splits words into phrases of at most 12 words', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        query: { pages: [{ extract: fakeText }] },
      }),
    }));

    const phrases = await getPhrases(5, 'Test');
    phrases.forEach((phrase) => {
      const wordCount = phrase.split(' ').length;
      expect(wordCount).toBeLessThanOrEqual(12);
    });
  });

  it('builds the correct Wikipedia API URL', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({
        query: { pages: [{ extract: 'hello world' }] },
      }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    await getPhrases(3, 'JavaScript');
    expect(fetchSpy).toHaveBeenCalledOnce();
    const url = fetchSpy.mock.calls[0][0];
    expect(url).toContain('exsentences=3');
    expect(url).toContain('titles=JavaScript');
  });
});
