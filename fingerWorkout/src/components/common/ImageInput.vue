<script setup>
import { ref } from 'vue';
import { apiBaseUrl } from '@/utils/api';

const props = defineProps({
  editMode: { type: Boolean, required: true },
  picture: { type: String, default: null },
  pictureData: { type: String, default: null },
  editedPicture: { type: Boolean, required: true, default: false },
});

const emit = defineEmits(['update:pictureData', 'update:picture', 'update:editedPicture']);

const pictureInput = ref(null);

function openFileInput() {
  pictureInput.value.click();
}

function handlePictureChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  emit('update:editedPicture', true);
  emit('update:picture', URL.createObjectURL(file));
  emit('update:pictureData', file);
}
</script>

<template>
  <div class="hidden">
    <input ref="pictureInput" type="file" name="file" @change="handlePictureChange" />
  </div>

  <div v-if="editMode" class="w-4/12 p-6 relative group">
    <img
      v-if="editedPicture"
      class="rounded-full w-full aspect-square object-cover group-hover:opacity-50"
      :src="picture"
      alt="avatar"
    />
    <img
      v-else-if="picture"
      class="rounded-full w-full aspect-square object-cover group-hover:opacity-50"
      :src="`${apiBaseUrl}/uploads/${picture}`"
      alt="avatar"
    />
    <img
      v-else
      src="/assets/avatar.webp"
      class="rounded-full w-full aspect-square object-cover group-hover:opacity-50"
      alt="avatar"
    />
    <div
      class="absolute inset-0 opacity-0 flex items-center z-10 justify-center group-hover:opacity-50"
      @click="openFileInput"
    >
      <p class="text-xl font-bold">choose image</p>
    </div>
  </div>

  <div v-else class="w-4/12 p-6">
    <img
      v-if="picture"
      class="rounded-full w-full aspect-square object-cover"
      :src="`${apiBaseUrl}/uploads/${picture}`"
      alt="avatar"
    />
    <img v-else src="/assets/avatar.webp" class="rounded-full" alt="avatar" />
  </div>
</template>
