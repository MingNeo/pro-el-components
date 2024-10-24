# ListPageContent
用于生成列表页的内容部分，统一样式。包含标题、按钮行、内容区域(table)

## 使用方法

```vue
<script lang="ts" setup>
import ListPageContent from '@/components/ListPageContent.vue'

const actions = [{
  text: '新增',
  onClick: handleCreate,
  type: 'primary',
}]
</script>

<template>
  <ListPageContent title="这是页面的标题" :actions="actions">
    <table ... />
  </ListPageContent>
</template>
```

也可以使用slot自定义actions栏
```vue
<script lang="ts" setup>
import ListPageContent from '@/components/ListPageContent.vue'
</script>

<template>
  <ListPageContent title="这是页面的标题">
    <table ... />

    <template #actions>
      <button>按钮1</button>
      <button>按钮2</button>
    </template>
  </ListPageContent>
</template>
```

## API

### Props

| 参数名  | 类型     | 默认值 | 说明                                                  |
| ------- | -------- | ------ | ----------------------------------------------------- |
| title   | String   | ''     | 页面的标题名称                                        |
| actions | Action[] | ''     | 按钮列表，除text、onClick参数外，其余参数与button一致 |

### Slots

| 插槽名  | 说明                                                  |
| ------- | ----------------------------------------------------- |
| -       | 页面主要内容的插槽                                    |
| title   | 页面顶部标题的插槽，使用此插槽则通过title参数设置无效 |
| actions | 页面顶部操作的插槽                                    |
