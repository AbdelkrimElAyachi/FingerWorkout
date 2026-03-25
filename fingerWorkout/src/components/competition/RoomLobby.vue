<script setup>
import AppButton from '@/components/common/AppButton.vue';

defineProps({
  roomCode: { type: String, default: '' },
});

const emit = defineEmits(['join-room', 'create-room', 'update:roomCode']);
</script>

<template>
  <div class="lobby">
    <div class="lobby__card">
      <div class="lobby__header">
        <i class="bi bi-trophy lobby__icon"></i>
        <h2 class="lobby__title">Competition</h2>
        <p class="lobby__subtitle">Join an existing room or create your own</p>
      </div>

      <div class="lobby__input-wrap">
        <i class="bi bi-hash lobby__input-icon"></i>
        <input
          :value="roomCode"
          @input="emit('update:roomCode', $event.target.value)"
          type="text"
          placeholder="Enter room code"
          class="lobby__input"
        />
      </div>

      <div class="lobby__actions">
        <button class="lobby__btn lobby__btn--primary" @click="emit('join-room')">
          <i class="bi bi-box-arrow-in-right"></i>
          Join Room
        </button>
        <button class="lobby__btn lobby__btn--outline" @click="emit('create-room')">
          <i class="bi bi-plus-circle"></i>
          Create Room
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lobby {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5rem 1.5rem 2rem;
}

.lobby__card {
  width: 100%;
  max-width: 26rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.lobby__header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.lobby__icon {
  font-size: 2.5rem;
  color: var(--color-primary);
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.lobby__title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-text);
  margin: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-text));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lobby__subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.45;
}

.lobby__input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.lobby__input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.125rem;
  color: var(--color-text);
  opacity: 0.3;
}

.lobby__input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-align: center;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  outline: none;
  transition: all 0.3s ease;
}

.lobby__input::placeholder {
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 0.05em;
  font-weight: 400;
}

.lobby__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 102, 255, 51), 0.15);
  background: rgba(255, 255, 255, 0.08);
}

.lobby__actions {
  display: flex;
  gap: 0.75rem;
}

.lobby__btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1.5px solid transparent;
}

.lobby__btn--primary {
  background: var(--color-primary);
  color: var(--color-bg);
}

.lobby__btn--primary:hover {
  opacity: 0.85;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(var(--color-primary-rgb, 102, 255, 51), 0.25);
}

.lobby__btn--outline {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text);
  border-color: rgba(255, 255, 255, 0.12);
}

.lobby__btn--outline:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(var(--color-primary-rgb, 102, 255, 51), 0.08);
  transform: translateY(-1px);
}
</style>
