<script setup>
import { ref, computed } from 'vue';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut } from 'vue-chartjs';

const props = defineProps({
  result: { type: Object, required: true },
  duration: { type: Number, required: true },
  users: { type: Array, default: () => [] },
});

const emit = defineEmits(['close-results']);

const modalOpen = ref(true);

const wpm = computed(() => {
  if (!props.result.correct || !props.duration) return 0;
  return Math.round(props.result.correct / props.duration);
});

const accuracy = computed(() => {
  const total = (props.result.correct || 0) + (props.result.wrong || 0);
  if (total === 0) return 0;
  return Math.round((props.result.correct / total) * 100);
});

const sortedUsers = computed(() =>
  [...props.users].sort((a, b) => (b.correct || 0) - (a.correct || 0)),
);

const chartData = computed(() => ({
  labels: ['Wrong', 'Correct'],
  datasets: [{
    data: [props.result.wrong, props.result.correct],
    backgroundColor: ['rgba(255, 79, 99, 0.7)', 'rgba(var(--color-primary-rgb, 102, 255, 51), 0.7)'],
    borderColor: ['rgba(255, 79, 99, 0.3)', 'rgba(var(--color-primary-rgb, 102, 255, 51), 0.3)'],
    borderWidth: 2,
    hoverOffset: 6,
  }],
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: '65%',
};

function closeModal() {
  modalOpen.value = false;
  emit('close-results');
}
</script>

<template>
  <div>
    <!-- Backdrop -->
    <div v-if="modalOpen" class="popup-backdrop" @click="closeModal"></div>

    <!-- Dialog -->
    <dialog v-if="modalOpen" open class="popup">
    <div class="popup__content">
      <!-- Left: Chart -->
      <div class="popup__chart-area">
        <Doughnut :data="chartData" :options="chartOptions" />
        <div class="popup__chart-center">
          <span class="popup__chart-pct">{{ accuracy }}%</span>
          <span class="popup__chart-label">Accuracy</span>
        </div>
      </div>

      <!-- Right: Stats -->
      <div class="popup__stats">
        <!-- WPM hero -->
        <div class="popup__wpm">
          <span class="popup__wpm-value">{{ wpm }}</span>
          <span class="popup__wpm-label">WPM</span>
        </div>

        <!-- Detail row -->
        <div class="popup__detail-row">
          <div class="popup__detail">
            <span class="popup__detail-value popup__detail-value--correct">{{ result.correct }}</span>
            <span class="popup__detail-label">Correct</span>
          </div>
          <div class="popup__detail">
            <span class="popup__detail-value popup__detail-value--wrong">{{ result.wrong }}</span>
            <span class="popup__detail-label">Wrong</span>
          </div>
          <div class="popup__detail">
            <i class="bi bi-hourglass-bottom popup__detail-icon"></i>
            <span class="popup__detail-label">{{ duration }} min</span>
          </div>
        </div>

        <!-- Leaderboard -->
        <div v-if="users?.length" class="popup__leaderboard">
          <h4 class="popup__leaderboard-title">
            <i class="bi bi-trophy"></i> Leaderboard
          </h4>
          <ul class="popup__leaderboard-list">
            <li
              v-for="(u, idx) in sortedUsers"
              :key="u.id"
              class="popup__leaderboard-item"
            >
              <span class="popup__rank" :class="{
                'popup__rank--gold': idx === 0,
                'popup__rank--silver': idx === 1,
                'popup__rank--bronze': idx === 2,
              }">{{ idx + 1 }}</span>
              <span class="popup__player-name">{{ u.id }}</span>
              <span class="popup__player-wpm">{{ Math.round(u.correct / duration) }} wpm</span>
            </li>
          </ul>
        </div>

        <!-- Close -->
        <button class="popup__close-btn" @click="closeModal">
          Continue
        </button>
      </div>
    </div>
  </dialog>
  </div>
</template>

<style scoped>
.popup-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 50;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 55;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.5rem;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  padding: 0;
  color: var(--color-text);
  max-width: 42rem;
  width: 92vw;
}

.popup__content {
  display: flex;
  gap: 2rem;
  padding: 2.5rem;
}

/* ── Chart ──────────────────────────────────────── */
.popup__chart-area {
  position: relative;
  flex-shrink: 0;
  width: 10rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup__chart-center {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popup__chart-pct {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
}

.popup__chart-label {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text);
  opacity: 0.4;
}

/* ── Stats ──────────────────────────────────────── */
.popup__stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.popup__wpm {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.popup__wpm-value {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1;
  color: var(--color-primary);
}

.popup__wpm-label {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  opacity: 0.45;
}

.popup__detail-row {
  display: flex;
  gap: 1.5rem;
}

.popup__detail {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.popup__detail-value {
  font-size: 1.25rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.popup__detail-value--correct { color: var(--color-primary); }
.popup__detail-value--wrong   { color: var(--color-error); }

.popup__detail-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text);
  opacity: 0.4;
}

.popup__detail-icon {
  font-size: 1.125rem;
  color: var(--color-text);
  opacity: 0.5;
}

/* ── Leaderboard ────────────────────────────────── */
.popup__leaderboard {
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.popup__leaderboard-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.popup__leaderboard-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 10rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.popup__leaderboard-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
}

.popup__rank {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.06);
  color: var(--color-text);
  opacity: 0.6;
  flex-shrink: 0;
}

.popup__rank--gold   { background: rgba(255, 215, 0, 0.2); color: #ffd700; opacity: 1; }
.popup__rank--silver { background: rgba(192, 192, 192, 0.2); color: #c0c0c0; opacity: 1; }
.popup__rank--bronze { background: rgba(205, 127, 50, 0.2); color: #cd7f32; opacity: 1; }

.popup__player-name {
  flex: 1;
  font-size: 0.8125rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.popup__player-wpm {
  font-size: 0.8125rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
  opacity: 0.6;
}

/* ── Close button ───────────────────────────────── */
.popup__close-btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  color: var(--color-bg);
  background: var(--color-primary);
  transition: all 0.25s ease;
}

.popup__close-btn:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .popup__content {
    flex-direction: column;
    align-items: center;
  }
  .popup__chart-area {
    width: 8rem;
  }
}
</style>
