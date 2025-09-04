const n=`# ExpandCollapseText 展开折叠文本

ExpandCollapseText 组件用于自动展开和折叠长文本,适用于需要节省空间同时又能显示完整内容的场景。支持通过属性或插槽传入内容。

## 基础用法

<demo src="./demos/demo1.vue" />

## 属性

| 属性名          | 说明                       | 类型    | 默认值 |
| --------------- | -------------------------- | ------- | ------ |
| text            | 要显示的文本内容           | string  | ''     |
| maxLength       | 折叠状态下显示的最大字符数 | number  | 100    |
| expandText      | 展开按钮的文本             | string  | '展开' |
| collapseText    | 折叠按钮的文本             | string  | '收起' |
| defaultExpanded | 是否默认展开               | boolean | false  |

## 事件

| 事件名   | 说明           | 回调参数 |
| -------- | -------------- | -------- |
| expand   | 文本展开时触发 | -        |
| collapse | 文本折叠时触发 | -        |

## 插槽

| 插槽名  | 说明           | 插槽参数              |
| ------- | -------------- | --------------------- |
| default | 自定义文本内容 | { maxLength: number } |

## 示例

### 使用属性传入内容
`;export{n as default};
