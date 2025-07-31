<template>
  <div class="flex items-center justify-between mt-20 px-2">
    <!-- Per-page selection -->
    <div class="flex items-center gap-2">
      <label
        for="itemsPerPage"
        class="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block"
      >
        Show:
      </label>
      <select
        id="itemsPerPage"
        :value="itemsPerPage"
        @change="updateItemsPerPage($event.target.value)"
        class="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <span class="text-sm text-gray-700 dark:text-gray-300 hidden md:block"
        >per page</span
      >
    </div>

    <!-- Pagination controls -->
    <div class="flex items-center justify-center space-x-2">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        <Icon name="heroicons:chevron-left" class="w-4 h-4 mr-1" />
        Previous
      </button>

      <div class="flex space-x-1">
        <button
          v-if="showFirstPage"
          @click="goToPage(1)"
          :class="pageButtonClass(1)"
        >
          1
        </button>

        <span
          v-if="showStartEllipsis"
          class="px-3 py-2 text-gray-500 dark:text-gray-400"
        >
          ...
        </span>

        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="pageButtonClass(page)"
        >
          {{ page }}
        </button>

        <span
          v-if="showEndEllipsis"
          class="px-3 py-2 text-gray-500 dark:text-gray-400"
        >
          ...
        </span>

        <button
          v-if="showLastPage"
          @click="goToPage(totalPages)"
          :class="pageButtonClass(totalPages)"
        >
          {{ totalPages }}
        </button>
      </div>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      >
        Next
        <Icon name="heroicons:chevron-right" class="w-4 h-4 ml-1" />
      </button>
    </div>

    <!-- Item count display -->
    <div
      class="text-center text-sm text-gray-500 dark:text-gray-400 hidden md:block"
    >
      Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} products
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 20
  }
})

const emit = defineEmits(['page-change', 'items-per-page-change'])

const totalPages = computed(() =>
  Math.ceil(props.totalItems / props.itemsPerPage)
)

const startItem = computed(
  () => (props.currentPage - 1) * props.itemsPerPage + 1
)
const endItem = computed(() =>
  Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
)

// Calculate visible page numbers
const visiblePages = computed(() => {
  const delta = 2 // Number of pages to show on each side of current page
  const start = Math.max(1, props.currentPage - delta)
  const end = Math.min(totalPages.value, props.currentPage + delta)

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const showFirstPage = computed(() => visiblePages.value[0] > 1)
const showLastPage = computed(
  () => visiblePages.value[visiblePages.value.length - 1] < totalPages.value
)
const showStartEllipsis = computed(() => visiblePages.value[0] > 2)
const showEndEllipsis = computed(
  () => visiblePages.value[visiblePages.value.length - 1] < totalPages.value - 1
)

const pageButtonClass = page => {
  const isActive = page === props.currentPage
  return [
    'px-3 py-2 text-sm font-medium border transition-colors',
    isActive
      ? 'text-green-600 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-600 dark:bg-green-900/20'
      : 'text-gray-500 border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
  ]
}

const goToPage = page => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const updateItemsPerPage = value => {
  emit('page-change', 1)
  emit('items-per-page-change', parseInt(value, 10))
}
</script>
