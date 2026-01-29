const e=`<script lang="ts" setup>
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
  name: \`用户\${index + 1}\`,
  status: Math.random() > 0.5 ? 'enabled' : 'disabled',
  createdAt: new Date(Date.now() - Math.random() * 10000000000),
  email: \`user\${index + 1}@example.com\`,
}))

const tableData = ref(allData.slice(0, 10))

// 表格列配置
const columns = [
  { label: 'ID', prop: 'id', width: 80 },
  { label: '姓名', prop: 'name' },
  {
    label: '状态',
    prop: 'status',
    renderAs: 'enum',
    fieldProps: { options: statusOptions },
  },
  { label: '创建时间', prop: 'createdAt', renderAs: 'date' },
  { label: '邮箱', prop: 'email' },
]

// 自定义搜索表单配置
const searchFormConfig = {
  column: 4,
  collapsible: true,
  collapseRows: 1,
  fields: [
    { prop: 'keyword', label: '关键词', type: 'input', fieldProps: { placeholder: '搜索姓名或邮箱' } },
    { prop: 'status', label: '状态', type: 'select', fieldProps: { options: statusOptions, clearable: true } },
    { prop: 'dateRange', label: '日期范围', type: 'datePicker', fieldProps: { type: 'daterange' } },
    { prop: 'email', label: '邮箱', type: 'input' },
  ],
}

function handleSearch(formData: Record<string, any>) {
  tableData.value = allData.filter((item) => {
    if (formData.keyword && !item.name.includes(formData.keyword) && !item.email.includes(formData.keyword))
      return false
    if (formData.status && item.status !== formData.status)
      return false
    return true
  }).slice(0, 10)
  ElMessage.success(\`搜索参数: \${JSON.stringify(formData)}\`)
}

function handleSearchReset() {
  tableData.value = allData.slice(0, 10)
  ElMessage.info('已重置搜索条件')
}
<\/script>

<template>
  <ProTable
    table-id="demo7"
    :columns="columns"
    :data="tableData"
    :search-form="searchFormConfig"
    class="w-full"
    @search="handleSearch"
    @search-reset="handleSearchReset"
  />
</template>
`;export{e as default};
