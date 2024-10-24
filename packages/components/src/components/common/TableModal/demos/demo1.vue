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
  ]
</script>

<template>
  <el-button @click="visible = true">
    显示弹窗
  </el-button>
  <table-modal
    v-model:visible="visible" title="选择用户"
    :width="600"
    :service="getUserList"
    :columns="columns"
  />
</template>
