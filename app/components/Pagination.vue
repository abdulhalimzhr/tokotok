<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-center space-x-2 mt-8"
  >
    <!-- Previous button -->
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage <= 1"
      class="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      <Icon name="heroicons:chevron-left" class="w-4 h-4 mr-1" />
      Previous
    </button>

    <!-- Page numbers -->
    <div class="flex space-x-1">
      <!-- First page -->
      <button
        v-if="showFirstPage"
        @click="goToPage(1)"
        :class="pageButtonClass(1)"
      >
        1
      </button>

      <!-- Ellipsis before current range -->
      <span
        v-if="showStartEllipsis"
        class="px-3 py-2 text-gray-500 dark:text-gray-400"
      >
        ...
      </span>

      <!-- Current page range -->
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="pageButtonClass(page)"
      >
        {{ page }}
      </button>

      <!-- Ellipsis after current range -->
      <span
        v-if="showEndEllipsis"
        class="px-3 py-2 text-gray-500 dark:text-gray-400"
      >
        ...
      </span>

      <!-- Last page -->
      <button
        v-if="showLastPage"
        @click="goToPage(totalPages)"
        :class="pageButtonClass(totalPages)"
      >
        {{ totalPages }}
      </button>
    </div>

    <!-- Next button -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage >= totalPages"
      class="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
    >
      Next
      <Icon name="heroicons:chevron-right" class="w-4 h-4 ml-1" />
    </button>
  </div>

  <!-- Page info -->
  <div
    v-if="totalPages > 1"
    class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4"
  >
    Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} products
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

const emit = defineEmits(['page-change'])

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
</script>
