<template>
  <div
    v-if="isOpen && selectedProduct"
    class="fixed inset-0 z-50 overflow-y-auto"
  >
    <div
      class="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity"
      @click="closeModal"
    />

    <div class="flex min-h-full items-center justify-center p-4">
      <div
        class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4"
        @click.stop
      >
        <button
          class="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white bg-white dark:bg-gray-700 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="closeModal"
        >
          <svg
            class="w-5 h-5"
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              class="aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden"
            >
              <img
                :src="selectedProduct.image"
                :alt="selectedProduct.title"
                class="w-full h-full object-contain"
              />
            </div>

            <div class="space-y-4 text-gray-900 dark:text-gray-100">
              <div>
                <p
                  class="text-sm text-blue-600 dark:text-blue-400 font-medium capitalize"
                >
                  {{ selectedProduct.category }}
                </p>
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1"
                >
                  {{ selectedProduct.title }}
                </h2>
              </div>

              <div class="flex items-center space-x-2">
                <div class="flex items-center">
                  <svg
                    v-for="star in 5"
                    :key="star"
                    class="w-4 h-4"
                    :class="
                      star <= Math.round(selectedProduct.rating.rate)
                        ? 'text-yellow-400'
                        : 'text-gray-600 dark:text-gray-400'
                    "
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </div>
                <span class="text-sm text-gray-600 dark:text-gray-300">
                  {{ selectedProduct.rating.rate }} ({{
                    selectedProduct.rating.count
                  }}
                  reviews)
                </span>
              </div>

              <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ${{ selectedProduct.price.toFixed(2) }}
              </div>

              <div>
                <h3
                  class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
                >
                  Description
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ selectedProduct.description }}
                </p>
              </div>

              <div class="flex items-center space-x-4">
                <label
                  class="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Quantity:
                </label>
                <div class="flex items-center space-x-2">
                  <button
                    :disabled="quantity <= 1"
                    class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="quantity--"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>

                  <span class="w-12 text-center text-lg font-medium">
                    {{ quantity }}
                  </span>

                  <button
                    class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @click="quantity++"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div
                class="text-xl font-semibold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700 pt-4"
              >
                Total: ${{ (selectedProduct.price * quantity).toFixed(2) }}
              </div>

              <div class="flex space-x-3 pt-4">
                <button
                  class="flex-1 py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
                  :disabled="addingToCart"
                  @click="addToCart"
                >
                  <span v-if="addingToCart">Adding...</span>
                  <span v-else>Add to Cart</span>
                </button>

                <button
                  class="px-4 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium transition-colors"
                  @click="closeModal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const isOpen = ref(false)
const selectedProduct = ref(null)
const quantity = ref(1)
const addingToCart = ref(false)

const cartStore = useCartStore()

const openModal = product => {
  selectedProduct.value = product
  quantity.value = 1
  isOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isOpen.value = false
  selectedProduct.value = null
  quantity.value = 1
  document.body.style.overflow = 'auto'
}

const addToCart = async () => {
  if (!selectedProduct.value) return

  addingToCart.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 300))

    cartStore.addItem(selectedProduct.value, quantity.value)
    closeModal()
  } catch (error) {
    console.error('Error adding to cart:', error)
  } finally {
    addingToCart.value = false
  }
}

const handleKeyDown = event => {
  if (event.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = 'auto'
})

defineExpose({
  openModal,
  closeModal
})
</script>
