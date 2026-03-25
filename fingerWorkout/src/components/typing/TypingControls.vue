<script setup>
const emit = defineEmits(['restart']);

function restart(e) {
  e.target.blur();
  emit('restart');
}
</script>

<template>
  <div class="controls">
    <button class="controls__btn" @click="restart">
      <i class="bi bi-arrow-clockwise controls__icon"></i>
      Restart
    </button>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  justify-content: center;
  margin-top: 1.25rem;
}

.controls__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.controls__btn:hover {
  background: rgba(var(--color-primary-rgb, 102, 255, 51), 0.1);
  border-color: rgba(var(--color-primary-rgb, 102, 255, 51), 0.3);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.controls__btn:active {
  transform: translateY(0);
}

.controls__icon {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.controls__btn:hover .controls__icon {
  transform: rotate(-90deg);
}
</style>
