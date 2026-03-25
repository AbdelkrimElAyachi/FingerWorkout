<script setup>
import { apiBaseUrl } from '@/utils/api';

const props = defineProps({
  user: { type: Object, required: true },
});

function avatarSrc(avatar) {
  if (!avatar || avatar.startsWith('/assets')) return '/assets/avatar.webp';
  return `${apiBaseUrl}/uploads/${avatar}`;
}
</script>

<template>
  <div class="avatar">
    <div class="avatar__ring" :class="{ 'avatar__ring--ready': user.isReady }">
      <img
        :src="avatarSrc(user.avatar)"
        class="avatar__img"
        :alt="user.id"
        @error="$event.target.src = '/assets/avatar.webp'"
      />
    </div>
    <span class="avatar__name">{{ user.id }}</span>
    <span v-if="user.isReady" class="avatar__badge">
      <i class="bi bi-check-lg"></i>
    </span>
  </div>
</template>

<style scoped>
.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  position: relative;
}

.avatar__ring {
  padding: 2px;
  border-radius: 9999px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  transition: all 0.4s ease;
}

.avatar__ring--ready {
  border-color: var(--color-primary);
  box-shadow: 0 0 12px rgba(var(--color-primary-rgb, 102, 255, 51), 0.3);
}

.avatar__img {
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  object-fit: cover;
  display: block;
}

.avatar__name {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.6;
  max-width: 5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.avatar__badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background: var(--color-primary);
  color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 900;
  box-shadow: 0 0 0 2px var(--color-bg);
}
</style>
