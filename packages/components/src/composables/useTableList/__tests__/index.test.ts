import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useTableList } from '../index'

describe('useTableList', () => {
  it('应该返回正确的响应式属性', () => {
    const mockService = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const result = useTableList(mockService, { immediate: false })

    expect(result.data.value).toEqual([])
    expect(result.loading.value).toBe(false)
    expect(result.currentPage.value).toBe(1)
    expect(result.pageSize.value).toBe(10)
    expect(result.total.value).toBe(0)
    expect(typeof result.fetchData).toBe('function')
    expect(typeof result.reset).toBe('function')
  })

  it('immediate 为 true 时应该立即执行请求', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: [{ id: 1 }], total: 1 })
    useTableList(mockService, { immediate: true })

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(mockService).toHaveBeenCalled()
  })

  it('immediate 为 false 时不应该立即执行请求', () => {
    const mockService = vi.fn().mockResolvedValue({ data: [], total: 0 })
    useTableList(mockService, { immediate: false })

    expect(mockService).not.toHaveBeenCalled()
  })

  it('应该支持手动执行请求', async () => {
    const mockData = [{ id: 1, name: 'test' }]
    const mockService = vi.fn().mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
      return { data: mockData, total: 1 }
    })
    const { fetchData, data, loading } = useTableList(mockService, { immediate: false })

    const promise = fetchData()
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(loading.value).toBe(true)

    await promise
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(mockService).toHaveBeenCalled()
    expect(data.value).toEqual(mockData)
    expect(loading.value).toBe(false)
  })

  it('应该正确处理分页', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: [], total: 100 })
    const { changePageNo, changePageSize, currentPage, pageSize } = useTableList(mockService, { immediate: false })

    expect(currentPage.value).toBe(1)
    expect(pageSize.value).toBe(10)

    await changePageNo(2)
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(currentPage.value).toBe(2)

    changePageSize(20)
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(pageSize.value).toBe(20)
    expect(currentPage.value).toBe(1) // 改变 pageSize 应该重置页码
  })

  it('应该正确处理搜索提交', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const { search, currentPage } = useTableList(mockService, { immediate: false })

    await search.onSubmit({ keyword: 'test' })
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(currentPage.value).toBe(1) // 搜索应该重置页码
    expect(mockService).toHaveBeenCalledWith(expect.objectContaining({
      keyword: 'test',
      pageNo: 1,
      pageSize: 10,
    }))
  })

  it('应该正确处理重置', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const formRef = ref({ resetFields: vi.fn() })
    const { reset, currentPage, changePageNo } = useTableList(mockService, {
      immediate: false,
      form: formRef,
      defaultPageSize: 20,
    })

    await changePageNo(3)
    await new Promise(resolve => setTimeout(resolve, 150))

    reset()
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(currentPage.value).toBe(1)
    expect(formRef.value.resetFields).toHaveBeenCalled()
  })

  it('应该支持自定义 getData 和 getTotal', async () => {
    const mockService = vi.fn().mockResolvedValue({
      list: [{ id: 1 }],
      count: 100,
    })

    const { data, total } = useTableList(mockService, {
      getData: (res: any) => res?.list,
      getTotal: (res: any) => res?.count,
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(data.value).toEqual([{ id: 1 }])
    expect(total.value).toBe(100)
  })

  it('应该正确处理排序变化', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const { onSortChange, currentPage } = useTableList(mockService, { immediate: false })

    await onSortChange({ prop: 'name', order: 'ascending' })
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(currentPage.value).toBe(1)
    expect(mockService).toHaveBeenCalledWith(expect.objectContaining({
      sortBy: 'name',
      order: 'ascending',
    }))
  })

  it('应该支持加载下一页', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: [], total: 100 })
    const { loadNextPage, currentPage } = useTableList(mockService, { immediate: false })

    expect(currentPage.value).toBe(1)

    await loadNextPage()
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(currentPage.value).toBe(2)
  })

  it('应该支持数据合并模式', async () => {
    let count = 0
    const mockService = vi.fn().mockImplementation(async () => {
      count++
      return { data: [{ id: count }], total: 10 }
    })

    const { data, loadNextPage } = useTableList(mockService, {
      immediate: true,
      mergeData: true,
    })

    await new Promise(resolve => setTimeout(resolve, 150))
    expect(data.value).toEqual([{ id: 1 }])

    await loadNextPage()
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(data.value).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('应该支持数组格式的响应', async () => {
    const mockData = [{ id: 1 }, { id: 2 }]
    const mockService = vi.fn().mockResolvedValue(mockData)

    const { data, total } = useTableList(mockService)

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(data.value).toEqual(mockData)
    expect(total.value).toBe(2)
  })

  it('应该正确处理 defaultSearchData', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const defaultSearchData = { keyword: 'test', pageNo: 2, pageSize: 20 }

    const { currentPage, pageSize, searchData } = useTableList(mockService, {
      immediate: false,
      defaultSearchData,
    })

    expect(currentPage.value).toBe(2)
    expect(pageSize.value).toBe(20)
    expect(searchData.value).toEqual(defaultSearchData)
  })

  it('应该支持 onSearchDataChange 回调', async () => {
    const onSearchDataChange = vi.fn()
    const mockService = vi.fn().mockResolvedValue({ data: [], total: 0 })

    const { search } = useTableList(mockService, {
      immediate: false,
      onSearchDataChange,
    })

    await search.onSubmit({ keyword: 'test' })
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(onSearchDataChange).toHaveBeenCalled()
  })

  it('应该支持 onReset 回调', async () => {
    const onReset = vi.fn().mockReturnValue({ defaultValue: 'test' })
    const mockService = vi.fn().mockResolvedValue({ data: [], total: 0 })

    const { reset, searchData } = useTableList(mockService, {
      immediate: false,
      onReset,
    })

    reset()
    await nextTick()

    expect(onReset).toHaveBeenCalled()
    expect(searchData.value).toEqual({ defaultValue: 'test' })
  })

  it('应该正确生成 pagination 对象', async () => {
    const mockService = vi.fn().mockResolvedValue({ data: [], total: 100 })
    const { pagination, fetchData } = useTableList(mockService, { immediate: false })

    expect(pagination.value).toEqual({
      currentPage: 1,
      pageSize: 10,
      total: 0,
      onSizeChange: expect.any(Function),
      onCurrentChange: expect.any(Function),
    })

    await fetchData()
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(pagination.value.total).toBe(100)
  })

  it('refetchOnReset 为 false 时重置不应该触发请求', () => {
    const mockService = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const { reset } = useTableList(mockService, {
      immediate: false,
      refetchOnReset: false,
    })

    reset()

    expect(mockService).not.toHaveBeenCalled()
  })

  it('应该防止重复加载', async () => {
    const mockService = vi.fn().mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: [], total: 0 }), 100)),
    )

    const { loadNextPage, loading } = useTableList(mockService, { immediate: false })

    loadNextPage()
    await new Promise(resolve => setTimeout(resolve, 1))
    expect(loading.value).toBe(true)

    loadNextPage() // 第二次调用应该被阻止
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(mockService).toHaveBeenCalledTimes(1)
  })
})
