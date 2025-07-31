import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../app/stores/auth'

// Mock $fetch
const mockFetch = vi.fn()
globalThis.$fetch = mockFetch

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock navigateTo
globalThis.navigateTo = vi.fn()

describe('Auth Store', () => {
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    vi.clearAllMocks()
    mockFetch.mockClear()
    
    // Clear localStorage mocks
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  describe('Authentication', () => {
    it('logs in user successfully', async () => {
      const mockResponse = { token: 'fake-token' }
      
      mockFetch.mockResolvedValueOnce(mockResponse)

      await authStore.login('testuser', 'password')

      expect(authStore.user).toBeTruthy()
      expect(authStore.token).toBe('fake-token')
      expect(authStore.isAuthenticated).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', 'fake-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user_data', expect.any(String))
    })

    it('handles login failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Invalid credentials'))

      await expect(authStore.login('wronguser', 'wrongpass')).rejects.toThrow('Invalid username or password')

      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
    })

    it('handles network errors during login', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(authStore.login('testuser', 'password')).rejects.toThrow('Invalid username or password')

      expect(authStore.isAuthenticated).toBe(false)
    })

    it('registers user successfully', async () => {
      const mockUser = { id: 1, username: 'newuser', email: 'new@example.com' }
      
      mockFetch.mockResolvedValueOnce(mockUser)

      const result = await authStore.register({
        email: 'new@example.com',
        username: 'newuser',
        password: 'password',
        name: { firstname: 'New', lastname: 'User' },
        address: {
          city: 'Test City',
          street: 'Test Street',
          number: 123,
          zipcode: '12345',
          geolocation: { lat: '0', long: '0' }
        },
        phone: '1234567890'
      })

      expect(result).toEqual(mockUser)
    })

    it('handles registration failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Registration failed'))

      await expect(authStore.register({
        email: 'existing@example.com',
        username: 'existinguser',
        password: 'password',
        name: { firstname: 'Test', lastname: 'User' },
        address: {
          city: 'Test City',
          street: 'Test Street',
          number: 123,
          zipcode: '12345',
          geolocation: { lat: '0', long: '0' }
        },
        phone: '1234567890'
      })).rejects.toThrow('Registration failed. Please try again.')

      expect(authStore.isAuthenticated).toBe(false)
    })
  })

  describe('Session Management', () => {
    it('logs out user', async () => {
      // Set up authenticated state by logging in first
      mockFetch.mockResolvedValueOnce({ token: 'fake-token' })
      await authStore.login('testuser', 'password')
      
      expect(authStore.isAuthenticated).toBe(true)

      authStore.logout()

      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user_data')
    })

    it('initializes auth from localStorage', () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' }
      
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'auth_token') return 'stored-token'
        if (key === 'user_data') return JSON.stringify(mockUser)
        return null
      })

      authStore.initializeAuth()

      expect(authStore.user).toEqual(mockUser)
      expect(authStore.token).toBe('stored-token')
      expect(authStore.isAuthenticated).toBe(true)
    })

    it('handles corrupted localStorage data gracefully', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'auth_token') return 'stored-token'
        if (key === 'user_data') return 'invalid-json'
        return null
      })

      // Should not throw error
      authStore.initializeAuth()

      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user_data')
    })

    it('checks if user is authenticated', async () => {
      expect(authStore.isAuthenticated).toBe(false)

      // Login to set authenticated state
      mockFetch.mockResolvedValueOnce({ token: 'fake-token' })
      await authStore.login('testuser', 'password')

      expect(authStore.isAuthenticated).toBe(true)
    })
  })

  describe('Loading States', () => {
    it('sets loading state during login', async () => {
      let resolvePromise: (value: any) => void
      const pendingPromise = new Promise(resolve => {
        resolvePromise = resolve
      })

      mockFetch.mockReturnValueOnce(pendingPromise)

      const loginPromise = authStore.login('testuser', 'password')
      
      expect(authStore.loading).toBe(true)

      resolvePromise!({ token: 'fake-token' })

      await loginPromise

      expect(authStore.loading).toBe(false)
    })

    it('resets loading state on login error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      try {
        await authStore.login('testuser', 'password')
      } catch (error) {
        // Expected to fail
      }

      expect(authStore.loading).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('clears previous errors on new login attempt', async () => {
      // First failed login
      mockFetch.mockRejectedValueOnce(new Error('Invalid credentials'))

      try {
        await authStore.login('wrong', 'wrong')
      } catch (error) {
        // Expected to fail
      }

      // Second successful login should not throw
      mockFetch.mockResolvedValueOnce({ token: 'token' })

      await expect(authStore.login('correct', 'correct')).resolves.not.toThrow()
    })

    it('provides consistent error messages', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Server error'))

      await expect(authStore.login('testuser', 'password')).rejects.toThrow('Invalid username or password')
    })
  })
})
