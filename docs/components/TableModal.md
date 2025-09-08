# TableModal
表格弹窗组件, 用于快速创建展示表格数据弹窗

- 支持通过 `service` 参数自动获取表格数据
- 支持通过 `data` 参数手动配置表格数据
- 支持通过 `columns` 参数配置表格列
- 支持通过 `pagination` 参数配置表格分页
- 支持通过 `header` 插槽自定义表格头部
- 支持通过 `footer` 插槽自定义表格底部
- 自动 loading 状态

## 用法

<demo src="@/components/TableModal/demos/demo1.vue" title="基础用法" />

## API

| 参数       | 说明                                                                                                     | 类型                                                 | 默认值   |
| ---------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | -------- |
| modelValue | 是否显示                                                                                                 | `boolean`                                            | false    |
| title      | 标题                                                                                                     | `string`                                             | 选择用户 |
| width      | 宽度                                                                                                     | `string`                                             | 700px    |
| service    | 自动获取表格数据服务，第一次打开弹窗时加载数据                                                           | `(...args: any[]) => Promise<Record<string, any>[]>` | -        |
| columns    | 列                                                                                                       | `Column[]`                                           | -        |
| data       | 表格数据，配置此参数时，service 参数无效                                                                 | `Record<string, any>[]`                              | -        |
| pagination | 表格的分页，参见[Element-Plus Pagination 组件](https://element-plus.org/zh-CN/component/pagination.html) | `Partial<PaginationProps>`                           | -        |

## 插槽

| 名称   | 说明                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------ |
| pre    | 弹窗顶部内容                                                                                     |
| after  | 弹窗表格之后内容                                                                                 |
| header | 弹窗头部内容，见[Element-Plus Dialog 组件](https://element-plus.org/zh-CN/component/dialog.html) |
| footer | 弹窗底部内容，见[Element-Plus Dialog 组件](https://element-plus.org/zh-CN/component/dialog.html) |
