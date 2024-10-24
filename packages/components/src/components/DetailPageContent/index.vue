<script lang="ts" setup>
defineOptions({
  name: 'ProDetailPageContent',
})

const { loading = false } = defineProps<{ loading?: boolean }>()
</script>

<template>
  <div v-loading="loading" class="pro-detail-page-content" v-bind="$attrs">
    <slot />
  </div>
</template>

<style lang="css">
  .pro-detail-page-content {
    position: relative;
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
</style>
