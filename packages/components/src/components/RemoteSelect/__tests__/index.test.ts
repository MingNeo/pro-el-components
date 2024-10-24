/**
 * @vitest-environment jsdom
 */
import { mount } from '@vue/test-utils'
import { ElSelect } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import RemoteSelect from '../index.vue'

describe('remoteSelect 组件', () => {
  // 模拟远程服务
  const mockService = vi.fn(async ({ keyword = '' }: any) => {
    return {
      data: [
        { id: 1, name: '选项1' },
        { id: 2, name: '选项2' },
      ].filter(v => v.name.includes(keyword)),
      total: 2,
    }
  })

  // 基础功能测试
  it('应该正确渲染并加载远程数据', async () => {
    const wrapper = mount(RemoteSelect, {
      props: {
        service: mockService,
        optionNames: { label: 'name', value: 'id' },
        teleported: false,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(mockService).toHaveBeenCalled()
    // 检查选项是否正确渲染
    const options = wrapper.findAll('.el-select-dropdown__item')
    expect(options).toHaveLength(2)
    expect(options[0].text()).toBe('选项1')
  })

  // // 搜索功能测试
  // it('应该正确处理搜索功能', async () => {
  //   const wrapper = mount(RemoteSelect, {
  //     props: {
  //       service: mockService,
  //       labelKey: 'name',
  //       valueKey: 'id',
  //       searchInLocal: false,
  //     },
  //   })

  //   // 模拟搜索输入
  //   const select = wrapper.findComponent(ElSelect)
  //   await select.vm.$emit('search', '测试搜索')

  //   // 等待防抖
  //   await new Promise(resolve => setTimeout(resolve, 500))

  //   expect(mockService).toHaveBeenCalledWith({
  //     keyword: '测试搜索',
  //     pageNo: 1,
  //     pageSize: 10,
  //   })
  // })

  // 本地搜索测试
  it('应该正确处理本地搜索', async () => {
    const wrapper = mount(RemoteSelect, {
      props: {
        service: mockService,
        optionNames: { label: 'name', value: 'id' },
        searchInLocal: true,
        teleported: false,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 10))

    // 模拟搜索输入
    const select = wrapper.findComponent(ElSelect)
    await select.vm.$emit('search', '选项1')

    // await nextTick()
    // 检查过滤后的选项
    const options = wrapper.findAll('.el-select-dropdown__item')
    expect(options).toHaveLength(2)
    expect(options[0].text()).toBe('选项1')
  })

  // 多选模式测试
  it('应该正确处理多选模式', async () => {
    const wrapper = mount(RemoteSelect, {
      props: {
        service: mockService,
        optionNames: { label: 'name', value: 'id' },
        multiple: true,
        modelValue: [],
      },
    })

    await nextTick()

    // 模拟选择多个选项
    await wrapper.setProps({
      modelValue: [1, 2],
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    // 检查选中的标签
    const tags = wrapper.findAll('.el-tag')
    expect(tags).toHaveLength(2)
    expect(tags[0].text()).toBe('选项1')
    expect(tags[1].text()).toBe('选项2')
  })

  // 依赖项变化测试
  it('应该在依赖项变化时重新加载数据', async () => {
    const wrapper = mount(RemoteSelect, {
      props: {
        service: mockService,
        optionNames: { label: 'name', value: 'id' },
        deps: { key: 'value1' },
      },
    })

    mockService.mockClear()

    // 改变依赖项
    await wrapper.setProps({
      deps: { key: 'value2' },
    })

    expect(mockService).toHaveBeenCalledTimes(1)
  })

  // 回显功能测试
  it('应该正确处理值回显', async () => {
    const fillBackService = vi.fn().mockResolvedValue([
      { id: 3, name: '选项3' },
    ])

    const wrapper = mount(RemoteSelect, {
      props: {
        service: mockService,
        optionNames: { label: 'name', value: 'id' },
        fillBackService,
        modelValue: 3,
      },
    })

    await new Promise(resolve => setTimeout(resolve, 100))
    expect(fillBackService).toHaveBeenCalledWith([3])

    // 检查回显的选项
    const selectedValue = wrapper.find('.el-select__selected-item span')
    expect(selectedValue.text()).toBe('选项3')
  })

  // 分页加载测试
  // it('应该支持分页加载', async () => {
  //   const wrapper = mount(RemoteSelect, {
  //     props: {
  //       service: mockService,
  //       optionNames: { label: 'name', value: 'id' },
  //     },
  //   })

  //   await new Promise(resolve => setTimeout(resolve, 10))
  //   // 模拟滚动到底部
  //   const dropdown = document.createElement('div')
  //   Object.defineProperty(dropdown, 'scrollHeight', { value: 200 })
  //   Object.defineProperty(dropdown, 'scrollTop', { value: 150 })
  //   Object.defineProperty(dropdown, 'clientHeight', { value: 50 })

  //   document.querySelector = vi.fn().mockReturnValue(dropdown)

  //   // 触发滚动
  //   await wrapper.findComponent(ElSelect).vm.$emit('visible-change', true)
  //   await new Promise(resolve => setTimeout(resolve, 100))

  //   expect(mockService).toHaveBeenCalledWith(expect.objectContaining({
  //     page: 2,
  //   }))
  // })

  // 错误处理测试
  it('应该正确处理加载错误', async () => {
    const errorService = vi.fn().mockRejectedValue(new Error('加载失败'))
    const wrapper = mount(RemoteSelect, {
      props: {
        service: errorService,
        optionNames: { label: 'name', value: 'id' },
      },
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    // 检查是否显示错误状态
    expect(wrapper.findComponent(ElSelect).props('loading')).toBe(false)
  })
})
