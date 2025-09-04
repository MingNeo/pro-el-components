const n=`<script lang="ts" setup>
import type { RadioProps } from 'element-plus'
import { computed, ref, watch, watchEffect } from 'vue'

interface Option {
  disabled?: boolean
  [key: string]: any
}

defineOptions({
  name: 'ProRadio',
})

const props = withDefaults(defineProps<{
  service?: (keyword?: string) => Promise<Option[]>
  optionNames?: { label: string, value: string, disabled?: string }
  options?: Option[]
  viewMode?: boolean
  viewModeSeparator?: string // 查看模式多个数据的分割符
  modelValue?: string[] | number[]
  radioProps?: RadioProps
}>(), { optionNames: () => ({ label: 'label', value: 'value' }), viewModeSeparator: ', ' })

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
  if (props.modelValue !== undefined)
    return (props.modelValue as string[] | number[]).map((item: string | number) => options.value.find(option => option[props.optionNames.value] === item)?.[props.optionNames.label] || item).join(props.viewModeSeparator)

  return '-'
})
<\/script>

<template>
  <ElRadioGroup
    v-if="!viewMode"
    :loading="loading"
    :model-value="modelValue as any"
  >
    <slot name="default">
      <ElRadio
        v-for="item in options"
        :key="item[optionNames.value]"
        :label="item[optionNames.label]"
        :value="item[optionNames.value]"
        :disabled="item[optionNames.disabled || 'disabled']"
        v-bind="props.radioProps"
      />
    </slot>
    <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
      <slot :name="key" v-bind="slotProps || {}" />
    </template>
  </ElRadioGroup>
  <slot v-else name="view" :content="viewText">
    {{ viewText }}
  </slot>
</template>
`;export{n as default};
