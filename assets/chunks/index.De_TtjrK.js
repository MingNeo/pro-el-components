const n=`<script lang="ts" setup>
import { computed, defineProps, ref, withDefaults } from 'vue'
import './style.css'

defineOptions({
  name: 'ProTextSummary',
})

const props = withDefaults(
  defineProps<{
    content?: string
    defaultShow?: boolean
    maxLength?: number
    showButton?: boolean
    expandText?: string
    collapseText?: string
  }>(),
  { defaultShow: false, maxLength: 50, content: '', showButton: true, expandText: '展开', collapseText: '收起' },
)

const show = ref(props.defaultShow)
const showSummary = computed(() => props.content.length > props.maxLength)
const summaryText = computed(() =>
  (showSummary.value && !show.value)
    ? \`\${props.content.slice(0, props.maxLength)}...\`
    : props.content,
)

function toggle() {
  show.value = !show.value
}
<\/script>

<template>
  <span class="pro-text-summary">
    <span>{{ summaryText }}</span>
    <span v-if="showButton && showSummary" class="expand-btn" @click="toggle">
      {{ show ? props.collapseText : props.expandText }}
    </span>
  </span>
</template>
`;export{n as default};
