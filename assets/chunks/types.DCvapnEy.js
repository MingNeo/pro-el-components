const n=`import type { ProFormFieldsField, ProFormFieldsProps } from 'pro-el-components'

export interface SearchField extends ProFormFieldsField {
  mappingProp?: string[]
}

export interface SearchFormProps extends ProFormFieldsProps {
  defaultValue?: Record<string, any>
  showActions?: boolean
  form?: any
  collapsible?: boolean // 是否启用展开收起功能
  defaultCollapsed?: boolean // 默认是否收起
  collapseRows?: number // 收起时显示的行数
  collapsedFields?: string[] // 收起时显示的字段名称列表
  formProps?: Record<string, any>
  fields: SearchField[]
  class?: string | string[] | Record<string, any> | any[]
  showLabel?: boolean
  formBuilderProps?: Record<string, any>
}
`;export{n as default};
