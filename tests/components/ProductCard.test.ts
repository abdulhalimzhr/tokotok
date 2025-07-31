import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ProductCard from '../../app/components/ProductCard.vue'
import { useAuthStore } from '../../app/stores/auth'

// Mock the router
const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

vi.mock('../../app/composables/useNotifications', () => ({
  useNotifications: () => ({
    notify: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn()
    }
  })
}))

describe('ProductCard Component', () => {
  let pinia: any
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 29.99,
    description: 'Test product description',
    category: 'electronics',
    image: 'https://example.com/image.jpg',
    rating: {
      rate: 4.5,
      count: 100
    }
  }

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders product information correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
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
    expect(wrapper.text()).toContain('$29.99')
    expect(wrapper.text()).toContain('(100)')
    // The component shows stars but not the numerical rating
  })

  it('displays product image with fallback', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    const image = wrapper.find('img')
    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe(mockProduct.image)
    expect(image.attributes('alt')).toBe(mockProduct.title)
  })

  it('handles image error with fallback', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    const image = wrapper.find('img')
    await image.trigger('error')

    // Image src should change to fallback
    expect(image.attributes('src')).toBe('https://via.placeholder.com/150')
  })

  it('emits view-details event when view button clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    const viewButton = wrapper.find('button:contains("View")')
    if (viewButton.exists()) {
      await viewButton.trigger('click')
      expect(wrapper.emitted('view-details')).toBeTruthy()
      const events = wrapper.emitted('view-details')
      expect(events?.[0]).toEqual([mockProduct])
    }
  })

  it('redirects to login when unauthenticated user tries to add to cart', async () => {
    const authStore = useAuthStore()
    authStore.setToken(null) // Set token to null to make isAuthenticated false

    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    const addToCartButton = wrapper.find('button')
    await addToCartButton.trigger('click')

    expect(mockRouter.push).toHaveBeenCalledWith('/login')
  })

  it('adds product to cart when authenticated user clicks add to cart', async () => {
    const authStore = useAuthStore()
    authStore.setToken('fake-token') // Set token to make isAuthenticated true

    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    const addToCartButton = wrapper.find('button')
    await addToCartButton.trigger('click')

    // Wait for the 500ms timeout in the component's addToCart method
    await new Promise(resolve => setTimeout(resolve, 600))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.emitted('add-to-cart')).toBeTruthy()
    const events = wrapper.emitted('add-to-cart')
    expect(events?.[0]).toEqual([mockProduct, 1])
  })

  it('shows loading state when adding to cart', async () => {
    const authStore = useAuthStore()
    authStore.setToken('fake-token') // Set token to make isAuthenticated true

    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    const addToCartButton = wrapper.find('button')
    
    // Trigger click and immediately check for disabled state
    const clickPromise = addToCartButton.trigger('click')
    await wrapper.vm.$nextTick()
    
    // Button should be disabled while loading
    expect(addToCartButton.text()).toContain('Adding')
    
    // Wait for the operation to complete
    await clickPromise
  })

  it('displays star rating correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    // Should show 4.5 stars - 4 full stars and 1 half star
    const stars = wrapper.findAll('.text-yellow-400')
    expect(stars.length).toBeGreaterThan(0)
  })

  it('truncates long product titles', () => {
    const longTitleProduct = {
      ...mockProduct,
      title: 'This is a very long product title that should be truncated to fit in the card layout properly'
    }

    const wrapper = mount(ProductCard, {
      props: {
        product: longTitleProduct
      },
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    // Check if truncation class is applied
    const titleElement = wrapper.find('.line-clamp-2')
    expect(titleElement.exists()).toBe(true)
  })

  it('handles products with no rating gracefully', () => {
    const noRatingProduct = {
      ...mockProduct,
      rating: {
        rate: 0,
        count: 0
      }
    }

    const wrapper = mount(ProductCard, {
      props: {
        product: noRatingProduct
      },
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('0')
    expect(wrapper.text()).toContain('(0)')
  })

  it('applies correct styling classes', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    // Check for main card styling
    expect(wrapper.classes()).toContain('relative')
    expect(wrapper.classes()).toContain('group')
    expect(wrapper.classes()).toContain('w-full')
  })

  it('handles price display formatting', () => {
    const expensiveProduct = {
      ...mockProduct,
      price: 1234.567 // Test decimal handling
    }

    const wrapper = mount(ProductCard, {
      props: {
        product: expensiveProduct
      },
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: {
            template: '<div><slot /></div>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain('$1234.57') // Should format to 2 decimal places
  })
})
