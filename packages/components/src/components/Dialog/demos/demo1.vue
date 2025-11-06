<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import ProDialog from '../index.vue'

const visible = ref(false)
</script>

<template>
  <ElButton @click="visible = true">
    打开对话框
  </ElButton>
  <ProDialog v-model="visible" title="Tips" width="500" show-footer>
    <span>This is a message</span>
  </ProDialog>
</template>
