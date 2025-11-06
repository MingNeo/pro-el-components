import type dayjs from 'dayjs'
import type {
  AutocompleteProps,
  CascaderProps,
  CheckboxGroupProps,
  ColProps,
  DatePickerProps,
  ElTimePicker,
  FormItemProps,
  FormItemRule,
  InputNumberProps,
  InputProps,
  ISelectProps,
  RadioGroupProps,
  RateProps,
  RowProps,
  SliderProps,
  SwitchProps,
  UploadProps,
} from 'element-plus'
import type { Component, ExtractPropTypes, Ref, VNode } from 'vue'

// 定义组件类型到属性的映射
interface ComponentPropsMap {
  input: InputProps
  select: ISelectProps
  datePicker: DatePickerProps
  timePicker: ExtractPropTypes<typeof ElTimePicker>
  switch: SwitchProps
  radioGroup: RadioGroupProps
  checkboxGroup: CheckboxGroupProps
  inputNumber: InputNumberProps
  cascader: CascaderProps
  autocomplete: AutocompleteProps
  rate: RateProps
  slider: SliderProps
  upload: UploadProps
  [key: string]: Record<string, any> // 为其他自定义组件提供默认类型
}

export interface SearchField {
  label?: string
  prop: string
  type: string
  component?: any
  fieldProps?: ProFormFieldsField['type'] extends keyof ComponentPropsMap ? ComponentPropsMap[ProFormFieldsField['type']] : Record<string, any>
  [x: string]: any
}

export type ValueType = string | number | Date | dayjs.Dayjs | null | undefined | any[] | Record<string, any>

export type DateType = string | number | Date | dayjs.Dayjs | null | undefined

export type ProFormFieldsFormData<T = Record<string, any>> = T & { [key: string]: any }

// watch 相关类型定义
export interface WatchCondition {
  when: (value: any, form: ProFormFieldsFormData) => boolean
  update: Partial<ProFormFieldsField>
}

export interface FormItemWatch {
  field: string
  handler?: (value: any, form: ProFormFieldsFormData, field: ProFormFieldsField) => void | Partial<ProFormFieldsField>
  conditions?: WatchCondition[]
}

interface Option {
  label: string
  value: string | number
  [x: string]: any
}

export interface ProFormFieldsField {
  prop: string
  type?: string
  label?: string
  labelExtra?: string
  labelTip?: string
  // 根据type自动推导fieldProps类型
  fieldProps?: ProFormFieldsField['type'] extends keyof ComponentPropsMap ? ComponentPropsMap[ProFormFieldsField['type']] : Record<string, any>
  required?: boolean
  requiredOnlyStyle?: boolean
  viewMode?: boolean
  rules?: FormItemRule[]
  column?: number
  formItemProps?: Partial<FormItemProps>
  on?: Record<string, any>
  show?: boolean | ((formData: ProFormFieldsFormData) => boolean)
  component?: VNode | Component
  col?: ColProps
  onChange?: (value: any, formData: Ref<ProFormFieldsFormData>, originValue: any, ...args: any[]) => void
  customRender?: (value: any, field: ProFormFieldsField, formData: ProFormFieldsFormData) => string
  valueKey?: string
  formatChangedValue?: (value: any, formData: ProFormFieldsFormData) => any
  watch?: FormItemWatch | FormItemWatch[]
  mappingProp?: string[] | ({ name: string, format: (value: any) => any }[])
  options?: Option[]
  [x: string]: any
}

export interface ProFormFieldsProps {
  fields: ProFormFieldsField[]
  modelValue?: ProFormFieldsFormData
  column?: number
  viewMode?: boolean
  propPrefix?: (string | number)[]
  formItemProps?: Partial<FormItemProps>
  row?: RowProps
  inline?: boolean
  showLabel?: boolean
}
