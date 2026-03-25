<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'button',
    validator: (v) => ['button', 'submit', 'reset'].includes(v),
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'danger', 'outline', 'text'].includes(v),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => ['small', 'medium', 'large'].includes(v),
  },
  disabled: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false },
});

const VARIANT_CLASSES = {
  primary: 'bg-primary text-backgroundColor hover:opacity-50 focus:ring-gray-500',
  secondary: 'bg-secondary text-white hover:bg-secondary/50 focus:ring-gray-500',
  danger: 'bg-error text-white hover:bg-error/50 focus:ring-gray-500',
  outline: 'border border-primary bg-backgroundColor text-textColor hover:opacity-50 focus:ring-gray-500',
  text: 'text-textColor hover:text-textColor/50 focus:ring-gray-500 bg-transparent',
};

const SIZE_CLASSES = {
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-6 py-3 text-lg',
};

const buttonClasses = computed(() => [
  'rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
  VARIANT_CLASSES[props.variant],
  SIZE_CLASSES[props.size],
  props.fullWidth ? 'w-full' : '',
  props.disabled ? 'opacity-50 cursor-not-allowed' : '',
].join(' '));
</script>

<template>
  <button :type="type" :disabled="disabled" :class="buttonClasses">
    <slot />
  </button>
</template>
