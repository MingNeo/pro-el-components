const t=`<script lang="ts" setup>
import { Refresh, Search } from '@element-plus/icons-vue'
import { ElButton, ElIcon } from 'element-plus'

const emit = defineEmits(['reset', 'submit'])
<\/script>

<template>
  <div class="pro-search-form-buttons">
    <ElButton type="primary" @click="emit('submit')">
      <ElIcon><Search /></ElIcon>
      搜索
    </ElButton>
    <ElButton @click="emit('reset')">
      <ElIcon><Refresh /></ElIcon>
      重置
    </ElButton>
  </div>
</template>
`;export{t as default};
