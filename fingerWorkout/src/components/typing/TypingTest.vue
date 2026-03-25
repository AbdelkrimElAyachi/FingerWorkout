<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import TypingTimer from '@/components/typing/TypingTimer.vue';
import TypingStats from '@/components/typing/TypingStats.vue';
import TypingControls from '@/components/typing/TypingControls.vue';
import TestResultPopup from '@/components/competition/TestResultPopup.vue';
import { useTypingEngine } from '@/composables/useTypingEngine';
import { useAudio } from '@/composables/useAudio';
import { useTimer } from '@/composables/useTimer';
import { useParameterStore } from '@/stores';
import { getPhrases, shuffleArray } from '@/utils/phrases.js';
import { saveTestResults } from '@/utils/tests';

const props = defineProps({
  items: { type: Array, required: true },
});

// ── Refs ─────────────────────────────────────────────────
const phraseRef = ref(null);
const showResults = ref(false);
const started = ref(false);
const finished = ref(false);
const phrases = ref([]);
const phraseIndex = ref(0);

// ── Composables ──────────────────────────────────────────
const {
  results, wordIndex, charIndex, currentText,
  initWords, handleKeyPress, isPastLineEnd, render, resetResults,
} = useTypingEngine({ phraseRef });

const { init: initAudio, play: playAudio } = useAudio();

const duration = useParameterStore().getDuration;
const { timeLeft, isFinished, start: startTimer, stop: stopTimer, reset: resetTimer } = useTimer(duration * 60);
results.duration = duration;

// ── Phrase management ────────────────────────────────────

async function generatePhrases() {
  const words = [...props.items];
  shuffleArray(words);
  phrases.value = await getPhrases(8, words[0]);
}

function loadPhrase() {
  const words = phrases.value[phraseIndex.value].split(' ');
  initWords(words);
  render();
}

function nextLine() {
  phraseIndex.value++;
  loadPhrase();
}

// ── Key handler ──────────────────────────────────────────

function onKeyDown(e) {
  if (finished.value) return;
  if (!handleKeyPress(e.key)) return; // not a typeable key

  if (!started.value) {
    started.value = true;
    startTimer();
  }

  playAudio();

  // If we've gone past the last word in the phrase, load the next one
  if (isPastLineEnd()) {
    nextLine();
  }

  render();
}

// ── Watch timer to detect end ────────────────────────────

watch(isFinished, (done) => {
  if (done && started.value && !finished.value) {
    finished.value = true;
    showResults.value = true;
    const { correctCharacters, correctWords, wrongCharacters, wrongWords, duration: d } = results;
    saveTestResults(correctCharacters, correctWords, wrongCharacters, wrongWords, d)
      .catch(() => console.error('Failed to save test results'));
  }
});

// ── Restart ──────────────────────────────────────────────

function restart() {
  phraseIndex.value = 0;
  const dur = useParameterStore().getDuration;
  results.duration = dur;
  resetResults(dur);
  resetTimer(dur * 60);
  loadPhrase();
  started.value = false;
  finished.value = false;
  showResults.value = false;
}

function closeResults() {
  showResults.value = false;
}

// ── Lifecycle ────────────────────────────────────────────

onMounted(async () => {
  document.addEventListener('keydown', onKeyDown);
  await generatePhrases();
  initAudio();
  loadPhrase();
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown);
  stopTimer();
});
</script>

<template>
  <div class="typing-test">
    <div class="typing-test__card">
      <TypingTimer :time-left="timeLeft" />

      <div class="typing-test__phrase-wrap">
        <p ref="phraseRef" class="typing-test__phrase"></p>
      </div>

      <TypingStats :results="results" />
      <TypingControls @restart="restart" />
    </div>

    <TestResultPopup v-if="showResults" :result="results" @close-results="closeResults" />
  </div>
</template>

<style scoped>
.typing-test {
  display: flex;
  justify-content: center;
  padding: 3rem 1.5rem;
}

.typing-test__card {
  width: 100%;
  max-width: 56rem;
}

.typing-test__phrase-wrap {
  padding: 1.75rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1rem;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  min-height: 6rem;
}

.typing-test__phrase {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 3rem;
  letter-spacing: 0.02em;
  color: var(--color-secondary);
  margin: 0;
  word-spacing: 0.15em;
}
</style>

