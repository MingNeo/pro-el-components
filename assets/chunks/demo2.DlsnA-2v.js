const n=`<script setup lang="ts">
import { ref } from 'vue'
import TableSelector from '../index.vue'

const data = Array.from({ length: 30 }).fill('').map((v, i) => ({
  name: \`用户\${i + 1}\`,
  nickname: \`用户\${i + 1}\`,
  phone: '132xxxxxxxxx',
  id: i + 1,
}))
async function getUserList(params: Record<string, any>) {
  return {
    data: ['name', 'gender', 'phone'].reduce((prev, cur) => {
      return params[cur] ? prev.filter((item: any) => item[cur].includes(params[cur])) : prev
    }, data),
    total: data.length,
  }
}
const selectedRows = ref([])
const searchFields = [
  {
    label: '姓名',
    prop: 'name',
    type: 'input',
  },
  {
    label: '手机号',
    prop: 'phone',
    type: 'input',
    fieldProps: {
      placeholder: '请输入手机号',
    },
  },
  {
    label: '状态',
    prop: 'status',
    type: 'radio',
    options: [
      { label: '已激活', value: 'active' },
      { label: '未激活', value: 'inactive' },
    ],
    fieldProps: {
      disabled: true,
    },
  },
]

const columns = [
  {
    width: '55',
    selectable: () => true,
  },
  {
    label: 'id',
    prop: 'id',
  },
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '手机号',
    prop: 'phone',
  },
]
<\/script>

<template>
  <TableSelector
    v-model="selectedRows" :search-fields="searchFields" :service="getUserList" :columns="columns" mode="single"
  />

  <div class="mt-16px p-12px bg-[#f5f7fa] rounded-[4px]">
    <h4>选中的数据:</h4>
    <pre class="m-0 p-8px bg-white rounded-[4px] max-h-200px overflow-auto">{{ selectedRows }}</pre>
  </div>
</template>

<style lang="css"></style>
`;export{n as default};
