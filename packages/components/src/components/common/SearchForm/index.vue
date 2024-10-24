<script lang="ts" setup>
  import { isObject } from 'lodash-es'
  import type { SearchField } from './types'
  import SearchFormButtons from './buttons.vue'
  import FormItemsBuilder from '@/components/common/FormItemsBuilder/index.vue'

  const props = withDefaults(defineProps<{
    fields: SearchField[]
    search?: {
      submit?: (...args: any[]) => void
      reset?: (...args: any[]) => void
    }
    column?: number
    defaultValue?: Record<string, any>
    defaultGroup?: string
    showActions?: boolean // 可以隐藏搜索、清空按钮
    formItemOptions?: Record<string, any>
    form?: any
  }>(), { defaultValue: () => ({}), showActions: true })

  const emit = defineEmits(['submit', 'reset'])
  const { search, form } = props

  const formRef = isRef(form) ? form : ref()

  const showFields = computed<any[]>(() => [
    ...props.fields,
    props.showActions && {
      type: 'actions',
      component: SearchFormButtons,
      col: { flex: 1 },
      on: {
        reset: onSearchReset,
      },
    },
  ].filter(Boolean))
  const { pageNo: _pageNo, pageSize: _pageSize, ...defaultValue } = props.defaultValue || {}
  const searchState = ref<Record<string, any>>({ ...defaultValue })
  const submitedState = ref<Record<string, any>>({ ...defaultValue })

  watch(() => props.defaultValue, (val) => {
    const { pageNo, pageSize, ...newVal } = val || {}

    searchState.value = formatSubmitValue(newVal, props.fields)
    submitedState.value = { ...newVal }
  }, { deep: true })

  // 用于底部已选择展示
  function onSearchSubmit(values: Record<string, any>) {
    submitedState.value = formatSubmitValue(values, props.fields)
    emit('submit', submitedState.value)
    search?.submit?.(submitedState.value)
  }

  function onSearchReset(...args: any[]) {
    formRef?.value?.resetFields()
    submitedState.value = {}
    searchState.value = {}
    emit('reset', ...args)
    search?.reset?.(...args)
  }

  function onClearField() {
    formRef?.value?.resetFields()
    submitedState.value = {}
  }

  const formItemOptions = {
    colon: false,
    ...(props.formItemOptions || {
      labelCol: { style: { width: '80px' }, labelAlign: 'right' },
    }),
  }

  function handleUpdateSearchState(values: Record<string, any>) {
    searchState.value = formatSubmitValue(values, props.fields)
  }

  defineExpose({
    onSearchReset,
    onClearField,
  })
</script>

<script lang="ts">
  function formatSubmitValue(values: Record<string, any> = {}, fields: SearchField[]) {
    const newValue = { ...values }
    fields.forEach((field: SearchField) => {
      if (Array.isArray(field.mappingField) && field.mappingField.length) {
        field.mappingField.forEach((fieldName: any, index) => {
          let name = fieldName
          let format = (v: any) => v
          if (isObject(fieldName)) {
            name = (fieldName as any)?.name
            format = (fieldName as any)?.formatValue || format
          }

          newValue[name] = format(newValue[field.name]?.[index])
        })
      }
    })

    return newValue
  }
</script>

<template>
  <div class="pro-search-form" v-bind="$attrs">
    <el-form ref="formRef" :model="searchState" name="advanced_search" class="el-advanced-search-form" @finish="onSearchSubmit">
      <FormItemsBuilder :model-value="searchState" :fields="showFields" :column="props.column || 3" :form-item-options="formItemOptions" @update:model-value="handleUpdateSearchState" />
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
  .pro-search-form {
    padding: 10px 16px 10px;
    background: #fff;
    box-shadow: 4px 4px 2px -1px rgba(0, 0, 0, 0.06);
    border-radius: 8px;
    margin-bottom: 16px;

    .title {
      display: flex;
      align-items: center;
      margin-bottom: 0;
      font-size: 16px;

      &::before {
        content: '';
        width: 4px;
        height: 12px;
        border-radius: 6px 0 6px 0;
        background: linear-gradient(181.09deg, #007AFF 48.27%, rgba(0, 87, 255, 0.38) 95.6%);
        display: block;
        margin-right: 8px;
      }
    }

    .search-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding-top: 10px;
      margin-top: 0px;

      &-left {
        flex: 1;
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-right: 24px;
      }

      .no-wrap {
        white-space: nowrap;
      }

      .search-tag-list {
        display: flex;
        flex-wrap: wrap;

        .search-tag {
          margin-block: 2px;
          white-space: normal;
        }
      }
    }

    .clear-btn {
      margin: 0 8px
    }
  }
</style>

<style lang="scss">
  .pro-search-form {
    .el-form-item {
      margin-bottom: 10px !important;
    }

    .el-input,
    .el-select-selector,
    .el-select:not(.el-select-customize-input) .el-select-selector,
    .el-input-number,
    .el-input-number-input,
    .el-picker {
      background: #F5F5F5;
      background-color: #F5F5F5 !important;
      border-radius: 4px !important;
      border: none !important;
    }

    .el-input-number {
      width: 100%;
    }

    .el-tag-blue {
      color: #333;
      background: #F0F7FF;
      background-color: #F0F7FF !important;
      border: 1px solid #CCE4FF !important;
      border-radius: 4px !important;
      padding: 3px 8px;
    }

    .el-form-item-label>label {
      font-weight: 400;
    }
  }
</style>
