const e=`<script lang="ts" setup>
import type { FormItemProps } from 'element-plus'
import type { Component } from 'vue'
import type { FieldType } from './types'
import dayjs from 'dayjs'
import { ElColorPicker, ElDatePicker, ElFormItem, ElImage, ElInput, ElInputNumber, ElRate, ElSlider, ElSwitch, ElTimePicker, ElTreeSelect, ElUpload } from 'element-plus'
import { ProCascader, ProCheckbox, ProRadio, ProSelect, ProUpload } from 'pro-el-components'
import { computed, defineComponent, markRaw, ref, useAttrs, watch } from 'vue'
import './style.css'

interface ProFieldProps extends Partial<FormItemProps> {
  withFormItem?: boolean
  modelValue?: any
  fieldType: FieldType | string
  fieldProps?: Record<string, any>
  viewMode?: boolean
}

defineOptions({
  name: 'ProField',
  inheritAttrs: false,
})

const { withFormItem = true, modelValue, fieldType, fieldProps, viewMode, ...formItemProps } = defineProps<ProFieldProps>()
const emit = defineEmits(['update:modelValue', 'change'])
const attrs = useAttrs()

const fieldValue = ref(modelValue)

watch(() => modelValue, (newVal) => {
  fieldValue.value = newVal
})

const field = computed<{ type?: FieldType | string, component: string | Component, props?: Record<string, any>, valueKey?: string }>(() => {
  const defaultField = { type: fieldType, valueKey: 'modelValue' }
  switch (fieldType) {
    case 'input':
      return { ...defaultField, component: markRaw(ElInput) }
    case 'number':
      return { ...defaultField, component: markRaw(ElInputNumber) }
    case 'password':
      return { ...defaultField, component: markRaw(ElInput), props: { type: 'password', showPassword: true } }
    case 'textarea':
      return { ...defaultField, component: markRaw(ElInput), props: { type: 'textarea' } }
    case 'select':
      return { ...defaultField, component: markRaw(ProSelect) }
    case 'date':
      return { ...defaultField, component: markRaw(ElDatePicker), props: { type: 'date' } }
    case 'dateTime':
      return { ...defaultField, component: markRaw(ElTimePicker) }
    case 'dateRange':
      return { ...defaultField, component: markRaw(ElDatePicker), props: { type: 'daterange' } }
    case 'dateTimeRange':
      return { ...defaultField, component: markRaw(ElDatePicker), props: { type: 'datetimerange' } }
    case 'switch':
      return { ...defaultField, component: markRaw(ElSwitch) }
    case 'rate':
      return { ...defaultField, component: markRaw(ElRate) }
    case 'radio':
      return { ...defaultField, component: markRaw(ProRadio) }
    case 'cascader':
      return { ...defaultField, component: markRaw(ProCascader) }
    case 'treeSelect':
      return { ...defaultField, component: markRaw(ElTreeSelect) }
    case 'slider':
      return { ...defaultField, component: markRaw(ElSlider) }
    case 'checkbox':
      return { ...defaultField, component: markRaw(ProCheckbox) }
    case 'color':
      return { ...defaultField, component: markRaw(ElColorPicker) }
    case 'image':
      return { ...defaultField, component: markRaw(ElImage), valueKey: 'src' }
    case 'file':
      return { ...defaultField, component: markRaw(ProUpload), valueKey: 'fileList' }
    default:
      return { type: 'div', component: markRaw(ElInput), props: { style: { wordBreak: 'break-all' } } }
  }
})

function handleChange(val: any) {
  emit('update:modelValue', val)
  emit('change', val)
}

const viewInfo = computed<{ value?: string, type?: string, component?: Component, props?: Record<string, any> }>(() => {
  if (!viewMode)
    return {}

  const disabled = true
  switch (fieldType) {
    case 'password':
      return { value: '******', type: 'text' }
    case 'date':
      return { value: fieldValue.value ? dayjs(fieldValue.value).format(fieldProps?.valueFormat || 'YYYY-MM-DD') : '-', type: 'text' }
    case 'dateTime':
      return { value: fieldValue.value ? dayjs(fieldValue.value).format(fieldProps?.valueFormat || 'YYYY-MM-DD HH:mm:ss') : '-', type: 'text' }
    case 'dateRange':
    case 'dateTimeRange':
      if (Array.isArray(fieldValue.value) && fieldValue.value.length === 2) {
        const format = fieldProps?.valueFormat || (fieldType === 'dateRange' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss')
        return { value: \`\${dayjs(fieldValue.value[0]).format(format)} 至 \${dayjs(fieldValue.value[1]).format(format)}\`, type: 'text' }
      }
      return { value: '-', type: 'text' }
    case 'switch':
      return { value: fieldValue.value ? '是' : '否', type: 'text' }
    case 'select':
    case 'radio':
    case 'checkbox':
    case 'treeSelect':
    case 'cascader':
      {
        if (!fieldProps?.options)
          return { value: '-', type: 'text' }
        const items = fieldProps?.options || []
        if (Array.isArray(fieldValue.value)) {
          return {
            value: fieldValue.value
              .map((val: any) => items.find((item: any) => item.value === val)?.label)
              .filter(Boolean)
              .join('、') || '-',
            type: 'text',
          }
        }
        return { value: items.find((item: any) => item.value === fieldValue.value)?.label || fieldValue.value || '-', type: 'text' }
      }
    case 'rate':
      return { type: 'component', component: markRaw(ElRate), props: { modelValue: fieldValue.value || '-', ...fieldProps, disabled } }
    // case 'cascader':
    //   return { type: 'component', component: markRaw(ProCascader), props: { viewMode: true, modelValue: fieldValue.value || '-', ...fieldProps, disabled } }
    case 'image':
      return { type: 'component', component: markRaw(ElImage), props: { src: fieldValue.value, ...fieldProps } }
    case 'file':
      return { type: 'component', component: markRaw(ElUpload), props: { fileList: fieldValue.value, ...fieldProps, disabled, onUpdateFileList: handleChange } }
    default:
      return { value: fieldValue.value || '-', type: 'text' }
  }
})

const Fragment = defineComponent({
  name: 'Fragment',
  setup(_, { slots }) {
    return () => slots.default?.()
  },
})

// 从 attrs 中提取事件监听器
const eventListeners = computed(() => {
  const listeners: Record<string, any> = {}
  Object.keys(attrs).forEach((key) => {
    if (key.startsWith('on')) {
      listeners[key] = attrs[key]
    }
  })
  return listeners
})
<\/script>

<template>
  <component :is="withFormItem ? ElFormItem : Fragment" v-bind="withFormItem ? formItemProps : {}">
    <template #label>
      <slot name="label" />
    </template>
    <template #error>
      <slot name="error" />
    </template>

    <slot v-if="viewMode" name="viewMode" :field-type="fieldType" :field-value="fieldValue" :field-props="fieldProps">
      <component
        :is="viewInfo.component"
        v-if="viewInfo.type === 'component'"
        :class="\`pro-field-view-\${fieldType}\`"
        v-bind="viewInfo.props"
      />
      <span v-else class="pro-field-view">{{ viewInfo.value }}</span>
    </slot>
    <slot v-else name="default" :field-type="fieldType" :field-value="fieldValue" :field-props="fieldProps">
      <component
        :is="field.component"
        :class="\`pro-field-\${fieldType}\`"
        v-bind="{
          ...field.props,
          ...fieldProps,
          ...(field.valueKey ? { [field.valueKey]: fieldValue } : {}),
          [\`onUpdate:\${field.valueKey}\`]: handleChange,
          ...eventListeners,
        }"
      />
    </slot>
  </Component>
</template>
`;export{e as default};
