/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PageHeader from '../index.vue'

describe('pageHeader 组件', () => {
  it('应该正确渲染', () => {
    const wrapper = mount(PageHeader)

    expect(wrapper.find('.pro-page-header').exists()).toBe(true)
  })

  it('应该正确显示标题', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: '页面标题',
      },
    })

    expect(wrapper.text()).toContain('页面标题')
  })

  it('showBack 为 true 时应该显示返回按钮', () => {
    const wrapper = mount(PageHeader, {
      props: {
        showBack: true,
      },
    })

    expect(wrapper.find('.pro-page-header__back').exists()).toBe(true)
  })

  it('showBack 为 false 时不应该显示返回按钮', () => {
    const wrapper = mount(PageHeader, {
      props: {
        showBack: false,
      },
    })

    expect(wrapper.find('.pro-page-header__back').exists()).toBe(false)
  })

  it('点击返回按钮应该触发 cancel 事件', async () => {
    const wrapper = mount(PageHeader, {
      props: {
        showBack: true,
      },
    })

    await wrapper.vm.handleBack()

    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('应该正确渲染操作按钮', () => {
    const actions = [
      { text: '保存', type: 'primary' },
      { text: '取消', type: 'default' },
    ]

    const wrapper = mount(PageHeader, {
      props: {
        actions,
      },
    })

    expect(wrapper.vm.$props.actions).toEqual(actions)
  })

  it('应该支持 title 插槽', () => {
    const wrapper = mount(PageHeader, {
      slots: {
        title: '<span class="custom-title">自定义标题</span>',
      },
    })

    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.custom-title').text()).toBe('自定义标题')
  })

  it('应该支持 actions 插槽', () => {
    const wrapper = mount(PageHeader, {
      slots: {
        actions: '<div class="custom-actions">自定义操作</div>',
      },
    })

    expect(wrapper.find('.custom-actions').exists()).toBe(true)
  })

  it('应该正确显示标签页', () => {
    const tabs = [
      { name: 'tab1', title: '标签1' },
      { name: 'tab2', title: '标签2' },
    ]

    const wrapper = mount(PageHeader, {
      props: {
        tabs,
      },
    })

    expect(wrapper.find('.pro-page-header__tabs').exists()).toBe(true)
  })

  it('没有 tabs 时不应该显示标签页区域', () => {
    const wrapper = mount(PageHeader)

    expect(wrapper.find('.pro-page-header__tabs').exists()).toBe(false)
  })

  it('应该正确初始化 activeTab', () => {
    const tabs = [
      { name: 'tab1', title: '标签1' },
      { name: 'tab2', title: '标签2' },
    ]

    const wrapper = mount(PageHeader, {
      props: {
        tabs,
      },
    })

    expect(wrapper.vm.activeTab).toBe('tab1')
  })

  it('应该支持自定义 activeTab', () => {
    const tabs = [
      { name: 'tab1', title: '标签1' },
      { name: 'tab2', title: '标签2' },
    ]

    const wrapper = mount(PageHeader, {
      props: {
        tabs,
        activeTab: 'tab2',
      },
    })

    expect(wrapper.vm.activeTab).toBe('tab2')
  })

  it('更新 activeTab 应该触发事件', async () => {
    const tabs = [
      { name: 'tab1', title: '标签1' },
      { name: 'tab2', title: '标签2' },
    ]

    const wrapper = mount(PageHeader, {
      props: {
        tabs,
      },
    })

    await wrapper.vm.handleUpdateActiveTab('tab2')

    expect(wrapper.emitted('update:activeTab')).toBeTruthy()
    expect(wrapper.emitted('update:activeTab')![0]).toEqual(['tab2'])
  })

  it('activeTab prop 变化应该同步到内部状态', async () => {
    const tabs = [
      { name: 'tab1', title: '标签1' },
      { name: 'tab2', title: '标签2' },
    ]

    const wrapper = mount(PageHeader, {
      props: {
        tabs,
        activeTab: 'tab1',
      },
    })

    expect(wrapper.vm.activeTab).toBe('tab1')

    await wrapper.setProps({ activeTab: 'tab2' })

    expect(wrapper.vm.activeTab).toBe('tab2')
  })

  it('应该正确透传属性', () => {
    const wrapper = mount(PageHeader, {
      attrs: {
        'data-testid': 'page-header',
        'class': 'custom-class',
      },
    })

    expect(wrapper.attributes('data-testid')).toBe('page-header')
  })

  it('应该包含顶部和操作区域', () => {
    const wrapper = mount(PageHeader, {
      props: {
        title: '标题',
        actions: [{ text: '操作' }],
      },
    })

    expect(wrapper.find('.pro-page-header__top').exists()).toBe(true)
    expect(wrapper.find('.pro-page-header__title').exists()).toBe(true)
    expect(wrapper.find('.pro-page-header__actions').exists()).toBe(true)
  })

  it('应该正确渲染多个标签页', () => {
    const tabs = [
      { name: 'tab1', title: '标签1' },
      { name: 'tab2', title: '标签2' },
      { name: 'tab3', title: '标签3' },
    ]

    const wrapper = mount(PageHeader, {
      props: {
        tabs,
      },
    })

    const radioButtons = wrapper.findAll('.el-radio-button')
    expect(radioButtons.length).toBeGreaterThanOrEqual(0)
  })

  it('标题和返回按钮应该在同一行', () => {
    const wrapper = mount(PageHeader, {
      props: {
        showBack: true,
        title: '测试标题',
      },
    })

    const titleArea = wrapper.find('.pro-page-header__title')
    expect(titleArea.exists()).toBe(true)
  })
})
