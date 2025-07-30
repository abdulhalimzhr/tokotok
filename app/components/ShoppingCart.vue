<template>
  <div class="relative">
    <button
      class="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
      @click="isOpen = !isOpen"
    >
      <Icon
        name="heroicons:shopping-cart"
        class="w-6 h-4 text-gray-700"
      />
      <span
        v-if="cartStore.itemCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
      >
        {{ cartStore.itemCount }}
      </span>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-gray-100"
          >
            Shopping Cart
          </h3>
          <button
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200 dark:hover:text-gray-300"
            @click="isOpen = false"
          >
            <Icon
              name="heroicons:x-mark"
              class="w-5 h-5"
            />
          </button>
        </div>

        <div
          v-if="cartStore.items.length > 0"
          class="space-y-3 max-h-60 overflow-y-auto"
        >
          <div
            v-for="item in cartStore.items"
            :key="item.product.id"
            class="flex items-center space-x-3 p-2 border-gray-100 dark:border-gray-700"
            :class="{
              'border-b':
                item !== cartStore.items[cartStore.items.length - 1]
            }"
          >
            <img
              :src="item.product.image"
              :alt="item.product.title"
              class="w-12 h-12 object-cover rounded"
            />
            <div class="flex-1 min-w-0">
              <h4
                class="text-sm font-medium text-gray-900 truncate dark:text-gray-100"
              >
                {{ item.product.title }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                ${{ item.product.price.toFixed(2) }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <button
                class="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-sm text-gray-600"
                @click="
                  cartStore.updateQuantity(
                    item.product.id,
                    item.quantity - 1
                  )
                "
              >
                -
              </button>
              <span class="text-sm font-medium">
                {{ item.quantity }}
              </span>
              <button
                class="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-sm text-gray-600"
                @click="
                  cartStore.updateQuantity(
                    item.product.id,
                    item.quantity + 1
                  )
                "
              >
                +
              </button>
              <button
                class="text-red-500 hover:text-red-700 ml-2"
                @click="cartStore.removeItem(item.product.id)"
              >
                <Icon
                  name="heroicons:trash"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>
        </div>

        <div
          v-else
          class="text-center py-8"
        >
          <Icon
            name="heroicons:shopping-cart"
            class="w-12 h-12 text-gray-300 mx-auto mb-3"
          />
          <p class="text-gray-500">Your cart is empty</p>
        </div>

        <div
          v-if="cartStore.items.length > 0"
          class="mt-4 pt-4 border-t border-gray-200"
        >
          <div class="flex justify-between items-center mb-4">
            <span
              class="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              Total:
            </span>
            <span class="text-lg font-bold text-green-600">
              ${{ cartStore.totalPrice.toFixed(2) }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <NuxtLink
              to="/checkout"
              class="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-center text-sm"
              @click="isOpen = false"
            >
              Checkout
            </NuxtLink>
            <button
              class="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium text-sm"
              @click="cartStore.clearCart"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useCartStore } from '~/stores/cart';

  const cartStore = useCartStore();
  const isOpen = ref(false);

  const handleClickOutside = (event: Event) => {
    if (
      isOpen.value &&
      !(event.target as Element).closest('.relative')
    ) {
      isOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>
