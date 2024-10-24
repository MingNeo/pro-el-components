<script lang="ts" setup>
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import type { FormItemsBuilderField } from '../../components/common/FormItemsBuilder/types'

const props = withDefaults(defineProps<{
  title?: string
  defaultValue?: any
  formState?: Record<string, any> // 如果使用此参数则defaultValue无效。此参数可使用v-model
  viewMode?: boolean
  fields?: FormItemsBuilderField[]
  extraFields?: { title?: string, fields: FormItemsBuilderField[] }[]
  column?: number
  formItemOptions?: Record<string, any>
  idKey?: string
  loading?: boolean
  headerActions?: any[]
  footerActions?: any[] | (({ submit, cancel, submitLoading }: { submit: () => Promise<void>, cancel: () => void, submitLoading: boolean }) => any[])
  showFooter?: boolean
  contentClass?: string
  updateService?: (...args: any[]) => void
  createService?: (...args: any[]) => void
}>(), { defaultValue: {}, showFooter: true, column: 3 })
const emit = defineEmits(['update:visible', 'ok', 'update:formState', 'submit'])

const router = useRouter()

const attrs = useAttrs() as { onCancel: () => void }

const formRef = ref()

const data = ref(props.formState ?? props.defaultValue)
const isEdit = computed(() => data.value[props.idKey || 'id'])

const { footer: footerSlot } = useSlots()

const { execute: submitForm, isLoading: isSubmitLoading } = useRequest(async (...args: any) => await (isEdit.value ? props.updateService : props.createService)?.(...args), {
  immediate: false,
})

watch(
  () => props.defaultValue,
  (val) => {
    if (!props.formState) {
      data.value = val
      emit('update:formState', data.value)
    }
  },
  { deep: true },
)

watch(
  () => props.formState,
  val => (data.value = val),
  { deep: true },
)

async function handleSubmit() {
  if (!props.viewMode) {
    try {
      const value = await formRef.value.validate()
      emit('update:formState', data.value)
      await submitForm?.(data.value)
      emit('submit', value)
      emit('ok', data.value)
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error)
    }
  }
}

function handleCancel() {
  attrs.onCancel ? attrs.onCancel() : router.back()
}

function handleDataChange(value: any, merge = false) {
  data.value = merge ? { ...data.value, ...value } : value
  emit('update:formState', data.value)
}

const footerActions = computed(() => ((Array.isArray(props.footerActions) ? props.footerActions : props.footerActions?.({ submit: handleSubmit, cancel: handleCancel, submitLoading: isSubmitLoading.value })) || [{
  text: '取消',
  onClick: handleCancel,
}, {
  text: '提交',
  type: 'primary',
  loading: isSubmitLoading.value,
  onClick: handleSubmit,
}]).map(v => ({ ...v, args: [data] })))

const showFooter = computed(() => {
  return (props.showFooter ?? !props.viewMode) && !!(footerActions.value?.length || footerSlot)
})

async function validField(fields: string[] = []) {
  if (fields?.length)
    await formRef.value.validate(fields)

  await formRef.value.validate()
}

defineExpose({
  validField,
})
</script>

<template>
  <page-header :title="title" :show-back="true" @cancel="handleCancel">
    <template #actions>
      <slot name="headerActions">
        <button-actions v-if="headerActions?.length" :header-actions="headerActions" />
      </slot>
    </template>
  </page-header>
  <detail-page-content :loading="loading" :class="`page-detail-content ${contentClass || ''}`">
    <el-form ref="formRef" :model="data" label-width="auto" label-position="right">
      <slot name="contentHeader" />
      <slot :data="data" :on-change="handleDataChange" :form-ref="formRef">
        <card v-if="fields?.length || $slots.contentExtra">
          <section-header v-if="fields?.length" class="mb-[10px]" title="基本信息" />
          <form-items-builder
            v-if="fields?.length"
            v-model="data"
            :column="column"
            :view-mode="viewMode"
            :fields="fields"
            :form-item-options="formItemOptions"
            @change="handleDataChange"
          />
          <div v-for="(item, index) in extraFields" :key="index" class="mt-[10px]">
            <section-header v-if="item.title" class="mb-[10px]" :title="item.title" />
            <form-items-builder
              v-if="item.fields?.length"
              v-model="data"
              :column="column"
              :view-mode="viewMode"
              :fields="item.fields"
              :form-item-options="formItemOptions"
              @change="handleDataChange"
            />
          </div>
          <slot name="contentExtra" />
        </card>
      </slot>
      <slot name="pageExtra" />
    </el-form>
  </detail-page-content>
  <div v-if="showFooter" class="page-detail-footer">
    <slot name="footer">
      <ButtonActions :actions="footerActions" :args="[data]" />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
  .page-detail-content {
    flex: 1;
    padding: 18px 20px;
  }

  .page-detail-footer {
    position: relative;
    z-index: 2;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    box-shadow: 0px -2px 6px -5px rgba(0, 0, 0, 0.04), 0px -2px 6px rgba(0, 0, 0, 0.06);
  }
</style>
