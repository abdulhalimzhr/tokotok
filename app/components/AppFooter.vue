<template>
  <footer
    class="w-full bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6 mt-12"
  >
    <div
      class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 text-center gap-2"
    >
      <div class="mb-2 sm:mb-0">
        Built with
        <span class="font-semibold text-green-600">Nuxt 4</span>
        &amp;
        <a
          href="https://fakestoreapi.com/"
          target="_blank"
          rel="noopener"
          class="underline hover:text-green-700"
        >
          Fake Store API
        </a>
      </div>
      <div
        class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end"
      >
        <span
          >&copy; {{ new Date().getFullYear() }} TokoTok. All rights
          reserved.</span
        >
        <button
          class="ml-4 flex items-center px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          @click="toggleDarkMode"
        >
          <Icon v-if="isDark" name="heroicons:moon" class="w-4 h-4 mr-1" />
          <Icon v-else name="heroicons:sun" class="w-4 h-4 mr-1" />
          {{ isDark ? 'Dark' : 'Light' }} Mode
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const isDark = ref(false)
const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}
onMounted(() => {
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
})
</script>
