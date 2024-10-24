<script lang="ts" setup>
  const actions = [{
    text: '删除',
    danger: true,
    onClick: (_record: any) => { },
    confirm: true,
    confirmText: '请确认是否删除？',
    // permission: 'demoList:del',
  }, {
    text: '详情',
    onClick: () => { },
  }, {
    text: '新增',
    type: 'primary',
    onClick: () => { },
  }]
</script>

<template>
  <button-actions :actions="actions" />
</template>
