<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import ProTable from '../index.vue'

const statusOptions = [
  { label: '启用', value: 'enabled', status: 'success' },
  { label: '禁用', value: 'disabled', status: 'error' },
]

// 模拟数据
const allData = Array.from({ length: 50 }).fill(0).map((_, index) => ({
  id: index + 1,
  name: `用户${index + 1}`,
  status: Math.random() > 0.5 ? 'enabled' : 'disabled',
  createdAt: new Date(Date.now() - Math.random() * 10000000000),
  email: `user${index + 1}@example.com`,
}))

const tableData = ref(allData.slice(0, 10))

// columns 配置中通过 search: true 标记可搜索的列
const columns = [
  { label: 'ID', prop: 'id', width: 80 },
  { label: '姓名', prop: 'name', search: true }, // 自动推断为 input
  {
    label: '状态',
    prop: 'status',
    search: true, // 自动推断为 select（因为 renderAs: 'enum'）
    renderAs: 'enum',
    fieldProps: { options: statusOptions },
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    search: true, // 自动推断为 datePicker（因为 renderAs: 'date'）
    renderAs: 'date',
    fieldProps: { format: 'YYYY-MM-DD HH:mm:ss' },
  },
  { label: '邮箱', prop: 'email' },
]

function handleSearch(formData: Record<string, any>) {
  // 模拟搜索过滤
  tableData.value = allData.filter((item) => {
    if (formData.name && !item.name.includes(formData.name))
      return false
    if (formData.status && item.status !== formData.status)
      return false
    return true
  }).slice(0, 10)
  ElMessage.success(`搜索参数: ${JSON.stringify(formData)}`)
}

function handleSearchReset() {
  tableData.value = allData.slice(0, 10)
  ElMessage.info('已重置搜索条件')
}
</script>

<template>
  <ProTable
    table-id="demo6"
    :columns="columns"
    :data="tableData"
    :search-form="true"
    class="w-full"
    @search="handleSearch"
    @search-reset="handleSearchReset"
  />
</template>
