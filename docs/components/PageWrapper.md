# PageWrapper 页面包裹器

## 介绍

PageWrapper 是一个页面级的包裹组件，提供标准的页面容器样式和布局。

## 使用示例

### 基础用法

```vue
<script setup lang="ts">
import { PageWrapper } from '@pro-element-plus/components'
</script>

<template>
  <PageWrapper>
    <div>页面内容</div>
  </PageWrapper>
</template>
```

## API

### Props

| 属性名 | 说明 | 类型 | 默认值 |
| ------ | ---- | ---- | ------ |
| -      | -    | -    | -      |

### Slots

| 插槽名  | 说明                       |
| ------- | -------------------------- |
| default | 默认插槽，用于放置页面内容 |
