<template>
  <div
    class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex items-center justify-center space-x-2 mb-6">
        <Icon
          name="heroicons:wallet"
          class="w-8 h-8 text-green-500"
        />
        <h1 class="text-3xl font-bold text-green-500">TokoTok</h1>
      </div>
      <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
        Or
        <NuxtLink
          to="/login"
          class="font-medium text-green-600 hover:text-green-500"
        >
          sign in to your existing account
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white p-8 shadow rounded-lg sm:px-10 dark:bg-gray-800">
        <form
          class="space-y-6"
          @submit.prevent="handleRegister"
        >
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

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
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                for="firstName"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                First name
              </label>
              <div class="mt-1">
                <input
                  id="firstName"
                  v-model="form.firstName"
                  name="firstName"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="First name"
                />
              </div>
            </div>

            <div>
              <label
                for="lastName"
                class="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Last name
              </label>
              <div class="mt-1">
                <input
                  id="lastName"
                  v-model="form.lastName"
                  name="lastName"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Last name"
                />
              </div>
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
                placeholder="Create a password"
              />
            </div>
          </div>

          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Phone number
            </label>
            <div class="mt-1">
              <input
                id="phone"
                v-model="form.phone"
                name="phone"
                type="tel"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              v-model="form.acceptTerms"
              name="terms"
              type="checkbox"
              required
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              for="terms"
              class="ml-2 block text-sm text-gray-900 dark:text-gray-200"
            >
              I agree to the
              <a
                href="#"
                class="text-green-600 hover:text-green-500"
              >
                Terms and Conditions
              </a>
            </label>
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
              {{ loading ? 'Creating account...' : 'Create account' }}
            </button>
          </div>
        </form>

        <div
          v-if="error"
          class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
        >
          <div class="flex">
            <i
              class="fas fa-exclamation-triangle text-red-400 mr-2"
            />
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </div>

        <div
          v-if="success"
          class="mt-4 p-3 bg-green-50 border border-green-200 rounded-md"
        >
          <div class="flex">
            <i class="fas fa-check-circle text-green-400 mr-2" />
            <p class="text-sm text-green-800">{{ success }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'auth'
  });

  useSeoMeta({
    title: 'Register - TokoTok',
    description: 'Create your TokoTok account'
  });

  const authStore = useAuthStore();
  const router = useRouter();

  const form = ref({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    phone: '',
    acceptTerms: false
  });

  const loading = ref(false);
  const error = ref('');
  const success = ref('');

import { toast } from 'vue3-toastify';

  const handleRegister = async () => {
    loading.value = true;
    error.value = '';
    success.value = '';

    try {
      await authStore.register({
        email: form.value.email,
        username: form.value.username,
        password: form.value.password,
        name: {
          firstname: form.value.firstName,
          lastname: form.value.lastName
        },
        address: {
          city: 'kilcoole',
          street: '7835 new road',
          number: 3,
          zipcode: '12926-3874',
          geolocation: {
            lat: '-37.3159',
            long: '81.1496'
          }
        },
        phone: form.value.phone
      });

      toast.success('Account created successfully! Redirecting to login...');
      success.value = 'Account created successfully! Redirecting to login...';

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      error.value =
        err.message || 'Registration failed. Please try again.';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    if (authStore.isAuthenticated) {
      router.push('/');
    }
  });
</script>
