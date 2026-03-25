<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import TypingTimer from '@/components/typing/TypingTimer.vue';
import TypingGameStats from '@/components/typing/TypingGameStats.vue';
import { useTypingEngine } from '@/composables/useTypingEngine';
import { useAudio } from '@/composables/useAudio';
import { useTimer } from '@/composables/useTimer';
import { connectSocket, emit as socketEmit, unregisterEvents } from '@/services/socketService';

const props = defineProps({
  users: { type: Array, required: true },
  words: { type: Array, required: true },
  duration: { type: Number, required: true },
  user: { type: Object, required: true },
  index: { type: Number, required: true },
});

// ── Refs ─────────────────────────────────────────────────
const phraseRef = ref(null);
const finished = ref(false);

// ── Composables ──────────────────────────────────────────
const {
  results, wordIndex, charIndex, currentText,
  initWords, handleKeyPress, render,
} = useTypingEngine({
  phraseRef,
  callbacks: {
    onSpaceCorrect() {
      socketEmit('finishWord', { isCorrect: true }, (res) => {
        if (!res.success) console.error('Error updating progress:', res.error);
      });
    },
    onSpaceWrong() {
      socketEmit('finishWord', { isCorrect: false }, (res) => {
        if (!res.success) console.error('Error updating progress:', res.error);
      });
    },
  },
});

const { init: initAudio, play: playAudio } = useAudio();

// Calculate remaining time from stored timestamp
const startTs = parseInt(localStorage.getItem('gameStartTimestamp'));
const totalTime = props.duration * 60;
const initialSeconds = startTs
  ? Math.max(totalTime - Math.floor((Date.now() - startTs) / 1000), 0)
  : totalTime;

const { timeLeft, isFinished, start: startTimer, stop: stopTimer } = useTimer(initialSeconds);
results.duration = props.duration;

// ── Setup ────────────────────────────────────────────────

function loadWords() {
  initWords(props.words, props.index);
  render({ start: wordIndex.value, count: 10 });
}

// Sync wordIndex when parent changes the index prop
watch(() => props.index, (newVal) => {
  wordIndex.value = newVal;
  render({ start: wordIndex.value, count: 10 });
});

// Detect game end
watch(isFinished, (done) => {
  if (done) finished.value = true;
});

// ── Key handler ──────────────────────────────────────────

function onKeyDown(e) {
  if (finished.value) return;
  if (!handleKeyPress(e.key)) return;

  playAudio();
  render({ start: wordIndex.value, count: 10 });
}

// ── Lifecycle ────────────────────────────────────────────

onMounted(() => {
  connectSocket(props.user.id);
  document.addEventListener('keydown', onKeyDown);
  initAudio();
  loadWords();
  startTimer();
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown);
  stopTimer();
  unregisterEvents(['gameFinished']);
});
</script>

<template>
  <div class="mt-6 mx-auto text-secondary w-fit">
    <TypingTimer :time-left="timeLeft" />
    <p
      ref="phraseRef"
      class="text-bold text-2xl leading-[3rem] w-[700px] max-w-[80vw] whitespace-nowrap overflow-hidden"
    ></p>
    <TypingGameStats :results="results" />
  </div>
</template>
