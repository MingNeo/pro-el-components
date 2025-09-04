const n=`import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import { ElMessage } from 'element-plus'

export interface FetchEventOption {
  url: string
  data?: any
  method?: string
  headers?: any
  signal?: AbortSignal
  beforeRequest?: () => void
  afterRequest?: () => void
  onMessage?: (e: any) => void
  onUnLogin?: () => void
}

export class RetriableError extends Error { }
export class LoginError extends Error { }
export class FatalError extends Error { }
export class DoneState extends Error { }

export async function fetchEvent(
  { url, data, method = 'post', headers = {}, onMessage, signal, onUnLogin }: FetchEventOption,
) {
  try {
    await fetchEventSource(url, {
      signal: signal as AbortSignal,
      method,
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + 'token', // getLoginToken(),
        'Authorization': localStorage.getItem('token'), // getLoginToken(),
        ...headers,
      },
      body: JSON.stringify(data),
      async onopen(response: any) {
        if (response.ok && response.headers.get('content-type')?.includes(EventStreamContentType)) {
          // everything's good
        }
        else if (response.status === 401) {
          throw new LoginError('登录过期')
        }
        else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new FatalError()
        }
        else {
          const errorInfo = await response.json()
          throw new RetriableError(errorInfo.data)
        }
      },
      onmessage(e: any) {
        const res = JSON.parse(e.data || '{}')
        // TODO: 对结果增加通用数据转化层

        // 请求结束
        if (res.content === '[STREAM_DONE]')
          throw new DoneState(res)

        onMessage?.(res)
      },
      onclose() {
        const msg = '连接已关闭'
        throw new DoneState(msg)
      },
      onerror(error: any) {
        if (error instanceof LoginError)
          onUnLogin?.()

        if (!(error instanceof FatalError || error instanceof DoneState))
          console.warn('sse异常中断')

        throw error
      },
      openWhenHidden: true, // 回到页面时，不重新连接
    })
  }
  catch (error) {
    if (error instanceof DoneState) {
      return Promise.resolve(error.message)
    }
    else if (error instanceof RetriableError) {
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
    else {
      if (error instanceof RetriableError)
        ElMessage.error(error.message)

      else
        console.warn(error)

      return Promise.reject(error)
    }
  }
}
`;export{n as default};
