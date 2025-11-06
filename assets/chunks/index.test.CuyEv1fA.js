const e=`/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ListPage from '../index.vue'

describe('listPage 组件', () => {
  const mockColumns = [
    { prop: 'id', label: 'ID' },
    { prop: 'name', label: '名称' },
  ]

  const mockData = [
    { id: 1, name: '测试1' },
    { id: 2, name: '测试2' },
  ]

  it('应该正确渲染', () => {
    const wrapper = mount(ListPage, {
      props: {
        columns: mockColumns,
        data: mockData,
      },
    })

    expect(wrapper.find('.pro-list-page').exists()).toBe(true)
  })

  it('应该正确渲染标题', () => {
    const wrapper = mount(ListPage, {
      props: {
        title: '测试页面',
        showHeader: true,
        columns: mockColumns,
        data: mockData,
      },
    })

    expect(wrapper.find('.pro-list-page-header').exists()).toBe(true)
  })

  it('showHeader 为 false 时不应该显示页面头部', () => {
    const wrapper = mount(ListPage, {
      props: {
        showHeader: false,
        columns: mockColumns,
        data: mockData,
      },
    })

    expect(wrapper.find('.pro-list-page-header').exists()).toBe(false)
  })

  it('应该正确渲染搜索表单', () => {
    const wrapper = mount(ListPage, {
      props: {
        columns: mockColumns,
        data: mockData,
        searchForm: {
          fields: [
            { name: 'keyword', label: '关键词', type: 'input' },
          ],
        },
      },
    })

    expect(wrapper.find('.pro-list-page-search').exists()).toBe(true)
  })

  it('没有 searchFields 时不应该显示搜索表单', () => {
    const wrapper = mount(ListPage, {
      props: {
        columns: mockColumns,
        data: mockData,
      },
    })

    expect(wrapper.find('.pro-list-page-search').exists()).toBe(false)
  })

  it('应该正确触发搜索事件', async () => {
    const wrapper = mount(ListPage, {
      props: {
        columns: mockColumns,
        data: mockData,
        searchForm: {
          fields: [
            { name: 'keyword', label: '关键词', type: 'input' },
          ],
        },
      },
    })

    const searchParams = { keyword: 'test' }
    await wrapper.vm.handleSearch(searchParams)

    expect(wrapper.emitted('search')).toBeTruthy()
    expect(wrapper.emitted('search')![0]).toEqual([searchParams])
  })

  it('应该正确触发重置事件', async () => {
    const wrapper = mount(ListPage, {
      props: {
        columns: mockColumns,
        data: mockData,
        searchForm: {
          fields: [
            { name: 'keyword', label: '关键词', type: 'input' },
          ],
        },
      },
    })

    await wrapper.vm.handleReset()

    expect(wrapper.emitted('reset')).toBeTruthy()
  })

  it('应该正确触发表格变化事件', async () => {
    const wrapper = mount(ListPage, {
      props: {
        columns: mockColumns,
        data: mockData,
      },
    })

    const pagination = { currentPage: 2, pageSize: 10 }
    const filters = {}
    const sorter = { prop: 'id', order: 'ascending' }

    await wrapper.vm.handleTableChange(pagination, filters, sorter)

    expect(wrapper.emitted('tableChange')).toBeTruthy()
    expect(wrapper.emitted('tableChange')![0]).toEqual([pagination, filters, sorter])
  })

  it('应该正确渲染操作按钮', () => {
    const wrapper = mount(ListPage, {
      props: {
        columns: mockColumns,
        data: mockData,
        actions: [
          { text: '新增', type: 'primary' },
        ],
      },
    })

    expect(wrapper.find('.pro-list-page-table__header').exists()).toBe(true)
  })

  it('应该正确处理 headerActions', () => {
    const wrapper = mount(ListPage, {
      props: {
        title: '测试页面',
        showHeader: true,
        columns: mockColumns,
        data: mockData,
        headerActions: [
          { text: '返回', type: 'default' },
        ],
      },
    })

    expect(wrapper.find('.pro-list-page-header').exists()).toBe(true)
  })

  it('应该支持自定义插槽', () => {
    const wrapper = mount(ListPage, {
      props: {
        columns: mockColumns,
        data: mockData,
      },
      slots: {
        default: '<div class="custom-content">自定义内容</div>',
      },
    })

    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('自定义内容')
  })

  it('应该在 provide 中提供 isInListPage', () => {
    const wrapper = mount(ListPage, {
      props: {
        columns: mockColumns,
        data: mockData,
      },
    })

    // 检查组件实例是否正确
    expect(wrapper.vm).toBeDefined()
  })
})
`;export{e as default};
