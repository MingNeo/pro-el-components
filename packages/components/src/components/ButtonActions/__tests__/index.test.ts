/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { ElPopconfirm } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ButtonActions from '../index.vue'

describe('buttonActions 组件', () => {
  // 基础操作配置
  const baseActions = [
    { text: '编辑', onClick: vi.fn() },
    { text: '删除', onClick: vi.fn() },
  ]

  // 基础渲染测试
  it('应该正确渲染操作按钮', async () => {
    const wrapper = mount(ButtonActions, {
      props: {
        actions: baseActions,
      },
    })

    await nextTick()
    await nextTick()
    const buttons = wrapper.findAll('.el-button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('编辑')
    expect(buttons[1].text()).toBe('删除')
  })

  // 点击事件测试
  it('应该正确触发点击事件', async () => {
    const wrapper = mount(ButtonActions, {
      props: {
        actions: baseActions,
      },
    })
    await nextTick()
    await nextTick()
    const buttons = wrapper.findAll('.el-button')
    await buttons[0].trigger('click')

    expect(baseActions[0].onClick).toHaveBeenCalled()
  })

  // 确认弹窗测试
  it('应该正确处理确认弹窗', async () => {
    const confirmActions = [
      {
        text: '删除',
        onClick: vi.fn(),
        confirm: true,
        confirmText: '确认删除?',
      },
    ]

    const wrapper = mount(ButtonActions, {
      props: {
        actions: confirmActions,
      },
    })

    // 点击删除按钮
    const button = wrapper.find('.el-button')
    await button.trigger('click')

    // 检查确认弹窗
    const popconfirm = wrapper.findComponent(ElPopconfirm)
    expect(popconfirm.exists()).toBe(true)
    expect(popconfirm.props('title')).toBe('确认删除?')

    // 确认删除
    await popconfirm.vm.$emit('confirm')
    expect(confirmActions[0].onClick).toHaveBeenCalled()
  })

  // 权限控制测试
  it('应该正确处理权限控制', () => {
    const permissionActions = [
      { text: '编辑', onClick: vi.fn(), permission: 'edit' },
      { text: '删除', onClick: vi.fn(), permission: 'delete' },
    ]

    const wrapper = mount(ButtonActions, {
      props: {
        actions: permissionActions,
        hasPermission: permission => ['delete'].includes(permission as string),
      },
    })

    const buttons = wrapper.findAll('.el-button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0].text()).toBe('删除')
  })

  // 条件显示测试
  it('应该正确处理条件显示', async () => {
    const conditionalActions = [
      { text: '编辑', onClick: vi.fn() },
      {
        text: '删除',
        onClick: vi.fn(),
        show: (record: any) => record.status === 'active',
      },
    ]

    const wrapper = mount(ButtonActions, {
      props: {
        actions: conditionalActions,
        record: { status: 'inactive' },
      },
    })

    expect(wrapper.findAll('.el-button')).toHaveLength(1)

    await wrapper.setProps({
      record: { status: 'active' },
    })

    await nextTick()

    expect(wrapper.findAll('.el-button')).toHaveLength(2)
  })

  // 禁用状态测试
  it('应该正确处理禁用状态', () => {
    const disabledActions = [
      { text: '编辑', onClick: vi.fn() },
      {
        text: '删除',
        onClick: vi.fn(),
        disabled: (record: any) => record.locked,
      },
    ]

    const wrapper = mount(ButtonActions, {
      props: {
        actions: disabledActions,
        record: { locked: true },
      },
    })

    const buttons = wrapper.findAll('.el-button')
    expect(buttons[1].classes()).toContain('is-disabled')
  })

  // 更多菜单测试
  it('应该正确处理更多菜单', async () => {
    const manyActions = Array.from({ length: 6 }).fill(null).map((_, index) => ({
      text: `操作${index + 1}`,
      onClick: vi.fn(),
    }))

    const wrapper = mount(ButtonActions, {
      props: {
        actions: manyActions,
        maxCount: 3,
        moreDropdownProps: {
          teleported: false,
        },
      },
    })

    // 检查显示的按钮数量
    const visibleButtons = wrapper.findAll('.el-button:not(.more-action)')
    expect(visibleButtons).toHaveLength(3)

    // 检查更多按钮
    const moreButton = wrapper.find('.more-action')
    expect(moreButton.exists()).toBe(true)

    // 点击更多按钮
    await moreButton.trigger('click')

    // 检查下拉菜单项
    const dropdownItems = wrapper.findAll('.el-dropdown-menu__item')
    expect(dropdownItems).toHaveLength(3) // 剩余的3个操作
  })

  // 异步操作测试
  // it('应该正确处理异步操作', async () => {
  //   const asyncAction = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
  //   const actions = [
  //     {
  //       text: '保存',
  //       onClick: asyncAction,
  //     },
  //   ]

  //   const wrapper = mount(ButtonActions, {
  //     props: { actions },
  //   })

  //   const button = wrapper.find('.el-button')
  //   await button.trigger('click')

  //   // 检查加载状态
  //   expect(button.classes()).toContain('is-loading')

  //   // 等待异步操作完成
  //   await new Promise(resolve => setTimeout(resolve, 150))
  //   expect(button.classes()).not.toContain('is-loading')
  // })
})
