<script lang="ts" setup>
import type { ButtonAction, ButtonActionsProps } from './types'
import { MoreFilled } from '@element-plus/icons-vue'
import { ElButton, ElDropdown, ElDropdownItem, ElDropdownMenu, ElIcon, ElPopconfirm } from 'element-plus'
import { computed, useSlots } from 'vue'
import Action from './Action.vue'
import './style.css'

defineOptions({
  name: 'ProButtonActions',
})

const props = withDefaults(defineProps<ButtonActionsProps>(), {
  actions: () => [],
  hasPermission: () => true,
  maxCount: Number.POSITIVE_INFINITY,
  moreText: '',
  slotPriority: false,
  size: 'small',
})

const actions = computed(() => {
  const result = typeof props.actions === 'function'
    ? props.actions(props.record, props.column, props.index)
    : props.actions

  return (result || [])
    .filter((action: ButtonAction) => (
      action
      && (typeof action.show === 'function'
        ? action.show(props.record, props.column, props.index as any)
        : (action.show ?? true))
      && (!action.permission || props.hasPermission(action.permission))
    ))
    .map((action: ButtonAction) => ({
      ...action,
      link: action.link ?? props.type === 'link',
      disabled: typeof action.disabled === 'function'
        ? action.disabled(props.record, props.column, props.index as any)
        : action.disabled,
    }))
})

const slots = useSlots()
const slotItems = computed(() => slots.default?.() || [])
const showMoreMenu = computed(() => actions.value.length + slotItems.value.length > props.maxCount)

const items = computed(() => {
  const slotPriority = props.slotPriority ?? false

  if (!showMoreMenu.value) {
    return {
      visibleItems: {
        actions: actions.value,
        slots: slotItems.value,
      },
      dropdownItems: {
        actions: [],
        slots: [],
      },
    }
  }

  // 优先显示插槽
  if (slotPriority) {
    const availableSpace = Math.max(0, props.maxCount - slotItems.value.length)
    return {
      visibleItems: {
        slots: slotItems.value.slice(0, props.maxCount),
        actions: actions.value.slice(0, availableSpace),
      },
      dropdownItems: {
        slots: slotItems.value.slice(props.maxCount),
        actions: actions.value.slice(availableSpace),
      },
    }
  }
  else {
    const availableSpace = Math.max(0, props.maxCount - actions.value.length)
    return {
      visibleItems: {
        actions: actions.value.slice(0, props.maxCount),
        slots: slotItems.value.slice(0, availableSpace),
      },
      dropdownItems: {
        actions: actions.value.slice(props.maxCount),
        slots: slotItems.value.slice(availableSpace),
      },
    }
  }
})

const visibleActions = computed(() => items.value.visibleItems.actions)
const visibleSlots = computed(() => items.value.visibleItems.slots)
const moreActions = computed(() => items.value.dropdownItems.actions)
const moreSlots = computed(() => items.value.dropdownItems.slots)

function handleClick(action: ButtonAction) {
  action.onClick(props.record, props.column, props.index)
}
</script>

<template>
  <div class="pro-button-actions" :class="{ 'is-link': type === 'link' }">
    <template v-for="(action, _i) in visibleActions" :key="_i">
      <Action v-bind="{ ...action, onClick: undefined }" :size="size ?? action.size" @click="handleClick(action)" />
    </template>

    <template v-for="(item, _i) in visibleSlots" :key="`slot-${_i}`">
      <component :is="item" />
    </template>

    <ElDropdown
      v-if="showMoreMenu"
      v-bind="moreDropdownProps"
      :placement="moreDropdownProps?.placement || 'bottom'"
      :teleported="moreDropdownProps?.teleported ?? true"
      trigger="click"
      :hide-on-click="false"
    >
      <ElButton link class="more-action">
        {{ moreText }}
        <component :is="moreIcon" v-if="moreIcon" />
        <ElIcon v-else>
          <MoreFilled class="more-icon" />
        </ElIcon>
      </ElButton>

      <template #dropdown>
        <ElDropdownMenu>
          <template v-for="(action, _i) in moreActions" :key="_i">
            <ElDropdownItem
              v-if="!action.confirm"
              :icon="action.icon"
              :disabled="action.disabled"
              :class="{ 'danger-item': action.type === 'danger' }"
              @click="handleClick(action)"
            >
              {{ action.text }}
            </ElDropdownItem>

            <ElDropdownItem
              v-else
              :disabled="action.disabled"
              class="dropdown-item-confirm"
              :class="{ 'danger-item': action.type === 'danger' }"
            >
              <ElPopconfirm
                :disabled="action.disabled"
                :title="action.confirmText || '确认?'"
                confirm-button-text="是"
                cancel-button-text="否"
                @confirm="handleClick(action)"
              >
                <template #reference>
                  <div class="confirm-content" :link="action.link ?? type === 'link'">
                    <ElIcon v-if="action.icon">
                      <component :is="action.icon" />
                    </ElIcon>
                    {{ action.text }}
                  </div>
                </template>
              </ElPopconfirm>
            </ElDropdownItem>
          </template>

          <template v-for="(item, _i) in moreSlots" :key="`slot-${_i}`">
            <ElDropdownItem>
              <component :is="item" />
            </ElDropdownItem>
          </template>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>
