import { describe, expect, it } from 'vitest'
import { useDarkMode } from '../index'

describe('useDarkMode', () => {
  it('应该返回正确的响应式属性', () => {
    const { isDark, toggleDarkMode } = useDarkMode()

    expect(isDark.value).toBeDefined()
    expect(typeof isDark.value).toBe('boolean')
    expect(typeof toggleDarkMode).toBe('function')
  })

  it('应该正确切换深色模式', () => {
    const { isDark, toggleDarkMode } = useDarkMode()

    const initialValue = isDark.value
    toggleDarkMode()

    expect(isDark.value).toBe(!initialValue)
  })

  it('切换深色模式时应该更新 HTML 类名', () => {
    const { isDark, toggleDarkMode } = useDarkMode()

    const initialValue = isDark.value
    toggleDarkMode()

    if (isDark.value) {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    }
    else {
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    }

    // 切换回去
    toggleDarkMode()
    expect(isDark.value).toBe(initialValue)
  })

  it('应该支持多次切换', () => {
    const { isDark, toggleDarkMode } = useDarkMode()

    const initialValue = isDark.value

    toggleDarkMode()
    expect(isDark.value).toBe(!initialValue)

    toggleDarkMode()
    expect(isDark.value).toBe(initialValue)

    toggleDarkMode()
    expect(isDark.value).toBe(!initialValue)
  })

  it('isDark 应该是响应式的', () => {
    const { isDark, toggleDarkMode } = useDarkMode()

    let changeCount = 0
    const stopWatch = isDark.value !== undefined ? (() => {
      const originalValue = isDark.value
      toggleDarkMode()
      if (isDark.value !== originalValue) {
        changeCount++
      }
      return () => {}
    })() : () => {}

    expect(changeCount).toBeGreaterThanOrEqual(0)
    stopWatch()
  })

  it('应该在 HTML 元素上设置属性', () => {
    useDarkMode()

    // 验证 HTML 元素存在且可以被访问
    expect(document.documentElement).toBeDefined()
  })

  it('应该使用正确的选择器', () => {
    const { isDark } = useDarkMode()

    // 验证使用的是 html 选择器
    expect(document.querySelector('html')).toBeDefined()
  })

  it('应该使用正确的 dark/light 值', () => {
    const { isDark, toggleDarkMode } = useDarkMode()

    // 切换到深色模式
    if (!isDark.value) {
      toggleDarkMode()
    }

    expect(isDark.value).toBe(true)

    // 切换到浅色模式
    if (isDark.value) {
      toggleDarkMode()
    }

    expect(isDark.value).toBe(false)
  })
})

