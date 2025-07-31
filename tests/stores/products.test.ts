import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from '../../app/stores/products'

// Mock $fetch
const mockFetch = vi.fn()
globalThis.$fetch = mockFetch

describe('Products Store', () => {
  let productsStore: ReturnType<typeof useProductsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    productsStore = useProductsStore()
    vi.clearAllMocks()
    mockFetch.mockClear()
  })

  describe('Product Fetching', () => {
    it('fetches products successfully', async () => {
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
          price: 25.50,
          description: 'Description 2',
          category: 'clothing',
          image: 'image2.jpg',
          rating: { rate: 3.8, count: 50 }
        }
      ]

      mockFetch.mockResolvedValueOnce(mockProducts)

      await productsStore.fetchProducts()

      expect(productsStore.products).toEqual(mockProducts)
      expect(productsStore.filteredProducts).toEqual(mockProducts)
      expect(productsStore.loading).toBe(false)
      expect(productsStore.error).toBeNull()
    })

    it('handles fetch error gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await productsStore.fetchProducts()

      expect(productsStore.error).toContain('Failed to fetch products')
      expect(productsStore.loading).toBe(false)
      expect(productsStore.products).toEqual([])
    })

    it('fetches categories successfully', async () => {
      const mockCategories = ['electronics', 'clothing', 'jewelery', 'men\'s clothing']

      mockFetch.mockResolvedValueOnce(mockCategories)

      await productsStore.fetchCategories()

      expect(productsStore.categories).toEqual(mockCategories)
    })
  })

  describe('Product Filtering', () => {
    beforeEach(async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Laptop',
          price: 999.99,
          description: 'Gaming laptop',
          category: 'electronics',
          image: 'laptop.jpg',
          rating: { rate: 4.5, count: 100 }
        },
        {
          id: 2,
          title: 'T-Shirt',
          price: 19.99,
          description: 'Cotton t-shirt',
          category: 'clothing',
          image: 'tshirt.jpg',
          rating: { rate: 4.0, count: 50 }
        },
        {
          id: 3,
          title: 'Headphones',
          price: 199.99,
          description: 'Wireless headphones',
          category: 'electronics',
          image: 'headphones.jpg',
          rating: { rate: 4.2, count: 75 }
        },
        {
          id: 4,
          title: 'Jeans',
          price: 59.99,
          description: 'Blue jeans',
          category: 'clothing',
          image: 'jeans.jpg',
          rating: { rate: 3.8, count: 25 }
        }
      ]

      // Mock the fetch to return our test data
      mockFetch.mockResolvedValue(mockProducts)
      await productsStore.fetchProducts()
      
      // Clear any existing filters and search state
      productsStore.clearFilters()
      productsStore.updateSearch('')
    })

    it('filters products by search query', () => {
      productsStore.updateSearch('laptop')
      
      expect(productsStore.filteredProducts).toHaveLength(1)
      expect(productsStore.filteredProducts[0].title).toBe('Laptop')
    })

    it('filters products by category', () => {
      // Use updateFilters for price range only, then manually adjust filters
      productsStore.updateFilters({ 
        priceRange: { min: 0, max: 2000 },
        rating: 0
      })
      
      // Manually set category without triggering API call
      productsStore.searchState.filters.category = 'electronics'
      
      // Trigger filtering by updating search (which calls applyFilters)
      productsStore.updateSearch('')
      
      expect(productsStore.filteredProducts).toHaveLength(2)
      expect(productsStore.filteredProducts.every(p => p.category === 'electronics')).toBe(true)
    })

    it('filters products by price range', () => {
      productsStore.updateFilters({
        priceRange: { min: 50, max: 500 },
        rating: 0
      })
      
      expect(productsStore.filteredProducts).toHaveLength(2) // Headphones (199.99) and Jeans (59.99)
      expect(productsStore.filteredProducts.every(p => p.price >= 50 && p.price <= 500)).toBe(true)
    })

    it('filters products by rating', () => {
      productsStore.updateFilters({
        priceRange: { min: 0, max: 2000 },
        rating: 4
      })
      
      expect(productsStore.filteredProducts).toHaveLength(3) // Laptop (4.5), T-Shirt (4.0), Headphones (4.2)
      expect(productsStore.filteredProducts.every(p => p.rating.rate >= 4)).toBe(true)
    })

    it('combines multiple filters', () => {
      productsStore.updateSearch('head')
      productsStore.updateFilters({
        category: 'electronics',
        priceRange: { min: 100, max: 300 },
        rating: 3
      })
      
      expect(productsStore.filteredProducts).toHaveLength(1)
      expect(productsStore.filteredProducts[0].title).toBe('Headphones')
    })
  })

  describe('Product Sorting', () => {
    beforeEach(() => {
      productsStore.products = [
        {
          id: 1,
          title: 'B Product',
          price: 50.00,
          description: 'Description',
          category: 'test',
          image: 'image.jpg',
          rating: { rate: 3.0, count: 10 }
        },
        {
          id: 2,
          title: 'A Product',
          price: 100.00,
          description: 'Description',
          category: 'test',
          image: 'image.jpg',
          rating: { rate: 5.0, count: 20 }
        },
        {
          id: 3,
          title: 'C Product',
          price: 25.00,
          description: 'Description',
          category: 'test',
          image: 'image.jpg',
          rating: { rate: 4.0, count: 15 }
        }
      ]
    })

    it('sorts products by title ascending', () => {
      productsStore.updateSort('name', 'asc')
      
      expect(productsStore.filteredProducts[0].title).toBe('A Product')
      expect(productsStore.filteredProducts[1].title).toBe('B Product')
      expect(productsStore.filteredProducts[2].title).toBe('C Product')
    })

    it('sorts products by title descending', () => {
      productsStore.updateSort('name', 'desc')
      
      expect(productsStore.filteredProducts[0].title).toBe('C Product')
      expect(productsStore.filteredProducts[1].title).toBe('B Product')
      expect(productsStore.filteredProducts[2].title).toBe('A Product')
    })

    it('sorts products by price ascending', () => {
      productsStore.updateSort('price', 'asc')
      
      expect(productsStore.filteredProducts[0].price).toBe(25.00)
      expect(productsStore.filteredProducts[1].price).toBe(50.00)
      expect(productsStore.filteredProducts[2].price).toBe(100.00)
    })

    it('sorts products by price descending', () => {
      productsStore.updateSort('price', 'desc')
      
      expect(productsStore.filteredProducts[0].price).toBe(100.00)
      expect(productsStore.filteredProducts[1].price).toBe(50.00)
      expect(productsStore.filteredProducts[2].price).toBe(25.00)
    })

    it('sorts products by rating descending', () => {
      productsStore.updateSort('rating', 'desc')
      
      expect(productsStore.filteredProducts[0].rating.rate).toBe(5.0)
      expect(productsStore.filteredProducts[1].rating.rate).toBe(4.0)
      expect(productsStore.filteredProducts[2].rating.rate).toBe(3.0)
    })
  })

  describe('Computed Properties', () => {
    it('correctly identifies when there are no products', () => {
      expect(productsStore.hasProducts).toBe(false)
      
      productsStore.products = [
        {
          id: 1,
          title: 'Product',
          price: 10,
          description: 'Description',
          category: 'test',
          image: 'image.jpg',
          rating: { rate: 4, count: 10 }
        }
      ]
      
      expect(productsStore.hasProducts).toBe(true)
    })
  })

  describe('Utility Functions', () => {
    it('clears all filters', () => {
      productsStore.updateSearch('test')
      productsStore.updateFilters({
        category: 'electronics',
        priceRange: { min: 100, max: 500 },
        rating: 4
      })
      
      productsStore.clearFilters()
      
      expect(productsStore.searchState.query).toBe('')
      expect(productsStore.searchState.filters.category).toBe('')
      expect(productsStore.searchState.filters.priceRange).toEqual({ min: 0, max: 1000 })
      expect(productsStore.searchState.filters.rating).toBe(0)
    })

    it('gets product by ID', () => {
      const product = {
        id: 1,
        title: 'Test Product',
        price: 10,
        description: 'Description',
        category: 'test',
        image: 'image.jpg',
        rating: { rate: 4, count: 10 }
      }
      
      productsStore.products = [product]
      
      expect(productsStore.getProductById(1)).toEqual(product)
      expect(productsStore.getProductById(999)).toBeUndefined()
    })
  })
})
