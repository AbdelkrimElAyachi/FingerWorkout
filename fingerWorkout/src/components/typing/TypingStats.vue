<script setup>
import { computed } from 'vue';

const props = defineProps({ results: { type: Object, required: true } });

const accuracy = computed(() => {
  const total = props.results.correctCharacters + props.results.wrongCharacters;
  if (total === 0) return 100;
  return Math.round((props.results.correctCharacters / total) * 100);
});

const wpm = computed(() => {
  // words per minute ≈ correct chars ÷ 5 ÷ duration (in minutes)
  if (!props.results.duration) return 0;
  return Math.round((props.results.correctWords) / props.results.duration);
});
</script>
<template>
  <div class="stats">
    <div class="stats__card stats__card--accent">
      <span class="stats__value">{{ wpm }}</span>
      <span class="stats__label">WPM</span>
    </div>
    <div class="stats__card">
      <span class="stats__value" :class="{ 'stats__value--warning': accuracy < 80 }">{{ accuracy }}%</span>
      <span class="stats__label">Accuracy</span>
    </div>
    <div class="stats__divider"></div>
    <div class="stats__detail">
      <i class="bi bi-check-circle stats__detail-icon stats__detail-icon--correct"></i>
      <span class="stats__detail-num">{{ results.correctWords }}</span>
      <span class="stats__detail-label">words</span>
    </div>
    <div class="stats__detail">
      <i class="bi bi-x-circle stats__detail-icon stats__detail-icon--wrong"></i>
      <span class="stats__detail-num">{{ results.wrongWords }}</span>
      <span class="stats__detail-label">words</span>
    </div>
    <div class="stats__divider"></div>
    <div class="stats__detail">
      <i class="bi bi-check-circle stats__detail-icon stats__detail-icon--correct"></i>
      <span class="stats__detail-num">{{ results.correctCharacters }}</span>
      <span class="stats__detail-label">chars</span>
    </div>
    <div class="stats__detail">
      <i class="bi bi-x-circle stats__detail-icon stats__detail-icon--wrong"></i>
      <span class="stats__detail-num">{{ results.wrongCharacters }}</span>
      <span class="stats__detail-label">chars</span>
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  flex-wrap: wrap;
  justify-content: center;
}

/* ── Big stat cards (WPM, Accuracy) ──────────────── */
.stats__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.25rem 0.75rem;
}

.stats__card--accent .stats__value {
  color: var(--color-primary);
}

.stats__value {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.stats__value--warning {
  color: var(--color-error);
}

.stats__label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text);
  opacity: 0.4;
}

/* ── Divider ─────────────────────────────────────── */
.stats__divider {
  width: 1px;
  height: 2rem;
  background: rgba(255, 255, 255, 0.1);
}

/* ── Detail items (correct/wrong words & chars) ─── */
.stats__detail {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.stats__detail-icon {
  font-size: 0.8125rem;
}
.stats__detail-icon--correct {
  color: var(--color-primary);
  opacity: 0.7;
}
.stats__detail-icon--wrong {
  color: var(--color-error);
  opacity: 0.7;
}

.stats__detail-num {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.stats__detail-label {
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.4;
}
</style>
