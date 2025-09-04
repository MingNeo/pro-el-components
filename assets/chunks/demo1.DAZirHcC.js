const n=`<script lang="ts" setup>
import { ElButton } from 'element-plus'
import ButtonActions from '../index.vue'

const actions = [
  {
    text: '查看',
    onClick: () => console.log('查看'),
  },
  {
    text: '编辑',
    onClick: () => console.log('编辑'),
  },
  {
    text: '删除',
    danger: true,
    confirm: true,
    confirmText: '请确认是否删除？',
    onClick: () => console.log('删除'),
  },
  {
    text: '导出',
    onClick: () => console.log('导出'),
  },
  {
    text: '打印',
    onClick: () => console.log('打印'),
  },
]
<\/script>

<template>
  <div class="space-y-2">
    <ButtonActions :actions="actions" />
    <ButtonActions :actions="actions" type="link" :max-count="3" />
    <ButtonActions :actions="actions" type="link" :max-count="3" more-text="更多" />
    <ButtonActions :actions="actions" type="button" />
    <ButtonActions :actions="actions" type="button">
      <ElButton type="primary" size="small" class="border-none bg-[linear-gradient(to_bottom_right,_#7950FF,_#3726FF)]">
        自定义按钮1
      </ElButton>
      <ElButton type="primary" size="small" class="border-none bg-[linear-gradient(to_bottom_right,_red,_blue)]">
        自定义按钮2
      </ElButton>
    </ButtonActions>
  </div>
</template>
`;export{n as default};
