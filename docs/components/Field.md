# ProField 高级表单项

ProField 是一个通用的表单项组件，可以视作 FormItem 和 表单 Field 组件的组合，可以根据 `fieldType` 渲染不同的表单控件。

## 基础用法

通过设置 `fieldType` 和 `fieldProps` 来使用不同类型的表单控件。

<demo src="@/components/Field/demos/demo1.vue" title="基础用法" />

## 组件属性

| 属性名         | 说明                     | 类型                     | 默认值   |
| -------------- | ------------------------ | ------------------------ | -------- |
| value          | 组件的值                 | `any`                    | -        |
| field-type     | 控件类型                 | `FieldType \| Component` | `'text'` |
| field-props    | 传递给具体控件的属性     | `Record<string, any>`    | `{}`     |
| mode           | 编辑/只读模式            | `'read' \| 'edit'`       | `'edit'` |
| with-form-item | 是否包裹 FormItem        | `boolean`                | `true`   |
| ...            | 所有 ElFormItem 的 props | `any`                    | -        |

## FieldType 类型

| 类型值        | 说明               | 对应组件      |
| ------------- | ------------------ | ------------- |
| text          | 文本输入框         | ElInput       |
| password      | 密码输入框         | ElInput       |
| textarea      | 多行文本框         | ElInput       |
| date          | 日期选择器         | ElDatePicker  |
| dateTime      | 日期时间选择器     | ElDatePicker  |
| dateRange     | 日期范围选择器     | ElDatePicker  |
| dateTimeRange | 日期时间范围选择器 | ElDatePicker  |
| select        | 下拉选择框         | ElSelect      |
| switch        | 开关               | ElSwitch      |
| rate          | 评分               | ElRate        |
| radio         | 单选框             | ElRadio       |
| checkbox      | 复选框             | ElCheckbox    |
| color         | 颜色选择器         | ElColorPicker |

## 事件

| 事件名       | 说明         | 回调参数               |
| ------------ | ------------ | ---------------------- |
| change       | 值变化时触发 | `(value: any) => void` |
| update:value | 值更新时触发 | `(value: any) => void` |

## 示例

### 基础表单项
```vue
vue
<template>
  <ProField
    label="标题"
    prop="text"
    v-model:value="textValue"
    field-type="text"
    :field-props="{ placeholder: '请输入文本' }"
  />
</template>
```
### 日期选择器
```vue
<template>
  <ProField
    label="日期"
    prop="text"
    v-model:value="dateValue"
    field-type="date"
    :field-props="{ placeholder: '请选择日期' }"
  />
</template>
```
### 下拉选择框
```vue
<template>
  <ProField
    v-model:value="selectValue"
    field-type="select"
    :field-props="{
      placeholder: '请选择',
      options: [
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
      ],
    }"
  />
</template>
```

### 传入Field
```vue
<template>
  <ProField
    v-model:value="selectValue"
    :field-type="ElSelect"
    :field-props="{
      placeholder: '请选择',
      options: [
        { label: '选项1', value: 1 },
        { label: '选项2', value: 2 },
      ],
    }"
  />
</template>
```