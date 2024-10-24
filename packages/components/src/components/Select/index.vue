<script lang="ts" setup>
import { ElOption, ElSelect } from 'element-plus'
import { computed, ref, watch, watchEffect } from 'vue'

interface Option {
  disabled?: boolean
  [key: string]: any
}

defineOptions({
  name: 'ProSelect',
})

const props = withDefaults(defineProps<{
  service?: (keyword?: string) => Promise<Option[]>
  optionNames?: { label: string, value: string, disabled?: string }
  options?: Option[]
  searchable?: boolean
  viewMode?: boolean
  emptyText?: string
  viewModeSeparator?: string // 查看模式多个数据的分割符
  modelValue?: string | number | string[] | number[]
  multiple?: boolean
}>(), { optionNames: () => ({ label: 'label', value: 'value' }), emptyText: '暂无数据', viewModeSeparator: ', ' })

const loading = ref(false)

const options = ref<Option[]>(props.options || [])
watch(() => props.options, v => (options.value = v || []))

async function fetchData(keyword?: string) {
  if (props.service) {
    loading.value = true

    try {
      const result = await props.service(keyword)
      options.value = result
    }
    catch (error) {
      console.warn(error)
    }
    loading.value = false
  }
}

watchEffect(() => fetchData())

// 查看模式下回显
const viewText = computed(() => {
  if (props.modelValue !== undefined) {
    if (props.multiple !== undefined && props.multiple !== false)
      return (props.modelValue as string[] | number[]).map((item: string | number) => options.value.find(option => option[props.optionNames.value] === item)?.[props.optionNames.label] || item).join(props.viewModeSeparator)

    return options.value?.find(option => option[props.optionNames.value] === props.modelValue)?.[props.optionNames.label] || props.modelValue
  }
  return '--'
})
</script>

<template>
  <ElSelect
    v-if="!viewMode"
    :loading="loading"
    :filterable="false"
    :model-value="modelValue"
    :multiple="multiple"
    v-bind="$attrs"
  >
    <slot name="default">
      <ElOption
        v-for="item in options"
        :key="item[optionNames.value]"
        :label="item[optionNames.label]"
        :value="item[optionNames.value]"
        :disabled="item[optionNames.disabled || 'disabled']"
      />
    </slot>
    <template #empty>
      <slot v-if="!loading" name="empty">
        {{ emptyText }}
      </slot>
    </template>
    <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
      <slot :name="key" v-bind="slotProps || {}" />
    </template>
  </ElSelect>
  <slot v-else name="view" :content="viewText">
    {{ viewText }}
  </slot>
</template>
