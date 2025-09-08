# TableForm 表格表单

TableForm 组件是一个动态表格表单组件,可以动态添加和删除行,每一行都包含表单项。

- 支持动态添加/删除行
- 每行支持多种表单组件
- 支持查看模式
- 支持自定义渲染
- 支持操作列配置

## 基础用法
<demo src="@/components/TableForm/demos/demo1.vue" title="基础用法" />

## API
### Props

| 名称       | 类型      | 默认值  | 说明                        |
| ---------- | --------- | ------- | --------------------------- |
| modelValue | `array`   | `[]`    | 表格数据,支持 v-model       |
| columns    | `array`   | `[]`    | 列配置,参考下方 Column 配置 |
| viewMode   | `boolean` | `false` | 是否为查看模式              |
| propPrefix | `string`  | -       | 表单项 name 前缀            |

### Column 配置

| 名称         | 类型       | 默认值 | 说明                                                                                            |
| ------------ | ---------- | ------ | ----------------------------------------------------------------------------------------------- |
| label        | `string`   | -      | 列标题                                                                                          |
| prop         | `string`   | -      | 列字段名                                                                                        |
| component    | `string`   | -      | 表单组件类型                                                                                    |
| width        | `number`   | -      | 列宽度                                                                                          |
| customRender | `function` | -      | 自定义渲染函数                                                                                  |
| columnType   | `string`   | -      | 列类型,设置为 'actions' 时,表示操作列                                                           |
| actions      | `array`    | -      | 操作列配置                                                                                      |
| ...          | -          | -      | 其他属性同[ElTableColumn](https://element-plus.org/zh-CN/component/table.html#table-column-api) |

### Events

| 名称              | 参数                     | 说明               |
| ----------------- | ------------------------ | ------------------ |
| update:modelValue | `(value: any[]) => void` | 表格数据更新时触发 |
| change            | `(value: any[]) => void` | 表格数据变更时触发 |

### Methods

| 名称      | 参数                      | 说明       |
| --------- | ------------------------- | ---------- |
| addRow    | -                         | 添加行     |
| deleteRow | `(index: number) => void` | 删除指定行 |
