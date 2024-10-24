export interface ColumnKey {
  key: string
  visible: boolean
}

export interface ColumnKeysStorage {
  [key: string]: ColumnKey[]
}
