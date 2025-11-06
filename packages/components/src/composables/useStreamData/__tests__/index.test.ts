import type { StreamOptions } from '../index'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useStreamData } from '../index'

// Mock fetchEvent
vi.mock('../fetch-event-source', () => ({
  fetchEvent: vi.fn(),
}))

describe('useStreamData', () => {
  const defaultOptions: StreamOptions = {
    url: '/api/stream',
    formatResponse: (response: any) => response.data?.result || '',
  }

  it('应该返回正确的响应式属性', () => {
    const { status, content, error, streamId, isStreaming, start, stop, reset } = useStreamData(defaultOptions)

    expect(status.value).toBe('idle')
    expect(content.value).toBe('')
    expect(error.value).toBe(null)
    expect(streamId.value).toBe('')
    expect(isStreaming.value).toBe(false)
    expect(typeof start).toBe('function')
    expect(typeof stop).toBe('function')
    expect(typeof reset).toBe('function')
  })

  it('应该在 start 时更新状态', async () => {
    const { start, status, streamId } = useStreamData(defaultOptions)

    const startPromise = start({ content: 'test' })
    expect(status.value).toBe('fetching')
    expect(streamId.value).not.toBe('')
    expect(typeof streamId.value).toBe('string')

    // 清理
    await startPromise.catch(() => { })
  })

  it('应该在流处理中时 isStreaming 为 true', async () => {
    const { start, isStreaming } = useStreamData(defaultOptions)

    const startPromise = start('test')
    expect(isStreaming.value).toBe(true)

    // 清理
    await startPromise.catch(() => { })
  })

  it('应该正确调用 onStart 回调', async () => {
    const onStart = vi.fn()
    const { start } = useStreamData({
      ...defaultOptions,
      onStart,
    })

    const startPromise = start('test')
    await nextTick()

    expect(onStart).toHaveBeenCalled()

    // 清理
    await startPromise.catch(() => { })
  })

  it('应该支持字符串格式的 payload', async () => {
    const { start } = useStreamData({
      ...defaultOptions,
      paramKey: 'text',
    })

    const startPromise = start('test string')
    await nextTick()

    // 验证参数被正确格式化
    const { fetchEvent } = await import('../fetch-event-source')
    expect(fetchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { text: 'test string' },
      }),
    )

    // 清理
    await startPromise.catch(() => { })
  })

  it('应该支持对象格式的 payload', async () => {
    const { start } = useStreamData(defaultOptions)

    const payload = { content: 'test', userId: '123' }
    const startPromise = start(payload)
    await nextTick()

    const { fetchEvent } = await import('../fetch-event-source')
    expect(fetchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        data: payload,
      }),
    )

    // 清理
    await startPromise.catch(() => { })
  })

  it('应该支持 formatPayload 自定义格式化', async () => {
    const formatPayload = vi.fn((data: any) => ({ customField: data }))
    const { start } = useStreamData({
      ...defaultOptions,
      formatPayload,
    })

    const startPromise = start({ content: 'test' })
    await nextTick()

    expect(formatPayload).toHaveBeenCalledWith({ content: 'test' })

    // 清理
    await startPromise.catch(() => { })
  })

  it('应该在已经流处理时抛出错误', async () => {
    const { start, isStreaming } = useStreamData(defaultOptions)

    const promise1 = start('test1')
    expect(isStreaming.value).toBe(true)

    await expect(start('test2')).rejects.toThrow('Stream is already running')

    // 清理
    await promise1.catch(() => { })
  })

  it('应该支持 stop 停止流', async () => {
    const onCancel = vi.fn()
    const { start, stop, status } = useStreamData({
      ...defaultOptions,
      onCancel,
    })

    const startPromise = start('test')
    await nextTick()

    stop()
    await nextTick()

    expect(status.value).toBe('idle')
    expect(onCancel).toHaveBeenCalled()

    // 清理
    await startPromise.catch(() => { })
  })

  it('应该支持 reset 重置状态', async () => {
    const { start, reset, content, status, streamId, error } = useStreamData(defaultOptions)

    const startPromise = start('test')
    await nextTick()

    reset()
    await nextTick()

    expect(content.value).toBe('')
    expect(status.value).toBe('idle')
    expect(streamId.value).toBe('')
    expect(error.value).toBe(null)

    // 清理
    await startPromise.catch(() => { })
  })

  it('应该正确处理不同的 HTTP 方法', async () => {
    const { start } = useStreamData({
      ...defaultOptions,
      method: 'get',
    })

    const startPromise = start('test')
    await nextTick()

    const { fetchEvent } = await import('../fetch-event-source')
    expect(fetchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
      }),
    )

    // 清理
    await startPromise.catch(() => { })
  })

  it('应该支持自定义 headers', async () => {
    const customHeaders = { Authorization: 'Bearer token' }
    const { start } = useStreamData({
      ...defaultOptions,
      headers: customHeaders,
    })

    const startPromise = start('test')
    await nextTick()

    const { fetchEvent } = await import('../fetch-event-source')
    expect(fetchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: customHeaders,
      }),
    )

    // 清理
    await startPromise.catch(() => { })
  })

  it('每次 start 应该生成新的 streamId', async () => {
    const { start, streamId, reset } = useStreamData(defaultOptions)

    const promise1 = start('test1')
    await nextTick()
    const id1 = streamId.value

    reset()
    await nextTick()

    const promise2 = start('test2')
    await nextTick()
    const id2 = streamId.value

    expect(id1).not.toBe('')
    expect(id2).not.toBe('')
    expect(id1).not.toBe(id2)

    // 清理
    await promise1.catch(() => { })
    await promise2.catch(() => { })
  })

  it('应该支持 resetOnFinish 选项', () => {
    const { content } = useStreamData({
      ...defaultOptions,
      resetOnFinish: true,
    })

    expect(content.value).toBe('')
  })

  it('应该支持自定义 paramKey', async () => {
    const { start } = useStreamData({
      ...defaultOptions,
      paramKey: 'message',
    })

    const startPromise = start('test')
    await nextTick()

    const { fetchEvent } = await import('../fetch-event-source')
    expect(fetchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { message: 'test' },
      }),
    )

    // 清理
    await startPromise.catch(() => { })
  })
})
