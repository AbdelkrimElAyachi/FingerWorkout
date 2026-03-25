<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores';
import { apiBaseUrl } from '@/utils/api';
import routes from '@/routes';

const authStore = useAuthStore();

const navRoutes = computed(() =>
  routes.filter((r) => {
    if (!r.showInNav) return false;
    if (r.requiresAuth && !authStore.isAuthenticated) return false;
    if (r.guestOnly && authStore.isAuthenticated) return false;
    return true;
  })
);

const themes = [
  { name: 'default', bg: '#0F172A', accent: '#66FF33' },
  { name: 'blue',    bg: '#0F172A', accent: '#3d85fe' },
  { name: 'pink',    bg: '#0F172A', accent: '#fe3dd4' },
];

const currentTheme = ref('default');

function setTheme(themeName) {
  currentTheme.value = themeName;
  localStorage.setItem('data-theme', themeName);
  document.getElementById('app').setAttribute('data-theme', themeName);
}

onMounted(() => {
  const saved = localStorage.getItem('data-theme') || 'default';
  currentTheme.value = saved;
  document.getElementById('app').setAttribute('data-theme', saved);
});
</script>

<template>
  <header class="header-glass sticky top-0 z-50">
    <div class="flex items-center justify-between w-5/6 mx-auto py-4">

      <!-- Left: Branding -->
      <RouterLink to="/" class="flex items-center gap-2 group no-underline">
        <i class="bi bi-keyboard text-2xl text-primary transition-transform duration-300 group-hover:scale-110"></i>
        <span class="brand-text text-xl font-extrabold tracking-tight">
          Finger Workout
        </span>
      </RouterLink>

      <!-- Center: Navigation (driven by routes.js metadata) -->
      <nav>
        <ul class="flex items-center gap-1 list-none m-0 p-0">
          <li v-for="route in navRoutes" :key="route.name">
            <RouterLink :to="route.path" class="nav-pill">
              <i :class="['bi', route.icon, 'text-sm']"></i>
              {{ route.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Right: Theme switcher + Avatar -->
      <div class="flex items-center gap-4">
        <!-- Theme circles -->
        <div class="flex items-center gap-2 bg-backgroundColorDarker rounded-full px-3 py-1.5">
          <button
            v-for="theme in themes"
            :key="theme.name"
            @click="setTheme(theme.name)"
            class="theme-circle"
            :class="{ 'theme-circle--active': currentTheme === theme.name }"
            :style="{ backgroundColor: theme.accent }"
            :title="theme.name.charAt(0).toUpperCase() + theme.name.slice(1)"
            :aria-label="`Switch to ${theme.name} theme`"
          ></button>
        </div>

        <!-- User avatar (when logged in) -->
        <RouterLink
          v-if="authStore.isAuthenticated"
          to="/profile"
          class="flex-shrink-0"
        >
          <img
            :src="authStore.getPicture ? apiBaseUrl + '/uploads/' + authStore.getPicture : '/assets/avatar.webp'"
            alt="Avatar"
            class="w-9 h-9 rounded-full object-cover ring-2 ring-primary/50 hover:ring-primary transition-all duration-300"
          />
        </RouterLink>
      </div>

    </div>
  </header>
</template>

<style scoped>
/* ── Glassmorphism header ──────────────────────────────── */
.header-glass {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(var(--color-primary-rgb, 102, 255, 51), 0.15);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.3),
    0 4px 24px rgba(0, 0, 0, 0.15);
}

/* ── Brand gradient text ───────────────────────────────── */
.brand-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-text));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ── Navigation pills ──────────────────────────────────── */
.nav-pill {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.7;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-pill:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.06);
}

/* Vue Router active class */
.nav-pill.router-link-exact-active {
  opacity: 1;
  background: rgba(var(--color-primary-rgb, 102, 255, 51), 0.12);
  color: var(--color-primary);
}

/* ── Theme switcher circles ────────────────────────────── */
.theme-circle {
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.theme-circle:hover {
  transform: scale(1.25);
}

.theme-circle--active {
  border-color: var(--color-text);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  transform: scale(1.15);
}
</style>
