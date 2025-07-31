<template>
  <div
    class="flex items-center gap-4 py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
  >
    <img
      :src="item.product.image"
      :alt="item.product.title"
      class="w-16 h-16 object-contain rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
    />
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between">
        <span class="font-medium text-gray-900 dark:text-gray-100 truncate">{{
          item.product.title
        }}</span>
        <span class="text-base font-bold text-gray-900 dark:text-gray-100"
          >${{ item.product.price.toFixed(2) }}</span
        >
      </div>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-xs text-gray-500 dark:text-gray-400"
          >Qty: {{ item.quantity }}</span
        >
        <span class="text-xs text-gray-500 dark:text-gray-400"
          >Subtotal: ${{
            (item.product.price * item.quantity).toFixed(2)
          }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ item: { product: any; quantity: number } }>()
</script>
