<script lang='ts' setup>
  import { computed, ref, watch } from 'vue'

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
  const isComposing = ref(false)
  const canSubmit = computed(() => value.value?.length)
  const isControlled = computed(() => props.modelValue) // 是否受控模式

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

  function handleSubmit() {
    if (!canSubmit.value)
      return
    emit('submit', value.value)
    if (!isControlled.value)
      value.value = ''
  }

  function onEnterDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey && !isComposing.value)
      event.preventDefault()
  }

  function onEnterUp(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey && !isComposing.value) {
      event.preventDefault()
      handleSubmit()
    }
  }

  function handleCompositionStart() {
    isComposing.value = true
  }
  function handleCompositionEnd() {
    setTimeout(() => {
      isComposing.value = false
    }, 100)
  }
</script>

<template>
  <div
    class="textarea-container relative border dark:border-transparent flex items-center w-full py-[17px] px-5 rounded-[12px] min-h-[60px] z-5"
    :class="wrapClass"
  >
    <textarea
      ref="textareaRef"
      v-bind="$attrs"
      :value="value" class="textarea dark:bg-transparent w-full flex-1 outline-none resize-none box-border"
      :style="{ maxHeight: `${maxHeight}px` }"
      :rows="1" type="textarea" placeholder="点击输入想了解的问题" maxlength="2000"
      @input="handleInput" @keydown="onEnterDown" @keyup="onEnterUp"
      @compositionstart="handleCompositionStart" @compositionend="handleCompositionEnd"
    />
    <div class="flex gap-[24px] ml-[8px] justify-between items-center">
      <slot name="toolbar">
        <div />
      </slot>
      <slot name="submitBtn">
        <div
          class="submit-btn flex items-center justify-center p-0 w-[30px] h-[30px] color-white bg-[#e0e0e0] dark:bg-bg-content dark:bg-bg-f5 rounded-[50%] self-end cursor-pointer"
          :class="`${canSubmit ? 'active bg-black' : ''}`" @click="handleSubmit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 1024 1024">
            <path d="M155.170133 369.595733L866.304 92.706133a51.2 51.2 0 0 1 66.491733 65.604267L666.965333 869.853867c-16.725333 44.6464-80.008533 44.2368-96.187733-0.6144L469.333333 586.888533a51.2 51.2 0 0 0-32.5632-31.402666l-278.664533-89.429334c-45.8752-14.7456-47.786667-78.984533-2.935467-96.4608z" fill="currentColor" />
          </svg>
        </div>
      </slot>
    </div>
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
