import { computed, ref } from 'vue'

interface UseUrlDataOptions {
  /** 默认的 URL 参数值 */
  defaults?: Record<string, any>
}

// 参数类型标识符
const TYPE_IDENTIFIERS = {
  ARRAY: '__arr',
  NUMBER: '__num',
} as const

/**
 * URL 参数管理 Hook
 *
 * @description 用于管理 URL 查询参数的 Vue Composable，支持自动类型转换、默认值和浏览器历史记录
 * @param options - 配置选项
 * @returns 返回 URL 参数管理相关的方法和响应式数据
 *
 * @example
 * ```ts
 * const { urlData, setUrlParam } = useUrlData({
 *   defaults: { page: 1, pageSize: 10 }
 * })
 *
 * // 读取参数
 * console.log(urlData.value.page)
 *
 * // 更新参数
 * setUrlParam('page', 2)
 * ```
 */
export function useUrlData(options: UseUrlDataOptions = {}) {
  const { defaults = {} } = options

  // 解析 URL 查询字符串
  function parseQueryString(queryString: string): Record<string, any> {
    if (!queryString)
      return {}
    const params = new URLSearchParams(queryString)
    const result: Record<string, any> = {}

    params.forEach((value, key) => {
      const { parsedKey, parsedValue } = parseQueryValue(key, value)
      result[parsedKey] = parsedValue
    })

    return result
  }

  // 转换查询参数
  function parseQueryValue(key: string, value: any): { parsedKey: string, parsedValue: any } {
    let parsedKey = key
    let parsedValue = value

    // 处理数组类型
    if (key.endsWith(TYPE_IDENTIFIERS.ARRAY)) {
      parsedKey = key.slice(0, -TYPE_IDENTIFIERS.ARRAY.length)
      parsedValue = value.split(',')
    }
    // 处理数字类型
    else if (key.endsWith(TYPE_IDENTIFIERS.NUMBER)) {
      parsedKey = key.slice(0, -TYPE_IDENTIFIERS.NUMBER.length)
      parsedValue = Number(value)
    }

    return { parsedKey, parsedValue }
  }

  // 序列化查询参数
  function stringifyQueryValue(key: string, value: any): { key: string, value: string } {
    let finalKey = key
    let finalValue = value

    // 处理数组类型
    if (Array.isArray(value)) {
      finalKey = `${key}${TYPE_IDENTIFIERS.ARRAY}`
      finalValue = value.join(',')
    }
    // 处理数字类型
    else if (typeof value === 'number') {
      finalKey = `${key}${TYPE_IDENTIFIERS.NUMBER}`
      finalValue = String(value)
    }

    return { key: finalKey, value: String(finalValue) }
  }

  // 构建查询字符串
  function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const { key: finalKey, value: finalValue } = stringifyQueryValue(key, value)
        searchParams.set(finalKey, finalValue)
      }
    })
    return searchParams.toString()
  }

  const currentUrlData = ref(parseQueryString(window.location.search.slice(1)))

  // 监听 URL 变化
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      currentUrlData.value = parseQueryString(window.location.search.slice(1))
    })
  }

  const urlData = computed({
    get() {
      return { ...defaults, ...currentUrlData.value }
    },
    set(newUrlData: Record<string, any>) {
      const queryString = buildQueryString(newUrlData)
      const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`
      window.history.pushState({}, '', newUrl)
      currentUrlData.value = newUrlData
    },
  })

  return {
    /** 响应式的 URL 参数对象 */
    urlData,
    /** 更新单个 URL 参数 */
    setUrlParam(key: string, value: any) {
      urlData.value = { ...urlData.value, [key]: value }
    },
    /** 重置 URL 参数到默认值 */
    resetUrlData() {
      urlData.value = { ...defaults }
    },
    /** 移除指定 URL 参数 */
    removeUrlParam(key: string) {
      const newUrlData = { ...urlData.value }
      delete newUrlData[key]
      urlData.value = newUrlData
    },
    /** 更新 URL 参数 */
    updateParams(params: Record<string, any>) {
      urlData.value = { ...urlData.value, ...params }
    },
  }
}

export type UseUrlDataReturn = ReturnType<typeof useUrlData>
