<template>
  <Teleport to="body">
    <div
      v-if="notifications.length > 0"
      class="fixed top-4 right-4 z-50 space-y-3"
    >
      <TransitionGroup name="notification" tag="div" class="space-y-3">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'max-w-sm p-4 rounded-lg shadow-lg backdrop-blur-sm border',
            notificationClasses[notification.type || 'info']
          ]"
          class="flex items-start space-x-3"
        >
          <div class="flex-shrink-0">
            <Icon
              :name="notificationIcons[notification.type || 'info']"
              class="w-5 h-5"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p v-if="notification.title" class="text-sm font-medium">
              {{ notification.title }}
            </p>
            <p class="text-sm opacity-90">
              {{ notification.message }}
            </p>
          </div>
          <button
            @click="removeNotification(notification.id)"
            class="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
const { notifications, removeNotification } = useNotifications()

const notificationClasses = {
  success:
    'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  error:
    'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  warning:
    'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
}

const notificationIcons = {
  success: 'heroicons:check-circle',
  error: 'heroicons:x-circle',
  warning: 'heroicons:exclamation-triangle',
  info: 'heroicons:information-circle'
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
