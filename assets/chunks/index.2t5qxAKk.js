const n=`<script setup lang="ts">
import { computed } from 'vue'
import './style.css'

defineOptions({
  name: 'ProPageWrapper',
})

const props = defineProps<{
  hasPermission?: boolean | (() => boolean)
}>()

const hasPermission = computed(() => typeof props.hasPermission === 'function' ? props.hasPermission() : (props.hasPermission ?? true))
<\/script>

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
`;export{n as default};
