const n=`<script setup lang="ts">
import { ElMessage } from 'element-plus'
import './style.css'

defineOptions({
  name: 'ProClipboard',
})

const props = defineProps<{ text: string }>()

function handleClick() {
  const input = document.createElement('input')
  input.value = props.text
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
  ElMessage.success('复制成功')
}
<\/script>

<template>
  <div class="pro-clipboard" @click.stop="handleClick">
    <slot>{{ text }}</slot>
    <!-- <div class="pro-clipboard__icon">
      <slot name="icon">
        <ElIcon class="copy-icon">
          <Document />
        </ElIcon>
      </slot>
    </div> -->
  </div>
</template>
`;export{n as default};
