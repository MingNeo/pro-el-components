const t=`<script lang="ts" setup>
import { ProSectionHeader } from 'pro-el-components'
import { provide } from 'vue'
import 'pro-el-components/components/SectionHeader/style.css'
import './style.css'

defineOptions({
  name: 'ProListPageContent',
  inheritAttrs: false,
})

provide('isInListPageContent', true)
<\/script>

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
`;export{t as default};
