const n=`/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ProCheckbox from '../index.vue'

describe('proCheckbox 组件', () => {
  const mockOptions = [
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 },
    { label: '选项3', value: 3 },
  ]

  // 基础渲染测试
  it('应该正确渲染复选框组', () => {
    const wrapper = mount(ProCheckbox, {
      props: {
        options: mockOptions,
      },
    })

    expect(wrapper.findComponent(ElCheckboxGroup).exists()).toBe(true)
  })

  // 选项渲染测试
  it('应该正确渲染所有选项', async () => {
    const wrapper = mount(ProCheckbox, {
      props: {
        options: mockOptions,
      },
    })

    await nextTick()
    const checkboxes = wrapper.findAllComponents(ElCheckbox)
    expect(checkboxes).toHaveLength(3)
    expect(checkboxes[0].props('label')).toBe('选项1')
    expect(checkboxes[0].props('value')).toBe(1)
  })

  // 值绑定测试
  it('应该正确处理双向绑定', async () => {
    const wrapper = mount(ProCheckbox, {
      props: {
        options: mockOptions,
        modelValue: [1, 2],
      },
    })

    await nextTick()
    const checkboxGroup = wrapper.findComponent(ElCheckboxGroup)
    expect(checkboxGroup.props('modelValue')).toEqual([1, 2])

    // 更新值
    await wrapper.setProps({ modelValue: [2, 3] })
    expect(checkboxGroup.props('modelValue')).toEqual([2, 3])
  })

  // 禁用选项测试
  it('应该正确处理禁用选项', async () => {
    const disabledOptions = [
      { label: '选项1', value: 1, disabled: false },
      { label: '选项2', value: 2, disabled: true },
      { label: '选项3', value: 3, disabled: false },
    ]

    const wrapper = mount(ProCheckbox, {
      props: {
        options: disabledOptions,
      },
    })

    await nextTick()
    const checkboxes = wrapper.findAllComponents(ElCheckbox)
    expect(checkboxes[1].props('disabled')).toBe(true)
  })

  // 查看模式测试
  it('应该在查看模式下显示文本', async () => {
    const wrapper = mount(ProCheckbox, {
      props: {
        options: mockOptions,
        modelValue: [1, 2],
        viewMode: true,
      },
    })

    await nextTick()
    expect(wrapper.findComponent(ElCheckboxGroup).exists()).toBe(false)
    expect(wrapper.text()).toBe('选项1, 选项2')
  })

  // 自定义分隔符测试
  it('应该支持自定义查看模式分隔符', async () => {
    const wrapper = mount(ProCheckbox, {
      props: {
        options: mockOptions,
        modelValue: [1, 2],
        viewMode: true,
        viewModeSeparator: ' | ',
      },
    })

    await nextTick()
    expect(wrapper.text()).toBe('选项1 | 选项2')
  })

  // 空值处理测试
  it('应该正确处理空值', async () => {
    const wrapper = mount(ProCheckbox, {
      props: {
        options: mockOptions,
        viewMode: true,
      },
    })

    await nextTick()
    expect(wrapper.text()).toBe('-')
  })

  // 远程数据加载测试
  it('应该正确加载远程数据', async () => {
    const mockService = vi.fn().mockResolvedValue(mockOptions)

    const wrapper = mount(ProCheckbox, {
      props: {
        service: mockService,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(mockService).toHaveBeenCalled()

    await nextTick()
    const checkboxes = wrapper.findAllComponents(ElCheckbox)
    expect(checkboxes).toHaveLength(3)
  })

  // 加载状态测试
  // it('应该正确显示加载状态', async () => {
  //   const mockService = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockOptions), 100)))

  //   const wrapper = mount(ProCheckbox, {
  //     props: {
  //       service: mockService,
  //     },
  //   })
  //   await nextTick()
  //   expect(wrapper.findComponent(ElCheckboxGroup).find('.el-loading-spinner').exists()).toBe(true)

  //   await new Promise(resolve => setTimeout(resolve, 150))
  //   expect(wrapper.findComponent(ElCheckboxGroup).find('.el-loading-spinner').exists()).toBe(false)
  // })

  // 自定义字段名测试
  it('应该支持自定义字段名', async () => {
    const customOptions = [
      { name: '选项1', id: 1 },
      { name: '选项2', id: 2 },
    ]

    const wrapper = mount(ProCheckbox, {
      props: {
        options: customOptions,
        optionNames: { label: 'name', value: 'id' },
      },
    })

    await nextTick()
    const checkboxes = wrapper.findAllComponents(ElCheckbox)
    expect(checkboxes[0].props('label')).toBe('选项1')
    expect(checkboxes[0].props('value')).toBe(1)
  })

  // 错误处理测试
  it('应该正确处理加载错误', async () => {
    const mockService = vi.fn().mockRejectedValue(new Error('加载失败'))
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })

    mount(ProCheckbox, {
      props: {
        service: mockService,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(consoleWarnSpy).toHaveBeenCalled()
    // expect(wrapper.findComponent(ElCheckboxGroup).find('.el-loading-spinner').exists()).toBe(false)

    consoleWarnSpy.mockRestore()
  })

  // 选项更新测试
  it('应该响应选项更新', async () => {
    const wrapper = mount(ProCheckbox, {
      props: {
        options: mockOptions,
      },
    })

    await nextTick()
    let checkboxes = wrapper.findAllComponents(ElCheckbox)
    expect(checkboxes).toHaveLength(3)

    // 更新选项
    const newOptions = [
      { label: '新选项1', value: 4 },
      { label: '新选项2', value: 5 },
    ]
    await wrapper.setProps({ options: newOptions })

    checkboxes = wrapper.findAllComponents(ElCheckbox)
    expect(checkboxes).toHaveLength(2)
    expect(checkboxes[0].props('label')).toBe('新选项1')
  })

  // 空数组值测试
  it('应该正确处理空数组值', () => {
    const wrapper = mount(ProCheckbox, {
      props: {
        options: mockOptions,
        modelValue: [],
      },
    })

    const checkboxGroup = wrapper.findComponent(ElCheckboxGroup)
    expect(checkboxGroup.props('modelValue')).toEqual([])
  })

  // 属性透传测试
  it('应该正确透传属性到 ElCheckboxGroup', () => {
    const wrapper = mount(ProCheckbox, {
      props: {
        options: mockOptions,
        size: 'large',
        disabled: true,
      },
    })

    const checkboxGroup = wrapper.findComponent(ElCheckboxGroup)
    console.log(checkboxGroup)
    expect(checkboxGroup.vm.size).toBe('large')
    expect(checkboxGroup.vm.disabled).toBeDefined()
  })

  // 自定义禁用字段名测试
  it('应该支持自定义禁用字段名', async () => {
    const customOptions = [
      { label: '选项1', value: 1, isDisabled: true },
      { label: '选项2', value: 2, isDisabled: false },
    ]

    const wrapper = mount(ProCheckbox, {
      props: {
        options: customOptions,
        optionNames: { label: 'label', value: 'value', disabled: 'isDisabled' },
      },
    })

    await nextTick()
    const checkboxes = wrapper.findAllComponents(ElCheckbox)
    expect(checkboxes[0].props('disabled')).toBe(true)
    expect(checkboxes[1].props('disabled')).toBe(false)
  })
})
`;export{n as default};
