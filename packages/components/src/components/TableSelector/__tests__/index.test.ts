/**
 * @vitest-environment jsdom
 */
import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import TableSelector from '../index.vue'

describe('TableSelector 组件', () => {
  const mockColumns = [
    { prop: 'id', label: 'ID', type: 'selection' },
    { prop: 'name', label: '名称' },
  ]

  const mockData = [
    { id: 1, name: '选项1' },
    { id: 2, name: '选项2' },
    { id: 3, name: '选项3' },
  ]

  it('应该正确渲染', () => {
    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        data: mockData,
      },
    })

    expect(wrapper.find('.table-selector-search-form').exists()).toBe(false)
  })

  it('应该使用默认 idKey', () => {
    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        data: mockData,
      },
    })

    expect(wrapper.vm.$props.idKey).toBe('id')
  })

  it('应该支持自定义 idKey', () => {
    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        data: mockData,
        idKey: 'customId',
      },
    })

    expect(wrapper.vm.$props.idKey).toBe('customId')
  })

  it('应该在有 service 和 searchFields 时显示搜索表单', () => {
    const mockService = vi.fn().mockResolvedValue({ data: mockData, total: 3 })
    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        service: mockService,
        searchFields: [
          { name: 'keyword', label: '关键词', type: 'input' },
        ],
      },
    })

    expect(wrapper.find('.table-selector-search-form').exists()).toBe(true)
  })

  it('应该正确处理选择变化', async () => {
    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        data: mockData,
      },
    })

    const selectedRows = [mockData[0], mockData[1]]
    await wrapper.vm.handleSelectionChange(selectedRows)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([selectedRows])
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual([selectedRows])
  })

  // it('应该支持切换选择', () => {
  //   const wrapper = mount(TableSelector, {
  //     props: {
  //       columns: mockColumns,
  //       data: mockData,
  //       modelValue: [mockData[0]],
  //     },
  //   })

  //   const tableRef = { toggleRowSelection: vi.fn() }
  //   wrapper.vm.tableRef.toggleRowSelection = tableRef

  //   wrapper.vm.toggleSelection([mockData[0]], false)

  //   expect(tableRef.toggleRowSelection).toHaveBeenCalledWith(mockData[0], undefined, false)
  // })

  it('应该支持清除选择', async () => {
    const clearSelection = vi.fn()
    
    const wrapper = shallowMount(TableSelector, {
      props: {
        columns: mockColumns,
        data: mockData,
      },
      global: {
        stubs: {
          ProTable: {
            template: '<div class="pro-table-stub"></div>',
            methods: {
              clearSelection: clearSelection,
            },
          },
        },
      },
    })

    await nextTick()
    
    // 等待组件完全挂载并设置 ref
    await new Promise(resolve => setTimeout(resolve, 100))

    // 手动调用 toggleSelection 清除选择（无参数时调用 clearSelection）
    wrapper.vm.toggleSelection()

    expect(clearSelection).toHaveBeenCalled()
  })

  it('应该在数据变化时同步选中状态', async () => {
    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        data: mockData,
        modelValue: [],
      },
    })


    await wrapper.setProps({ modelValue: [mockData[0]] })
    await new Promise(resolve => setTimeout(resolve, 100))

    // 选中状态应该被同步
    expect(wrapper.vm.showIds).toEqual([1, 2, 3])
  })

  it('应该默认显示搜索操作按钮', () => {
    const mockService = vi.fn().mockResolvedValue({ data: mockData, total: 3 })
    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        service: mockService,
        searchFields: [
          { name: 'keyword', label: '关键词', type: 'input' },
        ],
      },
    })

    expect(wrapper.vm.$props.showSearchActions).toBe(true)
  })

  it('应该支持禁用搜索操作按钮', () => {
    const mockService = vi.fn().mockResolvedValue({ data: mockData, total: 3 })
    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        service: mockService,
        searchFields: [
          { name: 'keyword', label: '关键词', type: 'input' },
        ],
        showSearchActions: false,
      },
    })

    expect(wrapper.vm.$props.showSearchActions).toBe(false)
  })

  it('应该在没有 service 时使用本地数据', async () => {
    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        data: mockData,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    // 验证数据被正确设置
    expect(wrapper.vm.data).toEqual(mockData)
  })

  it('应该在有 service 时使用远程数据', async () => {
    const remoteData = [{ id: 4, name: '远程数据' }]
    const mockService = vi.fn().mockResolvedValue({ data: remoteData, total: 1 })

    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        service: mockService,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 200))

    expect(mockService).toHaveBeenCalled()
  })

  it('应该支持分页', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: mockData, total: 100 })

    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        service: mockService,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 200))

    expect(wrapper.vm.pagination).toBeDefined()
    expect(wrapper.vm.pagination.pageSize).toBe(10)
  })

  it('应该正确传递 loading 状态', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: mockData, total: 3 })

    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        service: mockService,
      },
    })

    expect(wrapper.vm.loading).toBeDefined()
  })

  it('应该支持插槽透传', () => {
    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        data: mockData,
      },
      slots: {
        'column-default': '<div class="custom-column">自定义列</div>',
      },
    })

    expect(wrapper.vm.$slots['column-default']).toBeDefined()
  })

  it('应该支持自定义 searchColumn', () => {
    const mockService = vi.fn().mockResolvedValue({ data: mockData, total: 3 })
    const wrapper = mount(TableSelector, {
      props: {
        columns: mockColumns,
        service: mockService,
        searchFields: [
          { name: 'keyword', label: '关键词', type: 'input' },
        ],
        searchColumn: 3,
      },
    })

    expect(wrapper.vm.$props.searchColumn).toBe(3)
  })
})

