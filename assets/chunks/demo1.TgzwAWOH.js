const n=`<script setup lang="ts">
import { ref } from 'vue'
import TableSelector from '../index.vue'

const data = Array.from({ length: 30 }).fill('').map((v, i) => ({
  gender: Math.round(Math.random()) ? '男' : '女',
  name: \`用户\${i + 1}\`,
  nickname: \`用户\${i + 1}\`,
  phone: '132xxxxxxxxx',
  userId: i + 1,
}))
async function getUserList(params: Record<string, any>) {
  return {
    data: ['name', 'gender', 'phone'].reduce((prev, cur) => {
      return params[cur] ? prev.filter((item: any) => item[cur].includes(params[cur])) : prev
    }, data),
    total: data.length,
  }
}
// import { getUserList } from '@/api/user'

const selectedUsers = ref([])

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
    label: '性别',
    prop: 'gender',
    type: 'select',
    options: [
      { label: '男', value: '男' },
      { label: '女', value: '女' },
    ],
    fieldProps: {
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
    type: 'selection',
    width: '55',
    selectable: () => true,
  },
  {
    label: 'id',
    prop: 'userId',
  },
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '手机号',
    prop: 'phone',
  },
  {
    label: '性别',
    key: 'gender',
  },
]
<\/script>

<template>
  <TableSelector
    v-model="selectedUsers" :search-fields="searchFields" :service="getUserList" :columns="columns"
  />
</template>

<style lang="css"></style>
`;export{n as default};
