<script setup lang="ts">
import './style.css'

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
