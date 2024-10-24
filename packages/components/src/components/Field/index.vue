<script lang="ts" setup>
import type { Component } from 'vue'
import type { ValueType } from './types'
import dayjs from 'dayjs'
import { ElColorPicker, ElDatePicker, ElImage, ElInput, ElInputNumber, ElRate, ElSwitch, ElUpload } from 'element-plus'
import { ProCascader, ProCheckbox, ProRadio, ProSelect } from 'pro-el-components'
import { computed, ref, watch } from 'vue'
import './style.css'

defineOptions({
  name: 'ProField',
})

const props = defineProps<{
  modelValue?: any
  valueType?: ValueType
  fieldProps?: Record<string, any>
  viewMode?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'change'])

const innerValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  innerValue.value = newVal
})

const field = computed(() => {
  switch (props.valueType) {
    case 'input':
      return { component: ElInput, props: props.fieldProps }
    case 'number':
      return { component: ElInputNumber, props: props.fieldProps }
    case 'password':
      return { component: ElInput, props: { type: 'password', showPassword: true, ...props.fieldProps } }
    case 'textarea':
      return { component: ElInput, props: { type: 'textarea', ...props.fieldProps } }
    case 'select':
      return { component: ProSelect, props: props.fieldProps }
    case 'date':
      return { component: ElDatePicker, props: { type: 'date', ...props.fieldProps } }
    case 'dateTime':
      return { component: ElDatePicker, props: { type: 'datetime', ...props.fieldProps } }
    case 'dateRange':
      return { component: ElDatePicker, props: { type: 'daterange', ...props.fieldProps } }
    case 'dateTimeRange':
      return { component: ElDatePicker, props: { type: 'datetimerange', ...props.fieldProps } }
    case 'switch':
      return { component: ElSwitch, props: props.fieldProps }
    case 'rate':
      return { component: ElRate, props: { ...props.fieldProps, disabled: !!props.viewMode || props.fieldProps?.disabled } }
    case 'radio':
      return { component: ProRadio, props: props.fieldProps }
    case 'checkbox':
      return { component: ProCheckbox, props: props.fieldProps }
    case 'color':
      return { component: ElColorPicker, props: props.fieldProps }
    case 'image':
      return { component: ElImage, props: { src: innerValue.value, ...props.fieldProps } }
    case 'file':
      return { component: ElUpload, props: { fileList: innerValue.value, ...props.fieldProps } }
    default:
      return { component: 'div', props: props.fieldProps }
  }
})

function handleChange(val: any) {
  emit('update:modelValue', val)
  emit('change', val)
}

const viewInfo = computed<{ value?: string, type?: string, component?: Component, props?: Record<string, any> }>(() => {
  if (!props.viewMode)
    return {}

  const disabled = !!props.viewMode || props.fieldProps?.disabled
  switch (props.valueType) {
    case 'password':
      return { value: '******', type: 'text' }
    case 'date':
      return { value: innerValue.value ? dayjs(innerValue.value).format('YYYY-MM-DD') : '-', type: 'text' }
    case 'dateTime':
      return { value: innerValue.value ? dayjs(innerValue.value).format('YYYY-MM-DD HH:mm:ss') : '-', type: 'text' }
    case 'dateRange':
    case 'dateTimeRange':
      if (Array.isArray(innerValue.value) && innerValue.value.length === 2) {
        const format = props.valueType === 'dateRange' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
        return { value: `${dayjs(innerValue.value[0]).format(format)} 至 ${dayjs(innerValue.value[1]).format(format)}`, type: 'text' }
      }
      return { value: '-', type: 'text' }
    case 'switch':
      return { value: innerValue.value ? '是' : '否', type: 'text' }
    case 'select':
    case 'radio':
    case 'checkbox':
      {
        if (!props.fieldProps?.options)
          return { value: '-', type: 'text' }
        const items = props.fieldProps?.options || []
        if (Array.isArray(innerValue.value)) {
          return {
            value: innerValue.value
              .map((val: any) => items.find((item: any) => item.value === val)?.label)
              .filter(Boolean)
              .join('、') || '-',
            type: 'text',
          }
        }
        return { value: items.find((item: any) => item.value === innerValue.value)?.label || '-', type: 'text' }
      }
    case 'rate':
      return { type: 'component', component: ElRate, props: { modelValue: innerValue.value || '-', onUpdateModelValue: handleChange, ...props.fieldProps, disabled } }
    case 'cascader':
      return { type: 'component', component: ProCascader, props: { viewMode: true, modelValue: innerValue.value || '-', onUpdateModelValue: handleChange, ...props.fieldProps, disabled } }
    case 'image':
      return { type: 'component', component: ElImage, props: { src: innerValue.value, onUpdateModelValue: handleChange, ...props.fieldProps } }
    case 'file':
      return { type: 'component', component: ElUpload, props: { viewMode: true, fileList: innerValue.value, ...props.fieldProps, disabled, onUpdateFileList: handleChange } }
    default:
      return { value: innerValue.value || '-', type: 'text' }
  }
})
</script>

<template>
  <template v-if="viewMode">
    <component
      :is="viewInfo.component"
      v-if="viewInfo.type === 'component'"
      v-bind="viewInfo.props"
    />
    <span v-else class="pro-field-view">{{ viewInfo.value }}</span>
  </template>
  <component
    :is="field.component"
    v-else
    v-bind="field.props"
    v-model="innerValue"
    @update:model-value="handleChange"
  />
</template>
