const n=`import type { FormInstance } from 'element-plus'

export interface ModalFormExpose {
  formRef: FormInstance | undefined
  formData: Record<string, any>
  resetForm: () => void
  validate: () => Promise<boolean>
}

export interface ModalFormProps {
  title?: string
  width?: number | string
  modelValue?: boolean
  loading?: boolean
  defaultValue?: Record<string, any>
  formData?: Record<string, any>
  viewMode?: boolean
  fields?: any[]
  column?: number
  propPrefix?: (string | number)[]
  formProps?: Record<string, any>
  formItemProps?: Record<string, any>
  closeOnSuccess?: boolean
  resetOnClose?: boolean
}
`;export{n as default};
