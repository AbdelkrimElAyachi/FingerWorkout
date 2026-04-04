import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/api', () => ({
  default: { post: vi.fn(), get: vi.fn() },
}));

import { saveTestResults, getTestResults, getTopTestResult } from '../tests';
import api from '@/utils/api';

beforeEach(() => vi.restoreAllMocks());

// ────────────────────────────────────────────────────────────
// saveTestResults
// ────────────────────────────────────────────────────────────
describe('saveTestResults', () => {
  it('returns true on success', async () => {
    api.post.mockResolvedValue({ data: { success: true } });

    const result = await saveTestResults(100, 20, 5, 1, 1);
    expect(result).toBe(true);
    expect(api.post).toHaveBeenCalledWith('/json/test/save', expect.objectContaining({
      numberCorrectCharacters: 100,
      numberCorrectWords: 20,
      numberWrongCharacters: 5,
      numberWrongWords: 1,
      duration: 1,
    }));
  });

  it('throws when success is false', async () => {
    api.post.mockResolvedValue({ data: { success: false } });
    await expect(saveTestResults(0, 0, 0, 0, 1)).rejects.toThrow('Failed to save test results');
  });
});

// ────────────────────────────────────────────────────────────
// getTestResults
// ────────────────────────────────────────────────────────────
describe('getTestResults', () => {
  it('returns paginated results on success', async () => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        data: [{ wpm: 60 }],
        total: 1,
        pages: 1,
        page: 1,
        limit: 10,
      },
    });

    const result = await getTestResults(1, 10);
    expect(result.testResults).toEqual([{ wpm: 60 }]);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(api.get).toHaveBeenCalledWith('/json/test/all?page=1&limit=10');
  });

  it('throws when success is false', async () => {
    api.get.mockResolvedValue({ data: { success: false } });
    await expect(getTestResults(1, 10)).rejects.toThrow('Failed to fetch test results');
  });
});

// ────────────────────────────────────────────────────────────
// getTopTestResult
// ────────────────────────────────────────────────────────────
describe('getTopTestResult', () => {
  it('returns top result data on success', async () => {
    const topData = [{ wpm: 120 }];
    api.get.mockResolvedValue({ data: { success: true, data: topData } });

    const result = await getTopTestResult();
    expect(result).toEqual(topData);
  });

  it('throws when success is false', async () => {
    api.get.mockResolvedValue({ data: { success: false } });
    await expect(getTopTestResult()).rejects.toThrow('Failed to fetch top test result');
  });
});
