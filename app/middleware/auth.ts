export default defineNuxtRouteMiddleware(to => {
  // Only run on client side
  if (import.meta.server) return

  const authStore = useAuthStore()

  // Initialize auth state
  authStore.initializeAuth()

  // Check authentication
  if (!authStore.isAuthenticated) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.path)}`)
  }
})
