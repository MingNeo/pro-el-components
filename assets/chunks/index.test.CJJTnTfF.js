const n=`/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSecondsCountdown } from '../index'

describe('useSecondsCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // 基础功能测试
  it('应该正确初始化倒计时', () => {
    const { current, isCounting, formattedTime } = useSecondsCountdown(60)

    expect(current.value).toBe(60)
    expect(isCounting.value).toBe(false)
    expect(formattedTime.value).toBe('60')
  })

  // 开始倒计时测试
  it('应该正确开始倒计时', () => {
    const { start, current, isCounting } = useSecondsCountdown(10)

    start()
    expect(isCounting.value).toBe(true)
    expect(current.value).toBe(10)
  })

  // 倒计时递减测试
  it('倒计时应该每秒递减', () => {
    const { start, current } = useSecondsCountdown(5)

    start()
    expect(current.value).toBe(5)

    vi.advanceTimersByTime(1000)
    expect(current.value).toBe(4)

    vi.advanceTimersByTime(1000)
    expect(current.value).toBe(3)

    vi.advanceTimersByTime(1000)
    expect(current.value).toBe(2)
  })

  // 倒计时结束测试
  it('倒计时到0时应该停止', () => {
    const { start, current, isCounting } = useSecondsCountdown(3)

    start()
    expect(isCounting.value).toBe(true)

    vi.advanceTimersByTime(3000)
    expect(current.value).toBe(0)
    expect(isCounting.value).toBe(false)
  })

  // 手动停止测试
  it('应该支持手动停止倒计时', () => {
    const { start, stop, current, isCounting } = useSecondsCountdown(10)

    start()
    expect(isCounting.value).toBe(true)
    expect(current.value).toBe(10)

    vi.advanceTimersByTime(3000)
    expect(current.value).toBe(7)

    stop()
    expect(isCounting.value).toBe(false)
    expect(current.value).toBe(0)
  })

  // 回调函数测试
  it('倒计时结束时应该调用回调函数', () => {
    const callback = vi.fn()
    const { start } = useSecondsCountdown(2, { callback })

    start()
    vi.advanceTimersByTime(2000)

    expect(callback).toHaveBeenCalled()
  })

  // 格式化时间测试
  it('应该正确格式化时间', () => {
    const { formattedTime, start } = useSecondsCountdown(65)

    expect(formattedTime.value).toBe('65')

    start()
    vi.advanceTimersByTime(10000)
    expect(formattedTime.value).toBe('55')
  })

  // 单数字补零测试
  it('应该为单数字补零', () => {
    const { formattedTime, start } = useSecondsCountdown(9)

    expect(formattedTime.value).toBe('09')

    start()
    vi.advanceTimersByTime(1000)
    expect(formattedTime.value).toBe('08')
  })

  // 重复开始测试
  it('应该支持重复开始倒计时', () => {
    const { start, current } = useSecondsCountdown(5, { duration: 10 })

    // 第一次开始
    start()
    vi.advanceTimersByTime(30)
    expect(current.value).toBe(2)

    // 第二次开始应该重置
    start()
    expect(current.value).toBe(5)
    vi.advanceTimersByTime(50)
    expect(current.value).toBe(0)
  })

  // 计时器清理测试
  it('停止时应该清理计时器', () => {
    const { start, stop, current } = useSecondsCountdown(10)

    start()
    vi.advanceTimersByTime(3000)
    expect(current.value).toBe(7)

    stop()
    expect(current.value).toBe(0)

    // 停止后继续计时不应该影响值
    vi.advanceTimersByTime(5000)
    expect(current.value).toBe(0)
  })

  // 值变化监听测试
  it('当值变为0时应该自动停止', () => {
    const { start, current, isCounting } = useSecondsCountdown(1)

    start()
    expect(isCounting.value).toBe(true)

    vi.advanceTimersByTime(1000)
    expect(current.value).toBe(0)
    expect(isCounting.value).toBe(false)

    // 继续计时不应该使值变为负数
    vi.advanceTimersByTime(2000)
    expect(current.value).toBe(0)
  })

  // 零秒倒计时测试
  // it('应该正确处理零秒倒计时', () => {
  //   const callback = vi.fn()
  //   const { start, current, isCounting } = useSecondsCountdown(0, { callback })

  //   start()
  //   expect(current.value).toBe(0)
  //   expect(isCounting.value).toBe(false)
  //   expect(callback).not.toHaveBeenCalled()
  // })

  // 大数倒计时测试
  it('应该支持大数值倒计时', () => {
    const { start, current, formattedTime } = useSecondsCountdown(999)

    start()
    expect(current.value).toBe(999)
    expect(formattedTime.value).toBe('999')

    vi.advanceTimersByTime(10000)
    expect(current.value).toBe(989)
  })

  // 快速连续操作测试
  it('应该正确处理快速连续的开始和停止', () => {
    const { start, stop, current } = useSecondsCountdown(10)

    start()
    stop()
    start()
    vi.advanceTimersByTime(2000)
    expect(current.value).toBe(8)

    stop()
    start()
    expect(current.value).toBe(10)
  })

  // 多个实例独立测试
  it('多个倒计时实例应该互不影响', () => {
    const countdown1 = useSecondsCountdown(5)
    const countdown2 = useSecondsCountdown(10)

    countdown1.start()
    countdown2.start()

    vi.advanceTimersByTime(3000)
    expect(countdown1.current.value).toBe(2)
    expect(countdown2.current.value).toBe(7)

    countdown1.stop()
    vi.advanceTimersByTime(2000)
    expect(countdown1.current.value).toBe(0)
    expect(countdown2.current.value).toBe(5)
  })

  // 回调多次调用测试
  it('多次完成倒计时应该多次调用回调', () => {
    const callback = vi.fn()
    const { start } = useSecondsCountdown(2, { callback })

    // 第一次倒计时
    start()
    vi.advanceTimersByTime(2000)
    expect(callback).toHaveBeenCalledTimes(1)

    // 第二次倒计时
    start()
    vi.advanceTimersByTime(2000)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  // 不同初始值测试
  it('应该支持不同的初始倒计时值', () => {
    const cases = [1, 5, 10, 30, 60, 120]

    cases.forEach((time) => {
      const { current } = useSecondsCountdown(time)
      expect(current.value).toBe(time)
    })
  })

  // 状态一致性测试
  it('倒计时状态应该保持一致', () => {
    const { start, stop, current, isCounting } = useSecondsCountdown(5)

    // 初始状态
    expect(current.value).toBe(5)
    expect(isCounting.value).toBe(false)

    // 开始后
    start()
    expect(current.value).toBe(5)
    expect(isCounting.value).toBe(true)

    // 倒计时中
    vi.advanceTimersByTime(2000)
    expect(current.value).toBe(3)
    expect(isCounting.value).toBe(true)

    // 停止后
    stop()
    expect(current.value).toBe(0)
    expect(isCounting.value).toBe(false)
  })
})
`;export{n as default};
