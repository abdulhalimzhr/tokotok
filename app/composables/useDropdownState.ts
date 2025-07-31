// Global state to ensure the same instance is shared across components
const globalDropdownState = {
  isShoppingCartOpen: ref(false),
  isUserMenuOpen: ref(false),
  isAdvancedFiltersOpen: ref(false)
}

export const useDropdownState = () => {
  const { isShoppingCartOpen, isUserMenuOpen, isAdvancedFiltersOpen } = globalDropdownState

  const closeAllDropdowns = () => {
    isShoppingCartOpen.value = false
    isUserMenuOpen.value = false
    isAdvancedFiltersOpen.value = false
  }

  const toggleShoppingCart = () => {
    if (isUserMenuOpen.value) {
      isUserMenuOpen.value = false
    }
    if (isAdvancedFiltersOpen.value) {
      isAdvancedFiltersOpen.value = false
    }
    isShoppingCartOpen.value = !isShoppingCartOpen.value
  }

  const toggleUserMenu = () => {
    if (isShoppingCartOpen.value) {
      isShoppingCartOpen.value = false
    }
    if (isAdvancedFiltersOpen.value) {
      isAdvancedFiltersOpen.value = false
    }
    isUserMenuOpen.value = !isUserMenuOpen.value
  }

  const toggleAdvancedFilters = () => {
    if (isShoppingCartOpen.value) {
      isShoppingCartOpen.value = false
    }
    if (isUserMenuOpen.value) {
      isUserMenuOpen.value = false
    }
    isAdvancedFiltersOpen.value = !isAdvancedFiltersOpen.value
  }

  const closeShoppingCart = () => {
    isShoppingCartOpen.value = false
  }

  const closeUserMenu = () => {
    isUserMenuOpen.value = false
  }

  const closeAdvancedFilters = () => {
    isAdvancedFiltersOpen.value = false
  }

  return {
    isShoppingCartOpen,
    isUserMenuOpen,
    isAdvancedFiltersOpen,
    closeAllDropdowns,
    toggleShoppingCart,
    toggleUserMenu,
    toggleAdvancedFilters,
    closeShoppingCart,
    closeUserMenu,
    closeAdvancedFilters
  }
}
