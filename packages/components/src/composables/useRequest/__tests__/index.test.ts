import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useRequest } from '../index'

describe('useRequest', () => {
  // 基础功能测试
  it('应该返回正确的响应式属性', () => {
    const mockFetch = vi.fn().mockResolvedValue({ data: 'test' })
    const { data, isLoading, isFinished, error, execute } = useRequest(mockFetch, { immediate: false })

    expect(data.value).toBeUndefined()
    expect(isLoading.value).toBe(false)
    expect(isFinished.value).toBe(false)
    expect(error.value).toBeUndefined()
    expect(typeof execute).toBe('function')
  })

  // 立即执行测试
  it('immediate 为 true 时应该立即执行请求', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ data: 'test' })
    const { isLoading } = useRequest(mockFetch, { immediate: true })

    expect(mockFetch).toHaveBeenCalled()
    // 初始应该是加载中
    expect(isLoading.value).toBe(true)

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(isLoading.value).toBe(false)
  })

  // 不立即执行测试
  it('immediate 为 false 时不应该立即执行请求', () => {
    const mockFetch = vi.fn().mockResolvedValue({ data: 'test' })
    useRequest(mockFetch, { immediate: false })

    expect(mockFetch).not.toHaveBeenCalled()
  })

  // 手动执行测试
  it('应该支持手动执行请求', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ data: 'test' })
    const { execute, data, isLoading, isFinished } = useRequest(mockFetch, { immediate: false })

    expect(mockFetch).not.toHaveBeenCalled()

    const promise = execute()
    expect(isLoading.value).toBe(true)
    expect(isFinished.value).toBe(false)

    await promise
    await nextTick()

    expect(mockFetch).toHaveBeenCalled()
    expect(data.value).toEqual({ data: 'test' })
    expect(isLoading.value).toBe(false)
    expect(isFinished.value).toBe(true)
  })

  // 传参执行测试
  it('应该支持传递参数执行请求', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ data: 'test' })
    const { execute } = useRequest(mockFetch, { immediate: false })

    await execute('param1', 'param2')

    expect(mockFetch).toHaveBeenCalledWith('param1', 'param2')
  })

  // 成功回调测试
  it('应该在请求成功时调用 onSuccess', async () => {
    const mockData = { data: 'test' }
    const mockFetch = vi.fn().mockResolvedValue(mockData)
    const onSuccess = vi.fn()

    const { execute } = useRequest(mockFetch, { immediate: false, onSuccess })

    await execute()

    expect(onSuccess).toHaveBeenCalledWith(mockData)
  })

  // 错误处理测试
  it('应该正确处理请求错误', async () => {
    const mockError = new Error('Request failed')
    const mockFetch = vi.fn().mockRejectedValue(mockError)
    const { execute, error, isLoading, isFinished } = useRequest(mockFetch, { immediate: false })

    try {
      await execute()
    }
    catch (e) {
      expect(e).toBe(mockError)
    }

    expect(error.value).toBe(mockError)
    expect(isLoading.value).toBe(false)
    expect(isFinished.value).toBe(true)
  })

  // 错误回调测试
  it('应该在请求失败时调用 onError', async () => {
    const mockError = new Error('Request failed')
    const mockFetch = vi.fn().mockRejectedValue(mockError)
    const onError = vi.fn()

    const { execute } = useRequest(mockFetch, { immediate: false, onError })

    try {
      await execute()
    }
    catch (e) {
      console.warn(e)
    }

    expect(onError).toHaveBeenCalledWith(mockError)
  })

  // 多次执行测试
  it('应该支持多次执行请求', async () => {
    let count = 0
    const mockFetch = vi.fn().mockImplementation(async () => {
      count++
      return { count }
    })

    const { execute, data } = useRequest(mockFetch, { immediate: false })

    await execute()
    expect(data.value).toEqual({ count: 1 })

    await execute()
    expect(data.value).toEqual({ count: 2 })

    await execute()
    expect(data.value).toEqual({ count: 3 })

    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  // loading 状态测试
  it('应该正确管理 loading 状态', async () => {
    const mockFetch = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: 'test' }), 100)))

    const { execute, isLoading, isFinished } = useRequest(mockFetch, { immediate: false })

    expect(isLoading.value).toBe(false)
    expect(isFinished.value).toBe(false)

    const promise = execute()
    expect(isLoading.value).toBe(true)
    expect(isFinished.value).toBe(false)

    await promise
    await nextTick()
    expect(isLoading.value).toBe(false)
    expect(isFinished.value).toBe(true)
  })

  // 清除错误测试
  it('每次执行前应该清除之前的错误', async () => {
    const mockError = new Error('First error')
    let shouldFail = true

    const mockFetch = vi.fn().mockImplementation(async () => {
      if (shouldFail) {
        throw mockError
      }
      return { data: 'success' }
    })

    const { execute, error, data } = useRequest(mockFetch, { immediate: false })

    // 第一次请求失败
    try {
      await execute()
    }
    catch (e) {
      console.warn(e)
    }
    expect(error.value).toBe(mockError)
    expect(data.value).toBeUndefined()

    // 第二次请求成功
    shouldFail = false
    await execute()
    expect(error.value).toBeUndefined()
    expect(data.value).toEqual({ data: 'success' })
  })

  // Promise 返回值测试
  it('execute 应该返回 Promise', async () => {
    const mockData = { data: 'test' }
    const mockFetch = vi.fn().mockResolvedValue(mockData)

    const { execute } = useRequest(mockFetch, { immediate: false })

    const result = await execute()
    expect(result).toEqual(mockData)
  })

  // Promise reject 测试
  it('execute 应该在失败时 reject Promise', async () => {
    const mockError = new Error('Request failed')
    const mockFetch = vi.fn().mockRejectedValue(mockError)

    const { execute } = useRequest(mockFetch, { immediate: false })

    await expect(execute()).rejects.toThrow('Request failed')
  })

  // 并发请求测试
  it('应该正确处理并发请求', async () => {
    let requestCount = 0
    const mockFetch = vi.fn().mockImplementation(async (delay: number) => {
      requestCount++
      await new Promise(resolve => setTimeout(resolve, delay))
      return { count: requestCount }
    })

    const { execute } = useRequest(mockFetch, { immediate: false })

    // 同时发起多个请求
    const promise1 = execute(50)
    const promise2 = execute(30)
    const promise3 = execute(10)

    const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3])

    // 请求应该都成功完成
    expect(result1.count).toBeDefined()
    expect(result2.count).toBeDefined()
    expect(result3.count).toBeDefined()
    expect(mockFetch).toHaveBeenCalledTimes(3)
  })

  // 类型推断测试
  it('应该正确推断数据类型', async () => {
    interface User {
      id: number
      name: string
    }

    const mockFetch = vi.fn().mockResolvedValue({ id: 1, name: 'Test User' })
    const { data, execute } = useRequest<User>(mockFetch, { immediate: false })

    await execute()

    // TypeScript 应该能正确推断 data 的类型
    expect(data.value?.id).toBe(1)
    expect(data.value?.name).toBe('Test User')
  })
})
