const e=`<script setup lang="ts">
import { ElCheckbox } from 'element-plus'
import { useSelection } from '../index'

interface DataItem {
  id: number
  name: string
  age: number
}

const data: DataItem[] = [
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 20 },
  { id: 3, name: '王五', age: 22 },
]

const {
  selectedKeys,
  isAllSelected,
  isPartialSelected,
  toggleSelect,
  toggleSelectAll,
  isSelected,
} = useSelection({
  data,
  rowKey: 'id',
})
<\/script>

<template>
  <div class="use-selection-demo">
    <div class="mb-4">
      <label class="inline-flex items-center">
        <ElCheckbox
          type="checkbox"
          :model-value="isAllSelected"
          :indeterminate="isPartialSelected"
          @change="e => toggleSelectAll(e)"
        >
          全选
        </ElCheckbox>
      </label>
    </div>

    <div v-for="item in data" :key="item.id" class="mb-2">
      <label class="inline-flex items-center">
        <ElCheckbox
          type="checkbox"
          :model-value="isSelected(item)"
          @change="e => toggleSelect(item, e)"
        >
          {{ item.name }} - {{ item.age }}岁
        </ElCheckbox></label>
    </div>

    <div class="mt-4">
      已选择: {{ selectedKeys.join(', ') }}
    </div>
  </div>
</template>
`;export{e as default};
