import type { ColumnKey } from './types'

export function getColumnKeys(columns: any[]) {
  return columns?.filter(column => column.columnType !== 'actions').map(column => ({ prop: column.prop, visible: true })) || []
}

export function defaultGetColumnKeys(key: string): ColumnKey[] {
  try {
    const value = localStorage.getItem(`pel_table_columns_${key}`)
    return value ? JSON.parse(value) : []
  }
  catch {
    return []
  }
}

export function defaultSaveColumnKeys(key: string, value: ColumnKey[], isAllSelected: boolean) {
  if (isAllSelected)
    localStorage.removeItem(`pel_table_columns_${key}`)
  else
    localStorage.setItem(`pel_table_columns_${key}`, JSON.stringify(value))
}

export function getRenderProps(renderProps: any, row: any, column: any) {
  if (typeof renderProps === 'function')
    return renderProps(row, column)
  return renderProps
}
