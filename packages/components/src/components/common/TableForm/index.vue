<script lang="ts" setup>
  import dayjs from 'dayjs'
  import { isNil } from 'lodash'
  import { v4 as uuid } from 'uuid'
  import FormItemsBuilder from '@/components/common/FormItemsBuilder/index.vue'

  interface RowRecord {
    [x: string]: any
  }

  const props = withDefaults(defineProps<{
    name: string
    value: any[]
    columns: any[]
    viewMode?: boolean
    draggable?: boolean
    isFormItem?: boolean
  }>(), { name: 'tableForm' })

  const emit = defineEmits(['update:value', 'change'])

  const tableFormData = reactive({
    [props.name]: props.value?.map?.((v, i) => {
      const id = v.id || uuid()
      return { ...v, sortIndex: i, id, key: v.key ?? id }
    }) || [],
  })

  watch(props.value, (val) => {
    tableFormData[props.name] = val?.map?.((v, i) => {
      const id = v.id || uuid()
      return { ...v, sortIndex: i, id, key: v.key ?? id }
    }) || []
  })

  const formRef = ref()
  const tableForm = ref()

  function handleChange(value: RowRecord[]) {
    emit('update:value', value)
    emit('change', value)
  }

  async function handleFormItemsChange(value: RowRecord, index: number) {
    try {
      formRef.value.validate?.()
      tableFormData[props.name][index] = value
      handleChange(tableFormData[props.name])
    }
    catch (error) {
    }
  }

  const columns = computed(() => [
    ...props.columns,
    ...(props.viewMode
      ? []
      : [{
        title: '操作',
        dataIndex: 'actions',
        minWidth: 100,
        actions: [{
          text: '删除',
          danger: true,
          onClick: (_record: any, _column: any, index: number) => deleteRow(index),
          confirm: true,
          confirmText: '确认删除?',
        }],
      }]),
  ])

  const addRowNumber = ref(1)

  async function addRow() {
    try {
      const newId = uuid()
      tableFormData[props.name] = [
        ...tableFormData[props.name],
        ...Array.from({ length: addRowNumber.value }).fill('').map(_ => ({})),
      ].map((v, index) => ({ ...v, sortIndex: index, id: v.id || newId, key: v.key ?? newId }))
      handleChange(tableFormData[props.name])
      formRef.value.validate?.()
    }
    catch (error) {
    }
  }

  async function deleteRow(index: number) {
    try {
      tableFormData[props.name] = tableFormData[props.name].filter((v, i) => i !== index).map((v, i) => ({ ...v, sortIndex: i }))
      handleChange(tableFormData[props.name])
      nextTick(() => {
        formRef.value.validate?.()
      })
    }
    catch (error) {
    }
  }

  const sortInfo: Record<string, any> = {}

  function onDragStart(e: any, record: any) {
    e.stopPropagation()
    // 得到源目标数据
    sortInfo.from = tableFormData[props.name]?.find(v => v.sortIndex === record.sortIndex)?.sortIndex
  }

  function onDragEnter(e: any) {
    e.stopPropagation()
    const current = e.target.closest('tr.ant-table-row')

    const currentIndex = current?.dataset?.index
    if (!isNil(currentIndex))
      clearDragingClass(tableForm.value)
    current.classList.add('active-draging')

    // 得到目标数据
    sortInfo.to = tableFormData[props.name]?.find(v => +v.sortIndex === +currentIndex)?.sortIndex
  }

  function onDragEnd(e: any) {
    e.stopPropagation()
    const currentIndex = e.target.closest('tr.ant-table-row')?.dataset?.index
    // 得到目标数据
    sortInfo.to = tableFormData[props.name]?.find?.(v => +v.sortIndex === +currentIndex)?.sortIndex || sortInfo.to
    tableFormData[props.name] = moveItemInList(tableFormData[props.name], sortInfo.from, sortInfo.to)
    handleChange(tableFormData[props.name])
    clearDragingClass(tableForm.value)
  }

  function customRow(record: RowRecord) {
    return {
      'draggable': props.draggable && !props.viewMode,
      'data-index': record.sortIndex,
      'onDragstart': (e: any) => onDragStart(e, record),
      'onDragenter': onDragEnter,
      'onDragend': onDragEnd,
    }
  }
