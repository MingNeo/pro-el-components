<script lang="ts" setup>
import { ElRow } from 'element-plus'

const props = defineProps<{
  inline?: boolean
  class?: any
  row?: Record<string, any>
}>()
</script>

<template>
  <template v-if="props.inline">
    <slot />
  </template>
  <ElRow v-else :gutter="24" v-bind="props.row" :class="props.class">
    <slot />
  </ElRow>
</template>
