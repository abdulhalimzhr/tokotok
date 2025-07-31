interface NotificationOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  duration?: number
}

interface Notification extends NotificationOptions {
  id: number
  message: string
}

const notifications = ref<Notification[]>([])

export const useNotifications = () => {
  const addNotification = (
    message: string,
    options: NotificationOptions = {}
  ) => {
    const id = Date.now() + Math.random()
    const notification: Notification = {
      id,
      message,
      type: 'info',
      duration: 5000,
      ...options
    }

    notifications.value.push(notification)

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }

    return id
  }

  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const notify = {
    success: (message: string, title?: string, duration = 5000) =>
      addNotification(message, { type: 'success', title, duration }),
    error: (message: string, title?: string, duration = 8000) =>
      addNotification(message, { type: 'error', title, duration }),
    warning: (message: string, title?: string, duration = 6000) =>
      addNotification(message, { type: 'warning', title, duration }),
    info: (message: string, title?: string, duration = 5000) =>
      addNotification(message, { type: 'info', title, duration })
  }

  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    clearNotifications,
    notify
  }
}
