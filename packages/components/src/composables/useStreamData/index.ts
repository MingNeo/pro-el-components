import { v4 as uuid } from 'uuid'
import { computed, onUnmounted, ref, shallowRef } from 'vue'
import { fetchEvent } from './fetch-event-source'

export interface StreamResponse {
  data?: {
    result?: string
    [key: string]: any
  }
  [key: string]: any
}

export interface StreamOptions {
  // 基础配置
  url: string
  method?: 'get' | 'post' | 'put' | 'delete'
  headers?: Record<string, string>

  // 请求参数配置
  paramKey?: string // 替换原来的 textKey
  formatPayload?: (data: any) => any

  // 响应处理
  formatResponse: (response: StreamResponse) => string

  // 事件回调
  onStart?: () => void
  onMessage?: (text: string, raw: StreamResponse) => void
  onFinish?: (content?: string) => void
  onError?: (error: Error) => void
  onCancel?: () => void

  // 结束时是否重置
  resetOnFinish?: boolean
}

export type StreamStatus = 'idle' | 'fetching' | 'outputting' | 'error' | 'completed'

export function useStreamData(options: StreamOptions) {
  const {
    url,
    method = 'post',
    headers,
    paramKey = 'content',
    formatPayload,
    formatResponse,
    onStart,
    onMessage,
    onFinish,
    onError,
    onCancel,
    // 结束时是否重置
    resetOnFinish = false,
  } = options

  const controller = shallowRef<AbortController>()
  const status = ref<StreamStatus>('idle')
  const streamId = ref<string>('')
  const content = ref('')
  const error = ref<Error | null>(null)

  const isStreaming = computed(() => ['fetching', 'outputting'].includes(status.value))

  async function start(payload: Record<string, any> | string) {
    if (isStreaming.value)
      throw new Error('Stream is already running')

    try {
      // 重置状态
      reset()

      // 生成新的流ID
      streamId.value = uuid()
      controller.value = new AbortController()
      status.value = 'fetching'

      // 格式化请求数据
      const requestData = formatPayload
        ? formatPayload(payload)
        : typeof payload === 'string'
          ? { [paramKey]: payload }
          : payload

      onStart?.()

      await fetchEvent({
        url,
        method,
        headers,
        data: requestData,
        signal: controller.value.signal,
        onMessage: (response: StreamResponse) => {
          status.value = 'outputting'
          try {
            const chunk = formatResponse(response) || ''

            if (chunk) {
              content.value += chunk
              onMessage?.(chunk, response)
            }
          }
          catch (e) {
            console.warn(e)
            handleError(new Error('Failed to process stream chunk'))
          }
        },
      })

      status.value = 'completed'
      onFinish?.(content.value)
      if (resetOnFinish)
        reset()
    }
    catch (e) {
      handleError(e as Error)
    }
  }

  function stop() {
    if (controller.value) {
      controller.value.abort()
      controller.value = undefined
      status.value = 'idle'
      onCancel?.()
    }
  }

  function reset() {
    stop()
    content.value = ''
    error.value = null
    status.value = 'idle'
    streamId.value = ''
  }

  function handleError(e: Error) {
    error.value = e
    status.value = 'error'
    onError?.(e)
  }

  onUnmounted(() => {
    stop()
  })

  return {
    // 状态
    status,
    content,
    error,
    streamId,
    isStreaming,

    // 方法
    start,
    stop,
    reset,
  }
}
