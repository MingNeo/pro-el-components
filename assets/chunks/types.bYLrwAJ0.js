const e=`import type { FormItemProps } from 'element-plus'
import type { ProSearchField } from 'pro-el-components'

export type RecordType = Record<string, any>

export interface TableSelectorProps {
  mode?: 'multiple' | 'single'
  showSearchActions?: boolean
  highlightCurrentRow?: boolean
  // 搜索字段
  searchFields?: ProSearchField[]
  searchColumn?: number
  // 列表数据接口
  service?: (params: { pageNo: number, pageSize: number, [key: string]: any }) => Promise<{
    data: RecordType[]
    total?: number
  } | RecordType[]>
  // 列表数据，如果存在 service 则忽略 data，不存在 service 时 data 进行本地分页
  data?: RecordType[]
  // table 的 columns 属性
  columns: Record<string, any>[]
  // 表格的 id 字段，默认为 'id'
  idKey?: string
  // 多选时会展示选中的标签用来删除，展示的字段 key
  labelKey?: string
  // 已选中的值
  modelValue?: RecordType[]
  // filter 的 formItemProps 属性
  formItemProps?: Partial<FormItemProps>
  pageSize?: number
}
`;export{e as default};
