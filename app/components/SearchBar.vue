<template>
  <div class="relative w-full max-w-md">
    <div class="relative">
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <svg
          v-if="!isSearching"
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
        <!-- Loading spinner -->
        <svg
          v-else
          class="h-5 w-5 text-gray-400 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search products..."
        class="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-200"
        @keyup.enter="handleSearch"
        @input="debounceSearch"
        @focus="showSuggestions = true"
        @keydown.arrow-down="navigateSuggestions(1)"
        @keydown.arrow-up="navigateSuggestions(-1)"
        @keydown.escape="showSuggestions = false"
      />
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          v-if="searchQuery"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          @click="clearSearch"
          title="Clear search"
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

    <!-- Enhanced search suggestions -->
    <div
      v-if="
        showSuggestions &&
        searchQuery &&
        (suggestions.length > 0 || recentSearches.length > 0)
      "
      class="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-auto"
    >
      <div class="py-2">
        <!-- Recent searches -->
        <div v-if="recentSearches.length > 0 && !searchQuery" class="mb-2">
          <div
            class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
          >
            Recent Searches
          </div>
          <button
            v-for="(search, index) in recentSearches"
            :key="`recent-${index}`"
            @click="selectRecentSearch(search)"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 flex items-center space-x-2"
          >
            <svg
              class="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ search }}</span>
          </button>
        </div>

        <!-- Product suggestions -->
        <div v-if="suggestions.length > 0">
          <div
            v-if="recentSearches.length > 0 && !searchQuery"
            class="border-t border-gray-200 dark:border-gray-700 pt-2"
          >
            <div
              class="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide"
            >
              Products
            </div>
          </div>
          <NuxtLink
            v-for="(suggestion, index) in suggestions"
            :key="suggestion.id"
            :to="`/product/${suggestion.id}`"
            @click="showSuggestions = false"
            :class="[
              'suggestion-item w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 flex items-center space-x-3 transition-colors',
              index === selectedSuggestionIndex
                ? 'bg-gray-100 dark:bg-gray-700'
                : ''
            ]"
          >
            <img
              :src="suggestion.image"
              :alt="suggestion.title"
              class="w-10 h-10 object-cover rounded flex-shrink-0"
              @error="$event.target.src = 'https://via.placeholder.com/40'"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span
                  class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                  v-html="highlightMatch(suggestion.title, searchQuery)"
                ></span>
                <span
                  class="text-xs font-semibold text-green-600 dark:text-green-400 ml-2"
                >
                  ${{ suggestion.price.toFixed(2) }}
                </span>
              </div>
              <p
                class="text-xs text-gray-500 dark:text-gray-400 capitalize truncate"
              >
                {{ suggestion.category }}
              </p>
            </div>
            <div class="flex-shrink-0 flex items-center">
              <button
                @click.stop="selectSuggestion(suggestion)"
                class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Use as search term"
              >
                <svg
                  class="w-4 h-4"
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
              </button>
            </div>
          </NuxtLink>
        </div>

        <!-- No results -->
        <div
          v-if="searchQuery && suggestions.length === 0"
          class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center"
        >
          <svg
            class="w-6 h-6 mx-auto mb-2 text-gray-300"
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
          No products found for "{{ searchQuery }}"
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const productsStore = useProductsStore()

const searchQuery = ref('')
const showSuggestions = ref(false)
const debounceTimer = ref(null)
const isSearching = ref(false)
const selectedSuggestionIndex = ref(-1)
const recentSearches = ref([])

// Load recent searches from localStorage
if (import.meta.client) {
  const stored = localStorage.getItem('recent-searches')
  if (stored) {
    try {
      recentSearches.value = JSON.parse(stored).slice(0, 5)
    } catch (e) {
      console.error('Error parsing recent searches:', e)
    }
  }
}

const suggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    return []
  }

  const query = searchQuery.value.toLowerCase()
  return productsStore.products
    .filter(
      product =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    )
    .slice(0, 6)
})

const saveRecentSearch = query => {
  if (!query || query.length < 2) {
    return
  }

  const searches = [...recentSearches.value]
  const index = searches.indexOf(query)

  if (index > -1) {
    searches.splice(index, 1)
  }

  searches.unshift(query)
  recentSearches.value = searches.slice(0, 5)

  if (import.meta.client) {
    localStorage.setItem(
      'recent-searches',
      JSON.stringify(recentSearches.value)
    )
  }
}

const highlightMatch = (text, query) => {
  if (!query) {
    return text
  }

  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
  )
}

const navigateSuggestions = direction => {
  if (suggestions.value.length === 0) {
    return
  }

  selectedSuggestionIndex.value += direction

  if (selectedSuggestionIndex.value < 0) {
    selectedSuggestionIndex.value = suggestions.value.length - 1
  } else if (selectedSuggestionIndex.value >= suggestions.value.length) {
    selectedSuggestionIndex.value = 0
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim()
    saveRecentSearch(query)
    productsStore.updateSearch(query)
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
  }
}

const debounceSearch = () => {
  isSearching.value = true
  selectedSuggestionIndex.value = -1

  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  debounceTimer.value = setTimeout(() => {
    isSearching.value = false

    if (searchQuery.value.trim()) {
      productsStore.updateSearch(searchQuery.value.trim())
      showSuggestions.value = true
    } else {
      productsStore.updateSearch('')
      showSuggestions.value = false
    }
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  productsStore.updateSearch('')
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
}

const selectSuggestion = product => {
  const query = product.title
  searchQuery.value = query
  saveRecentSearch(query)
  productsStore.updateSearch(query)
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
}

const navigateToProduct = product => {
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
  navigateTo(`/product/${product.id}`)
}

const selectRecentSearch = search => {
  searchQuery.value = search
  productsStore.updateSearch(search)
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
}

const handleClickOutside = event => {
  if (!event.target.closest('.relative')) {
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  searchQuery.value = productsStore.searchState.query
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})

watch(
  () => productsStore.searchState.query,
  newQuery => {
    if (newQuery !== searchQuery.value) {
      searchQuery.value = newQuery
    }
  }
)
</script>
