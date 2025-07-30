<template>
  <div class="mb-6">
    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by Category</h3>
    <div class="flex flex-wrap gap-2">
      <button
        @click="selectCategory('')"
        :class="[
          'px-3 py-1 rounded-full text-xs font-medium transition-colors',
          productsStore.searchState.filters.category === '' 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        All
      </button>
      <button
        v-for="category in productsStore.categories"
        :key="category"
        @click="selectCategory(category)"
        :class="[
          'px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize',
          productsStore.searchState.filters.category === category 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        ]"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products';

const productsStore = useProductsStore();

const selectCategory = (category) => {
  productsStore.updateFilters({ category });
};
</script>
