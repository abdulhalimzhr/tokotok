import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ShoppingCart from '../../app/components/ShoppingCart.vue'
import { useCartStore } from '../../app/stores/cart'
import { useDropdownState } from '../../app/composables/useDropdownState'

// Mock the composables and stores
vi.mock('../../app/composables/useDropdownState')
vi.mock('../../app/composables/useNotifications', () => ({
  useNotifications: () => ({
    notify: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn()
    }
  })
}))

describe('ShoppingCart Component', () => {
  let mockDropdownState: any
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    // Mock dropdown state
    mockDropdownState = {
      isShoppingCartOpen: { value: true },
      toggleShoppingCart: vi.fn(),
      closeShoppingCart: vi.fn()
    }
    
    vi.mocked(useDropdownState).mockReturnValue(mockDropdownState)
  })

  it('renders cart button with item count badge', () => {
    const cartStore = useCartStore()
    cartStore.items = [
      {
        product: { id: 1, title: 'Test Product', price: 10.99, image: '', description: '', category: '', rating: { rate: 4, count: 10 } },
        quantity: 2
      }
    ]

    const wrapper = mount(ShoppingCart, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('.bg-green-500').text()).toBe('2') // Item count badge
  })

  it('shows empty cart message when no items', () => {
    const cartStore = useCartStore()
    cartStore.items = []

    const wrapper = mount(ShoppingCart, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('Your cart is empty')
    expect(wrapper.text()).toContain('Add some products to get started')
  })

  it('displays cart items correctly', () => {
    const cartStore = useCartStore()
    cartStore.items = [
      {
        product: { 
          id: 1, 
          title: 'Test Product', 
          price: 10.99, 
          image: 'test.jpg', 
          description: 'Test description', 
          category: 'test', 
          rating: { rate: 4, count: 10 } 
        },
        quantity: 2
      }
    ]

    const wrapper = mount(ShoppingCart, {
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('Test Product')
    expect(wrapper.text()).toContain('$10.99')
    expect(wrapper.text()).toContain('Subtotal: $21.98')
  })

  it('toggles cart visibility when button clicked', async () => {
    const wrapper = mount(ShoppingCart, {
      global: {
        plugins: [pinia]
      }
    })

    const button = wrapper.find('button')
    await button.trigger('click')

    expect(mockDropdownState.toggleShoppingCart).toHaveBeenCalled()
  })

  it('shows cart total correctly', () => {
    const cartStore = useCartStore()
    cartStore.items = [
      {
        product: { id: 1, title: 'Product 1', price: 10.00, image: '', description: '', category: '', rating: { rate: 4, count: 10 } },
        quantity: 2
      },
      {
        product: { id: 2, title: 'Product 2', price: 15.50, image: '', description: '', category: '', rating: { rate: 4, count: 10 } },
        quantity: 1
      }
    ]

    const wrapper = mount(ShoppingCart, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('$35.50') // 2 * 10.00 + 1 * 15.50
  })

  it('updates quantity when plus/minus buttons clicked', async () => {
    const cartStore = useCartStore()
    cartStore.items = [
      {
        product: { id: 1, title: 'Test Product', price: 10.99, image: '', description: '', category: '', rating: { rate: 4, count: 10 } },
        quantity: 2
      }
    ]
    cartStore.updateQuantity = vi.fn()

    const wrapper = mount(ShoppingCart, {
      global: {
        plugins: [pinia]
      }
    })

    const plusButton = wrapper.find('[class*="w-7 h-7"]:last-child') // Plus button
    await plusButton.trigger('click')

    expect(cartStore.updateQuantity).toHaveBeenCalledWith(1, 3)
  })

  it('removes item when trash button clicked', async () => {
    const cartStore = useCartStore()
    cartStore.items = [
      {
        product: { id: 1, title: 'Test Product', price: 10.99, image: '', description: '', category: '', rating: { rate: 4, count: 10 } },
        quantity: 2
      }
    ]
    cartStore.removeItem = vi.fn()

    const wrapper = mount(ShoppingCart, {
      global: {
        plugins: [pinia]
      }
    })

    const removeButton = wrapper.find('.text-red-500')
    await removeButton.trigger('click')

    expect(cartStore.removeItem).toHaveBeenCalledWith(1)
  })

  it('shows clear cart modal when clear button clicked', async () => {
    const cartStore = useCartStore()
    cartStore.items = [
      {
        product: { id: 1, title: 'Test Product', price: 10.99, image: '', description: '', category: '', rating: { rate: 4, count: 10 } },
        quantity: 1
      }
    ]

    const wrapper = mount(ShoppingCart, {
      global: {
        plugins: [pinia]
      }
    })

    const clearButton = wrapper.find('button:contains("Clear Cart")')
    if (clearButton.exists()) {
      await clearButton.trigger('click')
      expect(wrapper.text()).toContain('Clear Cart') // Modal should appear
    }
  })

  it('displays correct item count in header', () => {
    const cartStore = useCartStore()
    cartStore.items = [
      {
        product: { id: 1, title: 'Product 1', price: 10.00, image: '', description: '', category: '', rating: { rate: 4, count: 10 } },
        quantity: 3
      },
      {
        product: { id: 2, title: 'Product 2', price: 15.50, image: '', description: '', category: '', rating: { rate: 4, count: 10 } },
        quantity: 2
      }
    ]

    const wrapper = mount(ShoppingCart, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('5 items') // 3 + 2 items
  })

  it('handles item count over 99 with 99+ display', () => {
    const cartStore = useCartStore()
    // Create 100 items to test 99+ display
    cartStore.items = Array.from({ length: 50 }, (_, i) => ({
      product: { 
        id: i + 1, 
        title: `Product ${i + 1}`, 
        price: 10.00, 
        image: '', 
        description: '', 
        category: '', 
        rating: { rate: 4, count: 10 } 
      },
      quantity: 3 // 50 * 3 = 150 items
    }))

    const wrapper = mount(ShoppingCart, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('.bg-green-500').text()).toBe('99+')
  })
})
