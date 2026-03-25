import { ref, reactive, onUnmounted } from 'vue';

/**
 * Composable that encapsulates the core typing-test state machine.
 *
 * Manages character/word tracking, CSS highlight classes, scoring,
 * phrase text generation, and HTML rendering.
 *
 * @param {Object} options
 * @param {import('vue').Ref<HTMLElement|null>} options.phraseRef - Template ref for the rendered text container.
 * @param {Object} [options.callbacks] - Optional hooks into specific events.
 * @param {function} [options.callbacks.onSpaceCorrect] - Called when a word is completed correctly.
 * @param {function} [options.callbacks.onSpaceWrong] - Called when a word is completed incorrectly.
 * @returns Reactive typing state and control methods.
 */
export function useTypingEngine({ phraseRef, callbacks = {} } = {}) {
  // ── State ──────────────────────────────────────────────────
  const charIndex = ref(0);
  const wordIndex = ref(0);
  const currentText = ref([]);   // 2-D array: word → chars
  const wordClasses = ref([]);
  const charClasses = ref([]);

  const results = reactive({
    wrongCharacters: 0,
    wrongWords: 0,
    correctCharacters: 0,
    correctWords: 0,
    duration: 1,
  });

  // ── Helpers ────────────────────────────────────────────────

  /** Returns true if `key` is a typeable letter, digit, or space. */
  function isLetter(key) {
    if (key === ' ') return true;
    const code = key.charCodeAt(0);
    return (
      key.length <= 1 &&
      ((code >= 65 && code <= 90) ||
        (code >= 97 && code <= 122) ||
        (code >= 48 && code <= 57))
    );
  }

  /** Returns true when the charIndex is past the current word's last character. */
  function isPastWordEnd() {
    return charIndex.value >= currentText.value[wordIndex.value].length;
  }

  /** Returns true when the wordIndex is past the last word in the phrase. */
  function isPastLineEnd() {
    return wordIndex.value >= currentText.value.length;
  }

  // ── Text setup ─────────────────────────────────────────────

  /**
   * Initialises the typing state for a list of words.
   * @param {string[]} words - Array of word strings.
   * @param {number} [startWordIndex=0] - Which word index to start from.
   */
  function initWords(words, startWordIndex = 0) {
    currentText.value = words.map((w) => w.split(''));
    wordClasses.value = currentText.value.map(() => '');
    if (startWordIndex < currentText.value.length) {
      wordClasses.value[startWordIndex] = 'border-b-4 border-primary';
    }
    charClasses.value = currentText.value.map((word) =>
      word.map(() => 'text-secondary'),
    );
    wordIndex.value = startWordIndex;
    charIndex.value = 0;
  }

  // ── Rendering ──────────────────────────────────────────────

  /**
   * Build the HTML string for the phrase.
   * An optional `visibleRange` can restrict which words are shown (used by the game's scrolling view).
   * @param {{ start?: number, count?: number }} [visibleRange]
   */
  function generateHtml(visibleRange) {
    const start = visibleRange?.start ?? 0;
    const end = visibleRange?.count
      ? Math.min(start + visibleRange.count, currentText.value.length)
      : currentText.value.length;

    return currentText.value.slice(start, end).map((word, idx) => {
      const realIndex = start + idx;
      const characters = word
        .map(
          (char, ind) =>
            `<span class="${charClasses.value[realIndex][ind]}">${char}</span>`,
        )
        .join('');
      return `<span class="${wordClasses.value[realIndex]}">${characters}</span>`;
    }).join(' ');
  }

  /**
   * Renders the current phrase into the DOM element.
   * @param {{ start?: number, count?: number }} [visibleRange]
   */
  function render(visibleRange) {
    if (!phraseRef.value) return;
    phraseRef.value.innerHTML = generateHtml(visibleRange);
  }

  // ── Key handling ───────────────────────────────────────────

  /** Called when the user presses the space bar. */
  function handleSpace() {
    // If user pressed space before finishing current word → mark wrong
    if (currentText.value[wordIndex.value].length !== charIndex.value) {
      wordClasses.value[wordIndex.value] = 'border-b-4 border-error';
    }
    charIndex.value = 0;
    wordIndex.value++;

    // Score the completed word
    const isCorrect =
      wordClasses.value[wordIndex.value - 1] !== 'border-b-4 border-error';

    if (isCorrect) {
      results.correctWords++;
      wordClasses.value[wordIndex.value - 1] = '';
      callbacks.onSpaceCorrect?.();
    } else {
      results.wrongWords++;
      callbacks.onSpaceWrong?.();
    }

    // Highlight the next word
    if (!isPastLineEnd()) {
      wordClasses.value[wordIndex.value] = 'border-b-4 border-primary';
    }
  }

  /**
   * Processes a single keypress.
   * @param {string} key - The pressed key.
   * @returns {boolean} `true` if the key was handled.
   */
  function handleKeyPress(key) {
    if (!isLetter(key)) return false;

    if (key === ' ') {
      handleSpace();
      return true;
    }

    // Character matching
    if (key === currentText.value[wordIndex.value][charIndex.value]) {
      results.correctCharacters++;
      charClasses.value[wordIndex.value][charIndex.value] = 'text-primary';
    } else {
      results.wrongCharacters++;
      wordClasses.value[wordIndex.value] = 'border-b-4 border-error';
      charClasses.value[wordIndex.value][charIndex.value] = 'text-error';
    }

    // Overflow: user typed more chars than the word has
    if (isPastWordEnd()) {
      results.wrongCharacters++;
      currentText.value[wordIndex.value].push(key);
      charClasses.value[wordIndex.value].push('text-error');
    }

    charIndex.value++;
    return true;
  }

  // ── Reset ──────────────────────────────────────────────────

  function resetResults(duration = 1) {
    results.wrongCharacters = 0;
    results.wrongWords = 0;
    results.correctCharacters = 0;
    results.correctWords = 0;
    results.duration = duration;
  }

  return {
    // state
    charIndex,
    wordIndex,
    currentText,
    wordClasses,
    charClasses,
    results,

    // methods
    isLetter,
    isPastWordEnd,
    isPastLineEnd,
    initWords,
    generateHtml,
    render,
    handleSpace,
    handleKeyPress,
    resetResults,
  };
}
