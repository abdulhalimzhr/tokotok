<template>
  <div class="relative w-full max-w-md">
    <div class="relative">
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <svg
          class="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products..."
        class="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        @keyup.enter="handleSearch"
        @input="debounceSearch"
      />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          v-if="searchQuery"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
          @click="clearSearch"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="showSuggestions && searchQuery && suggestions.length > 0"
      class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto"
    >
      <div class="py-1">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          @click="selectSuggestion(suggestion)"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 flex items-center space-x-3"
        >
          <img
            :src="suggestion.image"
            :alt="suggestion.title"
            class="w-8 h-8 object-cover rounded flex-shrink-0"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {{ suggestion.title }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {{ suggestion.category }} • ${{ suggestion.price }}
            </p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  const productsStore = useProductsStore();

  const searchQuery = ref('');
  const showSuggestions = ref(false);
  const debounceTimer = ref(null);

  const suggestions = computed(() => {
    if (!searchQuery.value || searchQuery.value.length < 2) {
      return [];
    }

    const query = searchQuery.value.toLowerCase();
    return productsStore.products
      .filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      )
      .slice(0, 5);
  });

  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      productsStore.updateSearch(searchQuery.value.trim());
      showSuggestions.value = false;
    }
  };

  const debounceSearch = () => {
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value);
    }

    debounceTimer.value = setTimeout(() => {
      if (searchQuery.value.trim()) {
        productsStore.updateSearch(searchQuery.value.trim());
        showSuggestions.value = true;
      } else {
        productsStore.updateSearch('');
        showSuggestions.value = false;
      }
    }, 300);
  };

  const clearSearch = () => {
    searchQuery.value = '';
    productsStore.updateSearch('');
    showSuggestions.value = false;
  };

  const selectSuggestion = (product) => {
    searchQuery.value = product.title;
    productsStore.updateSearch(product.title);
    showSuggestions.value = false;
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.relative')) {
      showSuggestions.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);

    searchQuery.value = productsStore.searchState.query;
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value);
    }
  });

  watch(
    () => productsStore.searchState.query,
    (newQuery) => {
      if (newQuery !== searchQuery.value) {
        searchQuery.value = newQuery;
      }
    }
  );
</script>
