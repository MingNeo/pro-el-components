# ButtonActions 操作按钮组

操作按钮组。用于表格等场景下。

## 功能特性
- 基于配置生成
- 支持文本、按钮和确认弹窗操作
- 支持禁用状态
- 支持危险操作样式
- 支持权限控制
- 支持动态显示/隐藏
- 支持更多菜单下拉展示
- 支持通过slot自定义内容、完全手工控制样式

## 使用方法

<demo src="@/components/ButtonActions/demos/demo1.vue" title="基础用法" />
### 基础用法

```html
<script lang="ts" setup>
const actions = [{
  text: '详情',
  onClick: handleShowDetail,
}, {
  text: '编辑',
  onClick: handleEdit,
}, {
  text: '删除',
  danger: true,
  onClick: (record: any) => handleDelete(record?.id),
  confirm: true,
  confirmText: '请确认是否删除？',
  permission: 'demoList:del'
}]
</script>

<template>
  <ProButtonActions v-if="column.key === 'actions'" :actions="column.actions" :record="record" :column="column" />
</template>
```

### 更多菜单

```vue
<template>
  <ProButtonActions
    :actions="actions"
    :more-config="{
      maxCount: 2,
      moreText: '更多操作',
      placement: 'bottom-end',
    }"
  />
</template>
```

## API
### Props

| 参数          | 说明                                 | 类型                                                                              | 默认值       |
| ------------- | ------------------------------------ | --------------------------------------------------------------------------------- | ------------ |
| actions       | 操作项配置                           | `Action[] \| ((...args: any[]) => Action[])`                                      | `[]`         |
| hasPermission | 权限判断方法                         | `(permission: string \| string[]) => boolean`                                     | `() => true` |
| maxCount      | 最多显示的操作数，超出后显示更多下拉 | `number`                                                                          | `3`          |
| moreText      | 更多按钮的文本                       | `string`                                                                          | `''`         |
| moreIcon      | 更多按钮的图标                       | `Component`                                                                       | -            |
| placement     | 下拉菜单的位置                       | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end'` | `'bottom'`   |
| mode          | 按钮模式                             | `'link' \| 'button'`                                                              | `'link'`     |

### Action

| 参数        | 说明                                                                                                   | 类型                                       | 默认值    |
| ----------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------ | --------- |
| text        | 操作文本                                                                                               | `string`                                   | -         |
| onClick     | 点击回调                                                                                               | `(...args: any[]) => void`                 | -         |
| show        | 是否显示                                                                                               | `boolean \| ((...args: any[]) => boolean)` | `true`    |
| disabled    | 是否禁用                                                                                               | `boolean \| ((...args: any[]) => boolean)` | `false`   |
| danger      | 是否危险操作                                                                                           | `boolean`                                  | `false`   |
| confirm     | 是否需要确认                                                                                           | `boolean`                                  | `false`   |
| confirmText | 确认提示文本                                                                                           | `string`                                   | `'确认?'` |
| permission  | 权限标识                                                                                               | `string \| string[]`                       | -         |
| ...         | 其他按钮属性, 参考[Element Plus Button 组件](https://element-plus.org/zh-CN/component/button.html#api) | `any`                                      | -         |

### MoreConfig

| 参数      | 说明                                | 类型                                                                              | 默认值     |
| --------- | ----------------------------------- | --------------------------------------------------------------------------------- | ---------- |
| maxCount  | 显示的最大操作数,超出后显示更多下拉 | `number`                                                                          | `3`        |
| showMore  | 自定义是否显示更多的判断函数        | `(actions: Action[]) => boolean`                                                  | -          |
| moreText  | 更多按钮的文本                      | `string`                                                                          | `'更多'`   |
| moreIcon  | 更多按钮的图标                      | `string`                                                                          | -          |
| placement | 下拉菜单的位置                      | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end'` | `'bottom'` |

### Slot
也可以使用自行配置，slot的内容会与actions配置的同时显示。
对于slot中的内容，CommonButtonActions自动进行布局样式处理。

> [!IMPORTANT]
注意：通过slot配置的内容。如果被收起，则样式需要自行处理。

```html
<template>
  <ProButtonActions v-if="column.key === 'actions'">
    <a @click="handleShowDetail(record, column)">详情1</a>
    <a @click="handleEdit(record, column)">编辑</a>
    <el-popconfirm
      title="确认删除?"
      confirm-button-text="是"
      cancel-button-text="否"
      @confirm="handleDelete(record.id)"
    >
      <a>删除</a>
    </el-popconfirm>
  </ProButtonActions>
</template>
```
