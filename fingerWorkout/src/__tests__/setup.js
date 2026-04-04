// Global test setup — runs before every test file.

import { vi } from 'vitest';

// Stub import.meta.env so modules that read VITE_* vars don't blow up.
vi.stubEnv('VITE_API_URL', 'http://localhost:9999');

// Provide a minimal localStorage mock (jsdom already has one, but
// this ensures a clean slate between tests).
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = String(value); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });
