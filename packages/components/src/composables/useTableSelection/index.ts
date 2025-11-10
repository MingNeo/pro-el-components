import type { ComputedRef, Ref } from 'vue'
import { isRef, nextTick, shallowRef, watch } from 'vue'

export interface UseTableSelectionOptions<Row> {
  /** 表格引用 */
  tableRef: Ref<any>
  /** 当前页数据 */
  data: Ref<Row[]>
  /** 加载状态 */
  loading?: Ref<boolean>
  /** 初始选中的行 */
  defaultSelectdRows?: Row[] | Ref<Row[] | undefined> | ComputedRef<Row[] | undefined>
  /** 唯一标识字段，默认 'id' */
  idKey?: string
  /** 选中变化回调 */
  onChange?: (selectedRows: Row[]) => void
}

export function useTableSelection<Row extends Record<string, any>>(options: UseTableSelectionOptions<Row>) {
  const {
    tableRef,
    data,
    loading,
    defaultSelectdRows,
    idKey = 'id',
    onChange,
  } = options

  // 存储所有选中的行（跨页选择）
  const selectedRows = shallowRef<Row[]>([])

  // 用户手动选中/取消单行
  function handleSelect(selection: Row[], row: Row) {
    const rowId = row[idKey]
    const isSelected = selection.some(item => item[idKey] === rowId)

    if (isSelected) {
      // 添加到选中列表（去重）
      const exists = selectedRows.value.some(item => item[idKey] === rowId)
      if (!exists) {
        selectedRows.value.push(row)
      }
    }
    else {
      // 从选中列表中移除
      selectedRows.value = selectedRows.value.filter(item => item[idKey] !== rowId)
    }

    onChange?.(selectedRows.value)
  }

  // 用户手动全选/取消全选
  function handleSelectAll(selection: any[]) {
    const currentPageIds = data.value.map(item => item[idKey])

    // 移除当前页的所有行
    const otherPagesRows = selectedRows.value.filter(row =>
      !currentPageIds.includes(row[idKey]),
    )

    // 合并其他页的选中行和当前页的新选中行
    selectedRows.value = [...otherPagesRows, ...selection]

    onChange?.(selectedRows.value)
  }

  // 同步当前页的选中状态到表格UI
  function syncSelectionToTable() {
    if (!tableRef.value || !data.value.length)
      return

    // 获取所有已选中的ID集合
    const selectedIds = new Set(selectedRows.value.map(row => row[idKey]))

    // 遍历当前页的每一行，根据ID判断是否应该选中
    data.value.forEach((row) => {
      const shouldSelect = selectedIds.has(row[idKey])
      // 注意：这里使用的是当前页data中的row对象引用
      tableRef.value.toggleRowSelection?.(row, shouldSelect)
    })
  }

  // 清空所有选中
  function clearSelection() {
    selectedRows.value = []
    tableRef.value?.clearSelection?.()
    onChange?.(selectedRows.value)
  }

  // 监听 loading 状态，确保数据加载完成后同步选中状态
  if (loading) {
    watch(loading, (isLoading, oldLoading) => {
      // 当 loading 从 true 变为 false 时（数据加载完成），同步选中状态
      if (oldLoading && !isLoading) {
        nextTick(() => {
          syncSelectionToTable()
        })
      }
    })
  }

  // 监听 modelValue 变化，同步到内部状态
  watch(() => isRef(defaultSelectdRows) ? defaultSelectdRows.value : defaultSelectdRows, (newValue, oldValue) => {
    if (newValue !== oldValue && newValue?.length && Array.isArray(newValue)) {
      selectedRows.value = newValue
      onChange?.(newValue)
      nextTick(() => {
        syncSelectionToTable()
      })
    }
    else if (oldValue?.length && !newValue?.length) {
      clearSelection()
    }
  }, { immediate: true })

  return {
    selectedRows,
    handleSelect,
    handleSelectAll,
    syncSelectionToTable,
    clearSelection,
  }
}
