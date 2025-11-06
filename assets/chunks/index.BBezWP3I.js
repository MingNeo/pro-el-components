const n=`<script lang="ts" setup>
import type { TableFormColumn, TableFormEmits, TableFormProps } from './types'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElButton, ElIcon, ElInputNumber } from 'element-plus'
import { ProButtonActions, ProFormFields, ProTable } from 'pro-el-components'
import { v4 as uuid } from 'uuid'
import { computed, ref } from 'vue'
import 'pro-el-components/components/Table/style.css'
import 'pro-el-components/components/ButtonActions/style.css'
import 'pro-el-components/components/FormFields/style.css'
import './style.css'

defineOptions({
  name: 'ProTableForm',
  inheritAttrs: false,
})

const props = defineProps<TableFormProps>()

const emit = defineEmits<TableFormEmits>()

// 处理表格数据,添加必要的id
const tableData = computed(() => {
  return props.modelValue?.map?.((item, index) => {
    const id = item.id || uuid()
    return {
      ...item,
      _sortIndex: index,
      id,
    }
  }) || []
})

const addRowNumber = ref(1)

// 添加行
function addRow() {
  const newId = uuid()
  const newData = [
    ...tableData.value,
    ...Array.from({ length: addRowNumber.value }).map(() => ({
      id: newId,
    })),
  ].map((item, index) => ({ ...item, _sortIndex: index }))

  emit('update:modelValue', newData)
  emit('change', newData)
}

// 删除行
function deleteRow(index: number) {
  const newData = tableData.value
    .filter((_, i) => i !== index)
    .map((item, i) => ({ ...item, _sortIndex: i }))

  emit('update:modelValue', newData)
  emit('change', newData)
}

// 处理表单项变更
function handleFormItemsChange(value: Record<string, any>, index: number) {
  const newData = [...tableData.value]
  newData[index] = { ...newData[index], ...value }
  emit('update:modelValue', newData)
  emit('change', newData)
}

// 计算列配置
const columns = computed<TableFormColumn[]>(() => [
  ...props.columns,
  ...(props.viewMode
    ? []
    : [{
      label: '操作',
      prop: 'actions',
      columnType: 'actions',
      width: 60,
      className: 'pro-table-form-actions-column',
      actions: [{
        icon: Delete,
        onClick: (_row: any, _column: any, index: number) => deleteRow(index),
        confirm: true,
        confirmText: '确认删除?',
      }],
    }]),
])

defineExpose({
  addRow,
  deleteRow,
})
<\/script>

<template>
  <div class="pro-table-form">
    <ProTable
      :columns="columns"
      :data="tableData"
      v-bind="$attrs"
    >
      <template #column-default="{ row, $index = 0, column }">
        <template v-if="column.customRender">
          {{ column.customRender(row, column, $index) }}
        </template>

        <ProButtonActions
          v-else-if="column.columnType === 'actions' && !props.viewMode"
          type="link"
          :actions="column.actions"
          :record="row"
          :column="column"
          :index="$index"
        />

        <ProFormFields
          v-else-if="$index >= 0"
          v-model="tableData[$index]"
          :column="1"
          :prop-prefix="[props.propPrefix, $index].flat(Infinity)"
          :fields="[column].map(({ customRender, ...v }) => ({ ...v, prop: v.prop || v.name }))"
          :show-label="false"
          :view-mode="props.viewMode"
          @change="values => handleFormItemsChange(values, $index)"
        />
      </template>
    </ProTable>

    <div v-if="!props.viewMode" class="pro-table-form-footer">
      <ElButton class="add-row-btn" @click="addRow">
        <template #icon>
          <ElIcon>
            <Plus />
          </ElIcon>
        </template>
        添加行
      </ElButton>
      <div class="flex items-center">
        <ElInputNumber v-model="addRowNumber" :min="1" />
        <span class="row-text">行</span>
      </div>
      <span class="total-row-text">当前总行数：{{ tableData.length }}</span>
    </div>
  </div>
</template>
`;export{n as default};
