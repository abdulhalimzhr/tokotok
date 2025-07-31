import { describe, it, expect, beforeEach } from 'vitest'
import { useDropdownState } from '~/composables/useDropdownState'

describe('useDropdownState', () => {
  beforeEach(() => {
    // Reset the global state before each test
    const { closeAllDropdowns } = useDropdownState()
    closeAllDropdowns()
  })

  it('should initialize with all dropdowns closed', () => {
    const { isShoppingCartOpen, isUserMenuOpen, isAdvancedFiltersOpen } =
      useDropdownState()

    expect(isShoppingCartOpen.value).toBe(false)
    expect(isUserMenuOpen.value).toBe(false)
    expect(isAdvancedFiltersOpen.value).toBe(false)
  })

  it('should toggle shopping cart correctly', () => {
    const { toggleShoppingCart, isShoppingCartOpen } = useDropdownState()

    expect(isShoppingCartOpen.value).toBe(false)
    toggleShoppingCart()
    expect(isShoppingCartOpen.value).toBe(true)
    toggleShoppingCart()
    expect(isShoppingCartOpen.value).toBe(false)
  })

  it('should close other dropdowns when opening shopping cart', () => {
    const {
      toggleShoppingCart,
      toggleUserMenu,
      isShoppingCartOpen,
      isUserMenuOpen
    } = useDropdownState()

    // Open user menu first
    toggleUserMenu()
    expect(isUserMenuOpen.value).toBe(true)

    // Open shopping cart - should close user menu
    toggleShoppingCart()
    expect(isShoppingCartOpen.value).toBe(true)
    expect(isUserMenuOpen.value).toBe(false)
  })

  it('should close all dropdowns when closeAllDropdowns is called', () => {
    const {
      toggleShoppingCart,
      toggleUserMenu,
      toggleAdvancedFilters,
      closeAllDropdowns,
      isShoppingCartOpen,
      isUserMenuOpen,
      isAdvancedFiltersOpen
    } = useDropdownState()

    // Open all dropdowns (one at a time since they're mutually exclusive)
    toggleShoppingCart()
    toggleUserMenu() // This should close shopping cart and open user menu
    toggleAdvancedFilters() // This should close user menu and open advanced filters

    expect(isAdvancedFiltersOpen.value).toBe(true)

    closeAllDropdowns()
    expect(isShoppingCartOpen.value).toBe(false)
    expect(isUserMenuOpen.value).toBe(false)
    expect(isAdvancedFiltersOpen.value).toBe(false)
  })

  it('should provide individual close functions', () => {
    const { toggleShoppingCart, closeShoppingCart, isShoppingCartOpen } =
      useDropdownState()

    toggleShoppingCart()
    expect(isShoppingCartOpen.value).toBe(true)

    closeShoppingCart()
    expect(isShoppingCartOpen.value).toBe(false)
  })

  it('should maintain shared state across multiple instances', () => {
    const instance1 = useDropdownState()
    const instance2 = useDropdownState()

    instance1.toggleShoppingCart()
    expect(instance2.isShoppingCartOpen.value).toBe(true)

    instance2.closeShoppingCart()
    expect(instance1.isShoppingCartOpen.value).toBe(false)
  })
})
