<template>
  <div class="max-w-4xl mx-auto space-y-8 min-h-screen mt-8 px-4">
    <div class="text-left">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Checkout
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Review your order and complete your purchase
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2
            class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
          >
            Order Summary
          </h2>

          <div v-if="cartStore.isEmpty" class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Your cart is empty
            </p>
            <NuxtLink to="/">
              <button
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </button>
            </NuxtLink>
          </div>

          <div v-else class="space-y-4">
            <CheckoutItem
              v-for="item in cartStore.items"
              :key="item.product.id"
              :item="item"
            />
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2
            class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4"
          >
            Payment Method
          </h2>

          <div
            class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-green-900 dark:text-green-100">
                    Wallet Balance
                  </p>
                  <p class="text-sm text-green-700 dark:text-green-300">
                    {{ walletStore.formattedBalance }} available
                  </p>
                </div>
              </div>
              <svg
                class="w-5 h-5 text-green-600 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
          >
            Price Details
          </h3>

          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">
                Subtotal ({{ cartStore.items.length }} items)
              </span>
              <span class="font-medium text-gray-900 dark:text-gray-100">
                {{ cartStore.formattedTotal }}
              </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400"> Shipping </span>
              <span class="font-medium text-green-600 dark:text-green-400">
                Free
              </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400"> Tax </span>
              <span class="font-medium text-gray-900 dark:text-gray-100">
                $0.00
              </span>
            </div>

            <div
              class="border-t border-gray-200 dark:border-gray-600 pt-3 text-sm"
            >
              <div class="flex justify-between font-semibold">
                <span class="text-gray-900 dark:text-gray-100"> Total </span>
                <span class="text-gray-900 dark:text-gray-100">
                  {{ cartStore.formattedTotal }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
          >
            Wallet Status
          </h3>

          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">
                Current Balance
              </span>
              <span class="font-medium text-gray-900 dark:text-gray-100">
                {{ walletStore.formattedBalance }}
              </span>
            </div>

            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">
                Order Total
              </span>
              <span class="font-medium text-gray-900 dark:text-gray-100">
                {{ cartStore.formattedTotal }}
              </span>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-600 pt-3">
              <div class="flex justify-between text-sm font-semibold">
                <span class="text-gray-900 dark:text-gray-100">
                  Remaining Balance
                </span>
                <span
                  :class="{
                    'text-green-600 dark:text-green-400':
                      (walletStore.balance || 0) >= (cartStore.totalPrice || 0),
                    'text-red-600 dark:text-red-400':
                      (walletStore.balance || 0) < (cartStore.totalPrice || 0)
                  }"
                >
                  ${{
                    Math.max(
                      0,
                      (walletStore.balance || 0) - (cartStore.totalPrice || 0)
                    ).toFixed(2)
                  }}
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="(walletStore.balance || 0) < (cartStore.totalPrice || 0)"
            class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg"
          >
            <div class="flex items-start space-x-2">
              <svg
                class="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <div>
                <p class="text-sm font-medium text-red-800 dark:text-red-200">
                  Insufficient Balance
                </p>
                <p class="text-sm text-red-700 dark:text-red-300">
                  You need ${{
                    Math.max(
                      0,
                      (cartStore.totalPrice || 0) - (walletStore.balance || 0)
                    ).toFixed(2)
                  }}
                  more to complete this purchase.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <button
            class="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            :disabled="
              cartStore.isEmpty ||
              (walletStore.balance || 0) < (cartStore.totalPrice || 0) ||
              isProcessing
            "
            @click="processOrder"
          >
            <div v-if="isProcessing" class="flex items-center space-x-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span>Processing Order...</span>
            </div>
            <span
              v-else-if="
                (walletStore.balance || 0) < (cartStore.totalPrice || 0)
              "
            >
              Insufficient Balance
            </span>
            <span v-else>
              Complete Purchase {{ cartStore.formattedTotal }}
            </span>
          </button>

          <button
            v-if="(walletStore.balance || 0) < (cartStore.totalPrice || 0)"
            class="w-full px-4 py-3 border-2 border-green-600 text-green-600 dark:text-green-400 rounded-lg font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            @click="showTopUpModal = true"
          >
            Top Up Wallet
          </button>

          <NuxtLink to="/">
            <button
              class="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-gray-100 dark:bg-gray-800"
            >
              Continue Shopping
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <Modal v-model="showTopUpModal">
      <div class="space-y-4">
        <h3
          class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2"
        >
          <svg
            class="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Top Up Wallet
        </h3>

        <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm">
          Add funds to complete your purchase.
          <br />
          <span class="font-medium">Minimum required:</span>
          ${{
            Math.max(
              0,
              (cartStore.totalPrice || 0) - (walletStore.balance || 0)
            ).toFixed(2)
          }}
        </p>

        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="amount in quickTopUpAmounts"
            :key="amount"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="topUpAmount = amount"
          >
            ${{ amount }}
          </button>
        </div>

        <input
          v-model.number="topUpAmount"
          type="number"
          placeholder="Enter custom amount"
          :min="
            Math.max(
              0,
              Math.ceil(
                ((cartStore.totalPrice || 0) - (walletStore.balance || 0)) * 100
              ) / 100
            )
          "
          step="0.01"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <div class="flex justify-end space-x-3 pt-2">
          <button
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="showTopUpModal = false"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            :disabled="
              isTopUpLoading ||
              !topUpAmount ||
              topUpAmount <
                Math.max(
                  0,
                  (cartStore.totalPrice || 0) - (walletStore.balance || 0)
                )
            "
            @click="handleTopUp"
          >
            <span v-if="isTopUpLoading">Loading...</span>
            <span v-else>Top Up ${{ topUpAmount || 0 }}</span>
          </button>
        </div>
      </div>
    </Modal>

    <Modal v-model="showSuccessModal">
      <div class="text-center space-y-4">
        <div
          class="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto"
        >
          <svg
            class="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Order Completed!
        </h3>

        <p class="text-gray-600 dark:text-gray-400">
          Your order has been successfully processed and will be delivered soon.
        </p>

        <div class="flex gap-3 justify-center pt-2">
          <button
            class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            @click="goToWallet"
          >
            View Wallet
          </button>
          <button
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="continueShopping"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue3-toastify'

