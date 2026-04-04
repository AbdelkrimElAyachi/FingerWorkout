import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useParameterStore } from '../parameterStore';

describe('parameterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has a default duration of 1', () => {
    const store = useParameterStore();
    expect(store.duration).toBe(1);
    expect(store.getDuration).toBe(1);
  });

  it('setDuration updates the duration', () => {
    const store = useParameterStore();
    store.setDuration(5);
    expect(store.duration).toBe(5);
    expect(store.getDuration).toBe(5);
  });
});
