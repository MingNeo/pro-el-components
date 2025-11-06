const e=`import type { FormItemRule } from 'element-plus'
import type { DateType, ProFormFieldsField, ProFormFieldsFormData, ValueType } from './types'
import { dayjs } from 'element-plus'
import { isObject } from 'lodash-es'

const placeholderMap: Record<string, any> = {
  select: '请选择',
  datePicker: '请选择',
  timePicker: '请选择',
  cascader: '请选择',
  treeSelect: '请选择',
  number: '请输入',
  textarea: '请输入',
}

export function getRulesForColumn(item: ProFormFieldsField): FormItemRule[] {
  const rules = [...(item.rules || [] as any)]
  if (item.required)
    rules.push({ required: true, message: \`\${item.label || item.title || ''}不能为空！\` })

  if ((!item.type || item.type === 'input') && item.maxlength)
    rules.push({ max: item.maxlength, message: \`\${item.label}不能超过\${item.maxlength}个字符！\` })

  return rules
}

export function renderView(val: ValueType, field: ProFormFieldsField) {
  if (['select', 'radio', 'checkbox', 'treeSelect'].includes(field.type || 'input')) {
    const options = field?.options
    if (['checkbox', 'treeSelect'].includes(field.type || 'input') || field.fieldProps?.multiple)
      return Array.isArray(val) ? (options?.filter?.((v: any) => val.includes(v.value)).map((v: any) => v.label).join(', ') || '') : ''

    return options?.find?.((v: any) => v.value === val)?.label || val || ''
  }
  if (field.type === 'datePicker')
    return val ? dayjs(val as DateType).format(field?.fieldProps?.valueFormat || 'YYYY-MM-DD') : ''
  if (field.type === 'rangePicker')
    return val ? (val as string[]).map(item => dayjs(item).format(field?.fieldProps?.valueFormat || 'YYYY-MM-DD')).join('至') : ''
  if (field.type === 'cascader')
    return val ? (val as string[]).join('；') : ''
  return val ?? ''
}

/**
 * 获取表单item的name值，正常情况下不需要，但如果层级较深则需要以此来绑定正确的name值
 */
export function getItemName(name: any, propPrefix?: any[]) {
  return propPrefix ? [...propPrefix, [name]].flat() : name
}

export function getformItemProps(options: any = {}, globalOptions: any = {}) {
  return { ...globalOptions, ...options }
}

export function getFormItemCol(column = 1, itemColSpan?: number) {
  return itemColSpan || { 1: 24, 2: 12, 3: 8, 4: 6, 6: 4, 8: 3 }[column] || 24
}

export function getFormFieldProps(item: ProFormFieldsField, value: any, formValues: ProFormFieldsFormData) {
  if (typeof item.fieldProps === 'function')
    return item.fieldProps({ value, item, formValues }) || {}

  const fieldProps = item.fieldProps || {}
  if (item.type === 'component' && item.valueKey)
    fieldProps[item.valueKey] = value

  if (item.type === 'datePicker') {
    switch (fieldProps.type) {
      case 'datetimerange':
      case 'daterange':
        fieldProps.defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]
        break
    }
  }

  return fieldProps
}

export function getPlaceholder(type: string, label?: string) {
  return placeholderMap[type] ? \`\${placeholderMap[type]}\${label || ''}\` : ''
}

// 处理range数据映射
export function formatRangeData(values: Record<string, any> = {}, fields: ProFormFieldsField[]) {
  fields.forEach((field: ProFormFieldsField) => {
    if (Array.isArray(field.mappingProp) && field.mappingProp.length) {
      field.mappingProp.forEach((item: any, index) => {
        let name = item
        let format = (v: any) => v
        if (isObject(item)) {
          name = (item as any)?.name
          format = (item as any)?.format || format
        }

        values[name] = format(values[field.prop]?.[index])
      })
    }
  })

  return values
}
`;export{e as default};
