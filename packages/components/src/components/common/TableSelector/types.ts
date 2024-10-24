import type { SearchField } from '@/components/common/SearchForm/types'
import type { UseTableListService } from '@/composables/useTableList'

export type RecordType = Record<string, any>

export interface TableSelectorProps {
  showSearchActions?: boolean
  // 搜索字段
  searchFields?: SearchField[]
  searchColumn?: number
  // 列表数据接口
  service?: UseTableListService
  // 列表数据，如果存在 service 则忽略 data，不存在 service 时 data 进行本地分页
  data?: RecordType[]
  // table 的 columns 属性
  columns: Record<string, any>[]
  // table 的 rowKey 属性
  rowKey?: string
  // 多选时会展示选中的标签用来删除，展示的字段 key
  nameKey?: string
  // 单选或多选
  type?: 'checkbox' | 'radio'
  // 设置行不可选
  setRowDisabled?: (record: RecordType) => boolean
  // 已选中的值
  modelValue?: RecordType[] | RecordType
  // scroll设置
  scroll?: { x: number, y: number } | any
}
