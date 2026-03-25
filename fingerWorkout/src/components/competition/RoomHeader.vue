<script setup>
import { computed } from 'vue';

const props = defineProps({
  roomCode: { type: String, required: true },
  ttl: { type: Number, default: 0 },
});

const emit = defineEmits(['leaveRoom']);

const formattedTtl = computed(() => {
  const m = Math.floor(props.ttl / 60);
  const s = String(props.ttl % 60).padStart(2, '0');
  return `${m}:${s}`;
});

const urgency = computed(() => {
  if (props.ttl <= 30) return 'critical';
  if (props.ttl <= 120) return 'warning';
  return '';
});
</script>

<template>
  <div class="room-header">
    <div class="room-header__left">
      <div class="room-header__code-badge">
        <i class="bi bi-hash"></i>
        <span class="room-header__code">{{ roomCode }}</span>
      </div>
      <div class="room-header__timer" :class="`room-header__timer--${urgency}`">
        <i class="bi bi-clock"></i>
        <span>{{ formattedTtl }}</span>
      </div>
    </div>
    <button class="room-header__exit" @click="emit('leaveRoom')">
      <i class="bi bi-box-arrow-right"></i>
      Leave
    </button>
  </div>
</template>

<style scoped>
.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.room-header__left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.room-header__code-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.875rem;
  background: rgba(var(--color-primary-rgb, 102, 255, 51), 0.1);
  border: 1px solid rgba(var(--color-primary-rgb, 102, 255, 51), 0.2);
  border-radius: 9999px;
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.9375rem;
  letter-spacing: 0.1em;
}

.room-header__timer {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
  opacity: 0.7;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.room-header__timer--warning {
  color: #ffc832;
  opacity: 1;
  border-color: rgba(255, 200, 50, 0.25);
  background: rgba(255, 200, 50, 0.06);
}

.room-header__timer--critical {
  color: var(--color-error);
  opacity: 1;
  border-color: rgba(255, 79, 99, 0.3);
  background: rgba(255, 79, 99, 0.08);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 79, 99, 0); }
  50%      { box-shadow: 0 0 10px 2px rgba(255, 79, 99, 0.2); }
}

.room-header__exit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-error);
  background: rgba(255, 79, 99, 0.08);
  border: 1.5px solid rgba(255, 79, 99, 0.2);
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.room-header__exit:hover {
  background: rgba(255, 79, 99, 0.15);
  border-color: rgba(255, 79, 99, 0.4);
  transform: translateY(-1px);
}
</style>
