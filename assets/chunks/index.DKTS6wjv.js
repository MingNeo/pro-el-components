const n=`<script setup lang="ts">
import type { ButtonAction } from 'pro-el-components'
import type { VNode } from 'vue'
import { ProButtonActions } from 'pro-el-components'
import 'pro-el-components/components/ButtonActions/style.css'
import './style.css'

defineOptions({
  name: 'ProSectionHeader',
})

withDefaults(defineProps<{
  actions?: ButtonAction[]
  onClick?: () => void
  title?: string | VNode
  subtitle?: string
  bordered?: boolean
  size?: 'small' | 'default' | 'large'
}>(), {
  bordered: false,
  size: 'default',
})
<\/script>

<template>
  <div
    class="pro-section-header"
    :class="{
      clickable: !!onClick,
      bordered,
    }"
  >
    <div class="pro-section-header__left" @click="onClick">
      <slot name="left">
        <div class="title-container">
          <span class="title">{{ title }}</span>
          <span v-if="subtitle" class="subtitle">{{ subtitle }}</span>
        </div>
      </slot>
    </div>
    <div class="pro-section-header__right">
      <ProButtonActions :actions="actions" type="button" :size="size" />
      <slot name="right" />
    </div>
  </div>
</template>
`;export{n as default};
