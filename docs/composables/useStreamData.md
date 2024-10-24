# useStreamData

`useStreamData` 是一个用于处理 Server-Sent Events (SSE) 流数据的 Vue Composable。

## 特性

- 支持 SSE 数据流的接收和处理
- 完整的状态管理和错误处理
- 可自定义数据格式化
- 支持流的启动、停止和重置
- 提供完整的生命周期钩子

## 用法

<demo src="@/composables/useStreamData/demos/demo1.vue" />

```typescript
import { useStreamData } from 'pro-el-components'

const { status, content, error, isStreaming, start, stop, reset } = useStreamData({
  url: '/api/stream',
  onMessage: (chunk, raw) => {
    console.log('收到新消息:', chunk)
  },
  onFinish: () => {
    console.log('流结束')
  }
})
// 开始接收流数据
await start({ message: 'Hello' })
// 停止接收
stop()
// 重置状态
reset()
```

## 配置项

| 参数           | 类型                                          | 默认值    | 说明               |
| -------------- | --------------------------------------------- | --------- | ------------------ |
| url            | `string`                                      | -         | SSE 接口地址       |
| method         | `'get' \| 'post' \| 'put' \| 'delete'`        | 'post'`   | 请求方法           |  |  |
| headers        | `Record<string, string>`                      | -         | 请求头             |
| paramKey       | `string`                                      | 'content' | 字符串参数的键名   |
| formatPayload  | `(data: any) => any`                          | -         | 请求数据格式化函数 |
| formatResponse | `(response: StreamResponse) => string`        | -         | 响应数据格式化函数 |
| onStart        | `() => void`                                  | -         | 流开始时的回调     |
| onMessage      | `(text: string, raw: StreamResponse) => void` | -         | 收到消息的回调     |
| onFinish       | `() => void`                                  | -         | 流结束时的回调     |
| onError        | `(error: Error) => void`                      | -         | 发生错误时的回调   |
| onCancel       | `() => void`                                  | -         | 流被取消时的回调   |

## 返回值

| 参数        | 类型                                                        | 说明             |
| ----------- | ----------------------------------------------------------- | ---------------- |
| status      | `Ref<StreamStatus>`                                         | 当前状态         |
| content     | `Ref<string>`                                               | 累积的内容       |
| error       | `Ref<Error \| null>`                                        | 错误信息         |
| streamId    | `Ref<string>`                                               | 流ID             |
| isStreaming | `ComputedRef<boolean>`                                      | 是否正在流式传输 |
| start       | `(payload: Record<string, any> \| string) => Promise<void>` | 开始流式传输     |
| stop        | `() => void`                                                | 停止流式传输     |
| reset       | `() => void`                                                | 重置状态         |
