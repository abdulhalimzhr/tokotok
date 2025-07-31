<template>
  <header
    class="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700"
  >
    <div class="max-w-7xl mx-auto px-4">
      <div
        class="flex flex-col sm:flex-row sm:items-center py-3 gap-3 sm:gap-6"
      >
        <NuxtLink to="/" class="flex items-center space-x-2 mb-2 sm:mb-0">
          <Icon name="heroicons:wallet" class="w-8 h-8 text-green-500" />
          <h1 class="text-2xl font-bold text-green-500">TokoTok</h1>
        </NuxtLink>
        <div class="w-full flex items-center justify-end gap-4">
          <div class="w-full sm:flex-1 max-w-2xl mb-2 sm:mb-0">
            <SearchBar />
          </div>
          <div class="flex items-center space-x-2 sm:space-x-4 justify-end">
            <div class="relative">
              <ShoppingCart />
            </div>
            <div class="relative user-menu">
              <button
                class="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition"
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
                    class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
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
                      @click="toggleUserMenu"
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
                      @click="toggleUserMenu"
                    >
                      Sign In
                    </NuxtLink>
                    <NuxtLink
                      to="/register"
                      class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      @click="toggleUserMenu"
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
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useWalletStore } from '~/stores/wallet'
import { useAuthStore } from '~/stores/auth'

const cartStore = useCartStore()
const walletStore = useWalletStore()
const authStore = useAuthStore()

const showWallet = ref(false)
const showUserMenu = ref(false)
const topUpAmount = ref(0)

const toggleWallet = () => {
  showWallet.value = !showWallet.value
  if (showUserMenu.value) {
    showUserMenu.value = false
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  if (showWallet.value) showWallet.value = false
}

const addFunds = async () => {
  if (topUpAmount.value > 0) {
    try {
      await walletStore.topUp(topUpAmount.value)
      topUpAmount.value = 0
      showWallet.value = false
    } catch (error) {
      console.error('Failed to add funds:', error)
    }
  }
}

const handleLogout = async () => {
  await authStore.logout()
  showUserMenu.value = false

  const { toast } = await import('vue3-toastify')
  toast.success('Logged out successfully. See you next time!')

  await navigateTo('/')
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleClickOutside = (event: Event) => {
  if (
    showWallet.value &&
    !(event.target as Element).closest('.wallet-dropdown')
  ) {
    showWallet.value = false
  }
  if (showUserMenu.value && !(event.target as Element).closest('.user-menu')) {
    showUserMenu.value = false
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
