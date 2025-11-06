<script setup lang="ts">
import type { TableSelectorProps } from './types'
import { vLoading } from 'element-plus'
import { ProSearchForm, ProTable, useTableList } from 'pro-el-components'
import { computed, ref, watch } from 'vue'
import 'element-plus/es/components/loading/style/index'
import 'pro-el-components/components/SearchForm/style.css'
import 'pro-el-components/components/Table/style.css'
import './style.css'

defineOptions({
  name: 'ProTableSelector',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TableSelectorProps>(), {
  showSearchActions: true,
  idKey: 'id',
})
const emit = defineEmits(['update:modelValue', 'change'])

const tableListService = props.service || (async ({ pageNo, pageSize }) => {
  return { total: props.data?.length, data: props.data?.slice((pageNo - 1) * pageSize, pageNo * pageSize) }
})

const { data, search, loading, pagination } = useTableList(tableListService, { defaultPageSize: 10 })

const selectedRows = ref<any[]>([])

function handleSelectionChange(selection: any[]) {
  selectedRows.value = selection
  emit('update:modelValue', selectedRows.value)
  emit('change', selectedRows.value)
}

const tableRef = ref<any>(null)
const showIds = computed(() => data.value.map(item => item[props.idKey]))
function toggleSelection(rows?: any[], ignoreSelectable?: boolean) {
  if (!tableRef.value)
    return

  if (rows) {
    rows.forEach((row) => {
      if (showIds.value.includes(row[props.idKey])) {
        tableRef.value!.toggleRowSelection?.(
          row,
          undefined,
          ignoreSelectable,
        )
      }
    })
  }
  else {
    tableRef.value.clearSelection?.()
  }
}

watch([data, () => props.modelValue], () => {
  toggleSelection(props.modelValue)
})
</script>

<template>
  <div>
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
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
    >
      <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
        <slot :name="key" v-bind="slotProps || {}" />
      </template>
    </ProTable>
  </div>
</template>
