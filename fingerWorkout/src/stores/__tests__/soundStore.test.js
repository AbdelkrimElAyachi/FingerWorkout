import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSoundStore } from '../soundStore';

describe('soundStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has correct default state', () => {
    const store = useSoundStore();
    expect(store.sound).toBe('cherryBlue');
    expect(store.soundLevel).toBe(25);
  });

  it('getters return current values', () => {
    const store = useSoundStore();
    expect(store.getSound).toBe('cherryBlue');
    expect(store.getSoundLevel).toBe(25);
  });

  it('setSound updates the sound', () => {
    const store = useSoundStore();
    store.setSound('keyboard');
    expect(store.getSound).toBe('keyboard');
  });

  it('setSoundLevel updates the level', () => {
    const store = useSoundStore();
    store.setSoundLevel(80);
    expect(store.getSoundLevel).toBe(80);
  });
});
