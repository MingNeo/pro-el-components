import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useSelection } from '../index'

describe('useSelection', () => {
  // 基础功能测试
  it('should initialize with default values', () => {
    const { selectedKeys, isAllSelected, isPartialSelected } = useSelection()
    expect(selectedKeys.value).toEqual([])
    expect(isAllSelected.value).toBe(false)
    expect(isPartialSelected.value).toBe(false)
  })

  // 测试简单数组数据
  it('should work with simple array data', () => {
    const data = [1, 2, 3]
    const { toggleSelect, isSelected, selectedKeys } = useSelection({ data })

    toggleSelect(1)
    expect(isSelected(1)).toBe(true)
    expect(selectedKeys.value).toEqual([1])
  })

  // 测试对象数组
  it('should work with object array data', () => {
    const data = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]
    const { toggleSelect, isSelected } = useSelection({ data })

    toggleSelect(data[0])
    expect(isSelected(data[0])).toBe(true)
  })

  // 测试全选功能
  it('should handle select all correctly', () => {
    const data = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]
    const { toggleSelectAll, selectedKeys, isAllSelected } = useSelection({ data })

    toggleSelectAll(true)
    expect(selectedKeys.value).toEqual([1, 2])
    expect(isAllSelected.value).toBe(true)

    toggleSelectAll(false)
    expect(selectedKeys.value).toEqual([])
    expect(isAllSelected.value).toBe(false)
  })

  // 测试部分选中状态
  it('should handle partial selection correctly', () => {
    const data = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]
    const { toggleSelect, isPartialSelected, isAllSelected } = useSelection({ data })

    toggleSelect(data[0])
    expect(isPartialSelected.value).toBe(true)
    expect(isAllSelected.value).toBe(false)
  })

  // 测试响应式数据
  it('should handle reactive data correctly', () => {
    const reactiveData = ref([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ])
    const { toggleSelect, selectedKeys, isAllSelected } = useSelection({
      data: reactiveData,
    })

    toggleSelect(reactiveData.value[0])
    expect(selectedKeys.value).toEqual([1])

    // 测试数据变化
    reactiveData.value = [
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]
    expect(isAllSelected.value).toBe(false)
  })

  // 测试自定义 rowKey
  it('should work with custom rowKey', () => {
    const data = [
      { customId: 'a', name: 'A' },
      { customId: 'b', name: 'B' },
    ]
    const { toggleSelect, isSelected } = useSelection({
      data,
      rowKey: 'customId',
    })

    toggleSelect(data[0])
    expect(isSelected(data[0])).toBe(true)
  })

  // 测试维持数据顺序
  it('should maintain data order when specified', () => {
    const data = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]
    const { toggleSelect, selectedKeys } = useSelection({
      data,
      maintainDataOrder: true,
    })

    toggleSelect(data[2]) // 选择 C
    toggleSelect(data[0]) // 选择 A

    // 应该按照原数据顺序排列：[1, 3]
    expect(selectedKeys.value).toEqual([1, 3])
  })
})
