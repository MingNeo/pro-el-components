<script lang="ts" setup>
  import { debounce } from 'lodash-es'

  const props = withDefaults(defineProps<{
    service?: (keyword?: string) => Promise<Record<string, any>[]>
    optionNames?: { label: string, value: string | number }
    options?: Record<string, any>[]
    searchable?: boolean
    readonly?: boolean
    emptyText?: string
    modelValue?: any
  }>(), { optionNames: () => ({ label: 'name', value: 'id' }), emptyText: '暂无数据' })

  const attrs = useAttrs() as any

  const loading = ref(false)

  function formatOptions(result?: Record<string, any>[]) {
    return (result || []).map(item => ({
      ...item,
      [props.optionNames.label]: item[props.optionNames.label],
    }))
  }

  const options = ref<Record<string, any>[]>(formatOptions(props.options))

  watch(() => props.options, v => options.value = formatOptions(v))

  async function fetchData(keyword?: string) {
    if (props.service) {
      loading.value = true

      try {
        const result = await props.service(keyword)
        options.value = formatOptions(result)
      }
      catch (error) { }
      loading.value = false
    }
  }

  watchEffect(() => fetchData())

  const handleSearch = debounce((value: string) => {
    fetchData(value)
  }, 1000)

  // 查看模式下回显
  function getDisplayText() {
    if (props.modelValue) {
      if (attrs.multiple)
        return props.modelValue.map((item: string | number) => options.value.find(option => option[props.optionNames.value] === item)?.[props.optionNames.label] || item).join('；')
      return options.value.find(option => option[props.optionNames.value] === props.modelValue)?.[props.optionNames.label] || props.modelValue
    }
    return '--'
  }
</script>

<template>
  <el-select
    v-if="!readonly"
    :loading="loading"
    :model-value="modelValue"
    v-bind="$attrs"
    :field-names="optionNames"
    :filterable="false"
    v-on="searchable ? { remoteMethod: handleSearch } : {}"
  >
    <el-option
      v-for="item in options"
      :key="item[optionNames.value]"
      :label="item[optionNames.label]"
      :value="item[optionNames.value]"
    />
    <template #empty>
      {{ loading ? '' : emptyText }}
    </template>
  </el-select>
  <template v-else>
    {{ getDisplayText() }}
  </template>
</template>
