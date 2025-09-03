<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue'
import './style.css'

defineOptions({
  name: 'ProExpandCollapseText',
})

const props = withDefaults(defineProps<{
  text?: string
  maxLength?: number
  expandText?: string
  collapseText?: string
  defaultExpanded?: boolean
}>(), {
  text: '',
  maxLength: 100,
  expandText: '展开',
  collapseText: '收起',
  defaultExpanded: false,
})

const emit = defineEmits(['expand', 'collapse'])

const slots = useSlots()
const expanded = ref(props.defaultExpanded)
const hasSlotContent = computed(() => !!slots.default)

const content = computed(() => hasSlotContent.value ? '' : props.text)

// 安全地计算插槽内容长度
const slotContentLength = computed(() => {
  if (!hasSlotContent.value || !slots.default?.())
    return 0
  const firstChild = slots.default()[0]
  if (firstChild && typeof firstChild.children === 'string') {
    return firstChild.children.length
  }
  return 0
})

const shouldTruncate = computed(() =>
  (hasSlotContent.value && slotContentLength.value > props.maxLength)
  || (!hasSlotContent.value && content.value.length > props.maxLength),
)

const displayContent = computed(() => {
  if (!shouldTruncate.value || expanded.value)
    return hasSlotContent.value ? undefined : content.value

  return hasSlotContent.value ? undefined : `${content.value.slice(0, props.maxLength)}...`
})

function toggle() {
  expanded.value = !expanded.value
  emit(expanded.value ? 'expand' : 'collapse')
}
</script>

<template>
  <div class="pro-expand-collapse-text">
    <template v-if="hasSlotContent">
      <div v-if="!shouldTruncate || expanded">
        <slot />
      </div>
      <div v-else>
        <slot :max-length="maxLength" />...
      </div>
    </template>
    <span v-else>{{ displayContent }}</span>

    <span v-if="shouldTruncate" class="expand-collapse-button" @click="toggle">
      {{ expanded ? collapseText : expandText }}
    </span>
  </div>
</template>
