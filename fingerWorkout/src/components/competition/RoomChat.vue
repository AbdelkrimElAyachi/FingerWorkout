<script setup>
import { ref, nextTick, onMounted, onUnmounted, toRefs } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { connectSocket, emit, registerEvents, unregisterEvents } from '@/services/socketService';

const props = defineProps({
  currentUserId: { type: String, required: true },
  currentUserAvatar: { type: String, default: '' },
});

const { currentUserId, currentUserAvatar } = toRefs(props);

const messages = ref([]);
const newMessage = ref('');
const messagesContainer = ref(null);
const isOpen = ref(false);

function toggleChat() {
  isOpen.value = !isOpen.value;
}

function scrollToBottom() {
  nextTick(() => {
    const container = messagesContainer.value;
    if (container) container.scrollTop = container.scrollHeight;
  });
}

function sendMessageHandler() {
  if (newMessage.value.trim() === '') return;

  emit('sendMessage', {
    message: newMessage.value,
    senderId: currentUserId.value,
    avatar: currentUserAvatar.value,
  });

  messages.value.push({
    message: newMessage.value,
    senderId: currentUserId.value,
    avatar: currentUserAvatar.value,
  });

  newMessage.value = '';
  scrollToBottom();
}

onMounted(() => {
  const authStore = useAuthStore();
  connectSocket(authStore.email);

  registerEvents({
    receiveMessage: (msg) => {
      messages.value.push({ message: msg.message, senderId: msg.userId, avatar: msg.avatar });
      scrollToBottom();
    },
    userReconnected: ({ userId }) => {
      messages.value.push({ message: `${userId} reconnected`, senderId: 'system', avatar: '' });
      scrollToBottom();
    },
  });
});

onUnmounted(() => {
  unregisterEvents(['receiveMessage', 'userJoined', 'userLeft', 'userReconnected']);
});
</script>

<template>
  <div>
    <!-- Floating toggle button -->
    <button v-if="!isOpen" @click="toggleChat" class="chat-toggle">
      <i class="bi bi-chat-dots-fill"></i>
    </button>

    <!-- Chat panel -->
    <transition name="slide">
      <div v-if="isOpen" class="chat-panel">
        <!-- Header -->
        <div class="chat-panel__header">
          <div class="chat-panel__title">
            <i class="bi bi-chat-dots"></i>
            <span>Room Chat</span>
          </div>
          <button @click="toggleChat" class="chat-panel__close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Messages -->
        <div class="chat-panel__messages" ref="messagesContainer">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['chat-msg', { 'chat-msg--own': msg.senderId === currentUserId }]"
          >
            <p v-if="msg.senderId === 'system'" class="chat-msg--system">
              {{ msg.message }}
            </p>
            <template v-else>
              <img
                v-if="msg.senderId !== currentUserId"
                class="chat-msg__avatar"
                :src="msg.avatar"
                alt="avatar"
              />
              <div
                :class="[
                  'chat-msg__bubble',
                  msg.senderId === currentUserId ? 'chat-msg__bubble--own' : 'chat-msg__bubble--other'
                ]"
              >
                {{ msg.message }}
              </div>
            </template>
          </div>
        </div>

        <!-- Input -->
        <div class="chat-panel__input-bar">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessageHandler"
            type="text"
            placeholder="Type a message..."
            class="chat-panel__input"
          />
          <button @click="sendMessageHandler" class="chat-panel__send">
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ── Toggle button ──────────────────────────────── */
.chat-toggle {
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 50;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--color-bg);
  background: var(--color-primary);
  box-shadow: 0 4px 16px rgba(var(--color-primary-rgb, 102, 255, 51), 0.3);
  transition: all 0.3s ease;
}
.chat-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(var(--color-primary-rgb, 102, 255, 51), 0.4);
}

/* ── Panel ──────────────────────────────────────── */
.chat-panel {
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 22rem;
  z-index: 45;
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
}

.chat-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.chat-panel__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
}

.chat-panel__close {
  background: none;
  border: none;
  color: var(--color-text);
  opacity: 0.4;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  padding: 0.25rem;
}
.chat-panel__close:hover { opacity: 1; }

/* ── Messages ───────────────────────────────────── */
.chat-panel__messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.chat-msg {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.chat-msg--own {
  justify-content: flex-end;
}

.chat-msg--system {
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text);
  opacity: 0.35;
  font-style: italic;
  margin: 0;
}

.chat-msg__avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  object-fit: cover;
  flex-shrink: 0;
}

.chat-msg__bubble {
  max-width: 75%;
  padding: 0.625rem 0.875rem;
  border-radius: 1rem;
  font-size: 0.8125rem;
  line-height: 1.4;
  word-break: break-word;
}

.chat-msg__bubble--own {
  background: var(--color-primary);
  color: var(--color-bg);
  border-bottom-right-radius: 0.25rem;
}

.chat-msg__bubble--other {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text);
  border-bottom-left-radius: 0.25rem;
}

/* ── Input bar ──────────────────────────────────── */
.chat-panel__input-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.chat-panel__input {
  flex: 1;
  padding: 0.625rem 0.875rem;
  font-size: 0.8125rem;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  outline: none;
  transition: border-color 0.2s;
}
.chat-panel__input::placeholder { color: rgba(255, 255, 255, 0.25); }
.chat-panel__input:focus {
  border-color: var(--color-primary);
}

.chat-panel__send {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: var(--color-bg);
  background: var(--color-primary);
  transition: all 0.2s;
  flex-shrink: 0;
}
.chat-panel__send:hover { opacity: 0.85; }

/* ── Slide transition ───────────────────────────── */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
</style>
