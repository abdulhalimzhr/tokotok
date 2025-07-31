import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

describe('useNotifications', () => {
  beforeEach(() => {
    // Clear notifications before each test
    const { clearNotifications } = useNotifications()
    clearNotifications()
  })

  it('should start with empty notifications', () => {
    const { notifications } = useNotifications()
    expect(notifications.value).toHaveLength(0)
  })

  it('should add notification with default type', () => {
    const { addNotification, notifications } = useNotifications()

    addNotification('Test message')

    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0]).toMatchObject({
      message: 'Test message',
      type: 'info',
      duration: 5000
    })
    expect(notifications.value[0].id).toBeDefined()
  })

  it('should add notification with custom options', () => {
    const { addNotification, notifications } = useNotifications()

    addNotification('Error message', {
      type: 'error',
      title: 'Error Title',
      duration: 8000
    })

    expect(notifications.value).toHaveLength(1)
    expect(notifications.value[0]).toMatchObject({
      message: 'Error message',
      type: 'error',
      title: 'Error Title',
      duration: 8000
    })
  })

  it('should remove notification by id', () => {
    const { addNotification, removeNotification, notifications } =
      useNotifications()

    addNotification('Test message')
    const notificationId = notifications.value[0].id

    expect(notifications.value).toHaveLength(1)

    removeNotification(notificationId)
    expect(notifications.value).toHaveLength(0)
  })

  it('should provide convenience methods for different types', () => {
    const { notify, notifications } = useNotifications()

    notify.success('Success message')
    notify.error('Error message')
    notify.warning('Warning message')
    notify.info('Info message')

    expect(notifications.value).toHaveLength(4)
    expect(notifications.value[0].type).toBe('success')
    expect(notifications.value[1].type).toBe('error')
    expect(notifications.value[2].type).toBe('warning')
    expect(notifications.value[3].type).toBe('info')
  })

  it('should apply correct durations for different types', () => {
    const { notify, notifications } = useNotifications()

    notify.success('Success')
    notify.error('Error')
    notify.warning('Warning')
    notify.info('Info')

    expect(notifications.value[0].duration).toBe(5000) // success
    expect(notifications.value[1].duration).toBe(8000) // error
    expect(notifications.value[2].duration).toBe(6000) // warning
    expect(notifications.value[3].duration).toBe(5000) // info
  })

  it('should clear all notifications', () => {
    const { addNotification, clearNotifications, notifications } =
      useNotifications()

    addNotification('Message 1')
    addNotification('Message 2')
    addNotification('Message 3')

    expect(notifications.value).toHaveLength(3)

    clearNotifications()
    expect(notifications.value).toHaveLength(0)
  })

  it('should generate unique ids for notifications', () => {
    const { addNotification, notifications } = useNotifications()

    addNotification('Message 1')
    addNotification('Message 2')

    const ids = notifications.value.map(n => n.id)
    expect(ids[0]).not.toBe(ids[1])
    expect(typeof ids[0]).toBe('number')
    expect(typeof ids[1]).toBe('number')
  })
})
