<script lang="ts" setup>
  import type { ButtonProps } from 'element-plus'

  interface Action extends Omit<ButtonProps, 'text' | 'onClick' | 'type'> {
    permission?: string | string[]
    text?: string
    confirm?: boolean
    confirmText?: string
    hidden?: boolean
    onClick: (...args: any[]) => void
    args?: any[]
    icon?: string
    type?: ButtonProps['type']
  }

  const props = withDefaults(defineProps<{
    actions?: Action[]
    hasPermission?: (permission: string | string[]) => boolean
  }>(), {
    actions: () => [],
    hasPermission: () => true,
  })
</script>

<template>
  <div class="row-button-actions flex inline-block" :class="$attrs.class || ''">
    <template v-for="({ onClick, args =[], text = '', permission, icon, ...actionProp }, i) in props.actions" :key="i">
      <template v-if="!permission || hasPermission(permission)">
        <el-popconfirm
          v-if="actionProp.confirm"
          :disabled="actionProp.disabled"
          :title="actionProp.confirmText || '确认?'"
          confirm-button-text="是"
          cancel-button-text="否"
          @confirm="onClick(...args)"
        >
          <el-button v-bind="actionProp" class="common-button">
            <template v-if="icon" #icon>
              <Icon :icon="icon" />
            </template>
            {{ text }}
          </el-button>
        </el-popconfirm>
        <template v-else>
          <el-button v-bind="actionProp" class="common-button" @click="onClick(...args)">
            <template v-if="icon" #icon>
              <Icon :icon="icon" />
            </template>
            {{ text }}
          </el-button>
        </template>
      </template>
    </template>
    <slot />
  </div>
</template>
