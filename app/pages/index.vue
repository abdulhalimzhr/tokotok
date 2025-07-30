<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <ProductCatalog />
    </div>
  </div>
</template>

<script setup>
  import { useProductsStore } from '~/stores/products';

  const productsStore = useProductsStore();

  useSeoMeta({
    title: 'TokoTok - Product Catalog',
    description:
      'Browse our collection of amazing products and manage your purchases with our wallet tracking system.'
  });

  onMounted(async () => {
    if (productsStore.categories.length === 0) {
      await productsStore.fetchCategories();
    }
    
    if (productsStore.products.length === 0) {
      await productsStore.fetchProducts();
    }
  });
</script>
