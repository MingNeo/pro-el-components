<script lang="ts" setup>
import type { SearchFormProps } from './types'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { ElButton, ElForm, ElIcon } from 'element-plus'
import { ProFormFields } from 'pro-el-components'
import 'pro-el-components/components/FormFields/style.css'
import { computed, isRef, ref, watch } from 'vue'
import SearchFormButtons from './buttons.vue'
import './style.css'

defineOptions({
  name: 'ProSearchForm',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SearchFormProps>(), {
  defaultValue: () => ({}),
  column: 3,
  showActions: true,
  collapsible: false,
  defaultCollapsed: true,
  collapseRows: 1,
  formProps: () => ({}),
  formBuilderProps: () => ({}),
  showLabel: true,
})

const emit = defineEmits(['submit', 'reset', 'change'])
const { form } = props

const formRef = isRef(form) ? form : ref()

const searchFormData = ref<Record<string, any>>({ ...props.defaultValue })

watch(() => props.defaultValue, (val) => {
  const { pageNo: _pageNo, pageSize: _pageSize, ...newVal } = val || {}
  searchFormData.value = newVal
}, { deep: true })

const isCollapsed = ref(props.defaultCollapsed)

const fields = computed(() => props.fields?.filter(Boolean)?.map(({ rules: _rules, required: _required, ...v }) => v))

const showFields = computed(() => {
  if (!props.collapsible || !isCollapsed.value)
    return fields.value

  if (props.collapsedFields?.length)
    return fields.value.filter(field => props.collapsedFields!.includes(field.prop))

  const visibleCount = props.collapseRows * props.column
  return fields.value.slice(0, visibleCount)
  // return [...fields, props.showActions && { type: 'component', component: SearchFormButtons }].filter(Boolean)
})

// 监听表单值变化
watch(searchFormData, (newVal) => {
  emit('change', newVal)
}, { deep: true })

function onSearchSubmit() {
  emit('submit', { ...searchFormData.value })
}

function onSearchReset() {
  formRef?.value?.resetFields()
  searchFormData.value = {}
  emit('reset', {})
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

defineExpose({
  searchFormData,
  onSearchReset,
})
</script>

<template>
  <div class="pro-search-form" :class="props.class">
    <ElForm ref="formRef" :model="searchFormData" label-width="auto" label-position="right" name="advanced_search" class="pro-search-form__el-form" v-bind="formProps">
      <ProFormFields v-model="searchFormData" :show-label="props.showLabel" :column="props.column" :fields="showFields" :inline="formProps?.inline" v-bind="formBuilderProps">
        <div class="action-container" :class="{ 'action-container--full': showFields.length % props.column === 0 }">
          <slot name="actions" v-bind="{ onSearchReset }">
            <SearchFormButtons
              v-if="props.showActions"
              :collapsible="props.collapsible"
              :is-collapsed="isCollapsed"
              @submit="onSearchSubmit"
              @reset="onSearchReset"
              @toggle-collapse="toggleCollapse"
            />
          </slot>

          <ElButton
            v-if="collapsible && !formProps?.inline"
            class="pro-search-form__collapse-btn"
            link
            type="primary"
            @click="toggleCollapse"
          >
            {{ isCollapsed ? '展开' : '收起' }}
            <ElIcon class="collapse-icon">
              <component :is="isCollapsed ? ArrowDown : ArrowUp" />
            </ElIcon>
          </ElButton>
        </div>
      </ProFormFields>
    </ElForm>
  </div>
</template>
