---
title: ProFormFields 表单项生成器
meta:
  - name: description
    content: 智能表单项生成器，基于配置快速构建复杂表单，支持多种布局和联动方式
---

# ProFormFields 表单项生成器

> 智能表单项生成器，专为解决中台系统复杂表单开发痛点而设计，让表单开发更简单、更灵活。

在中台开发中，表单是最常见的组件。市面上也有不少成熟的表单生成器，但是很遗憾，这些表单生成器的设计思路，**基本都是错误的**。它们虽然能快速生成表单，但通通存在以下问题：

- **❌ 过度封装** - 难以灵活使用，无法根据需求自由定制样式
- **❌ 配置复杂** - 学习成本高，配置文件冗长难懂
- **❌ 缺乏渐进性** - 无法从原始组件库渐进式升降级
- **❌ 组合困难** - 无法在表单中自由搭配普通表单控件、HTML元素，除非创建一个自定义组件用作Field
- **❌ 多维表单支持差** - 对于多步骤、多维度表单支持不佳，往往需要提供独立的表单生成器或独立的配置格式
- **❌ 联动复杂** - 表单联动需要复杂配置，代码可读性差，新人难接手

ProFormFields 则不同：
ProFormFields 不是传统的"表单生成器"，而是"表单块生成器"：

- **表单块灵活布局** - 生成一组相关的表单项，而非整个表单
- **完全兼容** - 保留Element Plus表单组件的所有配置，与手写近乎一致的灵活性
- **渐进增强** - 可以逐步替换手写表单项，实现渐进式升级
- **1分钟上手** - 简单直观的API设计，快速学会使用
- **自由组合** - 可与其他ProFormFields、普通组件、HTML元素任意搭配
- **Vue原生语法联动** - 支持Vue自然语法联动，多种联动方式
- **双模式支持** - 同时支持编辑模式和查看模式
- **🔄 数据映射** - 支持复杂数据映射到formData的独立字段

> ProFormFields 并不生成完整表单，因此没有提供 ProForm 组件，你可以直接放在 `el-form` 中使用
<script setup>
  import demo1 from '@/components/FormFields/demos/demo1.vue'
  import demo1Code from '@/components/FormFields/demos/Demo1Content.vue?raw'
  import demo2 from '@/components/FormFields/demos/demo2.vue'
  import demo2Code from '@/components/FormFields/demos/demo2.vue?raw'
  import demo3 from '@/components/FormFields/demos/demo3.vue'
  import demo3Code from '@/components/FormFields/demos/demo3.vue?raw'
  import demo4 from '@/components/FormFields/demos/demo4.vue'
  import demo4Code from '@/components/FormFields/demos/demo4.vue?raw'
</script>

### 基础用法
为了灵活性，ProFormFields只生成FormItem集合，需自己包裹在el-form中使用。

<demo :comp="demo1" :code="demo1Code" title="基础用法" />

### 自由组合
ProFormFields 可以生成任意数量的FormItem，并自由组合。
- 支持多个ProFormFields组合使用
- 可以任意搭配普通组件/表单控件/html元素使用

<demo :comp="demo2" :code="demo2Code" title="自由组合" />
复杂数组数组格式form示例:

> [!IMPORTANT]
为了使内部的formItem能正常区分深层数据，正确进行校验，需要配置prop-prefix。
<demo :comp="demo3" :code="demo3Code" title="复杂数组数组格式form" />

<demo :comp="demo4" :code="demo4Code" title="数据映射" />

### 数据映射
rangePicker等类型，返回数据为如`['2024-01-01', '2024-01-02']`的数组。

可以使用mappingProp进行数据映射，将开始时间和结束时间分别映射到formData中的独立字段。

```ts
const fields = computed(() => [
  {
    label: '时间范围',
    prop: 'dateRange',
    type: 'rangePicker',
    mappingProp: ['startDate', 'endDate'],
    // 等同于
    mappingProp: [
      { name: 'startDate', format: (v: any) => v[0] },
      { name: 'endDate', format: (v: any) => v[1] },
    ],
  },
])
```

### 联动
ProFormFields提供了多种方式处理联动，以追求尽可能的代码可读性及灵活性。

以下所有方式皆可组合使用。

- 使用vue的computed处理field配置联动
- 使用vue的watch监听数据变化进行表单数据联动
- 使用on、onChange等事件处理表单数据联动
- 使用watch及handler或conditions处理联动

#### 1、【推荐】vue方式自然联动
- 将fields的定义使用computed，即可自然而然的进行配置内容的联动。

