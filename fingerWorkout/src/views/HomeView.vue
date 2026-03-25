<script setup>
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import TypingTest from '@/components/typing/TypingTest.vue';
</script>

<template>
  <div>
    <AppHeader />
    <TypingTest :items="['France', 'Japan', 'Germany', 'Italy', 'Brazil']" />
    <AppFooter />
  </div>
</template>
