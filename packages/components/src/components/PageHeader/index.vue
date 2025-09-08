<script lang="ts" setup>
import type { ButtonAction } from 'pro-el-components'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElIcon, ElRadioButton, ElRadioGroup } from 'element-plus'
import { ProButtonActions } from 'pro-el-components'
import { ref, watch } from 'vue'
import 'pro-el-components/components/ButtonActions/style.css'
import './style.css'

defineOptions({
  name: 'ProPageHeader',
})

const props = defineProps<{
  showBack?: boolean
  title?: string
  actions?: ButtonAction[]
  tabs?: { title: string, name: string }[]
  activeTab?: string | number | boolean
}>()

const emit = defineEmits(['cancel', 'update:activeTab'])

const activeTab = ref(props.activeTab ?? props.tabs?.[0]?.name)

watch(() => props.activeTab, (newVal) => {
  activeTab.value = newVal
})

function handleCancel() {
  emit('cancel')
}

function handleUpdateActiveTab(_value: string | number | boolean | undefined) {
  activeTab.value = _value
  emit('update:activeTab', _value)
}
</script>

<template>
  <div class="pro-page-header" v-bind="$attrs">
    <div class="pro-page-header__top">
      <div class="pro-page-header__title">
        <ElIcon v-if="showBack" class="pro-page-header__back" @click="handleCancel">
          <ArrowLeft />
        </ElIcon>
        <slot name="title">
          <div v-if="title" class="pro-page-header__title-text">
            {{ title }}
          </div>
        </slot>
      </div>
      <div class="pro-page-header__actions">
        <slot name="actions">
          <ProButtonActions v-if="actions?.length" class="footer" :actions="actions" />
        </slot>
      </div>
    </div>
    <div v-if="tabs" class="pro-page-header__tabs">
      <ElRadioGroup :model-value="activeTab" size="default" @update:model-value="handleUpdateActiveTab">
        <ElRadioButton v-for="(item, index) in tabs" :key="index" :label="item.title" :value="item.name" />
      </ElRadioGroup>
    </div>
  </div>
</template>
