<script setup>
defineProps({
  user: { type: Object, required: true },
});

const emit = defineEmits(['markReady']);
</script>

<template>
  <div class="ready-wrap">
    <button
      class="ready-btn"
      :class="{ 'ready-btn--done': user.isReady }"
      :disabled="user.isReady"
      @click="emit('markReady')"
    >
      <i :class="user.isReady ? 'bi bi-check-circle-fill' : 'bi bi-lightning-charge-fill'"></i>
      {{ user.isReady ? 'Ready!' : 'Ready Up' }}
    </button>
  </div>
</template>

<style scoped>
.ready-wrap {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.ready-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 2.5rem;
  font-size: 1rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;

  color: var(--color-bg);
  background: linear-gradient(135deg, var(--color-primary), rgba(var(--color-primary-rgb, 102, 255, 51), 0.7));
  box-shadow: 0 4px 20px rgba(var(--color-primary-rgb, 102, 255, 51), 0.25);
}

.ready-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 28px rgba(var(--color-primary-rgb, 102, 255, 51), 0.35);
}

.ready-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.ready-btn--done {
  background: rgba(var(--color-primary-rgb, 102, 255, 51), 0.12);
  color: var(--color-primary);
  box-shadow: none;
  cursor: default;
  border: 1.5px solid rgba(var(--color-primary-rgb, 102, 255, 51), 0.25);
}
</style>
