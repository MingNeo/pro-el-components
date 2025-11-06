const n=`<script setup lang="ts">
import type { CascaderOption, CascaderProps, CascaderValue } from 'element-plus'
import { ElCascader } from 'element-plus'
import { computed, onMounted, ref } from 'vue'

interface ProCascader {
  modelValue?: CascaderValue | CascaderValue[]
  service?: () => Promise<CascaderOption[]>
  viewMode?: boolean
  props?: CascaderProps
  options?: CascaderOption[]
}

defineOptions({
  name: 'ProCascader',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ProCascader>(), {
  props: () => ({}),
  options: () => [],
})

const emit = defineEmits(['update:modelValue', 'change'])

const { label: labelName = 'label', value: valueName = 'value', children: childrenName = 'children', multiple } = props.props
const remoteOptions = ref<CascaderOption[]>([])
const options = computed<CascaderOption[]>(() => [...props.options, ...remoteOptions.value])

function getValue(val: CascaderValue) {
  if (Array.isArray(val))
    return val[val.length - 1]
  return val
}

// 处理选择变化
function handleChange(val: CascaderValue | CascaderValue[]) {
  const selectedValue = multiple
    ? (val as CascaderValue[]).map(getValue)
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
    const newItem = { ...item, [valueName]: String(item[valueName]) }
    if (item[childrenName])
      newItem[childrenName] = formatResult(item[childrenName] as CascaderOption[])
    return newItem
  })
}

// 查找节点路径
function findNodePath(nodes: CascaderOption[], value: string, path: CascaderOption[] = []): CascaderOption[] | null {
  for (const node of nodes) {
    // 将当前节点添加到路径中
    const currentPath = [...path, node]

    // 如果找到目标值，返回当前路径
    if (String(node[valueName]) === String(value))
      return currentPath

    // 如果有子节点，继续递归查找
    if (node[childrenName]) {
      const found = findNodePath(node[childrenName] as CascaderOption[], value, currentPath)
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

    return nodePath.map(node => node[labelName]).join('-')
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
`;export{n as default};
