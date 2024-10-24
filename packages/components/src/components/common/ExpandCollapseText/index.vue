<script lang="ts" setup>
  import { computed, ref, useSlots } from 'vue'

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
  const shouldTruncate = computed(() =>
    (hasSlotContent.value && slots.default?.()[0].children.length > props.maxLength)
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
  <div>
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

<style scoped>
  .expand-collapse-button {
    cursor: pointer;
    color: #007aff;
    margin-left: 5px;
  }
</style>
