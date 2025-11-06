<script lang="ts" setup>
import { ElOption, ElSelect } from 'element-plus'
import { debounce, uniqBy } from 'lodash-es'
import { useRequest } from 'pro-el-components'
import { onMounted, ref, watch } from 'vue'

// 定义组件属性类型
interface RemoteSelectProps {
  service: (params: Record<string, any>) => Promise<{ total: number, data: any[] }> // 远程数据请求函数
  fillBackService?: (ids: any[]) => Promise<any[]> // 远程数据回显函数
  optionNames?: { label: string, value: string | number } // 自定义字段名
  defaultOptions?: Record<string, any>[] // 默认选项
  searchInLocal?: boolean // 是否在本地搜索
  searchKey?: string // 搜索关键字字段名
  viewMode?: boolean // 是否只读
  onOptionsChanged?: (options: any[]) => void // 选项变化回调
  deps?: any // 依赖项,变化时重新加载数据
  modelValue?: any // 绑定值
  multiple?: boolean // 是否多选
}

defineOptions({
  name: 'ProRemoteSelect',
  inheritAttrs: false,
})

// 定义组件属性默认值
const props = withDefaults(defineProps<RemoteSelectProps>(), {
  optionNames: () => ({ label: 'name', value: 'id' }),
  searchKey: 'keyword',
  searchInLocal: false,
})

// 定义事件
const emit = defineEmits<{
  (e: 'loaded', options: any[]): void
  (e: 'firstLoaded', options: any[]): void
}>()

// 组件状态
const page = ref(1)
const total = ref(0)
const searchValue = ref('')
const loadedNum = ref(0)
const options = ref<Record<string, any>[]>([])

// 使用useRequest钩子处理远程请求
const { execute, isLoading } = useRequest(props.service, { immediate: false })

// 格式化选项数据
function formatOptions(result: Record<string, any>[] = []): Record<string, any>[] {
  return result.map(item => ({
    ...item,
    [`_${props.optionNames.label}`]: item[props.optionNames.label],
    [props.optionNames.label]: item[props.optionNames.label],
  }))
}

// 请求数据
async function fetchData(reset = false): Promise<void> {
  const params: Record<string, any> = { pageNo: page.value, pageSize: 10 }
  if (reset && props.searchKey)
    params[props.searchKey] = searchValue.value

  try {
    const result = await execute(params)
    const data = formatOptions(result?.data)
    options.value = reset ? data : uniqBy([...options.value, ...data].reverse(), props.optionNames.value).reverse()
    props.onOptionsChanged?.(options.value)
    total.value = result?.total ?? 0
    emit('loaded', options.value)
    if (loadedNum.value === 0)
      emit('firstLoaded', options.value)
    loadedNum.value++
  }
  catch (error) {
    console.error('RemoteSelect fetchData error', error)
  }
}

// 初始化默认选项并加载数据
onMounted(() => {
  options.value = formatOptions(props.defaultOptions)
  fetchData()
})

// 监听值变化,处理回显
watch(() => props.modelValue, async (val) => {
  const value = val !== undefined ? (props.multiple ? val : [val]) : []

  if (value.length) {
    const result = await props.fillBackService?.(value) || []
    options.value = uniqBy([...options.value, ...formatOptions(result)], props.optionNames.value)
  }
}, { immediate: true })

// 监听依赖项变化,重新加载数据
watch(() => props.deps, () => fetchData(true))

// 滚动加载下一页
const handleScroll = debounce(() => {
  const select = document.querySelector('.el-select-dropdown__wrap')
  if (select && select.scrollHeight - select.scrollTop === select.clientHeight && options.value.length < total.value) {
    page.value++
    fetchData()
  }
}, 500, { leading: true, trailing: false })

// 延迟搜索
const dispatchSearch = debounce(() => {
  page.value = 1
  fetchData(true)
}, 1000)

// 处理搜索
function handleSearch(value: string): void {
  searchValue.value = value
  if (!props.searchInLocal)
    dispatchSearch()
}

// 获取显示文本
function getDisplayText(): string {
  if (!props.modelValue)
    return '-无-'
  if (props.multiple) {
    return props.modelValue.map((item: string | number) =>
      options.value.find(option => option[props.optionNames.value] === item)?.[props.optionNames.label] || item,
    ).join('；')
  }
  return options.value.find(option => option[props.optionNames.value] === props.modelValue)?.[props.optionNames.label] || props.modelValue
}
</script>

<template>
  <ElSelect
    v-if="!viewMode"
    :model-value="modelValue"
    :multiple="multiple"
    v-bind="$attrs"
    :loading="isLoading"
    :remote="!searchInLocal"
    :remote-method="handleSearch"
    @popup-scroll="handleScroll"
  >
    <ElOption
      v-for="item in options"
      :key="item[optionNames.value]"
      :label="item[optionNames.label]"
      :value="item[optionNames.value]"
    />
    <template #empty>
      {{ isLoading ? '' : '无数据' }}
    </template>
  </ElSelect>
  <template v-else>
    {{ getDisplayText() }}
  </template>
</template>
