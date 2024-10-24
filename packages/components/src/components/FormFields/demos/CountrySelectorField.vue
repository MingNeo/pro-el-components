<script lang="ts" setup>
import { ElOption, ElSelect } from 'element-plus'
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue?: any
  viewMode?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'change'])

function getSelectData() {
  const data = [
    { value: 'china', label: '中国' },
    { value: 'usa', label: '美国' },
  ]
  return data
}

const countryOptions = ref<any[]>([])

async function selectData() {
  try {
    countryOptions.value = await getSelectData()
  }
  catch (error) {
    console.error(error)
  }
}

// 初始化国家选项数据
selectData()

function handleOnChange(newValue: any) {
  emit('change', newValue)
  emit('update:modelValue', newValue)
}

const current = computed(() => countryOptions.value.find((item: any) => item.value === props.modelValue))
</script>

<template>
  <template v-if="$props.viewMode">
    {{ current?.label }}
  </template>
  <ElSelect v-else :model-value="modelValue" :options="countryOptions" @change="handleOnChange">
    <ElOption v-for="option in countryOptions" :key="option.value" :value="option.value" :label="option.label" />
  </ElSelect>
</template>
