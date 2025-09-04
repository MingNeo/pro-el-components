const n=`<script lang='ts' setup>
import { computed, ref, watch } from 'vue'
import './style.css'

defineOptions({
  name: 'SubmitTextarea',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  modelValue?: string
  wrapClass?: string
  maxHeight?: number
  minHeight?: number
  showSubmitBtn?: boolean
  placeholder?: string
  submitBtnClass?: string
  disabled?: boolean
  toolInBottom?: boolean
  autoHeight?: boolean
}>(), {
  modelValue: '',
  wrapClass: '',
  maxHeight: 204,
  showSubmitBtn: true,
  placeholder: '点击输入想了解的问题',
  submitBtnClass: '',
  disabled: false,
  toolInBottom: false,
  autoHeight: false,
})

const emit = defineEmits(['update:modelValue', 'input', 'submit'])

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
  if (!props.autoHeight)
    return
  if (textareaRef.value) {
    if (height) {
      textareaRef.value.style.height = \`\${height}px\`
      return
    }
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = \`\${textareaRef.value.scrollHeight}px\`
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
<\/script>

<template>
  <div
    class="pro-submit-textarea"
    :class="[wrapClass, { disabled, 'flex-wrap': props.toolInBottom }]"
  >
    <textarea
      ref="textareaRef"
      :value="value"
      :disabled="disabled"
      class="textarea"
      :style="{ maxHeight: \`\${maxHeight}px\`, minHeight: props.autoHeight ? undefined : \`\${props.minHeight}px\` }"
      :rows="1"
      type="textarea"
      :placeholder="placeholder"
      maxlength="2000"
      v-bind="$attrs"
      @input="handleInput"
      @keydown="onEnterDown"
      @keyup="onEnterUp"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
    />
    <div v-if="showSubmitBtn" class="pro-submit-textarea-btns" :class="{ 'btns-full-width': props.toolInBottom }">
      <slot name="btns">
        <div />
      </slot>
      <slot v-if="showSubmitBtn" name="submitBtn" :can-submit="canSubmit && !disabled">
        <div
          class="pro-submit-textarea__submit-btn"
          :class="[submitBtnClass, { active: canSubmit && !disabled }]"
          @click="handleSubmit"
        >
          <svg class="submit-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" viewBox="0 0 1024 1024">
            <path d="M155.170133 369.595733L866.304 92.706133a51.2 51.2 0 0 1 66.491733 65.604267L666.965333 869.853867c-16.725333 44.6464-80.008533 44.2368-96.187733-0.6144L469.333333 586.888533a51.2 51.2 0 0 0-32.5632-31.402666l-278.664533-89.429334c-45.8752-14.7456-47.786667-78.984533-2.935467-96.4608z" fill="currentColor" />
          </svg>
        </div>
      </slot>
    </div>
  </div>
</template>
`;export{n as default};
