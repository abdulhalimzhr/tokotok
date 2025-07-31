<template>
  <!-- Filter Toggle Button -->
  <div class="relative inline-block text-left">
    <button
      @click="toggleFilters"
      class="inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      <Icon
        name="heroicons:adjustments-horizontal"
        class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2"
      />
      <span class="hidden sm:inline">Advanced Filters</span>
      <span class="sm:hidden">Filters</span>
      <Icon
        name="heroicons:chevron-down"
        :class="[
          'w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transition-transform duration-200',
          showFilters ? 'rotate-180' : ''
        ]"
      />
    </button>

    <!-- Dropdown Panel -->
    <div
      v-if="showFilters"
      class="absolute z-50 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 left-auto sm:left-0 max-w-[calc(100vw-2rem)] sm:max-w-none animate-in slide-in-from-top-2 duration-200"
      @click.stop
    >
      <div class="space-y-4">
        <!-- Price Range Filter -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Price Range: ${{ filters.priceRange.min }} - ${{
              filters.priceRange.max
            }}
          </label>
          <div class="space-y-3">
            <div>
              <label
                class="block text-xs text-gray-500 dark:text-gray-400 mb-1"
              >
                Minimum Price
              </label>
              <input
                v-model.number="filters.priceRange.min"
                type="range"
                min="0"
                max="1000"
                step="10"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                @input="updateFilters"
              />
              <input
                v-model.number="filters.priceRange.min"
                type="number"
                min="0"
                max="1000"
                class="mt-1 w-full text-xs rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                @input="updateFilters"
              />
            </div>
            <div>
              <label
                class="block text-xs text-gray-500 dark:text-gray-400 mb-1"
              >
                Maximum Price
              </label>
              <input
                v-model.number="filters.priceRange.max"
                type="range"
                min="0"
                max="1000"
                step="10"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                @input="updateFilters"
              />
              <input
                v-model.number="filters.priceRange.max"
                type="number"
                min="0"
                max="1000"
                class="mt-1 w-full text-xs rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                @input="updateFilters"
              />
            </div>
          </div>
        </div>

        <!-- Rating Filter -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Minimum Rating
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="rating in [0, 1, 2, 3, 4, 5]"
              :key="rating"
              @click="setRatingFilter(rating)"
              :class="[
                'flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors',
                filters.rating === rating
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              <span v-if="rating === 0">All</span>
              <span v-else class="flex items-center space-x-1">
                <span>{{ rating }}+</span>
                <Icon name="heroicons:star-solid" class="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700"
        >
          <button
            @click="resetFilters"
            class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Reset Filters
          </button>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ productsStore.filteredProducts.length }} products found
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProductsStore } from '~/stores/products'

const productsStore = useProductsStore()
const showFilters = ref(false)

const filters = ref({
  priceRange: { min: 0, max: 1000 },
  rating: 0
})

// Initialize filters from store
onMounted(() => {
  filters.value = {
    priceRange: { ...productsStore.searchState.filters.priceRange },
    rating: productsStore.searchState.filters.rating
  }
})

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const updateFilters = () => {
  // Ensure min doesn't exceed max
  if (filters.value.priceRange.min > filters.value.priceRange.max) {
    filters.value.priceRange.min = filters.value.priceRange.max
  }

  productsStore.updateFilters({
    priceRange: { ...filters.value.priceRange },
    rating: filters.value.rating
  })
}

const setRatingFilter = rating => {
  filters.value.rating = rating
  updateFilters()
}

const resetFilters = () => {
  filters.value = {
    priceRange: { min: 0, max: 1000 },
    rating: 0
  }
  updateFilters()
}

// Close dropdown when clicking outside
const handleClickOutside = event => {
  if (!event.target.closest('.relative')) {
    showFilters.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}
</style>
