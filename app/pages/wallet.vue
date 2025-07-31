<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          My Wallet
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          Manage your wallet balance and view your purchase history.
        </p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div class="xl:col-span-2 space-y-6">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Wallet Balance
              </h2>
              <div class="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <Icon
                  name="i-heroicons-wallet"
                  class="w-6 h-6 text-green-600 dark:text-green-400"
                />
              </div>
            </div>
            <div
              class="text-4xl font-bold text-green-600 dark:text-green-400 mb-2"
            >
              ${{ Number(walletStore.balance || 0).toFixed(2) }}
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Available for purchases
            </p>
          </div>

          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div
              class="pb-6 mb-6 border-b border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h2
                    class="text-xl font-semibold text-gray-900 dark:text-white"
                  >
                    Recent Transactions
                  </h2>
                  <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Your latest wallet activity
                  </p>
                </div>
                <select
                  v-model="selectedPeriod"
                  class="text-sm rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="7">Last 7 days</option>
                  <option value="14">Last 14 days</option>
                  <option value="30">Last 30 days</option>
                </select>
              </div>
            </div>
            <div class="max-h-[450px] overflow-y-auto">
              <div
                v-if="walletStore.transactions.length === 0"
                class="text-center py-8"
              >
                <Icon
                  name="i-heroicons-receipt-percent"
                  class="w-12 h-12 text-gray-400 mx-auto mb-3"
                />
                <p class="text-gray-500 dark:text-gray-400">
                  No transactions yet
                </p>
                <p class="text-sm text-gray-400 dark:text-gray-500">
                  Start shopping to see your purchase history!
                </p>
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="transaction in recentTransactions"
                  :key="transaction.id"
                  class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div :class="getTransactionIconClass(transaction.type)">
                        <Icon
                          :name="getTransactionIcon(transaction.type)"
                          class="w-4 h-4"
                        />
                      </div>
                      <div class="flex-1">
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ transaction.description }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          {{ formatDate(transaction.timestamp) }}
                        </p>
                        <!-- Purchased Items Details -->
                        <div
                          v-if="
                            transaction.type === 'purchase' &&
                            transaction.purchaseItems &&
                            transaction.purchaseItems.length > 0
                          "
                          class="mt-2 space-y-1 hidden md:block"
                        >
                          <div
                            v-for="item in transaction.purchaseItems"
                            :key="item.productId"
                            class="text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between"
                          >
                            <span class="flex items-center w-full">
                              <span
                                class="w-2 h-2 bg-gray-400 rounded-full mr-2"
                              ></span>
                              <span class="truncate w-full md:w-[300px] me-4">
                                {{ item.title }}
                              </span>
                              <span> × {{ item.quantity }} </span>
                            </span>
                            <span class="font-medium ms-4">
                              ${{
                                (
                                  Number(item.price) * Number(item.quantity)
                                ).toFixed(2)
                              }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div :class="getAmountClass(transaction.type)">
                      {{ transaction.type === 'topup' ? '+' : '-' }}${{
                        Math.abs(Number(transaction.amount)).toFixed(2)
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Spending Analytics -->
          <SpendingAnalytics />
        </div>

        <div class="space-y-6">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700"
            >
              Quick Top Up
            </h3>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <button
                v-for="amount in quickAmounts"
                :key="amount"
                @click="quickTopUp(amount)"
                :disabled="walletStore.loading"
                class="p-3 text-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                <div class="font-semibold text-gray-900 dark:text-white">
                  ${{ amount }}
                </div>
              </button>
            </div>
            <button
              @click="openCustomTopUpModal"
              class="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Custom Amount
            </button>
          </div>

          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700"
            >
              Quick Stats
              <span
                class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2"
              >
                (Last {{ selectedPeriod }} days)
              </span>
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">
                  Total Spent
                </span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  ${{ totalSpent.toFixed(2) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">
                  Total Income
                </span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  ${{ totalAdded.toFixed(2) }}
                </span>
              </div>
              <div
                class="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700"
              >
                <span class="text-gray-600 dark:text-gray-400">
                  Net Change
                </span>
                <span
                  class="font-semibold"
                  :class="
                    totalAdded - totalSpent >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  "
                >
                  {{ totalAdded - totalSpent >= 0 ? '+' : '' }}${{
                    (totalAdded - totalSpent).toFixed(2)
                  }}
                </span>
              </div>
            </div>
          </div>

          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700"
            >
              Quick Actions
            </h3>
            <div class="space-y-3">
              <NuxtLink
                to="/"
                class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Icon name="i-heroicons-shopping-bag" class="w-4 h-4 mr-2" />
                Browse Products
              </NuxtLink>

              <NuxtLink
                v-if="cartStore.itemCount > 0"
                to="/checkout"
                class="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              >
                <Icon name="i-heroicons-credit-card" class="w-4 h-4 mr-2" />
                Checkout ({{ cartStore.itemCount }} items)
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showTopUpModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click="closeTopUpModal"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Add Custom Amount
            </h3>
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              @click="closeTopUpModal"
            >
              <Icon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Amount ($)
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <span class="text-gray-500 dark:text-gray-400 sm:text-sm">
                    $
                  </span>
                </div>
                <input
                  v-model="customAmount"
                  @input="handleCustomAmountInput"
                  type="text"
                  inputmode="decimal"
                  pattern="[0-9]*\.?[0-9]{0,2}"
                  class="block w-full pl-7 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="{
                    'border-red-500 focus:ring-red-500 focus:border-red-500':
                      customAmountError
                  }"
                  placeholder="0.00"
                />
              </div>
              <p
                v-if="customAmountError"
                class="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                {{ customAmountError }}
              </p>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                @click="closeTopUpModal"
              >
                Cancel
              </button>
              <button
                class="flex-1 px-4 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :disabled="!isCustomAmountValid || walletStore.loading"
                @click="handleCustomTopUp"
              >
                <span v-if="walletStore.loading">Processing...</span>
                <span v-else>Add ${{ customAmount || 0 }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Top Up Confirmation Modal -->
      <div
        v-if="showQuickTopUpConfirmModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click="closeQuickTopUpConfirmModal"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
          @click.stop
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Confirm Top Up
            </h3>
            <button
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              @click="closeQuickTopUpConfirmModal"
            >
              <Icon name="i-heroicons-x-mark" class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <div class="text-center">
              <div
                class="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Icon
                  name="i-heroicons-plus"
                  class="w-8 h-8 text-green-600 dark:text-green-400"
                />
              </div>
              <p class="text-gray-900 dark:text-white font-medium mb-2">
                Add ${{ quickTopUpAmount }} to your wallet?
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Your current balance: {{ walletStore.formattedBalance }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                New balance will be: ${{
                  (
                    Number(walletStore.balance || 0) +
                    Number(quickTopUpAmount.value)
                  ).toFixed(2)
                }}
              </p>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                class="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                @click="closeQuickTopUpConfirmModal"
              >
                Cancel
              </button>
              <button
                class="flex-1 px-4 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                :disabled="walletStore.loading"
                @click="confirmQuickTopUp"
              >
                <span v-if="walletStore.loading">Processing...</span>
                <span v-else>Confirm Top Up</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

// Use Nuxt middleware for authentication
definePageMeta({
  middleware: 'auth'
})

useSeoMeta({
  title: 'My Wallet - TokoTok',
  description: 'Manage your wallet balance and view your purchase history.'
})

const cartStore = useCartStore()
const walletStore = useWalletStore()

onMounted(() => {
  // Load wallet data
  if (process.client) {
    walletStore.loadFromStorage()
  }
})

const showTopUpModal = ref(false)
const showQuickTopUpConfirmModal = ref(false)
const quickTopUpAmount = ref(0)
const customAmount = ref(0)
const selectedPeriod = ref(30) // Default to last 30 days

const quickAmounts = [10, 25, 50, 100]

const recentTransactions = computed(() => {
  const now = new Date()
  const cutoffDate = new Date(
    now.getTime() - selectedPeriod.value * 24 * 60 * 60 * 1000
  )

  return walletStore.transactions
    .filter(t => new Date(t.timestamp) >= cutoffDate)
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10)
})

const totalSpent = computed(() => {
  const now = new Date()
  const cutoffDate = new Date(
    now.getTime() - selectedPeriod.value * 24 * 60 * 60 * 1000
  )

  return walletStore.transactions
    .filter(t => t.type === 'purchase' && new Date(t.timestamp) >= cutoffDate)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
})

const totalAdded = computed(() => {
  const now = new Date()
  const cutoffDate = new Date(
    now.getTime() - selectedPeriod.value * 24 * 60 * 60 * 1000
  )

  return walletStore.transactions
    .filter(t => t.type === 'topup' && new Date(t.timestamp) >= cutoffDate)
    .reduce((sum, t) => sum + Number(t.amount), 0)
})

// Validation for custom amount
const isCustomAmountValid = computed(() => {
  if (!customAmount.value) {
    return false
  }
  const num = parseFloat(customAmount.value)
  return !isNaN(num) && num > 0 && num <= 10000 // Max limit of $10,000
})

const customAmountError = computed(() => {
  if (!customAmount.value) {
    return ''
  }
  const num = parseFloat(customAmount.value)
  if (isNaN(num)) {
    return 'Please enter a valid number'
  }

  if (num <= 0) {
    return 'Amount must be greater than $0'
  }

  if (num > 10000) {
    return 'Maximum amount is $10,000'
  }
  return ''
})

const quickTopUp = async amount => {
  quickTopUpAmount.value = amount
  showQuickTopUpConfirmModal.value = true
}

const confirmQuickTopUp = async () => {
  try {
    const transaction = await walletStore.topUp(
      quickTopUpAmount.value,
      `Quick top-up of $${quickTopUpAmount.value}`
    )
    showQuickTopUpConfirmModal.value = false
    toast.success(
      `Successfully added $${Number(transaction.amount).toFixed(
        2
      )} to your wallet!`
    )
  } catch (error) {
    showQuickTopUpConfirmModal.value = false
    toast.error(`Failed to top up wallet: ${error.message}`)
  }
}

const closeQuickTopUpConfirmModal = () => {
  showQuickTopUpConfirmModal.value = false
  quickTopUpAmount.value = 0
}

const openCustomTopUpModal = () => {
  showTopUpModal.value = true
  customAmount.value = 0
}

const closeTopUpModal = () => {
  showTopUpModal.value = false
  customAmount.value = 0
}

// Validation function for custom amount input
const validateCustomAmount = value => {
  if (!value) {
    return ''
  }
  // Remove any non-numeric characters except decimal point
  let sanitizedValue = value.toString().replace(/[^0-9.]/g, '')

  // Handle multiple decimal points - keep only the first one
  const parts = sanitizedValue.split('.')
  if (parts.length > 2) {
    sanitizedValue = parts[0] + '.' + parts.slice(1).join('')
  }

  // Split into integer and decimal parts
  const [integer, decimal] = sanitizedValue.split('.')

  // Remove leading zeros from integer part, but keep at least one digit
  let cleanInteger = integer ? integer.replace(/^0+/, '') || '0' : '0'

  // Ensure we don't start with multiple zeros unless it's just "0" or "0."
  if (cleanInteger === '0' && decimal !== undefined) {
    cleanInteger = '0'
  } else if (cleanInteger.length > 1 && cleanInteger.startsWith('0')) {
    cleanInteger = cleanInteger.substring(1)
  }

  // Limit decimal places to 2
  const cleanDecimal = decimal ? decimal.slice(0, 2) : undefined

  return cleanDecimal !== undefined
    ? `${cleanInteger}.${cleanDecimal}`
    : cleanInteger
}

// Handle input for custom amount with validation
const handleCustomAmountInput = event => {
  const validatedValue = validateCustomAmount(event.target.value)
  customAmount.value = validatedValue
  event.target.value = validatedValue
}

const handleCustomTopUp = async () => {
  if (!customAmount.value || customAmount.value <= 0) {
    return
  }

  try {
    const transaction = await walletStore.topUp(
      customAmount.value,
      `Custom top-up of $${customAmount.value}`
    )

    closeTopUpModal()

    toast.success(
      `Successfully added $${Number(transaction.amount).toFixed(
        2
      )} to your wallet!`
    )
  } catch (error) {
    toast.error(`Failed to top up wallet: ${error.message}`)
  }
}

const formatDate = timestamp => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTransactionIcon = type => {
  switch (type) {
    case 'topup':
      return 'heroicons:arrow-up'
    case 'purchase':
      return 'heroicons:shopping-cart'
    case 'refund':
      return 'heroicons:arrow-uturn-left'
    default:
      return 'heroicons:currency-dollar'
  }
}

const getTransactionIconClass = type => {
  const baseClass = 'px-4 py-3 rounded-full'
  switch (type) {
    case 'topup':
      return `${baseClass} bg-green-200 dark:bg-green-900 text-green-600 dark:text-green-400`
    case 'purchase':
      return `${baseClass} bg-green-200 dark:bg-green-900 text-blue-600 dark:text-blue-400`
    case 'refund':
      return `${baseClass} bg-yellow-200 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400`
    default:
      return `${baseClass} bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400`
  }
}

const getAmountClass = type => {
  const baseClass = 'font-semibold'
  switch (type) {
    case 'topup':
      return `${baseClass} text-green-600 dark:text-green-400`
    case 'purchase':
      return `${baseClass} text-red-600 dark:text-red-400`
    case 'refund':
      return `${baseClass} text-blue-600 dark:text-blue-400`
    default:
      return `${baseClass} text-gray-600 dark:text-gray-400`
  }
}
</script>
