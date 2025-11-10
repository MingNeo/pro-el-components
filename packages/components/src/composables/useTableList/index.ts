import type { Ref } from 'vue'
import { debounce } from 'lodash-es'
import { useRequest } from 'pro-el-components'
import { computed, isRef, nextTick, ref } from 'vue'

export type UseTableListService = (params: { pageNo: number, pageSize: number, [key: string]: any }) => Promise<{ data: any, total?: number } | any[]>

export interface TableListItemData {
  [key: string]: any
}
export interface UseTableListOptions<T extends TableListItemData> {
  searchForm?: Ref<any>
  defaultSearchData?: Record<string, any>
  defaultPageNo?: number
  defaultPageSize?: number
  immediate?: boolean
  debounceTime?: number
  getTotal?: (data: any) => number
  getData?: (data: any) => T[]
  onReset?: () => any
  onSearchDataChange?: (value: any, page: any) => void
  mergeData?: boolean
  refetchOnReset?: boolean
}

export function useTableList<T extends TableListItemData>(
  service: UseTableListService,
  {
    searchForm,
    immediate = true,
    defaultPageNo = 1,
    defaultPageSize = 10,
    defaultSearchData = {},
    getTotal = (data: any) => Array.isArray(data) ? data.length : data?.total || 0,
    getData = (data: any) => Array.isArray(data) ? data : data?.data || [],
    onReset = () => undefined,
    onSearchDataChange = (_value: any, _page: any) => { },
    debounceTime = 100,
    mergeData = false,
    refetchOnReset = true,
  }: UseTableListOptions<T> = {},
) {
  const searchFormRef = isRef(searchForm) ? searchForm : ref()

  const pageNo = ref(+(defaultSearchData.pageNo || defaultPageNo))
  const pageSize = ref(+(defaultSearchData.pageSize || defaultPageSize))

  // searchState用于存储搜索表单实时的数据
  const searchState = ref<Record<string, any>>({})
  // searchState用于存储请求所用的数据，仅触发搜索按钮或重置时会更新
  const searchData = ref<Record<string, any>>({ ...defaultSearchData })

  const updateSearchData = (value: Record<string, any>, merge = false) => {
    searchData.value = merge ? { ...searchData.value, ...value } : value
    onSearchDataChange?.(searchData.value, { pageNo: pageNo.value, pageSize: pageSize.value })
  }

  const { data, isLoading, execute } = useRequest(service, { immediate: false })

  const total = computed(() => getTotal(data?.value))
  const listData: Ref<T[]> = computed((oldListData = []) => {
    const newData = getData(data?.value) || [] as T[]
    return mergeData ? [...oldListData, ...newData] : newData
  })

  const fetchDataSimple = async (params: Record<string, any> = {}, merge = true) => {
    updateSearchData({ ...searchState.value, ...params }, merge)
    await nextTick()
    execute({ ...searchData.value, pageNo: pageNo.value, pageSize: pageSize.value, ...params })
  }

  const fetchDataDebounce = debounce(fetchDataSimple, debounceTime, { leading: true, trailing: false })
  const fetchData = (params: Record<string, any> = {}, { mergeParams = true, debounce = true } = {}) => debounce ? fetchDataDebounce(params, mergeParams) : fetchDataSimple(params, mergeParams)

  function bindFormData() {
    // 初始化时将搜索数据绑定到表单组件
    if (searchFormRef.value) {
      Object.keys(searchData.value).forEach((key) => {
        try {
          searchFormRef.value[key] = searchData.value[key]
        }
        catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }
      })
    }
  }

  bindFormData()

  const onSortChange = ({ column, prop, order }: any) => {
    pageNo.value = 1
    fetchData({ prop, sortBy: prop, order, column })
  }

  const reset = async () => {
    const params = await onReset?.() || {}
    if (searchFormRef?.value?.resetFields)
      searchFormRef?.value?.resetFields?.()

    searchState.value = { ...params }
    pageNo.value = 1
    pageSize.value = +searchData.value.pageSize
    updateSearchData({ ...params })
    if (refetchOnReset)
      fetchData(searchData.value)
  }

  const reSearch = (params: Record<string, any> = {}) => {
    pageNo.value = 1
    fetchData(params)
  }

  const loadNextPage = () => {
    if (isLoading.value)
      return
    pageNo.value += 1
    fetchData()
  }

  const changePageSize = (size: number) => {
    pageSize.value = size
    pageNo.value = 1
    fetchData()
  }

  const changePageNo = (page: number) => {
    pageNo.value = page
    return fetchData()
  }

  if (immediate)
    fetchData()

  return {
    searchFormRef,
    data: listData,
    searchState,
    searchData,
    loading: isLoading,
    currentPage: pageNo,
    pageSize,
    total,

    fetchData,
    loadNextPage,
    onSortChange,
    changePageSize,
    changePageNo,
    reSearch,
    reset,

    // 用于 ProTable 组件的 pagination 属性
    pagination: computed(() => ({
      currentPage: pageNo.value,
      pageSize: pageSize.value,
      total: total.value,
      onSizeChange: changePageSize,
      onCurrentChange: changePageNo,
    })),
    // 用于 ProTable 组件的 search 属性
    search: {
      onSubmit: reSearch,
      onReset: reset,
    },
  }
}
