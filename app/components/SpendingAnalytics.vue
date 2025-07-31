<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 xl:p-3 2xl:p-6"
  >
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Spending Analytics
      </h3>
      <select
        v-model="selectedPeriod"
        class="text-sm rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-green-500 focus:border-green-500"
      >
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 3 months</option>
      </select>
    </div>

    <div
      class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-2 gap-4 mb-6"
    >
      <!-- Total Spent -->
      <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 xl:p-2.5 2xl:p-4">
        <div class="flex items-center">
          <div class="bg-red-500 p-1.5 xl:p-1 2xl:p-2 rounded-lg">
            <Icon
              name="heroicons:arrow-trending-down"
              class="w-4 h-4 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-white"
            />
          </div>
          <div class="ml-2 xl:ml-1.5 2xl:ml-3 min-w-0">
            <p
              class="text-xs xl:text-xs 2xl:text-sm font-medium text-red-600 dark:text-red-400"
            >
              Total Spent
            </p>
            <p
              class="text-lg xl:text-base 2xl:text-2xl font-bold text-red-900 dark:text-red-100 truncate"
            >
              ${{ filteredSpending.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Total Transactions -->
      <div
        class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 xl:p-2.5 2xl:p-4"
      >
        <div class="flex items-center">
          <div class="bg-blue-500 p-1.5 xl:p-1 2xl:p-2 rounded-lg">
            <Icon
              name="heroicons:document-text"
              class="w-4 h-4 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-white"
            />
          </div>
          <div class="ml-2 xl:ml-1.5 2xl:ml-3 min-w-0">
            <p
              class="text-xs xl:text-xs 2xl:text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              Transactions
            </p>
            <p
              class="text-lg xl:text-base 2xl:text-2xl font-bold text-blue-900 dark:text-blue-100"
            >
              {{ filteredTransactions.length }}
            </p>
          </div>
        </div>
      </div>

      <!-- Average Transaction -->
      <div
        class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 xl:p-2.5 2xl:p-4"
      >
        <div class="flex items-center">
          <div class="bg-green-500 p-1.5 xl:p-1 2xl:p-2 rounded-lg">
            <Icon
              name="heroicons:calculator"
              class="w-4 h-4 xl:w-3.5 xl:h-3.5 2xl:w-5 2xl:h-5 text-white"
            />
          </div>
          <div class="ml-2 xl:ml-1.5 2xl:ml-3 min-w-0">
            <p
              class="text-xs xl:text-xs 2xl:text-sm font-medium text-green-600 dark:text-green-400"
            >
              Avg. Transaction
            </p>
            <p
              class="text-lg xl:text-base 2xl:text-2xl font-bold text-green-900 dark:text-green-100 truncate"
            >
              ${{ averageTransaction.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Spending Trend Chart -->
    <div class="mb-6" v-if="dailySpending.length > 0">
      <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
        Daily Spending Trend
      </h4>
      <div class="h-32 flex items-end space-x-0.5 xl:space-x-1">
        <div
          v-for="(day, index) in dailySpending"
          :key="index"
          class="flex-1 bg-green-100 dark:bg-green-900/30 rounded-t-sm relative group cursor-pointer transition-all hover:bg-green-200 dark:hover:bg-green-900/50 min-w-[2px]"
          :style="{ height: `${(day.amount / maxDailySpend) * 100}%` }"
          :title="`${day.date}: $${day.amount.toFixed(2)}`"
        >
          <div
            class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
          >
            {{ day.date }}: ${{ day.amount.toFixed(2) }}
          </div>
        </div>
      </div>
      <div
        class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2"
      >
        <span>{{ selectedPeriod }} days ago</span>
        <span>Today</span>
      </div>
    </div>

    <!-- Category Breakdown -->
    <div v-if="categoryBreakdown.length > 0">
      <h4 class="text-md font-medium text-gray-900 dark:text-white mb-3">
        Spending by Category
      </h4>
      <div class="space-y-2">
        <div
          v-for="category in categoryBreakdown"
          :key="category.name"
          class="flex items-center justify-between p-2.5 xl:p-2 2xl:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
        >
          <div
            class="flex items-center space-x-2 xl:space-x-1.5 2xl:space-x-3 min-w-0"
          >
            <div
              class="w-3 h-3 rounded-full flex-shrink-0"
              :style="{ backgroundColor: category.color }"
            ></div>
            <span
              class="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize truncate"
            >
              {{ category.name }}
            </span>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
              ${{ category.amount.toFixed(2) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ category.percentage.toFixed(1) }}%
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- No data state -->
    <div
      v-if="filteredTransactions.length === 0"
      class="text-center py-8 text-gray-500"
    >
      <Icon
        name="heroicons:chart-bar"
        class="w-12 h-12 mx-auto mb-4 text-gray-300"
      />
      <p>No purchase data available</p>
      <p class="text-sm mt-1">Start shopping to see your spending analytics</p>
    </div>
  </div>
</template>

<script setup>
import { useWalletStore } from '~/stores/wallet'
import { useProductsStore } from '~/stores/products'

const walletStore = useWalletStore()
const productsStore = useProductsStore()

const selectedPeriod = ref(30)

const filteredTransactions = computed(() => {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - selectedPeriod.value)

  return walletStore.transactions.filter(
    transaction =>
      transaction.type === 'purchase' &&
      new Date(transaction.timestamp) >= cutoffDate
  )
})

const filteredSpending = computed(() => {
  return filteredTransactions.value.reduce(
    (total, transaction) => total + transaction.amount,
    0
  )
})

const averageTransaction = computed(() => {
  if (filteredTransactions.value.length === 0) return 0
  return filteredSpending.value / filteredTransactions.value.length
})

const dailySpending = computed(() => {
  const days = []
  const today = new Date()

  for (let i = selectedPeriod.value - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })

    const dayTotal = filteredTransactions.value
      .filter(transaction => {
        const transactionDate = new Date(transaction.timestamp)
        return transactionDate.toDateString() === date.toDateString()
      })
      .reduce((total, transaction) => total + transaction.amount, 0)

    days.push({ date: dateStr, amount: dayTotal })
  }

  return days
})

const maxDailySpend = computed(() => {
  return Math.max(...dailySpending.value.map(day => day.amount), 1)
})

const categoryBreakdown = computed(() => {
  const categoryTotals = new Map()
  const colors = [
    '#10B981',
    '#3B82F6',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#F97316',
    '#84CC16',
    '#06B6D4'
  ]

  filteredTransactions.value.forEach(transaction => {
    if (transaction.productId) {
      const product = productsStore.getProductById(transaction.productId)
      const category = product?.category || 'Other'
      categoryTotals.set(
        category,
        (categoryTotals.get(category) || 0) + transaction.amount
      )
    } else {
      categoryTotals.set(
        'Other',
        (categoryTotals.get('Other') || 0) + transaction.amount
      )
    }
  })

  const total = filteredSpending.value

  return Array.from(categoryTotals.entries())
    .map(([name, amount], index) => ({
      name,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.amount - a.amount)
})
</script>
