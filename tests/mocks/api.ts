import { vi } from 'vitest'

// Mock API responses
export const mockProducts = [
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

export const mockCategories = ['electronics', 'clothing', 'jewelery', "men's clothing"]

export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com'
}

export const mockAuthResponse = {
  user: mockUser,
  token: 'fake-jwt-token'
}

// Mock $fetch globally
global.$fetch = vi.fn((url: string, options?: any) => {
  const method = options?.method || 'GET'
  
  if (method === 'GET') {
    if (url === '/api/products') {
      return Promise.resolve(mockProducts)
    }
    if (url === '/api/products/categories') {
      return Promise.resolve(mockCategories)
    }
    if (url.startsWith('/api/products/category/')) {
      const category = url.split('/').pop()
      return Promise.resolve(mockProducts.filter(p => p.category === category))
    }
    if (url.startsWith('/api/products/') && url !== '/api/products/categories') {
      const id = parseInt(url.split('/').pop() || '0')
      return Promise.resolve(mockProducts.find(p => p.id === id))
    }
  }
  
  if (method === 'POST') {
    if (url === '/api/auth/login') {
      return Promise.resolve(mockAuthResponse)
    }
    if (url === '/api/auth/register') {
      return Promise.resolve(mockAuthResponse)
    }
  }
  
  return Promise.reject(new Error(`Mock not found for ${method} ${url}`))
})
