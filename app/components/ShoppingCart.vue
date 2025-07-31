<template>
  <div class="relative">
    <button
      class="relative py-1 px-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-all duration-200 group"
      @click="toggleShoppingCart"
    >
      <Icon
        name="heroicons:shopping-cart"
        class="mt-2 w-4 h-4 text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200"
      />
      <span
        v-if="cartStore.itemCount > 0"
        class="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium px-1 shadow-sm animate-pulse"
      >
        {{ cartStore.itemCount > 99 ? '99+' : cartStore.itemCount }}
      </span>
    </button>

    <div
      v-if="isShoppingCartOpen"
      class="absolute left-auto right-[-2rem] sm:right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-xl z-50 dark:bg-gray-800 dark:border-gray-700 animate-in slide-in-from-top-2 duration-100"
    >
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <Icon
              name="heroicons:shopping-cart"
              class="w-5 h-5 text-green-600"
            />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Shopping Cart
            </h3>
            <span
              v-if="cartStore.itemCount > 0"
              class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium dark:bg-green-900 dark:text-green-200"
            >
              {{ cartStore.itemCount }}
              {{ cartStore.itemCount === 1 ? 'item' : 'items' }}
            </span>
          </div>
        </div>

        <div
          v-if="cartStore.items.length > 0"
          class="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
        >
          <div
            v-for="item in cartStore.items"
            :key="item.product.id"
            class="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700 transition-all duration-200 group"
          >
            <div class="flex-shrink-0">
              <img
                :src="item.product.image"
                :alt="item.product.title"
                class="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
            </div>
            <div class="flex-1 min-w-0">
              <NuxtLink
                :to="`/product/${item.product.id}`"
                class="block"
                @click="closeShoppingCart"
              >
                <h4
                  class="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-white truncate leading-tight hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 cursor-pointer"
                >
                  {{ item.product.title }}
                </h4>
              </NuxtLink>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ${{ item.product.price.toFixed(2) }} each
              </p>
              <p
                class="text-xs text-green-600 dark:text-green-400 font-medium mt-1"
              >
                Subtotal: ${{ (item.product.price * item.quantity).toFixed(2) }}
              </p>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <div
                class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1"
              >
                <button
                  class="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 rounded-md text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-500 transition-colors duration-150"
                  @click="
                    cartStore.updateQuantity(item.product.id, item.quantity - 1)
                  "
                >
                  <Icon name="heroicons:minus" class="w-3 h-3" />
                </button>
                <span
                  class="text-sm font-medium min-w-[24px] text-center text-gray-900 dark:text-gray-100"
                >
                  {{ item.quantity }}
                </span>
                <button
                  class="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 rounded-md text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-500 transition-colors duration-150"
                  @click="
                    cartStore.updateQuantity(item.product.id, item.quantity + 1)
                  "
                >
                  <Icon name="heroicons:plus" class="w-3 h-3" />
                </button>
              </div>
              <button
                class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150"
                @click="cartStore.removeItem(item.product.id)"
                title="Remove item"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div
            class="bg-gray-100 dark:bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"
          >
            <Icon
              name="heroicons:shopping-cart"
              class="w-10 h-10 text-gray-400 dark:text-gray-500"
            />
          </div>
          <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Your cart is empty
          </p>
          <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Add some products to get started
          </p>
        </div>

        <div
          v-if="cartStore.items.length > 0"
          class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div class="flex justify-between items-center mb-4">
            <span
              class="text-base font-medium text-gray-700 dark:text-gray-300"
            >
              Total ({{ cartStore.itemCount }}
              {{ cartStore.itemCount === 1 ? 'item' : 'items' }}):
            </span>
            <span class="text-xl font-bold text-green-600 dark:text-green-400">
              ${{ cartStore.totalPrice.toFixed(2) }}
            </span>
          </div>

          <div class="space-y-2">
            <NuxtLink
              to="/checkout"
              class="block w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium text-center text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              @click="closeShoppingCart"
            >
              <Icon name="heroicons:credit-card" class="w-4 h-4 inline mr-2" />
              Proceed to Checkout
            </NuxtLink>
            <button
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg transition-colors duration-200 font-medium text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
              @click="handleClearCart"
            >
              <Icon name="heroicons:trash" class="w-4 h-4 inline mr-2" />
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <Modal v-model="showClearModal">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <Icon name="heroicons:exclamation-triangle" class="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Clear Cart
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to remove all items from your cart? This action cannot be undone.
        </p>
        <div class="flex space-x-3 justify-center">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            @click="showClearModal = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            @click="confirmClearCart"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useDropdownState } from '~/composables/useDropdownState'

const cartStore = useCartStore()
const { isShoppingCartOpen, toggleShoppingCart, closeShoppingCart } =
  useDropdownState()

const showClearModal = ref(false)

const handleClearCart = () => {
  showClearModal.value = true
}

const confirmClearCart = () => {
  cartStore.clearCart()
  showClearModal.value = false
}

const handleClickOutside = (event: Event) => {
  if (
    isShoppingCartOpen.value &&
    !(event.target as Element).closest('.relative')
  ) {
    closeShoppingCart()
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
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 9999px;
}

.dark .scrollbar-thin::-webkit-scrollbar-track {
  background-color: #1f2937;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}
</style>
