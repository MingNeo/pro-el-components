<script lang="ts">
  const data = Array.from({ length: 20 }).fill('').map((v, i) => ({
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
      total: data.length,
    }
  }
</script>

<script setup lang="ts">
  // import { getUserList } from '@/api/user'

  const visible = ref(false)
  const value = ref([])

  const searchFields = [
    {
      label: '姓名',
      name: 'username',
      type: 'input',
    },
    {
      label: '手机号',
      name: 'phoneNumber',
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
  ]

  const columns = [
    {
      title: 'id',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: '性别',
      key: 'gender',
      dataIndex: 'gender',
    },
  ]
</script>

<template>
  <div class="flex items-center">
    <div @click="visible = true">
      {{ value?.length ? value.map(v => v.name).join(',') : '请选择' }}
    </div>
    <modal-selector
      v-model="visible"
      :value="value" :width="800" :search-fields="searchFields" :service="getUserList"
      :columns="columns" row-key="userId" @confirm="(v) => { value = v }"
    />
  </div>
</template>
