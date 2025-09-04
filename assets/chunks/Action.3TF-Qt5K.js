const n=`<script lang="ts" setup>
import type { ButtonProps } from 'element-plus'
import type { ButtonAction } from './types'
import { ElButton, ElPopconfirm } from 'element-plus'
import { computed } from 'vue'

defineOptions({
  name: 'Action',
  inheritAttrs: false,
})

const props = defineProps<ButtonAction>()
const emit = defineEmits(['click'])

const buttonProps = computed(() => {
  const { confirm: _confirm, text: _text, permission: _permission, show: _show, danger: _danger, confirmText: _confirmText, onClick: _onClick, ...rest } = props
  return rest as unknown as ButtonProps
})
<\/script>

<template>
  <ElPopconfirm
    v-if="props.confirm"
    :disabled="props.disabled"
    :title="props.confirmText || '确认执行此操作?'"
    confirm-button-text="是"
    cancel-button-text="否"
    @confirm="emit('click', props)"
  >
    <template #reference>
      <ElButton class="button-action" v-bind="buttonProps">
        {{ props.text }}
      </ElButton>
    </template>
  </ElPopconfirm>
  <ElButton
    v-else
    class="button-action"
    v-bind="buttonProps"
    @click="props.disabled || emit('click', props)"
  >
    {{ props.text }}
  </ElButton>
</template>
`;export{n as default};
