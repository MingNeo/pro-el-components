const e=`<script lang="ts" setup>
import type { FormItemProps } from 'element-plus'
import type { ButtonAction, ProFormFieldsField } from 'pro-el-components'
import { ElForm, vLoading } from 'element-plus'
import { ProButtonActions, ProFormFields, ProPageHeader, ProSectionHeader, useRequest } from 'pro-el-components'
import { computed, getCurrentInstance, ref, useSlots, watch } from 'vue'
import 'element-plus/es/components/loading/style/index'
import 'pro-el-components/components/FormFields/style.css'
import 'pro-el-components/components/PageHeader/style.css'
import 'pro-el-components/components/SectionHeader/style.css'
import 'pro-el-components/components/ButtonActions/style.css'
import './style.css'

defineOptions({
  name: 'ProDetailPage',
})

const props = withDefaults(defineProps<{
  title?: string | ((type: 'create' | 'edit' | 'detail') => string)
  defaultValue?: any
  formData?: Record<string, any> // 如果使用此参数则defaultValue无效。此参数可使用v-model
  viewMode?: boolean
  type?: 'create' | 'edit' | 'detail'
  fields?: ProFormFieldsField[]
  extraFields?: { title?: string, fields: ProFormFieldsField[], actions?: ButtonAction[] }[]
  column?: number
  formItemProps?: Partial<FormItemProps>
  idKey?: string
  loading?: boolean
  headerActions?: any[]
  footerActions?: any[] | (({ submit, cancel, submitLoading }: { submit: () => Promise<void>, cancel: () => void, submitLoading: boolean }) => any[])
  footerClass?: string
  showFooter?: boolean
  contentClass?: string
  getDataService?: (...args: any[]) => Promise<Record<string, any> | any[]>
  updateService?: (...args: any[]) => any
  createService?: (...args: any[]) => any
}>(), {
  defaultValue: () => ({}),
  showFooter: true,
  column: 2,
})
const emit = defineEmits(['update:visible', 'ok', 'update:formData', 'submit', 'back'])

const instance = getCurrentInstance()
// 是否受控模式：检查 formData prop 是否被显式传入（标签上是否写了）
const isControlled = instance?.vnode?.props ? ('formData' in instance.vnode.props || 'form-data' in instance.vnode.props) : !!props.formData

const formRef = ref()

const data = ref(isControlled ? props.formData : props.defaultValue)
const mode = computed(() => props.type ?? (props.viewMode ? 'detail' : (data.value[props.idKey || 'id'] ? 'edit' : 'create')))

const { execute: submitForm, isLoading: isSubmitLoading } = useRequest(async (...args: any) => await (mode.value === 'edit' ? props.updateService : props.createService)?.(...args), {
  immediate: false,
})

const footerActions = computed(() => {
  if (mode.value === 'detail')
    return []

  return (
    (Array.isArray(props.footerActions) ? props.footerActions : props.footerActions?.({ submit: handleSubmit, cancel: handleCancel, submitLoading: isSubmitLoading.value }))
    || [{
      text: '取消',
      onClick: handleCancel,
    }, {
      text: '提交',
      type: 'primary',
      loading: isSubmitLoading.value,
      onClick: handleSubmit,
    }]
  ).map(v => ({ ...v, args: [data] }))
})

const { footer: footerSlot } = useSlots()
const showFooter = computed(() => (props.showFooter ?? mode.value !== 'detail') && !!(footerActions.value?.length || footerSlot))

if (!isControlled) {
  watch(
    () => props.defaultValue,
    (val) => {
      data.value = val
      // 可能有单独监听update:formData事件而非 v-model 的写法，进行兼容
      emit('update:formData', data.value)
    },
    { deep: true },
  )
}

watch(
  () => props.formData,
  val => (data.value = val),
  { deep: true },
)

// 如果存在getDataService，则自动执行获取数据
const isGetDataLoading = ref(false)

watch(mode, (newMode) => {
  if (!newMode || newMode !== 'create') {
    if (props.getDataService) {
      isGetDataLoading.value = true
      props.getDataService().then((res) => {
        data.value = res
        emit('update:formData', data.value)
      }).finally(() => {
        isGetDataLoading.value = false
      })
    }
    return
  }

  data.value = isControlled ? props.formData : props.defaultValue
}, { immediate: true })

async function handleSubmit() {
  if (mode.value !== 'detail') {
    try {
      const value = await formRef.value.validate()
      emit('update:formData', data.value)
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
  emit('back')
}

function handleDataChange(value: any, merge = false) {
  data.value = merge ? { ...data.value, ...value } : value
  emit('update:formData', data.value)
}

async function validField(fields: string[] = []) {
  if (fields?.length)
    await formRef.value.validate(fields)

  await formRef.value.validate()
}

defineExpose({
  validField,
})
<\/script>

<template>
  <div class="pro-detail-page">
    <slot name="header">
      <ProPageHeader :title="typeof title === 'function' ? title(mode) : title" :show-back="true" @cancel="emit('back')">
        <template #actions>
          <slot name="headerActions">
            <ProButtonActions v-if="headerActions?.length" :actions="headerActions" />
          </slot>
        </template>
      </ProPageHeader>
    </slot>

    <div v-loading="loading || isGetDataLoading" :class="\`page-detail-content page-container \${contentClass || ''}\`">
      <ElForm ref="formRef" :model="data" label-width="auto" label-position="right">
        <slot name="contentHeader" />
        <slot :data="data" :on-change="handleDataChange" :form-ref="formRef">
          <div v-if="fields?.length || extraFields?.length || $slots.contentExtra" class="pro-detail-card">
            <template v-if="fields?.length">
              <ProFormFields
                v-model="data"
                :column="column"
                :view-mode="mode === 'detail'"
                :fields="fields"
                :form-item-props="formItemProps"
                @change="handleDataChange"
              />
            </template>

            <div v-for="(item, index) in extraFields" :key="index" class="extra-field-section">
              <ProSectionHeader v-if="item.title" class="extra-field-header" :title="item.title" :actions="item.actions" />
              <ProFormFields
                v-if="item.fields?.length"
                v-model="data"
                :column="column"
                :view-mode="mode === 'detail'"
                :fields="item.fields"
                :form-item-props="formItemProps"
                @change="handleDataChange"
              />
            </div>
            <slot name="contentExtra" />
          </div>
        </slot>
        <slot name="pageExtra" />
      </ElForm>
    </div>
    <div v-if="showFooter" :class="\`page-detail-footer \${footerClass || ''}\`">
      <slot name="footer">
        <ProButtonActions type="button" size="default" :actions="footerActions" :args="[data]" />
      </slot>
    </div>
  </div>
</template>
`;export{e as default};
