# PageHeader组件
用于展示页面顶部的标题栏，支持自定义标题、操作按钮等功能。

# 示例
<script setup>
  import Demo1 from '@/components/PageHeader/demos/demo.vue'
  import Demo1Code from '@/components/PageHeader/demos/demo.vue?raw'
</script>
<demo :comp="Demo1" :code="Demo1Code" />

# 使用方法

``` vue
<template>
  <ProPageHeader title="货币管理">
    <!-- ... -->
  </ProPageHeader>
</template>
```

# API清单

| 属性      | 类型                                | 默认值 | 是否必须 | 描述               |
| --------- | ----------------------------------- | ------ | -------- | ------------------ |
| title     | string                              | -      | 可选     | 标题               |
| actions   | any[]                               | -      | 可选     | 标题栏操作按钮列表 |
| showBack  | boolean                             | -      | 可选     | 是否显示返回按钮   |
| tabs      | `{ title: string, name: string }[]` | -      | 可选     | 多标签页配置       |
| activeTab | number                              | -      | 可选     | 当前选中tab        |

# Slots
| 插槽名  | 描述                           |
| ------- | ------------------------------ |
| title   | 模态框标题                     |
| actions | 操作按钮列表，默认为取消、提交 |
