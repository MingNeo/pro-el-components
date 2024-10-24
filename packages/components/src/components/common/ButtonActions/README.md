# ButtonActions
列表页操作按钮列表，生成一行多个按钮。可通过配置或自定义。

<demo src="./demos/demo1.vue" />

## 使用方法

```html
<script lang="ts" setup>
const actions = [{
  text: '新增',
  onClick: handleCreate,
  type: 'primary' // 可以直接使用所有el-button的属性
}, {
  text: '下载',
  onClick: handleDownload,
  permission: 'xxx:download'
}]
</script>

<template>
  <ButtonActions v-if="column.key === 'actions'" :actions="column.actions" :record="record" :column="column" />
</template>
```

### Slot
这种情况下CommonButtonActions仅做布局样式处理
```html
<ButtonActions>
  <button @click="xxx">按钮1</a>
  <button @click="xxx">按钮2</a>
</ButtonActions>
```
混合使用配置与slot,将同时显示
```html
<ButtonActions :actions="actions">
  <button @click="xxx">按钮1</a>
  <button @click="xxx">按钮2</a>
</ButtonActions>
```
