const e=`<script setup lang="ts">
import type { CascaderNodePathValue, CascaderNodeValue, CascaderOption, CascaderProps, CascaderValue } from 'element-plus'
import { ElCascader } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

interface ProCascaderProps {
  modelValue?: CascaderValue
  service?: () => Promise<CascaderOption[]>
  viewMode?: boolean
  props?: CascaderProps
  options?: CascaderOption[]
}

defineOptions({
  name: 'ProCascader',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ProCascaderProps>(), {
  props: () => ({}),
  options: () => [],
})

const emit = defineEmits(['update:modelValue', 'change'])

// 使用 computed 保持响应性
const cascaderConfig = computed(() => props.props)
const labelName = computed(() => cascaderConfig.value.label || 'label')
const valueName = computed(() => cascaderConfig.value.value || 'value')
const childrenName = computed(() => cascaderConfig.value.children || 'children')
const multiple = computed(() => cascaderConfig.value.multiple)
const remoteOptions = ref<CascaderOption[]>([])
const options = computed<CascaderOption[]>(() => [...props.options, ...remoteOptions.value])

function getValue(val: CascaderValue) {
  if (Array.isArray(val))
    return val[val.length - 1]
  return val
}

// 处理选择变化
function handleChange(val: CascaderValue) {
  const selectedValue = multiple.value
    ? (val as (CascaderNodeValue | CascaderNodePathValue)[]).map(getValue)
    : getValue(val as CascaderValue)

  emit('update:modelValue', selectedValue)
  emit('change', selectedValue, val)
}

// 加载选项数据
async function loadOptions() {
  try {
    const result = await props.service?.() ?? []
    remoteOptions.value = formatResult(result)
  }
  catch (error) {
    console.error('加载级联选择器数据失败:', error)
  }
}

// 格式化结果
function formatResult(result: CascaderOption[]): CascaderOption[] {
  return result.map((item) => {
    const newItem = { ...item, [valueName.value]: String(item[valueName.value]) }
    if (item[childrenName.value])
      newItem[childrenName.value] = formatResult(item[childrenName.value] as CascaderOption[])
    return newItem
  })
}

// 查找节点路径
function findNodePath(nodes: CascaderOption[], value: string, path: CascaderOption[] = []): CascaderOption[] | null {
  for (const node of nodes) {
    // 将当前节点添加到路径中
    const currentPath = [...path, node]

    // 如果找到目标值，返回当前路径
    if (String(node[valueName.value]) === String(value))
      return currentPath

    // 如果有子节点，继续递归查找
    if (node[childrenName.value]) {
      const found = findNodePath(node[childrenName.value] as CascaderOption[], value, currentPath)
      if (found)
        return found
    }
  }
  return null
}

// 查找标签
function findLabels(value?: CascaderValue | CascaderValue[]): string[] {
  const values = Array.isArray(value) ? value : [value].filter(Boolean)
  return values.map((v) => {
    if (!v)
      return '-无-'

    const nodePath = findNodePath(options.value, String(v))
    if (!nodePath)
      return '-无-'

    return nodePath.map(node => node[labelName.value]).join('-')
  }).filter(label => label !== '-无-')
}

// 组件挂载时加载选项
onMounted(loadOptions)
<\/script>

<template>
  <template v-if="viewMode">
    <span>{{ findLabels(modelValue).join(', ') || '-无-' }}</span>
  </template>
  <ElCascader
    v-else
    v-bind="$attrs"
    :model-value="modelValue"
    :options="options"
    :props="props.props"
    dropdown-class-name="pro-cascader-dropdown"
    @change="handleChange"
  />
</template>
`;export{e as default};
