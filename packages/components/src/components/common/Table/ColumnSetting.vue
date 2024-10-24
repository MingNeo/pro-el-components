<script lang="ts" setup>
  import { getColumnKeys } from './helper'
  import type { ColumnKeysStorage } from './types'

  const props = defineProps<{ tableKey: string, columns: any }>()

  const visible = ref(false)
  const storageAllTableColumnKeys = useStorage<ColumnKeysStorage>('table_columns', {})
  const columnKeys = computed(() => storageAllTableColumnKeys.value[props.tableKey] || getColumnKeys(props.columns))
  const columns = ref<any>([])

  watchEffect(() => {
    columns.value = columnKeys.value
      ?.map((item) => {
        const currentColumn = props.columns?.find(({ key }: any) => item.key === key)
        return currentColumn && { ...item, title: currentColumn.title }
      })
      .filter(Boolean)
  })

  function handleCheckChange(key: string, checked: boolean) {
    const column = columns.value.find((item: any) => item.key === key)
    if (column)
      column.visible = checked
  }

  function handleAllCheckChange(checked: any) {
    columns.value.forEach((item: any) => {
      item.visible = checked
    })
  }

  function handleConfirm() {
    storageAllTableColumnKeys.value[props.tableKey] = columns.value.map(({ key, visible }: any) => ({ key, visible }))
    visible.value = false
  }

  const allIndeterminate = computed(() => {
    const checkedColumns = columns.value.filter(({ visible }: any) => visible)
    return checkedColumns.length > 0 && checkedColumns.length < columns.value.length
  })

  const allChecked = computed(() => columns.value.every(({ visible }: any) => visible))
</script>

<template>
  <el-dropdown v-model="visible">
    <Icon
      icon="icon-park-outline:setting-one"
      class="table-column-setting-icon hover:text-primary focus:outline-none"
      :class="{ 'text-primary': visible }"
      size="16"
    />
    <template #dropdown>
      <div class="table-column-setting-content">
        <div
          v-for="item in columns"
          :key="item.key ?? item.dataIndex"
          class="table-column-setting-column"
        >
          <el-checkbox
            :model-value="item.visible"
            @change="(e) => handleCheckChange(item.key, e)"
          >
            {{ item.title }}
          </el-checkbox>
        </div>
        <div class="table-column-setting-footer">
          <el-checkbox
            :model-value="allChecked"
            :indeterminate="allIndeterminate"
            @change="handleAllCheckChange"
          >
            全选
          </el-checkbox>
          <div>
            <span class="action" @click="visible = false">取消</span>
            <a class="action" @click="handleConfirm">确定</a>
          </div>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
  .table-column-setting-icon {
    margin-left: 8px;
    color: #666666;
    cursor: pointer;
  }

  .table-column-setting-content {
    display: flex;
    flex-direction: column;
    width: 200px;
    max-height: 300px;
    cursor: default;
    background-color: #ffffff;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.12);
    border-radius: 8px;

    .table-column-setting-column {
      display: flex;
      align-items: center;
      padding: 0 12px;
      height: 32px;
    }

    .table-column-setting-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      height: 38px;
      color: #999999;
      box-shadow: 0px -2px 6px rgba(0, 0, 0, 0.06);

      .action {
        margin-right: 12px;
        cursor: pointer;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
