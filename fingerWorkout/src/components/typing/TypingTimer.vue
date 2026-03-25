<script setup>
import { computed } from 'vue';

const props = defineProps({ timeLeft: { type: Number, required: true } });

const minutes = computed(() => Math.floor(props.timeLeft / 60));
const seconds = computed(() => String(props.timeLeft % 60).padStart(2, '0'));

const urgencyClass = computed(() => {
  if (props.timeLeft <= 10) return 'timer--critical';
  if (props.timeLeft <= 30) return 'timer--warning';
  return '';
});
</script>

<template>
  <div class="timer" :class="urgencyClass">
    <div class="timer__display">
      <i class="bi bi-clock timer__icon"></i>
      <span class="timer__digits">{{ minutes }}:{{ seconds }}</span>
    </div>
  </div>
</template>

<style scoped>
.timer {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.timer__display {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.timer__icon {
  font-size: 1.125rem;
  color: var(--color-primary);
  opacity: 0.7;
}

.timer__digits {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
  opacity: 0.85;
  transition: color 0.4s ease, opacity 0.4s ease;
}

/* ── Urgency states ─────────────────────────────────── */

.timer--warning .timer__display {
  border-color: rgba(255, 200, 50, 0.25);
  background: rgba(255, 200, 50, 0.06);
}
.timer--warning .timer__digits {
  color: #ffc832;
  opacity: 1;
}
.timer--warning .timer__icon {
  color: #ffc832;
  opacity: 1;
}

.timer--critical .timer__display {
  border-color: rgba(255, 79, 99, 0.3);
  background: rgba(255, 79, 99, 0.08);
  animation: pulse-border 1s ease-in-out infinite;
}
.timer--critical .timer__digits {
  color: var(--color-error);
  opacity: 1;
  animation: pulse-text 1s ease-in-out infinite;
}
.timer--critical .timer__icon {
  color: var(--color-error);
  opacity: 1;
}

@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 79, 99, 0); }
  50%      { box-shadow: 0 0 12px 2px rgba(255, 79, 99, 0.2); }
}

@keyframes pulse-text {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.6; }
}
</style>
