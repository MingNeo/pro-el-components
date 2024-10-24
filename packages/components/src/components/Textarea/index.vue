<script lang='ts' setup>
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    modelValue: string
    wrapClass: string
    maxHeight: number
  }>(), {
    modelValue: '',
    wrapClass: '',
    maxHeight: 204,
  })

  const emit = defineEmits(['update:modelValue', 'input', 'submit', 'keyup.enter'])

  const value = ref(props.modelValue)

  watch(() => props.modelValue, (val) => {
    value.value = val
  })

  const textareaRef = ref<HTMLTextAreaElement | null>(null)

  function handleInput(e: any) {
    emit('update:modelValue', e.target.value)
    emit('input', e.target.value)
    value.value = e.target.value
    adjustHeight()
  }

  function adjustHeight(height?: number) {
    if (textareaRef.value) {
      if (height) {
        textareaRef.value.style.height = `${height}px`
        return
      }
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
    }
  }

  watch(() => value.value, (val) => {
    adjustHeight(val ? undefined : 24)
  }, { immediate: true })
</script>

<template>
  <div
    class="textarea-container relative border dark:border-transparent flex items-center w-full py-[17px] px-5 rounded-[12px] min-h-[60px] z-5"
    :class="wrapClass"
  >
    <textarea
      ref="textareaRef"
      v-bind="$attrs"
      :value="value" class="textarea dark:bg-transparent w-full flex-1 outline-none resize-none box-border leading-[24px]"
      :style="{ maxHeight: `${maxHeight}px` }"
      :rows="1" type="textarea" placeholder="点击输入想了解的问题" maxlength="2000"
      @input="handleInput"
    />
  </div>
</template>

<style>
  .textarea-container {
    border: solid;
  }

  .dark .textarea-container {
    background-color: #2e2f2f;
  }

  .textarea::placeholder {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
