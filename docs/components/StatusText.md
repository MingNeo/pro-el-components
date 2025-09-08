# StatusText 状态文本组件

用于显示状态信息的文本组件，支持多种显示模式和动画效果。
<script setup>
  import demo from '@/components/StatusText/demos/demo.vue'
  import demoCode from '@/components/StatusText/demos/demo.vue?raw'
</script>

## 使用方法
<demo :comp="demo" :code="demoCode" title="基础使用" />

## API

| 属性名      | 类型                                                          | 默认值    | 说明                               |
| ----------- | ------------------------------------------------------------- | --------- | ---------------------------------- |
| status      | string                                                        | 'ready'   | 状态类型                           |
| text        | string                                                        | -         | 显示文本                           |
| colors      | object                                                        | {...}     | 状态颜色配置，支持单色或渐变色数组 |
| size        | 'small' \| 'default' \| 'large'                               | 'default' | 组件尺寸                           |
| mode        | 'dot' \| 'line' \| 'filled' \| 'pill' \| 'glow' \| 'gradient' | 'dot'     | 显示模式                           |
| animation   | 'none' \| 'pulse' \| 'blink' \| 'wave' \| 'shine'             | 'none'    | 动画效果                           |
| elevated    | boolean                                                       | false     | 是否启用立体效果                   |
| customClass | string                                                        | -         | 自定义样式类名                     |

## 显示模式
- dot: 圆点模式
- line: 线条模式
- filled: 填充背景模式
- pill: 胶囊形状
- glow: 发光效果
- gradient: 渐变背景

## 动画效果
- pulse: 脉冲动画
- wave: 波浪动画

## 预设状态颜色
支持单色或渐变色数组配置：
```js
const colors = {
  ready: ['#4CAF50', '#45a049'],
  error: ['#F44336', '#d32f2f'],
  warning: ['#FFC107', '#ffa000'],
  success: ['#13FF98', '#00e676'],
  processing: ['#1890ff', '#096dd9'],
  disabled: ['#d9d9d9', '#bfbfbf']
}
```

## 自定义状态颜色
你完全可以配置自己的状态颜色，只需在`colors`属性中进行配置, 并在`status`属性中使用你配置的状态即可。
```vue
<template>
  <!-- 渐变胶囊 -->
  <ProStatusText
    status="enabled"
    text="自定义渐变"
    mode="gradient"
    :colors="{
      enabled: ['#FF416C', '#FF4B2B'],
      disabled: ['#d9d9d9', '#bfbfbf'],
    }"
  />

  <!-- 发光效果 -->
  <ProStatusText
    status="glow"
    text="发光文本"
    mode="glow"
    animation="pulse"
  />
</template>
```
