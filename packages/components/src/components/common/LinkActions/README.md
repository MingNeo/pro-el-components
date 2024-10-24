# LinkActions
列表页操作按钮列表，生成a标签按钮。可通过配置或自定义。

<demo src="./demos/demo1.vue" />

## 使用方法

```html
<script lang="ts" setup>
const actions = [{
  text: '详情',
  onClick: handleShowDetail,
}, {
  text: '编辑',
  onClick: handleEdit,
}, {
  text: '删除',
  danger: true,
  onClick: (record: any) => handleDelete(record?.id),
  confirm: true,
  confirmText: '请确认是否删除？',
  permission: 'demoList:del'
}]
</script>

<template>
  <LinkActions v-if="column.key === 'actions'" :actions="column.actions" :record="record" :column="column" />
</template>
```
### Slot
也可以使用自行配置，slot的内容会与actions配置的同时显示。
对于slot中的内容，CommonLinkActions自动进行布局样式处理，无需对子项设置margin等。
```html
<template>
  <LinkActions v-if="column.key === 'actions'">
    <a @click="handleShowDetail(record, column)">详情1</a>
    <a @click="handleEdit(record, column)">编辑</a>
    <el-popconfirm
      title="确认删除?"
      confirm-button-text="是"
      cancel-button-text="否"
      @confirm="handleDelete(record.id)"
    >
      <a>删除</a>
    </el-popconfirm>
  </LinkActions>
</template>
```