const cartStore = useCartStore()
const walletStore = useWalletStore()
const router = useRouter()

const isProcessing = ref(false)
const showTopUpModal = ref(false)
const showSuccessModal = ref(false)
const topUpAmount = ref<number>(0)
const isTopUpLoading = ref(false)

const quickTopUpAmounts = computed(() => {
  const totalPrice = cartStore.totalPrice || 0
  const balance = walletStore.balance || 0
  const needed = totalPrice - balance
  const baseAmounts = [10, 25, 50, 100]
  const minNeeded = Math.max(0, Math.ceil(needed * 100) / 100)

  return [minNeeded, ...baseAmounts.filter(a => a > minNeeded)].slice(0, 3)
})

const processOrder = async () => {
  const totalPrice = cartStore.totalPrice || 0
  const balance = walletStore.balance || 0

  if (cartStore.isEmpty || balance < totalPrice) {
    toast.error('Cannot process order: insufficient balance or empty cart')
    return
  }

  isProcessing.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 2000))

    await walletStore.purchase(
      cartStore.totalPrice,
      `Order purchase - ${cartStore.items.length} items`
    )

    cartStore.clearCart()

    showSuccessModal.value = true

    await nextTick()
    setTimeout(() => {
      toast.success(
        'Order completed! Your purchase has been processed successfully'
      )
    }, 100)
  } catch (error) {
    console.error('Order processing error:', error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'There was an error processing your order'
    toast.error(`Order failed: ${errorMessage}`)
  } finally {
    isProcessing.value = false
  }
}

const handleTopUp = async () => {
  if (!topUpAmount.value || topUpAmount.value <= 0) {
    toast.error('Please enter a valid top-up amount')
    return
  }

  isTopUpLoading.value = true

  try {
    await walletStore.topUp(
      topUpAmount.value,
      `Checkout top-up of $${topUpAmount.value}`
    )

    await nextTick()
    setTimeout(() => {
      toast.success(
        `Wallet topped up! Added $${topUpAmount.value.toFixed(
          2
        )} to your wallet`
      )
    }, 100)

    showTopUpModal.value = false
    topUpAmount.value = 0
  } catch (error) {
    console.error('Top-up error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to add funds to wallet'
    toast.error(`Top up failed: ${errorMessage}`)
  } finally {
    isTopUpLoading.value = false
  }
}

const goToWallet = () => {
  showSuccessModal.value = false
  router.push('/wallet')
}

const continueShopping = () => {
  showSuccessModal.value = false
  router.push('/')
}

watch(showTopUpModal, isOpen => {
  const totalPrice = cartStore.totalPrice || 0
  const balance = walletStore.balance || 0

  if (isOpen && totalPrice > balance) {
    const needed = totalPrice - balance
    topUpAmount.value = Math.max(0, Math.ceil(needed * 100) / 100)
  }
})

useSeoMeta({
  title: 'Checkout - TokoTok',
  description: 'Complete your purchase securely with your digital wallet.'
})

onMounted(() => {
  if (cartStore.isEmpty) {
    router.push('/')
  }
})
</script>
