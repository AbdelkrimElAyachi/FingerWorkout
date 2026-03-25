<script setup>
defineProps({
  tabs: { type: Array, required: true },
  currentTab: { type: String, required: true },
});

const emit = defineEmits(['update:currentTab']);
</script>

<template>
  <button
    v-for="tab in tabs"
    :key="tab.name"
    @click="emit('update:currentTab', tab.name)"
    :class="[
      'text-lg font-bold rounded-tl-md rounded-tr-md p-2 pl-2 pr-6',
      currentTab === tab.name ? 'bg-backgroundColorDarker' : '',
    ]"
  >
    {{ tab.title }}
  </button>
</template>