<script lang="ts" setup>
import type { ButtonAction } from 'pro-el-components'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElIcon, ElRadioButton, ElRadioGroup } from 'element-plus'
import { ProButtonActions } from 'pro-el-components'
import 'pro-el-components/components/ButtonActions/style.css'
import { ref, watch } from 'vue'

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

<style>
  .pro-page-header {
    background: #fff;
    box-shadow: 0 2px 8px 0 rgba(31, 56, 88, 0.06);
    padding: 20px;
    margin-bottom: 16px;

    .pro-page-header__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pro-page-header__title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pro-page-header__back {
      font-size: 22px;
      color: #888;
      cursor: pointer;
      transition: color 0.2s;
    }

    .pro-page-header__back:hover {
      color: #409eff;
    }

    .pro-page-header__title-text {
      font-size: 18px;
      font-weight: bold;
    }

    .pro-page-header__actions {
      margin-left: 24px;
    }

    .pro-page-header__tabs {
      margin-top: 18px;
    }

    .el-radio-group {
      background: #f7f8fa;
      border-radius: 8px;
      padding: 4px 8px;
    }

    .el-radio-button__inner {
      border-radius: 6px !important;
      margin: 0 2px;
      font-size: 15px;
      padding: 6px 22px;
      transition: background 0.2s, color 0.2s;
    }

    .el-radio-button__inner:hover {
      background: #e6f0ff;
      color: #409eff;
    }

    .el-radio-button.is-active .el-radio-button__inner {
      background: #409eff;
      color: #fff;
      box-shadow: 0 2px 8px 0 rgba(64, 158, 255, 0.12);
    }
  }
</style>
