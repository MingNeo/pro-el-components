<script lang="ts" setup>
defineProps<{ loading?: boolean }>()
</script>

<template>
  <div v-loading="loading" class="page-container relative flex-1 overflow-y-auto p-5" v-bind="$attrs">
    <slot />
  </div>
</template>
