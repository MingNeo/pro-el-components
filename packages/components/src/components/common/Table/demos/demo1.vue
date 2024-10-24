<script lang="ts" setup>
  const dataSource = ref([{
    name: '小明',
    phone: '13222222222',
    address: '北京市朝阳区',
    status: 'enabled',
  }, {
    name: '小红',
    phone: '13222222222',
    address: '北京市朝阳区',
    status: 'disabled',
  }])

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      mapping: [{
        label: '启用',
        value: 'enabled',
      }, {
        label: '禁用',
        value: 'disabled',
      }],
    },
    {
      title: '操作',
      key: 'actions',
      dataIndex: 'actions',
      width: 150,
      actions: [{
        text: '详情',
        onClick: () => { },
      }, {
        text: '编辑',
        onClick: () => { },
      }, {
        text: '删除',
        danger: true,
        onClick: (_record: any) => { },
        confirm: true,
        confirmText: '请确认是否删除？',
      }],
    },
  ]
</script>

<template>
  <Table :columns="columns" :data="dataSource" class="w-[100%]" column-setting />
</template>
