import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWalletStore } from '../../app/stores/wallet'

describe('Wallet Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    })
  })

  it('should initialize with zero balance and empty transactions', () => {
    const wallet = useWalletStore()
    
    expect(wallet.balance).toBe(0)
    expect(wallet.transactions).toHaveLength(0)
    expect(wallet.formattedBalance).toBe('$0.00')
  })

  it('should top up wallet successfully', async () => {
    const wallet = useWalletStore()
    
    const transaction = await wallet.topUp(50, 'Test top-up')
    
    expect(wallet.balance).toBe(50)
    expect(wallet.transactions).toHaveLength(1)
    expect(transaction).toMatchObject({
      type: 'topup',
      amount: 50,
      description: 'Test top-up'
    })
  })

  it('should handle purchase transactions', async () => {
    const wallet = useWalletStore()
    
    // Top up first
    await wallet.topUp(100)
    expect(wallet.balance).toBe(100)
    
    // Make purchase
    const transaction = await wallet.purchase(30, 'Test purchase')
    
    expect(wallet.balance).toBe(70)
    expect(wallet.transactions).toHaveLength(2)
    expect(transaction).toMatchObject({
      type: 'purchase',
      amount: 30,
      description: 'Test purchase'
    })
  })

  it('should check if user can afford amount', async () => {
    const wallet = useWalletStore()
    
    expect(wallet.canAfford(10)).toBe(false)
    
    await wallet.topUp(50)
    expect(wallet.canAfford(30)).toBe(true)
    expect(wallet.canAfford(60)).toBe(false)
    expect(wallet.canAfford(50)).toBe(true)
  })

  it('should calculate total spent correctly', () => {
    const wallet = useWalletStore()
    
    expect(wallet.totalSpent).toBe(0)
    
    // Add some transactions manually for testing
    wallet.transactions.push(
      {
        id: '1',
        type: 'topup',
        amount: 100,
        description: 'Top up',
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'purchase',
        amount: 30,
        description: 'Purchase 1',
        timestamp: new Date()
      },
      {
        id: '3',
        type: 'purchase',
        amount: 20,
        description: 'Purchase 2',
        timestamp: new Date()
      }
    )
    
    expect(wallet.totalSpent).toBe(50)
  })

  it('should calculate total top-ups correctly', () => {
    const wallet = useWalletStore()
    
    expect(wallet.totalTopups).toBe(0)
    
    // Add some transactions manually for testing
    wallet.transactions.push(
      {
        id: '1',
        type: 'topup',
        amount: 100,
        description: 'Top up 1',
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'topup',
        amount: 50,
        description: 'Top up 2',
        timestamp: new Date()
      },
      {
        id: '3',
        type: 'purchase',
        amount: 20,
        description: 'Purchase',
        timestamp: new Date()
      }
    )
    
    expect(wallet.totalTopups).toBe(150)
  })

  it('should get recent transactions in correct order', () => {
    const wallet = useWalletStore()
    
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)
    
    wallet.transactions.push(
      {
        id: '1',
        type: 'topup',
        amount: 100,
        description: 'Old transaction',
        timestamp: twoDaysAgo
      },
      {
        id: '2',
        type: 'purchase',
        amount: 30,
        description: 'Recent transaction',
        timestamp: now
      },
      {
        id: '3',
        type: 'topup',
        amount: 50,
        description: 'Yesterday transaction',
        timestamp: yesterday
      }
    )
    
    const recent = wallet.recentTransactions
    expect(recent).toHaveLength(3)
    expect(recent[0].description).toBe('Recent transaction')
    expect(recent[1].description).toBe('Yesterday transaction')
    expect(recent[2].description).toBe('Old transaction')
  })

  it('should limit recent transactions to 10', () => {
    const wallet = useWalletStore()
    
    // Add 15 transactions
    for (let i = 0; i < 15; i++) {
      wallet.transactions.push({
        id: i.toString(),
        type: 'topup',
        amount: 10,
        description: `Transaction ${i}`,
        timestamp: new Date(Date.now() + i * 1000)
      })
    }
    
    expect(wallet.recentTransactions).toHaveLength(10)
  })

  it('should format balance correctly', () => {
    const wallet = useWalletStore()
    
    expect(wallet.formattedBalance).toBe('$0.00')
    
    wallet.balance = 123.456
    expect(wallet.formattedBalance).toBe('$123.46')
    
    wallet.balance = 99.9
    expect(wallet.formattedBalance).toBe('$99.90')
  })

  it('should prevent purchase when insufficient funds', async () => {
    const wallet = useWalletStore()
    
    await expect(wallet.purchase(50, 'Test purchase')).rejects.toThrow('Insufficient funds')
    expect(wallet.balance).toBe(0)
    expect(wallet.transactions).toHaveLength(0)
  })

  it('should save to localStorage on balance change', async () => {
    const wallet = useWalletStore()
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem')
    
    await wallet.topUp(50)
    
    expect(setItemSpy).toHaveBeenCalledWith(
      'wallet-data',
      expect.stringContaining('"balance":50')
    )
  })
})
