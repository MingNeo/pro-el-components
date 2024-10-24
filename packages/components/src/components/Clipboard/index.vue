<script setup lang="ts">
import { ElMessage } from 'element-plus'

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
</script>

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

<style lang="css">
  .pro-clipboard {
    display: inline-block;
    cursor: pointer;
    position: relative;
    padding-left: 16px;
    padding-right: 16px;

    .pro-clipboard__icon {
      display: none;
      position: absolute;
      top: 8px;
      right: 8px;
      cursor: pointer;
      font-size: 16px;
    }

    &:hover {
      .pro-clipboard__icon {
        display: block;
      }
    }

    .copy-icon {
      cursor: pointer;
      margin-left: 4px;
    }
  }
</style>
