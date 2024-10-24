<script lang="ts" setup>
  const actions = [{
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
    // permission: 'demoList:del',
  }]
</script>

<template>
  <link-actions :actions="actions" />
</template>
