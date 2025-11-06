/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { ElColorPicker, ElDatePicker, ElInput, ElSelect, ElTimePicker, ElTreeSelect } from 'element-plus'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import ProField from '../index.vue'

describe('proField', () => {
  it('应该正确渲染文本输入框', async () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'input',
        modelValue: 'test',
        fieldProps: { placeholder: '请输入' },
      },
    })

    await nextTick()
    expect(wrapper.findComponent(ElInput).exists()).toBe(true)
    expect(wrapper.findComponent(ElInput).props('modelValue')).toBe('test')
    expect(wrapper.findComponent(ElInput).props('placeholder')).toBe('请输入')
  })
  it('应该正确渲染密码输入框', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'password',
        modelValue: '123456',
      },
    })
    expect(wrapper.findComponent(ElInput).exists()).toBe(true)
    expect(wrapper.findComponent(ElInput).props('type')).toBe('password')
    expect(wrapper.findComponent(ElInput).props('showPassword')).toBe(true)
  })
  it('应该正确渲染选择框', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'select',
        modelValue: 1,
        fieldProps: {
          options: [
            { label: '选项1', value: 1 },
            { label: '选项2', value: 2 },
          ],
        },
      },
    })
    expect(wrapper.findComponent(ElSelect).exists()).toBe(true)
    expect(wrapper.findComponent(ElSelect).props('modelValue')).toBe(1)
  })
  it('应该正确触发 change 事件', async () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'input',
        modelValue: '',
      },
    })
    await nextTick()
    await wrapper.findComponent(ElInput).setValue('new value')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual(['new value'])
  })
  it('应该正确处理日期选择器', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'dateTime',
        modelValue: '2024-03-14 12:00:00',
      },
    })
    expect(wrapper.findComponent(ElTimePicker).exists()).toBe(true)
  })
  it('应该正确处理日期范围选择器', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'dateRange',
        modelValue: ['2024-03-14', '2024-03-15'],
      },
    })
    expect(wrapper.findComponent(ElDatePicker).exists()).toBe(true)
    expect(wrapper.findComponent(ElDatePicker).props('type')).toBe('daterange')
  })

  // 补充更多测试用例
  it('应该正确渲染文本域', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'textarea',
        modelValue: '多行文本',
      },
    })
    expect(wrapper.findComponent(ElInput).exists()).toBe(true)
    expect(wrapper.findComponent(ElInput).props('type')).toBe('textarea')
  })

  it('应该正确渲染数字输入框', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'number',
        modelValue: 100,
      },
    })
    expect(wrapper.find('.el-input-number').exists()).toBe(true)
  })

  it('应该正确处理查看模式', async () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'input',
        modelValue: '查看内容',
        viewMode: true,
      },
    })
    await nextTick()
    expect(wrapper.findComponent(ElInput).exists()).toBe(false)
    expect(wrapper.text()).toContain('查看内容')
  })

  it('查看模式下选择框应该显示标签', async () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'select',
        modelValue: 1,
        viewMode: true,
        fieldProps: {
          options: [
            { label: '选项1', value: 1 },
            { label: '选项2', value: 2 },
          ],
        },
      },
    })
    await nextTick()
    expect(wrapper.findComponent(ElSelect).exists()).toBe(false)
    expect(wrapper.text()).toBe('选项1')
  })

  it('应该支持自定义 fieldProps', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'input',
        modelValue: '',
        fieldProps: {
          placeholder: '自定义占位符',
          maxlength: 50,
        },
      },
    })
    const input = wrapper.findComponent(ElInput)
    expect(input.props('placeholder')).toBe('自定义占位符')
    expect(input.props('maxlength')).toBe(50)
  })

  it('应该正确处理禁用状态', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'input',
        modelValue: '',
        fieldProps: {
          disabled: true,
        },
      },
    })
    expect(wrapper.findComponent(ElInput).props('disabled')).toBe(true)
  })

  it('应该正确处理多选框', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'checkbox',
        modelValue: [1, 2],
        fieldProps: {
          options: [
            { label: '选项1', value: 1 },
            { label: '选项2', value: 2 },
            { label: '选项3', value: 3 },
          ],
        },
      },
    })
    expect(wrapper.find('.el-checkbox-group').exists()).toBe(true)
  })

  it('应该正确处理单选框', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'radio',
        modelValue: 1,
        fieldProps: {
          options: [
            { label: '选项1', value: 1 },
            { label: '选项2', value: 2 },
          ],
        },
      },
    })
    expect(wrapper.find('.el-radio-group').exists()).toBe(true)
  })

  it('应该正确处理开关', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'switch',
        modelValue: true,
      },
    })
    expect(wrapper.find('.el-switch').exists()).toBe(true)
  })

  it('应该正确处理滑块', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'slider',
        modelValue: 50,
      },
    })
    expect(wrapper.find('.el-slider').exists()).toBe(true)
  })

  it('应该正确处理时间选择器', async () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'dateTime',
        modelValue: '12:00:00',
      },
      global: {
        // stub TimePicker 的内部组件，避免测试环境中的初始化问题
        stubs: {
          ElTooltip: true,
          ElPopper: true,
        },
      },
    })
    await nextTick()
    expect(wrapper.findComponent(ElTimePicker).exists()).toBe(true)
  })

  it('应该正确处理级联选择器', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'cascader',
        modelValue: ['1', '1-1'],
        fieldProps: {
          options: [
            {
              value: '1',
              label: '选项1',
              children: [
                { value: '1-1', label: '选项1-1' },
              ],
            },
          ],
        },
      },
    })
    expect(wrapper.find('.el-cascader').exists()).toBe(true)
  })

  it('应该正确处理树形选择', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'treeSelect',
        modelValue: '1',
        fieldProps: {
          data: [
            {
              value: '1',
              label: '节点1',
              children: [
                { value: '1-1', label: '节点1-1' },
              ],
            },
          ],
        },
      },
    })
    expect(wrapper.findComponent(ElTreeSelect).exists()).toBe(true)
  })

  it('应该正确处理评分', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'rate',
        modelValue: 4,
      },
    })
    expect(wrapper.find('.el-rate').exists()).toBe(true)
  })

  it('应该正确处理颜色选择器', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'color',
        modelValue: '#409eff',
      },
    })
    expect(wrapper.findComponent(ElColorPicker).exists()).toBe(true)
  })

  it('应该在查看模式下处理空值', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'input',
        modelValue: '',
        viewMode: true,
      },
    })
    expect(wrapper.text()).toBe('-')
  })

  it('应该在查看模式下处理 undefined 值', () => {
    const wrapper = mount(ProField, {
      props: {
        fieldType: 'input',
        modelValue: undefined,
        viewMode: true,
      },
    })
    expect(wrapper.text()).toBe('-')
  })
})
