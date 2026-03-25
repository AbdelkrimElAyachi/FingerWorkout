<script setup>
import { ref, watch } from 'vue';
import { useSoundStore } from '@/stores';
import { sounds } from '@/globals.js';

const soundStore = useSoundStore();
const soundLevel = ref(soundStore.getSoundLevel);
const sound = ref(soundStore.getSound);
const choices = sounds;

watch(soundLevel, (val) => soundStore.setSoundLevel(val));
watch(sound, (val) => soundStore.setSound(val));
</script>

<template>
  <div class="settings-panel">
    <!-- Header -->
    <div class="panel-header">
      <i class="bi bi-volume-up"></i>
      <span>Sound Settings</span>
    </div>

    <!-- Sound type -->
    <label class="panel-label">
      <span class="label-text">Sound Effect</span>
      <div class="select-wrapper">
        <select v-model="sound" class="panel-select">
          <option v-for="choice in choices" :key="choice" :value="choice">
            {{ choice }}
          </option>
        </select>
        <i class="bi bi-chevron-down select-icon"></i>
      </div>
    </label>

    <!-- Volume -->
    <label class="panel-label">
      <div class="flex items-center justify-between">
        <span class="label-text">Volume</span>
        <span class="volume-badge">{{ soundLevel }}%</span>
      </div>
      <input
        v-model="soundLevel"
        type="range"
        min="0"
        max="100"
        class="panel-range"
      />
    </label>
  </div>
</template>

<style scoped>
.settings-panel {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 0;
  width: 260px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow:
    0 -4px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--color-primary);
  letter-spacing: 0.02em;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.panel-label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.label-text {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text);
  opacity: 0.5;
}

/* Select wrapper */
.select-wrapper {
  position: relative;
}

.panel-select {
  width: 100%;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: var(--color-text);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  transition: all 0.2s ease;
}

.panel-select:hover,
.panel-select:focus {
  border-color: rgba(var(--color-primary-rgb, 102, 255, 51), 0.35);
  background: rgba(255, 255, 255, 0.06);
}

.panel-select option {
  background: #1e293b;
  color: var(--color-text);
}

.select-icon {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.65rem;
  color: var(--color-text);
  opacity: 0.4;
  pointer-events: none;
}

/* Volume badge */
.volume-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-primary);
  background: rgba(var(--color-primary-rgb, 102, 255, 51), 0.1);
  padding: 0.1rem 0.5rem;
  border-radius: 9999px;
}

/* Range slider */
.panel-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  outline: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.panel-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 2px solid rgba(15, 23, 42, 0.8);
  cursor: pointer;
  box-shadow: 0 0 8px rgba(var(--color-primary-rgb, 102, 255, 51), 0.4);
  transition: all 0.2s ease;
}

.panel-range::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 12px rgba(var(--color-primary-rgb, 102, 255, 51), 0.6);
}

.panel-range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 2px solid rgba(15, 23, 42, 0.8);
  cursor: pointer;
  box-shadow: 0 0 8px rgba(var(--color-primary-rgb, 102, 255, 51), 0.4);
}
</style>
