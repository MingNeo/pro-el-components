<script lang="ts" setup>
  interface Action {
    permission?: string | string[]
    text?: string
    confirm?: boolean
    confirmText?: string
    danger?: boolean
    hidden?: boolean | ((record: any, column: any, index: number) => boolean)
    disabled?: boolean | ((record: any, column: any, index: number) => boolean)
    onClick: (record: any, column: any, index?: number) => void
  }

  const props = withDefaults(defineProps<{
    actions?: Action[] | ((record?: Record<string, any>, column?: Record<string, any>, index?: number) => Action[])
    record?: Record<string, any>
    column?: Record<string, any>
    index?: number
    hasPermission?: (permission: string | string[]) => boolean
  }>(), {
    actions: () => [],
    hasPermission: () => true,
  })

  const actions = computed(() => {
    const result = typeof props.actions === 'function' ? props.actions(props.record, props.column, props.index) : props.actions
    return (result || [])
      .filter((action: Action) => (action && !(typeof action.hidden === 'function' ? action.hidden(props.record, props.column, props.index as any) : action.hidden)) && (!action.permission || hasPermission(action.permission)))
      .map((action: Action) => ({ ...action, disabled: typeof action.disabled === 'function' ? action.disabled(props.record, props.column, props.index as any) : action.disabled }))
  })
</script>

<template>
  <div class="row-link-actions flex gap-[8px]">
    <template v-for="(action, i) in actions" :key="i">
      <el-popconfirm
        v-if="action.confirm"
        :disabled="action.disabled"
        :title="action.confirmText || '确认?'"
        confirm-button-text="是"
        cancel-button-text="否"
        @confirm="action.onClick(record, column, index)"
      >
        <template #reference>
          <a v-if="action.confirm" :class="[action.danger && 'danger text-red']">
            {{ action.text }}
          </a>
        </template>
      </el-popconfirm>
      <a v-else v-bind="action.disabled ? { disabled: action.disabled } : {}" :class="action.danger ? 'danger text-red' : ''" @click="action.disabled || action.onClick(record, column, index)">{{ action.text }}</a>
    </template>
    <slot />
  </div>
</template>

<style lang="scss">
  .row-link-actions {
    a {
      white-space: nowrap;
      text-decoration: none;
      cursor: pointer;
    }
  }
</style>
