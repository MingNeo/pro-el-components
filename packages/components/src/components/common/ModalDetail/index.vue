<script lang="ts" setup>
  const props = defineProps<{
    title?: string
    width?: number
    visible: boolean
    defaultValue?: any
    formState?: Record<string, any> // 用于v-model绑定表单state
    viewMode?: boolean
    idKey?: string
    fields: any
    column?: number
    type?: 'edit' | 'create' | 'detail'
    updateService?: (formValues: Record<string, any>) => void
    createService?: (formValues: Record<string, any>) => void
    onVisible?: () => void
    namePrefix?: any[]
    formItemOptions?: Record<string, any>
  }>()

  const emit = defineEmits(['update:visible', 'ok', 'update:formState', 'formChange'])

  const visible = computed({
    get: () => props.visible,
    set: value => emit('update:visible', value),
  })

  function handleFormStateChange(value: any) {
    emit('update:formState', value)
    emit('formChange', value)
  }

  watch(() => props.visible, val => val && props.onVisible?.(), { deep: true })

  const { execute: submit, isLoading: isSubmitLoading } = useRequest(async (values, isEdit) => await (isEdit ? props.updateService : props.createService)?.(values), { immediate: false })

  async function handleOk(value: any) {
    if (!props.viewMode) {
      const isEdit = props.type ? props.type === 'edit' : value[props.idKey || 'id']
      await submit?.(value, isEdit)
    }

    visible.value = false
    emit('ok', value)
  }

  function handleCancel() {
    visible.value = false
  }
</script>

<template>
  <modal-form
    :model-value="visible"
    :form-state="props.formState"
    :default-value="props.defaultValue"
    :width="width"
    :title="title"
    :fields="props.fields"
    :view-mode="viewMode"
    :column="props.column"
    :name-prefix="props.namePrefix"
    :form-item-options="props.formItemOptions"
    :confirm-loading="isSubmitLoading"
    @update:form-state="handleFormStateChange"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
      <slot :name="key" v-bind="slotProps" />
    </template>
  </modal-form>
</template>
