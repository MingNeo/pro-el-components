<script lang="ts" setup>
import { ref } from 'vue'
import ListPage from '../index.vue'

// 按钮操作配置
const actions = [
  {
    text: '新建',
    type: 'primary' as const,
    onClick: () => console.log('新建'),
  },
]

// 搜索表单配置
const searchForm = {
  fields: [
    {
      prop: 'name',
      label: '姓名',
    },
  ],
}

// 表格配置
const columns = [
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '年龄',
    prop: 'age',
  },
  {
    label: '操作',
    prop: 'actions',
    columnType: 'actions',
    width: 150,
    actions: [
      {
        text: '编辑',
        onClick: handleEdit,
      },
      {
        text: '删除',
        onClick: handleDelete,
      },
    ],
  },
]

const data = ref([
  { id: 1, name: '张三', age: 18 },
  { id: 2, name: '李四', age: 20 },
])

// 处理搜索
function handleSearch(params: Record<string, any>) {
  console.log('搜索参数:', params)
}

// 处理重置
function handleReset() {
  console.log('重置搜索')
}

// 处理表格变化
function handleTableChange(pagination: any, filters: any, sorter: any) {
  console.log('表格变化:', { pagination, filters, sorter })
}

// 处理编辑
function handleEdit(record: any) {
  console.log('编辑:', record)
}

// 处理删除
function handleDelete(record: any) {
  console.log('删除:', record)
}
</script>

<template>
  <ListPage
    title="用户列表"
    :actions="actions"
    :search-form="searchForm"
    :columns="columns"
    :data="data"
    @search="handleSearch"
    @reset="handleReset"
    @table-change="handleTableChange"
  />
</template>
