<script lang="ts" setup>
import { ProSectionHeader } from 'pro-el-components'
import { provide } from 'vue'
import 'pro-el-components/components/SectionHeader/style.css'

defineOptions({
  name: 'ProListPageContent',
  inheritAttrs: false,
})

provide('isInListPageContent', true)
</script>

<template>
  <div class="pro-list-page-content">
    <ProSectionHeader class="pro-section-header" v-bind="$attrs">
      <template #icon>
        <slot name="icon" />
      </template>
      <template #title>
        <slot name="title" />
      </template>
      <template #leftExtra>
        <slot name="leftExtra" />
      </template>
      <template #actions>
        <slot name="actions" />
      </template>
    </ProSectionHeader>

    <div class="content-wrapper">
      <slot />
    </div>
  </div>
</template>

<style lang="css">
  .pro-list-page-content {
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;

    .pro-section-header {
      margin-bottom: 16px;
    }

    .content-wrapper {
      border-radius: 8px;
      padding: 20px;
    }
  }
</style>
