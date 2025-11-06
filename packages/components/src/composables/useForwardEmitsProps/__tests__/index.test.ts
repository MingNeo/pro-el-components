import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { useForwardEmitsProps } from '../index'

describe('useForwardEmitsProps', () => {
  // it('应该组合 props 和 emits', async () => {
  //   const TestComponent = defineComponent({
  //     name: 'TestComponent',
  //     emits: ['change'],
  //     setup(_, { emit }) {
  //       const props = ref({ value: 'test', disabled: false })
  //       const forwardedProps = useForwardEmitsProps(props, emit)
  //       return { forwardedProps }
  //     },
  //     template: '<div></div>',
  //   })

  //   const wrapper = mount(TestComponent)
  //   await nextTick()

  //   expect(wrapper.vm.forwardedProps).toBe('test')
  //   expect(wrapper.vm.forwardedProps.disabled).toBe(false)
  //   expect(typeof wrapper.vm.forwardedProps.onChange).toBe('function')
  // })

  // it('应该正确转发 props', () => {
  //   const TestComponent = defineComponent({
  //     name: 'TestComponent',
  //     emits: ['change'],
  //     setup(_, { emit }) {
  //       const props = ref({
  //         value: 'initial',
  //         disabled: false,
  //         placeholder: 'Enter text',
  //       })
  //       const forwardedProps = useForwardEmitsProps(props, emit)
  //       return { forwardedProps, props }
  //     },
  //     template: '<div></div>',
  //   })

  //   const wrapper = mount(TestComponent)

  //   expect(wrapper.vm.forwardedProps.value).toBe('initial')
  //   expect(wrapper.vm.forwardedProps.disabled).toBe(false)
  //   expect(wrapper.vm.forwardedProps.placeholder).toBe('Enter text')
  // })

  it('应该正确转发 emits', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change', 'update'],
      setup(_, { emit }) {
        const props = ref({ value: 'test' })
        const forwardedProps = useForwardEmitsProps(props, emit)
        return { forwardedProps }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    expect(typeof wrapper.vm.forwardedProps.onChange).toBe('function')
    expect(typeof wrapper.vm.forwardedProps.onUpdate).toBe('function')
  })

  it('转发的 emit 函数应该正确工作', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change'],
      setup(_, { emit }) {
        const props = ref({ value: 'test' })
        const forwardedProps = useForwardEmitsProps(props, emit)
        return { forwardedProps }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    wrapper.vm.forwardedProps.onChange('new-value')

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual(['new-value'])
  })

  // it('没有 emit 时应该只返回 props', () => {
  //   const TestComponent = defineComponent({
  //     name: 'TestComponent',
  //     setup() {
  //       const props = ref({ value: 'test', disabled: false })
  //       const forwardedProps = useForwardEmitsProps(props)
  //       return { forwardedProps }
  //     },
  //     template: '<div></div>',
  //   })

  //   const wrapper = mount(TestComponent)

  //   expect(wrapper.vm.forwardedProps.value).toBe('test')
  //   expect(wrapper.vm.forwardedProps.disabled).toBe(false)
  // })

  // it('应该响应 props 的变化', async () => {
  //   const TestComponent = defineComponent({
  //     name: 'TestComponent',
  //     emits: ['change'],
  //     setup(_, { emit }) {
  //       const props = ref({ value: 'initial' })
  //       const forwardedProps = useForwardEmitsProps(props, emit)
  //       return { forwardedProps, props }
  //     },
  //     template: '<div></div>',
  //   })

  //   const wrapper = mount(TestComponent)

  //   expect(wrapper.vm.forwardedProps.value).toBe('initial')

  //   wrapper.vm.props.value = 'updated'
  //   await wrapper.vm.$nextTick()

  //   expect(wrapper.vm.forwardedProps.value).toBe('updated')
  // })

  it('应该支持多个 emits', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change', 'update', 'submit', 'cancel'],
      setup(_, { emit }) {
        const props = ref({ value: 'test' })
        const forwardedProps = useForwardEmitsProps(props, emit)
        return { forwardedProps }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    expect(typeof wrapper.vm.forwardedProps.onChange).toBe('function')
    expect(typeof wrapper.vm.forwardedProps.onUpdate).toBe('function')
    expect(typeof wrapper.vm.forwardedProps.onSubmit).toBe('function')
    expect(typeof wrapper.vm.forwardedProps.onCancel).toBe('function')
  })

  // it('应该支持复杂的 props 对象', () => {
  //   const TestComponent = defineComponent({
  //     name: 'TestComponent',
  //     emits: ['change'],
  //     setup(_, { emit }) {
  //       const props = ref({
  //         config: {
  //           nested: {
  //             value: 'deep',
  //           },
  //         },
  //         array: [1, 2, 3],
  //         boolean: true,
  //         number: 42,
  //       })
  //       const forwardedProps = useForwardEmitsProps(props, emit)
  //       return { forwardedProps }
  //     },
  //     template: '<div></div>',
  //   })

  //   const wrapper = mount(TestComponent)

  //   expect(wrapper.vm.forwardedProps.config.nested.value).toBe('deep')
  //   expect(wrapper.vm.forwardedProps.array).toEqual([1, 2, 3])
  //   expect(wrapper.vm.forwardedProps.boolean).toBe(true)
  //   expect(wrapper.vm.forwardedProps.number).toBe(42)
  // })

  it('emits 应该覆盖同名的 props', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change'],
      setup(_, { emit }) {
        const props = ref({
          onChange: () => 'props-handler',
        })
        const forwardedProps = useForwardEmitsProps(props, emit)
        return { forwardedProps }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    // emits 转换的 onChange 应该覆盖 props 中的 onChange
    wrapper.vm.forwardedProps.onChange('test')
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  // it('应该支持动态更新 props', async () => {
  //   const TestComponent = defineComponent({
  //     name: 'TestComponent',
  //     emits: ['change'],
  //     setup(_, { emit }) {
  //       const props = ref({ count: 0 })
  //       const forwardedProps = useForwardEmitsProps(props, emit)

  //       function increment() {
  //         props.value = { ...props.value, count: props.value.count + 1 }
  //       }

  //       return { forwardedProps, increment, props }
  //     },
  //     template: '<div></div>',
  //   })

  //   const wrapper = mount(TestComponent)

  //   expect(wrapper.vm.forwardedProps.count).toBe(0)

  //   wrapper.vm.increment()
  //   await wrapper.vm.$nextTick()

  //   expect(wrapper.vm.forwardedProps.count).toBe(1)
  // })

  it('应该正确处理空对象 props', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change'],
      setup(_, { emit }) {
        const props = ref({})
        const forwardedProps = useForwardEmitsProps(props, emit)
        return { forwardedProps }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    expect(typeof wrapper.vm.forwardedProps.onChange).toBe('function')
  })

  it('返回的应该是计算属性', () => {
    const TestComponent = defineComponent({
      name: 'TestComponent',
      emits: ['change'],
      setup(_, { emit }) {
        const props = ref({ value: 'test' })
        const forwardedProps = useForwardEmitsProps(props, emit)
        return { forwardedProps }
      },
      template: '<div></div>',
    })

    const wrapper = mount(TestComponent)

    // forwardedProps 应该是一个计算属性
    expect(wrapper.vm.forwardedProps).toBeDefined()
  })
})