</script>

<script lang="ts">
  function moveItemInList(list: any[], fromIndex: number, toIndex: number) {
    // 将移动的行插入到目标位置，并移除之前的位置
    list.splice(toIndex, 0, list.splice(fromIndex, 1)[0])

    // 更新所有行的索引
    const startIndex = Math.min(fromIndex, toIndex)
    const endIndex = Math.max(fromIndex, toIndex)
    for (let i = startIndex; i <= endIndex; i++)
      list[i].sortIndex = i

    // 返回修改后的列表数据
    return list
  }

  function renderView(column: any, record: any) {
    if (['select', 'radio', 'checkbox'].includes(column.type))
      return column?.fieldProps?.options?.find?.((v: { value: any }) => v.value === record[column.dataIndex])?.label || ''
    if (column.type === 'datePicker')
      return record[column.dataIndex] ? dayjs(record[column.dataIndex]).format('YYYY-MM-DD') : ''
    return record[column.dataIndex]
  }

  function clearDragingClass(root: Element) {
    root?.querySelectorAll?.('tr.ant-table-row')?.forEach?.((node: Element) => node.classList.remove('active-draging'))
  }
</script>

<template>
  <div ref="tableForm" class="dynamic-table-form">
    <el-form ref="formRef" :model="tableFormData" layout="vertical">
      <table
        :columns="columns" :data-source="tableFormData[props.name]" :pagination="false" tag="tbody" :custom-row="customRow" v-bind="$attrs"
      >
        <template #bodyCell="{ text, record, index, column }">
          <template v-if="column.dataIndex === 'rowIndex'">
            <div class="flex items-center">
              <IconParkDrag v-if="props.draggable && !props.viewMode" class="mr-[8px] cursor-move color-[#ccc]" size="16" />
              <slot name="rowIndex">
                <span>{{ index }}</span>
              </slot>
            </div>
          </template>
          <template v-else-if="column.customRender">
            {{ column.customRender({ value: text, text, record, index, column, viewMode }) }}
          </template>
          <LinkActions
            v-else-if="column.dataIndex === 'actions' && !props.viewMode" :actions="column.actions"
            :record="record" :column="column" :index="index"
          />
          <template v-else-if="viewMode">
            <div>{{ renderView(column, record) }}</div>
          </template>
          <FormItemsBuilder
            v-else
            v-model="tableFormData[props.name][index]"
            :column="1"
            :colon="false"
            :name-prefix="[name, index]"
            :fields="[column || {}].map(v => ({ ...v, name: v.name || v.dataIndex }))"
            @change="(values) => handleFormItemsChange(values, index)"
          />
        </template>
      </table>
    </el-form>

    <div v-if="!props.viewMode" class="dynamic-table-form-footer mt-[10px] flex items-center">
      <el-button class="mr-[10px]" @click="addRow">
        <template #icon>
          <Icon type="plus" />
        </template>
        添加行
      </el-button>
      <div class="flex items-center">
        <el-input-number v-model="addRowNumber" :min="1" />
        <span class="mt-[5px]">行</span>
      </div>
      <span class="mt-[10px]">当前总行数：{{ value?.length || 0 }}</span>
    </div>
  </div>
</template>

<style lang="scss">
  .active-draging {
    position: relative;

    &::after {
      content: '';
      width: 100%;
      display: block;
      left: 0;
      right: 0;
      bottom: 0;
      position: absolute;
      border-bottom: solid 1px #00a8ff;
    }
  }

  .dynamic-table-form {
    .ant-table-cell {
      vertical-align: initial;
    }

    .ant-form-item {
      margin-bottom: 0;
    }

    .ant-table-cell-fix-left,
    .ant-table-cell-fix-right {
      z-index: 3;
    }

    .dynamic-table-form-footer .ant-input-number {
      width: 92px !important;
    }
  }
</style>
