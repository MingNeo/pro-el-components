<script lang="ts" setup>
import { ElButton, ElDialog, vLoading } from 'element-plus'
import 'element-plus/es/components/loading/style/index'
import './style.css'

defineOptions({
  name: 'ProDialog',
})

defineProps<{
  modelValue?: boolean
  showFooter?: boolean
  cancelText?: string
  confirmText?: string
  confirmLoading?: boolean
  footerClass?: string
}>()

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<template>
  <ElDialog class="pro-dialog" :model-value="modelValue" :show-close="false" align-center v-bind="$attrs" @update:model-value="emit('update:modelValue', $event)">
    <template #footer>
      <slot name="footer">
        <div v-if="showFooter" class="pro-dialog-footer" :class="footerClass">
          <ElButton @click="handleCancel">
            {{ cancelText || '取消' }}
          </ElButton>
          <ElButton v-loading="!!confirmLoading" type="primary" @click="handleConfirm">
            {{ confirmText || '提交' }}
          </ElButton>
        </div>
      </slot>
    </template>

    <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
      <slot :name="key" v-bind="slotProps || {}" />
    </template>
  </ElDialog>
</template>
