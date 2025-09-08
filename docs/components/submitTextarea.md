# SubmitTextarea
一个方便的文本输入框

- 自动高度
- 回车提交
- 中文输入优化：防止中文拼音输入中回车触发提交
- 受控/非受控模式
- 自动清空：非受控模式提交自动清空

## 用法
自动高度
<demo src="@/components/SubmitTextarea/demos/demo1.vue" />

按钮在底部
<demo src="@/components/SubmitTextarea/demos/demo2.vue" />

受控模式
<demo src="@/components/SubmitTextarea/demos/demo3.vue" />

## API

### Props

| 属性           | 说明                     | 类型             | 默认值   |
| -------------- | ------------------------ | ---------------- | -------- |
| v-model        | 输入框内容               | string           | -        |
| placeholder    | 占位提示文字             | string           | '请输入' |
| disabled       | 是否禁用                 | boolean          | false    |
| maxHeight      | 最大高度，超出显示滚动条 | string \| number | '200px'  |
| toolInBottom   | 按钮区域是否在底部       | boolean          | false    |
| wrapClass      | 外层容器样式             | string           | -        |
| submitBtnClass | 提交按钮样式             | string           | -        |
| showSubmitBtn  | 是否显示提交按钮         | boolean          | true     |
| autoHeight     | 是否自动高度             | boolean          | false    |

### Events

| 事件名 | 说明               | 回调参数        |
| ------ | ------------------ | --------------- |
| submit | 提交时触发         | (value: string) |
| input  | 输入内容变化时触发 | (value: string) |

### Slots

| 插槽名    | 说明     |
| --------- | -------- |
| btns      | 按钮区域 |
| submitBtn | 提交按钮 |
