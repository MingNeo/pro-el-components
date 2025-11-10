<script setup lang="ts">
import type { TableSelectorProps } from './types'
import { vLoading } from 'element-plus'
import { ProSearchForm, ProTable, useTableList, useTableSelection } from 'pro-el-components'
import { computed, ref } from 'vue'
import 'element-plus/es/components/loading/style/index'
import 'pro-el-components/components/SearchForm/style.css'
import 'pro-el-components/components/Table/style.css'
import './style.css'

defineOptions({
  name: 'ProTableSelector',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TableSelectorProps>(), {
  mode: 'multiple',
  showSearchActions: true,
  idKey: 'id',
  pageSize: 10,
})
const emit = defineEmits(['update:modelValue', 'change'])

// 每次调用时读取最新的 props，保持响应性
async function tableListService(params: { pageNo: number, pageSize: number }) {
  if (props.service) {
    return props.service(params)
  }
  return { total: props.data?.length ?? 0, data: props.data?.slice((params.pageNo - 1) * params.pageSize, params.pageNo * params.pageSize) ?? [] }
}

const { data, search, loading, pagination } = useTableList(tableListService, { defaultPageSize: props.pageSize })

const tableRef = ref<any>(null)

// 多选模式始终初始化 hooks（Vue Composition API 规则：hooks 必须在顶层调用）
const {
  handleSelect,
  handleSelectAll,
  clearSelection: _clearSelection,
} = useTableSelection({
  tableRef,
  data,
  loading,
  defaultSelectdRows: computed(() => props.modelValue),
  idKey: props.idKey,
  onChange: (rows) => {
    emit('update:modelValue', rows)
    emit('change', rows)
  },
})

// 使用 computed 保持响应性，当 props.mode 变化时会自动更新
const isSingleMode = computed(() => props.mode === 'single' || props.highlightCurrentRow)

const selectionProps = computed(() => {
  if (isSingleMode.value) {
    return {
      highlightCurrentRow: true,
      onCurrentChange: (selection: any) => {
        emit('update:modelValue', selection)
        emit('change', selection)
      },
    }
  }
  return { onSelect: handleSelect, onSelectAll: handleSelectAll }
})

function clearSelection() {
  if (!isSingleMode.value) {
    _clearSelection()
  }
  else {
    tableRef.value?.setCurrentRow?.()
  }
}

defineExpose({
  clearSelection,
  pagination,
  loading,
})
</script>

<template>
  <div class="pro-table-selector">
    <ProSearchForm
      v-if="service && searchFields?.length"
      class="table-selector-search-form"
      :column="searchColumn || 2" :fields="searchFields"
      :search="search" :show-actions="showSearchActions"
      :form-item-props="formItemProps"
    />
    <ProTable
      ref="tableRef"
      v-loading="loading"
      :columns="columns"
      :data="data"
      :pagination="pagination"
      v-bind="{ ...$attrs, ...selectionProps }"
    >
      <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
        <slot :name="key" v-bind="slotProps || {}" />
      </template>
    </ProTable>
  </div>
</template>
