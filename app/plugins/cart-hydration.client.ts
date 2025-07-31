export default defineNuxtPlugin(() => {
  // Only run on client side
  if (typeof window !== 'undefined') {
    const cartStore = useCartStore()
    cartStore.initializeCart()
  }
})
