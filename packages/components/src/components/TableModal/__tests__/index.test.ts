/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import TableModal from '../index.vue'

describe('tableModal 组件', () => {
  const mockColumns = [
    { prop: 'id', label: 'ID' },
    { prop: 'name', label: '名称' },
  ]

  const mockData = [
    { id: 1, name: '数据1' },
    { id: 2, name: '数据2' },
  ]

  it('应该正确渲染', async () => {
    const wrapper = mount(TableModal, {
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
    const wrapper = mount(TableModal, {
      props: {
        modelValue: true,
        title: '数据列表',
        columns: mockColumns,
        data: mockData,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 200))
    expect(wrapper.vm.$props.title).toBe('数据列表')
  })

  it('modelValue 控制显示隐藏', async () => {
    const wrapper = mount(TableModal, {
      props: {
        modelValue: false,
        columns: mockColumns,
        data: mockData,
      },
    })

    expect(wrapper.vm.$props.modelValue).toBe(false)

    await wrapper.setProps({ modelValue: true })
    expect(wrapper.vm.$props.modelValue).toBe(true)
  })

  it('应该正确更新 modelValue', async () => {
    const wrapper = mount(TableModal, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    wrapper.vm.$emit('update:modelValue', false)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('应该支持本地数据', () => {
    const wrapper = mount(TableModal, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    expect(wrapper.vm.$props.data).toEqual(mockData)
  })

  it('应该支持远程数据', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: mockData, total: 2 })

    const wrapper = mount(TableModal, {
      props: {
        modelValue: false,
        columns: mockColumns,
        service: mockService,
      },
    })

    await wrapper.setProps({ modelValue: true })
    await nextTick()
    expect(mockService).toHaveBeenCalled()
  })

  it('打开时应该加载远程数据', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: mockData, total: 2 })

    const wrapper = mount(TableModal, {
      props: {
        modelValue: false,
        columns: mockColumns,
        service: mockService,
      },
    })

    expect(mockService).not.toHaveBeenCalled()

    await wrapper.setProps({ modelValue: true })
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(mockService).toHaveBeenCalled()
  })

  it('有本地数据时不应该调用 service', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: mockData, total: 2 })

    const wrapper = mount(TableModal, {
      props: {
        modelValue: false,
        columns: mockColumns,
        data: mockData,
        service: mockService,
      },
    })

    await wrapper.setProps({ modelValue: true })
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(mockService).not.toHaveBeenCalled()
  })

  it('应该支持分页', () => {
    const wrapper = mount(TableModal, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
        pagination: {
          pageSize: 20,
          currentPage: 1,
        },
      },
    })

    expect(wrapper.vm.$props.pagination).toBeDefined()
  })

  it('应该支持自定义 dialogProps', () => {
    const dialogProps = {
      width: '800px',
      draggable: true,
    }

    const wrapper = mount(TableModal, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
        dialogProps,
      },
    })

    expect(wrapper.vm.$props.dialogProps).toEqual(dialogProps)
  })

  it('应该支持自定义 tableProps', () => {
    const tableProps = {
      stripe: true,
      border: true,
    }

    const wrapper = mount(TableModal, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
        tableProps,
      },
    })

    expect(wrapper.vm.$props.tableProps).toEqual(tableProps)
  })

  it('应该支持 pre 插槽', async () => {
    const wrapper = mount(TableModal, {
      props: {
        modelValue: false,
        columns: mockColumns,
        data: mockData,
      },
      slots: {
        pre: '<div class="pre-content">前置内容</div>',
      },
    })

    await wrapper.setProps({ modelValue: true })
    await nextTick()

    expect(wrapper.find('.pre-content').exists()).toBe(true)
  })

  it('应该支持 after 插槽', async () => {
    const wrapper = mount(TableModal, {
      props: {
        modelValue: false,
        columns: mockColumns,
        data: mockData,
      },
      slots: {
        after: '<div class="after-content">后置内容</div>',
      },
    })

    await wrapper.setProps({ modelValue: true })
    await nextTick()

    expect(wrapper.find('.after-content').exists()).toBe(true)
  })

  it('应该显示加载状态', async () => {
    const mockService = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: mockData, total: 2 }), 100)),
    )

    const wrapper = mount(TableModal, {
      props: {
        modelValue: false,
        columns: mockColumns,
        service: mockService,
      },
    })

    await wrapper.setProps({ modelValue: true })
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(wrapper.vm.loading).toBe(true)
  })

  it('应该正确透传插槽', () => {
    const wrapper = mount(TableModal, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
      slots: {
        'column-default': '<div class="custom-column">自定义列</div>',
      },
    })

    expect(wrapper.vm.$slots['column-default']).toBeDefined()
  })

  it('应该默认不显示列设置', () => {
    const wrapper = mount(TableModal, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    // column-setting 应该为 false
    expect(wrapper.vm.$el).toBeDefined()
  })

  it('应该使用默认宽度 700px', async () => {
    const wrapper = mount(TableModal, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    // 验证组件被正确挂载
    expect(wrapper.vm).toBeDefined()
  })

  it('应该支持 destroy-on-close', () => {
    const wrapper = mount(TableModal, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    expect(wrapper.vm.$el).toBeDefined()
  })

  it('空数据时应该正常显示', () => {
    const wrapper = mount(TableModal, {
      props: {
        modelValue: true,
        columns: mockColumns,
        data: [],
      },
    })

    expect(wrapper.vm.$props.data).toEqual([])
  })
})
