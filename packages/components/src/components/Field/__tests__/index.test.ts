/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { ElDatePicker, ElInput, ElSelect } from 'element-plus'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import ProField from '../index.vue'

describe('proField', () => {
  it('应该正确渲染文本输入框', async () => {
    const wrapper = mount(ProField, {
      props: {
        valueType: 'input',
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
        valueType: 'password',
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
        valueType: 'select',
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
        valueType: 'input',
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
        valueType: 'dateTime',
        modelValue: '2024-03-14 12:00:00',
      },
    })
    expect(wrapper.findComponent(ElDatePicker).exists()).toBe(true)
    expect(wrapper.findComponent(ElDatePicker).props('type')).toBe('datetime')
  })
  it('应该正确处理日期范围选择器', () => {
    const wrapper = mount(ProField, {
      props: {
        valueType: 'dateRange',
        modelValue: ['2024-03-14', '2024-03-15'],
      },
    })
    expect(wrapper.findComponent(ElDatePicker).exists()).toBe(true)
    expect(wrapper.findComponent(ElDatePicker).props('type')).toBe('daterange')
  })
})
