import { toast } from 'vue3-toastify'

export const useAuthGuard = (redirectPath: string, message: string) => {
  const authStore = useAuthStore()

  // Initialize auth on client side
  if (process.client) {
    authStore.initializeAuth()
  }

  // Check if authenticated
  if (!authStore.isAuthenticated) {
    // Only show toast on client side to avoid SSR issues
    if (process.client) {
      toast.error(message)
    }

    // Navigate to login with redirect
    return navigateTo(`/login?redirect=${encodeURIComponent(redirectPath)}`)
  }

  return null
}
