<script setup>
import { ref, watch } from 'vue';
import { useParameterStore } from '@/stores';

const parameterStore = useParameterStore();
const duration = ref(parameterStore.getDuration);

watch(duration, (val) => parameterStore.setDuration(val));
</script>

<template>
  <div class="settings-panel">
    <!-- Header -->
    <div class="panel-header">
      <i class="bi bi-sliders"></i>
      <span>Test Settings</span>
    </div>

    <!-- Duration -->
    <label class="panel-label">
      <span class="label-text">Duration</span>
      <div class="duration-grid">
        <button
          v-for="n in 5"
          :key="n"
          @click="duration = n"
          class="duration-chip"
          :class="{ 'duration-chip--active': duration == n }"
        >
          {{ n }}m
        </button>
      </div>
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
  gap: 0.45rem;
}

.label-text {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text);
  opacity: 0.5;
}

/* Duration chips grid */
.duration-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.35rem;
}

.duration-chip {
  padding: 0.4rem 0;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-text);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.duration-chip:hover {
  border-color: rgba(var(--color-primary-rgb, 102, 255, 51), 0.3);
  background: rgba(255, 255, 255, 0.06);
}

.duration-chip--active {
  background: rgba(var(--color-primary-rgb, 102, 255, 51), 0.15);
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: 0 0 8px rgba(var(--color-primary-rgb, 102, 255, 51), 0.2);
}
</style>
