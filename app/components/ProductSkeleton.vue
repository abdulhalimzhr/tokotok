<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative group w-full max-w-xs mx-auto"
  >
    <!-- Image skeleton -->
    <div
      class="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse relative"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer"
      ></div>
    </div>

    <div class="p-2 sm:p-3 space-y-2">
      <!-- Category -->
      <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20">
        <div
          class="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer"
        ></div>
      </div>

      <!-- Title -->
      <div class="space-y-1">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse">
          <div
            class="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer"
          ></div>
        </div>
        <div
          class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"
        >
          <div
            class="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer"
          ></div>
        </div>
      </div>

      <!-- Rating -->
      <div class="flex items-center space-x-1 mb-1">
        <div class="flex space-x-1">
          <div
            class="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          ></div>
          <div
            class="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          ></div>
          <div
            class="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          ></div>
          <div
            class="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          ></div>
          <div
            class="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          ></div>
        </div>
        <div
          class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-12"
        >
          <div
            class="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer"
          ></div>
        </div>
      </div>

      <!-- Price -->
      <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16">
        <div
          class="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer"
        ></div>
      </div>
    </div>

    <!-- Add to cart button skeleton -->
    <div
      class="absolute bottom-3 right-3 w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"
    >
      <div
        class="h-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-600 dark:via-gray-500 dark:to-gray-600 rounded animate-shimmer"
      ></div>
    </div>
  </div>
</template>

<script setup></script>

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
  animation: shimmer 2s infinite;
}
</style>
