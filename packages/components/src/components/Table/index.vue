<script lang="ts" setup>
import type { Column, ColumnKey, TableProps } from './types'
import { useEventListener } from '@vueuse/core'
import dayjs from 'dayjs'
import { ElPagination, ElTable, ElTableColumn } from 'element-plus'
import { keyBy } from 'lodash-es'
import { ProButtonActions, ProSectionHeader, ProStatusText } from 'pro-el-components'
import { computed, defineProps, inject, ref, useSlots, watchEffect, withDefaults } from 'vue'
import ColumnSetting from './ColumnSetting.vue'
import { defaultGetColumnKeys, defaultSaveColumnKeys, getColumnKeys, getRenderProps } from './helper'
import 'pro-el-components/components/ButtonActions/style.css'
import 'pro-el-components/components/SectionHeader/style.css'
import 'pro-el-components/components/StatusText/style.css'
import './style.css'

defineOptions({
  name: 'ProTable',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TableProps>(), {
  columnSetting: undefined,
  autoHeight: undefined,
  bottomOffset: 100,
})

const isInListPageContent = inject('isInListPageContent', false)
// const columnSetting = computed(() => props.columnSetting ?? isInListPageContent)

const tableKey = props.tableId || window.location.pathname?.replace(/\//g, '_')

const tableRef = ref()

const cachedColumns = ref<ColumnKey[]>(
  (props.savedConfig?.getColumnKeys?.(tableKey) ?? defaultGetColumnKeys(tableKey)) || [],
)

const columnKeys = computed(() => cachedColumns.value || getColumnKeys(props.columns))

const columns = computed<Column[]>(() => {
  const result = (props.columns || []).map((column) => {
    return {
      ...column,
      width: column.width || (column.columnType === 'actions' ? 150 : undefined),
      mappingMap: column.renderAs === 'enum' && column.fieldProps?.options?.length ? keyBy(column.fieldProps?.options, 'value') : {},
    } as Column
  })
  if (props.columnSetting && columnKeys.value.length) {
    const actionsColumn = result.filter(column => column.columnType === 'actions')
    const otherColumns = columnKeys.value.map((column) => {
      return column.visible ? result.find(_column => _column.prop === column.prop) : null
    }).filter(Boolean)
    return [...(otherColumns || []), ...(actionsColumn || [])] as Column[]
  }
  return result
})

const showData = computed(() => {
  if (!props.pagination)
    return props.data

  const { pageSize = 10, currentPage = 1 } = props.pagination
  return props.data?.slice((currentPage - 1) * pageSize, currentPage * pageSize)
})

function handleSaveColumnKeys(columnKeys: ColumnKey[]) {
  cachedColumns.value = columnKeys
  const saveFunc = props.savedConfig?.saveColumnKeys ?? defaultSaveColumnKeys
  const isAllSelected = columnKeys.every(column => column.visible)
  saveFunc(tableKey, columnKeys, isAllSelected)
}

// 自动计算高度
const tableHeight = ref()

// 设置autoHeight，或在ListPageContent组件中自动计算高度
watchEffect(updateTableHeight)
useEventListener(window, 'resize', updateTableHeight)

function updateTableHeight() {
  if (props.autoHeight ?? isInListPageContent) {
    // 使用 props.bottomOffset 替代固定值
    tableHeight.value = window.innerHeight - (tableRef.value?.getBoundingClientRect().top || 0) - props.bottomOffset
  }
}

const slots = useSlots()
const showSlots = computed(() => Object.keys(slots).filter(key => key !== 'default'))
</script>

<template>
  <div :class="`pro-table ${props.class}`">
    <ProSectionHeader v-if="props.title || props.actions" :title="props.title" size="small" :actions="props.actions" class="table-header" />
    <div ref="tableRef" class="pro-table-inner">
      <ElTable class="pro-el-table" :data="showData" v-bind="$attrs">
        <template #default="defaultSlotProps">
          <slot name="default" v-bind="defaultSlotProps || {}" />
          <ElTableColumn v-for="(column) in columns" :key="column.prop" :label="column.label" :prop="column.prop" v-bind="column">
            <template #header="{ $index }">
              <div v-if="column.columnType === 'actions'" class="header-actions">
                {{ column.label || '操作' }}
                <ColumnSetting
                  v-if="columnSetting"
                  :columns="props.columns"
                  :table-key="tableKey"
                  :saved-column-keys="cachedColumns"
                  @save="handleSaveColumnKeys"
                />
              </div>
              <slot v-else-if="column.type !== 'selection'" name="column-header" v-bind="{ column, $index }" />
            </template>

            <template #default="{ row, $index }">
              <ProButtonActions
                v-if="column.columnType === 'actions'" v-bind="column"
                :record="row" type="link" :index="$index"
              />
              <slot v-else-if="column.type !== 'selection'" name="column-default" v-bind="{ $index, row, column }">
                <template v-if="column.renderAs && !column.customRender">
                  <div v-if="column.renderAs === 'file'" class="file-links" v-bind="getRenderProps(column.renderProps, row, column)">
                    <a v-for="(item, i) in ([row[column.prop!]].flat())" :key="i" target="_blank" :href="typeof item === 'string' ? item : item?.url">{{ typeof item === 'string' ? '附件' : item?.name }}</a>
                  </div>
                  <img v-else-if="column.renderAs === 'image'" :src="row[column.prop!]" alt="" class="table-image" v-bind="getRenderProps(column.renderProps, row, column)">
                  <span v-else-if="column.renderAs === 'date'" v-bind="getRenderProps(column.renderProps, row, column)">
                    {{ row[column.prop!] ? dayjs(row[column.prop!]).format(column.fieldProps?.format || 'YYYY-MM-DD') : '' }}
                  </span>
                  <Component
                    :is="column.renderAs"
                    v-else-if="column.renderAs && typeof column.renderAs !== 'string'"
                    v-bind="{ ...row[column.prop!], ...getRenderProps(column.renderProps, row, column) }"
                  />
                  <Component :is="column.mappingMap![row[column.prop!]]?.status ? ProStatusText : 'div'" v-else-if="column.renderAs === 'enum'" :status="column.mappingMap![row[column.prop!]]?.status" :style="column.mappingMap![row[column.prop!]]?.style">
                    {{ column.mappingMap![row[column.prop!]]?.label || row[column.prop!] }}
                  </Component>
                </template>
                <div v-else-if="column.customRender">
                  {{ column.customRender(row, column, $index) }}
                </div>
                <template v-else>
                  {{ row[column.prop!] }}
                </template>
              </slot>
            </template>

            <template #filter-icon>
              <slot name="column-filter-icon" />
            </template>
          </ElTableColumn>
        </template>

        <template v-for="(key) in showSlots" :key="key" #[key]="slotProps">
          <slot :name="key" v-bind="slotProps || {}" />
        </template>
      </ElTable>
      <ElPagination v-if="props.pagination" v-bind="props.pagination" class="pro-table-pagination" />
    </div>
  </div>
</template>