在定义配置的组件中，能获取到formData时，推荐使用这种方式来处理联动，因为这种方式最简单，最直观，最易于理解。无需学习新的配置方式，易于后续其他人维护。

> fields会自动忽略为 false、undefined、null 的项。

```vue
<script lang="ts" setup>
const formData = reactive({
  province: '',
  city: '',
})

const provinceOptions = [
  { label: '北京市', value: 'beijing' },
  { label: '山东省', value: 'shandong' },
  { label: '广东省', value: 'guangdong' },
]

const cityOptions = [
  { label: '广州市', value: 'guangzhou', province: 'guangdong' },
  { label: '深圳市', value: 'shenzhen', province: 'guangdong' },
  { label: '青岛市', value: 'tsingtao', province: 'shandong' },
  { label: '烟台市', value: 'yantai', province: 'shandong' },
]

// fields配置放在computed中，可以自然进行联动
const fields = computed(() => [
  {
    label: '省份',
    prop: 'province',
    type: 'select',
    options: provinceOptions,
    // 数据联动方式1: 使用onChange事件处理表单数据
    onChange: (value, _formData) => {
      // 使用组件中定义的formData
      formData.city = cityOptions.find(v => v.province === value).value
      // 或使用回调函数返回的表单引用
      _formData.city = cityOptions.find(v => v.province === value).value
    },
  },
  // field配置内容联动方式: 在computed中直接监听表单数据进行联动
  // 可以有如下多种自由方式：
  formData.province !== 'beijing' && { // 方式 1
    label: '城市',
    prop: 'city',
    type: 'select',
    options: cityOptions.filter(v => v.province === formData.province), // 联动方式 2
    fieldProps: {
      disabled: formData.province === 'guangdong', // 联动方式 3
    },
    // 也可以使用show来显示隐藏field (此处重复)
    show: formData.province !== 'beijing', // 联动方式 4
    // or
    // show也可以使用函数来处理，函数中可以获取到formData
    show: (values: any) => values.province !== 'beijing', // 联动方式 5
  },
])

// 数据联动方式2: 使用watch更新
watch(formData.province, province => (formData.city = cityOptions.find(v => v.province === province).value))
</script>

<template>
  <ProFormFields v-model="formData" :fields="fields" />
</template>
```

#### 2、配置方式处理联动
支持通过纯配置方式来处理联动。
可以单独使用以下配置方式来处理联动，也可以上面的computed方式配合使用。

某些场景下，如二次封装的高级组件、低代码平台等等，也许只能使用配置方式来处理联动。

##### 2.1、最简单的field的显示隐藏，可以使用上面提到过的show，show也支持函数，因此获取到formData。
```ts
const fields = [{
  label: '城市',
  prop: 'city',
  type: 'select',
  options: cityOptions,
  // show也可以使用函数来处理，函数中可以获取到formData
  show: (formData: any) => formData.province !== 'beijing',
}]
```
##### 2.2 使用onChange处理数据联动 【推荐配合vue方式使用】
```ts
const fields = [{
  label: '省份',
  prop: 'province',
  type: 'select',
  options: provinceOptions,
  // 数据联动方式: 使用onChange事件处理表单数据，
  // 会在参数中返回formData，可以更新formData中的值
  onChange: (value, _formData) => {
    _formData.city = cityOptions.find(v => v.province === value).value
  },
}]
```

##### 2.3、使用watch来监听字段值变化，处理数据及配置联动
你可以用两种方式来配置字段的监听。

以下是两种方式处理当province字段值变化时，更新city字段的options。

1、直接使用函数自由处理
```ts
const fields: ProFormFieldsField[] = [{
  prop: 'city',
  type: 'select',
  watch: {
    field: 'province', // 监听province字段
    handler: (value, _formData, field) => {
      const newOptions = cityOptions.filter(v => v.province === value)
      // 更新formData中的city字段的值
      _formData.city = newOptions[0].value
      // 返回要覆盖的配置，自动合并根字段配置
      return {
        options: newOptions
      }
    }
  }
}]
```
2、使用conditions配置条件：
```ts
const fields: ProFormFieldsField[] = [{
  prop: 'city',
  type: 'select',
  watch: {
    field: 'province', // 监听province字段
    // 可配置多个条件
    conditions: [
      {
        when: value => value === 'guangdong',
        update: {
          options: cityOptions.filter(v => v.province === 'guangdong')
        }
      },
      {
        when: value => value === 'zhejiang',
        update: {
          options: cityOptions.filter(v => v.province === 'zhejiang')
        }
      }
    ]
  }
}]
```

