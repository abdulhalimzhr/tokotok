<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
    <div v-if="loading" class="max-w-5xl mx-auto px-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="animate-pulse flex flex-col md:flex-row gap-8">
          <div class="w-full md:w-1/2">
            <div class="bg-gray-300 dark:bg-gray-600 h-80 rounded"></div>
          </div>
          <div class="w-full md:w-1/2 space-y-4">
            <div class="bg-gray-300 dark:bg-gray-600 h-8 rounded w-3/4"></div>
            <div class="bg-gray-300 dark:bg-gray-600 h-4 rounded w-1/2"></div>
            <div class="bg-gray-300 dark:bg-gray-600 h-20 rounded"></div>
            <div class="bg-gray-300 dark:bg-gray-600 h-8 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="max-w-5xl mx-auto px-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <div class="text-red-500 dark:text-red-400 mb-4">
          <Icon
            name="i-heroicons-exclamation-triangle"
            class="w-16 h-16 mx-auto mb-2"
          />
          <h2 class="text-xl font-semibold">{{ error }}</h2>
        </div>
        <button
          @click="fetchProduct"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
        <NuxtLink
          to="/"
          class="ml-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors inline-block"
        >
          Back to Home
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="product">
      <nav class="max-w-5xl mx-auto mb-6 px-4" aria-label="Breadcrumb">
        <ol
          class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
        >
          <li>
            <NuxtLink
              to="/"
              class="hover:underline hover:text-green-600 dark:hover:text-green-400"
              >Home</NuxtLink
            >
          </li>
          <li>
            <span class="mx-1">/</span>
          </li>
          <li>
            <NuxtLink
              to="/"
              class="hover:underline hover:text-green-600 dark:hover:text-green-400"
              >Products</NuxtLink
            >
          </li>
          <li>
            <span class="mx-1">/</span>
          </li>
          <li class="truncate max-w-xs" :title="product.title">
            <span class="text-gray-700 dark:text-gray-200">
              {{ product.title }}
            </span>
          </li>
        </ol>
      </nav>

      <div
        class="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col md:flex-row gap-8"
      >
        <div class="flex flex-col items-center w-full md:w-1/2">
          <img
            :src="imgSrc"
            :alt="product.title"
            class="w-full max-w-xs max-h-80 object-contain rounded border"
            @error="onImgError"
          />
          <div class="flex mt-4 space-x-2" v-if="galleryImages.length > 1">
            <img
              v-for="(img, i) in galleryImages"
              :key="i"
              :src="img"
              @click="imgSrc = img"
              @error="onImgError"
              :class="[
                'w-16 h-16 object-contain rounded border cursor-pointer',
                imgSrc === img ? 'ring-2 ring-green-500' : ''
              ]"
            />
          </div>
        </div>

        <div class="flex-1 flex flex-col justify-between">
          <div>
            <h1
              class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
            >
              {{ product.title }}
            </h1>
            <div class="flex items-center space-x-2 mb-2">
              <span
                class="text-green-600 dark:text-green-400 text-xs font-semibold uppercase"
              >
                {{ product.category }}
              </span>
              <span class="text-yellow-400 flex items-center">
                <Icon name="i-heroicons-star-solid" class="w-4 h-4 mr-1" />
                {{ product.rating?.rate || 0 }}
                <span class="text-gray-500 dark:text-gray-400 ml-1 text-xs">
                  ({{ product.rating?.count || 0 }} reviews)
                </span>
              </span>
            </div>
            <p
              class="text-3xl font-bold text-green-600 dark:text-green-400 mb-4"
            >
              ${{ product.price }}
            </p>

            <div class="flex items-center space-x-4 mb-4">
              <div class="flex items-center space-x-2">
                <label
                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Qty:</label
                >
                <div
                  class="flex items-center border border-gray-300 dark:border-gray-600 rounded"
                >
                  <button
                    @click="qty = Math.max(1, qty - 1)"
                    class="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    -
                  </button>
                  <input
                    v-model.number="qty"
                    type="number"
                    min="1"
                    class="w-16 px-2 py-1 text-center border-0 bg-transparent focus:ring-0"
                    @input="validateQty"
                  />
                  <button
                    @click="qty++"
                    class="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                @click="addToCart"
              >
                <Icon name="i-heroicons-shopping-cart" class="w-4 h-4 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>

          <div class="mt-6">
            <h2 class="text-lg font-semibold mb-2 dark:text-gray-100">
              Description
            </h2>
            <p
              class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
              v-html="product.description"
            ></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '~/stores/products'
import { useCartStore } from '~/stores/cart'

useSeoMeta({
  title: () =>
    product.value?.title
      ? `${product.value.title} - TokoTok`
      : 'Product - TokoTok',
  description: () =>
    product.value?.description || 'Product details from TokoTok store'
})

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const fallbackImg = '/favicon.ico'
const product = ref(null)
const loading = ref(true)
const error = ref(null)
const imgSrc = ref(fallbackImg)
const qty = ref(1)

const galleryImages = computed(() => {
  if (product.value?.images && Array.isArray(product.value.images)) {
    return product.value.images
  }
  return [product.value?.image || fallbackImg]
})

const validateQty = e => {
  // validate quantity to be a positive integer and only number
  const value = parseInt(e.target.value, 10)
  if (isNaN(value) || value < 1) {
    qty.value = 1
  } else {
    qty.value = value > 0 ? value : 1
  }
}

const fetchProduct = async () => {
  const productId = Number(route.params.id)

  if (isNaN(productId)) {
    error.value = 'Invalid product ID'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const existingProduct = productsStore.getProductById(productId)
    if (existingProduct) {
      product.value = existingProduct
      imgSrc.value = existingProduct.image || fallbackImg
      loading.value = false
      return
    }

    const fetchedProduct = await productsStore.fetchProductById(productId)
    if (fetchedProduct) {
      product.value = fetchedProduct
      imgSrc.value = fetchedProduct.image || fallbackImg
    } else {
      error.value = 'Product not found'
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = 'Failed to load product. Please try again.'
  } finally {
    loading.value = false
  }
}

watch(
  () => product.value?.image,
  val => {
    imgSrc.value = val || fallbackImg
  }
)

function onImgError() {
  imgSrc.value = fallbackImg
}

function addToCart() {
  if (product.value) {
    cartStore.addItem(product.value, qty.value)
  }
}

onMounted(() => {
  fetchProduct()
})

watch(
  () => route.params.id,
  () => {
    fetchProduct()
  }
)
</script>
