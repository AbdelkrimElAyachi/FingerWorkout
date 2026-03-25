<script setup>
import { computed } from 'vue';
import { apiBaseUrl } from '@/utils/api';

const props = defineProps({
  users: { type: Array, required: true },
  totalWords: { type: Number, required: true },
  ttl: { type: Number, default: 0 },
});

function getUserProgress(user) {
  if (!props.totalWords || props.totalWords <= 0) return 0;
  return Math.min((user.correct / props.totalWords) * 100, 100);
}

const sortedUsers = computed(() =>
  [...props.users].sort((a, b) => (b.correct || 0) - (a.correct || 0))
);

const formattedTtl = computed(() => {
  const m = Math.floor(props.ttl / 60);
  const s = String(props.ttl % 60).padStart(2, '0');
  return `${m}:${s}`;
});

const rankEmoji = ['🥇', '🥈', '🥉'];

function avatarSrc(avatar) {
  if (!avatar || avatar.startsWith('/assets')) return '/assets/avatar.webp';
  return `${apiBaseUrl}/uploads/${avatar}`;
}
</script>

<template>
  <div class="race">
    <!-- Timer -->
    <div class="race__timer">
      <div class="race__timer-ring">
        <i class="bi bi-stopwatch"></i>
      </div>
      <span class="race__timer-value">{{ formattedTtl }}</span>
    </div>

    <!-- Lanes -->
    <div class="race__lanes">
      <!-- Finish line -->
      <div class="race__finish">
        <div class="race__finish-flag">
          <span class="race__finish-checker"></span>
          <span class="race__finish-checker"></span>
          <span class="race__finish-checker"></span>
          <span class="race__finish-checker"></span>
          <span class="race__finish-checker"></span>
          <span class="race__finish-checker"></span>
        </div>
      </div>

      <div
        v-for="(user, index) in sortedUsers"
        :key="user.id"
        class="race__lane"
        :class="{ 'race__lane--leader': index === 0 && getUserProgress(user) > 0 }"
      >
        <!-- Rank -->
        <span class="race__rank">{{ rankEmoji[index] || `#${index + 1}` }}</span>

        <!-- Avatar -->
        <div class="race__avatar-wrap">
          <img
            :src="avatarSrc(user.avatar)"
            class="race__avatar"
            :alt="user.id"
            @error="$event.target.src = '/assets/avatar.webp'"
          />
          <span
            v-if="getUserProgress(user) >= 100"
            class="race__avatar-badge"
          >
            <i class="bi bi-trophy-fill"></i>
          </span>
        </div>

        <!-- Name -->
        <span class="race__name">{{ user.id }}</span>

        <!-- Progress track -->
        <div class="race__track">
          <div
            class="race__progress"
            :style="{ width: getUserProgress(user) + '%' }"
          >
            <div class="race__progress-glow"></div>
          </div>
        </div>

        <!-- WPM -->
        <div class="race__wpm">
          <span class="race__wpm-value">{{ user.correct || 0 }}</span>
          <span class="race__wpm-label">wpm</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.race {
  position: relative;
}

/* ── Timer ─────────────────────────────────────── */
.race__timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
}

.race__timer-ring {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--color-primary);
}

.race__timer-value {
  font-size: 1.75rem;
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  color: var(--color-text);
  opacity: 0.85;
}

/* ── Lanes container ───────────────────────────── */
.race__lanes {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow: hidden;
}

/* ── Single lane ───────────────────────────────── */
.race__lane {
  display: grid;
  grid-template-columns: 1.5rem 2.5rem 5rem 1fr 3.5rem;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.625rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.race__lane--leader {
  background: rgba(var(--color-primary-rgb, 102, 255, 51), 0.04);
  border-color: rgba(var(--color-primary-rgb, 102, 255, 51), 0.12);
  box-shadow: 0 0 20px rgba(var(--color-primary-rgb, 102, 255, 51), 0.06);
}

/* ── Rank ──────────────────────────────────────── */
.race__rank {
  font-size: 0.875rem;
  text-align: center;
  line-height: 1;
}

/* ── Avatar ────────────────────────────────────── */
.race__avatar-wrap {
  position: relative;
  width: 2.25rem;
  height: 2.25rem;
}

.race__avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: border-color 0.3s ease;
}

.race__lane--leader .race__avatar {
  border-color: var(--color-primary);
  box-shadow: 0 0 10px rgba(var(--color-primary-rgb, 102, 255, 51), 0.25);
}

.race__avatar-badge {
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 9999px;
  background: var(--color-primary);
  color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  box-shadow: 0 0 0 2px var(--color-bg);
  animation: pop-in 0.3s ease;
}

/* ── Name ──────────────────────────────────────── */
.race__name {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.race__lane--leader .race__name {
  opacity: 0.9;
  color: var(--color-primary);
}

/* ── Track + Progress bar ──────────────────────── */
.race__track {
  height: 0.5rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
  position: relative;
}

.race__progress {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(
    90deg,
    var(--color-primary),
    rgba(var(--color-primary-rgb, 102, 255, 51), 0.6)
  );
  position: relative;
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  min-width: 0;
}

.race__progress-glow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(var(--color-primary-rgb, 102, 255, 51), 0.6),
    transparent 70%
  );
  filter: blur(3px);
  animation: pulse-glow 1.5s ease-in-out infinite;
}

/* ── WPM badge ─────────────────────────────────── */
.race__wpm {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.2rem 0.4rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.04);
}

.race__wpm-value {
  font-size: 0.875rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
  line-height: 1.1;
}

.race__wpm-label {
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text);
  opacity: 0.35;
}

/* ── Finish line ───────────────────────────────── */
.race__finish {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 4.5rem;
  width: 3px;
  z-index: 1;
  pointer-events: none;
}

.race__finish-flag {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -1px;
  width: 5px;
  display: flex;
  flex-direction: column;
  opacity: 0.15;
}

.race__finish-checker {
  flex: 1;
  background: var(--color-text);
}

.race__finish-checker:nth-child(even) {
  opacity: 0;
}

/* ── Animations ────────────────────────────────── */
@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes pop-in {
  0% { transform: scale(0); }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style>

