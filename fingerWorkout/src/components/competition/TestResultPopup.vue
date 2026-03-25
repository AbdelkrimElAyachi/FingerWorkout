<script setup>
import { ref, computed, watch } from 'vue';
import { Chart as ChartJS } from 'chart.js/auto';
import { Doughnut } from 'vue-chartjs';
import { useAuthStore } from '@/stores';

const props = defineProps({
  result: { type: Object, required: true },
});

const emit = defineEmits(['close-results']);

const authStore = useAuthStore();
const modalOpen = ref(true);

const calculTestWPM = computed(() => {
  if (!props.result.correctWords || !props.result.duration) return 1;
  return Math.round(props.result.correctWords / props.result.duration);
});

const increasePercentage = computed(() => {
  if (authStore.topTestResult <= 0) return null;
  return ((calculTestWPM.value - authStore.topTestResult) * 100 / authStore.topTestResult).toFixed(2);
});

// Update record when WPM changes (replaces side-effect in computed)
watch(calculTestWPM, (wpm) => {
  if (wpm > authStore.topTestResult) {
    authStore.setNewRecord(wpm);
  }
}, { immediate: true });

function chartData() {
  return {
    labels: ['wrong words', 'correct words'],
    datasets: [{
      labels: 'Word Accuracy',
      data: [props.result.wrongWords, props.result.correctWords],
      backgroundColor: ['red', 'blue'],
      hoverOffset: 4,
    }],
  };
}

function closeModal() {
  modalOpen.value = false;
  emit('close-results');
}
</script>

<template>
  <div v-if="modalOpen" class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"></div>

  <dialog open class="fixed top-1/2 -translate-y-1/2 bg-backgroundColor text-textColor border-4 border-primary rounded-lg z-50">
    <div class="flex">
      <div class="self-center p-4">
        <Doughnut :data="chartData()" :options="{ responsive: true }" />
      </div>
      <div class="flex flex-col gap-8 w-96 p-6">
        <p class="self-center text-xl text-primary" v-if="authStore.isAuthenticated && authStore.topTestResult < calculTestWPM">
          Congratulation New Record
        </p>
        <div v-if="authStore.isAuthenticated && authStore.topTestResult < calculTestWPM" class="flex justify-center items-center gap-4 text-primary">
          <h1 class="text-6xl">{{ calculTestWPM }}</h1>
          <h1 class="text-4xl self-end">WPM</h1>
          <i class="bi bi-arrow-up-short"></i>
          <p v-if="increasePercentage !== null">{{ increasePercentage }} %</p>
          <p v-else>First record!</p>
        </div>
        <div v-else class="flex justify-center items-center gap-4 text-primary">
          <h1 class="text-6xl">{{ calculTestWPM }}</h1>
          <h1 class="text-4xl self-end">WPM</h1>
          <i class="bi bi-exclamation-circle" title="WPM are calculated using the number of correct words divided by the duration of the test"></i>
        </div>
        <div class="flex justify-between">
          <p>Word Accuracy</p>
          <p>{{ Math.round((result.correctWords / (result.correctWords + result.wrongWords)) * 100) }} %</p>
        </div>
        <div class="flex justify-between">
          <p>Character Accuracy</p>
          <p>{{ Math.round((result.correctCharacters / (result.correctCharacters + result.wrongCharacters)) * 100) }} %</p>
        </div>
        <div class="flex gap-2 self-center">
          <i class="bi bi-hourglass-bottom"></i>
          <p>{{ result.duration }} Minute(s)</p>
        </div>
        <button
          class="bg-primary text-secondary font-bold border py-1 px-2 rounded-md hover:bg-backgroundColor hover:text-primary hover:border-primary"
          @click="closeModal"
        >
          Close
        </button>
      </div>
    </div>
  </dialog>
</template>
