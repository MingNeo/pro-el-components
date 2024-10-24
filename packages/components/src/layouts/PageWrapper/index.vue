<script setup lang="ts">
  const props = defineProps<{
    hasPermission: boolean | (() => boolean)
  }>()

  const hasPermission = computed(() => typeof props.hasPermission === 'function' ? props.hasPermission() : (props.hasPermission ?? true))
</script>

<template>
  <div v-if="hasPermission" class="page-wrapper flex-1 flex flex-col overflow-auto h-full">
    <slot />
  </div>
  <div v-else class="flex-grow p-5">
    <slot name="noPermission">
      无权限访问
    </slot>
  </div>
</template>
