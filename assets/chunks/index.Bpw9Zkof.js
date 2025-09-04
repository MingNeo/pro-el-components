const n=`<script lang="ts" setup>
import './style.css'

defineOptions({
  name: 'ProDetailPageContent',
})

const { loading = false } = defineProps<{ loading?: boolean }>()
<\/script>

<template>
  <div v-loading="loading" class="pro-detail-page-content" v-bind="$attrs">
    <slot />
  </div>
</template>
`;export{n as default};
