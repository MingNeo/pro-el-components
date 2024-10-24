# AI Loading 组件

AI Loading 组件用于展示 AI 多进程任务的加载状态，支持显示已完成、进行中和待处理的任务步骤。

## 基础用法

AILoading 组件可以展示 AI 处理任务的多个步骤和当前进度。

<demo src="@/components/AILoading/demos/demo1.vue" />

## 属性

| 属性名      | 类型    | 默认值 | 说明                 |
| ----------- | ------- | ------ | -------------------- |
| steps       | Step[]   | []     | 步骤数组             |
| resultIcons | string[] | []     | 结果图标数组           |
| links | string[] | []     | 结果链接数组           |

### Step 对象属性

| 属性名  | 类型   | 默认值 | 说明                                       |
| ------- | ------ | ------ | ------------------------------------------ |
| text    | String | -      | 步骤文本                                   |
| successText | String | -      | 步骤成功文本                               |
| status  | String | -      | 步骤状态，可选值：'completed'、'current'、'pending' |

## Slot
| 名称    | 说明                                                         |
| ------- | ------------------------------------------------------------ |
| resultIcons | 自定义结果图标，接收 item 参数，item 包含 resultIcons 属性 |
| links | 自定义结果链接，接收 item 参数，item 包含 links 属性 |
