<script setup lang="ts">
import { codeToHtml } from 'shiki'
import { onMounted, ref, useSlots } from 'vue'
import { modules, modulesContent } from './utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  title?: string
  description?: string
  src?: string
  comp?: any
  code?: string
  class?: string
}>()

const codeHtml = ref('')
const demoComp = ref<any>(null)
const showCode = ref(false)
const slots = useSlots()

async function getCompAndSource(src: string) {
  if (!src)
    return { comp: null, content: '' }

  const path = src.startsWith('/')
    ? `../packages/components/src${src.replace('@/', '')}`
    : `../packages/components/src/${src.replace('@/', '')}`

  const comp = (await modules[path]?.())?.default
  const content = (await modulesContent[path]?.())?.default

  return { comp, content }
}

onMounted(async () => {
  let codeContent = props.code
  let language = 'vue'
  if (!slots.default && props.src) {
    const { comp, content } = await getCompAndSource(props.src)
    if (comp)
      demoComp.value = comp

    codeContent = codeContent || content
    language = props.src.split('.').pop() || language
  }
  else {
    demoComp.value = props.comp
  }

  if (codeContent) {
    codeHtml.value = await codeToHtml(codeContent.replace(/^\n/, ''), {
      lang: language,
      theme: 'github-light',
    })
  }
})
</script>

<template>
  <div class="mt-4 border border-solid border-gray-200 dark:border-gray-700 rounded-lg mb-5 text-sm overflow-hidden transition-all duration-200 vp-raw">
    <!-- 组件展示区 -->
    <div class="source p-4" :class="props.class">
      <slot v-if="$slots.default" />
      <component
        :is="demoComp"
        v-else
        v-bind="$attrs.props"
      />
    </div>

    <!-- 控制按钮 -->
    <div
      class="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 cursor-pointer select-none transition-colors duration-200"
    >
      <div class="flex-1 flex flex-col">
        <div v-if="title" class="text-sm font-medium">
          {{ title }}
        </div>
        <div
          v-if="description"
          class="mt-2 text-sm text-gray-600 dark:text-gray-400"
          v-html="description"
        />
      </div>
      <div class="flex items-center text-primary-500" @click="showCode = !showCode">
        {{ showCode ? '收起代码' : '显示代码' }}
        <svg
          class="w-4 h-4 transition-transform ml-1"
          :class="{ 'rotate-180': !showCode }"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
          />
        </svg>
      </div>
    </div>

    <!-- 代码展示区 -->
    <Transition
      name="custom-classes"
      enter-active-class="animate-fade-in animate-duration-200"
    >
      <div
        v-show="showCode"
        class="code-source"
        style="background-color: var(--vp-code-block-bg, #eee)"
        v-html="codeHtml"
      />
    </Transition>
  </div>
</template>

<style>
  .code-source pre {
    overflow: auto;
    background-color: var(--vp-code-block-bg, #eee) !important;
    margin: 0 !important;
    padding: 16px !important;
    max-height: 600px !important;
  }
</style>
