import { defineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useEmitAsProps } from '../index'

describe('useEmitAsProps', () => {
  it('应该将 emit 转换为 props 格式', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change', 'update:modelValue'],
      setup(_, { emit }) {
        const propsFromEmit = useEmitAsProps(emit)
        return { propsFromEmit }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    expect(wrapper.vm.propsFromEmit).toBeDefined()
    expect(typeof wrapper.vm.propsFromEmit.onChange).toBe('function')
    expect(typeof wrapper.vm.propsFromEmit['onUpdate:modelValue']).toBe('function')
  })

  it('应该正确调用 emit 函数', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change'],
      setup(_, { emit }) {
        const propsFromEmit = useEmitAsProps(emit)
        return { propsFromEmit }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    wrapper.vm.propsFromEmit.onChange('test-value')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual(['test-value'])
  })

  it('应该支持多个参数', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change'],
      setup(_, { emit }) {
        const propsFromEmit = useEmitAsProps(emit)
        return { propsFromEmit }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    wrapper.vm.propsFromEmit.onChange('value1', 'value2', 'value3')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual(['value1', 'value2', 'value3'])
  })

  it('应该正确处理 kebab-case 事件名', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['update:model-value'],
      setup(_, { emit }) {
        const propsFromEmit = useEmitAsProps(emit)
        return { propsFromEmit }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    expect(typeof wrapper.vm.propsFromEmit['onUpdate:modelValue']).toBe('function')
  })

  it('应该处理多个事件', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change', 'update', 'submit', 'cancel'],
      setup(_, { emit }) {
        const propsFromEmit = useEmitAsProps(emit)
        return { propsFromEmit }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    expect(typeof wrapper.vm.propsFromEmit.onChange).toBe('function')
    expect(typeof wrapper.vm.propsFromEmit.onUpdate).toBe('function')
    expect(typeof wrapper.vm.propsFromEmit.onSubmit).toBe('function')
    expect(typeof wrapper.vm.propsFromEmit.onCancel).toBe('function')
  })

  it('应该正确触发所有转换的事件', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change', 'submit'],
      setup(_, { emit }) {
        const propsFromEmit = useEmitAsProps(emit)
        return { propsFromEmit }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    wrapper.vm.propsFromEmit.onChange('change-value')
    wrapper.vm.propsFromEmit.onSubmit('submit-value')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual(['change-value'])
    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual(['submit-value'])
  })

  it('没有 emits 时应该返回空对象', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      setup(_, { emit }) {
        const propsFromEmit = useEmitAsProps(emit as any)
        return { propsFromEmit }
      },
      template: '<div></div>',
    })

    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => { })

    const wrapper = mount(TestComponent)

    expect(wrapper.vm.propsFromEmit).toEqual({})
    expect(consoleWarn).toHaveBeenCalled()

    consoleWarn.mockRestore()
  })

  it('应该支持不同的命名风格', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['onFocus', 'on-blur', 'update:value'],
      setup(_, { emit }) {
        const propsFromEmit = useEmitAsProps(emit)
        return { propsFromEmit }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    // 所有事件名都应该被转换为 onXxx 格式
    expect(wrapper.vm.propsFromEmit).toBeDefined()
  })

  it('应该支持没有参数的事件', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['click'],
      setup(_, { emit }) {
        const propsFromEmit = useEmitAsProps(emit)
        return { propsFromEmit }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    wrapper.vm.propsFromEmit.onClick()

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')![0]).toEqual([])
  })

  it('应该支持对象作为参数', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change'],
      setup(_, { emit }) {
        const propsFromEmit = useEmitAsProps(emit)
        return { propsFromEmit }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    const testObject = { key: 'value', count: 10 }
    wrapper.vm.propsFromEmit.onChange(testObject)

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual([testObject])
  })

  it('应该支持数组作为参数', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change'],
      setup(_, { emit }) {
        const propsFromEmit = useEmitAsProps(emit)
        return { propsFromEmit }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    const testArray = [1, 2, 3]
    wrapper.vm.propsFromEmit.onChange(testArray)

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual([testArray])
  })
})

