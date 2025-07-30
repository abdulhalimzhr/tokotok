<template>
  <button
    class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
    @click="cartStore.toggleCart"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
    </svg>
    
    <div
      v-if="cartStore.itemCount > 0"
      class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
    >
      {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
    </div>
    
    <div
      v-if="showPulse"
      class="absolute inset-0 bg-green-400 rounded-lg animate-ping opacity-75"
    ></div>
  </button>
</template>

<script setup>
const cartStore = useCartStore()

const showPulse = ref(false)

watch(() => cartStore.itemCount, (newCount, oldCount) => {
  if (newCount > oldCount && oldCount !== undefined) {
    showPulse.value = true
    setTimeout(() => {
      showPulse.value = false
    }, 600)
  }
})
</script>