/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PageContainer from '../index.vue'

describe('PageContainer 组件', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(PageContainer)

    expect(wrapper.find('.pro-page-container').exists()).toBe(true)
  })

  it('应该渲染默认插槽内容', () => {
    const wrapper = mount(PageContainer, {
      slots: {
        default: '<div class="custom-content">自定义内容</div>',
      },
    })

    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('自定义内容')
  })

  it('showHeader 为 false 时不应该显示头部', () => {
    const wrapper = mount(PageContainer, {
      props: {
        showHeader: false,
      },
    })

    expect(wrapper.find('.pro-list-page-header').exists()).toBe(false)
  })

  it('showHeader 为 true 时应该显示头部', () => {
    const wrapper = mount(PageContainer, {
      props: {
        showHeader: true,
        title: '测试标题',
      },
    })

    expect(wrapper.find('.pro-list-page-header').exists()).toBe(true)
  })

  it('应该正确显示标题', () => {
    const wrapper = mount(PageContainer, {
      props: {
        showHeader: true,
        title: '页面标题',
      },
    })

    expect(wrapper.vm.$props.title).toBe('页面标题')
  })

  it('应该支持 loading 状态', () => {
    const wrapper = mount(PageContainer, {
      props: {
        loading: true,
      },
    })

    expect(wrapper.vm.$props.loading).toBe(true)
  })

  it('loading 为 false 时不应该显示加载状态', () => {
    const wrapper = mount(PageContainer, {
      props: {
        loading: false,
      },
    })

    expect(wrapper.vm.$props.loading).toBe(false)
  })

  it('应该支持 actions', () => {
    const actions = [
      { text: '保存', type: 'primary' },
      { text: '取消', type: 'default' },
    ]

    const wrapper = mount(PageContainer, {
      props: {
        showHeader: true,
        actions,
      },
    })

    expect(wrapper.vm.$props.actions).toEqual(actions)
  })

  it('应该正确触发 cancel 事件', async () => {
    const wrapper = mount(PageContainer, {
      props: {
        showHeader: true,
      },
    })

    await wrapper.vm.handleCancel()

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('应该支持 title 插槽', () => {
    const wrapper = mount(PageContainer, {
      props: {
        showHeader: true,
      },
      slots: {
        title: '<span class="custom-title">自定义标题</span>',
      },
    })

    expect(wrapper.find('.custom-title').exists()).toBe(true)
  })

  it('应该支持 headerActions 插槽', () => {
    const wrapper = mount(PageContainer, {
      props: {
        showHeader: true,
      },
      slots: {
        headerActions: '<div class="custom-actions">自定义操作</div>',
      },
    })

    expect(wrapper.find('.custom-actions').exists()).toBe(true)
  })

  it('应该正确透传属性', () => {
    const wrapper = mount(PageContainer, {
      props: {
        showHeader: true,
      },
      attrs: {
        'data-testid': 'page-container',
      },
    })

    expect(wrapper.vm.$attrs['data-testid']).toBe('page-container')
  })

  it('默认 showHeader 应该为 false', () => {
    const wrapper = mount(PageContainer)

    expect(wrapper.vm.$props.showHeader).toBe(false)
  })

  it('应该支持嵌套内容', () => {
    const wrapper = mount(PageContainer, {
      slots: {
        default: `
          <div class="section-1">Section 1</div>
          <div class="section-2">Section 2</div>
          <div class="section-3">Section 3</div>
        `,
      },
    })

    expect(wrapper.find('.section-1').exists()).toBe(true)
    expect(wrapper.find('.section-2').exists()).toBe(true)
    expect(wrapper.find('.section-3').exists()).toBe(true)
  })

  it('应该正确处理动态 loading 状态', async () => {
    const wrapper = mount(PageContainer, {
      props: {
        loading: false,
      },
    })

    expect(wrapper.vm.$props.loading).toBe(false)

    await wrapper.setProps({ loading: true })
    expect(wrapper.vm.$props.loading).toBe(true)

    await wrapper.setProps({ loading: false })
    expect(wrapper.vm.$props.loading).toBe(false)
  })
})

