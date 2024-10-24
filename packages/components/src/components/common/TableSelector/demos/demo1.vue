<script lang="ts">
  const data = Array.from({ length: 3 }).fill('').map((v, i) => ({
    gender: Math.round(Math.random()) ? '男' : '女',
    name: `用户${i + 1}`,
    nickname: `用户${i + 1}`,
    phone: '132xxxxxxxxx',
    userId: i + 1,
  }))
  async function getUserList(params: Record<string, any>) {
    return {
      data: ['name', 'gender', 'phone'].reduce((prev, cur) => {
        return params[cur] ? prev.filter((item: any) => item[cur].includes(params[cur])) : prev
      }, data),
      total: 3,
    }
  }
</script>

<script setup lang="ts">
  // import { getUserList } from '@/api/user'

  const selectedUsers = ref([])

  const searchFields = [
    {
      label: '姓名',
      name: 'name',
      type: 'input',
    },
    {
      label: '手机号',
      name: 'phone',
      type: 'input',
      fieldProps: {
        placeholder: '请输入手机号',
      },
    },
    {
      label: '性别',
      name: 'gender',
      type: 'select',
      fieldProps: {
        options: [
          { label: '男', value: '男' },
          { label: '女', value: '女' },
        ],
      },
    },
    {
      label: '状态',
      name: 'status',
      type: 'radio',
      fieldProps: {
        disabled: true,
        options: [
          { label: '已激活', value: 'active' },
          { label: '未激活', value: 'inactive' },
        ],
      },
    },
  ]

  const columns = [
    {
      title: 'id',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '性别',
      key: 'gender',
      dataIndex: 'gender',
    },
  ]

  const setRowDisabled = (record: any) => record.userId === 1
</script>

<template>
  <el-card title="TableSelector">
    <table-selector
      v-model="selectedUsers" :search-fields="searchFields" :service="getUserList" :columns="columns"
      row-key="userId" :set-row-disabled="setRowDisabled"
    />
  </el-card>
</template>

<style lang="scss"></style>
