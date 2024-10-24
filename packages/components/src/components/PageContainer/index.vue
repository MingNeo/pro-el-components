<script lang="ts" setup>
import { ProPageHeader } from 'pro-el-components'
import 'pro-el-components/components/PageHeader/style.css'
import './style.css'

defineOptions({
  name: 'ProPageContainer',
})

withDefaults(defineProps<{
  title?: string
  actions?: any[]
  loading?: boolean
  showHeader?: boolean
}>(), { showHeader: false })

const emit = defineEmits(['cancel'])

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <ProPageHeader v-if="showHeader" class="pro-list-page-header" :title="title" :actions="actions" v-bind="$attrs" @cancel="handleCancel">
    <template #title>
      <slot name="title" />
    </template>
    <template #actions>
      <slot name="headerActions" />
    </template>
  </ProPageHeader>
  <div v-loading="!!loading" class="pro-page-container">
    <slot />
  </div>
</template>
