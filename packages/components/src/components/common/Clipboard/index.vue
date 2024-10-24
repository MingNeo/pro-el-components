<script setup lang="ts">
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
  <div class="pro-clipboard inline-block cursor-pointer group relative px-4" @click.stop="handleClick">
    <slot>{{ text }}</slot>
    <Icon icon="mdi:content-copy" class="pro-icon-copy absolute top-0 right-0 hidden group-hover:block" />
  </div>
</template>
