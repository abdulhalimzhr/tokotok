import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import Pagination from '../../app/components/Pagination.vue'

describe('Pagination Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders pagination controls correctly', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalItems: 100,
        itemsPerPage: 20
      }
    })

    expect(wrapper.find('select').exists()).toBe(true) // Per-page selector
    expect(wrapper.text()).toContain('Show:')
    expect(wrapper.text()).toContain('per page')
    expect(wrapper.text()).toContain('Previous')
    expect(wrapper.text()).toContain('Next')
  })

  it('displays correct page numbers with ellipsis logic', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 5,
        totalItems: 200,
        itemsPerPage: 20 // 10 total pages
      }
    })

    // Should show first page, ellipsis, visible pages around current, ellipsis, last page
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('...')
    expect(wrapper.text()).toContain('3') // current - 2
    expect(wrapper.text()).toContain('4') // current - 1
    expect(wrapper.text()).toContain('5') // current
    expect(wrapper.text()).toContain('6') // current + 1
    expect(wrapper.text()).toContain('7') // current + 2
    expect(wrapper.text()).toContain('10') // last page
  })

  it('emits page-change event when page button clicked', async () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalItems: 100,
        itemsPerPage: 20
      }
    })

    // Find the page "2" button specifically
    const page2Button = wrapper.findAll('button').find(btn => btn.text() === '2')
    expect(page2Button).toBeDefined()
    
    await page2Button!.trigger('click')
    
    expect(wrapper.emitted('page-change')).toBeTruthy()
    const pageChangeEvents = wrapper.emitted('page-change')
    expect(pageChangeEvents?.[0]).toEqual([2])
  })

  it('emits items-per-page-change event when per-page selection changes', async () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalItems: 100,
        itemsPerPage: 20
      }
    })

    const select = wrapper.find('select')
    await select.setValue('50')

    expect(wrapper.emitted('items-per-page-change')).toBeTruthy()
    const itemsPerPageEvents = wrapper.emitted('items-per-page-change')
    expect(itemsPerPageEvents?.[0]).toEqual([50])
  })

  it('disables Previous button on first page', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalItems: 100,
        itemsPerPage: 20
      }
    })

    const prevButton = wrapper.find('button:first-child')
    expect(prevButton.attributes('disabled')).toBeDefined()
  })

  it('disables Next button on last page', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 5,
        totalItems: 100,
        itemsPerPage: 20 // 5 total pages
      }
    })

    // Find the "Next" button specifically
    const nextButton = wrapper.findAll('button').find(btn => btn.text().includes('Next'))
    expect(nextButton).toBeDefined()
    expect(nextButton!.attributes('disabled')).toBeDefined()
  })

  it('shows correct item count information', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 2,
        totalItems: 55,
        itemsPerPage: 20
      }
    })

    expect(wrapper.text()).toContain('Showing 21 to 40 of 55 products')
  })

  it('handles edge case with single page', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 20
      }
    })

    // Should not show pagination controls when only one page
    expect(wrapper.find('.flex.flex-col.sm\\:flex-row.items-center.justify-between.gap-4').exists()).toBe(false)
  })

  it('applies correct responsive classes for mobile', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalItems: 100,
        itemsPerPage: 20
      }
    })

    // Check for actual classes that exist in the component
    expect(wrapper.find('.hidden.md\\:block').exists()).toBe(true)
    expect(wrapper.find('.flex.items-center.justify-between').exists()).toBe(true)
  })

  it('calculates total pages correctly', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalItems: 47, // Should result in 3 pages with itemsPerPage: 20
        itemsPerPage: 20
      }
    })

    // Should show pages 1, 2, 3 (since current page is 1, visible pages will be 1,2,3)
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2') 
    expect(wrapper.text()).toContain('3')
    // Page 4 should not be shown since we only have 3 total pages
    expect(wrapper.text()).not.toContain(' 4 ')
  })
})
