import type { Column } from 'pro-el-components'

export interface TableFormColumn extends Column {
  prop: string
  label: string
  type?: string
  columnType?: string
  minWidth?: number
  options?: Array<{
    label: string
    value: any
  }>
}

export interface TableFormProps {
  propPrefix: string | (string | number)[]
  modelValue: Record<string, any>[]
  columns: TableFormColumn[]
  viewMode?: boolean
}

export interface TableFormEmits {
  (e: 'update:modelValue', value: Record<string, any>[]): void
  (e: 'change', value: Record<string, any>[]): void
  (e: 'validate'): void
}
