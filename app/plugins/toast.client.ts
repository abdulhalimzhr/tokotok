import { defineNuxtPlugin } from '#app'
import Toast, { type ToastContainerOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Toast, {
    autoClose: 3000,
    position: 'bottom-left',
    theme: 'auto'
  } as ToastContainerOptions)
})
