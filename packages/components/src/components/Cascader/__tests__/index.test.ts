/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { ElCascader } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import Cascader from '../index.vue'

describe('cascader 组件', () => {
  // 模拟级联数据
  const mockOptions = [
    {
      value: '1',
      label: '选项1',
      children: [
        {
          value: '1-1',
          label: '选项1-1',
        },
      ],
    },
    {
      value: '2',
      label: '选项2',
    },
  ]

  // 测试基础渲染
  it('应该正确渲染 el-cascader', () => {
    const wrapper = mount(Cascader, {
      props: {
        modelValue: [],
      },
    })
    expect(wrapper.findComponent(ElCascader).exists()).toBe(true)
  })

  // 测试视图模式
  it('在视图模式下应该显示文本而不是选择器', () => {
    const wrapper = mount(Cascader, {
      props: {
        viewMode: true,
        modelValue: ['1', '1-1'],
        options: mockOptions,
      },
    })
    expect(wrapper.findComponent(ElCascader).exists()).toBe(false)
    expect(wrapper.find('span').exists()).toBe(true)
  })

  // 测试值变更
  it('应该正确触发值更新事件', async () => {
    const wrapper = mount(Cascader, {
      props: {
        modelValue: [],
        options: mockOptions,
      },
    })

    await wrapper.findComponent(ElCascader).vm.$emit('change', ['1', '1-1'])

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['1-1'])
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  // 测试远程数据加载
  it('应该正确加载远程数据', async () => {
    const mockService = vi.fn().mockResolvedValue(mockOptions)

    mount(Cascader, {
      props: {
        modelValue: [],
        service: mockService,
      },
    })

    expect(mockService).toHaveBeenCalled()
  })

  // 测试多选模式
  it('在多选模式下应该正确处理值', async () => {
    const wrapper = mount(Cascader, {
      props: {
        modelValue: [],
        options: mockOptions,
        props: {
          multiple: true,
        },
      },
    })

    await wrapper.findComponent(ElCascader).vm.$emit('change', [['1', '1-1'], ['2']])

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['1-1', '2']])
  })

  // 测试标签查找功能
  it('应该正确查找并显示标签路径', () => {
    const wrapper = mount(Cascader, {
      props: {
        viewMode: true,
        modelValue: '1-1',
        options: mockOptions,
      },
    })

    expect(wrapper.text()).toContain('选项1-选项1-1')
  })

  // 测试无效值处理
  it('应该正确处理无效值', () => {
    const wrapper = mount(Cascader, {
      props: {
        viewMode: true,
        modelValue: 'invalid-value',
        options: mockOptions,
      },
    })

    expect(wrapper.text()).toBe('-无-')
  })
})
