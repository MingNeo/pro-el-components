# ListPage 列表页

用于快速构建标准的列表页面布局，集成了页面标题、操作按钮、搜索表单、数据表格等常用组件。

## 基础用法

<demo src="@/components/ListPage/demos/demo1.vue" />

## API

### Props

| 参数       | 说明             | 类型                                            | 默认值 |
| ---------- | ---------------- | ----------------------------------------------- | ------ |
| title      | 页面标题         | string                                          | -      |
| actions    | 操作按钮配置     | `ButtonAction[]，见ProButtonActions 配置`       | `[]`   |
| searchForm | 搜索表单配置     | `ProSearchForm组件的 props，如: { fields: [] }` | -      |
| tableProps | 表格配置         | `ProTable组件的 props, 如： { columns: [] }`    | -      |
| showSearch | 是否显示搜索表单 | boolean                                         | true   |
| showTable  | 是否显示表格     | boolean                                         | true   |

### Events

| 事件名       | 说明                           | 回调参数                                |
| ------------ | ------------------------------ | --------------------------------------- |
| search       | 搜索表单提交时触发             | `(params: Record<string, any>) => void` |
| reset        | 搜索表单重置时触发             | `() => void`                            |
| table-change | 表格分页、筛选、排序变化时触发 | `(pagination, filters, sorter) => void` |

### Slots

| 插槽名         | 说明                   |
| -------------- | ---------------------- |
| headerLeft     | 页面标题左侧内容       |
| headerRight    | 页面标题右侧内容       |
| default        | 页面主体内容           |
| searchFormSlot | 搜索表单自定义组件插槽 |
| tableSlot      | 表格自定义列插槽       |