### 其他

#### 1、inline
ProFormFields支持ElForm的inline模式，需同时设置ElForm以及ProFormFields的inline为true。
表单元素将不再包裹在Row和Col中，对应的column、row、col配置将失效。

```html
<ElForm :inline="true">
  <ProFormFields :inline="true" />
</ElForm>
```

## API清单

| 属性          | 类型                   | 默认值 | 是否必须 | 描述                                                                                                             |
| ------------- | ---------------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------- |
| fields        | `Field[]`              | []     | 是       | 定义每个表单元素的数组。                                                                                         |
| modelValue    | `Record<string, any>`  | {}     | 否       | 组件的双向绑定值。可以直接使用v-model                                                                            |
| column        | `number`               | 3      | 否       | 表单每行分几列                                                                                                   |
| viewMode      | `boolean`              | false  | 否       | 是否为查看模式                                                                                                   |
| formItemProps | `Record<string, any>`  | -      | 否       | 全局默认FormItem的配置, 当Field中配置时，会进行浅合并                                                            |
| propPrefix    | `(string \| number)[]` | []     | 否       | 为每个字段prop增加前缀, 如希望field的name为xxx且希望表单中对应的值为formData.users[0].xxx， 则可传入['users', 0] |

#### Field
每个表单元素的定义。

| 属性          | 类型                                                                  | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 默认值       |
| ------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| prop          | `string`                                                              | 字段名称,使用v-model绑定                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | -            |
| label         | `string`                                                              | 表单元素的标签文本                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | -            |
| type          | `string`                                                              | 表单元素的类型。现在支持`input`, `select`, `radio`, `checkbox`, `datePicker`, `rate`, `rangePicker`, `timePicker`, `cascader`, `slider`, `switch`, `treeSelect`, `number`, `text` 及 `component`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | -            |
| required      | `Boolean`                                                             | 是否为必填项                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| rules         | `Rule[]`                                                              | 自定义验证规则，数组中包含每条规则的对象。如未指定，默认值为生成的基本验证规则。见[async-validator](https://github.com/yiminghe/async-validator)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| fieldProps    | `Record<string, any>`                                                 | Field 组件自身的配置项,见Element-plus [Input](https://element-plus.org/zh-CN/component/input.html) [Select](https://element-plus.org/zh-CN/component/select.html) [Radio](https://element-plus.org/zh-CN/component/radio.html) [Checkbox](https://element-plus.org/zh-CN/component/checkbox.html) [Rate](https://element-plus.org/zh-CN/component/rate.html) [TimePicker](https://element-plus.org/zh-CN/component/time-picker.html) [DatePicker](https://element-plus.org/zh-CN/component/date-picker.html) [Switch](https://element-plus.org/zh-CN/component/switch.html) [Slider](https://element-plus.org/zh-CN/component/slider.html) [TreeSelect](https://element-plus.org/zh-CN/component/tree-select.html) [Cascader](https://element-plus.org/zh-CN/component/cascader.html) [InputNumber](https://element-plus.org/zh-CN/component/input-number.html) |
| formItemProps | `Record<string, any>`                                                 | FormItem的配置, 见Element-plus [Form.Item](https://element-plus.org/zh-CN/component/form.html#formitem-api)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| show          | `Boolean \| (formValues: Record<string, any>) => Boolean`             | 是否显示，可直接配置变量或通过函数处理                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | true         |
| onChange      | `(value, formValues, originValue, ...originArgs) => void`             | onChange事件                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| customRender  | `(text: any, item: Field, formValues: Record<string, any>) => string` | 自定义渲染文本，仅viewMode模式下或text field可用。复杂情况下请使用component类型并自定义Field                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| valueKey      | string                                                                | 指定value字段名，用于component类型，如嵌入table等特殊组件，可以指定为'data'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 'modalValue' |
| row           | object                                                                | 见Element-plus [Row](https://element-plus.org/zh-CN/component/layout.html#row-api)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| column        | number                                                                | 当前field的列数模式，可覆盖全局的column                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| col           | object                                                                | 见Element-plus [Col](https://element-plus.org/zh-CN/component/layout.html#col-api), 当使用col.span时，所有column配置对当前field无效                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

#### 自定义事件：

| 事件名 | 触发条件                       |
| ------ | ------------------------------ |
| change | 当前组件中的表单数据变更时触发 |
