<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'
import ProClipboard from '../index.vue'
</script>

<template>
  <div class="demo-clipboard">
    <!-- 基础用法 -->
    <ProClipboard text="这是要复制的文本">
      点击复制文本
    </ProClipboard>

    <!-- 自定义内容 -->
    <ProClipboard text="自定义样式的复制文本" class="mt-4">
      <div class="custom-copy-button">
        <span>自定义样式的复制文本</span>
        <el-icon class="ml-1 cursor-pointer">
          <Document />
        </el-icon>
      </div>
    </ProClipboard>
  </div>
</template>

<style scoped>
  .demo-clipboard {
    padding: 20px;
  }

  .custom-copy-button {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background-color: #f5f7fa;
    border-radius: 4px;
  }
</style>
