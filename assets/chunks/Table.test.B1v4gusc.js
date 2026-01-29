const n=`/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { ElPagination } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import ButtonActions from '../../ButtonActions/index.vue'
import StatusText from '../../StatusText/index.vue'
import ColumnSetting from '../ColumnSetting.vue'
import Table from '../index.vue'

describe('table 组件', () => {
  const baseColumns = [
    { prop: 'name', label: '姓名' },
    { prop: 'age', label: '年龄' },
    { prop: 'actions', label: '操作', columnType: 'actions', actions: [{ text: '编辑', onClick: vi.fn() }] },
  ]
  const baseData = [
    { name: '张三', age: 18 },
    { name: '李四', age: 20 },
  ]

  // 基础渲染测试
  it('应该正确渲染基础表格', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: baseColumns,
        data: baseData,
      },
    })

    await nextTick()
    await nextTick()
    // 检查表头
    const headers = wrapper.findAll('thead th')
    expect(headers).toHaveLength(3)
    expect(headers[0].text()).toBe('姓名')
    expect(headers[1].text()).toBe('年龄')

    // 检查数据行
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0].findAll('td')[0].text()).toBe('张三')
    expect(rows[0].findAll('td')[1].text()).toBe('18')
  })

  // 列设置功能测试
  it('应该正确处理列设置功能', async () => {
    const wrapper = mount(Table, {
      props: {
        columns: baseColumns,
        data: baseData,
        columnSetting: true,
        tableId: 'test-table',
      },
    })

    await nextTick()
    await nextTick()
    // 检查列设置组件是否存在
    expect(wrapper.findComponent(ColumnSetting).exists()).toBe(true)

    expect(wrapper.findAll('thead th')).toHaveLength(3)

    // 模拟保存列设置
    await (wrapper.vm as any).handleSaveColumnKeys([
      { prop: 'name', visible: true },
      { prop: 'age', visible: false },
    ])

    await nextTick()
    // 检查隐藏列后的表头数量
    expect(wrapper.findAll('thead th')).toHaveLength(2)
  })

  // 日期格式化测试
  it('应该正确渲染日期格式', async () => {
    const dateColumns = [
      { prop: 'date', label: '日期', renderAs: 'date' },
    ]
    const dateData = [{ date: '2024-03-15' }]

    const wrapper = mount(Table, {
      props: {
        columns: dateColumns,
        data: dateData,
        format: 'YYYY-MM-DD',
      },
    })

    await nextTick()
    await nextTick()
    expect(wrapper.find('td').text()).toBe('2024-03-15')
  })

  // 文件链接渲染测试
  it('应该正确渲染文件链接', async () => {
    const fileColumns = [
      { prop: 'file', label: '文件', renderAs: 'file' },
    ]
    const fileData = [
      {
        file: [
          { url: 'http://example.com/file.pdf', name: '测试文件' },
          { url: 'http://example.com/file2.pdf', name: '测试文件2' },
        ],
      },
    ]

    const wrapper = mount(Table, {
      props: {
        columns: fileColumns,
        data: fileData,
      },
    })

    await nextTick()
    await nextTick()
    const fileLinks = wrapper.findAll('.el-table__cell a')
    expect(fileLinks).toHaveLength(2)
    expect(fileLinks[0].attributes('href')).toBe('http://example.com/file.pdf')
    expect(fileLinks[0].text()).toBe('测试文件')
  })

  // 状态文本渲染测试
  it('应该正确渲染状态文本', async () => {
    const statusColumns = [{
      prop: 'status',
      label: '状态',
      renderAs: 'enum',
      fieldProps: {
        options: [
          { value: 1, label: '正常', status: 'success' },
          { value: 0, label: '禁用', status: 'error' },
        ],
      },
    }]
    const statusData = [
      { status: 1 },
      { status: 0 },
    ]

    const wrapper = mount(Table, {
      props: {
        columns: statusColumns,
        data: statusData,
      },
    })

    await nextTick()
    await nextTick()
    const statusTexts = wrapper.findAllComponents(StatusText)
    expect(statusTexts).toHaveLength(2)
    expect(statusTexts[0].props('status')).toBe('success')
    expect(statusTexts[1].props('status')).toBe('error')
  })

  // 自定义渲染函数测试
  it('应该正确处理自定义渲染函数', async () => {
    const customColumns = [{
      prop: 'custom',
      label: '自定义',
      customRender: (row: any) => \`自定义\${row.value}\`,
    }]
    const customData = [{ value: 'test' }]

    const wrapper = mount(Table, {
      props: {
        columns: customColumns,
        data: customData,
      },
    })

    await nextTick()
    await nextTick()
    expect(wrapper.find('td').text()).toBe('自定义test')
  })

  // 操作列测试
  it('应该正确渲染操作列并处理点击事件', async () => {
    const mockClick = vi.fn()
    const actionsColumn = {
      prop: 'actions',
      label: '操作',
      columnType: 'actions',
      actions: [
        { text: '编辑', onClick: mockClick },
      ],
    }

    const wrapper = mount(Table, {
      props: {
        columns: [actionsColumn],
        data: [{ id: 1 }],
      },
    })

    await nextTick()
    await nextTick()

    const actionButton = wrapper.findComponent(ButtonActions)?.find('button')
    expect(actionButton.exists()).toBe(true)

    await actionButton.trigger('click')
    expect(mockClick).toHaveBeenCalled()
  })

  // 分页功能测试
  it('应该正确处理分页', async () => {
    const onPageChange = vi.fn()
    const onSizeChange = vi.fn()

    const wrapper = mount(Table, {
      props: {
        columns: baseColumns,
        data: baseData,
        pagination: {
          'total': 100,
          'currentPage': 1,
          'pageSize': 10,
          'onUpdate:currentPage': onPageChange,
          'onUpdate:pageSize': onSizeChange,
        },
      },
    })

    await nextTick()
    await nextTick()
    // 检查分页组件是否存在
    const pagination = wrapper.findComponent(ElPagination)
    expect(pagination.exists()).toBe(true)

    // 模拟页码改变
    await pagination.vm.$emit('update:currentPage', 2)
    expect(onPageChange).toHaveBeenCalledWith(2)

    // 模拟每页条数改变
    await pagination.vm.$emit('update:pageSize', 20)
    expect(onSizeChange).toHaveBeenCalledWith(20)
  })

  // 排序功能测试
  it('应该正确处理排序', async () => {
    const onSortChange = vi.fn()
    const sortColumns = [
      { prop: 'age', label: '年龄', sortable: true },
    ]

    const wrapper = mount(Table, {
      props: {
        columns: sortColumns,
        data: baseData,
        onSortChange,
      },
    })

    await nextTick()
    await nextTick()

    // 模拟排序
    await wrapper.findComponent({ name: 'ElTable' }).vm.$emit('sort-change', {
      prop: 'age',
      order: 'ascending',
    })

    expect(onSortChange).toHaveBeenCalledWith({
      prop: 'age',
      order: 'ascending',
    })
  })

  // 搜索表单集成测试
  describe('搜索表单集成', () => {
    const searchColumns = [
      { prop: 'name', label: '姓名', search: true },
      {
        prop: 'status',
        label: '状态',
        search: true,
        renderAs: 'enum',
        fieldProps: {
          options: [
            { value: 1, label: '启用' },
            { value: 0, label: '禁用' },
          ],
        },
      },
      { prop: 'createdAt', label: '创建时间', renderAs: 'date', search: true },
      { prop: 'age', label: '年龄' }, // 不可搜索
    ]

    it('当 searchForm 为 true 时应该渲染搜索表单', async () => {
      const wrapper = mount(Table, {
        props: {
          columns: searchColumns,
          data: baseData,
          searchForm: true,
        },
      })

      await nextTick()
      await nextTick()

      // 检查搜索表单是否存在
      expect(wrapper.find('.pro-search-form').exists()).toBe(true)
    })

    it('应该从 columns 中自动提取 search: true 的字段', async () => {
      const wrapper = mount(Table, {
        props: {
          columns: searchColumns,
          data: baseData,
          searchForm: true,
        },
      })

      await nextTick()
      await nextTick()

      // 应该有 3 个搜索字段（name, status, createdAt）
      const formItems = wrapper.findAll('.pro-search-form .el-form-item')
      // 包含操作按钮的 form-item，所以至少有 3 个
      expect(formItems.length).toBeGreaterThanOrEqual(3)
    })

    it('当没有 search: true 的字段时不应该渲染搜索表单', async () => {
      const wrapper = mount(Table, {
        props: {
          columns: [
            { prop: 'name', label: '姓名' },
            { prop: 'age', label: '年龄' },
          ],
          data: baseData,
          searchForm: true,
        },
      })

      await nextTick()
      await nextTick()

      // 搜索表单不应该存在
      expect(wrapper.find('.pro-search-form').exists()).toBe(false)
    })

    it('应该正确触发 search 事件', async () => {
      const onSearch = vi.fn()
      const wrapper = mount(Table, {
        props: {
          columns: searchColumns,
          data: baseData,
          searchForm: true,
          onSearch,
        },
      })

      await nextTick()
      await nextTick()

      // 触发搜索表单的 submit 事件
      const searchForm = wrapper.findComponent({ name: 'ProSearchForm' })
      expect(searchForm.exists()).toBe(true)

      await searchForm.vm.$emit('submit', { name: 'test' })
      expect(onSearch).toHaveBeenCalledWith({ name: 'test' })
    })

    it('应该正确触发 searchReset 事件', async () => {
      const onSearchReset = vi.fn()
      const wrapper = mount(Table, {
        props: {
          columns: searchColumns,
          data: baseData,
          searchForm: true,
          onSearchReset,
        },
      })

      await nextTick()
      await nextTick()

      // 触发搜索表单的 reset 事件
      const searchForm = wrapper.findComponent({ name: 'ProSearchForm' })
      await searchForm.vm.$emit('reset')
      expect(onSearchReset).toHaveBeenCalled()
    })

    it('应该支持自定义 searchForm 配置', async () => {
      const wrapper = mount(Table, {
        props: {
          columns: searchColumns,
          data: baseData,
          searchForm: {
            column: 4,
            collapsible: true,
          },
        },
      })

      await nextTick()
      await nextTick()

      expect(wrapper.find('.pro-search-form').exists()).toBe(true)
    })

    it('应该支持直接传入 fields 覆盖自动提取', async () => {
      const customFields = [
        { prop: 'keyword', label: '关键词', type: 'input' },
      ]

      const wrapper = mount(Table, {
        props: {
          columns: searchColumns,
          data: baseData,
          searchForm: {
            fields: customFields,
          },
        },
      })

      await nextTick()
      await nextTick()

      expect(wrapper.find('.pro-search-form').exists()).toBe(true)
    })

    it('应该根据 renderAs 自动推断搜索字段类型', async () => {
      const wrapper = mount(Table, {
        props: {
          columns: [
            { prop: 'date', label: '日期', renderAs: 'date', search: true },
            {
              prop: 'status',
              label: '状态',
              renderAs: 'enum',
              search: true,
              fieldProps: { options: [{ value: 1, label: '启用' }] },
            },
          ],
          data: [],
          searchForm: true,
        },
      })

      await nextTick()
      await nextTick()

      // 验证搜索表单存在
      expect(wrapper.find('.pro-search-form').exists()).toBe(true)
    })
  })
})
`;export{n as default};
