<script setup>
const fields = [
  {
    label: '用户名',
    name: 'username',
    type: 'input',
    fieldProps: {
      placeholder: '请输入用户名',
    },
  },
  {
    label: '性别',
    name: 'gender',
    type: 'select',
    fieldProps: {
      placeholder: '请输入用户名',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
      ],
    },
  },
  {
    label: '创建时间',
    name: 'createdDate',
    type: 'rangePicker',
    mappingField: ['createdDateStart', 'createdDateEnd'], // 将单条搜索字段映射为多字段
    formatType: 'day', // rangePicker配置formatType为day时，自动格式化为['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59']
    fieldProps: {
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  },
]
</script>

<template>
  <search-form :fields="fields" />
</template>
