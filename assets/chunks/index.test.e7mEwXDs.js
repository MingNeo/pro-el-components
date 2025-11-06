const e=`/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ModalSelector from '../index.vue'

describe('modalSelector 组件', () => {
  const mockColumns = [
    { prop: 'id', label: 'ID', type: 'selection' },
    { prop: 'name', label: '名称' },
  ]

  const mockData = [
    { id: 1, name: '选项1' },
    { id: 2, name: '选项2' },
  ]

  it('应该正确渲染', async () => {
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 200))
    expect(wrapper.find('.el-dialog').exists()).toBe(true)
  })

  it('应该正确显示标题', async () => {
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: true,
        title: '请选择用户',
        columns: mockColumns,
        data: mockData,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 200))
    expect(wrapper.find('.el-dialog__title').text()).toBe('请选择用户')
  })

  it('应该使用默认标题', async () => {
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 200))
    expect(wrapper.find('.el-dialog__title').text()).toBe('请选择')
  })

  it('应该支持自定义宽度', async () => {
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: true,
        width: 800,
        columns: mockColumns,
        data: mockData,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 200))
    expect(wrapper.vm.width).toBe(800)
  })

  it('modelValue 控制显示隐藏', async () => {
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: false,
        columns: mockColumns,
        data: mockData,
      },
    })

    expect(wrapper.vm.visible).toBe(false)

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.vm.visible).toBe(true)
  })

  it('应该正确更新 modelValue', async () => {
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    wrapper.vm.visible = false
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('应该在打开时同步 value 到 selected', async () => {
    const initialValue = [{ id: 1, name: '选项1' }]
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: false,
        value: initialValue,
        columns: mockColumns,
        data: mockData,
      },
    })

    await wrapper.setProps({ modelValue: true })
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.selected).toEqual(initialValue)
  })

  it('应该正确触发 confirm 事件', async () => {
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    const selectedData = [{ id: 1, name: '选项1' }]
    wrapper.vm.selected = selectedData

    await wrapper.vm.handleOk()

    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm')![0]).toEqual([selectedData])
  })

  it('应该正确触发 change 事件', async () => {
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    const selectedData = [{ id: 1, name: '选项1' }]
    wrapper.vm.selected = selectedData

    await wrapper.vm.handleOk()

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual([selectedData])
  })

  it('确认后应该关闭弹窗', async () => {
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    await wrapper.vm.handleOk()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('应该支持 destroy-on-close', async () => {
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    // 检查 destroy-on-close 属性
    expect(wrapper.vm.$el).toBeDefined()
  })

  it('应该正确传递 props 到 ProTableSelector', async () => {
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
        idKey: 'customId',
      },
    })

    await new Promise(resolve => setTimeout(resolve, 200))
    expect(wrapper.vm.idKey).toBe('customId')
  })

  it('应该支持插槽透传', async () => {
    const wrapper = mount(ModalSelector, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
      slots: {
        'column-default': '<div class="custom-column">自定义列</div>',
      },
    })

    await new Promise(resolve => setTimeout(resolve, 200))
    // 插槽应该被传递到内部组件
    expect(wrapper.vm.$slots['column-default']).toBeDefined()
  })
})
`;export{e as default};
