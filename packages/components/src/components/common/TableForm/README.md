# 动态表格表单组件文档

## 概述
此组件是用于展示一个包含多个动态行的表格。每行数据可以根据传入的`columns`属性进行渲染，不同的类型会对应不同的表单控件。

<demo src="./demos/demo1.vue" />

## 使用方法
```html
<script setup>
  const formValues = ref([
    { name: 'John Doe', age: 21, gender: 'male' },
    { name: 'klose', age: 32, gender: 'male' },
  ])
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      type: 'input',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      type: 'number',
    },  {
      title: '性别',
      dataIndex: 'gender',
      type: 'select',
      fieldProps: {
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
        ],
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
    },
  ];
</script>

<template>
  <div>
    <table-form v-model="formValues" :columns="columns" draggable />
  </div>
</template>
```

## API清单

| 属性/方法名 | 类型 | 默认值 | 描述 |
| ----------- | ---- | ------ | ---- |
| name       | string | -      | 在表单中的字段名称,如name为skus即formValue.skus |
| value       | `Record<string, any>[]` | -      | 表格中的数据 |
| columns     | `Record<string, any>[]` | -      | 表格列的配置 |
| mode        | string | 'edit' | 组件的模式，可选值：'edit'、'view' |
| draggable   | Boolean | false | 是否开启拖拽排序功能 |
| change | `(value: Record<string, any>[]) => void` | -   | 表格数据修改时的回调函数 |
| name-prefix | `(string\|numner)[]` | -   | 如果将表格表单的数据作为form中的一个值且触发校验，需要配置name-prefix |
| ... |  | -   | 其他属性同table组件 |

### columns

| 字段名 | 类型 | 描述 |
| ------ | --- | ---- |
| title  | String | 列的标题 |
| dataIndex | String | 此列对应的数据属性名 |
| type   | String | 此列对应的表单控件类型，可选值：'text'、'input'、'number'、'select'、'radio'、'checkbox'、'datePicker' |
| fieldProps | Object | 表单控件的其他配置项 |
| customRender  | Function | 自定义渲染函数，用于在表格中展示此列的内容 |
| rule  | - | 表单field校验的rule |
| required  | - | 是否必填 |

## 注意事项
- columns数组中的每个对象都必须包含`title`和`dataIndex`字段。
- `type`字段决定了此列渲染为什么类型的表单控件，并且决定了是否需要传入`fieldProps`字段。
