<template>
  <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
    <div class="flex-shrink-0">
      <img
        :src="item.product.image"
        :alt="item.product.title"
        class="w-16 h-16 object-cover rounded-md"
      />
    </div>

    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-medium text-gray-900 line-clamp-2">
        {{ item.product.title }}
      </h4>
      <p class="text-sm text-gray-500 capitalize">
        {{ item.product.category }}
      </p>
      <p class="text-sm font-semibold text-gray-900">
        ${{ item.product.price.toFixed(2) }}
      </p>
    </div>

    <div class="flex flex-col items-end space-y-2">
      <div class="flex items-center space-x-2">
        <button
          :disabled="item.quantity <= 1"
          class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="decreaseQuantity"
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

        <span class="w-8 text-center text-sm font-medium">{{
          item.quantity
        }}</span>

        <button
          class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="increaseQuantity"
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

      <div class="text-sm font-semibold text-gray-900">
        ${{ (item.product.price * item.quantity).toFixed(2) }}
      </div>

      <button
        class="text-xs text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
        @click="removeItem"
      >
        Remove
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

const increaseQuantity = () => {
  cartStore.updateQuantity(props.item.product.id, props.item.quantity + 1)
}

const decreaseQuantity = () => {
  if (props.item.quantity > 1) {
    cartStore.updateQuantity(props.item.product.id, props.item.quantity - 1)
  }
}

const removeItem = () => {
  cartStore.removeItem(props.item.product.id)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
