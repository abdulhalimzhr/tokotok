import { defineStore } from 'pinia'
import type { Product, FilterOptions, SearchState } from '~/types'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const filteredProducts = ref<Product[]>([])
  const categories = ref<string[]>([])

  if (import.meta.client) {
    const stored = localStorage.getItem('categories')
    if (stored) {
      try {
        categories.value = JSON.parse(stored)
      } catch (error) {
        console.error('Error parsing categories from localStorage:', error)
      }
    }
  }
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const searchState = ref<SearchState>({
    query: '',
    filters: {
      category: '',
      priceRange: { min: 0, max: 1000 },
      rating: 0
    },
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Product[]>('/api/products')
      products.value = data
      filteredProducts.value = data
      
      searchState.value.filters.category = ''
      
      applyFilters()
    } catch (err) {
      error.value = 'Failed to fetch products. Please try again.'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await $fetch<string[]>('/api/products/categories')
      categories.value = data
      
      if (import.meta.client) {
        localStorage.setItem('categories', JSON.stringify(categories.value))
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      if (products.value.length > 0) {
        categories.value = [...new Set(products.value.map(p => p.category))]
      }
    }
  }

  const fetchProductsByCategory = async (category: string) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Product[]>(`/api/products/category/${encodeURIComponent(category)}`)
      products.value = data
      filteredProducts.value = data
      
      searchState.value.filters.category = category
      applyFilters()
    } catch (err) {
      error.value = `Failed to fetch products for category "${category}". Please try again.`
      console.error('Error fetching products by category:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (id: number): Promise<Product | null> => {
    try {
      const data = await $fetch<Product>(`/api/products/${id}`)
      
      const existingIndex = products.value.findIndex(p => p.id === id)
      if (existingIndex >= 0) {
        products.value[existingIndex] = data
      } else {
        products.value.push(data)
      }
      
      return data
    } catch (err) {
      console.error('Error fetching product by ID:', err)
      return null
    }
  }

  const retryFetch = async () => {
    await fetchProducts()
  }

  const applyFilters = () => {
    let filtered = [...products.value]
    
    if (searchState.value.query) {
      const query = searchState.value.query.toLowerCase()
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    }
    
    if (searchState.value.filters.category) {
      filtered = filtered.filter(product =>
        product.category === searchState.value.filters.category
      )
    }
    
    filtered = filtered.filter(product =>
      product.price >= searchState.value.filters.priceRange.min &&
      product.price <= searchState.value.filters.priceRange.max
    )
    
    if (searchState.value.filters.rating > 0) {
      filtered = filtered.filter(product =>
        product.rating.rate >= searchState.value.filters.rating
      )
    }
    
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (searchState.value.sortBy) {
        case 'price':
          comparison = a.price - b.price
          break
        case 'rating':
          comparison = a.rating.rate - b.rating.rate
          break
        case 'name':
          comparison = a.title.localeCompare(b.title)
          break
      }
      
      return searchState.value.sortOrder === 'desc' ? -comparison : comparison
    })
    
    filteredProducts.value = filtered
  }

  const updateSearch = (query: string) => {
    searchState.value.query = query
    applyFilters()
  }

  const updateFilters = (filters: Partial<FilterOptions>) => {
    searchState.value.filters = { ...searchState.value.filters, ...filters }
    
    if (filters.category !== undefined) {
      if (filters.category === '') {
        fetchProducts()
      } else {
        fetchProductsByCategory(filters.category)
      }
    } else {
      applyFilters()
    }
  }

  const updateSort = (sortBy: 'price' | 'rating' | 'name', sortOrder: 'asc' | 'desc') => {
    searchState.value.sortBy = sortBy
    searchState.value.sortOrder = sortOrder
    applyFilters()
  }

  const clearFilters = () => {
    searchState.value = {
      query: '',
      filters: {
        category: '',
        priceRange: { min: 0, max: 1000 },
        rating: 0
      },
      sortBy: 'name',
      sortOrder: 'asc'
    }
    applyFilters()
  }

  const getProductById = (id: number): Product | undefined => {
    return products.value.find(product => product.id === id)
  }

  const hasProducts = computed(() => products.value.length > 0)
  const hasFilteredProducts = computed(() => filteredProducts.value.length > 0)
  const isFiltered = computed(() => {
    return searchState.value.query !== '' ||
           searchState.value.filters.category !== '' ||
           searchState.value.filters.rating > 0 ||
           searchState.value.filters.priceRange.min > 0 ||
           searchState.value.filters.priceRange.max < 1000
  })

  return {
    products,
    filteredProducts,
    categories,
    loading,
    error,
    searchState,
    
    fetchProducts,
    fetchCategories,
    fetchProductsByCategory,
    fetchProductById,
    retryFetch,
    updateSearch,
    updateFilters,
    updateSort,
    clearFilters,
    getProductById,
    
    hasProducts,
    hasFilteredProducts,
    isFiltered
  }
})