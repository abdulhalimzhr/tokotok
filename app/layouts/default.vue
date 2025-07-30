<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    
    <main class="pb-8">
      <slot />
    </main>

    <AppFooter />

    <ProductModal />
  </div>
</template>

<script setup>
import AppFooter from '../components/AppFooter.vue'
const productsStore = useProductsStore()

onMounted(() => {
  if (!productsStore.hasProducts) {
    productsStore.fetchProducts()
  }
})
</script>