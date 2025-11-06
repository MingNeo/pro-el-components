# Dialog 对话框

基于 Element Plus 的 Dialog 组件扩展。

- 内置footer以更方便直接使用
- 完全继承Element Plus Dialog的所有属性、slot、事件

## 基础用法

通过 `v-model` 控制对话框的显示和隐藏。

<demo src="@/components/Dialog/demos/demo1.vue" title="基础用法" />

## API

### Props

| 参数           | 说明                                | 类型    | 默认值 |
| -------------- | ----------------------------------- | ------- | ------ |
| modelValue     | 是否显示对话框                      | boolean | false  |
| title          | 对话框标题                          | string  | -      |
| showFooter     | 是否显示底部按钮区域                | boolean | false  |
| cancelText     | 取消按钮文本                        | string  | '取消' |
| confirmText    | 确认按钮文本                        | string  | '提交' |
| confirmLoading | 确认按钮加载状态                    | boolean | false  |
| footerClass    | 底部区域自定义类名                  | string  | -      |
| ...            | 继承自Element Plus Dialog的所有属性 | -       | -      |

### Events

| 事件名            | 说明                     | 参数             |
| ----------------- | ------------------------ | ---------------- |
| update:modelValue | 对话框显示状态改变时触发 | (value: boolean) |

### Slots

| 插槽名 | 说明               |
| ------ | ------------------ |
| -      | 对话框内容         |
| header | 自定义头部区域     |
| footer | 自定义底部按钮区域 |
| title  | 自定义标题区域     |

## 注意事项

1. 该组件是对 Element Plus Dialog 的二次封装，继承了 Element Plus Dialog 的所有属性、用法。
2. 默认隐藏了右上角关闭按钮，如需显示可通过 `:show-close="true"` 开启。
3. 对话框宽度可通过 CSS 变量 `--el-dialog-width` 修改。
