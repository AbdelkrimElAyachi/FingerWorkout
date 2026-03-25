<script setup>
import { ref } from 'vue';
import SoundSettings from '@/components/typing/SoundSettings.vue';
import TestSettings from '@/components/typing/TestSettings.vue';

const openWindow = ref('');

function togglePanel(panel) {
  openWindow.value = openWindow.value !== panel ? panel : '';
}
</script>

<template>
  <div class="footer-bar">
    <!-- Trigger buttons -->
    <div class="flex items-center gap-2">
      <button
        @click="togglePanel('sound')"
        class="footer-btn"
        :class="{ 'footer-btn--active': openWindow === 'sound' }"
      >
        <i class="bi bi-volume-up text-sm"></i>
        Sound
      </button>
      <button
        @click="togglePanel('parameters')"
        class="footer-btn"
        :class="{ 'footer-btn--active': openWindow === 'parameters' }"
      >
        <i class="bi bi-sliders text-sm"></i>
        Test Settings
      </button>
    </div>

    <!-- Floating panels -->
    <Transition name="panel-slide">
      <SoundSettings v-if="openWindow === 'sound'" />
    </Transition>
    <Transition name="panel-slide">
      <TestSettings v-if="openWindow === 'parameters'" />
    </Transition>
  </div>
</template>

<style scoped>
.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 40;
  padding: 0.75rem 1.5rem;
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.5;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.footer-btn:hover {
  opacity: 0.85;
  background: rgba(255, 255, 255, 0.05);
}

.footer-btn--active {
  opacity: 1;
  background: rgba(var(--color-primary-rgb, 102, 255, 51), 0.1);
  border-color: rgba(var(--color-primary-rgb, 102, 255, 51), 0.25);
  color: var(--color-primary);
}

/* Panel transition */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.25s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
