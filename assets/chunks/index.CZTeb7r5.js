const n=`<script lang="ts" setup>
import type { SearchField } from '../SearchForm/types'
import type { Column, ColumnKey, TableProps } from './types'
import { useEventListener } from '@vueuse/core'
import dayjs from 'dayjs'
import { ElPagination, ElTable, ElTableColumn } from 'element-plus'
import { keyBy } from 'lodash-es'
import { ProButtonActions, ProSearchForm, ProSectionHeader, ProStatusText } from 'pro-el-components'
import { computed, inject, ref, useSlots, watchEffect } from 'vue'
import ColumnSetting from './ColumnSetting.vue'
import { defaultGetColumnKeys, defaultSaveColumnKeys, getColumnKeys, getRenderProps } from './helper'
import 'pro-el-components/components/ButtonActions/style.css'
import 'pro-el-components/components/SearchForm/style.css'
import 'pro-el-components/components/SectionHeader/style.css'
import 'pro-el-components/components/StatusText/style.css'
import './style.css'

defineOptions({
  name: 'ProTable',
  inheritAttrs: false,
})

const { data, height, tableId, columnSetting, autoHeight, class: className, columns: propsColumns = [], pagination, bottomOffset = 100, savedConfig, actions, title, searchForm } = defineProps<TableProps>()
const emit = defineEmits<{
  (e: 'search', value: Record<string, any>): void
  (e: 'searchReset'): void
}>()

const isInListPage = inject('isInListPage', false)

const tableKey = tableId || window.location.pathname?.replace(/\\//g, '_')

const tableRef = ref()
const elTableRef = ref()

const cachedColumns = ref<ColumnKey[]>(
  (savedConfig?.getColumnKeys?.(tableKey) ?? defaultGetColumnKeys(tableKey)) || [],
)

// 从 renderAs 推断搜索字段类型
function inferSearchType(column: Column): string {
  if (column.renderAs === 'date')
    return 'datePicker'
  if (column.renderAs === 'enum' && column.fieldProps?.options?.length)
    return 'select'
  return 'input'
}

// 从 columns 中提取搜索字段
const searchFields = computed<SearchField[]>(() => {
  if (!searchForm)
    return []

  // 如果传入了 fields 配置，直接使用
  if (typeof searchForm === 'object' && searchForm.fields?.length)
    return searchForm.fields

  // 从 columns 中自动提取 search: true 的字段
  return (propsColumns || [])
    .filter(col => col.search && col.prop)
    .map(col => ({
      prop: col.searchProp || col.prop!,
      label: col.label,
      type: col.searchType || inferSearchType(col),
      fieldProps: {
        clearable: true,
        ...(col.renderAs === 'enum' ? { options: col.fieldProps?.options } : {}),
        ...col.searchFieldProps,
      },
    }))
})

// 搜索表单配置
const searchFormConfig = computed(() => {
  if (!searchForm || !searchFields.value.length)
    return null
  const config = typeof searchForm === 'boolean' ? {} : searchForm
  return { ...config, fields: searchFields.value }
})

// 搜索表单 ref
const searchFormRef = ref()

function handleSearch(formData: Record<string, any>) {
  emit('search', formData)
}

function handleSearchReset() {
  emit('searchReset')
}

const columnKeys = computed(() => cachedColumns.value || getColumnKeys(propsColumns || []))

const columns = computed<Column[]>(() => {
  const result = (propsColumns || []).map((column) => {
    return {
      ...column,
      width: column.width || (column.columnType === 'actions' ? 150 : undefined),
      mappingMap: column.renderAs === 'enum' && column.fieldProps?.options?.length ? keyBy(column.fieldProps?.options, 'value') : {},
    } as Column
  })
  if (columnSetting && columnKeys.value.length) {
    const actionsColumn = result.filter(column => column.columnType === 'actions')
    const otherColumns = columnKeys.value.map((column) => {
      return column.visible ? result.find(_column => _column.prop === column.prop) : null
    }).filter(Boolean)
    return [...(otherColumns || []), ...(actionsColumn || [])] as Column[]
  }
  return result
})

const showData = computed(() => {
  if (!pagination)
    return data

  const { pageSize = 10, currentPage = 1 } = pagination
  return data?.slice((currentPage - 1) * pageSize, currentPage * pageSize)
})

function handleSaveColumnKeys(columnKeys: ColumnKey[]) {
  cachedColumns.value = columnKeys
  const saveFunc = savedConfig?.saveColumnKeys ?? defaultSaveColumnKeys
  const isAllSelected = columnKeys.every(column => column.visible)
  saveFunc(tableKey, columnKeys, isAllSelected)
}

// 自动计算高度
const tableHeight = ref<number | undefined>(height ? +height : undefined)

// autoHeight/在ListPage组件中时，自动计算高度
watchEffect(updateTableHeight)
useEventListener(window, 'resize', updateTableHeight)

function updateTableHeight() {
  if (autoHeight ?? isInListPage) {
    // 使用 bottomOffset 替代固定值
    tableHeight.value = window.innerHeight - (tableRef.value?.getBoundingClientRect().top || 0) - bottomOffset
  }
}

const slots = useSlots()
const showSlots = computed(() => Object.keys(slots).filter(key => key !== 'default'))

// 暴露 ElTable 和 SearchForm 的方法给父组件
defineExpose(new Proxy({}, {
  get(_, prop) {
    if (prop === 'searchForm')
      return searchFormRef.value
    return elTableRef.value?.[prop]
  },
}))
<\/script>

<template>
  <div :class="\`pro-table \${className || ''}\`">
    <!-- 搜索表单 -->
    <ProSearchForm
      v-if="searchFormConfig"
      ref="searchFormRef"
      class="pro-table-search-form"
      v-bind="searchFormConfig"
      @submit="handleSearch"
      @reset="handleSearchReset"
    >
      <template #actions="slotProps">
        <slot name="searchActions" v-bind="slotProps" />
      </template>
    </ProSearchForm>

    <ProSectionHeader v-if="title || actions" :title="title" size="small" :actions="actions" class="pro-table-header">
      <template #left>
        <slot name="left" />
      </template>
      <template #right>
        <slot name="headerRight" />
      </template>
      <template #actions>
        <slot name="actions" />
      </template>
    </ProSectionHeader>
    <div ref="tableRef" class="pro-table-inner">
      <ElTable
        ref="elTableRef" class="pro-el-table" :data="showData" :height="tableHeight" v-bind="$attrs"
      >
        <template #default="defaultSlotProps">
          <slot name="default" v-bind="defaultSlotProps || {}" />
          <ElTableColumn v-for="(column) in columns" :key="column.prop" :label="column.label" :prop="column.prop" v-bind="column">
            <template #header="{ $index }">
              <div v-if="column.columnType === 'actions'" class="header-actions">
                {{ column.label || '操作' }}
                <ColumnSetting
                  v-if="columnSetting"
                  :columns="propsColumns"
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
                  <component
                    :is="column.renderAs"
                    v-else-if="column.renderAs && typeof column.renderAs !== 'string'"
                    v-bind="{ ...row[column.prop!], ...getRenderProps(column.renderProps, row, column) }"
                  />
                  <component :is="column.mappingMap![row[column.prop!]]?.status ? ProStatusText : 'div'" v-else-if="column.renderAs === 'enum'" :status="column.mappingMap![row[column.prop!]]?.status" :style="column.mappingMap![row[column.prop!]]?.style">
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
              <slot name="columnFilterIcon" />
            </template>
          </ElTableColumn>
        </template>

        <template v-for="(key) in showSlots" :key="key" #[key]="slotProps">
          <slot :name="key" v-bind="slotProps || {}" />
        </template>
      </ElTable>
      <ElPagination v-if="pagination" v-bind="pagination" class="pro-table-pagination" />
    </div>
  </div>
</template>
`;export{n as default};
