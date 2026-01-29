const n=`import type { ComponentProps } from '@/types'
import type { PaginationProps as ElPaginationProps, ElTableColumn } from 'element-plus'
import type { ButtonAction, SearchFormProps } from 'pro-el-components'
import type { Component, VNode } from 'vue'

export interface ColumnKey {
  prop: string
  visible: boolean
}

// Column 扩展的搜索配置
export interface ColumnSearchConfig {
  // 是否可搜索
  search?: boolean
  // 搜索字段类型，不指定则自动推断
  searchType?: string
  // 搜索字段属性
  searchFieldProps?: Record<string, any>
  // 搜索字段的 prop，默认使用 column 的 prop
  searchProp?: string
}

export interface ColumnKeysStorage {
  [key: string]: ColumnKey[]
}

export interface Column extends ComponentProps<typeof ElTableColumn>, ColumnSearchConfig {
  // 列样式
  style?: string
  // 列自定义渲染
  customRender?: (row: Record<string, any>, column: Column, index: number) => any
  // 列操作
  actions?: ButtonAction[] | ((record: Record<string, any>, column: Column, index: number) => ButtonAction[]) | ((record: Record<string, any>, column: Column) => ButtonAction[]) | ((record: Record<string, any>) => ButtonAction[])
  mappingMap?: Record<string, any>
  // 列渲染类型
  renderAs?: 'date' | 'file' | 'link' | 'image' | string | Component
  // 列格式化
  format?: string
  // 列其他属性
  [key: string]: any
}

// 添加新的类型定义
export interface StorageOptions {
  getColumnKeys?: (key: string) => ColumnKey[] | null
  saveColumnKeys?: ((key: string, value: ColumnKey[], isAllSelected: boolean) => void) | ((key: string, value: ColumnKey[]) => void)
}

export interface PaginationProps extends ElPaginationProps {
  // v-model 更新事件
  'onUpdate:currentPage'?: (val: number) => void
  'onUpdate:pageSize'?: (val: number) => void
  // 事件监听（推荐使用）
  'onCurrentChange'?: (val: number) => void
  'onSizeChange'?: (val: number) => void
}

// 搜索表单配置
export interface TableSearchFormConfig extends Omit<SearchFormProps, 'fields'> {
  // 搜索字段，如果不传则从 columns 中自动提取
  fields?: SearchFormProps['fields']
}

export interface TableProps {
  data?: Record<string, any>[]
  height?: number
  tableId?: string
  columnSetting?: boolean
  autoHeight?: boolean
  class?: string
  columns?: Column[]
  pagination?: Partial<PaginationProps>
  bottomOffset?: number
  savedConfig?: StorageOptions
  actions?: ButtonAction[]
  title?: string | VNode
  // 搜索表单配置，传入 true 时自动从 columns 提取搜索字段
  searchForm?: boolean | TableSearchFormConfig
}
`;export{n as default};
