<script setup lang="ts">
import type { ButtonAction } from 'pro-el-components'
import type { VNode } from 'vue'
import { ProButtonActions } from 'pro-el-components'
import 'pro-el-components/components/ButtonActions/style.css'

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
</script>

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

<style lang="css">
  .pro-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;

    &.clickable {
      cursor: pointer;
    }

    &.bordered {
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 12px;
    }

    .pro-section-header__left {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .title-container {
      display: flex;
      flex-direction: column;
    }

    .title {
      font-size: 18px;
      font-weight: 500;
    }

    .subtitle {
      font-size: 14px;
      color: #6b7280;
    }

    .pro-section-header__right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
</style>
