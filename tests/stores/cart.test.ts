import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '../../app/stores/cart'
import type { Product } from '../../app/types'

describe('Cart Store', () => {
  let cart: ReturnType<typeof useCartStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    cart = useCartStore()
    // Ensure cart starts clean for each test
    cart.clearCart()
  })

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 19.99,
    description: 'Test product description',
    category: 'electronics',
    image: 'https://example.com/image.jpg',
    rating: { rate: 4.5, count: 100 }
  }

  it('should initialize with empty cart', () => {
    expect(cart.items).toEqual([])
    expect(cart.itemCount).toBe(0)
    expect(cart.totalPrice).toBe(0)
    expect(cart.isOpen).toBe(false)
  })

  it('should add item to cart', () => {
    cart.addItem(mockProduct, 2)

    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].product).toEqual(mockProduct)
    expect(cart.items[0].quantity).toBe(2)
    expect(cart.itemCount).toBe(2)
    expect(cart.totalPrice).toBeCloseTo(39.98, 2)
  })

  it('should increase quantity when adding existing item', () => {
    cart.addItem(mockProduct, 2)
    cart.addItem(mockProduct, 3)

    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].quantity).toBe(5)
    expect(cart.itemCount).toBe(5)
  })

  it('should remove item from cart', () => {
    cart.addItem(mockProduct, 2)
    cart.removeItem(mockProduct.id)

    expect(cart.items).toHaveLength(0)
    expect(cart.itemCount).toBe(0)
    expect(cart.totalPrice).toBe(0)
  })

  it('should update item quantity', () => {
    cart.addItem(mockProduct, 2)
    cart.updateQuantity(mockProduct.id, 5)

    expect(cart.items[0].quantity).toBe(5)
    expect(cart.itemCount).toBe(5)
    expect(cart.totalPrice).toBeCloseTo(99.95, 2)
  })

  it('should remove item when quantity is set to 0', () => {
    cart.addItem(mockProduct, 2)
    cart.updateQuantity(mockProduct.id, 0)

    expect(cart.items).toHaveLength(0)
    expect(cart.itemCount).toBe(0)
  })

  it('should clear entire cart', () => {
    cart.addItem(mockProduct, 2)
    cart.clearCart()

    expect(cart.items).toHaveLength(0)
    expect(cart.itemCount).toBe(0)
    expect(cart.totalPrice).toBe(0)
  })

  it('should check if item is in cart', () => {
    expect(cart.isInCart(mockProduct.id)).toBe(false)

    cart.addItem(mockProduct, 1)
    expect(cart.isInCart(mockProduct.id)).toBe(true)
  })

  it('should get item quantity', () => {
    expect(cart.getItemQuantity(mockProduct.id)).toBe(0)

    cart.addItem(mockProduct, 3)
    expect(cart.getItemQuantity(mockProduct.id)).toBe(3)
  })

  it('should format total price correctly', () => {
    cart.addItem(mockProduct, 2)
    expect(cart.formattedTotal).toBe('$39.98')
  })

  it('should handle cart state toggling', () => {
    expect(cart.isOpen).toBe(false)

    cart.toggleCart()
    expect(cart.isOpen).toBe(true)

    cart.toggleCart()
    expect(cart.isOpen).toBe(false)
  })

  it('should calculate total price for multiple items', () => {
    const product2: Product = {
      ...mockProduct,
      id: 2,
      price: 29.99
    }

    cart.addItem(mockProduct, 2) // $39.98
    cart.addItem(product2, 1) // $29.99

    expect(cart.totalPrice).toBeCloseTo(69.97, 2)
    expect(cart.itemCount).toBe(3)
  })
})
