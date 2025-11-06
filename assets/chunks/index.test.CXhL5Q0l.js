const n=`/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import TableForm from '../index.vue'

describe('tableForm 组件', () => {
  const mockColumns = [
    { prop: 'name', label: '名称', type: 'input' },
    { prop: 'age', label: '年龄', type: 'number' },
  ]

  const mockData = [
    { id: '1', name: '张三', age: 25 },
    { id: '2', name: '李四', age: 30 },
  ]

  it('应该正确渲染', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    expect(wrapper.find('.pro-table-form').exists()).toBe(true)
  })

  it('应该正确显示数据', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    expect(wrapper.vm.tableData.length).toBe(2)
  })

  it('应该自动为没有 id 的数据项添加 id', () => {
    const dataWithoutId = [
      { name: '张三', age: 25 },
      { name: '李四', age: 30 },
    ]

    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: dataWithoutId,
        propPrefix: 'tableForm',
      },
    })

    wrapper.vm.tableData.forEach((item) => {
      expect(item.id).toBeDefined()
      expect(typeof item.id).toBe('string')
    })
  })

  it('应该为每行数据添加 _sortIndex', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    wrapper.vm.tableData.forEach((item, index) => {
      expect(item._sortIndex).toBe(index)
    })
  })

  it('非 viewMode 时应该显示操作列', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        viewMode: false,
        propPrefix: 'tableForm',
      },
    })

    const computedColumns = wrapper.vm.columns
    const actionsColumn = computedColumns.find((col: any) => col.prop === 'actions')

    expect(actionsColumn).toBeDefined()
  })

  it('viewMode 时不应该显示操作列', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        viewMode: true,
        propPrefix: 'tableForm',
      },
    })

    const computedColumns = wrapper.vm.columns
    const actionsColumn = computedColumns.find((col: any) => col.prop === 'actions')

    expect(actionsColumn).toBeUndefined()
  })

  it('非 viewMode 时应该显示底部操作区', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        viewMode: false,
        propPrefix: 'tableForm',
      },
    })

    expect(wrapper.find('.pro-table-form-footer').exists()).toBe(true)
  })

  it('viewMode 时不应该显示底部操作区', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        viewMode: true,
        propPrefix: 'tableForm',
      },
    })

    expect(wrapper.find('.pro-table-form-footer').exists()).toBe(false)
  })

  it('应该正确添加行', async () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    const initialLength = wrapper.vm.tableData.length

    await wrapper.vm.addRow()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeTruthy()

    const newData = wrapper.emitted('update:modelValue')![0][0] as any[]
    expect(newData.length).toBe(initialLength + 1)
  })

  it('应该正确删除行', async () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    const initialLength = wrapper.vm.tableData.length

    await wrapper.vm.deleteRow(0)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeTruthy()

    const newData = wrapper.emitted('update:modelValue')![0][0] as any[]
    expect(newData.length).toBe(initialLength - 1)
  })

  it('删除行后应该更新 _sortIndex', async () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    await wrapper.vm.deleteRow(0)

    const newData = wrapper.emitted('update:modelValue')![0][0] as any[]
    newData.forEach((item, index) => {
      expect(item._sortIndex).toBe(index)
    })
  })

  it('应该正确处理表单项变更', async () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    const newValues = { name: '王五', age: 35 }
    await wrapper.vm.handleFormItemsChange(newValues, 0)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeTruthy()

    const newData = wrapper.emitted('update:modelValue')![0][0] as any[]
    expect(newData[0]).toMatchObject(newValues)
  })

  it('应该支持批量添加多行', async () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    wrapper.vm.addRowNumber = 3
    const initialLength = wrapper.vm.tableData.length

    await wrapper.vm.addRow()

    const newData = wrapper.emitted('update:modelValue')![0][0] as any[]
    expect(newData.length).toBe(initialLength + 3)
  })

  it('应该显示当前总行数', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    expect(wrapper.text()).toContain(\`当前总行数：\${mockData.length}\`)
  })

  it('应该支持自定义 propPrefix', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'items',
      },
    })

    expect(wrapper.vm.$props.propPrefix).toBe('items')
  })

  it('应该正确透传属性', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
      attrs: {
        'data-testid': 'table-form',
      },
    })

    expect(wrapper.vm.$attrs['data-testid']).toBe('table-form')
  })

  it('操作列应该有删除按钮配置', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        viewMode: false,
        propPrefix: 'tableForm',
      },
    })

    const computedColumns = wrapper.vm.columns
    const actionsColumn = computedColumns.find((col: any) => col.prop === 'actions')

    expect(actionsColumn?.actions).toBeDefined()
    expect(actionsColumn?.actions[0].confirm).toBe(true)
    expect(actionsColumn?.actions[0].confirmText).toBe('确认删除?')
  })

  it('应该暴露 addRow 和 deleteRow 方法', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    expect(typeof wrapper.vm.addRow).toBe('function')
    expect(typeof wrapper.vm.deleteRow).toBe('function')
  })

  it('空数据时应该正确显示', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: [],
        propPrefix: 'tableForm',
      },
    })

    expect(wrapper.vm.tableData.length).toBe(0)
    expect(wrapper.text()).toContain('当前总行数：0')
  })

  it('应该支持自定义渲染', () => {
    const columnsWithCustomRender = [
      {
        prop: 'name',
        label: '名称',
        type: 'input',
        customRender: (row: any) => \`姓名: \${row.name}\`,
      },
    ]

    const wrapper = mount(TableForm, {
      props: {
        columns: columnsWithCustomRender,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    expect(wrapper.vm.columns.length).toBeGreaterThan(0)
  })

  it('addRowNumber 默认值应该为 1', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    expect(wrapper.vm.addRowNumber).toBe(1)
  })

  it('应该显示添加行按钮', () => {
    const wrapper = mount(TableForm, {
      props: {
        columns: mockColumns,
        modelValue: mockData,
        propPrefix: 'tableForm',
      },
    })

    expect(wrapper.find('.add-row-btn').exists()).toBe(true)
  })
})
`;export{n as default};
