import { computed, isRef, nextTick, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { debounce } from 'lodash-es'
import useRequest from '../useRequest'

export type UseTableListService = (...args: any) => Promise<any>
export interface UseTableListOptions {
  form?: Ref<any>
  defaultSearchData?: Record<string, any>
  defaultPageSize?: number
  immediate?: boolean
  debounceTime?: number
  getTotal?: (data: any) => number
  getDataFromResponse?: (data: any) => ListItemData[]
  onReset?: () => any
  onSearchDataChange?: (value: any, page: any) => void
  mergeData?: boolean
}

export interface ListItemData {
  [key: string]: any
}

const _dataHandlers = {
  getTotal: (data: any) => data?.value?.total || 0,
  getData: (data: any) => data?.value?.data || [],
}

export default function useListData(
  service: UseTableListService,
  {
    form,
    immediate = true,
    defaultPageSize = 10,
    defaultSearchData = {},
    getTotal = _dataHandlers.getTotal,
    getDataFromResponse = _dataHandlers.getData,
    onReset = () => undefined,
    onSearchDataChange = (_value: any, _page: any) => { },
    debounceTime = 100,
    mergeData = false,
  }: UseTableListOptions = {},
) {
  const formRef = isRef(form) ? form : ref()

  const pageNo = ref(defaultSearchData.pageNo || 1)
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

  const total = computed(() => getTotal(data))
  const listData: Ref<ListItemData[]> = computed(() => {
    const newData = getDataFromResponse(data) as ListItemData[]
    return mergeData ? [...listData.value, ...newData] : newData
  })

  const fetchDataSimple = async (params: Record<string, any> = {}, merge = true) => {
    updateSearchData({ ...params }, merge)
    await nextTick()
    execute({ ...searchData.value, pageNo: pageNo.value, pageSize: pageSize.value })
  }

  // 定义搜索函数
  const fetchData = debounce(fetchDataSimple, debounceTime, { leading: true, trailing: false })

  function bindFormState() {
    // 初始化时将搜索数据绑定到表单组件
    if (formRef) {
      Object.keys(searchData.value).forEach((key) => {
        try {
          formRef.value[key] = searchData.value[key]
        }
        catch (error) {
        }
      })
    }
  }

  bindFormState()

  const onSortChange = ({ column, prop, order }: any) => {
    pageNo.value = 1
    fetchData({ sortBy: prop, order, column })
  }

  const reset = () => {
    formRef?.value?.resetFields?.()
    const params = onReset?.()
    pageNo.value = 1
    pageSize.value = +searchData.value.pageSize
    updateSearchData({ ...params })
    fetchData(searchData.value)
  }

  const loadNextPage = () => {
    pageNo.value += 1
    fetchData()
  }

  const onSizeChange = (size: number) => {
    pageSize.value = size
    pageNo.value = 1
    fetchData()
  }

  const onCurrentChange = (page: number) => {
    pageNo.value = page
    return fetchData()
  }

  onMounted(() => {
    if (immediate)
      fetchData()
  })

  return {
    searchFormRef: formRef,
    listData,
    searchState,
    searchData,
    loading: isLoading,
    fetchData, // 默认请求方法使用debounce处理
    fetchDataSimple, // 不进行debounce处理
    loadNextPage,

    currentPage: pageNo,
    pageSize,
    total,
    onSizeChange,
    onCurrentChange,

    onSortChange,
    reset,
    search: {
      submit: (params: any = {}) => {
        pageNo.value = 1
        return fetchData(params)
      },
      reset,
    },
  }
}
