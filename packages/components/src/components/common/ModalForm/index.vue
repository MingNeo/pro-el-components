<script lang="ts" setup>
  import { computed, defineEmits, defineProps, ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    title?: string
    width?: number
    modelValue?: boolean
    loading?: boolean
    defaultValue?: any
    formState?: Record<string, any> // 用于v-model绑定表单state
    viewMode?: boolean
    fields?: any
    column?: number
    namePrefix?: (string | number)[]
    formProps?: Record<string, any>
    formItemProps?: Record<string, any>
  }>(), { defaultValue: {} })

  const emit = defineEmits(['update:modelValue', 'ok', 'cancel', 'update:formState', 'formChange'])

  const formRef = ref()

  const localFormState = ref(unbind(props.defaultValue) || {})

  const formState = computed({
    get: () => {
      return props.formState ?? localFormState.value
    },
    set: (value) => {
      localFormState.value = value
      emit('update:formState', value)
      emit('formChange', value)
    },
  })

  watch(() => props.modelValue, (val) => {
    localFormState.value = val ? (unbind(props.defaultValue) || {}) : {}
  }, { deep: true })

  watch(
    () => props.defaultValue,
    val => (formState.value = unbind(val)),
    { deep: true },
  )

  async function handleOk() {
    try {
      if (!props.viewMode) {
        await formRef.value.validate()
        emit('ok', formState.value)
      }
      emit('update:modelValue', false)
    }
    catch (error) {
      console.error('error', error)
    }
  }

  function handleCancel() {
    emit('update:modelValue', false)
    emit('cancel')
    formState.value = {}
  }

  function handleDataChange(value: any) {
    formState.value = value
  }

  function handleBeforeClose(done: any) {
    nextTick(() => {
      formState.value = props.defaultValue
    })
    done()
  }

  defineExpose({
    formState,
  })
</script>

<template>
  <modal
    :model-value="modelValue"
    :width="width"
    :title="title"
    destroy-on-close
    :before-close="handleBeforeClose"
    v-bind="$attrs"
    @update:model-value="handleCancel"
  >
    <div v-loading="loading">
      <el-form
        ref="formRef"
        :model="formState"
        label-width="auto"
        label-position="right"
        v-bind="formProps"
      >
        <slot name="header" />
        <slot :data="formState" :on-change="handleDataChange" :form-ref="formRef">
          <form-items-builder
            :model-value="formState"
            :column="column || 2"
            :view-mode="viewMode"
            :fields="fields"
            :form-item-options="formItemProps"
            :name-prefix="namePrefix"
            @update:model-value="handleDataChange"
          />
        </slot>
        <slot name="extra" />
      </el-form>
    </div>

    <template #footer>
      <slot name="footer" :close="handleCancel" :ok="handleOk">
        <div class="dialog-footer flex justify-center gap-[8px]">
          <el-button @click="handleCancel">
            取消
          </el-button>
          <el-button type="primary" @click="handleOk">
            提交
          </el-button>
        </div>
      </slot>
    </template>
  </modal>
</template>
