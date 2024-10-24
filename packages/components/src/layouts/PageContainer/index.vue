<script lang="ts" setup>
  withDefaults(defineProps<{
    title?: string
    actions?: any[]
    loading?: boolean
    showHeader?: boolean
  }>(), { showHeader: false })

  const emit = defineEmits(['cancel'])

  function handleCancel() {
    emit('cancel')
  }
</script>

<template>
  <page-header v-if="showHeader" class="pro-list-page-header" :title="title" :actions="actions" v-bind="$attrs" @cancel="handleCancel">
    <template #title>
      <slot name="title" />
    </template>
    <template #actions>
      <slot name="headerActions" />
    </template>
  </page-header>
  <div v-loading="loading" class="page-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
  .page-container {
    position: relative;
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
</style>
