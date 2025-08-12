<template>
  <div class="min-h-screen flex flex-col justify-center px-4 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex items-center justify-center space-x-2 mb-6">
        <Icon name="heroicons:wallet" class="w-8 h-8 text-green-500" />
        <h1 class="text-3xl font-bold text-green-500">TokoTok</h1>
      </div>
      <h2
        class="text-center text-2xl font-bold text-gray-900 dark:text-gray-100"
      >
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
        Or
        <NuxtLink
          to="/register"
          class="font-medium text-green-600 hover:text-green-500"
        >
          create a new account
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 p-8 shadow rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin" method="POST">
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Username
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="form.username"
                name="username"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded focus:ring-offset-2"
              />
              <label
                for="remember-me"
                class="ml-2 block text-sm text-gray-900 dark:text-gray-200"
              >
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span
                v-if="loading"
                class="absolute left-0 inset-y-0 flex items-center pl-3"
              >
                <i class="fas fa-spinner fa-spin" />
              </span>
              {{ loading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <div
          v-if="error"
          class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
        >
          <div class="flex">
            <i class="fas fa-exclamation-triangle text-red-400 mr-2" />
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </div>

        <div class="mt-6 p-4 bg-green-50 border border-blue-200 rounded-md">
          <h3 class="text-sm font-medium text-blue-800 mb-2">
            Demo Credentials:
          </h3>
          <div class="text-xs text-blue-700 space-y-1">
            <p>
              <strong>Username:</strong>
              mor_2314
            </p>
            <p>
              <strong>Password:</strong>
              83r5^_
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Login - TokoTok',
  description: 'Sign in to your TokoTok account'
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = ref({
  username: '',
  password: '',
  rememberMe: false
})

const loading = ref(false)
const error = ref('')

import { toast } from 'vue3-toastify'

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(form.value.username, form.value.password)

    toast.success('Login successful! Welcome back!')

    await new Promise(resolve => setTimeout(resolve, 500))

    // Redirect to the intended page or home
    const redirectTo = route.query.redirect || '/'
    await router.push(redirectTo)
  } catch (err) {
    error.value = err.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    const redirectTo = route.query.redirect || '/'
    router.push(redirectTo)
  }
})
</script>
