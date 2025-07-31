// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import ProductCatalog from '../../app/components/ProductCatalog.vue'
import { useProductsStore } from '../../app/stores/products'
import { useCartStore } from '../../app/stores/cart'

// Mock child components
vi.mock('../../app/components/ProductCard.vue', () => ({
  default: {
    name: 'ProductCard',
    template: '<div class="product-card">{{ product.title }}</div>',
    props: ['product'],
    emits: ['view-details', 'add-to-cart']
  }
}))

vi.mock('../../app/components/ProductCardSkeleton.vue', () => ({
  default: {
    name: 'ProductCardSkeleton',
    template: '<div class="skeleton">Loading...</div>'
  }
}))

vi.mock('../../app/components/Pagination.vue', () => ({
  default: {
    name: 'Pagination',
    template: '<div class="pagination">Pagination</div>',
    props: ['currentPage', 'totalItems', 'itemsPerPage'],
    emits: ['page-change', 'items-per-page-change']
  }
}))

describe('ProductCatalog Component', () => {
  let pinia: any
  const mockProducts = [
    {
      id: 1,
      title: 'Product 1',
      price: 10.99,
      description: 'Description 1',
      category: 'electronics',
      image: 'image1.jpg',
      rating: { rate: 4.5, count: 100 }
    },
    {
      id: 2,
      title: 'Product 2',
      price: 25.5,
      description: 'Description 2',
      category: 'clothing',
      image: 'image2.jpg',
      rating: { rate: 3.8, count: 50 }
    }
  ]

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    const productsStore = useProductsStore()
    productsStore.products = mockProducts
    productsStore.filteredProducts = mockProducts
    productsStore.loading = false
    productsStore.error = null
    productsStore.searchState = {
      query: '',
      category: '',
      sortBy: 'title',
      sortOrder: 'asc',
      filters: {
        category: '',
        priceRange: { min: 0, max: 1000 },
        rating: 0
      }
    }
  })

  it('renders product grid when products are loaded', () => {
    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.findAll('.product-card')).toHaveLength(2)
    expect(wrapper.text()).toContain('Product 1')
    expect(wrapper.text()).toContain('Product 2')
  })

  it('shows loading skeletons when products are loading', () => {
    const productsStore = useProductsStore()
    productsStore.loading = true

    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.findAll('.skeleton')).toHaveLength(12) // 12 skeleton cards
  })

  it('displays error message when there is an error', () => {
    const productsStore = useProductsStore()
    productsStore.loading = false
    productsStore.error = 'Failed to load products'

    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('Failed to Load Products')
  })

  it('renders sorting controls', () => {
    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    const selects = wrapper.findAll('select')
    expect(selects.length).toBeGreaterThanOrEqual(2) // At least 2 select elements for sorting
  })

  it('updates sort when sorting controls change', async () => {
    const productsStore = useProductsStore()
    productsStore.updateSort = vi.fn()

    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    const sortSelects = wrapper.findAll('select')
    await sortSelects[0]?.setValue('price')

    expect(productsStore.updateSort).toHaveBeenCalledWith('price', 'asc')
  })

  it('shows no products message when filtered products is empty', () => {
    const productsStore = useProductsStore()
    productsStore.filteredProducts = []
    productsStore.loading = false

    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('No Products Found')
  })

  it('handles pagination correctly', () => {
    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('.pagination').exists()).toBe(true)
  })

  it('resets to first page when filters change', async () => {
    const productsStore = useProductsStore()
    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    // Simulate filter change by updating filteredProducts
    await wrapper.vm.$nextTick()
    productsStore.filteredProducts = [mockProducts[0]] // Simulate filter applied

    await wrapper.vm.$nextTick()

    // Current page should reset to 1
    expect(wrapper.vm.currentPage).toBe(1)
  })

  it('handles page change event', async () => {
    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    // Simulate pagination component emitting page-change
    const pagination = wrapper.findComponent({ name: 'Pagination' })
    await pagination.vm.$emit('page-change', 2)

    expect(wrapper.vm.currentPage).toBe(2)
  })

  it('handles items per page change', async () => {
    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    // Simulate pagination component emitting items-per-page-change
    const pagination = wrapper.findComponent({ name: 'Pagination' })
    await pagination.vm.$emit('items-per-page-change', 25)

    expect(wrapper.vm.itemsPerPage).toBe(25)
  })

  it('calculates paginated products correctly', () => {
    // Add more products to test pagination
    const productsStore = useProductsStore()
    const manyProducts = Array.from({ length: 25 }, (_, i) => ({
      ...mockProducts[0],
      id: i + 1,
      title: `Product ${i + 1}`
    }))
    productsStore.filteredProducts = manyProducts

    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    // Should show first 10 products by default (itemsPerPage = 10)
    expect(wrapper.vm.paginatedProducts).toHaveLength(10)
  })

  it('scrolls to top when page changes', async () => {
    // Mock window.scrollTo
    const scrollToSpy = vi.fn()
    Object.defineProperty(window, 'scrollTo', { value: scrollToSpy })

    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    wrapper.vm.handlePageChange(2)

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('handles product modal opening', async () => {
    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    wrapper.vm.openProductModal(mockProducts[0])

    expect(wrapper.vm.modalProduct).toEqual(mockProducts[0])
    expect(wrapper.vm.modalShow).toBe(true)
  })

  it('handles add to cart from product modal', async () => {
    const cartStore = useCartStore()
    cartStore.addItem = vi.fn()

    const wrapper = mount(ProductCatalog, {
      global: {
        plugins: [pinia]
      }
    })

    wrapper.vm.handleAddToCart(mockProducts[0], 3)

    expect(cartStore.addItem).toHaveBeenCalledWith(mockProducts[0], 3)
  })
})
