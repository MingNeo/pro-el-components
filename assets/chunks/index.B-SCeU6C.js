const e=`<script lang="ts" setup>
import type { FormItemProps } from 'element-plus'
import type { ButtonAction } from 'pro-el-components'
import { ProModalForm, useRequest } from 'pro-el-components'
import 'pro-el-components/components/ModalForm/style.css'
import { computed, watch } from 'vue'

defineOptions({
  name: 'ProModalDetail',
})

const props = defineProps<{
  title?: string | { create: string, edit: string, detail: string }
  width?: number
  modelValue: boolean
  defaultValue?: any
  formData?: Record<string, any> // 用于v-model绑定表单state
  viewMode?: boolean
  idKey?: string
  fields: any
  column?: number
  mode?: 'edit' | 'create' | 'detail'
  updateService?: (formValues: Record<string, any>) => void
  createService?: (formValues: Record<string, any>) => void
  propPrefix?: any[]
  formItemProps?: Partial<FormItemProps>
  footerActions?: ButtonAction[]
}>()

const emit = defineEmits(['update:modelValue', 'ok', 'update:formData', 'formChange', 'open'])

const mode = computed(() => props.mode ?? (props.viewMode ? 'detail' : ((props.formData || props.defaultValue)?.[props.idKey || 'id'] !== undefined ? 'edit' : 'create')))
const showTitle = computed(() => typeof props.title === 'object' ? props.title[mode.value] : props.title)
const footerActions = computed(() => props.viewMode ? [] : props.footerActions)

watch(() => props.modelValue, val => val && emit('open'), { deep: true })

const { execute: submit, isLoading: isSubmitLoading } = useRequest(async (values, isEdit) => await (isEdit ? props.updateService : props.createService)?.(values), { immediate: false })

function handleFormDataChange(value: any) {
  emit('update:formData', value)
  emit('formChange', value)
}

async function handleOk(value: any) {
  if (!props.viewMode)
    await submit?.(value, mode.value === 'edit')

  emit('update:modelValue', false)
  emit('ok', value)
}

function handleCancel() {
  emit('update:modelValue', false)
}
<\/script>

<template>
  <ProModalForm
    :model-value="modelValue"
    :form-data="props.formData"
    :default-value="props.defaultValue"
    :width="width"
    :title="showTitle"
    :fields="props.fields"
    :view-mode="viewMode"
    :column="props.column"
    :prop-prefix="props.propPrefix"
    :form-item-props="props.formItemProps"
    :confirm-loading="isSubmitLoading"
    v-bind="$attrs"
    :footer-actions="footerActions"
    @update:form-data="handleFormDataChange"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
      <slot :name="key" v-bind="slotProps" />
    </template>
  </ProModalForm>
</template>
`;export{e as default};
