import { defineStore } from 'pinia'
import type { Transaction } from '~/types'

export const useWalletStore = defineStore('wallet', () => {
  const balance = ref(0)
  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const saveToStorage = () => {
    if (process.client && typeof window !== 'undefined') {
      try {
        const walletData = {
          balance: balance.value,
          transactions: transactions.value
        }
        localStorage.setItem('wallet-data', JSON.stringify(walletData))
        console.log('Wallet saved to localStorage:', walletData)
      } catch (e) {
        console.error('Failed to save wallet data:', e)
      }
    }
  }

  const loadFromStorage = () => {
    if (process.client && typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem('wallet-data')
        if (savedData) {
          const walletData = JSON.parse(savedData)
          balance.value =
            walletData.balance !== undefined ? walletData.balance : 1000
          transactions.value = (walletData.transactions || []).map(
            (t: any) => ({
              ...t,
              timestamp: new Date(t.timestamp)
            })
          )
          console.log('Wallet loaded from localStorage:', walletData)
        }
      } catch (e) {
        console.error('Failed to load wallet data:', e)
      }
    }
  }

  const recentTransactions = computed(() =>
    transactions.value
      .slice()
      .sort(
        (a: Transaction, b: Transaction) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10)
  )

  const totalSpent = computed(() =>
    transactions.value
      .filter((t: Transaction) => t.type === 'purchase')
      .reduce((total: number, t: Transaction) => total + t.amount, 0)
  )

  const totalTopups = computed(() =>
    transactions.value
      .filter((t: Transaction) => t.type === 'topup')
      .reduce((total: number, t: Transaction) => total + t.amount, 0)
  )

  const formattedBalance = computed(() => `$${balance.value.toFixed(2)}`)

  const canAfford = (amount: number): boolean => {
    return balance.value >= amount
  }

  const topUp = async (
    amount: number,
    description: string = 'Wallet top-up'
  ) => {
    if (amount <= 0) {
      throw new Error('Top-up amount must be positive')
    }

    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'topup',
        amount,
        description,
        timestamp: new Date()
      }

      balance.value += amount
      transactions.value.push(transaction)
      saveToStorage()

      return transaction
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to top up wallet'
      throw err
    } finally {
      loading.value = false
    }
  }

  const purchase = async (
    amount: number,
    description: string,
    productId?: number
  ) => {
    if (amount <= 0) {
      throw new Error('Purchase amount must be positive')
    }

    if (!canAfford(amount)) {
      throw new Error('Insufficient funds')
    }

    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'purchase',
        amount,
        description,
        timestamp: new Date(),
        productId
      }

      balance.value -= amount
      transactions.value.push(transaction)
      saveToStorage()

      return transaction
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to complete purchase'
      throw err
    } finally {
      loading.value = false
    }
  }

  const refund = async (
    originalTransactionId: string,
    amount: number,
    description: string
  ) => {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'refund',
        amount,
        description,
        timestamp: new Date()
      }

      balance.value += amount
      transactions.value.push(transaction)
      saveToStorage()

      return transaction
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to process refund'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTransactionsByType = (type: Transaction['type']) => {
    return transactions.value.filter((t: Transaction) => t.type === type)
  }

  const getTransactionsByDateRange = (startDate: Date, endDate: Date) => {
    return transactions.value.filter((t: Transaction) => {
      const transactionDate = new Date(t.timestamp)
      return transactionDate >= startDate && transactionDate <= endDate
    })
  }

  const clearTransactions = () => {
    transactions.value = []
    saveToStorage()
  }

  const resetWallet = () => {
    balance.value = 1000
    transactions.value = []
    saveToStorage()
  }

  return {
    balance,
    transactions,
    loading,
    error,

    recentTransactions,
    totalSpent,
    totalTopups,
    formattedBalance,

    topUp,
    purchase,
    refund,
    canAfford,
    getTransactionsByType,
    getTransactionsByDateRange,
    clearTransactions,
    resetWallet,
    loadFromStorage,
    saveToStorage
  }
})
