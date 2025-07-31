<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative group w-full max-w-xs mx-auto animate-pulse"
  >
    <!-- Image skeleton -->
    <div
      class="aspect-square bg-gray-200 dark:bg-gray-700 relative overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer"
      ></div>
    </div>

    <div class="p-2 sm:p-3 space-y-2">
      <!-- Category -->
      <div
        class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 relative overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer"
        ></div>
      </div>

      <!-- Title -->
      <div class="space-y-1">
        <div
          class="h-4 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer"
          ></div>
        </div>
        <div
          class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer"
          ></div>
        </div>
      </div>

      <!-- Rating -->
      <div class="flex items-center space-x-1 mb-1">
        <div class="flex space-x-1">
          <div
            v-for="i in 5"
            :key="i"
            class="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded"
          ></div>
        </div>
        <div
          class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8 relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer"
          ></div>
        </div>
      </div>

      <!-- Price -->
      <div
        class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 relative overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer"
        ></div>
      </div>

      <!-- Action buttons -->
      <div class="flex space-x-1 pt-2">
        <div
          class="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer"
          ></div>
        </div>
        <div
          class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-shimmer"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>
