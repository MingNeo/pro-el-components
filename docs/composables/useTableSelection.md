# useTableSelection

用于表格跨页选择的 Composable Hook。

## 功能特性

- ✅ 支持跨页选择：切换页面时保留已选中的数据
- ✅ 自动同步选中状态：翻页后自动恢复该页的选中状态
- ✅ 避免重复触发：使用 `select` 和 `select-all` 事件，不受程序化操作影响
- ✅ 灵活配置：支持自定义 ID 字段和选中回调

## 基础用法

<demo src="@/composables/useTableSelection/demos/demo1.vue" />

## API

### 参数 (UseTableSelectionOptions)

| 参数       | 说明         | 类型                            | 必填 | 默认值 |
| ---------- | ------------ | ------------------------------- | ---- | ------ |
| tableRef   | 表格引用     | `Ref<any>`                      | 是   | -      |
| data       | 当前页数据   | `Ref<any[]>`                    | 是   | -      |
| loading    | 加载状态     | `Ref<boolean>`                  | 否   | -      |
| modelValue | 初始选中的行 | `any[]`                         | 否   | `[]`   |
| idKey      | 唯一标识字段 | `string`                        | 否   | `'id'` |
| onChange   | 选中变化回调 | `(selectedRows: any[]) => void` | 否   | -      |

### 返回值

| 名称                 | 说明                   | 类型                                   |
| -------------------- | ---------------------- | -------------------------------------- |
| selectedRows         | 所有已选中的行（跨页） | `Ref<any[]>`                           |
| handleSelect         | 单行选中/取消事件处理  | `(selection: any[], row: any) => void` |
| handleSelectAll      | 全选/取消全选事件处理  | `(selection: any[]) => void`           |
| syncSelectionToTable | 同步选中状态到表格UI   | `() => void`                           |
| clearSelection       | 清空所有选中           | `() => void`                           |

## 完整示例

```vue
<script setup lang="ts">
import { ProTable, useTableList, useTableSelection } from 'pro-el-components'
import { ref } from 'vue'

// 模拟 API 请求
async function fetchData({ pageNo, pageSize }) {
  const data = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
  }))
  return {
    total: data.length,
    data: data.slice((pageNo - 1) * pageSize, pageNo * pageSize),
  }
}

// 使用列表 hooks
const { data, loading, pagination } = useTableList(fetchData, {
  defaultPageSize: 10,
})

// 表格引用
const tableRef = ref()

// 使用选择 hooks
const {
  selectedRows,
  handleSelect,
  handleSelectAll,
  clearSelection,
} = useTableSelection({
  tableRef,
  data,
  loading,
  idKey: 'id',
  onChange: (rows) => {
    console.log('已选中:', rows.length, '条数据')
  },
})

// 列配置
const columns = [
  { type: 'selection' },
  { prop: 'id', label: 'ID' },
  { prop: 'name', label: '姓名' },
]
</script>

<template>
  <div>
    <div>已选中: {{ selectedRows.length }} 条</div>
    <el-button @click="clearSelection">
      清空选择
    </el-button>

    <ProTable
      ref="tableRef"
      :data="data"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      @select="handleSelect"
      @select-all="handleSelectAll"
    />
  </div>
</template>
```

## 注意事项

1. **必须使用 `@select` 和 `@select-all` 事件**：不要使用 `@selection-change`，因为它会在数据变化时触发，导致选择状态被清空。

2. **表格组件必须暴露方法**：确保表格组件通过 `defineExpose` 暴露了 `toggleRowSelection` 和 `clearSelection` 方法。

3. **idKey 必须唯一**：用于跨页识别同一条数据，确保设置的 `idKey` 字段在数据中是唯一的。

4. **loading 状态可选**：如果传入 `loading`，hooks 会在数据加载完成后自动同步选中状态；如果不传入，需要手动调用 `syncSelectionToTable`。

## 与 TableSelector 组件配合

`TableSelector` 组件内部已经使用了 `useTableSelection`，支持开箱即用的跨页选择：

```vue
<ProTableSelector
  v-model="selectedRows"
  :columns="columns"
  :service="fetchData"
/>
```
