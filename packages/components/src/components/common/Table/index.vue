<script lang="ts" setup>
  import type { TableProps as ElTableProps } from 'element-plus'
  import dayjs from 'dayjs'
  import { keyBy } from 'lodash-es'
  import { getColumnKeys } from './helper'
  import type { ColumnKeysStorage } from './types'
  import ColumnSetting from './ColumnSetting.vue'

  interface TableProps extends ElTableProps<any> {
    data: Record<string, any>[]
    tableKey?: string
    columnSetting?: boolean
    autoHeight?: boolean
    class?: string
    format?: string
    columns: any[]
  }

  defineOptions({ inheritAttrs: false })
  const props = withDefaults(defineProps<TableProps>(), { columnSetting: undefined, autoHeight: undefined })
  // const isInListPageContent = inject('isInListPageContent')

  // const columnSetting = ref(props.columnSetting ?? isInListPageContent)

  const pathname = window.location.pathname
  const tableKey = props.tableKey || pathname

  const attrs = useAttrs()

  const tableRef = ref()

  const storageAllTableColumnKeys = useStorage<ColumnKeysStorage>('table_columns', {})
  const storageAllTableColumnsWidth = useStorage<Record<string, Record<string, number>>>('table_columns_widths', {})

  const columnKeys = computed(() => storageAllTableColumnKeys.value[tableKey] || getColumnKeys(props.columns))
  const currentSavedInfo = computed(() => storageAllTableColumnsWidth.value[tableKey] || {})

  const columns = computed(() => {
    const result = (props.columns || []).map((column) => {
      return {
        ...column,
        resizable: column.resizable,
        width: currentSavedInfo.value[column.key] || column.width || (column.key === 'actions' ? 150 : undefined),
      }
    })
    if (props.columnSetting) {
      const actionsColumn = result.filter(({ key }) => key === 'actions')
      const otherColumns = columnKeys.value.map(({ key, visible }) => {
        return visible ? result.find(column => column.key === key) : null
      }).filter(Boolean)
      return [...(otherColumns || []), ...(actionsColumn || [])]
    }
    return result
  })

  // const tableHeight = ref()

  // 设置autoHeight，或在ListPageContent组件中自动计算高度
  // watchEffect(() => (props.autoHeight ?? isInListPageContent) && updateTableHeight())
  // useEventListener(window, 'resize', () => (props.autoHeight ?? isInListPageContent) && updateTableHeight())

  // function updateTableHeight() {
  //   // 获取tableRef从顶部到页面底部的高度
  //   tableHeight.value = window.innerHeight - (tableRef.value?.getBoundingClientRect().top || 0) - 135
  // }

  const handleSaveConfig = useDebounceFn((columnWidth: number, column: any) => {
    storageAllTableColumnsWidth.value[tableKey] = { ...currentSavedInfo.value, [column.key]: columnWidth }
  }, 500)

  function handleResizeColumn(newWidth: number, _oldWidth: number, column: any) {
    column.width = newWidth
    handleSaveConfig(newWidth, column)
  }
</script>

<template>
  <div ref="tableRef" :class="`t-common-table-wrapper max-w-[100%] ${props.class}`">
    <el-table class="pro-common-table w-[100%]" :data="data" v-bind="attrs" resizable @header-dragend="handleResizeColumn">
      <el-table-column v-for="(column) in columns" :key="column.key ?? column.dataIndex" :label="column.title" :prop="column.key" v-bind="column">
        <template #header>
          <div v-if="column.key === 'actions'" class="header-actions flex items-center justify-end">
            {{ column.title || '操作' }}
            <ColumnSetting v-if="columnSetting" :columns="props.columns" :table-key="tableKey" />
          </div>
        </template>

        <template #default="{ row, column: columnInfo, $index }">
          <link-actions
            v-if="column.key === 'actions'" :actions="column.actions"
            :record="row.record" :column="column" :index="$index"
          />
          <slot v-else-if="(column.renderType || column.mapping) && !column.customRender" v-bind="{ $index, row, column: columnInfo }" name="default">
            <div v-if="column.renderType === 'file'" class="render-cell">
              <a v-for="(item, i) in ([row.text].flat())" :key="i" :href="typeof item === 'string' ? item : item.url">{{ typeof item === 'string' ? '附件' : item.name }}</a>
            </div>
            <div v-else-if="column.renderType === 'date'">
              {{ row.text ? dayjs(row.text).format(format || 'YYYY-MM-DD') : '' }}
            </div>
            <div v-else-if="column.mapping">
              {{ keyBy(column.mapping, 'value')[row.text]?.label || row.text }}
            </div>
          </slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="attrs.pagination" v-bind="attrs.pagination" />
  </div>
</template>
