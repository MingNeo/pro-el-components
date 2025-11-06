/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePageStorage } from '../index'

// Mock window.location.pathname
Object.defineProperty(window, 'location', {
  value: {
    pathname: '_test-page',
  },
  writable: true,
})

describe('usePageStorage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('应该返回正确的属性和方法', () => {
    const { data, clear, save, load } = usePageStorage({ count: 0 })

    expect(data.value).toEqual({ count: 0 })
    expect(typeof clear).toBe('function')
    expect(typeof save).toBe('function')
    expect(typeof load).toBe('function')
  })

  it('应该使用初始值', () => {
    const initialValue = { name: 'test', count: 10 }
    const { data } = usePageStorage(initialValue)

    expect(data.value).toEqual(initialValue)
  })

  it('应该支持自定义存储键', () => {
    const { save } = usePageStorage({ value: 'test' }, { key: 'custom-key' })

    save({ value: 'saved' })

    const stored = sessionStorage.getItem('page_storage_custom-key')
    expect(stored).toBeDefined()
    expect(JSON.parse(stored!)).toEqual({ timestamp: expect.any(Number), data: { value: 'saved' } })
  })

  it('应该使用路由路径作为默认存储键', () => {
    const { save } = usePageStorage({ value: 'test' })

    save({ value: 'saved' })

    const stored = sessionStorage.getItem('page_storage__test-page')
    expect(stored).toBeDefined()
  })

  it('应该能保存数据到 sessionStorage', () => {
    const { save } = usePageStorage({ count: 0 })

    save({ count: 5 })

    const stored = sessionStorage.getItem('page_storage__test-page')
    expect(stored).toBeDefined()
    expect(JSON.parse(stored!)).toEqual({ timestamp: expect.any(Number), data: { count: 5 } })
  })

  it('应该能从 sessionStorage 加载数据', () => {
    const testData = { name: 'loaded', value: 100 }

    const { data, load } = usePageStorage({ name: '', value: 0 }, { immediate: false })

    sessionStorage.setItem('page_storage__test-page', JSON.stringify({ timestamp: expect.any(Number), data: testData }))
    expect(data.value).toEqual({ name: '', value: 0 })

    load()

    expect(data.value).toEqual(testData)
  })

  it('应该能清除存储的数据', () => {
    const { save, clear } = usePageStorage({ count: 0 })

    save({ count: 5 })
    expect(sessionStorage.getItem('page_storage__test-page')).toBeDefined()

    clear()
    expect(sessionStorage.getItem('page_storage__test-page')).toBeNull()
  })

  it('immediate 为 false 时不应该立即加载数据', () => {
    sessionStorage.setItem('page_storage__test-page', JSON.stringify({ count: 10 }))

    const { data } = usePageStorage({ count: 0 }, { immediate: false })

    expect(data.value).toEqual({ count: 0 })
  })

  it('应该处理 JSON 解析错误', () => {
    sessionStorage.setItem('page_storage__test-page', 'invalid json')

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { })

    const { load } = usePageStorage({ count: 0 })
    load()

    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it('应该支持深度嵌套的对象', () => {
    const complexData = {
      user: {
        name: 'test',
        settings: {
          theme: 'dark',
          notifications: true,
        },
      },
      list: [1, 2, 3],
    }

    const { save, load, data } = usePageStorage({}, { immediate: false })

    save(complexData)

    data.value = {} // 重置
    load()

    expect(data.value).toEqual(complexData)
  })

  it('应该支持不同类型的数据', () => {
    const testCases = [
      { input: { str: 'string' } },
      { input: { num: 123 } },
      { input: { bool: true } },
      { input: { arr: [1, 2, 3] } },
      { input: { obj: { nested: 'value' } } },
      { input: { nul: null } },
    ]

    testCases.forEach(({ input }) => {
      const { save, load, data } = usePageStorage({}, { immediate: false, key: `test-${Math.random()}` })

      save(input)
      data.value = {}
      load()

      expect(data.value).toEqual(input)
    })
  })

  it('存储键应该隔离不同页面的数据', () => {
    const data1 = { page: 'page1', value: 1 }
    const data2 = { page: 'page2', value: 2 }

    const { save: save1 } = usePageStorage({}, { key: 'page1' })
    const { save: save2 } = usePageStorage({}, { key: 'page2' })

    save1(data1)
    save2(data2)

    const stored1 = JSON.parse(sessionStorage.getItem('page_storage_page1')!)
    const stored2 = JSON.parse(sessionStorage.getItem('page_storage_page2')!)

    expect(stored1).toEqual({ timestamp: expect.any(Number), data: data1 })
    expect(stored2).toEqual({ timestamp: expect.any(Number), data: data2 })
  })

  it('数据为空时也应该正确存储', () => {
    const { save, load, data } = usePageStorage({ value: 'initial' }, { immediate: false })

    save({})
    data.value = { value: 'initial' }
    load()

    expect(data.value).toEqual({})
  })
})

