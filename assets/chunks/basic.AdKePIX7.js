const n=`<script setup lang="ts">
import { ElButton } from 'element-plus'
import { ref } from 'vue'
import Dialog from '../index.vue'

const visible = ref(false)
<\/script>

<template>
  <div>
    <ElButton @click="visible = true">
      打开对话框
    </ElButton>

    <Dialog
      v-model="visible"
      title="基础对话框"
      show-footer
      cancel-text="关闭"
      confirm-text="确定"
      style="--el-dialog-width: 300px"
    >
      这是一个基础对话框示例
    </Dialog>
  </div>
</template>
`;export{n as default};
