# SearchForm
根据配置自动生成列表页的查询表单，以保持统一样式与快速实现。

<demo src="./demos/demo1.vue" />
<demo src="./demos/demo1.vue" :props="{ column: 4, advancedType: false, formItemOptions: {
  labelCol: { style: { width: '80px' }, labelAlign: 'right' },
} }" />

### 使用方法
通常搭配Table组件、useTableList使用。见[如何快速编写一个列表页](/docs/LIST_PAGE.md)

以下是一个单独使用的例子：
```html
<template>
  <SearchForm :fields="fields" />
</template>

<script setup>
const fields = [
  {
    label: '用户名',
    name: 'username',
    type: 'input',
    fieldProps: {
      placeholder: '请输入用户名'
    }
  },
  {
    label: '性别',
    name: 'gender',
    type: 'select',
    fieldProps: {
      placeholder: '请输入用户名',
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' }
      ]
    }
  },
  {
    label: '国家',
    name: 'country',
    type: 'component',
    component: CountrySelectorField,
  },
  {
    label: '创建时间',
    name: 'createdDate',
    type: 'rangePicker',
    mappingField: ['createdDateStart', 'createdDateEnd'], // 将单条搜索字段映射为多字段
    formatType: 'day', // rangePicker配置formatType为day时，自动格式化为['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59']
    fieldProps: {
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  }
]
</script>
```

#### 联动
参考[FormItemsBuilder](../FormItemsBuilder/README.md)

### 参数列表
| 参数名 | 类型 | 描述 |
| --- | --- | --- |
| fields | SearchField[] | 搜索条件表单配置数组 |
| search | `{ submit?: (...args: any[]) => void, reset?: (...args: any[]) => void }` | 搜索和重置表单的方法，通常用于搭配useTableList/useTablePage快速集成。普通情况下亦可使用submit/reset 事件。 |
| column | number | 搜索框的列数量 |
| defaultValue | `Record<string, any>` | 搜索表单的默认值 |
| advancedType | boolean | 是否为高级模式，默认为true, 高级模式即底部展示选中信息。 |
| showActions | boolean | 是否显示搜索、清空按钮，非高级模式时可以隐藏 |
| formItemOptions | `Record<string, any>` | 表单Field的Item的统一配置，参见element-plus的Form.Item的配置 |
| fields | Array | 所有可用于搜索的字段列表 |
| fields.label | string | 字段标签名称 |
| fields.name | string | 字段名称 |
| fields.type | string | 字段类型：input、select、radio、checkbox、datePicker 和 component |
| fields.component | any | 自定义组件 |
| fields.fieldProps | Record<string, any> | 字段组件的选项 |
| fields.mappingField | string[] | 将单条搜索字段映射为多字段, 用于将rangePicker等数组数据分别映射为多个字段 |
| fields.formatType | 'day' \| - | rangePicker配置formatType为day时，自动格式化为['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'] |

### Events

| 事件名称          | 回调参数 | 描述                                   |
|-------------------|----------|----------------------------------------|
| submit      | ...args  | 提交搜索，触发提交事件并调用 search.submit 方法 |
| reset       | ...args  | 重置搜索，触发重置事件并调用 search.reset 方法 |
