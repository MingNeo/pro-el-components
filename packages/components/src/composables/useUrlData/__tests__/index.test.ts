/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { useUrlData } from '../index'

describe('useUrlData', () => {
  beforeEach(() => {
    // 重置 URL
    window.history.replaceState({}, '', window.location.pathname)
  })

  it('应该返回正确的属性和方法', () => {
    const { urlData, setUrlParam, resetUrlData, removeUrlParam, updateParams } = useUrlData()

    expect(urlData.value).toBeDefined()
    expect(typeof setUrlParam).toBe('function')
    expect(typeof resetUrlData).toBe('function')
    expect(typeof removeUrlParam).toBe('function')
    expect(typeof updateParams).toBe('function')
  })

  it('应该正确解析 URL 参数', () => {
    window.history.replaceState({}, '', '?name=test&age__num=25')

    const { urlData } = useUrlData()

    expect(urlData.value.name).toBe('test')
    expect(urlData.value.age).toBe(25)
  })

  it('应该支持默认值', () => {
    const defaults = { page: 1, pageSize: 10 }
    const { urlData } = useUrlData({ defaults })

    expect(urlData.value.page).toBe(1)
    expect(urlData.value.pageSize).toBe(10)
  })

  it('URL 参数应该覆盖默认值', () => {
    window.history.replaceState({}, '', '?page__num=2')

    const defaults = { page: 1, pageSize: 10 }
    const { urlData } = useUrlData({ defaults })

    expect(urlData.value.page).toBe(2)
    expect(urlData.value.pageSize).toBe(10)
  })

  it('应该正确设置单个 URL 参数', () => {
    const { urlData, setUrlParam } = useUrlData()

    setUrlParam('name', 'test')

    expect(urlData.value.name).toBe('test')
    expect(window.location.search).toContain('name=test')
  })

  it('应该正确处理数字类型', () => {
    const { setUrlParam } = useUrlData()

    setUrlParam('age', 25)

    expect(window.location.search).toContain('age__num=25')
  })

  it('应该正确处理数组类型', () => {
    const { setUrlParam } = useUrlData()

    setUrlParam('tags', ['vue', 'react', 'angular'])

    expect(window.location.search).toContain('tags__arr=vue,react,angular')
  })

  it('应该正确解析数组类型', () => {
    window.history.replaceState({}, '', '?tags__arr=vue,react,angular')

    const { urlData } = useUrlData()

    expect(urlData.value.tags).toEqual(['vue', 'react', 'angular'])
  })

  it('应该正确解析数字类型', () => {
    window.history.replaceState({}, '', '?count__num=100')

    const { urlData } = useUrlData()

    expect(urlData.value.count).toBe(100)
  })

  it('应该支持移除 URL 参数', () => {
    const { urlData, setUrlParam, removeUrlParam } = useUrlData()

    setUrlParam('name', 'test')
    expect(urlData.value.name).toBe('test')

    removeUrlParam('name')
    expect(urlData.value.name).toBeUndefined()
  })

  it('应该支持重置 URL 参数', () => {
    const defaults = { page: 1, pageSize: 10 }
    const { urlData, setUrlParam, resetUrlData } = useUrlData({ defaults })

    setUrlParam('page', 5)
    setUrlParam('keyword', 'test')

    expect(urlData.value.page).toBe(5)
    expect(urlData.value.keyword).toBe('test')

    resetUrlData()

    expect(urlData.value.page).toBe(1)
    expect(urlData.value.pageSize).toBe(10)
    expect(urlData.value.keyword).toBeUndefined()
  })

  it('应该支持批量更新参数', () => {
    const { urlData, updateParams } = useUrlData()

    updateParams({
      name: 'test',
      age: 25,
      tags: ['vue', 'react'],
    })

    expect(urlData.value.name).toBe('test')
    expect(urlData.value.age).toBe(25)
    expect(urlData.value.tags).toEqual(['vue', 'react'])
  })

  it('批量更新应该保留其他参数', () => {
    const { setUrlParam, updateParams, urlData } = useUrlData()

    setUrlParam('existing', 'value')
    updateParams({ new: 'param' })

    expect(urlData.value.existing).toBe('value')
    expect(urlData.value.new).toBe('param')
  })

  it('应该正确处理 undefined 和 null 值', () => {
    const { setUrlParam } = useUrlData()

    setUrlParam('key1', undefined)
    setUrlParam('key2', null)

    // undefined 和 null 不应该出现在 URL 中
    expect(window.location.search).not.toContain('key1')
    expect(window.location.search).not.toContain('key2')
  })

  it('应该正确处理字符串类型', () => {
    const { setUrlParam, urlData } = useUrlData()

    setUrlParam('name', 'test user')

    expect(urlData.value.name).toBe('test user')
  })

  it('应该正确处理空字符串', () => {
    const { setUrlParam, urlData } = useUrlData()

    setUrlParam('name', '')

    expect(urlData.value.name).toBe('')
  })

  it('应该正确处理布尔值', () => {
    const { setUrlParam, urlData } = useUrlData()

    setUrlParam('active', true)

    expect(urlData.value.active).toBe('true')
  })

  it('应该正确更新浏览器历史', () => {
    const { setUrlParam } = useUrlData()

    const initialLength = window.history.length

    setUrlParam('param', 'value')

    // pushState 会增加历史记录
    expect(window.location.search).toContain('param=value')
  })

  it('应该正确处理特殊字符', () => {
    const { setUrlParam, urlData } = useUrlData()

    setUrlParam('query', 'hello world & test')

    expect(urlData.value.query).toBe('hello world & test')
  })

  it('应该正确处理空数组', () => {
    const { setUrlParam, urlData } = useUrlData()

    setUrlParam('items', [])

    expect(urlData.value.items).toEqual([])
  })

  it('应该正确处理数字 0', () => {
    const { setUrlParam, urlData } = useUrlData()

    setUrlParam('count', 0)

    expect(urlData.value.count).toBe(0)
  })

  it('应该支持多次更新同一个参数', () => {
    const { setUrlParam, urlData } = useUrlData()

    setUrlParam('value', 1)
    expect(urlData.value.value).toBe(1)

    setUrlParam('value', 2)
    expect(urlData.value.value).toBe(2)

    setUrlParam('value', 3)
    expect(urlData.value.value).toBe(3)
  })

  it('空对象时不应该有查询参数', () => {
    const { urlData } = useUrlData()

    urlData.value = {}

    expect(window.location.search).toBe('')
  })
})

