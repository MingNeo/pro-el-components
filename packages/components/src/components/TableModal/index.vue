<script lang="ts" setup>
import type { DialogProps, PaginationProps, TableProps } from 'element-plus'
import type { Column } from 'pro-el-components'
import { ElDialog, vLoading } from 'element-plus'
import { ProTable, useTableList } from 'pro-el-components'
import { watch } from 'vue'
import 'element-plus/es/components/loading/style/index'
import 'pro-el-components/components/Table/style.css'
import './style.css'

defineOptions({
  name: 'ProTableModal',
})

const props = defineProps<{
  modelValue: boolean
  title?: string
  data?: Record<string, any>[]
  service?: (...args: any[]) => Promise<{ data: any, total: number } | any[]>
  columns: Column[]
  pagination?: Partial<PaginationProps>
  dialogProps?: Partial<DialogProps>
  tableProps?: Partial<TableProps<any>>
}>()

const emit = defineEmits(['update:modelValue'])

const { data: searchData, search, loading, pagination } = useTableList(props.service || (async (..._args: any) => []), { immediate: false })

watch(() => props.modelValue, (val: any, prevVal: any) => {
  if (props.service && !props.data && val && !prevVal)
    search.onSubmit()
})
</script>

<template>
  <ElDialog
    :model-value="modelValue"
    :title="props.title"
    :footer="false"
    destroy-on-close
    width="700px"
    v-bind="dialogProps"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot name="pre" />
    <ProTable
      v-loading="loading"
      :columns="columns"
      :pagination="props.pagination ?? pagination"
      :data="props.data ?? searchData"
      class="pro-table-modal"
      :column-setting="false"
      v-bind="tableProps"
    />
    <slot name="after" />
    <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
      <slot :name="key" v-bind="slotProps || {}" />
    </template>
  </ElDialog>
</template>
