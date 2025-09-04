const n=`<script lang="ts" setup>
import { ElButton, ElCard } from 'element-plus'
import { ref } from 'vue'
import ProPageContainer from '../index.vue'

const loading = ref(false)

function handleClick() {
  loading.value = true

  setTimeout(() => {
    loading.value = false
  }, 2000)
}
<\/script>

<template>
  <ProPageContainer
    title="货币管理"
    show-header
    show-back
    :loading="loading"
    :actions="[{ text: '新增', type: 'primary', onClick: () => { } }]"
  >
    <ElCard header="内容1">
      <ElButton @click="handleClick">
        点击触发loading
      </ElButton>
      <p :style="{ marginTop: '20px' }">
        一段测试文本
      </p>
    </ElCard>
  </ProPageContainer>
</template>
`;export{n as default};
