<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 p-4 fade-in duration-200"
      @click.self="closeModal"
    >
      <div
        class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto"
        @click.stop
      >
        <button
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 z-10"
          @click="closeModal"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div class="p-6">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: boolean;
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const closeModal = () => {
    emit('update:modelValue', false);
  };

  onMounted(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && props.modelValue) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);

    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape);
    });
  });
</script>
