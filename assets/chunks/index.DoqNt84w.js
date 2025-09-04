const n=`<script lang="ts" setup>
import type { ButtonProps as ElButtonProps, FormInstance, FormItemProps } from 'element-plus'
import { ElButton, ElDialog, ElForm } from 'element-plus'
import { ProFormFields } from 'pro-el-components'
import 'pro-el-components/components/FormFields/style.css'
import { computed, nextTick, ref, watch } from 'vue'
import { unbind } from '../../utils'
import './style.css'

interface ModalFormProps {
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
  formItemProps?: Partial<FormItemProps>
  closeOnSuccess?: boolean
  resetOnClose?: boolean
  actions?: { text: string, type?: ElButtonProps['type'], onClick?: () => void }[]
}

defineOptions({
  name: 'ProModalForm',
})

const props = withDefaults(defineProps<ModalFormProps>(), {
  defaultValue: () => ({}),
  width: 500,
  closeOnSuccess: true,
  resetOnClose: true,
  column: 2,
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:formData': [value: Record<string, any>]
  'formChange': [value: Record<string, any>]
  'ok': [value: Record<string, any>]
  'cancel': []
}>()

const formRef = ref<FormInstance>()

const localFormData = ref<Record<string, any>>(unbind(props.defaultValue))

const formData = computed({
  get: () => props.formData ?? localFormData.value,
  set: (value) => {
    localFormData.value = value
    emit('update:formData', value)
    emit('formChange', value)
  },
})

// watch(() => props.modelValue, () => {
//   if (props.resetOnClose)
//     localFormData.value = unbind(props.defaultValue)
// }, { deep: true })

watch(
  () => props.defaultValue,
  (val) => {
    formData.value = unbind(val)
  },
  { deep: true },
)

async function handleOk() {
  try {
    if (!props.viewMode)
      await formRef.value?.validate()

    emit('ok', formData.value)
    if (props.viewMode || props.closeOnSuccess)
      emit('update:modelValue', false)
  }
  catch (error) {
    console.error('Form validation failed:', error)
  }
}

function handleCancel() {
  emit('update:modelValue', false)
  emit('cancel')
  if (props.resetOnClose)
    formData.value = unbind(props.defaultValue)
}

function handleDataChange(value: Record<string, any>) {
  formData.value = value
}

function handleBeforeClose(done: () => void) {
  nextTick(() => {
    if (props.resetOnClose)
      formData.value = unbind(props.defaultValue)
  })
  done()
}

defineExpose({
  formRef,
  formData,
  resetForm: () => formRef.value?.resetFields(),
  validate: () => formRef.value?.validate(),
})
<\/script>

<template>
  <ElDialog
    class="pro-modal-form"
    :model-value="modelValue"
    :width="width"
    :title="title"
    destroy-on-close
    :before-close="handleBeforeClose"
    v-bind="$attrs"
    @update:model-value="handleCancel"
  >
    <div v-loading="loading">
      <ElForm
        ref="formRef"
        :model="formData"
        label-width="auto"
        label-position="right"
        v-bind="formProps"
      >
        <slot name="header" />
        <slot
          :data="formData"
          :on-change="handleDataChange"
          :form-ref="formRef"
        >
          <ProFormFields
            v-if="fields"
            :model-value="formData"
            :column="column"
            :view-mode="viewMode"
            :fields="fields"
            :form-item-props="formItemProps"
            :prop-prefix="propPrefix"
            @update:model-value="handleDataChange"
          />
        </slot>
        <slot name="extra" />
      </ElForm>
    </div>

    <template #footer>
      <slot
        name="footer"
        :close="handleCancel"
        :ok="handleOk"
      >
        <div class="dialog-footer">
          <template v-if="actions">
            <ElButton v-for="({ text, ...action }, index) in actions" :key="index" v-bind="action">
              {{ text }}
            </ElButton>
          </template>
          <template v-else>
            <ElButton @click="handleCancel">
              取消
            </ElButton>
            <ElButton
              type="primary"
              @click="handleOk"
            >
              {{ viewMode ? '确定' : '提交' }}
            </ElButton>
          </template>
        </div>
      </slot>
    </template>
  </ElDialog>
</template>
`;export{n as default};
