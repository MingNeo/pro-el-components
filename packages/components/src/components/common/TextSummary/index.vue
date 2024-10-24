<script lang="ts" setup>
  import { computed, defineProps, ref, withDefaults } from 'vue'

  const props = withDefaults(
    defineProps<{
      text?: string
      defaultShow?: boolean
      maxLength?: number
      showButton?: boolean
      expandText?: string
      collapseText?: string
    }>(),
    { defaultShow: false, maxLength: 50, text: '', showButton: true, expandText: '展开', collapseText: '收起' },
  )

  const show = ref(props.defaultShow)
  const showSummary = computed(() => props.text.length > props.maxLength)
  const summaryText = computed(() =>
    (showSummary.value && !show.value)
      ? `${props.text.slice(0, props.maxLength)}...`
      : props.text,
  )

  function toggle() {
    show.value = !show.value
  }
</script>

<template>
  <span>{{ summaryText }}</span>
  <span v-if="showButton && showSummary" class="arrow cursor-pointer text-[#007aff]" @click="toggle">
    {{ show ? props.collapseText : props.expandText }}
  </span>
</template>
