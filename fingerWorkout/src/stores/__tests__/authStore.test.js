import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

// Mock the auth + tests utilities that authStore imports.
vi.mock('@/utils/auth', () => ({
  getUser: vi.fn(),
}));
vi.mock('@/utils/tests', () => ({
  getTopTestResult: vi.fn(),
}));

import { useAuthStore } from '../authStore';
import { getUser } from '@/utils/auth';
import { getTopTestResult } from '@/utils/tests';

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('has correct default (unauthenticated) state', () => {
    const store = useAuthStore();
    expect(store.authenticated).toBe(false);
    expect(store.name).toBeNull();
    expect(store.email).toBeNull();
    expect(store.token).toBeNull();
    expect(store.topTestResult).toBe(0);
  });

  it('isAuthenticated getter reflects state', () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
  });

  it('setUser populates state and stores token in localStorage', () => {
    const store = useAuthStore();
    store.setUser({ name: 'Alice', email: 'a@b.com', picture: 'pic.jpg' }, 'tok123');

    expect(store.name).toBe('Alice');
    expect(store.email).toBe('a@b.com');
    expect(store.picture).toBe('pic.jpg');
    expect(store.token).toBe('tok123');
    expect(store.authenticated).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'tok123');
  });

  it('clear resets state and removes token from localStorage', () => {
    const store = useAuthStore();
    store.setUser({ name: 'Alice', email: 'a@b.com' }, 'tok');
    store.clear();

    expect(store.name).toBeNull();
    expect(store.email).toBeNull();
    expect(store.authenticated).toBe(false);
    expect(store.token).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
  });

  it('setNewRecord updates topTestResult', () => {
    const store = useAuthStore();
    store.setNewRecord(95);
    expect(store.topTestResult).toBe(95);
    expect(store.getTopTestResult).toBe(95);
  });

  it('initializeAuth skips API calls if already authenticated', async () => {
    const store = useAuthStore();
    store.setUser({ name: 'X', email: 'x@x.com' }, 't');

    await store.initializeAuth();
    expect(getUser).not.toHaveBeenCalled();
  });

  it('initializeAuth stays unauthenticated when getUser returns false', async () => {
    getUser.mockResolvedValue(false);

    const store = useAuthStore();
    await store.initializeAuth();

    expect(store.authenticated).toBe(false);
    expect(getTopTestResult).not.toHaveBeenCalled();
  });

  it('initializeAuth fetches user and top test result', async () => {
    getUser.mockResolvedValue({ name: 'Bob', email: 'bob@b.com', picture: null });
    getTopTestResult.mockResolvedValue([{ wpm: 75 }]);

    const store = useAuthStore();
    await store.initializeAuth();

    expect(store.name).toBe('Bob');
    expect(store.email).toBe('bob@b.com');
    expect(store.authenticated).toBe(true);
    expect(store.topTestResult).toBe(75);
  });


});
