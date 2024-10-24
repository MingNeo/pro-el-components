<script lang="ts" setup>
import type { Component } from 'vue'
import { computed } from 'vue'

interface StatusColors {
  normal: string | string[]
  error: string | string[]
  warning: string | string[]
  success: string | string[]
  processing: string | string[]
  disabled: string | string[]
  [key: string]: string | string[]
}

interface Props {
  color?: string | string[]
  colors?: StatusColors
  status?: string
  text?: string
  size?: 'small' | 'default' | 'large'
  animation?: 'none' | 'pulse' | 'wave'
  mode?: 'dot' | 'line' | 'filled' | 'pill' | 'glow' | 'gradient'
  icon?: Component
  ellipsis?: boolean
}

defineOptions({
  name: 'ProStatusText',
})

const props = withDefaults(defineProps<Props>(), {
  status: 'normal',
  size: 'default',
  animation: 'none',
  mode: 'dot',
  colors: () => ({
    normal: ['#2a2e3640', '#2a2e3640'],
    error: ['#F44336', '#d32f2f'],
    warning: ['#FFC107', '#ffa000'],
    success: ['#13FF98', '#00e676'],
    processing: ['#1890ff', '#096dd9'],
    disabled: ['#d9d9d9', '#bfbfbf'],
  }),
})

const sizeMap = {
  small: {
    dot: '6px',
  },
  default: {
    dot: '8px',
  },
  large: {
    dot: '10px',
  },
}

const currentSize = computed(() => sizeMap[props.size])

const dotStyle = computed(() => {
  const color = props.color || props.colors[props.status]
  const baseColor = Array.isArray(color) ? color[0] : color
  return {
    backgroundColor: baseColor,
    boxShadow: props.mode === 'glow' ? `0 0 10px ${baseColor}` : undefined,
    borderRadius: props.mode === 'line' ? 0 : '50%',
    width: currentSize.value.dot,
    height: props.mode === 'line' ? '2px' : currentSize.value.dot,
  }
})

const containerStyle = computed(() => {
  const styles: Record<string, string> = {}

  const color = props.color || props.colors[props.status]
  const baseColor = Array.isArray(color) ? color[0] : color
  if (['filled', 'pill', 'gradient'].includes(props.mode)) {
    styles.padding = props.mode === 'pill' ? '4px 12px' : '2px 8px'
    styles.borderRadius = props.mode === 'pill' ? '20px' : '4px'

    if (props.mode === 'gradient') {
      styles.background = Array.isArray(color) ? `linear-gradient(45deg, ${color[0]}, ${color[1]})` : baseColor
      styles.color = 'white'
    }
    else {
      styles.backgroundColor = `${baseColor}15`
      styles.color = baseColor
    }
  }

  return styles
})
</script>

<template>
  <div
    class="pro-status-text"
    :class="[
      mode,
      animation !== 'none' && `animate-${animation}`,
      `status-${status}`,
      size === 'large' && 'size-large',
      size === 'small' && 'size-small',
    ]"
    :style="containerStyle"
  >
    <span
      v-if="mode !== 'gradient'" class="status-indicator"
      :style="dotStyle"
    />
    <slot name="icon">
      <Component :is="icon" v-if="icon" />
    </slot>
    <span
      class="text"
      :class="{
        ellipsis,
      }"
    >
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<style lang="css">
  .pro-status-text {
    display: inline-flex;
    align-items: center;
    position: relative;

    .status-indicator {
      margin-right: 4px;
      transition: all 0.3s;
      position: relative;
    }

    .text {
      font-size: 14px;

      &.ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    /* 动画效果 */
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .animate-wave {
      animation: wave 1.5s ease-in-out infinite;
    }

    @keyframes pulse {

      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0.5;
      }
    }

    @keyframes wave {
      0% {
        transform: scale(1);
      }

      50% {
        transform: scale(1.2);
      }

      100% {
        transform: scale(1);
      }
    }

    /* 添加文字大小的样式 */
    .size-small {
      .text {
        font-size: 12px;
      }
    }

    .size-large {
      font-size: 16px;
    }
  }
</style>
