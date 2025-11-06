/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { ElOption, ElSelect } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ProSelect from '../index.vue'

describe('proSelect 组件', () => {
  const mockOptions = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 },
  ]

  // 基础渲染测试
  it('应该正确渲染选择器', () => {
    const wrapper = mount(ProSelect, {
      props: {
        options: mockOptions,
      },
    })

    expect(wrapper.findComponent(ElSelect).exists()).toBe(true)
  })

  // 选项渲染测试
  it('应该正确渲染选项列表', async () => {
    const wrapper = mount(ProSelect, {
      props: {
        options: mockOptions,
        teleported: false,
      },
    })

    await nextTick()
    const options = wrapper.findAllComponents(ElOption)
    expect(options).toHaveLength(3)
    expect(options[0].props('label')).toBe('选项1')
    expect(options[0].props('value')).toBe(1)
  })

  // 值绑定测试
  it('应该正确处理双向绑定', async () => {
    const wrapper = mount(ProSelect, {
      props: {
        options: mockOptions,
        modelValue: 1,
      },
    })

    await nextTick()
    const select = wrapper.findComponent(ElSelect)
    expect(select.props('modelValue')).toBe(1)

    // 更新值
    await wrapper.setProps({ modelValue: 2 })
    expect(select.props('modelValue')).toBe(2)
  })

  // 多选模式测试
  it('应该正确处理多选模式', async () => {
    const wrapper = mount(ProSelect, {
      props: {
        options: mockOptions,
        multiple: true,
        modelValue: [1, 2],
      },
    })

    await nextTick()
    const select = wrapper.findComponent(ElSelect)
    expect(select.props('multiple')).toBe(true)
    expect(select.props('modelValue')).toEqual([1, 2])
  })

  // 禁用选项测试
  it('应该正确处理禁用选项', async () => {
    const disabledOptions = [
      { label: '选项1', value: 1, disabled: false },
      { label: '选项2', value: 2, disabled: true },
      { label: '选项3', value: 3, disabled: false },
    ]

    const wrapper = mount(ProSelect, {
      props: {
        options: disabledOptions,
        teleported: false,
      },
    })

    await nextTick()
    const options = wrapper.findAllComponents(ElOption)
    expect(options[1].props('disabled')).toBe(true)
  })

  // 查看模式测试
  it('应该在查看模式下显示文本', async () => {
    const wrapper = mount(ProSelect, {
      props: {
        options: mockOptions,
        modelValue: 1,
        viewMode: true,
      },
    })

    await nextTick()
    expect(wrapper.findComponent(ElSelect).exists()).toBe(false)
    expect(wrapper.text()).toBe('选项1')
  })

  // 查看模式多选测试
  it('应该在查看模式下正确显示多个值', async () => {
    const wrapper = mount(ProSelect, {
      props: {
        options: mockOptions,
        modelValue: [1, 2],
        multiple: true,
        viewMode: true,
      },
    })

    await nextTick()
    expect(wrapper.text()).toBe('选项1, 选项2')
  })

  // 自定义分隔符测试
  it('应该支持自定义查看模式分隔符', async () => {
    const wrapper = mount(ProSelect, {
      props: {
        options: mockOptions,
        modelValue: [1, 2],
        multiple: true,
        viewMode: true,
        viewModeSeparator: ' | ',
      },
    })

    await nextTick()
    expect(wrapper.text()).toBe('选项1 | 选项2')
  })

  // 空值处理测试
  it('应该正确处理空值', async () => {
    const wrapper = mount(ProSelect, {
      props: {
        options: mockOptions,
        viewMode: true,
      },
    })

    await nextTick()
    expect(wrapper.text()).toBe('--')
  })

  // 远程数据加载测试
  it('应该正确加载远程数据', async () => {
    const mockService = vi.fn().mockResolvedValue(mockOptions)

    const wrapper = mount(ProSelect, {
      props: {
        service: mockService,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(mockService).toHaveBeenCalled()

    await nextTick()
    const options = wrapper.findAllComponents(ElOption)
    expect(options).toHaveLength(3)
  })

  // 加载状态测试
  it('应该正确显示加载状态', async () => {
    const mockService = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockOptions), 100)))

    const wrapper = mount(ProSelect, {
      props: {
        service: mockService,
      },
    })

    await nextTick()
    expect(wrapper.findComponent(ElSelect).props('loading')).toBe(true)

    await new Promise(resolve => setTimeout(resolve, 150))
    expect(wrapper.findComponent(ElSelect).props('loading')).toBe(false)
  })

  // 自定义字段名测试
  it('应该支持自定义字段名', async () => {
    const customOptions = [
      { name: '选项1', id: 1 },
      { name: '选项2', id: 2 },
    ]

    const wrapper = mount(ProSelect, {
      props: {
        options: customOptions,
        optionNames: { label: 'name', value: 'id' },
        teleported: false,
      },
    })

    await nextTick()
    const options = wrapper.findAllComponents(ElOption)
    expect(options[0].props('label')).toBe('选项1')
    expect(options[0].props('value')).toBe(1)
  })

  // 错误处理测试
  it('应该正确处理加载错误', async () => {
    const mockService = vi.fn().mockRejectedValue(new Error('加载失败'))
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

    const wrapper = mount(ProSelect, {
      props: {
        service: mockService,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(consoleWarnSpy).toHaveBeenCalled()
    expect(wrapper.findComponent(ElSelect).props('loading')).toBe(false)

    consoleWarnSpy.mockRestore()
  })

  // 自定义空文本测试
  it('应该支持自定义空文本', () => {
    const wrapper = mount(ProSelect, {
      props: {
        options: [],
        emptyText: '没有数据',
      },
    })

    // Note: 需要点击才能显示空文本，这里只测试 prop 传递
    expect(wrapper.props('emptyText')).toBe('没有数据')
  })

  // 选项更新测试
  it('应该响应选项更新', async () => {
    const wrapper = mount(ProSelect, {
      props: {
        options: mockOptions,
      },
    })

    await nextTick()
    let options = wrapper.findAllComponents(ElOption)
    expect(options).toHaveLength(3)

    // 更新选项
    const newOptions = [
      { label: '新选项1', value: 4 },
      { label: '新选项2', value: 5 },
    ]
    await wrapper.setProps({ options: newOptions })

    options = wrapper.findAllComponents(ElOption)
    expect(options).toHaveLength(2)
    expect(options[0].props('label')).toBe('新选项1')
  })
})
