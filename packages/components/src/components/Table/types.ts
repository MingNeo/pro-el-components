import type { ComponentProps } from '@/types'
import type { PaginationProps as ElPaginationProps, ElTableColumn, TableProps as ElTableProps } from 'element-plus'
import type { ButtonAction } from 'pro-el-components'
import type { Component, VNode } from 'vue'

export interface ColumnKey {
  prop: string
  visible: boolean
}

export interface ColumnKeysStorage {
  [key: string]: ColumnKey[]
}

export interface Column extends ComponentProps<typeof ElTableColumn> {
  // 列样式
  style?: string
  // 列自定义渲染
  customRender?: (row: Record<string, any>, column: Column, index: number) => any
  // 列操作
  actions?: ButtonAction[] | ((record: Record<string, any>, column: Column, index: number) => ButtonAction[]) | ((record: Record<string, any>, column: Column) => ButtonAction[]) | ((record: Record<string, any>) => ButtonAction[])
  // 列枚举值映射
  mapping?: Record<string, any>
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
  'onUpdate:currentPage'?: (val: number) => void
  'onUpdate:pageSize'?: (val: number) => void
}

export interface TableProps extends ElTableProps<any> {
  tableId?: string
  columnSetting?: boolean
  autoHeight?: boolean
  class?: string
  format?: string
  columns: Column[]
  pagination?: Partial<PaginationProps>
  bottomOffset?: number
  savedConfig?: StorageOptions
  actions?: ButtonAction[]
  title?: string | VNode
}
