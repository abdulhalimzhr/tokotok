import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import './mocks/api'

// Global test setup for Vue Test Utils
config.global.stubs = {
  NuxtLink: {
    template: '<a><slot /></a>'
  },
  Icon: {
    template: '<span class="icon"></span>'
  },
  Teleport: {
    template: '<div><slot /></div>'
  }
}

// Mock Nuxt composables and functions
global.navigateTo = vi.fn()
global.useSeoMeta = vi.fn()
global.definePageMeta = vi.fn()
global.useRoute = vi.fn(() => ({
  params: {},
  query: {},
  path: '/',
  fullPath: '/'
}))
global.useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn()
}))

// Mock browser APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
})

// Mock document operations
Object.defineProperty(document, 'documentElement', {
  value: {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn()
    }
  }
})
