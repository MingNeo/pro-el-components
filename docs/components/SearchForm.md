# SearchForm
根据配置自动生成列表页的查询表单，以保持统一样式与快速实现。

## 使用方法
#### 搭配Table组件使用
通常搭配Table组件、useTableList使用。

#### 单独使用
以下是单独使用的例子：
<demo src="@/components/SearchForm/demos/demo1.vue" title="基础使用" />

#### 联动
参考[ProFormFields](./FormFields.md)

## API
| 参数名           | 类型                  | 描述                                                                          |
| ---------------- | --------------------- | ----------------------------------------------------------------------------- |
| fields           | `Field[]`             | 搜索条件表单配置数组                                                          |
| column           | `number`              | 搜索框的列数量                                                                |
| defaultValue     | `Record<string, any>` | 搜索表单的默认值                                                              |
| showActions      | `boolean`             | 是否显示搜索、清空按钮                                                        |
| formItemProps    | `Record<string, any>` | 表单Field的Item的统一配置，参见element-plus的Form.Item的配置                  |
| collapsible      | `boolean`             | 是否启用展开收起功能                                                          |
| defaultCollapsed | `boolean`             | 默认是否收起，默认为 true                                                     |
| collapseRows     | `number`              | 收起时显示的行数，默认为 1                                                    |
| collapsedFields  | `string[]`            | 收起时显示的字段名称列表，优先级高于 collapseRows, 配置后收起时只展示指定字段 |

#### Field
| 参数名      | 类型                | 描述                                                                      |
| ----------- | ------------------- | ------------------------------------------------------------------------- |
| label       | string              | 字段标签名称                                                              |
| name        | string              | 字段名称                                                                  |
| type        | string              | 字段类型：input、select、radio、checkbox、datePicker 和 component         |
| component   | any                 | 自定义组件                                                                |
| fieldProps  | Record<string, any> | 字段组件的选项                                                            |
| mappingProp | string[]            | 将单条搜索字段映射为多字段, 用于将rangePicker等数组数据分别映射为多个字段 |

### Events

| 事件名称 | 回调参数         | 描述                   |
| -------- | ---------------- | ---------------------- |
| submit   | ...args          | 提交搜索               |
| reset    | ...args          | 重置搜索               |
| change   | formData: object | 表单数据发生变化时触发 |
