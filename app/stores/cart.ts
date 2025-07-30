import { defineStore } from 'pinia'
import type { Product, CartItem } from '~/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)
  
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cart-items')
    if (savedCart) {
      try {
        items.value = JSON.parse(savedCart)
      } catch (e) {
        console.error('Failed to parse saved cart:', e)
      }
    }
  }
  
  const saveToStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart-items', JSON.stringify(items.value))
    }
  }
  
  const itemCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((total, item) => total + (item.product.price * item.quantity), 0))
  const formattedTotal = computed(() => `$${totalPrice.value.toFixed(2)}`)
  const isEmpty = computed(() => items.value.length === 0)
  
  const addItem = (product: Product, quantity: number = 1) => {
    const existingItem = items.value.find(item => item.product.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
    
    saveToStorage()
    
    isOpen.value = true
    setTimeout(() => {
      isOpen.value = false
    }, 2000)
  }
  
  const removeItem = (productId: number) => {
    const index = items.value.findIndex(item => item.product.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }
  
  const updateQuantity = (productId: number, quantity: number) => {
    const item = items.value.find(item => item.product.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
        saveToStorage()
      }
    }
  }
  
  const clearCart = () => {
    items.value = []
    saveToStorage()
  }
  
  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }
  
  const openCart = () => {
    isOpen.value = true
  }
  
  const closeCart = () => {
    isOpen.value = false
  }
  
  const getItemQuantity = (productId: number): number => {
    const item = items.value.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }
  
  const isInCart = (productId: number): boolean => {
    return items.value.some(item => item.product.id === productId)
  }
  
  return {
    items,
    isOpen,
    
    itemCount,
    totalPrice,
    formattedTotal,
    isEmpty,
    
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getItemQuantity,
    isInCart
  }
})