import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SpendingAnalytics from '../../app/components/SpendingAnalytics.vue'
import { useWalletStore } from '../../app/stores/wallet'
import { useProductsStore } from '../../app/stores/products'

// Mock the Icon component
vi.mock('#components', () => ({
  Icon: {
    name: 'Icon',
    template: '<div></div>'
  }
}))

describe('SpendingAnalytics Component', () => {
  let pinia: any
  let walletStore: any
  let productsStore: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    walletStore = useWalletStore()
    productsStore = useProductsStore()

    // Mock products
    productsStore.products = [
      { id: 1, category: 'electronics', title: 'Product 1', price: 10 },
      { id: 2, category: 'clothing', title: 'Product 2', price: 20 },
      { id: 3, category: 'electronics', title: 'Product 3', price: 30 }
    ]

    // Mock the getProductById method properly
    productsStore.getProductById = vi.fn().mockImplementation((id: number) => {
      const products = [
        { id: 1, category: 'electronics', title: 'Product 1', price: 10 },
        { id: 2, category: 'clothing', title: 'Product 2', price: 20 },
        { id: 3, category: 'electronics', title: 'Product 3', price: 30 }
      ]
      return products.find((p: any) => p.id === id)
    })
  })

  it('handles transactions with single productId (backward compatibility)', async () => {
    // Add a transaction with single productId
    walletStore.transactions = [
      {
        id: '1',
        type: 'purchase',
        amount: 50,
        description: 'Test purchase',
        timestamp: new Date(),
        productId: 1 // Single product ID
      }
    ]

    const wrapper = mount(SpendingAnalytics, {
      global: {
        plugins: [pinia]
      }
    })

    // The component should render without errors
    expect(wrapper.exists()).toBe(true)
  })

  it('properly distributes amount across multiple products in category breakdown', async () => {
    // Add a transaction with detailed purchase items (new format)
    walletStore.transactions = [
      {
        id: '1',
        type: 'purchase',
        amount: 60,
        description: 'Multi-product purchase',
        timestamp: new Date(),
        purchaseItems: [
          {
            productId: 1,
            price: 10,
            quantity: 1,
            category: 'electronics',
            title: 'Product 1'
          },
          {
            productId: 2,
            price: 20,
            quantity: 1,
            category: 'clothing',
            title: 'Product 2'
          },
          {
            productId: 3,
            price: 30,
            quantity: 1,
            category: 'electronics',
            title: 'Product 3'
          }
        ]
      }
    ]

    const wrapper = mount(SpendingAnalytics, {
      global: {
        plugins: [pinia]
      }
    })

    const vm = wrapper.vm as any

    // Check that the amount is properly calculated based on actual prices
    // Electronics: Product 1 ($10) + Product 3 ($30) = $40
    // Clothing: Product 2 ($20) = $20

    const categoryBreakdown = vm.categoryBreakdown
    expect(categoryBreakdown).toBeDefined()

    const electronicsCategory = categoryBreakdown.find(
      (cat: any) => cat.name === 'electronics'
    )
    const clothingCategory = categoryBreakdown.find(
      (cat: any) => cat.name === 'clothing'
    )

    expect(electronicsCategory?.amount).toBe(40)
    expect(clothingCategory?.amount).toBe(20)
  })

  it('handles mixed transactions with single and multiple product IDs', async () => {
    walletStore.transactions = [
      {
        id: '1',
        type: 'purchase',
        amount: 50,
        description: 'Multi-product purchase',
        timestamp: new Date(),
        purchaseItems: [
          {
            productId: 2,
            price: 20,
            quantity: 1,
            category: 'clothing',
            title: 'Product 2'
          },
          {
            productId: 3,
            price: 20,
            quantity: 1,
            category: 'electronics',
            title: 'Product 2'
          },
          {
            productId: 4,
            price: 30,
            quantity: 1,
            category: 'electronics',
            title: 'Product 3'
          }
        ]
      }
    ]

    const wrapper = mount(SpendingAnalytics, {
      global: {
        plugins: [pinia]
      }
    })

    const vm = wrapper.vm as any
    const categoryBreakdown = vm.categoryBreakdown

    const electronicsCategory = categoryBreakdown.find(
      (cat: any) => cat.name === 'electronics'
    )
    const clothingCategory = categoryBreakdown.find(
      (cat: any) => cat.name === 'clothing'
    )

    expect(electronicsCategory?.amount).toBe(50)
    expect(clothingCategory?.amount).toBe(20)
  })

  it('correctly calculates amounts with quantities', async () => {
    // Test transaction with quantities > 1
    walletStore.transactions = [
      {
        id: '1',
        type: 'purchase',
        amount: 140,
        description: 'Purchase with quantities',
        timestamp: new Date(),
        purchaseItems: [
          {
            productId: 1,
            price: 10,
            quantity: 2,
            category: 'electronics',
            title: 'Product 1'
          }, // $20
          {
            productId: 2,
            price: 20,
            quantity: 3,
            category: 'clothing',
            title: 'Product 2'
          }, // $60
          {
            productId: 3,
            price: 30,
            quantity: 2,
            category: 'electronics',
            title: 'Product 3'
          } // $60
        ]
      }
    ]

    const wrapper = mount(SpendingAnalytics, {
      global: {
        plugins: [pinia]
      }
    })

    const vm = wrapper.vm as any
    const categoryBreakdown = vm.categoryBreakdown

    const electronicsCategory = categoryBreakdown.find(
      (cat: any) => cat.name === 'electronics'
    )
    const clothingCategory = categoryBreakdown.find(
      (cat: any) => cat.name === 'clothing'
    )

    expect(electronicsCategory?.amount).toBe(80)
    expect(clothingCategory?.amount).toBe(60)
  })

  it('handles transactions without product information', async () => {
    walletStore.transactions = [
      {
        id: '1',
        type: 'purchase',
        amount: 25,
        description: 'Unknown purchase',
        timestamp: new Date()
        // No purchaseItems
      }
    ]

    const wrapper = mount(SpendingAnalytics, {
      global: {
        plugins: [pinia]
      }
    })

    const vm = wrapper.vm as any
    const categoryBreakdown = vm.categoryBreakdown

    const otherCategory = categoryBreakdown.find(
      (cat: any) => cat.name === 'Other'
    )
    expect(otherCategory?.amount).toBe(25)
  })
})
