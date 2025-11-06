/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PageWrapper from '../index.vue'

describe('PageWrapper 组件', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(PageWrapper, {
      props: {
        hasPermission: true,
      },
    })

    expect(wrapper.find('.pro-page-wrapper').exists()).toBe(true)
  })

  it('有权限时应该显示内容', () => {
    const wrapper = mount(PageWrapper, {
      props: {
        hasPermission: true,
      },
      slots: {
        default: '<div class="content">内容</div>',
      },
    })

    expect(wrapper.find('.pro-page-wrapper').exists()).toBe(true)
    expect(wrapper.find('.content').exists()).toBe(true)
  })

  it('无权限时应该显示无权限提示', () => {
    const wrapper = mount(PageWrapper, {
      props: {
        hasPermission: false,
      },
    })

    expect(wrapper.find('.pro-no-permission').exists()).toBe(true)
    expect(wrapper.text()).toContain('无权限访问')
  })

  it('无权限时不应该显示主内容', () => {
    const wrapper = mount(PageWrapper, {
      props: {
        hasPermission: false,
      },
      slots: {
        default: '<div class="content">内容</div>',
      },
    })

    expect(wrapper.find('.pro-page-wrapper').exists()).toBe(false)
    expect(wrapper.find('.content').exists()).toBe(false)
  })

  it('应该支持函数类型的 hasPermission', () => {
    const permissionFn = () => true
    const wrapper = mount(PageWrapper, {
      props: {
        hasPermission: permissionFn,
      },
    })

    expect(wrapper.find('.pro-page-wrapper').exists()).toBe(true)
  })

  it('函数返回 false 时应该显示无权限提示', () => {
    const permissionFn = () => false
    const wrapper = mount(PageWrapper, {
      props: {
        hasPermission: permissionFn,
      },
    })

    expect(wrapper.find('.pro-no-permission').exists()).toBe(true)
  })

  it('应该支持自定义无权限提示', () => {
    const wrapper = mount(PageWrapper, {
      props: {
        hasPermission: false,
      },
      slots: {
        noPermission: '<div class="custom-no-permission">自定义无权限提示</div>',
      },
    })

    expect(wrapper.find('.custom-no-permission').exists()).toBe(true)
    expect(wrapper.text()).toContain('自定义无权限提示')
  })

  it('应该渲染默认插槽内容', () => {
    const wrapper = mount(PageWrapper, {
      props: {
        hasPermission: true,
      },
      slots: {
        default: '<div class="page-content">页面内容</div>',
      },
    })

    expect(wrapper.find('.page-content').exists()).toBe(true)
    expect(wrapper.find('.page-content').text()).toBe('页面内容')
  })

  it('权限变化应该正确响应', async () => {
    const wrapper = mount(PageWrapper, {
      props: {
        hasPermission: true,
      },
      slots: {
        default: '<div class="content">内容</div>',
      },
    })

    expect(wrapper.find('.pro-page-wrapper').exists()).toBe(true)

    await wrapper.setProps({ hasPermission: false })

    expect(wrapper.find('.pro-page-wrapper').exists()).toBe(false)
    expect(wrapper.find('.pro-no-permission').exists()).toBe(true)
  })

  it('支持复杂的权限判断逻辑', () => {
    const userRole = 'admin'
    const permissionFn = () => userRole === 'admin'

    const wrapper = mount(PageWrapper, {
      props: {
        hasPermission: permissionFn,
      },
    })

    expect(wrapper.find('.pro-page-wrapper').exists()).toBe(true)
  })

  it('hasPermission 默认值应该为 true', () => {
    const wrapper = mount(PageWrapper, {
      props: {
        hasPermission: undefined as any,
      },
    })

    // 当 hasPermission 为 undefined 时，默认应该有权限
    expect(wrapper.vm.hasPermission).toBe(true)
  })

  it('应该支持嵌套内容', () => {
    const wrapper = mount(PageWrapper, {
      props: {
        hasPermission: true,
      },
      slots: {
        default: `
          <div class="section-1">Section 1</div>
          <div class="section-2">Section 2</div>
        `,
      },
    })

    expect(wrapper.find('.section-1').exists()).toBe(true)
    expect(wrapper.find('.section-2').exists()).toBe(true)
  })
})

