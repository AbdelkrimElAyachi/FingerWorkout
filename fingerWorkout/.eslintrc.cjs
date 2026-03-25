module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: ['plugin:vue/vue3-essential'],
  rules: {
    'vue/no-v-model-argument': 'off',  // This rule is for Vue 2 only
  },
};