import { defineStore } from 'pinia'

interface User {
  id: number
  username: string
  email: string
  name: {
    firstname: string
    lastname: string
  }
  phone: string
  address: {
    city: string
    street: string
    number: number
    zipcode: string
  }
}

interface LoginResponse {
  token: string
}

interface RegisterData {
  email: string
  username: string
  password: string
  name: {
    firstname: string
    lastname: string
  }
  address: {
    city: string
    street: string
    number: number
    zipcode: string
    geolocation: {
      lat: string
      long: string
    }
  }
  phone: string
}

interface RegisterResponse {
  id: number
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (username: string, password: string) => {
    loading.value = true

    try {
      const response = await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: {
          username,
          password
        }
      })

      if (response.token) {
        token.value = response.token

        await fetchUserProfile()

        if (import.meta.client) {
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('user_data', JSON.stringify(user.value))
        }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw new Error('Invalid username or password')
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: RegisterData) => {
    loading.value = true

    try {
      const response = await $fetch<RegisterResponse>('/api/auth/register', {
        method: 'POST',
        body: userData
      })

      if (response.id) {
        return response
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw new Error('Registration failed. Please try again.')
    } finally {
      loading.value = false
    }
  }

  const fetchUserProfile = async () => {
    if (!token.value) {
      return
    }

    try {
      user.value = {
        id: 1,
        username: 'johnd',
        email: 'john@gmail.com',
        name: {
          firstname: 'John',
          lastname: 'Doe'
        },
        phone: '1-570-236-7033',
        address: {
          city: 'kilcoole',
          street: '7835 new road',
          number: 3,
          zipcode: '12926-3874'
        }
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }

  const logout = () => {
    user.value = null
    token.value = null

    if (import.meta.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }

    navigateTo('/login')
  }

  const initializeAuth = () => {
    if (import.meta.client) {
      try {
        const savedToken = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('user_data')

        if (savedToken && savedUser) {
          try {
            user.value = JSON.parse(savedUser)
            token.value = savedToken
          } catch (error) {
            console.error('Error parsing saved user data:', error)
            // Clear corrupted data and reset state
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_data')
            user.value = null
            token.value = null
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      }
    }
  }

  const setToken = (newToken: string | null) => {
    token.value = newToken

    if (import.meta.client) {
      if (newToken) {
        localStorage.setItem('auth_token', newToken)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),

    isAuthenticated,

    login,
    register,
    logout,
    initializeAuth,
    setToken
  }
})
