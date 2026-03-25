<script setup>
import UserAvatar from '@/components/competition/UserAvatar.vue';

defineProps({
  users: { type: Array, required: true },
});
</script>

<template>
  <div class="room-users">
    <h4 class="room-users__title">
      <i class="bi bi-people"></i>
      Players
      <span class="room-users__count">{{ users.length }}</span>
    </h4>
    <div class="room-users__grid">
      <UserAvatar v-for="user in users" :key="user.id" :user="user" />
    </div>
  </div>
</template>

<style scoped>
.room-users {
  margin-top: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
}

.room-users__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-text);
  opacity: 0.7;
}

.room-users__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.375rem;
  height: 1.375rem;
  padding: 0 0.375rem;
  border-radius: 9999px;
  background: rgba(var(--color-primary-rgb, 102, 255, 51), 0.12);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 800;
}

.room-users__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}
</style>
