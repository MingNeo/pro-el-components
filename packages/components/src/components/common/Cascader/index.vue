<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import type { CascaderOption, CascaderProps, ElCascader } from 'element-plus'

  interface ProCascader {
    modelValue: () => []
    service?: () => Promise<CascaderOption[]>
    options?: CascaderOption[]
    viewMode?: boolean
    props: CascaderProps
  }

  const props = withDefaults(defineProps<ProCascader>(), {
    modelValue: () => [],
    props: () => ({}),
    options: () => [],
  })

  const emit = defineEmits(['update:modelValue', 'change'])

  const { label: labelName = 'label', value: valueName = 'value', children: childrenName = 'children', multiple } = props.props
  const remoteOptions = ref<CascaderOption[]>([])
  const options = computed<CascaderOption[]>(() => [...props.options, ...remoteOptions.value])

  // 处理选择变化
  function handleChange(val: any = [], selectedOptions: CascaderOption[]) {
    const selectedValue = multiple
      ? val.map((v: any[] = []) => v[v.length - 1])
      : val[val.length - 1]

    emit('update:modelValue', selectedValue)
    emit('change', selectedValue, selectedOptions)
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
        newItem[childrenName] = formatResult(item[childrenName])
      return newItem
    })
  }

  // 查找标签
  function findLabel(nodes: any[], value: string | number): string {
    for (const node of nodes) {
      if (node[valueName] === value)
        return node[labelName]
      if (node[childrenName]) {
        const childLabel = findLabel(node[childrenName], value)
        if (childLabel)
          return `${node[labelName]}-${childLabel}`
      }
    }
    return ''
  }

  // 查找多个标签
  function findLabels(value: (string | number) | (string | number)[]): string[] {
    return Array.isArray(value)
      ? value.map(v => findLabel(options.value, v))
      : [findLabel(options.value, value)]
  }

  // 组件挂载时加载选项
  onMounted(loadOptions)
</script>

<template>
  <template v-if="viewMode">
    <span>{{ findLabels(modelValue).join(', ') || '-无-' }}</span>
  </template>
  <el-cascader
    v-else
    v-bind="$attrs"
    :model-value="modelValue"
    :options="options"
    :props="props"
    dropdown-class-name="common-cascader-dropdown"
    @change="handleChange"
  />
</template>
