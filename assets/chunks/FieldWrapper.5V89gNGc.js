const n=`<script lang="ts" setup>
import { ElCol } from 'element-plus'

const props = defineProps<{
  inline?: boolean
  class?: any
  col?: Record<string, any>
}>()
<\/script>

<template>
  <template v-if="props.inline">
    <slot />
  </template>
  <ElCol v-else v-bind="props.col" :class="props.class">
    <slot />
  </ElCol>
</template>
`;export{n as default};
