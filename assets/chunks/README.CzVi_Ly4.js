const n=`# TextSummary 文本摘要

TextSummary 组件用于自动展开和折叠长文本,适用于需要节省空间同时又能显示完整内容的场景。

## 基础用法

<demo src="./demos/demo1.vue" />

## 属性

| 属性名       | 说明                       | 类型   | 默认值 |
| ------------ | -------------------------- | ------ | ------ |
| content         | 要显示的文本内容           | string | -      |
| maxLength    | 折叠状态下显示的最大字符数 | number | 100    |
| expandText   | 展开按钮的文本             | string | '展开' |
| collapseText | 折叠按钮的文本             | string | '收起' |
`;export{n as default};
