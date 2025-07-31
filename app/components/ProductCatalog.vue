<template>
  <div>
    <CategoryFilter />
    <div
      class="flex items-center justify-between mb-4 px-2"
      v-if="productsStore.hasFilteredProducts"
    >
      <div class="flex items-center space-x-4">
        <AdvancedFilters />
      </div>
      <div class="flex items-center space-x-2">
        <label for="sort-by" class="text-xs text-gray-700 dark:text-gray-200">
          Sort by:
        </label>
        <select
          id="sort-by"
          v-model="sortBy"
          class="text-xs rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
        <select
          v-model="sortOrder"
          class="text-xs rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
    <div
      v-if="productsStore.loading"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 px-2"
    >
      <ProductCardSkeleton v-for="n in 12" :key="n" />
    </div>

    <div v-else-if="productsStore.error" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <svg
          class="w-16 h-16 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Failed to Load Products
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          {{ productsStore.error }}
        </p>
        <button
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="productsStore.retryFetch"
        >
          Try Again
        </button>
      </div>
    </div>

    <div
      v-else-if="!productsStore.hasFilteredProducts"
      class="text-center py-12"
    >
      <div class="max-w-md mx-auto">
        <svg
          class="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          No Products Found
        </h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          <span v-if="productsStore.isFiltered">
            No products match your current filters. Try adjusting your search
            criteria.
          </span>
          <span v-else>No products are currently available.</span>
        </p>
        <button
          v-if="productsStore.isFiltered"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="productsStore.clearFilters"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 px-2"
    >
      <ProductCard
        v-for="product in paginatedProducts"
        :key="product.id"
        :product="product"
        @view-details="openProductModal"
        @add-to-cart="handleAddToCart"
      />
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="productsStore.filteredProducts.length > itemsPerPage"
      :current-page="currentPage"
      :total-items="productsStore.filteredProducts.length"
      :items-per-page="itemsPerPage"
      @page-change="handlePageChange"
    />

    <ProductModal
      ref="productModal"
      :product="modalProduct"
      :show="modalShow"
      @close="closeProductModal"
      @add-to-cart="handleAddToCart"
    />
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'
import ProductModal from './ProductModal.vue'
const productsStore = useProductsStore()
const cartStore = useCartStore()

const sortBy = ref(productsStore.searchState.sortBy)
const sortOrder = ref(productsStore.searchState.sortOrder)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(20)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return productsStore.filteredProducts.slice(start, end)
})

// Reset pagination when filters change
watch(
  () => productsStore.filteredProducts,
  () => {
    currentPage.value = 1
  }
)

const handlePageChange = page => {
  currentPage.value = page
  // Scroll to top of products
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch([sortBy, sortOrder], ([newSortBy, newSortOrder]) => {
  productsStore.updateSort(newSortBy, newSortOrder)
})

const modalShow = ref(false)
const modalProduct = ref(null)
const productModal = ref(null)

const openProductModal = product => {
  modalProduct.value = product
  modalShow.value = true
  productModal.value.openModal(product)
}
const closeProductModal = () => {
  modalShow.value = false
  modalProduct.value = null
}
const handleAddToCart = (product, quantity = 1) => {
  cartStore.addItem(product, quantity)
}
</script>
