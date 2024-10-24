<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'ProPageWrapper',
})

const props = defineProps<{
  hasPermission: boolean | (() => boolean)
}>()

const hasPermission = computed(() => typeof props.hasPermission === 'function' ? props.hasPermission() : (props.hasPermission ?? true))
</script>

<template>
  <div v-if="hasPermission" class="pro-page-wrapper">
    <slot />
  </div>
  <div v-else class="pro-no-permission">
    <slot name="noPermission">
      无权限访问
    </slot>
  </div>
</template>

<style lang="css">
  .pro-page-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: 100%;
  }

  .pro-no-permission {
    flex-grow: 1;
    padding: 20px;
  }
</style>
