const n=`<script lang="ts" setup>
import type { Column, ColumnKey } from './types'
import { Setting } from '@element-plus/icons-vue'
import { ElCheckbox, ElDropdown, ElIcon } from 'element-plus'
import { computed, ref, watchEffect } from 'vue'
import { getColumnKeys } from './helper'

interface Props {
  tableKey: string
  columns: Column[]
  savedColumnKeys: ColumnKey[]
}

const props = defineProps<Props>()
const emit = defineEmits(['save'])

const dropdownRef = ref<any>()
const visible = ref(false)
const savedColumnKeys = computed(() => props.savedColumnKeys || getColumnKeys(props.columns))
const showColumns = ref<Column[]>([])

// 全选和半选
const isIndeterminate = computed(() => {
  const visibleColumns = showColumns.value.filter(col => col.visible)
  return visibleColumns.length > 0 && visibleColumns.length < showColumns.value.length
})
const isAllColumnsVisible = computed(() => showColumns.value.every(col => col.visible))

watchEffect(() => {
  showColumns.value = props.columns.filter(v => v.columnType !== 'actions')
    .map(item => ({ ...item, visible: savedColumnKeys.value?.length ? savedColumnKeys.value.find(key => key.prop === item.prop)?.visible : true }))
})

function toggleChecked(prop: string, isVisible: boolean) {
  const column = showColumns.value.find(col => col.prop === prop)
  if (column)
    column.visible = isVisible
}

function toggleAllChecked(isVisible: boolean) {
  showColumns.value.forEach((col) => {
    col.visible = isVisible
  })
}

function saveColumnSettings() {
  emit('save', showColumns.value.map(({ prop, visible }) => ({ prop, visible })))
  dropdownRef.value?.handleClose()
}
<\/script>

<template>
  <ElDropdown ref="dropdownRef" v-model="visible" class="pro-column-setting" trigger="click">
    <ElIcon class="column-setting-icon" :class="{ active: visible }">
      <Setting />
    </ElIcon>
    <template #dropdown>
      <div class="column-setting-content">
        <div
          v-for="column in showColumns"
          :key="column.prop"
          class="column-setting-item"
        >
          <ElCheckbox
            :model-value="column.visible"
            @change="(e: any) => toggleChecked(column.prop!, !!e)"
          >
            {{ column.label }}
          </ElCheckbox>
        </div>
        <div class="column-setting-footer">
          <ElCheckbox
            :model-value="isAllColumnsVisible"
            :indeterminate="isIndeterminate"
            @change="(e: any) => toggleAllChecked(e as boolean)"
          >
            全选
          </ElCheckbox>
          <div>
            <span class="cancel-btn" @click="dropdownRef?.handleClose()">取消</span>
            <a class="confirm-btn" @click="saveColumnSettings">确定</a>
          </div>
        </div>
      </div>
    </template>
  </ElDropdown>
</template>

<style lang="css">
  .pro-column-setting {
    .column-setting-icon {
      margin-left: 4px;
      color: #6b7280;
      cursor: pointer;
    }

    .column-setting-icon:hover,
    .column-setting-icon.active {
      color: var(--el-color-primary);
    }

    .column-setting-content {
      display: flex;
      flex-direction: column;
      width: 200px;
      max-height: 300px;
      cursor: default;
      background-color: white;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
      border-radius: 8px;
    }

    .column-setting-item {
      display: flex;
      align-items: center;
      padding-left: 12px;
      padding-right: 12px;
      height: 32px;
    }

    .column-setting-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 12px;
      padding-right: 12px;
      height: 38px;
      color: #9ca3af;
      box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.06);
    }

    .cancel-btn {
      margin-right: 12px;
      cursor: pointer;
    }

    .confirm-btn {
      cursor: pointer;
      color: var(--el-color-primary);
    }
  }
</style>
`;export{n as default};
