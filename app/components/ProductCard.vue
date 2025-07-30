<template>
  <div class="relative group w-full max-w-xs mx-auto">
    <NuxtLink
      :to="`/product/${product.id}`"
      class="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden text-xs"
      tabindex="0"
    >
      <div
        class="aspect-square bg-gray-50 dark:bg-gray-900 overflow-hidden relative w-full"
        style="min-height: 100px"
      >
        <img
          :src="imgSrc"
          :alt="product.title"
          class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-1"
          loading="lazy"
          @error="onImgError"
        />
        <div
          v-if="cartStore.isInCart(product.id)"
          class="absolute top-1 right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm"
        >
          {{ cartStore.getItemQuantity(product.id) }}
        </div>
      </div>
      <div class="p-2 sm:p-3">
        <p
          class="text-[10px] text-green-600 font-medium uppercase tracking-wide mb-0.5 truncate"
        >
          {{ product.category }}
        </p>
        <div class="flex items-center justify-between mb-1">
          <span
            class="flex-1 font-medium text-gray-900 dark:text-gray-100 text-xs line-clamp-2 min-h-[2rem] leading-tight"
          >
            {{ product.title }}
          </span>
        </div>
        <div class="flex items-center space-x-0.5 mb-1">
          <div class="flex items-center">
            <Icon
              v-for="star in 5"
              :key="star"
              name="heroicons:star-solid"
              class="w-3 h-3"
              :class="
                star <= Math.round(product.rating.rate)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              "
            />
          </div>
          <span class="text-[10px] text-gray-500">
            ({{ product.rating.count }})
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span
            class="text-base font-bold text-gray-900 dark:text-gray-100"
          >
            ${{ product.price.toFixed(2) }}
          </span>
        </div>
      </div>
    </NuxtLink>
    <button
      class="absolute bottom-3 right-3 px-2 py-1 text-[10px] font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
      :disabled="
        !walletStore.canAfford(product.price) || addingToCart
      "
      @click.stop="addToCart"
    >
      <span v-if="addingToCart">Adding...</span>
      <span v-else-if="!walletStore.canAfford(product.price)">
        <Icon
          name="heroicons:exclamation-triangle"
          class="w-3 h-3 inline mr-1"
        />
        Low Funds
      </span>
      <span v-else>Add</span>
    </button>
  </div>
</template>

<script setup>
  import { useAuthStore } from '~/stores/auth';
  import { useRouter } from 'vue-router';
  const props = defineProps({
    product: {
      type: Object,
      required: true
    }
  });

  const fallbackImg = 'https://via.placeholder.com/150';
  const imgSrc = ref(props.product.image || fallbackImg);
  watch(
    () => props.product.image,
    (val) => {
      imgSrc.value = val || fallbackImg;
    }
  );
  function onImgError() {
    imgSrc.value = fallbackImg;
  }

  const emit = defineEmits(['add-to-cart']);

  const cartStore = useCartStore();
  const walletStore = useWalletStore();
  const authStore = useAuthStore();
  const router = useRouter();

  const addingToCart = ref(false);

  const addToCart = async () => {
    if (!authStore.isAuthenticated) {
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(
          'You must be logged in to add items to your cart.'
        );
      }
      router.push('/login');
      return;
    }
    addingToCart.value = true;
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      emit('add-to-cart', props.product, 1);
    } finally {
      addingToCart.value = false;
    }
  };
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
