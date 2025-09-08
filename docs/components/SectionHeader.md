# SectionHeader 章节标题

用于页面中各个章节的标题展示，支持自定义操作按钮。

## 基础用法

<demo src="@/components/SectionHeader/demos/demo1.vue" title="基础用法" />

## API

### Props

| 参数     | 说明               | 类型                              | 默认值      |
| -------- | ------------------ | --------------------------------- | ----------- |
| title    | 标题内容           | `string \| VNode`                 | -           |
| subtitle | 副标题内容         | `string`                          | -           |
| actions  | 操作按钮配置       | `ButtonAction[]`                  | -           |
| bordered | 是否显示底部边框   | `boolean`                         | `false`     |
| size     | 尺寸               | `'small' \| 'default' \| 'large'` | `'default'` |
| onClick  | 点击标题区域的回调 | `() => void`                      | -           |

### Slots

| 名称  | 说明           |
| ----- | -------------- |
| left  | 自定义左侧内容 |
| right | 自定义右侧内容 |
