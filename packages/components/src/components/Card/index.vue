<script setup lang="ts">
// 确保组件有script部分以正确导出
defineOptions({
  name: 'ProCard',
})
</script>

<template>
  <div class="pro-card" v-bind="$attrs">
    <slot />
  </div>
</template>

<style lang="css">
  .pro-card {
    padding: 24px;
    background: white;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
</style>
