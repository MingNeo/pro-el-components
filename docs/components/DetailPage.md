# DetailPage 页面详情组件

DetailPage 是一个用于展示和编辑详情页面的通用组件。它提供了标准的页面布局，包括页头、内容区域和页脚操作栏。
- 自动切换编辑、创建、详情状态，自动提交到对应的创建/更新接口。
- 基于 `ProFormFields` 构建表单或分组表单
- 页头、页脚操作按钮、每个分组可自定义操作按钮组
- 可以任意扩展与自定义，可搭配自定义各类组件使用，或完全不使用内部表单生成

## 基础用法

<demo src="@/components/DetailPage/demos/demo1.vue" class="bg-gray-100 p-0!" />
<demo src="@/components/DetailPage/demos/demo2.vue" class="bg-gray-100 p-0!" />

默认根据以下规则判断当前页面状态
- 详情页：viewMode为true
- 新建页：viewMode为false 且 data[idKey] 为空
- 编辑页：viewMode为false 且 data[idKey] 不为空

#### 扩展表单

1. 通过 `extraFields` 配置表单字段组，可用于分组显示在基础表单字段下方。也可以不配置 fields 字段，直接使用 extraFields 配置表单字段组。
2. 通过 `contentExtra` 或 `pageExtra` 插槽，可用于显示在主区域内部表单字段下方或主区域下方。

#### 自定义footerActions
默认显示取消、提交两个按钮，可以通过footerActions进行自定义。
```vue
<script lang="ts" setup>
function footerActions({ cancel, submit, submitLoading }: any) {
  return [
    {
      text: '取消',
      onClick: cancel,
    },
    {
      text: '保存',
      onClick: handleSave,
    },
    {
      text: '提交',
      onClick: submit,
      loading: submitLoading,
      type: 'primary',
    }
  ]
}
</script>

<template>
  <ProDetailPage
    v-model:form-data="data"
    title="资源库管理"
    :loading="loading"
    :view-mode="props.viewMode"
    :fields="detailFields"
    :extra-fields="extraFields"
    :update-service="handleEditSubmit"
    :create-service="handleEditSubmit"
    :footer-actions="footerActions"
    @ok="onOk"
  />
</template>
```
## API

### Props

| 参数名        | 说明                                           | 类型                                                 | 默认值 |
| ------------- | ---------------------------------------------- | ---------------------------------------------------- | ------ |
| title         | 页面标题                                       | string                                               | -      |
| defaultValue  | 表单默认值，用于非受控模式初始化               | object                                               | {}     |
| formData      | 表单数据（支持 v-model）                       | object                                               | -      |
| viewMode      | 是否为查看模式                                 | boolean                                              | false  |
| fields        | 表单字段配置                                   | ProFormFieldsField[]                                 | -      |
| extraFields   | 额外的表单字段组                               | `{ title?: string, fields: ProFormFieldsField[] }[]` | -      |
| column        | 每行显示的字段数量                             | number                                               | 2      |
| formItemProps | 表单项配置, 参见 Element Plus FormItem 配置    | object                                               | -      |
| idKey         | 主键字段名                                     | string                                               | 'id'   |
| loading       | 加载状态, 不指定时根据service 请求状态自动控制 | boolean                                              | false  |
| headerActions | 页头操作按钮                                   | any[]                                                | -      |
| footerActions | 页脚操作按钮                                   | any[] \| Function                                    | -      |
| footerClass   | 页脚自定义类名                                 | string                                               | -      |
| showFooter    | 是否显示页脚                                   | boolean                                              | true   |
| contentClass  | 内容区域自定义类名                             | string                                               | -      |
| updateService | 更新数据的请求函数                             | `(formValues: Record<string, any>) => void`          | -      |
| createService | 创建数据的请求函数                             | `(formValues: Record<string, any>) => void`          | -      |

### Events

| 事件名          | 说明                    | 回调参数           |
| --------------- | ----------------------- | ------------------ |
| update:formData | 表单数据更新时触发      | (formData: object) |
| submit          | 表单提交时触发          | (values: object)   |
| ok              | 表单提交成功时触发      | (values: object)   |
| back            | 返回/取消按钮点击时触发 | -                  |

### Slots

| 插槽名        | 说明                             | 参数                          |
| ------------- | -------------------------------- | ----------------------------- |
| headerActions | 自定义页头操作区域               | -                             |
| contentHeader | 内容区域顶部                     | -                             |
| contentExtra  | 表单字段下方、卡片内部的额外内容 | -                             |
| pageExtra     | 页面底部额外内容                 | -                             |
| footer        | 自定义页脚内容                   | -                             |
| default       | 自定义整个表单内容               | `{ data, onChange, formRef }` |

### Methods

| 方法名     | 说明         | 参数                                   |
| ---------- | ------------ | -------------------------------------- |
| validField | 验证指定字段 | `(fields?: string[]) => Promise<void>` |

## 注意事项

1. 当同时设置 `defaultValue` 和 `formData` 时，`formData` 的优先级更高
2. `footerActions` 可以是数组或函数，函数时会传入 `submit`、`cancel` 和 `submitLoading` 参数
3. 组件内部集成了 `ProFormFields` 用于构建表单，可通过 `fields` 和 `extraFields` 配置表单字段
