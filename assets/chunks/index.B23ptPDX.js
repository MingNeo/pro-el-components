const e=`import type { ComputedRef } from 'vue'
import { computed, isRef, ref } from 'vue'

interface UseSelectionOptions<T> {
  rowKey?: string | ((row: T) => string | number)
  data?: T[] | ComputedRef<T[]>
  defaultSelected?: (string | number)[]
  /**
   * 是否按照原数据顺序选中
   * @default true
   */
  maintainDataOrder?: boolean
}

export function useSelection<T = string | number | Record<string, any>>(options: UseSelectionOptions<T> = {}) {
  const {
    rowKey = 'id',
    defaultSelected = [],
    maintainDataOrder = true,
  } = options

  const selectedKeys = ref<(string | number)[]>(defaultSelected)

  const data = computed(() => {
    const rawData = isRef(options.data) ? options.data.value : options.data
    return Array.isArray(rawData) ? rawData : []
  })

  // 获取行的唯一键
  const getRowKey = (row: T) => {
    return typeof rowKey === 'function' ? rowKey(row) : (typeof row === 'object' && row ? (row as Record<string, any>)[rowKey] : row)
  }

  // 计算是否全选
  const isAllSelected = computed(() => {
    if (!data.value.length)
      return false
    return data.value.every(item => selectedKeys.value.includes(getRowKey(item)))
  })

  // 计算是否部分选中
  const isPartialSelected = computed(() => {
    if (!data.value.length)
      return false
    const hasSelected = data.value.some(item => selectedKeys.value.includes(getRowKey(item)))
    return hasSelected && !isAllSelected.value
  })

  // 判断某行是否被选中
  const isSelected = (row: T) => {
    return selectedKeys.value.includes(getRowKey(row))
  }

  // 选择单个
  const toggleSelect = (row: T, selected: boolean = !isSelected(row)) => {
    const key = getRowKey(row)
    if (selected) {
      if (!selectedKeys.value.includes(key)) {
        if (maintainDataOrder) {
          // 使用 Set 确保唯一性
          const uniqueSelected = new Set([...selectedKeys.value, key])
          // 按照原数据顺序插入，同时确保唯一性
          selectedKeys.value = Array.from(new Set(data.value
            .map(getRowKey)
            .filter(k => uniqueSelected.has(k))))
        }
        else {
          selectedKeys.value = [...selectedKeys.value, key]
        }
      }
    }
    else {
      selectedKeys.value = selectedKeys.value.filter(k => k !== key)
    }
  }

  // 选择全部
  const toggleSelectAll = (selected: boolean = !isAllSelected.value) => {
    if (selected) {
      if (maintainDataOrder) {
        // 按照原数据顺序全选，使用 Set 确保唯一性
        selectedKeys.value = [...new Set(data.value.map(getRowKey))]
      }
      else {
        // 保持现有选中项的顺序，将新选中的项追加到末尾
        const currentSelected = new Set(selectedKeys.value)
        const newKeys = data.value
          .map(getRowKey)
          .filter(key => !currentSelected.has(key))
        selectedKeys.value = [...selectedKeys.value, ...newKeys]
      }
    }
    else {
      selectedKeys.value = []
    }
  }

  return {
    selectedKeys,
    isAllSelected,
    isPartialSelected,
    toggleSelect,
    toggleSelectAll,
    isSelected,
  }
}
`;export{e as default};
