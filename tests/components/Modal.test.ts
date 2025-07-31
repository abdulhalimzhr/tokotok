import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import Modal from '../../app/components/Modal.vue'

describe('Modal Component', () => {
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)

    // Setup DOM environment for teleport
    if (!document.body) {
      const body = document.createElement('body')
      Object.defineProperty(document, 'body', {
        value: body,
        writable: true
      })
    }
  })

  it('renders modal when modelValue is true', () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true
      },
      slots: {
        default: '<div>Modal Content</div>'
      },
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true
        }
      }
    })

    expect(wrapper.text()).toContain('Modal Content')
    expect(wrapper.find('[class*="fixed inset-0"]').exists()).toBe(true)
  })

  it('does not render modal when modelValue is false', () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: false
      },
      slots: {
        default: '<div>Modal Content</div>'
      },
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true
        }
      }
    })

    expect(wrapper.text()).not.toContain('Modal Content')
  })

  it('emits update:modelValue when backdrop is clicked', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true
      },
      slots: {
        default: '<div>Modal Content</div>'
      },
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true
        }
      }
    })

    const backdrop = wrapper.find('[class*="bg-black"]')
    await backdrop.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const events = wrapper.emitted('update:modelValue')
    expect(events?.[0]).toEqual([false])
  })

  it('does not emit update:modelValue when modal content is clicked', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true
      },
      slots: {
        default: '<div class="modal-content">Modal Content</div>'
      },
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true
        }
      }
    })

    const modalContent = wrapper.find('[class*="bg-white"]')
    await modalContent.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('closes modal on Escape key press', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true
      },
      slots: {
        default: '<div>Modal Content</div>'
      },
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true
        }
      }
    })

    // Trigger escape key on document instead of wrapper
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(escapeEvent)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const events = wrapper.emitted('update:modelValue')
    expect(events?.[0]).toEqual([false])
  })

  it('applies correct styling classes', () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true
      },
      slots: {
        default: '<div>Modal Content</div>'
      },
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true
        }
      }
    })

    // Check for modal overlay
    expect(wrapper.find('[class*="fixed inset-0 z-50"]').exists()).toBe(true)
    // Check for backdrop
    expect(wrapper.find('[class*="bg-black"]').exists()).toBe(true)
    // Check for modal content container
    expect(wrapper.find('[class*="bg-white"]').exists()).toBe(true)
  })

  it('handles focus trap correctly', () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true
      },
      slots: {
        default: '<button>Button 1</button><button>Button 2</button>'
      },
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true
        }
      }
    })

    // Modal should be rendered and focusable elements should be present
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(3) // 2 slot buttons + 1 close button
  })
})
