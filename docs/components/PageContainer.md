# PageContainer组件
基础页面容器。可用于列表页、详情页等多种页面

# 示例
<demo src="@/components/PageContainer/demos/demo.vue" />

# 使用方法

``` vue
<template>
  <ProPageContainer title="货币管理">
    <!-- ... -->
  </ProPageContainer>
</template>
```

# API清单

| 属性         | 类型    | 默认值 | 是否必须 | 描述                                |
| ------------ | ------- | ------ | -------- | ----------------------------------- |
| title        | string  | -      | 可选     | 模态框标题                          |
| actions      | any[]   | -      | 可选     | 操作按钮列表，使用ButtonActions配置 |
| loading      | boolean | -      | 可选     | 页面loading                         |
| showHeader   | boolean | -      | 可选     | 是否显示标题栏                      |
| showBack     | boolean | -      | 可选     | 是否显示返回按钮                    |
| tabs         | any[]   | -      | 可选     | 是否显示tab                         |
| tabActiveKey | number  | -      | 可选     | 当前选中tab                         |

# Slots
| 插槽名  | 描述         |
| ------- | ------------ |
| title   | 模态框标题   |
| actions | 操作按钮列表 |
