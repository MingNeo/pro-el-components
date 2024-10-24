import type { FormItemProps } from 'element-plus'
import type { ProSearchField, UseTableListService } from 'pro-el-components'

export type RecordType = Record<string, any>

export interface TableSelectorProps {
  showSearchActions?: boolean
  // 搜索字段
  searchFields?: ProSearchField[]
  searchColumn?: number
  // 列表数据接口
  service?: UseTableListService
  // 列表数据，如果存在 service 则忽略 data，不存在 service 时 data 进行本地分页
  data?: RecordType[]
  // table 的 columns 属性
  columns: Record<string, any>[]
  // 表格的 id 字段
  idKey?: string | number
  // 多选时会展示选中的标签用来删除，展示的字段 key
  labelKey?: string
  // 已选中的值
  modelValue?: RecordType[]
  // filter 的 formItemProps 属性
  formItemProps?: Partial<FormItemProps>
}
