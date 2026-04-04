import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to mock the api module before importing auth functions.
vi.mock('@/utils/api', () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
    },
  };
});

import { login, register, updateProfile, getUser } from '../auth';
import api from '@/utils/api';

// ────────────────────────────────────────────────────────────
// extractApiErrors  (tested indirectly through login/register)
// ────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.restoreAllMocks();
});

// ────────────────────────────────────────────────────────────
// login
// ────────────────────────────────────────────────────────────
describe('login', () => {
  it('returns response data on success', async () => {
    const payload = { success: true, user: { name: 'Alice' }, token: 'tok123' };
    api.post.mockResolvedValue({ data: payload });

    const result = await login('alice@test.com', 'pass123');
    expect(result).toEqual(payload);
    expect(api.post).toHaveBeenCalledWith('/json/login', {
      email: 'alice@test.com',
      password: 'pass123',
    });
  });

  it('extracts Zod field errors from a 422 response', async () => {
    api.post.mockRejectedValue({
      response: {
        data: {
          fieldErrors: {
            email: ['Invalid email format'],
            password: ['Too short'],
          },
        },
      },
    });

    const result = await login('bad', 'x');
    expect(result.success).toBe(false);
    expect(result.errors.validationErrors.email).toBe('Invalid email format');
    expect(result.errors.validationErrors.password).toBe('Too short');
  });

  it('extracts an auth error message', async () => {
    api.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    const result = await login('a@b.com', 'wrong');
    expect(result.success).toBe(false);
    expect(result.errors.authError).toBe('Invalid credentials');
  });

  it('re-throws on network error (no response)', async () => {
    api.post.mockRejectedValue(new Error('Network Error'));
    await expect(login('a@b.com', 'pass')).rejects.toThrow('Network Error');
  });
});

// ────────────────────────────────────────────────────────────
// register
// ────────────────────────────────────────────────────────────
describe('register', () => {
  it('returns response data on success', async () => {
    const payload = { success: true, user: { name: 'Bob' } };
    api.post.mockResolvedValue({ data: payload });

    const result = await register('Bob', 'bob@test.com', 'pass123');
    expect(result).toEqual(payload);
  });

  it('extracts API errors from a 422 response', async () => {
    api.post.mockRejectedValue({
      response: {
        data: { fieldErrors: { email: ['Already taken'] } },
      },
    });

    const result = await register('Bob', 'bob@test.com', 'pass');
    expect(result.success).toBe(false);
    expect(result.errors.validationErrors.email).toBe('Already taken');
  });

  it('returns fallback error on network failure', async () => {
    api.post.mockRejectedValue(new Error('Network Error'));

    const result = await register('Bob', 'bob@test.com', 'pass');
    expect(result.success).toBe(false);
    expect(result.errors.authError).toContain('Unable to connect');
  });
});

// ────────────────────────────────────────────────────────────
// updateProfile
// ────────────────────────────────────────────────────────────
describe('updateProfile', () => {
  it('returns data when response.success is true', async () => {
    const payload = { success: true, user: { name: 'Alice Updated' } };
    api.post.mockResolvedValue({ data: payload });

    const result = await updateProfile(new FormData());
    expect(result).toEqual(payload);
  });

  it('extracts errors when response.success is false', async () => {
    api.post.mockResolvedValue({
      data: { success: false, message: 'Name too short' },
    });

    const result = await updateProfile(new FormData());
    expect(result.success).toBe(false);
    expect(result.errors.authError).toBe('Name too short');
  });

  it('throws on connection error', async () => {
    api.post.mockRejectedValue(new Error('timeout'));
    await expect(updateProfile(new FormData())).rejects.toThrow('Error establishing connection');
  });
});

// ────────────────────────────────────────────────────────────
// getUser
// ────────────────────────────────────────────────────────────
describe('getUser', () => {
  it('returns the user object on success', async () => {
    api.get.mockResolvedValue({ data: { success: true, user: { name: 'Alice' } } });

    const user = await getUser();
    expect(user).toEqual({ name: 'Alice' });
  });

  it('returns false when success is false', async () => {
    api.get.mockResolvedValue({ data: { success: false } });
    expect(await getUser()).toBe(false);
  });

  it('returns false on network error', async () => {
    api.get.mockRejectedValue(new Error('Network Error'));
    expect(await getUser()).toBe(false);
  });
});
