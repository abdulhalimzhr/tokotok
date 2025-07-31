<template>
  <header
    class="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700"
  >
    <div class="max-w-7xl mx-auto px-4">
      <div
        class="flex flex-col sm:flex-row sm:items-center py-3 gap-3 sm:gap-6"
      >
        <NuxtLink
          to="/"
          class="hidden sm:flex items-center space-x-2 mb-2 sm:mb-0"
        >
          <Icon name="heroicons:wallet" class="w-8 h-8 text-green-500" />
          <h1 class="text-2xl font-bold text-green-500">TokoTok</h1>
        </NuxtLink>
        <div
          class="w-full flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-4"
        >
          <div class="w-full sm:flex-1 max-w-2xl mb-2 sm:mb-0">
            <SearchBar />
          </div>
          <div
            class="flex items-center space-x-2 sm:space-x-4 justify-between sm:justify-end"
          >
            <NuxtLink
              to="/"
              class="flex items-center space-x-2 mb-2 sm:mb-0 sm:hidden"
            >
              <Icon name="heroicons:wallet" class="w-8 h-8 text-green-500" />
              <h1 class="text-2xl font-bold text-green-500">TokoTok</h1>
            </NuxtLink>
            <div class="flex items-center space-x-2">
              <div class="relative">
                <ShoppingCart />
              </div>
              <div class="relative user-menu">
                <button
                  class="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2.5 rounded-lg transition-all duration-200"
                  @click="toggleUserMenu"
                >
                  <template v-if="authStore.isAuthenticated">
                    <span
                      class="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      {{ authStore.user?.name?.firstname || 'User' }}
                    </span>
                  </template>
                  <template v-else>
                    <div
                      class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <Icon name="heroicons:user" class="w-4 h-4 text-white" />
                    </div>
                  </template>
                  <Icon
                    name="heroicons:chevron-down"
                    class="w-3 h-3 text-gray-500 dark:text-gray-300"
                  />
                </button>
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-100"
                >
                  <div class="py-1">
                    <template v-if="authStore.isAuthenticated">
                      <div
                        class="mx-4 my-2 px-2 py-2 text-xs text-gray-700 dark:text-gray-200 flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-md"
                      >
                        <span>Wallet Balance</span>
                        <span
                          class="font-semibold text-green-600 dark:text-green-400"
                        >
                          ${{ walletStore.balance.toFixed(2) }}
                        </span>
                      </div>
                      <NuxtLink
                        to="/wallet"
                        class="block px-4 py-2 mb-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        @click="closeUserMenu"
                      >
                        <Icon
                          name="heroicons:wallet"
                          class="w-4 h-4 inline mr-2"
                        />
                        My Wallet
                      </NuxtLink>
                      <div
                        class="border-t border-gray-100 dark:border-gray-700"
                      />
                      <button
                        class="block w-full text-left px-4 py-2 mt-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        @click="handleLogout"
                      >
                        <Icon
                          name="heroicons:arrow-right-on-rectangle"
                          class="w-4 h-4 inline mr-2"
                        />
                        Sign Out
                      </button>
                    </template>
                    <template v-else>
                      <NuxtLink
                        to="/login"
                        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        @click="closeUserMenu"
                      >
                        Sign In
                      </NuxtLink>
                      <NuxtLink
                        to="/register"
                        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        @click="closeUserMenu"
                      >
                        Register
                      </NuxtLink>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useWalletStore } from '~/stores/wallet'
import { useAuthStore } from '~/stores/auth'
import { useDropdownState } from '~/composables/useDropdownState'

const walletStore = useWalletStore()
const authStore = useAuthStore()
const {
  isUserMenuOpen,
  toggleUserMenu: toggleUserMenuState,
  closeUserMenu
} = useDropdownState()

const showWallet = ref(false)
const showUserMenu = computed(() => isUserMenuOpen.value)
const topUpAmount = ref(0)

const toggleUserMenu = () => {
  toggleUserMenuState()
  if (showWallet.value) showWallet.value = false
}

const addFunds = async () => {
  if (topUpAmount.value > 0) {
    try {
      const transaction = await walletStore.topUp(topUpAmount.value)
      topUpAmount.value = 0
      showWallet.value = false

      const { toast } = await import('vue3-toastify')
      toast.success(
        `Successfully added $${transaction.amount.toFixed(2)} to your wallet!`
      )
    } catch (error) {
      console.error('Failed to add funds:', error)
      const { toast } = await import('vue3-toastify')
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to add funds to wallet'
      toast.error(`Failed to top up wallet: ${errorMessage}`)
    }
  }
}

const handleLogout = async () => {
  await authStore.logout()
  closeUserMenu()

  const { toast } = await import('vue3-toastify')
  toast.success('Logged out successfully. See you next time!')

  await navigateTo('/')
}

const handleClickOutside = (event: Event) => {
  if (
    showWallet.value &&
    !(event.target as Element).closest('.wallet-dropdown')
  ) {
    showWallet.value = false
  }
  if (showUserMenu.value && !(event.target as Element).closest('.user-menu')) {
    closeUserMenu()
  }
}

onMounted(() => {
  authStore.initializeAuth()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
