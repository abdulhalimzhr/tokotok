<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <div class="flex items-center space-x-2">
          <select
            v-model="filterType"
            class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="purchase">Purchases</option>
            <option value="topup">Top-ups</option>
            <option value="refund">Refunds</option>
          </select>

          <button
            v-if="walletStore.transactions.length > 0"
            class="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            @click="showAllTransactions = !showAllTransactions"
          >
            {{ showAllTransactions ? 'Show Less' : 'View All' }}
          </button>
        </div>
      </div>
    </div>

    <div class="divide-y divide-gray-200">
      <div v-if="filteredTransactions.length === 0" class="p-6 text-center">
        <svg
          class="w-12 h-12 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h4 class="text-lg font-medium text-gray-900 mb-2">
          No Transactions Yet
        </h4>
        <p class="text-gray-600">
          {{
            filterType
              ? `No ${filterType} transactions found`
              : 'Your transaction history will appear here'
          }}
        </p>
      </div>

      <div
        v-for="transaction in displayedTransactions"
        :key="transaction.id"
        class="p-6 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              :class="getTransactionIconClass(transaction.type)"
            >
              <Icon
                :icon="
                  transaction.type === 'purchase'
                    ? 'mdi:cart-outline'
                    : transaction.type === 'topup'
                      ? 'mdi:arrow-down-bold-circle-outline'
                      : 'mdi:cash-refund'
                "
                class="w-5 h-5"
              />
            </div>

            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ transaction.description }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatTransactionDate(transaction.timestamp) }}xxx
              </p>
            </div>
          </div>

          <div class="text-right">
            <p
              class="text-sm font-semibold"
              :class="getAmountClass(transaction.type)"
            >
              {{ getAmountDisplay(transaction) }}
            </p>
            <p class="text-xs text-gray-500 capitalize">
              {{ transaction.type }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="canLoadMore" class="px-6 py-4 border-t border-gray-200">
      <button
        class="w-full text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-4 py-2 hover:bg-green-50"
        @click="loadMore"
      >
        Load More Transactions
      </button>
    </div>
  </div>
</template>

<script setup>
const walletStore = useWalletStore()

const filterType = ref('')
const showAllTransactions = ref(false)
const displayLimit = ref(5)

const filteredTransactions = computed(() => {
  let transactions = walletStore.transactions

  if (filterType.value) {
    transactions = transactions.filter(t => t.type === filterType.value)
  }

  return transactions
    .slice()
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
})

const displayedTransactions = computed(() => {
  if (showAllTransactions.value) {
    return filteredTransactions.value
  }
  return filteredTransactions.value.slice(0, displayLimit.value)
})

const canLoadMore = computed(() => {
  return (
    !showAllTransactions.value &&
    filteredTransactions.value.length > displayLimit.value
  )
})

const getTransactionIconClass = type => {
  switch (type) {
    case 'purchase':
      return 'bg-red-100 text-red-600'
    case 'topup':
      return 'bg-green-100 text-green-600'
    case 'refund':
      return 'bg-green-100 text-blue-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const getAmountClass = type => {
  switch (type) {
    case 'purchase':
      return 'text-red-600'
    case 'topup':
    case 'refund':
      return 'text-green-600'
    default:
      return 'text-gray-900'
  }
}

const getAmountDisplay = transaction => {
  const amount = transaction.amount.toFixed(2)
  switch (transaction.type) {
    case 'purchase':
      return `-$${amount}`
    case 'topup':
    case 'refund':
      return `+$${amount}`
    default:
      return `$${amount}`
  }
}

const formatTransactionDate = timestamp => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = (now - date) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (diffInHours < 168) {
    return date.toLocaleDateString([], {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } else {
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
}

const loadMore = () => {
  displayLimit.value += 10
}
</script>
