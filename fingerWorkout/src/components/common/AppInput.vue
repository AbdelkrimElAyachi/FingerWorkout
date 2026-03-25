<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  id: { type: String, default: () => `input-${Math.random().toString(36).substr(2, 9)}` },
  type: {
    type: String,
    default: 'text',
    validator: (v) => ['text', 'email', 'password', 'file', 'number', 'tel', 'url'].includes(v),
  },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'blur']);
</script>

<template>
  <div class="auth-field">
    <label v-if="label" :for="id" class="auth-field__label">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="auth-field__input"
      :class="{
        'auth-field__input--error': error,
        'auth-field__input--disabled': disabled,
      }"
      @input="emit('update:modelValue', $event.target.value)"
      @blur="emit('blur', $event)"
    />
    <p v-if="error" class="auth-field__error">{{ error }}</p>
    <p v-if="hint && !error" class="auth-field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.auth-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.auth-field__label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text);
  opacity: 0.8;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.auth-field__input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  color: var(--color-text);
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  outline: none;
  transition: all 0.3s ease;
}

.auth-field__input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.auth-field__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 102, 255, 51), 0.15);
  background: rgba(255, 255, 255, 0.08);
}

.auth-field__input--error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(255, 79, 99, 0.12);
}

.auth-field__input--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.auth-field__error {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-error);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.auth-field__hint {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-text);
  opacity: 0.5;
}
</style>
